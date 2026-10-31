import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getAllPseoEntries,
  getPseoEntryBySlug,
  getRegionalEditorial,
  getRelatedPseoEntries,
} from "@/lib/pseo-matrix";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import Calculator from "@/components/Calculator";
import AffiliateCards from "@/components/AffiliateCards";
import AdPlaceholder from "@/components/AdPlaceholder";
import FAQSection from "@/components/FAQSection";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { MagneticBentoContainer } from "@/components/MagneticBento";

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

  const entryCalc = calculateNHSPay({
    band: entry.band,
    stepIndex: 0,
    hcasZone: entry.hcasZone,
    nightHoursPerWeek: 0,
    sundayHoursPerWeek: 0,
    pensionOptedOut: false,
    isScottishTax: entry.regionId === "scotland",
    studentLoan: "none",
  });

  const title = `${entry.roleName} Salary ${entry.regionName} (2026/27): ${formatCurrency(entryCalc.netPay.monthly)}/mo Net (${formatHourlyRate(entryCalc.hourlyRate)})`;
  const description = `Official 2026/27 NHS ${entry.band} ${entry.roleName} salary in ${entry.regionName}: ${formatCurrency(entryCalc.grossPay.annual)} gross (${formatHourlyRate(entryCalc.hourlyRate)}). Monthly net take-home is ${formatCurrency(entryCalc.netPay.monthly)}/mo after PAYE tax, NI, and ${entryCalc.pensionTierLabel} CARE pension. View step progression and shift pay tables.`;
  const canonicalUrl = `https://netpayscale.uk/calculator/${entry.slug}/`;

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
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      "ai-summary": description,
    },
  };
}

