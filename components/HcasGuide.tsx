import React from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";

export default function HcasGuide() {
  return (
    <section id="hcas-guide" className="space-y-4 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-200/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-950">
            London Weighting Regulations (HCAS)
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Agenda for Change Section 4 and Annex 9 statutory High Cost Area Supplements
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          2026/27 Caps & Floors
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nhsData.hcasZones
          .filter((z) => z.percentage > 0)
          .map((zone) => (
            <div
              key={zone.id}
              className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-950 text-sm">
                  {zone.name}
                </h3>
                <span className="font-mono text-xs font-semibold text-zinc-900 bg-zinc-100 rounded px-2 py-0.5">
                  +{zone.percentage}% of basic
                </span>
              </div>

              <div className="rounded-lg bg-zinc-50 p-3 font-mono text-xs space-y-1 text-zinc-700">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Minimum Floor:</span>
                  <span className="font-semibold text-zinc-950 tabular-nums">
                    {formatCurrency(zone.min)}/year
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Maximum Ceiling:</span>
                  <span className="font-semibold text-zinc-950 tabular-nums">
                    {formatCurrency(zone.max)}/year
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {zone.description}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}
