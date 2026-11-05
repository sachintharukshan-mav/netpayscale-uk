"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

const WALES_ANNUAL_HOURS_36_5 = 36.5 * 52.142857; // 1,903.214 hours/yr
const ENGLAND_ANNUAL_HOURS_37_5 = 37.5 * 52.142857; // 1,955.357 hours/yr

const WELSH_HEALTH_BOARDS = [
  "Cardiff and Vale University Health Board (CAVUHB)",
  "Swansea Bay University Health Board (SBUHB)",
  "Aneurin Bevan University Health Board (ABUHB)",
  "Betsi Cadwaladr University Health Board (BCUHB)",
  "Cwm Taf Morgannwg University Health Board (CTMUHB)",
  "Hywel Dda University Health Board (HDUHB)",
  "Powys Teaching Health Board (PTHB)",
  "Welsh Ambulance Services University NHS Trust (WAST)",
  "Velindre University NHS Trust",
];

export default function WalesPayClient() {
  const [band, setBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [walesHours, setWalesHours] = useState<number>(36.5);
  const [nightHoursPerWeek, setNightHoursPerWeek] = useState<number>(6);
  const [sundayHoursPerWeek, setSundayHoursPerWeek] = useState<number>(0);
  const [healthBoard, setHealthBoard] = useState<string>(WELSH_HEALTH_BOARDS[0]);

  const selectedBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === band) || nhsData.bands[3],
    [band]
  );

  const safeStepIndex = Math.min(stepIndex, selectedBandObj.points.length - 1);
  const point = selectedBandObj.points[safeStepIndex];

  const comparison = useMemo(() => {
    const fteRatio = walesHours / 36.5;
    const annualBase = point.annualSalary * fteRatio;

    // NHS Wales hourly rate is based on the 36.5-hour full-time standard (1,903.214 hrs/yr)
    const walesHourly = point.annualSalary / WALES_ANNUAL_HOURS_36_5;
    const englandHourly = point.annualSalary / ENGLAND_ANNUAL_HOURS_37_5;
    const hourlyAdvantage = walesHourly - englandHourly;

    const isBand2or3 = band === "Band 2" || band === "Band 3";
    const nightMult = isBand2or3 ? 0.44 : 0.30;
    const sundayMult = isBand2or3 ? 0.88 : 0.60;

    const walesUnsocialAnnual =
      (nightHoursPerWeek * nightMult + sundayHoursPerWeek * sundayMult) * 52.142857 * walesHourly;
    const englandUnsocialAnnual =
      (nightHoursPerWeek * nightMult + sundayHoursPerWeek * sundayMult) * 52.142857 * englandHourly;

    const baseCalc = calculateNHSPay({
      band,
      stepIndex: safeStepIndex,
      hcasZone: "standard",
      contractedHours: 37.5 * fteRatio,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });

    const walesGrossAnnual = annualBase + walesUnsocialAnnual;
    const pensionRate = baseCalc.pensionContribution.annual / baseCalc.grossPay.annual;
    const pensionAnnual = annualBase * pensionRate;
    const taxable = Math.max(0, walesGrossAnnual - pensionAnnual - 12570);
    const taxAnnual =
      taxable <= 37700 ? taxable * 0.2 : 37700 * 0.2 + (taxable - 37700) * 0.4;
    const niable = Math.max(0, walesGrossAnnual - 12570);
    const niAnnual =
      niable <= 37700 ? niable * 0.08 : 37700 * 0.08 + (niable - 37700) * 0.02;
    const walesNetAnnual = walesGrossAnnual - pensionAnnual - taxAnnual - niAnnual;

    // 52.14 weeks/year of saving 1 hour per week = 52.14 hours (nearly 7 full 7.5h shifts saved per year!)
    const annualHoursSavedVsEngland = 52.14 * fteRatio;

    return {
      annualBase,
      walesHourly,
      englandHourly,
      hourlyAdvantage,
      walesUnsocialAnnual,
      englandUnsocialAnnual,
      unsocialGainVsEngland: walesUnsocialAnnual - englandUnsocialAnnual,
      walesGrossAnnual,
      walesNetAnnual,
      walesNetMonthly: walesNetAnnual / 12,
      pensionMonthly: pensionAnnual / 12,
      taxMonthly: taxAnnual / 12,
      niMonthly: niAnnual / 12,
      annualHoursSavedVsEngland,
      nightRateWales: walesHourly * (1 + nightMult),
      sundayRateWales: walesHourly * (1 + sundayMult),
    };
  }, [band, safeStepIndex, point, walesHours, nightHoursPerWeek, sundayHoursPerWeek]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Controls */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            1. Configure Your NHS Wales (GIG Cymru) Contract
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            2026/27 Welsh Government Agenda for Change (+3.3%) &amp; 36.5-Hour Working Week Standard
          </p>
        </div>

        {/* Welsh Health Board Selector */}
        <div>
          <label htmlFor="wales-hb" className="block text-xs font-bold text-slate-700 mb-1.5">
            Welsh Health Board / NHS Wales Trust
          </label>
          <select
            id="wales-hb"
            value={healthBoard}
            onChange={(e) => setHealthBoard(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900"
          >
            {WELSH_HEALTH_BOARDS.map((hb) => (
              <option key={hb} value={hb}>
                {hb}
              </option>
            ))}
          </select>
        </div>

        {/* Band Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            NHS Wales Pay Band (Bands 2–9)
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
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {b.band.replace("Band ", "B")}
              </button>
            ))}
          </div>
        </div>

        {/* Step & Contracted Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="wales-step" className="block text-xs font-bold text-slate-700 mb-1.5">
              Experience Spine Point
            </label>
            <select
              id="wales-step"
              value={safeStepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900"
            >
              {selectedBandObj.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} ({formatCurrency(pt.annualSalary)}/yr)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="wales-hours" className="block text-xs font-bold text-slate-700 mb-1.5">
              Weekly Contracted Hours (36.5h = 1.0 FTE)
            </label>
            <select
              id="wales-hours"
              value={walesHours}
              onChange={(e) => setWalesHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900"
            >
              <option value={36.5}>36.5 hrs/wk (100% Full-Time NHS Wales)</option>
              <option value={34.5}>34.5 hrs/wk (3 × 11.5h Shifts)</option>
              <option value={29.2}>29.2 hrs/wk (0.8 FTE Part-Time)</option>
              <option value={21.9}>21.9 hrs/wk (0.6 FTE Part-Time)</option>
              <option value={18.25}>18.25 hrs/wk (0.5 FTE Job Share)</option>
            </select>
          </div>
        </div>

        {/* Unsocial Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label htmlFor="wales-nights" className="block text-xs font-bold text-slate-700 mb-1">
              Night / Saturday Hours / Wk: <span className="text-emerald-700">{nightHoursPerWeek}h</span>
            </label>
            <input
              id="wales-nights"
              type="range"
              min={0}
              max={24}
              step={1}
              value={nightHoursPerWeek}
              onChange={(e) => setNightHoursPerWeek(Number(e.target.value))}
              className="w-full accent-emerald-700"
            />
          </div>
          <div>
            <label htmlFor="wales-sundays" className="block text-xs font-bold text-slate-700 mb-1">
              Sunday / Bank Holiday Hours / Wk: <span className="text-emerald-700">{sundayHoursPerWeek}h</span>
            </label>
            <input
              id="wales-sundays"
              type="range"
              min={0}
              max={15}
              step={1}
              value={sundayHoursPerWeek}
              onChange={(e) => setSundayHoursPerWeek(Number(e.target.value))}
              className="w-full accent-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Live Output Card */}
      <div className="lg:col-span-5 rounded-2xl border border-slate-300 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              NHS Wales (GIG Cymru) 2026/27
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              {band} Net Monthly Take-Home Pay
            </h3>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-mono font-bold text-emerald-800">
            £{comparison.walesHourly.toFixed(2)}/hr
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-700 tabular-nums">
              {formatCurrency(Math.round(comparison.walesNetMonthly))}/mo
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({formatCurrency(Math.round(comparison.walesNetAnnual))}/yr net)
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Wales 36.5h Hourly Rate
              </span>
              <span className="font-mono text-sm font-extrabold text-emerald-700">
                £{comparison.walesHourly.toFixed(2)}/hr
              </span>
              <span className="block text-[10px] text-emerald-600 font-semibold">
                +£{comparison.hourlyAdvantage.toFixed(2)}/hr (+2.74%) vs England
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Working Hours Saved / Yr
              </span>
              <span className="font-mono text-sm font-extrabold text-slate-900">
                {comparison.annualHoursSavedVsEngland.toFixed(1)} hrs/yr
              </span>
              <span className="block text-[10px] text-slate-500">
                ~{(comparison.annualHoursSavedVsEngland / 7.5).toFixed(1)} fewer 7.5h shifts/yr
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-600">Basic Gross Salary ({walesHours}h/wk):</span>
            <span className="font-mono font-semibold text-slate-900">
              {formatCurrency(Math.round(comparison.annualBase))}/yr
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Section 2 Unsocial Uplift (36.5h base):</span>
            <span className="font-mono font-semibold text-emerald-700">
              +{formatCurrency(Math.round(comparison.walesUnsocialAnnual))}/yr
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">HMRC PAYE Tax &amp; Class 1 NI:</span>
            <span className="font-mono text-rose-600">
              -{formatCurrency(Math.round(comparison.taxMonthly + comparison.niMonthly))}/mo
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">NHS 2015 CARE Pension:</span>
            <span className="font-mono text-slate-700">
              -{formatCurrency(Math.round(comparison.pensionMonthly))}/mo
            </span>
          </div>
        </div>

        <ShareBreakdownButton
          variant="light"
          label="Share NHS Wales Pay Breakdown"
          url="https://netpayscale.uk/wales-pay-calculator/"
          shareText={`🏴󠁧󠁢󠁷󠁬󠁳󠁿 NHS Wales (${healthBoard}) ${band} Pay Breakdown (2026/27):\n• Net Take-Home: ${formatCurrency(Math.round(comparison.walesNetMonthly))}/mo (${formatCurrency(Math.round(comparison.walesNetAnnual))}/yr)\n• 36.5h Hourly Rate: £${comparison.walesHourly.toFixed(2)}/hr (+2.74% vs England)\n• Annual Hours Saved: ${comparison.annualHoursSavedVsEngland.toFixed(1)} hrs/yr\nCalculate yours: https://netpayscale.uk/wales-pay-calculator/`}
        />
      </div>
    </div>
  );
}
