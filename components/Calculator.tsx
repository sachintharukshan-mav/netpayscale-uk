"use client";

import React, { useState, useMemo, useEffect } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import NetPaySummary from "./NetPaySummary";
import VisualBreakdownBar from "./VisualBreakdownBar";
import ItemizedTable from "./ItemizedTable";
import {
  Building2,
  ChevronRight,
  Clock,
  Compass,
  GraduationCap,
  HelpCircle,
  MapPin,
  Moon,
  PiggyBank,
  Settings2,
  ShieldAlert,
  Sun,
  UserCheck,
} from "lucide-react";

interface CalculatorProps {
  initialBand?: string;
  initialStepIndex?: number;
  initialHcasZone?: "inner-london" | "outer-london" | "fringe" | "standard";
  initialRoleTitle?: string;
}

export default function Calculator({
  initialBand = "Band 5",
  initialStepIndex = 0,
  initialHcasZone = "standard",
  initialRoleTitle,
}: CalculatorProps) {
  const [band, setBand] = useState<string>(initialBand);
  const [stepIndex, setStepIndex] = useState<number>(initialStepIndex);
  const [hcasZone, setHcasZone] = useState<"inner-london" | "outer-london" | "fringe" | "standard">(initialHcasZone);
  const [nightHours, setNightHours] = useState<number>(0);
  const [sundayHours, setSundayHours] = useState<number>(0);
  const [pensionOptedOut, setPensionOptedOut] = useState<boolean>(false);
  const [isScottishTax, setIsScottishTax] = useState<boolean>(false);
  const [studentLoan, setStudentLoan] = useState<"none" | "plan1" | "plan2" | "plan4" | "postgrad">("none");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<"annual" | "monthly" | "weekly">("monthly");

  // Keep step index within valid bounds when band changes
  const currentBandData = useMemo(() => {
    return nhsData.bands.find((b) => b.band === band) || nhsData.bands[3];
  }, [band]);

  useEffect(() => {
    if (stepIndex >= currentBandData.points.length) {
      setStepIndex(0);
    }
  }, [band, currentBandData, stepIndex]);

  const inputs: CalculatorInputs = useMemo(
    () => ({
      band,
      stepIndex,
      hcasZone,
      nightHoursPerWeek: nightHours,
      sundayHoursPerWeek: sundayHours,
      pensionOptedOut,
      isScottishTax,
      studentLoan,
    }),
    [band, stepIndex, hcasZone, nightHours, sundayHours, pensionOptedOut, isScottishTax, studentLoan]
  );

  const result = useMemo(() => calculateNHSPay(inputs), [inputs]);

  return (
    <div className="w-full space-y-6">
      {/* 2-Column Responsive Layout: Inputs on Left, Real-Time Sticky Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Band Selection */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-white text-xs font-bold">
                  1
                </span>
                <span>NHS Agenda for Change Pay Band</span>
              </label>
              <span className="text-xs font-semibold text-[#005EB8] dark:text-[#41B6E6]">
                3.3% 2026/27 Uplift
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {nhsData.bands.map((b) => {
                const isSelected = b.band === band;
                return (
                  <button
                    key={b.band}
                    type="button"
                    onClick={() => setBand(b.band)}
                    className={`relative flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all ${
                      isSelected
                        ? "border-2 border-[#005EB8] bg-blue-50/70 text-[#005EB8] shadow-sm dark:border-[#41B6E6] dark:bg-blue-950/40 dark:text-[#41B6E6] font-bold"
                        : "border border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">{b.band}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      from {formatCurrency(b.points[0].annualSalary)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Typical Roles Hint */}
            <div className="mt-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-850 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <Compass className="h-4 w-4 text-[#005EB8] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentBandData.band} Common Roles:{" "}
                </span>
                <span>{currentBandData.typicalRoles.join(", ")}</span>
              </div>
            </div>
          </div>

          {/* 2. Step / Experience Point */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-white text-xs font-bold">
                2
              </span>
              <span>Years of Experience (Pay Step)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentBandData.points.map((pt, idx) => {
                const isSelected = stepIndex === idx;
                return (
                  <button
                    key={pt.step}
                    type="button"
                    onClick={() => setStepIndex(idx)}
                    className={`flex flex-col rounded-xl p-3 text-left transition-all ${
                      isSelected
                        ? "border-2 border-[#005EB8] bg-blue-50/70 dark:border-[#41B6E6] dark:bg-blue-950/40"
                        : "border border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {pt.step}
                    </span>
                    <div className="mt-1 flex items-baseline justify-between font-mono">
                      <span className="text-sm font-extrabold text-[#005EB8] dark:text-[#41B6E6]">
                        {formatCurrency(pt.annualSalary)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formatHourlyRate(pt.hourlyRate)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. High Cost Area Supplement (HCAS / London Weighting) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-white text-xs font-bold">
                  3
                </span>
                <span>Region & London Weighting (HCAS)</span>
              </label>
              {result.hcasAmount.annual > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +{formatCurrency(result.hcasAmount.annual)}/yr ({result.hcasPercentage}%)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {nhsData.hcasZones.map((z) => {
                const isSelected = hcasZone === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setHcasZone(z.id as any)}
                    className={`flex flex-col rounded-xl p-3 text-left transition-all ${
                      isSelected
                        ? "border-2 border-[#005EB8] bg-blue-50/70 text-slate-900 dark:border-[#41B6E6] dark:bg-blue-950/40 dark:text-white"
                        : "border border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {z.name}
                      </span>
                      {z.percentage > 0 ? (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-[#005EB8] dark:bg-blue-900 dark:text-blue-200 font-mono">
                          +{z.percentage}%
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">0%</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {z.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Section 2 Unsocial Hours Enhancements (Night & Weekend Shift Hours) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-white text-xs font-bold">
                  4
                </span>
                <span>Unsocial Hours Enhancements (Section 2 AfC)</span>
              </label>
              {result.totalUnsocialAmount.annual > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +{formatCurrency(result.totalUnsocialAmount.annual)}/yr
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter your average weekly unsocial shift hours. Nights & Saturdays pay{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                +{["Band 2", "Band 3"].includes(band) ? "44%" : "30%"}
              </strong>
              ; Sundays & Public Holidays pay{" "}
              <strong className="text-slate-700 dark:text-slate-300">
                +{["Band 2", "Band 3"].includes(band) ? "88%" : "60%"}
              </strong>
              .
            </p>

            <div className="space-y-4">
              {/* Slider 1: Night / Saturday */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Night & Saturday Hours (weekly)</span>
                  </span>
                  <span className="font-mono text-sm text-[#005EB8] dark:text-[#41B6E6]">
                    {nightHours} hrs/wk{" "}
                    {nightHours > 0 && (
                      <span className="text-xs text-slate-500 font-normal">
                        (+{formatCurrency(result.unsocialNightAmount.monthly)}/mo)
                      </span>
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={nightHours}
                  onChange={(e) => setNightHours(parseInt(e.target.value) || 0)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-[#005EB8]"
                />
              </div>

              {/* Slider 2: Sunday / Bank Holiday */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    <span>Sunday & Bank Holiday Hours (weekly)</span>
                  </span>
                  <span className="font-mono text-sm text-[#005EB8] dark:text-[#41B6E6]">
                    {sundayHours} hrs/wk{" "}
                    {sundayHours > 0 && (
                      <span className="text-xs text-slate-500 font-normal">
                        (+{formatCurrency(result.unsocialSundayAmount.monthly)}/mo)
                      </span>
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={sundayHours}
                  onChange={(e) => setSundayHours(parseInt(e.target.value) || 0)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 5. Advanced Settings (Pension Opt-Out, Scottish Tax, Student Loans) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-slate-500" />
                <span>Advanced Deduction Controls (Pension, Tax Code, Student Loan)</span>
              </span>
              <span className="text-[#005EB8] dark:text-[#41B6E6]">
                {showAdvanced ? "Hide options ▲" : "Show options ▼"}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                {/* Pension Opt Out Toggle */}
                <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                  <div>
                    <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                      <PiggyBank className="h-3.5 w-3.5" />
                      NHS Pension Scheme Enrollment
                    </span>
                    <p className="text-[11px] text-purple-700/80 dark:text-purple-400 mt-0.5">
                      Default is enrolled (2015 CARE Scheme). Your tier is{" "}
                      <strong>{result.pensionTierLabel}</strong> with full tax relief at source.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={!pensionOptedOut}
                      onChange={(e) => setPensionOptedOut(!e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {pensionOptedOut && (
                  <div className="rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>
                      Opting out forfeits the employer NHS contribution (23.7%) and life assurance benefits.
                    </span>
                  </div>
                )}

                {/* Scottish Tax Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Scottish Resident Taxpayer
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Applies Scottish Parliament Income Tax bands (19% Starter to 48% Top).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isScottishTax}
                    onChange={(e) => setIsScottishTax(e.target.checked)}
                    className="h-4 w-4 text-[#005EB8] rounded border-slate-300 focus:ring-[#005EB8]"
                  />
                </div>

                {/* Student Loan Picker */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 space-y-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-slate-500" />
                    <span>Student Loan Plan</span>
                  </label>
                  <select
                    value={studentLoan}
                    onChange={(e) => setStudentLoan(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="none">No Student Loan Repayment</option>
                    <option value="plan1">Plan 1 (Pre-2012 UK - 9% over £24,990)</option>
                    <option value="plan2">Plan 2 (Post-2012 England/Wales - 9% over £27,295)</option>
                    <option value="plan4">Plan 4 (Scotland - 9% over £31,395)</option>
                    <option value="postgrad">Postgraduate Master's/PhD (6% over £21,000)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Real-Time Pay Output & Visual Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          {/* Main Take-Home Box */}
          <NetPaySummary
            result={result}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />

          {/* Visual Breakdown Bar */}
          <VisualBreakdownBar
            result={result}
            timeframe={timeframe === "weekly" ? "monthly" : timeframe}
          />
        </div>
      </div>

      {/* FULL-WIDTH SECTION: Itemized Table Accordion */}
      <div className="pt-2">
        <ItemizedTable result={result} />
      </div>
    </div>
  );
}
