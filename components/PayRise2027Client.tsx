"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

type HcasZone = CalculatorInputs["hcasZone"];
type StudentLoanPlan = CalculatorInputs["studentLoan"];

const SCENARIO_UPLIFTS = [
  { pct: 2.4, label: "2.4% (DHSC Proposal)", badge: "19 Oct 2026 Evidence" },
  { pct: 3.0, label: "3.0% (CPI Track)", badge: "Inflation Match" },
  { pct: 3.3, label: "3.3% (2026/27 Award)", badge: "Last Year Repeat" },
  { pct: 4.0, label: "4.0% (PRB Above-Gov)", badge: "Mid-Range" },
  { pct: 5.0, label: "5.0% (Union Claim)", badge: "Restorative" },
];

export function PayRise2027Client() {
  const [selectedBand, setSelectedBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(2); // Default Top of Band 5 (£39,043)
  const [upliftPct, setUpliftPct] = useState<number>(2.4);
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [hcasZone, setHcasZone] = useState<HcasZone>("standard");
  const [isScottishTax, setIsScottishTax] = useState<boolean>(false);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>("none");
  const [pensionOptedOut, setPensionOptedOut] = useState<boolean>(false);

  const bandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === selectedBand) || nhsData.bands[3],
    [selectedBand]
  );

  const safeStepIndex = Math.min(stepIndex, bandObj.points.length - 1);

  const calc = useMemo(() => {
    const fte = contractedHours / 37.5;
    const current2026 = calculateNHSPay({
      band: selectedBand,
      stepIndex: safeStepIndex,
      hcasZone,
      contractedHours,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut,
      isScottishTax,
      studentLoan,
    });

    const base2026Fte = current2026.fullTimeBaseSalary;
    const base2027Fte = Math.round(base2026Fte * (1 + upliftPct / 100));
    const hourly2026 = current2026.hourlyRate;
    const hourly2027 = Math.round((base2027Fte / 1955.36) * 100) / 100;

    const proRataBase2027 = base2027Fte * fte;

    // HCAS on 2027 salary (assuming caps scale by upliftPct or current caps)
    let hcas2027 = 0;
    const capMultiplier = 1 + upliftPct / 100;
    if (hcasZone === "inner-london") {
      hcas2027 = Math.min(
        Math.round(8746 * capMultiplier) * fte,
        Math.max(Math.round(5794 * capMultiplier) * fte, proRataBase2027 * 0.2)
      );
    } else if (hcasZone === "outer-london") {
      hcas2027 = Math.min(
        Math.round(6137 * capMultiplier) * fte,
        Math.max(Math.round(4870 * capMultiplier) * fte, proRataBase2027 * 0.15)
      );
    } else if (hcasZone === "fringe") {
      hcas2027 = Math.min(
        Math.round(2270 * capMultiplier) * fte,
        Math.max(Math.round(1346 * capMultiplier) * fte, proRataBase2027 * 0.05)
      );
    }

    const gross2027Annual = proRataBase2027 + hcas2027;
    const pensionable2027 = gross2027Annual;

    // Pension tier check (based on WTE pensionable pay)
    const wtePensionable2027 = base2027Fte + (fte > 0 ? hcas2027 / fte : 0);
    const tier2027 =
      nhsData.pensionTiers.find((t) => wtePensionable2027 <= t.max) ||
      nhsData.pensionTiers[nhsData.pensionTiers.length - 1];
    const pensionRate2027 = pensionOptedOut ? 0 : tier2027.rate;
    const pension2027Annual = pensionable2027 * pensionRate2027;

    // Taxable pay (frozen £12,570 / £50,270 thresholds confirmed in 28 Oct 2026 Budget)
    const taxable2027 = Math.max(0, gross2027Annual - pension2027Annual);
    let pa = 12570;
    if (taxable2027 > 100000) {
      pa = Math.max(0, 12570 - (taxable2027 - 100000) / 2);
    }
    const abovePa = Math.max(0, taxable2027 - pa);

    let tax2027Annual = 0;
    if (isScottishTax) {
      const topSlice = Math.max(0, taxable2027 - 125140);
      const b1 = Math.min(abovePa, 2306);
      const b2 = Math.min(Math.max(0, abovePa - 2306), 11685);
      const b3 = Math.min(Math.max(0, abovePa - 2306 - 11685), 17101);
      const b4 = Math.min(Math.max(0, abovePa - 2306 - 11685 - 17101), 31338);
      const b5 = Math.max(0, abovePa - (b1 + b2 + b3 + b4) - topSlice);
      tax2027Annual =
        b1 * 0.19 +
        b2 * 0.2 +
        b3 * 0.21 +
        b4 * 0.42 +
        b5 * 0.45 +
        topSlice * 0.48;
    } else {
      const addSlice = Math.max(0, taxable2027 - 125140);
      const basicSlice = Math.min(abovePa, 37700);
      const higherSlice = Math.max(0, abovePa - basicSlice - addSlice);
      tax2027Annual =
        basicSlice * 0.2 + higherSlice * 0.4 + addSlice * 0.45;
    }

    // National Insurance (8% / 2%)
    let ni2027Annual = 0;
    if (gross2027Annual > 12570) {
      const mainNi = Math.min(gross2027Annual, 50270) - 12570;
      const upperNi = Math.max(0, gross2027Annual - 50270);
      ni2027Annual = mainNi * 0.08 + upperNi * 0.02;
    }

    // Student loan
    let sl2027Annual = 0;
    if (studentLoan === "plan1" && gross2027Annual > 24990) {
      sl2027Annual = (gross2027Annual - 24990) * 0.09;
    } else if (studentLoan === "plan2" && gross2027Annual > 27295) {
      sl2027Annual = (gross2027Annual - 27295) * 0.09;
    } else if (studentLoan === "plan4" && gross2027Annual > 31395) {
      sl2027Annual = (gross2027Annual - 31395) * 0.09;
    } else if (studentLoan === "plan5" && gross2027Annual > 25000) {
      sl2027Annual = (gross2027Annual - 25000) * 0.09;
    } else if (studentLoan === "postgrad" && gross2027Annual > 21000) {
      sl2027Annual = (gross2027Annual - 21000) * 0.06;
    }

    const net2027Annual = Math.max(
      0,
      gross2027Annual -
        pension2027Annual -
        tax2027Annual -
        ni2027Annual -
        sl2027Annual
    );
    const net2027Monthly = net2027Annual / 12;

    const grossGainAnnual = gross2027Annual - current2026.grossPay.annual;
    const grossGainMonthly = grossGainAnnual / 12;
    const netGainAnnual = net2027Annual - current2026.netPay.annual;
    const netGainMonthly = net2027Monthly - current2026.netPay.monthly;

    const crossedPensionTier =
      !pensionOptedOut && tier2027.percentageLabel !== current2026.pensionTierLabel;

    return {
      stepLabel: bandObj.points[safeStepIndex].step,
      base2026Fte,
      base2027Fte,
      hourly2026,
      hourly2027,
      gross2026Annual: current2026.grossPay.annual,
      gross2027Annual,
      grossGainAnnual,
      grossGainMonthly,
      net2026Monthly: current2026.netPay.monthly,
      net2027Monthly,
      netGainAnnual,
      netGainMonthly,
      pension2026Monthly: current2026.pensionContribution.monthly,
      pension2027Monthly: pension2027Annual / 12,
      tax2026Monthly: current2026.incomeTax.monthly,
      tax2027Monthly: tax2027Annual / 12,
      ni2026Monthly: current2026.nationalInsurance.monthly,
      ni2027Monthly: ni2027Annual / 12,
      tier2026Label: current2026.pensionTierLabel,
      tier2027Label: pensionOptedOut ? "0%" : tier2027.percentageLabel,
      crossedPensionTier,
      retentionPct:
        grossGainAnnual > 0
          ? Math.round((netGainAnnual / grossGainAnnual) * 100)
          : 0,
    };
  }, [
    selectedBand,
    safeStepIndex,
    upliftPct,
    contractedHours,
    hcasZone,
    isScottishTax,
    studentLoan,
    pensionOptedOut,
    bandObj,
  ]);

  const shareText = `NHS 2027/28 Pay Rise Calculator (${upliftPct}% DHSC Proposal): ${selectedBand} (${calc.stepLabel}) moves from ${formatCurrency(calc.base2026Fte)} to ${formatCurrency(calc.base2027Fte)} (+${formatCurrency(calc.grossGainAnnual)}/yr gross), delivering +${formatCurrency(calc.netGainMonthly)}/mo net take-home pay:`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Controls */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-950">
              Interactive 2027/28 NHS Pay Rise &amp; Net Take-Home Simulator
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Test the government&apos;s <strong>2.4% PRB proposal (19 Oct 2026)</strong> or any custom percentage against frozen 2027/28 tax thresholds
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-[#005EB8] border border-blue-200 self-start sm:self-auto">
            +{upliftPct}% Scenario
          </span>
        </div>

        {/* Scenario Uplift Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">
            Select 2027/28 Pay Award Scenario (%)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SCENARIO_UPLIFTS.map((item) => (
              <button
                key={item.pct}
                type="button"
                onClick={() => setUpliftPct(item.pct)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  upliftPct === item.pct
                    ? "bg-[#005EB8] text-white border-[#005EB8] shadow-xs"
                    : "bg-zinc-50/80 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                <div className="font-mono font-black text-sm">+{item.pct}%</div>
                <div
                  className={`text-[10px] font-medium truncate ${
                    upliftPct === item.pct ? "text-blue-100" : "text-zinc-500"
                  }`}
                >
                  {item.badge}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Band & Step */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="pay2027-band"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
            >
              Agenda for Change Band
            </label>
            <select
              id="pay2027-band"
              value={selectedBand}
              onChange={(e) => {
                setSelectedBand(e.target.value);
                setStepIndex(0);
              }}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
            >
              {nhsData.bands.map((b) => (
                <option key={b.slug} value={b.band}>
                  {b.band} ({b.typicalRoles[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="pay2027-step"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
            >
              Experience Spine Step
            </label>
            <select
              id="pay2027-step"
              value={safeStepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
            >
              {bandObj.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} — 2026/27: {formatCurrency(pt.annualSalary)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hours & HCAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="pay2027-hours"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
            >
              Contracted Weekly Hours
            </label>
            <select
              id="pay2027-hours"
              value={contractedHours}
              onChange={(e) => setContractedHours(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
            >
              <option value={37.5}>37.5 hrs/wk (1.00 WTE Full-Time)</option>
              <option value={34.5}>34.5 hrs/wk (0.92 WTE · 3 Long Shifts)</option>
              <option value={30}>30.0 hrs/wk (0.80 WTE · 4 Days)</option>
              <option value={22.5}>22.5 hrs/wk (0.60 WTE · 3 Days)</option>
              <option value={18.75}>18.75 hrs/wk (0.50 WTE · Half-Time)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pay2027-hcas"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
            >
              London Weighting (HCAS)
            </label>
            <select
              id="pay2027-hcas"
              value={hcasZone}
              onChange={(e) => setHcasZone(e.target.value as HcasZone)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
            >
              <option value="standard">National Standard (0% HCAS)</option>
              <option value="fringe">London Fringe (+5% HCAS)</option>
              <option value="outer-london">Outer London (+15% HCAS)</option>
              <option value="inner-london">Inner London (+20% HCAS)</option>
            </select>
          </div>
        </div>

        {/* Tax Region, Student Loan & Pension */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-100">
          <div>
            <label
              htmlFor="pay2027-tax"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
            >
              Tax Jurisdiction
            </label>
            <select
              id="pay2027-tax"
              value={isScottishTax ? "scotland" : "england"}
              onChange={(e) => setIsScottishTax(e.target.value === "scotland")}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900"
            >
              <option value="england">England / Wales / NI (1257L)</option>
              <option value="scotland">Scotland (S1257L 6-Band)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="pay2027-loan"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
            >
              Student Loan Plan
            </label>
            <select
              id="pay2027-loan"
              value={studentLoan}
              onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900"
            >
              <option value="none">No Student Loan</option>
              <option value="plan2">Plan 2 (£27,295 threshold)</option>
              <option value="plan5">Plan 5 (£25,000 threshold)</option>
              <option value="plan1">Plan 1 (£24,990 threshold)</option>
              <option value="plan4">Plan 4 Scotland (£31,395)</option>
              <option value="postgrad">Postgraduate Loan (6%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              2015 CARE Pension
            </label>
            <button
              type="button"
              onClick={() => setPensionOptedOut(!pensionOptedOut)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                !pensionOptedOut
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-zinc-100 text-zinc-600 border-zinc-300"
              }`}
            >
              {!pensionOptedOut
                ? `Active (${calc.tier2027Label} Tier)`
                : "Opted Out (0%)"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live 2027/28 Results */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-gradient-to-br from-[#003087] via-[#005EB8] to-[#0072CE] rounded-2xl p-6 sm:p-7 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Projected 2027/28 Net Monthly Gain (+{upliftPct}%)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white">
              {calc.retentionPct}% of Rise Kept
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono my-1 text-emerald-300">
            +{formatCurrency(Math.round(calc.netGainMonthly))}/mo
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Annual gross rises by{" "}
            <strong className="text-white">
              +{formatCurrency(Math.round(calc.grossGainAnnual))}/yr
            </strong>{" "}
            (+{formatCurrency(Math.round(calc.grossGainMonthly))}/mo gross), yielding{" "}
            <strong className="text-white">
              +{formatCurrency(Math.round(calc.netGainAnnual))}/yr
            </strong>{" "}
            in net take-home cash after frozen tax thresholds &amp; pension.
          </p>

          <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[11px] text-blue-100 font-medium">
                2026/27 Current Net
              </div>
              <div className="text-lg font-extrabold font-mono mt-0.5">
                {formatCurrency(Math.round(calc.net2026Monthly))}/mo
              </div>
              <div className="text-[10px] text-blue-200">
                {formatCurrency(calc.base2026Fte)}/yr ({formatHourlyRate(calc.hourly2026)})
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[11px] text-blue-100 font-medium">
                2027/28 Projected Net
              </div>
              <div className="text-lg font-extrabold font-mono mt-0.5 text-emerald-300">
                {formatCurrency(Math.round(calc.net2027Monthly))}/mo
              </div>
              <div className="text-[10px] text-blue-200">
                {formatCurrency(calc.base2027Fte)}/yr ({formatHourlyRate(calc.hourly2027)})
              </div>
            </div>
          </div>
        </div>

        {calc.crossedPensionTier && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 space-y-1">
            <div className="font-bold text-amber-900">
              ⚠️ Pension Tier Cliff Alert ({calc.tier2026Label} → {calc.tier2027Label})
            </div>
            <p>
              A +{upliftPct}% uplift pushes this spine point across an NHSBSA pension tier boundary unless tier thresholds are re-indexed in April 2027.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
            2026/27 vs. 2027/28 (+{upliftPct}%) Monthly Payslip Comparison
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">Gross Monthly Pay</span>
              <span className="font-bold text-zinc-900">
                {formatCurrency(Math.round(calc.gross2026Annual / 12))} →{" "}
                {formatCurrency(Math.round(calc.gross2027Annual / 12))}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">
                NHS Pension ({calc.tier2027Label})
              </span>
              <span className="text-amber-700 font-semibold">
                −{formatCurrency(Math.round(calc.pension2026Monthly))} → −
                {formatCurrency(Math.round(calc.pension2027Monthly))}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">
                PAYE Income Tax (Frozen PA)
              </span>
              <span className="text-rose-600 font-semibold">
                −{formatCurrency(Math.round(calc.tax2026Monthly))} → −
                {formatCurrency(Math.round(calc.tax2027Monthly))}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">
                Class 1 National Insurance
              </span>
              <span className="text-rose-600 font-semibold">
                −{formatCurrency(Math.round(calc.ni2026Monthly))} → −
                {formatCurrency(Math.round(calc.ni2027Monthly))}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-extrabold text-emerald-700">
              <span className="font-sans">Net Monthly Take-Home</span>
              <span>
                {formatCurrency(Math.round(calc.net2026Monthly))} →{" "}
                {formatCurrency(Math.round(calc.net2027Monthly))} (+
                {formatCurrency(Math.round(calc.netGainMonthly))})
              </span>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={shareText}
            url="https://netpayscale.uk/nhs-pay-rise-2027/"
            variant="light"
            label="Share 2027/28 Pay Rise Breakdown"
          />
        </div>
      </div>
    </div>
  );
}

export default PayRise2027Client;
