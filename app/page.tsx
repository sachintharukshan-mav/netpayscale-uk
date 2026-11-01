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
            Pick your Agenda for Change band and see exactly what lands in your bank account, after PAYE income tax, National Insurance, NHS Pension (2015 CARE Scheme), and student loan deductions.
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
