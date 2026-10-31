import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import { getAllPseoEntries } from "@/lib/pseo-matrix";
import Calculator from "@/components/Calculator";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import EeatVerificationBlock from "@/components/EeatVerificationBlock";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

export const metadata: Metadata = {
  title:
    "NHS Scotland Pay Calculator 2026/27: 35-Hour Week, S1257L Tax & Take-Home Pay",
  description:
    "Calculate your 2026/27 NHS Scotland net take-home pay across Bands 2 to 9. Includes Scottish 6-band Income Tax (S1257L: 19%–48%), the 35-hour Scottish AfC working week (1,825 hrs/yr), and Scotland vs England take-home comparisons.",
  alternates: {
    canonical: "https://netpayscale.uk/scotland-pay-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/scotland-pay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "In 2026/27, NHS Scotland Agenda for Change staff work a reduced 35.0-hour full-time week (1,825 hours/year vs 1,955.36 hours/year in NHS England) and pay Scottish devolved 6-band Income Tax (19%, 20%, 21%, 42%, 45%, 48% under tax code S1257L). A starting Band 5 Staff Nurse in Scotland (£32,073 gross) takes home £2,060/month net (£17.57/hr effective 35h gross rate).",
  },
  openGraph: {
    title:
      "NHS Scotland Pay Calculator 2026/27: 35-Hour Week & S1257L Net Take-Home",
    description:
      "Side-by-side 2026/27 NHS Scotland vs NHS England salary, 35-hour week hourly rates, and Scottish S1257L 6-band Income Tax take-home calculator.",
    url: "https://netpayscale.uk/scotland-pay-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

export default function ScotlandPayCalculatorPage() {
  const bandComparisonRows = nhsData.bands.map((bandObj) => {
    const entryPt = bandObj.points[0];
    const topPt = bandObj.points[bandObj.points.length - 1];
    const maxIdx = bandObj.points.length - 1;

    const scotEntry = calculateNHSPay({
      band: bandObj.band,
      stepIndex: 0,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      taxCode: "S1257L",
      isScottishTax: true,
      studentLoan: "none",
    });

    const scotTop = calculateNHSPay({
      band: bandObj.band,
      stepIndex: maxIdx,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      taxCode: "S1257L",
      isScottishTax: true,
      studentLoan: "none",
    });

    const engEntry = calculateNHSPay({
      band: bandObj.band,
      stepIndex: 0,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      taxCode: "1257L",
      isScottishTax: false,
      studentLoan: "none",
    });

    const engTop = calculateNHSPay({
      band: bandObj.band,
      stepIndex: maxIdx,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      taxCode: "1257L",
      isScottishTax: false,
      studentLoan: "none",
    });

    // NHS Scotland 35.0-hour standard working week (1,825.00 hrs/yr vs 1,955.36 hrs/yr in England)
    const scotHourly35Entry = entryPt.annualSalary / 1825;
    const scotHourly35Top = topPt.annualSalary / 1825;

    return {
      band: bandObj.band,
      slug: bandObj.slug,
      entryGross: entryPt.annualSalary,
      topGross: topPt.annualSalary,
      engHourlyEntry: entryPt.hourlyRate,
      scotHourly35Entry,
      scotHourly35Top,
      scotEntryNetMonthly: scotEntry.netPay.monthly,
      scotTopNetMonthly: scotTop.netPay.monthly,
      engEntryNetMonthly: engEntry.netPay.monthly,
      engTopNetMonthly: engTop.netPay.monthly,
      entryMonthlyTaxDiff: Math.round(
        scotEntry.netPay.monthly - engEntry.netPay.monthly
      ),
      topMonthlyTaxDiff: Math.round(
        scotTop.netPay.monthly - engTop.netPay.monthly
      ),
      pensionTier: scotEntry.pensionTierLabel,
    };
  });

  const b5Row = bandComparisonRows.find((r) => r.band === "Band 5")!;
  const b6Row = bandComparisonRows.find((r) => r.band === "Band 6")!;
  const b7Row = bandComparisonRows.find((r) => r.band === "Band 7")!;

  const scotlandRoleLinks = getAllPseoEntries().filter(
    (e) => e.regionId === "scotland"
  );

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
            name: "NHS Scotland Pay Calculator (2026/27)",
            item: "https://netpayscale.uk/scotland-pay-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Scotland Pay & 35-Hour Week Calculator 2026/27",
        url: "https://netpayscale.uk/scotland-pay-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        description:
          "Official 2026/27 NHS Scotland Agenda for Change salary, 35-hour week hourly rate, and S1257L Scottish 6-band Income Tax calculator.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does the NHS Scotland 35-hour working week affect hourly pay?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NHS Scotland reduced the full-time Agenda for Change working week from 37.5 hours to 35.0 hours per week (1,825 hours/year vs 1,955.36 hours/year in England) with zero reduction in annual basic salary. This increases effective hourly pay by +7.14% and gives full-time Scottish NHS staff 130.36 hours (3.7 weeks) of extra non-working time per year.",
            },
          },
          {
            "@type": "Question",
            name: "How much Scottish Income Tax (S1257L) do NHS Scotland staff pay in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Under tax code S1257L, Scottish taxpayers have a £12,570 Personal Allowance followed by six devolved tax brackets: Starter 19% (£12,571–£14,876), Basic 20% (£14,877–£26,561), Intermediate 21% (£26,562–£43,662), Higher 42% (£43,663–£75,000), Advanced 45% (£75,001–£125,140), and Top 48% (above £125,140). A starting Band 5 nurse in Scotland takes home ${formatCurrency(b5Row.scotEntryNetMonthly)}/month net compared to ${formatCurrency(b5Row.engEntryNetMonthly)}/month in England.`,
            },
          },
          {
            "@type": "Question",
            name: "Does NHS pension relief work at 42% and 45% for higher bands in Scotland?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Because NHS Pension contributions are deducted under a Net-Pay arrangement before PAYE Income Tax is calculated, Band 6, Band 7, and Band 8 staff in Scotland automatically receive marginal tax relief at their highest Scottish bracket (21% Intermediate, 42% Higher, or 45% Advanced rate).",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">
            NHS Scotland Pay Calculator (2026/27)
          </span>
        </nav>

        <AdPlaceholder slotId="scotland-top-banner" format="leaderboard" />

        {/* Hero & Direct Answer */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3 max-w-4xl">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-mono font-semibold text-[#005EB8] border border-blue-200">
              NHS Scotland 2026/27 • S1257L 6-Band Tax • 35.0-Hour Standard Week
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              NHS Scotland Pay Calculator 2026/27: 35-Hour Week &amp; S1257L Net
              Take-Home
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Model your exact <strong>NHS Scotland</strong> monthly take-home
              pay across <strong>NHS Greater Glasgow &amp; Clyde</strong>,{" "}
              <strong>NHS Lothian</strong>, <strong>NHS Grampian</strong>,{" "}
              <strong>NHS Tayside</strong>, and all 14 Scottish territorial
              Health Boards. Compare the{" "}
              <strong>35.0-hour Scottish AfC working week (1,825 hrs/yr)</strong>{" "}
              and <strong>Scottish 6-Band Income Tax (`S1257L`)</strong> directly
              against NHS England.
            </p>
          </div>

          {/* Position 0 Direct Answer Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>
                Direct Answer · NHS Scotland vs. NHS England 2026/27 Pay Summary
              </span>
            </div>
            <p>
              In <strong>2026/27</strong>, full-time Agenda for Change staff in{" "}
              <strong>NHS Scotland</strong> work a contracted{" "}
              <strong>35.0-hour week (1,825 hours/year)</strong> compared to{" "}
              <strong>37.5 hours/week (1,955.36 hours/year)</strong> in NHS
              England—delivering a <strong>+7.14% higher hourly rate</strong>{" "}
              and <strong>130.36 hours (3.7 weeks) of extra free time</strong>{" "}
              every year. On a starting <strong>Band 5 salary</strong> (
              {formatCurrency(b5Row.entryGross)}), a Scottish nurse takes home{" "}
              <strong>{formatCurrency(b5Row.scotEntryNetMonthly)}/month net</strong>{" "}
              ({formatHourlyRate(b5Row.scotHourly35Entry)} on a 35h week) versus{" "}
              <strong>{formatCurrency(b5Row.engEntryNetMonthly)}/month net</strong>{" "}
              ({formatHourlyRate(b5Row.engHourlyEntry)} on a 37.5h week) in
              England under Scottish tax code <strong>S1257L</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-emerald-200/60 text-xs">
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Scottish Full-Time Week
                </span>
                <span className="font-mono font-black text-zinc-950 text-base block">
                  35.0 hrs/wk
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  1,825 hrs/yr (−2.5h/wk vs Eng)
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 Entry Net (Scot)
                </span>
                <span className="font-mono font-black text-emerald-700 text-base block">
                  {formatCurrency(b5Row.scotEntryNetMonthly)}/mo
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  35h Rate: {formatHourlyRate(b5Row.scotHourly35Entry)}
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 6 Entry Net (Scot)
                </span>
                <span className="font-mono font-black text-[#005EB8] text-base block">
                  {formatCurrency(b6Row.scotEntryNetMonthly)}/mo
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  35h Rate: {formatHourlyRate(b6Row.scotHourly35Entry)}
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 7 Entry Net (Scot)
                </span>
                <span className="font-mono font-black text-purple-700 text-base block">
                  {formatCurrency(b7Row.scotEntryNetMonthly)}/mo
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  35h Rate: {formatHourlyRate(b7Row.scotHourly35Entry)}
                </span>
              </div>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={`NHS Scotland 2026/27 Pay & 35-Hour Week Calculator: Band 5 starts at ${formatCurrency(b5Row.scotEntryNetMonthly)}/mo net (${formatHourlyRate(b5Row.scotHourly35Entry)} on a 35h week), Band 6 at ${formatCurrency(b6Row.scotEntryNetMonthly)}/mo net. Compare S1257L tax & bands:`}
            url="https://netpayscale.uk/scotland-pay-calculator/"
            variant="light"
            label="Share NHS Scotland Pay Calculator with Colleagues"
          />

          {/* Table 1: NHS Scotland vs NHS England Full Band Comparison */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">
              1. NHS Scotland (S1257L, 35h/wk) vs. NHS England (1257L, 37.5h/wk)
              Net Take-Home Table (2026/27)
            </h2>
            <p className="text-xs text-zinc-500">
              Comparison of monthly net take-home pay (after PAYE Income Tax,
              National Insurance, and CARE Pension) and effective hourly rates
              across Bands 2 to 9.
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200/80">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                    <th className="py-2.5 px-3">Pay Band</th>
                    <th className="py-2.5 px-3">Annual Gross (Entry → Top)</th>
                    <th className="py-2.5 px-3">Scotland 35h Rate</th>
                    <th className="py-2.5 px-3">England 37.5h Rate</th>
                    <th className="py-2.5 px-3">Scotland Net/mo (S1257L)</th>
                    <th className="py-2.5 px-3">England Net/mo (1257L)</th>
                    <th className="py-2.5 px-3 text-right">
                      S1257L Tax Difference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {bandComparisonRows.map((row) => (
                    <tr key={row.band} className="hover:bg-zinc-50/70">
                      <td className="py-2.5 px-3 font-sans font-bold text-zinc-950">
                        <Link
                          href={`/bands/${row.slug}/`}
                          className="text-[#005EB8] hover:underline"
                        >
                          {row.band}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {formatCurrency(row.entryGross)}
                        {row.topGross !== row.entryGross
                          ? ` → ${formatCurrency(row.topGross)}`
                          : ""}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-bold text-emerald-700">
                        {formatHourlyRate(row.scotHourly35Entry)}
                        {row.scotHourly35Top !== row.scotHourly35Entry
                          ? ` → ${formatHourlyRate(row.scotHourly35Top)}`
                          : ""}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-zinc-600">
                        {formatHourlyRate(row.engHourlyEntry)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-bold text-zinc-950">
                        {formatCurrency(row.scotEntryNetMonthly)}
                        {row.scotTopNetMonthly !== row.scotEntryNetMonthly
                          ? ` → ${formatCurrency(row.scotTopNetMonthly)}/mo`
                          : "/mo"}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-zinc-600">
                        {formatCurrency(row.engEntryNetMonthly)}
                        {row.engTopNetMonthly !== row.engEntryNetMonthly
                          ? ` → ${formatCurrency(row.engTopNetMonthly)}/mo`
                          : "/mo"}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-rose-700">
                        {row.entryMonthlyTaxDiff >= 0
                          ? `+${formatCurrency(row.entryMonthlyTaxDiff)}/mo`
                          : `${formatCurrency(row.entryMonthlyTaxDiff)}/mo`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Scottish 6-Band Devolved Income Tax Structure (S1257L) */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">
              2. Scottish Parliament 6-Band Income Tax Brackets (`S1257L` —
              2026/27)
            </h2>
            <p className="text-xs text-zinc-500">
              How Revenue Scotland / HMRC calculates PAYE Income Tax for NHS
              Scotland employees compared to rest-of-UK (`1257L`).
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200/80">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                    <th className="py-2.5 px-3">Scottish Tax Band</th>
                    <th className="py-2.5 px-3">2026/27 Taxable Income Band</th>
                    <th className="py-2.5 px-3">Scottish Rate (S1257L)</th>
                    <th className="py-2.5 px-3">England/Wales Equivalent</th>
                    <th className="py-2.5 px-3 text-right">
                      Primary NHS Bands Affected
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                      Personal Allowance
                    </td>
                    <td className="py-2.5 px-3">Up to £12,570</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">0%</td>
                    <td className="py-2.5 px-3">0% (Up to £12,570)</td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      All Bands (Tapered &gt;£100k)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                      Starter Rate
                    </td>
                    <td className="py-2.5 px-3">£12,571 – £14,876</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">
                      19%
                    </td>
                    <td className="py-2.5 px-3">20% Basic Rate</td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      Part-Time &amp; Bands 2–3
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                      Scottish Basic Rate
                    </td>
                    <td className="py-2.5 px-3">£14,877 – £26,561</td>
                    <td className="py-2.5 px-3 font-bold text-zinc-900">20%</td>
                    <td className="py-2.5 px-3">20% Basic Rate</td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      Bands 2, 3 &amp; 4
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                      Intermediate Rate
                    </td>
                    <td className="py-2.5 px-3">£26,562 – £43,662</td>
                    <td className="py-2.5 px-3 font-bold text-amber-700">
                      21%
                    </td>
                    <td className="py-2.5 px-3">20% Basic Rate</td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      Bands 5 &amp; 6
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                      Higher Rate
                    </td>
                    <td className="py-2.5 px-3">£43,663 – £75,000</td>
                    <td className="py-2.5 px-3 font-bold text-rose-700">42%</td>
                    <td className="py-2.5 px-3">40% Above £50,270</td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      Band 6 Top, Band 7 &amp; Band 8a/8b
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                      Advanced Rate
                    </td>
                    <td className="py-2.5 px-3">£75,001 – £125,140</td>
                    <td className="py-2.5 px-3 font-bold text-rose-700">45%</td>
                    <td className="py-2.5 px-3">40% Higher Rate</td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      Bands 8c, 8d &amp; Band 9
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                      Top Rate
                    </td>
                    <td className="py-2.5 px-3">Over £125,140</td>
                    <td className="py-2.5 px-3 font-bold text-rose-800">48%</td>
                    <td className="py-2.5 px-3">45% Additional Rate</td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      Band 9 Top Step / Medical
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Pre-Loaded with S1257L */}
        <section id="calculator" className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-zinc-200/80 pb-2">
            <h2 className="text-lg font-bold text-zinc-950">
              Interactive NHS Scotland Shift &amp; Deduction Calculator (`S1257L`)
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              Pre-configured: Tax Code S1257L (Scottish PAYE)
            </span>
          </div>
          <Calculator
            initialBand="Band 5"
            initialStepIndex={0}
            initialTaxCode="S1257L"
          />
        </section>

        {/* Major Scottish Health Boards & Role Guides */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">
              Major NHS Scotland Territorial Health Boards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                href="/trusts/nhs-greater-glasgow-clyde/"
                className="group rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 hover:border-[#005EB8] hover:bg-white transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-950 group-hover:text-[#005EB8]">
                    NHS Greater Glasgow and Clyde (NHSGGC)
                  </span>
                  <span className="text-[11px] font-mono text-[#005EB8] font-bold">
                    39,000+ Staff →
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  Queen Elizabeth University Hospital (QEUH), Glasgow Royal
                  Infirmary, Royal Hospital for Children, Stobhill Hospital.
                </p>
              </Link>
              <Link
                href="/trusts/nhs-lothian/"
                className="group rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 hover:border-[#005EB8] hover:bg-white transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-950 group-hover:text-[#005EB8]">
                    NHS Lothian Health Board (Edinburgh)
                  </span>
                  <span className="text-[11px] font-mono text-[#005EB8] font-bold">
                    26,000+ Staff →
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  Royal Infirmary of Edinburgh (Little France), Western General
                  Hospital, St John&apos;s Hospital (Livingston).
                </p>
              </Link>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">
              All {scotlandRoleLinks.length} NHS Scotland Clinical Role Salary
              Guides (2026/27)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {scotlandRoleLinks.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/calculator/${entry.slug}/`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-3 py-2 text-xs hover:border-[#005EB8] hover:bg-white transition-colors"
                >
                  <span className="truncate pr-2 text-zinc-800">
                    <strong className="font-mono text-zinc-950">
                      {entry.band}
                    </strong>{" "}
                    {entry.roleName}
                  </span>
                  <span className="font-mono text-[10px] text-[#005EB8] shrink-0">
                    Scotland →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AffiliateCards />
        <EeatVerificationBlock
          contextLabel="NHS Scotland 2026/27 Pay, 35-Hour Week & S1257L Tax"
          isScotland={true}
        />
      </div>
    </div>
  );
}
