import React from "react";
import { formatCurrency } from "@/lib/formatters";
import { calculateNHSPay } from "@/lib/calculator";

export default function PersonaScenarios() {
  const p1 = calculateNHSPay({ band: "Band 5", stepIndex: 0, hcasZone: "standard", contractedHours: 37.5, nightHoursPerWeek: 0, sundayHoursPerWeek: 0, pensionOptedOut: false, isScottishTax: false, studentLoan: "plan2" });
  const p2 = calculateNHSPay({ band: "Band 7", stepIndex: 1, hcasZone: "standard", contractedHours: 30, nightHoursPerWeek: 0, sundayHoursPerWeek: 0, pensionOptedOut: false, isScottishTax: false, studentLoan: "none" });
  const p3 = calculateNHSPay({ band: "Band 3", stepIndex: 1, hcasZone: "standard", contractedHours: 37.5, nightHoursPerWeek: 0, sundayHoursPerWeek: 0, pensionOptedOut: false, isScottishTax: false, studentLoan: "none" });
  const p4 = calculateNHSPay({ band: "Band 6", stepIndex: 1, hcasZone: "standard", contractedHours: 37.5, nightHoursPerWeek: 11.5, sundayHoursPerWeek: 0, pensionOptedOut: false, isScottishTax: false, studentLoan: "none" });

  const scenarios = [
    {
      title: "Newly Qualified Nurse (RN)",
      role: "Staff Nurse",
      band: "Band 5",
      details: "Band 5 · £32,073 FTE · Full time (37.5h) · Plan 2 Student Loan",
      grossMonthly: p1.grossPay.monthly,
      deductionsMonthly: p1.totalDeductions.monthly,
      netMonthly: p1.netPay.monthly,
      badge: "Band 5",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      title: "Senior Physiotherapist",
      role: "Specialist Practitioner",
      band: "Band 7",
      details: "Band 7 · £51,932 FTE · 30 hours/week part-time · Standard tax",
      grossMonthly: p2.grossPay.monthly,
      deductionsMonthly: p2.totalDeductions.monthly,
      netMonthly: p2.netPay.monthly,
      badge: "Band 7",
      badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    },
    {
      title: "Healthcare Assistant (HCA)",
      role: "Clinical Support Worker",
      band: "Band 3",
      details: "Band 3 · £27,476 FTE · Full time · Top of pay band",
      grossMonthly: p3.grossPay.monthly,
      deductionsMonthly: p3.totalDeductions.monthly,
      netMonthly: p3.netPay.monthly,
      badge: "Band 3",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "Senior Paramedic (Shift Worker)",
      role: "Ambulance Clinician",
      band: "Band 6",
      details: "Band 6 · £42,170 FTE · 1x Night Shift/wk (11.5h) · Section 2 Uplift",
      grossMonthly: p4.grossPay.monthly,
      deductionsMonthly: p4.totalDeductions.monthly,
      netMonthly: p4.netPay.monthly,
      badge: "Band 6",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  return (
    <section className="space-y-4 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-200/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-950">
            Example Scenarios: What Your Pay Could Look Like
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Worked payroll examples for typical NHS professions under 2026/27 rules
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          Typical Cases
        </span>
      </div>

      <div className="bento-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Floating magnetic indicator */}
        <div className="bento-indicator bento-2xl" aria-hidden="true" />

        {scenarios.map((item) => (
          <div
            key={item.title}
            className="bento-card flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:border-zinc-300 hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold rounded px-1.5 py-0.5 border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">
                  Monthly payslip
                </span>
              </div>

              <h3 className="text-xs font-bold text-zinc-950">
                {item.title}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                {item.details}
              </p>

              <div className="mt-3 pt-2.5 border-t border-zinc-100 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Gross pay:</span>
                  <span className="tabular-nums font-medium text-zinc-900">{formatCurrency(item.grossMonthly, true)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Deductions:</span>
                  <span className="tabular-nums">−{formatCurrency(item.deductionsMonthly, true)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-100">
              <div className="text-[11px] font-medium text-zinc-500">Net deposit / month:</div>
              <div className="text-xl font-bold text-zinc-950 font-mono tabular-nums">
                {formatCurrency(item.netMonthly, true)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
