import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getAllRoleHubs, RoleHubEntry } from "@/lib/pseo-matrix";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

const canonicalUrl = "https://netpayscale.uk/roles/";

export const metadata: Metadata = {
  title:
    "NHS Job Roles & Salary Directory 2026/27: Pay Scales & Take-Home Pay for 41 Clinical Careers",
  description:
    "Official 2026/27 NHS salary and net take-home pay directory across 41 clinical and leadership job roles (Bands 2 to 9): Nurses, Paramedics, Midwives, HCAs, Pharmacists, Physiotherapists, Radiographers, and Matrons.",
  alternates: {
    canonical: canonicalUrl,
    types: {
      "text/markdown": "https://netpayscale.uk/roles.md",
    },
  },
  other: {
    "ai-summary":
      "Official 2026/27 UK NHS Job Role Salary Directory covering 41 clinical and operational job titles across Agenda for Change Bands 2 to 9 (+3.3% uplift). Includes starting and top gross salaries, basic and unsocial hourly rates, 2015 CARE pension deductions, London Weighting (HCAS), and net monthly take-home pay.",
  },
  openGraph: {
    title:
      "NHS Job Roles & Salary Directory 2026/27: 41 Clinical Career Pay Guides",
    description:
      "Compare 2026/27 NHS gross salaries, hourly rates, and exact net monthly take-home pay across 41 clinical and leadership job titles from Band 2 Healthcare Assistant to Band 9 Director of Nursing.",
    url: canonicalUrl,
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://netpayscale.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "NHS Job Roles & Salary Directory 2026/27",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "NHS Job Roles & Salary Directory 2026/27: 41 Clinical Career Pay Guides",
    description:
      "Compare 2026/27 NHS gross salaries, hourly rates, and exact net monthly take-home pay across 41 clinical and leadership job titles.",
    images: ["https://netpayscale.uk/og-image.png"],
  },
};

const CATEGORY_ORDER: RoleHubEntry["category"][] = [
  "Nursing & Midwifery",
  "Paramedics & Emergency Care",
  "Allied Health Professionals (AHPs)",
  "Pharmacy & Advanced Clinical Practice",
  "Clinical Support & Phlebotomy",
  "Psychology, Healthcare Science & Leadership",
];

