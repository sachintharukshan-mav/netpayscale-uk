import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-10 items-center justify-center rounded bg-[#005EB8] text-white">
            <span className="font-extrabold text-xs tracking-tight">NHS</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold tracking-tight text-zinc-950">
              NetPayScale UK
            </span>
            <span className="hidden sm:inline text-xs text-zinc-400">
              /
            </span>
            <span className="hidden sm:inline text-xs font-medium text-zinc-500">
              Agenda for Change 2026/27
            </span>
          </div>
        </Link>

        {/* Right side navigation & status */}
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-600">
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium">3.3% Uplift Verified</span>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/#bands-overview"
              className="hidden sm:inline-block text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              Pay Bands
            </Link>
            <Link
              href="/#hcas-guide"
              className="hidden sm:inline-block text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              London Weighting
            </Link>
            <Link
              href="/#faq"
              className="hidden sm:inline-block text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              FAQs
            </Link>
            <a
              href="#calculator"
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
            >
              Open Calculator
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
