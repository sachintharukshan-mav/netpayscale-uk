"use client";

import React from "react";

interface QuickSelectRole {
  label: string;
  band: string;
  stepIndex: number;
}

const quickRoles: QuickSelectRole[] = [
  { label: "Band 5 Staff Nurse", band: "Band 5", stepIndex: 0 },
  { label: "Band 6 Ward Sister", band: "Band 6", stepIndex: 1 },
  { label: "Band 7 Clinical Specialist", band: "Band 7", stepIndex: 0 },
  { label: "Band 3 HCA", band: "Band 3", stepIndex: 0 },
  { label: "Band 8a Lead Pharmacist", band: "Band 8a", stepIndex: 1 },
  { label: "Band 4 Nursing Associate", band: "Band 4", stepIndex: 0 },
  { label: "Band 2 Healthcare Assistant", band: "Band 2", stepIndex: 0 },
];

export default function QuickSelectStrip() {
  const handleSelect = (role: QuickSelectRole) => {
    window.dispatchEvent(
      new CustomEvent("nhs-select-band", {
        detail: { band: role.band, stepIndex: role.stepIndex },
      })
    );
    const calcEl = document.getElementById("calculator");
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
          {/* Autocomplete Finder & Role Quick-Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-muted rounded-lg shrink-0 border border-border-subtle">
              <span className="material-symbols-outlined text-nhs-blue text-[17px]">verified</span>
              <span className="text-xs font-semibold text-text-ink">2026/27 AfC Rates</span>
            </div>

            {/* Touch Scrollable Quick Select Chips Bar with smooth tactile clicks */}
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full touch-pan-x">
                <span className="text-[10px] text-text-muted uppercase tracking-wider shrink-0 mr-0.5 font-medium">
                  Quick Select:
                </span>
                {quickRoles.map((role) => (
                  <button
                    key={role.label}
                    type="button"
                    onClick={() => handleSelect(role)}
                    className="px-2.5 py-1 bg-surface-muted hover:bg-zinc-200 hover:border-zinc-300 border border-transparent rounded-md text-xs text-text-body whitespace-nowrap active:scale-[0.96] transition-all duration-150 shrink-0 cursor-pointer"
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Timestamp with live animated pulse */}
          <div className="flex items-center gap-2 shrink-0 text-text-muted text-xs">
            <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
            <span className="font-mono text-[11px] truncate">HMRC &amp; NHS Circular 2026/27 (+3.3%) Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
