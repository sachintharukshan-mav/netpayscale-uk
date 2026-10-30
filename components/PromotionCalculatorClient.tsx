"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { MagneticBentoContainer } from "@/components/MagneticBento";
import {
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Moon,
  Clock,
  Sparkles,
  HelpCircle,
} from "lucide-react";

type HcasZone = CalculatorInputs["hcasZone"];
type StudentLoanPlan = CalculatorInputs["studentLoan"];

interface ScenarioPreset {
  id: string;
  name: string;
  shortTag: string;
  badge: string;
  fromBand: string;
  fromStep: number;
  fromNights: number;
  fromSundays: number;
  toBand: string;
  toStep: number;
  toNights: number;
  toSundays: number;
  summary: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: "trap-50",
    name: "⚡ The £50/Month Trap",
    shortTag: "Top B5 → B6 Entry (Days)",
    badge: "Most Searched",
    fromBand: "Band 5",
    fromStep: 2, // Top step (£39,043)
    fromNights: 0,
    fromSundays: 0,
    toBand: "Band 6",
    toStep: 0, // Entry step (£39,959)
    toNights: 0,
    toSundays: 0,
    summary:
      "Top of Band 5 to Band 6 Entry yields a £916/yr gross rise, but 9.8% pension + tax + NI leaves just ~£49/mo in your pocket.",
  },
  {
    id: "shift-loss",
    name: "🌙 The Shift Loss Reality",
    shortTag: "B5 Ward Nights → B6 Mon–Fri",
    badge: "Pay Cut Warning",
    fromBand: "Band 5",
    fromStep: 2, // Top step (£39,043)
    fromNights: 11.5, // 1 night per week
    fromSundays: 0,
    toBand: "Band 6",
    toStep: 0, // Entry step (£39,959)
    toNights: 0,
    toSundays: 0,
    summary:
      "Moving from ward night shifts (+30% unsocial hours) to a 9–5 specialist/clinic Band 6 causes an immediate ~£167/mo net take-home DROP.",
  },
  {
    id: "career-long",
    name: "🚀 Long-Term Progression",
    shortTag: "Top B5 → Top B6 (5 Yrs)",
    badge: "Career Win",
    fromBand: "Band 5",
    fromStep: 2, // Top step (£39,043)
    fromNights: 0,
    fromSundays: 0,
    toBand: "Band 6",
    toStep: 2, // Top step (£48,117)
    toNights: 0,
    toSundays: 0,
    summary:
      "Reaching Top of Band 6 boosts net pay by +£470/mo and permanently adds +£168/yr of guaranteed, inflation-linked CARE pension for life.",
  },
  {
    id: "junior-sister",
    name: "🏥 Newly Qualified → Sister",
    shortTag: "B5 Entry → B6 Entry",
    badge: "Standard Step",
    fromBand: "Band 5",
    fromStep: 0, // Entry step (£32,073)
    fromNights: 0,
    fromSundays: 0,
    toBand: "Band 6",
    toStep: 0, // Entry step (£39,959)
    toNights: 0,
    toSundays: 0,
    summary:
      "Gross rises +£7,886/yr, pension tier steps from 8.3% to 9.8%, producing a healthy +£363/mo net take-home increase.",
  },
];

