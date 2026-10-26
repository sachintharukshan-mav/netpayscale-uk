"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { AlertTriangle } from "lucide-react";

type HcasZone = CalculatorInputs["hcasZone"];
type StudentLoanPlan = CalculatorInputs["studentLoan"];

export function PromotionCalculatorClient() {
  const [fromBand, setFromBand] = useState<string>("Band 5");
  const [fromStep, setFromStep] = useState<number>(0);
  const [fromNights, setFromNights] = useState<number>(0);
  const [fromSundays, setFromSundays] = useState<number>(0);

  const [toBand, setToBand] = useState<string>("Band 6");
  const [toStep, setToStep] = useState<number>(0);
  const [toNights, setToNights] = useState<number>(0);
  const [toSundays, setToSundays] = useState<number>(0);

  const [hcasZone, setHcasZone] = useState<HcasZone>("standard");
  const [isScottishTax, setIsScottishTax] = useState<boolean>(false);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>("none");

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
    const netMonthlyDiff = target.netPay.monthly - current.netPay.monthly;
    const netAnnualDiff = target.netPay.annual - current.netPay.annual;
    const hourlyNetDiff = target.netHourlyRate - current.netHourlyRate;

    const currentCareAccrual = current.pensionablePay.annual / 54;
    const targetCareAccrual = target.pensionablePay.annual / 54;
    const careAccrualDiff = targetCareAccrual - currentCareAccrual;

    const pensionTierJump = target.pensionRate > current.pensionRate;

    return {
      current,
      target,
      grossAnnualDiff,
      netMonthlyDiff,
      netAnnualDiff,
      hourlyNetDiff,
      careAccrualDiff,
      pensionTierJump,
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

  const shareText = `📈 NHS Promotion Net Pay Comparison (${fromBand} → ${toBand}):
• ${fromBand} Net Take-Home: ${formatCurrency(comparison.current.netPay.monthly)}/mo
• ${toBand} Net Take-Home: ${formatCurrency(comparison.target.netPay.monthly)}/mo
• Monthly Net Difference: ${isPositive ? "+" : ""}${formatCurrency(comparison.netMonthlyDiff)}/mo (${isPositive ? "+" : ""}${formatCurrency(comparison.netAnnualDiff)}/yr)
• Pension Tier: ${comparison.current.pensionTierLabel} → ${comparison.target.pensionTierLabel}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Side-by-Side Role Selectors */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-extrabold text-slate-900">
            1. Compare Current Role vs. Promoted Role
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Include any ward night or Sunday shifts you might gain or lose when changing roles
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
                  setFromBand(e.target.value);
                  setFromStep(0);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
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
                onChange={(e) => setFromStep(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
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
                  Night Hrs/Wk
                </label>
                <select
                  value={fromNights}
                  onChange={(e) => setFromNights(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value={0}>0 hrs (Days only)</option>
                  <option value={5.75}>5.75 hrs (2 nights/mo)</option>
                  <option value={11.5}>11.5 hrs (1 night/wk)</option>
                  <option value={23}>23.0 hrs (2 nights/wk)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Sunday Hrs/Wk
                </label>
                <select
                  value={fromSundays}
                  onChange={(e) => setFromSundays(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value={0}>0 hrs</option>
                  <option value={3.75}>3.75 hrs (1 Sun/mo)</option>
                  <option value={5.75}>5.75 hrs (2 Suns/mo)</option>
                  <option value={11.5}>11.5 hrs (Every Sun)</option>
                </select>
              </div>
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
                  setToBand(e.target.value);
                  setToStep(0);
                }}
                className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
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
                onChange={(e) => setToStep(Number(e.target.value))}
                className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
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
                  Night Hrs/Wk
                </label>
                <select
                  value={toNights}
                  onChange={(e) => setToNights(Number(e.target.value))}
                  className="w-full rounded-lg border border-blue-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value={0}>0 hrs (Mon–Fri 9–5)</option>
                  <option value={5.75}>5.75 hrs (2 nights/mo)</option>
                  <option value={11.5}>11.5 hrs (1 night/wk)</option>
                  <option value={23}>23.0 hrs (2 nights/wk)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Sunday Hrs/Wk
                </label>
                <select
                  value={toSundays}
                  onChange={(e) => setToSundays(Number(e.target.value))}
                  className="w-full rounded-lg border border-blue-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value={0}>0 hrs</option>
                  <option value={3.75}>3.75 hrs (1 Sun/mo)</option>
                  <option value={5.75}>5.75 hrs (2 Suns/mo)</option>
                  <option value={11.5}>11.5 hrs (Every Sun)</option>
                </select>
              </div>
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
              Tax Regime
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
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Student Loan
            </label>
            <select
              value={studentLoan}
              onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900"
            >
              <option value="none">None</option>
              <option value="plan2">Plan 2 (9%)</option>
              <option value="plan5">Plan 5 (9%)</option>
              <option value="plan1">Plan 1 (9%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Column: Promotion Net Difference Verdict */}
      <div className="lg:col-span-5 space-y-5">
        <div
          className={`rounded-2xl p-6 sm:p-7 text-white shadow-lg ${
            isPositive
              ? "bg-gradient-to-br from-[#003087] via-[#005EB8] to-[#0072CE]"
              : "bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              {fromBand} → {toBand} Monthly Net Change
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20">
              {isPositive ? "Net Take-Home Gain" : "Unsocial Shift Drop Alert"}
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
                1/54th annual CARE accrual
              </div>
            </div>
          </div>
        </div>

        {comparison.pensionTierJump && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-0.5">
                NHS Pension Tier Cliff Detected (
                {comparison.current.pensionTierLabel} →{" "}
                {comparison.target.pensionTierLabel})
              </strong>
              Moving from {fromBand} to {toBand} increases your pension
              contribution rate from {comparison.current.pensionTierLabel} to{" "}
              {comparison.target.pensionTierLabel}, adding{" "}
              {formatCurrency(
                comparison.target.pensionContribution.monthly -
                  comparison.current.pensionContribution.monthly
              )}
              /mo to your pension deduction while boosting your guaranteed
              annual retirement pension by +
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
                    Monthly Gross (incl. HCAS/Shifts)
                  </td>
                  <td className="py-2 text-right font-semibold">
                    {formatCurrency(comparison.current.grossPay.monthly)}
                  </td>
                  <td className="py-2 text-right font-bold text-slate-900">
                    {formatCurrency(comparison.target.grossPay.monthly)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-sans text-slate-600">
                    NHS Pension Deduction
                  </td>
                  <td className="py-2 text-right text-amber-700">
                    -{formatCurrency(comparison.current.pensionContribution.monthly)} (
                    {comparison.current.pensionTierLabel})
                  </td>
                  <td className="py-2 text-right text-amber-700">
                    -{formatCurrency(comparison.target.pensionContribution.monthly)} (
                    {comparison.target.pensionTierLabel})
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
                    Class 1 National Insurance
                  </td>
                  <td className="py-2 text-right text-rose-600">
                    -{formatCurrency(comparison.current.nationalInsurance.monthly)}
                  </td>
                  <td className="py-2 text-right text-rose-600">
                    -{formatCurrency(comparison.target.nationalInsurance.monthly)}
                  </td>
                </tr>
                <tr className="font-bold text-sm bg-slate-50">
                  <td className="py-2.5 pl-2 font-sans text-slate-900">
                    Monthly Net Take-Home
                  </td>
                  <td className="py-2.5 text-right text-slate-800">
                    {formatCurrency(comparison.current.netPay.monthly)}
                  </td>
                  <td className="py-2.5 pr-2 text-right text-emerald-700">
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
            label="Share Promotion Comparison"
          />
        </div>
      </div>
    </div>
  );
}
export default PromotionCalculatorClient;
