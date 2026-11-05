import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import MaternityCalculatorClient from "@/components/MaternityCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";

export const metadata: Metadata = {
  title: "NHS Maternity Pay Calculator 2026/27 (OMP + SMP & 2 Jobs Guide) | NetPayScale UK",
  description:
    "Calculate your exact 2026/27 NHS Occupational Maternity Pay (OMP) and £187.18/wk Statutory Maternity Pay (SMP) by Band. Includes 8w Full Pay, 18w Half Pay, equalised 9/12 month spread, and 2 jobs / NHS Bank maternity rules.",
  alternates: {
    canonical: "https://netpayscale.uk/maternity-pay-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/maternity-pay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Maternity Pay Calculator (Section 15 OMP & SMP): models 8 weeks Full Pay (100%), 18 weeks Half Pay (50%) + £187.18/wk SMP (£811.11/mo), 13 weeks SMP, equalised 9/12-month spread, and dual-employment (2 jobs / Substantive + Bank) SMP qualification rules.",
  },
  openGraph: {
    title: "NHS Maternity Pay Calculator 2026/27 (OMP + SMP & 2 Jobs) | NetPayScale UK",
    description:
      "Calculate your exact NHS maternity pay across Weeks 1–8 (Full Pay), Weeks 9–26 (Half Pay + SMP), and Weeks 27–39 (£187.18/wk SMP), spread equally over 9/12 months, or across 2 jobs.",
    url: "https://netpayscale.uk/maternity-pay-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [{ url: "https://netpayscale.uk/og-image.png", width: 1200, height: 630 }],
  },
};

const SMP_WEEKLY_2026 = 187.18;
const SMP_MONTHLY_2026 = (SMP_WEEKLY_2026 * 52) / 12; // £811.11/mo
const SMP_FOUR_WEEKLY_2026 = SMP_WEEKLY_2026 * 4; // £748.72

