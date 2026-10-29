export type LanguageCode =
  | "en" // English (UK)
  | "tl" // Tagalog / Filipino (Largest overseas NHS nurse cohort)
  | "hi" // Hindi / हिन्दी (Largest overall international NHS healthcare group)
  | "es" // Spanish / Español (European & Latin American clinical staff)
  | "pl" // Polish / Polski (Major European NHS workforce)
  | "cy" // Welsh / Cymraeg (Official NHS Wales / GIG Cymru bilingual language)
  | "pt" // Portuguese / Português (Portuguese & Brazilian healthcare staff)
  | "ar"; // Arabic / العربية (Middle East & North Africa medical staff)

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  community: string;
}

export interface TranslationDictionary {
  // Navigation & General
  siteTitle: string;
  circularTitle: string;
  payCalculator: string;
  bandHubs: string;
  pension: string;
  maternityPay: string;
  annualLeave: string;
  bankShift: string;
  sickPay: string;
  backPay: string;
  promotion: string;
  redundancy: string;
  taxYearLabel: string;
  ukWide: string;

  // Calculator Controls
  afcPayBand: string;
  afcSubtitle: string;
  experienceMilestones: string;
  entryStep: string;
  midStep: string;
  topStep: string;
  locationHcas: string;
  standardUK: string;
  fringeLondon: string;
  outerLondon: string;
  innerLondon: string;
  contractedHours: string;
  fullTimeHours: string;
  partTimeHours: string;
  unsocialHours: string;
  nightHours: string;
  sundayHours: string;
  rotaPreset: string;
  standardRota: string;
  acuteRota: string;
  daysOnly: string;
  pensionScheme: string;
  pensionActive: string;
  pensionOptOut: string;
  taxRegime: string;
  standardTaxCode: string;
  scottishTax: string;
  studentLoan: string;
  noStudentLoan: string;

  // Results & Payslip
  estimatedMonthlyTakeHome: string;
  annualTakeHome: string;
  basicSalary: string;
  totalGrossPay: string;
  netHourlyRate: string;
  netRetention: string;
  statutoryDeductions: string;
  incomeTax: string;
  nationalInsurance: string;
  pensionContribution: string;
  studentLoanDeduction: string;
  totalDeductions: string;
  esrPayslip: string;
  shareWhatsApp: string;
  copyFigures: string;
  printPayslip: string;
  pensionAccrualNotice: string;

  // International Support Note
  internationalBannerTitle: string;
  internationalBannerDesc: string;
}
