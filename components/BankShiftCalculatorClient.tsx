"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";
import { Banknote, Clock, Sparkles, Info, TrendingUp } from "lucide-react";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

type ShiftRateType = "weekday" | "night_sat" | "sun_bh" | "overtime_15" | "overtime_20";

export function BankShiftCalculatorClient() {
  const [band, setBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(1);
  const [shiftType, setShiftType] = useState<ShiftRateType>("night_sat");
  const [shiftHours, setShiftHours] = useState<number>(11.5);
  const [shiftsPerMonth, setShiftsPerMonth] = useState<number>(2);
  const [includeWtrHoliday, setIncludeWtrHoliday] = useState<boolean>(true);
  const [pensionOnBank, setPensionOnBank] = useState<boolean>(false);
  const [hasStudentLoan, setHasStudentLoan] = useState<boolean>(true);

  const selectedBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === band) || nhsData.bands[3],
    [band]
  );

  const safeStepIndex = Math.min(stepIndex, selectedBandObj.points.length - 1);
  const point = selectedBandObj.points[safeStepIndex];

  const calc = useMemo(() => {
    const baseSalary = point.annualSalary;
    const baseHourly = point.hourlyRate || baseSalary / 1955.357; // 37.5h * 52.143 wks

    // Unsocial multipliers under AfC Section 2 (matching lib/calculator.ts)
    const isLowerBand = ["Band 2", "Band 3"].includes(band);
    const nightSatMultiplier = isLowerBand ? 1.44 : 1.3;
    const sunBhMultiplier = isLowerBand ? 1.88 : 1.6;

    let multiplier = 1.0;
    let shiftLabel = "Standard Weekday (1.0x)";
    if (shiftType === "night_sat") {
      multiplier = nightSatMultiplier;
      shiftLabel = `Night / Saturday (${Math.round((nightSatMultiplier - 1) * 100)}% Enhancement)`;
    } else if (shiftType === "sun_bh") {
      multiplier = sunBhMultiplier;
      shiftLabel = `Sunday / Bank Holiday (${Math.round((sunBhMultiplier - 1) * 100)}% Enhancement)`;
    } else if (shiftType === "overtime_15") {
      multiplier = 1.5;
      shiftLabel = "Contractual Overtime (1.5x Time & a Half)";
    } else if (shiftType === "overtime_20") {
      multiplier = 2.0;
      shiftLabel = "Bank Holiday Overtime (2.0x Double Time)";
    }

    const enhancedHourly = baseHourly * multiplier;
    const wtrMultiplier = includeWtrHoliday && shiftType !== "overtime_15" && shiftType !== "overtime_20" ? 1.1207 : 1.0;
    const totalHourlyGross = enhancedHourly * wtrMultiplier;

    const grossPerShift = totalHourlyGross * shiftHours;
    const grossPerMonth = grossPerShift * shiftsPerMonth;
    const annualizedExtraGross = grossPerMonth * 12;

    // Marginal tax & NI bracket based on substantive salary + annualized extra
    const totalProjectedGross = baseSalary + annualizedExtraGross;
    const isHigherRateTax = totalProjectedGross > 50270;

    // Marginal pension rate on bank shift (if opted in & not overtime)
    const pensionRate = pensionOnBank && shiftType !== "overtime_15" && shiftType !== "overtime_20" ? 0.098 : 0;
    const pensionPerShift = grossPerShift * pensionRate;
    const taxableShiftPay = grossPerShift - pensionPerShift;

    const marginalTaxRate = isHigherRateTax ? 0.4 : 0.2;
    const marginalNiRate = isHigherRateTax ? 0.02 : 0.08;
    const studentLoanRate = hasStudentLoan ? 0.09 : 0;

    const taxPerShift = taxableShiftPay * marginalTaxRate;
    const niPerShift = grossPerShift * marginalNiRate;
    const studentLoanPerShift = grossPerShift * studentLoanRate;

    const totalDeductionsPerShift = pensionPerShift + taxPerShift + niPerShift + studentLoanPerShift;
    const netPerShift = grossPerShift - totalDeductionsPerShift;
    const netPerMonth = netPerShift * shiftsPerMonth;
    const netHourly = shiftHours > 0 ? netPerShift / shiftHours : 0;
    const retentionPercent = grossPerShift > 0 ? Math.round((netPerShift / grossPerShift) * 100) : 0;

    return {
      baseSalary,
      baseHourly,
      multiplier,
      shiftLabel,
      enhancedHourly,
      totalHourlyGross,
      grossPerShift,
      grossPerMonth,
      pensionPerShift,
      taxPerShift,
      niPerShift,
      studentLoanPerShift,
      totalDeductionsPerShift,
      netPerShift,
      netPerMonth,
      netHourly,
      retentionPercent,
      isHigherRateTax,
      marginalTaxRate,
      marginalNiRate,
    };
  }, [point, band, shiftType, shiftHours, shiftsPerMonth, includeWtrHoliday, pensionOnBank, hasStudentLoan]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Bank & Overtime Shift Setup</h2>
            <p className="text-xs text-slate-500">2026/27 Agenda for Change marginal net pay</p>
          </div>
        </div>

        {/* Band & Experience Step */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bank-band" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Pay Band
            </label>
            <select
              id="bank-band"
              value={band}
              onChange={(e) => {
                setBand(e.target.value);
                setStepIndex(0);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {nhsData.bands.map((b) => (
                <option key={b.band} value={b.band}>
                  {b.band}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bank-step" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Experience Step
            </label>
            <select
              id="bank-step"
              value={safeStepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {selectedBandObj.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} ({formatCurrency(pt.annualSalary)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Shift Enhancement Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Shift Enhancement / Rate Type
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "weekday", label: "Standard Weekday Bank Shift", sub: "1.0x plain time hourly rate" },
              {
                id: "night_sat",
                label: "Night or Saturday Bank Shift",
                sub: ["Band 2", "Band 3"].includes(band) ? "+44% unsocial enhancement" : "+30% unsocial enhancement",
              },
              {
                id: "sun_bh",
                label: "Sunday or Bank Holiday Shift",
                sub: ["Band 2", "Band 3"].includes(band) ? "+88% unsocial enhancement" : "+60% unsocial enhancement",
              },
              { id: "overtime_15", label: "Contractual Overtime (1.5x)", sub: "Time-and-a-half above 37.5h/wk (Bands 2–7)" },
              { id: "overtime_20", label: "Public Holiday Overtime (2.0x)", sub: "Double time on official Bank Holidays" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setShiftType(opt.id as ShiftRateType)}
                className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  shiftType === opt.id
                    ? "bg-sky-50/90 border-sky-600 text-slate-900 ring-2 ring-sky-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div>
                  <p className="text-xs sm:text-sm font-extrabold">{opt.label}</p>
                  <p className="text-[11px] text-slate-500">{opt.sub}</p>
                </div>
                <span className="text-xs font-extrabold text-sky-700 bg-white px-2.5 py-1 rounded-lg border border-sky-100">
                  {opt.id === "weekday"
                    ? "1.0x"
                    : opt.id === "night_sat"
                    ? ["Band 2", "Band 3"].includes(band)
                      ? "1.44x"
                      : "1.30x"
                    : opt.id === "sun_bh"
                    ? ["Band 2", "Band 3"].includes(band)
                      ? "1.88x"
                      : "1.60x"
                    : opt.id === "overtime_15"
                    ? "1.50x"
                    : "2.00x"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Paid Shift Duration & Shifts Per Month */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Paid Shift Hours
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[7.5, 11.5, 12.0, 12.5].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setShiftHours(h)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                    shiftHours === h
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {h} hrs
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Extra Shifts / Month: <span className="text-sky-600">{shiftsPerMonth}</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 4, 6].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setShiftsPerMonth(cnt)}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                    shiftsPerMonth === cnt
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cnt}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deductions & WTR Toggles */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-extrabold text-slate-900">Include 12.07% WTR Holiday Uplift</p>
              <p className="text-[11px] text-slate-500">Standard NHS Bank (NHSP) rolled-up holiday pay</p>
            </div>
            <input
              type="checkbox"
              checked={includeWtrHoliday}
              onChange={(e) => setIncludeWtrHoliday(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-extrabold text-slate-900">Student Loan Repayment (9%)</p>
              <p className="text-[11px] text-slate-500">Plans 1, 2, 4 or 5 above repayment threshold</p>
            </div>
            <input
              type="checkbox"
              checked={hasStudentLoan}
              onChange={(e) => setHasStudentLoan(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-extrabold text-slate-900">Pensionable Bank Shift (~9.8%)</p>
              <p className="text-[11px] text-slate-500">Applies if opted into NHS Pension on bank contract</p>
            </div>
            <input
              type="checkbox"
              checked={pensionOnBank}
              onChange={(e) => setPensionOnBank(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-7 space-y-6">
        {/* Hero Net Cash-in-Pocket Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {band} • {calc.shiftLabel}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {shiftHours}h Shift • Keep {calc.retentionPercent}% After Deductions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Net Cash Per Shift</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1">
                {formatCurrency(Math.round(calc.netPerShift))}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Gross: {formatCurrency(Math.round(calc.grossPerShift))} / shift
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Monthly Boost ({shiftsPerMonth} {shiftsPerMonth === 1 ? "Shift" : "Shifts"})
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                +{formatCurrency(Math.round(calc.netPerMonth))}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Gross: +{formatCurrency(Math.round(calc.grossPerMonth))} / mo
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Net Hourly Take-Home</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-sky-300 mt-1">
                £{calc.netHourly.toFixed(2)}
                <span className="text-sm font-bold text-sky-200">/hr</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Gross: £{calc.totalHourlyGross.toFixed(2)}/hr
              </p>
            </div>
          </div>

          {/* Itemized Marginal Deduction Breakdown per Shift */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 text-xs">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-slate-400 font-semibold">PAYE Tax ({Math.round(calc.marginalTaxRate * 100)}%)</p>
              <p className="text-base font-extrabold text-rose-300 mt-0.5">
                -{formatCurrency(Math.round(calc.taxPerShift))}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-slate-400 font-semibold">NI ({Math.round(calc.marginalNiRate * 100)}%)</p>
              <p className="text-base font-extrabold text-amber-300 mt-0.5">
                -{formatCurrency(Math.round(calc.niPerShift))}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-slate-400 font-semibold">Student Loan (9%)</p>
              <p className="text-base font-extrabold text-purple-300 mt-0.5">
                -{formatCurrency(Math.round(calc.studentLoanPerShift))}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-slate-400 font-semibold">NHS Pension</p>
              <p className="text-base font-extrabold text-sky-300 mt-0.5">
                -{formatCurrency(Math.round(calc.pensionPerShift))}
              </p>
            </div>
          </div>

          <div className="pt-5">
            <ShareBreakdownButton
              variant="dark"
              label="Share Bank Shift Take-Home Breakdown"
              url="https://netpayscale.uk/bank-shift-calculator/"
              shareText={`NHS ${band} ${shiftHours}h Bank Shift Breakdown (${calc.shiftLabel}):\n• Net Cash Per Shift: ${formatCurrency(Math.round(calc.netPerShift))} (Gross: ${formatCurrency(Math.round(calc.grossPerShift))})\n• Net Hourly Take-Home: £${calc.netHourly.toFixed(2)}/hr\n• ${shiftsPerMonth} Shifts/Mo Boost: +${formatCurrency(Math.round(calc.netPerMonth))} net\nCalculate yours: https://netpayscale.uk/bank-shift-calculator/`}
            />
          </div>
        </div>

        {/* All Shift Types Comparison Table for Selected Band & Shift Length */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {band} ({point.step}) — {shiftHours}-Hour Shift Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare gross vs. net cash-in-pocket across every shift enhancement rate
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-sky-600 shrink-0" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Shift Rate Type</th>
                  <th className="py-3 px-4 text-right">Gross / Hr</th>
                  <th className="py-3 px-4 text-right">Gross ({shiftHours}h)</th>
                  <th className="py-3 px-4 text-right">Deductions</th>
                  <th className="py-3 px-4 text-right">Net Cash ({shiftHours}h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {[
                  { id: "weekday", name: "Weekday Day (1.0x)", mult: 1.0, isOt: false },
                  {
                    id: "night_sat",
                    name: "Night / Saturday",
                    mult: ["Band 2", "Band 3"].includes(band) ? 1.44 : 1.3,
                    isOt: false,
                  },
                  {
                    id: "sun_bh",
                    name: "Sunday / Bank Holiday",
                    mult: ["Band 2", "Band 3"].includes(band) ? 1.88 : 1.6,
                    isOt: false,
                  },
                  { id: "overtime_15", name: "Overtime (1.5x)", mult: 1.5, isOt: true },
                  { id: "overtime_20", name: "Bank Holiday OT (2.0x)", mult: 2.0, isOt: true },
                ].map((row) => {
                  const wtr = includeWtrHoliday && !row.isOt ? 1.1207 : 1.0;
                  const hrGross = calc.baseHourly * row.mult * wtr;
                  const shGross = hrGross * shiftHours;
                  const pen = pensionOnBank && !row.isOt ? shGross * 0.098 : 0;
                  const tx = (shGross - pen) * calc.marginalTaxRate;
                  const ni = shGross * calc.marginalNiRate;
                  const sl = hasStudentLoan ? shGross * 0.09 : 0;
                  const ded = pen + tx + ni + sl;
                  const net = shGross - ded;
                  const isSelected = shiftType === row.id;

                  return (
                    <tr
                      key={row.id}
                      className={isSelected ? "bg-sky-50/80 font-semibold" : "hover:bg-slate-50/80"}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {row.name}
                        {isSelected && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase bg-sky-600 text-white rounded-md">
                            Selected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">£{hrGross.toFixed(2)}/hr</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                        {formatCurrency(Math.round(shGross))}
                      </td>
                      <td className="py-3.5 px-4 text-right text-rose-600">
                        -{formatCurrency(Math.round(ded))}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                        {formatCurrency(Math.round(net))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Marginal Tax Myth Explainer */}
        <div className="bg-sky-50/70 rounded-2xl border border-sky-200/80 p-5 flex gap-3.5">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
            <p className="font-bold text-slate-900">
              Why Bank Shifts Are NOT &ldquo;Taxed at 50%&rdquo; Unless You Cross £50,270 or Have a Student Loan:
            </p>
            <p>
              Because your personal tax-free allowance (£12,570) is already used up by your main substantive NHS salary, every £1 of extra bank or overtime pay is taxed at your <strong>marginal rate</strong>. For a Basic Rate taxpayer (total earnings under £50,270), deductions are <strong>20% PAYE Tax + 8% National Insurance = 28%</strong> (you keep 72p of every £1). If you also repay a Student Loan (+9%) and NHS Pension (+9.8%), total deductions are ~45%, meaning you still take home ~55% of the gross shift value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
