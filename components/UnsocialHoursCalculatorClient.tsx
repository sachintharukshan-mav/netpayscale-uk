"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import {
  Moon,
  Sun,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Info,
  DollarSign,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";

export function UnsocialHoursCalculatorClient() {
  const [band, setBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [hcasZone, setHcasZone] = useState<"standard" | "inner-london" | "outer-london" | "fringe">("standard");
  const [contractedHours, setContractedHours] = useState<number>(37.5);

  // Shift Rota inputs (hours per week)
  const [dayHours, setDayHours] = useState<number>(23);
  const [nightHours, setNightHours] = useState<number>(11.5);
  const [saturdayHours, setSaturdayHours] = useState<number>(0);
  const [sundayHours, setSundayHours] = useState<number>(3);

  const [isScottishTax, setIsScottishTax] = useState<boolean>(false);
  const [hasStudentLoan, setHasStudentLoan] = useState<boolean>(false); // Plan 2

  const currentBandData = useMemo(() => {
    return nhsData.bands.find((b) => b.band === band) || nhsData.bands[3];
  }, [band]);

  const currentPoint = currentBandData.points[stepIndex] || currentBandData.points[0];
  const fullTimeBaseSalary = currentPoint.annualSalary;
  const baseHourlyRate = fullTimeBaseSalary / 1955.357;

  // Determine Section 2 uplift rates
  const isLowerBand = ["Band 2", "Band 3"].includes(band);
  const nightUpliftRate = isLowerBand ? 0.44 : 0.30;
  const saturdayUpliftRate = isLowerBand ? 0.44 : 0.30;
  const sundayUpliftRate = isLowerBand ? 0.88 : 0.60;

  // Total weekly hours worked
  const totalWeeklyHours = dayHours + nightHours + saturdayHours + sundayHours;

  // HCAS London Weighting
  const fte = contractedHours / 37.5;
  const baseSalaryAnnual = fullTimeBaseSalary * fte;
  let hcasAnnual = 0;
  if (hcasZone === "inner-london") {
    hcasAnnual = Math.min(8746 * fte, Math.max(5794 * fte, baseSalaryAnnual * 0.20));
  } else if (hcasZone === "outer-london") {
    hcasAnnual = Math.min(6137 * fte, Math.max(4870 * fte, baseSalaryAnnual * 0.15));
  } else if (hcasZone === "fringe") {
    hcasAnnual = Math.min(2270 * fte, Math.max(1346 * fte, baseSalaryAnnual * 0.05));
  }

  // Hourly rate with HCAS if applicable
  const effectiveHourlyRate = (baseSalaryAnnual + hcasAnnual) / (1955.357 * fte);

  // Unsocial hourly bonus amounts (the extra enhancement on top of base)
  const nightHourlyBonus = effectiveHourlyRate * nightUpliftRate;
  const saturdayHourlyBonus = effectiveHourlyRate * saturdayUpliftRate;
  const sundayHourlyBonus = effectiveHourlyRate * sundayUpliftRate;

  // Annual and monthly enhancement totals
  const annualNightEnhancement = nightHours * 52.143 * nightHourlyBonus;
  const annualSaturdayEnhancement = saturdayHours * 52.143 * saturdayHourlyBonus;
  const annualSundayEnhancement = sundayHours * 52.143 * sundayHourlyBonus;
  const totalEnhancementAnnual = annualNightEnhancement + annualSaturdayEnhancement + annualSundayEnhancement;
  const totalEnhancementMonthly = totalEnhancementAnnual / 12;

  // Total gross pay
  const totalGrossAnnual = baseSalaryAnnual + hcasAnnual + totalEnhancementAnnual;
  const baselineGrossAnnual = baseSalaryAnnual + hcasAnnual;

  // Pension calculation (2015 Scheme CARE)
  // Contractual unsocial enhancements within 37.5h are pensionable
  const pensionableAnnual = baseSalaryAnnual + hcasAnnual;
  let pensionRate = 0.083;
  for (const tier of nhsData.pensionTiers) {
    if (tier.max === null || pensionableAnnual <= tier.max) {
      pensionRate = tier.rate;
      break;
    }
  }
  const pensionAnnual = pensionableAnnual * pensionRate;

  // Helper for Net Tax calculation
  const calculateNetFromGross = (gross: number) => {
    const adjustedNetIncome = Math.max(0, gross - pensionAnnual);
    let personalAllowance = 12570;
    if (adjustedNetIncome > 100000) {
      const loss = Math.min(personalAllowance, Math.floor((adjustedNetIncome - 100000) / 2));
      personalAllowance -= loss;
    }
    const taxable = Math.max(0, adjustedNetIncome - personalAllowance);

    let tax = 0;
    if (!isScottishTax) {
      const b1 = Math.min(taxable, 37700);
      const b2 = Math.max(0, Math.min(taxable - 37700, 125140 - 50270));
      const b3 = Math.max(0, taxable - (125140 - 12570));
      tax = b1 * 0.20 + b2 * 0.40 + b3 * 0.45;
    } else {
      const sBands = [
        { width: 2306, rate: 0.19 },
        { width: 11685, rate: 0.20 },
        { width: 17101, rate: 0.21 },
        { width: 31338, rate: 0.42 },
        { width: 50140, rate: 0.45 },
        { width: Infinity, rate: 0.48 },
      ];
      let rem = taxable;
      for (const sb of sBands) {
        if (rem <= 0) break;
        const slice = Math.min(rem, sb.width);
        tax += slice * sb.rate;
        rem -= slice;
      }
    }

    // National Insurance (Class 1) - 8% between £12,570 and £50,270, 2% above
    let ni = 0;
    if (gross > 12570) {
      const mainNiSlice = Math.min(gross - 12570, 50270 - 12570);
      const upperNiSlice = Math.max(0, gross - 50270);
      ni = mainNiSlice * 0.08 + upperNiSlice * 0.02;
    }

    // Student loan Plan 2 (9% over £27,295)
    let studentLoan = 0;
    if (hasStudentLoan && gross > 27295) {
      studentLoan = (gross - 27295) * 0.09;
    }

    const netAnnual = gross - tax - ni - pensionAnnual - studentLoan;
    return {
      netAnnual,
      netMonthly: netAnnual / 12,
      taxMonthly: tax / 12,
      niMonthly: ni / 12,
      pensionMonthly: pensionAnnual / 12,
      studentLoanMonthly: studentLoan / 12,
    };
  };

  const currentNet = calculateNetFromGross(totalGrossAnnual);
  const baselineNet = calculateNetFromGross(baselineGrossAnnual);

  // Pure net cash yield of the unsocial hours
  const netEnhancementMonthly = Math.max(0, currentNet.netMonthly - baselineNet.netMonthly);
  const netEnhancementAnnual = netEnhancementMonthly * 12;

  // Approximate marginal retention rate
  const marginalRetentionRate =
    totalEnhancementMonthly > 0 ? (netEnhancementMonthly / totalEnhancementMonthly) * 100 : 72;

  // Rota presets
  const applyPreset = (presetName: string) => {
    if (presetName === "ward") {
      setDayHours(23);
      setNightHours(11.5);
      setSaturdayHours(0);
      setSundayHours(3);
    } else if (presetName === "nights") {
      setDayHours(3);
      setNightHours(34.5);
      setSaturdayHours(0);
      setSundayHours(0);
    } else if (presetName === "weekend") {
      setDayHours(12.5);
      setNightHours(0);
      setSaturdayHours(12.5);
      setSundayHours(12.5);
    } else if (presetName === "clinic") {
      setDayHours(37.5);
      setNightHours(0);
      setSaturdayHours(0);
      setSundayHours(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1-Click Preset Rota Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 shrink-0" />
            <h2 className="text-sm font-extrabold text-slate-900">
              Quick Shift Rota Presets (1-Click Model)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Select a common ward pattern or customize below
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset("ward")}
            className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left transition-all active:scale-[0.98]"
          >
            <span className="text-xs font-bold text-[#005EB8] block">
              🏥 Standard Ward Rota
            </span>
            <span className="text-[11px] text-slate-600 block mt-0.5">
              2 Days, 1 Night, partial Sun
            </span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("nights")}
            className="p-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-left transition-all active:scale-[0.98]"
          >
            <span className="text-xs font-bold text-purple-800 block">
              🌙 Night Shift Intensive
            </span>
            <span className="text-[11px] text-slate-600 block mt-0.5">
              3 x 11.5h Night Shifts/wk
            </span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("weekend")}
            className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-all active:scale-[0.98]"
          >
            <span className="text-xs font-bold text-emerald-800 block">
              ⭐ Weekend Heavy Rota
            </span>
            <span className="text-[11px] text-slate-600 block mt-0.5">
              1 Saturday + 1 Sunday shift
            </span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("clinic")}
            className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-left transition-all active:scale-[0.98]"
          >
            <span className="text-xs font-bold text-slate-700 block">
              🏢 9–5 Clinic (No Unsocial)
            </span>
            <span className="text-[11px] text-slate-600 block mt-0.5">
              Monday–Friday standard hours
            </span>
          </button>
        </div>
      </div>

      {/* Main Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#005EB8]" />
              1. Your Pay Band &amp; Shift Hours
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your Agenda for Change pay step and enter your typical weekly shift distribution.
            </p>
          </div>

          {/* Pay Band & Point Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Agenda for Change Band
              </label>
              <select
                value={band}
                onChange={(e) => {
                  setBand(e.target.value);
                  setStepIndex(0);
                }}
                className="w-full rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005EB8]"
              >
                {nhsData.bands.map((b) => (
                  <option key={b.band} value={b.band}>
                    {b.band} ({b.typicalRoles.slice(0, 2).join(", ")})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pay Spine Step
              </label>
              <select
                value={stepIndex}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                className="w-full rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005EB8]"
              >
                {currentBandData.points.map((pt, idx) => (
                  <option key={idx} value={idx}>
                    {pt.step} ({formatCurrency(pt.annualSalary)}/yr · {formatCurrency(pt.hourlyRate)}/hr)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location HCAS & Regime */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location (London Weighting)
              </label>
              <select
                value={hcasZone}
                onChange={(e) => setHcasZone(e.target.value as any)}
                className="w-full rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005EB8]"
              >
                <option value="standard">Outside London (National Standard)</option>
                <option value="inner-london">Inner London (+20%, up to £8,746)</option>
                <option value="outer-london">Outer London (+15%, up to £5,888)</option>
                <option value="fringe">Fringe Zone (+5%, up to £2,168)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tax Jurisdiction &amp; Deductions
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsScottishTax(false)}
                  className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                    !isScottishTax
                      ? "bg-blue-50 border-[#005EB8] text-[#005EB8]"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  England/Wales
                </button>
                <button
                  type="button"
                  onClick={() => setIsScottishTax(true)}
                  className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isScottishTax
                      ? "bg-blue-50 border-[#005EB8] text-[#005EB8]"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  Scotland (6-Band)
                </button>
              </div>
            </div>
          </div>

          {/* Section 2 Shift Distribution Inputs */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Shift Hours Per Week
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  totalWeeklyHours === 37.5
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                Total: {totalWeeklyHours} hrs/wk {totalWeeklyHours === 37.5 && "(Full 37.5h WTE)"}
              </span>
            </div>

            {/* Standard Day Hours */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Standard Day Hours (Mon–Fri 06:00 – 20:00)
                </span>
                <span className="font-mono font-bold text-slate-900">{dayHours} hrs/wk</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="0.5"
                value={dayHours}
                onChange={(e) => setDayHours(Number(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Plain 1.0x Time Rate: {formatCurrency(effectiveHourlyRate)}/hr</span>
                <span>Gross: {formatCurrency((dayHours * 52.143 * effectiveHourlyRate) / 12)}/mo</span>
              </div>
            </div>

            {/* Weekday Night Hours */}
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-purple-600" />
                  Night Shift Hours (Mon–Fri 20:00 – 06:00)
                </span>
                <span className="font-mono font-bold text-purple-900">
                  {nightHours} hrs/wk
                  <span className="ml-1 text-[11px] font-semibold text-purple-700">
                    (+{Math.round(nightUpliftRate * 100)}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="0.5"
                value={nightHours}
                onChange={(e) => setNightHours(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-purple-700 font-mono">
                <span>
                  Night Rate: {formatCurrency(effectiveHourlyRate * (1 + nightUpliftRate))}/hr (+{formatCurrency(nightHourlyBonus)}/hr extra)
                </span>
                <span className="font-bold">
                  Bonus: +{formatCurrency(annualNightEnhancement / 12)}/mo gross
                </span>
              </div>
            </div>

            {/* Saturday Shift Hours */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#005EB8]" />
                  Saturday Shifts (All Day Saturday)
                </span>
                <span className="font-mono font-bold text-blue-900">
                  {saturdayHours} hrs/wk
                  <span className="ml-1 text-[11px] font-semibold text-blue-700">
                    (+{Math.round(saturdayUpliftRate * 100)}%)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={saturdayHours}
                onChange={(e) => setSaturdayHours(Number(e.target.value))}
                className="w-full accent-[#005EB8] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-blue-700 font-mono">
                <span>
                  Sat Rate: {formatCurrency(effectiveHourlyRate * (1 + saturdayUpliftRate))}/hr (+{formatCurrency(saturdayHourlyBonus)}/hr extra)
                </span>
                <span className="font-bold">
                  Bonus: +{formatCurrency(annualSaturdayEnhancement / 12)}/mo gross
                </span>
              </div>
            </div>

            {/* Sunday & Bank Holiday Hours */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Sundays &amp; Public Holidays (All Day)
                </span>
                <span className="font-mono font-bold text-emerald-900">
                  {sundayHours} hrs/wk
                  <span className="ml-1 text-[11px] font-semibold text-emerald-700">
                    (+{Math.round(sundayUpliftRate * 100)}% Max Uplift)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={sundayHours}
                onChange={(e) => setSundayHours(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-emerald-700 font-mono">
                <span>
                  Sun Rate: {formatCurrency(effectiveHourlyRate * (1 + sundayUpliftRate))}/hr (+{formatCurrency(sundayHourlyBonus)}/hr extra)
                </span>
                <span className="font-bold">
                  Bonus: +{formatCurrency(annualSundayEnhancement / 12)}/mo gross
                </span>
              </div>
            </div>
          </div>

          {/* Student Loan Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={hasStudentLoan}
                onChange={(e) => setHasStudentLoan(e.target.checked)}
                className="w-4 h-4 rounded text-[#005EB8] accent-[#005EB8]"
              />
              <span>Deduct Plan 2 Student Loan (9% over £27,295)</span>
            </label>
          </div>
        </div>

        {/* Right Column: High-Impact Results Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hero Cash Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden space-y-5">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 block mb-1">
                Estimated Net Take-Home Pay (With Enhancements)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {formatCurrency(Math.round(currentNet.netMonthly))}
                </span>
                <span className="text-slate-400 text-sm font-bold">/ month net</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Expected deposit in your bank after PAYE Tax, NI, and {pensionRate * 100}% NHS Pension.
              </p>
            </div>

            {/* Extra Unsocial Cash Callout */}
            <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">
                  ⚡ Extra Unsocial Take-Home Cash:
                </span>
                <span className="text-lg font-black font-mono text-emerald-300">
                  +{formatCurrency(Math.round(netEnhancementMonthly))}/mo
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                You keep <strong>~{marginalRetentionRate.toFixed(0)}p per £1</strong> of your gross unsocial hours bonus (+{formatCurrency(Math.round(netEnhancementAnnual))}/year net cash).
              </p>
            </div>

            {/* Breakdown Comparison: Base vs Total */}
            <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/10">
              <div className="flex justify-between text-slate-300">
                <span>Baseline Standard Net (No Enhancements):</span>
                <span>{formatCurrency(Math.round(baselineNet.netMonthly))}/mo</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Gross Unsocial Enhancement Added:</span>
                <span>+{formatCurrency(Math.round(totalEnhancementMonthly))}/mo</span>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>Tax &amp; Deductions on Enhancements:</span>
                <span>-{formatCurrency(Math.round(totalEnhancementMonthly - netEnhancementMonthly))}/mo</span>
              </div>
            </div>

            {/* Monthly Payslip Deductions */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center font-mono text-xs">
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] block text-slate-400">PAYE Tax</span>
                <span className="font-bold text-rose-400">
                  -{formatCurrency(Math.round(currentNet.taxMonthly))}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] block text-slate-400">National Ins.</span>
                <span className="font-bold text-rose-400">
                  -{formatCurrency(Math.round(currentNet.niMonthly))}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] block text-slate-400">Pension ({pensionRate * 100}%)</span>
                <span className="font-bold text-amber-400">
                  -{formatCurrency(Math.round(currentNet.pensionMonthly))}
                </span>
              </div>
            </div>
          </div>

          {/* Hourly Rates Comparison Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#005EB8]" />
              Official 2026/27 Hourly Rates ({band})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2">Shift Type</th>
                    <th className="py-2">Uplift</th>
                    <th className="py-2">Gross /hr</th>
                    <th className="py-2 text-right">Est. Net /hr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  <tr>
                    <td className="py-2.5 font-sans font-semibold text-slate-800">
                      Standard Day
                    </td>
                    <td className="py-2.5 text-slate-500">1.0x</td>
                    <td className="py-2.5 font-bold text-slate-900">
                      {formatCurrency(effectiveHourlyRate)}
                    </td>
                    <td className="py-2.5 text-right text-emerald-700 font-bold">
                      ~{formatCurrency(effectiveHourlyRate * 0.72)}
                    </td>
                  </tr>
                  <tr className="bg-purple-50/50">
                    <td className="py-2.5 font-sans font-semibold text-purple-900">
                      Night Shift (Mon–Fri)
                    </td>
                    <td className="py-2.5 text-purple-700 font-bold">
                      +{Math.round(nightUpliftRate * 100)}%
                    </td>
                    <td className="py-2.5 font-bold text-purple-900">
                      {formatCurrency(effectiveHourlyRate * (1 + nightUpliftRate))}
                    </td>
                    <td className="py-2.5 text-right text-purple-900 font-bold">
                      ~{formatCurrency(effectiveHourlyRate * (1 + nightUpliftRate) * 0.70)}
                    </td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="py-2.5 font-sans font-semibold text-blue-900">
                      Saturday (All Day)
                    </td>
                    <td className="py-2.5 text-blue-700 font-bold">
                      +{Math.round(saturdayUpliftRate * 100)}%
                    </td>
                    <td className="py-2.5 font-bold text-blue-900">
                      {formatCurrency(effectiveHourlyRate * (1 + saturdayUpliftRate))}
                    </td>
                    <td className="py-2.5 text-right text-blue-900 font-bold">
                      ~{formatCurrency(effectiveHourlyRate * (1 + saturdayUpliftRate) * 0.70)}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="py-2.5 font-sans font-semibold text-emerald-900">
                      Sunday / Bank Hol.
                    </td>
                    <td className="py-2.5 text-emerald-700 font-bold">
                      +{Math.round(sundayUpliftRate * 100)}%
                    </td>
                    <td className="py-2.5 font-bold text-emerald-900">
                      {formatCurrency(effectiveHourlyRate * (1 + sundayUpliftRate))}
                    </td>
                    <td className="py-2.5 text-right text-emerald-900 font-bold">
                      ~{formatCurrency(effectiveHourlyRate * (1 + sundayUpliftRate) * 0.68)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 1-Tap Share Button */}
          <ShareBreakdownButton
            variant="light"
            label="Share My Shift Rota Breakdown (WhatsApp)"
            url="https://netpayscale.uk/unsocial-hours-calculator/"
            shareText={`🌙 NHS ${band} Unsocial Hours & Shift Pay 2026/27:\n• Rota: ${dayHours}h Days | ${nightHours}h Nights | ${saturdayHours}h Sats | ${sundayHours}h Suns\n• Total Net Take-Home: ${formatCurrency(Math.round(currentNet.netMonthly))}/mo\n• Extra Unsocial Net Cash: +${formatCurrency(Math.round(netEnhancementMonthly))}/mo (~${marginalRetentionRate.toFixed(0)}% kept)\nCalculate your shift pay: https://netpayscale.uk/unsocial-hours-calculator/`}
          />
        </div>
      </div>
    </div>
  );
}
