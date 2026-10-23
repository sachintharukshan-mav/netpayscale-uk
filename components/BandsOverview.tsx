"use client";

import React from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";

export default function BandsOverview() {
  const handleModelBand = (bandName: string) => {
    window.dispatchEvent(
      new CustomEvent("nhs-select-band", {
        detail: { band: bandName, stepIndex: 0 },
      })
    );
    const el = document.getElementById("calculator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="bands-overview" className="space-y-4 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-200/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-950">
            Agenda for Change Pay Scale Reference (Bands 2–9)
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            National basic pay rates for 2026/27 reflecting the official 3.3% pay uplift (standard 37.5h week)
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          UK National AfC
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200/90 bg-white shadow-xs">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-500 font-sans font-medium bg-zinc-50/70">
              <th className="py-3 px-4">Pay Band</th>
              <th className="py-3 px-4">Entry Salary</th>
              <th className="py-3 px-4">Entry Hourly</th>
              <th className="py-3 px-4">Top of Band</th>
              <th className="py-3 px-4">Years to Top</th>
              <th className="py-3 px-4 font-normal text-zinc-500">Typical NHS Job Titles</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-800">
            {nhsData.bands.map((b) => {
              const entryPoint = b.points[0];
              const topPoint = b.points[b.points.length - 1];

              return (
                <tr key={b.band} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-zinc-950">
                    {b.band}
                  </td>
                  <td className="py-3 px-4 font-semibold text-zinc-950 tabular-nums">
                    {formatCurrency(entryPoint.annualSalary)}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 tabular-nums">
                    {formatHourlyRate(entryPoint.hourlyRate)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-zinc-950 tabular-nums">
                    {formatCurrency(topPoint.annualSalary)}
                  </td>
                  <td className="py-3 px-4 font-sans text-zinc-600">
                    {topPoint.yearsExperience > 0 ? `${topPoint.yearsExperience} years` : "Single point"}
                  </td>
                  <td className="py-3 px-4 font-sans text-zinc-500 max-w-xs truncate">
                    {b.typicalRoles.slice(0, 3).join(", ")}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => handleModelBand(b.band)}
                      className="rounded-md bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
                    >
                      Calculate →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
