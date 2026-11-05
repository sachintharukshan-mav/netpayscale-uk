import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import WalesPayClient from "@/components/WalesPayClient";
import AdPlaceholder from "@/components/AdPlaceholder";

export const metadata: Metadata = {
  title: "NHS Wales Pay Calculator 2026/27 (GIG Cymru 36.5-Hour Week & Band 2–9 Scales)",
  description:
    "Official 2026/27 NHS Wales (GIG Cymru) salary, hourly rate, and net take-home pay calculator. Models the +3.3% Agenda for Change uplift and the 36.5-hour working week (+2.74% hourly boost vs England) across all 7 Welsh Health Boards.",
  alternates: {
    canonical: "https://netpayscale.uk/wales-pay-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/wales-pay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Wales (GIG Cymru) Pay Calculator: computes Band 2 to Band 9 gross salaries (+3.3%), 36.5-hour week hourly rates (+2.74% higher than NHS England), PAYE tax, NI, and 2015 CARE pension across all 7 Welsh Health Boards.",
  },
  openGraph: {
    title: "NHS Wales Pay Calculator 2026/27 (36.5-Hour Week & Band 2–9 Scales) | NetPayScale UK",
    description:
      "Calculate your exact 2026/27 NHS Wales net monthly take-home pay and 36.5-hour week hourly rate across Cardiff & Vale, Swansea Bay, Aneurin Bevan, and Betsi Cadwaladr.",
    url: "https://netpayscale.uk/wales-pay-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [{ url: "https://netpayscale.uk/og-image.png", width: 1200, height: 630 }],
  },
};

const WALES_HOURS = 36.5 * 52.142857; // 1,903.214 hrs/yr
const ENGLAND_HOURS = 37.5 * 52.142857; // 1,955.357 hrs/yr

