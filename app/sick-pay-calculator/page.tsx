import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { SickPayCalculatorClient } from "@/components/SickPayCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import { ChevronRight, HeartPulse, ShieldAlert, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "NHS Sick Pay Calculator 2026/27 | Full Pay, Half Pay & SSP Entitlement",
  description:
    "Calculate your 2026/27 NHS sick pay entitlement under Agenda for Change Section 14 (1 to 6 months Full Pay and Half Pay + £118.75/wk SSP). See your exact net monthly take-home pay during full pay and half pay.",
  alternates: {
    canonical: "https://netpayscale.uk/sick-pay-calculator/",
    types: {
      "text/markdown": "https://netpayscale.uk/sick-pay-calculator.md",
    },
  },
  other: {
    "ai-summary":
      "2026/27 NHS Sick Pay Calculator (Agenda for Change Section 14): calculates 1 to 6 months Full Pay and 2 to 6 months Half Pay + £118.75/wk Statutory Sick Pay (SSP) based on continuous NHS service, with exact monthly net take-home pay.",
  },
  openGraph: {
    title: "NHS Sick Pay Calculator 2026/27 (Full Pay, Half Pay & SSP) | NetPayScale UK",
    description:
      "Instant NHS Agenda for Change Section 14 sick pay calculator. Check your full pay and half pay months by length of service and exact net monthly take-home pay.",
    url: "https://netpayscale.uk/sick-pay-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

const SECTION_14_SCALE = [
  { service: "During 1st Year of NHS Service", fullPay: "1 Month", halfPay: "2 Months", totalWindow: "3 Months Protected" },
  { service: "During 2nd Year of NHS Service", fullPay: "2 Months", halfPay: "2 Months", totalWindow: "4 Months Protected" },
  { service: "During 3rd Year of NHS Service", fullPay: "4 Months", halfPay: "4 Months", totalWindow: "8 Months Protected" },
  { service: "During 4th & 5th Year of Service", fullPay: "5 Months", halfPay: "5 Months", totalWindow: "10 Months Protected" },
  { service: "After Completing 5 Years (Year 6+)", fullPay: "6 Months", halfPay: "6 Months", totalWindow: "12 Months Protected" },
];

export default function SickPayCalculatorPage() {
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
            name: "NHS Sick Pay Calculator",
            item: "https://netpayscale.uk/sick-pay-calculator/",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How long do you get full pay on NHS sick leave?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Agenda for Change Section 14, NHS occupational sick pay entitlement depends on your reckonable NHS service: 1 month full pay and 2 months half pay in Year 1; 2 months full pay and 2 months half pay in Year 2; 4 months full pay and 4 months half pay in Year 3; 5 months full pay and 5 months half pay in Years 4 and 5; and 6 months full pay and 6 months half pay after completing 5 years of NHS service.",
            },
          },
          {
            "@type": "Question",
            name: "Does NHS sick pay include unsocial hours enhancements?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Under Agenda for Change Section 14.4, NHS occupational sick pay is calculated on your normal full pay, including regularly rostered unsocial hours (night, weekend, and bank holiday) enhancements averaged over the reference period prior to sickness absence.",
            },
          },
          {
            "@type": "Question",
            name: "How is NHS half pay calculated with Statutory Sick Pay (SSP)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "During the half-pay phase of NHS sick leave, you receive 50% of your normal gross monthly pay PLUS Statutory Sick Pay (£118.75 per week / £514.58 per month in 2026/27), provided the combined total does not exceed your normal full pay. Because PAYE tax and National Insurance drop significantly on half pay, most NHS staff take home 62% to 68% of their normal net monthly pay during the half-pay phase.",
            },
          },
        ],
      },
    ],
  };

  const matrixBands = nhsData.bands.filter((b) =>
    ["Band 2", "Band 3", "Band 4", "Band 5", "Band 6", "Band 7", "Band 8a"].includes(b.band)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            NHS Salary Calculator
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800">NHS Sick Pay &amp; Half-Pay Calculator</span>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5" />
            Agenda for Change Section 14 (2026/27 Rates)
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            NHS Sick Pay &amp; Half-Pay Calculator{" "}
            <span className="text-rose-600">2026/27</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Check your exact <strong>NHS occupational sick pay entitlement (1 to 6 months Full Pay &amp; Half Pay)</strong> by years of service, and see how much <strong>net monthly cash</strong> you actually take home during the Half Pay + Statutory Sick Pay (`SSP`) phase.
          </p>
        </header>

        {/* Interactive Client Calculator */}
        <SickPayCalculatorClient />

        <AdPlaceholder slotId="sick-pay-mid" format="in-content" label="Sponsored Financial Resource" />

        {/* Table 1: Official Agenda for Change Section 14 Entitlement Table */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Official NHS Sick Pay Entitlement Scale (Agenda for Change Section 14)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Entitlement is based on your total aggregated reckonable NHS service across all Trusts in any rolling 12-month period.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
              Rolling 12-Month Window
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Reckonable NHS Service</th>
                  <th className="py-3.5 px-4 text-right">100% Full Pay Period</th>
                  <th className="py-3.5 px-4 text-right">50% Half Pay + SSP Period</th>
                  <th className="py-3.5 px-4 text-right">Combined Paid Sick Leave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {SECTION_14_SCALE.map((row) => (
                  <tr key={row.service} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.service}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">{row.fullPay}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-sky-700">{row.halfPay}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">{row.totalWindow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 2: Full Pay vs Half Pay + SSP Monthly Net Take-Home by Band */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              2026/27 NHS Full Pay vs. Half Pay + SSP Monthly Take-Home Chart
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Entry-step net monthly take-home pay during Full Pay vs. Half Pay + SSP (£514.58/mo) after PAYE tax, NI, and NHS Pension.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">NHS Band (Entry Salary)</th>
                  <th className="py-3.5 px-4 text-right">Full Pay Net / Mo</th>
                  <th className="py-3.5 px-4 text-right">Half Pay + SSP Gross / Mo</th>
                  <th className="py-3.5 px-4 text-right">Half Pay + SSP Net / Mo</th>
                  <th className="py-3.5 px-4 text-right">% of Normal Net Kept</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {matrixBands.map((b) => {
                  const res = calculateNHSPay({
                    band: b.band,
                    stepIndex: 0,
                    hcasZone: "standard",
                    contractedHours: 37.5,
                    nightHoursPerWeek: 0,
                    sundayHoursPerWeek: 0,
                    pensionOptedOut: false,
                    isScottishTax: false,
                    studentLoan: "none",
                  });
                  const fullNet = res.netPay.monthly;
                  const fullGross = res.grossPay.monthly;
                  const sspMo = (118.75 * 52) / 12;
                  const halfGross = Math.min(fullGross, fullGross * 0.5 + sspMo);
                  const halfAnn = halfGross * 12;
                  const penRate = res.pensionContribution.annual / res.grossPay.annual;
                  const halfPen = (halfAnn * penRate) / 12;
                  const taxAnn = Math.max(0, halfAnn - halfPen * 12 - 12570) * 0.2;
                  const niAnn = Math.max(0, halfAnn - 12570) * 0.08;
                  const halfNet = halfGross - halfPen - taxAnn / 12 - niAnn / 12;
                  const pct = Math.round((halfNet / fullNet) * 100);
                  const bandSlug = b.band.toLowerCase().replace(/\s+/g, "-");

                  return (
                    <tr key={b.band} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <Link href={`/bands/${bandSlug}/`} className="text-rose-600 hover:underline">
                          {b.band}
                        </Link>{" "}
                        <span className="text-xs font-normal text-slate-500">
                          ({formatCurrency(b.points[0].annualSalary)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                        {formatCurrency(Math.round(fullNet))}/mo
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        {formatCurrency(Math.round(halfGross))}/mo
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-sky-700">
                        {formatCurrency(Math.round(halfNet))}/mo
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ & Sibling Calculator Links */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Frequently Asked Questions: NHS Sick Pay &amp; Rolling 12-Month Rules
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900">
                  1. How does the NHS rolling 12-month sick pay calculation work?
                </h3>
                <p className="mt-1">
                  On the first day of any new sickness absence, NHS payroll (ESR) looks back over the <strong>immediately preceding 12 months</strong> and adds up all days of paid sickness absence taken in that window. Those days are deducted from your total Section 14 entitlement to determine how much Full Pay and Half Pay remains available.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  2. Do I still accrue NHS annual leave and bank holidays while on sick leave?
                </h3>
                <p className="mt-1">
                  Yes. You continue to accrue your full contractual Agenda for Change annual leave entitlement while on paid or unpaid sick leave. If you are unable to take your annual leave due to long-term sickness across the April 1st leave year boundary, you have the statutory right to carry over up to 20 days (150 hours pro-rata).
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  3. What happens to my NHS Pension while I am on Half Pay?
                </h3>
                <p className="mt-1">
                  During Half Pay, you only pay pension contributions on the actual reduced pay you receive, but your <strong>1/54th 2015 CARE pension pot continues to build as if you were working on 100% Full Pay</strong> (known as &ldquo;deemed pensionable pay&rdquo;) at no extra cost to you!
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">
                Complete NHS Financial Toolkit
              </span>
              <h2 className="text-xl font-extrabold">
                Explore All 2026/27 NHS Calculators
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Model your take-home pay, 2015 CARE pension pot, maternity pay phases, annual leave hours, and extra bank shifts.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  href: "/",
                  title: "2026/27 NHS Salary & Take-Home Pay Calculator",
                  sub: "Bands 2 to 9 • England, Scotland, Wales & NI",
                },
                {
                  href: "/pension-calculator/",
                  title: "NHS Pension (2015 CARE Scheme) Calculator",
                  sub: "1/54th accrual, tax-free lump sum & tier rates",
                },
                {
                  href: "/maternity-pay-calculator/",
                  title: "NHS Maternity Pay (OMP + SMP) Calculator",
                  sub: "8 wks full pay, 18 wks half pay + equalised spread",
                },
                {
                  href: "/annual-leave-calculator/",
                  title: "NHS Annual Leave & Bank Holiday Hours Calculator",
                  sub: "Convert 27, 29 & 33 days + 8 BH into hours & 11.5h shifts",
                },
                {
                  href: "/bank-shift-calculator/",
                  title: "NHS Bank Shift & Overtime Net Pay Calculator",
                  sub: "Exact cash-in-pocket after marginal tax, NI & student loan",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div>
                    <p className="text-xs font-extrabold text-white group-hover:text-rose-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
