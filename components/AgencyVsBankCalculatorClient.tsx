"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import {
  Building2,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Coins,
  Umbrella,
  HeartHandshake,
} from "lucide-react";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { MagneticBentoContainer } from "@/components/MagneticBento";

interface Preset {
  id: string;
  name: string;
  tagline: string;
  band: string;
  stepIndex: number;
  hoursPerWeek: number;
  agencyRate: number;
  umbrellaWeeklyFee: number;
}

const PRESETS: Preset[] = [
  {
    id: "b5-ward-nurse",
    name: "🩺 Band 5 Nurse: Bank vs £36/hr Agency",
    tagline: "37.5h • Permanent vs Bank vs Agency Inside IR35",
    band: "Band 5",
    stepIndex: 0,
    hoursPerWeek: 37.5,
    agencyRate: 36,
    umbrellaWeeklyFee: 25,
  },
  {
    id: "b6-senior-nurse",
    name: "⚡ Band 6 Senior: Permanent vs £44/hr Agency",
    tagline: "37.5h • Top Band 6 vs High-Rate Agency Umbrella",
    band: "Band 6",
    stepIndex: 1,
    hoursPerWeek: 37.5,
    agencyRate: 44,
    umbrellaWeeklyFee: 25,
  },
  {
    id: "b2-hca-support",
    name: "🏥 Band 2 HCA: Substantive vs £22/hr Agency",
    tagline: "37.5h • Entry Support Worker vs Care Agency",
    band: "Band 2",
    stepIndex: 0,
    hoursPerWeek: 37.5,
    agencyRate: 22,
    umbrellaWeeklyFee: 20,
  },
  {
    id: "extra-weekend-shifts",
    name: "🌙 Extra 23h Shifts: Bank vs £38/hr Agency",
    tagline: "23h/wk • Moonlighting / Extra Shifts Comparison",
    band: "Band 5",
    stepIndex: 1,
    hoursPerWeek: 23,
    agencyRate: 38,
    umbrellaWeeklyFee: 25,
  },
];

