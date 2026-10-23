import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service & Disclaimer | NetPayScale UK",
  description:
    "Terms of service, usage conditions, and statutory calculation disclaimer for NetPayScale UK. Understand how calculations are derived.",
  alternates: {
    canonical: "https://netpayscale.uk/terms/",
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-bg-page py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium text-zinc-900">Terms of Service</span>
        </nav>

        {/* Header */}
        <div className="space-y-2 border-b border-zinc-200 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
            Terms of Service &amp; Disclaimer
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last updated: 24 October 2026 • Governing website access and calculation use
          </p>
        </div>

        {/* Content */}
        <article className="prose prose-zinc max-w-none text-xs sm:text-sm text-zinc-600 space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">1. Acceptance of Terms</h2>
            <p>
              By accessing and using <strong className="text-zinc-900">https://netpayscale.uk/</strong>, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4">
            <h2 className="text-base sm:text-lg font-bold text-amber-950">
              2. Financial &amp; Payroll Disclaimer (Notice of Independence)
            </h2>
            <p className="text-amber-900">
              <strong>NetPayScale UK is an independent computational resource</strong> created to assist NHS healthcare professionals in understanding Agenda for Change pay structures, High Cost Area Supplements, and statutory payroll deductions.
            </p>
            <p className="text-amber-900">
              <strong>We are not affiliated with, authorized by, or an official agency of:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-amber-900">
              <li>The National Health Service (NHS England, NHS Scotland, NHS Wales, or HSC Northern Ireland)</li>
              <li>NHS Employers or the NHS Pay Review Body (NHSPRB)</li>
              <li>HM Revenue &amp; Customs (HMRC) or the Department of Health and Social Care (DHSC)</li>
            </ul>
            <p className="text-amber-900 font-medium pt-1">
              All outputs provided by our calculators are for illustrative and informational estimation purposes only. They do not constitute formal financial, tax, or legal advice, nor do they replace your official monthly Electronic Staff Record (ESR) payslip issued by your employing NHS Trust.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">3. Mathematical Accuracy &amp; Regulatory Grounding</h2>
            <p>
              We strive for rigorous accuracy. Our calculation engine incorporates:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
              <li>The official <strong>2026/27 Agenda for Change (+3.3%) pay scales</strong> across Bands 2 through 9.</li>
              <li>High Cost Area Supplement (HCAS) boundaries under AfC Annex 9 (Inner London 20%, Outer London 15%, Fringe 5%).</li>
              <li>HMRC PAYE Income Tax brackets (including Scottish Parliament devolved tax rates) and Class 1 National Insurance thresholds.</li>
              <li>NHS 2015 CARE Pension tiered employee contributions (5.2% to 12.5% pre-tax deductions).</li>
              <li>Section 2 Unsocial Hours uplifts for night, Saturday, Sunday, and public holiday working.</li>
            </ul>
            <p>
              However, individual payroll situations may differ due to local Trust salary sacrifice arrangements (e.g. lease cars, cycle to work, childcare vouchers), secondary employments, emergency tax codes, or student loan thresholds. Always verify figures with your Trust&apos;s payroll department.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">4. Permitted Use</h2>
            <p>
              You are granted permission to access and utilize the tools on NetPayScale UK for personal, non-commercial purposes, and you may share calculation outputs (such as via WhatsApp or PDF download) with colleagues or financial institutions for mortgage or tenancy verification purposes.
            </p>
            <p>
              You agree not to scrape, automatedly harvest, reverse-engineer, or commercially resell our computational models without prior written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">5. Limitation of Liability</h2>
            <p>
              In no event shall NetPayScale UK or its operators be liable for any damages (including, without limitation, damages for loss of earnings, tax penalties, or financial planning decisions) arising out of the use or inability to use the calculations provided on this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">6. Amendments to Terms</h2>
            <p>
              We reserve the right to revise these Terms of Service at any time to reflect statutory changes in NHS pay circulars or UK tax law. Continued use of the website following any changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">7. Contact</h2>
            <p>
              Questions regarding these Terms of Service can be directed to{" "}
              <strong className="text-zinc-900 font-mono">contact@netpayscale.uk</strong> or submitted via our{" "}
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
