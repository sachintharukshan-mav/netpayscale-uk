import React from "react";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import BandsOverview from "@/components/BandsOverview";
import HcasGuide from "@/components/HcasGuide";
import AffiliateCards from "@/components/AffiliateCards";
import AdPlaceholder from "@/components/AdPlaceholder";
import FAQSection from "@/components/FAQSection";
import { getAllPseoEntries } from "@/lib/pseo-matrix";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  Compass,
  FileCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  const pseoEntries = getAllPseoEntries();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 dark:bg-slate-950 transition-colors">
      {/* Top Banner Ad Slot (Zero CLS) */}
      <div className="pt-4">
        <AdPlaceholder slotId="home-top-leaderboard" format="leaderboard" />
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 pt-6">
        {/* HERO SECTION */}
        <section className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-[#005EB8] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-[#41B6E6]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Updated with Official 2026/2027 Agenda for Change (+3.3% Uplift)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            UK NHS Salary & Pension <br className="hidden sm:inline" />
            <span className="text-[#005EB8] dark:text-[#41B6E6]">Take-Home Pay Calculator</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Calculate your exact monthly bank deposit after Agenda for Change step progression, London Weighting (HCAS), unsocial shift enhancements, and NHS Pension scheme tiers.
          </p>

          {/* Trust Metrics Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>100% Agenda for Change Accurate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>HMRC 2026/27 Tax & NI Brackets</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>2015 CARE Pension Tiers</span>
            </span>
          </div>
        </section>

        {/* CORE INTERACTIVE CALCULATOR (Fold) */}
        <section id="calculator" className="scroll-mt-20">
          <Calculator />
        </section>

        {/* MID-CONTENT AD PLACEHOLDER */}
        <div className="py-2">
          <AdPlaceholder slotId="home-mid-banner" format="leaderboard" />
        </div>

        {/* MONETIZATION & AFFILIATE SECTION */}
        <AffiliateCards />

        {/* NATIONAL AGENDA FOR CHANGE BANDS 2-9 OVERVIEW */}
        <BandsOverview />

        {/* LONDON WEIGHTING (HCAS) GUIDANCE */}
        <HcasGuide />

        {/* PROGRAMMATIC SEO LANDING PAGES DIRECTORY */}
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#005EB8] dark:text-[#41B6E6]">
                Explore By Role & City
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Popular NHS Pay Scales & Regional Guides
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pre-calculated salary guides with local NHS Trust agreements
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pseoEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/calculator/${entry.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-[#005EB8] hover:shadow dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#005EB8] dark:bg-blue-950/60 dark:text-[#41B6E6]">
                      {entry.band}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {entry.regionName}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#005EB8] dark:group-hover:text-[#41B6E6] transition-colors">
                    {entry.roleName} Salary in {entry.regionName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {entry.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-[#005EB8] dark:text-[#41B6E6]">
                  <span>View Net Pay Breakdown</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEARCH INTENT FAQS */}
        <FAQSection />
      </main>
    </div>
  );
}
