"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PseoEntry } from "@/lib/pseo-matrix";

interface PseoDirectoryProps {
  entries: PseoEntry[];
}

export default function PseoDirectory({ entries }: PseoDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Direct Guides" },
    { id: "nursing", label: "Nursing & Midwifery" },
    { id: "paramedic", label: "Ambulance & Paramedics" },
    { id: "ahp", label: "Physio & AHPs" },
    { id: "support", label: "Support & HCAs (Bands 2–4)" },
    { id: "leadership", label: "Leadership (Bands 8a–9)" },
    { id: "london", label: "London Weighting (HCAS)" },
  ];

  const filteredEntries = useMemo(() => {
    let result = entries;

    // Filter by category
    if (activeCategory === "nursing") {
      result = result.filter(
        (e) =>
          e.roleSlug.includes("nurse") ||
          e.roleSlug.includes("midwife") ||
          e.roleName.toLowerCase().includes("sister")
      );
    } else if (activeCategory === "paramedic") {
      result = result.filter(
        (e) =>
          e.roleSlug.includes("paramedic") ||
          e.roleName.toLowerCase().includes("ambulance")
      );
    } else if (activeCategory === "ahp") {
      result = result.filter(
        (e) =>
          e.roleSlug.includes("physio") ||
          e.roleSlug.includes("radiographer") ||
          e.roleSlug.includes("occupational") ||
          e.roleSlug.includes("pharmacist")
      );
    } else if (activeCategory === "support") {
      result = result.filter((e) =>
        ["Band 2", "Band 3", "Band 4"].includes(e.band)
      );
    } else if (activeCategory === "leadership") {
      result = result.filter((e) =>
        ["Band 8a", "Band 8b", "Band 8c", "Band 8d", "Band 9"].includes(e.band)
      );
    } else if (activeCategory === "london") {
      result = result.filter(
        (e) => e.hcasZone === "inner-london" || e.hcasZone === "outer-london" || e.hcasZone === "fringe"
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.roleName.toLowerCase().includes(q) ||
          e.regionName.toLowerCase().includes(q) ||
          e.band.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q)
      );
    }

    return result;
  }, [entries, activeCategory, searchQuery]);

  // If no search query, show top 24 to keep page performance snappy
  const displayEntries = searchQuery.trim() ? filteredEntries : filteredEntries.slice(0, 24);

  return (
    <section className="space-y-4 pt-6 border-t border-zinc-200/80">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
        <div>
          <h3 className="text-lg font-bold text-zinc-950">
            Regional Pay Scales & Role Directory
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Pre-configured salary models for specific NHS Trusts, clinical roles, and geographic weighting zones
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          {entries.length} Programmatic Guides
        </span>
      </div>

      {/* Search Input & Category Pills */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, city, or trust (e.g. Midwife, Manchester, Band 6, Paramedic, Guy's)..."
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayEntries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/calculator/${entry.slug}/`}
            className="group flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs transition-all hover:border-zinc-400 hover:bg-zinc-50/50"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-zinc-950">
                  {entry.band}
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    entry.hcasZone === "inner-london"
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : entry.hcasZone === "outer-london"
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : entry.hcasZone === "fringe"
                      ? "bg-amber-50 text-amber-700 font-semibold"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {entry.regionName}
                </span>
              </div>
              <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#005EB8] transition-colors leading-snug">
                {entry.roleName} in {entry.regionName}
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                {entry.description}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] font-semibold text-zinc-700 group-hover:text-zinc-950">
              <span>Open localized model</span>
              <span className="font-mono text-zinc-400 group-hover:text-zinc-950 transition-colors">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!searchQuery && filteredEntries.length > 24 && (
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-500 font-mono">
            Showing 24 of {filteredEntries.length} matching guides. Use the search box above or expand the complete index below.
          </p>
        </div>
      )}

      {/* Complete Crawl-Depth-1 HTML Directory of All 490 Regional & Clinical Role Guides */}
      <details className="group rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs">
        <summary className="flex cursor-pointer items-center justify-between text-xs font-bold text-zinc-900 select-none list-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005EB8] text-[18px]">account_tree</span>
            <span>
              Complete UK Regional &amp; Clinical Role Pay Directory (All {entries.length} Agenda for Change Models)
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#005EB8] group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>
        <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 max-h-[420px] overflow-y-auto pr-1">
          {entries.map((entry) => (
            <Link
              key={`index-${entry.slug}`}
              href={`/calculator/${entry.slug}/`}
              className="truncate rounded px-2 py-1 text-[11px] text-zinc-600 hover:bg-zinc-100 hover:text-[#005EB8] transition-colors"
            >
              <strong className="font-mono text-zinc-900">{entry.band}</strong>{" "}
              {entry.roleName} — {entry.regionName}
            </Link>
          ))}
        </div>
      </details>
    </section>
  );
}
