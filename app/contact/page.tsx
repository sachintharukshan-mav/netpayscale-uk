import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us & Editorial Feedback | NetPayScale UK",
  description:
    "Contact the NetPayScale UK editorial and computational team. Report discrepancies, submit feedback, or request new NHS Trust salary models.",
  alternates: {
    canonical: "https://netpayscale.uk/contact/",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-page py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium text-zinc-900">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="space-y-2 border-b border-zinc-200 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
            Contact &amp; Support
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Get in touch with the NetPayScale UK computational and editorial team
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6 text-xs sm:text-sm text-zinc-600 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">We Welcome Your Feedback</h2>
              <p>
                NetPayScale UK is dedicated to providing NHS healthcare workers with the most accurate, up-to-date Agenda for Change take-home pay calculations possible.
              </p>
              <p>
                Whether you are a nurse, paramedic, doctor, allied health professional, or NHS Trust payroll manager, we welcome your feedback, correction requests, and suggestions for additional regional models.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">How to Reach Us</h2>
              <div className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#005EB8] text-[22px] shrink-0">mail</span>
                  <div>
                    <h3 className="font-bold text-zinc-950 text-xs sm:text-sm">Editorial &amp; Calculation Queries</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      For mathematical discrepancy reports, data source queries, or press inquiries:
                    </p>
                    <a
                      href="mailto:contact@netpayscale.uk"
                      className="font-mono font-bold text-nhs-blue hover:underline text-xs sm:text-sm mt-1 inline-block"
                    >
                      contact@netpayscale.uk
                    </a>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-3 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#005EB8] text-[22px] shrink-0">schedule</span>
                  <div>
                    <h3 className="font-bold text-zinc-950 text-xs sm:text-sm">Response Time Commitment</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Our editorial team reviews all calculation feedback and typically responds within <strong>24 to 48 business hours</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">Reporting Calculation Discrepancies</h2>
              <p>
                If your actual ESR payslip differs from our calculator&apos;s output, please include the following details in your message to help us investigate:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>Your Agenda for Change Pay Band and experience step point</li>
                <li>Your NHS Trust or geographic region (Inner London, Outer London, Fringe, or National)</li>
                <li>Your contracted weekly hours and unsocial hours breakdown</li>
                <li>Any local salary sacrifice schemes or non-standard tax codes</li>
              </ul>
            </section>
          </div>

          {/* Quick Links Card */}
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-5 space-y-3 text-xs">
              <h3 className="font-bold text-zinc-950 text-xs uppercase tracking-wider">Helpful Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about/" className="text-nhs-blue hover:underline font-medium block">
                    Our Calculation Methodology →
                  </Link>
                </li>
                <li>
                  <Link href="/privacy/" className="text-nhs-blue hover:underline font-medium block">
                    Privacy &amp; Cookie Policy →
                  </Link>
                </li>
                <li>
                  <Link href="/terms/" className="text-nhs-blue hover:underline font-medium block">
                    Terms of Service &amp; Disclaimer →
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-nhs-blue hover:underline font-medium block">
                    Frequently Asked Questions →
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-200/90 bg-white p-5 space-y-2 text-xs">
              <span className="font-semibold text-zinc-900 block">Need Instant Calculation?</span>
              <p className="text-zinc-500">
                You can calculate take-home pay across 490+ UK clinical roles and regions directly on our homepage.
              </p>
              <Link
                href="/#calculator"
                className="inline-block mt-2 font-semibold text-nhs-blue hover:underline"
              >
                Launch Calculator →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
