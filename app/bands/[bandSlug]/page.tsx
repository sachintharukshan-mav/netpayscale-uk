import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import { getAllPseoEntries } from "@/lib/pseo-matrix";
import Calculator from "@/components/Calculator";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import FAQSection from "@/components/FAQSection";

interface Props {
  params: Promise<{ bandSlug: string }>;
}

export async function generateStaticParams() {
  return nhsData.bands.map((b) => ({
    bandSlug: b.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bandSlug } = await params;
  const bandObj = nhsData.bands.find((b) => b.slug === bandSlug);

  if (!bandObj) {
    return { title: "NHS Pay Scale Calculator | NetPayScale UK" };
  }

  const entryCalc = calculateNHSPay({
    band: bandObj.band,
    stepIndex: 0,
    hcasZone: "standard",
    nightHoursPerWeek: 0,
    sundayHoursPerWeek: 0,
    pensionOptedOut: false,
    isScottishTax: false,
    studentLoan: "none",
  });
  const topCalc = calculateNHSPay({
    band: bandObj.band,
    stepIndex: bandObj.points.length - 1,
    hcasZone: "standard",
    nightHoursPerWeek: 0,
    sundayHoursPerWeek: 0,
    pensionOptedOut: false,
    isScottishTax: false,
    studentLoan: "none",
  });

  const title = `NHS ${bandObj.band} Pay Scale 2026/27: Take-Home Pay (${formatCurrency(entryCalc.netPay.monthly)}–${formatCurrency(topCalc.netPay.monthly)}/mo) & Hourly Rate`;
  const description = `Official 2026/27 NHS ${bandObj.band} salary (${formatCurrency(entryCalc.baseSalary.annual)} to ${formatCurrency(topCalc.baseSalary.annual)}, +3.3% uplift). View exact monthly net take-home pay after PAYE tax, NI, ${entryCalc.pensionTierLabel} CARE pension, and London HCAS weighting.`;
  const canonicalUrl = `https://netpayscale.uk/bands/${bandObj.slug}/`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      types: {
        "text/markdown": `https://netpayscale.uk/bands/${bandSlug}.md`,
      },
    },
    other: {
      "ai-summary": description,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "NetPayScale UK",
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: "https://netpayscale.uk/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://netpayscale.uk/og-image.png"],
    },
  };
}

