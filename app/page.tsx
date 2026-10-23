import React from "react";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import HeroStatsTicker from "@/components/HeroStatsTicker";
import BandStepUpMetrics from "@/components/BandStepUpMetrics";
import PopularBandsComparison from "@/components/PopularBandsComparison";
import PersonaScenarios from "@/components/PersonaScenarios";
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
        {/* HERO SECTION */}
        <section className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-900 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>2026/27 Agenda for Change Verified (+3.3% Pay Uplift)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.15]">
            NHS Pay Calculator 2026/27 <br className="hidden sm:inline" />
            <span className="text-[#005EB8]">Know Your Real Take-Home Pay in Seconds</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
            Pick your Agenda for Change band and see exactly what lands in your bank account, after income tax, National Insurance, NHS Pension (2015 Scheme) and student loan deductions.
          </p>

          {/* Hero Live Metrics Ticker */}
          <HeroStatsTicker />
        </section>

        {/* CORE INTERACTIVE CALCULATOR FOLD */}
        <section id="calculator" className="scroll-mt-16">
          <Calculator />
        </section>

        {/* CAREER PROMOTION & STEP-UP VALUE */}
        <BandStepUpMetrics />

        {/* POPULAR CLINICAL BANDS (Bands 5, 6, 7) */}
        <PopularBandsComparison />

        {/* WORKED PERSONA SCENARIOS */}
        <PersonaScenarios />

        {/* MID-CONTENT AD PLACEHOLDER */}
        <div className="py-2">
          <AdPlaceholder slotId="home-mid-banner" format="leaderboard" />
        </div>

        {/* KEYWORKER FINANCIAL OPTIMIZATION GUIDES */}
        <AffiliateCards />

        {/* NATIONAL AGENDA FOR CHANGE BANDS 2-9 OVERVIEW */}
        <BandsOverview />

        {/* LONDON WEIGHTING (HCAS) GUIDANCE */}
        <HcasGuide />

        {/* PROGRAMMATIC SEO REGIONAL GUIDES DIRECTORY */}
        <section className="space-y-4 pt-6 border-t border-zinc-200/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <h3 className="text-lg font-bold text-zinc-950">
                Regional Pay Scales & Role Directory
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Pre-configured salary models for specific NHS Trusts, roles, and geographic weighting zones
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {pseoEntries.length} Direct Guides
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pseoEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/calculator/${entry.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs transition-all hover:border-zinc-400 hover:bg-zinc-50/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-zinc-950">
                      {entry.band}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
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
