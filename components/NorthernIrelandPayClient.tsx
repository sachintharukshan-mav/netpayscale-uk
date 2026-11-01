"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

type StudentLoanPlan = CalculatorInputs["studentLoan"];

export const HSCNI_2025_26_SALARIES: Record<string, number[]> = {
  "Band 2": [24465],
  "Band 3": [24937, 26598],
  "Band 4": [27485, 30162],
  "Band 5": [31049, 33487, 37796],
  "Band 6": [38682, 40823, 46580],
  "Band 7": [47810, 50273, 54710],
  "Band 8a": [55690, 58487, 62682],
  "Band 8b": [64455, 68631, 74896],
  "Band 8c": [76964, 81652, 88682],
  "Band 8d": [91342, 96941, 105338],
  "Band 9": [109179, 115763, 125637],
};

const NI_ARREARS_WINDOWS = [
  { months: 7, label: "7 Months Accrued (Apr – Oct 2026 · Current as of 1 Nov)" },
  { months: 8, label: "8 Months Accrued (Apr – Nov 2026 · If Paid in Dec)" },
  { months: 9, label: "9 Months Accrued (Apr – Dec 2026 · If Paid in Jan 2027)" },
  { months: 10, label: "10 Months Accrued (Apr – Jan 2027 · If Paid in Feb 2027)" },
  { months: 11, label: "11 Months Accrued (Apr – Feb 2027 · If Paid in Mar 2027)" },
  { months: 12, label: "Full 12 Months Accrued (Apr 2026 – Mar 2027)" },
];

