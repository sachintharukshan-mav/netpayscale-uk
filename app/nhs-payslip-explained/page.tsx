import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import EsrPayslipDecoderClient from "@/components/EsrPayslipDecoderClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import AffiliateCards from "@/components/AffiliateCards";
import EeatVerificationBlock from "@/components/EeatVerificationBlock";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

export const metadata: Metadata = {
  title:
    "NHS Payslip Explained 2026/27: Every ESR Code (EN, AfC Absence, NP, WTD) Decoded",
  description:
    "Decode every line on your 2026/27 NHS Electronic Staff Record (ESR) payslip. Find out what Night Duty EN, AfC Absence, NP, WTD Pay, PAID/DUE hours, and 1257L CUMUL mean, plus verify your shift enhancements.",
  alternates: {
    canonical: "https://netpayscale.uk/nhs-payslip-explained/",
    types: {
      "text/markdown": "https://netpayscale.uk/nhs-payslip-explained.md",
    },
  },
  other: {
    "ai-summary":
      "On an NHS Electronic Staff Record (ESR) payslip: 'EN' stands for Section 2 Unsocial Hours Enhancement (+44%/+88% Bands 2–3; +30%/+60% Bands 4–9); 'AfC Absence' is Section 13.9 average unsocial hours holiday pay top-up paid when taking annual leave; 'NP' means Non-Pensionable (used for overtime holiday pay 'AfC Absence NP'); and 'WTD Pay' is rolled-up +12.07% Working Time Directive holiday pay on Bank shifts.",
  },
  openGraph: {
    title:
      "NHS Payslip Explained 2026/27: Interactive ESR Code Decoder (EN, AfC Absence, WTD)",
    description:
      "Interactive NHS ESR payslip code lookup and shift enhancement verifier. Decode EN, AfC Absence, NP, WTD Pay, and fractional PAID/DUE hours.",
    url: "https://netpayscale.uk/nhs-payslip-explained/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

export default function NhsPayslipExplainedPage() {
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
            name: "NHS Payslip Explained (ESR Code Decoder)",
            item: "https://netpayscale.uk/nhs-payslip-explained/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS ESR Payslip Code Decoder & Enhancement Verifier 2026/27",
        url: "https://netpayscale.uk/nhs-payslip-explained/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        description:
          "Interactive NHS Electronic Staff Record (ESR) payslip code dictionary and Section 2 / Section 13.9 AfC Absence & WTD holiday pay calculator.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What does AfC Absence or AfC Absence NP mean on an NHS payslip?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Section 13.9 of the NHS Terms and Conditions of Service Handbook, staff taking annual leave must receive their normal average pay including regular unsocial hours enhancements. 'AfC Absence' is the pensionable holiday pay top-up calculated from your average Night, Saturday, and Sunday enhancements over the reference period. 'AfC Absence NP' (Non-Pensionable) is the holiday pay top-up calculated on regularly worked non-pensionable overtime.",
            },
          },
          {
            "@type": "Question",
            name: "Why are the PAID/DUE hours on my NHS ESR payslip much smaller than WKD/EARNED hours?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Because your basic daytime pay for those hours is already included inside your monthly 'Basic Pay' line! For unsocial enhancements ('Night Duty EN', 'Saturday EN', 'Sunday EN'), ESR multiplies your hours worked ('WKD/EARNED') by the enhancement percentage (e.g., 34.50 hours × 30% = 10.35 'PAID/DUE' hours) and pays those fractional hours at your plain hourly rate.",
            },
          },
          {
            "@type": "Question",
            name: "What does WTD Pay mean on an NHS Bank payslip?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "WTD Pay stands for Working Time Directive holiday pay. Because NHS Staff Bank shifts do not accrue separate paid annual leave days on a substantive contract, Trusts pay a rolled-up statutory holiday uplift of +12.07% (5.6 weeks holiday ÷ 46.4 working weeks) on top of your bank shift earnings.",
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
            NHS Payslip Explained (ESR Code Decoder 2026/27)
          </span>
        </nav>

        <AdPlaceholder slotId="payslip-top-banner" format="leaderboard" />

        {/* Hero & Direct Answer */}
        <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3 max-w-4xl">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-mono font-semibold text-[#005EB8] border border-blue-200">
              Electronic Staff Record (ESR) • Section 2 Enhancements • Section 13.9 AfC Absence
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              NHS Payslip Explained 2026/27: Every ESR Code (`EN`, `AfC Absence`,
              `NP`, `WTD`) Decoded
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Understand every line on your{" "}
              <strong>NHS Electronic Staff Record (ESR)</strong> payslip. Verify
              why ESR converts your shift hours into fractional{" "}
              <strong>PAID/DUE</strong> hours, check your{" "}
              <strong>AfC Absence</strong> holiday pay enhancement top-up, and
              search all 18+ official NHS payroll codes.
            </p>
          </div>

          {/* Direct Answer Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-5 text-xs sm:text-sm text-emerald-950 leading-relaxed space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-cash-emerald pulse-glow-dot shrink-0" />
              <span>
                Direct Answer · The 4 Most Searched NHS ESR Payslip Codes Explained
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100 space-y-1">
                <span className="font-mono font-black text-[#005EB8] text-sm block">
                  Night / Sat / Sun EN
                </span>
                <p className="text-zinc-600 text-[11px] leading-snug">
                  <strong>Enhancement (Sec 2):</strong> Paid on top of basic pay
                  (+44%/+88% Bands 2–3; +30%/+60% Bands 4–9). Fully{" "}
                  <strong>Pensionable</strong>.
                </p>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100 space-y-1">
                <span className="font-mono font-black text-emerald-700 text-sm block">
                  AfC Absence
                </span>
                <p className="text-zinc-600 text-[11px] leading-snug">
                  <strong>Holiday Pay Top-Up (Sec 13.9):</strong> Your average
                  unsocial hours enhancement paid automatically while you are on
                  annual leave.
                </p>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100 space-y-1">
                <span className="font-mono font-black text-amber-700 text-sm block">
                  AfC Absence NP
                </span>
                <p className="text-zinc-600 text-[11px] leading-snug">
                  <strong>Non-Pensionable (`NP`):</strong> Holiday pay top-up
                  calculated on regular overtime worked above 37.5 hours/week.
                </p>
              </div>
              <div className="rounded-lg bg-white/90 p-3 border border-emerald-100 space-y-1">
                <span className="font-mono font-black text-purple-700 text-sm block">
                  WTD Pay (+12.07%)
                </span>
                <p className="text-zinc-600 text-[11px] leading-snug">
                  <strong>Working Time Directive:</strong> Rolled-up +12.07%
                  statutory holiday pay added to NHS Staff Bank shifts.
                </p>
              </div>
            </div>
          </div>

          <ShareBreakdownButton
            shareText="NHS Payslip Explained 2026/27: Decode Night Duty EN, AfC Absence, NP, WTD Pay (+12.07%), and fractional PAID/DUE hours on your ESR payslip:"
            url="https://netpayscale.uk/nhs-payslip-explained/"
            variant="light"
            label="Share NHS ESR Payslip Decoder with Colleagues"
          />
        </section>

        {/* Interactive Decoder & WTD / AfC Absence Verifier */}
        <EsrPayslipDecoderClient />

        <AffiliateCards />
        <EeatVerificationBlock contextLabel="NHS Electronic Staff Record (ESR) Payslip Codes, Section 2 & Section 13.9 Rules" />
      </div>
    </div>
  );
}
