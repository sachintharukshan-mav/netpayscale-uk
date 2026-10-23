import React from "react";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import BandsOverview from "@/components/BandsOverview";
import HcasGuide from "@/components/HcasGuide";
import AffiliateCards from "@/components/AffiliateCards";
import AdPlaceholder from "@/components/AdPlaceholder";
import FAQSection from "@/components/FAQSection";
import { getAllPseoEntries } from "@/lib/pseo-matrix";

export default function HomePage() {
  const pseoEntries = getAllPseoEntries();

  return (
    <div className="min-h-screen bg-[#fafafa] pb-16">
      {/* Top Banner Ad Slot (Zero CLS) */}
      <div className="pt-4">
        <AdPlaceholder slotId="home-top-leaderboard" format="leaderboard" />
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 pt-6">
        {/* HERO SECTION - Authoritative, Uncluttered, No Slop */}
        <section className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
            NHS Agenda for Change Salary & Take-Home Pay Calculator
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
            Real-time take-home pay modeling for NHS healthcare staff across England, Scotland, and Wales. Reflects the confirmed 2026/27 pay settlement (+3.3%), London Weighting (HCAS), Section 2 unsocial shift enhancements, and NHS Pension tiers.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-zinc-500 font-mono">
            <span>AfC 2026/27 Verified</span>
            <span>•</span>
            <span>2015 CARE Pension Tiers</span>
            <span>•</span>
            <span>HMRC 2026/27 PAYE & NI</span>
          </div>
        </section>

        {/* CORE CALCULATOR FOLD */}
        <section id="calculator" className="scroll-mt-16">
          <Calculator />
        </section>

        {/* MID-CONTENT AD PLACEHOLDER */}
        <div className="py-2">
          <AdPlaceholder slotId="home-mid-banner" format="leaderboard" />
        </div>

        {/* FINANCIAL OPTIMIZATION GUIDES */}
        <AffiliateCards />

        {/* NATIONAL BANDS REFERENCE TABLE */}
        <BandsOverview />

        {/* LONDON WEIGHTING RULES */}
        <HcasGuide />

        {/* REGIONAL GUIDES & DIRECTORY */}
        <section className="space-y-4 pt-6 border-t border-zinc-200/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <h3 className="text-lg font-bold text-zinc-950">
                Regional Pay Scales & Role Breakdown Directory
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Detailed breakdowns pre-configured for local NHS Trust agreements and geographic supplements
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {pseoEntries.length} Guides Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pseoEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/calculator/${entry.slug}`}
                className="group flex flex-col justify-between rounded-lg border border-zinc-200/90 bg-white p-3.5 shadow-xs transition-all hover:border-zinc-400 hover:bg-zinc-50/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-semibold text-zinc-900">
                      {entry.band}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {entry.regionName}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-[#005EB8] transition-colors leading-snug">
                    {entry.roleName} in {entry.regionName}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {entry.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-medium text-zinc-700 group-hover:text-zinc-950">
                  <span>View localized breakdown</span>
                  <span className="font-mono text-zinc-400 group-hover:text-zinc-950 transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <FAQSection />
      </main>
    </div>
  );
}
