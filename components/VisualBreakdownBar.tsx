"use client";

import React from "react";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { CalculationResult } from "@/lib/calculator";

interface VisualBreakdownBarProps {
  result: CalculationResult;
  timeframe: "annual" | "monthly" | "weekly";
}

export default function VisualBreakdownBar({
  result,
  timeframe,
}: VisualBreakdownBarProps) {
  const { visualBreakdown, netPay, pensionContribution, incomeTax, nationalInsurance, studentLoanDeduction } = result;

  const currentNet =
    timeframe === "annual"
      ? netPay.annual
      : timeframe === "monthly"
      ? netPay.monthly
      : netPay.weekly;

  const currentPension =
    timeframe === "annual"
      ? pensionContribution.annual
      : timeframe === "monthly"
      ? pensionContribution.monthly
      : pensionContribution.weekly;

  const currentTax =
    timeframe === "annual"
      ? incomeTax.annual
      : timeframe === "monthly"
      ? incomeTax.monthly
      : incomeTax.weekly;

  const currentNI =
    timeframe === "annual"
      ? nationalInsurance.annual
      : timeframe === "monthly"
      ? nationalInsurance.monthly
      : nationalInsurance.weekly;

  const currentStudentLoan =
    timeframe === "annual"
      ? studentLoanDeduction.annual
      : timeframe === "monthly"
      ? studentLoanDeduction.monthly
      : studentLoanDeduction.weekly;

  const segments = [
    {
      id: "net",
      label: "Take-Home Pay",
      percent: visualBreakdown.netPercent,
      amount: currentNet,
      color: "#059669",
    },
    {
      id: "pension",
      label: `NHS Pension (${result.pensionTierLabel})`,
      percent: visualBreakdown.pensionPercent,
      amount: currentPension,
      color: "#4f46e5",
    },
    {
      id: "tax",
      label: "Income Tax (PAYE)",
      percent: visualBreakdown.taxPercent,
      amount: currentTax,
      color: "#e11d48",
    },
    {
      id: "ni",
      label: "National Insurance",
      percent: visualBreakdown.niPercent,
      amount: currentNI,
      color: "#d97706",
    },
    ...(visualBreakdown.studentLoanPercent > 0
      ? [
          {
            id: "studentLoan",
            label: "Student Loan",
            percent: visualBreakdown.studentLoanPercent,
            amount: currentStudentLoan,
            color: "#db2777",
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
        <span>Gross Pay Proportions</span>
        <span className="font-mono text-zinc-500 font-normal">
          100% of gross
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-100">
        {segments.map((segment) => {
          if (segment.percent <= 0) return null;
          return (
            <div
              key={segment.id}
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${segment.percent}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.label}: ${formatCurrency(segment.amount)} (${segment.percent}%)`}
            />
          );
        })}
      </div>

      {/* Clean Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 text-xs">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center justify-between border-b border-zinc-50 py-1">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-zinc-600 truncate">{segment.label}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-zinc-900 shrink-0 pl-2">
              <span className="tabular-nums font-medium">{formatCurrency(segment.amount)}</span>
              <span className="text-[11px] text-zinc-400">({formatPercent(segment.percent)})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
