import React from "react";
import Link from "next/link";
import { LanguageSelector } from "./LanguageSelector";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white pt-10 pb-10 text-xs text-zinc-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-9 items-center justify-center rounded bg-[#005EB8] text-[11px] font-bold text-white">
                NHS
              </span>
              <span className="text-sm font-bold text-zinc-950">
                NetPayScale UK
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
              Independent computational resource for 1.3M+ NHS England, Scotland, Wales, and Northern Ireland staff. Fully updated for the official 2026/2027 Agenda for Change (+3.3%) pay settlement and HMRC PAYE tax thresholds.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              {[
                { slug: "band-2", label: "Band 2" },
                { slug: "band-3", label: "Band 3" },
                { slug: "band-4", label: "Band 4" },
                { slug: "band-5", label: "Band 5" },
                { slug: "band-6", label: "Band 6" },
                { slug: "band-7", label: "Band 7" },
                { slug: "band-8a", label: "Band 8a" },
                { slug: "band-8b", label: "Band 8b" },
                { slug: "band-8c", label: "Band 8c" },
                { slug: "band-8d", label: "Band 8d" },
                { slug: "band-9", label: "Band 9" },
              ].map((b) => (
                <Link
                  key={b.slug}
                  href={`/bands/${b.slug}/`}
                  className="px-2 py-1 rounded bg-zinc-100 hover:bg-[#005EB8] hover:text-white text-[11px] font-semibold text-zinc-700 transition-colors"
                >
                  {b.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-950 mb-2.5">
              NHS Calculators (2026/27)
            </h4>
            <ul className="space-y-1.5 text-zinc-600">
              <li>
                <Link href="/" className="hover:text-zinc-950 transition-colors">
                  NHS Salary &amp; Take-Home Calculator
                </Link>
              </li>
              <li>
                <Link href="/pension-calculator/" className="hover:text-zinc-950 transition-colors">
                  NHS Pension (2015 CARE) Calculator
                </Link>
              </li>
              <li>
                <Link href="/sick-pay-calculator/" className="hover:text-zinc-950 transition-colors">
                  NHS Sick Pay &amp; Half-Pay Calculator
                </Link>
              </li>
              <li>
                <Link href="/maternity-pay-calculator/" className="hover:text-zinc-950 transition-colors">
                  NHS Maternity Pay (OMP + SMP)
                </Link>
              </li>
              <li>
                <Link href="/annual-leave-calculator/" className="hover:text-zinc-950 transition-colors">
                  NHS Annual Leave &amp; BH Hours
                </Link>
              </li>
              <li>
                <Link href="/bank-shift-calculator/" className="hover:text-zinc-950 transition-colors">
                  NHS Bank Shift &amp; Overtime Pay
                </Link>
              </li>
              <li>
                <Link href="/agency-vs-bank-calculator/" className="hover:text-zinc-950 transition-colors font-medium text-amber-700">
                  NHS Bank vs. Agency vs. Substantive
                </Link>
              </li>
              <li>
                <Link href="/unsocial-hours-calculator/" className="hover:text-zinc-950 transition-colors font-medium text-purple-700">
                  NHS Unsocial Hours &amp; Night Pay
                </Link>
              </li>
              <li>
                <Link href="/pay-rise-backpay-calculator/" className="hover:text-zinc-950 transition-colors">
                  NHS Back Pay &amp; 3.3% Rise Calculator
                </Link>
              </li>
              <li>
                <Link href="/promotion-calculator/" className="hover:text-zinc-950 transition-colors">
                  NHS Band Promotion Pay Comparator
                </Link>
              </li>
              <li>
                <Link href="/redundancy-pay-calculator/" className="hover:text-zinc-950 transition-colors">
                  NHS Redundancy &amp; MARS Calculator
                </Link>
              </li>
              <li>
                <Link href="/international/" className="hover:text-zinc-950 transition-colors">
                  International Recruits &amp; Visa Guide
                </Link>
              </li>
              <li>
                <Link href="/trusts/" className="hover:text-zinc-950 transition-colors font-medium text-[#005EB8]">
                  Top 50 NHS Trusts Directory
                </Link>
              </li>
              <li>
                <Link href="/roles/" className="hover:text-zinc-950 transition-colors font-medium text-[#005EB8]">
                  NHS Job Roles Directory (41 Careers)
                </Link>
              </li>
              <li>
                <Link href="/embed/" className="hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-[#005EB8] font-semibold">
                  <span>Embed Calculator Widget</span>
                  <span className="text-[9px] px-1 py-0.2 bg-blue-100 rounded text-[#005EB8] font-bold">FREE</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-950 mb-2.5">
              Popular Role &amp; Region Guides
            </h4>
            <ul className="space-y-1.5 text-zinc-600">
              <li>
                <Link href="/roles/nurse/" className="hover:text-zinc-950 transition-colors font-medium">
                  NHS Staff Nurse Salary (Band 5)
                </Link>
              </li>
              <li>
                <Link href="/roles/paramedic/" className="hover:text-zinc-950 transition-colors font-medium">
                  NHS Paramedic Salary (Band 5/6)
                </Link>
              </li>
              <li>
                <Link href="/roles/healthcare-assistant/" className="hover:text-zinc-950 transition-colors font-medium">
                  NHS Healthcare Assistant (Band 2)
                </Link>
              </li>
              <li>
                <Link href="/roles/midwife/" className="hover:text-zinc-950 transition-colors font-medium">
                  NHS Midwife Salary (Band 5/6)
                </Link>
              </li>
              <li>
                <Link href="/roles/physiotherapist/" className="hover:text-zinc-950 transition-colors font-medium">
                  NHS Physiotherapist Salary (Band 5)
                </Link>
              </li>
              <li>
                <Link href="/roles/pharmacist/" className="hover:text-zinc-950 transition-colors font-medium">
                  NHS Clinical Pharmacist (Band 7)
                </Link>
              </li>
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
              Transparency &amp; Governance
            </h4>
            <ul className="space-y-1.5 text-zinc-600">
              <li>
                <Link href="/about/" className="hover:text-zinc-950 transition-colors">
                  About &amp; Methodology
                </Link>
              </li>
              <li>
                <Link href="/privacy/" className="hover:text-zinc-950 transition-colors">
                  Privacy &amp; Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/terms/" className="hover:text-zinc-950 transition-colors">
                  Terms of Service &amp; Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-zinc-950 transition-colors">
                  Contact &amp; Editorial Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Multi-Language Selection Section for Diverse NHS Staff */}
        <div className="pt-4 border-t border-zinc-100">
          <LanguageSelector variant="footer" />
        </div>

        {/* Regulatory Disclaimer */}
        <div className="rounded-lg border border-zinc-200/70 bg-zinc-50/70 p-3.5 text-[11px] leading-relaxed text-zinc-500">
          <strong>Notice: </strong>
          NetPayScale UK is an independent computational utility and is not affiliated with or endorsed by the National Health Service (NHS), NHS Employers, or HM Revenue &amp; Customs (HMRC). All outputs are calculated strictly according to published 2026/27 Agenda for Change pay circulars and UK statutory payroll rules.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 pt-6 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} NetPayScale UK. All calculations for estimation purposes.</p>
          <div className="flex flex-wrap items-center gap-4 mt-2 sm:mt-0">
            <Link href="/privacy/" className="hover:text-zinc-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="hover:text-zinc-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/about/" className="hover:text-zinc-600 transition-colors">
              Methodology
            </Link>
            <Link href="/contact/" className="hover:text-zinc-600 transition-colors">
              Contact Us
            </Link>
            <a href="/llms.txt" className="hover:text-zinc-600 transition-colors">
              LLMs.txt
            </a>
            <a href="/index.md" className="hover:text-zinc-600 transition-colors">
              Markdown
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
