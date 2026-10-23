import nhsData from "@/data/nhs_afc_2026.json";

export interface CalculatorInputs {
  band: string;
  stepIndex: number;
  hcasZone: "inner-london" | "outer-london" | "fringe" | "standard";
  nightHoursPerWeek: number;
  sundayHoursPerWeek: number;
  pensionOptedOut: boolean;
  isScottishTax: boolean;
  studentLoan: "none" | "plan1" | "plan2" | "plan4" | "postgrad";
}

export interface PayBreakdownItem {
  annual: number;
  monthly: number;
  weekly: number;
}

export interface CalculationResult {
  // Gross components
  baseSalary: PayBreakdownItem;
  hourlyRate: number;
  hcasAmount: PayBreakdownItem;
  hcasPercentage: number;
  unsocialNightAmount: PayBreakdownItem;
  unsocialSundayAmount: PayBreakdownItem;
  totalUnsocialAmount: PayBreakdownItem;
  grossPay: PayBreakdownItem;

  // Deductions
  pensionContribution: PayBreakdownItem;
  pensionRate: number;
  pensionTierLabel: string;
  pensionTaxReliefAnnual: number;

  taxablePay: PayBreakdownItem;
  personalAllowance: number;
  incomeTax: PayBreakdownItem;
  nationalInsurance: PayBreakdownItem;
  studentLoanDeduction: PayBreakdownItem;
  totalDeductions: PayBreakdownItem;

  // Net Take-Home
  netPay: PayBreakdownItem;
  takeHomePercentage: number;
  effectiveTaxRate: number;

  // Visual Breakdown percentages (sum to 100)
  visualBreakdown: {
    netPercent: number;
    pensionPercent: number;
    taxPercent: number;
    niPercent: number;
    studentLoanPercent: number;
  };

  // Meta
  bandTitle: string;
  stepTitle: string;
  hcasName: string;
}

export function getBandDetails(bandName: string) {
  const found = nhsData.bands.find(
    (b) => b.band.toLowerCase() === bandName.toLowerCase() || b.slug.toLowerCase() === bandName.toLowerCase()
  );
  return found || nhsData.bands[3]; // default Band 5
}

