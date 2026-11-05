import React from "react";
import Calculator from "@/components/Calculator";
import QuickSelectStrip from "@/components/QuickSelectStrip";
import ScenarioComparator from "@/components/ScenarioComparator";
import EsrPayslipView from "@/components/EsrPayslipView";
import BandStepUpMetrics from "@/components/BandStepUpMetrics";
import PopularBandsComparison from "@/components/PopularBandsComparison";
import PersonaScenarios from "@/components/PersonaScenarios";
import BandsOverview from "@/components/BandsOverview";
import HcasGuide from "@/components/HcasGuide";
import AffiliateCards from "@/components/AffiliateCards";
import AdPlaceholder from "@/components/AdPlaceholder";
import FAQSection from "@/components/FAQSection";
import PseoDirectory from "@/components/PseoDirectory";
import { getAllPseoEntries, getAllRoleHubs } from "@/lib/pseo-matrix";
import { calculateNHSPay } from "@/lib/calculator";

export default function HomePage() {
  const pseoEntries = getAllPseoEntries();
  const roleHubs = getAllRoleHubs();

  // Baseline calculation for the default ESR Payslip Replica (Band 5 Intermediate Staff Nurse)
  const defaultEsrResult = calculateNHSPay({
    band: "Band 5",
    stepIndex: 1,
    hcasZone: "standard",
    contractedHours: 37.5,
    nightHoursPerWeek: 11.5,
    sundayHoursPerWeek: 2.88,
    pensionOptedOut: false,
    taxCode: "1257L",
    isScottishTax: false,
    studentLoan: "plan2",
  });

  return (
    <div className="min-h-screen bg-bg-page pb-24 lg:pb-16">
      {/* 1. TOP STATUS & QUICK SELECT STRIP (Matching Google Stitch Screen 2) */}
      <QuickSelectStrip />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 pt-6">
        {/* 2. HERO HEADER (Compact, Institutional, No Fluff) */}
        <section className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white px-3 py-1 text-xs font-semibold text-text-ink shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-cash-emerald pulse-glow-dot" />
            <span>2026/27 Agenda for Change Verified (+3.3% Pay Uplift)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-ink leading-[1.12]">
            NHS Pay Calculator 2026/27 <br className="hidden sm:inline" />
            <span className="text-nhs-blue">Know Your Real Take-Home Pay in Seconds</span>
          </h1>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl">
            Calculate your real 2026/27 NHS take-home pay in seconds with <strong className="font-semibold text-text-ink">NetPayScale UK</strong>—modelling Agenda for Change (AfC) Bands 2–9, HMRC PAYE income tax, National Insurance, 2015 CARE Pension tiers, student loans, and Section 2 unsocial shift uplifts.
          </p>
        </section>

        {/* AD SLOT 1: Above-the-Fold Top Leaderboard (High First-Impression Viewability) */}
        <AdPlaceholder
          slotId="home-top-leaderboard"
          format="leaderboard"
          label="728×90 ATF Leaderboard · 320×50 Mobile"
        />

        {/* 3. CORE INTERACTIVE CALCULATOR FOLD (Includes Sticky Right-Rail 300×250 Companion) */}
        <section id="calculator" className="scroll-mt-20">
          <Calculator />
        </section>

        {/* AD SLOT 3: Post-Calculator Decision Transition Unit (Highest CTR Zone) */}
        <AdPlaceholder
          slotId="home-post-calculator"
          format="in-content"
          label="Post-Calculator Transition · Native / 728×90 Display"
        />

        {/* 4. SIDE-BY-SIDE PROMOTION & STEP COMPARATOR (Directly Embedded matching Stitch Screen 2) */}
        <section id="comparator-section" className="scroll-mt-20 pt-8 sm:pt-10 border-t border-border-subtle space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-nhs-blue text-[24px]">compare_arrows</span>
                <h2 className="text-xl sm:text-2xl font-bold text-text-ink">
                  Side-by-Side Promotion &amp; Step Comparator
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl">
                Evaluate the real cash-in-pocket gain when stepping from Band 5 (Top) to Band 6 (Entry) after pension tier shifts and tax adjustments.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 self-start md:self-auto shrink-0 text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Pension Tier Boundary Alert</span>
            </div>
          </div>

          <ScenarioComparator />
        </section>

        {/* 5. OFFICIAL ESR PAYSLIP REPLICA (Directly Embedded matching Stitch Screen 2) */}
        <section id="esr-payslip-print" className="scroll-mt-20 pt-8 sm:pt-10 border-t border-border-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-nhs-blue text-[24px]">receipt_long</span>
                <h2 className="text-xl sm:text-2xl font-bold text-text-ink">
                  Official Electronic Staff Record (ESR) Payslip Replica
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Exact visual mimic of standard NHS ESR itemized payroll statements for mortgage, tenancy, or verification checks.
              </p>
            </div>
          </div>

          <EsrPayslipView result={defaultEsrResult} />
        </section>

        {/* AD SLOT 4: Post-Payslip Mid-Content Unit */}
        <AdPlaceholder
          slotId="home-post-payslip"
          format="leaderboard"
          label="Mid-Content Payslip Verification Slot · 728×90"
        />

        {/* 6. CAREER PROMOTION & STEP-UP METRICS */}
        <BandStepUpMetrics />

        {/* 7. POPULAR CLINICAL BANDS (Bands 5, 6, 7) */}
        <PopularBandsComparison />

        {/* 8. WORKED PERSONA SCENARIOS */}
        <PersonaScenarios />

        {/* 9. KEYWORKER FINANCIAL OPTIMIZATION GUIDES */}
        <AffiliateCards />

        {/* 10. NATIONAL AGENDA FOR CHANGE BANDS 2-9 DIRECTORY */}
        <section id="bands-overview" className="scroll-mt-20">
          <BandsOverview />
        </section>

        {/* 11. LONDON WEIGHTING (HCAS) GUIDANCE */}
        <section id="hcas-guide" className="scroll-mt-20">
          <HcasGuide />
        </section>

        {/* 11B. STATIC SSR SIBLING ENTITY COMPARISON BLOCK (Bank vs Agency, 2015 CARE vs Opt-Out, Standard vs HCAS) */}
        <section
          id="nhs-contract-comparison"
          aria-labelledby="sibling-comparison-heading"
          className="scroll-mt-20 pt-8 border-t border-border-subtle space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-nhs-blue/10 text-nhs-blue text-xs font-bold uppercase tracking-wider mb-1.5">
                Statutory Entity &amp; Contract Comparison · 2026/27
              </span>
              <h2 id="sibling-comparison-heading" className="text-xl sm:text-2xl font-bold text-text-ink">
                NHS Staff Bank vs. Inside IR35 Agency, 2015 CARE Pension vs. Opting Out &amp; HCAS Weighting
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-3xl">
                Direct side-by-side audit of how <strong className="font-semibold text-text-ink">NetPayScale UK</strong> models competing NHS employment routes, superannuation elections, and geographic High Cost Area Supplements under the 2026/27 Agenda for Change Handbook.
              </p>
            </div>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-labelledby="sibling-comparison-heading"
            className="overflow-x-auto rounded-xl border border-zinc-200/90 bg-white shadow-xs focus:outline-2 focus:outline-nhs-blue"
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/90 text-zinc-700 font-semibold">
                  <th scope="col" className="sticky top-0 bg-zinc-50/95 py-3.5 px-4">
                    Payroll Decision / Entity Pair
                  </th>
                  <th scope="col" className="sticky top-0 bg-zinc-50/95 py-3.5 px-4">
                    Option A (Substantive / NHS Scheme)
                  </th>
                  <th scope="col" className="sticky top-0 bg-zinc-50/95 py-3.5 px-4">
                    Option B (Alternative / Opt-Out / London)
                  </th>
                  <th scope="col" className="sticky top-0 bg-zinc-50/95 py-3.5 px-4">
                    Net Take-Home &amp; Statutory Impact
                  </th>
                  <th scope="col" className="sticky top-0 bg-zinc-50/95 py-3.5 px-4 text-right">
                    Specialist Calculator
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                <tr className="hover:bg-zinc-50/60 transition-colors align-top">
                  <th scope="row" className="py-3.5 px-4 font-bold text-zinc-950">
                    1. NHS Staff Bank vs. Inside IR35 Agency Pay
                  </th>
                  <td className="py-3.5 px-4 leading-relaxed">
                    <strong className="text-zinc-900">NHS Trust Staff Bank:</strong> Paid directly via ESR PAYE with a statutory <span className="font-mono font-semibold text-emerald-700">+12.07%</span> Working Time Regulations (WTR) rolled-up holiday uplift, NHS Trust pays Employer Class 1 NI (<span className="font-mono">13.8%</span>), and optional 2015 CARE pension accrual.
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    <strong className="text-zinc-900">Inside IR35 Umbrella Agency:</strong> Assignment rate must cover <span className="font-mono font-semibold text-rose-700">13.8%</span> Employer NI, <span className="font-mono">0.5%</span> Apprenticeship Levy, and £20–£28/wk umbrella margin before employee PAYE tax and Class 1 NI are deducted.
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    An agency headline rate of <span className="font-mono font-semibold">£30.00/hr</span> Inside IR35 often yields lower net take-home pay than a <span className="font-mono font-semibold">£24.50/hr</span> NHS Bank shift once umbrella Employer NI and holiday retention are stripped out.
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <a
                      href="/agency-vs-bank-calculator/"
                      className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[11px] font-semibold text-nhs-blue hover:border-nhs-blue hover:bg-white transition-colors"
                    >
                      NHS Staff Bank vs Inside IR35 Agency Net Pay Comparator →
                    </a>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/60 transition-colors align-top">
                  <th scope="row" className="py-3.5 px-4 font-bold text-zinc-950">
                    2. NHS 2015 CARE Scheme vs. Opting Out
                  </th>
                  <td className="py-3.5 px-4 leading-relaxed">
                    <strong className="text-zinc-900">2015 CARE Active Member:</strong> Tiered member contributions (<span className="font-mono font-semibold">5.2%–12.5%</span> gross; <span className="font-mono">8.3%</span> on Band 5 entry) deducted before PAYE tax (20%/40% tax relief), backed by a <span className="font-mono font-semibold text-emerald-700">23.78%</span> employer contribution and <span className="font-mono">1/54th</span> CPI+1.5% index-linked accrual.
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    <strong className="text-zinc-900">Pension Opt-Out (Form SD502):</strong> Increases immediate monthly net cash by ~£177/mo on Band 5 entry (£32,073) after losing 20% PAYE tax relief, but forfeits £7,627/yr in employer funding and 2× salary death-in-service cover.
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    Stepping across the £32,136 or £63,995 pension tier boundary can trigger the <a href="/promotion-calculator/" className="text-nhs-blue underline font-semibold">NHS Band 5 to Band 6 Promotion &amp; Pension Trap Calculator</a> cliff where higher member % reduces net pay gain.
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <a
                      href="/pension-calculator/"
                      className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[11px] font-semibold text-nhs-blue hover:border-nhs-blue hover:bg-white transition-colors"
                    >
                      NHS 2015 CARE Pension Contribution &amp; 1/54th Accrual Calculator →
                    </a>
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/60 transition-colors align-top">
                  <th scope="row" className="py-3.5 px-4 font-bold text-zinc-950">
                    3. Standard UK AfC vs. High Cost Area Supplements (HCAS) &amp; Section 2
                  </th>
                  <td className="py-3.5 px-4 leading-relaxed">
                    <strong className="text-zinc-900">National Standard AfC (0% HCAS):</strong> Core 2026/27 spine points across England, Wales, and Northern Ireland (37.5h week) or NHS Scotland (35.0h week), plus <span className="font-mono">+30% to +88%</span> Section 2 night/weekend enhancements.
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    <strong className="text-zinc-900">London &amp; Fringe HCAS Zones:</strong> Adds pensionable London Weighting of <span className="font-mono font-semibold text-purple-700">+20%</span> Inner London (£5,609–£8,466), <span className="font-mono font-semibold text-blue-700">+15%</span> Outer London (£4,714–£5,982), or <span className="font-mono font-semibold text-amber-700">+5%</span> Fringe (£1,316–£2,193).
                  </td>
                  <td className="py-3.5 px-4 leading-relaxed">
                    Because HCAS is superannuable, Inner London weighting can push a <a href="/bands/band-5/" className="text-nhs-blue underline font-semibold">2026/27 NHS Band 5 Salary &amp; Take-Home Pay</a> or <a href="/bands/band-6/" className="text-nhs-blue underline font-semibold">2026/27 NHS Band 6 Salary &amp; Take-Home Pay</a> clinician into the next NHS pension tier.
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <a
                      href="/unsocial-hours-calculator/"
                      className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[11px] font-semibold text-nhs-blue hover:border-nhs-blue hover:bg-white transition-colors"
                    >
                      NHS Section 2 Unsocial Hours &amp; Night Shift Pay Calculator →
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 12. PROGRAMMATIC SEO REGIONAL & NATIONAL ROLE GUIDES DIRECTORY */}
        <PseoDirectory entries={pseoEntries} roleHubs={roleHubs} />

        {/* 12B. NOVEMBER 2026 HIGH-VELOCITY NHS PAY & POLICY CALCULATORS */}
        <section className="scroll-mt-20 pt-8 border-t border-border-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-nhs-blue/10 text-nhs-blue text-xs font-bold uppercase tracking-wider mb-1.5">
                Updated November 2026 · Primary Statutory Tools
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-ink">
                2027/28 Pay Forecast, ESR Payslip Decoder, EV Mileage &amp; NI Backpay
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/nhs-pay-rise-2027/"
              className="group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-nhs-blue transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-nhs-blue mb-1">
                  DHSC 19 Oct 2026 Evidence
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-nhs-blue">
                  NHS Pay Rise 2027/28 Calculator (2.4% Proposal)
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Compare the 2.4% DHSC proposal against 3.3% CPI and 5.0% union claims across Bands 2–9 with pension cliff-edge alerts.
                </p>
              </div>
              <span className="text-xs font-bold text-nhs-blue mt-3 inline-flex items-center gap-1">
                Model 2027/28 Net Pay →
              </span>
            </a>

            <a
              href="/nhs-payslip-explained/"
              className="group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-nhs-blue transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  ESR Payroll Audit
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-nhs-blue">
                  NHS Payslip Explained &amp; ESR Code Decoder
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Decode Night Duty EN, Saturday/Sunday EN, AfC Absence, NP, and WTD Pay with an interactive shift enhancement verifier.
                </p>
              </div>
              <span className="text-xs font-bold text-nhs-blue mt-3 inline-flex items-center gap-1">
                Verify ESR Payslip →
              </span>
            </a>

            <a
              href="/salary-sacrifice-mileage-calculator/"
              className="group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-nhs-blue transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
                  Section 17 &amp; EV Fleet
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-nhs-blue">
                  NHS Salary Sacrifice Car &amp; 59p Mileage Calculator
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Calculate 59p/24p/30p Section 17 mileage, HMRC Form P87 tax relief, EV 4% BiK net cost, and 1/54th CARE pension impact.
                </p>
              </div>
              <span className="text-xs font-bold text-nhs-blue mt-3 inline-flex items-center gap-1">
                Calculate EV &amp; Mileage →
              </span>
            </a>

            <a
              href="/northern-ireland-pay-calculator/"
              className="group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-nhs-blue transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                  HSCNI &amp; RCN Ballot
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-nhs-blue">
                  Northern Ireland (HSCNI) 3.3% Backpay Calculator
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Compare 2025/26 HSCNI pay in payment against the unpaid 2026/27 +3.3% parity award and accumulate monthly arrears.
                </p>
              </div>
              <span className="text-xs font-bold text-nhs-blue mt-3 inline-flex items-center gap-1">
                Calculate NI Backpay →
              </span>
            </a>

            <a
              href="/wales-pay-calculator/"
              className="group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-nhs-blue transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1">
                  GIG Cymru · 36.5h Week
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-nhs-blue">
                  NHS Wales Pay Calculator 2026/27 (36.5-Hour Week)
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Calculate 2026/27 NHS Wales Band 2–9 net pay, the +2.74% higher 36.5-hour hourly rate, and Radiographer &amp; OT salaries across all 7 Welsh Health Boards.
                </p>
              </div>
              <span className="text-xs font-bold text-nhs-blue mt-3 inline-flex items-center gap-1">
                Calculate NHS Wales Pay →
              </span>
            </a>
          </div>
        </section>

        {/* AD SLOT 5: Pre-FAQ Organic Search Anchor Slot */}
        <AdPlaceholder
          slotId="home-pre-faq"
          format="in-content"
          label="Pre-FAQ High-Intent Search Slot · 728×90 / Multiplex"
        />

        {/* 13. FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="scroll-mt-20">
          <FAQSection />
        </section>
      </main>
    </div>
  );
}
