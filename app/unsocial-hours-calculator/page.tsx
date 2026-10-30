import type { Metadata } from "next";
import Link from "next/link";
import { UnsocialHoursCalculatorClient } from "@/components/UnsocialHoursCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import {
  Moon,
  Clock,
  ShieldCheck,
  Award,
  Zap,
  HelpCircle,
  FileText,
  TrendingUp,
  ArrowRight,
  Sun,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "NHS Unsocial Hours & Night Shift Pay Calculator 2026/27 | Section 2 Rates",
  description:
    "Calculate your exact NHS unsocial hours pay for night shifts (8pm–6am), Saturdays, and Sundays/Bank Holidays under Agenda for Change Section 2. Instant gross and clean net take-home cash for Bands 2 to 9.",
  alternates: {
    canonical: "https://netpayscale.uk/unsocial-hours-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/unsocial-hours-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "Official 2026/27 NHS Unsocial Hours Pay Calculator (Agenda for Change Section 2): models +30% / +60% uplifts for Bands 4–9 and +44% / +88% uplifts for Bands 2–3 across weekday nights, Saturdays, and Sundays. Calculates net take-home cash after PAYE income tax, Class 1 NI, and 2015 CARE pension deductions.",
  },
  openGraph: {
    title:
      "NHS Unsocial Hours & Night Shift Pay Calculator 2026/27 | NetPayScale UK",
    description:
      "Model your exact monthly net take-home pay with night, Saturday, and Sunday shift enhancements across all NHS Agenda for Change bands.",
    url: "https://netpayscale.uk/unsocial-hours-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://netpayscale.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "NHS Unsocial Hours Pay Calculator 2026/27",
      },
    ],
  },
};

