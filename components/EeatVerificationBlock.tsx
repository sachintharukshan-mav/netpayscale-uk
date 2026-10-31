import React from "react";
import Link from "next/link";

interface EeatVerificationBlockProps {
  contextLabel?: string;
  isScotland?: boolean;
}

export default function EeatVerificationBlock({
  contextLabel = "NHS Agenda for Change 2026/27 Pay & Tax Model",
  isScotland = false,
}: EeatVerificationBlockProps) {
  return (
    <section
      aria-label="Statutory Data Sources & Computational Methodology"
      className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Statutory Provenance &amp; Audit Trail</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-950">
            How We Calculate &amp; Verify {contextLabel}
          </h2>
        </div>
        <div className="text-left sm:text-right font-mono text-[11px] text-zinc-500 space-y-0.5 shrink-0">
          <div className="font-semibold text-zinc-800">
            Tax Year: 2026/27 (6 Apr 2026 – 5 Apr 2027)
          </div>
          <div>
            Last Statutory Audit: <strong className="text-zinc-800">October 2026</strong> •{" "}
            <Link href="/about/" className="text-[#005EB8] hover:underline font-sans font-semibold">
              Methodology →
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Statutory Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        <div className="rounded-xl bg-zinc-50/80 border border-zinc-200/80 p-3.5 space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#005EB8] block">
            1. Pay Spine Authority
          </span>
          <h3 className="font-bold text-zinc-900">
            NHS Employers 2026/27 Pay Circular
          </h3>
          <p className="text-zinc-600 leading-relaxed text-[11px]">
            Implements the official 2026/27 Agenda for Change (+3.3%) consolidated pay spine across Bands 2 to 9 (NHS Terms &amp; Conditions Handbook Annex 2 &amp; Annex 3).
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50/80 border border-zinc-200/80 p-3.5 space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#005EB8] block">
            2. Allowances &amp; Shifts
          </span>
          <h3 className="font-bold text-zinc-900">
            NHS T&amp;C Handbook (Sec 2 &amp; Annex 9)
          </h3>
          <p className="text-zinc-600 leading-relaxed text-[11px]">
            Applies statutory Section 2 unsocial hours multipliers (+44%/+88% Bands 2–3; +30%/+60% Bands 4–9) and Annex 9 HCAS London Weighting caps (20% Inner, 15% Outer, 5% Fringe).
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50/80 border border-zinc-200/80 p-3.5 space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#005EB8] block">
            3. Tax &amp; National Insurance
          </span>
          <h3 className="font-bold text-zinc-900">
            HMRC PAYE Specifications 2026/27
          </h3>
          <p className="text-zinc-600 leading-relaxed text-[11px]">
            {isScotland
              ? "Computes Scottish Parliament devolved 6-band Income Tax (19% Starter to 48% Top Rate under tax code S1257L) plus UK Class 1 Employee National Insurance (8% / 2%)."
              : "Computes UK PAYE Income Tax (£12,570 Personal Allowance, 20%/40%/45% bands, and £100k PA taper) plus Class 1 Employee National Insurance (8% PT–UEL, 2% above £50,270)."}
          </p>
        </div>

        <div className="rounded-xl bg-zinc-50/80 border border-zinc-200/80 p-3.5 space-y-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#005EB8] block">
            4. Pension &amp; Net-Pay Relief
          </span>
          <h3 className="font-bold text-zinc-900">
            NHSBSA 2015 CARE Scheme Rules
          </h3>
          <p className="text-zinc-600 leading-relaxed text-[11px]">
            Deducts 2026/27 tiered employee contributions (5.2% to 12.5%) from pensionable pay (basic + HCAS) before Income Tax under HMRC Net-Pay arrangements, with 1/54th CARE accrual.
          </p>
        </div>
      </div>

      {/* Deterministic Formula Bar */}
      <div className="rounded-xl bg-zinc-900 text-zinc-200 p-4 text-[11px] font-mono space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            Deterministic Calculation Formulas (Zero Rounding Drift)
          </span>
          <span className="text-zinc-400">
            Standard WTE: 37.5h/wk = 1,955.36 hrs/yr • Scotland WTE: 35.0h/wk = 1,825.00 hrs/yr
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-zinc-300 pt-1">
          <div>
            <span className="text-zinc-400 block text-[10px]">1. Pensionable &amp; Taxable Base</span>
            <code>Taxable = Gross − ((Basic + HCAS) × Tier%)</code>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px]">2. Pro-Rata WTE &amp; HCAS Bounds</span>
            <code>FTE = Hours ÷ 37.5 | HCAS = clamp(Basic×%, Min×FTE, Max×FTE)</code>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px]">3. Monthly Net In-Bank</span>
            <code>Net/mo = (Gross − Pension − PAYE − NI − Loan) ÷ 12</code>
          </div>
        </div>
      </div>
    </section>
  );
}