export default function RolesDirectoryPage() {
  const allRoles = getAllRoleHubs();

  const roleSummaries = allRoles.map((role) => {
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

    const innerLondonEntry = calculateNHSPay({
      band: role.band,
      stepIndex: 0,
      hcasZone: "inner-london",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });

    return {
      role,
      entryCalc,
      topCalc,
      innerLondonEntry,
      stepCount: bandObj ? bandObj.points.length : 1,
    };
  });

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
            name: "NHS Job Roles & Career Pay Directory (2026/27)",
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "NHS Job Roles & Clinical Career Salary Directory (2026/27)",
        url: canonicalUrl,
        description:
          "Complete 2026/27 Agenda for Change salary, hourly rate, and net monthly take-home pay directory for 41 NHS clinical, scientific, and operational job roles.",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: roleSummaries.length,
          itemListElement: roleSummaries.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: `NHS ${item.role.band} ${item.role.roleName} Salary (2026/27)`,
            url: `https://netpayscale.uk/roles/${item.role.roleSlug}/`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How are NHS job roles assigned to Agenda for Change pay bands in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Every NHS Agenda for Change job role is evaluated using the statutory NHS Job Evaluation Scheme (JES), which scores posts across 16 factors including clinical knowledge, registration requirements, patient accountability, and physical/emotional effort. Healthcare Assistants and Phlebotomists sit in Band 2 (£25,272/yr), Nursing Associates and Pharmacy Technicians sit in Band 4 (£28,433–£31,264/yr), newly qualified Nurses, Midwives, Paramedics, and AHPs enter at Band 5 (£32,073–£39,043/yr), Specialists and Junior Sisters sit in Band 6 (£39,959–£48,117/yr), and Ward Managers, Pharmacists, and ACPs sit in Band 7 (£49,408–£56,536/yr).",
            },
          },
          {
            "@type": "Question",
            name: "What is the starting salary and net take-home pay for an NHS Band 5 Nurse or Paramedic in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under the 2026/27 Agenda for Change pay settlement (+3.3%), a newly qualified Band 5 Staff Nurse, Paramedic, Midwife, Physiotherapist, or Radiographer starts on £32,073 gross per year (£16.40/hr) outside London, taking home £2,080/month net after an 8.3% NHS CARE Pension deduction, PAYE Income Tax, and National Insurance. In Inner London (+20% HCAS), starting gross pay is £38,488/year (£2,377/month net).",
            },
          },
          {
            "@type": "Question",
            name: "Which NHS clinical roles automatically progress from Band 5 to Band 6?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Newly Qualified Midwives (under Annex 20) and Newly Qualified Paramedics (NQPs) enter the NHS at Band 5 and complete a structured 12-to-24-month preceptorship portfolio, after which they transition directly into Band 6 (£39,959 to £48,117/year). Hospital Pharmacists typically complete their foundation year and progress from Band 6 into Band 7 Specialist Pharmacist roles (£49,408 to £56,536/year).",
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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-semibold text-zinc-900">
            NHS Job Roles &amp; Career Salary Directory (2026/27)
          </span>
        </nav>

        <AdPlaceholder slotId="roles-hub-top" format="leaderboard" />

        {/* Hero & Position 0 Direct Answer Box */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-zinc-100 pb-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-[#005EB8]">
                <span>
                  2026/27 Agenda for Change (+3.3% Official Uplift) • 41 NHS Careers
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight break-words">
                NHS Job Roles &amp; Clinical Career Salary Directory (2026/27)
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Explore official 2026/27 NHS gross pay scales, basic and unsocial
                hourly rates, 2015 CARE Pension deductions, London Weighting
                (HCAS), and exact monthly net take-home pay for{" "}
                <strong className="text-zinc-900">
                  41 clinical, allied health, scientific, and leadership job titles
                </strong>{" "}
                from Band 2 to Band 9.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="rounded-lg bg-zinc-50 border border-zinc-200/80 p-3.5 min-w-[160px]">
                <span className="text-[11px] font-medium text-zinc-500 block">
                  Band 5 RN / NQP Entry
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-0.5">
                  £2,080
                  <span className="text-xs font-normal text-zinc-500"> /mo</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 block mt-0.5">
                  Gross: £32,073 (£16.40/hr)
                </span>
              </div>
              <div className="rounded-lg bg-zinc-50 border border-zinc-200/80 p-3.5 min-w-[160px]">
                <span className="text-[11px] font-medium text-zinc-500 block">
                  Band 6 Sister / Paramedic
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-mono tabular-nums mt-0.5">
                  £2,489
                  <span className="text-xs font-normal text-zinc-500"> /mo</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 block mt-0.5">
                  Gross: £39,959 (£20.44/hr)
                </span>
              </div>
            </div>
          </div>

          {/* Position 0 Executive Answer Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs text-emerald-950 leading-relaxed shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>
                Quick Answer: 2026/27 NHS Salary &amp; Net Pay by Clinical Job Role
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              Under the <strong>2026/27 NHS Agenda for Change</strong> pay
              structure (+3.3% consolidated award), clinical support staff (
              <strong>Healthcare Assistants, Phlebotomists</strong>) earn{" "}
              <strong>£25,272/yr</strong> (£1,729/mo net);{" "}
              <strong>Nursing Associates &amp; Pharmacy Technicians</strong>{" "}
              (Band 4) earn <strong>£28,433–£31,264/yr</strong> (£1,910–£2,053/mo
              net); newly qualified{" "}
              <strong>
                Nurses, Midwives, Paramedics, Physiotherapists &amp; Radiographers
              </strong>{" "}
              (Band 5) earn <strong>£32,073–£39,043/yr</strong> (£2,080–£2,442/mo
              net); <strong>Junior Sisters &amp; Senior Paramedics</strong> (Band
              6) earn <strong>£39,959–£48,117/yr</strong> (£2,489–£2,913/mo net);
              and <strong>Ward Managers, Pharmacists &amp; ACPs</strong> (Band 7)
              earn <strong>£49,408–£56,536/yr</strong> (£2,980–£3,275/mo net).
            </p>
          </div>

          {/* 1-Tap WhatsApp Share */}
          <ShareBreakdownButton
            shareText="NHS 2026/27 Job Role Salary Directory (41 Clinical Careers): Band 2 HCA £1,729/mo net, Band 4 RNA £1,910/mo, Band 5 Nurse/Paramedic £2,080/mo, Band 6 Sister £2,489/mo, Band 7 Ward Manager £2,980/mo."
            url={canonicalUrl}
            variant="light"
            label="Share NHS 2026/27 Job Role Salary Directory with Colleagues"
          />

          {/* Quick Jump Specialty Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {CATEGORY_ORDER.map((cat) => {
              const anchor = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <a
                  key={cat}
                  href={`#${anchor}`}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-[#005EB8] hover:bg-blue-50/40 hover:text-[#005EB8] transition-colors"
                >
                  {cat}
                </a>
              );
            })}
          </div>
        </section>

        {/* Specialty Career Pathway Cards */}
        {CATEGORY_ORDER.map((category) => {
          const catItems = roleSummaries.filter(
            (item) => item.role.category === category
          );
          const anchor = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

          return (
            <section
              key={category}
              id={anchor}
              className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                    {category} — 2026/27 NHS Salary &amp; Take-Home Pay
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Click any job title below for its complete step progression,
                    Section 2 night/weekend rates, London HCAS table, and
                    interactive calculator.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#005EB8] shrink-0">
                  {catItems.length} Clinical Roles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catItems.map(({ role, entryCalc, topCalc, innerLondonEntry }) => (
                  <Link
                    key={role.roleSlug}
                    href={`/roles/${role.roleSlug}/`}
                    className="group flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/40 p-4 hover:border-[#005EB8] hover:bg-white hover:shadow-sm transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-md bg-[#005EB8] px-2 py-0.5 text-[11px] font-mono font-bold text-white">
                          {role.band}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {formatHourlyRate(entryCalc.hourlyRate)}
                          {topCalc.hourlyRate > entryCalc.hourlyRate
                            ? ` – ${formatHourlyRate(topCalc.hourlyRate)}`
                            : ""}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-zinc-950 group-hover:text-[#005EB8] transition-colors">
                        NHS {role.roleName}
                      </h3>

                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {role.clinicalSummary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-200/70 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="rounded-lg bg-white border border-zinc-200/70 p-2">
                          <span className="text-[10px] font-sans text-zinc-500 block">
                            Entry Net / Mo
                          </span>
                          <span className="font-bold text-emerald-700 text-sm tabular-nums">
                            {formatCurrency(entryCalc.netPay.monthly)}/mo
                          </span>
                          <span className="text-[10px] text-zinc-400 block tabular-nums">
                            {formatCurrency(entryCalc.baseSalary.annual)}/yr
                          </span>
                        </div>
                        <div className="rounded-lg bg-white border border-zinc-200/70 p-2">
                          <span className="text-[10px] font-sans text-zinc-500 block">
                            Top Step Net / Mo
                          </span>
                          <span className="font-bold text-zinc-900 text-sm tabular-nums">
                            {formatCurrency(topCalc.netPay.monthly)}/mo
                          </span>
                          <span className="text-[10px] text-zinc-400 block tabular-nums">
                            {formatCurrency(topCalc.baseSalary.annual)}/yr
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-zinc-500 font-mono">
                          Inner London:{" "}
                          <strong className="text-zinc-800">
                            {formatCurrency(innerLondonEntry.netPay.monthly)}/mo
                          </strong>
                        </span>
                        <span className="font-semibold text-[#005EB8] group-hover:translate-x-0.5 transition-transform">
                          Full Pay Guide →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <AdPlaceholder slotId="roles-hub-mid" format="in-content" />

        {/* Master 41-Role Comparison Table */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">
              Complete 2026/27 NHS Job Role Salary &amp; Net Take-Home Master
              Table (All 41 Roles)
            </h2>
            <p className="text-xs text-zinc-500">
              Calculated for full-time (37.5 hrs/wk) standard national Agenda for
              Change contracts (and Inner London +20% HCAS comparison) after
              PAYE tax, Class 1 NI, and 2015 CARE Pension deductions.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                  <th className="py-2.5 px-3">Job Role</th>
                  <th className="py-2.5 px-3">AfC Band</th>
                  <th className="py-2.5 px-3">Starting Gross</th>
                  <th className="py-2.5 px-3">Top Step Gross</th>
                  <th className="py-2.5 px-3">Basic Hourly</th>
                  <th className="py-2.5 px-3">Starting Net/Mo</th>
                  <th className="py-2.5 px-3">Top Step Net/Mo</th>
                  <th className="py-2.5 px-3 text-right">Inner London Net/Mo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {roleSummaries.map(
                  ({ role, entryCalc, topCalc, innerLondonEntry }) => (
                    <tr key={role.roleSlug} className="hover:bg-zinc-50/70">
                      <td className="py-2.5 px-3 font-sans font-semibold">
                        <Link
                          href={`/roles/${role.roleSlug}/`}
                          className="text-[#005EB8] hover:underline"
                        >
                          {role.roleName}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3">
                        <Link
                          href={`/bands/${role.bandSlug}/`}
                          className="hover:underline font-semibold text-zinc-900"
                        >
                          {role.band}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {formatCurrency(entryCalc.baseSalary.annual)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {formatCurrency(topCalc.baseSalary.annual)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-zinc-600">
                        {formatHourlyRate(entryCalc.hourlyRate)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-bold text-emerald-700">
                        {formatCurrency(entryCalc.netPay.monthly)}/mo
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-bold text-zinc-950">
                        {formatCurrency(topCalc.netPay.monthly)}/mo
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-blue-700 font-semibold">
                        {formatCurrency(innerLondonEntry.netPay.monthly)}/mo
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <AffiliateCards />
      </div>
    </div>
  );
}