export function calculateNHSPay(inputs: CalculatorInputs): CalculationResult {
  const bandData = getBandDetails(inputs.band);
  const stepIndex = Math.min(Math.max(0, inputs.stepIndex), bandData.points.length - 1);
  const selectedPoint = bandData.points[stepIndex];

  const baseAnnualSalary = selectedPoint.annualSalary;
  const baseHourlyRate = selectedPoint.hourlyRate;

  // 1. Calculate HCAS (London Weighting)
  let hcasAnnual = 0;
  let hcasPct = 0;
  const hcasZoneConfig = nhsData.hcasZones.find((z) => z.id === inputs.hcasZone) || nhsData.hcasZones[3];

  if (inputs.hcasZone === "inner-london") {
    hcasPct = 20;
    const raw = baseAnnualSalary * 0.20;
    hcasAnnual = Math.min(8746, Math.max(5794, raw));
  } else if (inputs.hcasZone === "outer-london") {
    hcasPct = 15;
    const raw = baseAnnualSalary * 0.15;
    hcasAnnual = Math.min(6137, Math.max(4870, raw));
  } else if (inputs.hcasZone === "fringe") {
    hcasPct = 5;
    const raw = baseAnnualSalary * 0.05;
    hcasAnnual = Math.min(2270, Math.max(1346, raw));
  }

  // 2. Unsocial Hours Enhancements (Section 2 Agenda for Change)
  // Bands 1-3 receive +44% (nights/Sats) and +88% (Sundays/BHs)
  // Bands 4-9 receive +30% (nights/Sats) and +60% (Sundays/BHs)
  const isLowerBand = ["Band 2", "Band 3"].includes(bandData.band);
  const nightRateUplift = isLowerBand ? 0.44 : 0.30;
  const sundayRateUplift = isLowerBand ? 0.88 : 0.60;

  const annualNightHours = inputs.nightHoursPerWeek * 52.14;
  const unsocialNightAnnual = annualNightHours * (baseHourlyRate * nightRateUplift);

  const annualSundayHours = inputs.sundayHoursPerWeek * 52.14;
  const unsocialSundayAnnual = annualSundayHours * (baseHourlyRate * sundayRateUplift);

  const totalUnsocialAnnual = unsocialNightAnnual + unsocialSundayAnnual;

  // Total Gross Pay
  const grossAnnual = baseAnnualSalary + hcasAnnual + totalUnsocialAnnual;

  // 3. NHS Pension Tiers
  let pensionAnnual = 0;
  let pensionRate = 0;
  let pensionTierLabel = "0%";

  if (!inputs.pensionOptedOut) {
    const tier = nhsData.pensionTiers.find(
      (t) => grossAnnual >= t.min && grossAnnual <= t.max
    ) || nhsData.pensionTiers[nhsData.pensionTiers.length - 1];

    pensionRate = tier.rate;
    pensionTierLabel = tier.percentageLabel;
    pensionAnnual = grossAnnual * pensionRate;
  }

  // 4. Taxable Pay (Net Pay arrangement deducts pension pre-tax)
  const taxableAnnual = Math.max(0, grossAnnual - pensionAnnual);

  // 5. Personal Allowance (with £100,000 taper trap)
  let personalAllowance = 12570;
  if (taxableAnnual > 100000) {
    const excess = taxableAnnual - 100000;
    personalAllowance = Math.max(0, 12570 - excess / 2);
  }

  // 6. UK Income Tax Calculation
  let incomeTaxAnnual = 0;
  const taxableAboveAllowance = Math.max(0, taxableAnnual - personalAllowance);

  if (inputs.isScottishTax) {
    // Scottish Tax Bands 2026/27
    // Starter: 19% on £1 - £2,306
    // Basic: 20% on £2,307 - £13,991 (next £11,685)
    // Intermediate: 21% on £13,992 - £31,092 (next £17,101)
    // Higher: 42% on £31,093 - £62,430 (next £31,338)
    // Advanced: 45% on £62,431 - £112,570 (next £50,140)
    // Top: 48% over £112,570 above allowance
    let rem = taxableAboveAllowance;

    const b1 = Math.min(rem, 2306);
    incomeTaxAnnual += b1 * 0.19;
    rem = Math.max(0, rem - 2306);

    const b2 = Math.min(rem, 11685);
    incomeTaxAnnual += b2 * 0.20;
    rem = Math.max(0, rem - 11685);

    const b3 = Math.min(rem, 17101);
    incomeTaxAnnual += b3 * 0.21;
    rem = Math.max(0, rem - 17101);

    const b4 = Math.min(rem, 31338);
    incomeTaxAnnual += b4 * 0.42;
    rem = Math.max(0, rem - 31338);

    const b5 = Math.min(rem, 50140);
    incomeTaxAnnual += b5 * 0.45;
    rem = Math.max(0, rem - 50140);

    if (rem > 0) {
      incomeTaxAnnual += rem * 0.48;
    }
  } else {
    // Rest of UK (England, Wales, NI)
    // Basic Rate: 20% on up to £37,700 (£12,570 to £50,270)
    const basicBandSize = 37700;
    const basicTaxable = Math.min(taxableAboveAllowance, basicBandSize);
    incomeTaxAnnual += basicTaxable * 0.20;

    // Higher Rate: 40% on next £74,870 (£50,270 to £125,140)
    const higherBandSize = 74870;
    const higherTaxable = Math.min(
      Math.max(0, taxableAboveAllowance - basicBandSize),
      higherBandSize
    );
    incomeTaxAnnual += higherTaxable * 0.40;

    // Additional Rate: 45% on excess over £125,140
    const additionalTaxable = Math.max(
      0,
      taxableAboveAllowance - basicBandSize - higherBandSize
    );
    incomeTaxAnnual += additionalTaxable * 0.45;
  }

  // Pension Tax Relief estimation: (tax without pension - tax with pension)
  const taxableWithoutPension = Math.max(0, grossAnnual - personalAllowance);
  const basicWithout = Math.min(taxableWithoutPension, 37700);
  const higherWithout = Math.min(Math.max(0, taxableWithoutPension - 37700), 74870);
  const addWithout = Math.max(0, taxableWithoutPension - 37700 - 74870);
  const taxWithoutPension = basicWithout * 0.20 + higherWithout * 0.40 + addWithout * 0.45;
  const pensionTaxReliefAnnual = Math.max(0, taxWithoutPension - incomeTaxAnnual);

  // 7. National Insurance (Class 1 Employee - 2026/27)
  const ptAnnual = 12570;
  const uelAnnual = 50270;
  let niAnnual = 0;

  if (grossAnnual > ptAnnual) {
    const mainNiEarnings = Math.min(grossAnnual, uelAnnual) - ptAnnual;
    niAnnual += mainNiEarnings * 0.08;

    if (grossAnnual > uelAnnual) {
      const upperNiEarnings = grossAnnual - uelAnnual;
      niAnnual += upperNiEarnings * 0.02;
    }
  }

  // 8. Student Loan Repayments
  let studentLoanAnnual = 0;
  if (inputs.studentLoan === "plan1" && grossAnnual > 24990) {
    studentLoanAnnual = (grossAnnual - 24990) * 0.09;
  } else if (inputs.studentLoan === "plan2" && grossAnnual > 27295) {
    studentLoanAnnual = (grossAnnual - 27295) * 0.09;
  } else if (inputs.studentLoan === "plan4" && grossAnnual > 31395) {
    studentLoanAnnual = (grossAnnual - 31395) * 0.09;
  } else if (inputs.studentLoan === "postgrad" && grossAnnual > 21000) {
    studentLoanAnnual = (grossAnnual - 21000) * 0.06;
  }

  // 9. Total Deductions & Net Take-Home Pay
  const totalDeductionsAnnual = pensionAnnual + incomeTaxAnnual + niAnnual + studentLoanAnnual;
  const netAnnual = Math.max(0, grossAnnual - totalDeductionsAnnual);

  const makeBreakdown = (annual: number): PayBreakdownItem => ({
    annual: Math.round(annual * 100) / 100,
    monthly: Math.round((annual / 12) * 100) / 100,
    weekly: Math.round((annual / 52) * 100) / 100,
  });

  const takeHomePercentage = grossAnnual > 0 ? (netAnnual / grossAnnual) * 100 : 0;
  const effectiveTaxRate = grossAnnual > 0 ? ((incomeTaxAnnual + niAnnual) / grossAnnual) * 100 : 0;

  // Visual breakdown calculation
  const netPercent = grossAnnual > 0 ? (netAnnual / grossAnnual) * 100 : 100;
  const pensionPercent = grossAnnual > 0 ? (pensionAnnual / grossAnnual) * 100 : 0;
  const taxPercent = grossAnnual > 0 ? (incomeTaxAnnual / grossAnnual) * 100 : 0;
  const niPercent = grossAnnual > 0 ? (niAnnual / grossAnnual) * 100 : 0;
  const studentLoanPercent = grossAnnual > 0 ? (studentLoanAnnual / grossAnnual) * 100 : 0;

  return {
    baseSalary: makeBreakdown(baseAnnualSalary),
    hourlyRate: baseHourlyRate,
    hcasAmount: makeBreakdown(hcasAnnual),
    hcasPercentage: hcasPct,
    unsocialNightAmount: makeBreakdown(unsocialNightAnnual),
    unsocialSundayAmount: makeBreakdown(unsocialSundayAnnual),
    totalUnsocialAmount: makeBreakdown(totalUnsocialAnnual),
    grossPay: makeBreakdown(grossAnnual),

    pensionContribution: makeBreakdown(pensionAnnual),
    pensionRate,
    pensionTierLabel,
    pensionTaxReliefAnnual: Math.round(pensionTaxReliefAnnual * 100) / 100,

    taxablePay: makeBreakdown(taxableAnnual),
    personalAllowance: Math.round(personalAllowance),
    incomeTax: makeBreakdown(incomeTaxAnnual),
    nationalInsurance: makeBreakdown(niAnnual),
    studentLoanDeduction: makeBreakdown(studentLoanAnnual),
    totalDeductions: makeBreakdown(totalDeductionsAnnual),

    netPay: makeBreakdown(netAnnual),
    takeHomePercentage: Math.round(takeHomePercentage * 10) / 10,
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,

    visualBreakdown: {
      netPercent: Math.round(netPercent * 10) / 10,
      pensionPercent: Math.round(pensionPercent * 10) / 10,
      taxPercent: Math.round(taxPercent * 10) / 10,
      niPercent: Math.round(niPercent * 10) / 10,
      studentLoanPercent: Math.round(studentLoanPercent * 10) / 10,
    },

    bandTitle: bandData.band,
    stepTitle: selectedPoint.step,
    hcasName: hcasZoneConfig.name,
  };
}
