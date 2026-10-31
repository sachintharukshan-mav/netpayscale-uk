import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getAllRoleHubs,
  getRoleHubBySlug,
} from "@/lib/pseo-matrix";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import Calculator from "@/components/Calculator";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import FAQSection from "@/components/FAQSection";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { MagneticBentoContainer } from "@/components/MagneticBento";

interface Props {
  params: Promise<{ roleSlug: string }>;
}

export async function generateStaticParams() {
  const roles = getAllRoleHubs();
  return roles.map((role) => ({
    roleSlug: role.roleSlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roleSlug } = await params;
  const role = getRoleHubBySlug(roleSlug);

  if (!role) {
    return { title: "NHS Role Salary Calculator | NetPayScale UK" };
  }

  const bandObj = nhsData.bands.find((b) => b.band === role.band);
  const maxStepIdx = bandObj ? bandObj.points.length - 1 : 0;

  const entryCalc = calculateNHSPay({
    band: role.band,
    stepIndex: 0,
    hcasZone: "standard",
    nightHoursPerWeek: 0,
    sundayHoursPerWeek: 0,
    pensionOptedOut: false,
    isScottishTax: false,
    studentLoan: "none",
  });

  const topCalc = calculateNHSPay({
    band: role.band,
    stepIndex: maxStepIdx,
    hcasZone: "standard",
    nightHoursPerWeek: 0,
    sundayHoursPerWeek: 0,
    pensionOptedOut: false,
    isScottishTax: false,
    studentLoan: "none",
  });

  const netRange =
    maxStepIdx > 0
      ? `${formatCurrency(entryCalc.netPay.monthly)}–${formatCurrency(topCalc.netPay.monthly)}/mo`
      : `${formatCurrency(entryCalc.netPay.monthly)}/mo`;

  const title = `NHS ${role.roleName} Salary 2026/27 (${role.band}): ${netRange} Net & ${formatHourlyRate(entryCalc.hourlyRate)}`;
  const description = `Official 2026/27 NHS ${role.roleName} (${role.band}) salary UK: ${formatCurrency(entryCalc.baseSalary.annual)} to ${formatCurrency(topCalc.baseSalary.annual)} gross (${formatHourlyRate(entryCalc.hourlyRate)}). Monthly net take-home pay is ${netRange} after PAYE tax, NI, and ${entryCalc.pensionTierLabel} CARE pension. Compare London HCAS, Scotland, and night shift rates.`;
  const canonicalUrl = `https://netpayscale.uk/roles/${role.roleSlug}/`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      types: {
        "text/markdown": `https://netpayscale.uk/roles/${role.roleSlug}.md`,
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

export default async function RolePillarPage({ params }: Props) {
  const { roleSlug } = await params;
  const role = getRoleHubBySlug(roleSlug);

  if (!role) {
    notFound();
  }

  const allRoles = getAllRoleHubs();
  const bandObj = nhsData.bands.find((b) => b.band === role.band);
  const points = bandObj?.points ?? [
    { step: "Entry", yearsExperience: 0, annualSalary: 25272, hourlyRate: 12.92 },
  ];

  const stepModels = points.map((pt, idx) => ({
    stepLabel: pt.step,
    yearsExperience: pt.yearsExperience,
    calc: calculateNHSPay({
      band: role.band,
      stepIndex: idx,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    }),
  }));

  const entryCalc = stepModels[0].calc;
  const topCalc = stepModels[stepModels.length - 1].calc;
  const maxStepIdx = stepModels.length - 1;

  const isBand2Or3 = role.band === "Band 2" || role.band === "Band 3";
  const nightMult = isBand2Or3 ? 1.44 : 1.3;
  const sundayMult = isBand2Or3 ? 1.88 : 1.6;
  const nightPctLabel = isBand2Or3 ? "+44%" : "+30%";
  const sundayPctLabel = isBand2Or3 ? "+88%" : "+60%";

  // Cross-Regional Comparison (National, Fringe, Outer London, Inner London, Scotland)
  const regionalMatrix = [
    {
      label: "National Standard (England, Wales & NI)",
      zone: "standard" as const,
      scotland: false,
      ruleLabel: "0% HCAS (National Spine)",
      sampleSpoke: role.regionalSpokes.find((s) => s.regionId === "manchester"),
    },
    {
      label: "London Fringe (+5% HCAS)",
      zone: "fringe" as const,
      scotland: false,
      ruleLabel: "5% HCAS (Min £1,346 / Max £2,270)",
      sampleSpoke: role.regionalSpokes.find(
        (s) => s.regionId === "london-fringe"
      ),
    },
    {
      label: "Outer London (+15% HCAS)",
      zone: "outer-london" as const,
      scotland: false,
      ruleLabel: "15% HCAS (Min £4,870 / Max £6,137)",
      sampleSpoke: role.regionalSpokes.find(
        (s) => s.regionId === "outer-london"
      ),
    },
    {
      label: "Inner London (+20% HCAS)",
      zone: "inner-london" as const,
      scotland: false,
      ruleLabel: "20% HCAS (Min £5,794 / Max £8,746)",
      sampleSpoke: role.regionalSpokes.find(
        (s) => s.regionId === "inner-london"
      ),
    },
    {
      label: "NHS Scotland (S1257L Devolved Tax)",
      zone: "standard" as const,
      scotland: true,
      ruleLabel: "19%–48% Scottish Income Tax",
      sampleSpoke: role.regionalSpokes.find((s) => s.regionId === "scotland"),
    },
  ].map((rm) => ({
    ...rm,
    entry: calculateNHSPay({
      band: role.band,
      stepIndex: 0,
      hcasZone: rm.zone,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: rm.scotland,
      studentLoan: "none",
    }),
    top: calculateNHSPay({
      band: role.band,
      stepIndex: maxStepIdx,
      hcasZone: rm.zone,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: rm.scotland,
      studentLoan: "none",
    }),
  }));

  // Working Pattern & Shift Matrix
  const workingPatternModels = [
    {
      label: "Full-Time Standard Days (37.5h / 1.0 WTE)",
      hours: 37.5,
      nights: 0,
      sundays: 0,
    },
    {
      label: `Acute Rotational Shifts (37.5h inc. 1 Night/wk ${nightPctLabel} & Sunday ${sundayPctLabel})`,
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
      band: role.band,
      stepIndex: 0,
      hcasZone: "standard",
      contractedHours: wp.hours,
      nightHoursPerWeek: wp.nights,
      sundayHoursPerWeek: wp.sundays,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    }),
  }));

  // Career Ladder Roles (Previous & Next on Clinical Pathway)
  const previousRole = role.previousRoleSlug
    ? getRoleHubBySlug(role.previousRoleSlug)
    : undefined;
  const nextRole = role.nextRoleSlug
    ? getRoleHubBySlug(role.nextRoleSlug)
    : undefined;

  const previousRoleCalc = previousRole
    ? calculateNHSPay({
        band: previousRole.band,
        stepIndex: 0,
        hcasZone: "standard",
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: false,
        isScottishTax: false,
        studentLoan: "none",
      })
    : null;

  const nextRoleCalc = nextRole
    ? calculateNHSPay({
        band: nextRole.band,
        stepIndex: 0,
        hcasZone: "standard",
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: false,
        isScottishTax: false,
        studentLoan: "none",
      })
    : null;

  // Sibling roles in same specialty category or same band
  const sameCategoryRoles = allRoles.filter(
    (r) => r.category === role.category && r.roleSlug !== role.roleSlug
  );
  const sameBandRoles = allRoles.filter(
    (r) => r.band === role.band && r.roleSlug !== role.roleSlug
  );

  const annualPensionAccrualEntry = Math.round(
    entryCalc.baseSalary.annual / 54
  );
  const annualPensionAccrualTop = Math.round(topCalc.baseSalary.annual / 54);
  const innerLondonEntry = regionalMatrix[3].entry;

  const canonicalUrl = `https://netpayscale.uk/roles/${role.roleSlug}/`;

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
            name: "NHS Job Roles Directory",
            item: "https://netpayscale.uk/roles/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `NHS ${role.roleName} Salary (${role.band})`,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "Occupation",
        name: `NHS ${role.roleName} (${role.band})`,
        description: `${role.clinicalSummary} Remunerated on NHS Agenda for Change ${role.band} (${formatCurrency(entryCalc.baseSalary.annual)} to ${formatCurrency(topCalc.baseSalary.annual)} in 2026/27).`,
        qualifications: role.typicalQualification,
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
        occupationLocation: [
          {
            "@type": "Country",
            name: "United Kingdom",
          },
        ],
      },
      {
        "@type": "FinancialProduct",
        name: `NHS ${role.band} ${role.roleName} Salary & Net Pay Calculator (2026/27)`,
        description: role.clinicalSummary,
        provider: {
          "@type": "Organization",
          name: "NHS Agenda for Change",
        },
        annualPercentageRate: 3.3,
        feesAndCommissionsSpecification:
          "No user fees. Free statutory payroll reference.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How much does an NHS ${role.roleName} earn in the UK in 2026/27?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Under the 2026/27 NHS Agenda for Change pay scale (+3.3% uplift), an NHS ${role.roleName} is graded at ${role.band}, starting on a basic gross salary of ${formatCurrency(entryCalc.baseSalary.annual)}/year (${formatHourlyRate(entryCalc.hourlyRate)}) and rising to ${formatCurrency(topCalc.baseSalary.annual)}/year (${formatHourlyRate(topCalc.hourlyRate)}) at the top experience step. After standard UK PAYE Income Tax, Class 1 National Insurance, and ${entryCalc.pensionTierLabel} 2015 CARE Pension deductions, net monthly take-home pay is ${formatCurrency(entryCalc.netPay.monthly)}/month at entry and ${formatCurrency(topCalc.netPay.monthly)}/month at the top step.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the hourly rate and night shift pay for an NHS ${role.roleName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `A full-time (37.5 hrs/wk) NHS ${role.roleName} (${role.band}) earns a basic daytime hourly rate of ${formatHourlyRate(entryCalc.hourlyRate)} at entry (rising to ${formatHourlyRate(topCalc.hourlyRate)} at top of band). Under Agenda for Change Section 2 unsocial hours rules, weekday nights (8pm–6am) and Saturdays pay ${formatHourlyRate(entryCalc.hourlyRate * nightMult)} (${nightPctLabel}), while Sundays and Public Bank Holidays pay ${formatHourlyRate(entryCalc.hourlyRate * sundayMult)} (${sundayPctLabel}).`,
            },
          },
          {
            "@type": "Question",
            name: `How much does an NHS ${role.roleName} earn in London with HCAS Weighting?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `In Inner London (+20% High Cost Area Supplement), an entry-level ${role.band} ${role.roleName} earns ${formatCurrency(innerLondonEntry.grossPay.annual)}/year gross (${formatCurrency(innerLondonEntry.netPay.monthly)}/month net take-home). In Outer London (+15% HCAS), starting gross pay is ${formatCurrency(regionalMatrix[2].entry.grossPay.annual)}/year (${formatCurrency(regionalMatrix[2].entry.netPay.monthly)}/month net), and in the London Fringe (+5% HCAS) it is ${formatCurrency(regionalMatrix[1].entry.grossPay.annual)}/year (${formatCurrency(regionalMatrix[1].entry.netPay.monthly)}/month net).`,
            },
          },
          {
            "@type": "Question",
            name: `What is the NHS Pension contribution and retirement build-up for a ${role.roleName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `An NHS ${role.roleName} (${role.band}) contributes ${entryCalc.pensionTierLabel} (${formatCurrency(entryCalc.pensionContribution.monthly)}/month pre-tax) into the 2015 NHS CARE Pension Scheme at entry, whilst their NHS Trust contributes an additional 23.7% (${formatCurrency(Math.round((entryCalc.baseSalary.annual * 0.237) / 12))}/month). Each year worked at entry adds +${formatCurrency(annualPensionAccrualEntry)}/year (1/54th of pensionable pay) to their guaranteed index-linked retirement income for life.`,
            },
          },
          {
            "@type": "Question",
            name: `What qualifications and career progression apply to an NHS ${role.roleName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Typical entry requirements: ${role.typicalQualification} (${role.registrationBody}). ${role.progressionSummary}`,
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
        {/* Breadcrumb + Quick Band & Role Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-950 transition-colors">
              Home
            </Link>
            <span className="text-zinc-400">/</span>
            <Link
              href="/roles/"
              className="hover:text-[#005EB8] font-medium transition-colors"
            >
              NHS Job Roles
            </Link>
            <span className="text-zinc-400">/</span>
            <Link
              href={`/bands/${role.bandSlug}/`}
              className="hover:text-[#005EB8] font-medium transition-colors"
            >
              {role.band}
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="font-semibold text-zinc-900">
              {role.roleName} Salary (2026/27)
            </span>
          </nav>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/roles/"
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 font-semibold text-zinc-700 hover:border-[#005EB8] hover:text-[#005EB8] transition-colors"
            >
              All 41 NHS Roles
            </Link>
            <Link
              href={`/bands/${role.bandSlug}/`}
              className="rounded-lg bg-[#005EB8] px-2.5 py-1 font-mono font-bold text-white shadow-2xs hover:bg-[#004b93] transition-colors"
            >
              {role.band} Hub →
            </Link>
          </div>
        </div>

        <AdPlaceholder slotId="role-pillar-top" format="leaderboard" />

        {/* Hero & Position 0 Direct Answer Section */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-zinc-100 pb-6">
            <div className="space-y-2.5 max-w-3xl min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500">
                <Link
                  href={`/bands/${role.bandSlug}/`}
                  className="rounded-md bg-[#005EB8] px-2 py-0.5 font-bold text-white hover:bg-[#004b93]"
                >
                  {role.band}
                </Link>
                <span>•</span>
                <span className="font-sans font-semibold text-zinc-700">
                  {role.category}
                </span>
                <span>•</span>
                <span>2026/27 AfC (+3.3%)</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-950 tracking-tight leading-snug break-words">
                NHS {role.roleName} Salary, Hourly Rate &amp; Net Take-Home Pay
                (2026/27)
              </h1>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {role.clinicalSummary}
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="rounded-md bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 text-zinc-700 break-words">
                  <strong>Regulator:</strong> {role.registrationBody}
                </span>
                <span className="rounded-md bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 text-zinc-700 break-words">
                  <strong>Entry Requirement:</strong> {role.typicalQualification}
                </span>
              </div>
            </div>

            {/* Baseline & Top Step Snapshot Card */}
            <MagneticBentoContainer
              variant="card"
              className="w-full lg:w-auto shrink-0 lg:min-w-[260px]"
            >
              <div className="bento-card rounded-xl bg-zinc-50 border border-zinc-200/90 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Starting Net Take-Home
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#005EB8] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                    {role.band}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tabular-nums">
                  {formatCurrency(entryCalc.netPay.monthly, true)}
                  <span className="text-xs font-semibold text-zinc-500">
                    {" "}
                    /mo
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-800 font-bold">
                    {formatHourlyRate(entryCalc.hourlyRate)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                    Night: {formatHourlyRate(entryCalc.hourlyRate * nightMult)}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-zinc-200/70 flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-zinc-600">
                  <span>Top Step Net:</span>
                  <strong className="text-zinc-950">
                    {formatCurrency(topCalc.netPay.monthly, true)}/mo (
                    {formatCurrency(topCalc.baseSalary.annual)}/yr)
                  </strong>
                </div>
              </div>
            </MagneticBentoContainer>
          </div>

          {/* Position 0 Direct Answer Block for Google AI Overviews & Featured Snippets */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs text-emerald-950 leading-relaxed font-sans shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>
                Direct Answer · 2026/27 Official NHS {role.roleName} Pay
                Benchmark
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              In the <strong>2026/27 financial year</strong> (+3.3% Agenda for
              Change uplift), an NHS{" "}
              <strong>
                {role.roleName} ({role.band})
              </strong>{" "}
              earns a starting basic salary of{" "}
              <strong>
                {formatCurrency(entryCalc.baseSalary.annual)}/year
              </strong>{" "}
              ({formatHourlyRate(entryCalc.hourlyRate)}), rising to{" "}
              <strong>{formatCurrency(topCalc.baseSalary.annual)}/year</strong>{" "}
              ({formatHourlyRate(topCalc.hourlyRate)}) at the top experience
              step. After standard UK PAYE Income Tax, Class 1 National
              Insurance, and {entryCalc.pensionTierLabel} 2015 CARE Pension
              deductions, a full-time (37.5h/wk) {role.roleName} takes home{" "}
              <strong>
                {formatCurrency(entryCalc.netPay.monthly, true)}/month
              </strong>{" "}
              net at entry and{" "}
              <strong>
                {formatCurrency(topCalc.netPay.monthly, true)}/month
              </strong>{" "}
              net at the top of {role.band} (or{" "}
              <strong>
                {formatCurrency(innerLondonEntry.netPay.monthly, true)}/month
              </strong>{" "}
              at entry in Inner London with 20% HCAS).
            </p>

            {/* 4-Card Key Figures Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60 text-[11px]">
              <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-100 space-y-0.5">
                <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">
                  Basic Hourly (1.0x)
                </span>
                <span className="font-mono font-black text-zinc-950 text-sm block">
                  {formatHourlyRate(entryCalc.hourlyRate)}
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  to {formatHourlyRate(topCalc.hourlyRate)}
                </span>
              </div>
              <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-100 space-y-0.5">
                <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">
                  Night / Sat ({nightPctLabel})
                </span>
                <span className="font-mono font-black text-blue-700 text-sm block">
                  {formatHourlyRate(entryCalc.hourlyRate * nightMult)}
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  AfC Sec 2 (8pm–6am)
                </span>
              </div>
              <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-100 space-y-0.5">
                <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">
                  Sunday / BH ({sundayPctLabel})
                </span>
                <span className="font-mono font-black text-purple-700 text-sm block">
                  {formatHourlyRate(entryCalc.hourlyRate * sundayMult)}
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  Full weekend uplift
                </span>
              </div>
              <div className="bg-white/90 rounded-lg p-2.5 border border-emerald-100 space-y-0.5">
                <span className="text-zinc-500 block text-[10px] font-bold uppercase tracking-wider">
                  CARE Pension Built
                </span>
                <span className="font-mono font-black text-emerald-700 text-sm block">
                  +{formatCurrency(annualPensionAccrualEntry)}/yr
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  1/54th accrued for life
                </span>
              </div>
            </div>
          </div>

          {/* 1-Tap WhatsApp Share */}
          <ShareBreakdownButton
            shareText={`NHS ${role.roleName} (${role.band}) Salary 2026/27: Starting net take-home is ${formatCurrency(entryCalc.netPay.monthly, true)}/mo (${formatCurrency(entryCalc.baseSalary.annual)} gross, ${formatHourlyRate(entryCalc.hourlyRate)}). Top step: ${formatCurrency(topCalc.netPay.monthly, true)}/mo.`}
            url={canonicalUrl}
            variant="light"
            label={`Share NHS ${role.roleName} Salary Breakdown with Colleagues`}
          />

          {/* Section 1: Step Point Progression Table */}
          <div className="border-t border-zinc-100 pt-5 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h2 className="text-xs sm:text-sm font-bold text-zinc-950">
                  1. 2026/27 NHS {role.roleName} ({role.band}) Pay Step
                  Progression &amp; Net Take-Home Table
                </h2>
                <Link
                  href={`/bands/${role.bandSlug}/`}
                  className="text-[11px] font-semibold text-[#005EB8] hover:underline"
                >
                  View Full {role.band} Spine Guide →
                </Link>
              </div>
              <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                      <th className="py-2.5 px-3">Experience Step</th>
                      <th className="py-2.5 px-3">Annual Gross</th>
                      <th className="py-2.5 px-3">Basic Hourly</th>
                      <th className="py-2.5 px-3">
                        Night Rate ({nightPctLabel})
                      </th>
                      <th className="py-2.5 px-3">NHS Pension</th>
                      <th className="py-2.5 px-3">PAYE Tax &amp; NI</th>
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
                        <td className="py-2.5 px-3 font-semibold text-zinc-950 tabular-nums">
                          {formatCurrency(calc.grossPay.annual)}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums">
                          {formatHourlyRate(calc.hourlyRate)}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums text-blue-700">
                          {formatHourlyRate(calc.hourlyRate * nightMult)}
                        </td>
                        <td className="py-2.5 px-3 text-indigo-700 tabular-nums">
                          {calc.pensionTierLabel} (−
                          {formatCurrency(calc.pensionContribution.monthly)}/mo)
                        </td>
                        <td className="py-2.5 px-3 text-rose-700 tabular-nums">
                          −
                          {formatCurrency(
                            calc.incomeTax.monthly +
                              calc.nationalInsurance.monthly
                          )}
                          /mo
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

            {/* Section 2: Cross-Regional HCAS & Scottish Tax Comparison */}
            <div className="space-y-2">
              <h2 className="text-xs sm:text-sm font-bold text-zinc-950">
                2. NHS {role.roleName} London Weighting (HCAS) &amp; UK Regional
                Net Pay Comparison (2026/27)
              </h2>
              <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                      <th className="py-2.5 px-3">UK Region / Tax Zone</th>
                      <th className="py-2.5 px-3">Statutory Rule</th>
                      <th className="py-2.5 px-3">Entry Gross (Inc. HCAS)</th>
                      <th className="py-2.5 px-3">Entry Net Monthly</th>
                      <th className="py-2.5 px-3">Top Step Net Monthly</th>
                      <th className="py-2.5 px-3 text-right">Regional Guide</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-800">
                    {regionalMatrix.map((rm) => (
                      <tr key={rm.label} className="hover:bg-zinc-50/70">
                        <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                          {rm.label}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-zinc-500">
                          {rm.ruleLabel}
                        </td>
                        <td className="py-2.5 px-3 font-semibold tabular-nums">
                          {formatCurrency(rm.entry.grossPay.annual)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700 tabular-nums">
                          {formatCurrency(rm.entry.netPay.monthly)}/mo
                        </td>
                        <td className="py-2.5 px-3 font-bold text-zinc-950 tabular-nums">
                          {formatCurrency(rm.top.netPay.monthly)}/mo
                        </td>
                        <td className="py-2.5 px-3 text-right font-sans">
                          {rm.sampleSpoke ? (
                            <Link
                              href={`/calculator/${rm.sampleSpoke.slug}/`}
                              className="text-[#005EB8] font-semibold hover:underline"
                            >
                              Open →
                            </Link>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Full-Time, Part-Time Pro-Rata & Rotational Shift Matrix */}
            <div className="space-y-2">
              <h2 className="text-xs sm:text-sm font-bold text-zinc-950">
                3. Full-Time, Part-Time Pro-Rata &amp; Night Shift Take-Home
                Matrix ({role.roleName})
              </h2>
              <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                      <th className="py-2.5 px-3">
                        Contracted Hours &amp; Shift Pattern
                      </th>
                      <th className="py-2.5 px-3">
                        Annual Gross (Inc. Enhancements)
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

        {/* Section 4: Clinical Career Ladder & Promotion Progression */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                Clinical Career Pathway &amp; Promotion Pay Step-Up (
                {role.category})
              </h2>
              <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                {role.progressionSummary}
              </p>
            </div>
            <Link
              href="/promotion-calculator/"
              className="text-xs font-semibold text-[#005EB8] hover:underline shrink-0"
            >
              Test Promotion Calculator →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Prior Step */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 flex flex-col justify-between">
              {previousRole && previousRoleCalc ? (
                <>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                      Previous Career Step ({previousRole.band})
                    </span>
                    <Link
                      href={`/roles/${previousRole.roleSlug}/`}
                      className="text-sm font-bold text-zinc-900 hover:text-[#005EB8] block"
                    >
                      {previousRole.roleName}
                    </Link>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Starting Gross:{" "}
                      {formatCurrency(previousRoleCalc.baseSalary.annual)}/yr (
                      {formatHourlyRate(previousRoleCalc.hourlyRate)})
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-zinc-200/70 flex items-center justify-between">
                    <span className="font-mono font-bold text-zinc-800">
                      {formatCurrency(previousRoleCalc.netPay.monthly)}/mo net
                    </span>
                    <Link
                      href={`/roles/${previousRole.roleSlug}/`}
                      className="text-[11px] font-semibold text-[#005EB8] hover:underline"
                    >
                      View Role →
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                     Direct NHS Entry Pathway
                  </span>
                  <span className="text-sm font-bold text-zinc-900 block">
                    Foundation Clinical Entry ({role.band})
                  </span>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Direct entry into NHS employment via{" "}
                    {role.typicalQualification}.
                  </p>
                </div>
              )}
            </div>

            {/* Current Role */}
            <div className="rounded-xl border-2 border-[#005EB8] bg-blue-50/30 p-4 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005EB8] block">
                  Current Role • {role.band}
                </span>
                <span className="text-sm font-extrabold text-zinc-950 block">
                  NHS {role.roleName}
                </span>
                <p className="text-[11px] text-zinc-600 font-mono">
                  Gross: {formatCurrency(entryCalc.baseSalary.annual)} –{" "}
                  {formatCurrency(topCalc.baseSalary.annual)}/yr
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-blue-200/70 flex items-center justify-between font-mono">
                <span className="font-bold text-emerald-700">
                  {formatCurrency(entryCalc.netPay.monthly)} –{" "}
                  {formatCurrency(topCalc.netPay.monthly)}/mo
                </span>
                <span className="text-[10px] text-[#005EB8] font-bold">
                  +{formatCurrency(annualPensionAccrualEntry)}–
                  {formatCurrency(annualPensionAccrualTop)}/yr pension
                </span>
              </div>
            </div>

            {/* Next Promotion Step */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 flex flex-col justify-between">
              {nextRole && nextRoleCalc ? (
                <>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Next Promotion Step ({nextRole.band})
                    </span>
                    <Link
                      href={`/roles/${nextRole.roleSlug}/`}
                      className="text-sm font-bold text-zinc-950 hover:text-[#005EB8] block"
                    >
                      {nextRole.roleName}
                    </Link>
                    <p className="text-[11px] text-zinc-600 font-mono">
                      Starting Gross:{" "}
                      {formatCurrency(nextRoleCalc.baseSalary.annual)}/yr (+
                      {formatCurrency(
                        nextRoleCalc.baseSalary.annual -
                          entryCalc.baseSalary.annual
                      )}
                      /yr vs {role.band} Entry)
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-emerald-200/70 flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-800">
                      {formatCurrency(nextRoleCalc.netPay.monthly)}/mo net (+
                      {formatCurrency(
                        nextRoleCalc.netPay.monthly - entryCalc.netPay.monthly
                      )}
                      /mo)
                    </span>
                    <Link
                      href={`/roles/${nextRole.roleSlug}/`}
                      className="text-[11px] font-semibold text-[#005EB8] hover:underline"
                    >
                      View Promotion →
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Agenda for Change Ceiling
                  </span>
                  <span className="text-sm font-bold text-zinc-950 block">
                    Very Senior Manager (VSM) / Executive Board
                  </span>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Band 9 is the top of the Agenda for Change spine. Further
                    progression transitions onto NHS Executive VSM contracts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Interactive Calculator Pre-Configured for this Role */}
        <section id="calculator" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-200/80 pb-2">
            <h2 className="text-lg font-bold text-zinc-950">
              Interactive NHS {role.roleName} Shift, Overtime &amp; Take-Home
              Calculator
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              Pre-loaded: {role.band} • {role.roleName} (2026/27)
            </span>
          </div>

          <Calculator
            key={role.roleSlug}
            initialBand={role.band}
            initialStepIndex={0}
            initialHcasZone="standard"
            initialRoleTitle={role.roleName}
            initialTaxCode="1257L"
          />
        </section>

        <AdPlaceholder slotId="role-pillar-mid" format="in-content" />

        {/* Section 5: All UK Regional Salary Calculators for this Role */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-8">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-100 pb-2.5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                  Compare {role.band} {role.roleName} Pay Across{" "}
                  {role.regionalSpokes.length} UK Cities &amp; NHS Regions
                </h2>
                <p className="text-xs text-zinc-500">
                  Select a location below for local NHS Hospital Trust HCAS
                  allowances, Scottish tax bands, and regional take-home tables.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                {role.regionalSpokes.length} Regional Calculators
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {role.regionalSpokes.map((spoke) => {
                const spokeCalc = calculateNHSPay({
                  band: spoke.band,
                  stepIndex: 0,
                  hcasZone: spoke.hcasZone,
                  nightHoursPerWeek: 0,
                  sundayHoursPerWeek: 0,
                  pensionOptedOut: false,
                  isScottishTax: spoke.regionId === "scotland",
                  studentLoan: "none",
                });
                return (
                  <Link
                    key={spoke.slug}
                    href={`/calculator/${spoke.slug}/`}
                    className="group flex items-center justify-between rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-2.5 text-xs transition-all hover:border-[#005EB8] hover:bg-white hover:shadow-2xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-zinc-900 group-hover:text-[#005EB8] block truncate">
                        {spoke.roleName} in {spoke.regionName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {spoke.band} • Gross{" "}
                        {formatCurrency(spokeCalc.grossPay.annual)}/yr
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-emerald-700 tabular-nums block">
                        {formatCurrency(spokeCalc.netPay.monthly)}/mo
                      </span>
                      <span className="text-[10px] text-zinc-400 group-hover:text-[#005EB8]">
                        Regional Guide →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sibling Roles in Same Specialty & Same Pay Band */}
          <div className="space-y-4 pt-3 border-t border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h2 className="text-base font-bold text-zinc-950">
                  Related {role.category} &amp; {role.band} Career Guides
                </h2>
                <p className="text-xs text-zinc-500">
                  Compare pay scales across sibling clinical specialties and
                  adjacent NHS career roles.
                </p>
              </div>
              <Link
                href="/roles/"
                className="text-xs font-semibold text-[#005EB8] hover:underline"
              >
                Browse All 41 Roles →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {[...sameCategoryRoles, ...sameBandRoles]
                .filter(
                  (v, i, a) =>
                    a.findIndex((t) => t.roleSlug === v.roleSlug) === i
                )
                .map((rel) => {
                  const relEntryCalc = calculateNHSPay({
                    band: rel.band,
                    stepIndex: 0,
                    hcasZone: "standard",
                    nightHoursPerWeek: 0,
                    sundayHoursPerWeek: 0,
                    pensionOptedOut: false,
                    isScottishTax: false,
                    studentLoan: "none",
                  });
                  return (
                    <Link
                      key={rel.roleSlug}
                      href={`/roles/${rel.roleSlug}/`}
                      className="group flex items-center justify-between rounded-lg border border-zinc-200/70 bg-white px-3 py-2.5 text-xs hover:border-[#005EB8] hover:bg-blue-50/20 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-zinc-900 group-hover:text-[#005EB8] block truncate">
                          {rel.roleName}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {rel.band} •{" "}
                          {formatCurrency(relEntryCalc.netPay.monthly)}/mo net
                        </span>
                      </div>
                      <span className="font-mono text-zinc-400 group-hover:text-[#005EB8] shrink-0">
                        →
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>

        {/* Role-Specific High-Intent FAQs */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-zinc-950">
            Frequently Asked Questions: NHS {role.roleName} Salary (2026/27)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 space-y-1.5">
              <h3 className="font-bold text-zinc-900 text-xs">
                How much does an NHS {role.roleName} earn per month after tax in
                2026/27?
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                A full-time (37.5 hrs/wk) NHS {role.roleName} ({role.band})
                takes home{" "}
                <strong>{formatCurrency(entryCalc.netPay.monthly, true)}/month</strong>{" "}
                net at the starting spine point (from a gross salary of{" "}
                {formatCurrency(entryCalc.baseSalary.annual)}/yr), rising to{" "}
                <strong>{formatCurrency(topCalc.netPay.monthly, true)}/month</strong>{" "}
                net at the top step ({formatCurrency(topCalc.baseSalary.annual)}
                /yr) after PAYE Income Tax, Class 1 NI, and{" "}
                {entryCalc.pensionTierLabel} NHS CARE Pension deductions.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 space-y-1.5">
              <h3 className="font-bold text-zinc-900 text-xs">
                What is the hourly rate and weekend/night rate for an NHS{" "}
                {role.roleName}?
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                The basic daytime hourly rate is{" "}
                <strong>{formatHourlyRate(entryCalc.hourlyRate)}</strong> at
                entry (up to{" "}
                <strong>{formatHourlyRate(topCalc.hourlyRate)}</strong> at top
                step). Under Agenda for Change Section 2, weekday nights and
                Saturdays pay{" "}
                <strong>
                  {formatHourlyRate(entryCalc.hourlyRate * nightMult)}
                </strong>{" "}
                ({nightPctLabel}), while Sundays and Bank Holidays pay{" "}
                <strong>
                  {formatHourlyRate(entryCalc.hourlyRate * sundayMult)}
                </strong>{" "}
                ({sundayPctLabel}).
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 space-y-1.5">
              <h3 className="font-bold text-zinc-900 text-xs">
                How much does an NHS {role.roleName} earn in Inner &amp; Outer
                London?
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                In Inner London (+20% HCAS), starting pay for a {role.band}{" "}
                {role.roleName} is{" "}
                <strong>
                  {formatCurrency(innerLondonEntry.grossPay.annual)}/year gross
                </strong>{" "}
                (<strong>{formatCurrency(innerLondonEntry.netPay.monthly)}/month net</strong>
                ). In Outer London (+15% HCAS), starting pay is{" "}
                <strong>
                  {formatCurrency(regionalMatrix[2].entry.grossPay.annual)}/year
                  gross
                </strong>{" "}
                (
                <strong>
                  {formatCurrency(regionalMatrix[2].entry.netPay.monthly)}/month
                  net
                </strong>
                ).
              </p>
            </div>

            <div className="rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 space-y-1.5">
              <h3 className="font-bold text-zinc-900 text-xs">
                How much NHS Pension does a {role.roleName} build each year?
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                Under the 2015 CARE Scheme (1/54th annual accrual), each
                full-time year worked as a {role.band} {role.roleName} adds{" "}
                <strong>+{formatCurrency(annualPensionAccrualEntry)}/year</strong>{" "}
                at entry (up to{" "}
                <strong>+{formatCurrency(annualPensionAccrualTop)}/year</strong>{" "}
                at top step) to your guaranteed, CPI+1.5% inflation-revalued NHS
                retirement pension for life.
              </p>
            </div>
          </div>
        </section>

        <AffiliateCards />
        <FAQSection />
      </div>
    </div>
  );
}