export default function UnsocialHoursCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "NHS Salary Calculator",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Unsocial Hours Calculator",
            item: "https://netpayscale.uk/unsocial-hours-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Unsocial Hours & Night Shift Enhancements Calculator",
        url: "https://netpayscale.uk/unsocial-hours-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GBP",
        },
        featureList: [
          "Agenda for Change Section 2 Statutory Verification",
          "Bands 4–9 Night & Saturday Enhancement (+30%)",
          "Bands 4–9 Sunday & Public Holiday Enhancement (+60%)",
          "Bands 2–3 Lower Pay Band Enhanced Uplifts (+44% & +88%)",
          "Real-Time Net Take-Home Yields after PAYE & NI",
          "Interactive Rota Builder with 1-Click Presets",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What hours count as unsocial in the NHS?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Agenda for Change Section 2, unsocial hours are defined as any hours worked between 20:00 (8:00pm) and 06:00 (6:00am) on Monday to Friday, all day Saturday (midnight Friday to midnight Saturday), and all day Sunday and Public / Bank Holidays (midnight Saturday to midnight Sunday/Bank Holiday).",
            },
          },
          {
            "@type": "Question",
            name: "What are the unsocial hours rates for Band 5 nurses?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For Band 5 and all qualified staff in Bands 4 to 9, weekday night shifts and all day Saturday are paid at plain time plus 30% (+30%). Sundays and Public Holidays are paid at plain time plus 60% (+60%). On an entry Band 5 hourly rate of £16.40/hr, night pay is £21.32/hr and Sunday pay is £26.24/hr gross.",
            },
          },
          {
            "@type": "Question",
            name: "Why do Band 2 and Band 3 receive higher unsocial enhancements?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "To protect the living standards of lower-paid healthcare workers, Agenda for Change Section 2 awards higher unsocial rates for Bands 1 to 3: time plus 44% (+44%) for weekday nights and Saturdays, and time plus 88% (+88%) for Sundays and Bank Holidays.",
            },
          },
          {
            "@type": "Question",
            name: "Are NHS unsocial hours enhancements pensionable?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, unsocial hours payments paid as part of your standard contractual working hours (up to 37.5 hours per week) are pensionable under the 2015 NHS CARE scheme. Non-contractual overtime shifts beyond 37.5 hours per week are non-pensionable.",
            },
          },
          {
            "@type": "Question",
            name: "How much extra net cash do I keep from unsocial hours after tax?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Because unsocial hours enhancements sit at your marginal tax band, standard basic rate taxpayers pay 20% PAYE income tax and 8% National Insurance, meaning you keep approximately 68p to 72p of every £1 of gross unsocial enhancement earned. If repaying Plan 2 student loans (9%), you retain approximately 59p to 63p per £1.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#005EB8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              NHS Unsocial Hours Calculator
            </span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 mb-4">
              <Moon className="w-3.5 h-3.5 text-purple-600" />
              Agenda for Change Section 2 · 2026/27 Rates
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              NHS Unsocial Hours &amp; Night Shift Pay Calculator (2026/27)
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              Model your exact extra take-home pay for working <strong>weekday night shifts (8pm–6am), Saturdays, and Sundays/Bank Holidays</strong> across Bands 2 to 9 with real PAYE tax and pension deductions.
            </p>
          </div>

          {/* Quick Benchmark Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 block mb-1">
                Bands 4–9 Night &amp; Saturday
              </span>
              <div className="text-2xl font-black text-purple-900 font-mono">
                +30% Enhancement
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Mon–Fri 8pm–6am and all day Saturday for qualified nurses &amp; staff.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">
                Bands 4–9 Sunday &amp; Bank Hol.
              </span>
              <div className="text-2xl font-black text-emerald-900 font-mono">
                +60% Enhancement
              </div>
              <p className="text-xs text-slate-600 mt-1">
                All day Sunday and statutory Public Holidays (Band 5: £26.24/hr gross).
              </p>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005EB8] block mb-1">
                Bands 2–3 Lower Pay Rates
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                +44% &amp; +88%
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Higher percentage uplifts to protect Healthcare Assistants &amp; support staff.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 block mb-1">
                Net Cash Retention
              </span>
              <div className="text-2xl font-black text-amber-900 font-mono">
                ~70% Kept Clean
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Around 68p–72p of every £1 extra gross lands cleanly in your bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <UnsocialHoursCalculatorClient />
      </section>

      {/* Educational & Statutory Guidance */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        {/* Section 2 Handbook Rules Reference Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#005EB8]" />
              Official Agenda for Change (AfC) Section 2 Statutory Terms
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Confirmed enhancement rules for NHS England, NHS Scotland, NHS Wales, and HSC Northern Ireland.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4 font-bold">Pay Band Cluster</th>
                  <th className="py-3 px-4 font-bold">Weekday Nights (20:00 – 06:00)</th>
                  <th className="py-3 px-4 font-bold">Saturdays (Midnight to Midnight)</th>
                  <th className="py-3 px-4 font-bold text-emerald-800">Sundays &amp; Public Holidays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs sm:text-sm">
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                    Bands 1, 2 &amp; 3 (Support Staff &amp; HCAs)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-purple-700">Time + 44% (1.44x)</td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">Time + 44% (1.44x)</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">Time + 88% (1.88x)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                    Bands 4 to 9 (Nurses, Midwives, AHP, Leaders)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-purple-700">Time + 30% (1.30x)</td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">Time + 30% (1.30x)</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">Time + 60% (1.60x)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#005EB8]" />
              Frequently Asked Questions About NHS Unsocial Shift Pay
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                What hours count as unsocial in the NHS?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Under Agenda for Change Section 2, unsocial hours are defined as any hours worked between 20:00 (8:00pm) and 06:00 (6:00am) on Monday to Friday, all day Saturday (midnight Friday to midnight Saturday), and all day Sunday and Public / Bank Holidays (midnight Saturday to midnight Sunday/Bank Holiday).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                What are the unsocial hours rates for Band 5 nurses?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                For Band 5 and all qualified staff in Bands 4 to 9, weekday night shifts and all day Saturday are paid at plain time plus 30% (+30%). Sundays and Public Holidays are paid at plain time plus 60% (+60%). On an entry Band 5 hourly rate of £16.40/hr, night pay is £21.32/hr and Sunday pay is £26.24/hr gross.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Why do Band 2 and Band 3 receive higher unsocial enhancements?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                To protect the living standards of lower-paid healthcare workers, Agenda for Change Section 2 awards higher unsocial rates for Bands 1 to 3: time plus 44% (+44%) for weekday nights and Saturdays, and time plus 88% (+88%) for Sundays and Bank Holidays.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Are NHS unsocial hours enhancements pensionable?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Yes, unsocial hours payments paid as part of your standard contractual working hours (up to 37.5 hours per week) are pensionable under the 2015 NHS CARE scheme. Non-contractual overtime shifts beyond 37.5 hours per week are non-pensionable.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                How much extra net cash do I keep from unsocial hours after tax?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Because unsocial hours enhancements sit at your marginal tax band, standard basic rate taxpayers pay 20% PAYE income tax and 8% National Insurance, meaning you keep approximately 68p to 72p of every £1 of gross unsocial enhancement earned. If repaying Plan 2 student loans (9%), you retain approximately 59p to 63p per £1.
              </p>
            </div>
          </div>
        </div>

        {/* Cross-Link Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/bank-shift-calculator/"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#005EB8] transition-all group shadow-xs"
          >
            <div className="text-xs font-bold text-slate-500 mb-1">Related Tool</div>
            <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#005EB8] flex items-center justify-between">
              <span>NHS Bank Shift Calculator</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Calculate locum bank and overtime shift pay rates across trusts.
            </p>
          </Link>

          <Link
            href="/promotion-calculator/"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#005EB8] transition-all group shadow-xs"
          >
            <div className="text-xs font-bold text-slate-500 mb-1">Career Transition</div>
            <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#005EB8] flex items-center justify-between">
              <span>Band 5 to Band 6 Promotion Trap</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Model whether giving up night shifts for a Band 6 post is financially worth it.
            </p>
          </Link>

          <Link
            href="/pension-calculator/"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#005EB8] transition-all group shadow-xs"
          >
            <div className="text-xs font-bold text-slate-500 mb-1">Retirement Scheme</div>
            <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#005EB8] flex items-center justify-between">
              <span>NHS 2015 CARE Pension Calculator</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Model your 1/54th annual pension pot accrual and lump sum commutation.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
