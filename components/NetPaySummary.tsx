"use client";

import React from "react";
import { formatCurrency, formatHourlyRate, formatPercent } from "@/lib/formatters";
import { CalculationResult } from "@/lib/calculator";
import { ArrowUpRight, Banknote, Calendar, Clock, PiggyBank, Sparkles } from "lucide-react";

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

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-white via-white to-emerald-50/20 p-5 shadow-lg dark:border-emerald-500/20 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20">
      {/* Top Bar with Timeframe Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Banknote className="h-4 w-4" />
            Estimated Take-Home Pay
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {result.bandTitle} ({result.stepTitle}) • {result.hcasName}
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="inline-flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTimeframe("monthly")}
            className={`rounded-md px-3 py-1 transition-all ${
              timeframe === "monthly"
                ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300 font-bold"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("annual")}
            className={`rounded-md px-3 py-1 transition-all ${
              timeframe === "annual"
                ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300 font-bold"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Annual
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("weekly")}
            className={`rounded-md px-3 py-1 transition-all ${
              timeframe === "weekly"
                ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-300 font-bold"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Main Net Pay Display */}
      <div className="my-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
            {formatCurrency(currentNet, true)}
          </span>
          <span className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400">
            /{timeframe === "annual" ? "year" : timeframe === "monthly" ? "month" : "week"}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Direct bank deposit after NHS pension ({result.pensionTierLabel}), income tax, and National Insurance.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Total Gross Pay
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {formatCurrency(currentGross)}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Total Deductions
          </span>
          <div className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono">
            -{formatCurrency(currentDeductions)}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Take-Home Rate
          </span>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {formatPercent(result.takeHomePercentage)}
          </div>
        </div>

        <div className="rounded-lg bg-purple-50/70 p-2.5 dark:bg-purple-950/30">
          <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
            <PiggyBank className="h-3 w-3" />
            Pension Relief
          </span>
          <div className="text-sm font-bold text-purple-700 dark:text-purple-300 font-mono">
            +{formatCurrency(result.pensionTaxReliefAnnual / (timeframe === "annual" ? 1 : timeframe === "monthly" ? 12 : 52))}/yr
          </div>
        </div>
      </div>
    </div>
  );
}