export function PromotionCalculatorClient() {
  const [activePreset, setActivePreset] = useState<string>("trap-50");

  const [fromBand, setFromBand] = useState<string>("Band 5");
  const [fromStep, setFromStep] = useState<number>(2); // Default to Top of Band 5
  const [fromNights, setFromNights] = useState<number>(0);
  const [fromSundays, setFromSundays] = useState<number>(0);

  const [toBand, setToBand] = useState<string>("Band 6");
  const [toStep, setToStep] = useState<number>(0); // Default to Band 6 Entry
  const [toNights, setToNights] = useState<number>(0);
  const [toSundays, setToSundays] = useState<number>(0);

  const [hcasZone, setHcasZone] = useState<HcasZone>("standard");
  const [isScottishTax, setIsScottishTax] = useState<boolean>(false);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>("none");

  const applyPreset = (preset: ScenarioPreset) => {
    setActivePreset(preset.id);
    setFromBand(preset.fromBand);
    setFromStep(preset.fromStep);
    setFromNights(preset.fromNights);
    setFromSundays(preset.fromSundays);
    setToBand(preset.toBand);
    setToStep(preset.toStep);
    setToNights(preset.toNights);
    setToSundays(preset.toSundays);
  };

  const handleCustomChange = () => {
    setActivePreset("custom");
  };

  const fromBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === fromBand) || nhsData.bands[3],
    [fromBand]
  );
  const toBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === toBand) || nhsData.bands[4],
    [toBand]
  );

  const safeFromStep = Math.min(fromStep, fromBandObj.points.length - 1);
  const safeToStep = Math.min(toStep, toBandObj.points.length - 1);

  const comparison = useMemo(() => {
    const current = calculateNHSPay({
      band: fromBand,
      stepIndex: safeFromStep,
      hcasZone,
      nightHoursPerWeek: fromNights,
      sundayHoursPerWeek: fromSundays,
      pensionOptedOut: false,
      isScottishTax,
      studentLoan,
    });

    const target = calculateNHSPay({
      band: toBand,
      stepIndex: safeToStep,
      hcasZone,
      nightHoursPerWeek: toNights,
      sundayHoursPerWeek: toSundays,
      pensionOptedOut: false,
      isScottishTax,
      studentLoan,
    });

    const grossAnnualDiff = target.grossPay.annual - current.grossPay.annual;
    const grossMonthlyDiff = target.grossPay.monthly - current.grossPay.monthly;
    const netMonthlyDiff = target.netPay.monthly - current.netPay.monthly;
    const netAnnualDiff = target.netPay.annual - current.netPay.annual;
    const hourlyNetDiff = target.netHourlyRate - current.netHourlyRate;

    // Deductions difference
    const pensionAnnualDiff =
      target.pensionContribution.annual - current.pensionContribution.annual;
    const taxAnnualDiff = target.incomeTax.annual - current.incomeTax.annual;
    const niAnnualDiff =
      target.nationalInsurance.annual - current.nationalInsurance.annual;
    const studentLoanAnnualDiff =
      target.studentLoanDeduction.annual - current.studentLoanDeduction.annual;

    // Marginal deduction rate on the gross change (if positive gross gain)
    let marginalDeductionPct = 0;
    let marginalKeptPct = 0;
    if (grossAnnualDiff > 0) {
      const totalDeductionsDiff =
        pensionAnnualDiff + taxAnnualDiff + niAnnualDiff + studentLoanAnnualDiff;
      marginalDeductionPct = Math.min(
        100,
        Math.max(0, (totalDeductionsDiff / grossAnnualDiff) * 100)
      );
      marginalKeptPct = 100 - marginalDeductionPct;
    }

    // 2015 CARE Pension accrual is 1/54th of pensionable earnings
    const currentCareAccrual = current.pensionablePay.annual / 54;
    const targetCareAccrual = target.pensionablePay.annual / 54;
    const careAccrualDiff = targetCareAccrual - currentCareAccrual;

    const pensionTierJump = target.pensionRate > current.pensionRate;
    const isPayDrop = netMonthlyDiff < 0;
    const isTinyGain = netMonthlyDiff >= 0 && netMonthlyDiff < 75;

    return {
      current,
      target,
      grossAnnualDiff,
      grossMonthlyDiff,
      netMonthlyDiff,
      netAnnualDiff,
      hourlyNetDiff,
      pensionAnnualDiff,
      taxAnnualDiff,
      niAnnualDiff,
      studentLoanAnnualDiff,
      marginalDeductionPct,
      marginalKeptPct,
      careAccrualDiff,
      pensionTierJump,
      isPayDrop,
      isTinyGain,
    };
  }, [
    fromBand,
    safeFromStep,
    fromNights,
    fromSundays,
    toBand,
    safeToStep,
    toNights,
    toSundays,
    hcasZone,
    isScottishTax,
    studentLoan,
  ]);

  const isPositive = comparison.netMonthlyDiff >= 0;

  const shareText = `📈 NHS Promotion Pay & Pension Analysis (${fromBand} → ${toBand}):
• Current Net Pay: ${formatCurrency(comparison.current.netPay.monthly)}/mo
• Promoted Net Pay: ${formatCurrency(comparison.target.netPay.monthly)}/mo
• Monthly Net Change: ${isPositive ? "+" : ""}${formatCurrency(comparison.netMonthlyDiff)}/mo (${isPositive ? "+" : ""}${formatCurrency(comparison.netAnnualDiff)}/yr)
• Gross Change: ${comparison.grossAnnualDiff >= 0 ? "+" : ""}${formatCurrency(comparison.grossAnnualDiff)}/yr
• Pension Rate: ${comparison.current.pensionTierLabel} → ${comparison.target.pensionTierLabel} (+${formatCurrency(Math.max(0, comparison.careAccrualDiff))}/yr CARE pension for life)
Check full breakdown & pension trap on NetPayScale UK:`;

  return (
    <div className="space-y-8">
      {/* 1. Quick Scenario Presets */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#005EB8]" />
              Select a Common NHS Promotion Dilemma (Instant 1-Click Presets)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore the real numbers behind the most fiercely debated promotion scenarios in UK hospital staff rooms.
            </p>
          </div>
          {activePreset === "custom" && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 self-start sm:self-auto">
              Custom Scenario Active
            </span>
          )}
        </div>

        <MagneticBentoContainer variant="2xl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`bento-card text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[#005EB8] bg-blue-50/70 ring-2 ring-[#005EB8]/20 shadow-sm"
                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        p.badge === "Pay Cut Warning"
                          ? "bg-rose-100 text-rose-800"
                          : p.badge === "Most Searched"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {p.badge}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {p.shortTag}
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-900 leading-snug">
                    {p.name}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    {p.summary}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] font-bold text-[#005EB8]">
                  {isSelected ? "✓ Scenario Applied" : "Load Scenario →"}
                </div>
              </button>
            );
          })}
        </MagneticBentoContainer>
      </div>

      {/* 2. Side-by-Side Role Selectors & Comparative Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Side-by-Side Role Selectors */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              Customize Roles, Spine Steps &amp; Shift Patterns
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Include any ward night or Sunday shifts you might gain or lose when stepping into your new post.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Role Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  Current Role (From)
                </span>
                <span className="text-xs font-bold font-mono text-slate-700">
                  {formatCurrency(comparison.current.netPay.monthly)}/mo net
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Current Band
                </label>
                <select
                  value={fromBand}
                  onChange={(e) => {
                    handleCustomChange();
                    setFromBand(e.target.value);
                    setFromStep(0);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                >
                  {nhsData.bands.map((b) => (
                    <option key={b.slug} value={b.band}>
                      {b.band} ({b.typicalRoles[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Current Spine Step
                </label>
                <select
                  value={safeFromStep}
                  onChange={(e) => {
                    handleCustomChange();
                    setFromStep(Number(e.target.value));
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                >
                  {fromBandObj.points.map((pt, idx) => (
                    <option key={pt.step} value={idx}>
                      {pt.step} ({formatCurrency(pt.annualSalary)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Night Hrs/Wk (+30%)
                  </label>
                  <select
                    value={fromNights}
                    onChange={(e) => {
                      handleCustomChange();
                      setFromNights(Number(e.target.value));
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  >
                    <option value={0}>0 hrs (Days only)</option>
                    <option value={5.75}>5.75 hrs (2 nights/mo)</option>
                    <option value={11.5}>11.5 hrs (1 night/wk)</option>
                    <option value={23}>23.0 hrs (2 nights/wk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Sunday Hrs/Wk (+60%)
                  </label>
                  <select
                    value={fromSundays}
                    onChange={(e) => {
                      handleCustomChange();
                      setFromSundays(Number(e.target.value));
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  >
                    <option value={0}>0 hrs</option>
                    <option value={3.75}>3.75 hrs (1 Sun/mo)</option>
                    <option value={5.75}>5.75 hrs (2 Suns/mo)</option>
                    <option value={11.5}>11.5 hrs (Every Sun)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 flex justify-between">
                <span>Pension Tier:</span>
                <span className="font-bold font-mono text-amber-800">
                  {comparison.current.pensionTierLabel} (
                  {formatCurrency(comparison.current.pensionContribution.monthly)}
                  /mo)
                </span>
              </div>
            </div>

            {/* Target Promoted Role Box */}
            <div className="rounded-xl border-2 border-[#005EB8]/30 bg-blue-50/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#005EB8]">
                  Promoted Role (To)
                </span>
                <span className="text-xs font-bold font-mono text-[#005EB8]">
                  {formatCurrency(comparison.target.netPay.monthly)}/mo net
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  New Promoted Band
                </label>
                <select
                  value={toBand}
                  onChange={(e) => {
                    handleCustomChange();
                    setToBand(e.target.value);
                    setToStep(0);
                  }}
                  className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                >
                  {nhsData.bands.map((b) => (
                    <option key={b.slug} value={b.band}>
                      {b.band} ({b.typicalRoles[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  New Spine Step
                </label>
                <select
                  value={safeToStep}
                  onChange={(e) => {
                    handleCustomChange();
                    setToStep(Number(e.target.value));
                  }}
                  className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                >
                  {toBandObj.points.map((pt, idx) => (
                    <option key={pt.step} value={idx}>
                      {pt.step} ({formatCurrency(pt.annualSalary)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Night Hrs/Wk (+30%)
                  </label>
                  <select
                    value={toNights}
                    onChange={(e) => {
                      handleCustomChange();
                      setToNights(Number(e.target.value));
                    }}
                    className="w-full rounded-lg border border-blue-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  >
                    <option value={0}>0 hrs (Mon–Fri 9–5)</option>
                    <option value={5.75}>5.75 hrs (2 nights/mo)</option>
                    <option value={11.5}>11.5 hrs (1 night/wk)</option>
                    <option value={23}>23.0 hrs (2 nights/wk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sunday Hrs/Wk (+60%)
                  </label>
                  <select
                    value={toSundays}
                    onChange={(e) => {
                      handleCustomChange();
                      setToSundays(Number(e.target.value));
                    }}
                    className="w-full rounded-lg border border-blue-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                  >
                    <option value={0}>0 hrs</option>
                    <option value={3.75}>3.75 hrs (1 Sun/mo)</option>
                    <option value={5.75}>5.75 hrs (2 Suns/mo)</option>
                    <option value={11.5}>11.5 hrs (Every Sun)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200/80 text-[11px] text-slate-600 flex justify-between">
                <span>Pension Tier:</span>
                <span className="font-bold font-mono text-[#005EB8]">
                  {comparison.target.pensionTierLabel} (
                  {formatCurrency(comparison.target.pensionContribution.monthly)}
                  /mo)
                </span>
              </div>
            </div>
          </div>

          {/* Shared Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                London Weighting (HCAS)
              </label>
              <select
                value={hcasZone}
                onChange={(e) => setHcasZone(e.target.value as HcasZone)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                <option value="standard">Rest of UK (0%)</option>
                <option value="fringe">Fringe (+5%)</option>
                <option value="outer-london">Outer London (+15%)</option>
                <option value="inner-london">Inner London (+20%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tax Regime
              </label>
              <select
                value={isScottishTax ? "scotland" : "england"}
                onChange={(e) => setIsScottishTax(e.target.value === "scotland")}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                <option value="england">England / Wales / NI</option>
                <option value="scotland">Scotland (6-Band)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Student Loan
              </label>
              <select
                value={studentLoan}
                onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                <option value="none">None</option>
                <option value="plan2">Plan 2 (9%)</option>
                <option value="plan5">Plan 5 (9%)</option>
                <option value="plan1">Plan 1 (9%)</option>
                <option value="plan4">Plan 4 (9% Scotland)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Promotion Net Difference Verdict Card */}
        <div className="lg:col-span-5 space-y-5">
          <div
            className={`rounded-2xl p-6 sm:p-7 text-white shadow-lg transition-all ${
              comparison.isPayDrop
                ? "bg-gradient-to-br from-rose-700 via-rose-600 to-amber-700"
                : comparison.isTinyGain
                ? "bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600"
                : "bg-gradient-to-br from-[#003087] via-[#005EB8] to-[#0072CE]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                {fromBand} → {toBand} Monthly Net Change
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20">
                {comparison.isPayDrop
                  ? "Pay Cut Alert"
                  : comparison.isTinyGain
                  ? "Marginal Trap Alert"
                  : "Net Take-Home Gain"}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono my-1">
              {isPositive ? "+" : ""}
              {formatCurrency(comparison.netMonthlyDiff)}/mo
            </div>

            <p className="text-xs text-white/90 leading-relaxed">
              Annual take-home change of{" "}
              <strong>
                {isPositive ? "+" : ""}
                {formatCurrency(comparison.netAnnualDiff)}/yr
              </strong>{" "}
              (Gross change: {comparison.grossAnnualDiff >= 0 ? "+" : ""}
              {formatCurrency(comparison.grossAnnualDiff)}/yr).
            </p>

            <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-[11px] text-white/80 font-medium">
                  Net Hourly Pay Change
                </div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  {comparison.hourlyNetDiff >= 0 ? "+" : ""}£
                  {comparison.hourlyNetDiff.toFixed(2)}/hr
                </div>
                <div className="text-[10px] text-white/75">
                  After tax, NICs &amp; pension
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-[11px] text-white/80 font-medium">
                  Extra Pension Pot / Yr
                </div>
                <div className="text-lg font-extrabold font-mono mt-0.5 text-emerald-200">
                  +{formatCurrency(Math.max(0, comparison.careAccrualDiff))}/yr
                </div>
                <div className="text-[10px] text-white/75">
                  Guaranteed CARE pension for life
                </div>
              </div>
            </div>
          </div>

          {/* Alert Callouts */}
          {comparison.isPayDrop && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">
                  Immediate Net Take-Home Reduction Warning
                </strong>
                Stepping into this role reduces your take-home pay by{" "}
                <strong className="font-mono">
                  {formatCurrency(Math.abs(comparison.netMonthlyDiff))}/month
                </strong>
                . This is because you are relinquishing night/Sunday unsocial enhancements. To maintain your previous take-home, you would need to work approximately{" "}
                <strong>1 hospital bank shift every 5 to 6 weeks</strong> until spine step progression kicks in.
              </div>
            </div>
          )}

          {comparison.isTinyGain && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex gap-3">
              <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">
                  The ~£50/Month Promotion Trap
                </strong>
                Despite taking on additional clinical coordination, escalation, and leadership responsibilities, your immediate monthly take-home only increases by{" "}
                <strong className="font-mono">
                  +{formatCurrency(comparison.netMonthlyDiff)}/month
                </strong>{" "}
                (approx. £{(comparison.netMonthlyDiff / 30.4).toFixed(2)} per day). See below for why the 2015 CARE pension and spine progression make it worthwhile long-term.
              </div>
            </div>
          )}

          {comparison.pensionTierJump && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-[#005EB8] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">
                  NHS Pension Tier Cliff (
                  {comparison.current.pensionTierLabel} →{" "}
                  {comparison.target.pensionTierLabel})
                </strong>
                Your member pension rate increases from{" "}
                <strong>{comparison.current.pensionTierLabel}</strong> to{" "}
                <strong>{comparison.target.pensionTierLabel}</strong> across your whole pensionable salary, adding{" "}
                {formatCurrency(
                  comparison.target.pensionContribution.monthly -
                    comparison.current.pensionContribution.monthly
                )}
                /mo in deductions, while increasing your guaranteed inflation-linked retirement pension by +
                {formatCurrency(Math.max(0, comparison.careAccrualDiff))}/yr.
              </div>
            </div>
          )}

          {/* Side-by-Side Payslip Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Side-by-Side Monthly Payslip Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 font-bold">Payslip Line</th>
                    <th className="py-2 font-bold text-right">{fromBand}</th>
                    <th className="py-2 font-bold text-right text-[#005EB8]">
                      {toBand}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 font-sans text-slate-600">
                      Basic Annual Salary
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {formatCurrency(comparison.current.baseSalary.monthly)}
                    </td>
                    <td className="py-2 text-right font-bold text-slate-900">
                      {formatCurrency(comparison.target.baseSalary.monthly)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-slate-600">
                      Unsocial Hours Enhancements
                    </td>
                    <td className="py-2 text-right text-slate-700">
                      +{formatCurrency(comparison.current.totalUnsocialAmount.monthly)}
                    </td>
                    <td className="py-2 text-right text-slate-700">
                      +{formatCurrency(comparison.target.totalUnsocialAmount.monthly)}
                    </td>
                  </tr>
                  <tr className="font-semibold bg-slate-50/50">
                    <td className="py-2 font-sans text-slate-900">
                      Total Gross Pay
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(comparison.current.grossPay.monthly)}
                    </td>
                    <td className="py-2 text-right text-[#005EB8]">
                      {formatCurrency(comparison.target.grossPay.monthly)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-slate-600">
                      NHS Pension ({comparison.current.pensionTierLabel} vs{" "}
                      {comparison.target.pensionTierLabel})
                    </td>
                    <td className="py-2 text-right text-amber-700">
                      -{formatCurrency(comparison.current.pensionContribution.monthly)}
                    </td>
                    <td className="py-2 text-right text-amber-700">
                      -{formatCurrency(comparison.target.pensionContribution.monthly)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-slate-600">
                      PAYE Income Tax
                    </td>
                    <td className="py-2 text-right text-rose-600">
                      -{formatCurrency(comparison.current.incomeTax.monthly)}
                    </td>
                    <td className="py-2 text-right text-rose-600">
                      -{formatCurrency(comparison.target.incomeTax.monthly)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-slate-600">
                      National Insurance (8%)
                    </td>
                    <td className="py-2 text-right text-rose-600">
                      -{formatCurrency(comparison.current.nationalInsurance.monthly)}
                    </td>
                    <td className="py-2 text-right text-rose-600">
                      -{formatCurrency(comparison.target.nationalInsurance.monthly)}
                    </td>
                  </tr>
                  {studentLoan !== "none" && (
                    <tr>
                      <td className="py-2 font-sans text-slate-600">
                        Student Loan ({studentLoan.toUpperCase()})
                      </td>
                      <td className="py-2 text-right text-purple-700">
                        -{formatCurrency(comparison.current.studentLoanDeduction.monthly)}
                      </td>
                      <td className="py-2 text-right text-purple-700">
                        -{formatCurrency(comparison.target.studentLoanDeduction.monthly)}
                      </td>
                    </tr>
                  )}
                  <tr className="font-bold text-sm bg-slate-50">
                    <td className="py-2.5 pl-2 font-sans text-slate-900">
                      Monthly Net Take-Home
                    </td>
                    <td className="py-2.5 text-right text-slate-800">
                      {formatCurrency(comparison.current.netPay.monthly)}
                    </td>
                    <td
                      className={`py-2.5 pr-2 text-right ${
                        isPositive ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {formatCurrency(comparison.target.netPay.monthly)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ShareBreakdownButton
              shareText={shareText}
              url="https://netpayscale.uk/promotion-calculator/"
              variant="light"
              label="Share Breakdown to Hospital WhatsApp Group"
            />
          </div>
        </div>
      </div>

      {/* 3. Deep-Dive Financial Analysis: Is Band 6 Worth It? */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-[#005EB8] rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Clinical Financial Verdict: Is Moving from Band 5 to Band 6 Financially Worth It?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed breakdown of marginal deduction rates, hourly take-home pay, and the hidden power of the 2015 CARE NHS Pension scheme.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Marginal Deduction Rate */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Zap className="w-4 h-4 text-amber-600" />
              The Marginal Rate Trap
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When stepping from the top of Band 5 (£39,043) to Band 6 Entry (£39,959), your gross increase is only <strong>+£916/yr</strong>.
            </p>
            <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>NHS Pension (Tier 4):</span>
                <span className="font-bold text-amber-700">9.8%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Basic PAYE Tax:</span>
                <span className="font-bold text-rose-600">20.0%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>National Insurance:</span>
                <span className="font-bold text-rose-600">8.0%</span>
              </div>
              {studentLoan !== "none" && (
                <div className="flex justify-between text-slate-600">
                  <span>Student Loan ({studentLoan.toUpperCase()}):</span>
                  <span className="font-bold text-purple-700">9.0%</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200 font-sans">
                <span>Marginal Deduction Rate:</span>
                <span className="font-mono text-rose-700">
                  {studentLoan !== "none" ? "46.8%" : "37.8%"}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal pt-1">
              For every £100 pay rise, you keep just <strong>£{studentLoan !== "none" ? "53.20" : "62.20"}</strong>. That is why month 1 can feel so underwhelming.
            </p>
          </div>

          {/* Card 2: The Shift Loss Reality */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <Moon className="w-4 h-4 text-indigo-600" />
              Unsocial Hours Trade-Off
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Many Band 5 staff nurses rely on night (+30%) and Sunday (+60%) unsocial enhancements to earn <strong>£2,400 to £2,500/month net</strong>.
            </p>
            <div className="bg-white rounded-lg border border-slate-200 p-3 text-xs space-y-2">
              <div className="font-bold text-slate-800">
                B5 Top (1 night/wk): ~£2,445/mo net
              </div>
              <div className="font-bold text-slate-800">
                B6 Entry (Mon–Fri 9–5): ~£2,489/mo net
              </div>
              <div className="text-[11px] text-slate-600 leading-normal">
                If you worked <strong>2 nights per week</strong> as a Band 5, stepping into a 9–5 Band 6 post means an immediate <strong>net loss of over -£160/month</strong> until you reach the intermediate spine step!
              </div>
            </div>
          </div>

          {/* Card 3: The Long-Term Win */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Why Band 6 Wins Long-Term
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Do not let the initial £50/month trap deter your career. Band 6 is an essential stepping stone that pays off exponentially:
            </p>
            <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
              <li>
                <strong>Spine Point Progression:</strong> Within 2 years you reach £42,170 (+£160/mo net) and at 5 years you hit <strong>£48,117 (+£470/mo net)</strong>.
              </li>
              <li>
                <strong>1/54th CARE Pension Accrual:</strong> Top of Band 6 permanently adds <strong>+£168/year of guaranteed annual pension</strong> for every year worked, indexed to CPI + 1.5% until state pension age.
              </li>
              <li>
                <strong>Future Band 7 Gateway:</strong> Opens doors to Ward Manager, ACP, and Clinical Specialist roles (£49,387+).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionCalculatorClient;
