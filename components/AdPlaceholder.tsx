import React from "react";

interface AdPlaceholderProps {
  slotId: string;
  format: "leaderboard" | "rectangle" | "sidebar";
  className?: string;
}

export default function AdPlaceholder({
  slotId,
  format,
  className = "",
}: AdPlaceholderProps) {
  // Format heights to prevent CLS
  const formatStyles = {
    leaderboard: "min-h-[90px] sm:min-h-[90px] w-full max-w-[728px]",
    rectangle: "min-h-[250px] w-full max-w-[336px]",
    sidebar: "min-h-[600px] w-full max-w-[300px]",
  };

  return (
    <div
      id={`ad-slot-${slotId}`}
      className={`mx-auto flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-2 text-center dark:border-slate-800 dark:bg-slate-900/40 ${formatStyles[format]} ${className}`}
      aria-label="Advertisement"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Advertisement
      </span>
      <div className="flex items-center justify-center py-2 text-xs text-slate-400">
        <span className="font-mono text-[11px]">
          [Raptive / Mediavine Slot: {slotId}]
        </span>
      </div>
    </div>
  );
}
