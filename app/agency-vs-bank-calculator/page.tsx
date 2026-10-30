import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AgencyVsBankCalculatorClient } from "@/components/AgencyVsBankCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import {
  ChevronRight,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Umbrella,
  Building2,
  Coins,
} from "lucide-react";

export const metadata: Metadata = {
  title: "NHS Bank vs. Agency vs. Permanent Pay Calculator 2026/27 | Inside IR35 Umbrella",
  description:
    "Compare your exact take-home pay across Permanent NHS Substantive contracts, NHS Staff Bank (+12.07% WTR holiday pay), and Agency Nursing Inside IR35 (deducting 13.8% Employer NI, 0.5% Levy & umbrella fees).",
  alternates: {
    canonical: "https://netpayscale.uk/agency-vs-bank-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/agency-vs-bank-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Bank vs Agency vs Substantive Comparator: Calculates net take-home pay differences across permanent NHS Agenda for Change contracts, Trust Staff Bank with statutory 12.07% WTR holiday pay, and Agency Nursing inside IR35 after 13.8% Employer NI, 0.5% Apprenticeship Levy, and umbrella company deductions.",
  },
  openGraph: {
    title: "NHS Bank vs. Agency vs. Permanent Calculator 2026/27 | NetPayScale UK",
    description:
      "Is agency nursing actually worth it? Calculate your true net pay after umbrella deductions vs Staff Bank with 12.07% holiday pay and permanent NHS benefits.",
    url: "https://netpayscale.uk/agency-vs-bank-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

const DEDUCTION_COMPARISON_TABLE = [
  {
    feature: "Contractual Security",
    permanent: "Guaranteed permanent hours",
    bank: "Zero-hours flexibility (no minimum)",
    agency: "Zero-hours (vulnerable to shift cancellations)",
  },
  {
    feature: "Holiday Pay Accrual",
    permanent: "27–33 days + 8 Bank Holidays paid",
    bank: "+12.07% WTR uplift paid on every hour",
    agency: "Rolled-up from headline rate (no extra funding)",
  },
  {
    feature: "Employer NI (13.8%)",
    permanent: "Paid by NHS Trust (zero worker deduction)",
    bank: "Paid by NHS Trust (zero worker deduction)",
    agency: "Deducted from worker assignment rate",
  },
  {
    feature: "Apprenticeship Levy (0.5%)",
    permanent: "Paid by NHS Trust",
    bank: "Paid by NHS Trust",
    agency: "Deducted from worker assignment rate",
  },
  {
    feature: "Umbrella Company Fee",
    permanent: "£0 / None",
    bank: "£0 / None",
    agency: "−£20 to −£30 per week (−£100/mo)",
  },
  {
    feature: "NHS 2015 CARE Pension",
    permanent: "Automatic (1/54th pot + 23.78% employer)",
    bank: "Opt-in available (Trust contributes)",
    agency: "Zero NHS pension (usually basic 3% NEST)",
  },
  {
    feature: "Occupational Sick Pay",
    permanent: "Up to 6 months full + 6 months half pay",
    bank: "Statutory Sick Pay only (after 3 days)",
    agency: "Statutory Sick Pay only (£118.75/wk)",
  },
  {
    feature: "Death in Service Benefit",
    permanent: "2x annual salary tax-free lump sum",
    bank: "Eligible if contributing to NHS pension",
    agency: "Zero life assurance coverage",
  },
];

export default function AgencyVsBankCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Bank vs Agency Calculator",
            item: "https://netpayscale.uk/agency-vs-bank-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Bank vs Agency vs Substantive Pay Calculator 2026/27",
        url: "https://netpayscale.uk/agency-vs-bank-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires HTML5 JavaScript",
        description:
          "Calculates net take-home pay comparisons between permanent NHS Agenda for Change contracts, Trust Staff Bank with 12.07% WTR holiday pay, and Agency nursing inside IR35 after umbrella fees.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is NHS staff bank or agency nursing better for net take-home pay?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "While nursing agencies often advertise higher headline hourly rates (e.g., £35–£45/hr), shifts inside IR35 require workers to pay Employer's National Insurance (13.8%), Apprenticeship Levy (0.5%), and umbrella company fees (£20–£30/week) out of their rate. In contrast, NHS Staff Bank shifts include a statutory +12.07% Working Time Regulations (WTR) holiday pay uplift with zero middleman deductions, making Bank shifts frequently more lucrative once total benefits are considered.",
            },
          },
          {
            "@type": "Question",
            name: "What is the 12.07% holiday pay uplift on NHS Bank shifts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under the UK Working Time Regulations, workers are entitled to 5.6 weeks of paid holiday per year. Calculated against 46.4 working weeks (52 weeks minus 5.6 weeks), the statutory holiday accrual rate is exactly 12.07% (5.6 / 46.4). NHS Trusts pay this 12.07% directly on top of basic hourly pay for all bank shifts.",
            },
          },
          {
            "@type": "Question",
            name: "Why do agency nurses pay Employer National Insurance inside IR35?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "When an agency shift is deemed inside IR35, the hiring NHS trust pays an assignment rate to the agency/umbrella company. The umbrella company acts as the employer of record, but statutory employment costs—including Employer Class 1 NI (13.8%) and the Apprenticeship Levy (0.5%)—are deducted from the assignment rate before calculating the worker's gross taxable wage.",
            },
          },
          {
            "@type": "Question",
            name: "Do NHS bank staff get the 2015 NHS CARE Pension?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. NHS Bank workers are entitled to contribute to the NHS Pension Scheme (2015 CARE Section). The employing NHS trust pays the statutory 23.78% employer contribution on all pensionable bank earnings, allowing staff to build guaranteed retirement income while working flexibly.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-[#005EB8] transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold whitespace-nowrap">
              NHS Bank vs. Agency vs. Permanent Calculator
            </span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Header Hero Section */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#005EB8] text-white">
              Shift Modeler
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Inside IR35 Umbrella &amp; +12.07% WTR Audited
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight break-words">
            NHS Bank vs. Agency vs. Permanent <span className="text-[#005EB8]">Calculator (2026/27)</span>
            <span className="block text-base sm:text-xl lg:text-2xl font-bold text-slate-700 mt-2 break-words">
              The Real Take-Home Pay Comparison: Umbrella Deductions vs. 12.07% WTR Holiday Pay
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Compare what you actually take home in your bank account between <strong>Permanent Substantive AfC</strong>, <strong>Trust Staff Bank (+12.07% holiday uplift)</strong>, and <strong>Agency Nursing Inside IR35</strong> after 13.8% Employer NI and umbrella fees.
          </p>
        </div>

        {/* Position 0 Executive Answer Box (Targeting Google Featured Snippets) */}
        <section className="bg-gradient-to-r from-blue-50/90 via-white to-blue-50/50 border-2 border-[#005EB8]/30 rounded-2xl p-5 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#005EB8] flex-wrap">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Quick Answer: NHS Bank vs. Agency Inside IR35</span>
          </div>
          <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
            Under UK Agenda for Change rules, an <strong>NHS Staff Bank</strong> shift includes a statutory <strong>+12.07% Working Time Regulations (WTR) holiday pay uplift</strong> with zero middleman deductions and access to the 2015 CARE pension (+23.78% employer deposit). Conversely, <strong>Agency nursing inside IR35</strong> requires the worker to pay <strong>Employer NI (13.8%)</strong>, <strong>Apprenticeship Levy (0.5%)</strong>, and weekly umbrella fees (£20–£30/wk) from their headline rate, eroding <strong>35% to 45%</strong> of the advertised pay.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              WTR Section 13/13A &amp; HMRC PAYE Audited
            </span>
            <span>•</span>
            <span>Zero Hidden Umbrella Margins on Bank</span>
            <span>•</span>
            <span>Permanent Sick Pay Protection</span>
          </div>
        </section>

        {/* Interactive Client Calculator */}
        <AgencyVsBankCalculatorClient />

        <AdPlaceholder slotId="agency-mid" format="in-content" label="Sponsored Clinical Career Resource" />

        {/* Comparison Table: Permanent vs Staff Bank vs Agency */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Contractual Deductions &amp; Employment Rights Comparison
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                A line-by-line comparison of hidden costs and employment rights across all three contract models.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005EB8] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Statutory AfC vs. Agency
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4">Feature / Employment Right</th>
                  <th className="py-3 px-4 font-bold text-blue-900">Permanent Substantive</th>
                  <th className="py-3 px-4 font-bold text-emerald-900">NHS Staff Bank</th>
                  <th className="py-3 px-4 font-bold text-amber-900">Agency (Inside IR35)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {DEDUCTION_COMPARISON_TABLE.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.feature}</td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs">{row.permanent}</td>
                    <td className="py-3.5 px-4 text-emerald-800 text-xs font-semibold">{row.bank}</td>
                    <td className="py-3.5 px-4 text-amber-900 text-xs">{row.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cross-Linking Navigation Hub */}
        <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black">
                Explore More Clinical Decision &amp; Pay Modellers
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate unsocial shift hours, promotion traps, and NHS hospital trust weightings.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005EB8] hover:bg-[#004b93] text-white text-xs font-bold transition-colors shrink-0"
            >
              Back to Pay Calculator
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <Link
              href="/unsocial-hours-calculator/"
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block"
            >
              <p className="font-bold text-blue-300">🌙 Section 2 Unsocial Hours</p>
              <p className="text-[11px] text-slate-300 mt-1">
                Calculate gross enhancement vs. net cash in bank across Nights (+30%/+44%) and Sundays.
              </p>
            </Link>

            <Link
              href="/promotion-calculator/"
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block"
            >
              <p className="font-bold text-amber-300">⚡ Band 5 → 6 Promotion Trap</p>
              <p className="text-[11px] text-slate-300 mt-1">
                Model pension tier bracket jumps and losing night enhancements on ward promotion.
              </p>
            </Link>

            <Link
              href="/pension-calculator/"
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block"
            >
              <p className="font-bold text-purple-300">🏛️ 2015 CARE Pension &amp; Lump Sum</p>
              <p className="text-[11px] text-slate-300 mt-1">
                Calculate early retirement penalties (ages 55–68) and 12:1 tax-free cash commutation.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
