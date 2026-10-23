"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency, formatPercent } from "@/lib/formatters";

export default function ScenarioComparator() {
  // Scenario A (Baseline / Current post)
  const [bandA, setBandA] = useState<string>("Band 5");
  const [stepA, setStepA] = useState<number>(2); // Band 5 Top (After 4 years)
  const [hcasA, setHcasA] = useState<"inner-london" | "outer-london" | "fringe" | "standard">("standard");
  const [hoursA, setHoursA] = useState<number>(37.5);
  const [nightA, setNightA] = useState<number>(0);
  const [sundayA, setSundayA] = useState<number>(0);

  // Scenario B (Comparison / Proposed post)
  const [bandB, setBandB] = useState<string>("Band 6");
  const [stepB, setStepB] = useState<number>(0); // Band 6 Entry
  const [hcasB, setHcasB] = useState<"inner-london" | "outer-london" | "fringe" | "standard">("standard");
  const [hoursB, setHoursB] = useState<number>(37.5);
  const [nightB, setNightB] = useState<number>(0);
  const [sundayB, setSundayB] = useState<number>(0);

  // Timeframe for differential display
  const [timeframe, setTimeframe] = useState<"monthly" | "annual">("monthly");

  // Band lists
  const bandList = [
    { label: "2", full: "Band 2" },
    { label: "3", full: "Band 3" },
    { label: "4", full: "Band 4" },
    { label: "5", full: "Band 5" },
    { label: "6", full: "Band 6" },
    { label: "7", full: "Band 7" },
    { label: "8a", full: "Band 8a" },
    { label: "8b", full: "Band 8b" },
    { label: "8c", full: "Band 8c" },
    { label: "8d", full: "Band 8d" },
    { label: "9", full: "Band 9" },
  ];

  // Band data lookups
  const bandDataA = useMemo(() => nhsData.bands.find((b) => b.band === bandA) || nhsData.bands[3], [bandA]);
  const bandDataB = useMemo(() => nhsData.bands.find((b) => b.band === bandB) || nhsData.bands[4], [bandB]);

  // Safe clamped steps
  const validStepA = Math.min(stepA, bandDataA.points.length - 1);
  const validStepB = Math.min(stepB, bandDataB.points.length - 1);

  // Calculations
  const resultA = useMemo(() => {
    return calculateNHSPay({
      band: bandA,
      stepIndex: validStepA,
      hcasZone: hcasA,
      contractedHours: hoursA,
      nightHoursPerWeek: nightA,
      sundayHoursPerWeek: sundayA,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });
  }, [bandA, validStepA, hcasA, hoursA, nightA, sundayA]);

  const resultB = useMemo(() => {
    return calculateNHSPay({
      band: bandB,
      stepIndex: validStepB,
      hcasZone: hcasB,
      contractedHours: hoursB,
      nightHoursPerWeek: nightB,
      sundayHoursPerWeek: sundayB,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });
  }, [bandB, validStepB, hcasB, hoursB, nightB, sundayB]);

  // Differentials
  const diffGrossAnnual = resultB.grossPay.annual - resultA.grossPay.annual;
  const diffGrossMonthly = resultB.grossPay.monthly - resultA.grossPay.monthly;

  const diffNetAnnual = resultB.netPay.annual - resultA.netPay.annual;
  const diffNetMonthly = resultB.netPay.monthly - resultA.netPay.monthly;

  const diffPensionAnnual = resultB.pensionContribution.annual - resultA.pensionContribution.annual;
  const diffTaxAnnual = resultB.incomeTax.annual - resultA.incomeTax.annual;
  const diffNiAnnual = resultB.nationalInsurance.annual - resultA.nationalInsurance.annual;

  // Marginal retention: % of gross increase that ends up in pocket
  const marginalRetention =
    diffGrossAnnual > 0 ? (diffNetAnnual / diffGrossAnnual) * 100 : 0;

  // Preset scenarios handler
  const applyPreset = (presetType: string) => {
    if (presetType === "b5-b6") {
      setBandA("Band 5");
      setStepA(2); // Top
      setHcasA("standard");
      setHoursA(37.5);
      setNightA(0);
      setSundayA(0);

      setBandB("Band 6");
      setStepB(0); // Entry
      setHcasB("standard");
      setHoursB(37.5);
      setNightB(0);
      setSundayB(0);
    } else if (presetType === "b6-b7") {
      setBandA("Band 6");
      setStepA(2); // Top
      setHcasA("standard");
      setHoursA(37.5);

      setBandB("Band 7");
      setStepB(0); // Entry
      setHcasB("standard");
      setHoursB(37.5);
    } else if (presetType === "ft-pt") {
      setBandA("Band 5");
      setStepA(1);
      setHcasA("standard");
      setHoursA(37.5); // Full-time

      setBandB("Band 5");
      setStepB(1);
      setHcasB("standard");
      setHoursB(30); // 4 days part-time
    } else if (presetType === "ft-3days") {
      setBandA("Band 6");
      setStepA(1);
      setHcasA("standard");
      setHoursA(37.5);

      setBandB("Band 6");
      setStepB(1);
      setHcasB("standard");
      setHoursB(22.5); // 3 days part-time
    } else if (presetType === "london-move") {
      setBandA("Band 6");
      setStepA(1);
      setHcasA("standard"); // Outside London
      setHoursA(37.5);

      setBandB("Band 6");
      setStepB(1);
      setHcasB("inner-london"); // Inner London (+20%)
      setHoursB(37.5);
    } else if (presetType === "nights-impact") {
      setBandA("Band 5");
      setStepA(1);
      setHcasA("standard");
      setHoursA(37.5);
      setNightA(0);

      setBandB("Band 5");
      setStepB(1);
      setHcasB("standard");
      setHoursB(37.5);
      setNightB(11.5); // 1 night shift a week
    }
  };

  const currentDiffNet = timeframe === "monthly" ? diffNetMonthly : diffNetAnnual;
  const currentDiffGross = timeframe === "monthly" ? diffGrossMonthly : diffGrossAnnual;

  return (
    <div className="space-y-6">
      {/* 1. QUICK PRESET BUTTONS */}
      <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-900">
            Popular NHS Comparison Presets:
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">1-Click Scenarios</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "b5-b6", label: "Band 5 (Top) vs Band 6 (Entry)" },
            { id: "b6-b7", label: "Band 6 (Top) vs Band 7 (Entry)" },
            { id: "ft-pt", label: "Full Time (37.5h) vs 30h Part Time" },
            { id: "ft-3days", label: "Full Time vs 22.5h (3 Days)" },
            { id: "london-move", label: "Standard UK vs Inner London (+20%)" },
            { id: "nights-impact", label: "Day Work vs +1 Night Shift/wk" },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className="rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1.5 text-xs font-medium transition-all active:scale-95 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. DUAL CONFIGURATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* SCENARIO A */}
        <div className="rounded-xl border-2 border-zinc-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white font-mono text-xs font-bold">
                A
              </span>
              <h3 className="text-sm font-bold text-zinc-950">
                Scenario A (Current Post)
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
              {formatCurrency(resultA.netPay.monthly, true)}/mo net
            </span>
          </div>

          {/* Band Selector A */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              Pay Band
            </label>
            <div className="flex flex-wrap gap-1">
              {bandList.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setBandA(item.full);
                    setStepA(0);
                  }}
                  className={`flex-1 min-w-[32px] py-1 px-1.5 text-center rounded text-xs font-semibold cursor-pointer transition-all ${
                    bandA === item.full
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step Selector A */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              Experience Point
            </label>
            <select
              value={validStepA}
              onChange={(e) => setStepA(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-xs text-zinc-900 font-medium"
            >
              {bandDataA.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} — {formatCurrency(pt.annualSalary)}/yr
                </option>
              ))}
            </select>
          </div>

          {/* Location A */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              Location / London Weighting
            </label>
            <select
              value={hcasA}
              onChange={(e) => setHcasA(e.target.value as any)}
              className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-xs text-zinc-900"
            >
              <option value="standard">Standard UK (0%)</option>
              <option value="inner-london">Inner London (+20%)</option>
              <option value="outer-london">Outer London (+15%)</option>
              <option value="fringe">Fringe Border (+5%)</option>
            </select>
          </div>

          {/* Contracted Hours A */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-600 font-medium">Contracted Hours</span>
              <span className="font-mono font-bold text-zinc-900">{hoursA} hrs/wk</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="48"
              step="0.5"
              value={hoursA}
              onChange={(e) => setHoursA(parseFloat(e.target.value) || 37.5)}
              className="w-full accent-zinc-900"
            />
          </div>

          {/* Night Hours A */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-600 font-medium">Night Hours</span>
              <span className="font-mono font-bold text-zinc-900">{nightA} hrs/wk</span>
            </div>
            <input
              type="range"
              min="0"
              max="34.5"
              step="0.5"
              value={nightA}
              onChange={(e) => setNightA(parseFloat(e.target.value) || 0)}
              className="w-full accent-zinc-900"
            />
          </div>
        </div>

        {/* SCENARIO B */}
        <div className="rounded-xl border-2 border-emerald-500/70 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-mono text-xs font-bold">
                B
              </span>
              <h3 className="text-sm font-bold text-zinc-950">
                Scenario B (Proposed Post / Promotion)
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              {formatCurrency(resultB.netPay.monthly, true)}/mo net
            </span>
          </div>

          {/* Band Selector B */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              Pay Band
            </label>
            <div className="flex flex-wrap gap-1">
              {bandList.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setBandB(item.full);
                    setStepB(0);
                  }}
                  className={`flex-1 min-w-[32px] py-1 px-1.5 text-center rounded text-xs font-semibold cursor-pointer transition-all ${
                    bandB === item.full
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step Selector B */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              Experience Point
            </label>
            <select
              value={validStepB}
              onChange={(e) => setStepB(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-xs text-zinc-900 font-medium"
            >
              {bandDataB.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} — {formatCurrency(pt.annualSalary)}/yr
                </option>
              ))}
            </select>
          </div>

          {/* Location B */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
              Location / London Weighting
            </label>
            <select
              value={hcasB}
              onChange={(e) => setHcasB(e.target.value as any)}
              className="w-full rounded-lg border border-zinc-300 bg-white p-2 text-xs text-zinc-900"
            >
              <option value="standard">Standard UK (0%)</option>
              <option value="inner-london">Inner London (+20%)</option>
              <option value="outer-london">Outer London (+15%)</option>
              <option value="fringe">Fringe Border (+5%)</option>
            </select>
          </div>

          {/* Contracted Hours B */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-600 font-medium">Contracted Hours</span>
              <span className="font-mono font-bold text-zinc-900">{hoursB} hrs/wk</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="48"
              step="0.5"
              value={hoursB}
              onChange={(e) => setHoursB(parseFloat(e.target.value) || 37.5)}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Night Hours B */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-600 font-medium">Night Hours</span>
              <span className="font-mono font-bold text-zinc-900">{nightB} hrs/wk</span>
            </div>
            <input
              type="range"
              min="0"
              max="34.5"
              step="0.5"
              value={nightB}
              onChange={(e) => setNightB(parseFloat(e.target.value) || 0)}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* 3. HEADLINE DIFFERENTIAL BANNER */}
      <div className="rounded-xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-950">
              Net Take-Home Difference (B vs A)
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Exact bottom-line impact after tax, NI, and pension tier adjustments
            </p>
          </div>

          <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTimeframe("monthly")}
              className={`rounded-md px-3 py-1 cursor-pointer transition-all ${
                timeframe === "monthly"
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("annual")}
              className={`rounded-md px-3 py-1 cursor-pointer transition-all ${
                timeframe === "annual"
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Big Change Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-100">
            <span className="text-xs text-zinc-500 font-medium block">
              Net Cash Change ({timeframe})
            </span>
            <div
              className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight tabular-nums mt-1 ${
                currentDiffNet >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {currentDiffNet >= 0 ? "+" : ""}
              {formatCurrency(currentDiffNet, true)}
              <span className="text-xs font-normal text-zinc-500">
                /{timeframe === "monthly" ? "mo" : "yr"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Actual change in your monthly bank deposit
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-100">
            <span className="text-xs text-zinc-500 font-medium block">
              Gross Salary Change ({timeframe})
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight tabular-nums text-zinc-900 mt-1">
              {currentDiffGross >= 0 ? "+" : ""}
              {formatCurrency(currentDiffGross, true)}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Headline contractual earnings shift
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4 border border-zinc-100">
            <span className="text-xs text-zinc-500 font-medium block">
              Pay Rise Retention Rate
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight tabular-nums text-zinc-900 mt-1">
              {diffGrossAnnual > 0 ? formatPercent(marginalRetention) : "N/A"}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              {diffGrossAnnual > 0
                ? `You keep ${Math.round(marginalRetention)}p in every £1 of this pay rise`
                : "Contracted pay reduced"}
            </p>
          </div>
        </div>

        {/* Pension Tier Shift Warning / Info */}
        {resultA.pensionRate !== resultB.pensionRate && (
          <div className="rounded-lg bg-amber-50 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">⚠️</span>
              <span>
                <strong>NHS Pension Tier Change:</strong> Moves from{" "}
                <strong>{resultA.pensionTierLabel}</strong> (Scenario A) to{" "}
                <strong>{resultB.pensionTierLabel}</strong> (Scenario B).
              </span>
            </div>
            <span className="font-mono text-[11px] text-amber-800 tabular-nums">
              {diffPensionAnnual >= 0 ? "+" : ""}
              {formatCurrency(diffPensionAnnual / 12, true)}/mo pension cost
            </span>
          </div>
        )}
      </div>

      {/* 4. SIDE-BY-SIDE ITEMIZED COMPARISON TABLE */}
      <div className="rounded-xl border border-zinc-200/90 bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200/80 font-semibold text-xs text-zinc-900">
          Side-by-Side Financial Ledger (Annual &amp; Monthly)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 font-sans font-medium bg-zinc-50/50">
                <th className="py-2.5 px-4">Pay Element</th>
                <th className="py-2.5 px-4 text-right">Scenario A</th>
                <th className="py-2.5 px-4 text-right">Scenario B</th>
                <th className="py-2.5 px-4 text-right">Differential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              <tr className="hover:bg-zinc-50/60">
                <td className="py-2 px-4 font-sans font-medium text-zinc-950">
                  Base Basic Salary
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {formatCurrency(resultA.baseSalary.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {formatCurrency(resultB.baseSalary.annual)}
                </td>
                <td className="py-2 px-4 text-right font-semibold tabular-nums">
                  {resultB.baseSalary.annual - resultA.baseSalary.annual >= 0 ? "+" : ""}
                  {formatCurrency(resultB.baseSalary.annual - resultA.baseSalary.annual)}
                </td>
              </tr>

              <tr className="hover:bg-zinc-50/60">
                <td className="py-2 px-4 font-sans text-zinc-600">
                  London Weighting (HCAS)
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {formatCurrency(resultA.hcasAmount.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {formatCurrency(resultB.hcasAmount.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums text-zinc-600">
                  {resultB.hcasAmount.annual - resultA.hcasAmount.annual >= 0 ? "+" : ""}
                  {formatCurrency(resultB.hcasAmount.annual - resultA.hcasAmount.annual)}
                </td>
              </tr>

              <tr className="hover:bg-zinc-50/60">
                <td className="py-2 px-4 font-sans text-zinc-600">
                  Unsocial Hours Enhancements
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {formatCurrency(resultA.totalUnsocialAmount.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {formatCurrency(resultB.totalUnsocialAmount.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums text-zinc-600">
                  {resultB.totalUnsocialAmount.annual - resultA.totalUnsocialAmount.annual >= 0 ? "+" : ""}
                  {formatCurrency(resultB.totalUnsocialAmount.annual - resultA.totalUnsocialAmount.annual)}
                </td>
              </tr>

              <tr className="bg-zinc-50/80 font-bold text-zinc-950">
                <td className="py-2.5 px-4 font-sans">Total Gross Pay</td>
                <td className="py-2.5 px-4 text-right tabular-nums">
                  {formatCurrency(resultA.grossPay.annual)}
                </td>
                <td className="py-2.5 px-4 text-right tabular-nums">
                  {formatCurrency(resultB.grossPay.annual)}
                </td>
                <td className="py-2.5 px-4 text-right tabular-nums">
                  {diffGrossAnnual >= 0 ? "+" : ""}
                  {formatCurrency(diffGrossAnnual)}
                </td>
              </tr>

              <tr className="hover:bg-zinc-50/60 text-zinc-600">
                <td className="py-2 px-4 font-sans">
                  NHS Pension ({resultA.pensionTierLabel} vs {resultB.pensionTierLabel})
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  −{formatCurrency(resultA.pensionContribution.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  −{formatCurrency(resultB.pensionContribution.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {diffPensionAnnual >= 0 ? "+" : ""}
                  {formatCurrency(diffPensionAnnual)}
                </td>
              </tr>

              <tr className="hover:bg-zinc-50/60 text-zinc-600">
                <td className="py-2 px-4 font-sans">PAYE Income Tax</td>
                <td className="py-2 px-4 text-right tabular-nums">
                  −{formatCurrency(resultA.incomeTax.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  −{formatCurrency(resultB.incomeTax.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {diffTaxAnnual >= 0 ? "+" : ""}
                  {formatCurrency(diffTaxAnnual)}
                </td>
              </tr>

              <tr className="hover:bg-zinc-50/60 text-zinc-600">
                <td className="py-2 px-4 font-sans">National Insurance (8%/2%)</td>
                <td className="py-2 px-4 text-right tabular-nums">
                  −{formatCurrency(resultA.nationalInsurance.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  −{formatCurrency(resultB.nationalInsurance.annual)}
                </td>
                <td className="py-2 px-4 text-right tabular-nums">
                  {diffNiAnnual >= 0 ? "+" : ""}
                  {formatCurrency(diffNiAnnual)}
                </td>
              </tr>

              <tr className="bg-zinc-950 text-white font-bold text-sm">
                <td className="py-3 px-4 font-sans">
                  Net Take-Home Pay (Annual)
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  {formatCurrency(resultA.netPay.annual, true)}
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  {formatCurrency(resultB.netPay.annual, true)}
                </td>
                <td
                  className={`py-3 px-4 text-right tabular-nums font-extrabold ${
                    diffNetAnnual >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {diffNetAnnual >= 0 ? "+" : ""}
                  {formatCurrency(diffNetAnnual, true)}
                </td>
              </tr>

              <tr className="bg-zinc-900 text-zinc-300 font-semibold">
                <td className="py-2.5 px-4 font-sans">
                  Net Take-Home Pay (Monthly Deposit)
                </td>
                <td className="py-2.5 px-4 text-right tabular-nums text-white">
                  {formatCurrency(resultA.netPay.monthly, true)}/mo
                </td>
                <td className="py-2.5 px-4 text-right tabular-nums text-white">
                  {formatCurrency(resultB.netPay.monthly, true)}/mo
                </td>
                <td
                  className={`py-2.5 px-4 text-right tabular-nums font-bold ${
                    diffNetMonthly >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {diffNetMonthly >= 0 ? "+" : ""}
                  {formatCurrency(diffNetMonthly, true)}/mo
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
