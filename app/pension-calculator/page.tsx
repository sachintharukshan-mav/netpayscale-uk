import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";
import { PensionCalculatorClient } from "@/components/PensionCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import {
  ChevronRight,
  Landmark,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Percent,
  Coins,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "NHS Pension Calculator 2026/27 | 2015 CARE Scheme Retirement & Lump Sum",
  description:
    "Official 2026/27 NHS Pension Calculator (2015 CARE Scheme): Calculate your 1/54th annual pension pot, GAD early retirement reduction factors (ages 55 to 68), 12:1 tax-free lump sum commutation, and real monthly cost after PAYE tax relief.",
  alternates: {
    canonical: "https://netpayscale.uk/pension-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/pension-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Pension Calculator (2015 CARE Scheme): computes 7-tier employee contribution rates (5.2% to 12.5%), 23.78% employer contribution, Net-Pay PAYE tax relief, 1/54th annual retirement pension accrual, GAD actuarial early retirement reductions (ages 55 to 68), and 12:1 tax-free lump sum commutation.",
  },
  openGraph: {
    title: "NHS Pension Calculator 2026/27 (2015 CARE Scheme & Lump Sum) | NetPayScale UK",
    description:
      "Model your exact 2015 NHS CARE pension pot, early retirement penalty (age 55–68), tax-free cash lump sum (£12 per £1), and real monthly take-home cost after tax relief across Bands 2 to 9.",
    url: "https://netpayscale.uk/pension-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

const PENSION_TIERS_2026 = [
  { tier: "Tier 1", range: "Up to £13,259", rate: "5.2%", relief20: "4.16%", relief40: "3.12%", exampleRole: "Part-time lower bands" },
  { tier: "Tier 2", range: "£13,260 to £28,854", rate: "6.5%", relief20: "5.20%", relief40: "3.90%", exampleRole: "Band 2, Band 3 & Band 4 Entry" },
  { tier: "Tier 3", range: "£28,855 to £35,155", rate: "8.3%", relief20: "6.64%", relief40: "4.98%", exampleRole: "Band 4 Top, Band 5 Entry & Mid" },
  { tier: "Tier 4", range: "£35,156 to £52,778", rate: "9.8%", relief20: "7.84%", relief40: "5.88%", exampleRole: "Band 5 Top, Band 6 & Band 7 Entry/Mid" },
  { tier: "Tier 5", range: "£52,779 to £67,668", rate: "10.7%", relief20: "8.56%", relief40: "6.42%", exampleRole: "Band 7 Top, Band 8a & Band 8b Entry" },
  { tier: "Tier 6", range: "£67,669 and above", rate: "12.5%", relief20: "10.00%", relief40: "7.50%", exampleRole: "Band 8b Mid/Top, 8c, 8d & Band 9" },
];

const GAD_EARLY_RETIREMENT_TABLE = [
  { yearsEarly: 0, retireAge: 67, factor: "1.000", reduction: "0.0%", pensionExample: "£15,000/yr", monthlyExample: "£1,250/mo" },
  { yearsEarly: 1, retireAge: 66, factor: "0.946", reduction: "-5.4%", pensionExample: "£14,190/yr", monthlyExample: "£1,183/mo" },
  { yearsEarly: 2, retireAge: 65, factor: "0.896", reduction: "-10.4%", pensionExample: "£13,440/yr", monthlyExample: "£1,120/mo" },
  { yearsEarly: 3, retireAge: 64, factor: "0.849", reduction: "-15.1%", pensionExample: "£12,735/yr", monthlyExample: "£1,061/mo" },
  { yearsEarly: 4, retireAge: 63, factor: "0.806", reduction: "-19.4%", pensionExample: "£12,090/yr", monthlyExample: "£1,008/mo" },
  { yearsEarly: 5, retireAge: 62, factor: "0.766", reduction: "-23.4%", pensionExample: "£11,490/yr", monthlyExample: "£958/mo" },
  { yearsEarly: 6, retireAge: 61, factor: "0.729", reduction: "-27.1%", pensionExample: "£10,935/yr", monthlyExample: "£911/mo" },
  { yearsEarly: 7, retireAge: 60, factor: "0.694", reduction: "-30.6%", pensionExample: "£10,410/yr", monthlyExample: "£868/mo" },
  { yearsEarly: 8, retireAge: 59, factor: "0.662", reduction: "-33.8%", pensionExample: "£9,930/yr", monthlyExample: "£828/mo" },
  { yearsEarly: 9, retireAge: 58, factor: "0.632", reduction: "-36.8%", pensionExample: "£9,480/yr", monthlyExample: "£790/mo" },
  { yearsEarly: 10, retireAge: 57, factor: "0.604", reduction: "-39.6%", pensionExample: "£9,060/yr", monthlyExample: "£755/mo" },
  { yearsEarly: 11, retireAge: 56, factor: "0.578", reduction: "-42.2%", pensionExample: "£8,670/yr", monthlyExample: "£723/mo" },
  { yearsEarly: 12, retireAge: 55, factor: "0.554", reduction: "-44.6%", pensionExample: "£8,310/yr", monthlyExample: "£693/mo" },
];

export default function PensionCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "NHS Pay Calculator",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Pension Calculator",
            item: "https://netpayscale.uk/pension-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Pension Calculator 2026/27 (2015 CARE Scheme)",
        url: "https://netpayscale.uk/pension-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires HTML5 JavaScript",
        description:
          "Official 2026/27 NHS Pension Calculator for Agenda for Change staff. Computes 1/54th annual CARE accrual, GAD early retirement actuarial factors (ages 55 to 68), 12:1 tax-free cash lump sum commutation, and PAYE tax relief.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How is the 2015 NHS Pension calculated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The 2015 NHS Pension Scheme is a Career Average Revalued Earnings (CARE) defined benefit pension. Each year you bank 1/54th (1.85%) of your pensionable earnings into your annual retirement pension pot. While you remain an active NHS member, your banked pension is revalued every April by Consumer Price Index (CPI) inflation plus 1.5%.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if I take my NHS pension early at age 60 instead of 67?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under official Government Actuary's Department (GAD) rules, claiming your 2015 NHS pension 7 years early at age 60 (with Normal Pension Age 67) applies an actuarial reduction factor of 0.694 (a 30.6% reduction in annual pension). This ensures the total lifetime payout remains fair because you receive the pension for 7 additional years.",
            },
          },
          {
            "@type": "Question",
            name: "Can I take a tax-free lump sum from the 2015 NHS Pension?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Although the 2015 NHS Pension does not include an automatic lump sum, you can choose to commute (exchange) part of your annual pension at retirement at a fixed rate of £12 of tax-free cash for every £1 of annual pension given up, up to HMRC's statutory maximum of 25% of the capital value (approx. 4.2857 times your unreduced annual pension).",
            },
          },
          {
            "@type": "Question",
            name: "What are the NHS pension contribution tiers for 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NHS employee pension contribution rates for 2026/27 are based on whole-time equivalent pensionable earnings: 5.2% (up to £13,259), 6.5% (£13,260–£28,854), 8.3% (£28,855–£35,155), 9.8% (£35,156–£52,778), 10.7% (£52,779–£67,668), and 12.5% (£67,669+). In addition, your NHS employer contributes 23.78% of your pensionable pay.",
            },
          },
          {
            "@type": "Question",
            name: "What is the death-in-service benefit for active NHS pension members?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Active members of the 2015 NHS Pension Scheme receive an automatic death-in-service lump sum equal to twice (2x) their annual pensionable pay, paid tax-free to their nominated beneficiaries, plus a surviving adult partner pension equal to 33.75% of the member's unreduced CARE pension for life.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-[#005EB8] transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate shrink-0">
              NHS Pension Calculator (2015 CARE Scheme)
            </span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Header Hero Section */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#005EB8] text-white">
              2015 CARE Section
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              2026/27 Contribution Tiers &amp; GAD Factors Audited
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            NHS Pension Calculator <span className="text-[#005EB8]">2026/27</span>
            <span className="block text-lg sm:text-2xl font-bold text-slate-700 mt-1.5">
              2015 CARE Scheme Pot, Early Retirement Reductions &amp; £12:£1 Lump Sum
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Calculate your exact <strong>monthly NHS pension contribution</strong>, true take-home cost after <strong>PAYE tax relief</strong>, the <strong>23.78% NHS employer deposit</strong>, and your projected <strong>annual retirement pension &amp; tax-free lump sum</strong> under the 2015 CARE scheme.
          </p>
        </div>

        {/* Position 0 Executive Answer Box (Targeting Google Featured Snippets) */}
        <section className="bg-gradient-to-r from-blue-50/90 via-white to-blue-50/50 border-2 border-[#005EB8]/30 rounded-2xl p-5 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#005EB8]">
            <Sparkles className="w-4 h-4" />
            <span>Quick Answer: 2026/27 NHS Pension (2015 CARE Scheme)</span>
          </div>
          <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
            Under the 2015 NHS CARE Scheme, healthcare staff bank <strong>1/54th (1.85%)</strong> of their pensionable pay each year into an annual retirement pension, revalued every April by <strong>CPI inflation + 1.5%</strong>. A Band 5 nurse earning £32,073 banks <strong>£594/year in guaranteed pension for life</strong> for every year worked. At retirement, £1 of annual pension can be exchanged for <strong>£12 of tax-free cash lump sum</strong> up to HMRC limits. Retiring before your State Pension Age (e.g. age 60 vs 67) incurs an actuarial reduction of approximately <strong>30.6%</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              NHSBSA 2015 CARE Rules Audited
            </span>
            <span>•</span>
            <span>+23.78% Employer Funded</span>
            <span>•</span>
            <span>Automatic 20%–40% PAYE Tax Relief</span>
          </div>
        </section>

        {/* Interactive Client Calculator */}
        <PensionCalculatorClient />

        <AdPlaceholder slotId="pension-mid" format="in-content" label="Sponsored Financial Resource" />

        {/* Table 1: Official 2026/27 NHS Pension Contribution Tiers */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                2026/27 NHS Pension Contribution Tiers (Employee vs. Employer)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Employee tier rates are based on whole-time equivalent pensionable earnings. True net cost is lower due to net-pay PAYE tax relief.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005EB8] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              +23.78% Employer Funded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Pensionable Pay (1.0 FTE)</th>
                  <th className="py-3 px-4 text-right">Gross Employee Rate</th>
                  <th className="py-3 px-4 text-right">Net Cost (Basic 20% Tax)</th>
                  <th className="py-3 px-4 text-right">Net Cost (Higher 40% Tax)</th>
                  <th className="py-3 px-4">Typical Agenda for Change Roles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {PENSION_TIERS_2026.map((t) => (
                  <tr key={t.tier} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{t.tier}</td>
                    <td className="py-3 px-4 text-slate-700">{t.range}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#005EB8]">{t.rate}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">{t.relief20}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">{t.relief40}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">{t.exampleRole}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 2: GAD Early Retirement Actuarial Reductions Table (Ages 55 to 68) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                GAD Early Retirement Actuarial Reduction Factors (Ages 55 to 67)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Official Government Actuary&apos;s Department (GAD) percentage reductions applied to 2015 CARE annual pensions taken before Normal Pension Age (NPA 67).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Statutory GAD Factors
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4">Years Early</th>
                  <th className="py-3 px-4">Retirement Age (NPA 67)</th>
                  <th className="py-3 px-4 text-right">GAD Factor</th>
                  <th className="py-3 px-4 text-right">Pension Reduction</th>
                  <th className="py-3 px-4 text-right">Example Annual Pension</th>
                  <th className="py-3 px-4 text-right">Monthly Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {GAD_EARLY_RETIREMENT_TABLE.map((row) => (
                  <tr
                    key={row.yearsEarly}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      row.yearsEarly === 0 ? "bg-emerald-50/40 font-bold" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {row.yearsEarly === 0 ? "0 (Normal NPA)" : `${row.yearsEarly} yr${row.yearsEarly > 1 ? "s" : ""} early`}
                    </td>
                    <td className="py-3 px-4 text-slate-700">Age {row.retireAge}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{row.factor}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-700">{row.reduction}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">{row.pensionExample}</td>
                    <td className="py-3 px-4 text-right text-slate-600 font-medium">{row.monthlyExample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            *Example based on a full unreduced accrued 2015 CARE annual pension of £15,000/year at Normal Pension Age (State Pension Age 67). Retiring early pays less per year, but is received for more total years.
          </p>
        </section>

        {/* Informational Guidance: How 12:1 Commutation Works */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            How the £12 : £1 Tax-Free Lump Sum Commutation Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
              <span className="text-xs font-black uppercase text-[#005EB8] tracking-wider block">
                Rule 1: Fixed 12 to 1 Exchange
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                For every <strong>£1 of annual taxable pension</strong> you surrender, the NHS Pension Scheme gives you <strong>£12 of tax-free cash</strong> on day one of retirement.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
              <span className="text-xs font-black uppercase text-purple-700 tracking-wider block">
                Rule 2: Statutory 25% Capital Cap
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Under HMRC rules, your maximum tax-free lump sum cannot exceed 25% of the total capital value of your pension benefits (approx. <strong>4.2857 times</strong> your unreduced annual pension).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider block">
                Rule 3: Fully Flexible Choice
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                You can choose <strong>any lump sum amount between £0</strong> (keeping 100% of your annual income for life) and the maximum permitted cash lump sum.
              </p>
            </div>
          </div>
        </section>

        {/* Cross-Linking Navigation Hub */}
        <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black">
                Explore More Clinical Pay &amp; Contract Modellers
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate unsocial hours shift pay, promotion tax traps, and NHS hospital trust weightings.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005EB8] hover:bg-[#004b93] text-white text-xs font-bold transition-colors shrink-0"
            >
              Back to Pay Calculator
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <Link
              href="/promotion-calculator/"
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block"
            >
              <p className="font-bold text-amber-300">⚡ Band 5 → 6 Promotion Trap</p>
              <p className="text-[11px] text-slate-300 mt-1">
                Model pension tier bracket jumps and losing night enhancements on ward promotion.
              </p>
            </Link>

            <Link
              href="/unsocial-hours-calculator/"
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block"
            >
              <p className="font-bold text-blue-300">🌙 Section 2 Unsocial Hours</p>
              <p className="text-[11px] text-slate-300 mt-1">
                Calculate night shift (+30%/+44%) and Sunday enhancements net take-home cash.
              </p>
            </Link>

            <Link
              href="/trusts/"
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block"
            >
              <p className="font-bold text-emerald-300">🏥 Top 50 NHS Trusts Directory</p>
              <p className="text-[11px] text-slate-300 mt-1">
                View pay scales and London Weighting allowances across 50 major UK hospital trusts.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
