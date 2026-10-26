import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import MaternityCalculatorClient from "@/components/MaternityCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";

export const metadata: Metadata = {
  title: "NHS Maternity Pay Calculator 2026/27 (OMP + SMP) | NetPayScale UK",
  description:
    "Calculate your exact 2026/27 NHS Occupational Maternity Pay (OMP) and Statutory Maternity Pay (SMP) by Band. Compare 8 weeks full pay, 18 weeks half pay + SMP, and equalised 9 or 12 month payslips.",
  alternates: {
    canonical: "https://netpayscale.uk/maternity-pay-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/maternity-pay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Maternity Pay Calculator (Section 15 OMP & SMP): models 8 weeks Full Pay (100%), 18 weeks Half Pay (50%) + £187.18/wk SMP, 13 weeks SMP, and 13 weeks unpaid leave, plus equal monthly spread and holiday accrual.",
  },
  openGraph: {
    title: "NHS Maternity Pay Calculator 2026/27 (OMP + SMP) | NetPayScale UK",
    description:
      "Calculate your exact NHS maternity pay across Weeks 1–8 (Full Pay), Weeks 9–26 (Half Pay + SMP), and Weeks 27–39 (SMP), or spread equally over 9 or 12 months.",
    url: "https://netpayscale.uk/maternity-pay-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [{ url: "https://netpayscale.uk/og-image.png", width: 1200, height: 630 }],
  },
};

export default function MaternityPayCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://netpayscale.uk/" },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Maternity Pay Calculator (2026/27)",
            item: "https://netpayscale.uk/maternity-pay-calculator/",
          },
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
              text: "Under Agenda for Change Section 15, NHS staff with at least 12 months continuous service by the 11th week before their due date receive: 8 weeks at 100% Full Pay, 18 weeks at 50% Half Pay plus Statutory Maternity Pay (£187.18/week, capped at full pay), 13 weeks at Statutory Maternity Pay (£187.18/week), and up to 13 weeks of unpaid maternity leave.",
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
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-semibold text-zinc-900">
            NHS Maternity Pay Calculator (2026/27)
          </span>
        </nav>

        <section className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-[#005EB8]">
            <span>Agenda for Change Section 15 • 2026/27 OMP &amp; SMP Verified</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            NHS Maternity Pay Calculator 2026/27{" "}
            <span className="text-[#005EB8]">(OMP + SMP &amp; Equalised Spread)</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Calculate your exact weekly and monthly net maternity pay across{" "}
            <strong>8 weeks Full Pay</strong>, <strong>18 weeks Half Pay + SMP (£187.18/wk)</strong>, and{" "}
            <strong>13 weeks SMP</strong>—or see how much you will receive each month if you ask NHS Payroll to spread your pay equally over 9 or 12 months.
          </p>
        </section>

        <AdPlaceholder slotId="maternity-top" format="leaderboard" />

        <MaternityCalculatorClient />

        {/* Direct Answer & Statutory Reference Table */}
        <section className="rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-zinc-950">
            NHS Agenda for Change Section 15 Maternity Entitlement Schedule (2026/27)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 font-sans font-semibold">
                  <th className="py-2.5 px-3">Maternity Leave Period</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Full NHS OMP + SMP Entitlement</th>
                  <th className="py-2.5 px-3">SMP Only (Under 12m NHS Service)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800 font-sans">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-zinc-950">Weeks 1 to 8</td>
                  <td className="py-2.5 px-3 font-mono">8 Weeks</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">
                    100% Full Average Weekly Earnings (inc. HCAS &amp; regular enhancements)
                  </td>
                  <td className="py-2.5 px-3">Weeks 1–6: 90% of Average Weekly Earnings</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-zinc-950">Weeks 9 to 26</td>
                  <td className="py-2.5 px-3 font-mono">18 Weeks</td>
                  <td className="py-2.5 px-3 text-blue-700 font-semibold">
                    50% Half Pay + Statutory Maternity Pay (£187.18/wk), capped at 100% pay
                  </td>
                  <td className="py-2.5 px-3">Flat Rate SMP (£187.18/wk or 90% AWE if lower)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-zinc-950">Weeks 27 to 39</td>
                  <td className="py-2.5 px-3 font-mono">13 Weeks</td>
                  <td className="py-2.5 px-3">Statutory Maternity Pay (£187.18/wk)</td>
                  <td className="py-2.5 px-3">Statutory Maternity Pay (£187.18/wk)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-zinc-950">Weeks 40 to 52</td>
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
      </div>
    </div>
  );
}
