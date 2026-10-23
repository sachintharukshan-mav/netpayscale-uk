import React from "react";

export type AdFormat = "leaderboard" | "rectangle" | "in-content" | "sidebar";

interface AdPlaceholderProps {
  slotId: string;
  format: AdFormat;
  label?: string;
  className?: string;
}

const FORMAT_METADATA: Record<
  AdFormat,
  {
    containerClass: string;
    dimensionsLabel: string;
    iabName: string;
  }
> = {
  leaderboard: {
    containerClass: "min-h-[64px] sm:min-h-[90px] w-full max-w-[728px]",
    dimensionsLabel: "728×90 Desktop · 320×50 Mobile",
    iabName: "IAB Leaderboard",
  },
  rectangle: {
    containerClass: "min-h-[250px] w-full max-w-[336px]",
    dimensionsLabel: "300×250 MPU · Sticky Viewable",
    iabName: "IAB Medium Rectangle",
  },
  "in-content": {
    containerClass: "min-h-[100px] sm:min-h-[120px] w-full max-w-[728px]",
    dimensionsLabel: "728×90 / Native Multiplex",
    iabName: "IAB In-Content Display",
  },
  sidebar: {
    containerClass: "min-h-[600px] w-full max-w-[300px]",
    dimensionsLabel: "300×600 Half Page",
    iabName: "IAB Half Page",
  },
};

export default function AdPlaceholder({
  slotId,
  format,
  label,
  className = "",
}: AdPlaceholderProps) {
  const meta = FORMAT_METADATA[format];

  return (
    <aside
      id={`ad-slot-${slotId}`}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-ad-status="reserved-cls-safe"
      aria-label="Sponsored Advertisement"
      className={`print:hidden w-full flex flex-col items-center justify-center ${className}`}
    >
      <div
        className={`mx-auto flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong/80 bg-surface-muted/45 px-3 py-2 text-center transition-colors ${meta.containerClass}`}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted/80">
          <span>Sponsored</span>
          <span className="text-border-strong">•</span>
          <span className="font-mono text-[9px] font-medium tracking-normal">
            {meta.iabName}
          </span>
        </div>

        <div className="mt-1 flex flex-col items-center justify-center gap-0.5">
          <span className="font-mono text-[11px] font-medium text-text-muted">
            [Ad Unit: {slotId}]
          </span>
          <span className="font-mono text-[10px] text-text-muted/70">
            {label ?? meta.dimensionsLabel} · Zero-CLS Reserved
          </span>
        </div>
      </div>
    </aside>
  );
}
