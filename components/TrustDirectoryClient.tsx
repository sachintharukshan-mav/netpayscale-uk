"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import trustsData from "@/data/nhs_trusts.json";
import { formatCurrency } from "@/lib/formatters";
import {
  Search,
  Building2,
  MapPin,
  Users,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Share2,
} from "lucide-react";

export function TrustDirectoryClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredTrusts = useMemo(() => {
    return trustsData.filter((trust) => {
      // Region filter
      if (selectedFilter === "inner" && trust.hcasZone !== "inner-london") return false;
      if (selectedFilter === "outer" && trust.hcasZone !== "outer-london") return false;
      if (selectedFilter === "fringe" && trust.hcasZone !== "fringe") return false;
      if (selectedFilter === "scotland" && trust.region !== "Scotland") return false;
      if (selectedFilter === "wales_ni" && !["Wales", "Northern Ireland"].includes(trust.region)) return false;
      if (selectedFilter === "england_reg" && (trust.region.includes("London") || trust.region.includes("Fringe") || ["Scotland", "Wales", "Northern Ireland"].includes(trust.region))) return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inName = trust.name.toLowerCase().includes(q);
      const inShort = trust.shortName.toLowerCase().includes(q);
      const inCity = trust.city.toLowerCase().includes(q);
      const inCode = trust.code.toLowerCase().includes(q);
      const inHospitals = trust.majorHospitals.some((h) => h.toLowerCase().includes(q));

      return inName || inShort || inCity || inCode || inHospitals;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Header Control */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hospital (e.g. St Thomas, Addenbrooke's, QEUH), trust name, or city..."
            className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#005EB8] focus:border-transparent transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Region Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
          <span className="text-slate-500 mr-1 text-[11px] uppercase tracking-wider font-bold">
            Zone / Region:
          </span>
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === "all"
                ? "bg-[#005EB8] text-white border-[#005EB8] shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            All Trusts (50)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("inner")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === "inner"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            Inner London (+20%)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("outer")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === "outer"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
            }`}
          >
            Outer London (+15%)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("fringe")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === "fringe"
                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                : "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
            }`}
          >
            London Fringe (+5%)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("england_reg")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === "england_reg"
                ? "bg-slate-800 text-white border-slate-800 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Regional England
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("scotland")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === "scotland"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            Scotland
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("wales_ni")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedFilter === "wales_ni"
                ? "bg-red-600 text-white border-red-600 shadow-xs"
                : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
            }`}
          >
            Wales &amp; NI
          </button>
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
        <span>
          Showing <strong>{filteredTrusts.length}</strong> of 50 verified NHS Hospital Trusts &amp; Boards
        </span>
        <span className="hidden sm:inline text-emerald-700 font-bold">
          Synchronised with 2026/27 Agenda for Change (+3.3%)
        </span>
      </div>

      {/* Trust Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrusts.map((trust) => {
          const isInner = trust.hcasZone === "inner-london";
          const isOuter = trust.hcasZone === "outer-london";
          const isFringe = trust.hcasZone === "fringe";

          return (
            <div
              key={trust.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header: Code & HCAS Zone */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                    ODS: {trust.code}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      isInner
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : isOuter
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : isFringe
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isInner
                      ? "+20% London Weighting"
                      : isOuter
                      ? "+15% London Weighting"
                      : isFringe
                      ? "+5% Fringe Allowance"
                      : "National Standard Pay"}
                  </span>
                </div>

                {/* Trust Name & Location */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#005EB8] transition-colors leading-snug">
                    {trust.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{trust.city}</span>
                    <span>•</span>
                    <span className="text-slate-600 font-mono">{trust.staffCount}</span>
                  </div>
                </div>

                {/* Major Hospitals List */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Major Hospitals &amp; Sites:
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {trust.majorHospitals.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                    {trust.majorHospitals.length > 3 && (
                      <li className="text-[11px] text-slate-400 italic">
                        +{trust.majorHospitals.length - 3} more hospitals/clinics
                      </li>
                    )}
                  </ul>
                </div>

                {/* 2026/27 Starting Band 5 Benchmark */}
                <div className="pt-3 border-t border-slate-100 rounded-xl bg-slate-50/80 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      Band 5 Starting Net Pay:
                    </span>
                    <span className="text-base font-black font-mono text-emerald-700">
                      ~{formatCurrency(trust.band5StartingNetMonthly)}/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-0.5">
                    <span>Gross Basic + HCAS:</span>
                    <span>{formatCurrency(trust.band5StartingGross)}/yr</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-5 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/?band=Band+5&hcas=${trust.hcasZone}`}
                  className="text-xs font-bold text-[#005EB8] hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>Model My Band at {trust.shortName}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `🏥 ${trust.name} 2026/27 Pay:\n• Allowance: ${trust.hcasRate}\n• Starting Band 5 Take-Home: ~${formatCurrency(trust.band5StartingNetMonthly)}/mo (${formatCurrency(trust.band5StartingGross)}/yr gross)\nCalculate your pay: https://netpayscale.uk/trusts/`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Share Trust Pay Breakdown via WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrusts.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            No NHS Trusts found matching &quot;{searchQuery}&quot;
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for a city (e.g. Leeds, London, Bristol), hospital name, or click &quot;All Trusts&quot; above.
          </p>
        </div>
      )}
    </div>
  );
}
