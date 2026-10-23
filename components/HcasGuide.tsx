import React from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";
import { MapPin, ShieldCheck } from "lucide-react";

export default function HcasGuide() {
  return (
    <section id="hcas-guide" className="space-y-5 pt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#005EB8] dark:text-[#41B6E6]">
            London Weighting Rules (HCAS)
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            High Cost Area Supplements (2026/2027)
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
          Mandatory statutory uplifts applied to basic pay for NHS employees working in London and surrounding commuter counties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nhsData.hcasZones
          .filter((z) => z.percentage > 0)
          .map((zone) => (
            <div
              key={zone.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                  <MapPin className="h-4 w-4 text-[#005EB8]" />
                  <span>{zone.name}</span>
                </span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-extrabold text-[#005EB8] dark:bg-blue-950/60 dark:text-[#41B6E6] font-mono">
                  {zone.percentage}% of Basic
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-850 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Statutory Minimum:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(zone.min)}/year
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Statutory Maximum:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(zone.max)}/year
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {zone.description}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}