export default async function BandHubPage({ params }: Props) {
  const { bandSlug } = await params;
  const bandObj = nhsData.bands.find((b) => b.slug === bandSlug);

  if (!bandObj) {
    notFound();
  }

  const stepCalculations = bandObj.points.map((pt, idx) => ({
    point: pt,
    stepIndex: idx,
    calc: calculateNHSPay({
      band: bandObj.band,
      stepIndex: idx,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    }),
  }));

  const entryCalc = stepCalculations[0].calc;
  const topCalc = stepCalculations[stepCalculations.length - 1].calc;

  const regionalComparisons = [
    {
      label: "National Standard (England & Wales)",
      zone: "standard" as const,
      scotland: false,
      note: "0% HCAS",
    },
    {
      label: "London Fringe (+5% HCAS)",
      zone: "fringe" as const,
      scotland: false,
      note: "Min £1,346 / Max £2,270",
    },
    {
      label: "Outer London (+15% HCAS)",
      zone: "outer-london" as const,
      scotland: false,
      note: "Min £4,870 / Max £6,137",
    },
    {
      label: "Inner London (+20% HCAS)",
      zone: "inner-london" as const,
      scotland: false,
      note: "Min £5,794 / Max £8,746",
    },
    {
      label: "NHS Scotland (Devolved Tax Bands)",
      zone: "standard" as const,
      scotland: true,
      note: "19%–48% Scottish PAYE",
    },
  ].map((rc) => ({
    ...rc,
    entry: calculateNHSPay({
      band: bandObj.band,
      stepIndex: 0,
      hcasZone: rc.zone,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: rc.scotland,
      studentLoan: "none",
    }),
    top: calculateNHSPay({
      band: bandObj.band,
      stepIndex: bandObj.points.length - 1,
      hcasZone: rc.zone,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: rc.scotland,
      studentLoan: "none",
    }),
  }));

  const bandPseoEntries = getAllPseoEntries().filter(
    (e) => e.band === bandObj.band
  );

  const canonicalUrl = `https://netpayscale.uk/bands/${bandObj.slug}/`;

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
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Pay Bands",
            item: "https://netpayscale.uk/#bands-overview",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${bandObj.band} Pay Scale (2026/27)`,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "Occupation",
        name: `NHS ${bandObj.band} (${bandObj.typicalRoles.slice(0, 3).join(", ")})`,
        description: `Official 2026/27 NHS Agenda for Change ${bandObj.band} pay scale, hourly rates, and net monthly take-home pay.`,
        estimatedSalary: [
          {
            "@type": "MonetaryAmountDistribution",
            name: "base",
            currency: "GBP",
            duration: "P1Y",
            percentile10: entryCalc.baseSalary.annual,
            percentile90: topCalc.baseSalary.annual,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the NHS ${bandObj.band} salary and take-home pay in 2026/27?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `For the 2026/27 Agenda for Change pay year (+3.3% uplift), an NHS ${bandObj.band} starts at ${formatCurrency(entryCalc.baseSalary.annual)}/year (${formatHourlyRate(entryCalc.hourlyRate)}) and rises to ${formatCurrency(topCalc.baseSalary.annual)}/year (${formatHourlyRate(topCalc.hourlyRate)}) at the top of the band. After standard UK PAYE tax, National Insurance, and NHS Pension (${entryCalc.pensionTierLabel}) deductions, monthly net take-home pay is ${formatCurrency(entryCalc.netPay.monthly)}/month at entry and ${formatCurrency(topCalc.netPay.monthly)}/month at the top step.`,
            },
          },
          {
            "@type": "Question",
            name: `How much is the NHS ${bandObj.band} hourly rate in 2026/27?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Based on a standard 37.5-hour Agenda for Change week (1,955.36 annual hours), the NHS ${bandObj.band} basic hourly rate starts at ${formatHourlyRate(entryCalc.hourlyRate)} and reaches ${formatHourlyRate(topCalc.hourlyRate)} at the top experience step.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the NHS Pension contribution rate for ${bandObj.band}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Under the 2015 NHS CARE Pension Scheme, an entry-level ${bandObj.band} contributes ${entryCalc.pensionTierLabel} (${formatCurrency(entryCalc.pensionContribution.monthly)}/month pre-tax), while the top step contributes ${topCalc.pensionTierLabel} (${formatCurrency(topCalc.pensionContribution.monthly)}/month pre-tax).`,
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
        {/* Breadcrumb + Sibling Band Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-950 transition-colors">
              Home
            </Link>
            <span className="text-zinc-400">/</span>
            <Link href="/#bands-overview" className="hover:text-zinc-950 transition-colors">
              Pay Bands
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="font-semibold text-zinc-900">
              {bandObj.band} Pay Scale (2026/27)
            </span>
          </nav>

          {/* All 11 Band Hub Pills */}
          <div className="flex flex-wrap gap-1">
            {nhsData.bands.map((b) => (
              <Link
                key={b.slug}
                href={`/bands/${b.slug}/`}
                className={`rounded-md px-2 py-1 text-[11px] font-mono font-bold transition-colors ${
                  b.slug === bandObj.slug
                    ? "bg-[#005EB8] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-700 hover:border-[#005EB8] hover:text-[#005EB8]"
                }`}
              >
                {b.band.replace("Band ", "B")}
              </Link>
            ))}
          </div>
        </div>

        <AdPlaceholder slotId="band-hub-top" format="leaderboard" />

        {/* Hero & Step Progression Table */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-zinc-100 pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-[#005EB8]">
                <span>2026/27 Agenda for Change (+3.3% Official Uplift)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                NHS {bandObj.band} Salary, Hourly Rate &amp; Net Take-Home Pay (2026/27)
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Typical {bandObj.band} roles include:{" "}
                <strong className="text-zinc-900">
                  {bandObj.typicalRoles.join(", ")}
                </strong>
                . Below is the complete 2026/27 step point progression, net monthly bank deposit, and regional HCAS comparison.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="rounded-lg bg-zinc-50 border border-zinc-200/80 p-3.5 min-w-[165px]">
                <span className="text-[11px] font-medium text-zinc-500 block">
                  Entry Take-Home
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-0.5">
                  {formatCurrency(entryCalc.netPay.monthly)}
                  <span className="text-xs font-normal text-zinc-500">/mo</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 block mt-0.5">
                  Gross: {formatCurrency(entryCalc.baseSalary.annual)}
                </span>
              </div>
              <div className="rounded-lg bg-zinc-50 border border-zinc-200/80 p-3.5 min-w-[165px]">
                <span className="text-[11px] font-medium text-zinc-500 block">
                  Top Step Take-Home
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-mono tabular-nums mt-0.5">
                  {formatCurrency(topCalc.netPay.monthly)}
                  <span className="text-xs font-normal text-zinc-500">/mo</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 block mt-0.5">
                  Gross: {formatCurrency(topCalc.baseSalary.annual)}
                </span>
              </div>
            </div>
          </div>

          {/* AEO Direct Answer Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-4 text-xs text-emerald-950 leading-relaxed shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>Direct Answer · 2026/27 Official NHS {bandObj.band} Benchmark</span>
            </div>
            <p>
              In the <strong>2026/27 financial year</strong>, an NHS <strong>{bandObj.band}</strong> earns a starting basic salary of <strong>{formatCurrency(entryCalc.baseSalary.annual)}/year</strong> ({formatHourlyRate(entryCalc.hourlyRate)}), progressing to <strong>{formatCurrency(topCalc.baseSalary.annual)}/year</strong> ({formatHourlyRate(topCalc.hourlyRate)}) at the top of the band. After standard UK PAYE Income Tax, National Insurance, and 2015 CARE Pension ({entryCalc.pensionTierLabel}–{topCalc.pensionTierLabel}) deductions, a full-time (37.5h/wk) {bandObj.band} takes home <strong>{formatCurrency(entryCalc.netPay.monthly)}/month</strong> at entry and <strong>{formatCurrency(topCalc.netPay.monthly)}/month</strong> at the top pay step.
            </p>
          </div>

          {/* Complete Experience Step Progression Table */}
          <div className="space-y-2.5">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950">
              1. NHS {bandObj.band} Experience Step Points &amp; Net Take-Home Table (2026/27)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                    <th className="py-2.5 px-3">Step Point</th>
                    <th className="py-2.5 px-3">Service Required</th>
                    <th className="py-2.5 px-3">Annual Gross</th>
                    <th className="py-2.5 px-3">Hourly Rate</th>
                    <th className="py-2.5 px-3">Pension ({entryCalc.pensionTierLabel})</th>
                    <th className="py-2.5 px-3">PAYE Tax &amp; NI</th>
                    <th className="py-2.5 px-3 text-right">Net Monthly Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {stepCalculations.map(({ point, calc }) => (
                    <tr key={point.step} className="hover:bg-zinc-50/70">
                      <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                        {point.step}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-zinc-600">
                        {point.yearsExperience === 0
                          ? "0 years (Starting)"
                          : `${point.yearsExperience}+ years`}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-zinc-950 tabular-nums">
                        {formatCurrency(calc.grossPay.annual)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-zinc-700">
                        {formatHourlyRate(calc.hourlyRate)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-indigo-700">
                        −{formatCurrency(calc.pensionContribution.monthly)}/mo
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-rose-700">
                        −{formatCurrency(calc.incomeTax.monthly + calc.nationalInsurance.monthly)}/mo
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700 tabular-nums">
                        {formatCurrency(calc.netPay.monthly)}/mo ({formatCurrency(calc.netPay.annual)}/yr)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Geographic HCAS & Scotland Comparison Table */}
          <div className="space-y-2.5 pt-2">
            <h2 className="text-sm sm:text-base font-bold text-zinc-950">
              2. {bandObj.band} London Weighting (HCAS) &amp; Regional Net Pay Comparison
            </h2>
            <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                    <th className="py-2.5 px-3">UK Region / HCAS Zone</th>
                    <th className="py-2.5 px-3">Supplement Rule</th>
                    <th className="py-2.5 px-3">Entry Gross (Inc. HCAS)</th>
                    <th className="py-2.5 px-3">Entry Net Monthly</th>
                    <th className="py-2.5 px-3 text-right">Top Step Net Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {regionalComparisons.map((rc) => (
                    <tr key={rc.label} className="hover:bg-zinc-50/70">
                      <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                        {rc.label}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-zinc-500">
                        {rc.note}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-semibold">
                        {formatCurrency(rc.entry.grossPay.annual)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-bold text-emerald-700">
                        {formatCurrency(rc.entry.netPay.monthly)}/mo
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-zinc-950">
                        {formatCurrency(rc.top.netPay.monthly)}/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Pre-loaded with this Band */}
        <section id="calculator" className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-zinc-200/80 pb-2">
            <h2 className="text-lg font-bold text-zinc-950">
              Interactive {bandObj.band} Shift, Overtime &amp; Deduction Calculator
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              Pre-configured for {bandObj.band} (2026/27)
            </span>
          </div>
          <Calculator initialBand={bandObj.band} initialStepIndex={0} />
        </section>

        <AdPlaceholder slotId="band-hub-mid" format="in-content" />

        {/* Hub-to-Spoke Directory: All Role & Region Calculators for this Band */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                All {bandObj.band} Clinical Role &amp; UK Regional Salary Calculators ({bandPseoEntries.length} Guides)
              </h2>
              <p className="text-xs text-zinc-500">
                Select your specific job title and NHS Trust region to open a pre-configured {bandObj.band} payroll model.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {bandPseoEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/calculator/${entry.slug}/`}
                className="group flex flex-col justify-between rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3 text-xs hover:border-[#005EB8] hover:bg-white transition-all"
              >
                <div>
                  <span className="font-semibold text-zinc-900 group-hover:text-[#005EB8] block">
                    {entry.roleName}
                  </span>
                  <span className="text-[11px] text-zinc-500 block mt-0.5">
                    {entry.regionName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#005EB8] mt-2 inline-block">
                  Open {entry.band} Model →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <AffiliateCards />
        <FAQSection />
      </div>
    </div>
  );
}
