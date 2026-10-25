"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { Landmark, Sparkles, TrendingUp, ShieldCheck, Info } from "lucide-react";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

export function PensionCalculatorClient() {
  const [band, setBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(1);
  const [hcasZone, setHcasZone] = useState<"standard" | "inner-london" | "outer-london" | "fringe">("standard");
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [futureYears, setFutureYears] = useState<number>(25);
  const [takeMaxLumpSum, setTakeMaxLumpSum] = useState<boolean>(true);

  const selectedBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === band) || nhsData.bands[3],
    [band]
  );

  const safeStepIndex = Math.min(stepIndex, selectedBandObj.points.length - 1);

  const withPension = useMemo(
    () =>
      calculateNHSPay({
        band,
        stepIndex: safeStepIndex,
        hcasZone,
        contractedHours,
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: false,
        isScottishTax: false,
        studentLoan: "none",
      }),
    [band, safeStepIndex, hcasZone, contractedHours]
  );

  const optedOut = useMemo(
    () =>
      calculateNHSPay({
        band,
        stepIndex: safeStepIndex,
        hcasZone,
        contractedHours,
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: true,
        isScottishTax: false,
        studentLoan: "none",
      }),
    [band, safeStepIndex, hcasZone, contractedHours]
  );

  const pensionModel = useMemo(() => {
    const pensionablePay = withPension.grossPay.annual;
    const employeeAnnualGross = withPension.pensionContribution.annual;
    const employeeMonthlyGross = withPension.pensionContribution.monthly;

    // True net take-home cost of pension (because pension is deducted BEFORE PAYE tax)
    const trueMonthlyNetCost = optedOut.netPay.monthly - withPension.netPay.monthly;
    const monthlyTaxSaved = employeeMonthlyGross - trueMonthlyNetCost;

    // Employer 23.78% contribution
    const employerAnnualContribution = pensionablePay * 0.2378;
    const employerMonthlyContribution = employerAnnualContribution / 12;

    // 2015 CARE Scheme 1/54th annual accrual + active revaluation (1.5% real growth above CPI)
    const singleYearPensionAccrual = pensionablePay / 54;

    // Compounded real-terms CARE pot over futureYears with 1.5% above-inflation active revaluation
    let totalAnnualPensionAtRetirement = 0;
    for (let y = 0; y < futureYears; y++) {
      totalAnnualPensionAtRetirement += singleYearPensionAccrual * Math.pow(1.015, y);
    }

    // Optional Lump Sum Commutation (£1 of annual pension exchanged for £12 tax-free cash)
    // Maximum HMRC commutation under 2015 scheme is 3/7ths (~42.85%) of initial uncommuted pension,
    // which yields ~5.14x the reduced annual pension (or ~25% of lifetime value).
    const commutedPensionPortion = takeMaxLumpSum ? totalAnnualPensionAtRetirement * (3 / 10) : 0;
    const taxFreeLumpSum = commutedPensionPortion * 12;
    const finalAnnualPension = totalAnnualPensionAtRetirement - commutedPensionPortion;
    const finalMonthlyPension = finalAnnualPension / 12;

    // Total net contributions paid by employee over futureYears
    const totalNetPaidByEmployee = trueMonthlyNetCost * 12 * futureYears;
    // Estimated 20-year retirement payout value (20 yrs * annual pension + lump sum)
    const estimated20YrRetirementValue = finalAnnualPension * 20 + taxFreeLumpSum;

    return {
      pensionablePay,
      employeeAnnualGross,
      employeeMonthlyGross,
      trueMonthlyNetCost,
      monthlyTaxSaved,
      employerAnnualContribution,
      employerMonthlyContribution,
      singleYearPensionAccrual,
      totalAnnualPensionAtRetirement,
      taxFreeLumpSum,
      finalAnnualPension,
      finalMonthlyPension,
      totalNetPaidByEmployee,
      estimated20YrRetirementValue,
    };
  }, [withPension, optedOut, futureYears, takeMaxLumpSum]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Controls */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">2015 CARE Pension Setup</h2>
            <p className="text-xs text-slate-500">1/54th accrual • CPI + 1.5% active revaluation</p>
          </div>
        </div>

        {/* Band & Experience Step */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pen-band" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Pay Band
            </label>
            <select
              id="pen-band"
              value={band}
              onChange={(e) => {
                setBand(e.target.value);
                setStepIndex(0);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {nhsData.bands.map((b) => (
                <option key={b.band} value={b.band}>
                  {b.band}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pen-step" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Experience Step
            </label>
            <select
              id="pen-step"
              value={safeStepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {selectedBandObj.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} ({formatCurrency(pt.annualSalary)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* London HCAS & Contracted Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pen-hcas" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              HCAS Weighting
            </label>
            <select
              id="pen-hcas"
              value={hcasZone}
              onChange={(e) => setHcasZone(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="standard">National Standard (0%)</option>
              <option value="inner-london">Inner London (+20%)</option>
              <option value="outer-london">Outer London (+15%)</option>
              <option value="fringe">London Fringe (+5%)</option>
            </select>
          </div>

          <div>
            <label htmlFor="pen-hours" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Contracted Hours / Wk
            </label>
            <select
              id="pen-hours"
              value={contractedHours}
              onChange={(e) => setContractedHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={37.5}>37.5 hrs (1.0 FTE)</option>
              <option value={34.5}>34.5 hrs (0.92 FTE)</option>
              <option value={30}>30.0 hrs (0.8 FTE)</option>
              <option value={22.5}>22.5 hrs (0.6 FTE)</option>
              <option value={18.75}>18.75 hrs (0.5 FTE)</option>
            </select>
          </div>
        </div>

        {/* Years of Active NHS Service */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="pen-years" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Years Contributing to 2015 Scheme
            </label>
            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {futureYears} Years
            </span>
          </div>
          <input
            id="pen-years"
            type="range"
            min={1}
            max={40}
            step={1}
            value={futureYears}
            onChange={(e) => setFutureYears(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[5, 10, 15, 20, 25, 30, 35].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setFutureYears(yr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  futureYears === yr
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {yr} yrs
              </button>
            ))}
          </div>
        </div>

        {/* Lump Sum Commutation Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Retirement Lump Sum Option (£1 : £12 Commutation)
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => setTakeMaxLumpSum(false)}
              className={`text-left p-3 rounded-xl border transition-all ${
                !takeMaxLumpSum
                  ? "bg-indigo-50/90 border-indigo-600 text-slate-900 ring-2 ring-indigo-500/20"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <p className="text-xs sm:text-sm font-extrabold">Maximum Annual Pension (£0 Lump Sum)</p>
              <p className="text-[11px] text-slate-500">Keep 100% of your accrued annual pension for life</p>
            </button>
            <button
              type="button"
              onClick={() => setTakeMaxLumpSum(true)}
              className={`text-left p-3 rounded-xl border transition-all ${
                takeMaxLumpSum
                  ? "bg-indigo-50/90 border-indigo-600 text-slate-900 ring-2 ring-indigo-500/20"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <p className="text-xs sm:text-sm font-extrabold">Take Tax-Free Cash Lump Sum (£12 per £1)</p>
              <p className="text-[11px] text-slate-500">Exchange 30% of annual pension for a tax-free retirement lump sum</p>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-7 space-y-6">
        {/* Hero Retirement & Contribution Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              2015 NHS CARE Scheme • {withPension.pensionTierLabel} Tier
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {futureYears} Years Active Membership (Today&apos;s £ Value)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Guaranteed Annual Pension</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1">
                {formatCurrency(Math.round(pensionModel.finalAnnualPension))}
                <span className="text-sm font-bold text-emerald-200">/yr</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {formatCurrency(Math.round(pensionModel.finalMonthlyPension))}/mo index-linked for life
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tax-Free Cash Lump Sum</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {formatCurrency(Math.round(pensionModel.taxFreeLumpSum))}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {takeMaxLumpSum ? "Paid tax-free at retirement" : "Select commutation to take cash"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Yearly Pot Added (1/54th)</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-300 mt-1">
                +{formatCurrency(Math.round(pensionModel.singleYearPensionAccrual))}
                <span className="text-sm font-bold text-indigo-200">/yr</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Revalued by CPI + 1.5% every April
              </p>
            </div>
          </div>

          {/* Monthly Cost & Tax Relief Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 text-xs">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Payslip Gross Deduction ({withPension.pensionTierLabel})
              </p>
              <p className="text-xl font-extrabold text-white mt-1">
                {formatCurrency(Math.round(pensionModel.employeeMonthlyGross))}/mo
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                ({formatCurrency(Math.round(pensionModel.employeeAnnualGross))}/yr before tax relief)
              </p>
            </div>

            <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-400/20">
              <p className="text-emerald-300 font-semibold uppercase tracking-wider text-[10px]">
                True Net Take-Home Cost
              </p>
              <p className="text-xl font-extrabold text-emerald-400 mt-1">
                {formatCurrency(Math.round(pensionModel.trueMonthlyNetCost))}/mo
              </p>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                Saves {formatCurrency(Math.round(pensionModel.monthlyTaxSaved))}/mo in PAYE Income Tax!
              </p>
            </div>

            <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-400/20">
              <p className="text-indigo-300 font-semibold uppercase tracking-wider text-[10px]">
                NHS Employer Contribution (23.78%)
              </p>
              <p className="text-xl font-extrabold text-indigo-300 mt-1">
                +{formatCurrency(Math.round(pensionModel.employerMonthlyContribution))}/mo
              </p>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                ({formatCurrency(Math.round(pensionModel.employerAnnualContribution))}/yr funded by NHS Trust)
              </p>
            </div>
          </div>

          <div className="pt-5">
            <ShareBreakdownButton
              variant="dark"
              label="Share NHS Pension Projection"
              url="https://netpayscale.uk/pension-calculator/"
              shareText={`NHS ${band} 2015 CARE Pension Projection (${futureYears} Yrs):\n• Guaranteed Annual Pension: ${formatCurrency(Math.round(pensionModel.finalAnnualPension))}/yr (${formatCurrency(Math.round(pensionModel.finalMonthlyPension))}/mo for life)\n• Tax-Free Cash Lump Sum: ${formatCurrency(Math.round(pensionModel.taxFreeLumpSum))}\n• True Monthly Net Cost (After Tax Relief): ${formatCurrency(Math.round(pensionModel.trueMonthlyNetCost))}/mo\nCalculate yours: https://netpayscale.uk/pension-calculator/`}
            />
          </div>
        </div>

        {/* Value Comparison: Total Employee Net Cost vs 20-Year Retirement Payout */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Why Opting Out of the NHS Pension Costs You Hundreds of Thousands
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total net take-home pay sacrificed over {futureYears} years vs. guaranteed 20-year retirement payout
              </p>
            </div>
            <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Total Net Cost Over {futureYears} Years
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(Math.round(pensionModel.totalNetPaidByEmployee))}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                After automatic PAYE tax relief ({formatCurrency(Math.round(pensionModel.trueMonthlyNetCost))}/mo)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Estimated 20-Year Retirement Payout
              </p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                {formatCurrency(Math.round(pensionModel.estimated20YrRetirementValue))}
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Includes {formatCurrency(Math.round(pensionModel.taxFreeLumpSum))} lump sum + 20 yrs guaranteed income
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50/70 rounded-2xl border border-indigo-200/80 p-5 flex gap-3.5">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
            <p className="font-bold text-slate-900">
              How the 2015 NHS CARE Scheme Protects You Against Inflation:
            </p>
            <p>
              Unlike private defined-contribution pots that fluctuate with the stock market, the 2015 NHS Pension is a sovereign-backed <strong>Career Average Revalued Earnings (CARE)</strong> defined benefit scheme. Every year you bank <strong>1/54th</strong> of your pensionable pay, and while you remain an active NHS member, your entire banked pot is uplifted every April by <strong>Consumer Price Index (CPI) inflation PLUS 1.5%</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
