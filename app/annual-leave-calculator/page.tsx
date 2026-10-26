import type { Metadata } from "next";
import Link from "next/link";
import { AnnualLeaveCalculatorClient } from "@/components/AnnualLeaveCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import { ChevronRight, Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "NHS Annual Leave & Bank Holiday Hours Calculator 2026/27 | Pro-Rata & 11.5h Shifts",
  description:
    "Calculate your 2026/27 NHS annual leave and bank holiday entitlement in hours and shifts (7.5h, 11.5h, 12h). Covers 0–5 years (27 days), 5–10 years (29 days), and 10+ years (33 days) plus 8 pro-rata bank holidays.",
  alternates: {
    canonical: "https://netpayscale.uk/annual-leave-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/annual-leave-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Annual Leave & Bank Holiday Calculator (Section 13): converts 27 days (0–4 yrs), 29 days (5–9 yrs), and 33 days (10+ yrs) plus 8 public bank holidays into exact pro-rata hours and shifts.",
  },
  openGraph: {
    title: "NHS Annual Leave & Bank Holiday Hours Calculator 2026/27 | NetPayScale UK",
    description:
      "Instant NHS Agenda for Change Section 13 annual leave calculator. Convert full-time and part-time pro-rata entitlement into total hours and 11.5h/12h shifts.",
    url: "https://netpayscale.uk/annual-leave-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

const PRO_RATA_REFERENCE_HOURS = [37.5, 34.5, 30, 23, 22.5, 18.75, 15];

export default function AnnualLeaveCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "NHS Pay Calculator",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Annual Leave Calculator",
            item: "https://netpayscale.uk/annual-leave-calculator/",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How many hours is NHS annual leave for full-time staff (37.5 hours/week)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Agenda for Change Section 13, a full-time (37.5 hours/week) NHS employee in England and Wales receives: 202.5 hours (27 days) plus 60 hours (8 bank holidays) = 262.5 total hours on entry (0 to 5 years); 217.5 hours (29 days) plus 60 hours = 277.5 total hours after 5 years of service; and 247.5 hours (33 days) plus 60 hours = 307.5 total hours after 10 years of reckonable NHS service.",
            },
          },
          {
            "@type": "Question",
            name: "How do I calculate pro-rata NHS annual leave and bank holidays for part-time hours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Divide your contracted weekly hours by 37.5 and multiply by the full-time hourly entitlement (262.5 hrs for 0–5 years, 277.5 hrs for 5–10 years, or 307.5 hrs for 10+ years, including 8 bank holidays). For example, working 30 hours per week (0.8 FTE) gives 210 total leave hours (162 hours core leave + 48 hours bank holiday allowance) in years 0–5.",
            },
          },
          {
            "@type": "Question",
            name: "How many 11.5-hour shifts is NHS annual leave?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For a full-time nurse or ward clinician working 37.5 hours per week on 11.5-hour shifts, total combined leave (annual leave plus 8 bank holidays) equals 22.8 shifts (262.5 hrs) in years 0–5, 24.1 shifts (277.5 hrs) after 5 years, and 26.7 shifts (307.5 hrs) after 10 years of NHS service.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            NHS Salary Calculator
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800">NHS Annual Leave & Bank Holiday Calculator</span>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            Agenda for Change Section 13 (2026/27 Leave Year)
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            NHS Annual Leave & Bank Holiday Hours Calculator{" "}
            <span className="text-emerald-600">2026/27</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Instantly convert your NHS annual leave and public holiday entitlement into <strong>total HealthRoster hours</strong> and <strong>7.5h, 11.5h, or 12h shift equivalents</strong> for full-time or part-time pro-rata contracts across 0–5 years, 5–10 years, and 10+ years of reckonable NHS service.
          </p>
        </header>

        {/* Interactive Calculator */}
        <AnnualLeaveCalculatorClient />

        <AdPlaceholder slotId="annual-leave-mid" format="in-content" label="Sponsored Financial Resource" />

        {/* Pre-rendered Full-Time & Part-Time Pro-Rata Hours Matrix */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                NHS Annual Leave & Bank Holiday Pro-Rata Hours Chart (2026/27)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Official Agenda for Change Section 13 hourly leave entitlements including 8 UK Public / Bank Holidays (England & Wales).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shrink-0">
              <Clock className="w-3.5 h-3.5" />
              HealthRoster Ready
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Weekly Hours (FTE)</th>
                  <th className="py-3.5 px-4 text-right">Bank Holiday Hours (8d)</th>
                  <th className="py-3.5 px-4 text-right">0–5 Yrs Total (27d + 8 BH)</th>
                  <th className="py-3.5 px-4 text-right">5–10 Yrs Total (29d + 8 BH)</th>
                  <th className="py-3.5 px-4 text-right">10+ Yrs Total (33d + 8 BH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {PRO_RATA_REFERENCE_HOURS.map((hrs) => {
                  const ratio = hrs / 37.5;
                  const bh = Math.round(60 * ratio * 10) / 10;
                  const t0 = Math.round(262.5 * ratio * 10) / 10;
                  const t5 = Math.round(277.5 * ratio * 10) / 10;
                  const t10 = Math.round(307.5 * ratio * 10) / 10;
                  return (
                    <tr key={hrs} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {hrs} hrs/wk{" "}
                        <span className="text-xs font-normal text-slate-500">
                          ({Math.round(ratio * 100)}% FTE)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">{bh} hrs</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                        {t0} hrs{" "}
                        <span className="text-[11px] text-slate-400">
                          ({(t0 / 11.5).toFixed(1)} × 11.5h)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                        {t5} hrs{" "}
                        <span className="text-[11px] text-slate-400">
                          ({(t5 / 11.5).toFixed(1)} × 11.5h)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                        {t10} hrs{" "}
                        <span className="text-[11px] font-normal text-emerald-600">
                          ({(t10 / 11.5).toFixed(1)} × 11.5h)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ & Sibling Calculator Links */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Frequently Asked Questions: NHS Annual Leave & Bank Holidays
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900">
                  1. Does previous NHS service count towards the 5-year and 10-year annual leave tiers?
                </h3>
                <p className="mt-1">
                  Yes. Under Agenda for Change Section 12 and Section 13, all <strong>reckonable aggregated NHS service</strong> (including previous permanent or fixed-term contracts across any NHS Trust in England, Scotland, Wales, or Northern Ireland, even if there was a break in service) counts toward reaching the 5-year (29 days) and 10-year (33 days) annual leave milestones.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  2. Why do part-time nurses and ward staff have bank holidays deducted when a bank holiday falls on their working day?
                </h3>
                <p className="mt-1">
                  To ensure strict legal parity between staff who work Mondays (when most bank holidays fall) and staff who do not, NHS Trusts add a pro-rata Bank Holiday hours allowance to everyone&apos;s annual leave pot at the start of the leave year (April 1st). If your normal working day falls on a Bank Holiday and your department is closed—or you book that Bank Holiday off—those shift hours are deducted from your combined hours balance.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  3. Can I carry over unused NHS annual leave into the next leave year?
                </h3>
                <p className="mt-1">
                  Most NHS Trusts allow up to <strong>5 days (37.5 hours pro-rata)</strong> of unused annual leave to be carried over with line manager approval, or up to 20 days if you were prevented from taking annual leave due to long-term sickness or statutory maternity/adoption leave.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Explore NHS Pay & Shift Calculators
              </span>
              <h2 className="text-xl font-extrabold">
                Calculate Your 2026/27 Take-Home Pay & Extra Shifts
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check how your Band progression, unsocial hours enhancements, maternity leave, or extra bank shifts affect your net monthly pay.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  href: "/",
                  title: "2026/27 NHS Salary & Take-Home Pay Calculator",
                  sub: "Bands 2 to 9 • England, Scotland, Wales & NI",
                },
                {
                  href: "/maternity-pay-calculator/",
                  title: "NHS Maternity Pay (OMP + SMP) Calculator",
                  sub: "8 wks full pay, 18 wks half pay + equalised spread",
                },
                {
                  href: "/bank-shift-calculator/",
                  title: "NHS Bank & Overtime Shift Net Pay Calculator",
                  sub: "Exact cash-in-pocket after marginal tax, NI & student loan",
                },
                {
                  href: "/bands/band-5/",
                  title: "NHS Band 5 Salary & Progression Guide",
                  sub: "Newly qualified & experienced Staff Nurse pay points",
                },
                {
                  href: "/bands/band-6/",
                  title: "NHS Band 6 Salary & Progression Guide",
                  sub: "Sister, Charge Nurse & Specialist Practitioner pay points",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div>
                    <p className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