export default function MaternityPayCalculatorPage() {
  const matrixBands = nhsData.bands.filter((b) =>
    ["Band 2", "Band 3", "Band 4", "Band 5", "Band 6", "Band 7", "Band 8a"].includes(b.band)
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "NetPayScale UK NHS Pay Calculator",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Maternity Pay Calculator (2026/27)",
            item: "https://netpayscale.uk/maternity-pay-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": "https://netpayscale.uk/maternity-pay-calculator/#webapp",
        name: "NetPayScale UK — 2026/27 NHS Maternity Pay (OMP + SMP & 2 Jobs) Calculator",
        url: "https://netpayscale.uk/maternity-pay-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "GBP",
        },
        featureList: [
          "Agenda for Change Section 15 Occupational Maternity Pay (OMP) 8w Full + 18w Half Pay",
          "2026/27 Statutory Maternity Pay (SMP) £187.18/week (£811.11/month or £748.72 per 4 weeks)",
          "Equalised 9-Month (39-week) and 12-Month (52-week) ESR Payroll Spread Calculator",
          "Maternity Pay with 2 Jobs (Dual Contracts, Substantive + NHS Staff Bank, Two Employers)",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How is NHS Occupational Maternity Pay (OMP) calculated in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Agenda for Change Section 15, NHS staff with at least 12 months continuous service by the 11th week before their due date receive: 8 weeks at 100% Full Pay, 18 weeks at 50% Half Pay plus Statutory Maternity Pay (£187.18/week, capped at full pay), 13 weeks at Statutory Maternity Pay (£187.18/week = £811.11/month), and up to 13 weeks of unpaid maternity leave.",
            },
          },
          {
            "@type": "Question",
            name: "How does maternity pay work if I have 2 jobs (or NHS Substantive + NHS Bank)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If you have two separate employers (paying separate Class 1 National Insurance) and earn at least £125/week (2026/27 Lower Earnings Limit) in each job for the 26-week qualifying period, you can claim Statutory Maternity Pay (£187.18/wk) from BOTH jobs simultaneously (up to £374.36/wk combined). If your second job is NHS Staff Bank at the same NHS Trust, shifts worked during your 8-week relevant calculation period (Weeks 17–25 of pregnancy) increase your Average Weekly Earnings (AWE) for your main NHS maternity pay.",
            },
          },
          {
            "@type": "Question",
            name: "How much is £187.18 a week Statutory Maternity Pay (SMP) per month?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "At the 2026/27 flat rate of £187.18 per week, four weeks of SMP is £748.72 (£187.18 × 4), while a calendar month on an NHS ESR monthly payslip is £811.11 gross per month (£187.18 × 52 weeks ÷ 12 months). Because £811.11/month is below the £1,048/month (£12,570/year) PAYE Personal Allowance and National Insurance threshold, Weeks 27–39 SMP is usually paid with £0 income tax and £0 NI deductions.",
            },
          },
          {
            "@type": "Question",
            name: "Can I spread my NHS maternity pay equally across my maternity leave?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Most NHS Trusts allow you to request through ESR/Payroll that your Occupational Maternity Pay (OMP) be averaged and paid in equal monthly instalments over your 39 paid weeks (9 months) or across the full 52 weeks (12 months) to help with household budgeting.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            NetPayScale UK NHS Pay Calculator
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-semibold text-zinc-900">
            NHS Maternity Pay Calculator (2026/27)
          </span>
        </nav>

        <section className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-[#005EB8]">
            <span>Agenda for Change Section 15 • 2026/27 OMP, £187.18/wk SMP &amp; 2-Job Rules</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            NHS Maternity Pay Calculator 2026/27{" "}
            <span className="text-[#005EB8]">(OMP + SMP, Equal Spread &amp; 2 Jobs)</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Calculate your exact weekly and monthly net maternity pay with{" "}
            <strong className="text-zinc-900">NetPayScale UK</strong> across{" "}
            <strong>8 weeks Full Pay</strong>, <strong>18 weeks Half Pay + SMP (£187.18/wk)</strong>, and{" "}
            <strong>13 weeks SMP (£811.11/mo)</strong>—or model equalised 9/12-month ESR payslips and{" "}
            <strong>maternity pay with 2 jobs (Substantive + NHS Bank)</strong>.
          </p>
        </section>

        {/* Position 0 Direct Answer Box */}
        <section className="rounded-2xl border-2 border-[#005EB8]/25 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 p-5 sm:p-6 shadow-xs space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#005EB8]">
            Quick Answer: 2026/27 NHS Maternity Pay (Section 15 OMP &amp; £187.18/wk SMP)
          </div>
          <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed">
            Under <strong>Agenda for Change Section 15</strong>, NHS staff with 12+ months continuous service by the 11th week before their baby is due (Qualifying Week = Week 25 of pregnancy) receive: <strong>Weeks 1–8</strong> at <strong>100% Full Pay</strong>; <strong>Weeks 9–26 (18 weeks)</strong> at <strong>50% Half Pay + £187.18/wk Statutory Maternity Pay (SMP)</strong>; <strong>Weeks 27–39 (13 weeks)</strong> at <strong>£187.18/wk SMP</strong> (<strong>£748.72 per 4 weeks</strong> or <strong>£811.11 per calendar month</strong> on ESR); and <strong>Weeks 40–52</strong> unpaid. If you work <strong>2 jobs</strong> and earn at least <strong>£125/week</strong> in each, you can qualify for two separate SMP payments or boost your NHS Average Weekly Earnings (AWE) via Bank shifts in Weeks 17–25.
          </p>
        </section>

        <AdPlaceholder slotId="maternity-top" format="leaderboard" />

        <MaternityCalculatorClient />

        {/* Table 1: Statutory Section 15 Schedule */}
        <section
          aria-labelledby="section-15-schedule-heading"
          className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5"
        >
          <h2 id="section-15-schedule-heading" className="text-lg font-bold text-zinc-950">
            1. NHS Agenda for Change Section 15 Maternity Entitlement Schedule (2026/27)
          </h2>
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="section-15-schedule-heading"
            className="overflow-x-auto rounded-lg border border-zinc-200/80 focus:outline-2 focus:outline-[#005EB8]"
          >
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-2.5 px-3">Maternity Leave Period</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-2.5 px-3">Duration</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-2.5 px-3">Full NHS OMP + SMP Entitlement</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-2.5 px-3">SMP Only (Under 12m NHS Service)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800 font-sans">
                <tr>
                  <th scope="row" className="py-2.5 px-3 font-semibold text-zinc-950">Weeks 1 to 8</th>
                  <td className="py-2.5 px-3 font-mono">8 Weeks</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">
                    100% Full Average Weekly Earnings (inc. HCAS &amp; regular enhancements)
                  </td>
                  <td className="py-2.5 px-3">Weeks 1–6: 90% of Average Weekly Earnings</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-3 font-semibold text-zinc-950">Weeks 9 to 26</th>
                  <td className="py-2.5 px-3 font-mono">18 Weeks</td>
                  <td className="py-2.5 px-3 text-blue-700 font-semibold">
                    50% Half Pay + Statutory Maternity Pay (£187.18/wk), capped at 100% pay
                  </td>
                  <td className="py-2.5 px-3">Flat Rate SMP (£187.18/wk or 90% AWE if lower)</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-3 font-semibold text-zinc-950">Weeks 27 to 39</th>
                  <td className="py-2.5 px-3 font-mono">13 Weeks</td>
                  <td className="py-2.5 px-3">
                    Statutory Maternity Pay (£187.18/wk = £748.72 / 4 wks or £811.11 / calendar mo)
                  </td>
                  <td className="py-2.5 px-3">Statutory Maternity Pay (£187.18/wk = £811.11/mo)</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-3 font-semibold text-zinc-950">Weeks 40 to 52</th>
                  <td className="py-2.5 px-3 font-mono">13 Weeks</td>
                  <td className="py-2.5 px-3 text-zinc-500">
                    Unpaid Additional Maternity Leave (up to 10 paid Keeping in Touch KIT days allowed)
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500">Unpaid Additional Maternity Leave</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 2: Band-by-Band Monthly Net Maternity Pay Reference Matrix (Bands 2 to 8a) */}
        <section
          aria-labelledby="band-maternity-matrix-heading"
          className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5"
        >
          <div>
            <h2 id="band-maternity-matrix-heading" className="text-lg font-bold text-zinc-950">
              2. 2026/27 NHS Maternity Pay by Band (Bands 2–8a Monthly Net Take-Home &amp; Equal Spread)
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Estimated monthly net take-home pay during Weeks 1–8 (Full Pay), Weeks 9–26 (50% Half Pay + £811.11/mo SMP), and equalised 9-month or 12-month spread on entry spine points.
            </p>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-labelledby="band-maternity-matrix-heading"
            className="overflow-x-auto rounded-lg border border-zinc-200/80 focus:outline-2 focus:outline-[#005EB8]"
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-semibold">
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-3.5">NHS Pay Band (Entry)</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-3.5 text-right">Weeks 1–8 Net / Mo (Full)</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-3.5 text-right">Weeks 9–26 Net / Mo (Half + SMP)</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-3.5 text-right">Weeks 27–39 SMP / Mo</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-3.5 text-right">Equal Spread (9 Mos)</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-3.5 text-right">Equal Spread (12 Mos)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {matrixBands.map((b) => {
                  const res = calculateNHSPay({
                    band: b.band,
                    stepIndex: 0,
                    hcasZone: "standard",
                    contractedHours: 37.5,
                    nightHoursPerWeek: 0,
                    sundayHoursPerWeek: 0,
                    pensionOptedOut: false,
                    isScottishTax: false,
                    studentLoan: "none",
                  });
                  const awe = res.grossPay.weekly;
                  const w1to8 = awe;
                  const w9to26 = Math.min(awe, awe * 0.5 + SMP_WEEKLY_2026);
                  const w27to39 = SMP_WEEKLY_2026;
                  const totalGross = w1to8 * 8 + w9to26 * 18 + w27to39 * 13;
                  const penRate = res.pensionContribution.annual / res.grossPay.annual;
                  const annPen = totalGross * penRate;
                  const taxable = Math.max(0, totalGross - annPen - 12570);
                  const tax = taxable <= 37700 ? taxable * 0.2 : 37700 * 0.2 + (taxable - 37700) * 0.4;
                  const niable = Math.max(0, totalGross - 12570);
                  const ni = niable <= 37700 ? niable * 0.08 : 37700 * 0.08 + (niable - 37700) * 0.02;
                  const totalNet = totalGross - annPen - tax - ni;
                  const ratio = totalNet / totalGross;

                  return (
                    <tr key={b.band} className="hover:bg-zinc-50/70">
                      <th scope="row" className="py-3 px-3.5 font-bold text-zinc-950">
                        <Link href={`/bands/${b.slug}/`} className="text-[#005EB8] hover:underline">
                          2026/27 NHS {b.band}
                        </Link>{" "}
                        <span className="font-mono text-[11px] font-normal text-zinc-500">
                          ({formatCurrency(b.points[0].annualSalary)})
                        </span>
                      </th>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-700">
                        {formatCurrency(Math.round(res.netPay.monthly))}/mo
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-semibold text-blue-700">
                        {formatCurrency(Math.round(w9to26 * (52 / 12) * ratio))}/mo
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-zinc-700">
                        £{SMP_MONTHLY_2026.toFixed(2)}/mo
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-zinc-900">
                        {formatCurrency(Math.round(totalNet / 9))}/mo
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-bold text-zinc-900">
                        {formatCurrency(Math.round(totalNet / 12))}/mo
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Maternity Pay Calculator for 2 Jobs (Dual Contracts, Substantive + Bank, Two Employers) */}
        <section
          id="maternity-pay-2-jobs"
          aria-labelledby="two-jobs-maternity-heading"
          className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5"
        >
          <div>
            <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 mb-1.5">
              Dual Employment &amp; NHS Staff Bank Guide
            </span>
            <h2 id="two-jobs-maternity-heading" className="text-lg font-bold text-zinc-950">
              3. Maternity Pay Calculator for 2 Jobs: Dual NHS Contracts, Substantive + Bank &amp; Two Employers
            </h2>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              Many NHS nurses, midwives, HCAs, and AHPs hold <strong>two jobs</strong>—either two part-time NHS posts, a substantive contract plus <strong>NHS Staff Bank</strong> shifts, or an NHS role alongside a private/agency job. How your maternity pay is calculated depends on whether your National Insurance is aggregated under one employer or split across two separate employers:
            </p>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-labelledby="two-jobs-maternity-heading"
            className="overflow-x-auto rounded-lg border border-zinc-200/80 focus:outline-2 focus:outline-[#005EB8]"
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-semibold">
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-4">2-Job Working Pattern</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-4">Statutory Maternity Pay (SMP) Rule</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-4">NHS Occupational Maternity Pay (OMP) Rule</th>
                  <th scope="col" className="sticky top-0 bg-zinc-50 py-3 px-4">Financial Impact &amp; Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700 align-top">
                <tr>
                  <th scope="row" className="py-3.5 px-4 font-bold text-zinc-950">
                    Scenario A: Two Separate Employers (e.g., Two Different NHS Trusts or NHS + Private Employer)
                  </th>
                  <td className="py-3.5 px-4 leading-relaxed">
                    If you have worked for both employers for 26+ weeks by Week 25 of pregnancy and earn at least <strong>£125/week</strong> (2026/27 LEL) in <em>each</em> job, you get <strong>two separate SMP entitlements</strong> (up to <strong>2 × £187.18/wk = £374.36/wk</strong> or <strong>£1,622.23/mo</strong>).
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    If both jobs are substantive NHS contracts and you have 12+ months reckonable NHS service, you qualify for Section 15 OMP (8w Full + 18w Half Pay) on <strong>both NHS contracts</strong>.
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    Submit a separate <strong>MATB1 certificate</strong> (request a certified copy from your midwife) to both payroll departments at least 15 weeks before your due date.
                  </td>
                </tr>

                <tr>
                  <th scope="row" className="py-3.5 px-4 font-bold text-zinc-950">
                    Scenario B: Substantive NHS Contract + NHS Staff Bank at the Same NHS Trust
                  </th>
                  <td className="py-3.5 px-4 leading-relaxed">
                    Where the same NHS Trust pays both your substantive salary and Bank shifts under aggregated Class 1 NI, HMRC treats them as a single employment for SMP (one £187.18/wk flat-rate SMP).
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    Bank shifts paid during the <strong>8-week relevant calculation window (Weeks 17 to 25 of pregnancy)</strong> can increase your total Average Weekly Earnings (AWE), boosting your Weeks 1–6 (90% AWE) and OMP reference pay where Trust policy aggregates ESR assignments.
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    Work any planned extra <Link href="/bank-shift-calculator/" className="text-[#005EB8] underline font-semibold">NHS Bank Shifts</Link> during Weeks 17–25 of pregnancy (before the 15th week before your EWC) so they fall inside the 8-week AWE reference window.
                  </td>
                </tr>

                <tr>
                  <th scope="row" className="py-3.5 px-4 font-bold text-zinc-950">
                    Scenario C: £187.18 × 4 Weeks (£{SMP_FOUR_WEEKLY_2026.toFixed(2)}) vs. Monthly ESR Payslip (£{SMP_MONTHLY_2026.toFixed(2)})
                  </th>
                  <td className="py-3.5 px-4 leading-relaxed">
                    Many calculators multiply £187.18 × 4 weeks = <strong>£748.72</strong>. However, NHS ESR pays staff per calendar month (<strong>£187.18 × 52 weeks ÷ 12 months = £811.11/month</strong>).
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    During Weeks 9–26, £811.11/month SMP is added on top of 50% of your monthly NHS pay (capped at 100% full pay). During Weeks 27–39, you receive £811.11/month gross.
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    Because £811.11/mo is below the £1,048/mo PAYE tax and NI threshold, you keep ~100% of your Weeks 27–39 SMP net in your bank account.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <Link
              href="/annual-leave-calculator/"
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-semibold text-[#005EB8] hover:border-[#005EB8] hover:bg-white transition-colors"
            >
              Calculate NHS Annual Leave &amp; Bank Holidays Accrued on Maternity Leave →
            </Link>
            <Link
              href="/part-time-pay-calculator/"
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-semibold text-[#005EB8] hover:border-[#005EB8] hover:bg-white transition-colors"
            >
              Model Returning Part-Time (18.75h / 22.5h / 30h) After Maternity Leave →
            </Link>
            <Link
              href="/pension-calculator/"
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-semibold text-[#005EB8] hover:border-[#005EB8] hover:bg-white transition-colors"
            >
              NHS 2015 CARE Deemed Pension Accrual During Maternity Leave →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
