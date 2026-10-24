"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";

const SMP_WEEKLY_RATE_2026 = 187.18; // Statutory Maternity Pay weekly flat rate

export default function MaternityCalculatorClient() {
  const [band, setBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(1);
  const [hcasZone, setHcasZone] = useState<"standard" | "inner-london" | "outer-london" | "fringe">("standard");
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [paymentMode, setPaymentMode] = useState<"phased" | "spread-39" | "spread-52">("phased");
  const [qualifiesForOmp, setQualifiesForOmp] = useState<boolean>(true);

  const selectedBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === band) || nhsData.bands[3],
    [band]
  );

  const safeStepIndex = Math.min(stepIndex, selectedBandObj.points.length - 1);

  const baseResult = useMemo(
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

  const maternityBreakdown = useMemo(() => {
    const awe = baseResult.grossPay.weekly; // Average Weekly Earnings
    const smpFlat = Math.min(SMP_WEEKLY_RATE_2026, awe * 0.9);

    let weeks1to8Weekly = 0;
    let weeks9to26Weekly = 0;
    let weeks27to39Weekly = 0;
    const weeks40to52Weekly = 0;

    if (qualifiesForOmp) {
      // NHS Agenda for Change Section 15 OMP:
      // Weeks 1-8 (8 weeks): Full Pay (100% AWE)
      weeks1to8Weekly = awe;
      // Weeks 9-26 (18 weeks): Half Pay (50% AWE) + SMP flat rate, capped at 100% AWE
      weeks9to26Weekly = Math.min(awe, awe * 0.5 + smpFlat);
      // Weeks 27-39 (13 weeks): SMP flat rate
      weeks27to39Weekly = smpFlat;
    } else {
      // Statutory Maternity Pay (SMP) Only:
      // Weeks 1-6 (6 weeks): 90% AWE, Weeks 7-39 (33 weeks): SMP flat rate
      weeks1to8Weekly = (6 * (awe * 0.9) + 2 * smpFlat) / 8;
      weeks9to26Weekly = smpFlat;
      weeks27to39Weekly = smpFlat;
    }

    const total52WeekGross =
      weeks1to8Weekly * 8 +
      weeks9to26Weekly * 18 +
      weeks27to39Weekly * 13 +
      weeks40to52Weekly * 13;

    // Estimate annual tax, NI, and pension on the 52-week maternity gross
    const pensionRate = baseResult.pensionContribution.annual / baseResult.grossPay.annual;
    const annualPension = total52WeekGross * pensionRate;
    const taxableMaternity = Math.max(0, total52WeekGross - annualPension - 12570);
    const annualTax =
      taxableMaternity <= 37700
        ? taxableMaternity * 0.2
        : 37700 * 0.2 + (taxableMaternity - 37700) * 0.4;
    const niableMaternity = Math.max(0, total52WeekGross - 12570);
    const annualNi =
      niableMaternity <= 37700
        ? niableMaternity * 0.08
        : 37700 * 0.08 + (niableMaternity - 37700) * 0.02;

    const total52WeekNet = total52WeekGross - annualPension - annualTax - annualNi;
    const netRetentionRatio = total52WeekGross > 0 ? total52WeekNet / total52WeekGross : 0.8;

    return {
      awe,
      smpFlat,
      phases: [
        {
          title: qualifiesForOmp ? "Weeks 1–8 (8 Weeks): 100% Full NHS Pay" : "Weeks 1–6 (6 Weeks): 90% Statutory Pay",
          weeks: qualifiesForOmp ? 8 : 6,
          weeklyGross: qualifiesForOmp ? weeks1to8Weekly : awe * 0.9,
          monthlyGross: (qualifiesForOmp ? weeks1to8Weekly : awe * 0.9) * (52 / 12),
          monthlyNet: (qualifiesForOmp ? weeks1to8Weekly : awe * 0.9) * (52 / 12) * netRetentionRatio,
          badge: "Full Pay Phase",
        },
        {
          title: qualifiesForOmp
            ? "Weeks 9–26 (18 Weeks): 50% Half Pay + SMP (£187.18/wk)"
            : "Weeks 7–26 (20 Weeks): Flat Rate SMP (£187.18/wk)",
          weeks: qualifiesForOmp ? 18 : 20,
          weeklyGross: weeks9to26Weekly,
          monthlyGross: weeks9to26Weekly * (52 / 12),
          monthlyNet: weeks9to26Weekly * (52 / 12) * netRetentionRatio,
          badge: qualifiesForOmp ? "Half Pay + SMP" : "Standard SMP",
        },
        {
          title: "Weeks 27–39 (13 Weeks): Statutory Maternity Pay (SMP)",
          weeks: 13,
          weeklyGross: weeks27to39Weekly,
          monthlyGross: weeks27to39Weekly * (52 / 12),
          monthlyNet: weeks27to39Weekly * (52 / 12) * netRetentionRatio,
          badge: "SMP Only",
        },
        {
          title: "Weeks 40–52 (13 Weeks): Unpaid Additional Maternity Leave",
          weeks: 13,
          weeklyGross: 0,
          monthlyGross: 0,
          monthlyNet: 0,
          badge: "Unpaid Phase",
        },
      ],
      total52WeekGross,
      total52WeekNet,
      spread39MonthlyNet: total52WeekNet / 9,
      spread52MonthlyNet: total52WeekNet / 12,
      spread39MonthlyGross: total52WeekGross / 9,
      spread52MonthlyGross: total52WeekGross / 12,
    };
  }, [baseResult, qualifiesForOmp]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Controls */}
      <div className="lg:col-span-7 rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-zinc-100 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-zinc-950">
            1. Configure Your NHS Contract &amp; Maternity Schedule
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Based on Agenda for Change Section 15 Occupational Maternity Pay (OMP) &amp; 2026/27 SMP (£187.18/wk)
          </p>
        </div>

        {/* Band Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-800 block">
            Agenda for Change Pay Band
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
            {nhsData.bands.map((b) => (
              <button
                key={b.band}
                type="button"
                onClick={() => {
                  setBand(b.band);
                  setStepIndex(0);
                }}
                className={`rounded-lg py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
                  band === b.band
                    ? "bg-[#005EB8] text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {b.band.replace("Band ", "B")}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Step & Region */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 block">
              Pay Step Point
            </label>
            <select
              value={safeStepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-semibold text-zinc-900"
            >
              {selectedBandObj.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} ({formatCurrency(pt.annualSalary)}/yr)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 block">
              London Weighting (HCAS Zone)
            </label>
            <select
              value={hcasZone}
              onChange={(e) => setHcasZone(e.target.value as any)}
              className="w-full h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-semibold text-zinc-900"
            >
              <option value="standard">National Standard (0% HCAS)</option>
              <option value="inner-london">Inner London (+20% HCAS)</option>
              <option value="outer-london">Outer London (+15% HCAS)</option>
              <option value="fringe">London Fringe (+5% HCAS)</option>
            </select>
          </div>
        </div>

        {/* Hours & Qualification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 block">
              Contracted Hours / Week: <span className="font-mono text-[#005EB8]">{contractedHours}h</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[37.5, 34.5, 30, 22.5, 18.75].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setContractedHours(h)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-mono font-semibold cursor-pointer ${
                    contractedHours === h
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-800 block">
              NHS Continuous Service Qualification
            </label>
            <select
              value={qualifiesForOmp ? "omp" : "smp"}
              onChange={(e) => setQualifiesForOmp(e.target.value === "omp")}
              className="w-full h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-semibold text-zinc-900"
            >
              <option value="omp">12+ Months NHS Service (Full OMP + SMP)</option>
              <option value="smp">Under 12 Months NHS Service (SMP Only)</option>
            </select>
          </div>
        </div>

        {/* Equalised Spread Toggle */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <label className="text-xs font-semibold text-zinc-800 block">
            ESR Payslip Payment Schedule Option
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: "phased", label: "Standard Phased", sub: "8w Full → 18w Half → 13w SMP" },
              { id: "spread-39", label: "Equalised Over 9 Months", sub: "Spread evenly across 39 weeks" },
              { id: "spread-52", label: "Equalised Over 12 Months", sub: "Spread evenly across 52 weeks" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPaymentMode(opt.id as any)}
                className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  paymentMode === opt.id
                    ? "border-[#005EB8] bg-blue-50/60 ring-1 ring-[#005EB8]"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
              >
                <span className="text-xs font-bold text-zinc-950 block">{opt.label}</span>
                <span className="text-[11px] text-zinc-500 block mt-0.5">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Maternity Summary Ledger */}
      <div className="lg:col-span-5 lg:sticky lg:top-20 rounded-2xl border border-zinc-300 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#005EB8] block">
              2026/27 Maternity Ledger
            </span>
            <h3 className="text-base font-bold text-zinc-950">
              Total 52-Week Net Maternity Pay
            </h3>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-800">
            AWE: {formatCurrency(maternityBreakdown.awe, true)}/wk
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-700 tabular-nums">
              {formatCurrency(maternityBreakdown.total52WeekNet)}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              net total (Gross: {formatCurrency(maternityBreakdown.total52WeekGross)})
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 p-3">
            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                If Spread Over 9 Months
              </span>
              <span className="font-mono text-sm font-bold text-zinc-950 tabular-nums">
                {formatCurrency(maternityBreakdown.spread39MonthlyNet)}/mo net
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                If Spread Over 12 Months
              </span>
              <span className="font-mono text-sm font-bold text-zinc-950 tabular-nums">
                {formatCurrency(maternityBreakdown.spread52MonthlyNet)}/mo net
              </span>
            </div>
          </div>
        </div>

        {/* Phase Breakdown Cards */}
        <div className="space-y-2.5 pt-2 border-t border-zinc-100">
          <span className="text-xs font-bold text-zinc-900 block">
            Phased Weekly &amp; Monthly Breakdown
          </span>
          {maternityBreakdown.phases.map((ph) => (
            <div
              key={ph.title}
              className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-3 space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-900">{ph.title}</span>
                <span className="rounded bg-white border border-zinc-200 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-700 shrink-0">
                  {ph.badge}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-zinc-500">
                  Gross: {formatCurrency(ph.weeklyGross, true)}/wk ({formatCurrency(ph.monthlyGross)}/mo)
                </span>
                <span className="font-bold text-emerald-700">
                  ~{formatCurrency(ph.monthlyNet)}/mo net
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