export default async function PseoCalculatorPage({ params }: Props) {
  const { slug } = await params;
  const entry = getPseoEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const bandObj = nhsData.bands.find((b) => b.band === entry.band);
  const bandSlug = bandObj
    ? bandObj.slug
    : entry.band.toLowerCase().replace(/\s+/g, "-");

  const stepModels = (
    bandObj?.points ?? [{ step: "Entry", yearsExperience: 0 }]
  ).map((pt, idx) => ({
    stepLabel: pt.step,
    yearsExperience: pt.yearsExperience,
    calc: calculateNHSPay({
      band: entry.band,
      stepIndex: idx,
      hcasZone: entry.hcasZone,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: entry.regionId === "scotland",
      studentLoan: "none",
    }),
  }));

  const baselineResult = stepModels[0].calc;
  const topStepResult = stepModels[stepModels.length - 1].calc;

  const workingPatternModels = [
    {
      label: "Full-Time Standard Days (37.5h / 1.0 WTE)",
      hours: 37.5,
      nights: 0,
      sundays: 0,
    },
    {
      label: "Acute Rotational Ward Shifts (37.5h inc. Nights & Sundays)",
      hours: 37.5,
      nights: 11.5,
      sundays: 2.88,
    },
    {
      label: "Part-Time 4 Days / Week (30.0h / 0.8 WTE)",
      hours: 30.0,
      nights: 0,
      sundays: 0,
    },
    {
      label: "Part-Time 3 Days / Week (22.5h / 0.6 WTE)",
      hours: 22.5,
      nights: 0,
      sundays: 0,
    },
  ].map((wp) => ({
    ...wp,
    calc: calculateNHSPay({
      band: entry.band,
      stepIndex: 0,
      hcasZone: entry.hcasZone,
      contractedHours: wp.hours,
      nightHoursPerWeek: wp.nights,
      sundayHoursPerWeek: wp.sundays,
      pensionOptedOut: false,
      isScottishTax: entry.regionId === "scotland",
      studentLoan: "none",
    }),
  }));

  const editorial = getRegionalEditorial(entry);
  const { sameRoleOtherRegions, sameRegionOtherRoles, adjacentPromotionRoles } =
    getRelatedPseoEntries(entry);
  const canonicalUrl = `https://netpayscale.uk/calculator/${entry.slug}/`;

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
            name: `${entry.band} Pay Scale`,
            item: `https://netpayscale.uk/bands/${bandSlug}/`,
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
            percentile90: topStepResult.grossPay.annual,
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
        feesAndCommissionsSpecification:
          "No user fees. Free computational resource.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How much does an NHS ${entry.band} ${entry.roleName} earn in ${entry.regionName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Under the 2026/27 Agenda for Change pay scale, an NHS ${entry.band} ${entry.roleName} in ${entry.regionName} earns a starting gross salary of ${formatCurrency(baselineResult.grossPay.annual)}/year (rising to ${formatCurrency(topStepResult.grossPay.annual)}/year at the top step). This results in an estimated monthly net take-home pay of ${formatCurrency(baselineResult.netPay.monthly)}/month at entry and ${formatCurrency(topStepResult.netPay.monthly)}/month at top of band after PAYE tax, National Insurance, and ${baselineResult.pensionTierLabel} CARE Pension deductions.`,
            },
          },
          {
            "@type": "Question",
            name: `Does a ${entry.band} in ${entry.regionName} receive London Weighting (HCAS)?`,
            acceptedAnswer: {
              "@type": "Answer",
              text:
                entry.hcasZone === "inner-london"
                  ? "Yes. Staff in Inner London receive a 20% High Cost Area Supplement (HCAS), adding between £5,794 and £8,746 annually to basic salary."
                  : entry.hcasZone === "outer-london"
                  ? "Yes. Staff in Outer London receive a 15% High Cost Area Supplement (HCAS), adding between £4,870 and £6,137 annually to basic salary."
                  : entry.hcasZone === "fringe"
                  ? "Yes. Staff in the London Fringe receive a 5% High Cost Area Supplement, adding between £1,346 and £2,270 annually."
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
          {
            "@type": "Question",
            name: `What is the hourly rate for an NHS ${entry.band} ${entry.roleName} in ${entry.regionName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The basic daytime hourly rate for an NHS ${entry.band} ${entry.roleName} in ${entry.regionName} is ${formatHourlyRate(baselineResult.hourlyRate)} at entry (rising to ${formatHourlyRate(topStepResult.hourlyRate)} at top of band). Under Section 2 unsocial hours rules, night shifts and Saturdays pay an enhancement rate of ${formatHourlyRate(baselineResult.hourlyRate * (entry.band === "Band 2" || entry.band === "Band 3" ? 1.44 : 1.30))}, while Sundays and Bank Holidays pay ${formatHourlyRate(baselineResult.hourlyRate * (entry.band === "Band 2" || entry.band === "Band 3" ? 1.88 : 1.60))}.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the monthly take-home pay for an NHS ${entry.band} ${entry.roleName} after tax and pension?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `A full-time (37.5 hrs/week) ${entry.band} ${entry.roleName} in ${entry.regionName} takes home approximately ${formatCurrency(baselineResult.netPay.monthly)} net per month at entry step, and ${formatCurrency(topStepResult.netPay.monthly)} net per month at top step after standard PAYE Income Tax, Class 1 National Insurance, and ${baselineResult.pensionTierLabel} (${(baselineResult.pensionRate * 100).toFixed(1)}%) NHS CARE Pension deductions.`,
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
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <Link
            href={`/bands/${bandSlug}/`}
            className="hover:text-[#005EB8] font-medium transition-colors"
          >
            {entry.band} Pay Scale
          </Link>
          <span className="text-zinc-400">/</span>
          <Link
            href={`/roles/${entry.roleSlug}/`}
            className="hover:text-[#005EB8] font-medium transition-colors"
          >
            {entry.roleName}
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium text-zinc-900">
            {entry.regionName}
          </span>
        </nav>

        {/* Top Ad Leaderboard */}
        <AdPlaceholder slotId="pseo-top-banner" format="leaderboard" />

        {/* SERVER-RENDERED CONTEXTUAL EDITORIAL BREAKDOWN TABLE (Above the Interactive Fold) */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-zinc-100 pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
                <Link
                  href={`/bands/${bandSlug}/`}
                  className="font-semibold text-[#005EB8] hover:underline"
                >
                  {entry.band}
                </Link>
                <span>•</span>
                <Link
                  href={`/roles/${entry.roleSlug}/`}
                  className="font-semibold text-[#005EB8] hover:underline"
                >
                  {entry.roleName} Hub
                </Link>
                <span>•</span>
                <span>{entry.regionName}</span>
                <span>•</span>
                <span>2026/27 (+3.3%)</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-950 tracking-tight leading-snug break-words">
                {entry.band} {entry.roleName} Salary &amp; Net Take-Home in{" "}
                {entry.regionName}
              </h1>
              <p className="text-xs text-zinc-500">
                Applicable to NHS staff at {entry.regionHeadline}
              </p>
            </div>

            {/* Baseline Snapshot Block */}
            <MagneticBentoContainer variant="card" className="shrink-0 min-w-[240px]">
              <div className="bento-card rounded-xl bg-zinc-50 border border-zinc-200/90 p-4 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-500 block uppercase tracking-wider">
                  Baseline Net Pay (Entry)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono tabular-nums">
                  {formatCurrency(baselineResult.netPay.monthly, true)}
                  <span className="text-xs font-semibold text-zinc-500"> /mo</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 font-bold">
                    {formatHourlyRate(baselineResult.hourlyRate)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                    Night: {formatHourlyRate(baselineResult.hourlyRate * (entry.band === "Band 2" || entry.band === "Band 3" ? 1.44 : 1.30))}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 block tabular-nums">
                  Gross: {formatCurrency(baselineResult.grossPay.annual)}/year
                </span>
              </div>
            </MagneticBentoContainer>
          </div>

          {/* 300-Word Contextual Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-600 leading-relaxed">
            <div className="space-y-1.5 rounded-lg bg-zinc-50/60 p-4 border border-zinc-100">
              <h3 className="font-semibold text-zinc-900 text-xs">
                Geographic Weighting &amp; HCAS
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
                NHS Pension &amp; Tax Relief
              </h3>
              <p>{editorial.pensionContext}</p>
            </div>
          </div>

          {/* Direct Answer Summary Box for AEO & Google AI Overviews */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs text-emerald-950 leading-relaxed font-sans shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>Direct Answer · 2026/27 Official Benchmark</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              An NHS <strong>{entry.band} {entry.roleName}</strong> in{" "}
              <strong>{entry.regionName}</strong> earns a starting gross basic
              salary of{" "}
              <strong>{formatCurrency(baselineResult.baseSalary.annual)}/year</strong>{" "}
              ({formatHourlyRate(baselineResult.hourlyRate)}), rising to{" "}
              <strong>{formatCurrency(topStepResult.baseSalary.annual)}/year</strong>{" "}
              at the top experience step. After standard UK PAYE Income Tax,
              National Insurance, and {baselineResult.pensionTierLabel} NHS
              Pension deductions, the estimated baseline net take-home pay is{" "}
              <strong>{formatCurrency(baselineResult.netPay.monthly, true)}/month</strong>{" "}
              at entry (and{" "}
              <strong>{formatCurrency(topStepResult.netPay.monthly, true)}/month</strong>{" "}
              at top of band), keeping{" "}
              <strong>{baselineResult.takeHomePercentage}%</strong> of total
              gross earnings in their pocket.
            </p>

            {/* Structured Key Figures Strip for Google Featured Snippets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60 text-[11px]">
              <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-100 space-y-0.5">
                <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Day Rate (1.0x)</span>
                <span className="font-mono font-black text-zinc-950 text-sm block">{formatHourlyRate(baselineResult.hourlyRate)}</span>
                <span className="text-[10px] text-zinc-400 block">to {formatHourlyRate(topStepResult.hourlyRate)}</span>
              </div>
              <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-100 space-y-0.5">
                <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Night Shift (+{entry.band === "Band 2" || entry.band === "Band 3" ? "44%" : "30%"})</span>
                <span className="font-mono font-black text-blue-700 text-sm block">{formatHourlyRate(baselineResult.hourlyRate * (entry.band === "Band 2" || entry.band === "Band 3" ? 1.44 : 1.30))}</span>
                <span className="text-[10px] text-zinc-400 block">8pm–6am AfC Sec 2</span>
              </div>
              <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-100 space-y-0.5">
                <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Sunday/BH (+{entry.band === "Band 2" || entry.band === "Band 3" ? "88%" : "60%"})</span>
                <span className="font-mono font-black text-purple-700 text-sm block">{formatHourlyRate(baselineResult.hourlyRate * (entry.band === "Band 2" || entry.band === "Band 3" ? 1.88 : 1.60))}</span>
                <span className="text-[10px] text-zinc-400 block">Full weekend uplift</span>
              </div>
              <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-100 space-y-0.5">
                <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">Monthly Net Pay</span>
                <span className="font-mono font-black text-emerald-700 text-sm block">{formatCurrency(baselineResult.netPay.monthly, true)}</span>
                <span className="text-[10px] text-zinc-400 block">to {formatCurrency(topStepResult.netPay.monthly, true)}/mo</span>
              </div>
            </div>
          </div>

          {/* 1-Tap WhatsApp & Colleague Share Widget */}
          <ShareBreakdownButton
            shareText={`NHS ${entry.band} ${entry.roleName} in ${entry.regionName} (2026/27): Starting net take-home is ${formatCurrency(baselineResult.netPay.monthly, true)}/mo (£${formatCurrency(baselineResult.grossPay.annual)} gross, ${baselineResult.pensionTierLabel} CARE Pension). Top step: ${formatCurrency(topStepResult.netPay.monthly, true)}/mo.`}
            url={`https://netpayscale.uk/calculator/${entry.slug}/`}
            variant="light"
            label={`Share ${entry.band} ${entry.roleName} Breakdown with Colleagues`}
          />

          {/* Official Multi-Step Benchmark Table */}
          <div className="border-t border-zinc-100 pt-5 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs sm:text-sm font-bold text-zinc-950">
                  1. 2026/27 Pay Step Progression for {entry.band}{" "}
                  {entry.roleName} ({entry.regionName})
                </h2>
                <Link
                  href={`/bands/${bandSlug}/`}
                  className="text-[11px] font-semibold text-[#005EB8] hover:underline"
                >
                  National {entry.band} Guide →
                </Link>
              </div>
              <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                      <th className="py-2.5 px-3">Experience Step</th>
                      <th className="py-2.5 px-3">Basic Salary</th>
                      <th className="py-2.5 px-3">Hourly Rate</th>
                      <th className="py-2.5 px-3">HCAS Allowance</th>
                      <th className="py-2.5 px-3">Total Gross</th>
                      <th className="py-2.5 px-3">NHS Pension</th>
                      <th className="py-2.5 px-3 text-right">
                        Net Monthly Take-Home
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-800">
                    {stepModels.map(({ stepLabel, yearsExperience, calc }) => (
                      <tr key={stepLabel} className="hover:bg-zinc-50/70">
                        <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                          {stepLabel}{" "}
                          <span className="text-[10px] font-normal text-zinc-500">
                            (
                            {yearsExperience === 0
                              ? "0 yrs"
                              : `${yearsExperience}+ yrs`}
                            )
                          </span>
                        </td>
                        <td className="py-2.5 px-3 tabular-nums">
                          {formatCurrency(calc.baseSalary.annual)}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums">
                          {formatHourlyRate(calc.hourlyRate)}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums text-zinc-700">
                          +{formatCurrency(calc.hcasAmount.annual)}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-zinc-950 tabular-nums">
                          {formatCurrency(calc.grossPay.annual)}
                        </td>
                        <td className="py-2.5 px-3 text-indigo-700 tabular-nums">
                          {calc.pensionTierLabel} (−
                          {formatCurrency(calc.pensionContribution.monthly)}/mo)
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700 tabular-nums">
                          {formatCurrency(calc.netPay.monthly)}/mo (
                          {formatCurrency(calc.netPay.annual)}/yr)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Working Pattern, Part-Time Pro-Rata & Shift Uplift Matrix */}
            <div className="space-y-2">
              <h2 className="text-xs sm:text-sm font-bold text-zinc-950">
                2. Full-Time, Part-Time Pro-Rata &amp; Night Shift Take-Home
                Matrix ({entry.band} {entry.roleName} in {entry.regionName})
              </h2>
              <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                      <th className="py-2.5 px-3">
                        Working Pattern / Contracted Hours
                      </th>
                      <th className="py-2.5 px-3">
                        Annual Gross (Inc. HCAS/Uplifts)
                      </th>
                      <th className="py-2.5 px-3">PAYE Tax &amp; NI</th>
                      <th className="py-2.5 px-3">NHS Pension</th>
                      <th className="py-2.5 px-3 text-right">
                        Net Monthly In-Bank
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-800">
                    {workingPatternModels.map((wp) => (
                      <tr key={wp.label} className="hover:bg-zinc-50/70">
                        <td className="py-2.5 px-3 font-sans font-medium text-zinc-950">
                          {wp.label}
                        </td>
                        <td className="py-2.5 px-3 font-semibold tabular-nums">
                          {formatCurrency(wp.calc.grossPay.annual)}/yr
                        </td>
                        <td className="py-2.5 px-3 text-rose-700 tabular-nums">
                          −
                          {formatCurrency(
                            wp.calc.incomeTax.monthly +
                              wp.calc.nationalInsurance.monthly
                          )}
                          /mo
                        </td>
                        <td className="py-2.5 px-3 text-indigo-700 tabular-nums">
                          −{formatCurrency(wp.calc.pensionContribution.monthly)}
                          /mo ({wp.calc.pensionTierLabel})
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700 tabular-nums">
                          {formatCurrency(wp.calc.netPay.monthly)}/mo
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CALCULATOR PRE-LOADED WITH THIS EXACT BAND AND REGION */}
        <section id="calculator" className="space-y-4 pt-2">
          <div className="flex items-baseline justify-between border-b border-zinc-200/80 pb-2">
            <h2 className="text-lg font-bold text-zinc-950">
              Interactive Shift &amp; Deduction Modeler
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

        {/* 2-AXIS INTERNAL CROSS-LINKING MESH (Eliminates Orphan Pages & Passes Internal PageRank) */}
        <section
          aria-label="Related Regional & Band Pay Calculators"
          className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-8"
        >
          {/* Axis 1: Same Role & Band Across All Other UK Regions */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-100 pb-2.5">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Compare {entry.band} {entry.roleName} Pay Across UK Regions
                </h2>
                <p className="text-xs text-zinc-500">
                  See how High Cost Area Supplements (HCAS) and Scottish tax
                  bands change monthly take-home pay for a {entry.band}{" "}
                  {entry.roleName}.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                {sameRoleOtherRegions.length} Regional Models
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {sameRoleOtherRegions.map((rel) => {
                const relCalc = calculateNHSPay({
                  band: rel.band,
                  stepIndex: 0,
                  hcasZone: rel.hcasZone,
                  nightHoursPerWeek: 0,
                  sundayHoursPerWeek: 0,
                  pensionOptedOut: false,
                  isScottishTax: rel.regionId === "scotland",
                  studentLoan: "none",
                });
                return (
                  <Link
                    key={rel.slug}
                    href={`/calculator/${rel.slug}/`}
                    className="group flex items-center justify-between rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-2.5 text-xs transition-all hover:border-[#005EB8] hover:bg-white hover:shadow-2xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-zinc-900 group-hover:text-[#005EB8] block truncate">
                        {rel.roleName} in {rel.regionName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {rel.band} • Gross{" "}
                        {formatCurrency(relCalc.grossPay.annual)}/yr
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-emerald-700 tabular-nums block">
                        {formatCurrency(relCalc.netPay.monthly)}/mo
                      </span>
                      <span className="text-[10px] text-zinc-400 group-hover:text-[#005EB8]">
                        View →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Axis 2: Adjacent Promotion Bands & All Clinical Roles in the Same Region */}
          <div className="space-y-4 pt-2 border-t border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Adjacent Promotion Bands &amp; Clinical Roles in{" "}
                  {entry.regionName}
                </h2>
                <p className="text-xs text-zinc-500">
                  Explore career step-up pay scales and all Agenda for Change
                  bands (Band 2 – Band 9) in {entry.regionName}.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                {sameRegionOtherRoles.length} Roles in {entry.regionName}
              </span>
            </div>

            {adjacentPromotionRoles.length > 0 && (
              <div className="rounded-lg bg-blue-50/50 border border-blue-200/70 p-3.5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#005EB8] block">
                  Direct Promotion &amp; Step Comparison ({entry.regionName})
                </span>
                <div className="flex flex-wrap gap-2">
                  {adjacentPromotionRoles.map((adj) => (
                    <Link
                      key={adj.slug}
                      href={`/calculator/${adj.slug}/`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-white border border-blue-200 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:border-[#005EB8] hover:text-[#005EB8] shadow-2xs transition-colors"
                    >
                      <span className="font-mono text-[#005EB8]">
                        {adj.band}
                      </span>
                      <span>
                        {adj.roleName} ({adj.regionName})
                      </span>
                      <span className="text-zinc-400">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {sameRegionOtherRoles.map((relRole) => (
                <Link
                  key={relRole.slug}
                  href={`/calculator/${relRole.slug}/`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200/70 bg-white px-3 py-2 text-xs hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
                >
                  <span className="truncate pr-2 text-zinc-800">
                    <strong className="font-mono text-zinc-950">
                      {relRole.band}
                    </strong>{" "}
                    {relRole.roleName}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Pre-FAQ Ad Slot */}
        <AdPlaceholder
          slotId="pseo-mid-banner"
          format="leaderboard"
          label="Pre-FAQ High-Intent Search Slot · 728×90"
        />

        {/* Role-Specific High-Intent FAQs (Directly matching FAQ Schema) */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-zinc-950">
            Frequently Asked Questions: {entry.band} {entry.roleName} ({entry.regionName})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 space-y-1.5">
              <h3 className="font-bold text-zinc-900 text-xs">
                What is the hourly rate for an NHS {entry.band} {entry.roleName}?
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                The basic daytime hourly rate in {entry.regionName} is <strong>{formatHourlyRate(baselineResult.hourlyRate)}</strong> at entry, rising to <strong>{formatHourlyRate(topStepResult.hourlyRate)}</strong> at top of band. Night shifts and Saturdays pay <strong>{formatHourlyRate(baselineResult.hourlyRate * (entry.band === "Band 2" || entry.band === "Band 3" ? 1.44 : 1.30))}</strong> (+{entry.band === "Band 2" || entry.band === "Band 3" ? "44%" : "30%"}), while Sundays and Bank Holidays pay <strong>{formatHourlyRate(baselineResult.hourlyRate * (entry.band === "Band 2" || entry.band === "Band 3" ? 1.88 : 1.60))}</strong> (+{entry.band === "Band 2" || entry.band === "Band 3" ? "88%" : "60%"}).
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 space-y-1.5">
              <h3 className="font-bold text-zinc-900 text-xs">
                What is the monthly net take-home pay after tax and pension?
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                A full-time (37.5 hrs/wk) {entry.band} {entry.roleName} takes home approx. <strong>{formatCurrency(baselineResult.netPay.monthly, true)}/month</strong> net at starting step, and <strong>{formatCurrency(topStepResult.netPay.monthly, true)}/month</strong> at top step after standard PAYE Income Tax, Class 1 National Insurance, and {baselineResult.pensionTierLabel} ({(baselineResult.pensionRate * 100).toFixed(1)}%) 2015 CARE Pension deductions.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <FAQSection />
      </div>
    </div>
  );
}
