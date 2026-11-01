"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

export interface EsrCodeItem {
  code: string;
  category: "Earnings" | "Enhancements" | "Leave & Absence" | "Tax & Deductions";
  pensionable: "Yes (2015 CARE)" | "No (Non-Pensionable)" | "Depends on WTE" | "Pre-Tax Deduction";
  sectionRef: string;
  summary: string;
  formulaNote: string;
}

export const ESR_CODES_DATA: EsrCodeItem[] = [
  {
    code: "Basic Pay / SAL/WAGE",
    category: "Earnings",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Annex 2 & 3",
    summary:
      "Your contracted monthly Agenda for Change basic salary (Annual Salary ÷ 12). SAL/WAGE shows full-time 1.0 WTE pay; PT SAL/WAGE shows your pro-rata part-time salary.",
    formulaNote: "Monthly Basic = (1.0 WTE Salary × (Contracted Hours ÷ 37.5)) ÷ 12",
  },
  {
    code: "Night Duty EN / Unsocial EN",
    category: "Enhancements",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Section 2",
    summary:
      "Enhancement ('EN') paid on weekday hours worked between 8:00pm and 6:00am. Paid in arrears (usually 1 month behind) on top of your basic pay.",
    formulaNote: "+44% of basic hourly rate (Bands 2–3) | +30% of basic hourly rate (Bands 4–9)",
  },
  {
    code: "Saturday EN",
    category: "Enhancements",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Section 2",
    summary:
      "Unsocial hours enhancement for all hours worked between midnight Friday and midnight Saturday.",
    formulaNote: "+44% enhancement (Bands 2–3) | +30% enhancement (Bands 4–9)",
  },
  {
    code: "Sunday EN / Bank Hol EN",
    category: "Enhancements",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Section 2",
    summary:
      "Unsocial hours enhancement for hours worked on a Sunday or a statutory Public Bank Holiday (midnight to midnight).",
    formulaNote: "+88% enhancement (Bands 2–3) | +60% enhancement (Bands 4–9)",
  },
  {
    code: "AfC Absence",
    category: "Leave & Absence",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Section 13.9",
    summary:
      "Holiday pay enhancement top-up! Under Section 13.9, when you take annual leave you must be paid what you would have earned at work—so ESR averages your last 3–12 months of pensionable unsocial hours (Night/Weekend EN) and pays it as 'AfC Absence'.",
    formulaNote: "Daily Leave Top-Up = (Total Regular Unsocial Pay in Reference Period ÷ Days Worked)",
  },
  {
    code: "AfC Absence NP",
    category: "Leave & Absence",
    pensionable: "No (Non-Pensionable)",
    sectionRef: "AfC Section 13.9",
    summary:
      "Holiday pay top-up calculated on regularly worked non-pensionable Overtime ('NP' = Non-Pensionable). Ensures staff who work regular overtime do not suffer a pay drop during annual leave.",
    formulaNote: "12.07% or reference-period average of regular overtime earnings",
  },
  {
    code: "WTD Pay (Working Time Directive)",
    category: "Leave & Absence",
    pensionable: "No (Non-Pensionable)",
    sectionRef: "Working Time Regs",
    summary:
      "Rolled-up statutory holiday pay (+12.07%) paid on NHS Staff Bank shifts (and used by some Trusts for overtime holiday pay).",
    formulaNote: "WTD Uplift = Gross Bank Shift Pay × 12.07% (5.6 wks ÷ 46.4 working wks)",
  },
  {
    code: "Weekday OT / Sat OT / Sun OT",
    category: "Enhancements",
    pensionable: "No (Non-Pensionable)",
    sectionRef: "AfC Section 3",
    summary:
      "Overtime hours worked above the standard full-time 37.5-hour week (Bands 2 to 7 only; Bands 8a–9 are ineligible for contractual overtime).",
    formulaNote: "1.5x (Time-and-a-half) of basic hourly rate; Non-Pensionable",
  },
  {
    code: "Bank Hol OT",
    category: "Enhancements",
    pensionable: "No (Non-Pensionable)",
    sectionRef: "AfC Section 3",
    summary:
      "Overtime worked on a Public Bank Holiday in excess of 37.5 hours/week.",
    formulaNote: "2.0x (Double Time) of basic hourly rate; Non-Pensionable",
  },
  {
    code: "Additional Hours / Std Hrs",
    category: "Earnings",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Section 3",
    summary:
      "Extra hours worked by a Part-Time employee up to the full-time 37.5-hour weekly threshold. Unlike overtime above 37.5h, Additional Hours are paid at plain time (1.0x) and ARE pensionable.",
    formulaNote: "1.0x Basic Hourly Rate + 2015 CARE Pension Accrual",
  },
  {
    code: "Basic Pay Arrs / Arrs",
    category: "Earnings",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "Payroll Arrears",
    summary:
      "Backdated arrears ('Arrs') paid when an annual pay award (e.g. 3.3% from 1 April), incremental spine step, or Band re-grading is processed after its effective date.",
    formulaNote: "(New Monthly Rate − Old Monthly Rate) × Months Backdated",
  },
  {
    code: "Inner London / Outer London / Fringe",
    category: "Earnings",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Section 4 / Annex 9",
    summary:
      "High Cost Area Supplement (HCAS London Weighting). Paid monthly alongside basic salary and fully pensionable.",
    formulaNote: "Inner: 20% (£5,794–£8,746) | Outer: 15% (£4,870–£6,137) | Fringe: 5% (£1,346–£2,270)",
  },
  {
    code: "RRP (Recruitment & Retention Premia)",
    category: "Earnings",
    pensionable: "Depends on WTE",
    sectionRef: "AfC Annex 10",
    summary:
      "Extra supplement paid to hard-to-fill clinical or specialist posts. Long-term RRP is pensionable; short-term RRP is non-pensionable.",
    formulaNote: "Fixed annual £ or % supplement agreed locally or nationally",
  },
  {
    code: "OSP / SSP (Sick Pay)",
    category: "Leave & Absence",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Section 14",
    summary:
      "Occupational Sick Pay (OSP: 1 to 6 months Full Pay + 2 to 6 months Half Pay based on NHS service) and Statutory Sick Pay (SSP: £118.75/week in 2026/27).",
    formulaNote: "Full Pay = 100% regular pay | Half Pay = 50% basic + £118.75/wk SSP",
  },
  {
    code: "OMP / SMP (Maternity Pay)",
    category: "Leave & Absence",
    pensionable: "Yes (2015 CARE)",
    sectionRef: "AfC Section 15",
    summary:
      "Occupational Maternity Pay (8 weeks 100% full pay, 18 weeks 50% half pay + SMP) and Statutory Maternity Pay (£187.18/week in 2026/27 for weeks 9–39).",
    formulaNote: "Weeks 1–8: 100% | Weeks 9–26: 50% + £187.18/wk | Weeks 27–39: £187.18/wk",
  },
  {
    code: "Salary Sacrifice (Fleet Car / Cycle)",
    category: "Tax & Deductions",
    pensionable: "Pre-Tax Deduction",
    sectionRef: "HMRC / Scheme Rules",
    summary:
      "Appears as a negative payment on the left side of your ESR payslip. Reduces your Gross Pay BEFORE PAYE Tax, Class 1 NI, Student Loan, and 2015 CARE Pensionable Pay.",
    formulaNote: "Net Cost = Gross Lease − (Tax Saved + NI Saved + Pension Contribution Saved)",
  },
  {
    code: "1257L CUMUL vs 1257L W1/M1",
    category: "Tax & Deductions",
    pensionable: "Pre-Tax Deduction",
    sectionRef: "HMRC PAYE",
    summary:
      "1257L gives £12,570/yr (£1,048/mo) tax-free Personal Allowance. 'CUMUL' reconciles tax across the whole tax year; 'W1/M1' (Emergency Month 1) taxes that month in isolation.",
    formulaNote: "Taxable Pay = Gross Pay − NHS Pension − Salary Sacrifice",
  },
  {
    code: "S1257L (Scottish Tax Code)",
    category: "Tax & Deductions",
    pensionable: "Pre-Tax Deduction",
    sectionRef: "Revenue Scotland",
    summary:
      "Applies the 6-band Scottish Parliament Income Tax structure (19% Starter, 20% Basic, 21% Intermediate, 42% Higher, 45% Advanced, 48% Top).",
    formulaNote: "21% applies from £26,562; 42% Higher Rate starts at £43,663",
  },
];

