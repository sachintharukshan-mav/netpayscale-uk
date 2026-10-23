import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getAllPseoEntries,
  getPseoEntryBySlug,
  getRegionalEditorial,
} from "@/lib/pseo-matrix";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import Calculator from "@/components/Calculator";
import AffiliateCards from "@/components/AffiliateCards";
import AdPlaceholder from "@/components/AdPlaceholder";
import FAQSection from "@/components/FAQSection";
import {
  ArrowLeft,
  Building,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = getAllPseoEntries();
  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPseoEntryBySlug(slug);

  if (!entry) {
    return {
      title: "NHS Salary Calculator | NetPayScale UK",
    };
  }

  const title = `${entry.band} ${entry.roleName} Salary & Take-Home Pay (${entry.regionName}) | 2026/27 NetPayScale UK`;
  const description = entry.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_GB",
      url: `https://netpayscale.co.uk/calculator/${entry.slug}`,
    },
    alternates: {
      canonical: `https://netpayscale.co.uk/calculator/${entry.slug}`,
    },
  };
}

export default async function PseoCalculatorPage({ params }: Props) {
  const { slug } = await params;
  const entry = getPseoEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  // Pre-calculate baseline figures for server-rendered editorial table
  const baselineResult = calculateNHSPay({
    band: entry.band,
    stepIndex: 0,
    hcasZone: entry.hcasZone,
    nightHoursPerWeek: 0,
    sundayHoursPerWeek: 0,
    pensionOptedOut: false,
    isScottishTax: entry.regionId === "scotland",
    studentLoan: "none",
  });

  const editorial = getRegionalEditorial(entry);

  // Structured FinancialProduct Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${entry.band} ${entry.roleName} Pay Scale (${entry.regionName})`,
    description: entry.description,
    provider: {
      "@type": "Organization",
      name: "NHS Agenda for Change",
    },
    annualPercentageRate: 3.3,
    feesAndCommissionsSpecification: "No user fees. Free computational resource.",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 dark:bg-slate-950 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>Pay Scales</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-slate-900 dark:text-white">
            {entry.band} {entry.roleName} ({entry.regionName})
          </span>
        </nav>

        {/* Top Ad Leaderboard */}
        <AdPlaceholder slotId="pseo-top-banner" format="leaderboard" />

        {/* SERVER-RENDERED CONTEXTUAL EDITORIAL BREAKDOWN TABLE (Above the Interactive Fold) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#005EB8] px-2.5 py-1 text-xs font-bold text-white">
                  {entry.band}
                </span>
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#005EB8] dark:bg-blue-950/60 dark:text-[#41B6E6]">
                  {entry.regionName}
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  2026/27 (+3.3% Pay Rise)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {entry.band} {entry.roleName} Salary & Take-Home Pay in {entry.regionName}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-slate-400" />
                <span>Applicable to {entry.regionHeadline}</span>
              </p>
            </div>

            {/* Quick Baseline Snapshot Pill */}
            <div className="flex flex-col rounded-xl bg-slate-50 p-4 border border-slate-200 dark:border-slate-800 dark:bg-slate-850 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Starting Net Take-Home
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCurrency(baselineResult.netPay.monthly, true)}
                <span className="text-xs font-medium text-slate-500"> /month</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Gross: {formatCurrency(baselineResult.grossPay.annual)}/yr
              </span>
            </div>
          </div>

          {/* 300-Word Contextual Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="space-y-2 rounded-xl bg-slate-50/60 p-4 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <MapPin className="h-4 w-4 text-[#005EB8]" />
                <span>Geographic Locality & Weighting</span>
              </h3>
              <p>{editorial.hcasExplanation}</p>
            </div>

            <div className="space-y-2 rounded-xl bg-slate-50/60 p-4 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>Agenda for Change Pay Progression</span>
              </h3>
              <p>{editorial.careerProgression}</p>
            </div>

            <div className="space-y-2 rounded-xl bg-slate-50/60 p-4 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                <span>NHS Pension & Tax Relief</span>
              </h3>
              <p>{editorial.pensionContext}</p>
            </div>
          </div>

          {/* Official Benchmark Comparison Table for this Role */}
          <div className="overflow-x-auto border-t border-slate-100 pt-5 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Official 2026/27 Pay Step Benchmark for {entry.band} ({entry.regionName})
            </h3>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400 font-sans">
                  <th className="py-2">Experience Step</th>
                  <th className="py-2">Basic Annual</th>
                  <th className="py-2">Hourly Rate</th>
                  <th className="py-2">HCAS Allowance</th>
                  <th className="py-2">Gross Salary</th>
                  <th className="py-2">Pension Tier</th>
                  <th className="py-2 text-right">Net Take-Home (Est.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                  <td className="py-2 font-sans font-bold text-slate-900 dark:text-white">
                    Entry Level (0-2 yrs)
                  </td>
                  <td className="py-2">{formatCurrency(baselineResult.baseSalary.annual)}</td>
                  <td className="py-2">{formatHourlyRate(baselineResult.hourlyRate)}</td>
                  <td className="py-2 text-blue-600 dark:text-blue-400">
                    +{formatCurrency(baselineResult.hcasAmount.annual)}
                  </td>
                  <td className="py-2 font-bold">{formatCurrency(baselineResult.grossPay.annual)}</td>
                  <td className="py-2 text-purple-600 dark:text-purple-400">
                    {baselineResult.pensionTierLabel}
                  </td>
                  <td className="py-2 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(baselineResult.netPay.annual)}/yr
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* INTERACTIVE CALCULATOR PRE-HYDRATED WITH THIS SPECIFIC BAND & REGION */}
        <div id="calculator" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Personalize Your Shift Enhancements & Deductions</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Pre-loaded with {entry.band} • {entry.regionName}
            </span>
          </div>

          <Calculator
            initialBand={entry.band}
            initialStepIndex={0}
            initialHcasZone={entry.hcasZone}
            initialRoleTitle={entry.roleName}
          />
        </div>

        {/* Contextual Financial Affiliate Cards */}
        <AffiliateCards />

        {/* Bottom In-Content Ad */}
        <AdPlaceholder slotId="pseo-mid-banner" format="leaderboard" />

        {/* High-Intent Search FAQs */}
        <FAQSection />
      </div>
    </div>
  );
}
