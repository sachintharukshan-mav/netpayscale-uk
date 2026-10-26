"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { CalendarClock } from "lucide-react";

type HcasZone = CalculatorInputs["hcasZone"];
type StudentLoanPlan = CalculatorInputs["studentLoan"];

const ARREARS_MONTHS = [
  { months: 4, label: "August Payday (4 Months Arrears: Apr–Jul)" },
  { months: 5, label: "September Payday (5 Months Arrears: Apr–Aug)" },
  { months: 6, label: "October Payday (6 Months Arrears: Apr–Sep)" },
  { months: 7, label: "November Payday (7 Months Arrears: Apr–Oct)" },
  { months: 8, label: "December Payday (8 Months Arrears: Apr–Nov)" },
  { months: 3, label: "July Payday (3 Months Arrears: Apr–Jun)" },
  { months: 9, label: "January Payday (9 Months Arrears: Apr–Dec)" },
  { months: 12, label: "Full 12 Months Back-Pay (Apr–Mar)" },
];

export function BackPayCalculatorClient() {
  const [selectedBand, setSelectedBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [upliftPercent, setUpliftPercent] = useState<number>(3.3);
  const [arrearsMonths, setArrearsMonths] = useState<number>(6);
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

  const results = useMemo(() => {
    const fte = contractedHours / 37.5;
    const newPay = calculateNHSPay({
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

    const newAnnualGross = newPay.grossPay.annual;
    const oldAnnualGross = newAnnualGross / (1 + upliftPercent / 100);
    const annualPayRiseGross = newAnnualGross - oldAnnualGross;
    const monthlyPayRiseGross = annualPayRiseGross / 12;

    const grossBackPayArrears = monthlyPayRiseGross * arrearsMonths;

    const pensionRate = pensionOptedOut ? 0 : newPay.pensionRate;
    const backPayPensionDeduction = grossBackPayArrears * pensionRate;
    const taxableBackPay = grossBackPayArrears - backPayPensionDeduction;

    const annualizedPaydayGross = newAnnualGross + grossBackPayArrears;
    const annualizedTaxable = Math.max(
      0,
      annualizedPaydayGross * (1 - pensionRate) - 12570
    );

    let marginalTaxRate = 0;
    if (annualizedPaydayGross * (1 - pensionRate) > 12570) {
      if (isScottishTax) {
        marginalTaxRate = annualizedTaxable > 31092 ? 0.42 : 0.21;
      } else {
        marginalTaxRate = annualizedTaxable > 37700 ? 0.40 : 0.20;
      }
    }

    const backPayTaxDeduction = Math.max(0, taxableBackPay * marginalTaxRate);

    const normalMonthlyGross = newAnnualGross / 12;
    const paydayTotalGross = normalMonthlyGross + grossBackPayArrears;
    const calcMonthlyNI = (moGross: number) => {
      if (moGross <= 1048) return 0;
      const mainSlice = Math.max(0, Math.min(moGross, 4189) - 1048);
      const upperSlice = Math.max(0, moGross - 4189);
      return mainSlice * 0.08 + upperSlice * 0.02;
    };
    const backPayNIDeduction = Math.max(
      0,
      calcMonthlyNI(paydayTotalGross) - calcMonthlyNI(normalMonthlyGross)
    );

    const slRate =
      studentLoan === "none" ? 0 : studentLoan === "postgrad" ? 0.06 : 0.09;
    const slThresholdMo =
      studentLoan === "plan1"
        ? 24990 / 12
        : studentLoan === "plan2"
        ? 27295 / 12
        : studentLoan === "plan4"
        ? 31395 / 12
        : studentLoan === "plan5"
        ? 25000 / 12
        : studentLoan === "postgrad"
        ? 21000 / 12
        : Infinity;

    const backPayStudentLoan =
      normalMonthlyGross > slThresholdMo
        ? grossBackPayArrears * slRate
        : Math.max(0, (paydayTotalGross - slThresholdMo) * slRate);

    const netBackPayArrears = Math.max(
      0,
      grossBackPayArrears -
        backPayPensionDeduction -
        backPayTaxDeduction -
        backPayNIDeduction -
        backPayStudentLoan
    );

    const normalMonthlyNet = newPay.netPay.monthly;
    const ongoingMonthlyNetGain = Math.max(
      0,
      monthlyPayRiseGross *
        (1 - pensionRate - marginalTaxRate * (1 - pensionRate) - 0.08 - slRate)
    );
    const totalBumperPaydayNet = normalMonthlyNet + netBackPayArrears;

    return {
      fte,
      oldAnnualGross,
      newAnnualGross,
      annualPayRiseGross,
      monthlyPayRiseGross,
      ongoingMonthlyNetGain,
      grossBackPayArrears,
      backPayPensionDeduction,
      backPayTaxDeduction,
      backPayNIDeduction,
      backPayStudentLoan,
      netBackPayArrears,
      normalMonthlyNet,
      totalBumperPaydayNet,
      pensionRateLabel: newPay.pensionTierLabel,
      retentionPercent:
        grossBackPayArrears > 0
          ? Math.round((netBackPayArrears / grossBackPayArrears) * 100)
          : 0,
    };
  }, [
    selectedBand,
    safeStepIndex,
    upliftPercent,
    arrearsMonths,
    contractedHours,
    hcasZone,
    isScottishTax,
    studentLoan,
    pensionOptedOut,
  ]);

  const shareText = `💷 My 2026/27 NHS Back-Pay & ${upliftPercent}% Pay Rise Breakdown (${selectedBand}):
• Gross Back-Pay (${arrearsMonths} months): ${formatCurrency(results.grossBackPayArrears)}
• Net Back-Pay Kept After Tax & Pension: ${formatCurrency(results.netBackPayArrears)}
• Total Bumper Payday Net Deposit: ${formatCurrency(results.totalBumperPaydayNet)}
• Permanent Monthly Net Rise: +${formatCurrency(results.ongoingMonthlyNetGain)}/mo`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Controls */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              1. Configure Your NHS Band &amp; Arrears Window
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Models backdated Agenda for Change pay award arrears from 1 April to your payment month
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#005EB8] border border-blue-200">
            <CalendarClock className="w-3.5 h-3.5" />
            +{upliftPercent}% Uplift
          </span>
        </div>

        {/* Band Selector */}
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
            >
              {bandObj.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} — {formatCurrency(pt.annualSalary)}/yr
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Arrears Month & Pay Award % */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Back-Pay Payment Month (Arrears Since 1 Apr)
            </label>
            <select
              value={arrearsMonths}
              onChange={(e) => setArrearsMonths(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
            >
              {ARREARS_MONTHS.map((m) => (
                <option key={m.months} value={m.months}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Pay Award Uplift % (Default 3.3% AfC)
            </label>
            <div className="flex gap-2">
              {[3.3, 4.0, 5.0, 5.5].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setUpliftPercent(pct)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    upliftPercent === pct
                      ? "bg-[#005EB8] text-white border-[#005EB8] shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hours & HCAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Contracted Hours / Week ({results.fte.toFixed(2)} WTE)
            </label>
            <select
              value={contractedHours}
              onChange={(e) => setContractedHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
            >
              <option value={37.5}>37.5 hrs/wk (Full-Time 1.0 WTE)</option>
              <option value={34.5}>34.5 hrs/wk (3 Long Shifts · 0.92 WTE)</option>
              <option value={30}>30.0 hrs/wk (4 Days · 0.80 WTE)</option>
              <option value={22.5}>22.5 hrs/wk (3 Days · 0.60 WTE)</option>
              <option value={18.75}>18.75 hrs/wk (Half-Time · 0.50 WTE)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              London Weighting (HCAS Zone)
            </label>
            <select
              value={hcasZone}
              onChange={(e) => setHcasZone(e.target.value as HcasZone)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
            >
              <option value="standard">Rest of UK (0% HCAS)</option>
              <option value="fringe">London Fringe (+5% HCAS)</option>
              <option value="outer-london">Outer London (+15% HCAS)</option>
              <option value="inner-london">Inner London (+20% HCAS)</option>
            </select>
          </div>
        </div>

        {/* Tax Region, Student Loan & Pension */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
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
              <option value="scotland">Scotland (6-Band PAYE)</option>
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
              <option value="none">No Student Loan</option>
              <option value="plan2">Plan 2 (Post-2012)</option>
              <option value="plan5">Plan 5 (Post-2023)</option>
              <option value="plan1">Plan 1 (Pre-2012)</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="postgrad">Postgraduate (6%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              NHS Pension
            </label>
            <button
              type="button"
              onClick={() => setPensionOptedOut(!pensionOptedOut)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                !pensionOptedOut
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
            >
              {!pensionOptedOut
                ? `Active (${results.pensionRateLabel} Tier)`
                : "Opted Out (0%)"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Back-Pay Breakdown */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-gradient-to-br from-[#003087] via-[#005EB8] to-[#0072CE] rounded-2xl p-6 sm:p-7 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Net Back-Pay Arrears Kept ({arrearsMonths} Months)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white">
              {results.retentionPercent}% Kept After Tax
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono my-1">
            {formatCurrency(results.netBackPayArrears)}
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            From a gross back-pay lump sum of{" "}
            <strong className="text-white">
              {formatCurrency(results.grossBackPayArrears)}
            </strong>{" "}
            ({formatCurrency(results.monthlyPayRiseGross)}/mo × {arrearsMonths}{" "}
            months since 1 April).
          </p>

          <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[11px] text-blue-100 font-medium">
                Bumper Payday Total Net
              </div>
              <div className="text-lg font-extrabold font-mono mt-0.5">
                {formatCurrency(results.totalBumperPaydayNet)}
              </div>
              <div className="text-[10px] text-blue-200">
                Normal net + arrears combined
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[11px] text-blue-100 font-medium">
                New Permanent Net Gain
              </div>
              <div className="text-lg font-extrabold font-mono mt-0.5 text-emerald-300">
                +{formatCurrency(results.ongoingMonthlyNetGain)}/mo
              </div>
              <div className="text-[10px] text-blue-200">
                +{formatCurrency(results.annualPayRiseGross)}/yr gross rise
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Deductions Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Arrears Lump-Sum Payslip Deductions
          </h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                Gross Arrears ({arrearsMonths} mos @ +{upliftPercent}%)
              </span>
              <span className="font-bold font-mono text-slate-900">
                {formatCurrency(results.grossBackPayArrears)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                NHS Pension Arrears ({results.pensionRateLabel})
              </span>
              <span className="font-semibold font-mono text-amber-700">
                -{formatCurrency(results.backPayPensionDeduction)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">PAYE Income Tax on Arrears</span>
              <span className="font-semibold font-mono text-rose-600">
                -{formatCurrency(results.backPayTaxDeduction)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Class 1 National Insurance</span>
              <span className="font-semibold font-mono text-rose-600">
                -{formatCurrency(results.backPayNIDeduction)}
              </span>
            </div>
            {results.backPayStudentLoan > 0 && (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Student Loan Deduction</span>
                <span className="font-semibold font-mono text-rose-600">
                  -{formatCurrency(results.backPayStudentLoan)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-base font-extrabold text-emerald-700">
              <span>Net Back-Pay Cash Kept</span>
              <span className="font-mono">
                {formatCurrency(results.netBackPayArrears)}
              </span>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={shareText}
            url="https://netpayscale.uk/pay-rise-backpay-calculator/"
            variant="light"
            label="Share Back-Pay Calculation"
          />
        </div>
      </div>
    </div>
  );
}
export default BackPayCalculatorClient;