export function EsrPayslipDecoderClient() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBand, setSelectedBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [nightSatHoursMo, setNightSatHoursMo] = useState<number>(34.5); // 3 × 11.5h shifts/mo
  const [sundayBhHoursMo, setSundayBhHoursMo] = useState<number>(11.5); // 1 × 11.5h shift/mo
  const [bankHoursMo, setBankHoursMo] = useState<number>(11.5); // 1 × 11.5h bank shift/mo
  const [leaveDaysTakenMo, setLeaveDaysTakenMo] = useState<number>(5); // 1 week (5 days) leave in month

  const filteredCodes = useMemo(() => {
    return ESR_CODES_DATA.filter((item) => {
      const matchesCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.sectionRef.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const bandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === selectedBand) || nhsData.bands[3],
    [selectedBand]
  );
  const safeStep = Math.min(stepIndex, bandObj.points.length - 1);

  const esrSim = useMemo(() => {
    const pt = bandObj.points[safeStep];
    const baseHr = pt.hourlyRate;
    const isB23 = selectedBand === "Band 2" || selectedBand === "Band 3";
    const nightMult = isB23 ? 0.44 : 0.3;
    const sunMult = isB23 ? 0.88 : 0.6;

    // On ESR payslips, "WKD/EARNED" shows hours worked, and "PAID/DUE" shows enhanced equivalent hours (e.g. 34.5h × 0.30 = 10.35 paid hours at basic rate!)
    const nightPaidHrs = Math.round(nightSatHoursMo * nightMult * 100) / 100;
    const nightAmount = Math.round(nightSatHoursMo * baseHr * nightMult * 100) / 100;

    const sunPaidHrs = Math.round(sundayBhHoursMo * sunMult * 100) / 100;
    const sunAmount = Math.round(sundayBhHoursMo * baseHr * sunMult * 100) / 100;

    const totalMonthlyUnsocial = nightAmount + sunAmount;
    // Average daily unsocial enhancement across ~21.7 working days/month -> AfC Absence top-up for leave days taken
    const afcAbsenceTopUp =
      Math.round(((totalMonthlyUnsocial / 21.73) * leaveDaysTakenMo) * 100) / 100;

    // Bank shift WTD (+12.07%)
    const bankBasicPay = Math.round(bankHoursMo * baseHr * 100) / 100;
    const wtdHolidayPay = Math.round(bankBasicPay * 0.1207 * 100) / 100;

    return {
      baseHr,
      nightMultPct: Math.round(nightMult * 100),
      sunMultPct: Math.round(sunMult * 100),
      nightPaidHrs,
      nightAmount,
      sunPaidHrs,
      sunAmount,
      totalMonthlyUnsocial,
      afcAbsenceTopUp,
      bankBasicPay,
      wtdHolidayPay,
    };
  }, [bandObj, safeStep, selectedBand, nightSatHoursMo, sundayBhHoursMo, bankHoursMo, leaveDaysTakenMo]);

  return (
    <div className="space-y-10">
      {/* PART 1: Interactive ESR Payslip Line & WTD / AfC Absence Verifier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h2 className="text-lg font-extrabold text-zinc-950">
              1. Interactive ESR Payslip Enhancement, `AfC Absence` &amp; `WTD` Verifier
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              See why ESR converts your shift hours into fractional <strong>PAID/DUE</strong> hours and verify your <strong>AfC Absence</strong> holiday top-up &amp; <strong>12.07% WTD</strong> pay.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="esr-band"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Your NHS Band
              </label>
              <select
                id="esr-band"
                value={selectedBand}
                onChange={(e) => {
                  setSelectedBand(e.target.value);
                  setStepIndex(0);
                }}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
              >
                {nhsData.bands.map((b) => (
                  <option key={b.slug} value={b.band}>
                    {b.band} ({b.typicalRoles[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="esr-step"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Pay Step (Hourly Rate)
              </label>
              <select
                id="esr-step"
                value={safeStep}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
              >
                {bandObj.points.map((pt, idx) => (
                  <option key={pt.step} value={idx}>
                    {pt.step} — {formatHourlyRate(pt.hourlyRate)} ({formatCurrency(pt.annualSalary)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="esr-nights"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Night / Saturday Hours Worked in Month
              </label>
              <input
                id="esr-nights"
                type="number"
                min={0}
                max={160}
                step={0.5}
                value={nightSatHoursMo}
                onChange={(e) => setNightSatHoursMo(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-mono font-bold text-zinc-900"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                e.g. 3 × 11.5h shifts = 34.50 hrs (+{esrSim.nightMultPct}%)
              </span>
            </div>

            <div>
              <label
                htmlFor="esr-sundays"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Sunday / Bank Holiday Hours in Month
              </label>
              <input
                id="esr-sundays"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={sundayBhHoursMo}
                onChange={(e) => setSundayBhHoursMo(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-mono font-bold text-zinc-900"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                e.g. 1 × 11.5h shift = 11.50 hrs (+{esrSim.sunMultPct}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="esr-leave"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Annual Leave Days Taken (`AfC Absence`)
              </label>
              <input
                id="esr-leave"
                type="number"
                min={0}
                max={28}
                step={1}
                value={leaveDaysTakenMo}
                onChange={(e) => setLeaveDaysTakenMo(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-mono font-bold text-zinc-900"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Section 13.9 average unsocial top-up during leave
              </span>
            </div>

            <div>
              <label
                htmlFor="esr-bank"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Bank Shift Hours (`+12.07% WTD Pay`)
              </label>
              <input
                id="esr-bank"
                type="number"
                min={0}
                max={160}
                step={0.5}
                value={bankHoursMo}
                onChange={(e) => setBankHoursMo(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-mono font-bold text-zinc-900"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Rolled-up 12.07% WTR holiday pay on bank hours
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated ESR Lines */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border-2 border-zinc-800 bg-white p-5 sm:p-6 shadow-sm font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-3">
              <div>
                <span className="bg-[#005EB8] text-white font-bold px-2 py-0.5 rounded text-[10px]">
                  NHS ESR
                </span>
                <span className="ml-2 font-sans font-extrabold text-zinc-950 text-sm">
                  PAY &amp; ALLOWANCES DECODER
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">
                Rate: £{esrSim.baseHr.toFixed(2)}/hr
              </span>
            </div>

            <div className="text-[11px] text-zinc-600 font-sans bg-blue-50/70 border border-blue-200 rounded-lg p-3 leading-relaxed">
              <strong>Why ESR shows strange &quot;PAID/DUE&quot; hours:</strong> Rather than multiplying your hourly rate by +{esrSim.nightMultPct}%, ESR multiplies your <strong>hours worked</strong> by 0.{esrSim.nightMultPct} (e.g. {nightSatHoursMo}h × 0.{esrSim.nightMultPct} = <strong>{esrSim.nightPaidHrs} PAID/DUE hrs</strong>) and multiplies that by your plain hourly rate (£{esrSim.baseHr.toFixed(2)}/hr)!
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[10px] font-sans font-bold uppercase text-zinc-500 border-b border-zinc-200 pb-1">
                <span className="col-span-5">ESR Line Description</span>
                <span className="col-span-2 text-right">Wkd</span>
                <span className="col-span-2 text-right">Paid/Due</span>
                <span className="col-span-3 text-right">Amount (£)</span>
              </div>

              <div className="grid grid-cols-12 items-center py-1 border-b border-zinc-100">
                <span className="col-span-5 font-sans font-semibold text-zinc-900">
                  Night / Sat EN (+{esrSim.nightMultPct}%)
                </span>
                <span className="col-span-2 text-right text-zinc-600">
                  {nightSatHoursMo.toFixed(2)}
                </span>
                <span className="col-span-2 text-right text-[#005EB8] font-bold">
                  {esrSim.nightPaidHrs.toFixed(2)}
                </span>
                <span className="col-span-3 text-right font-bold text-zinc-950">
                  £{esrSim.nightAmount.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-12 items-center py-1 border-b border-zinc-100">
                <span className="col-span-5 font-sans font-semibold text-zinc-900">
                  Sunday / BH EN (+{esrSim.sunMultPct}%)
                </span>
                <span className="col-span-2 text-right text-zinc-600">
                  {sundayBhHoursMo.toFixed(2)}
                </span>
                <span className="col-span-2 text-right text-[#005EB8] font-bold">
                  {esrSim.sunPaidHrs.toFixed(2)}
                </span>
                <span className="col-span-3 text-right font-bold text-zinc-950">
                  £{esrSim.sunAmount.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-12 items-center py-1 border-b border-zinc-100 bg-emerald-50/60 px-1 rounded">
                <span className="col-span-5 font-sans font-bold text-emerald-900">
                  AfC Absence ({leaveDaysTakenMo}d leave)
                </span>
                <span className="col-span-4 text-right text-[10px] font-sans text-emerald-700">
                  Sec 13.9 Leave Top-Up
                </span>
                <span className="col-span-3 text-right font-bold text-emerald-800">
                  £{esrSim.afcAbsenceTopUp.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-12 items-center py-1 border-b border-zinc-100">
                <span className="col-span-5 font-sans font-semibold text-zinc-900">
                  WTD Pay (+12.07% Bank)
                </span>
                <span className="col-span-2 text-right text-zinc-600">
                  {bankHoursMo.toFixed(2)}
                </span>
                <span className="col-span-2 text-right text-purple-700 font-bold">
                  +12.07%
                </span>
                <span className="col-span-3 text-right font-bold text-purple-800">
                  £{esrSim.wtdHolidayPay.toFixed(2)}
                </span>
              </div>
            </div>

            <ShareBreakdownButton
              shareText={`NHS ESR Payslip Decoder (${selectedBand}): ${nightSatHoursMo}h Night/Sat EN = £${esrSim.nightAmount.toFixed(2)}, ${sundayBhHoursMo}h Sunday EN = £${esrSim.sunAmount.toFixed(2)}, plus £${esrSim.afcAbsenceTopUp.toFixed(2)} AfC Absence holiday top-up:`}
              url="https://netpayscale.uk/nhs-payslip-explained/"
              variant="light"
              label="Share ESR Payslip Calculation"
            />
          </div>
        </div>
      </div>

      {/* PART 2: Interactive Searchable ESR Code Dictionary */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h2
              id="esr-codes-table-caption"
              className="text-lg sm:text-xl font-bold text-zinc-950"
            >
              2. Complete NHS ESR Payslip Abbreviations &amp; Codes Dictionary (2026/27)
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Instant lookup for every payment, enhancement, absence, and deduction code on an Agenda for Change ESR payslip
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["All", "Earnings", "Enhancements", "Leave & Absence", "Tax & Deductions"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#005EB8] text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <label htmlFor="esr-code-search" className="sr-only">
            Search ESR Payslip Code
          </label>
          <input
            id="esr-code-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any ESR code (e.g. EN, AfC Absence, NP, WTD, Arrs, 1257L, RRP)..."
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-[#005EB8] focus:bg-white focus:outline-none"
          />
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-labelledby="esr-codes-table-caption"
          className="overflow-x-auto rounded-xl border border-zinc-200/80 max-w-full"
        >
          <table className="w-full text-left text-xs border-separate border-spacing-0">
            <caption className="sr-only">
              NHS Electronic Staff Record (ESR) Payslip Codes, Pensionable Status, and Formulas
            </caption>
            <thead className="sticky top-0 z-10 bg-zinc-50 text-zinc-600 font-semibold">
              <tr>
                <th
                  scope="col"
                  className="py-2.5 px-3 border-b border-zinc-200 sticky left-0 bg-zinc-50 z-20"
                >
                  ESR Payslip Code
                </th>
                <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                  Category
                </th>
                <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                  Pensionable (2015 CARE)?
                </th>
                <th scope="col" className="py-2.5 px-3 border-b border-zinc-200">
                  What It Means &amp; How Payroll Calculates It
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {filteredCodes.map((item) => (
                <tr key={item.code} className="hover:bg-zinc-50/70 align-top">
                  <th
                    scope="row"
                    className="py-3 px-3 font-mono font-bold text-[#005EB8] sticky left-0 bg-white border-b border-zinc-100 whitespace-nowrap"
                  >
                    {item.code}
                    <span className="block text-[10px] font-sans font-normal text-zinc-400">
                      {item.sectionRef}
                    </span>
                  </th>
                  <td className="py-3 px-3 border-b border-zinc-100 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-b border-zinc-100 whitespace-nowrap font-semibold">
                    <span
                      className={
                        item.pensionable.startsWith("Yes")
                          ? "text-emerald-700"
                          : item.pensionable.startsWith("No")
                          ? "text-amber-700"
                          : "text-zinc-700"
                      }
                    >
                      {item.pensionable}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-b border-zinc-100 space-y-1 min-w-[280px]">
                    <p className="text-zinc-700 leading-relaxed">{item.summary}</p>
                    <p className="font-mono text-[11px] text-zinc-500">
                      Formula: {item.formulaNote}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EsrPayslipDecoderClient;
