import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { PromotionCalculatorClient } from "@/components/PromotionCalculatorClient";
import { AffiliateCards } from "@/components/AffiliateCards";
import { ChevronRight, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title:
    "NHS Band Promotion Pay Calculator 2026/27 | Band 5 to Band 6 Net Increase",
  description:
    "Compare any two NHS Agenda for Change Bands or spine steps side-by-side (e.g. Band 5 to Band 6, Band 2 to Band 3). See your real monthly net pay increase after pension tier jumps and unsocial shift changes.",
  alternates: {
    canonical: "https://netpayscale.uk/promotion-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/promotion-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Band-to-Band Promotion & Spine Step Comparator: computes the exact monthly net pay difference when moving up an NHS Band (Band 2 to 9), factoring in NHS Pension tier cliffs and unsocial shift changes.",
  },
  openGraph: {
    title:
      "NHS Band Promotion Pay Calculator 2026/27 (Band 5 to 6, 6 to 7) | NetPayScale UK",
    description:
      "Calculate your exact net take-home pay increase when moving up an NHS Band or spine point, including pension tier cliffs and night shift trade-offs.",
    url: "https://netpayscale.uk/promotion-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://netpayscale.uk/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function PromotionCalculatorPage() {
  const transitions = nhsData.bands.slice(0, -1).map((fromB, idx) => {
    const toB = nhsData.bands[idx + 1];
    const fromCalc = calculateNHSPay({
      band: fromB.band,
      stepIndex: 0,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });
    const toCalc = calculateNHSPay({
      band: toB.band,
      stepIndex: 0,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });
    return {
      label: `${fromB.band} → ${toB.band}`,
      fromSlug: fromB.slug,
      toSlug: toB.slug,
      fromGross: fromCalc.baseSalary.annual,
      toGross: toCalc.baseSalary.annual,
      grossGain: toCalc.baseSalary.annual - fromCalc.baseSalary.annual,
      fromNetMo: fromCalc.netPay.monthly,
      toNetMo: toCalc.netPay.monthly,
      netMoGain: toCalc.netPay.monthly - fromCalc.netPay.monthly,
      pensionChange: `${fromCalc.pensionTierLabel} → ${toCalc.pensionTierLabel}`,
    };
  });

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
            name: "NHS Promotion Pay Calculator",
            item: "https://netpayscale.uk/promotion-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Band Promotion & Spine Step Net Pay Comparator (2026/27)",
        url: "https://netpayscale.uk/promotion-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GBP",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How much more is Band 6 than Band 5 per month after tax in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Moving from Band 5 Entry (£32,073 gross, £2,126/mo net) to Band 6 Entry (£39,958 gross, £2,489/mo net) increases your gross salary by +£7,885/yr and increases your real monthly take-home pay by +£363 per month after accounting for the NHS Pension tier jump from 8.3% to 9.8%.",
            },
          },
          {
            "@type": "Question",
            name: "Can a promotion from Band 5 to Band 6 reduce my take-home pay if I stop working nights?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. A Band 5 Nurse working 1 night shift per week (+30% unsocial enhancement) takes home approximately £2,445/month. Moving to a Band 6 Entry Monday–Friday clinic role with zero unsocial hours yields £2,489/month (+£44/mo difference), whereas moving from Band 5 Top Step (£39,027) with night shifts to Band 6 Entry Monday–Friday can temporarily reduce monthly take-home pay until you reach the Band 6 intermediate step.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4"
          >
            <Link href="/" className="hover:text-[#005EB8] transition-colors">
              NHS Pay Calculator
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">
              NHS Band Promotion Pay Calculator
            </span>
          </nav>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#005EB8] border border-blue-200 mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              2026/27 Band-to-Band &amp; Shift Trade-Off Comparator
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              NHS Band Promotion Pay Calculator (2026/27)
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Compare any two NHS Agenda for Change Bands or spine steps
              side-by-side—including <strong>NHS Pension tier cliffs</strong>{" "}
              (e.g. jumping from 8.3% to 9.8%) and what happens to your monthly
              take-home pay if you move from ward night/Sunday shifts to a
              Monday–Friday role.
            </p>
          </div>

          {/* AEO Direct Answer Block */}
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 text-sm text-slate-800 leading-relaxed">
            <strong className="text-[#005EB8] font-extrabold block mb-1">
              Direct Answer · Band 5 to Band 6 Promotion Net Increase (2026/27):
            </strong>
            Stepping up from <strong>Band 5 Entry (£32,073)</strong> to{" "}
            <strong>Band 6 Entry (£39,958)</strong> increases your annual gross
            pay by <strong>+£7,885/yr</strong>. Because your NHS Pension tier
            steps up from <strong>8.3% to 9.8%</strong>, your real monthly net
            take-home pay rises from <strong>£2,126/mo to £2,489/mo</strong> (a
            net gain of <strong>+£363 per month</strong> or{" "}
            <strong>+£4,358/yr</strong> after tax, NICs, and pension).
          </div>
        </div>
      </section>

      {/* Main Interactive Calculator */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <PromotionCalculatorClient />
      </section>

      {/* Server-Rendered Band Promotion Matrix */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            2026/27 NHS Band-to-Band Promotion Net Take-Home Table (Entry to Entry)
          </h2>
          <p className="text-sm text-slate-600 mt-1 mb-6">
            Exact gross salary increase, NHS Pension tier transition, and
            monthly net take-home gain for every Band promotion in 2026/27.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4 font-bold">Band Promotion</th>
                  <th className="py-3 px-4 font-bold">Current Gross</th>
                  <th className="py-3 px-4 font-bold">Promoted Gross</th>
                  <th className="py-3 px-4 font-bold">Gross Increase</th>
                  <th className="py-3 px-4 font-bold">Pension Tier Shift</th>
                  <th className="py-3 px-4 font-bold text-emerald-700">
                    Monthly Net Gain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs sm:text-sm">
                {transitions.map((t) => (
                  <tr key={t.label} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">
                      <Link
                        href={`/bands/${t.toSlug}/`}
                        className="text-[#005EB8] hover:underline"
                      >
                        {t.label}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatCurrency(t.fromGross)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(t.toGross)}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-semibold">
                      +{formatCurrency(t.grossGain)}/yr
                    </td>
                    <td className="py-3 px-4 text-amber-700 font-semibold">
                      {t.pensionChange}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700">
                      +{formatCurrency(t.netMoGain)}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <AffiliateCards />
      </div>
    </main>
  );
}
