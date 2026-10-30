"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import {
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export function EmbedCalculatorClient() {
  const searchParams = useSearchParams();

  // Read URL query parameters for customization
  const paramBand = searchParams.get("band");
  const paramTheme = searchParams.get("theme");
  const paramRegion = searchParams.get("region");

  const isDark = paramTheme === "dark";

  // Match initial band from param or default to Band 5
  const initialBandName = useMemo(() => {
    if (!paramBand) return "Band 5";
    const found = nhsData.bands.find(
      (b) =>
        b.slug.toLowerCase() === paramBand.toLowerCase() ||
        b.band.toLowerCase() === paramBand.toLowerCase()
    );
    return found ? found.band : "Band 5";
  }, [paramBand]);

  const [band, setBand] = useState<string>(initialBandName);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [hcasZone, setHcasZone] = useState<
    "standard" | "outer-london" | "inner-london" | "fringe"
  >(
    paramRegion === "inner"
      ? "inner-london"
      : paramRegion === "outer"
      ? "outer-london"
      : paramRegion === "fringe"
      ? "fringe"
      : "standard"
  );
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [pensionOptedOut, setPensionOptedOut] = useState<boolean>(false);
  const [isScottishTax, setIsScottishTax] = useState<boolean>(false);

  const currentBandData = useMemo(() => {
    return nhsData.bands.find((b) => b.band === band) || nhsData.bands[3];
  }, [band]);

  const handleSelectBand = (newBand: string) => {
    setBand(newBand);
    const targetData = nhsData.bands.find((b) => b.band === newBand);
    if (targetData && stepIndex >= targetData.points.length) {
      setStepIndex(0);
    }
  };

  const inputs: CalculatorInputs = useMemo(
    () => ({
      band,
      stepIndex,
      hcasZone,
      contractedHours,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut,
      taxCode: isScottishTax ? "S1257L" : "1257L",
      isScottishTax,
      studentLoan: "none",
    }),
    [band, stepIndex, hcasZone, contractedHours, pensionOptedOut, isScottishTax]
  );

  const result = useMemo(() => calculateNHSPay(inputs), [inputs]);

  return (
    <div
      className={`w-full max-w-2xl mx-auto rounded-2xl border transition-colors shadow-sm overflow-hidden flex flex-col font-sans ${
        isDark
          ? "bg-slate-950 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      {/* Header Bar */}
      <div
        className={`px-4 sm:px-5 py-3 border-b flex items-center justify-between gap-3 ${
          isDark
            ? "bg-slate-900/90 border-slate-800"
            : "bg-slate-50/90 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-9 items-center justify-center rounded bg-[#005EB8] text-[11px] font-black text-white tracking-wider">
            NHS
          </span>
          <div>
            <h1
              className={`text-sm sm:text-base font-extrabold leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              NHS Salary Calculator 2026/27
            </h1>
            <p className="text-[11px] text-slate-500 leading-none">
              Official Agenda for Change (+3.3%) Pay Benchmark
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live 2026/27
        </span>
      </div>

      {/* Main Calculator Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Band Selection */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              AfC Pay Band
            </label>
            <select
              value={band}
              onChange={(e) => handleSelectBand(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold border transition-all focus:outline-hidden focus:ring-2 focus:ring-[#005EB8] ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              {nhsData.bands.map((b) => (
                <option key={b.band} value={b.band}>
                  {b.band} ({b.typicalRoles.slice(0, 2).join(", ")})
                </option>
              ))}
            </select>
          </div>

          {/* Pay Step / Experience */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Experience Point
            </label>
            <select
              value={stepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold border transition-all focus:outline-hidden focus:ring-2 focus:ring-[#005EB8] ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              {currentBandData.points.map((pt, idx) => (
                <option key={idx} value={idx}>
                  {pt.step} ({formatCurrency(pt.annualSalary)}/yr)
                </option>
              ))}
            </select>
          </div>

          {/* Location / London HCAS */}
          <div>
            <label
              className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Location / HCAS
            </label>
            <select
              value={hcasZone}
              onChange={(e) => setHcasZone(e.target.value as any)}
              className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold border transition-all focus:outline-hidden focus:ring-2 focus:ring-[#005EB8] ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              <option value="standard">Outside London (Standard)</option>
              <option value="inner-london">Inner London (+20%, up to £8,746)</option>
              <option value="outer-london">Outer London (+15%, up to £5,888)</option>
              <option value="fringe">Fringe Zone (+5%, up to £2,168)</option>
            </select>
          </div>

          {/* Weekly Contracted Hours */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Contracted Hours
              </label>
              <span className="text-xs font-mono font-bold text-[#005EB8]">
                {contractedHours} hrs/wk {contractedHours === 37.5 && "(Full-Time)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="7.5"
                max="48"
                step="0.5"
                value={contractedHours}
                onChange={(e) => setContractedHours(Number(e.target.value))}
                className="w-full accent-[#005EB8] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setContractedHours(37.5)}
                className={`px-2 py-1 rounded text-[11px] font-bold border ${
                  contractedHours === 37.5
                    ? "bg-[#005EB8] text-white border-[#005EB8]"
                    : isDark
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                }`}
              >
                37.5h
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Result Hero */}
        <div
          className={`rounded-2xl p-4 sm:p-5 border transition-all relative overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/30"
              : "bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/60 border-emerald-200/90"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                Estimated Net Take-Home Pay
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.netPay.monthly)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-500">
                  / month
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Clean deposit after PAYE tax, NI, and {result.pensionRate * 100}% NHS pension.
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-200/60 pt-2 sm:pt-0 gap-1 font-mono">
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase text-slate-400 block">Gross Annual</span>
                <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(result.grossPay.annual)}/yr
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 block">Net Hourly</span>
                <span className="text-sm sm:text-base font-bold text-[#005EB8] dark:text-blue-400">
                  {formatCurrency(result.netHourlyRate)}/hr
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Strip */}
          <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 text-center font-mono text-xs">
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5">
              <span className="text-[10px] block text-slate-400">Income Tax</span>
              <span className="font-bold text-rose-500">
                -{formatCurrency(result.incomeTax.monthly)}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5">
              <span className="text-[10px] block text-slate-400">National Ins.</span>
              <span className="font-bold text-rose-500">
                -{formatCurrency(result.nationalInsurance.monthly)}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5">
              <span className="text-[10px] block text-slate-400">
                NHS Pension ({result.pensionRate * 100}%)
              </span>
              <span className="font-bold text-amber-500">
                -{formatCurrency(result.pensionContribution.monthly)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dofollow Attribution Footer Bar */}
      <div
        className={`px-4 sm:px-5 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs ${
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-400"
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
      >
        <div className="flex items-center gap-1.5 text-center sm:text-left">
          <span>Provided by</span>
          <a
            href="https://netpayscale.uk/?utm_source=embed&utm_medium=widget&utm_campaign=nhs_salary_calculator"
            target="_blank"
            rel="noopener"
            className="font-bold text-[#005EB8] dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
          >
            NetPayScale UK
            <ExternalLink className="w-3 h-3 inline-block" />
          </a>
          <span className="hidden sm:inline">· 2026/27 Pay Scale</span>
        </div>

        <a
          href="https://netpayscale.uk/?utm_source=embed&utm_medium=button&utm_campaign=open_full_calculator"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-[#005EB8] text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <span>Open Full Calculator &amp; Pension Modeler</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
