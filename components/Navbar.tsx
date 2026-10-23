import Link from "next/link";
import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#005EB8] text-white shadow-sm transition-transform group-hover:scale-105">
            <span className="font-extrabold text-sm tracking-tight">NHS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              NetPayScale <span className="text-[#005EB8] dark:text-[#41B6E6]">UK</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              NHS Agenda for Change • 2026/27
            </span>
          </div>
        </Link>

        {/* Status / Tax Year Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>2026/27 Pay Scale Active (+3.3% Uplift)</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Link
              href="#bands-overview"
              className="hidden md:inline-flex px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Pay Bands
            </Link>
            <Link
              href="#hcas-guide"
              className="hidden md:inline-flex px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              London Weighting
            </Link>
            <Link
              href="#faq"
              className="hidden md:inline-flex px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              FAQs
            </Link>
            <a
              href="#calculator"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#005EB8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#003087] transition-all active:scale-95"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Calculate Now</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
