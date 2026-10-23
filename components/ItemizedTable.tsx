"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { CalculationResult } from "@/lib/calculator";
import { ChevronDown, ChevronUp, HelpCircle, Info } from "lucide-react";

interface ItemizedTableProps {
  result: CalculationResult;
}

export default function ItemizedTable({ result }: ItemizedTableProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      {/* Header Accordion Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-850"
      >
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Itemized Pay & Deduction Ledger</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Annual vs Monthly
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full statutory breakdown under 2026/27 HMRC and NHS rules
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="py-2.5 font-semibold">Pay Element / Deduction</th>
                  <th className="py-2.5 font-semibold">Rate / Rules</th>
                  <th className="py-2.5 text-right font-semibold">Annual</th>
                  <th className="py-2.5 text-right font-semibold">Monthly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {/* 1. Base Salary */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                  <td className="py-2.5 font-sans font-medium text-slate-900 dark:text-white">
                    Base Salary ({result.bandTitle} - {result.stepTitle})
                  </td>
                  <td className="py-2.5 font-sans text-slate-500 dark:text-slate-400">
                    Agenda for Change 2026/27
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(result.baseSalary.annual)}
                  </td>
                  <td className="py-2.5 text-right text-slate-700 dark:text-slate-300">
                    {formatCurrency(result.baseSalary.monthly)}
                  </td>
                </tr>

                {/* 2. HCAS */}
                {result.hcasAmount.annual > 0 && (
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 bg-blue-50/20 dark:bg-blue-950/10">
                    <td className="py-2.5 font-sans font-medium text-blue-900 dark:text-blue-300">
                      High Cost Area Supplement (HCAS)
                    </td>
                    <td className="py-2.5 font-sans text-blue-700 dark:text-blue-400">
                      {result.hcasName} ({result.hcasPercentage}%)
                    </td>
                    <td className="py-2.5 text-right font-bold text-blue-900 dark:text-blue-300">
                      +{formatCurrency(result.hcasAmount.annual)}
                    </td>
                    <td className="py-2.5 text-right text-blue-700 dark:text-blue-400">
                      +{formatCurrency(result.hcasAmount.monthly)}
                    </td>
                  </tr>
                )}

                {/* 3. Night Enhancements */}
                {result.unsocialNightAmount.annual > 0 && (
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="py-2.5 font-sans font-medium text-slate-900 dark:text-white">
                      Night & Saturday Shift Uplift
                    </td>
                    <td className="py-2.5 font-sans text-slate-500 dark:text-slate-400">
                      Section 2 AfC (+30%/+44%)
                    </td>
                    <td className="py-2.5 text-right font-semibold text-slate-900 dark:text-white">
                      +{formatCurrency(result.unsocialNightAmount.annual)}
                    </td>
                    <td className="py-2.5 text-right text-slate-700 dark:text-slate-300">
                      +{formatCurrency(result.unsocialNightAmount.monthly)}
                    </td>
                  </tr>
                )}

                {/* 4. Sunday Enhancements */}
                {result.unsocialSundayAmount.annual > 0 && (
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="py-2.5 font-sans font-medium text-slate-900 dark:text-white">
                      Sunday & Bank Holiday Uplift
                    </td>
                    <td className="py-2.5 font-sans text-slate-500 dark:text-slate-400">
                      Section 2 AfC (+60%/+88%)
                    </td>
                    <td className="py-2.5 text-right font-semibold text-slate-900 dark:text-white">
                      +{formatCurrency(result.unsocialSundayAmount.annual)}
                    </td>
                    <td className="py-2.5 text-right text-slate-700 dark:text-slate-300">
                      +{formatCurrency(result.unsocialSundayAmount.monthly)}
                    </td>
                  </tr>
                )}

                {/* Total Gross Pay */}
                <tr className="bg-slate-100/70 font-semibold text-slate-900 dark:bg-slate-800/70 dark:text-white">
                  <td className="py-3 font-sans">Total Gross Pay (Pensionable)</td>
                  <td className="py-3 font-sans text-slate-500 dark:text-slate-400">Gross Earnings</td>
                  <td className="py-3 text-right font-bold">{formatCurrency(result.grossPay.annual)}</td>
                  <td className="py-3 text-right">{formatCurrency(result.grossPay.monthly)}</td>
                </tr>

                {/* NHS Pension */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 text-purple-900 dark:text-purple-300">
                  <td className="py-2.5 font-sans font-medium">
                    NHS Pension Contribution
                  </td>
                  <td className="py-2.5 font-sans text-purple-700 dark:text-purple-400">
                    Tier rate: {result.pensionTierLabel} (Pre-tax Net Pay)
                  </td>
                  <td className="py-2.5 text-right font-bold text-purple-900 dark:text-purple-300">
                    -{formatCurrency(result.pensionContribution.annual)}
                  </td>
                  <td className="py-2.5 text-right text-purple-700 dark:text-purple-400">
                    -{formatCurrency(result.pensionContribution.monthly)}
                  </td>
                </tr>

                {/* Taxable Pay */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 text-slate-600 dark:text-slate-400">
                  <td className="py-2.5 font-sans italic">Taxable Pay (Gross minus Pension)</td>
                  <td className="py-2.5 font-sans">Allowance: {formatCurrency(result.personalAllowance)}</td>
                  <td className="py-2.5 text-right">{formatCurrency(result.taxablePay.annual)}</td>
                  <td className="py-2.5 text-right">{formatCurrency(result.taxablePay.monthly)}</td>
                </tr>

                {/* Income Tax */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 text-rose-900 dark:text-rose-300">
                  <td className="py-2.5 font-sans font-medium">
                    UK Income Tax (PAYE)
                  </td>
                  <td className="py-2.5 font-sans text-rose-700 dark:text-rose-400">
                    20% / 40% HMRC Brackets
                  </td>
                  <td className="py-2.5 text-right font-bold text-rose-900 dark:text-rose-300">
                    -{formatCurrency(result.incomeTax.annual)}
                  </td>
                  <td className="py-2.5 text-right text-rose-700 dark:text-rose-400">
                    -{formatCurrency(result.incomeTax.monthly)}
                  </td>
                </tr>

                {/* National Insurance */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 text-amber-900 dark:text-amber-300">
                  <td className="py-2.5 font-sans font-medium">
                    National Insurance (Class 1)
                  </td>
                  <td className="py-2.5 font-sans text-amber-700 dark:text-amber-400">
                    8% (£12,570 - £50,270), 2% above
                  </td>
                  <td className="py-2.5 text-right font-bold text-amber-900 dark:text-amber-300">
                    -{formatCurrency(result.nationalInsurance.annual)}
                  </td>
                  <td className="py-2.5 text-right text-amber-700 dark:text-amber-400">
                    -{formatCurrency(result.nationalInsurance.monthly)}
                  </td>
                </tr>

                {/* Student Loan */}
                {result.studentLoanDeduction.annual > 0 && (
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 text-pink-900 dark:text-pink-300">
                    <td className="py-2.5 font-sans font-medium">Student Loan Repayment</td>
                    <td className="py-2.5 font-sans text-pink-700 dark:text-pink-400">Income Contingent</td>
                    <td className="py-2.5 text-right font-bold text-pink-900 dark:text-pink-300">
                      -{formatCurrency(result.studentLoanDeduction.annual)}
                    </td>
                    <td className="py-2.5 text-right text-pink-700 dark:text-pink-400">
                      -{formatCurrency(result.studentLoanDeduction.monthly)}
                    </td>
                  </tr>
                )}

                {/* Total Deductions */}
                <tr className="bg-rose-50/50 font-semibold text-rose-950 dark:bg-rose-950/20 dark:text-rose-300">
                  <td className="py-2.5 font-sans">Total Statutory & Pension Deductions</td>
                  <td className="py-2.5 font-sans text-rose-800 dark:text-rose-400">All Deductions Combined</td>
                  <td className="py-2.5 text-right font-bold">-{formatCurrency(result.totalDeductions.annual)}</td>
                  <td className="py-2.5 text-right">-{formatCurrency(result.totalDeductions.monthly)}</td>
                </tr>

                {/* Final Net Take-Home */}
                <tr className="bg-emerald-100/70 text-sm font-bold text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-200">
                  <td className="py-3.5 font-sans">Net Take-Home Pay (Bank Deposit)</td>
                  <td className="py-3.5 font-sans font-medium text-emerald-800 dark:text-emerald-400">
                    {result.takeHomePercentage}% of Gross Retained
                  </td>
                  <td className="py-3.5 text-right text-base text-emerald-900 dark:text-emerald-100">
                    {formatCurrency(result.netPay.annual, true)}
                  </td>
                  <td className="py-3.5 text-right text-base text-emerald-900 dark:text-emerald-100">
                    {formatCurrency(result.netPay.monthly, true)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
