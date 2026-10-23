import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white pt-10 pb-10 text-xs text-zinc-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-9 items-center justify-center rounded bg-[#005EB8] text-[11px] font-bold text-white">
                NHS
              </span>
              <span className="text-sm font-bold text-zinc-950">
                NetPayScale UK
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
              Independent computational resource for 1.3M+ NHS England, Scotland, and Wales staff. Fully updated for the official 2026/2027 Agenda for Change (+3.3%) pay settlement and HMRC PAYE tax thresholds.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-950 mb-2.5">
              Pay Scales &amp; Roles
            </h4>
            <ul className="space-y-1.5 text-zinc-600">
              <li>
                <Link href="/calculator/band-5-nurse-salary-inner-london/" className="hover:text-zinc-950 transition-colors">
                  Band 5 Staff Nurse (Inner London)
                </Link>
              </li>
              <li>
                <Link href="/calculator/band-6-senior-paramedic-salary-scotland/" className="hover:text-zinc-950 transition-colors">
                  Band 6 Senior Paramedic (Scotland)
                </Link>
              </li>
              <li>
                <Link href="/calculator/band-7-clinical-manager-salary-manchester/" className="hover:text-zinc-950 transition-colors">
                  Band 7 Team Leader (Manchester)
                </Link>
              </li>
              <li>
                <Link href="/calculator/band-8a-matron-salary-inner-london/" className="hover:text-zinc-950 transition-colors">
                  Band 8a Matron (Inner London)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-950 mb-2.5">
              Regulatory References
            </h4>
            <ul className="space-y-1.5 text-zinc-600">
              <li>NHS Terms & Conditions Handbook (AfC)</li>
              <li>HMRC PAYE & National Insurance 2026/27</li>
              <li>NHS Pension Scheme Regulations (2015 CARE)</li>
              <li>Section 2 Unsocial Hours Framework</li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="rounded-lg border border-zinc-200/70 bg-zinc-50/70 p-3.5 text-[11px] leading-relaxed text-zinc-500">
          <strong>Notice: </strong>
          NetPayScale UK is an independent computational utility and is not affiliated with or endorsed by the National Health Service (NHS), NHS Employers, or HM Revenue & Customs (HMRC). All outputs are calculated strictly according to published 2026/27 Agenda for Change pay circulars and UK statutory payroll rules.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 pt-6 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} NetPayScale UK. All calculations for estimation purposes.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="hover:text-zinc-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-600 cursor-pointer">Methodology</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
