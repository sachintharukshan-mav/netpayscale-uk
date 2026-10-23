import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-10 pb-8 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-[#005EB8] text-xs font-bold text-white">
                NHS
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                NetPayScale UK (NHS Edition)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              The premier interactive salary and pension take-home pay calculation portal for 1.3M+ NHS England, Scotland, and Wales healthcare professionals. Updated for the official 2026/2027 Agenda for Change (AfC) pay award (+3.3%).
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              NHS Agenda for Change
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/calculator/band-5-nurse-salary-inner-london" className="hover:text-[#005EB8] dark:hover:text-[#41B6E6]">
                  Band 5 Staff Nurse (London)
                </Link>
              </li>
              <li>
                <Link href="/calculator/band-6-paramedic-take-home-pay-scotland" className="hover:text-[#005EB8] dark:hover:text-[#41B6E6]">
                  Band 6 Paramedic (Scotland)
                </Link>
              </li>
              <li>
                <Link href="/calculator/band-7-clinical-manager-salary-manchester" className="hover:text-[#005EB8] dark:hover:text-[#41B6E6]">
                  Band 7 Team Leader (Manchester)
                </Link>
              </li>
              <li>
                <Link href="/calculator/band-8a-matron-salary-inner-london" className="hover:text-[#005EB8] dark:hover:text-[#41B6E6]">
                  Band 8a Matron (London)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Regulations & Data Sources
            </h4>
            <ul className="space-y-2">
              <li>NHS Terms and Conditions Handbook (AfC)</li>
              <li>HMRC PAYE Tax Brackets 2026/27</li>
              <li>NHS Business Services Authority (NHSBSA)</li>
              <li>Section 2 Unsocial Hours Rules</li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimer:</strong> NetPayScale UK is an independent computational resource and is not formally endorsed by or affiliated with the National Health Service (NHS), NHS Employers, or HM Revenue & Customs (HMRC). All estimates are derived strictly from published 2026/27 Agenda for Change pay circulars and UK statutory payroll rules. Variations may occur based on individual tax codes, salary sacrifice arrangements, or local Trust agreements.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 text-[11px]">
          <p>© {new Date().getFullYear()} NetPayScale UK. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
