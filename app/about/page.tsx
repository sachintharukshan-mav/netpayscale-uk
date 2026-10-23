import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us & Calculation Methodology | NetPayScale UK",
  description:
    "Learn about NetPayScale UK, our institutional methodology, and the regulatory frameworks governing our 2026/27 Agenda for Change salary and pension calculators.",
  alternates: {
    canonical: "https://netpayscale.uk/about/",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-page py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium text-zinc-900">About &amp; Methodology</span>
        </nav>

        {/* Header */}
        <div className="space-y-2 border-b border-zinc-200 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
            About NetPayScale UK &amp; Methodology
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Institutional calculation models for 1.3M+ NHS Agenda for Change healthcare professionals
          </p>
        </div>

        {/* Content */}
        <article className="prose prose-zinc max-w-none text-xs sm:text-sm text-zinc-600 space-y-8 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">1. Our Mission</h2>
            <p>
              NetPayScale UK was developed to solve a widespread challenge faced by nurses, paramedics, healthcare assistants, allied health professionals (AHPs), and clinical managers: <strong>understanding exactly what lands in their bank account at the end of each month</strong>.
            </p>
            <p>
              With complex tiered NHS pension deductions, London Weighting caps, Section 2 unsocial hours uplifts, and student loan thresholds, gross salary figures published in NHS job adverts often provide little clarity on actual take-home pay. NetPayScale UK provides an instant, transparent, and accurate institutional-grade computational model accessible to all keyworkers free of charge.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">2. Our 6-Step Calculation Methodology</h2>
            <p>
              Every salary model generated on NetPayScale UK follows a strict 6-stage algorithmic process based on UK statutory regulations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
              <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-[11px] font-bold text-white">
                    1
                  </span>
                  <h3 className="text-xs font-bold text-zinc-950">Agenda for Change Base Salary</h3>
                </div>
                <p className="text-xs text-zinc-600">
                  Calculated using the official <strong>2026/2027 +3.3% pay settlement</strong> across all 9 AfC pay bands, reflecting entry, intermediate, and top experience step points.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-[11px] font-bold text-white">
                    2
                  </span>
                  <h3 className="text-xs font-bold text-zinc-950">High Cost Area Supplement (HCAS)</h3>
                </div>
                <p className="text-xs text-zinc-600">
                  Applied under AfC Annex 9: <strong>Inner London (20%, min £5,794, max £8,746)</strong>, <strong>Outer London (15%, min £4,870, max £6,137)</strong>, and <strong>Fringe (5%, min £1,346, max £2,270)</strong>.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-[11px] font-bold text-white">
                    3
                  </span>
                  <h3 className="text-xs font-bold text-zinc-950">Section 2 Shift Enhancements</h3>
                </div>
                <p className="text-xs text-zinc-600">
                  Models unsocial hours enhancements for night duty (typically +30% for Bands 4–9, +47% for Bands 2–3) and weekend/Sunday shifts (up to +60% or +83%).
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-[11px] font-bold text-white">
                    4
                  </span>
                  <h3 className="text-xs font-bold text-zinc-950">NHS 2015 CARE Pension Scheme</h3>
                </div>
                <p className="text-xs text-zinc-600">
                  Calculates tiered employee pension contributions (5.2% to 12.5%). Deducted prior to tax under net pay arrangements, yielding automatic tax relief at source.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-[11px] font-bold text-white">
                    5
                  </span>
                  <h3 className="text-xs font-bold text-zinc-950">HMRC PAYE Tax &amp; National Insurance</h3>
                </div>
                <p className="text-xs text-zinc-600">
                  Applies the standard £12,570 personal allowance, 20% basic, 40% higher, and 45% additional rates (or devolved Scottish rates), plus 8% employee Class 1 NIC.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005EB8] text-[11px] font-bold text-white">
                    6
                  </span>
                  <h3 className="text-xs font-bold text-zinc-950">Student Loan Deductions</h3>
                </div>
                <p className="text-xs text-zinc-600">
                  Deducts repayments based on statutory thresholds: Plan 1 (£24,990 @ 9%), Plan 2 (£27,295 @ 9%), Plan 4 Scotland (£31,395 @ 9%), Plan 5, and Postgraduate (£21,000 @ 6%).
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">3. Primary Data Sources &amp; Governance</h2>
            <p>
              Our computational logic is strictly grounded in officially published UK statutory frameworks:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
              <li>
                <strong>NHS Staff Council:</strong> NHS Terms and Conditions of Service Handbook (AfC Pay Circulars &amp; Annex 9 HCAS schedules).
              </li>
              <li>
                <strong>NHS Business Services Authority (NHSBSA):</strong> 2015 NHS Pension Scheme regulations and employee contribution tier thresholds.
              </li>
              <li>
                <strong>HM Revenue &amp; Customs (HMRC):</strong> PAYE Income Tax thresholds, Scottish Income Tax bands, and National Insurance Contributions tables.
              </li>
              <li>
                <strong>Student Loans Company (SLC):</strong> Annual statutory repayment thresholds and rates.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">4. Continuous Verification &amp; Auditing</h2>
            <p>
              Our models undergo regular automated assertion testing to ensure mathematical parity with actual Electronic Staff Record (ESR) payslip statements. If you identify a discrepancy or wish to request the addition of a specific Trust or role model, please visit our{" "}
              <Link href="/contact/" className="text-nhs-blue underline hover:text-blue-800">
                Contact Page
              </Link>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
