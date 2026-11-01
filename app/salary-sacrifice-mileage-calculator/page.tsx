import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import CarMileageCalculatorClient from "@/components/CarMileageCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import EeatVerificationBlock from "@/components/EeatVerificationBlock";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

export const metadata: Metadata = {
  title:
    "NHS Salary Sacrifice Car & Section 17 Mileage Calculator 2026/27 (59p/Mile)",
  description:
    "Calculate your 2026/27 NHS Fleet Solutions EV salary sacrifice car net take-home cost, 4% BiK tax, and 1/54th CARE pension impact—plus NHS Section 17 mileage rates (59p/mile first 3,500 miles, 24p above) and HMRC P87 tax relief.",
  alternates: {
    canonical: "https://netpayscale.uk/salary-sacrifice-mileage-calculator/",
    types: {
      "text/markdown":
        "https://netpayscale.uk/salary-sacrifice-mileage-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "In 2026/27, an NHS salary sacrifice electric car lease reduces gross salary before PAYE tax (20%/40%), Class 1 NI (8%/2%), Student Loan (9%), and NHS Pension contributions, attracting 4% Benefit-in-Kind (BiK) tax on the P11D list price while reducing annual 2015 CARE pension accrual by 1/54th of the sacrificed salary. Under Section 17 of the NHS Terms and Conditions Handbook, standard business mileage is reimbursed at 59p/mile for the first 3,500 miles (£2,065/yr) and 24p/mile thereafter (or 30p/mile reserve rate for lease cars).",
  },
  openGraph: {
    title:
      "NHS Salary Sacrifice Car (EV Fleet) & Section 17 Mileage Calculator 2026/27",
    description:
      "Model your exact post-tax NHS EV lease car cost, 1/54th CARE pension trade-off, and Section 17 (59p/mile) business mileage reimbursement.",
    url: "https://netpayscale.uk/salary-sacrifice-mileage-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

export default function SalarySacrificeMileagePage() {
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
            name: "NHS Salary Sacrifice Car & Section 17 Mileage Calculator",
            item: "https://netpayscale.uk/salary-sacrifice-mileage-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Salary Sacrifice EV Car & Section 17 Mileage Calculator 2026/27",
        url: "https://netpayscale.uk/salary-sacrifice-mileage-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        description:
          "Interactive 2026/27 NHS Fleet EV salary sacrifice car lease and Section 17 business mileage (59p/24p/30p) calculator with 1/54th CARE pension and HMRC P87 MAR analysis.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What are the NHS Section 17 mileage rates in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Section 17 of the NHS Terms and Conditions of Service Handbook, the standard car rate is 59 pence per mile for the first 3,500 business miles each payroll year (£2,065/year) and 24 pence per mile above 3,500 miles. The reserve rate (used for NHS lease cars, recall to duty, and declined lease cars) is 30 pence per mile for all miles. Motorcycles receive 29p/mile, pedal cycles receive 20p/mile, and carrying heavy or bulky equipment adds +3p/mile.",
            },
          },
          {
            "@type": "Question",
            name: "How does an NHS salary sacrifice car affect my 2015 CARE NHS Pension?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Because the 2015 NHS Pension Scheme is a Career Average Revalued Earnings (CARE) scheme that accrues at 1/54th of your pensionable pay each year, sacrificing gross salary for a lease car reduces your pensionable pay. Every £5,400/year (£450/month) of gross salary sacrificed reduces that year's guaranteed annual pension accrual by £100/year for life (£300/year over a 3-year lease before CPI+1.5% revaluation).",
            },
          },
          {
            "@type": "Question",
            name: "Is NHS mileage reimbursement taxed above 45p per mile?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. HMRC's Approved Mileage Allowance Payments (AMAP) tax-free threshold is 45p/mile for the first 10,000 miles. On the NHS 59p standard rate, the first 45p is tax-free and the 14p/mile margin above 45p (£490/yr at 3,500 miles) is treated as taxable income subject to PAYE tax and Class 1 NI. Conversely, miles paid at 24p (above 3,500 miles) or 30p (reserve/lease car rate) sit below 45p, allowing you to claim HMRC Form P87 Mileage Allowance Relief (MAR) on the 21p or 15p shortfall.",
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
            NHS Salary Sacrifice Car &amp; Section 17 Mileage Calculator
          </span>
        </nav>

        <AdPlaceholder slotId="carmileage-top-banner" format="leaderboard" />

        {/* Hero & Direct Answer */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3 max-w-4xl">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-mono font-semibold text-[#005EB8] border border-blue-200">
              NHS Fleet Solutions EV • 4% BiK (2026/27) • Section 17 Mileage (59p / 24p / 30p)
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              NHS Salary Sacrifice Car &amp; Section 17 Mileage Calculator
              2026/27
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Model your exact post-tax monthly cost on an{" "}
              <strong>NHS Fleet Solutions / Tusker EV salary sacrifice car</strong>{" "}
              (including <strong>4% 2026/27 EV Benefit-in-Kind</strong> and the{" "}
              <strong>1/54th CARE pension trade-off</strong>), and calculate your{" "}
              <strong>Section 17 NHS business mileage</strong> (`59p/mile` first
              3,500 miles, `24p/mile` above, `30p/mile` lease car reserve rate)
              alongside HMRC Form P87 tax relief.
            </p>
          </div>

          {/* Direct Answer Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>
                Direct Answer · 2026/27 NHS Car Salary Sacrifice &amp; Section 17 Mileage Key Figures
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Standard Car (&le;3,500m)
                </span>
                <span className="font-mono font-black text-emerald-700 text-base block">
                  59p / mile
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  £2,065/yr (45p tax-free + 14p taxed)
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Above 3,500 Miles
                </span>
                <span className="font-mono font-black text-[#005EB8] text-base block">
                  24p / mile
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  Tax-free + 21p/m P87 MAR relief
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Lease / Reserve Rate
                </span>
                <span className="font-mono font-black text-purple-700 text-base block">
                  30p / mile
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  Tax-free + 15p/m P87 MAR relief
                </span>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  EV BiK Rate (2026/27)
                </span>
                <span className="font-mono font-black text-zinc-950 text-base block">
                  4% of P11D
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  1/54th pension lost on gross lease
                </span>
              </div>
            </div>
          </div>

          <ShareBreakdownButton
            shareText="NHS Salary Sacrifice Car & Section 17 Mileage Calculator 2026/27: Compare EV lease net cost, 1/54th pension trade-off, and 59p/24p/30p Section 17 mileage rates:"
            url="https://netpayscale.uk/salary-sacrifice-mileage-calculator/"
            variant="light"
            label="Share NHS Car & Mileage Calculator"
          />
        </section>

        {/* Interactive Dual Calculator */}
        <CarMileageCalculatorClient />

        {/* Section 17 Master Rate Schedule Table */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="space-y-1.5">
            <h2
              id="sec17-mileage-caption"
              className="text-lg sm:text-xl font-bold text-zinc-950"
            >
              3. Official NHS Section 17 Business Mileage Rates vs. HMRC AMAP
              Tax Rules (2026/27)
            </h2>
            <p className="text-xs text-zinc-500">
              Complete rate schedule from Section 17 of the NHS Terms and
              Conditions of Service Handbook compared against HMRC Employment
              Income Manual (EIM31240 / EIM31335).
            </p>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-labelledby="sec17-mileage-caption"
            className="overflow-x-auto rounded-xl border border-zinc-200/80 max-w-full"
          >
            <table className="w-full text-left text-xs font-mono border-separate border-spacing-0">
              <caption className="sr-only">
                NHS Section 17 Mileage Rates and HMRC AMAP Tax Treatment
              </caption>
              <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                <tr>
                  <th
                    scope="col"
                    className="py-2.5 px-3 border-b border-zinc-200 sticky left-0 bg-zinc-50 z-20"
                  >
                    Vehicle / Category
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    NHS Sec 17 Rate
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    Annual Threshold
                  </th>
                  <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                    HMRC Tax-Free AMAP
                  </th>
                  <th
                    scope="col"
                    className="py-2.5 px-3 border-b border-zinc-200 text-right"
                  >
                    Tax / P87 MAR Treatment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                <tr>
                  <th
                    scope="row"
                    className="py-2.5 px-3 font-sans font-bold text-zinc-950 sticky left-0 bg-white border-b border-zinc-100"
                  >
                    Car (Standard Rate)
                  </th>
                  <td className="py-2.5 px-3 font-bold text-emerald-700 border-b border-zinc-100">
                    59p / mile
                  </td>
                  <td className="py-2.5 px-3 font-sans border-b border-zinc-100">
                    Up to 3,500 miles/yr
                  </td>
                  <td className="py-2.5 px-3 border-b border-zinc-100">45p / mile</td>
                  <td className="py-2.5 px-3 text-right font-sans text-rose-700 border-b border-zinc-100">
                    14p/mile taxable margin (PAYE + NI)
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-2.5 px-3 font-sans font-bold text-zinc-950 sticky left-0 bg-white border-b border-zinc-100"
                  >
                    Car (Above Threshold)
                  </th>
                  <td className="py-2.5 px-3 font-bold text-[#005EB8] border-b border-zinc-100">
                    24p / mile
                  </td>
                  <td className="py-2.5 px-3 font-sans border-b border-zinc-100">
                    Over 3,500 miles/yr
                  </td>
                  <td className="py-2.5 px-3 border-b border-zinc-100">
                    45p (&le;10k miles)
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans text-emerald-700 border-b border-zinc-100">
                    100% Tax-Free + Claim P87 on 21p gap
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-2.5 px-3 font-sans font-bold text-zinc-950 sticky left-0 bg-white border-b border-zinc-100"
                  >
                    Reserve / NHS Lease Car
                  </th>
                  <td className="py-2.5 px-3 font-bold text-purple-700 border-b border-zinc-100">
                    30p / mile
                  </td>
                  <td className="py-2.5 px-3 font-sans border-b border-zinc-100">
                    All business miles
                  </td>
                  <td className="py-2.5 px-3 border-b border-zinc-100">
                    45p (&le;10k miles)
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans text-emerald-700 border-b border-zinc-100">
                    100% Tax-Free + Claim P87 on 15p gap
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-2.5 px-3 font-sans font-bold text-zinc-950 sticky left-0 bg-white border-b border-zinc-100"
                  >
                    Motorcycle
                  </th>
                  <td className="py-2.5 px-3 font-bold text-zinc-900 border-b border-zinc-100">
                    29p / mile
                  </td>
                  <td className="py-2.5 px-3 font-sans border-b border-zinc-100">
                    All business miles
                  </td>
                  <td className="py-2.5 px-3 border-b border-zinc-100">24p / mile</td>
                  <td className="py-2.5 px-3 text-right font-sans text-rose-700 border-b border-zinc-100">
                    5p/mile taxable margin
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-2.5 px-3 font-sans font-bold text-zinc-950 sticky left-0 bg-white border-b border-zinc-100"
                  >
                    Pedal Cycle
                  </th>
                  <td className="py-2.5 px-3 font-bold text-zinc-900 border-b border-zinc-100">
                    20p / mile
                  </td>
                  <td className="py-2.5 px-3 font-sans border-b border-zinc-100">
                    All business miles
                  </td>
                  <td className="py-2.5 px-3 border-b border-zinc-100">20p / mile</td>
                  <td className="py-2.5 px-3 text-right font-sans text-emerald-700 border-b border-zinc-100">
                    100% Tax-Free (0p difference)
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="py-2.5 px-3 font-sans font-bold text-zinc-950 sticky left-0 bg-white"
                  >
                    Heavy / Bulky Equipment
                  </th>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">+3p / mile</td>
                  <td className="py-2.5 px-3 font-sans">Added per eligible mile</td>
                  <td className="py-2.5 px-3">Included in AMAP</td>
                  <td className="py-2.5 px-3 text-right font-sans text-zinc-600">
                    Taxed if total rate &gt;45p/mile
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <AffiliateCards />
        <EeatVerificationBlock contextLabel="NHS Fleet Salary Sacrifice (HMRC BiK 2026/27) & Section 17 Mileage Rules" />
      </div>
    </div>
  );
}
