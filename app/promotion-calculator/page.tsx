import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { PromotionCalculatorClient } from "@/components/PromotionCalculatorClient";
import { AffiliateCards } from "@/components/AffiliateCards";
import { ChevronRight, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title:
    "NHS Band Promotion & Pension Trap Calculator 2026/27 | Band 5 to Band 6 Worth It?",
  description:
    "Is Band 6 worth it? Calculate your exact NHS net take-home pay increase from Band 5 to Band 6 (or any band), including the £50/month promotion trap, NHS pension tier jumps (8.3% to 9.8%), and unsocial hours shift losses.",
  alternates: {
    canonical: "https://netpayscale.uk/promotion-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/promotion-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Band Promotion & Pension Bracket Trap Tool: calculates the exact monthly net take-home pay difference when moving from Band 5 to Band 6 (or any Agenda for Change band). Factors in the 9.8% pension tier cliff, PAYE tax, 8% National Insurance, student loans, and losing ward night shift unsocial enhancements.",
  },
  openGraph: {
    title:
      "NHS Band Promotion & Pension Trap Calculator 2026/27 | NetPayScale UK",
    description:
      "Calculate your exact net take-home pay increase when moving from Band 5 to Band 6, factoring in NHS pension tier jumps and unsocial hours shift losses.",
    url: "https://netpayscale.uk/promotion-calculator/",
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

export default function PromotionCalculatorPage() {
  const transitions = nhsData.bands.slice(0, -1).map((fromB, idx) => {
    const toB = nhsData.bands[idx + 1];
    const fromCalc = calculateNHSPay({
      band: fromB.band,
      stepIndex: 0,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });
    const toCalc = calculateNHSPay({
      band: toB.band,
      stepIndex: 0,
      hcasZone: "standard",
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });
    return {
      label: `${fromB.band} → ${toB.band}`,
      fromSlug: fromB.slug,
      toSlug: toB.slug,
      fromGross: fromCalc.baseSalary.annual,
      toGross: toCalc.baseSalary.annual,
      grossGain: toCalc.baseSalary.annual - fromCalc.baseSalary.annual,
      fromNetMo: fromCalc.netPay.monthly,
      toNetMo: toCalc.netPay.monthly,
      netMoGain: toCalc.netPay.monthly - fromCalc.netPay.monthly,
      pensionChange: `${fromCalc.pensionTierLabel} → ${toCalc.pensionTierLabel}`,
    };
  });

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
            name: "NHS Promotion & Pension Trap Calculator",
            item: "https://netpayscale.uk/promotion-calculator/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Band Promotion & Pension Bracket Trap Tool (2026/27)",
        url: "https://netpayscale.uk/promotion-calculator/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
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
            name: "Is moving from Band 5 to Band 6 financially worth it in the NHS?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, but with an important timing caveat. Moving from the top of Band 5 (£39,043) to Band 6 Entry (£39,959) initially yields a very small net take-home increase of only ~£49.50 per month (or £40.60/month if repaying a Plan 2 Student Loan) due to a 37.8%–46.8% marginal deduction rate. Furthermore, if you lose night or weekend shift enhancements, your take-home pay may temporarily drop. However, within 2 to 5 years at Band 6, your salary rises to £42,170 and then £48,117, giving +£470/month net gain plus +£168/year in guaranteed 2015 CARE pension accrual for life.",
            },
          },
          {
            "@type": "Question",
            name: "Why is the take-home pay increase from Top of Band 5 to Band 6 Entry so small (~£50/month)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The gross pay gap between Top of Band 5 (£39,043) and Band 6 Entry (£39,959) is only £916 per year (£76.33 per month). After subtracting 9.8% NHS Pension (£7.48/mo), 20% basic PAYE income tax (£13.77/mo), and 8% National Insurance (£6.11/mo), the net monthly increase is exactly £48.98 per month without student loan, or £42.11 per month with a Plan 2 student loan (46.8% marginal deduction).",
            },
          },
          {
            "@type": "Question",
            name: "Will I lose money moving from Band 5 ward shifts to a Band 6 Monday to Friday post?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, you can experience an immediate take-home pay cut. A Band 5 Nurse on top of the band working just one 11.5-hour night shift per week earns £3,592/year in unsocial enhancements (+30%), giving a monthly take-home of approximately £2,445. If you take a Monday–Friday 9–5 Band 6 Entry role without enhancements, your monthly take-home is £2,489 (+£44 difference). If you previously worked two night shifts per week, your take-home pay will drop by over -£160 to -£200 per month.",
            },
          },
          {
            "@type": "Question",
            name: "What is the NHS pension tier cliff and how does it affect promotions?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The NHS Pension Scheme operates tier thresholds based on pensionable pay. Under 2026/27 rules, Tier 3 is 8.3% (earnings up to £35,155) and Tier 4 is 9.8% (earnings £35,155 to £52,778). When advancing through Band 5 (Mid to Top) or from Band 5 Entry to Band 6, crossing the £35,155 boundary increases your member pension contribution by 1.5% across your entire salary, deducting an extra £955/year in pension contributions.",
            },
          },
          {
            "@type": "Question",
            name: "How much extra pension do you build by being a Band 6 instead of a Band 5?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The NHS 2015 Pension is a Career Average Revalued Earnings (CARE) scheme that accrues at 1/54th of pensionable earnings each year. At the Top of Band 6 (£48,117), you build £891.06 in guaranteed annual retirement pension each year, compared to £723.02 at the Top of Band 5 (£39,043)—an extra +£168.04/year in guaranteed pension for every single year worked at top of Band 6, revalued annually with CPI inflation + 1.5% until retirement.",
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
      <section className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4"
          >
            <Link href="/" className="hover:text-[#005EB8] transition-colors">
              NHS Pay Calculator
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">
              Promotion &amp; Pension Trap Calculator
            </span>
          </nav>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#005EB8] border border-blue-200 mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              2026/27 Promotion Decision Engine &amp; Pension Trap Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              NHS Band Promotion &amp; Pension Bracket Trap Tool (2026/27)
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Is stepping up to Band 6 worth it? Compare any two NHS Agenda for
              Change bands side-by-side. Uncover the <strong>£50/month promotion trap</strong>,
              calculate <strong>NHS Pension tier jumps (8.3% → 9.8%)</strong>, and see whether
              losing ward night or weekend shift enhancements will cause an immediate
              take-home pay cut.
            </p>
          </div>

          {/* AEO Direct Answer Executive Callout */}
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 sm:p-6 text-sm text-slate-800 leading-relaxed space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#005EB8] text-white rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <strong className="text-[#005EB8] font-black text-base">
                AEO Direct Answer · Is Band 6 Financially Worth It in 2026/27?
              </strong>
            </div>
            <p>
              Moving from the <strong>Top of Band 5 (£39,043)</strong> to{" "}
              <strong>Band 6 Entry (£39,959)</strong> increases your gross pay by
              just <strong>+£916/year (+£76.33/month)</strong>. After 9.8% NHS Pension,
              20% basic PAYE income tax, and 8% National Insurance (a <strong>37.8% marginal rate</strong>,
              rising to <strong>46.8% with a Plan 2 Student Loan</strong>), your real take-home
              increase is only <strong>+£48.98/month</strong> (£1.61/day).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium">
              <div className="bg-white/80 rounded-xl p-3 border border-blue-100">
                <span className="font-bold text-slate-900 block mb-0.5">
                  1. The £50/Mo Trap
                </span>
                Top B5 to B6 Entry yields +£49/mo net. Extra clinical responsibility feels unpaid in month 1.
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-blue-100">
                <span className="font-bold text-rose-700 block mb-0.5">
                  2. Shift Loss Drop
                </span>
                Losing 1 night/wk (+30%) moving to a 9–5 clinic cuts take-home by up to -£167/mo until step 2.
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-blue-100">
                <span className="font-bold text-emerald-700 block mb-0.5">
                  3. The Long-Term Win
                </span>
                Top of Band 6 pays +£470/mo net (£48,117) and adds +£168/yr guaranteed CARE pension for life.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Calculator */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <PromotionCalculatorClient />
      </section>

      {/* Server-Rendered Band Promotion Matrix */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            2026/27 NHS Band-to-Band Promotion Net Take-Home Table (Entry to Entry)
          </h2>
          <p className="text-sm text-slate-600 mt-1 mb-6">
            Exact gross salary increase, NHS Pension tier transition, and
            monthly net take-home gain for every standard Band promotion in 2026/27 (Day shifts, Rest of UK standard).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4 font-bold">Band Promotion</th>
                  <th className="py-3 px-4 font-bold">Current Gross</th>
                  <th className="py-3 px-4 font-bold">Promoted Gross</th>
                  <th className="py-3 px-4 font-bold">Gross Increase</th>
                  <th className="py-3 px-4 font-bold">Pension Tier Shift</th>
                  <th className="py-3 px-4 font-bold text-emerald-700">
                    Monthly Net Gain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs sm:text-sm">
                {transitions.map((t) => (
                  <tr key={t.label} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">
                      <Link
                        href={`/bands/${t.toSlug}/`}
                        className="text-[#005EB8] hover:underline"
                      >
                        {t.label}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatCurrency(t.fromGross)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(t.toGross)}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-semibold">
                      +{formatCurrency(t.grossGain)}/yr
                    </td>
                    <td className="py-3 px-4 text-amber-700 font-semibold">
                      {t.pensionChange}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700">
                      +{formatCurrency(t.netMoGain)}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Comprehensive Educational Guide & Clinical FAQs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#005EB8]" />
            Frequently Asked Questions: NHS Band 5 to Band 6 Promotions &amp; Pension Traps
          </h2>

          <div className="space-y-6 text-sm text-slate-700 divide-y divide-slate-100">
            <div className="pt-4 first:pt-0">
              <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
                Why do so many nurses on r/NursingUK say "Band 6 is not worth it"?
              </h3>
              <p className="leading-relaxed">
                Nurses and clinicians often feel disheartened because stepping from the <strong>Top of Band 5 (£39,043)</strong> to <strong>Band 6 Entry (£39,959)</strong> gives a gross pay rise of just £916/year (£76.33/mo). After 9.8% NHS Pension deductions, 20% income tax, 8% NI, and student loans, your monthly bank balance increases by less than £50/month. Concurrently, your responsibilities explode: managing ward beds, handling bleep escalations, dealing with staffing shortages, and supervising junior staff. The first 1–2 years can feel like unpaid overtime until you reach the intermediate spine step (£42,170).
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
                How does the NHS Pension tier cliff work when I get promoted?
              </h3>
              <p className="leading-relaxed">
                The NHS Pension scheme has discrete contribution tiers based on pensionable earnings. When advancing from Band 5 Entry (£32,073, Tier 3: 8.3%) to Band 6 Entry (£39,959, Tier 4: 9.8%), your pension deduction rate jumps by +1.5% across your <em>entire</em> pensionable pay. While this means higher monthly deductions, it is crucial to remember that the NHS 2015 Scheme is a defined benefit CARE scheme: you build <strong>1/54th of your earnings</strong> as a guaranteed annual pension for life, revalued with CPI inflation plus 1.5% every year.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
                What should I do if taking a Band 6 role reduces my net pay due to lost shift enhancements?
              </h3>
              <p className="leading-relaxed">
                If you are transitioning from a ward-based Band 5 role with night/weekend enhancements into a Monday–Friday 9–5 specialist Band 6 role, budget for an immediate net drop. Many NHS staff bridge this gap by picking up <strong>one internal NHS Professionals (NHSP) bank shift every 4 to 6 weeks</strong>. Bank shifts at Band 6 are paid at a higher hourly rate (£20.44/hr base plus enhancements), which easily replaces the lost unsocial hours income until you progress up the Band 6 spine scale.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-extrabold text-slate-900 text-base mb-1.5">
                How long does it take to reach the top of Band 6?
              </h3>
              <p className="leading-relaxed">
                Under NHS Agenda for Change terms, Band 6 has 3 spine steps: Entry (0–2 years, £39,959), Mid (after 2 years, £42,170), and Top (after 5 years, £48,117). Progression occurs automatically on your pay step anniversary subject to meeting local appraisals and statutory/mandatory training requirements. Reaching the top step increases your gross salary by +£8,158/year above entry step.
              </p>
            </div>
          </div>
        </div>

        <AffiliateCards />
      </section>
    </main>
  );
}