export default function WalesPayCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "NetPayScale UK NHS Pay Calculator",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Wales Pay Calculator (2026/27)",
            item: "https://netpayscale.uk/wales-pay-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": "https://netpayscale.uk/wales-pay-calculator/#webapp",
        name: "NetPayScale UK — 2026/27 NHS Wales (GIG Cymru) 36.5-Hour Week Pay Calculator",
        url: "https://netpayscale.uk/wales-pay-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "GBP",
        },
        featureList: [
          "2026/27 NHS Wales (GIG Cymru) Agenda for Change Band 2 to Band 9 Pay Scales (+3.3%)",
          "NHS Wales 36.5-Hour Working Week Hourly Rate Calculator (1,903.21 hrs/yr vs 1,955.36 in England)",
          "Side-by-Side NHS Wales vs NHS England Hourly Rate & Section 2 Unsocial Hours Comparison",
          "Coverage of All 7 Welsh University Health Boards & WAST / Velindre NHS Trusts",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does the NHS Wales 36.5-hour working week affect my hourly pay rate in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under the Welsh Government NHS Wales working week reduction agreement, full-time Agenda for Change hours were reduced from 37.5 hours to 36.5 hours per week (1,903.21 hours/year instead of 1,955.36 hours/year) with 100% protected annual salary. Because your annual salary is divided by 1,903.21 hours, every NHS Wales clinician earns a +2.74% higher basic hourly rate than NHS England (e.g. £16.85/hr vs £16.40/hr at Band 5 entry), which also boosts night, weekend, and overtime hourly rates.",
            },
          },
          {
            "@type": "Question",
            name: "What is the Band 5 nurse, radiographer, and occupational therapist salary in NHS Wales for 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In 2026/27 (+3.3% uplift), a Band 5 Staff Nurse, Diagnostic Radiographer, Occupational Therapist, or Physiotherapist in NHS Wales starts at £32,073 gross per year (£16.85/hour on a 36.5-hour week, yielding ~£2,110/month net take-home pay), rising to £34,592 after 2 years (£18.18/hour) and £39,043 at the top of Band 5 after 4 years (£20.51/hour, ~£2,487/month net).",
            },
          },
          {
            "@type": "Question",
            name: "Does NHS Wales use the same income tax bands as England or Scotland?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NHS Wales employees pay Welsh Rates of Income Tax (WRIT) administered by HMRC under tax code C1257L. For 2026/27, the Welsh Government has set the 20% Basic Rate, 40% Higher Rate, and 45% Additional Rate at the exact same percentages and thresholds as England and Northern Ireland.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            NetPayScale UK NHS Pay Calculator
          </Link>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-900">
            NHS Wales (GIG Cymru) Pay Calculator 2026/27
          </span>
        </nav>

        <header className="space-y-3 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
            <span>GIG Cymru • 2026/27 Welsh Government AfC (+3.3%) &amp; 36.5-Hour Working Week</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            NHS Wales Pay Calculator 2026/27{" "}
            <span className="text-emerald-700">(36.5-Hour Week &amp; Band 2–9 Scales)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Calculate your exact 2026/27 <strong>NHS Wales (GIG Cymru)</strong> monthly take-home pay with{" "}
            <strong className="text-slate-900">NetPayScale UK</strong>—including the{" "}
            <strong>36.5-hour full-time working week (+2.74% higher hourly rate than NHS England)</strong>,{" "}
            Welsh tax code <code>C1257L</code>, 2015 CARE pension tiers, and Section 2 unsocial hours across all 7 Welsh Health Boards.
          </p>
        </header>

        {/* Position 0 Direct Answer Box */}
        <section className="rounded-2xl border-2 border-emerald-600/25 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 p-5 sm:p-6 shadow-xs space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
            Quick Answer: 2026/27 NHS Wales Salary Scales &amp; 36.5-Hour Week Hourly Advantage
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            In <strong>2026/27</strong>, NHS Wales (GIG Cymru) Agenda for Change salaries reflect the <strong>+3.3% pay settlement</strong> while reducing full-time hours to <strong>36.5 hours/week (1,903.21 hours/year)</strong> with <strong>100% pay protection</strong>. A newly qualified <strong>Band 5 Nurse, Radiographer, Occupational Therapist, or Physiotherapist in Wales</strong> earns <strong>£32,073/year gross (~£2,110/month net take-home)</strong> at <strong>£16.85/hour</strong> (vs £16.40/hour in England), rising to <strong>£39,043/year (£20.51/hour)</strong> at the top of Band 5. Over a year, full-time NHS Wales staff work <strong>52.1 fewer hours (~7 fewer shifts)</strong> for the same annual salary.
          </p>
        </section>

        <AdPlaceholder slotId="wales-top" format="leaderboard" />

        <WalesPayClient />

        {/* Static SSR Table: Complete 2026/27 NHS Wales Pay Scale & 36.5h Hourly Rate Comparison vs England */}
        <section
          aria-labelledby="wales-pay-table-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5"
        >
          <div>
            <h2 id="wales-pay-table-heading" className="text-lg sm:text-xl font-extrabold text-slate-900">
              2026/27 NHS Wales (GIG Cymru) Pay Scales: Bands 2–9 Annual, Monthly Net &amp; 36.5h Hourly Rates
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side comparison of NHS Wales 36.5-hour hourly rates against NHS England 37.5-hour rates and net monthly take-home pay (C1257L tax code + 2015 CARE Pension).
            </p>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-labelledby="wales-pay-table-heading"
            className="overflow-x-auto rounded-xl border border-slate-200 focus:outline-2 focus:outline-emerald-700"
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th scope="col" className="sticky top-0 bg-slate-50 py-3 px-3.5">NHS Wales Pay Band</th>
                  <th scope="col" className="sticky top-0 bg-slate-50 py-3 px-3.5">Spine Point</th>
                  <th scope="col" className="sticky top-0 bg-slate-50 py-3 px-3.5 text-right">Annual Gross (2026/27)</th>
                  <th scope="col" className="sticky top-0 bg-slate-50 py-3 px-3.5 text-right">Wales Hourly (36.5h)</th>
                  <th scope="col" className="sticky top-0 bg-slate-50 py-3 px-3.5 text-right">England Hourly (37.5h)</th>
                  <th scope="col" className="sticky top-0 bg-slate-50 py-3 px-3.5 text-right">Wales Night Rate (+30%/+44%)</th>
                  <th scope="col" className="sticky top-0 bg-slate-50 py-3 px-3.5 text-right">Estimated Net / Mo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {nhsData.bands.map((b) => {
                  const entry = b.points[0];
                  const top = b.points[b.points.length - 1];
                  const isB2or3 = b.band === "Band 2" || b.band === "Band 3";
                  const nightMult = isB2or3 ? 1.44 : 1.30;

                  const entryNet = calculateNHSPay({
                    band: b.band,
                    stepIndex: 0,
                    hcasZone: "standard",
                    contractedHours: 37.5,
                    nightHoursPerWeek: 0,
                    sundayHoursPerWeek: 0,
                    pensionOptedOut: false,
                    isScottishTax: false,
                    studentLoan: "none",
                  });

                  const topNet = calculateNHSPay({
                    band: b.band,
                    stepIndex: b.points.length - 1,
                    hcasZone: "standard",
                    contractedHours: 37.5,
                    nightHoursPerWeek: 0,
                    sundayHoursPerWeek: 0,
                    pensionOptedOut: false,
                    isScottishTax: false,
                    studentLoan: "none",
                  });

                  const walesEntryHr = entry.annualSalary / WALES_HOURS;
                  const engEntryHr = entry.annualSalary / ENGLAND_HOURS;
                  const walesTopHr = top.annualSalary / WALES_HOURS;
                  const engTopHr = top.annualSalary / ENGLAND_HOURS;

                  return (
                    <React.Fragment key={b.band}>
                      <tr className="hover:bg-slate-50/70">
                        <th scope="row" className="py-3 px-3.5 font-bold text-slate-900">
                          <Link href={`/bands/${b.slug}/`} className="text-emerald-700 hover:underline">
                            {b.band}
                          </Link>
                        </th>
                        <td className="py-3 px-3.5 font-mono text-slate-600">Entry</td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(entry.annualSalary)}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-extrabold text-emerald-700">
                          £{walesEntryHr.toFixed(2)}/hr
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono text-slate-500">
                          £{engEntryHr.toFixed(2)}/hr
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-semibold text-slate-800">
                          £{(walesEntryHr * nightMult).toFixed(2)}/hr
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                          {formatCurrency(Math.round(entryNet.netPay.monthly))}/mo
                        </td>
                      </tr>
                      {b.points.length > 1 && (
                        <tr className="bg-slate-50/40 hover:bg-slate-50/80">
                          <th scope="row" className="py-2.5 px-3.5 font-medium text-slate-500 text-[11px]">
                            ↳ {b.band} Top ({top.yearsExperience} yrs)
                          </th>
                          <td className="py-2.5 px-3.5 font-mono text-slate-500">Top Step</td>
                          <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-slate-800">
                            {formatCurrency(top.annualSalary)}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                            £{walesTopHr.toFixed(2)}/hr
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono text-slate-500">
                            £{engTopHr.toFixed(2)}/hr
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono text-slate-700">
                            £{(walesTopHr * nightMult).toFixed(2)}/hr
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                            {formatCurrency(Math.round(topNet.netPay.monthly))}/mo
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <Link
              href="/scotland-pay-calculator/"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-emerald-800 hover:border-emerald-700 hover:bg-white transition-colors"
            >
              Compare with NHS Scotland 35-Hour Week Calculator →
            </Link>
            <Link
              href="/northern-ireland-pay-calculator/"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-emerald-800 hover:border-emerald-700 hover:bg-white transition-colors"
            >
              Compare with Northern Ireland (HSCNI) 3.3% Backpay Calculator →
            </Link>
            <Link
              href="/roles/radiographer/"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-emerald-800 hover:border-emerald-700 hover:bg-white transition-colors"
            >
              2026/27 NHS Radiographer Salary Guide (Band 5 &amp; Band 6) →
            </Link>
            <Link
              href="/roles/occupational-therapist/"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-emerald-800 hover:border-emerald-700 hover:bg-white transition-colors"
            >
              2026/27 NHS Occupational Therapist Salary Guide →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
