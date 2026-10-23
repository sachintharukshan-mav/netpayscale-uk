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
  const canonicalUrl = `https://netpayscale.co.uk/calculator/${entry.slug}/`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_GB",
      url: canonicalUrl,
      siteName: "NetPayScale UK",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PseoCalculatorPage({ params }: Props) {
  const { slug } = await params;
  const entry = getPseoEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

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
  const canonicalUrl = `https://netpayscale.co.uk/calculator/${entry.slug}/`;

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://netpayscale.co.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Pay Scales",
            item: "https://netpayscale.co.uk/#bands-overview",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${entry.band} ${entry.roleName} (${entry.regionName})`,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "Occupation",
        name: `${entry.band} ${entry.roleName}`,
        description: entry.description,
        estimatedSalary: [
          {
            "@type": "MonetaryAmountDistribution",
            name: "base",
            currency: "GBP",
            duration: "P1Y",
            percentile10: baselineResult.grossPay.annual,
            percentile90: Math.round(baselineResult.grossPay.annual * 1.25),
          },
        ],
        occupationLocation: [
          {
            "@type": "AdministrativeArea",
            name: entry.regionName,
          },
        ],
      },
      {
        "@type": "FinancialProduct",
        name: `${entry.band} ${entry.roleName} Pay Scale (${entry.regionName})`,
        description: entry.description,
        provider: {
          "@type": "Organization",
          name: "NHS Agenda for Change",
        },
        annualPercentageRate: 3.3,
        feesAndCommissionsSpecification: "No user fees. Free computational resource.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How much does an NHS ${entry.band} ${entry.roleName} earn in ${entry.regionName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Under the 2026/27 Agenda for Change pay scale, an NHS ${entry.band} ${entry.roleName} in ${entry.regionName} earns a starting gross salary of ${formatCurrency(baselineResult.grossPay.annual)}/year. This results in an estimated monthly net take-home pay of ${formatCurrency(baselineResult.netPay.monthly)}/month after PAYE tax, National Insurance, and ${baselineResult.pensionTierLabel} CARE Pension deductions.`,
            },
          },
          {
            "@type": "Question",
            name: `Does a ${entry.band} in ${entry.regionName} receive London Weighting (HCAS)?`,
            acceptedAnswer: {
              "@type": "Answer",
              text:
                entry.hcasZone === "inner-london"
                  ? "Yes. Staff in Inner London receive a 20% High Cost Area Supplement (HCAS), adding between £5,115 and £8,034 annually to basic salary."
                  : entry.hcasZone === "outer-london"
                  ? "Yes. Staff in Outer London receive a 15% High Cost Area Supplement (HCAS), adding between £4,313 and £5,436 annually to basic salary."
                  : entry.hcasZone === "fringe"
                  ? "Yes. Staff in the London Fringe receive a 5% High Cost Area Supplement, adding between £1,192 and £2,024 annually."
                  : "No. Standard national NHS Agenda for Change pay rates apply in this region without London Weighting supplements.",
            },
          },
          {
            "@type": "Question",
            name: `What is the NHS Pension contribution for a ${entry.band}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Under the NHS 2015 CARE Pension scheme, ${entry.band} staff pay ${baselineResult.pensionTierLabel} of their gross pensionable pay. Contributions are deducted before Income Tax, providing immediate tax relief on all contributions.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Clean Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <Link href="/#bands-overview" className="hover:text-zinc-950 transition-colors">
            Pay Scales
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium text-zinc-900">
            {entry.band} {entry.roleName} ({entry.regionName})
          </span>
        </nav>

        {/* Top Ad Leaderboard */}
        <AdPlaceholder slotId="pseo-top-banner" format="leaderboard" />

        {/* SERVER-RENDERED CONTEXTUAL EDITORIAL BREAKDOWN TABLE (Above the Interactive Fold) */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-zinc-100 pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span className="font-semibold text-zinc-900">{entry.band}</span>
                <span>•</span>
                <span>{entry.regionName}</span>
                <span>•</span>
                <span>2026/27 (+3.3%)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight leading-snug">
                {entry.band} {entry.roleName} Salary & Net Take-Home in {entry.regionName}
              </h1>
              <p className="text-xs text-zinc-500">
                Applicable to NHS staff at {entry.regionHeadline}
              </p>
            </div>

            {/* Baseline Snapshot Block */}
            <div className="rounded-lg bg-zinc-50 border border-zinc-200/70 p-4 shrink-0 min-w-[220px]">
              <span className="text-[11px] font-medium text-zinc-500 block">
                Baseline Net Take-Home (Entry)
              </span>
              <div className="text-2xl font-bold text-zinc-950 font-mono tabular-nums mt-0.5">
                {formatCurrency(baselineResult.netPay.monthly, true)}
                <span className="text-xs font-medium text-zinc-500"> /mo</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 mt-1 block tabular-nums">
                Gross: {formatCurrency(baselineResult.grossPay.annual)}/year
              </span>
            </div>
          </div>

          {/* 300-Word Contextual Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-600 leading-relaxed">
            <div className="space-y-1.5 rounded-lg bg-zinc-50/60 p-4 border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 text-xs">
                Geographic Weighting & HCAS
              </h3>
              <p>{editorial.hcasExplanation}</p>
            </div>

            <div className="space-y-1.5 rounded-lg bg-zinc-50/60 p-4 border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 text-xs">
                Agenda for Change Progression
              </h3>
              <p>{editorial.careerProgression}</p>
            </div>

            <div className="space-y-1.5 rounded-lg bg-zinc-50/60 p-4 border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 text-xs">
                NHS Pension & Tax Relief
              </h3>
              <p>{editorial.pensionContext}</p>
            </div>
          </div>

          {/* Direct Answer Summary Box for AEO & Google AI Overviews */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-4 text-xs text-emerald-950 leading-relaxed font-sans shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>Direct Answer · 2026/27 Official Benchmark</span>
            </div>
            <p>
              An NHS <strong>{entry.band} {entry.roleName}</strong> in <strong>{entry.regionName}</strong> earns a starting gross basic salary of <strong>{formatCurrency(baselineResult.baseSalary.annual)}/year</strong> ({formatHourlyRate(baselineResult.hourlyRate)}). After standard UK PAYE Income Tax, National Insurance, and {baselineResult.pensionTierLabel} NHS Pension deductions, the estimated baseline net take-home pay is <strong>{formatCurrency(baselineResult.netPay.monthly, true)}/month</strong> (or {formatCurrency(baselineResult.netPay.annual, true)}/year), keeping <strong>{baselineResult.takeHomePercentage}%</strong> of total gross earnings in their pocket.
            </p>
          </div>

          {/* Official Benchmark Table */}
          <div className="border-t border-zinc-100 pt-5 space-y-2">
            <h3 className="text-xs font-semibold text-zinc-900">
              2026/27 Pay Step Benchmark for {entry.band} ({entry.regionName})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 font-sans font-medium">
                    <th className="py-2.5">Experience Step</th>
                    <th className="py-2.5">Basic Salary</th>
                    <th className="py-2.5">Hourly Rate</th>
                    <th className="py-2.5">HCAS Allowance</th>
                    <th className="py-2.5">Total Gross</th>
                    <th className="py-2.5">Pension Tier</th>
                    <th className="py-2.5 text-right">Est. Take-Home Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  <tr>
                    <td className="py-2.5 font-sans font-medium text-zinc-950">
                      Entry Level
                    </td>
                    <td className="py-2.5 tabular-nums">{formatCurrency(baselineResult.baseSalary.annual)}</td>
                    <td className="py-2.5 tabular-nums">{formatHourlyRate(baselineResult.hourlyRate)}</td>
                    <td className="py-2.5 tabular-nums text-zinc-700">
                      +{formatCurrency(baselineResult.hcasAmount.annual)}
                    </td>
                    <td className="py-2.5 font-semibold text-zinc-950 tabular-nums">
                      {formatCurrency(baselineResult.grossPay.annual)}
                    </td>
                    <td className="py-2.5 text-zinc-600">{baselineResult.pensionTierLabel}</td>
                    <td className="py-2.5 text-right font-bold text-zinc-950 tabular-nums">
                      {formatCurrency(baselineResult.netPay.annual, true)}/yr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CALCULATOR PRE-LOADED WITH THIS EXACT BAND AND REGION */}
        <section id="calculator" className="space-y-4 pt-2">
          <div className="flex items-baseline justify-between border-b border-zinc-200/80 pb-2">
            <h2 className="text-lg font-bold text-zinc-950">
              Interactive Shift & Deduction Modeler
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              Pre-loaded: {entry.band} • {entry.regionName}
            </span>
          </div>

          <Calculator
            key={entry.slug}
            initialBand={entry.band}
            initialStepIndex={0}
            initialHcasZone={entry.hcasZone}
            initialRoleTitle={entry.roleName}
            initialTaxCode={entry.regionId === "scotland" ? "S1257L" : "1257L"}
          />
        </section>

        {/* Post-Calculator Transition Ad Slot */}
        <AdPlaceholder
          slotId="pseo-post-calculator"
          format="in-content"
          label="Post-Calculator Transition · Native / 728×90 Display"
        />

        {/* Financial Planning Guides */}
        <AffiliateCards />

        {/* Pre-FAQ Ad Slot */}
        <AdPlaceholder
          slotId="pseo-mid-banner"
          format="leaderboard"
          label="Pre-FAQ High-Intent Search Slot · 728×90"
        />

        {/* FAQs */}
        <FAQSection />
      </div>
    </div>
  );
}
