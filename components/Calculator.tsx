"use client";

import React, { useState, useMemo, useEffect } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import RoleQuickFinder from "./RoleQuickFinder";
import MobileNetPayDock from "./MobileNetPayDock";
import AdPlaceholder from "./AdPlaceholder";

interface CalculatorProps {
  initialBand?: string;
  initialStepIndex?: number;
  initialHcasZone?: "inner-london" | "outer-london" | "fringe" | "standard";
  initialRoleTitle?: string;
  initialTaxCode?: "1257L" | "S1257L" | "C1257L" | "BR" | "D0";
}

export default function Calculator({
  initialBand = "Band 5",
  initialStepIndex = 1,
  initialHcasZone = "standard",
  initialRoleTitle,
  initialTaxCode = "1257L",
}: CalculatorProps) {
  const [band, setBand] = useState<string>(initialBand);
  const [stepIndex, setStepIndex] = useState<number>(initialStepIndex);
  const [hcasZone, setHcasZone] = useState<"inner-london" | "outer-london" | "fringe" | "standard">(initialHcasZone);
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [nightHours, setNightHours] = useState<number>(11.5);
  const [sundayHours, setSundayHours] = useState<number>(2.88);
  const [rotaPreset, setRotaPreset] = useState<"standard" | "acute" | "none">("standard");
  const [taxCode, setTaxCode] = useState<"1257L" | "S1257L" | "C1257L" | "BR" | "D0">(initialTaxCode);
  const [pensionOptedOut, setPensionOptedOut] = useState<boolean>(false);
  const [studentLoan, setStudentLoan] = useState<"none" | "plan1" | "plan2" | "plan4" | "plan5" | "postgrad">("plan2");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Keep state in sync if parent props change
  useEffect(() => {
    if (initialBand) setBand(initialBand);
    if (typeof initialStepIndex === "number") setStepIndex(initialStepIndex);
    if (initialHcasZone) setHcasZone(initialHcasZone);
    if (initialTaxCode) setTaxCode(initialTaxCode);
  }, [initialBand, initialStepIndex, initialHcasZone, initialTaxCode]);

  // Support external triggers (e.g. quick select chips)
  useEffect(() => {
    const handleCustomSelect = (e: Event) => {
      const customEvt = e as CustomEvent<{ band: string; stepIndex?: number }>;
      if (customEvt.detail?.band) {
        setBand(customEvt.detail.band);
        setStepIndex(customEvt.detail.stepIndex ?? 0);
        showToast(`Loaded ${customEvt.detail.band}`);
      }
    };
    window.addEventListener("nhs-select-band", handleCustomSelect);
    return () => window.removeEventListener("nhs-select-band", handleCustomSelect);
  }, []);

  const currentBandData = useMemo(() => {
    return nhsData.bands.find((b) => b.band === band) || nhsData.bands[3];
  }, [band]);

  const handleSelectBand = (newBand: string) => {
    setBand(newBand);
    const targetData = nhsData.bands.find((b) => b.band === newBand);
    if (targetData && stepIndex >= targetData.points.length) {
      setStepIndex(0);
    }
  };

  const inputs: CalculatorInputs = useMemo(
    () => ({
      band,
      stepIndex,
      hcasZone,
      contractedHours,
      nightHoursPerWeek: nightHours,
      sundayHoursPerWeek: sundayHours,
      pensionOptedOut,
      taxCode,
      isScottishTax: taxCode === "S1257L",
      studentLoan,
    }),
    [band, stepIndex, hcasZone, contractedHours, nightHours, sundayHours, pensionOptedOut, taxCode, studentLoan]
  );

  const result = useMemo(() => calculateNHSPay(inputs), [inputs]);

  // Net shift cash yield calculation
  const baselineWithoutUnsocial = useMemo(() => {
    if (nightHours === 0 && sundayHours === 0) return null;
    return calculateNHSPay({
      ...inputs,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
    });
  }, [inputs, nightHours, sundayHours]);

  const netUnsocialGainMonthly = baselineWithoutUnsocial
    ? Math.max(0, result.netPay.monthly - baselineWithoutUnsocial.netPay.monthly)
    : 0;

  const bandList = [
    { label: "B2", full: "Band 2" },
    { label: "B3", full: "Band 3" },
    { label: "B4", full: "Band 4" },
    { label: "Band 5", full: "Band 5" },
    { label: "B6", full: "Band 6" },
    { label: "B7", full: "Band 7" },
    { label: "B8A", full: "Band 8a" },
    { label: "B8B", full: "Band 8b" },
    { label: "B8C", full: "Band 8c" },
    { label: "B8D", full: "Band 8d" },
    { label: "B9", full: "Band 9" },
  ];

  const handleRotaPreset = (preset: "standard" | "acute" | "none") => {
    setRotaPreset(preset);
    if (preset === "standard") {
      setNightHours(11.5);
      setSundayHours(2.88);
    } else if (preset === "acute") {
      setNightHours(23);
      setSundayHours(5.75);
    } else {
      setNightHours(0);
      setSundayHours(0);
    }
  };

  // WhatsApp & Social Share Message
  const shareText = useMemo(() => {
    const siteUrl = typeof window !== "undefined" ? window.location.href : "https://netpayscale.uk";
    return `NHS ${result.bandTitle} (${result.stepTitle}) Pay Breakdown (2026/27):
• Take-Home (Net): ${formatCurrency(result.netPay.monthly)}/month (${formatCurrency(result.netPay.annual)}/year)
• Basic Gross Salary: ${formatCurrency(result.grossPay.annual)}
• NHS Pension (${result.pensionTierLabel}): -${formatCurrency(result.pensionContribution.monthly)}/mo
• PAYE Income Tax: -${formatCurrency(result.incomeTax.monthly)}/mo
• National Insurance: -${formatCurrency(result.nationalInsurance.monthly)}/mo
• Net Retention: ${result.takeHomePercentage}% kept in pocket
Calculate yours at: ${siteUrl}`;
  }, [result]);

  const whatsappShareUrl = useMemo(() => {
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  }, [shareText]);

  const handleShareClick = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
    showToast("Opening WhatsApp with your salary breakdown...");
  };

  const copyFigures = () => {
    const text = `Gross: ${formatCurrency(result.grossPay.annual)} | Net Monthly: ${formatCurrency(result.netPay.monthly)} | PAYE Tax: -${formatCurrency(result.incomeTax.monthly)} | NI: -${formatCurrency(result.nationalInsurance.monthly)} | NHS Pension: -${formatCurrency(result.pensionContribution.monthly)}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast("All figures copied to clipboard!");
    });
  };

  const printPayslip = () => {
    showToast("Preparing printable ESR Payslip...");
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Distribution bar percentages
  const grossMonthly = Math.max(1, result.grossPay.monthly);
  const netPct = Math.min(100, Math.max(0, (result.netPay.monthly / grossMonthly) * 100));
  const pensionPct = Math.min(100, Math.max(0, (result.pensionContribution.monthly / grossMonthly) * 100));
  const taxPct = Math.min(100, Math.max(0, (result.incomeTax.monthly / grossMonthly) * 100));
  const niPct = Math.min(100, Math.max(0, (result.nationalInsurance.monthly / grossMonthly) * 100));
  const loanPct = Math.min(100, Math.max(0, (result.studentLoanDeduction.monthly / grossMonthly) * 100));

  return (
    <div className="w-full relative">
      {/* Ambient Copied Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 toast-enter">
          <div className="bg-text-ink text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 border border-zinc-700 text-xs sm:text-sm font-medium">
            <span className="w-5 h-5 rounded-full bg-cash-emerald text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[14px] font-bold">check</span>
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 12-Column Main Workstation Layout matching Google Stitch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (lg:col-span-7 ~58% width): Interactive Precision Controls */}
        <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 w-full">
          {/* Smart Job Title Quick-Finder */}
          <RoleQuickFinder
            currentBand={band}
            onSelectRole={(selectedBand, selectedStep) => {
              handleSelectBand(selectedBand);
              if (typeof selectedStep === "number") {
                setStepIndex(selectedStep);
              }
            }}
          />

          {/* a. Pay Band Selector (Mobile Touch Friendly & Wrap Ready) */}
          <div className="bg-surface-card border border-border-subtle hover:border-zinc-300 rounded-xl p-4 sm:p-5 shadow-2xs transition-all duration-200">
            <div className="flex items-center justify-between mb-3 gap-2">
              <label className="text-sm font-bold text-text-ink flex items-center gap-2">
                <span className="material-symbols-outlined text-nhs-blue text-[20px]">badge</span>
                Agenda for Change (AfC) Pay Band
              </label>
              <span className="text-[10px] text-text-muted uppercase font-medium shrink-0">
                England &amp; Wales 2026/27 (+3.3%)
              </span>
            </div>

            {/* Horizontal scroll container on mobile, flexible wrap grid on md+ */}
            <div className="p-1 bg-zinc-100/90 rounded-xl flex overflow-x-auto no-scrollbar md:flex-wrap md:grid md:grid-cols-11 gap-1 touch-pan-x">
              {bandList.map((item) => {
                const isSelected = item.full === band;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelectBand(item.full)}
                    className={`min-h-[44px] md:min-h-[36px] px-3.5 py-2 rounded-lg text-xs font-semibold active:scale-[0.95] transition-all duration-150 shrink-0 flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? "bg-text-ink text-white shadow-sm font-bold scale-105"
                        : "text-text-muted hover:text-text-ink hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* b. Experience Progression Milestones: Responsive 3 cards */}
          <div className="bg-surface-card border border-border-subtle hover:border-zinc-300 rounded-xl p-4 sm:p-5 shadow-2xs transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
              <span className="text-sm font-bold text-text-ink flex items-center gap-2">
                <span className="material-symbols-outlined text-nhs-blue text-[20px]">timeline</span>
                Experience Progression Milestone
              </span>
              <span className="text-xs text-text-muted">Annex 2 Incremental Pay Scale</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentBandData.points.map((pt, idx) => {
                const isSelected = stepIndex === idx;
                const stepLabel =
                  idx === 0
                    ? "Entry Step"
                    : idx === currentBandData.points.length - 1
                    ? "Top of Band"
                    : "Intermediate";
                const yearsLabel =
                  idx === 0
                    ? "< 2 Years in Band"
                    : idx === currentBandData.points.length - 1
                    ? "4+ Years in Band"
                    : "2 – 4 Years in Band";

                return (
                  <button
                    key={pt.step}
                    type="button"
                    onClick={() => setStepIndex(idx)}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-200 active:scale-[0.97] flex flex-col justify-between min-h-[96px] cursor-pointer ${
                      isSelected
                        ? "border-border-strong bg-text-ink text-white shadow-md scale-[1.01]"
                        : "border-border-subtle bg-white text-text-body hover:border-zinc-400 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${isSelected ? "text-zinc-300" : "text-text-muted"}`}>
                        {stepLabel}
                      </span>
                      <span className={`material-symbols-outlined text-[18px] text-cash-emerald transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                        check_circle
                      </span>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">{yearsLabel}</p>
                      <p className="text-sm font-mono font-bold mt-0.5 tabular-nums">
                        {formatCurrency(pt.annualSalary)}{" "}
                        <span className="font-normal text-xs opacity-70">/ yr</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* c. Contracted Hours & FTE Precision Slider (Touch Stepper) */}
          <div className="bg-surface-card border border-border-subtle hover:border-zinc-300 rounded-xl p-4 sm:p-5 shadow-2xs transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-sm font-bold text-text-ink flex items-center gap-2">
                  <span className="material-symbols-outlined text-nhs-blue text-[20px]">schedule</span>
                  Contracted Working Hours
                </span>
                <p className="text-xs text-text-muted mt-0.5">
                  Standard NHS baseline is 37.5 hrs/wk (1.0 FTE)
                </p>
              </div>

              {/* Touch Steppers + Display */}
              <div className="flex items-center justify-between sm:justify-end gap-2 bg-surface-muted p-1 rounded-xl border border-border-subtle w-full sm:w-auto">
                <button
                  type="button"
                  aria-label="Decrease hours"
                  onClick={() => setContractedHours((prev) => Math.max(7.5, Math.round((prev - 1.5) * 10) / 10))}
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-zinc-100 flex items-center justify-center font-bold text-text-ink shadow-2xs active:scale-[0.92] transition-all duration-150 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-[18px]">remove</span>
                </button>
                <span className="font-mono text-xs sm:text-sm px-2 text-text-ink font-semibold whitespace-nowrap text-center select-none tabular-nums">
                  {contractedHours.toFixed(1)} hrs/wk ({(contractedHours / 37.5).toFixed(2)} FTE)
                </span>
                <button
                  type="button"
                  aria-label="Increase hours"
                  onClick={() => setContractedHours((prev) => Math.min(48, Math.round((prev + 1.5) * 10) / 10))}
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-zinc-100 flex items-center justify-center font-bold text-text-ink shadow-2xs active:scale-[0.92] transition-all duration-150 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-[18px]">add</span>
                </button>
              </div>
            </div>

            {/* Precision Slider */}
            <div className="py-2">
              <input
                type="range"
                min="7.5"
                max="48"
                step="0.5"
                value={contractedHours}
                onChange={(e) => setContractedHours(parseFloat(e.target.value) || 37.5)}
                className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-nhs-blue transition-all"
              />
            </div>

            {/* Quick Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { label: "37.5h (1.0 FTE)", val: 37.5 },
                { label: "30.0h (0.8 FTE)", val: 30.0 },
                { label: "22.5h (0.6 FTE)", val: 22.5 },
                { label: "Bank (15h)", val: 15.0 },
              ].map((p) => {
                const isActive = Math.abs(contractedHours - p.val) < 0.1;
                return (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setContractedHours(p.val)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-150 text-center active:scale-[0.96] cursor-pointer ${
                      isActive
                        ? "bg-nhs-blue text-white font-semibold shadow-xs"
                        : "bg-surface-muted hover:bg-zinc-200 text-text-body"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* d. High Cost Area Supplement (HCAS) London Weighting: 3 cards */}
          <div className="bg-surface-card border border-border-subtle hover:border-zinc-300 rounded-xl p-4 sm:p-5 shadow-2xs transition-all duration-200">
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-sm font-bold text-text-ink flex items-center gap-2">
                <span className="material-symbols-outlined text-nhs-blue text-[20px]">location_on</span>
                HCAS London Weighting
              </span>
              <span className="text-[10px] text-text-muted uppercase font-medium shrink-0">Section 4 AfC</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "standard", name: "Rest of England", desc: "National Baseline (0%)", val: "£0 / yr" },
                { id: "outer-london", name: "Outer London", desc: "+15% Basic Salary", val: "min £4,313 – £5,436" },
                { id: "inner-london", name: "Inner London", desc: "+20% Basic Salary", val: "min £5,115 – £8,034" },
              ].map((z) => {
                const isSelected = hcasZone === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setHcasZone(z.id as any)}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-200 active:scale-[0.97] flex flex-col justify-between min-h-[90px] cursor-pointer ${
                      isSelected
                        ? "border-border-strong bg-text-ink text-white shadow-md"
                        : "border-border-subtle bg-white text-text-body hover:border-zinc-400 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-sm font-bold">{z.name}</span>
                      <span className={`w-2.5 h-2.5 rounded-full bg-cash-emerald transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
                    </div>
                    <p className="text-xs opacity-80">{z.desc}</p>
                    <p className="text-xs font-mono font-semibold mt-2">{z.val}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* e. Unsocial Hours (Section 2 AFC Enhancements) */}
          <div className="bg-surface-card border border-border-subtle hover:border-zinc-300 rounded-xl p-4 sm:p-5 shadow-2xs transition-all duration-200">
            <div className="flex items-center justify-between mb-3 gap-2">
              <div>
                <span className="text-sm font-bold text-text-ink flex items-center gap-2">
                  <span className="material-symbols-outlined text-nhs-blue text-[20px]">nightlight</span>
                  Unsocial Hours &amp; Shift Enhancements
                </span>
                <p className="text-xs text-text-muted mt-0.5">
                  Nights &amp; Sats +30% | Suns &amp; Bank Hols +60%
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-muted text-[10px] text-text-muted font-bold shrink-0">
                SECTION 2
              </span>
            </div>

            {/* Rota Presets */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleRotaPreset("standard")}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.96] shadow-xs cursor-pointer ${
                  rotaPreset === "standard"
                    ? "bg-nhs-blue text-white"
                    : "bg-surface-muted text-text-body hover:bg-zinc-200"
                }`}
              >
                Standard Ward Rota (3x Nights, 2x W/E)
              </button>
              <button
                type="button"
                onClick={() => handleRotaPreset("acute")}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.96] cursor-pointer ${
                  rotaPreset === "acute"
                    ? "bg-nhs-blue text-white shadow-xs"
                    : "bg-surface-muted text-text-body hover:bg-zinc-200"
                }`}
              >
                High Intensity Acute (ITU / A&amp;E)
              </button>
              <button
                type="button"
                onClick={() => handleRotaPreset("none")}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.96] cursor-pointer ${
                  rotaPreset === "none"
                    ? "bg-nhs-blue text-white shadow-xs"
                    : "bg-surface-muted text-text-body hover:bg-zinc-200"
                }`}
              >
                No Enhancements (Mon-Fri 9-5)
              </button>
            </div>

            {/* Net Shift Cash Yield Callout */}
            <div className="rounded-xl p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 transition-all duration-200 hover:shadow-xs">
              <span className="material-symbols-outlined text-cash-emerald text-[22px] sm:text-[24px] shrink-0 mt-0.5">
                account_balance_wallet
              </span>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-emerald-950">
                  Net Shift Cash Yield: Real In-Pocket Value
                </span>
                <p className="text-xs sm:text-sm mt-0.5 text-emerald-900 leading-snug">
                  <strong className="font-mono font-bold text-cash-emerald">
                    +{formatCurrency(netUnsocialGainMonthly, true)} / mo
                  </strong>{" "}
                  directly into your account after PAYE Tax, National Insurance, and {result.pensionTierLabel} CARE Pension deductions.
                </p>
              </div>
            </div>
          </div>

          {/* f. Advanced Tax & Pension Settings Accordion */}
          <details className="group bg-surface-card border border-border-subtle hover:border-zinc-300 rounded-xl p-4 sm:p-5 shadow-2xs transition-all duration-200">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none py-0.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-nhs-blue text-[20px] transition-transform duration-200 group-open:scale-110">
                  tune
                </span>
                <span className="text-sm font-bold text-text-ink">
                  Advanced Statutory Tax &amp; Pension Configuration
                </span>
              </div>
              <span className="material-symbols-outlined text-text-muted transition-transform duration-300 group-open:rotate-180">
                expand_more
              </span>
            </summary>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-3 border-t border-border-subtle">
              {/* Tax Code */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-muted uppercase font-semibold">HMRC Tax Code</label>
                <input
                  type="text"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value as any)}
                  className="w-full h-10 px-3 bg-surface-muted border border-border-subtle rounded-lg font-mono text-sm text-text-ink font-semibold focus:outline-none focus:border-nhs-blue focus:ring-1 focus:ring-nhs-blue transition-all"
                />
                <span className="text-[10px] text-text-muted">Standard £12,570 Allowance</span>
              </div>

              {/* NHS Pension Toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-muted uppercase font-semibold">NHS Pension (2015)</label>
                <select
                  value={pensionOptedOut ? "opt-out" : "enrolled"}
                  onChange={(e) => setPensionOptedOut(e.target.value === "opt-out")}
                  className="w-full h-10 px-2 bg-surface-muted border border-border-subtle rounded-lg text-xs text-text-ink font-semibold focus:outline-none focus:border-nhs-blue transition-all cursor-pointer"
                >
                  <option value="enrolled">{result.pensionTierLabel} CARE Scheme</option>
                  <option value="opt-out">Opted Out (0% - Not Advised)</option>
                </select>
                <span className="text-[10px] text-text-muted">Deducted pre-tax</span>
              </div>

              {/* Student Loan */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-text-muted uppercase font-semibold">Student Loan Repayment</label>
                <select
                  value={studentLoan}
                  onChange={(e) => setStudentLoan(e.target.value as any)}
                  className="w-full h-10 px-2 bg-surface-muted border border-border-subtle rounded-lg text-xs text-text-ink font-semibold focus:outline-none focus:border-nhs-blue transition-all cursor-pointer"
                >
                  <option value="plan2">Plan 2 (£27,295 @ 9%)</option>
                  <option value="plan1">Plan 1 (£24,990 @ 9%)</option>
                  <option value="plan4">Plan 4 Scotland (£31,395 @ 9%)</option>
                  <option value="plan5">Plan 5 (£25,000 @ 9%)</option>
                  <option value="postgrad">Postgraduate (£21,000 @ 6%)</option>
                  <option value="none">None / Fully Repaid</option>
                </select>
                <span className="text-[10px] text-text-muted">Post-2012 Undergraduate</span>
              </div>
            </div>
          </details>
        </div>

        {/* Right Column (lg:col-span-5 ~42% width): Sticky Real-Time Ledger */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 flex flex-col gap-4 sm:gap-5 w-full">
          {/* Sticky Net Take-Home Pay Hero Card */}
          <div className="bg-surface-card border border-border-strong rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cash-emerald pulse-glow-dot" />
                <span className="text-sm font-bold text-text-ink">Estimated Take-Home Pay</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-muted text-[11px] text-text-muted font-mono font-medium shrink-0 border border-border-subtle">
                Pay Date: 28th
              </span>
            </div>

            {/* Hero Number */}
            <div className="py-4 flex flex-col">
              <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
                Net Monthly In-Bank
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl lg:text-5xl text-cash-emerald font-extrabold tracking-tight font-mono tabular-nums truncate transition-all">
                  {formatCurrency(result.netPay.monthly)}
                </span>
                <span className="text-sm text-text-muted shrink-0 font-medium">/ mo</span>
              </div>

              {/* Secondary Figures */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-text-body font-mono">
                <span className="flex items-center gap-1">
                  <span className="text-text-muted">Annual:</span>
                  <strong className="font-semibold tabular-nums">
                    {formatCurrency(result.netPay.annual)} / yr
                  </strong>
                </span>
                <span className="text-zinc-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-text-muted">Hourly:</span>
                  <strong className="font-semibold tabular-nums">
                    {formatHourlyRate(result.netHourlyRate)}
                  </strong>
                </span>
              </div>
            </div>

            {/* Key Deductions Headline Strip */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3 bg-surface-muted rounded-xl mb-4 border border-border-subtle">
              <div>
                <span className="text-[10px] uppercase text-text-muted font-semibold">Gross AfC Salary</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-text-ink mt-0.5 truncate tabular-nums">
                  {formatCurrency(result.grossPay.annual)}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-text-muted font-semibold">Total Deductions</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-tax-rose mt-0.5 truncate tabular-nums">
                  −{formatCurrency(result.totalDeductions.monthly)} / mo
                </p>
              </div>
            </div>

            {/* Proportional Distribution Bar */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Proportional Distribution</span>
                <span className="font-semibold text-cash-emerald font-mono">
                  {result.takeHomePercentage}% kept in pocket
                </span>
              </div>

              <div className="h-3 w-full bg-surface-muted rounded-full overflow-hidden flex shadow-2xs">
                <div
                  className="h-full bg-cash-emerald transition-all duration-500 ease-out"
                  style={{ width: `${netPct}%` }}
                  title="Net Take-Home Pay"
                />
                <div
                  className="h-full bg-pension-indigo transition-all duration-500 ease-out"
                  style={{ width: `${pensionPct}%` }}
                  title="NHS Pension"
                />
                <div
                  className="h-full bg-tax-rose transition-all duration-500 ease-out"
                  style={{ width: `${taxPct}%` }}
                  title="Income Tax"
                />
                <div
                  className="h-full bg-ni-amber transition-all duration-500 ease-out"
                  style={{ width: `${niPct}%` }}
                  title="National Insurance"
                />
                {loanPct > 0 && (
                  <div
                    className="h-full bg-loan-pink transition-all duration-500 ease-out"
                    style={{ width: `${loanPct}%` }}
                    title="Student Loan"
                  />
                )}
              </div>

              {/* Color-Coded Detailed Breakdown Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border-subtle">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-text-body">
                    <span className="w-2 h-2 rounded-full bg-cash-emerald shrink-0" />
                    Take-Home Pay
                  </span>
                  <span className="font-mono font-semibold text-text-ink tabular-nums">
                    {formatCurrency(result.netPay.monthly)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-text-body">
                    <span className="w-2 h-2 rounded-full bg-pension-indigo shrink-0" />
                    NHS Pension ({result.pensionTierLabel})
                  </span>
                  <span className="font-mono font-semibold text-text-ink tabular-nums">
                    −{formatCurrency(result.pensionContribution.monthly)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-text-body">
                    <span className="w-2 h-2 rounded-full bg-tax-rose shrink-0" />
                    PAYE Income Tax
                  </span>
                  <span className="font-mono font-semibold text-text-ink tabular-nums">
                    −{formatCurrency(result.incomeTax.monthly)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-text-body">
                    <span className="w-2 h-2 rounded-full bg-ni-amber shrink-0" />
                    National Insurance
                  </span>
                  <span className="font-mono font-semibold text-text-ink tabular-nums">
                    −{formatCurrency(result.nationalInsurance.monthly)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleShareClick}
                className="w-full min-h-[44px] px-4 bg-text-ink hover:bg-black text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-150 shadow-xs cursor-pointer select-none"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Share WhatsApp / SMS Summary
              </a>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copyFigures}
                  className="min-h-[40px] px-3 bg-surface-muted hover:bg-zinc-200 text-text-ink border border-border-subtle rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all duration-150 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Copy Figures
                </button>
                <button
                  type="button"
                  onClick={printPayslip}
                  className="min-h-[40px] px-3 bg-surface-muted hover:bg-zinc-200 text-text-ink border border-border-subtle rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all duration-150 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  Download 1-Page PDF
                </button>
              </div>
            </div>
          </div>

          {/* Trust & Compliance Micro Badge */}
          <div className="p-3 bg-surface-muted rounded-xl flex items-center gap-2.5 border border-border-subtle">
            <span className="material-symbols-outlined text-nhs-blue text-[18px] shrink-0">shield</span>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Statutory model synchronised with 2026/27 NHS Pension Tier Threshold updates &amp; Autumn Statement NIC rates.
            </p>
          </div>

          {/* High-Viewability Sticky Right-Rail Companion Ad Slot (300x250 MPU) */}
          <AdPlaceholder
            slotId="calculator-sticky-rail"
            format="rectangle"
            label="300×250 Sticky Right-Rail Companion"
          />
        </div>
      </div>

      {/* Mobile Floating Bottom Dock */}
      <MobileNetPayDock
        result={result}
        timeframe="monthly"
        setTimeframe={() => {}}
      />
    </div>
  );
}
