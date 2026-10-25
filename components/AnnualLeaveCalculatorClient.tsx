"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Clock, Sparkles, Info, CheckCircle2 } from "lucide-react";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

const fmtNum = (val: number, decimals = 1) =>
  Number.isInteger(val) ? val.toString() : val.toFixed(decimals);

export function AnnualLeaveCalculatorClient() {
  const [yearsOfService, setYearsOfService] = useState<"0_5" | "5_10" | "10_plus">("0_5");
  const [weeklyHours, setWeeklyHours] = useState<number>(37.5);
  const [shiftLength, setShiftLength] = useState<number>(11.5);
  const [bankHolidaysCount, setBankHolidaysCount] = useState<number>(8);

  const calc = useMemo(() => {
    const fteRatio = weeklyHours / 37.5;
    const baseDaysFTE = yearsOfService === "0_5" ? 27 : yearsOfService === "5_10" ? 29 : 33;
    const baseHoursFTE = baseDaysFTE * 7.5; // 202.5, 217.5, or 247.5 hours
    const bhHoursFTE = bankHolidaysCount * 7.5; // 60 hours for 8 BH

    const annualLeaveHours = Math.round(baseHoursFTE * fteRatio * 10) / 10;
    const bankHolidayHours = Math.round(bhHoursFTE * fteRatio * 10) / 10;
    const totalLeaveHours = Math.round((annualLeaveHours + bankHolidayHours) * 10) / 10;

    // Equivalents in standard 7.5h days and selected shift length
    const standardDaysTotal = totalLeaveHours / 7.5;
    const shiftsTotal = shiftLength > 0 ? totalLeaveHours / shiftLength : 0;
    const wholeShifts = Math.floor(shiftsTotal);
    const remainderHours = Math.round((totalLeaveHours - wholeShifts * shiftLength) * 10) / 10;

    const alOnlyShifts = shiftLength > 0 ? annualLeaveHours / shiftLength : 0;
    const bhOnlyShifts = shiftLength > 0 ? bankHolidayHours / shiftLength : 0;

    return {
      fteRatio,
      baseDaysFTE,
      baseHoursFTE,
      annualLeaveHours,
      bankHolidayHours,
      totalLeaveHours,
      standardDaysTotal,
      shiftsTotal,
      wholeShifts,
      remainderHours,
      alOnlyShifts,
      bhOnlyShifts,
    };
  }, [yearsOfService, weeklyHours, shiftLength, bankHolidaysCount]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Your NHS Contract & Shifts</h2>
            <p className="text-xs text-slate-500">Agenda for Change Section 13 entitlement</p>
          </div>
        </div>

        {/* Reckonable NHS Service */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Reckonable NHS Service (Total Years)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: "0_5", label: "0 to 5 Years Service", sub: "27 days (202.5 hrs) + 8 Bank Holidays FTE" },
              { id: "5_10", label: "5 to 10 Years Service", sub: "29 days (217.5 hrs) + 8 Bank Holidays FTE" },
              { id: "10_plus", label: "10+ Years Service", sub: "33 days (247.5 hrs) + 8 Bank Holidays FTE" },
            ].map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setYearsOfService(tier.id as "0_5" | "5_10" | "10_plus")}
                className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  yearsOfService === tier.id
                    ? "bg-emerald-50/80 border-emerald-600 text-slate-900 ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div>
                  <p className="text-sm font-extrabold">{tier.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{tier.sub}</p>
                </div>
                {yearsOfService === tier.id && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Contracted Weekly Hours */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="al-hours" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Contracted Hours / Week
            </label>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {weeklyHours} hrs ({Math.round((weeklyHours / 37.5) * 100)}% FTE)
            </span>
          </div>
          <input
            id="al-hours"
            type="range"
            min={7.5}
            max={37.5}
            step={0.5}
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[15, 22.5, 23, 30, 34.5, 37.5].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setWeeklyHours(h)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  weeklyHours === h
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Standard Shift Length */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Your Typical Shift Length (Unpaid Breaks Excluded)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { hrs: 7.5, label: "7.5 hrs", sub: "Standard Day" },
              { hrs: 11.5, label: "11.5 hrs", sub: "12h Ward Shift" },
              { hrs: 12.0, label: "12.0 hrs", sub: "Full 12h Paid" },
              { hrs: 12.5, label: "12.5 hrs", sub: "13h Long Day" },
            ].map((s) => (
              <button
                key={s.hrs}
                type="button"
                onClick={() => setShiftLength(s.hrs)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  shiftLength === s.hrs
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <p className="text-sm font-extrabold">{s.label}</p>
                <p className={`text-[10px] ${shiftLength === s.hrs ? "text-slate-300" : "text-slate-500"}`}>{s.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bank Holidays in Year */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Public / Bank Holidays in Leave Year
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { count: 8, label: "8 Days (Eng/Wales)" },
              { count: 9, label: "9 Days (Scotland)" },
              { count: 10, label: "10 Days (N. Ireland)" },
            ].map((bh) => (
              <button
                key={bh.count}
                type="button"
                onClick={() => setBankHolidaysCount(bh.count)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  bankHolidaysCount === bh.count
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {bh.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-7 space-y-6">
        {/* Hero Result Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              2026/27 Total Leave Entitlement (In Hours)
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {weeklyHours}h/wk • {shiftLength}h Shifts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Combined Hours</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1">
                {fmtNum(calc.totalLeaveHours)} <span className="text-lg font-bold text-emerald-200">hrs</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Incl. {fmtNum(calc.bankHolidayHours)}h Bank Holiday allowance
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Core Annual Leave</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {fmtNum(calc.annualLeaveHours)} <span className="text-base font-bold text-slate-300">hrs</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                ({fmtNum(calc.annualLeaveHours / 7.5)} standard 7.5h days)
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Bank Holiday Hours</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-sky-300 mt-1">
                {fmtNum(calc.bankHolidayHours)} <span className="text-base font-bold text-sky-200">hrs</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Pro-rata for {bankHolidaysCount} public holidays
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                In {shiftLength}-Hour Shifts
              </div>
              <p className="text-2xl font-extrabold text-white mt-1">
                {calc.wholeShifts} Full Shifts{" "}
                {calc.remainderHours > 0 && (
                  <span className="text-sm font-bold text-emerald-300">+ {fmtNum(calc.remainderHours)} hrs</span>
                )}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Exact equivalent: {fmtNum(calc.shiftsTotal, 2)} shifts of {shiftLength}h
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-sky-300 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                In Standard 7.5-Hour Days
              </div>
              <p className="text-2xl font-extrabold text-white mt-1">
                {fmtNum(calc.standardDaysTotal, 1)} Days
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {fmtNum(calc.annualLeaveHours / 7.5, 1)} AL days + {fmtNum(calc.bankHolidayHours / 7.5, 1)} BH days
              </p>
            </div>
          </div>

          <div className="pt-5">
            <ShareBreakdownButton
              variant="dark"
              label="Share Annual Leave & Shift Hours"
              url="https://netpayscale.uk/annual-leave-calculator/"
              shareText={`My 2026/27 NHS Annual Leave & Bank Holiday Entitlement (${weeklyHours}h/wk):\n• Total Combined Leave: ${fmtNum(calc.totalLeaveHours)} hours (${fmtNum(calc.annualLeaveHours)}h AL + ${fmtNum(calc.bankHolidayHours)}h Bank Holidays)\n• In ${shiftLength}h Shifts: ${calc.wholeShifts} full shifts${calc.remainderHours > 0 ? ` + ${fmtNum(calc.remainderHours)}h` : ""}\nCalculate yours: https://netpayscale.uk/annual-leave-calculator/`}
            />
          </div>
        </div>

        {/* All 3 Service Tiers Comparison Table for Current Contracted Hours */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">
              Your NHS Leave Progression Table (at {weeklyHours} hrs/week)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How your entitlement grows with reckonable NHS service (including {bankHolidaysCount} pro-rata bank holidays)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">NHS Service Tier</th>
                  <th className="py-3 px-4 text-right">Core Leave</th>
                  <th className="py-3 px-4 text-right">Bank Holidays</th>
                  <th className="py-3 px-4 text-right">Combined Hours</th>
                  <th className="py-3 px-4 text-right">In {shiftLength}h Shifts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {[
                  { id: "0_5", label: "0 – 5 Years", days: 27 },
                  { id: "5_10", label: "5 – 10 Years", days: 29 },
                  { id: "10_plus", label: "10+ Years", days: 33 },
                ].map((row) => {
                  const alHrs = Math.round(row.days * 7.5 * calc.fteRatio * 10) / 10;
                  const bhHrs = Math.round(bankHolidaysCount * 7.5 * calc.fteRatio * 10) / 10;
                  const totHrs = Math.round((alHrs + bhHrs) * 10) / 10;
                  const shifts = shiftLength > 0 ? totHrs / shiftLength : 0;
                  const isActive = yearsOfService === row.id;
                  return (
                    <tr
                      key={row.id}
                      className={isActive ? "bg-emerald-50/70 font-semibold" : "hover:bg-slate-50/80"}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {row.label}
                        {isActive && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-600 text-white rounded-md">
                            Selected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">{fmtNum(alHrs)} hrs</td>
                      <td className="py-3.5 px-4 text-right text-slate-600">{fmtNum(bhHrs)} hrs</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">{fmtNum(totHrs)} hrs</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">{fmtNum(shifts, 1)} shifts</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Part-Time Staff Count Leave in Hours Notice */}
        <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/80 p-5 flex gap-3.5">
          <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
            <p className="font-bold text-slate-900">
              Why NHS HealthRoster Calculates Annual Leave & Bank Holidays in Hours:
            </p>
            <p>
              Under Agenda for Change Section 13, all part-time staff and staff working compressed or long shifts (such as <strong>11.5-hour</strong> or <strong>12.5-hour ward shifts</strong>) have their annual leave and bank holidays converted into a single combined pot of hours. Whenever you book a shift off—or when your rostered shift falls on a Bank Holiday—HealthRoster deducts the exact paid hours of that shift ({shiftLength} hrs) from your {fmtNum(calc.totalLeaveHours)}-hour annual balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
