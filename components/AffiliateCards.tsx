import React from "react";

export default function AffiliateCards() {
  const guides = [
    {
      id: "pension-avc",
      title: "NHS Additional Voluntary Contributions (AVCs) & SIPPs",
      category: "Retirement",
      description:
        "NHS employees in the 2015 Scheme can make tax-relieved AVCs or contribute to a personal SIPP to build supplementary pension capital, claiming 20% to 40% income tax relief on all contributions.",
      actionText: "Compare UK SIPP & AVC Options →",
      benefit: "Up to 40% HMRC Tax Relief",
    },
    {
      id: "cash-isa",
      title: "Tax-Free High-Yield Cash ISAs (4.85%+ AER)",
      description:
        "Keep your monthly take-home surplus fully sheltered from HMRC tax with FSCS-protected Cash ISAs. Every UK adult has a £20,000 annual allowance where all interest earned is completely free of income tax.",
      actionText: "View Top UK Cash ISAs →",
      benefit: "£20k Annual Tax Shelter",
    },
    {
      id: "mortgages",
      title: "Specialist Mortgages for NHS Staff & Clinicians",
      description:
        "Standard high-street lenders often penalize unsocial enhancements and NHS bank shift earnings. Specialist keyworker mortgage brokers assess 100% of your total gross earnings for higher borrowing multiples.",
      actionText: "Check NHS Borrowing Multipliers →",
      benefit: "Bank & Shift Income Included",
    },
    {
      id: "salary-sacrifice",
      title: "NHS Electric Vehicle Salary Sacrifice Schemes",
      description:
        "By taking an ultra-low emission car through an approved NHS salary sacrifice lease, lease payments are deducted from gross basic pay before Income Tax and National Insurance, saving 30% to 42% on running costs.",
      actionText: "Review NHS Fleet EV Calculator →",
      benefit: "Save 30–42% on Tax & NI",
    },
  ];

  return (
    <section className="rounded-xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-zinc-100 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950">
            Keyworker Financial Planning & Tax Efficiency
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Practical strategies to optimize your 2026/27 take-home earnings and pension wealth
          </p>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">
          FCA Regulated Frameworks
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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
              <a
                href="#"
                className="text-xs font-medium text-zinc-900 hover:text-[#005EB8] transition-colors"
              >
                {item.actionText}
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
        Regulatory Notice: NetPayScale UK provides independent calculations. Partner services are FCA-regulated UK entities. Capital is at risk when investing.
      </p>
    </section>
  );
}
