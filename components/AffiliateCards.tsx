import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { MagneticBentoContainer } from "@/components/MagneticBento";

export function AffiliateCards() {
  const guides = [
    {
      id: "band-promotion",
      title: "⚡ Band 5 → 6 Promotion & Pension Bracket Trap Tool",
      category: "Promotion • Pension Trap",
      description:
        "The £50/month marginal deduction trap solved. Model pension tier jumps (8.3% to 9.8%), tax creep, and the net cash impact of dropping ward night shifts.",
      actionText: "Open Promotion Comparator →",
      href: "/promotion-calculator/",
      benefit: "Pension Cliff & Shift Check",
      isHero: true,
      colSpan: "md:col-span-2",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
    },
    {
      id: "agency-vs-bank",
      title: "⚖️ NHS Staff Bank vs. Agency vs. Substantive Net Pay Comparator",
      category: "Shift Work • IR35 Umbrella",
      description:
        "The Inside IR35 umbrella trap exposed. Compare actual net take-home pay: NHS Staff Bank (+12.07% WTR holiday uplift & pension) vs Agency (deducting 13.8% Employer NI & umbrella margins).",
      actionText: "Open Bank vs Agency Comparator →",
      href: "/agency-vs-bank-calculator/",
      benefit: "Inside IR35 vs +12.07% WTR",
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
    },
    {
      id: "unsocial-hours",
      title: "🌙 Section 2 Unsocial Hours & Night Shift Pay Calculator",
      category: "Shift Pay • Section 2",
      description:
        "Calculate gross enhancement vs. net cash in bank across Nights (+30%/+44%), Saturdays, and Sundays (+60%/+88%). Includes interactive rota builder.",
      actionText: "Open Unsocial Hours Calculator →",
      href: "/unsocial-hours-calculator/",
      benefit: "+30% to +88% AfC Uplift",
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200/80",
    },
    {
      id: "trusts-directory",
      title: "🏥 Top 50 NHS Trusts & Hospital Pay Directory",
      category: "Hospitals • HCAS Zones",
      description:
        "Explore starting and top pay across 50 major UK NHS Trusts and Health Boards with hospital site mappings, ODS codes, and London Weighting allowances.",
      actionText: "Explore NHS Trusts Directory →",
      href: "/trusts/",
      benefit: "50 Verified NHS Trusts",
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
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
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-purple-50 text-purple-800 border-purple-200/80",
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
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    },
    {
      id: "back-pay-arrears",
      title: "NHS 3.3% Pay Rise & Back-Pay Arrears Calculator",
      category: "Pay Award • Apr Arrears",
      description:
        "Calculate your exact backdated 2026/27 NHS Agenda for Change lump-sum arrears from 1 April after PAYE tax, National Insurance, NHS Pension, and Student Loan.",
      actionText: "Open Back-Pay Calculator →",
      href: "/pay-rise-backpay-calculator/",
      benefit: "+3.3% Backdated Lump Sum",
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
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
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-pink-50 text-pink-800 border-pink-200/80",
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
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200/80",
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
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200/80",
    },
    {
      id: "international",
      title: "🌍 Overseas Recruits Visa & Relocation Hub (8 Languages)",
      category: "Global • Relocation",
      description:
        "Dedicated guide for international healthcare workers entering the UK NHS on Health & Care Worker Visas. Translated into 8 languages with take-home pay models.",
      actionText: "Open International Guide →",
      href: "/international/",
      benefit: "8 Languages Supported",
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
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
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200/80",
    },
    {
      id: "embed-widget",
      title: "🔗 Embed Free NHS Calculator Widget for Your Site",
      category: "Webmasters • Backlink Engine",
      description:
        "Add a responsive, zero-maintenance 2026/27 NHS Pay Calculator to your nursing blog, trust intranet, or recruitment portal in 30 seconds with 1-click HTML code.",
      actionText: "Get Embed Code →",
      href: "/embed/",
      benefit: "Free Iframe Generator",
      isHero: false,
      colSpan: "md:col-span-1",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    },
  ];

  return (
    <section className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#005EB8]" />
            Complete NHS Agenda for Change Calculator Suite &amp; Financial Toolkit
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Specialist interactive calculators for NHS promotion traps, unsocial night shifts, pensions, trusts, maternity, sick pay, and back-pay arrears
          </p>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">
          2026/27 AfC Handbook
        </span>
      </div>

      {/* Asymmetric Bento Grid Container with Universal & GPU-Accelerated Magnetic Hover Engine */}
      <MagneticBentoContainer
        variant="2xl"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1"
      >
        {guides.map((item) => (
          <div
            key={item.id}
            className={`bento-card group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 sm:p-5 transition-all duration-200 hover:bg-white hover:border-zinc-300 hover:shadow-xs ${
              item.colSpan || ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  {item.category}
                </span>
                <span
                  className={`text-[11px] font-mono font-semibold rounded px-2 py-0.5 border ${item.badgeColor}`}
                >
                  {item.benefit}
                </span>
              </div>
              <h4
                className={`font-bold text-zinc-900 leading-snug group-hover:text-[#005EB8] transition-colors ${
                  item.isHero ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                }`}
              >
                {item.title}
              </h4>
              <p
                className={`mt-1.5 text-zinc-600 leading-relaxed ${
                  item.isHero ? "text-xs sm:text-sm" : "text-xs"
                }`}
              >
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between">
              <Link
                href={item.href}
                className="text-xs font-bold text-[#005EB8] hover:underline transition-colors flex items-center gap-1"
              >
                <span>{item.actionText}</span>
              </Link>
              <ArrowRight className="w-3.5 h-3.5 text-[#005EB8] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </MagneticBentoContainer>

      <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
        Statutory Notice: NetPayScale UK provides independent computational models synchronised with the 2026/27 NHS Terms and Conditions of Service (Agenda for Change) Handbook and HMRC PAYE regulations.
      </p>
    </section>
  );
}

export default AffiliateCards;
