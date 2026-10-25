import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";
import { PensionCalculatorClient } from "@/components/PensionCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import { ChevronRight, Landmark, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "NHS Pension Calculator 2026/27 | 2015 CARE Scheme Retirement & Tier Rates",
  description:
    "Calculate your 2026/27 NHS Pension monthly contribution (5.2% to 12.5%), PAYE tax relief savings, 23.78% employer contribution, and 2015 CARE Scheme (1/54th) annual retirement pension and tax-free lump sum.",
  alternates: {
    canonical: "https://netpayscale.uk/pension-calculator/",
  },
  openGraph: {
    title: "NHS Pension Calculator 2026/27 (2015 CARE Scheme & Contribution Tiers) | NetPayScale UK",
    description:
      "Model your exact 2015 NHS CARE pension pot, tax-free lump sum (£12 per £1), and real monthly take-home cost after tax relief across Bands 2 to 9.",
    url: "https://netpayscale.uk/pension-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

const PENSION_TIERS_2026 = [
  { tier: "Tier 1", range: "Up to £13,259", rate: "5.2%", exampleBand: "Part-time lower bands" },
  { tier: "Tier 2", range: "£13,260 to £28,854", rate: "6.5%", exampleBand: "Band 2, Band 3 & Band 4 Entry" },
  { tier: "Tier 3", range: "£28,855 to £35,155", rate: "8.3%", exampleBand: "Band 4 Top, Band 5 Entry & Mid" },
  { tier: "Tier 4", range: "£35,156 to £52,778", rate: "9.8%", exampleBand: "Band 5 Top, Band 6 & Band 7 Entry/Mid" },
  { tier: "Tier 5", range: "£52,779 to £67,668", rate: "10.7%", exampleBand: "Band 7 Top, Band 8a & Band 8b Entry" },
  { tier: "Tier 6", range: "£67,669 and above", rate: "12.5%", exampleBand: "Band 8b Mid/Top, 8c, 8d & Band 9" },
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
            name: "What are the NHS pension contribution tiers for 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NHS employee pension contribution rates for 2026/27 are based on your actual annual pensionable pay: 5.2% (up to £13,259), 6.5% (£13,260–£28,854), 8.3% (£28,855–£35,155), 9.8% (£35,156–£52,778), 10.7% (£52,779–£67,668), and 12.5% (£67,669+). In addition, your NHS employer contributes 23.78% of your pensionable pay.",
            },
          },
          {
            "@type": "Question",
            name: "Can I take a tax-free lump sum from the 2015 NHS Pension?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Although the 2015 NHS Pension does not include an automatic lump sum, you can choose to commute (exchange) part of your annual pension at retirement at a fixed rate of £12 of tax-free cash for every £1 of annual pension given up, up to HMRC's maximum tax-free lump sum limit.",
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
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            NHS Salary Calculator
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800">NHS Pension Calculator (2015 CARE Scheme)</span>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5" />
            2015 NHS CARE Scheme • 1/54th Accrual &amp; 2026/27 Tiers
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            NHS Pension Calculator <span className="text-indigo-600">2026/27</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Calculate your exact <strong>monthly NHS pension contribution</strong>, your <strong>real take-home cost after PAYE tax relief</strong>, the <strong>23.78% NHS employer contribution</strong>, and your projected <strong>annual retirement income &amp; tax-free lump sum</strong> under the 2015 CARE Scheme.
          </p>
        </header>

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
                Employee tier rates are based on actual annual pensionable earnings (including HCAS and unsocial hours enhancements).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              +23.78% Employer Funded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Pension Tier</th>
                  <th className="py-3.5 px-4">Actual Pensionable Pay</th>
                  <th className="py-3.5 px-4 text-right">Gross Rate</th>
                  <th className="py-3.5 px-4 text-right">Net Cost (After 20% Tax Relief)</th>
                  <th className="py-3.5 px-4">Typical Agenda for Change Bands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {PENSION_TIERS_2026.map((t) => {
                  const numRate = parseFloat(t.rate);
                  const netRateBasic = (numRate * 0.8).toFixed(2) + "%";
                  return (
                    <tr key={t.tier} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.tier}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{t.range}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-indigo-700">{t.rate}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700">{netRateBasic}</td>
                      <td className="py-3.5 px-4 text-slate-600">{t.exampleBand}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 2: 2015 CARE Scheme Retirement Pension Accrual by Band */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              How Much NHS Pension You Build by Band (1, 10, 20 &amp; 30 Years in 2015 Scheme)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Annual index-linked retirement pension built at 1/54th of entry-level salary per year (including 1.5% active above-inflation revaluation).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">NHS Band (Entry Salary)</th>
                  <th className="py-3.5 px-4 text-right">1 Year (1/54th)</th>
                  <th className="py-3.5 px-4 text-right">10 Years Service</th>
                  <th className="py-3.5 px-4 text-right">20 Years Service</th>
                  <th className="py-3.5 px-4 text-right">30 Years Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {matrixBands.map((b) => {
                  const sal = b.points[0].annualSalary;
                  const yr1 = sal / 54;
                  const calcPot = (yrs: number) => {
                    let sum = 0;
                    for (let i = 0; i < yrs; i++) sum += yr1 * Math.pow(1.015, i);
                    return sum;
                  };
                  const bandSlug = b.band.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <tr key={b.band} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <Link href={`/bands/${bandSlug}/`} className="text-indigo-600 hover:underline">
                          {b.band}
                        </Link>{" "}
                        <span className="text-xs font-normal text-slate-500">({formatCurrency(sal)})</span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-700 font-semibold">
                        +{formatCurrency(Math.round(yr1))}/yr
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-800 font-semibold">
                        {formatCurrency(Math.round(calcPot(10)))}/yr
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-800 font-semibold">
                        {formatCurrency(Math.round(calcPot(20)))}/yr
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                        {formatCurrency(Math.round(calcPot(30)))}/yr
                      </td>
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
              Frequently Asked Questions: 2015 NHS Pension Scheme
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900">
                  1. Why does my NHS pension cost me less than the gross deduction on my payslip?
                </h3>
                <p className="mt-1">
                  NHS Pension contributions are deducted under a <strong>Net Pay Arrangement</strong> before HMRC calculates your PAYE Income Tax. That means a basic-rate (20%) taxpayer automatically gets 20% instant tax relief, and a higher-rate (40%) taxpayer gets 40% instant tax relief on every £1 contributed.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  2. What is the Normal Pension Age (NPA) in the 2015 NHS Pension Scheme?
                </h3>
                <p className="mt-1">
                  In the 2015 CARE Scheme, your Normal Pension Age is linked to your UK <strong>State Pension Age</strong> (currently 66, rising to 67 between 2026 and 2028, and 68 for younger staff). However, you can claim your NHS pension early from <strong>age 55</strong> (rising to 57 in April 2028) with an actuarial early retirement reduction.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  3. What happens if I opt out of the NHS Pension?
                </h3>
                <p className="mt-1">
                  Opting out forfeits the <strong>23.78% employer contribution</strong>, your inflation-linked guaranteed lifetime retirement income, ill-health retirement protection, and the <strong>2× pensionable pay life assurance lump sum</strong> death-in-service benefit for your family.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                Complete NHS Financial Toolkit
              </span>
              <h2 className="text-xl font-extrabold">
                Explore All 2026/27 NHS Calculators
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compare your take-home pay, sick pay protection, maternity leave phases, annual leave hours, and extra bank shifts.
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
                  href: "/sick-pay-calculator/",
                  title: "NHS Sick Pay Entitlement & Half-Pay Calculator",
                  sub: "1 to 6 months full pay & half pay + SSP net take-home",
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
                    <p className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
