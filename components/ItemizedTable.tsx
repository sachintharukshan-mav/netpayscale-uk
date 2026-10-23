"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { CalculationResult } from "@/lib/calculator";

interface ItemizedTableProps {
  result: CalculationResult;
}

export default function ItemizedTable({ result }: ItemizedTableProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-zinc-200/90 bg-white shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-zinc-50/60"
      >
        <div>
          <h3 className="text-sm font-semibold text-zinc-950">
            Payroll Ledger & Statutory Breakdown
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Full itemized accounting comparing Annual, Monthly, and Weekly amounts
          </p>
        </div>
        <span className="text-xs font-mono font-medium text-zinc-500">
          {isOpen ? "Collapse ledger [-]" : "Expand ledger [+]"}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-100 px-6 py-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 font-medium">
                  <th className="py-2.5 font-medium">Element</th>
                  <th className="py-2.5 font-medium">Rate / Basis</th>
                  <th className="py-2.5 text-right font-medium">Annual</th>
                  <th className="py-2.5 text-right font-medium">Monthly</th>
                  <th className="py-2.5 text-right font-medium">Weekly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono text-zinc-800">
                {/* 1. Base Salary */}
                <tr className="hover:bg-zinc-50/40">
                  <td className="py-2.5 font-sans font-medium text-zinc-950">
                    Basic Salary ({result.bandTitle} - {result.stepTitle})
                  </td>
                  <td className="py-2.5 font-sans text-zinc-500">
                    Agenda for Change (37.5h standard)
                  </td>
                  <td className="py-2.5 text-right font-semibold text-zinc-950 tabular-nums">
                    {formatCurrency(result.baseSalary.annual)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    {formatCurrency(result.baseSalary.monthly)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-zinc-500">
                    {formatCurrency(result.baseSalary.weekly)}
                  </td>
                </tr>

                {/* 2. HCAS */}
                {result.hcasAmount.annual > 0 && (
                  <tr className="hover:bg-zinc-50/40">
                    <td className="py-2.5 font-sans font-medium text-zinc-950">
                      High Cost Area Supplement (HCAS)
                    </td>
                    <td className="py-2.5 font-sans text-zinc-500">
                      {result.hcasName} ({result.hcasPercentage}%)
                    </td>
                    <td className="py-2.5 text-right font-semibold text-zinc-950 tabular-nums">
                      +{formatCurrency(result.hcasAmount.annual)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      +{formatCurrency(result.hcasAmount.monthly)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-zinc-500">
                      +{formatCurrency(result.hcasAmount.weekly)}
                    </td>
                  </tr>
                )}

                {/* 3. Night Enhancements */}
                {result.unsocialNightAmount.annual > 0 && (
                  <tr className="hover:bg-zinc-50/40">
                    <td className="py-2.5 font-sans font-medium text-zinc-950">
                      Night & Saturday Shift Uplift
                    </td>
                    <td className="py-2.5 font-sans text-zinc-500">
                      Section 2 AfC (+30%/+44%)
                    </td>
                    <td className="py-2.5 text-right font-semibold text-zinc-950 tabular-nums">
                      +{formatCurrency(result.unsocialNightAmount.annual)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      +{formatCurrency(result.unsocialNightAmount.monthly)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-zinc-500">
                      +{formatCurrency(result.unsocialNightAmount.weekly)}
                    </td>
                  </tr>
                )}

                {/* 4. Sunday Enhancements */}
                {result.unsocialSundayAmount.annual > 0 && (
                  <tr className="hover:bg-zinc-50/40">
                    <td className="py-2.5 font-sans font-medium text-zinc-950">
                      Sunday & Bank Holiday Uplift
                    </td>
                    <td className="py-2.5 font-sans text-zinc-500">
                      Section 2 AfC (+60%/+88%)
                    </td>
                    <td className="py-2.5 text-right font-semibold text-zinc-950 tabular-nums">
                      +{formatCurrency(result.unsocialSundayAmount.annual)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      +{formatCurrency(result.unsocialSundayAmount.monthly)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-zinc-500">
                      +{formatCurrency(result.unsocialSundayAmount.weekly)}
                    </td>
                  </tr>
                )}

                {/* Gross Pay */}
                <tr className="bg-zinc-50/70 font-semibold text-zinc-950">
                  <td className="py-3 font-sans">Total Gross Pensionable Earnings</td>
                  <td className="py-3 font-sans text-zinc-500 font-normal">All Gross Elements</td>
                  <td className="py-3 text-right tabular-nums font-bold">{formatCurrency(result.grossPay.annual)}</td>
                  <td className="py-3 text-right tabular-nums font-bold">{formatCurrency(result.grossPay.monthly)}</td>
                  <td className="py-3 text-right tabular-nums text-zinc-600">{formatCurrency(result.grossPay.weekly)}</td>
                </tr>

                {/* NHS Pension */}
                <tr className="hover:bg-zinc-50/40">
                  <td className="py-2.5 font-sans font-medium text-zinc-950">
                    NHS Pension Contribution
                  </td>
                  <td className="py-2.5 font-sans text-zinc-500">
                    {result.pensionTierLabel} (Deducted pre-tax)
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-medium text-zinc-800">
                    -{formatCurrency(result.pensionContribution.annual)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    -{formatCurrency(result.pensionContribution.monthly)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-zinc-500">
                    -{formatCurrency(result.pensionContribution.weekly)}
                  </td>
                </tr>

                {/* Taxable Pay */}
                <tr className="hover:bg-zinc-50/40 text-zinc-500">
                  <td className="py-2 font-sans italic">Taxable Pay (Gross minus Pension)</td>
                  <td className="py-2 font-sans">Allowance: {formatCurrency(result.personalAllowance)}</td>
                  <td className="py-2 text-right tabular-nums">{formatCurrency(result.taxablePay.annual)}</td>
                  <td className="py-2 text-right tabular-nums">{formatCurrency(result.taxablePay.monthly)}</td>
                  <td className="py-2 text-right tabular-nums">{formatCurrency(result.taxablePay.weekly)}</td>
                </tr>

                {/* Income Tax */}
                <tr className="hover:bg-zinc-50/40">
                  <td className="py-2.5 font-sans font-medium text-zinc-950">
                    PAYE Income Tax
                  </td>
                  <td className="py-2.5 font-sans text-zinc-500">
                    20% / 40% HMRC Brackets
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-medium text-zinc-800">
                    -{formatCurrency(result.incomeTax.annual)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    -{formatCurrency(result.incomeTax.monthly)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-zinc-500">
                    -{formatCurrency(result.incomeTax.weekly)}
                  </td>
                </tr>

                {/* National Insurance */}
                <tr className="hover:bg-zinc-50/40">
                  <td className="py-2.5 font-sans font-medium text-zinc-950">
                    National Insurance (Class 1)
                  </td>
                  <td className="py-2.5 font-sans text-zinc-500">
                    8% main rate, 2% above UEL
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-medium text-zinc-800">
                    -{formatCurrency(result.nationalInsurance.annual)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    -{formatCurrency(result.nationalInsurance.monthly)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-zinc-500">
                    -{formatCurrency(result.nationalInsurance.weekly)}
                  </td>
                </tr>

                {/* Student Loan */}
                {result.studentLoanDeduction.annual > 0 && (
                  <tr className="hover:bg-zinc-50/40">
                    <td className="py-2.5 font-sans font-medium text-zinc-950">
                      Student Loan Deduction
                    </td>
                    <td className="py-2.5 font-sans text-zinc-500">Income contingent</td>
                    <td className="py-2.5 text-right tabular-nums font-medium text-zinc-800">
                      -{formatCurrency(result.studentLoanDeduction.annual)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      -{formatCurrency(result.studentLoanDeduction.monthly)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-zinc-500">
                      -{formatCurrency(result.studentLoanDeduction.weekly)}
                    </td>
                  </tr>
                )}

                {/* Total Deductions */}
                <tr className="bg-zinc-50/50 font-semibold text-zinc-900">
                  <td className="py-2.5 font-sans">Total Statutory & Pension Deductions</td>
                  <td className="py-2.5 font-sans text-zinc-500 font-normal">All deductions combined</td>
                  <td className="py-2.5 text-right tabular-nums font-bold">-{formatCurrency(result.totalDeductions.annual)}</td>
                  <td className="py-2.5 text-right tabular-nums font-bold">-{formatCurrency(result.totalDeductions.monthly)}</td>
                  <td className="py-2.5 text-right tabular-nums text-zinc-600">-{formatCurrency(result.totalDeductions.weekly)}</td>
                </tr>

                {/* Net Take-Home */}
                <tr className="bg-zinc-900 text-white font-bold">
                  <td className="py-3 font-sans">Net Take-Home Pay (Bank Deposit)</td>
                  <td className="py-3 font-sans font-medium text-zinc-300">
                    {result.takeHomePercentage}% of gross retained
                  </td>
                  <td className="py-3 text-right tabular-nums text-sm">
                    {formatCurrency(result.netPay.annual, true)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-sm">
                    {formatCurrency(result.netPay.monthly, true)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-sm text-zinc-300">
                    {formatCurrency(result.netPay.weekly, true)}
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
