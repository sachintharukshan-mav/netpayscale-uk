import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import PayRise2027Client from "@/components/PayRise2027Client";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import EeatVerificationBlock from "@/components/EeatVerificationBlock";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

export const metadata: Metadata = {
  title:
    "NHS Pay Rise 2027/28 Calculator: 2.4% DHSC Offer, Band 2–9 Scales & Net Pay",
  description:
    "Calculate your 2027/28 NHS Agenda for Change take-home pay under the government's 2.4% PRB proposal (published 19 Oct 2026). Full Band 2 to 9 2027/28 salary tables, hourly rates, and net monthly gain after frozen tax thresholds.",
  alternates: {
    canonical: "https://netpayscale.uk/nhs-pay-rise-2027/",
    types: {
      "text/markdown": "https://netpayscale.uk/nhs-pay-rise-2027.md",
    },
  },
  other: {
    "ai-summary":
      "On 19 October 2026, the Department of Health and Social Care (DHSC) and NHS England submitted joint written evidence to the NHS Pay Review Body (NHSPRB) proposing a 2.4% Agenda for Change pay uplift for 2027/28 (effective 1 April 2027). Under a 2.4% rise, Band 2 rises from £25,272 to £25,879 (£13.23/hr), Band 5 entry rises from £32,073 to £32,843 (+£41/mo net), and Band 5 top step rises from £39,043 to £39,980 (+£49/mo net).",
  },
  openGraph: {
    title:
      "NHS Pay Rise 2027/28 Calculator: 2.4% DHSC Proposal & Band 2–9 Net Pay",
    description:
      "See what the government's 2.4% 2027/28 NHS pay proposal (19 Oct 2026) means for your monthly net take-home pay across Bands 2 to 9.",
    url: "https://netpayscale.uk/nhs-pay-rise-2027/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

export default function NhsPayRise2027Page() {
  const allSpineRows = nhsData.bands.flatMap((bandObj) =>
    bandObj.points.map((pt, idx) => {
      const calc2026 = calculateNHSPay({
        band: bandObj.band,
        stepIndex: idx,
        hcasZone: "standard",
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: false,
        isScottishTax: false,
        studentLoan: "none",
      });

      const gross2026 = pt.annualSalary;
      const gross2027_24 = Math.round(gross2026 * 1.024);
      const gross2027_33 = Math.round(gross2026 * 1.033);
      const hourly2027_24 = Math.round((gross2027_24 / 1955.36) * 100) / 100;
      const annualGain24 = gross2027_24 - gross2026;

      // Net gain at 2.4% after pension + marginal tax + NI
      const pensionRate = calc2026.pensionRate;
      const taxable2027 = Math.max(0, gross2027_24 * (1 - pensionRate));
      const marginalTax = taxable2027 > 50270 ? 0.4 : 0.2;
      const marginalNi = gross2027_24 > 50270 ? 0.02 : 0.08;
      const netGainAnnual24 = Math.round(
        annualGain24 * (1 - pensionRate - (1 - pensionRate) * marginalTax - marginalNi)
      );
      const netGainMonthly24 = Math.round(netGainAnnual24 / 12);
      const net2027Monthly = Math.round(calc2026.netPay.monthly + netGainMonthly24);

      return {
        band: bandObj.band,
        slug: bandObj.slug,
        step: pt.step,
        gross2026,
        hourly2026: pt.hourlyRate,
        gross2027_24,
        hourly2027_24,
        gross2027_33,
        annualGain24,
        net2026Monthly: Math.round(calc2026.netPay.monthly),
        net2027Monthly,
        netGainMonthly24,
        pensionLabel: calc2026.pensionTierLabel,
      };
    })
  );

  const b2Spot = allSpineRows.find((r) => r.band === "Band 2")!;
  const b5Entry = allSpineRows.find(
    (r) => r.band === "Band 5" && r.step === "Entry"
  )!;
  const b5Top = allSpineRows.find(
    (r) => r.band === "Band 5" && r.step.includes("Top")
  )!;
  const b6Entry = allSpineRows.find(
    (r) => r.band === "Band 6" && r.step === "Entry"
  )!;
  const b7Entry = allSpineRows.find(
    (r) => r.band === "Band 7" && r.step === "Entry"
  )!;

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
            name: "NHS Pay Rise 2027/28 Calculator (2.4% Offer)",
            item: "https://netpayscale.uk/nhs-pay-rise-2027/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Pay Rise 2027/28 Calculator (2.4% DHSC Proposal)",
        url: "https://netpayscale.uk/nhs-pay-rise-2027/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        description:
          "Interactive 2027/28 NHS Agenda for Change pay rise calculator modelling the government's 2.4% written evidence proposal (19 October 2026) across Bands 2 to 9.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the proposed NHS pay rise for 2027/28?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "On 19 October 2026, the Department of Health and Social Care (DHSC) and NHS England published their joint written evidence to the NHS Pay Review Body (NHSPRB) proposing a 2.4% consolidated pay uplift for Agenda for Change staff in 2027/28 (effective 1 April 2027). That 2.4% figure is the government's opening affordability position, not the final award. In 2026/27, DHSC originally proposed 2.5% before the PRB recommended 3.3%.",
            },
          },
          {
            "@type": "Question",
            name: "How much would a 2.4% NHS pay rise add to Band 5 take-home pay in 2027/28?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Under a 2.4% uplift, Band 5 Entry salary rises from £32,073 to £32,843 (+£770/year gross, or +£41/month net after 8.3% pension, 20% PAYE tax, and 8% NI). At the top of Band 5 (£39,043), salary rises to £39,980 (+£937/year gross), increasing monthly net take-home pay by approximately +£49/month (around £50/month).`,
            },
          },
          {
            "@type": "Question",
            name: "When will the 2027/28 NHS pay rise be announced and paid?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Following the October 2026 written evidence submissions, the NHS Pay Review Body (40th Report) is scheduled to deliberate and report in January–February 2027, with the government's formal announcement expected in February–March 2027. The effective date of the annual Agenda for Change award is 1 April 2027.",
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
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-zinc-500"
        >
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">
            NHS Pay Rise 2027/28 Calculator (2.4% Proposal)
          </span>
        </nav>

        <AdPlaceholder slotId="payrise2027-top-banner" format="leaderboard" />

        {/* Hero & Position 0 Direct Answer */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3 max-w-4xl">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-mono font-semibold text-[#005EB8] border border-blue-200">
              Updated 1 Nov 2026 • DHSC Written Evidence (19 Oct 2026) • 40th NHSPRB Round
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              NHS Pay Rise 2027/28 Calculator: 2.4% DHSC Offer &amp; Band 2–9 Net
              Take-Home Pay
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              On <strong>19 October 2026</strong>, the Department of Health and
              Social Care (DHSC) and NHS England submitted their joint written
              evidence to the <strong>NHS Pay Review Body (NHSPRB)</strong>{" "}
              proposing a <strong>2.4% consolidated pay uplift</strong> for
              Agenda for Change staff in <strong>2027/28</strong> (effective{" "}
              <strong>1 April 2027</strong>). Calculate what a 2.4% offer—or a
              higher PRB recommendation—means for your monthly take-home pay
              after the <strong>28 October 2026 Autumn Budget</strong> frozen tax
              thresholds.
            </p>
          </div>

          {/* Direct Answer Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>
                Direct Answer · What a 2.4% NHS Pay Rise Means in 2027/28 (Confirmed Facts vs. Opening Bid)
              </span>
            </div>
            <p>
              The <strong>2.4% figure</strong> published on{" "}
              <strong>19 October 2026</strong> is the government&apos;s opening
              affordability submission to the NHSPRB (and to the DDRB for
              doctors and dentists)—<strong>not</strong> the final confirmed
              award. Last year, DHSC proposed <strong>2.5%</strong> in October
              2025 before the PRB recommended the confirmed{" "}
              <strong>3.3% 2026/27 award</strong>. If 2.4% were implemented on{" "}
              <strong>1 April 2027</strong>:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-emerald-200/60 text-xs">
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 2 Spot (+2.4%)
                </span>
                <span className="font-mono font-black text-zinc-950 text-base block">
                  {formatCurrency(b2Spot.gross2027_24)}/yr
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  +{formatCurrency(b2Spot.annualGain24)}/yr ({formatHourlyRate(b2Spot.hourly2027_24)})
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 Entry (+2.4%)
                </span>
                <span className="font-mono font-black text-[#005EB8] text-base block">
                  {formatCurrency(b5Entry.gross2027_24)}/yr
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  +{formatCurrency(b5Entry.netGainMonthly24)}/mo net ({formatHourlyRate(b5Entry.hourly2027_24)})
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 Top (+2.4%)
                </span>
                <span className="font-mono font-black text-emerald-700 text-base block">
                  {formatCurrency(b5Top.gross2027_24)}/yr
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  +{formatCurrency(b5Top.netGainMonthly24)}/mo net (+{formatCurrency(b5Top.annualGain24)}/yr)
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 6 Entry (+2.4%)
                </span>
                <span className="font-mono font-black text-purple-700 text-base block">
                  {formatCurrency(b6Entry.gross2027_24)}/yr
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  +{formatCurrency(b6Entry.netGainMonthly24)}/mo net (+{formatCurrency(b6Entry.annualGain24)}/yr)
                </span>
              </div>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={`NHS Pay Rise 2027/28 Calculator (2.4% DHSC Proposal): Band 5 Top (${formatCurrency(b5Top.gross2026)}) rises to ${formatCurrency(b5Top.gross2027_24)} (+${formatCurrency(b5Top.netGainMonthly24)}/mo net take-home). Check your band:`}
            url="https://netpayscale.uk/nhs-pay-rise-2027/"
            variant="light"
            label="Share 2027/28 NHS Pay Rise Calculator"
          />
        </section>

        {/* Interactive Calculator */}
        <section id="calculator" className="space-y-4">
          <PayRise2027Client />
        </section>

        {/* Full Band 2 to 9 Spine Point Table (Accessible Responsive Table) */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2
              id="pay-scales-2027-caption"
              className="text-lg sm:text-xl font-bold text-zinc-950"
            >
              1. NHS Pay Scales 2027/28 Master Table: Confirmed 2026/27 vs.
              2.4% DHSC Proposal (All 25 Spine Points)
            </h2>
            <p className="text-xs text-zinc-500">
              Complete Agenda for Change Band 2 to Band 9 arithmetic showing
              current 2026/27 salaries alongside the government&apos;s 2.4%
              opening proposal and a 3.3% comparator. Scroll horizontally on
              mobile—the Band column remains pinned.
            </p>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-labelledby="pay-scales-2027-caption"
            className="overflow-x-auto rounded-xl border border-zinc-200/80 max-w-full"
          >
            <table className="w-full text-left text-xs font-mono border-separate border-spacing-0">
              <caption className="sr-only">
                NHS 2026/27 Confirmed Salaries vs 2027/28 2.4% DHSC Proposal
                Across Bands 2 to 9
              </caption>
              <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                <tr>
                  <th
                    scope="col"
                    className="py-2.5 px-3 border-b border-zinc-200 sticky left-0 bg-zinc-50 z-20"
                  >
                    Band &amp; Step
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    2026/27 Gross (Hr)
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    2027/28 at +2.4% (Hr)
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    Annual Rise (+2.4%)
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    2026/27 Net/mo
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    2027/28 Net/mo (+2.4%)
                  </th>
                  <th
                    scope="col"
                    className="py-2.5 px-3 border-b border-zinc-200 text-right"
                  >
                    Monthly Net Gain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {allSpineRows.map((row) => (
                  <tr
                    key={`${row.band}-${row.step}`}
                    className="hover:bg-zinc-50/70"
                  >
                    <th
                      scope="row"
                      className="py-2.5 px-3 font-sans font-bold text-zinc-950 sticky left-0 bg-white border-b border-zinc-100 whitespace-nowrap"
                    >
                      <Link
                        href={`/bands/${row.slug}/`}
                        className="text-[#005EB8] hover:underline"
                      >
                        {row.band}
                      </Link>{" "}
                      <span className="text-[11px] font-normal text-zinc-500">
                        ({row.step})
                      </span>
                    </th>
                    <td className="py-2.5 px-3 tabular-nums border-b border-zinc-100 whitespace-nowrap">
                      {formatCurrency(row.gross2026)}{" "}
                      <span className="text-zinc-400">
                        ({formatHourlyRate(row.hourly2026)})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-bold text-zinc-950 border-b border-zinc-100 whitespace-nowrap">
                      {formatCurrency(row.gross2027_24)}{" "}
                      <span className="text-[#005EB8] font-normal">
                        ({formatHourlyRate(row.hourly2027_24)})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-semibold text-blue-700 border-b border-zinc-100 whitespace-nowrap">
                      +{formatCurrency(row.annualGain24)}/yr
                    </td>
                    <td className="py-2.5 px-3 tabular-nums text-zinc-600 border-b border-zinc-100 whitespace-nowrap">
                      {formatCurrency(row.net2026Monthly)}/mo
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-bold text-zinc-950 border-b border-zinc-100 whitespace-nowrap">
                      {formatCurrency(row.net2027Monthly)}/mo
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-extrabold text-emerald-700 border-b border-zinc-100 whitespace-nowrap">
                      +{formatCurrency(row.netGainMonthly24)}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2027/28 Pay Round Timeline & Autumn Budget Fiscal Drag */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-zinc-950">
                2. Official 2027/28 NHSPRB (40th Report) Timeline
              </h3>
              <ul className="space-y-2.5 text-xs text-zinc-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-emerald-700 shrink-0">
                    19 Oct 2026:
                  </span>
                  <span>
                    <strong>DHSC &amp; NHS England Written Evidence Published</strong>{" "}
                    — Government proposes a <strong>2.4% uplift</strong> for
                    Agenda for Change staff (and 2.4% to the DDRB for doctors).
                    RCN, UNISON, and Unite reject the figure as below CPI
                    inflation (3.1%).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-emerald-700 shrink-0">
                    28 Oct 2026:
                  </span>
                  <span>
                    <strong>UK Autumn Budget</strong> — Confirms Personal
                    Allowance (£12,570) and Higher Rate threshold (£50,270)
                    remain frozen in 2027/28, pulling Band 7 Entry ({formatCurrency(b7Entry.gross2027_24)} at +2.4%) above £50,270 gross.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-[#005EB8] shrink-0">
                    Jan–Feb 2027:
                  </span>
                  <span>
                    <strong>NHSPRB 40th Report Deliberation</strong> — Review
                    Body weighs affordability, recruitment/retention, and
                    inflation before submitting its recommendation to Ministers.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono font-bold text-[#005EB8] shrink-0">
                    1 Apr 2027:
                  </span>
                  <span>
                    <strong>Statutory Effective Date</strong> — All annual
                    Agenda for Change awards take effect from 1 April 2027 (with
                    retrospective backpay arrears if announced after April).
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-zinc-950">
                3. Four UK Nations Position &amp; Structural AfC Reform
              </h3>
              <div className="space-y-2.5 text-xs text-zinc-700 leading-relaxed">
                <p>
                  <strong>England &amp; Wales:</strong> Covered by the NHSPRB
                  40th Report process. Separate commitments to review{" "}
                  <strong>Band 5 nursing job evaluations</strong> (accelerated
                  Band 5 to Band 6 progression) are running alongside the annual
                  pay round.
                </p>
                <p>
                  <strong>NHS Scotland:</strong> Negotiates directly with the
                  Scottish Government outside the PRB. In 2026/27, Scotland
                  implemented a 3.75% rise plus the reduced{" "}
                  <Link
                    href="/scotland-pay-calculator/"
                    className="text-[#005EB8] font-semibold hover:underline"
                  >
                    35-hour working week
                  </Link>
                  .
                </p>
                <p>
                  <strong>Northern Ireland (HSCNI):</strong> Still awaiting
                  implementation of the <strong>2026/27 3.3% award</strong>, with
                  the RCN Northern Ireland strike ballot running from{" "}
                  <strong>14 October to 20 November 2026</strong>. See our{" "}
                  <Link
                    href="/northern-ireland-pay-calculator/"
                    className="text-[#005EB8] font-semibold hover:underline"
                  >
                    Northern Ireland 3.3% Backpay Calculator
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <AffiliateCards />
        <EeatVerificationBlock contextLabel="NHS 2027/28 Pay Round (19 Oct 2026 DHSC 2.4% Evidence) & 2026/27 AfC Baseline" />
      </div>
    </div>
  );
}
