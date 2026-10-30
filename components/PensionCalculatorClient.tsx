"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency } from "@/lib/formatters";
import {
  Landmark,
  Sparkles,
  ShieldCheck,
  Info,
  Clock,
  Coins,
  HeartHandshake,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { MagneticBentoContainer } from "@/components/MagneticBento";

// Official Government Actuary's Department (GAD) actuarial reduction factors for 2015 NHS Scheme
// Years early relative to Normal Pension Age (State Pension Age)
const GAD_EARLY_FACTORS: Record<number, number> = {
  0: 1.0, // 0% reduction
  1: 0.946, // -5.4%
  2: 0.896, // -10.4%
  3: 0.849, // -15.1%
  4: 0.806, // -19.4%
  5: 0.766, // -23.4%
  6: 0.729, // -27.1%
  7: 0.694, // -30.6%
  8: 0.662, // -33.8%
  9: 0.632, // -36.8%
  10: 0.604, // -39.6%
  11: 0.578, // -42.2%
  12: 0.554, // -44.6%
  13: 0.531, // -46.9%
};

// Late retirement enhancement factors (+3.4% to +3.7% per year past NPA)
const GAD_LATE_FACTORS: Record<number, number> = {
  0: 1.0,
  1: 1.034,
  2: 1.07,
  3: 1.108,
};

function getActuarialFactor(retireAge: number, npa: number): { factor: number; percentChange: number; isEarly: boolean; isLate: boolean; diffYears: number } {
  const diff = retireAge - npa;
  if (diff === 0) {
    return { factor: 1.0, percentChange: 0, isEarly: false, isLate: false, diffYears: 0 };
  }
  if (diff < 0) {
    const yearsEarly = Math.min(13, Math.abs(diff));
    const factor = GAD_EARLY_FACTORS[yearsEarly] ?? 0.531;
    const percentChange = Math.round((1 - factor) * 1000) / 10;
    return { factor, percentChange: -percentChange, isEarly: true, isLate: false, diffYears: yearsEarly };
  } else {
    const yearsLate = Math.min(3, diff);
    const factor = GAD_LATE_FACTORS[yearsLate] ?? 1.108;
    const percentChange = Math.round((factor - 1) * 1000) / 10;
    return { factor, percentChange, isEarly: false, isLate: true, diffYears: yearsLate };
  }
}

interface PensionPreset {
  id: string;
  name: string;
  tagline: string;
  band: string;
  stepIndex: number;
  hcasZone: "standard" | "inner-london" | "outer-london" | "fringe";
  contractedHours: number;
  serviceYears: number;
  npa: number;
  retireAge: number;
  lumpSumPercent: number;
}

const PRESETS: PensionPreset[] = [
  {
    id: "retire-60-early",
    name: "⚡ Retire at 60 (Early Penalty)",
    tagline: "Band 6 Top • 20 yrs • 7 yrs early (-30.6%)",
    band: "Band 6",
    stepIndex: 1, // Top of Band 6
    hcasZone: "standard",
    contractedHours: 37.5,
    serviceYears: 20,
    npa: 67,
    retireAge: 60,
    lumpSumPercent: 0,
  },
  {
    id: "spa-67-unreduced",
    name: "🛡️ State Pension Age 67 (Unreduced)",
    tagline: "Band 6 Top • 25 yrs • 100% full pension",
    band: "Band 6",
    stepIndex: 1,
    hcasZone: "standard",
    contractedHours: 37.5,
    serviceYears: 25,
    npa: 67,
    retireAge: 67,
    lumpSumPercent: 0,
  },
  {
    id: "max-lump-sum",
    name: "💰 Max Tax-Free Cash (£12 : £1)",
    tagline: "Band 7 Top • 25 yrs • Max statutory lump sum",
    band: "Band 7",
    stepIndex: 1,
    hcasZone: "standard",
    contractedHours: 37.5,
    serviceYears: 25,
    npa: 67,
    retireAge: 67,
    lumpSumPercent: 100,
  },
  {
    id: "band-5-starter",
    name: "🩺 Band 5 Starter (30-Yr Model)",
    tagline: "Band 5 Entry • 30 yrs • Full CARE accrual",
    band: "Band 5",
    stepIndex: 0,
    hcasZone: "standard",
    contractedHours: 37.5,
    serviceYears: 30,
    npa: 68,
    retireAge: 68,
    lumpSumPercent: 0,
  },
];

export function PensionCalculatorClient() {
  const [band, setBand] = useState<string>("Band 6");
  const [stepIndex, setStepIndex] = useState<number>(1);
  const [hcasZone, setHcasZone] = useState<"standard" | "inner-london" | "outer-london" | "fringe">("standard");
  const [contractedHours, setContractedHours] = useState<number>(37.5);
  const [serviceYears, setServiceYears] = useState<number>(25);
  const [npa, setNpa] = useState<number>(67);
  const [retireAge, setRetireAge] = useState<number>(67);
  const [lumpSumPercent, setLumpSumPercent] = useState<number>(0); // 0% to 100% of maximum HMRC commutation

  const applyPreset = (preset: PensionPreset) => {
    setBand(preset.band);
    setStepIndex(preset.stepIndex);
    setHcasZone(preset.hcasZone);
    setContractedHours(preset.contractedHours);
    setServiceYears(preset.serviceYears);
    setNpa(preset.npa);
    setRetireAge(preset.retireAge);
    setLumpSumPercent(preset.lumpSumPercent);
  };

  const selectedBandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === band) || nhsData.bands[3],
    [band]
  );

  const safeStepIndex = Math.min(stepIndex, selectedBandObj.points.length - 1);

  // Pay calculation with and without pension to get exact PAYE tax relief
  const withPension = useMemo(
    () =>
      calculateNHSPay({
        band,
        stepIndex: safeStepIndex,
        hcasZone,
        contractedHours,
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: false,
        isScottishTax: false,
        studentLoan: "none",
      }),
    [band, safeStepIndex, hcasZone, contractedHours]
  );

  const optedOut = useMemo(
    () =>
      calculateNHSPay({
        band,
        stepIndex: safeStepIndex,
        hcasZone,
        contractedHours,
        nightHoursPerWeek: 0,
        sundayHoursPerWeek: 0,
        pensionOptedOut: true,
        isScottishTax: false,
        studentLoan: "none",
      }),
    [band, safeStepIndex, hcasZone, contractedHours]
  );

  const model = useMemo(() => {
    const pensionablePay = withPension.grossPay.annual;
    const employeeAnnualGross = withPension.pensionContribution.annual;
    const employeeMonthlyGross = withPension.pensionContribution.monthly;

    // True net take-home cost (pension reduces taxable pay before PAYE)
    const trueMonthlyNetCost = Math.max(0, optedOut.netPay.monthly - withPension.netPay.monthly);
    const monthlyTaxSaved = Math.max(0, employeeMonthlyGross - trueMonthlyNetCost);
    const effectiveCostPerPound = employeeMonthlyGross > 0 ? (trueMonthlyNetCost / employeeMonthlyGross) : 0.8;

    // Employer Contribution (23.7% statutory + 0.08% admin levy = 23.78%)
    const employerAnnualContribution = pensionablePay * 0.2378;
    const employerMonthlyContribution = employerAnnualContribution / 12;

    // 2015 CARE Scheme: 1/54th annual accrual
    const singleYearAccrual = pensionablePay / 54;

    // Compounded CARE pot over serviceYears with 1.5% active revaluation (above CPI)
    let unreducedAnnualPension = 0;
    for (let y = 0; y < serviceYears; y++) {
      unreducedAnnualPension += singleYearAccrual * Math.pow(1.015, y);
    }

    // Actuarial reduction / enhancement for early or late retirement
    const actuarial = getActuarialFactor(retireAge, npa);
    const actuarialAnnualPension = unreducedAnnualPension * actuarial.factor;

    // Statutory HMRC Maximum Commutation Formula for 2015 Scheme:
    // Max lump sum = (30/7) * unreduced/actuarial annual pension = ~4.2857 * pension
    // Max annual pension surrendered = max lump sum / 12 = (5/14) * pension = ~35.714%
    const maxPermittedLumpSum = (30 / 7) * actuarialAnnualPension;
    const maxAnnualPensionSurrender = maxPermittedLumpSum / 12;

    // Chosen commutation
    const commutationFraction = Math.max(0, Math.min(100, lumpSumPercent)) / 100;
    const chosenAnnualSurrender = maxAnnualPensionSurrender * commutationFraction;
    const chosenLumpSum = chosenAnnualSurrender * 12;

    const finalAnnualPension = Math.max(0, actuarialAnnualPension - chosenAnnualSurrender);
    const finalMonthlyPension = finalAnnualPension / 12;

    // Family and Survivor Benefits
    const deathInServiceLumpSum = pensionablePay * 2;
    const survivorAnnualPension = unreducedAnnualPension * 0.3375; // 33.75% partner pension

    // Lifetime ROI Model (20 years of retirement payout)
    const totalNetEmployeePaid = trueMonthlyNetCost * 12 * serviceYears;
    const estimated20YrPayout = finalAnnualPension * 20 + chosenLumpSum;
    const returnMultiple = totalNetEmployeePaid > 0 ? (estimated20YrPayout / totalNetEmployeePaid) : 0;

    return {
      pensionablePay,
      employeeAnnualGross,
      employeeMonthlyGross,
      trueMonthlyNetCost,
      monthlyTaxSaved,
      effectiveCostPerPound,
      employerAnnualContribution,
      employerMonthlyContribution,
      singleYearAccrual,
      unreducedAnnualPension,
      actuarial,
      maxPermittedLumpSum,
      maxAnnualPensionSurrender,
      chosenAnnualSurrender,
      chosenLumpSum,
      finalAnnualPension,
      finalMonthlyPension,
      deathInServiceLumpSum,
      survivorAnnualPension,
      totalNetEmployeePaid,
      estimated20YrPayout,
      returnMultiple,
    };
  }, [withPension, optedOut, serviceYears, npa, retireAge, lumpSumPercent]);

  return (
    <div className="space-y-8">
      {/* 1-Click Dilemma Presets (Magnetic Bento) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#005EB8]">
          <Sparkles className="w-4 h-4" />
          <span>Instant NHS Retirement Dilemma Presets</span>
        </div>
        <MagneticBentoContainer variant="pill" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESETS.map((p) => {
              const isActive =
                band === p.band &&
                safeStepIndex === p.stepIndex &&
                serviceYears === p.serviceYears &&
                retireAge === p.retireAge &&
                lumpSumPercent === p.lumpSumPercent;
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

      {/* Main Dual-Column Modeler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#005EB8]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">2015 CARE Scheme Setup</h2>
              <p className="text-xs text-slate-500">1/54th Accrual • GAD Early Retirement Factors • 12:1 Commutation</p>
            </div>
          </div>

          {/* Band & Experience Step */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pen-band" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Pay Band
              </label>
              <select
                id="pen-band"
                value={band}
                onChange={(e) => {
                  setBand(e.target.value);
                  setStepIndex(0);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                {nhsData.bands.map((b) => (
                  <option key={b.band} value={b.band}>
                    {b.band}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pen-step" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Experience Step
              </label>
              <select
                id="pen-step"
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

          {/* Location HCAS & Contracted Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pen-hcas" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                London Weighting (HCAS)
              </label>
              <select
                id="pen-hcas"
                value={hcasZone}
                onChange={(e) => setHcasZone(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                <option value="standard">National Standard (0%)</option>
                <option value="inner-london">Inner London (+20%)</option>
                <option value="outer-london">Outer London (+15%)</option>
                <option value="fringe">London Fringe (+5%)</option>
              </select>
            </div>

            <div>
              <label htmlFor="pen-hours" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contracted Hours
              </label>
              <select
                id="pen-hours"
                value={contractedHours}
                onChange={(e) => setContractedHours(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              >
                <option value={37.5}>37.5 hrs (1.0 FTE Full-Time)</option>
                <option value={34.5}>34.5 hrs (0.92 FTE)</option>
                <option value={30}>30.0 hrs (0.8 FTE)</option>
                <option value={22.5}>22.5 hrs (0.6 FTE Part-Time)</option>
                <option value={18.75}>18.75 hrs (0.5 FTE)</option>
              </select>
            </div>
          </div>

          {/* Years of Service Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label htmlFor="pen-years" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Years Contributing to 2015 Scheme
              </label>
              <span className="text-xs font-extrabold text-[#005EB8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {serviceYears} Years
              </span>
            </div>
            <input
              id="pen-years"
              type="range"
              min={1}
              max={40}
              step={1}
              value={serviceYears}
              onChange={(e) => setServiceYears(Number(e.target.value))}
              className="w-full accent-[#005EB8] cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[5, 10, 15, 20, 25, 30, 35].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setServiceYears(yr)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${
                    serviceYears === yr
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {yr}y
                </button>
              ))}
            </div>
          </div>

          {/* Normal Pension Age & Planned Retirement Age (Actuarial Sliders) */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pen-npa" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  State Pension Age (NPA)
                </label>
                <select
                  id="pen-npa"
                  value={npa}
                  onChange={(e) => setNpa(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
                >
                  <option value={65}>Age 65 (Born before 1954)</option>
                  <option value={66}>Age 66 (Born 1954–1960)</option>
                  <option value={67}>Age 67 (Born 1961–1977)</option>
                  <option value={68}>Age 68 (Born 1978+)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="pen-retire-age" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Retirement Age
                  </label>
                  <span className="text-xs font-extrabold text-[#005EB8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Age {retireAge}
                  </span>
                </div>
                <input
                  id="pen-retire-age"
                  type="range"
                  min={55}
                  max={70}
                  step={1}
                  value={retireAge}
                  onChange={(e) => setRetireAge(Number(e.target.value))}
                  className="w-full accent-[#005EB8] cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Actuarial Early/Late Penalty Indicator Pill */}
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                model.actuarial.isEarly
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : model.actuarial.isLate
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-blue-50 border-blue-200 text-blue-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {model.actuarial.isEarly ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold">
                    {model.actuarial.isEarly
                      ? `Retiring ${model.actuarial.diffYears} Year${model.actuarial.diffYears > 1 ? "s" : ""} Early (Age ${retireAge} vs ${npa})`
                      : model.actuarial.isLate
                      ? `Retiring ${model.actuarial.diffYears} Year${model.actuarial.diffYears > 1 ? "s" : ""} Late (Enhanced)`
                      : `Normal Pension Age (Age ${npa})`}
                  </span>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {model.actuarial.isEarly
                      ? `GAD Actuarial Reduction: ${model.actuarial.percentChange}% applied to annual pension`
                      : model.actuarial.isLate
                      ? `GAD Late Retirement Uplift: +${model.actuarial.percentChange}% applied to annual pension`
                      : "100% full unreduced annual CARE pension"}
                  </p>
                </div>
              </div>
              <span className="font-extrabold text-sm shrink-0">
                {model.actuarial.isEarly
                  ? `${model.actuarial.percentChange}%`
                  : model.actuarial.isLate
                  ? `+${model.actuarial.percentChange}%`
                  : "0.0%"}
              </span>
            </div>
          </div>

          {/* Tax-Free Lump Sum Commutation Slider (£12 per £1) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <label htmlFor="pen-lump" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Tax-Free Lump Sum (£12 : £1 Commutation)
                </label>
                <span className="text-[11px] text-slate-500">
                  Exchange £1 annual pension for £12 tax-free cash (up to 25% HMRC limit)
                </span>
              </div>
              <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 shrink-0">
                {lumpSumPercent}% Max
              </span>
            </div>
            <input
              id="pen-lump"
              type="range"
              min={0}
              max={100}
              step={5}
              value={lumpSumPercent}
              onChange={(e) => setLumpSumPercent(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLumpSumPercent(0)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  lumpSumPercent === 0
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                £0 Lump Sum (Max Income)
              </button>
              <button
                type="button"
                onClick={() => setLumpSumPercent(50)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  lumpSumPercent === 50
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                50% Commutation
              </button>
              <button
                type="button"
                onClick={() => setLumpSumPercent(100)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  lumpSumPercent === 100
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                100% Max Cash
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Results & Output Bento */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Results Display */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#003087] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                2015 CARE Scheme • {withPension.pensionTierLabel} ({(withPension.pensionRate * 100).toFixed(1)}%)
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Retiring at Age {retireAge} ({serviceYears} Years Service)
              </span>
            </div>

            {/* Primary Metrics: Annual Pension vs. Tax-Free Lump Sum */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Guaranteed Annual Pension
                </p>
                <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                  {formatCurrency(Math.round(model.finalAnnualPension))}
                  <span className="text-sm font-bold text-emerald-200">/year</span>
                </p>
                <p className="text-xs text-slate-300 font-medium pt-1">
                  {formatCurrency(Math.round(model.finalMonthlyPension))}/month paid for life (CPI index-linked)
                </p>
                {model.actuarial.isEarly && (
                  <span className="inline-block mt-1 text-[11px] font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                    Includes {model.actuarial.percentChange}% GAD early penalty
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Tax-Free Cash Lump Sum
                </p>
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {formatCurrency(Math.round(model.chosenLumpSum))}
                </p>
                <p className="text-xs text-slate-300 font-medium pt-1">
                  {model.chosenLumpSum > 0
                    ? `Exchanged ${formatCurrency(Math.round(model.chosenAnnualSurrender))}/yr annual pension at 12:1`
                    : "No pension surrendered (£0 lump sum taken)"}
                </p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-purple-200 bg-purple-500/20 px-2 py-0.5 rounded">
                  100% Tax-Free under HMRC Rules
                </span>
              </div>
            </div>

            {/* Secondary Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
              <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1">
                <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  Yearly Pot Added
                </p>
                <p className="text-xl font-extrabold text-blue-300">
                  +{formatCurrency(Math.round(model.singleYearAccrual))}
                  <span className="text-xs font-bold text-blue-200">/yr</span>
                </p>
                <p className="text-[11px] text-slate-300">1/54th banked every year worked</p>
              </div>

              <div className="bg-emerald-500/10 rounded-2xl p-3.5 border border-emerald-400/20 space-y-1">
                <p className="text-emerald-300 font-semibold uppercase text-[10px] tracking-wider">
                  True Monthly Net Cost
                </p>
                <p className="text-xl font-extrabold text-emerald-400">
                  {formatCurrency(Math.round(model.trueMonthlyNetCost))}
                  <span className="text-xs font-bold text-emerald-200">/mo</span>
                </p>
                <p className="text-[11px] text-emerald-200">
                  Saves {formatCurrency(Math.round(model.monthlyTaxSaved))}/mo in PAYE tax!
                </p>
              </div>

              <div className="bg-blue-500/10 rounded-2xl p-3.5 border border-blue-400/20 space-y-1">
                <p className="text-blue-300 font-semibold uppercase text-[10px] tracking-wider">
                  NHS Employer Funded
                </p>
                <p className="text-xl font-extrabold text-blue-300">
                  +{formatCurrency(Math.round(model.employerMonthlyContribution))}
                  <span className="text-xs font-bold text-blue-200">/mo</span>
                </p>
                <p className="text-[11px] text-blue-200">+23.78% paid on top by Trust</p>
              </div>
            </div>

            {/* WhatsApp & Copy Breakdown Widget */}
            <div className="pt-2">
              <ShareBreakdownButton
                variant="dark"
                label="Share NHS Pension Breakdown"
                url="https://netpayscale.uk/pension-calculator/"
                shareText={`NHS ${band} 2015 CARE Pension Projection (${serviceYears} Yrs):\n• Guaranteed Annual Pension: ${formatCurrency(Math.round(model.finalAnnualPension))}/yr (${formatCurrency(Math.round(model.finalMonthlyPension))}/mo for life)\n• Tax-Free Cash Lump Sum: ${formatCurrency(Math.round(model.chosenLumpSum))}\n• Retiring at Age: ${retireAge} (NPA: ${npa}${model.actuarial.isEarly ? `, ${model.actuarial.percentChange}% reduction` : ""})\n• True Net Take-Home Cost: ${formatCurrency(Math.round(model.trueMonthlyNetCost))}/mo (after PAYE tax relief)\n• NHS Trust Contributes: ${formatCurrency(Math.round(model.employerMonthlyContribution))}/mo (+23.78%)\nCalculate yours: https://netpayscale.uk/pension-calculator/`}
              />
            </div>
          </div>

          {/* Lifetime Wealth & Family Protection Bento Grid */}
          <MagneticBentoContainer variant="2xl" className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: ROI Meter */}
              <div className="bento-card bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>20-Year Retirement Value</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {model.returnMultiple.toFixed(1)}x Return
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    {formatCurrency(Math.round(model.estimated20YrPayout))}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Total payout over 20 years in retirement ({formatCurrency(Math.round(model.chosenLumpSum))} lump sum + {formatCurrency(Math.round(model.finalAnnualPension * 20))} income) vs. <strong>{formatCurrency(Math.round(model.totalNetEmployeePaid))}</strong> total net contributions paid.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                  Every <strong>£1.00</strong> of net pay you contribute returns approx. <strong>£{model.returnMultiple.toFixed(2)}</strong> in guaranteed retirement wealth.
                </div>
              </div>

              {/* Card 2: Life Assurance & Family Protection */}
              <div className="bento-card bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                    <HeartHandshake className="w-4 h-4 text-[#005EB8]" />
                    <span>Family &amp; Life Assurance</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Active Member
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">Death-in-Service Lump Sum (2x Pay):</p>
                    <p className="text-xl font-black text-slate-900">
                      {formatCurrency(Math.round(model.deathInServiceLumpSum))}
                      <span className="text-xs font-semibold text-slate-500 ml-1">(Tax-free)</span>
                    </p>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Surviving Partner Pension (33.75%):</p>
                    <p className="text-base font-bold text-[#005EB8]">
                      {formatCurrency(Math.round(model.survivorAnnualPension))}/year for life
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Protects qualifying spouses, civil partners, and dependent children without medical underwriting.
                </p>
              </div>
            </div>
          </MagneticBentoContainer>
        </div>
      </div>
    </div>
  );
}
