import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";
import { RedundancyCalculatorClient } from "@/components/RedundancyCalculatorClient";
import { AffiliateCards } from "@/components/AffiliateCards";
import { ChevronRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title:
    "NHS Redundancy & MARS Severance Calculator 2026/27 | Section 16 & £30k Tax-Free",
  description:
    "Calculate your 2026/27 NHS Section 16 contractual redundancy pay (1 month per year of service up to 24 years, £80k cap) and NHS MARS voluntary severance after the £30,000 HMRC tax-free allowance.",
  alternates: {
    canonical: "https://netpayscale.uk/redundancy-pay-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/redundancy-pay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Redundancy & MARS Severance Calculator (Agenda for Change Section 16): computes contractual redundancy (1 month per year up to 24 years, £80,000 salary cap / £160,000 payout cap), MARS severance, and net payout after the £30,000 HMRC tax-free termination threshold.",
  },
  openGraph: {
    title:
      "NHS Redundancy & MARS Severance Calculator 2026/27 (Section 16) | NetPayScale UK",
    description:
      "Calculate your exact NHS Section 16 redundancy or MARS severance lump sum after the £30,000 HMRC tax-free exemption.",
    url: "https://netpayscale.uk/redundancy-pay-calculator/",
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

export default function RedundancyCalculatorPage() {
  const serviceMilestones = [5, 10, 15, 20, 24];

  const bandRedundancyRows = nhsData.bands.map((b) => {
    const entrySal = b.points[0].annualSalary;
    const cappedSal = Math.min(80000, Math.max(23000, entrySal));
    const monthlyReckonable = cappedSal / 12;
    return {
      band: b.band,
      slug: b.slug,
      role: b.typicalRoles[0],
      entrySal,
      cappedSal,
      yr5: Math.round(monthlyReckonable * 5),
      yr10: Math.round(monthlyReckonable * 10),
      yr15: Math.round(monthlyReckonable * 15),
      yr24: Math.min(160000, Math.round(monthlyReckonable * 24)),
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
            name: "NHS Redundancy & MARS Calculator",
            item: "https://netpayscale.uk/redundancy-pay-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Redundancy & MARS Severance Calculator (2026/27 Section 16)",
        url: "https://netpayscale.uk/redundancy-pay-calculator/",
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
            name: "How is NHS redundancy pay calculated under Agenda for Change Section 16?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Section 16 of the NHS Terms and Conditions of Service Handbook, staff with at least 2 years of continuous reckonable NHS service receive 1 month's pay for each complete year of reckonable service, up to a maximum of 24 years (24 months' pay). Reckonable salary is subject to a floor of £23,000 and a ceiling of £80,000 per year (capping the maximum contractual payout at £160,000).",
            },
          },
          {
            "@type": "Question",
            name: "Is NHS redundancy pay tax-free in the UK?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under section 403 of ITEPA 2003, the first £30,000 of genuine statutory and contractual NHS redundancy pay is 100% exempt from Income Tax and National Insurance. Any redundancy amount above £30,000 is subject to PAYE Income Tax at your marginal rate, but remains 100% exempt from Employee Class 1 National Insurance and NHS Pension deductions.",
            },
          },
          {
            "@type": "Question",
            name: "What is the difference between NHS Section 16 Redundancy and MARS?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Section 16 applies to compulsory or voluntary redundancy where a post is formally disestablished (paying 1 month per year of service up to 24 months). The Mutually Agreed Resignation Scheme (MARS) is a voluntary severance scheme for staff whose post is not redundant, typically paying 0.5 months' pay per complete year of service capped at 12 months' pay or £80,000.",
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
              NHS Redundancy &amp; MARS Severance Calculator
            </span>
          </nav>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#005EB8] border border-blue-200 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Agenda for Change Section 16 &amp; HMRC s.403 Tax Exemption
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              NHS Redundancy &amp; MARS Severance Calculator (2026/27)
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Calculate your exact{" "}
              <strong>NHS Section 16 Contractual Redundancy</strong> (1 month
              per year of service up to 24 years, £80k salary cap) or{" "}
              <strong>Mutually Agreed Resignation Scheme (MARS)</strong> payout,
              including the <strong>£30,000 HMRC tax-free allowance</strong> and
              marginal PAYE tax on any excess above £30,000.
            </p>
          </div>

          {/* AEO Direct Answer Block */}
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 text-sm text-slate-800 leading-relaxed">
            <strong className="text-[#005EB8] font-extrabold block mb-1">
              Direct Answer · NHS Section 16 Redundancy Formula (2026/27):
            </strong>
            Under Agenda for Change <strong>Section 16</strong>, eligible staff
            with 2+ years of continuous NHS service receive{" "}
            <strong>
              1 month&apos;s pay for each complete year of reckonable service
            </strong>{" "}
            (up to <strong>24 years / 24 months&apos; pay</strong>, capped at an
            £80,000 annual salary / £160,000 maximum payout). The{" "}
            <strong>first £30,000 is 100% tax-free and NI-free</strong>; amounts
            above £30,000 pay marginal Income Tax only (0% Employee National
            Insurance).
          </div>
        </div>
      </section>

      {/* Main Interactive Calculator */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <RedundancyCalculatorClient />
      </section>

      {/* Server-Rendered Section 16 Matrix by Band & Tenure */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            2026/27 NHS Section 16 Gross Redundancy Payout Matrix by Band &amp; Service
          </h2>
          <p className="text-sm text-slate-600 mt-1 mb-6">
            Contractual redundancy lump sums (1 month per complete year of
            service, subject to the £80,000 reckonable salary cap on Bands 8b–9).
            Amounts up to £30,000 are paid 100% tax-free.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4 font-bold">NHS Band (Entry)</th>
                  <th className="py-3 px-4 font-bold">Reckonable Salary</th>
                  <th className="py-3 px-4 font-bold">5 Years (5 Mos)</th>
                  <th className="py-3 px-4 font-bold">10 Years (10 Mos)</th>
                  <th className="py-3 px-4 font-bold">15 Years (15 Mos)</th>
                  <th className="py-3 px-4 font-bold text-[#005EB8]">
                    24 Years Max (24 Mos)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs sm:text-sm">
                {bandRedundancyRows.map((row) => (
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
                    <td className="py-3 px-4 text-slate-700">
                      {formatCurrency(row.cappedSal)}
                      {row.entrySal > 80000 && (
                        <span className="ml-1 text-[10px] font-sans text-amber-700 font-bold">
                          (Cap)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {formatCurrency(row.yr5)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {formatCurrency(row.yr10)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {formatCurrency(row.yr15)}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#005EB8]">
                      {formatCurrency(row.yr24)}
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
