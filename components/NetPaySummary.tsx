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

  return (
    <div className="rounded-xl border border-zinc-200/90 bg-white p-6 shadow-sm">
      {/* Timeframe switcher */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Estimated Take-Home Deposit
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {result.bandTitle} ({result.stepTitle}) • {result.hcasName}
          </p>
        </div>

        <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-medium">
          {(["monthly", "annual", "weekly"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setTimeframe(period)}
              className={`rounded-md px-3 py-1 capitalize transition-all ${
                timeframe === period
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Main Net Pay Figure */}
      <div className="py-5">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 font-mono tabular-nums">
            {formatCurrency(currentNet, true)}
          </span>
          <span className="text-sm font-medium text-zinc-500">
            /{timeframe === "annual" ? "year" : timeframe === "monthly" ? "month" : "week"}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span>{result.takeHomePercentage}% of gross retained</span>
          <span>•</span>
          <span>Effective tax & NI: {result.effectiveTaxRate}%</span>
        </div>
      </div>

      {/* Structured Ledger Summary (No icon-in-circle cards) */}
      <div className="space-y-2 border-t border-zinc-100 pt-4 text-xs font-mono">
        <div className="flex items-center justify-between py-1">
          <span className="font-sans text-zinc-600">Total Gross Pay</span>
          <span className="font-semibold text-zinc-900 tabular-nums">
            {formatCurrency(currentGross)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="font-sans text-zinc-600">
            NHS Pension ({result.pensionTierLabel})
          </span>
          <span className="text-zinc-700 tabular-nums">
            -{formatCurrency(currentPension)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="font-sans text-zinc-600">PAYE Income Tax</span>
          <span className="text-zinc-700 tabular-nums">
            -{formatCurrency(currentTax)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="font-sans text-zinc-600">National Insurance (Class 1)</span>
          <span className="text-zinc-700 tabular-nums">
            -{formatCurrency(currentNI)}
          </span>
        </div>

        {result.studentLoanDeduction.annual > 0 && (
          <div className="flex items-center justify-between py-1">
            <span className="font-sans text-zinc-600">Student Loan</span>
            <span className="text-zinc-700 tabular-nums">
              -{formatCurrency(timeframe === "annual" ? result.studentLoanDeduction.annual : timeframe === "monthly" ? result.studentLoanDeduction.monthly : result.studentLoanDeduction.weekly)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 font-sans font-semibold">
          <span className="text-zinc-900">Total Deductions</span>
          <span className="font-mono text-zinc-900 tabular-nums">
            -{formatCurrency(currentDeductions)}
          </span>
        </div>
      </div>

      {/* Pension Relief Notice */}
      <div className="mt-4 rounded-lg bg-zinc-50 border border-zinc-200/70 p-3 text-xs leading-relaxed text-zinc-600">
        <span className="font-semibold text-zinc-900">Pre-Tax Relief Note: </span>
        Pension contributions are deducted before income tax under the Net Pay arrangement, reducing taxable income by {formatCurrency(result.pensionTaxReliefAnnual)}/year.
      </div>
    </div>
  );
}
