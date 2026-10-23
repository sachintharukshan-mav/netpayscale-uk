import React from "react";
import { getPromotionMetrics } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp } from "lucide-react";

export default function BandStepUpMetrics() {
  const metrics = getPromotionMetrics();

  return (
    <section className="space-y-4 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-200/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-950">
            Band Step-Up & Promotion Value
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Salary increase when progressing from one band entry point to the next
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          2026/27 Pay Settlement
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((item) => (
          <div
            key={item.fromBand}
            className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
              <span className="font-semibold text-zinc-900">{item.fromBand} → {item.toBand}</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                +{item.pctIncrease}%
              </span>
            </div>

            <div className="text-2xl font-bold text-zinc-950 font-mono tracking-tight tabular-nums mt-1">
              +{formatCurrency(item.grossDiff)}
              <span className="text-xs font-medium text-zinc-500"> /year</span>
            </div>

            <p className="text-[11px] text-zinc-500 mt-1">
              Gross annual increase upon promotion
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
