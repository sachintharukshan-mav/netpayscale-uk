"use client";

import React, { useState, useMemo, useEffect } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import NetPaySummary from "./NetPaySummary";
import VisualBreakdownBar from "./VisualBreakdownBar";
import ItemizedTable from "./ItemizedTable";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls & Precision Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Band Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-950">
                Agenda for Change Pay Band
              </h3>
              <span className="text-xs text-zinc-500 font-mono">
                2026/27 (+3.3%)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {nhsData.bands.map((b) => {
                const isSelected = b.band === band;
                return (
                  <button
                    key={b.band}
                    type="button"
                    onClick={() => setBand(b.band)}
                    className={`rounded-lg p-2.5 text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-zinc-900 text-white shadow-xs font-semibold"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50/80 active:scale-[0.98]"
                    }`}
                  >
                    <div className="text-xs font-semibold">{b.band}</div>
                    <div className={`text-[10px] font-mono mt-0.5 tabular-nums ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}>
                      {formatCurrency(b.points[0].annualSalary)}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              <span className="font-medium text-zinc-700">Representative roles: </span>
              {currentBandData.typicalRoles.join(", ")}.
            </p>
          </div>

          {/* Step Selection */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-zinc-950">
              Experience Progression Step
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentBandData.points.map((pt, idx) => {
                const isSelected = stepIndex === idx;
                return (
                  <button
                    key={pt.step}
                    type="button"
                    onClick={() => setStepIndex(idx)}
                    className={`rounded-lg p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-zinc-950 bg-zinc-50 shadow-xs"
                        : "border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60 active:scale-[0.98]"
                    }`}
                  >
                    <div className="text-xs font-semibold text-zinc-900">{pt.step}</div>
                    <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                      <span className="text-sm font-bold text-zinc-950">
                        {formatCurrency(pt.annualSalary)}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {formatHourlyRate(pt.hourlyRate)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* HCAS (London Weighting) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-950">
                High Cost Area Supplement (HCAS)
              </h3>
              {result.hcasAmount.annual > 0 && (
                <span className="text-xs font-mono font-medium text-zinc-900">
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
                    className={`rounded-lg p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-zinc-950 bg-zinc-50 shadow-xs"
                        : "border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60 active:scale-[0.98]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                      <span>{z.name}</span>
                      <span className="font-mono text-zinc-600">
                        {z.percentage > 0 ? `+${z.percentage}%` : "0%"}
                      </span>
                    </div>
                    {z.percentage > 0 && (
                      <div className="text-[11px] font-mono text-zinc-500 mt-1 tabular-nums">
                        Min {formatCurrency(z.min)} • Max {formatCurrency(z.max)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2 Unsocial Hours Enhancements */}
          <div className="space-y-4 rounded-xl border border-zinc-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-950">
                Unsocial Hours Enhancements (Section 2 AfC)
              </h3>
              {result.totalUnsocialAmount.annual > 0 && (
                <span className="text-xs font-mono font-semibold text-zinc-900">
                  +{formatCurrency(result.totalUnsocialAmount.monthly)}/mo uplift
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Section 2 rules apply +{["Band 2", "Band 3"].includes(band) ? "44%" : "30%"} for nights & Saturdays, and +{["Band 2", "Band 3"].includes(band) ? "88%" : "60%"} for Sundays & public holidays.
            </p>

            {/* Night Hours Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700">Night & Saturday Hours (weekly)</span>
                <span className="font-mono font-semibold text-zinc-950 tabular-nums">
                  {nightHours} hrs/week
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={nightHours}
                onChange={(e) => setNightHours(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-zinc-400">Presets:</span>
                {[0, 11.5, 23, 34.5].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNightHours(preset)}
                    className={`rounded px-2 py-0.5 text-[11px] font-mono transition-colors ${
                      nightHours === preset
                        ? "bg-zinc-900 text-white font-medium"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {preset === 0 ? "0h" : `${preset}h`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sunday Hours Slider */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700">Sunday & Bank Holiday Hours (weekly)</span>
                <span className="font-mono font-semibold text-zinc-950 tabular-nums">
                  {sundayHours} hrs/week
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={sundayHours}
                onChange={(e) => setSundayHours(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-zinc-400">Presets:</span>
                {[0, 7.5, 11.5, 15].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSundayHours(preset)}
                    className={`rounded px-2 py-0.5 text-[11px] font-mono transition-colors ${
                      sundayHours === preset
                        ? "bg-zinc-900 text-white font-medium"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {preset === 0 ? "0h" : `${preset}h`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Adjustments Toggle */}
          <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between text-xs font-semibold text-zinc-700 hover:text-zinc-950"
            >
              <span>Pension, Scottish Tax & Student Loans</span>
              <span className="text-zinc-500 font-normal">
                {showAdvanced ? "Close options ▲" : "Configure adjustments ▼"}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-zinc-100 space-y-4 text-xs">
                {/* Pension opt out */}
                <div className="flex items-center justify-between py-1">
                  <div>
                    <div className="font-medium text-zinc-900">Enrolled in 2015 NHS Pension Scheme</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Your tier is {result.pensionTierLabel} deducted pre-tax under Net Pay arrangement.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!pensionOptedOut}
                    onChange={(e) => setPensionOptedOut(!e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                </div>

                {/* Scottish Tax */}
                <div className="flex items-center justify-between py-1 border-t border-zinc-50">
                  <div>
                    <div className="font-medium text-zinc-900">Scottish Tax Resident</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Apply Scottish Parliament income tax bands (19% to 48%).
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isScottishTax}
                    onChange={(e) => setIsScottishTax(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                </div>

                {/* Student Loan */}
                <div className="space-y-1.5 pt-1 border-t border-zinc-50">
                  <label className="font-medium text-zinc-900">Student Loan Plan</label>
                  <select
                    value={studentLoan}
                    onChange={(e) => setStudentLoan(e.target.value as any)}
                    className="w-full rounded-md border border-zinc-300 bg-white p-2 text-xs text-zinc-800"
                  >
                    <option value="none">No student loan deductions</option>
                    <option value="plan1">Plan 1 (9% on earnings over £24,990)</option>
                    <option value="plan2">Plan 2 (9% on earnings over £27,295)</option>
                    <option value="plan4">Plan 4 Scotland (9% on earnings over £31,395)</option>
                    <option value="postgrad">Postgraduate Master&apos;s / PhD (6% on earnings over £21,000)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Results & Proportional Distribution (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          <NetPaySummary
            result={result}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />

          <VisualBreakdownBar
            result={result}
            timeframe={timeframe === "weekly" ? "monthly" : timeframe}
          />
        </div>
      </div>

      {/* Itemized Table */}
      <div className="pt-2">
        <ItemizedTable result={result} />
      </div>
    </div>
  );
}
