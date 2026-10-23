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
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [nightHours, setNightHours] = useState<number>(0);
  const [sundayHours, setSundayHours] = useState<number>(0);
  const [taxCode, setTaxCode] = useState<"1257L" | "S1257L" | "C1257L" | "BR" | "D0">("1257L");
  const [pensionOptedOut, setPensionOptedOut] = useState<boolean>(false);
  const [studentLoan, setStudentLoan] = useState<"none" | "plan1" | "plan2" | "plan4" | "plan5" | "postgrad">("none");
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
      contractedHours,
      nightHoursPerWeek: nightHours,
      sundayHoursPerWeek: sundayHours,
      pensionOptedOut,
      taxCode,
      isScottishTax: taxCode === "S1257L",
      studentLoan,
    }),
    [band, stepIndex, hcasZone, contractedHours, nightHours, sundayHours, pensionOptedOut, taxCode, studentLoan]
  );

  const result = useMemo(() => calculateNHSPay(inputs), [inputs]);

  // Band short labels for segmented pill bar (2, 3, 4, 5, 6, 7, 8a, 8b, 8c, 8d, 9)
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

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls & Precision Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Pay Band Segmented Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Pay Band
              </label>
              <span className="text-xs text-zinc-500 font-mono">
                {currentBandData.band} · 2026/27 (+3.3%)
              </span>
            </div>

            {/* Seamless Segmented Button Row */}
            <div className="flex flex-wrap rounded-xl border border-zinc-200/90 bg-white p-1 shadow-xs gap-1">
              {bandList.map((item) => {
                const isSelected = item.full === band;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setBand(item.full)}
                    className={`flex-1 min-w-[40px] py-2 px-2.5 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-500">
              <span className="font-medium text-zinc-700">{currentBandData.band} typical roles: </span>
              {currentBandData.typicalRoles.join(", ")}.
            </p>
          </div>

          {/* 2. Pay Point (Experience Step) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Pay Point (Experience Step)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentBandData.points.map((pt, idx) => {
                const isSelected = stepIndex === idx;
                return (
                  <button
                    key={pt.step}
                    type="button"
                    onClick={() => setStepIndex(idx)}
                    className={`rounded-xl p-3.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-zinc-950 bg-zinc-50 shadow-xs"
                        : "border border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
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

          {/* 3. Hours Per Week (FTE pro-rata) */}
          <div className="space-y-2 rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900">Contracted Hours Per Week</span>
              <span className="font-mono font-bold text-zinc-950 tabular-nums">
                {contractedHours} hrs/week {contractedHours !== 37.5 && `(${Math.round((contractedHours / 37.5) * 100)}% WTE)`}
              </span>
            </div>

            <input
              type="range"
              min="7.5"
              max="48"
              step="0.5"
              value={contractedHours}
              onChange={(e) => setContractedHours(parseFloat(e.target.value) || 37.5)}
              className="w-full"
            />

            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] text-zinc-400">Presets:</span>
              {[
                { label: "Full-Time (37.5h)", val: 37.5 },
                { label: "30h", val: 30 },
                { label: "22.5h (3 days)", val: 22.5 },
                { label: "15h (2 days)", val: 15 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setContractedHours(p.val)}
                  className={`rounded px-2 py-0.5 text-[11px] font-mono transition-colors cursor-pointer ${
                    contractedHours === p.val
                      ? "bg-zinc-900 text-white font-medium"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. London Weighting (HCAS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Location & London Weighting (HCAS)
              </label>
              {result.hcasAmount.annual > 0 && (
                <span className="text-xs font-mono font-semibold text-zinc-900">
                  +{formatCurrency(result.hcasAmount.annual)}/yr
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {nhsData.hcasZones.map((z) => {
                const isSelected = hcasZone === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setHcasZone(z.id as any)}
                    className={`rounded-xl p-2.5 text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-zinc-950 bg-zinc-50 shadow-xs"
                        : "border border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                    }`}
                  >
                    <div className="text-xs font-semibold text-zinc-900">{z.name}</div>
                    <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                      {z.percentage > 0 ? `+${z.percentage}%` : "0%"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Section 2 Unsocial Hours & Night Shifts */}
          <div className="space-y-4 rounded-xl border border-zinc-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">
                  Unsocial Hours & Night Enhancements
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Section 2 AfC enhancements: Nights/Sats (+30%/+44%), Sundays/BH (+60%/+88%)
                </p>
              </div>
              {result.totalUnsocialAmount.annual > 0 && (
                <span className="text-xs font-mono font-bold text-zinc-950 bg-zinc-100 rounded px-2 py-0.5">
                  +{formatCurrency(result.totalUnsocialAmount.monthly)}/mo
                </span>
              )}
            </div>

            {/* Night Hours Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700">Night & Saturday Hours (weekly)</span>
                <span className="font-mono font-bold text-zinc-950 tabular-nums">
                  {nightHours} hrs/week
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="34.5"
                step="0.5"
                value={nightHours}
                onChange={(e) => setNightHours(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-zinc-400">Presets:</span>
                {[
                  { label: "0h", val: 0 },
                  { label: "1x Night (11.5h)", val: 11.5 },
                  { label: "2x Nights (23h)", val: 23 },
                  { label: "3x Nights (34.5h)", val: 34.5 },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setNightHours(p.val)}
                    className={`rounded px-2 py-0.5 text-[11px] font-mono transition-colors cursor-pointer ${
                      nightHours === p.val
                        ? "bg-zinc-900 text-white font-medium"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sunday Hours Slider */}
            <div className="space-y-2 pt-3 border-t border-zinc-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700">Sunday & Bank Holiday Hours (weekly)</span>
                <span className="font-mono font-bold text-zinc-950 tabular-nums">
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
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-zinc-400">Presets:</span>
                {[
                  { label: "0h", val: 0 },
                  { label: "1x Shift (7.5h)", val: 7.5 },
                  { label: "1x Long Day (11.5h)", val: 11.5 },
                  { label: "2x Shifts (15h)", val: 15 },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setSundayHours(p.val)}
                    className={`rounded px-2 py-0.5 text-[11px] font-mono transition-colors cursor-pointer ${
                      sundayHours === p.val
                        ? "bg-zinc-900 text-white font-medium"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Tax Code, Student Loan, and Pension Configuration */}
          <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between text-xs font-semibold text-zinc-700 hover:text-zinc-950 cursor-pointer"
            >
              <span>Tax Code, Student Loan & Pension Controls</span>
              <span className="text-zinc-500 font-normal">
                {showAdvanced ? "Hide settings ▲" : "Configure deductions ▼"}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-zinc-100 space-y-4 text-xs">
                {/* Tax Code Selection */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-zinc-900">Tax Code</label>
                    <span className="text-[11px] text-zinc-500 font-mono">Current: {taxCode}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { code: "1257L", label: "1257L (Standard UK)" },
                      { code: "S1257L", label: "S1257L (Scotland)" },
                      { code: "C1257L", label: "C1257L (Wales)" },
                      { code: "BR", label: "BR (2nd Job / Bank 20%)" },
                    ].map((tc) => (
                      <button
                        key={tc.code}
                        type="button"
                        onClick={() => setTaxCode(tc.code as any)}
                        className={`rounded-lg p-2 text-center text-xs font-mono transition-all cursor-pointer ${
                          taxCode === tc.code
                            ? "bg-zinc-900 text-white font-bold"
                            : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        {tc.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student Loan Selection */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-50">
                  <label className="font-semibold text-zinc-900">Student Loan Plan</label>
                  <select
                    value={studentLoan}
                    onChange={(e) => setStudentLoan(e.target.value as any)}
                    className="w-full rounded-md border border-zinc-300 bg-white p-2 text-xs text-zinc-800"
                  >
                    <option value="none">No student loan deductions</option>
                    <option value="plan1">Plan 1 (9% on earnings over £24,990/yr)</option>
                    <option value="plan2">Plan 2 (9% on earnings over £27,295/yr)</option>
                    <option value="plan4">Plan 4 Scotland (9% on earnings over £31,395/yr)</option>
                    <option value="plan5">Plan 5 Post-2023 (9% on earnings over £25,000/yr)</option>
                    <option value="postgrad">Postgraduate Master&apos;s / PhD (6% on earnings over £21,000/yr)</option>
                  </select>
                </div>

                {/* NHS Pension Toggle */}
                <div className="flex items-center justify-between py-2 border-t border-zinc-50">
                  <div>
                    <div className="font-semibold text-zinc-900">Enrolled in 2015 NHS Pension Scheme</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Your tier is {result.pensionTierLabel} deducted before income tax.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!pensionOptedOut}
                    onChange={(e) => setPensionOptedOut(!e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Results & Breakdown (5 cols) */}
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
