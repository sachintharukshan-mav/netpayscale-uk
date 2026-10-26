import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { BackPayCalculatorClient } from "@/components/BackPayCalculatorClient";
import { AffiliateCards } from "@/components/AffiliateCards";
import { ChevronRight, CalendarClock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title:
    "NHS Back Pay & 3.3% Pay Rise Calculator 2026/27 | Net Arrears After Tax & Pension",
  description:
    "Calculate your exact 2026/27 NHS 3.3% Agenda for Change back-pay lump sum from 1 April after PAYE tax, National Insurance, NHS Pension, and Student Loan deductions.",
  alternates: {
    canonical: "https://netpayscale.uk/pay-rise-backpay-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/pay-rise-backpay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Back Pay & 3.3% Pay Rise Arrears Calculator: computes exact gross and net backdated pay award arrears from 1 April after NHS Pension tier deductions, PAYE tax, 8% NICs, and Student Loan.",
  },
  openGraph: {
    title:
      "NHS Back Pay & 3.3% Pay Rise Calculator 2026/27 | NetPayScale UK",
    description:
      "See how much of your backdated NHS pay award lump sum you actually keep after tax, NICs, and pension.",
    url: "https://netpayscale.uk/pay-rise-backpay-calculator/",
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

export default function BackPayCalculatorPage() {
  const bandBackPayRows = nhsData.bands.map((b) => {
    const pt = b.points[0];
    const calc = calculateNHSPay({
      band: b.band,
      stepIndex: 0,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });
    const newSalary = pt.annualSalary;
    const oldSalary = Math.round(newSalary / 1.033);
    const annualGainGross = newSalary - oldSalary;
    const grossArrears6Mo = Math.round(annualGainGross * 0.5);
    const pensionDed = grossArrears6Mo * calc.pensionRate;
    const taxRate = newSalary > 50270 ? 0.4 : 0.2;
    const niRate = newSalary > 50270 ? 0.02 : 0.08;
    const netArrears6Mo = Math.round(
      grossArrears6Mo -
        pensionDed -
        (grossArrears6Mo - pensionDed) * taxRate -
        grossArrears6Mo * niRate
    );
    return {
      band: b.band,
      slug: b.slug,
      role: b.typicalRoles[0],
      oldSalary,
      newSalary,
      annualGainGross,
      grossArrears6Mo,
      netArrears6Mo,
      pensionLabel: calc.pensionTierLabel,
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
            name: "NHS Back Pay & Pay Rise Calculator",
            item: "https://netpayscale.uk/pay-rise-backpay-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Back Pay & 3.3% Pay Rise Arrears Calculator (2026/27)",
        url: "https://netpayscale.uk/pay-rise-backpay-calculator/",
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
            name: "How much of my NHS back pay lump sum goes in tax and pension?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NHS Agenda for Change back pay is fully pensionable and subject to PAYE Income Tax and Class 1 National Insurance in the month it is paid. For a standard Basic Rate (20% tax, 8% NI) employee in the 8.3% or 9.8% pension tier, you typically keep around 58% to 61% of your gross back-pay lump sum as net cash.",
            },
          },
          {
            "@type": "Question",
            name: "What is the 6-month NHS back pay for a Band 5 Nurse in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "With the 3.3% Agenda for Change uplift raising Band 5 Entry salary from £31,048 to £32,073 (+£1,025/yr gross), 6 months of backdated arrears (April to September) equals £513 gross, or approximately £312 net take-home cash after 8.3% pension, 20% PAYE tax, and 8% National Insurance.",
            },
          },
          {
            "@type": "Question",
            name: "Can I ask my NHS Trust payroll to spread my back pay over multiple months?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For Universal Credit claimants whose award would be reduced by a single large arrears payment, NHS Employers guidance allows Trusts to explore installment options upon request prior to payroll cutoff. For standard PAYE taxpayers, cumulative tax codes automatically reconcile any single-month tax spike in subsequent pay periods.",
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
              NHS Back Pay &amp; 3.3% Pay Rise Calculator
            </span>
          </nav>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#005EB8] border border-blue-200 mb-3">
              <CalendarClock className="w-3.5 h-3.5" />
              2026/27 Agenda for Change Arrears Engine
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              NHS Back Pay &amp; 3.3% Pay Rise Calculator (2026/27)
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Calculate your exact backdated NHS Agenda for Change lump-sum
              arrears from <strong>1 April</strong> to your payment month—and
              see how much net cash actually lands in your bank account after
              NHS Pension, PAYE Tax, National Insurance, and Student Loan.
            </p>
          </div>

          {/* AEO Direct Answer Block */}
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 text-sm text-slate-800 leading-relaxed">
            <strong className="text-[#005EB8] font-extrabold block mb-1">
              Direct Answer · 2026/27 NHS 3.3% Back-Pay Benchmark:
            </strong>
            Under the 2026/27 Agenda for Change <strong>3.3% pay award</strong>{" "}
            (effective 1 April 2026), a full-time{" "}
            <strong>Band 5 Staff Nurse (Entry £32,073)</strong> receives an
            annual gross increase of <strong>+£1,025/yr</strong> (+£85/mo
            gross). For a 6-month arrears window (April–September), this yields{" "}
            <strong>£513 gross back-pay</strong>, which equals{" "}
            <strong>£312 net take-home cash</strong> after 8.3% NHS Pension,
            20% PAYE tax, and 8% National Insurance.
          </div>
        </div>
      </section>

      {/* Main Interactive Calculator */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <BackPayCalculatorClient />
      </section>

      {/* Server-Rendered Band 2 to 9 Back-Pay Table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            2026/27 NHS 3.3% Pay Rise &amp; 6-Month Back-Pay Reference Table (Bands 2–9)
          </h2>
          <p className="text-sm text-slate-600 mt-1 mb-6">
            Compare previous vs. new 2026/27 annual salaries, gross annual
            uplift, and 6-month back-pay arrears (April–September) before and
            after tax/pension across every NHS Band.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4 font-bold">NHS Band (Entry)</th>
                  <th className="py-3 px-4 font-bold">Pre-Uplift Gross</th>
                  <th className="py-3 px-4 font-bold">2026/27 New Gross</th>
                  <th className="py-3 px-4 font-bold">Annual Rise (+3.3%)</th>
                  <th className="py-3 px-4 font-bold">6-Mo Gross Back Pay</th>
                  <th className="py-3 px-4 font-bold text-emerald-700">
                    6-Mo Net Back Pay Kept
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs sm:text-sm">
                {bandBackPayRows.map((row) => (
                  <tr key={row.slug} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">
                      <Link
                        href={`/bands/${row.slug}/`}
                        className="text-[#005EB8] hover:underline"
                      >
                        {row.band}
                      </Link>{" "}
                      <span className="text-xs font-normal text-slate-500">
                        ({row.role})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatCurrency(row.oldSalary)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(row.newSalary)}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-semibold">
                      +{formatCurrency(row.annualGainGross)}/yr
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {formatCurrency(row.grossArrears6Mo)}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700">
                      {formatCurrency(row.netArrears6Mo)}
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
