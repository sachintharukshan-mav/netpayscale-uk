import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import NorthernIrelandPayClient, {
  HSCNI_2025_26_SALARIES,
} from "@/components/NorthernIrelandPayClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import EeatVerificationBlock from "@/components/EeatVerificationBlock";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

export const metadata: Metadata = {
  title:
    "NHS Northern Ireland Pay Calculator 2026/27: 3.3% Backpay & RCN Strike Ballot",
  description:
    "Calculate your HSC Northern Ireland 2025/26 vs 2026/27 (+3.3%) salary, monthly take-home pay, and 7+ months of unpaid backpay accrued since 1 April 2026 during the RCN NI strike ballot (closing 20 Nov 2026).",
  alternates: {
    canonical: "https://netpayscale.uk/northern-ireland-pay-calculator/",
    types: {
      "text/markdown":
        "https://netpayscale.uk/northern-ireland-pay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "As of November 2026, Health and Social Care Northern Ireland (HSCNI) Agenda for Change staff remain paid on the 2025/26 pay scale (e.g. Band 5 £31,049–£37,796) because the recommended 3.3% 2026/27 award (£32,073–£39,043) has been delayed by NI Executive budget pressures. The Royal College of Nursing (RCN) opened a statutory strike ballot in Northern Ireland on 14 October 2026 (closing 20 November 2026). Once implemented, the 3.3% uplift is backdated to 1 April 2026.",
  },
  openGraph: {
    title:
      "NHS Northern Ireland (HSCNI) Pay & 3.3% Unpaid Backpay Calculator 2026/27",
    description:
      "Compare HSCNI 2025/26 salaries currently in payment against the 3.3% 2026/27 parity scale and calculate your accrued backpay since 1 April 2026.",
    url: "https://netpayscale.uk/northern-ireland-pay-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

export default function NorthernIrelandPayPage() {
  const niBandRows = nhsData.bands.map((b) => {
    const entry2026 = b.points[0].annualSalary;
    const top2026 = b.points[b.points.length - 1].annualSalary;
    const niArr = HSCNI_2025_26_SALARIES[b.band] || [
      Math.round(entry2026 / 1.033),
    ];
    const entry2025 = niArr[0];
    const top2025 = niArr[niArr.length - 1];
    const entryHr2025 = Math.round((entry2025 / 1955.36) * 100) / 100;
    const annualGapEntry = entry2026 - entry2025;
    const annualGapTop = top2026 - top2025;
    const grossBackpay7MoEntry = Math.round((annualGapEntry / 12) * 7);
    const grossBackpay7MoTop = Math.round((annualGapTop / 12) * 7);

    return {
      band: b.band,
      slug: b.slug,
      entry2025,
      top2025,
      entryHr2025,
      entry2026,
      top2026,
      entryHr2026: b.points[0].hourlyRate,
      annualGapEntry,
      annualGapTop,
      grossBackpay7MoEntry,
      grossBackpay7MoTop,
    };
  });

  const b5Row = niBandRows.find((r) => r.band === "Band 5")!;
  const b6Row = niBandRows.find((r) => r.band === "Band 6")!;

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
            name: "NHS Northern Ireland Pay & 3.3% Backpay Calculator",
            item: "https://netpayscale.uk/northern-ireland-pay-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "HSC Northern Ireland 2026/27 Pay & 3.3% Unpaid Backpay Calculator",
        url: "https://netpayscale.uk/northern-ireland-pay-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        description:
          "Interactive Health and Social Care Northern Ireland (HSCNI) pay calculator comparing 2025/26 rates in payment against the delayed 3.3% 2026/27 award and accrued backpay since 1 April 2026.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Has the 2026/27 3.3% NHS pay rise been paid in Northern Ireland?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. While NHS England and NHS Wales implemented the 3.3% NHS Pay Review Body (39th Report) award on time in April 2026, Health and Social Care (HSC) staff in Northern Ireland remain on the 2025/26 pay scale due to Department of Health budget pressures (an estimated £120 million cost). Over 7 months of backdated arrears have accrued since 1 April 2026.",
            },
          },
          {
            "@type": "Question",
            name: "When does the RCN Northern Ireland strike ballot close?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Royal College of Nursing (RCN) in Northern Ireland opened a statutory industrial action and strike ballot on 14 October 2026 over the delayed 3.3% 2026/27 pay award and UK pay parity. The ballot closes on Friday 20 November 2026.",
            },
          },
          {
            "@type": "Question",
            name: "How much backpay is owed to a Band 5 nurse in Northern Ireland?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `In Northern Ireland, a Band 5 nurse is currently paid £31,049 at entry and £37,796 at the top step (2025/26 scale), compared to £32,073 to £39,043 under the 3.3% 2026/27 parity scale—an annual shortfall of £1,024 to £1,247 gross. Over 7 months (April to October 2026), that equals £597 to £727 in accrued gross backpay arrears.`,
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
            NHS Northern Ireland (HSCNI) Pay &amp; 3.3% Backpay Calculator
          </span>
        </nav>

        <AdPlaceholder slotId="ni-top-banner" format="leaderboard" />

        {/* Hero & Direct Answer */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3 max-w-4xl">
            <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-mono font-semibold text-amber-800 border border-amber-200">
              HSC Northern Ireland • RCN Strike Ballot (14 Oct – 20 Nov 2026) • Unpaid 3.3% Award
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              NHS Northern Ireland Pay Calculator 2026/27: 3.3% Backpay &amp;
              HSCNI Scales
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              While England and Wales paid the{" "}
              <strong>3.3% Agenda for Change 2026/27 award</strong> in April
              2026,{" "}
              <strong>Health and Social Care Northern Ireland (HSCNI)</strong>{" "}
              staff remain on the <strong>2025/26 pay scale</strong>—prompting
              the <strong>RCN Northern Ireland strike ballot</strong> (open{" "}
              <strong>14 October – 20 November 2026</strong>). Calculate your
              exact 2025/26 take-home pay versus the 2026/27 parity scale and see
              how much backpay you have accrued since <strong>1 April 2026</strong>.
            </p>
          </div>

          {/* Direct Answer Box */}
          <div className="rounded-xl bg-amber-50/80 border border-amber-200/90 p-5 text-xs sm:text-sm text-amber-950 leading-relaxed space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
              <span>
                Direct Answer · HSCNI 2026/27 Pay Status &amp; Accrued Backpay Summary (1 Nov 2026)
              </span>
            </div>
            <p>
              As of <strong>1 November 2026</strong>, the NI Department of
              Health has not yet funded the £120m{" "}
              <strong>3.3% NHSPRB 39th Report recommendation</strong>. HSCNI
              staff across Belfast, Northern, South Eastern, Southern, and
              Western HSC Trusts are still paid on the{" "}
              <strong>2025/26 pay spine</strong>. When approved, the 3.3% uplift
              is backdated to <strong>1 April 2026</strong>:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-amber-200/60 text-xs">
              <div className="rounded-lg bg-white/90 p-3 border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 Paid Now (NI)
                </span>
                <span className="font-mono font-black text-zinc-950 text-base block">
                  {formatCurrency(b5Row.entry2025)} → {formatCurrency(b5Row.top2025)}
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  2025/26 Confirmed Scale
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 With 3.3%
                </span>
                <span className="font-mono font-black text-[#005EB8] text-base block">
                  {formatCurrency(b5Row.entry2026)} → {formatCurrency(b5Row.top2026)}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  +{formatCurrency(b5Row.annualGapEntry)} to +{formatCurrency(b5Row.annualGapTop)}/yr
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 7-Mo Backpay
                </span>
                <span className="font-mono font-black text-emerald-700 text-base block">
                  {formatCurrency(b5Row.grossBackpay7MoEntry)} – {formatCurrency(b5Row.grossBackpay7MoTop)}
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  Gross Arrears (Apr–Oct 2026)
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 6 7-Mo Backpay
                </span>
                <span className="font-mono font-black text-purple-700 text-base block">
                  {formatCurrency(b6Row.grossBackpay7MoEntry)} – {formatCurrency(b6Row.grossBackpay7MoTop)}
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  Gross Arrears (Apr–Oct 2026)
                </span>
              </div>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={`HSC Northern Ireland 2026/27 Pay & 3.3% Backpay Calculator: Band 5 nurses are owed ${formatCurrency(b5Row.grossBackpay7MoEntry)}–${formatCurrency(b5Row.grossBackpay7MoTop)} in 7-month gross arrears since 1 April 2026. Check your band:`}
            url="https://netpayscale.uk/northern-ireland-pay-calculator/"
            variant="light"
            label="Share HSCNI 3.3% Backpay Calculator"
          />
        </section>

        {/* Interactive HSCNI Calculator */}
        <NorthernIrelandPayClient />

        {/* Master HSCNI 2025/26 vs 2026/27 Parity Table */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="space-y-1.5">
            <h2
              id="hscni-bands-caption"
              className="text-lg sm:text-xl font-bold text-zinc-950"
            >
              1. HSC Northern Ireland Pay Scales: Confirmed 2025/26 (In Payment)
              vs. 2026/27 (+3.3% Parity) &amp; 7-Month Arrears
            </h2>
            <p className="text-xs text-zinc-500">
              Full comparison across Bands 2 to 9 showing the 2025/26 rates
              currently paid by HSCNI payroll alongside the 3.3% 2026/27 UK
              parity rates and 7-month backdated arrears (April–October 2026).
            </p>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-labelledby="hscni-bands-caption"
            className="overflow-x-auto rounded-xl border border-zinc-200/80 max-w-full"
          >
            <table className="w-full text-left text-xs font-mono border-separate border-spacing-0">
              <caption className="sr-only">
                HSC Northern Ireland 2025/26 Confirmed Pay vs 2026/27 3.3%
                Parity Scale and 7-Month Accrued Backpay
              </caption>
              <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                <tr>
                  <th
                    scope="col"
                    className="py-2.5 px-3 border-b border-zinc-200 sticky left-0 bg-zinc-50 z-20"
                  >
                    HSCNI Band
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    2025/26 Paid Now (Entry → Top)
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    2025/26 Hourly
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    2026/27 (+3.3% Parity)
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    Annual Parity Gap
                  </th>
                  <th
                    scope="col"
                    className="py-2.5 px-3 border-b border-zinc-200 text-right"
                  >
                    7-Mo Gross Backpay (Apr–Oct)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {niBandRows.map((row) => (
                  <tr key={row.band} className="hover:bg-zinc-50/70">
                    <th
                      scope="row"
                      className="py-2.5 px-3 font-sans font-bold text-zinc-950 sticky left-0 bg-white border-b border-zinc-100 whitespace-nowrap"
                    >
                      <Link
                        href={`/bands/${row.slug}/`}
                        className="text-[#005EB8] hover:underline"
                      >
                        {row.band}
                      </Link>
                    </th>
                    <td className="py-2.5 px-3 tabular-nums border-b border-zinc-100 whitespace-nowrap">
                      {formatCurrency(row.entry2025)}
                      {row.top2025 !== row.entry2025
                        ? ` → ${formatCurrency(row.top2025)}`
                        : " (spot)"}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums text-zinc-600 border-b border-zinc-100 whitespace-nowrap">
                      {formatHourlyRate(row.entryHr2025)}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-bold text-[#005EB8] border-b border-zinc-100 whitespace-nowrap">
                      {formatCurrency(row.entry2026)}
                      {row.top2026 !== row.entry2026
                        ? ` → ${formatCurrency(row.top2026)}`
                        : " (spot)"}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-semibold text-amber-800 border-b border-zinc-100 whitespace-nowrap">
                      +{formatCurrency(row.annualGapEntry)}
                      {row.annualGapTop !== row.annualGapEntry
                        ? ` → +${formatCurrency(row.annualGapTop)}/yr`
                        : "/yr"}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-extrabold text-emerald-700 border-b border-zinc-100 whitespace-nowrap">
                      {formatCurrency(row.grossBackpay7MoEntry)}
                      {row.grossBackpay7MoTop !== row.grossBackpay7MoEntry
                        ? ` – ${formatCurrency(row.grossBackpay7MoTop)}`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
            <div>
              <strong>Major HSCNI Employers Covered:</strong>{" "}
              <Link
                href="/trusts/belfast-hsc-trust/"
                className="text-[#005EB8] font-semibold hover:underline"
              >
                Belfast HSC Trust
              </Link>{" "}
              • Northern HSC Trust • South Eastern HSC Trust • Southern HSC Trust
              • Western HSC Trust • Northern Ireland Ambulance Service (NIAS).
            </div>
            <Link
              href="/calculator/band-5-nurse-salary-northern-ireland/"
              className="text-[#005EB8] font-bold hover:underline"
            >
              Band 5 Nurse Northern Ireland Guide →
            </Link>
          </div>
        </section>

        <AffiliateCards />
        <EeatVerificationBlock contextLabel="HSC Northern Ireland 2025/26 Confirmed Scales & 2026/27 (+3.3%) Parity Arrears" />
      </div>
    </div>
  );
}
