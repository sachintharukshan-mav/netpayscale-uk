"use client";

import React, { useState, useMemo } from "react";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay, CalculatorInputs } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";

type StudentLoanPlan = CalculatorInputs["studentLoan"];
type VehicleRateType = "standard-car" | "reserve-lease-car" | "motorcycle" | "cycle";

export function CarMileageCalculatorClient() {
  // Part 1: Salary Sacrifice Car State
  const [selectedBand, setSelectedBand] = useState<string>("Band 6");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [monthlyGrossSacrifice, setMonthlyGrossSacrifice] = useState<number>(450);
  const [p11dValue, setP11dValue] = useState<number>(38000);
  const [bikRatePct, setBikRatePct] = useState<number>(4); // 2026/27 EV BiK = 4%
  const [leaseYears, setLeaseYears] = useState<number>(3);
  const [isScottishTax, setIsScottishTax] = useState<boolean>(false);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>("none");

  // Part 2: Section 17 Mileage State
  const [vehicleType, setVehicleType] = useState<VehicleRateType>("standard-car");
  const [annualMiles, setAnnualMiles] = useState<number>(4500);
  const [heavyEquipment, setHeavyEquipment] = useState<boolean>(false);
  const [marginalTaxPct, setMarginalTaxPct] = useState<number>(20);

  const bandObj = useMemo(
    () => nhsData.bands.find((b) => b.band === selectedBand) || nhsData.bands[4],
    [selectedBand]
  );
  const safeStep = Math.min(stepIndex, bandObj.points.length - 1);

  // Salary Sacrifice Calculation
  const carCalc = useMemo(() => {
    const baseline = calculateNHSPay({
      band: selectedBand,
      stepIndex: safeStep,
      hcasZone: "standard",
      contractedHours: 37.5,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax,
      studentLoan,
    });

    const annualSacrifice = monthlyGrossSacrifice * 12;
    const grossBefore = baseline.grossPay.annual;
    const grossAfter = Math.max(0, grossBefore - annualSacrifice);

    // Post-sacrifice hourly rate vs National Minimum Wage (£12.71/hr threshold check)
    const postSacrificeHourly = grossAfter / 1955.36;
    const breachesNmw = postSacrificeHourly < 12.71;

    // Pension after sacrifice
    const tierAfter =
      nhsData.pensionTiers.find((t) => grossAfter <= t.max) ||
      nhsData.pensionTiers[nhsData.pensionTiers.length - 1];
    const pensionAfterAnnual = grossAfter * tierAfter.rate;
    const pensionSavedMonthly =
      (baseline.pensionContribution.annual - pensionAfterAnnual) / 12;

    // BiK taxable benefit added to taxable income for PAYE
    const annualBikTaxableValue = p11dValue * (bikRatePct / 100);
    const taxableAfter = Math.max(
      0,
      grossAfter - pensionAfterAnnual + annualBikTaxableValue
    );

    // Compute PAYE tax after sacrifice + BiK
    let pa = 12570;
    if (taxableAfter > 100000) {
      pa = Math.max(0, 12570 - (taxableAfter - 100000) / 2);
    }
    const abovePa = Math.max(0, taxableAfter - pa);
    let taxAfterAnnual = 0;
    if (isScottishTax) {
      const topSlice = Math.max(0, taxableAfter - 125140);
      const b1 = Math.min(abovePa, 2306);
      const b2 = Math.min(Math.max(0, abovePa - 2306), 11685);
      const b3 = Math.min(Math.max(0, abovePa - 2306 - 11685), 17101);
      const b4 = Math.min(Math.max(0, abovePa - 2306 - 11685 - 17101), 31338);
      const b5 = Math.max(0, abovePa - (b1 + b2 + b3 + b4) - topSlice);
      taxAfterAnnual =
        b1 * 0.19 +
        b2 * 0.2 +
        b3 * 0.21 +
        b4 * 0.42 +
        b5 * 0.45 +
        topSlice * 0.48;
    } else {
      const addSlice = Math.max(0, taxableAfter - 125140);
      const basicSlice = Math.min(abovePa, 37700);
      const higherSlice = Math.max(0, abovePa - basicSlice - addSlice);
      taxAfterAnnual =
        basicSlice * 0.2 + higherSlice * 0.4 + addSlice * 0.45;
    }
    const netTaxSavedMonthly =
      (baseline.incomeTax.annual - taxAfterAnnual) / 12;
    const monthlyBikTaxCost =
      (annualBikTaxableValue * (grossBefore > 50270 ? 0.4 : 0.2)) / 12;

    // Class 1 Employee NI after sacrifice (no Employee NI on BiK)
    let niAfterAnnual = 0;
    if (grossAfter > 12570) {
      const mainNi = Math.min(grossAfter, 50270) - 12570;
      const upperNi = Math.max(0, grossAfter - 50270);
      niAfterAnnual = mainNi * 0.08 + upperNi * 0.02;
    }
    const niSavedMonthly =
      (baseline.nationalInsurance.annual - niAfterAnnual) / 12;

    // Student Loan after sacrifice
    let slAfterAnnual = 0;
    if (studentLoan === "plan1" && grossAfter > 24990) {
      slAfterAnnual = (grossAfter - 24990) * 0.09;
    } else if (studentLoan === "plan2" && grossAfter > 27295) {
      slAfterAnnual = (grossAfter - 27295) * 0.09;
    } else if (studentLoan === "plan4" && grossAfter > 31395) {
      slAfterAnnual = (grossAfter - 31395) * 0.09;
    } else if (studentLoan === "plan5" && grossAfter > 25000) {
      slAfterAnnual = (grossAfter - 25000) * 0.09;
    } else if (studentLoan === "postgrad" && grossAfter > 21000) {
      slAfterAnnual = (grossAfter - 21000) * 0.06;
    }
    const slSavedMonthly =
      (baseline.studentLoanDeduction.annual - slAfterAnnual) / 12;

    const netAfterAnnual = Math.max(
      0,
      grossAfter - pensionAfterAnnual - taxAfterAnnual - niAfterAnnual - slAfterAnnual
    );
    const netAfterMonthly = netAfterAnnual / 12;
    const trueNetMonthlyCost = baseline.netPay.monthly - netAfterMonthly;
    const totalMonthlySaved = monthlyGrossSacrifice - trueNetMonthlyCost;

    // 1/54th CARE Pension Accrual Loss
    const annualAccrualLossPerYear = annualSacrifice / 54;
    const totalLeaseAccrualLossPerYear = annualAccrualLossPerYear * leaseYears;

    return {
      grossBefore,
      grossAfter,
      netBeforeMonthly: baseline.netPay.monthly,
      netAfterMonthly,
      trueNetMonthlyCost,
      totalMonthlySaved,
      netTaxSavedMonthly,
      monthlyBikTaxCost,
      niSavedMonthly,
      pensionSavedMonthly,
      slSavedMonthly,
      tierBefore: baseline.pensionTierLabel,
      tierAfter: tierAfter.percentageLabel,
      annualAccrualLossPerYear,
      totalLeaseAccrualLossPerYear,
      postSacrificeHourly,
      breachesNmw,
      discountPct:
        monthlyGrossSacrifice > 0
          ? Math.round((totalMonthlySaved / monthlyGrossSacrifice) * 100)
          : 0,
    };
  }, [
    selectedBand,
    safeStep,
    monthlyGrossSacrifice,
    p11dValue,
    bikRatePct,
    leaseYears,
    isScottishTax,
    studentLoan,
  ]);

  // Section 17 Mileage Calculation
  const mileageCalc = useMemo(() => {
    const first3500Miles = Math.min(annualMiles, 3500);
    const excessMiles = Math.max(0, annualMiles - 3500);
    const equipSuppRate = heavyEquipment ? 0.03 : 0;

    let baseReimbursement = 0;
    let firstTierAmount = 0;
    let secondTierAmount = 0;
    let taxableExcessMargin = 0;
    let marReliefShortfall = 0;

    if (vehicleType === "standard-car") {
      firstTierAmount = first3500Miles * 0.59;
      secondTierAmount = excessMiles * 0.24;
      baseReimbursement = firstTierAmount + secondTierAmount;
      // First 3,500 miles at 59p exceeds HMRC 45p AMAP by 14p/mile (+3p if equipment)
      taxableExcessMargin = first3500Miles * (0.14 + equipSuppRate);
      // Miles between 3,500 and 10,000 at 24p sit 21p/mile below HMRC 45p AMAP
      const marEligibleMiles = Math.min(excessMiles, 6500);
      marReliefShortfall = marEligibleMiles * Math.max(0, 0.21 - equipSuppRate);
    } else if (vehicleType === "reserve-lease-car") {
      firstTierAmount = annualMiles * 0.3;
      baseReimbursement = firstTierAmount;
      // 30p sits 15p/mile below HMRC 45p AMAP up to 10,000 miles
      const marEligibleMiles = Math.min(annualMiles, 10000);
      marReliefShortfall = marEligibleMiles * Math.max(0, 0.15 - equipSuppRate);
    } else if (vehicleType === "motorcycle") {
      firstTierAmount = annualMiles * 0.29;
      baseReimbursement = firstTierAmount;
      // HMRC motorcycle AMAP is 24p/mile, so 29p exceeds by 5p/mile
      taxableExcessMargin = annualMiles * (0.05 + equipSuppRate);
    } else {
      // Pedal cycle: 20p/mile (matches HMRC 20p cycle AMAP)
      firstTierAmount = annualMiles * 0.2;
      baseReimbursement = firstTierAmount;
      taxableExcessMargin = annualMiles * equipSuppRate;
    }

    const equipAmount = annualMiles * equipSuppRate;
    const totalGrossMileage = baseReimbursement + equipAmount;

    const taxRate = marginalTaxPct / 100;
    const niRate = marginalTaxPct >= 40 ? 0.02 : 0.08;
    const taxAndNiOnExcess = taxableExcessMargin * (taxRate + niRate);
    const p87TaxRefund = marReliefShortfall * taxRate;

    const netCashReimbursed = totalGrossMileage - taxAndNiOnExcess + p87TaxRefund;

    return {
      first3500Miles,
      excessMiles,
      firstTierAmount,
      secondTierAmount,
      equipAmount,
      totalGrossMileage,
      taxableExcessMargin,
      taxAndNiOnExcess,
      marReliefShortfall,
      p87TaxRefund,
      netCashReimbursed,
      effectiveNetPerMilePence:
        annualMiles > 0 ? Math.round((netCashReimbursed / annualMiles) * 1000) / 10 : 0,
    };
  }, [vehicleType, annualMiles, heavyEquipment, marginalTaxPct]);

  return (
    <div className="space-y-12">
      {/* SECTION 1: NHS Fleet EV Car Salary Sacrifice Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-950">
                1. NHS Fleet Solutions / EV Salary Sacrifice Car Calculator (2026/27)
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Calculate your real post-tax monthly lease cost, 4% EV Benefit-in-Kind (BiK), and 1/54th CARE pension trade-off
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
              Save {carCalc.discountPct}% via PAYE/NI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="car-band"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Your NHS Band
              </label>
              <select
                id="car-band"
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
                htmlFor="car-step"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Pay Step (2026/27)
              </label>
              <select
                id="car-step"
                value={safeStep}
                onChange={(e) => setStepIndex(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
              >
                {bandObj.points.map((pt, idx) => (
                  <option key={pt.step} value={idx}>
                    {pt.step} — {formatCurrency(pt.annualSalary)}/yr
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="car-gross-sacrifice"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Gross Monthly Lease Quote (£/mo)
              </label>
              <input
                id="car-gross-sacrifice"
                type="number"
                min={150}
                max={1500}
                step={10}
                value={monthlyGrossSacrifice}
                onChange={(e) =>
                  setMonthlyGrossSacrifice(Math.max(0, Number(e.target.value)))
                }
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-mono font-bold text-zinc-900"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Includes insurance, tyres, servicing &amp; breakdown
              </span>
            </div>

            <div>
              <label
                htmlFor="car-p11d"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Vehicle P11D List Price (£)
              </label>
              <input
                id="car-p11d"
                type="number"
                min={15000}
                max={100000}
                step={1000}
                value={p11dValue}
                onChange={(e) => setP11dValue(Math.max(10000, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-mono font-bold text-zinc-900"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Used by HMRC to calculate Benefit-in-Kind (BiK)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="car-bik"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
              >
                Vehicle CO2 &amp; BiK (2026/27)
              </label>
              <select
                id="car-bik"
                value={bikRatePct}
                onChange={(e) => setBikRatePct(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900"
              >
                <option value={4}>Pure Electric EV (4% BiK 2026/27)</option>
                <option value={5}>Pure Electric EV (5% BiK 2027/28)</option>
                <option value={9}>Plug-in Hybrid &lt;50g/km (9% BiK)</option>
                <option value={28}>Petrol / Diesel Car (28% BiK)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="car-term"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
              >
                Lease Term
              </label>
              <select
                id="car-term"
                value={leaseYears}
                onChange={(e) => setLeaseYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900"
              >
                <option value={2}>24 Months (2 Years)</option>
                <option value={3}>36 Months (3 Years)</option>
                <option value={4}>48 Months (4 Years)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="car-loan"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5"
              >
                Student Loan
              </label>
              <select
                id="car-loan"
                value={studentLoan}
                onChange={(e) => setStudentLoan(e.target.value as StudentLoanPlan)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-900"
              >
                <option value="none">No Student Loan</option>
                <option value="plan2">Plan 2 (9% Saved!)</option>
                <option value="plan5">Plan 5 (9% Saved!)</option>
                <option value="plan1">Plan 1 (9% Saved!)</option>
                <option value="plan4">Plan 4 Scotland (9%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Salary Sacrifice Output */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-[#003087] via-[#005EB8] to-[#0072CE] rounded-2xl p-6 sm:p-7 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Real Net Monthly Take-Home Cost
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white">
                Save {formatCurrency(Math.round(carCalc.totalMonthlySaved))}/mo
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono my-1 text-emerald-300">
              {formatCurrency(Math.round(carCalc.trueNetMonthlyCost))}/mo
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              A{" "}
              <strong className="text-white">
                {formatCurrency(monthlyGrossSacrifice)}/mo
              </strong>{" "}
              gross lease reduces your net bank pay from{" "}
              <strong className="text-white">
                {formatCurrency(Math.round(carCalc.netBeforeMonthly))}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {formatCurrency(Math.round(carCalc.netAfterMonthly))}/mo
              </strong>
              .
            </p>

            <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-[10px] text-blue-100 uppercase">
                  Tax + NI + Loan Saved
                </div>
                <div className="text-base font-extrabold font-mono mt-0.5 text-emerald-300">
                  −{formatCurrency(
                    Math.round(
                      carCalc.netTaxSavedMonthly +
                        carCalc.niSavedMonthly +
                        carCalc.slSavedMonthly
                    )
                  )}/mo
                </div>
                <div className="text-[10px] text-blue-200">
                  Incl. {bikRatePct}% BiK (+{formatCurrency(Math.round(carCalc.monthlyBikTaxCost))}/mo)
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-[10px] text-blue-100 uppercase">
                  1/54th Pension Impact ({leaseYears} yrs)
                </div>
                <div className="text-base font-extrabold font-mono mt-0.5 text-amber-300">
                  −{formatCurrency(Math.round(carCalc.totalLeaseAccrualLossPerYear))}/yr
                </div>
                <div className="text-[10px] text-blue-200">
                  −{formatCurrency(Math.round(carCalc.annualAccrualLossPerYear))}/yr per lease year
                </div>
              </div>
            </div>
          </div>

          {carCalc.breachesNmw && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-950 space-y-1">
              <div className="font-bold text-rose-900">
                ⛔ National Minimum Wage (NMW) Floor Breach ({formatHourlyRate(carCalc.postSacrificeHourly)})
              </div>
              <p>
                HMRC rules prohibit salary sacrifice from reducing your gross hourly pay below the National Minimum Wage floor (~£12.71/hr). Your NHS Trust will reject a {formatCurrency(monthlyGrossSacrifice)}/mo sacrifice on {selectedBand}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: NHS Section 17 Business Mileage Calculator (59p / 24p / 30p) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-950">
                2. NHS Section 17 Business Mileage &amp; HMRC P87 Calculator (59p / Mile)
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Calculates exact Section 17 mileage reimbursement (59p first 3,500 miles, 24p above) plus taxable excess &amp; P87 MAR tax relief
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-[#005EB8] border border-blue-200 self-start sm:self-auto">
              Section 17 Handbook
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="mileage-vehicle"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Section 17 Vehicle / Rate Category
              </label>
              <select
                id="mileage-vehicle"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleRateType)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
              >
                <option value="standard-car">
                  Private Car — Standard (59p &lt;3,500m / 24p &gt;3,500m)
                </option>
                <option value="reserve-lease-car">
                  NHS Lease Car / Reserve Rate (30p/mile all miles)
                </option>
                <option value="motorcycle">Motorcycle (29p/mile all miles)</option>
                <option value="cycle">Pedal Cycle (20p/mile all miles)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="mileage-miles"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Annual NHS Business Miles (1 Apr – 31 Mar)
              </label>
              <input
                id="mileage-miles"
                type="number"
                min={0}
                max={30000}
                step={100}
                value={annualMiles}
                onChange={(e) => setAnnualMiles(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-mono font-bold text-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                Heavy / Bulky Equipment (+3p/mile)
              </label>
              <button
                type="button"
                onClick={() => setHeavyEquipment(!heavyEquipment)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  heavyEquipment
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-zinc-50 text-zinc-700 border-zinc-300"
                }`}
              >
                {heavyEquipment
                  ? "✓ Carrying Heavy Equipment (+3p/mile added)"
                  : "Standard Journey (0p supplement)"}
              </button>
            </div>

            <div>
              <label
                htmlFor="mileage-tax-band"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2"
              >
                Your Marginal Income Tax Band
              </label>
              <select
                id="mileage-tax-band"
                value={marginalTaxPct}
                onChange={(e) => setMarginalTaxPct(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-semibold text-zinc-900"
              >
                <option value={20}>20% Basic Rate Taxpayer (Bands 2–6)</option>
                <option value={40}>40% Higher Rate Taxpayer (Band 7+)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Mileage Output */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-sm font-extrabold text-zinc-950 uppercase tracking-wider">
              Annual Mileage Reimbursement &amp; Tax Breakdown
            </h3>
            <span className="font-mono text-xs font-bold text-emerald-700">
              {mileageCalc.effectiveNetPerMilePence}p/mile net
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">
                First {mileageCalc.first3500Miles.toLocaleString("en-GB")} miles
              </span>
              <span className="font-bold text-zinc-900">
                {formatCurrency(Math.round(mileageCalc.firstTierAmount))}
              </span>
            </div>
            {vehicleType === "standard-car" && mileageCalc.excessMiles > 0 && (
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="font-sans text-zinc-600">
                  Excess {mileageCalc.excessMiles.toLocaleString("en-GB")} miles (@ 24p)
                </span>
                <span className="font-bold text-zinc-900">
                  {formatCurrency(Math.round(mileageCalc.secondTierAmount))}
                </span>
              </div>
            )}
            {heavyEquipment && (
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="font-sans text-zinc-600">
                  Heavy Equipment Supplement (+3p/m)
                </span>
                <span className="font-bold text-emerald-700">
                  +{formatCurrency(Math.round(mileageCalc.equipAmount))}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-zinc-100">
              <span className="font-sans text-zinc-600">
                Gross Section 17 Reimbursement
              </span>
              <span className="font-bold text-[#005EB8]">
                {formatCurrency(Math.round(mileageCalc.totalGrossMileage))}/yr
              </span>
            </div>
            {mileageCalc.taxAndNiOnExcess > 0 && (
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="font-sans text-zinc-600">
                  Tax &amp; NI on 14p Excess (&gt;45p HMRC AMAP)
                </span>
                <span className="text-rose-600 font-semibold">
                  −{formatCurrency(Math.round(mileageCalc.taxAndNiOnExcess))}
                </span>
              </div>
            )}
            {mileageCalc.p87TaxRefund > 0 && (
              <div className="flex justify-between py-1.5 border-b border-zinc-100">
                <span className="font-sans text-zinc-600">
                  HMRC P87 MAR Tax Relief Claimable (&lt;45p)
                </span>
                <span className="text-emerald-700 font-bold">
                  +{formatCurrency(Math.round(mileageCalc.p87TaxRefund))}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-sm font-extrabold text-emerald-700">
              <span className="font-sans">True Net Annual Reimbursement</span>
              <span>{formatCurrency(Math.round(mileageCalc.netCashReimbursed))}/yr</span>
            </div>
          </div>

          <ShareBreakdownButton
            shareText={`NHS Salary Sacrifice Car & Section 17 Mileage Calculator: A £${monthlyGrossSacrifice}/mo EV lease costs £${Math.round(carCalc.trueNetMonthlyCost)}/mo net, and ${annualMiles.toLocaleString("en-GB")} NHS business miles pays £${Math.round(mileageCalc.totalGrossMileage)}/yr:`}
            url="https://netpayscale.uk/salary-sacrifice-mileage-calculator/"
            variant="light"
            label="Share Car & Mileage Breakdown"
          />
        </div>
      </div>
    </div>
  );
}

export default CarMileageCalculatorClient;
