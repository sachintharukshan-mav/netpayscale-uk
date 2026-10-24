"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import { HeartPulse, Sparkles, ShieldAlert, CheckCircle2, Info } from "lucide-react";

const SSP_WEEKLY_2026 = 118.75; // Statutory Sick Pay weekly rate (£514.58/mo)

const SICK_PAY_TIERS = [
  { id: "yr1", label: "During 1st Year of Service", fullMonths: 1, halfMonths: 2 },
  { id: "yr2", label: "During 2nd Year of Service", fullMonths: 2, halfMonths: 2 },
  { id: "yr3", label: "During 3rd Year of Service", fullMonths: 4, halfMonths: 4 },
  { id: "yr4_5", label: "During 4th & 5th Year", fullMonths: 5, halfMonths: 5 },
  { id: "yr6_plus", label: "After 5 Years Completed (Year 6+)", fullMonths: 6, halfMonths: 6 },
];

export function SickPayCalculatorClient() {
  const [serviceTier, setServiceTier] = useState<string>("yr6_plus");
  const [band, setBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(1);
  const [hcasZone, setHcasZone] = useState<"standard" | "inner-london" | "outer-london" | "fringe">("standard");
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [nightHoursPerWeek, setNightHoursPerWeek] = useState<number>(0);

  const selectedBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === band) || nhsData.bands[3],
    [band]
  );

  const safeStepIndex = Math.min(stepIndex, selectedBandObj.points.length - 1);
  const currentTier = SICK_PAY_TIERS.find((t) => t.id === serviceTier) || SICK_PAY_TIERS[4];

  const normalPay = useMemo(
    () =>
      calculateNHSPay({
        band,
        stepIndex: safeStepIndex,
        hcasZone,
        contractedHours,
        nightHoursPerWeek,
        sundayHoursPerWeek: 0,
        pensionOptedOut: false,
        isScottishTax: false,
        studentLoan: "none",
      }),
    [band, safeStepIndex, hcasZone, contractedHours, nightHoursPerWeek]
  );

  const sickModel = useMemo(() => {
    const fullMonthlyGross = normalPay.grossPay.monthly;
    const fullMonthlyNet = normalPay.netPay.monthly;

    // Half Pay Phase under AfC Section 14:
    // 50% of normal gross pay (including regular unsocial enhancements) + Statutory Sick Pay (£118.75/wk = £514.58/mo),
    // capped so Half Pay + SSP never exceeds 100% Full Pay.
    const sspMonthly = (SSP_WEEKLY_2026 * 52) / 12; // £514.58/mo
    const halfPayMonthlyGross = Math.min(fullMonthlyGross, fullMonthlyGross * 0.5 + sspMonthly);
    const halfPayAnnualizedGross = halfPayMonthlyGross * 12;

    // Pension rate stays in the same tier %, applied to actual half-pay pensionable earnings
    const pensionRate = normalPay.pensionContribution.annual / normalPay.grossPay.annual;
    const halfPayMonthlyPension = (halfPayAnnualizedGross * pensionRate) / 12;

    const halfPayTaxableAnnual = Math.max(0, halfPayAnnualizedGross - halfPayMonthlyPension * 12 - 12570);
    const halfPayAnnualTax =
      halfPayTaxableAnnual <= 37700
        ? halfPayTaxableAnnual * 0.2
        : 37700 * 0.2 + (halfPayTaxableAnnual - 37700) * 0.4;
    const halfPayMonthlyTax = halfPayAnnualTax / 12;

    const halfPayNiableAnnual = Math.max(0, halfPayAnnualizedGross - 12570);
    const halfPayAnnualNi =
      halfPayNiableAnnual <= 37700
        ? halfPayNiableAnnual * 0.08
        : 37700 * 0.08 + (halfPayNiableAnnual - 37700) * 0.02;
    const halfPayMonthlyNi = halfPayAnnualNi / 12;

    const halfPayMonthlyNet =
      halfPayMonthlyGross - halfPayMonthlyPension - halfPayMonthlyTax - halfPayMonthlyNi;
    const halfPayRetentionPct = fullMonthlyNet > 0 ? Math.round((halfPayMonthlyNet / fullMonthlyNet) * 100) : 0;

    // Total cumulative net income over the full + half pay entitlement window
    const totalProtectedNet =
      fullMonthlyNet * currentTier.fullMonths + halfPayMonthlyNet * currentTier.halfMonths;

    return {
      fullMonthlyGross,
      fullMonthlyNet,
      sspMonthly,
      halfPayMonthlyGross,
      halfPayMonthlyPension,
      halfPayMonthlyTax,
      halfPayMonthlyNi,
      halfPayMonthlyNet,
      halfPayRetentionPct,
      totalProtectedNet,
    };
  }, [normalPay, currentTier]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Your NHS Service &amp; Pay</h2>
            <p className="text-xs text-slate-500">Agenda for Change Section 14 Sick Pay</p>
          </div>
        </div>

        {/* Reckonable Service Tier */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Reckonable NHS Service (Section 14 Scale)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {SICK_PAY_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setServiceTier(tier.id)}
                className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  serviceTier === tier.id
                    ? "bg-rose-50/80 border-rose-600 text-slate-900 ring-2 ring-rose-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div>
                  <p className="text-xs sm:text-sm font-extrabold">{tier.label}</p>
                  <p className="text-[11px] text-slate-500">
                    {tier.fullMonths} {tier.fullMonths === 1 ? "month" : "months"} Full Pay + {tier.halfMonths} months Half Pay
                  </p>
                </div>
                {serviceTier === tier.id && <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Band & Step */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sick-band" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Pay Band
            </label>
            <select
              id="sick-band"
              value={band}
              onChange={(e) => {
                setBand(e.target.value);
                setStepIndex(0);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {nhsData.bands.map((b) => (
                <option key={b.band} value={b.band}>
                  {b.band}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sick-step" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Experience Step
            </label>
            <select
              id="sick-step"
              value={safeStepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {selectedBandObj.points.map((pt, idx) => (
                <option key={pt.step} value={idx}>
                  {pt.step} ({formatCurrency(pt.annualSalary)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* HCAS & Contracted Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sick-hcas" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              HCAS Weighting
            </label>
            <select
              id="sick-hcas"
              value={hcasZone}
              onChange={(e) => setHcasZone(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="standard">National Standard (0%)</option>
              <option value="inner-london">Inner London (+20%)</option>
              <option value="outer-london">Outer London (+15%)</option>
              <option value="fringe">London Fringe (+5%)</option>
            </select>
          </div>

          <div>
            <label htmlFor="sick-hours" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Contracted Hours / Wk
            </label>
            <select
              id="sick-hours"
              value={contractedHours}
              onChange={(e) => setContractedHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value={37.5}>37.5 hrs (Full-Time)</option>
              <option value={34.5}>34.5 hrs (3 Long Shifts)</option>
              <option value={30}>30.0 hrs (0.8 FTE)</option>
              <option value={22.5}>22.5 hrs (0.6 FTE)</option>
            </select>
          </div>
        </div>

        {/* Regular Unsocial Hours Included in Sick Pay */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Regularly Rostered Night/Saturday Hours Per Week
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 6, 11.5, 18].map((nh) => (
              <button
                key={nh}
                type="button"
                onClick={() => setNightHoursPerWeek(nh)}
                className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                  nightHoursPerWeek === nh
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {nh}h/wk
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Under Section 14.4, regularly rostered unsocial hours enhancements are paid during NHS sick leave.
          </p>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-7 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {currentTier.label}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {currentTier.fullMonths}m Full Pay + {currentTier.halfMonths}m Half Pay
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-white/10">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Phase 1: Full Pay ({currentTier.fullMonths} {currentTier.fullMonths === 1 ? "Mo" : "Mos"})
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1">
                {formatCurrency(Math.round(sickModel.fullMonthlyNet))}
                <span className="text-sm font-bold text-emerald-200">/mo</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                100% of normal net take-home pay
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Phase 2: Half Pay + SSP ({currentTier.halfMonths} Mos)
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {formatCurrency(Math.round(sickModel.halfPayMonthlyNet))}
                <span className="text-sm font-bold text-slate-300">/mo</span>
              </p>
              <p className="text-xs text-emerald-300 font-semibold mt-1">
                Equals {sickModel.halfPayRetentionPct}% of your normal net pay!
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Phase 3: SSP Only (Up to 28 Wks)
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">
                {formatCurrency(Math.round(sickModel.sspMonthly))}
                <span className="text-sm font-bold text-amber-200">/mo</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                £118.75/week statutory rate
              </p>
            </div>
          </div>

          {/* Why Half Pay is ~65%+ of Normal Net Pay Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 text-xs">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                Half-Pay Phase Gross Makeup
              </p>
              <p className="text-lg font-extrabold text-white mt-1">
                {formatCurrency(Math.round(sickModel.halfPayMonthlyGross))}/mo Gross
              </p>
              <p className="text-slate-300 mt-0.5">
                50% NHS Pay ({formatCurrency(Math.round(sickModel.fullMonthlyGross * 0.5))}) + SSP ({formatCurrency(Math.round(sickModel.sspMonthly))})
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                Total Protected Net Income ({currentTier.fullMonths + currentTier.halfMonths} Months)
              </p>
              <p className="text-lg font-extrabold text-emerald-400 mt-1">
                {formatCurrency(Math.round(sickModel.totalProtectedNet))} Net Total
              </p>
              <p className="text-slate-300 mt-0.5">
                Across {currentTier.fullMonths}m full pay and {currentTier.halfMonths}m half pay
              </p>
            </div>
          </div>
        </div>

        {/* Month-by-Month Timeline Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Your NHS Sick Pay Phase Breakdown ({band})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Gross pay, reduced PAYE tax/NI deductions, and net monthly take-home by phase
              </p>
            </div>
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Sick Leave Phase</th>
                  <th className="py-3 px-4 text-right">Duration</th>
                  <th className="py-3 px-4 text-right">Monthly Gross</th>
                  <th className="py-3 px-4 text-right">Tax, NI &amp; Pension</th>
                  <th className="py-3 px-4 text-right">Net Take-Home / Mo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="bg-emerald-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">1. Occupational Full Pay</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-700">
                    {currentTier.fullMonths} {currentTier.fullMonths === 1 ? "Month" : "Months"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                    {formatCurrency(Math.round(sickModel.fullMonthlyGross))}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-600">
                    -{formatCurrency(Math.round(sickModel.fullMonthlyGross - sickModel.fullMonthlyNet))}
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                    {formatCurrency(Math.round(sickModel.fullMonthlyNet))}
                  </td>
                </tr>
                <tr className="bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">2. Occupational Half Pay + SSP</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-700">
                    {currentTier.halfMonths} Months
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                    {formatCurrency(Math.round(sickModel.halfPayMonthlyGross))}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-600">
                    -{formatCurrency(Math.round(sickModel.halfPayMonthlyGross - sickModel.halfPayMonthlyNet))}
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-sky-700">
                    {formatCurrency(Math.round(sickModel.halfPayMonthlyNet))}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold text-slate-900">3. Statutory Sick Pay (SSP) Only</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-700">
                    If SSP weeks remain
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                    {formatCurrency(Math.round(sickModel.sspMonthly))}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-500">£0</td>
                  <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                    {formatCurrency(Math.round(sickModel.sspMonthly))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-rose-50/70 rounded-2xl border border-rose-200/80 p-5 flex gap-3.5">
          <Info className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
            <p className="font-bold text-slate-900">
              Why NHS Half Pay Gives You {sickModel.halfPayRetentionPct}% (Not 50%) of Your Normal Take-Home Pay:
            </p>
            <p>
              During the Half Pay phase, two things boost your net monthly pay: first, <strong>Statutory Sick Pay (£118.75/week = £514.58/month)</strong> is added on top of your 50% occupational half pay; second, your £12,570 tax-free Personal Allowance and National Insurance threshold remain unchanged while your gross pay drops, cutting your monthly tax and NI bill dramatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
