import type { Metadata } from "next";
import Link from "next/link";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";
import { BankShiftCalculatorClient } from "@/components/BankShiftCalculatorClient";
import AdPlaceholder from "@/components/AdPlaceholder";
import { ChevronRight, Banknote, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "NHS Bank Shift & Overtime Net Pay Calculator 2026/27 | Take-Home Pay Per Shift",
  description:
    "Calculate your exact 2026/27 NHS bank shift and overtime take-home pay per 7.5h, 11.5h, or 12h shift after PAYE tax, National Insurance, Student Loan, and WTR 12.07% holiday uplift.",
  alternates: {
    canonical: "https://netpayscale.uk/bank-shift-calculator/",
  },
  openGraph: {
    title: "NHS Bank Shift & Overtime Net Pay Calculator 2026/27 | NetPayScale UK",
    description:
      "See how much cash you actually keep from an extra NHS bank or overtime shift (Weekday, Night/Saturday +30%, Sunday/BH +60%, and 1.5x Overtime).",
    url: "https://netpayscale.uk/bank-shift-calculator/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

export default function BankShiftCalculatorPage() {
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
            name: "NHS Bank Shift & Overtime Calculator",
            item: "https://netpayscale.uk/bank-shift-calculator/",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How much tax do I pay on an NHS bank shift in 2026/27?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Because your £12,570 Personal Allowance is allocated to your main substantive NHS post, extra bank shifts or overtime are taxed at your marginal rate: 20% Basic Rate tax plus 8% Employee National Insurance (28% total) if your combined annual income is below £50,270, or 40% Higher Rate tax plus 2% NI (42% total) on income above £50,270. If you have a Student Loan, an additional 9% is deducted.",
            },
          },
          {
            "@type": "Question",
            name: "Do NHS bank shifts include 12.07% holiday pay (WTR)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Under Working Time Regulations (WTR) and NHS Professionals (NHSP) / Trust bank frameworks, bank workers receive a 12.07% statutory holiday pay uplift either rolled into their hourly bank rate or accrued into a separate annual leave pot that can be claimed.",
            },
          },
          {
            "@type": "Question",
            name: "What are the 2026/27 NHS unsocial hours enhancement rates for bank shifts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under Agenda for Change Section 2, nights (8pm–6am) and Saturdays attract +44% for Bands 2 and 3, and +30% for Bands 4–9. Sundays and Public/Bank Holidays attract +88% for Bands 2 and 3, and +60% for Bands 4–9.",
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
          <Link href="/" className="hover:text-sky-600 transition-colors">
            NHS Salary Calculator
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800">NHS Bank & Overtime Shift Calculator</span>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold uppercase tracking-wider">
            <Banknote className="w-3.5 h-3.5" />
            Agenda for Change Section 2 & 3 (2026/27 Rates)
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            NHS Bank Shift & Overtime Net Pay Calculator{" "}
            <span className="text-sky-600">2026/27</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Find out exactly how much <strong>net cash-in-pocket</strong> you take home from an extra <strong>7.5h, 11.5h, or 12h NHS bank or overtime shift</strong> after marginal PAYE Income Tax, National Insurance, Student Loan, and the 12.07% WTR holiday uplift.
          </p>
        </header>

        {/* Interactive Client Calculator */}
        <BankShiftCalculatorClient />

        <AdPlaceholder slotId="bank-shift-mid" format="in-content" label="Sponsored Financial Resource" />

        {/* Pre-rendered 11.5h Ward Shift Gross & Net Pay Matrix Across Bands 2 to 8a */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                2026/27 NHS 11.5-Hour Bank Shift Pay Chart (Gross vs. Net Take-Home)
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Entry-step rates for an 11.5-hour paid ward shift (including 12.07% WTR holiday uplift; Net assumes Basic Rate 20% Tax + 8% NI, or 40% Tax + 2% NI above £50,270).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl shrink-0">
              <Clock className="w-3.5 h-3.5" />
              11.5h Paid Shift
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">NHS Band (Entry)</th>
                  <th className="py-3.5 px-4 text-right">Base Hourly</th>
                  <th className="py-3.5 px-4 text-right">Weekday 11.5h (Net)</th>
                  <th className="py-3.5 px-4 text-right">Night / Sat 11.5h (Net)</th>
                  <th className="py-3.5 px-4 text-right">Sunday / BH 11.5h (Net)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {matrixBands.map((b) => {
                  const sal = b.points[0].annualSalary;
                  const hr = b.points[0].hourlyRate || sal / 1955.357;
                  const isLow = ["Band 2", "Band 3"].includes(b.band);
                  const nightMult = isLow ? 1.44 : 1.3;
                  const sunMult = isLow ? 1.88 : 1.6;
                  const keepRatio = sal > 50270 ? 0.58 : 0.72; // 1 - (tax + NI)

                  const wkGross = hr * 1.1207 * 11.5;
                  const ntGross = hr * nightMult * 1.1207 * 11.5;
                  const snGross = hr * sunMult * 1.1207 * 11.5;

                  const bandSlug = b.band.toLowerCase().replace(/\s+/g, "-");

                  return (
                    <tr key={b.band} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <Link href={`/bands/${bandSlug}/`} className="text-sky-600 hover:underline">
                          {b.band}
                        </Link>{" "}
                        <span className="text-xs font-normal text-slate-500">
                          ({formatCurrency(sal)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">£{hr.toFixed(2)}/hr</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                        {formatCurrency(Math.round(wkGross * keepRatio))}{" "}
                        <span className="text-[11px] text-slate-400">
                          ({formatCurrency(Math.round(wkGross))} gross)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                        {formatCurrency(Math.round(ntGross * keepRatio))}{" "}
                        <span className="text-[11px] text-slate-400">
                          ({formatCurrency(Math.round(ntGross))} gross)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                        {formatCurrency(Math.round(snGross * keepRatio))}{" "}
                        <span className="text-[11px] font-normal text-emerald-600">
                          ({formatCurrency(Math.round(snGross))} gross)
                        </span>
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
              Frequently Asked Questions: NHS Bank Shifts & Overtime
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900">
                  1. Why is my bank payslip on a &ldquo;BR&rdquo; (Basic Rate) tax code?
                </h3>
                <p className="mt-1">
                  When you hold a separate NHS Bank assignment (or work via NHS Professionals), HMRC assigns your £12,570 tax-free Personal Allowance to your primary substantive post (`1257L`) and places your secondary bank post on a `BR` (20% flat deduction) or `D0` (40%) code so you never underpay tax at the end of the financial year.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  2. Is NHS overtime pensionable?
                </h3>
                <p className="mt-1">
                  Contractual overtime worked above 37.5 hours per week (paid at 1.5x time-and-a-half or 2.0x on Bank Holidays) is <strong>non-pensionable</strong> under the 2015 NHS Pension Scheme. However, additional hours worked by part-time staff up to 37.5 hours per week (plain time) and separate Bank shifts (if you haven&apos;t opted out on your bank assignment) are pensionable up to whole-time equivalent hours.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  3. Does working extra bank shifts push my main salary into a higher pension tier?
                </h3>
                <p className="mt-1">
                  No. Your substantive post&apos;s NHS Pension contribution tier is determined by your pensionable earnings in that post (and overtime above 37.5 hours is non-pensionable). Separate bank assignments are assessed separately unless aggregated under specific part-time rules.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
                Complete NHS Financial Toolkit
              </span>
              <h2 className="text-xl font-extrabold">
                Explore All 2026/27 NHS Calculators
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Switch between our core Agenda for Change salary calculator, maternity leave planner, and annual leave hours converter.
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
                  href: "/bands/band-5/",
                  title: "NHS Band 5 Salary & Progression Guide",
                  sub: "Newly qualified & experienced Staff Nurse pay points",
                },
                {
                  href: "/bands/band-6/",
                  title: "NHS Band 6 Salary & Progression Guide",
                  sub: "Sister, Charge Nurse & Specialist Practitioner pay points",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div>
                    <p className="text-xs font-extrabold text-white group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
