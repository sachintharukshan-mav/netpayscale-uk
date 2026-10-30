import type { Metadata } from "next";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { TrustDirectoryClient } from "@/components/TrustDirectoryClient";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import {
  Building2,
  MapPin,
  ShieldCheck,
  Award,
  HelpCircle,
  FileText,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Top 50 NHS Trusts & Hospitals Pay Directory 2026/27 | London Weighting (HCAS) & Salary Guide",
  description:
    "Explore 2026/27 NHS salary and take-home pay rates across the 50 largest NHS Hospital Trusts in England, Scotland, Wales, and Northern Ireland. Check exact London Weighting (Inner 20%, Outer 15%, Fringe 5%) and net monthly take-home pay.",
  alternates: {
    canonical: "https://netpayscale.uk/trusts/",
    types: {
      "text/markdown": "https://netpayscale.uk/trusts.md",
    },
  },
  other: {
    "ai-summary":
      "Official 2026/27 NHS Hospital Trusts Directory: maps the 50 largest NHS Foundation Trusts and Health Boards (Barts, Guy's & St Thomas', Imperial, Manchester MFT, UHB Birmingham, UCLH, Lothian) to official High Cost Area Supplement (HCAS) zones. Computes starting Band 5 gross and net monthly take-home pay.",
  },
  openGraph: {
    title:
      "Top 50 NHS Trusts & Hospitals Pay Directory 2026/27 | NetPayScale UK",
    description:
      "Find your hospital trust: check exact London weighting allowances and net take-home pay for nurses, doctors, and healthcare staff across 50 major UK NHS Trusts.",
    url: "https://netpayscale.uk/trusts/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://netpayscale.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "Top 50 NHS Trusts Pay Directory 2026/27",
      },
    ],
  },
};

