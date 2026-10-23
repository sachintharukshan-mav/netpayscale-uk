"use client";

import React, { useState } from "react";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { CalculationResult } from "@/lib/calculator";

interface EsrPayslipViewProps {
  result: CalculationResult;
}

export default function EsrPayslipView({ result }: EsrPayslipViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    const text = `📋 NHS PAYSLIP ESTIMATE (2026/27)
Band: ${result.bandTitle} (${result.stepTitle})
Location: ${result.hcasName}
Hours: ${result.contractedHours} hrs/week
-----------------------------
Gross Monthly Pay: ${formatCurrency(result.grossPay.monthly, true)}
- NHS Pension (${result.pensionTierLabel}): -${formatCurrency(result.pensionContribution.monthly, true)}
- Income Tax (${result.taxCode}): -${formatCurrency(result.incomeTax.monthly, true)}
- National Insurance: -${formatCurrency(result.nationalInsurance.monthly, true)}${
      result.studentLoanDeduction.annual > 0
        ? `\n- Student Loan: -${formatCurrency(result.studentLoanDeduction.monthly, true)}`
        : ""
    }
Total Deductions: -${formatCurrency(result.totalDeductions.monthly, true)}
-----------------------------
💰 NET MONTHLY DEPOSIT: ${formatCurrency(result.netPay.monthly, true)}
Annual Take-Home: ${formatCurrency(result.netPay.annual, true)}/yr
(You keep ${result.penceKeptPerPound}p in every £1)
Calculated via NetPayScale UK (https://netpayscale.uk)`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-900">
            ESR Electronic Staff Record Payslip Advice (Simulation)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
          >
            <span>{copied ? "✓ Copied to clipboard!" : "📋 Copy Summary"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
          >
            <span>🖨️ Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* THE OFFICIAL ESR PAYSLIP REPLICA CONTAINER */}
      <div
        id="esr-payslip-print"
        className="rounded-xl border-2 border-zinc-300 bg-white p-6 shadow-sm font-mono text-xs text-zinc-800 space-y-5 print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* ESR Payslip Header */}
        <div className="border-b-2 border-zinc-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#005EB8] text-white font-bold text-xs px-2 py-0.5 rounded tracking-wider">
                  NHS
                </span>
                <span className="font-bold text-sm text-zinc-950 font-sans tracking-tight">
                  ELECTRONIC STAFF RECORD — PAY ADVICE
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1 font-sans">
                National Health Service • Agenda for Change Terms &amp; Conditions 2026/27
              </div>
            </div>

            <div className="text-right text-[11px] text-zinc-600 space-y-0.5 self-start sm:self-auto">
              <div>
                <span className="text-zinc-400">Pay Date: </span>
                <span className="font-bold text-zinc-900">28th Monthly (BACS)</span>
              </div>
              <div>
                <span className="text-zinc-400">Tax Period: </span>
                <span className="font-bold text-zinc-900">Month 12 • 2026/27</span>
              </div>
            </div>
          </div>

          {/* Employee & Payroll Parameters Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 bg-zinc-50 border border-zinc-200 p-3 rounded-lg text-[11px]">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Band &amp; Step</span>
              <span className="font-bold text-zinc-900 font-sans">{result.bandTitle} ({result.stepTitle})</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Tax Code</span>
              <span className="font-bold text-zinc-900">{result.taxCode}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">NI Category</span>
              <span className="font-bold text-zinc-900">A (Standard)</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Pension Scheme</span>
              <span className="font-bold text-zinc-900">NHS 2015 ({result.pensionTierLabel})</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Contracted Hrs</span>
              <span className="font-bold text-zinc-900">{result.contractedHours} hrs/wk</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Hourly Rate</span>
              <span className="font-bold text-zinc-900">£{result.hourlyRate}/hr</span>
            </div>
          </div>
        </div>

        {/* Dual Payments & Deductions Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PAYMENTS COLUMN */}
          <div className="space-y-3">
            <div className="border-b border-zinc-300 pb-1.5 flex justify-between items-baseline font-bold text-zinc-900">
              <span className="font-sans uppercase text-[11px] tracking-wider text-zinc-600">Payments / Earnings</span>
              <span>Amount (£)</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="font-sans text-zinc-700">Basic Pay ({result.contractedHours}h)</span>
                <span className="tabular-nums font-medium">{formatCurrency(result.baseSalary.monthly)}</span>
              </div>

              {result.hcasAmount.annual > 0 && (
                <div className="flex justify-between items-center py-0.5 text-zinc-700">
                  <span className="font-sans">HCAS London Weighting ({result.hcasName})</span>
                  <span className="tabular-nums">+{formatCurrency(result.hcasAmount.monthly)}</span>
                </div>
              )}

              {result.unsocialNightAmount.annual > 0 && (
                <div className="flex justify-between items-center py-0.5 text-zinc-700">
                  <span className="font-sans">Unsocial Hours — Nights/Sats (Sec 2)</span>
                  <span className="tabular-nums">+{formatCurrency(result.unsocialNightAmount.monthly)}</span>
                </div>
              )}

              {result.unsocialSundayAmount.annual > 0 && (
                <div className="flex justify-between items-center py-0.5 text-zinc-700">
                  <span className="font-sans">Unsocial Hours — Sundays/BH (Sec 2)</span>
                  <span className="tabular-nums">+{formatCurrency(result.unsocialSundayAmount.monthly)}</span>
                </div>
              )}
            </div>

            <div className="border-t-2 border-zinc-800 pt-2 flex justify-between font-bold text-zinc-950 text-sm">
              <span className="font-sans uppercase">Total Gross Pay</span>
              <span className="tabular-nums">{formatCurrency(result.grossPay.monthly)}</span>
            </div>
          </div>

          {/* DEDUCTIONS COLUMN */}
          <div className="space-y-3">
            <div className="border-b border-zinc-300 pb-1.5 flex justify-between items-baseline font-bold text-zinc-900">
              <span className="font-sans uppercase text-[11px] tracking-wider text-zinc-600">Deductions</span>
              <span>Amount (£)</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-0.5 text-zinc-700">
                <span className="font-sans">PAYE Income Tax ({result.taxCode})</span>
                <span className="tabular-nums">−{formatCurrency(result.incomeTax.monthly)}</span>
              </div>

              <div className="flex justify-between items-center py-0.5 text-zinc-700">
                <span className="font-sans">National Insurance (Class 1)</span>
                <span className="tabular-nums">−{formatCurrency(result.nationalInsurance.monthly)}</span>
              </div>

              <div className="flex justify-between items-center py-0.5 text-zinc-700">
                <span className="font-sans">NHS Pension ({result.pensionTierLabel} on superannuable pay)</span>
                <span className="tabular-nums">−{formatCurrency(result.pensionContribution.monthly)}</span>
              </div>

              {result.studentLoanDeduction.annual > 0 && (
                <div className="flex justify-between items-center py-0.5 text-zinc-700">
                  <span className="font-sans">Student Loan Repayment</span>
                  <span className="tabular-nums">−{formatCurrency(result.studentLoanDeduction.monthly)}</span>
                </div>
              )}
            </div>

            <div className="border-t-2 border-zinc-800 pt-2 flex justify-between font-bold text-zinc-950 text-sm">
              <span className="font-sans uppercase">Total Deductions</span>
              <span className="tabular-nums font-semibold">−{formatCurrency(result.totalDeductions.monthly)}</span>
            </div>
          </div>
        </div>

        {/* Statutory Accounting Summary Bar */}
        <div className="border-t border-zinc-200 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-600 bg-zinc-50 p-3 rounded-lg">
          <div>
            <span className="text-zinc-400 block text-[10px]">Superannuable (Pensionable) Pay</span>
            <span className="font-bold text-zinc-900">{formatCurrency(result.pensionablePay.monthly)}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px]">Taxable Gross</span>
            <span className="font-bold text-zinc-900">{formatCurrency(result.taxablePay.monthly)}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px]">Tax Relief via Pension</span>
            <span className="font-bold text-zinc-900">+{formatCurrency(result.pensionTaxReliefAnnual / 12)}/mo</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px]">Retention Yield</span>
            <span className="font-bold text-zinc-900">{result.penceKeptPerPound}p in every £1</span>
          </div>
        </div>

        {/* FINAL PROMINENT NET PAY BANNER */}
        <div className="rounded-xl bg-zinc-950 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold">
              Net Pay Credit (Bank Account Deposit)
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums mt-0.5 text-white">
              {formatCurrency(result.netPay.monthly, true)}
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-zinc-700 sm:pl-6 self-start sm:self-auto">
            <div className="text-[11px] text-zinc-400 font-sans">Annualized Equivalent:</div>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {formatCurrency(result.netPay.annual, true)}/yr
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="text-[10px] text-zinc-400 text-center font-sans">
          This document is an electronic payroll projection based on official 2026/27 Agenda for Change rates (+3.3%) and HMRC tax parameters.
        </div>
      </div>
    </div>
  );
}
