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
    "NHS Part-Time & Pro-Rata Salary Calculator 2026/27: 15h, 22.5h & 30h WTE Pay",
  description:
    "Calculate your 2026/27 NHS part-time and pro-rata net take-home pay for 15, 18.75, 22.5, and 30 hours/week across Bands 2 to 9. Includes pro-rata HCAS, WTE pension tiers, and part-time holiday hours.",
  alternates: {
    canonical: "https://netpayscale.uk/part-time-pay-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/part-time-pay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "NHS part-time salaries are calculated pro-rata against the standard 37.5-hour Whole-Time Equivalent (1.0 WTE) week: Pro-Rata Salary = Full-Time Salary × (Contracted Hours ÷ 37.5). Because the £12,570 tax-free Personal Allowance is not reduced for part-time staff, a Band 5 Nurse working 22.5 hours/week (0.6 WTE, £19,244 gross) takes home £1,375/month net—keeping 66.1% of full-time net pay for 60% of the hours.",
  },
  openGraph: {
    title:
      "NHS Part-Time & Pro-Rata Salary Calculator 2026/27 (15h, 18.75h, 22.5h, 30h)",
    description:
      "Official 2026/27 NHS Agenda for Change part-time pro-rata take-home pay, pension tier, and holiday hours calculator.",
    url: "https://netpayscale.uk/part-time-pay-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

const WTE_PATTERNS = [
  { hours: 15.0, wte: "0.4 WTE", label: "2 Days / Week (15.0h)" },
  { hours: 18.75, wte: "0.5 WTE", label: "2.5 Days / Week (18.75h)" },
  { hours: 22.5, wte: "0.6 WTE", label: "3 Days / Week (22.5h)" },
  { hours: 30.0, wte: "0.8 WTE", label: "4 Days / Week (30.0h)" },
  { hours: 37.5, wte: "1.0 WTE", label: "Full-Time (37.5h)" },
];

export default function PartTimePayCalculatorPage() {
  const bandProRataMatrix = nhsData.bands.map((bandObj) => {
    const patterns = WTE_PATTERNS.map((p) => {
      const calc = calculateNHSPay({
        band: bandObj.band,
        stepIndex: 0,
        hcasZone: "standard",
        contractedHours: p.hours,
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: false,
        isScottishTax: false,
        studentLoan: "none",
      });
      return {
        ...p,
        grossAnnual: calc.grossPay.annual,
        netMonthly: calc.netPay.monthly,
        pensionTier: calc.pensionTierLabel,
        takeHomePct: calc.takeHomePercentage,
      };
    });

    const fullTimeNet = patterns[4].netMonthly;

    return {
      band: bandObj.band,
      slug: bandObj.slug,
      hourlyRate: bandObj.points[0].hourlyRate,
      fullTimeGross: bandObj.points[0].annualSalary,
      fullTimeNet,
      wte04: patterns[0],
      wte05: patterns[1],
      wte06: patterns[2],
      wte08: patterns[3],
      wte10: patterns[4],
    };
  });

  const b5Row = bandProRataMatrix.find((r) => r.band === "Band 5")!;
  const b5ThreeDayNetRetention = Math.round(
    (b5Row.wte06.netMonthly / b5Row.fullTimeNet) * 1000
  ) / 10;
  const b5FourDayNetRetention = Math.round(
    (b5Row.wte08.netMonthly / b5Row.fullTimeNet) * 1000
  ) / 10;

  // Section 13 Pro-Rata Annual Leave + 8 Bank Holidays in Hours
  const holidayEntitlementRows = WTE_PATTERNS.map((p) => {
    const ratio = p.hours / 37.5;
    const bankHolHours = Math.round(60 * ratio * 10) / 10; // Full-time 8 BH = 60 hours
    const entryLeaveHours = Math.round(202.5 * ratio * 10) / 10; // 27 days = 202.5h
    const fiveYrLeaveHours = Math.round(217.5 * ratio * 10) / 10; // 29 days = 217.5h
    const tenYrLeaveHours = Math.round(247.5 * ratio * 10) / 10; // 33 days = 247.5h
    return {
      ...p,
      bankHolHours,
      entryTotalHours: Math.round((entryLeaveHours + bankHolHours) * 10) / 10,
      fiveYrTotalHours: Math.round((fiveYrLeaveHours + bankHolHours) * 10) / 10,
      tenYrTotalHours: Math.round((tenYrLeaveHours + bankHolHours) * 10) / 10,
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
            name: "NHS Part-Time & Pro-Rata Calculator (2026/27)",
            item: "https://netpayscale.uk/part-time-pay-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Part-Time & Pro-Rata Salary Calculator 2026/27",
        url: "https://netpayscale.uk/part-time-pay-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        description:
          "Official 2026/27 NHS Agenda for Change part-time and pro-rata salary, pension tier, HCAS, and annual leave hours calculator.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do you calculate NHS pro-rata salary for part-time hours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Agenda for Change, part-time pro-rata basic salary is calculated by dividing your contracted weekly hours by the standard 37.5-hour Whole-Time Equivalent (WTE) week and multiplying by the full-time annual salary: Pro-Rata Gross = Full-Time Salary × (Contracted Hours ÷ 37.5). For example, 22.5 hours/week is 0.6 WTE (60%) and 30.0 hours/week is 0.8 WTE (80%).",
            },
          },
          {
            "@type": "Question",
            name: "Why is NHS part-time net take-home pay higher than the pro-rata percentage?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Because every UK employee receives the full £12,570 tax-free Personal Allowance and £12,570 National Insurance Primary Threshold regardless of whether they work part-time or full-time, a larger share of a part-time NHS salary is completely tax-free. Furthermore, lower actual pensionable pay often drops part-time staff into a lower NHS Pension contribution tier (e.g., 6.5% instead of 8.3% or 9.8%). A starting Band 5 working 22.5h/wk (60% hours) keeps ${b5ThreeDayNetRetention}% of full-time net pay (${formatCurrency(b5Row.wte06.netMonthly)}/month).`,
            },
          },
          {
            "@type": "Question",
            name: "How is NHS annual leave and bank holiday entitlement calculated for part-time staff?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Section 13 of the NHS Terms and Conditions of Service Handbook, part-time staff calculate annual leave and bank holiday entitlement in hours rather than days so nobody is disadvantaged by the days of the week they work. Full-time staff (37.5h) receive 202.5 hours (0–5 yrs), 217.5 hours (5–10 yrs), or 247.5 hours (10+ yrs) plus 60 hours of bank holidays; part-time staff receive their exact WTE fraction of these total hours.",
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
            NHS Part-Time &amp; Pro-Rata Pay Calculator (2026/27)
          </span>
        </nav>

        <AdPlaceholder slotId="part-time-top-banner" format="leaderboard" />

        {/* Hero & Direct Answer */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3 max-w-4xl">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-mono font-semibold text-[#005EB8] border border-blue-200">
              Agenda for Change 2026/27 • WTE Pro-Rata Engine • Section 13 Leave
              Hours
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              NHS Part-Time &amp; Pro-Rata Salary Calculator 2026/27
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Calculate your exact monthly net take-home pay for{" "}
              <strong>15h (0.4 WTE)</strong>, <strong>18.75h (0.5 WTE)</strong>,{" "}
              <strong>22.5h (0.6 WTE / 3 days)</strong>, and{" "}
              <strong>30h (0.8 WTE / 4 days)</strong> NHS contracts across{" "}
              <strong>Bands 2 to 9</strong>. See how the{" "}
              <strong>£12,570 Personal Allowance</strong> and{" "}
              <strong>lower actual-earnings NHS Pension tiers</strong> boost
              your part-time net retention.
            </p>
          </div>

          {/* Direct Answer Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>
                Direct Answer · The Part-Time Tax &amp; Pension Retention
                Advantage
              </span>
            </div>
            <p>
              To calculate an <strong>NHS pro-rata salary</strong>, divide your
              contracted weekly hours by <strong>37.5</strong> and multiply by
              the full-time band salary:{" "}
              <code>Gross = Full-Time × (Hours ÷ 37.5)</code>. However, your{" "}
              <strong>net take-home pay does not drop as much as your hours</strong>{" "}
              because you still keep the full{" "}
              <strong>£12,570 tax-free Personal Allowance</strong> and drop into
              a lower <strong>2015 CARE Pension tier</strong> on actual
              pensionable earnings. For example, a starting{" "}
              <strong>Band 5 Nurse</strong> working{" "}
              <strong>3 days/week (22.5h / 0.6 WTE)</strong> works{" "}
              <strong>60%</strong> of full-time hours ({formatCurrency(b5Row.wte06.grossAnnual)} gross)
              but takes home{" "}
              <strong>{formatCurrency(b5Row.wte06.netMonthly)}/month net</strong>—retaining{" "}
              <strong>{b5ThreeDayNetRetention}%</strong> of full-time net pay!
              At <strong>4 days/week (30h / 0.8 WTE)</strong>, they take home{" "}
              <strong>{formatCurrency(b5Row.wte08.netMonthly)}/month net</strong> (
              <strong>{b5FourDayNetRetention}%</strong> of full-time net pay).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-emerald-200/60 text-xs">
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 • 18.75h (0.5 WTE)
                </span>
                <span className="font-mono font-black text-zinc-950 text-base block">
                  {formatCurrency(b5Row.wte05.netMonthly)}/mo
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  Gross: {formatCurrency(b5Row.wte05.grossAnnual)}/yr
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 • 22.5h (0.6 WTE)
                </span>
                <span className="font-mono font-black text-emerald-700 text-base block">
                  {formatCurrency(b5Row.wte06.netMonthly)}/mo
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  {b5ThreeDayNetRetention}% of 1.0 WTE net pay
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 • 30.0h (0.8 WTE)
                </span>
                <span className="font-mono font-black text-[#005EB8] text-base block">
                  {formatCurrency(b5Row.wte08.netMonthly)}/mo
                </span>
                <span className="text-[11px] text-[#005EB8] font-semibold block">
                  {b5FourDayNetRetention}% of 1.0 WTE net pay
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Band 5 • 37.5h (1.0 WTE)
                </span>
                <span className="font-mono font-black text-zinc-950 text-base block">
                  {formatCurrency(b5Row.wte10.netMonthly)}/mo
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  Gross: {formatCurrency(b5Row.fullTimeGross)}/yr
                </span>
              </div>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={`NHS Part-Time Pro-Rata Pay Calculator 2026/27: A Band 5 working 3 days/wk (22.5h, 0.6 WTE) takes home ${formatCurrency(b5Row.wte06.netMonthly)}/mo net (${b5ThreeDayNetRetention}% of full-time net pay!). At 4 days/wk (30h), take-home is ${formatCurrency(b5Row.wte08.netMonthly)}/mo:`}
            url="https://netpayscale.uk/part-time-pay-calculator/"
            variant="light"
            label="Share Part-Time Pro-Rata Pay Table with Colleagues"
          />

          {/* Table 1: Master Part-Time Net Monthly Take-Home Matrix Across Bands 2 to 9 */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">
              1. 2026/27 NHS Part-Time Net Monthly Take-Home Matrix (Bands 2 to
              9 Entry Step)
            </h2>
            <p className="text-xs text-zinc-500">
              Net monthly take-home pay in your bank after PAYE Income Tax,
              National Insurance, and actual-earnings 2015 CARE Pension
              deductions across standard WTE part-time contracts.
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200/80">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                    <th className="py-2.5 px-3">Pay Band</th>
                    <th className="py-2.5 px-3">Hourly Rate</th>
                    <th className="py-2.5 px-3">15.0h (0.4 WTE)</th>
                    <th className="py-2.5 px-3">18.75h (0.5 WTE)</th>
                    <th className="py-2.5 px-3">22.5h (0.6 WTE)</th>
                    <th className="py-2.5 px-3">30.0h (0.8 WTE)</th>
                    <th className="py-2.5 px-3 text-right">
                      37.5h (1.0 WTE Full)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {bandProRataMatrix.map((row) => (
                    <tr key={row.band} className="hover:bg-zinc-50/70">
                      <td className="py-2.5 px-3 font-sans font-bold text-zinc-950">
                        <Link
                          href={`/bands/${row.slug}/`}
                          className="text-[#005EB8] hover:underline"
                        >
                          {row.band}
                        </Link>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-zinc-600">
                        {formatHourlyRate(row.hourlyRate)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        <span className="font-bold text-zinc-900 block">
                          {formatCurrency(row.wte04.netMonthly)}/mo
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {formatCurrency(row.wte04.grossAnnual)}/yr (
                          {row.wte04.pensionTier})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        <span className="font-bold text-zinc-900 block">
                          {formatCurrency(row.wte05.netMonthly)}/mo
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {formatCurrency(row.wte05.grossAnnual)}/yr (
                          {row.wte05.pensionTier})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums bg-emerald-50/40">
                        <span className="font-bold text-emerald-700 block">
                          {formatCurrency(row.wte06.netMonthly)}/mo
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {formatCurrency(row.wte06.grossAnnual)}/yr (
                          {row.wte06.pensionTier})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums bg-blue-50/30">
                        <span className="font-bold text-[#005EB8] block">
                          {formatCurrency(row.wte08.netMonthly)}/mo
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {formatCurrency(row.wte08.grossAnnual)}/yr (
                          {row.wte08.pensionTier})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        <span className="font-bold text-zinc-950 block">
                          {formatCurrency(row.wte10.netMonthly)}/mo
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {formatCurrency(row.wte10.grossAnnual)}/yr (
                          {row.wte10.pensionTier})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Section 13 Pro-Rata Annual Leave + Bank Holiday Hours */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                  2. NHS Part-Time Pro-Rata Annual Leave &amp; Bank Holiday
                  Hours (AfC Section 13)
                </h2>
                <p className="text-xs text-zinc-500">
                  Part-time NHS leave is calculated in hours (including pro-rata
                  allowance for the 8 UK public bank holidays = 60h full-time).
                </p>
              </div>
              <Link
                href="/annual-leave-calculator/"
                className="text-xs font-semibold text-[#005EB8] hover:underline shrink-0"
              >
                Full NHS Annual Leave Calculator →
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-zinc-200/80">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                    <th className="py-2.5 px-3">Contracted Weekly Hours</th>
                    <th className="py-2.5 px-3">WTE Ratio</th>
                    <th className="py-2.5 px-3">Pro-Rata Bank Holiday Hours</th>
                    <th className="py-2.5 px-3">
                      0–5 Yrs Service (27d + 8 BH)
                    </th>
                    <th className="py-2.5 px-3">
                      5–10 Yrs Service (29d + 8 BH)
                    </th>
                    <th className="py-2.5 px-3 text-right">
                      10+ Yrs Service (33d + 8 BH)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {holidayEntitlementRows.map((h) => (
                    <tr key={h.wte} className="hover:bg-zinc-50/70">
                      <td className="py-2.5 px-3 font-sans font-semibold text-zinc-950">
                        {h.label}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#005EB8]">
                        {h.wte}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {h.bankHolHours} hrs/yr
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-semibold">
                        {h.entryTotalHours} hrs/yr
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-semibold">
                        {h.fiveYrTotalHours} hrs/yr
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-emerald-700">
                        {h.tenYrTotalHours} hrs/yr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Pre-Configured for 22.5h Part-Time */}
        <section id="calculator" className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-zinc-200/80 pb-2">
            <h2 className="text-lg font-bold text-zinc-950">
              Interactive Part-Time Hours, Shift &amp; Deduction Calculator
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              Pre-configured: 22.5 hrs/wk (0.6 WTE • 3 Days/Week)
            </span>
          </div>
          <Calculator
            initialBand="Band 5"
            initialStepIndex={0}
            initialContractedHours={22.5}
          />
        </section>

        <AffiliateCards />
        <EeatVerificationBlock contextLabel="NHS Part-Time Pro-Rata WTE Salary & Section 13 Leave" />
      </div>
    </div>
  );
}
