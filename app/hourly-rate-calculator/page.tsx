import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import Calculator from "@/components/Calculator";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import EeatVerificationBlock from "@/components/EeatVerificationBlock";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

export const metadata: Metadata = {
  title:
    "NHS Hourly Pay Rates 2026/27 (Bands 2 to 9): Basic, Night, Sunday, Overtime & Bank Chart",
  description:
    "Official 2026/27 NHS Agenda for Change hourly rates across every spine point from Band 2 (£12.92/hr) to Band 9 (£66.37/hr). Compare basic, night (+44%/+30%), Sunday (+88%/+60%), overtime (1.5x), Scotland 35h, and Bank (+12.07% WTR) hourly pay.",
  alternates: {
    canonical: "https://netpayscale.uk/hourly-rate-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/hourly-rate-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "Under the 2026/27 NHS Agenda for Change pay award (+3.3%), basic daytime hourly rates (based on 1,955.36 annual hours for a 37.5h week) start at £12.92/hr for Band 2, £13.45/hr for Band 3, £14.66/hr for Band 4, £16.40/hr for Band 5, £20.43/hr for Band 6, £25.25/hr for Band 7, and up to £66.37/hr at the top of Band 9.",
  },
  openGraph: {
    title:
      "NHS Hourly Pay Rates 2026/27 Master Chart: Basic, Night, Weekend, Overtime & Bank",
    description:
      "Complete 2026/27 NHS hourly rate reference across all Agenda for Change spine points (Bands 2–9), including Section 2 unsocial uplifts and +12.07% WTR Bank rates.",
    url: "https://netpayscale.uk/hourly-rate-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

export default function HourlyRateCalculatorPage() {
  const spineHourlyRows = nhsData.bands.flatMap((bandObj) => {
    const isBand2Or3 = bandObj.band === "Band 2" || bandObj.band === "Band 3";
    const nightMult = isBand2Or3 ? 1.44 : 1.3;
    const sundayMult = isBand2Or3 ? 1.88 : 1.6;
    const nightLabel = isBand2Or3 ? "+44%" : "+30%";
    const sundayLabel = isBand2Or3 ? "+88%" : "+60%";
    const isOvertimeEligible = !bandObj.band.startsWith("Band 8") && bandObj.band !== "Band 9";

    return bandObj.points.map((pt, idx) => {
      const calc = calculateNHSPay({
        band: bandObj.band,
        stepIndex: idx,
        hcasZone: "standard",
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: false,
        isScottishTax: false,
        studentLoan: "none",
      });

      return {
        band: bandObj.band,
        slug: bandObj.slug,
        step: pt.step,
        yearsExperience: pt.yearsExperience,
        annualSalary: pt.annualSalary,
        basicHourly: pt.hourlyRate,
        scotland35Hourly: pt.annualSalary / 1825,
        nightHourly: pt.hourlyRate * nightMult,
        sundayHourly: pt.hourlyRate * sundayMult,
        overtimeHourly: isOvertimeEligible ? pt.hourlyRate * 1.5 : null,
        bankWtrHourly: pt.hourlyRate * 1.1207, // +12.07% statutory WTR rolled-up holiday uplift
        netHourly: calc.netHourlyRate,
        nightLabel,
        sundayLabel,
      };
    });
  });

  const b2Row = spineHourlyRows.find((r) => r.band === "Band 2")!;
  const b5EntryRow = spineHourlyRows.find(
    (r) => r.band === "Band 5" && r.step === "Entry"
  )!;
  const b6EntryRow = spineHourlyRows.find(
    (r) => r.band === "Band 6" && r.step === "Entry"
  )!;
  const b7EntryRow = spineHourlyRows.find(
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
            name: "NHS Hourly Pay Rates 2026/27",
            item: "https://netpayscale.uk/hourly-rate-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Hourly Pay Rates & Shift Rate Calculator 2026/27",
        url: "https://netpayscale.uk/hourly-rate-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        description:
          "Complete 2026/27 NHS Agenda for Change hourly rate chart across Bands 2 to 9 including night, weekend, overtime, Scotland 35h, and Bank WTR rates.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How is the NHS hourly rate calculated from annual salary?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under the NHS Terms and Conditions of Service Handbook, a standard 37.5-hour full-time working week in England, Wales, and Northern Ireland equals 1,955.36 hours per year (37.5 hours × 52.143 weeks). Your basic hourly rate is your annual gross basic salary divided by 1,955.36. In NHS Scotland, the 35.0-hour standard week equals 1,825.00 hours per year.",
            },
          },
          {
            "@type": "Question",
            name: "What are the 2026/27 NHS hourly rates for Band 2, Band 5, Band 6, and Band 7?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `In 2026/27 (+3.3% award), Band 2 pays ${formatHourlyRate(b2Row.basicHourly)} basic (${formatHourlyRate(b2Row.nightHourly)} nights/Saturdays, ${formatHourlyRate(b2Row.sundayHourly)} Sundays). Band 5 starts at ${formatHourlyRate(b5EntryRow.basicHourly)} basic (${formatHourlyRate(b5EntryRow.nightHourly)} nights/Saturdays, ${formatHourlyRate(b5EntryRow.sundayHourly)} Sundays). Band 6 starts at ${formatHourlyRate(b6EntryRow.basicHourly)} basic, and Band 7 starts at ${formatHourlyRate(b7EntryRow.basicHourly)} basic.`,
            },
          },
          {
            "@type": "Question",
            name: "Why do NHS Bank shifts include a +12.07% WTR holiday uplift?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Because NHS Bank and NHSP workers do not take paid annual leave during bank shifts, statutory Working Time Regulations (5.6 weeks holiday ÷ 46.4 working weeks = 12.07%) add a 12.07% rolled-up holiday pay supplement to the basic hourly rate worked on bank shifts.",
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
            NHS Hourly Pay Rates 2026/27 (Bands 2 to 9)
          </span>
        </nav>

        <AdPlaceholder slotId="hourly-top-banner" format="leaderboard" />

        {/* Hero & Direct Answer */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3 max-w-4xl">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-mono font-semibold text-[#005EB8] border border-blue-200">
              2026/27 Master Hourly Reference • 1,955.36 Annual Hours • AfC
              Section 2 Uplifts
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              NHS Hourly Pay Rates 2026/27: Basic, Night, Sunday, Overtime &amp;
              Bank Master Chart
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Every <strong>2026/27 NHS Agenda for Change hourly rate</strong>{" "}
              across all 25 spine points from <strong>Band 2 to Band 9</strong>{" "}
              in one verified table—comparing{" "}
              <strong>Basic Day Rate (1.0x)</strong>,{" "}
              <strong>Night &amp; Saturday (+44% / +30%)</strong>,{" "}
              <strong>Sunday &amp; Bank Holiday (+88% / +60%)</strong>,{" "}
              <strong>Overtime (1.5x)</strong>,{" "}
              <strong>NHS Bank (+12.07% WTR)</strong>, and{" "}
              <strong>Net Hourly Take-Home</strong>.
            </p>
          </div>

          {/* Direct Answer Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>
                Direct Answer · 2026/27 NHS Hourly Rate Formula &amp; Key
                Benchmarks
              </span>
            </div>
            <p>
              NHS hourly pay is calculated by dividing your annual basic salary
              by <strong>1,955.36 hours</strong> (`37.5 hrs/wk × 52.143 wks`) in
              England, Wales, and Northern Ireland—or by{" "}
              <strong>1,825.00 hours</strong> (`35.0 hrs/wk × 52.143 wks`) in
              NHS Scotland. In <strong>2026/27</strong>,{" "}
              <strong>Band 2</strong> pays{" "}
              <strong>{formatHourlyRate(b2Row.basicHourly)}</strong> (up to{" "}
              <strong>{formatHourlyRate(b2Row.sundayHourly)}</strong> on
              Sundays), <strong>Band 5</strong> starts at{" "}
              <strong>{formatHourlyRate(b5EntryRow.basicHourly)}</strong> (
              <strong>{formatHourlyRate(b5EntryRow.nightHourly)}</strong> nights
              / <strong>{formatHourlyRate(b5EntryRow.sundayHourly)}</strong>{" "}
              Sundays), <strong>Band 6</strong> starts at{" "}
              <strong>{formatHourlyRate(b6EntryRow.basicHourly)}</strong>, and{" "}
              <strong>Band 7</strong> starts at{" "}
              <strong>{formatHourlyRate(b7EntryRow.basicHourly)}</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-emerald-200/60 text-xs">
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 2 Spot Rate
                </span>
                <span className="font-mono font-black text-zinc-950 text-base block">
                  {formatHourlyRate(b2Row.basicHourly)}
                </span>
                <span className="text-[11px] text-blue-700 font-semibold block">
                  Night: {formatHourlyRate(b2Row.nightHourly)} • Sun:{" "}
                  {formatHourlyRate(b2Row.sundayHourly)}
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 Entry Rate
                </span>
                <span className="font-mono font-black text-emerald-700 text-base block">
                  {formatHourlyRate(b5EntryRow.basicHourly)}
                </span>
                <span className="text-[11px] text-blue-700 font-semibold block">
                  Night: {formatHourlyRate(b5EntryRow.nightHourly)} • Sun:{" "}
                  {formatHourlyRate(b5EntryRow.sundayHourly)}
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 6 Entry Rate
                </span>
                <span className="font-mono font-black text-[#005EB8] text-base block">
                  {formatHourlyRate(b6EntryRow.basicHourly)}
                </span>
                <span className="text-[11px] text-blue-700 font-semibold block">
                  Night: {formatHourlyRate(b6EntryRow.nightHourly)} • Sun:{" "}
                  {formatHourlyRate(b6EntryRow.sundayHourly)}
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 7 Entry Rate
                </span>
                <span className="font-mono font-black text-purple-700 text-base block">
                  {formatHourlyRate(b7EntryRow.basicHourly)}
                </span>
                <span className="text-[11px] text-blue-700 font-semibold block">
                  Night: {formatHourlyRate(b7EntryRow.nightHourly)} • Sun:{" "}
                  {formatHourlyRate(b7EntryRow.sundayHourly)}
                </span>
              </div>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={`NHS Hourly Pay Rates 2026/27 Master Chart: Band 2 is ${formatHourlyRate(b2Row.basicHourly)} (Sunday ${formatHourlyRate(b2Row.sundayHourly)}), Band 5 starts at ${formatHourlyRate(b5EntryRow.basicHourly)} (Night ${formatHourlyRate(b5EntryRow.nightHourly)}, Sunday ${formatHourlyRate(b5EntryRow.sundayHourly)}). Full B2–B9 chart:`}
            url="https://netpayscale.uk/hourly-rate-calculator/"
            variant="light"
            label="Share 2026/27 NHS Hourly Rate Chart with Ward / Team"
          />

          {/* Master All-Spine Hourly Rate Table */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                  1. Complete 2026/27 NHS Hourly Pay Rates Master Table (Bands 2
                  to 9 — All Spine Points)
                </h2>
                <p className="text-xs text-zinc-500">
                  Includes standard 37.5h basic rate, Night/Saturday Section 2
                  rate, Sunday/Bank Holiday Section 2 rate, 1.5x Overtime,
                  +12.07% Bank WTR, and Net Hourly Pay.
                </p>
              </div>
              <Link
                href="/unsocial-hours-calculator/"
                className="text-xs font-semibold text-[#005EB8] hover:underline shrink-0"
              >
                Unsocial Shift Calculator →
              </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-200/80">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                    <th className="py-2.5 px-3">Band &amp; Step</th>
                    <th className="py-2.5 px-3">Annual Basic</th>
                    <th className="py-2.5 px-3">Basic Day (1.0x)</th>
                    <th className="py-2.5 px-3">Night / Sat</th>
                    <th className="py-2.5 px-3">Sunday / BH</th>
                    <th className="py-2.5 px-3">Overtime (1.5x)</th>
                    <th className="py-2.5 px-3">Bank (+12.07%)</th>
                    <th className="py-2.5 px-3 text-right">Net Hourly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {spineHourlyRows.map((row) => (
                    <tr
                      key={`${row.band}-${row.step}`}
                      className="hover:bg-zinc-50/70"
                    >
                      <td className="py-2.5 px-3 font-sans">
                        <Link
                          href={`/bands/${row.slug}/`}
                          className="font-bold text-[#005EB8] hover:underline"
                        >
                          {row.band}
                        </Link>{" "}
                        <span className="text-zinc-600 font-medium">
                          {row.step}
                        </span>{" "}
                        <span className="text-[10px] text-zinc-400">
                          ({row.yearsExperience}y)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-semibold">
                        {formatCurrency(row.annualSalary)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-bold text-zinc-950 bg-zinc-50/60">
                        {formatHourlyRate(row.basicHourly)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-blue-700 font-semibold">
                        {formatHourlyRate(row.nightHourly)}{" "}
                        <span className="text-[10px] font-normal text-zinc-400">
                          ({row.nightLabel})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-purple-700 font-semibold">
                        {formatHourlyRate(row.sundayHourly)}{" "}
                        <span className="text-[10px] font-normal text-zinc-400">
                          ({row.sundayLabel})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-amber-800">
                        {row.overtimeHourly
                          ? formatHourlyRate(row.overtimeHourly)
                          : "N/A (B8+)"}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-zinc-700">
                        {formatHourlyRate(row.bankWtrHourly)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-emerald-700">
                        {formatHourlyRate(row.netHourly)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Interactive Calculator */}
        <section id="calculator" className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-zinc-200/80 pb-2">
            <h2 className="text-lg font-bold text-zinc-950">
              Interactive Hourly Shift, Night &amp; Weekend Pay Modeler
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              2026/27 Section 2 Unsocial Hours Engine
            </span>
          </div>
          <Calculator initialBand="Band 5" initialStepIndex={0} />
        </section>

        <AffiliateCards />
        <EeatVerificationBlock contextLabel="NHS 2026/27 Hourly Pay Spine & Section 2 Shift Multipliers" />
      </div>
    </div>
  );
}
