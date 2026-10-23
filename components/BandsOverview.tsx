import React from "react";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

export default function BandsOverview() {
  return (
    <section id="bands-overview" className="space-y-6 pt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#005EB8] dark:text-[#41B6E6]">
            2026/2027 Pay Circular
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Agenda for Change National Pay Scales (Bands 2–9)
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
          Standard rates reflecting the confirmed 3.3% pay uplift across all UK NHS Trusts (excluding London Weighting and unsocial hours enhancements).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nhsData.bands.map((b) => {
          const entryPoint = b.points[0];
          const topPoint = b.points[b.points.length - 1];

          return (
            <div
              key={b.band}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-[#005EB8] dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {b.band}
                  </span>
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#005EB8] dark:bg-blue-950/60 dark:text-[#41B6E6]">
                    {b.points.length} {b.points.length === 1 ? "Step" : "Steps"}
                  </span>
                </div>

                <div className="my-2 py-2 border-y border-slate-100 dark:border-slate-800/80 font-mono">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Entry:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(entryPoint.annualSalary)} ({formatHourlyRate(entryPoint.hourlyRate)})
                    </span>
                  </div>
                  {b.points.length > 1 && (
                    <div className="flex items-baseline justify-between text-xs mt-1">
                      <span className="text-slate-500 dark:text-slate-400">Top ({topPoint.step}):</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(topPoint.annualSalary)} ({formatHourlyRate(topPoint.hourlyRate)})
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  <strong className="text-slate-700 dark:text-slate-300">Typical roles: </strong>
                  {b.typicalRoles.slice(0, 3).join(", ")}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <a
                  href="#calculator"
                  className="inline-flex items-center gap-1 font-semibold text-[#005EB8] dark:text-[#41B6E6] hover:underline"
                >
                  <span>Select {b.band}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
