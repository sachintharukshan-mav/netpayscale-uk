import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | NetPayScale UK",
  description:
    "Privacy Policy for NetPayScale UK. Understand how we handle data, cookies, local storage, and third-party advertising partners in compliance with UK GDPR.",
  alternates: {
    canonical: "https://netpayscale.uk/privacy/",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-page py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium text-zinc-900">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="space-y-2 border-b border-zinc-200 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
            Privacy &amp; Cookie Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last updated: 24 October 2026 • Effective for all NetPayScale UK users
          </p>
        </div>

        {/* Content */}
        <article className="prose prose-zinc max-w-none text-xs sm:text-sm text-zinc-600 space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">1. Introduction</h2>
            <p>
              NetPayScale UK (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) is committed to protecting your privacy and personal data. This Privacy Policy outlines our practices regarding data collection, usage, and disclosure when you access our salary calculator utilities via <strong className="text-zinc-900">https://netpayscale.uk/</strong>.
            </p>
            <p>
              We adhere strictly to the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">2. Client-Side Computational Processing (Zero Storage of Salary Inputs)</h2>
            <p>
              When you use our NHS salary calculator, select an Agenda for Change band, enter overtime/night hours, or adjust tax codes, <strong>all calculations are executed entirely within your web browser</strong> (client-side JavaScript).
            </p>
            <p>
              We do not transmit, log, store, or profile your personal salary inputs, hours worked, pension choices, or estimated net pay figures on any remote database or server.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">3. Cookies and Local Storage</h2>
            <p>
              We use standard cookies and browser local storage strictly to improve your browsing experience:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
              <li>
                <strong>Essential Cookies &amp; Local Storage:</strong> Used to remember your cookie consent preferences and retain calculator UI state (such as your preferred pay timeframe) across visits.
              </li>
              <li>
                <strong>Analytical Cookies:</strong> Help us understand aggregate, anonymised visitor behavior (e.g. pages viewed, browser type) to optimise page performance and server capacity.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">4. Third-Party Advertising &amp; Google AdSense Disclosures</h2>
            <p>
              To maintain NetPayScale UK as a free public utility for healthcare workers, we may partner with third-party advertising networks, including Google AdSense and Google DoubleClick:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalised advertising by visiting{" "}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nhs-blue underline hover:text-blue-800"
                >
                  Google Ads Settings
                </a>{" "}
                or via{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nhs-blue underline hover:text-blue-800"
                >
                  www.aboutads.info
                </a>.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">5. Log Files &amp; Hosting Architecture</h2>
            <p>
              Our website is hosted on Cloudflare Pages. Like most web hosting platforms, Cloudflare logs non-personally identifiable technical information (such as internet protocol [IP] addresses, browser type, internet service provider [ISP], referring/exit pages, and timestamps). This information is used solely for security auditing, DDoS protection, and technical diagnostics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">6. Your Data Rights</h2>
            <p>
              Under UK GDPR, you have rights regarding your personal data, including the right to request access, rectification, erasure, or restriction of processing. Because we do not store personal profiles or identifiable user accounts, we hold no personal data linked to your identity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-950">7. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please reach out to us via our{" "}
              <Link href="/contact/" className="text-nhs-blue underline hover:text-blue-800">
                Contact Page
              </Link>{" "}
              or by email at <strong className="text-zinc-900 font-mono">contact@netpayscale.uk</strong>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
