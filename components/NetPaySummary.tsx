"use client";

import React from "react";
import { formatCurrency, formatHourlyRate, formatPercent } from "@/lib/formatters";
import { CalculationResult } from "@/lib/calculator";

interface NetPaySummaryProps {
  result: CalculationResult;
  timeframe: "annual" | "monthly" | "weekly";
  setTimeframe: (val: "annual" | "monthly" | "weekly") => void;
}

export default function NetPaySummary({
  result,
  timeframe,
  setTimeframe,
}: NetPaySummaryProps) {
  const currentNet =
    timeframe === "annual"
      ? result.netPay.annual
      : timeframe === "monthly"
      ? result.netPay.monthly
      : result.netPay.weekly;

  const currentGross =
    timeframe === "annual"
      ? result.grossPay.annual
      : timeframe === "monthly"
      ? result.grossPay.monthly
      : result.grossPay.weekly;

  const currentDeductions =
    timeframe === "annual"
      ? result.totalDeductions.annual
      : timeframe === "monthly"
      ? result.totalDeductions.monthly
      : result.totalDeductions.weekly;

  const currentPension =
    timeframe === "annual"
      ? result.pensionContribution.annual
      : timeframe === "monthly"
      ? result.pensionContribution.monthly
      : result.pensionContribution.weekly;

  const currentTax =
    timeframe === "annual"
      ? result.incomeTax.annual
      : timeframe === "monthly"
      ? result.incomeTax.monthly
      : result.incomeTax.weekly;

  const currentNI =
    timeframe === "annual"
      ? result.nationalInsurance.annual
      : timeframe === "monthly"
      ? result.nationalInsurance.monthly
      : result.nationalInsurance.weekly;

  const timeframeLabel = timeframe === "annual" ? "year" : timeframe === "monthly" ? "month" : "week";

  return (
    <div className="rounded-xl border border-zinc-200/90 bg-white p-6 shadow-sm">
      {/* Header and timeframe toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div>
          <div className="text-xs font-semibold text-zinc-900">
            {result.bandTitle} · {timeframe} take-home
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {result.stepTitle} • {result.hcasName} {result.contractedHours !== 37.5 && `(${result.contractedHours} hrs/wk)`}
          </p>
        </div>

        <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-medium self-start sm:self-auto">
          {(["monthly", "annual", "weekly"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setTimeframe(period)}
              className={`rounded-md px-3 py-1 capitalize transition-all cursor-pointer ${
                timeframe === period
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              {period === "annual" ? "Yearly" : period}
            </button>
          ))}
        </div>
      </div>

      {/* Main Net Pay Numerals */}
      <div className="py-5">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 font-mono tabular-nums">
            {formatCurrency(currentNet, true)}
          </span>
          <span className="text-sm font-medium text-zinc-500">
            /{timeframeLabel}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500 font-mono">
          <span>from {formatCurrency(currentGross, true)} gross</span>
          <span>•</span>
          <span className="font-semibold text-zinc-800">You keep {result.penceKeptPerPound}p in every £1</span>
        </div>
      </div>

      {/* Key Take-Home Metrics Row */}
      <div className="grid grid-cols-2 gap-2 pb-4 text-xs">
        <div className="rounded-lg bg-zinc-50 p-2.5 border border-zinc-100">
          <span className="text-[11px] text-zinc-500 block">Take-home per hour</span>
          <span className="text-sm font-bold text-zinc-900 font-mono tabular-nums mt-0.5 block">
            {formatCurrency(result.netHourlyRate, true)}/hr
          </span>
        </div>
        <div className="rounded-lg bg-zinc-50 p-2.5 border border-zinc-100">
          <span className="text-[11px] text-zinc-500 block">Effective deductions</span>
          <span className="text-sm font-bold text-zinc-900 font-mono tabular-nums mt-0.5 block">
            {formatPercent(100 - result.takeHomePercentage)}
          </span>
        </div>
      </div>

      {/* Structured Ledger Summary */}
      <div className="space-y-2 border-t border-zinc-100 pt-4 text-xs font-mono">
        <div className="flex items-center justify-between py-1">
          <span className="font-sans text-zinc-600">Gross pay</span>
          <span className="font-semibold text-zinc-900 tabular-nums">
            {formatCurrency(currentGross, true)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="font-sans text-zinc-600">
            Income tax ({result.taxCode})
          </span>
          <span className="text-zinc-700 tabular-nums">
            −{formatCurrency(currentTax, true)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="font-sans text-zinc-600">National Insurance</span>
          <span className="text-zinc-700 tabular-nums">
            −{formatCurrency(currentNI, true)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="font-sans text-zinc-600">
            NHS Pension ({result.pensionTierLabel})
          </span>
          <span className="text-zinc-700 tabular-nums">
            −{formatCurrency(currentPension, true)}
          </span>
        </div>

        {result.studentLoanDeduction.annual > 0 && (
          <div className="flex items-center justify-between py-1">
            <span className="font-sans text-zinc-600">Student loan</span>
            <span className="text-zinc-700 tabular-nums">
              −{formatCurrency(timeframe === "annual" ? result.studentLoanDeduction.annual : timeframe === "monthly" ? result.studentLoanDeduction.monthly : result.studentLoanDeduction.weekly, true)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 font-sans font-semibold">
          <span className="text-zinc-900">Total deductions</span>
          <span className="font-mono text-zinc-900 tabular-nums">
            −{formatCurrency(currentDeductions, true)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-900 font-sans font-bold text-sm">
          <span className="text-zinc-950">Net take-home</span>
          <span className="font-mono text-zinc-950 tabular-nums">
            {formatCurrency(currentNet, true)}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-zinc-50 border border-zinc-200/70 p-3 text-[11px] leading-relaxed text-zinc-500">
        Estimate uses official 2026/27 Agenda for Change rates, standard NI and tax code {result.taxCode}. NHS Pension contributions are deducted pre-tax, providing {formatCurrency(result.pensionTaxReliefAnnual)}/yr in tax relief.
      </div>
    </div>
  );
}
