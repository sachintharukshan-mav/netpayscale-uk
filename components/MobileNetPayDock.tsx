"use client";

import React, { useState } from "react";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { CalculationResult } from "@/lib/calculator";
import VisualBreakdownBar from "./VisualBreakdownBar";

interface MobileNetPayDockProps {
  result: CalculationResult;
  timeframe: "annual" | "monthly" | "weekly";
  setTimeframe: (val: "annual" | "monthly" | "weekly") => void;
}

export default function MobileNetPayDock({
  result,
  timeframe,
  setTimeframe,
}: MobileNetPayDockProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const currentPension =
    timeframe === "annual"
      ? result.pensionContribution.annual
      : timeframe === "monthly"
      ? result.pensionContribution.monthly
      : result.pensionContribution.weekly;

  const currentStudentLoan =
    timeframe === "annual"
      ? result.studentLoanDeduction.annual
      : timeframe === "monthly"
      ? result.studentLoanDeduction.monthly
      : result.studentLoanDeduction.weekly;

  const timeframeLabel = timeframe === "annual" ? "yr" : timeframe === "monthly" ? "mo" : "wk";

  return (
    <>
      {/* 1. STICKY FLOATING BOTTOM BAR (Visible only on mobile/tablet < 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] transition-transform duration-200 ease-out">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          {/* Left: Net Pay Display */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 pulse-glow-dot shrink-0" />
              <span className="font-semibold text-zinc-900">{result.bandTitle}</span>
              <span>•</span>
              <span className="truncate">{result.stepTitle}</span>
            </div>

            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold tracking-tight text-emerald-600 font-mono tabular-nums">
                {formatCurrency(currentNet, true)}
              </span>
              <span className="text-xs font-medium text-zinc-500">/{timeframeLabel}</span>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono">
              Keep <span className="font-semibold text-zinc-800">{result.penceKeptPerPound}p</span> in £1
            </div>
          </div>

          {/* Right: Quick Timeframe Toggle + Breakdown Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Toggle: Monthly / Yearly */}
            <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setTimeframe("monthly")}
                className={`rounded-md px-2 py-1 transition-all cursor-pointer ${
                  timeframe === "monthly"
                    ? "bg-white text-zinc-950 font-semibold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Mo
              </button>
              <button
                type="button"
                onClick={() => setTimeframe("annual")}
                className={`rounded-md px-2 py-1 transition-all cursor-pointer ${
                  timeframe === "annual"
                    ? "bg-white text-zinc-950 font-semibold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Yr
              </button>
            </div>

            {/* Tap to expand breakdown drawer */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
            >
              <span>Breakdown</span>
              <span className="text-[10px]">▲</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SLIDE-UP BREAKDOWN BOTTOM DRAWER (Mobile) */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative z-10 w-full max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl border-t border-zinc-200 animate-in slide-in-from-bottom duration-200 ease-out">
            {/* Grab handle */}
            <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-300 mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-bold text-zinc-950">
                  {result.bandTitle} Payslip Summary
                </h3>
                <p className="text-xs text-zinc-500">
                  {result.stepTitle} • {result.hcasName} {result.contractedHours !== 37.5 && `(${result.contractedHours} hrs/wk)`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full bg-zinc-100 p-1.5 text-xs text-zinc-600 hover:bg-zinc-200 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Big Net Display inside drawer */}
            <div className="py-4 text-center border-b border-zinc-100">
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600 pulse-glow-dot shrink-0" />
                <span>Net Take-Home Pay</span>
              </div>
              <div className="text-4xl font-extrabold tracking-tight text-emerald-600 font-mono tabular-nums mt-1">
                {formatCurrency(currentNet, true)}
                <span className="text-sm font-normal text-zinc-500">/{timeframeLabel}</span>
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-1">
                from {formatCurrency(currentGross, true)} gross • <span className="font-semibold text-zinc-800">{result.penceKeptPerPound}p</span> kept in £1
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 py-3 text-xs border-b border-zinc-100">
              <div className="rounded-lg bg-zinc-50 p-2.5 border border-zinc-100 text-center">
                <span className="text-[11px] text-zinc-500 block">Take-Home / Hour</span>
                <span className="text-sm font-bold text-zinc-900 font-mono tabular-nums">
                  {formatCurrency(result.netHourlyRate, true)}/hr
                </span>
              </div>
              <div className="rounded-lg bg-zinc-50 p-2.5 border border-zinc-100 text-center">
                <span className="text-[11px] text-zinc-500 block">Total Deductions</span>
                <span className="text-sm font-bold text-zinc-900 font-mono tabular-nums">
                  {formatPercent(100 - result.takeHomePercentage)}
                </span>
              </div>
            </div>

            {/* Visual Breakdown Bar */}
            <div className="py-4">
              <VisualBreakdownBar result={result} timeframe={timeframe} />
            </div>

            {/* Itemized Deductions Ledger */}
            <div className="space-y-2 border-t border-zinc-100 pt-3 text-xs font-mono">
              <div className="flex justify-between py-1 text-zinc-700">
                <span className="font-sans">Total Gross Pay</span>
                <span className="font-semibold text-zinc-900 tabular-nums">{formatCurrency(currentGross, true)}</span>
              </div>

              <div className="flex justify-between py-1 text-zinc-600">
                <span className="font-sans">Income Tax ({result.taxCode})</span>
                <span className="tabular-nums">−{formatCurrency(currentTax, true)}</span>
              </div>

              <div className="flex justify-between py-1 text-zinc-600">
                <span className="font-sans">National Insurance</span>
                <span className="tabular-nums">−{formatCurrency(currentNI, true)}</span>
              </div>

              <div className="flex justify-between py-1 text-zinc-600">
                <span className="font-sans">NHS Pension ({result.pensionTierLabel})</span>
                <span className="tabular-nums">−{formatCurrency(currentPension, true)}</span>
              </div>

              {result.studentLoanDeduction.annual > 0 && (
                <div className="flex justify-between py-1 text-zinc-600">
                  <span className="font-sans">Student Loan</span>
                  <span className="tabular-nums">−{formatCurrency(currentStudentLoan, true)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-zinc-100 font-sans font-semibold">
                <span className="text-zinc-900">Total Deductions</span>
                <span className="font-mono text-zinc-900 tabular-nums">−{formatCurrency(currentDeductions, true)}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-zinc-900 font-sans font-bold text-sm">
                <span className="text-zinc-950">Net Deposit</span>
                <span className="font-mono text-zinc-950 tabular-nums">{formatCurrency(currentNet, true)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-5 pb-2 space-y-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `NHS ${result.bandTitle} (${result.stepTitle}) Pay Breakdown (2026/27):\n• Net Monthly: ${formatCurrency(result.netPay.monthly)}/mo\n• Net Annual: ${formatCurrency(result.netPay.annual)}/yr\n• Gross: ${formatCurrency(result.grossPay.annual)}\n• Pension: -${formatCurrency(result.pensionContribution.monthly)}/mo\nCalculate yours at: https://netpayscale.co.uk`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-text-ink hover:bg-black py-3 text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>Share WhatsApp Summary</span>
              </a>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full rounded-xl bg-zinc-100 hover:bg-zinc-200 py-2.5 text-xs font-semibold text-zinc-800 active:scale-98 transition-all cursor-pointer"
              >
                Close &amp; Continue Adjusting
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
