"use client";

import React from "react";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { CalculationResult } from "@/lib/calculator";

interface VisualBreakdownBarProps {
  result: CalculationResult;
  timeframe: "annual" | "monthly";
}

export default function VisualBreakdownBar({
  result,
  timeframe,
}: VisualBreakdownBarProps) {
  const { visualBreakdown, netPay, pensionContribution, incomeTax, nationalInsurance, studentLoanDeduction, grossPay } = result;

  const currentGross = timeframe === "annual" ? grossPay.annual : grossPay.monthly;
  const currentNet = timeframe === "annual" ? netPay.annual : netPay.monthly;
  const currentPension = timeframe === "annual" ? pensionContribution.annual : pensionContribution.monthly;
  const currentTax = timeframe === "annual" ? incomeTax.annual : incomeTax.monthly;
  const currentNI = timeframe === "annual" ? nationalInsurance.annual : nationalInsurance.monthly;
  const currentStudentLoan = timeframe === "annual" ? studentLoanDeduction.annual : studentLoanDeduction.monthly;

  const segments = [
    {
      id: "net",
      label: "Take-Home Pay",
      subLabel: "Bank deposit",
      percent: visualBreakdown.netPercent,
      amount: currentNet,
      bgClass: "bg-emerald-500 hover:bg-emerald-600",
      indicatorClass: "bg-emerald-500",
      textClass: "text-emerald-700 dark:text-emerald-400",
    },
    {
      id: "pension",
      label: "NHS Pension",
      subLabel: result.pensionTierLabel,
      percent: visualBreakdown.pensionPercent,
      amount: currentPension,
      bgClass: "bg-purple-500 hover:bg-purple-600",
      indicatorClass: "bg-purple-500",
      textClass: "text-purple-700 dark:text-purple-400",
    },
    {
      id: "tax",
      label: "Income Tax",
      subLabel: "PAYE",
      percent: visualBreakdown.taxPercent,
      amount: currentTax,
      bgClass: "bg-rose-500 hover:bg-rose-600",
      indicatorClass: "bg-rose-500",
      textClass: "text-rose-700 dark:text-rose-400",
    },
    {
      id: "ni",
      label: "National Insurance",
      subLabel: "Class 1",
      percent: visualBreakdown.niPercent,
      amount: currentNI,
      bgClass: "bg-amber-500 hover:bg-amber-600",
      indicatorClass: "bg-amber-500",
      textClass: "text-amber-700 dark:text-amber-400",
    },
    ...(visualBreakdown.studentLoanPercent > 0
      ? [
          {
            id: "studentLoan",
            label: "Student Loan",
            subLabel: "Repayment",
            percent: visualBreakdown.studentLoanPercent,
            amount: currentStudentLoan,
            bgClass: "bg-pink-500 hover:bg-pink-600",
            indicatorClass: "bg-pink-500",
            textClass: "text-pink-700 dark:text-pink-400",
          },
        ]
      : []),
  ];

  return (
    <div className="w-full space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <span>Gross Pay Distribution</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {formatCurrency(currentGross)}
          </span>
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
          {formatPercent(visualBreakdown.netPercent)} Retained
        </span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="flex h-5 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 shadow-inner">
        {segments.map((segment) => {
          if (segment.percent <= 0) return null;
          return (
            <div
              key={segment.id}
              className={`h-full transition-all duration-500 ease-out cursor-pointer relative group ${segment.bgClass}`}
              style={{ width: `${segment.percent}%` }}
              title={`${segment.label}: ${formatCurrency(segment.amount)} (${segment.percent}%)`}
            >
              {segment.percent >= 12 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white tracking-wider select-none truncate px-1">
                  {formatPercent(segment.percent)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4 lg:grid-cols-5">
        {segments.map((segment) => (
          <div
            key={segment.id}
            className="flex flex-col rounded-lg border border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800/80 dark:bg-slate-850 transition-all hover:bg-slate-100/70 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${segment.indicatorClass}`} />
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                {segment.label}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                {formatCurrency(segment.amount)}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {formatPercent(segment.percent)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