export default function TrustsDirectoryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "NHS Salary Calculator",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Top 50 NHS Trusts Directory",
            item: "https://netpayscale.uk/trusts/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "Top 50 NHS Trusts & Hospitals Pay Directory",
        url: "https://netpayscale.uk/trusts/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GBP",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Which NHS Trusts pay Inner London Weighting (+20%)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Major NHS Trusts paying 20% Inner London Weighting (HCAS) include Guy's and St Thomas' NHS Foundation Trust, Barts Health NHS Trust, Imperial College Healthcare NHS Trust, University College London Hospitals NHS Foundation Trust (UCLH), King's College Hospital NHS Foundation Trust, Royal Free London NHS Foundation Trust, Chelsea and Westminster Hospital NHS Foundation Trust, St George's University Hospitals NHS Foundation Trust, Great Ormond Street Hospital for Children (GOSH), and Lewisham and Greenwich NHS Trust.",
            },
          },
          {
            "@type": "Question",
            name: "What are the London Weighting (HCAS) minimum and maximum rates for 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For the 2026/27 Agenda for Change year, Inner London pays 20% of basic salary (minimum £5,794, maximum £8,746). Outer London pays 15% of basic salary (minimum £4,870, maximum £6,137). The Fringe Zone pays 5% of basic salary (minimum £1,346, maximum £2,270).",
            },
          },
          {
            "@type": "Question",
            name: "Do NHS Trusts in Scotland, Wales, and Northern Ireland pay London Weighting?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. High Cost Area Supplements only apply to trusts in Greater London and designated fringe counties. However, NHS Scotland operates a distinct Agenda for Change pay scale subject to Scottish 6-band income tax rates, while NHS Wales (GIG Cymru) and HSC Northern Ireland adhere to national standard AfC agreements.",
            },
          },
          {
            "@type": "Question",
            name: "Is NHS London Weighting pensionable?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, High Cost Area Supplements (HCAS) are fully pensionable pay under Agenda for Change Section 4 and the 2015 NHS CARE pension scheme. Your pension contributions and pension pot accrual (1/54th) are calculated on your combined basic salary plus London Weighting.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#005EB8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              NHS Trusts Directory
            </span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#005EB8] border border-blue-200 mb-4">
              <Building2 className="w-3.5 h-3.5" />
              Verified 2026/27 Trust &amp; Health Board Benchmarks
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Top 50 NHS Trusts &amp; Hospitals Pay Directory (2026/27)
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              Find your hospital or trust to verify exact <strong>High Cost Area Supplements (London Weighting)</strong>, starting Band 5 nurse net pay, and statutory Agenda for Change (+3.3%) pay rates.
            </p>
          </div>

          {/* Quick Zone Stat Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">
                Inner London (10 Trusts)
              </span>
              <div className="text-2xl font-black text-emerald-900 font-mono">
                +20% Allowance
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Up to +£8,746/yr extra. Band 5 starts at ~{formatCurrency(2384)}/mo net.
              </p>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005EB8] block mb-1">
                Outer London (6 Trusts)
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                +15% Allowance
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Up to +£6,137/yr extra. Band 5 starts at ~{formatCurrency(2304)}/mo net.
              </p>
            </div>

            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 block mb-1">
                London Fringe (6 Trusts)
              </span>
              <div className="text-2xl font-black text-purple-900 font-mono">
                +5% Allowance
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Up to +£2,270/yr extra. Band 5 starts at ~{formatCurrency(2166)}/mo net.
              </p>
            </div>

            <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                National Standard (28 Trusts)
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                Standard Scale
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Manchester, Birmingham, Leeds, Scotland, Wales. Band 5 starts at ~{formatCurrency(2080)}/mo net.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Trust Directory */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <TrustDirectoryClient />
      </section>

      {/* Statutory Guidance & HCAS Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#005EB8]" />
              How NHS High Cost Area Supplements (HCAS) Work
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Under Agenda for Change Section 4 (Annex 8 and Annex 9), HCAS is paid to help clinical and administrative staff cope with elevated housing, transport, and living costs in the Greater London area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-block">
                Inner London (20%)
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Min: £5,794 · Max: £8,746
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies to all trusts in the 12 Inner London boroughs (Camden, Greenwich, Hackney, Hammersmith &amp; Fulham, Islington, Kensington &amp; Chelsea, Lambeth, Lewisham, Southwark, Tower Hamlets, Wandsworth, Westminster) and City of London.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 inline-block">
                Outer London (15%)
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Min: £4,870 · Max: £6,137
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies to all trusts in the 20 Outer London boroughs (Barnet, Bexley, Brent, Bromley, Croydon, Ealing, Enfield, Haringey, Harrow, Havering, Hillingdon, Hounslow, Kingston, Merton, Newham, Redbridge, Richmond, Sutton, Waltham Forest).
              </p>
            </div>

            <div className="p-5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 inline-block">
                Fringe Zone (5%)
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Min: £1,346 · Max: £2,270
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applies to designated hospital locations in Berkshire, Buckinghamshire, Essex, Hertfordshire, Kent, and Surrey bordering London (e.g. Watford, Slough, Stevenage, Guildford, Dartford).
              </p>
            </div>
          </div>

          <div className="pt-2">
            <ShareBreakdownButton
              variant="light"
              label="Share NHS Hospital Trusts Pay Directory (WhatsApp)"
              url="https://netpayscale.uk/trusts/"
              shareText={`🏥 Top 50 NHS Hospital Trusts 2026/27 Pay Directory:\n• Inner London (+20% up to £8,746): Guy's, Barts, Imperial, UCLH, King's\n• Outer London (+15% up to £6,137): Northwick Park, Queen's, Croydon\n• Fringe (+5% up to £2,270): Frimley, Watford, Lister, Surrey\n• National Standard: Manchester MFT, Birmingham UHB, Leeds, Lothian\nCheck your hospital pay: https://netpayscale.uk/trusts/`}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#005EB8]" />
              Frequently Asked Questions About NHS Trust Salaries
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Which NHS Trusts pay Inner London Weighting (+20%)?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Major NHS Trusts paying 20% Inner London Weighting (HCAS) include Guy&apos;s and St Thomas&apos; NHS Foundation Trust, Barts Health NHS Trust, Imperial College Healthcare NHS Trust, University College London Hospitals NHS Foundation Trust (UCLH), King&apos;s College Hospital NHS Foundation Trust, Royal Free London NHS Foundation Trust, Chelsea and Westminster Hospital NHS Foundation Trust, St George&apos;s University Hospitals NHS Foundation Trust, Great Ormond Street Hospital for Children (GOSH), and Lewisham and Greenwich NHS Trust.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                What are the London Weighting (HCAS) minimum and maximum rates for 2026/27?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                For the 2026/27 Agenda for Change year, Inner London pays 20% of basic salary (minimum £5,794, maximum £8,746). Outer London pays 15% of basic salary (minimum £4,870, maximum £6,137). The Fringe Zone pays 5% of basic salary (minimum £1,346, maximum £2,270).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Do NHS Trusts in Scotland, Wales, and Northern Ireland pay London Weighting?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                No. High Cost Area Supplements only apply to trusts in Greater London and designated fringe counties. However, NHS Scotland operates a distinct Agenda for Change pay scale subject to Scottish 6-band income tax rates, while NHS Wales (GIG Cymru) and HSC Northern Ireland adhere to national standard AfC agreements.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Is NHS London Weighting pensionable?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Yes, High Cost Area Supplements (HCAS) are fully pensionable pay under Agenda for Change Section 4 and the 2015 NHS CARE pension scheme. Your pension contributions and pension pot accrual (1/54th) are calculated on your combined basic salary plus London Weighting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