export function NorthernIrelandPayClient() {
  const [selectedBand, setSelectedBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [arrearsMonths, setArrearsMonths] = useState<number>(7);
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>("plan1"); // NI mostly Plan 1
  const [pensionOptedOut, setPensionOptedOut] = useState<boolean>(false);

  const bandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === selectedBand) || nhsData.bands[3],
    [selectedBand]
  );
  const safeStep = Math.min(stepIndex, bandObj.points.length - 1);

  const niCalc = useMemo(() => {
    const fte = contractedHours / 37.5;
    const pay2026Parity = calculateNHSPay({
      band: selectedBand,
      stepIndex: safeStep,
      hcasZone: "standard",
      contractedHours,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut,
      isScottishTax: false,
      studentLoan,
    });

    const fte2025Base =
      HSCNI_2025_26_SALARIES[selectedBand]?.[safeStep] ||
      Math.round(pay2026Parity.fullTimeBaseSalary / 1.033);
    const fte2026Base = pay2026Parity.fullTimeBaseSalary;

    const gross2025Annual = fte2025Base * fte;
    const gross2026Annual = fte2026Base * fte;
    const hourly2025 = Math.round((fte2025Base / 1955.36) * 100) / 100;
    const hourly2026 = pay2026Parity.hourlyRate;

    // Calculate current 2025/26 net pay in payment in Northern Ireland
    const tier2025 =
      nhsData.pensionTiers.find((t) => fte2025Base <= t.max) ||
      nhsData.pensionTiers[nhsData.pensionTiers.length - 1];
    const pensionRate = pensionOptedOut ? 0 : tier2025.rate;
    const pension2025Annual = gross2025Annual * pensionRate;
    const taxable2025 = Math.max(0, gross2025Annual - pension2025Annual);
    let pa = 12570;
    if (taxable2025 > 100000) {
      pa = Math.max(0, 12570 - (taxable2025 - 100000) / 2);
    }
    const abovePa = Math.max(0, taxable2025 - pa);
    const addSlice = Math.max(0, taxable2025 - 125140);
    const basicSlice = Math.min(abovePa, 37700);
    const higherSlice = Math.max(0, abovePa - basicSlice - addSlice);
    const tax2025Annual =
      basicSlice * 0.2 + higherSlice * 0.4 + addSlice * 0.45;

    let ni2025Annual = 0;
    if (gross2025Annual > 12570) {
      ni2025Annual =
        (Math.min(gross2025Annual, 50270) - 12570) * 0.08 +
        Math.max(0, gross2025Annual - 50270) * 0.02;
    }

    let sl2025Annual = 0;
    if (studentLoan === "plan1" && gross2025Annual > 24990) {
      sl2025Annual = (gross2025Annual - 24990) * 0.09;
    } else if (studentLoan === "plan2" && gross2025Annual > 27295) {
      sl2025Annual = (gross2025Annual - 27295) * 0.09;
    } else if (studentLoan === "plan4" && gross2025Annual > 31395) {
      sl2025Annual = (gross2025Annual - 31395) * 0.09;
    } else if (studentLoan === "plan5" && gross2025Annual > 25000) {
      sl2025Annual = (gross2025Annual - 25000) * 0.09;
    } else if (studentLoan === "postgrad" && gross2025Annual > 21000) {
      sl2025Annual = (gross2025Annual - 21000) * 0.06;
    }

    const net2025Annual = Math.max(
      0,
      gross2025Annual - pension2025Annual - tax2025Annual - ni2025Annual - sl2025Annual
    );
    const net2025Monthly = net2025Annual / 12;
    const net2026Monthly = pay2026Parity.netPay.monthly;
    const monthlyNetGap = net2026Monthly - net2025Monthly;

    // Backpay arrears accrued since 1 April 2026
    const annualGrossShortfall = gross2026Annual - gross2025Annual;
    const monthlyGrossShortfall = annualGrossShortfall / 12;
    const grossArrearsOwed = monthlyGrossShortfall * arrearsMonths;

    const arrearsPension = grossArrearsOwed * pay2026Parity.pensionRate;
    const marginalTax = gross2026Annual > 50270 ? 0.4 : 0.2;
    const marginalNi = gross2026Annual > 50270 ? 0.02 : 0.08;
    const slRate =
      studentLoan === "none" ? 0 : studentLoan === "postgrad" ? 0.06 : 0.09;
    const arrearsTax = (grossArrearsOwed - arrearsPension) * marginalTax;
    const arrearsNi = grossArrearsOwed * marginalNi;
    const arrearsSl = gross2025Annual > 24990 ? grossArrearsOwed * slRate : 0;

    const netArrearsOwed = Math.max(
      0,
      grossArrearsOwed - arrearsPension - arrearsTax - arrearsNi - arrearsSl
    );

    return {
      stepLabel: bandObj.points[safeStep].step,
      fte2025Base,
      fte2026Base,
      hourly2025,
      hourly2026,
      net2025Monthly,
      net2026Monthly,
      monthlyNetGap,
      annualGrossShortfall,
      grossArrearsOwed,
      arrearsPension,
      arrearsTax,
      arrearsNi,
      arrearsSl,
      netArrearsOwed,
      pensionLabel: pay2026Parity.pensionTierLabel,
    };
  }, [
    selectedBand,
    safeStep,
    arrearsMonths,
    contractedHours,
    studentLoan,
    pensionOptedOut,
    bandObj,
  ]);

  const shareText = `HSC Northern Ireland 2026/27 Unpaid 3.3% Pay Rise & Backpay Calculator (${selectedBand}): Currently paid £${niCalc.fte2025Base.toLocaleString("en-GB")} (2025/26 rate) vs £${niCalc.fte2026Base.toLocaleString("en-GB")} in England. Accrued ${arrearsMonths}-month backpay owed since 1 April 2026 = £${Math.round(niCalc.grossArrearsOwed)} gross (£${Math.round(niCalc.netArrearsOwed)} net):`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Controls */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-950">
              Interactive HSCNI 2025/26 vs. 2026/27 (+3.3%) &amp; Accrued Backpay Calculator
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Compare your current Northern Ireland 2025/26 pay against the unpaid 3.3% 2026/27 award and calculate your accrued backpay since 1 April 2026
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
            RCN Ballot Closes 20 Nov 2026
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ni-band"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
            >
              HSCNI Agenda for Change Band
            </label>
            <select
              id="ni-band"
              value={selectedBand}
              onChange={(e) => {
                setSelectedBand(e.target.value);
                setStepIndex(0);
              }}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
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
              htmlFor="ni-step"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
            >
              Spine Point / Experience Step
            </label>
            <select
              id="ni-step"
              value={safeStep}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
            >
              {bandObj.points.map((pt, idx) => {
                const ni25 =
                  HSCNI_2025_26_SALARIES[selectedBand]?.[idx] ||
                  Math.round(pt.annualSalary / 1.033);
                return (
                  <option key={pt.step} value={idx}>
                    {pt.step} — Paid: {formatCurrency(ni25)} → 3.3%:{" "}
                    {formatCurrency(pt.annualSalary)}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ni-months"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
            >
              Accrued Arrears Months Since 1 April 2026
            </label>
            <select
              id="ni-months"
              value={arrearsMonths}
              onChange={(e) => setArrearsMonths(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
            >
              {NI_ARREARS_WINDOWS.map((w) => (
                <option key={w.months} value={w.months}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="ni-hours"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
            >
              Contracted Hours / Week
            </label>
            <select
              id="ni-hours"
              value={contractedHours}
              onChange={(e) => setContractedHours(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
            >
              <option value={37.5}>37.5 hrs/wk (Full-Time 1.0 WTE)</option>
              <option value={30}>30.0 hrs/wk (0.80 WTE)</option>
              <option value={22.5}>22.5 hrs/wk (0.60 WTE)</option>
              <option value={18.75}>18.75 hrs/wk (0.50 WTE)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
          <div>
            <label
              htmlFor="ni-loan"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
            >
              Student Loan (NI Default: Plan 1)
            </label>
            <select
              id="ni-loan"
              value={studentLoan}
              onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900"
            >
              <option value="plan1">Plan 1 (Northern Ireland £24,990)</option>
              <option value="none">No Student Loan</option>
              <option value="plan2">Plan 2 (England/Wales £27,295)</option>
              <option value="postgrad">Postgraduate Loan (6%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              HSC Pension Scheme
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
                ? `Active (${niCalc.pensionLabel} Tier)`
                : "Opted Out (0%)"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Accrued Backpay & Parity Comparison */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-gradient-to-br from-[#003087] via-[#005EB8] to-[#0072CE] rounded-2xl p-6 sm:p-7 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Unpaid HSCNI Backpay Owed ({arrearsMonths} Months)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white">
              +{formatCurrency(Math.round(niCalc.annualGrossShortfall))}/yr Parity Gap
            </span>
          </div>
          <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono my-1 text-emerald-300">
            {formatCurrency(Math.round(niCalc.netArrearsOwed))} net
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Gross arrears accrued since 1 April 2026:{" "}
            <strong className="text-white">
              {formatCurrency(Math.round(niCalc.grossArrearsOwed))}
            </strong>{" "}
            ({arrearsMonths} months). Implementing the 3.3% PRB award increases
            your monthly net pay by{" "}
            <strong className="text-white">
              +{formatCurrency(Math.round(niCalc.monthlyNetGap))}/mo
            </strong>
            .
          </p>

          <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[10px] text-blue-100 uppercase">
                Paid Now (2025/26 Scale)
              </div>
              <div className="text-base font-extrabold font-mono mt-0.5">
                {formatCurrency(Math.round(niCalc.net2025Monthly))}/mo
              </div>
              <div className="text-[10px] text-blue-200">
                {formatCurrency(niCalc.fte2025Base)} ({formatHourlyRate(niCalc.hourly2025)})
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[10px] text-blue-100 uppercase">
                With 3.3% Parity (2026/27)
              </div>
              <div className="text-base font-extrabold font-mono mt-0.5 text-emerald-300">
                {formatCurrency(Math.round(niCalc.net2026Monthly))}/mo
              </div>
              <div className="text-[10px] text-blue-200">
                {formatCurrency(niCalc.fte2026Base)} ({formatHourlyRate(niCalc.hourly2026)})
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
            Accrued Backpay Lump-Sum Breakdown ({arrearsMonths} Months)
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">
                Gross Backpay Accrued (since 1 Apr 2026)
              </span>
              <span className="font-bold text-zinc-900">
                {formatCurrency(Math.round(niCalc.grossArrearsOwed))}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">
                HSC Pension Arrears ({niCalc.pensionLabel})
              </span>
              <span className="text-amber-700 font-semibold">
                −{formatCurrency(Math.round(niCalc.arrearsPension))}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">
                PAYE Tax &amp; Class 1 NI on Arrears
              </span>
              <span className="text-rose-600 font-semibold">
                −{formatCurrency(Math.round(niCalc.arrearsTax + niCalc.arrearsNi))}
              </span>
            </div>
            {niCalc.arrearsSl > 0 && (
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="font-sans text-zinc-600">
                  Student Loan Deduction
                </span>
                <span className="text-rose-600 font-semibold">
                  −{formatCurrency(Math.round(niCalc.arrearsSl))}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-sm font-extrabold text-emerald-700">
              <span className="font-sans">Net Backpay Cash Owed</span>
              <span>{formatCurrency(Math.round(niCalc.netArrearsOwed))}</span>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={shareText}
            url="https://netpayscale.uk/northern-ireland-pay-calculator/"
            variant="light"
            label="Share HSCNI Backpay Calculation"
          />
        </div>
      </div>
    </div>
  );
}

export default NorthernIrelandPayClient;