export function AgencyVsBankCalculatorClient() {
  const [band, setBand] = useState<string>("Band 5");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(37.5);
  const [agencyRate, setAgencyRate] = useState<number>(36);
  const [umbrellaWeeklyFee, setUmbrellaWeeklyFee] = useState<number>(25);
  const [bankEnrolledInPension, setBankEnrolledInPension] = useState<boolean>(true);

  const applyPreset = (p: Preset) => {
    setBand(p.band);
    setStepIndex(p.stepIndex);
    setHoursPerWeek(p.hoursPerWeek);
    setAgencyRate(p.agencyRate);
    setUmbrellaWeeklyFee(p.umbrellaWeeklyFee);
  };

  const selectedBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === band) || nhsData.bands[3],
    [band]
  );
  const safeStepIndex = Math.min(stepIndex, selectedBandObj.points.length - 1);
  const point = selectedBandObj.points[safeStepIndex];

  // 1. Permanent Substantive NHS AfC Contract
  const substantivePay = useMemo(() => {
    return calculateNHSPay({
      band,
      stepIndex: safeStepIndex,
      hcasZone: "standard",
      contractedHours: hoursPerWeek,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });
  }, [band, safeStepIndex, hoursPerWeek]);

  // 2. NHS Staff Bank Model
  const bankModel = useMemo(() => {
    const baseHourly = point.annualSalary / 1955.357;
    // Statutory WTR (Working Time Regulations) 12.07% holiday pay uplift
    const holidayHourly = baseHourly * 0.1207;
    const totalHourlyGross = baseHourly + holidayHourly;

    const annualGross = totalHourlyGross * hoursPerWeek * 52.143;
    const monthlyGross = annualGross / 12;

    // Pension calculation
    const pensionRate = bankEnrolledInPension ? substantivePay.pensionRate : 0;
    const annualPension = annualGross * pensionRate;
    const monthlyPension = annualPension / 12;

    // Taxable pay after pension
    const taxableAnnual = Math.max(0, annualGross - annualPension);
    const personalAllowance = 12570;
    const taxableIncome = Math.max(0, taxableAnnual - personalAllowance);

    // PAYE Tax (20% basic, 40% higher above 50,270)
    const basicTax = Math.min(taxableIncome, 50270 - personalAllowance) * 0.2;
    const higherTax = Math.max(0, taxableIncome - (50270 - personalAllowance)) * 0.4;
    const annualTax = basicTax + higherTax;
    const monthlyTax = annualTax / 12;

    // Employee National Insurance (8% up to 50,270, 2% above)
    const niThreshold = 12570;
    const niBasic = Math.max(0, Math.min(annualGross, 50270) - niThreshold) * 0.08;
    const niUpper = Math.max(0, annualGross - 50270) * 0.02;
    const annualNi = niBasic + niUpper;
    const monthlyNi = annualNi / 12;

    const monthlyNet = Math.max(0, monthlyGross - monthlyPension - monthlyTax - monthlyNi);
    const annualNet = monthlyNet * 12;

    return {
      baseHourly,
      holidayHourly,
      totalHourlyGross,
      monthlyGross,
      annualGross,
      monthlyPension,
      monthlyTax,
      monthlyNi,
      monthlyNet,
      annualNet,
    };
  }, [point, hoursPerWeek, bankEnrolledInPension, substantivePay.pensionRate]);

  // 3. Agency Nursing Model (Inside IR35 via Umbrella Company)
  const agencyModel = useMemo(() => {
    const weeklyAssignmentRate = agencyRate * hoursPerWeek;
    const annualAssignmentRate = weeklyAssignmentRate * 52.143;
    const monthlyAssignmentRate = annualAssignmentRate / 12;

    // Umbrella margin
    const annualUmbrellaFee = umbrellaWeeklyFee * 52.143;
    const monthlyUmbrellaFee = annualUmbrellaFee / 12;

    // Apprenticeship Levy = 0.5%
    const annualApprenticeshipLevy = annualAssignmentRate * 0.005;
    const monthlyApprenticeshipLevy = annualApprenticeshipLevy / 12;

    // Employer NI (Secondary Class 1 NI) = 13.8% on earnings above £175/wk (£9,100/yr)
    const employerNiThreshold = 9100;
    const annualEmployerNi =
      annualAssignmentRate > employerNiThreshold
        ? (annualAssignmentRate - employerNiThreshold) * 0.138
        : 0;
    const monthlyEmployerNi = annualEmployerNi / 12;

    // Gross Taxable Pay to the Nurse
    const annualGrossToWorker = Math.max(
      0,
      annualAssignmentRate - annualUmbrellaFee - annualApprenticeshipLevy - annualEmployerNi
    );
    const monthlyGrossToWorker = annualGrossToWorker / 12;

    // Employee Income Tax
    const personalAllowance = 12570;
    const taxable = Math.max(0, annualGrossToWorker - personalAllowance);
    const taxBasic = Math.min(taxable, 50270 - personalAllowance) * 0.2;
    const taxHigher = Math.max(0, taxable - (50270 - personalAllowance)) * 0.4;
    const annualEmployeeTax = taxBasic + taxHigher;
    const monthlyEmployeeTax = annualEmployeeTax / 12;

    // Employee NI (8% between 12,570 and 50,270, 2% above)
    const niThreshold = 12570;
    const niBasic = Math.max(0, Math.min(annualGrossToWorker, 50270) - niThreshold) * 0.08;
    const niUpper = Math.max(0, annualGrossToWorker - 50270) * 0.02;
    const annualEmployeeNi = niBasic + niUpper;
    const monthlyEmployeeNi = annualEmployeeNi / 12;

    // Net Take-Home in Bank
    const monthlyNet = Math.max(0, monthlyGrossToWorker - monthlyEmployeeTax - monthlyEmployeeNi);
    const annualNet = monthlyNet * 12;

    // Effective Net Hourly Rate
    const netHourlyRate = hoursPerWeek > 0 ? monthlyNet / (hoursPerWeek * (52.143 / 12)) : 0;
    const deductionBitePercentage =
      monthlyAssignmentRate > 0
        ? Math.round(((monthlyAssignmentRate - monthlyNet) / monthlyAssignmentRate) * 100)
        : 0;

    return {
      monthlyAssignmentRate,
      annualAssignmentRate,
      monthlyUmbrellaFee,
      monthlyEmployerNi,
      monthlyApprenticeshipLevy,
      monthlyGrossToWorker,
      monthlyEmployeeTax,
      monthlyEmployeeNi,
      monthlyNet,
      annualNet,
      netHourlyRate,
      deductionBitePercentage,
    };
  }, [agencyRate, hoursPerWeek, umbrellaWeeklyFee]);

  // Hidden Total Compensation & Benefits Value (Permanent vs Agency)
  const benefitsComparison = useMemo(() => {
    // 1. NHS Pension employer contribution (+23.78%)
    const monthlyEmployerPension = (substantivePay.grossPay.annual * 0.2378) / 12;
    // 2. 27 days + 8 BH = 35 days paid annual leave (~13.5% of gross value)
    const monthlyHolidayValue = (substantivePay.grossPay.annual * 0.135) / 12;
    // 3. Sick pay security (contingency value approx 3% of salary)
    const monthlySickPayValue = (substantivePay.grossPay.annual * 0.03) / 12;

    const totalSubstantivePackage =
      substantivePay.netPay.monthly +
      monthlyEmployerPension +
      monthlyHolidayValue +
      monthlySickPayValue;

    const monthlyNetDifference = agencyModel.monthlyNet - substantivePay.netPay.monthly;
    const truePackageDifference = agencyModel.monthlyNet - totalSubstantivePackage;

    return {
      monthlyEmployerPension,
      monthlyHolidayValue,
      monthlySickPayValue,
      totalSubstantivePackage,
      monthlyNetDifference,
      truePackageDifference,
    };
  }, [substantivePay, agencyModel]);

  return (
    <div className="space-y-8">
      {/* 1-Click Dilemma Presets (Magnetic Bento) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#005EB8]">
          <Sparkles className="w-4 h-4" />
          <span>Instant Clinical Dilemma Presets</span>
        </div>
        <MagneticBentoContainer variant="pill" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESETS.map((p) => {
              const isActive =
                band === p.band &&
                safeStepIndex === p.stepIndex &&
                hoursPerWeek === p.hoursPerWeek &&
                agencyRate === p.agencyRate;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`bento-card text-left p-3.5 rounded-2xl border transition-all text-xs ${
                    isActive
                      ? "bg-blue-50/90 border-[#005EB8] text-slate-900 shadow-xs ring-2 ring-[#005EB8]/20"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                    <span>{p.name}</span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[#005EB8] shrink-0" />}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{p.tagline}</p>
                </button>
              );
            })}
          </div>
        </MagneticBentoContainer>
      </section>

      {/* Main Dual-Column Interactive Modeler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#005EB8]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Contract Comparison Setup</h2>
              <p className="text-xs text-slate-500">AfC Substantive • Trust Staff Bank • Agency Inside IR35</p>
            </div>
          </div>

          {/* Band & Experience Step */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comp-band" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                NHS Pay Band
              </label>
              <select
                id="comp-band"
                value={band}
                onChange={(e) => {
                  setBand(e.target.value);
                  setStepIndex(0);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                {nhsData.bands.slice(0, 7).map((b) => (
                  <option key={b.band} value={b.band}>
                    {b.band}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="comp-step" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Experience Step
              </label>
              <select
                id="comp-step"
                value={safeStepIndex}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                {selectedBandObj.points.map((pt, idx) => (
                  <option key={pt.step} value={idx}>
                    {pt.step} ({formatCurrency(pt.annualSalary)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weekly Hours Worked */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label htmlFor="comp-hours" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Weekly Hours Worked
              </label>
              <span className="text-xs font-extrabold text-[#005EB8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {hoursPerWeek} Hours / Week
              </span>
            </div>
            <input
              id="comp-hours"
              type="range"
              min={11.5}
              max={60}
              step={0.5}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-[#005EB8] cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[11.5, 23, 30, 37.5, 46, 48].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHoursPerWeek(h)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${
                    hoursPerWeek === h
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Agency Headline Rate & Umbrella Margin */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-1.5">
                <div>
                  <label htmlFor="comp-agency-rate" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Agency Quoted Hourly Rate
                  </label>
                  <span className="text-[11px] text-slate-500">Headline assignment rate quoted by agency</span>
                </div>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0 self-start sm:self-auto">
                  £{agencyRate.toFixed(2)}/hr
                </span>
              </div>
              <input
                id="comp-agency-rate"
                type="range"
                min={18}
                max={75}
                step={0.5}
                value={agencyRate}
                onChange={(e) => setAgencyRate(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer mt-1"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[22, 28, 35, 40, 45, 52].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAgencyRate(r)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${
                      agencyRate === r
                        ? "bg-amber-800 text-white border-amber-800"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    £{r}/hr
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-1.5">
                <label htmlFor="comp-umbrella-fee" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Umbrella Company Fee (£/week)
                </label>
                <span className="text-xs font-bold text-slate-600">
                  £{umbrellaWeeklyFee}/wk ({formatCurrency(agencyModel.monthlyUmbrellaFee)}/mo)
                </span>
              </div>
              <input
                id="comp-umbrella-fee"
                type="range"
                min={15}
                max={40}
                step={1}
                value={umbrellaWeeklyFee}
                onChange={(e) => setUmbrellaWeeklyFee(Number(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Bank Pension Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={bankEnrolledInPension}
                onChange={(e) => setBankEnrolledInPension(e.target.checked)}
                className="rounded text-[#005EB8] focus:ring-[#005EB8] w-4 h-4"
              />
              <span>Enroll Staff Bank in 2015 NHS CARE Pension ({substantivePay.pensionTierLabel})</span>
            </label>
            <p className="text-[11px] text-slate-500 mt-1 pl-6">
              Bank workers can contribute to the CARE pension, building guaranteed retirement income with tax relief.
            </p>
          </div>
        </div>

        {/* Right Column: 3-Way Comparative Bento Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main 3-Way Comparison Bento Grid */}
          <MagneticBentoContainer variant="2xl" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: Permanent Substantive */}
              <div className="bento-card bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#005EB8] border border-blue-200">
                      Substantive
                    </span>
                    <span className="text-xs font-bold text-slate-600 font-mono">
                      {formatHourlyRate(point.annualSalary / 1955.357)}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 mt-3">
                    Permanent NHS AfC
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Contractual security, sick pay, annual leave &amp; 2015 CARE pension
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Net Take-Home Pay
                    </span>
                    <p className="text-2xl font-black text-slate-900 font-mono">
                      {formatCurrency(substantivePay.netPay.monthly)}
                      <span className="text-xs font-semibold text-slate-500">/mo</span>
                    </p>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      {formatCurrency(substantivePay.grossPay.annual)}/yr gross
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span>NHS Pension Tier:</span>
                      <strong className="text-[#005EB8]">{substantivePay.pensionTierLabel}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Annual Leave:</span>
                      <strong className="text-emerald-700">27–33 Days + 8 BH</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Occupational Sick Pay:</span>
                      <strong className="text-emerald-700">Up to 6m Full Pay</strong>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900 font-semibold">
                  +23.78% Employer Pension funded ({formatCurrency(benefitsComparison.monthlyEmployerPension)}/mo)
                </div>
              </div>

              {/* Pillar 2: NHS Staff Bank */}
              <div className="bento-card bg-white rounded-3xl border-2 border-emerald-500 p-5 shadow-xs space-y-4 flex flex-col justify-between relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider shadow-xs">
                  Best Value Hybrid
                </span>

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      NHS Staff Bank
                    </span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {formatHourlyRate(bankModel.totalHourlyGross)}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 mt-3">
                    Trust Staff Bank
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Includes statutory <strong>+12.07% WTR Holiday Pay</strong> uplift on every hour
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Net Take-Home Pay
                    </span>
                    <p className="text-2xl font-black text-emerald-600 font-mono">
                      {formatCurrency(bankModel.monthlyNet)}
                      <span className="text-xs font-semibold text-slate-500">/mo</span>
                    </p>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      {formatCurrency(bankModel.annualGross)}/yr gross
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span>WTR Holiday Pay:</span>
                      <strong className="text-emerald-700">+{formatHourlyRate(bankModel.holidayHourly)} (+12%)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Umbrella Fees:</span>
                      <strong className="text-emerald-700">£0 / Zero Fees</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Employer NI Deducted:</span>
                      <strong className="text-emerald-700">£0 (Trust Pays)</strong>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] text-emerald-900 font-semibold">
                  Zero umbrella middleman fees. Direct trust payroll with PAYE simplicity.
                </div>
              </div>

              {/* Pillar 3: Agency (Inside IR35) */}
              <div className="bento-card bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Agency (Umbrella)
                    </span>
                    <span className="text-xs font-bold text-amber-800 font-mono">
                      £{agencyRate.toFixed(2)}/hr Headline
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 mt-3">
                    Agency Inside IR35
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Worker pays Employer NI (13.8%), Levy (0.5%) &amp; Umbrella fee
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Real Net In Bank
                    </span>
                    <p className="text-2xl font-black text-amber-700 font-mono">
                      {formatCurrency(agencyModel.monthlyNet)}
                      <span className="text-xs font-semibold text-slate-500">/mo</span>
                    </p>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      Effective: {formatHourlyRate(agencyModel.netHourlyRate)} net
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span>Umbrella Margin:</span>
                      <strong className="text-rose-600">−{formatCurrency(agencyModel.monthlyUmbrellaFee)}/mo</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Employer NI (13.8%):</span>
                      <strong className="text-rose-600">−{formatCurrency(agencyModel.monthlyEmployerNi)}/mo</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Apprenticeship Levy:</span>
                      <strong className="text-rose-600">−{formatCurrency(agencyModel.monthlyApprenticeshipLevy)}/mo</strong>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 font-semibold">
                  {agencyModel.deductionBitePercentage}% of headline agency money is lost to deductions!
                </div>
              </div>
            </div>
          </MagneticBentoContainer>

          {/* The "Hidden Compensation Gap" Reality Callout */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>The Total Compensation Reality: Permanent vs Agency</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  Net Cash Difference (Take-Home Only)
                </span>
                <p className="text-2xl font-black text-amber-400">
                  {benefitsComparison.monthlyNetDifference > 0 ? "+" : ""}
                  {formatCurrency(benefitsComparison.monthlyNetDifference)}
                  <span className="text-xs font-semibold text-slate-300">/mo</span>
                </p>
                <p className="text-[11px] text-slate-300">
                  {benefitsComparison.monthlyNetDifference > 0
                    ? "Agency puts more immediate cash in your bank."
                    : "Permanent NHS actually pays MORE take-home cash!"}
                </p>
              </div>

              <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-400/20 space-y-1">
                <span className="text-emerald-300 text-[10px] uppercase font-bold tracking-wider">
                  Total Substantive Benefits Package
                </span>
                <p className="text-2xl font-black text-emerald-400">
                  {formatCurrency(benefitsComparison.totalSubstantivePackage)}
                  <span className="text-xs font-semibold text-emerald-200">/mo</span>
                </p>
                <p className="text-[11px] text-emerald-200">
                  Includes {formatCurrency(benefitsComparison.monthlyEmployerPension)}/mo pension + {formatCurrency(benefitsComparison.monthlyHolidayValue)}/mo holiday pay.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
              {benefitsComparison.truePackageDifference < 0
                ? `Even though agency nursing pays +${formatCurrency(benefitsComparison.monthlyNetDifference)}/mo more immediate net cash, your permanent NHS substantive job delivers +${formatCurrency(Math.abs(benefitsComparison.truePackageDifference))}/mo more in total compensation when factoring in the 23.78% employer pension, 35 days paid holiday, and full sick pay security.`
                : `At a high agency rate of £${agencyRate}/hr, agency take-home pay overcomes the lost benefits package by approx. +${formatCurrency(benefitsComparison.truePackageDifference)}/month, assuming consistent shifts with zero unpaid time off.`}
            </p>

            <div className="pt-2">
              <ShareBreakdownButton
                variant="dark"
                label="Share Bank vs Agency Comparison"
                url="https://netpayscale.uk/agency-vs-bank-calculator/"
                shareText={`NHS ${band} Contract Comparison (${hoursPerWeek}h/wk):\n• Permanent AfC Net: ${formatCurrency(substantivePay.netPay.monthly)}/mo (+23.78% pension & 35 days leave)\n• NHS Staff Bank Net: ${formatCurrency(bankModel.monthlyNet)}/mo (includes +12.07% WTR holiday pay)\n• Agency (£${agencyRate}/hr Inside IR35): ${formatCurrency(agencyModel.monthlyNet)}/mo (after 13.8% Employer NI & umbrella fees)\nCalculate yours: https://netpayscale.uk/agency-vs-bank-calculator/`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
