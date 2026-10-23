"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatters";

export default function PopularBandsComparison() {
  const [isAnnual, setIsAnnual] = useState(true);

  const bands = [
    {
      band: "Band 5",
      subtitle: "Newly qualified nurses, ODPs, paramedics and AHPs",
      salary: isAnnual ? 32073 : 2672.75,
      steps: [
        { label: "Entry", val: isAnnual ? "£32,073" : "£2,672.75/mo" },
        { label: "After 2 years", val: isAnnual ? "£34,592" : "£2,882.67/mo" },
        { label: "After 4 years (Top)", val: isAnnual ? "£39,043" : "£3,253.58/mo" },
        { label: "Starting take-home", val: isAnnual ? "£24,483/yr" : "£2,040.21/mo" },
      ],
    },
    {
      band: "Band 6",
      subtitle: "Experienced specialists, deputy ward sisters, senior paramedics",
      salary: isAnnual ? 39959 : 3329.92,
      steps: [
        { label: "Entry", val: isAnnual ? "£39,959" : "£3,329.92/mo" },
        { label: "After 2 years", val: isAnnual ? "£42,170" : "£3,514.17/mo" },
        { label: "After 5 years (Top)", val: isAnnual ? "£48,117" : "£4,009.75/mo" },
        { label: "Starting take-home", val: isAnnual ? "£29,157/yr" : "£2,429.75/mo" },
      ],
    },
    {
      band: "Band 7",
      subtitle: "Advanced clinical practitioners, ward managers, clinical team leads",
      salary: isAnnual ? 49387 : 4115.58,
      steps: [
        { label: "Entry", val: isAnnual ? "£49,387" : "£4,115.58/mo" },
        { label: "After 2 years", val: isAnnual ? "£51,932" : "£4,327.67/mo" },
        { label: "After 5 years (Top)", val: isAnnual ? "£56,515" : "£4,709.58/mo" },
        { label: "Starting take-home", val: isAnnual ? "£35,206/yr" : "£2,933.83/mo" },
      ],
    },
  ];

  return (
    <section className="space-y-4 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-950">
            The Most Popular Clinical Bands
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Key milestone points for Bands 5, 6, and 7 where majority of clinical staff operate
          </p>
        </div>

        <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`rounded-md px-3 py-1 cursor-pointer transition-all ${
              !isAnnual ? "bg-white text-zinc-950 font-semibold shadow-xs" : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`rounded-md px-3 py-1 cursor-pointer transition-all ${
              isAnnual ? "bg-white text-zinc-950 font-semibold shadow-xs" : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bands.map((item) => (
          <div
            key={item.band}
            className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-5 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-950">{item.band}</h3>
                <span className="text-xs font-mono font-bold text-zinc-950">
                  {formatCurrency(item.salary, !isAnnual)}
                  <span className="text-[11px] font-normal text-zinc-500">{isAnnual ? " gross/yr" : " gross/mo"}</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                {item.subtitle}
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-xs">
                {item.steps.map((st) => (
                  <div key={st.label} className="flex items-center justify-between">
                    <span className="text-zinc-600">{st.label}:</span>
                    <span className="font-mono font-medium text-zinc-900 tabular-nums">{st.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("nhs-select-band", {
                      detail: { band: item.band, stepIndex: 0 },
                    })
                  );
                  const el = document.getElementById("calculator");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="block w-full text-center rounded-lg bg-zinc-900 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Model {item.band} in Calculator →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
