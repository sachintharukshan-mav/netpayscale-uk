import type { Metadata } from "next";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { AffiliateCards } from "@/components/AffiliateCards";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import {
  Globe,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Coins,
  FileCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "NHS Salary & Visa Guide for International Recruits (2026/27) | Filipino, Indian & Overseas Nurses",
  description:
    "Complete 2026/27 NHS salary, take-home pay, and visa guide for international nurses, doctors, and healthcare staff. Calculate pre-OSCE vs post-OSCE pay, Health and Care Worker Visa thresholds, IHS exemptions, and remittances.",
  alternates: {
    canonical: "https://netpayscale.uk/international/",
    types: {
      "text/markdown": "https://netpayscale.uk/international.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 UK NHS Salary & Health and Care Worker Visa Guide for international recruits: explains Pre-OSCE Band 4 (£28,392) vs Post-OSCE Band 5 (£32,073) take-home pay, IHS exemption savings (£1,035/yr), 8.3% CARE pension benefits, and monthly remittance estimates to the Philippines, India, and overseas.",
  },
  openGraph: {
    title:
      "NHS Salary & Visa Guide for International Recruits 2026/27 | NetPayScale UK",
    description:
      "Calculate your net take-home pay as an overseas nurse or doctor in the UK NHS. Pre-OSCE to Post-OSCE salary jump, visa exemptions, and remittance estimates.",
    url: "https://netpayscale.uk/international/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://netpayscale.uk/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function InternationalGuidePage() {
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
            name: "International Healthcare Recruits Guide",
            item: "https://netpayscale.uk/international/",
          },
        ],
      },
      {
        "@type": "Article",
        headline: "NHS Salary & Visa Take-Home Guide for International Recruits (2026/27)",
        url: "https://netpayscale.uk/international/",
        description:
          "Authoritative guidance on UK NHS Agenda for Change pay, pre-OSCE Band 4 vs post-OSCE Band 5 take-home pay, visa exemptions, and pension rules for overseas staff.",
        publisher: {
          "@type": "Organization",
          name: "NetPayScale UK",
          url: "https://netpayscale.uk/",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the starting salary for an international nurse joining the NHS in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "When international nurses first arrive in the UK before passing the NMC OSCE exam, they are employed as pre-registration nurses at Band 4 Entry (£28,392 gross, approximately £1,930/month net). Once they pass the OSCE and receive their NMC PIN, they immediately step up to Band 5 Entry (£32,073 gross, £2,040/month net outside London, or up to £2,350/month net in Inner London).",
            },
          },
          {
            "@type": "Question",
            name: "Do international NHS staff have to pay the UK Immigration Health Surcharge (IHS)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Healthcare professionals coming to the UK on the Health and Care Worker Visa (and their dependent family members) are 100% exempt from the UK Immigration Health Surcharge, saving £1,035 per person per year compared to standard skilled worker visas.",
            },
          },
          {
            "@type": "Question",
            name: "Can overseas nurses and doctors join the NHS Pension Scheme?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. All international staff are automatically enrolled in the defined benefit NHS 2015 CARE Pension Scheme on the exact same terms as UK-born staff. It builds a guaranteed, inflation-linked pension for life (1/54th of annual pensionable pay). If you leave the UK before retirement, your pension remains safeguarded and can be paid abroad or transferred under QROPS rules.",
            },
          },
          {
            "@type": "Question",
            name: "How much take-home pay can an overseas nurse remit home each month?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A newly qualified Band 5 nurse outside London takes home approximately £2,040 net per month (or £2,200–£2,400/month with night shifts). Depending on local living costs and shared accommodation, many international staff remit between £600 and £1,200 per month, which converts to approximately ₱43,000–₱86,000 Philippine Pesos (PHP) or ₹64,000–₹128,000 Indian Rupees (INR).",
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4"
          >
            <Link href="/" className="hover:text-[#005EB8] transition-colors">
              NHS Pay Calculator
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">
              International Healthcare Staff Guide
            </span>
          </nav>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#005EB8] border border-blue-200 mb-3">
              <Globe className="w-3.5 h-3.5" />
              Over 300,000+ Overseas Healthcare Workers in the NHS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              NHS Salary &amp; Visa Guide for International Recruits (2026/27)
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              Essential financial guidance for <strong>Filipino, Indian, Spanish, Polish, and overseas nurses, doctors, and allied health staff</strong> joining the UK National Health Service on a Health and Care Worker Visa.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005EB8] block mb-1">
                Post-OSCE Registered Nurse
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {formatCurrency(32073)}/yr
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Band 5 Entry base salary ({formatCurrency(2040)}/mo net take-home).
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">
                IHS Surcharge Exemption
              </span>
              <div className="text-2xl font-black text-emerald-900 font-mono">
                £1,035/yr Saved
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Health and Care Worker Visa holders pay £0 in NHS surcharges.
              </p>
            </div>

            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 block mb-1">
                Pre-OSCE Salary (Band 4)
              </span>
              <div className="text-2xl font-black text-purple-900 font-mono">
                {formatCurrency(28392)}/yr
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Starting wage while studying for the NMC OSCE exam.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 block mb-1">
                London Allowance (HCAS)
              </span>
              <div className="text-2xl font-black text-amber-900 font-mono">
                Up to +£8,746/yr
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Additional cost-of-living allowance for trusts in London.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        {/* Section 1: Pre-OSCE vs Post-OSCE Progression */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-[#005EB8]" />
              1. The Overseas Nurse Salary Journey: Pre-OSCE vs. Post-OSCE PIN
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Most internationally educated nurses (IENs) arrive in the UK before taking the NMC Objective Structured Clinical Examination (OSCE). Here is how your salary changes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 inline-block">
                Stage 1: Arrival &amp; OSCE Preparation
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Pre-Registration Nurse (Band 4)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                While training at your NHS Trust and preparing for the OSCE, you are typically paid as a <strong>Band 4 Healthcare Assistant / Pre-Registration Nurse</strong>.
              </p>
              <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Gross Basic Salary:</span>
                  <strong className="text-slate-900">£28,392 / yr (£2,366/mo)</strong>
                </div>
                <div className="flex justify-between">
                  <span>NHS Pension (6.5%):</span>
                  <span className="text-amber-700">-£153.79 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYE Income Tax:</span>
                  <span className="text-rose-600">-£217.10 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span>National Insurance (8%):</span>
                  <span className="text-rose-600">-£105.48 / mo</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 font-sans text-emerald-800">
                  <span>Net Take-Home Pay:</span>
                  <span className="font-mono">~£1,889.63 / mo</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#005EB8]/30 bg-blue-50/30 p-5 space-y-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#005EB8] inline-block">
                Stage 2: NMC PIN Awarded (Post-OSCE)
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Registered Staff Nurse (Band 5)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As soon as you pass your OSCE and your NMC PIN is activated, your Trust immediately uplifts your contract to <strong>Band 5 Staff Nurse</strong>.
              </p>
              <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-blue-200">
                <div className="flex justify-between">
                  <span>Gross Basic Salary:</span>
                  <strong className="text-slate-900">£32,073 / yr (£2,672/mo)</strong>
                </div>
                <div className="flex justify-between">
                  <span>NHS Pension (8.3%):</span>
                  <span className="text-amber-700">-£221.84 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYE Income Tax:</span>
                  <span className="text-rose-600">-£240.50 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span>National Insurance (8%):</span>
                  <span className="text-rose-600">-£130.02 / mo</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-blue-200 font-sans text-emerald-800">
                  <span>Net Take-Home Pay:</span>
                  <span className="font-mono">~£2,080.39 / mo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#005EB8] shrink-0 mt-0.5" />
            <p>
              <strong>Immediate Pay Uplift:</strong> Passing the OSCE and receiving your NMC PIN increases your monthly take-home deposit by <strong>+£190.76 per month</strong> (+£2,289/year clean net cash), plus you become eligible for Band 5 night and Sunday enhancement rates (+30% to +60%).
            </p>
          </div>

          <div className="pt-2">
            <ShareBreakdownButton
              variant="light"
              label="Share International Nurse Pay Guide with Colleagues"
              url="https://netpayscale.uk/international/"
              shareText={`🇬🇧 UK NHS International Recruits Pay Guide 2026/27:\n• Pre-OSCE (Band 4): £28,392/yr (~£1,889/mo net)\n• Post-OSCE (Band 5): £32,073/yr (~£2,080/mo net)\n• Health & Care Visa IHS Surcharge Exemption: £1,035/yr saved\n• London Allowance (HCAS): Up to +£8,746/yr\nFull guide & remittance calculator: https://netpayscale.uk/international/`}
            />
          </div>
        </div>

        {/* Section 2: Currency Conversion & Remittance Benchmarks */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Coins className="w-6 h-6 text-emerald-600" />
              2. Monthly Remittance Benchmarks: How Much Can You Send Home?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Estimated monthly remittance values based on a standard Band 5 nurse net take-home salary (~£2,040 to £2,300/month with ward night shifts).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4 font-bold">Country &amp; Currency</th>
                  <th className="py-3 px-4 font-bold">Monthly Remittance (£ GBP)</th>
                  <th className="py-3 px-4 font-bold text-emerald-800">Converted Value (Local Currency)</th>
                  <th className="py-3 px-4 font-bold">Typical Remittance Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs sm:text-sm">
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-xl">🇵🇭</span> Philippines (PHP)
                  </td>
                  <td className="py-3.5 px-4 font-bold">£600 – £1,000 / mo</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                    ₱43,500 – ₱72,500 PHP
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-600">
                    Family support, home mortgage, savings
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-xl">🇮🇳</span> India (INR)
                  </td>
                  <td className="py-3.5 px-4 font-bold">£600 – £1,200 / mo</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                    ₹64,000 – ₹128,000 INR
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-600">
                    Education loans, family investments
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-xl">🇪🇸</span> Spain / EU (EUR)
                  </td>
                  <td className="py-3.5 px-4 font-bold">£500 – £900 / mo</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                    €580 – €1,050 EUR
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-600">
                    Eurozone savings, mortgage payments
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-xl">🇳🇬</span> Nigeria (NGN)
                  </td>
                  <td className="py-3.5 px-4 font-bold">£500 – £1,000 / mo</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                    ₦950,000 – ₦1,900,000 NGN
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-600">
                    Family upkeep, property building
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Essential Overseas Staff Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
              3. Important Payroll &amp; Visa Rules Every International NHS Worker Must Know
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-sm font-bold text-slate-900 block">
                1. 100% IHS Surcharge Exemption
              </strong>
              <p className="leading-relaxed">
                As a Health and Care Worker Visa holder, you and your family are <strong>completely exempt</strong> from paying the £1,035/year Immigration Health Surcharge. If an agency or employer mistakenly requests this fee, report it immediately to your Trust HR or union representative.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-sm font-bold text-slate-900 block">
                2. Do NOT Opt Out of the NHS Pension
              </strong>
              <p className="leading-relaxed">
                Many newly arrived nurses consider opting out of the NHS Pension to get extra monthly cash. However, opting out gives up the Trust’s massive <strong>23.7% employer contribution</strong> and life assurance cover (£64,000+ death-in-service benefit). If you leave the UK, your accrued pension is kept safe for your retirement.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-sm font-bold text-slate-900 block">
                3. UK Tax Code 1257L Verification
              </strong>
              <p className="leading-relaxed">
                Ensure your first Electronic Staff Record (ESR) payslip lists tax code <strong>1257L</strong>. If your payslip shows "BR" (Basic Rate) or "0T", you are on an emergency tax code and being overcharged 20% on your personal allowance. Contact HMRC to correct your tax code.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Interactive Tool Navigation Banner */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#003087] via-[#005EB8] to-[#0072CE] text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-black">
              Calculate Your Exact NHS Net Take-Home Pay Now
            </h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Use our verified 2026/27 calculator with London weighting (HCAS), night shifts, Sunday enhancements, and Scottish/English tax options in 8 international languages.
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl bg-white text-[#005EB8] hover:bg-slate-100 font-extrabold text-sm shadow-md active:scale-95 transition-all shrink-0 flex items-center gap-2"
          >
            Launch Free Calculator
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Section 5: FAQs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#005EB8]" />
            Frequently Asked Questions for Overseas Staff
          </h2>

          <div className="space-y-6 text-sm text-slate-700 divide-y divide-slate-100">
            <div className="pt-4 first:pt-0">
              <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
                Can I work extra bank shifts on a Health and Care Worker Visa?
              </h3>
              <p className="leading-relaxed">
                Yes. Under UK Home Office rules, Health and Care Worker Visa holders are permitted to work up to <strong>20 hours per week of supplementary employment</strong> in eligible roles (such as NHS Professionals bank shifts or overtime within your Trust) alongside your sponsored full-time 37.5-hour post. Bank shifts at Band 5 are paid at approximately £16.40/hr to £26.24/hr (nights/weekends).
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
                What is the minimum salary requirement for an NHS visa?
              </h3>
              <p className="leading-relaxed">
                Health and Care Worker Visa roles on national pay scales (such as NHS Agenda for Change) are exempt from the standard UK £38,700 general skilled worker threshold. As long as your salary meets the official Agenda for Change national pay scale (e.g., Band 5 starts at £32,073), you meet all UKVI visa salary requirements.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
                How does Indefinite Leave to Remain (ILR) work for NHS staff?
              </h3>
              <p className="leading-relaxed">
                After completing 5 continuous years on a Health and Care Worker Visa, NHS staff and their dependents become eligible to apply for Indefinite Leave to Remain (ILR) / permanent settlement in the United Kingdom, followed by British Citizenship after 12 additional months.
              </p>
            </div>
          </div>
        </div>

        <AffiliateCards />
      </section>
    </main>
  );
}
