"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import nhsData from "@/data/nhs_afc_2026.json";

interface RoleQuickFinderProps {
  onSelectRole: (band: string, stepIndex?: number) => void;
  currentBand: string;
}

interface FlattenedRole {
  roleTitle: string;
  band: string;
  slug: string;
  typicalStep: number;
  stepName: string;
}

export default function RoleQuickFinder({
  onSelectRole,
  currentBand,
}: RoleQuickFinderProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Flatten all typical roles from the verified 2026/27 dataset
  const allRoles: FlattenedRole[] = useMemo(() => {
    const list: FlattenedRole[] = [];
    for (const b of nhsData.bands) {
      for (const role of b.typicalRoles) {
        list.push({
          roleTitle: role,
          band: b.band,
          slug: b.slug,
          typicalStep: 0,
          stepName: b.points[0]?.step || "Entry",
        });
      }
    }

    // Add extra common NHS specialty search aliases
    const commonAliases: FlattenedRole[] = [
      { roleTitle: "Staff Nurse (RN / RGN)", band: "Band 5", slug: "band-5", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Senior Staff Nurse", band: "Band 5", slug: "band-5", typicalStep: 1, stepName: "After 2 years" },
      { roleTitle: "Junior Sister / Charge Nurse", band: "Band 6", slug: "band-6", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Senior Sister / Ward Manager", band: "Band 7", slug: "band-7", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Healthcare Assistant (HCA)", band: "Band 2", slug: "band-2", typicalStep: 0, stepName: "Single Point" },
      { roleTitle: "Senior Healthcare Support Worker", band: "Band 3", slug: "band-3", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Emergency Medical Technician (EMT)", band: "Band 4", slug: "band-4", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Newly Qualified Paramedic (NQP)", band: "Band 5", slug: "band-5", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Senior Paramedic", band: "Band 6", slug: "band-6", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Advanced Paramedic Practitioner", band: "Band 7", slug: "band-7", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Midwife (Newly Qualified)", band: "Band 5", slug: "band-5", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Specialist Midwife", band: "Band 6", slug: "band-6", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Physiotherapist (Rotational)", band: "Band 5", slug: "band-5", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Senior Specialist Physiotherapist", band: "Band 6", slug: "band-6", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Clinical Matron", band: "Band 8a", slug: "band-8a", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Head of Nursing", band: "Band 8c", slug: "band-8c", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Operating Department Practitioner (ODP)", band: "Band 5", slug: "band-5", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Senior ODP", band: "Band 6", slug: "band-6", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Radiographer", band: "Band 5", slug: "band-5", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Clinical Psychologist", band: "Band 7", slug: "band-7", typicalStep: 0, stepName: "Entry" },
      { roleTitle: "Occupational Health Nurse", band: "Band 6", slug: "band-6", typicalStep: 0, stepName: "Entry" },
    ];

    return [...commonAliases, ...list];
  }, []);

  // Filter roles based on query
  const filteredRoles = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const seen = new Set<string>();
    const matches: FlattenedRole[] = [];

    for (const r of allRoles) {
      if (
        (r.roleTitle.toLowerCase().includes(q) || r.band.toLowerCase().includes(q)) &&
        !seen.has(`${r.roleTitle}-${r.band}`)
      ) {
        seen.add(`${r.roleTitle}-${r.band}`);
        matches.push(r);
        if (matches.length >= 8) break; // Limit dropdown length
      }
    }

    return matches;
  }, [allRoles, query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (role: FlattenedRole) => {
    onSelectRole(role.band, role.typicalStep);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Find By NHS Job Title
        </label>
        <span className="text-[11px] text-zinc-400">
          Auto-configures band &amp; standard terms
        </span>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Type your job title (e.g. Midwife, Paramedic, Sister, HCA, ODP, Matron)..."
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 shadow-2xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-2 text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            ✕
          </button>
        )}

        {/* Autocomplete Dropdown List */}
        {isOpen && filteredRoles.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border border-zinc-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="p-1.5 max-h-60 overflow-y-auto divide-y divide-zinc-50">
              {filteredRoles.map((role) => (
                <button
                  key={`${role.roleTitle}-${role.band}`}
                  type="button"
                  onClick={() => handleSelect(role)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-zinc-50 transition-colors rounded-lg cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 group-hover:text-[#005EB8] transition-colors font-sans">
                      {role.roleTitle}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-zinc-700 bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white px-2 py-0.5 rounded transition-colors">
                    {role.band}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[10px] text-zinc-400 uppercase font-semibold">Popular:</span>
        {[
          { label: "Staff Nurse", band: "Band 5" },
          { label: "Junior Sister", band: "Band 6" },
          { label: "Ward Manager", band: "Band 7" },
          { label: "Paramedic", band: "Band 6" },
          { label: "HCA", band: "Band 2" },
          { label: "Midwife", band: "Band 5" },
          { label: "Physio", band: "Band 5" },
          { label: "Matron", band: "Band 8a" },
        ].map((chip) => {
          const isCurrent = currentBand === chip.band;
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => onSelectRole(chip.band, 0)}
              className={`rounded-md px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                isCurrent
                  ? "bg-zinc-900 text-white font-medium shadow-2xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
              }`}
            >
              {chip.label} ({chip.band.replace("Band ", "B")})
            </button>
          );
        })}
      </div>
    </div>
  );
}
