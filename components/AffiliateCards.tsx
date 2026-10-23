import React from "react";
import { ArrowUpRight, Car, Home, PiggyBank, ShieldCheck, Wallet } from "lucide-react";

export default function AffiliateCards() {
  const cards = [
    {
      id: "pension-avc",
      category: "NHS Retirement",
      title: "Boost Your NHS Pension with Tax-Relieved AVCs",
      description:
        "NHS staff can invest in Additional Voluntary Contributions (AVCs) or a personal SIPP to bridge retirement gaps with up to 40% HMRC tax relief.",
      cta: "Compare Top UK SIPP Providers",
      icon: PiggyBank,
      badge: "Up to 40% Tax Relief",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
      accentBorder: "hover:border-purple-500",
      link: "#",
    },
    {
      id: "cash-isa",
      category: "Tax-Free Savings",
      title: "Top UK High-Yield Cash ISAs (4.85%+ AER)",
      description:
        "Protect your monthly take-home surplus from HMRC tax with flexible FSCS-protected Cash ISAs. Deposit up to £20,000 every tax year tax-free.",
      cta: "View Best Cash ISA Rates",
      icon: Wallet,
      badge: "Tax-Free Growth",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
      accentBorder: "hover:border-emerald-500",
      link: "#",
    },
    {
      id: "mortgages",
      category: "Keyworker Finance",
      title: "Fee-Free Mortgages for NHS Staff & Clinicians",
      description:
        "Specialist UK mortgage brokers that accept bank shifts, unsocial enhancements, and locum earnings at 100% value for your borrowing multiplier.",
      cta: "Check NHS Borrowing Power",
      icon: Home,
      badge: "Fee-Free Broker",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
      accentBorder: "hover:border-blue-500",
      link: "#",
    },
    {
      id: "salary-sacrifice",
      category: "Tax Efficiency",
      title: "NHS Electric Car Salary Sacrifice Schemes",
      description:
        "Save 30% to 42% on a brand new EV by leasing via NHS gross pay deductions before Income Tax and National Insurance are calculated.",
      cta: "Calculate EV Savings",
      icon: Car,
      badge: "Save Tax & NI",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
      accentBorder: "hover:border-amber-500",
      link: "#",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#005EB8] dark:text-[#41B6E6]">
            Smart Financial Moves
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Maximize Your 2026/27 NHS Take-Home Pay
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>FCA-Regulated Partner Platforms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-850 ${card.accentBorder}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {card.title}
                </h4>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={card.link}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#005EB8] dark:text-[#41B6E6] hover:underline"
                >
                  <span>{card.cta}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-slate-400 text-center">
        Disclosure: NetPayScale UK may receive compensation from featured financial providers at zero additional cost to you. Investments carry risk.
      </p>
    </section>
  );
}
