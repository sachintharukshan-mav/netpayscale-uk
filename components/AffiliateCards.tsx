import React from "react";
import Link from "next/link";

export function AffiliateCards() {
  const guides = [
    {
      id: "back-pay-arrears",
      title: "NHS 3.3% Pay Rise & Back-Pay Arrears Calculator",
      category: "Pay Award • Apr Arrears",
      description:
        "Calculate your exact backdated 2026/27 NHS Agenda for Change lump-sum arrears from 1 April after PAYE tax, National Insurance, NHS Pension, and Student Loan.",
      actionText: "Open Back-Pay Calculator →",
      href: "/pay-rise-backpay-calculator/",
      benefit: "+3.3% Backdated Lump Sum",
    },
    {
      id: "band-promotion",
      title: "NHS Band Promotion & Spine Step Net Comparator",
      category: "Promotion • Band 5 → 6",
      description:
        "Compare any two NHS Bands or spine steps side-by-side—including NHS Pension tier cliffs (8.3% to 9.8%) and the net pay impact of dropping ward night shifts.",
      actionText: "Open Promotion Comparator →",
      href: "/promotion-calculator/",
      benefit: "Pension Cliff & Shift Check",
    },
    {
      id: "redundancy-mars",
      title: "NHS Redundancy & MARS Severance Calculator",
      category: "Severance • Sec 16",
      description:
        "Calculate your contractual NHS Section 16 redundancy (1 month per year up to 24 years, £80k cap) or MARS payout after the £30,000 HMRC tax-free allowance.",
      actionText: "Open Redundancy Calculator →",
      href: "/redundancy-pay-calculator/",
      benefit: "First £30,000 Tax-Free",
    },
    {
      id: "pension-avc",
      title: "NHS 2015 CARE Pension, AVCs & Lump Sum Calculator",
      category: "Retirement • CARE 1/54th",
      description:
        "NHS employees bank 1/54th of pensionable pay every year (+23.78% employer contribution) with 20% to 40% automatic PAYE tax relief and £12:£1 lump sum commutation.",
      actionText: "Open NHS Pension Calculator →",
      href: "/pension-calculator/",
      benefit: "Up to 40% HMRC Tax Relief",
    },
    {
      id: "bank-overtime",
      title: "NHS Bank Shifts & Overtime Net Cash Calculator",
      category: "Extra Shifts • Sec 2 & 3",
      description:
        "Calculate your exact marginal take-home pay per 7.5h, 11.5h, or 12h shift across Weekday, Night/Saturday (+30%/+44%), Sunday/BH (+60%/+88%), and 1.5x Overtime rates.",
      actionText: "Open Bank Shift Calculator →",
      href: "/bank-shift-calculator/",
      benefit: "+12.07% WTR Holiday Uplift",
    },
    {
      id: "maternity-omp",
      title: "NHS Occupational Maternity Pay (OMP + SMP) Planner",
      category: "Family Leave • Sec 15",
      description:
        "Model your 8 weeks 100% full pay, 18 weeks 50% half pay + SMP (£187.18/wk), and compare phased monthly payslips against equalised 9 or 12 month spread pay.",
      actionText: "Open Maternity Pay Calculator →",
      href: "/maternity-pay-calculator/",
      benefit: "Equalised 9/12-Mo Spread",
    },
    {
      id: "sick-pay",
      title: "NHS Sick Pay Entitlement & Half-Pay Calculator",
      category: "Income Protection • Sec 14",
      description:
        "Check your 1 to 6 months Full Pay and Half Pay + Statutory Sick Pay (£118.75/wk) entitlement by years of service, and see why half pay preserves ~65% of net income.",
      actionText: "Open NHS Sick Pay Calculator →",
      href: "/sick-pay-calculator/",
      benefit: "Up to 6m Full + 6m Half Pay",
    },
    {
      id: "annual-leave",
      title: "NHS Annual Leave & Bank Holiday Hours Converter",
      category: "HealthRoster • Sec 13",
      description:
        "Convert your 27, 29, or 33 days of Agenda for Change annual leave plus 8 UK Bank Holidays into combined HealthRoster hours and 11.5-hour or 12-hour shift equivalents.",
      actionText: "Open Annual Leave Calculator →",
      href: "/annual-leave-calculator/",
      benefit: "262.5h to 307.5h FTE",
    },
    {
      id: "band-progression",
      title: "National Agenda for Change Band 2–9 Progression Hubs",
      category: "Pay Progression • Annex 2",
      description:
        "Explore full experience step progression timelines, regional HCAS London Weighting comparisons, and hourly rates across all 11 Agenda for Change pay bands.",
      actionText: "Explore NHS Band 5–9 Hubs →",
      href: "/bands/band-5/",
      benefit: "+3.3% 2026/27 Pay Award",
    },
  ];

  return (
    <section className="rounded-xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950">
            Complete NHS Agenda for Change Calculator Suite &amp; Financial Toolkit
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Specialist calculators for NHS back-pay arrears, band promotions, redundancy, pensions, bank shifts, maternity, sick pay, and annual leave
          </p>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">
          2026/27 AfC Handbook
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {guides.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-4 transition-all hover:bg-zinc-50 hover:border-zinc-300"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  {item.category}
                </span>
                <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 rounded px-1.5 py-0.5">
                  {item.benefit}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-zinc-900 leading-snug">
                {item.title}
              </h4>
              <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-200/60">
              <Link
                href={item.href}
                className="text-xs font-semibold text-[#005EB8] hover:underline transition-colors"
              >
                {item.actionText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
        Statutory Notice: NetPayScale UK provides independent computational models synchronised with the 2026/27 NHS Terms and Conditions of Service (Agenda for Change) Handbook and HMRC PAYE regulations.
      </p>
    </section>
  );
}

export default AffiliateCards;
