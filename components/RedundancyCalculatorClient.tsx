"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { AlertCircle } from "lucide-react";

type HcasZone = CalculatorInputs["hcasZone"];

export function RedundancyCalculatorClient() {
  const [selectedBand, setSelectedBand] = useState<string>("Band 6");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [yearsService, setYearsService] = useState<number>(8);
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [hcasZone, setHcasZone] = useState<HcasZone>("standard");
  const [schemeType, setSchemeType] = useState<"section16" | "mars">("section16");
  const [isScottishTax, setIsScottishTax] = useState<boolean>(false);

  const bandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === selectedBand) || nhsData.bands[4],
    [selectedBand]
  );

  const safeStepIndex = Math.min(stepIndex, bandObj.points.length - 1);

  const calc = useMemo(() => {
    const fte = contractedHours / 37.5;
    const basePay = calculateNHSPay({
      band: selectedBand,
      stepIndex: safeStepIndex,
      hcasZone,
      contractedHours: 37.5,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax,
      studentLoan: "none",
    });

    const wteReckonableSalary = basePay.pensionablePay.annual;
    const actualAnnualSalary = wteReckonableSalary * fte;

    const cappedWteSalary = Math.min(80000, Math.max(23000, wteReckonableSalary));
    const cappedReckonableAnnual = cappedWteSalary * fte;
    const reckonableMonthlyPay = cappedReckonableAnnual / 12;

    const completeYears = Math.max(1, Math.min(35, Math.floor(yearsService)));
    const qualifyingYearsSec16 = completeYears < 2 ? 0 : Math.min(24, completeYears);

    const section16Gross = Math.min(
      160000 * fte,
      qualifyingYearsSec16 * reckonableMonthlyPay
    );

    const marsMonths = Math.min(12, completeYears * 0.5);
    const marsGross = Math.min(80000 * fte, marsMonths * reckonableMonthlyPay);

    const activeGrossPayout =
      schemeType === "section16" ? section16Gross : marsGross;

    const taxFreeSlice = Math.min(30000, activeGrossPayout);
    const taxableSeveranceSlice = Math.max(0, activeGrossPayout - 30000);

    const calcAnnualIncomeTax = (taxableIncome: number, scotland: boolean) => {
      if (taxableIncome <= 0) return 0;
      let pa = 12570;
      if (taxableIncome > 100000) {
        pa = Math.max(0, pa - Math.floor((taxableIncome - 100000) / 2));
      }
      const netTaxable = Math.max(0, taxableIncome - pa);
      if (!scotland) {
        const b1 = Math.min(netTaxable, 37700);
        const b2 = Math.max(0, Math.min(netTaxable - 37700, 125140 - 50270));
        const b3 = Math.max(0, netTaxable - (125140 - 12570));
        return b1 * 0.2 + b2 * 0.4 + b3 * 0.45;
      } else {
        const sBands = [
          { width: 2306, rate: 0.19 },
          { width: 11685, rate: 0.20 },
          { width: 17101, rate: 0.21 },
          { width: 31338, rate: 0.42 },
          { width: 50140, rate: 0.45 },
          { width: Infinity, rate: 0.48 },
        ];
        let rem = netTaxable;
        let t = 0;
        for (const sb of sBands) {
          if (rem <= 0) break;
          const sl = Math.min(rem, sb.width);
          t += sl * sb.rate;
          rem -= sl;
        }
        return t;
      }
    };

    const baseTaxableAnnual =
      actualAnnualSalary * (1 - basePay.pensionRate);
    const taxBeforeSeverance = calcAnnualIncomeTax(
      baseTaxableAnnual,
      isScottishTax
    );
    const taxAfterSeverance = calcAnnualIncomeTax(
      baseTaxableAnnual + taxableSeveranceSlice,
      isScottishTax
    );
    const severanceTaxDeduction = Math.max(
      0,
      taxAfterSeverance - taxBeforeSeverance
    );

    const netPayoutKept = Math.max(
      0,
      activeGrossPayout - severanceTaxDeduction
    );

    const isCappedAt80k = wteReckonableSalary > 80000;
    const monthsEquivalent =
      schemeType === "section16" ? qualifyingYearsSec16 : marsMonths;

    const normalMonthlyNet = basePay.netPay.monthly * fte;

    return {
      fte,
      wteReckonableSalary,
      actualAnnualSalary,
      cappedReckonableAnnual,
      reckonableMonthlyPay,
      qualifyingYearsSec16,
      section16Gross,
      marsGross,
      activeGrossPayout,
      taxFreeSlice,
      taxableSeveranceSlice,
      severanceTaxDeduction,
      netPayoutKept,
      isCappedAt80k,
      monthsEquivalent,
      normalMonthlyNet,
      monthsOfLivingExpenses:
        normalMonthlyNet > 0
          ? +(netPayoutKept / normalMonthlyNet).toFixed(1)
          : 0,
    };
  }, [
    selectedBand,
    safeStepIndex,
    yearsService,
    contractedHours,
    hcasZone,
    schemeType,
    isScottishTax,
  ]);

  const shareText = `🛡️ My 2026/27 NHS ${schemeType === "section16" ? "Section 16 Redundancy" : "MARS Severance"} Estimate (${selectedBand}, ${yearsService} yrs):
• Gross Entitlement: ${formatCurrency(calc.activeGrossPayout)}
• 100% Tax-Free Slice (First £30k): ${formatCurrency(calc.taxFreeSlice)}
• PAYE Tax on Excess Above £30k: -${formatCurrency(calc.severanceTaxDeduction)}
• Net Lump Sum Kept: ${formatCurrency(calc.netPayoutKept)} (${calc.monthsOfLivingExpenses} months of net salary)`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Controls */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              1. Configure NHS Service &amp; Severance Scheme
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official NHS Agenda for Change Section 16 &amp; HMRC £30,000 Tax-Free Termination Rules
            </p>
          </div>
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setSchemeType("section16")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                schemeType === "section16"
                  ? "bg-[#005EB8] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Section 16 Redundancy
            </button>
            <button
              type="button"
              onClick={() => setSchemeType("mars")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                schemeType === "mars"
                  ? "bg-[#005EB8] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              NHS MARS Scheme
            </button>
          </div>
        </div>

        {/* Band & Step */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              NHS Pay Band (2026/27)
            </label>
            <select
              value={selectedBand}
              onChange={(e) => {
                setSelectedBand(e.target.value);
                setStepIndex(0);
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900"
            >
              {nhsData.bands.map((b) => (
                <option key={b.slug} value={b.band}>
                  {b.band} ({b.typicalRoles[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Pay Step / Spine Point
            </label>
            <select
              value={safeStepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900"
            >
              {bandObj.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} — {formatCurrency(pt.annualSalary)}/yr
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Years of Reckonable Service Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Complete Years of Reckonable NHS Service
            </label>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005EB8] font-mono text-xs font-extrabold">
              {yearsService} {yearsService === 1 ? "Year" : "Years"} (
              {calc.monthsEquivalent} Months&apos; Pay)
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={yearsService}
            onChange={(e) => setYearsService(Number(e.target.value))}
            className="w-full accent-[#005EB8] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>2 Yrs (Min Qualifying)</span>
            <span>8 Yrs</span>
            <span>15 Yrs</span>
            <span>24 Yrs (Max Cap)</span>
          </div>
        </div>

        {/* Contracted Hours, HCAS & Tax Region */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Contracted Hours
            </label>
            <select
              value={contractedHours}
              onChange={(e) => setContractedHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900"
            >
              <option value={37.5}>37.5h (1.0 WTE)</option>
              <option value={30}>30.0h (0.8 WTE)</option>
              <option value={22.5}>22.5h (0.6 WTE)</option>
              <option value={18.75}>18.75h (0.5 WTE)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              London HCAS
            </label>
            <select
              value={hcasZone}
              onChange={(e) => setHcasZone(e.target.value as HcasZone)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900"
            >
              <option value="standard">Rest of UK (0%)</option>
              <option value="fringe">Fringe (+5%)</option>
              <option value="outer-london">Outer London (+15%)</option>
              <option value="inner-london">Inner London (+20%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tax Region
            </label>
            <select
              value={isScottishTax ? "scotland" : "england"}
              onChange={(e) => setIsScottishTax(e.target.value === "scotland")}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900"
            >
              <option value="england">England / Wales / NI</option>
              <option value="scotland">Scotland (6-Band)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Column: Live Payout Breakdown */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-gradient-to-br from-[#003087] via-[#005EB8] to-[#0072CE] rounded-2xl p-6 sm:p-7 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              {schemeType === "section16"
                ? "Net Redundancy Payout (After Tax)"
                : "Net MARS Severance Payout"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
              First £30k Tax-Free
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono my-1">
            {formatCurrency(calc.netPayoutKept)}
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Gross entitlement:{" "}
            <strong className="text-white">
              {formatCurrency(calc.activeGrossPayout)}
            </strong>{" "}
            ({calc.monthsEquivalent} months&apos; reckonable pay @{" "}
            {formatCurrency(calc.reckonableMonthlyPay)}/mo).
          </p>

          <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[11px] text-blue-100 font-medium">
                100% Tax-Free Slice
              </div>
              <div className="text-lg font-extrabold font-mono mt-0.5 text-emerald-300">
                {formatCurrency(calc.taxFreeSlice)}
              </div>
              <div className="text-[10px] text-blue-200">
                ITEPA 2003 s.403 exemption
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[11px] text-blue-100 font-medium">
                Net Salary Runway
              </div>
              <div className="text-lg font-extrabold font-mono mt-0.5">
                {calc.monthsOfLivingExpenses} Months
              </div>
              <div className="text-[10px] text-blue-200">
                Of normal net take-home pay
              </div>
            </div>
          </div>
        </div>

        {calc.isCappedAt80k && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-0.5">
                Section 16 £80,000 Reckonable Salary Cap Applied
              </strong>
              Under NHS Agenda for Change Section 16, contractual redundancy pay
              is calculated using a maximum whole-time equivalent salary cap of
              £80,000/yr (£6,667/mo).
            </div>
          </div>
        )}

        {/* Itemized Severance Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Section 16 vs. MARS &amp; Tax Breakdown
          </h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                Section 16 Redundancy Gross ({calc.qualifyingYearsSec16} mos)
              </span>
              <span className="font-bold font-mono text-slate-900">
                {formatCurrency(calc.section16Gross)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                MARS Voluntary Severance Gross
              </span>
              <span className="font-semibold font-mono text-slate-700">
                {formatCurrency(calc.marsGross)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                Tax-Free Exemption (First £30,000)
              </span>
              <span className="font-semibold font-mono text-emerald-700">
                {formatCurrency(calc.taxFreeSlice)} (£0 Tax)
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                Taxable Excess Above £30,000
              </span>
              <span className="font-semibold font-mono text-slate-800">
                {formatCurrency(calc.taxableSeveranceSlice)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                PAYE Tax on Excess (0% NI / 0% Pension)
              </span>
              <span className="font-semibold font-mono text-rose-600">
                -{formatCurrency(calc.severanceTaxDeduction)}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-base font-extrabold text-emerald-700">
              <span>Net Cash Payout Kept</span>
              <span className="font-mono">
                {formatCurrency(calc.netPayoutKept)}
              </span>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={shareText}
            url="https://netpayscale.uk/redundancy-pay-calculator/"
            variant="light"
            label="Share Redundancy Calculation"
          />
        </div>
      </div>
    </div>
  );
}
export default RedundancyCalculatorClient;
