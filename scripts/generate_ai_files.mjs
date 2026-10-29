import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "nhs_afc_2026.json");
const PUBLIC_DIR = path.join(ROOT, "public");
const nhsData = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

const SITE = {
  name: "NetPayScale UK (NHS Edition)",
  shortName: "NetPayScale UK",
  url: "https://netpayscale.uk",
  description:
    "Official 2026/27 UK NHS Salary & Pension Calculator for 1.3M+ Agenda for Change healthcare staff. Computes net take-home pay, 3.3% AfC pay steps, London Weighting (HCAS), NHS 2015 CARE Pension tiers, Section 2 unsocial hours, Maternity Pay (OMP/SMP), Sick Pay, and Annual Leave.",
  contact: "editorial@netpayscale.uk",
  updated: "2026-10-26",
};

function fmtGBP(val) {
  return "£" + Math.round(val).toLocaleString("en-GB");
}

function getPensionRate(annualSalary) {
  for (const tier of nhsData.pensionTiers) {
    if (tier.max === null || annualSalary <= tier.max) {
      return tier.rate;
    }
  }
  return 0.125;
}

function calculateHcas(baseSalary, region, fte = 1) {
  if (region === "none" || region === "standard") return 0;
  const zoneId =
    region === "inner"
      ? "inner-london"
      : region === "outer"
      ? "outer-london"
      : region === "fringe"
      ? "fringe"
      : region;
  const rule = nhsData.hcasZones.find((z) => z.id === zoneId);
  if (!rule) return 0;
  const raw = baseSalary * (rule.percentage / 100);
  const clamped = Math.max(rule.min, Math.min(rule.max, raw));
  return clamped * fte;
}

function calculateNet(annualBase, opts = {}) {
  const {
    fte = 1,
    hcasRegion = "none",
    scotland = false,
    optOutPension = false,
    nightHoursPerWeek = 0,
    bandSlug = "band-5",
  } = opts;

  const proRataBase = annualBase * fte;
  const hcas = calculateHcas(annualBase, hcasRegion, fte);
  const hourly = annualBase / 1955.357;
  const nightMult = bandSlug === "band-2" || bandSlug === "band-3" ? 0.44 : 0.30;
  const unsocialAnnual = nightHoursPerWeek * 52.143 * hourly * nightMult;

  const grossTotal = proRataBase + hcas + unsocialAnnual;
  const pensionablePay = proRataBase + hcas;
  const pensionRate = optOutPension ? 0 : getPensionRate(annualBase);
  const pensionAnnual = pensionablePay * pensionRate;

  const adjustedNetIncome = Math.max(0, grossTotal - pensionAnnual);
  let personalAllowance = 12570;
  if (adjustedNetIncome > 100000) {
    const loss = Math.min(personalAllowance, Math.floor((adjustedNetIncome - 100000) / 2));
    personalAllowance -= loss;
  }

  const taxable = Math.max(0, adjustedNetIncome - personalAllowance);
  let tax = 0;

  if (!scotland) {
    const b1 = Math.min(taxable, 37700);
    const b2 = Math.max(0, Math.min(taxable - 37700, 125140 - 50270));
    const b3 = Math.max(0, taxable - (125140 - 12570));
    tax = b1 * 0.2 + b2 * 0.4 + b3 * 0.45;
  } else {
    const sBands = [
      { width: 2306, rate: 0.19 },
      { width: 11685, rate: 0.20 },
      { width: 17101, rate: 0.21 },
      { width: 31338, rate: 0.42 },
      { width: 50140, rate: 0.45 },
      { width: Infinity, rate: 0.48 },
    ];
    let rem = taxable;
    for (const sb of sBands) {
      if (rem <= 0) break;
      const slice = Math.min(rem, sb.width);
      tax += slice * sb.rate;
      rem -= slice;
    }
  }

  let ni = 0;
  if (grossTotal > 12570) {
    const niBasic = Math.min(grossTotal, 50270) - 12570;
    const niUpper = Math.max(0, grossTotal - 50270);
    ni = niBasic * 0.08 + niUpper * 0.02;
  }

  const netAnnual = grossTotal - pensionAnnual - tax - ni;
  return {
    grossAnnual: Math.round(grossTotal),
    grossMonthly: Math.round(grossTotal / 12),
    hcasAnnual: Math.round(hcas),
    pensionRate: +(pensionRate * 100).toFixed(1),
    pensionMonthly: Math.round(pensionAnnual / 12),
    taxMonthly: Math.round(tax / 12),
    niMonthly: Math.round(ni / 12),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netAnnual / 12),
    hourly: +hourly.toFixed(2),
  };
}

// ---------------------------------------------------------------------------
// 1. Markdown Page Generators
// ---------------------------------------------------------------------------
function renderHomeMd() {
  const bandRows = nhsData.bands
    .map((b) => {
      const entry = b.points[0];
      const top = b.points[b.points.length - 1];
      const entryCalc = calculateNet(entry.annualSalary, { bandSlug: b.slug });
      const topCalc = calculateNet(top.annualSalary, { bandSlug: b.slug });
      const innerCalc = calculateNet(entry.annualSalary, { bandSlug: b.slug, hcasRegion: "inner" });
      return `| [${b.band}](${SITE.url}/bands/${b.slug}/) | ${fmtGBP(entry.annualSalary)} (${fmtGBP(entryCalc.netMonthly)}/mo net) | ${fmtGBP(top.annualSalary)} (${fmtGBP(topCalc.netMonthly)}/mo net) | £${entry.hourlyRate.toFixed(2)} – £${top.hourlyRate.toFixed(2)}/hr | ${entryCalc.pensionRate}% | ${fmtGBP(innerCalc.netMonthly)}/mo |`;
    })
    .join("\n");

  const pensionRows = nhsData.pensionTiers
    .map((t, idx) => {
      const range =
        t.max && t.max < 9000000
          ? `${fmtGBP(t.min)} – ${fmtGBP(t.max)}`
          : `${fmtGBP(t.min)}+`;
      return `| Tier ${idx + 1} | ${range} | ${(t.rate * 100).toFixed(1)}% | 23.7% |`;
    })
    .join("\n");

  return `# ${SITE.name} — 2026/27 Official Agenda for Change Take-Home Pay Reference

> ${SITE.description}

Canonical: ${SITE.url}/
Last updated: ${SITE.updated}

## Summary of 2026/27 Statutory NHS Pay Rules
- **Agenda for Change Pay Uplift (Effective 1 April 2026):** Confirmed **3.3% consolidated increase** across all Bands 2 to 9, with the Band 2 single spine point set at **£25,272/yr (£12.92/hr)** and Band 5 entry at **£32,073/yr (£16.40/hr)**.
- **Standard Full-Time Contract (1.0 FTE):** **37.5 hours/week** (1,955.36 hours/year; 52.143 weeks/year).
- **Income Tax (England, Wales & NI 2026/27):** £12,570 Personal Allowance (0%), 20% Basic Rate (£12,571–£50,270), 40% Higher Rate (£50,271–£125,140), 45% Additional Rate (>£125,140). Personal Allowance tapers by £1 for every £2 of adjusted net income above £100,000.
- **Employee Class 1 National Insurance (2026/27):** 8% between £12,570 and £50,270/yr; 2% above £50,270/yr.
- **High Cost Area Supplement (HCAS London Weighting 2026/27):**
  - **Inner London (20% of base):** Minimum **£5,794/yr** | Maximum **£8,746/yr**
  - **Outer London (15% of base):** Minimum **£4,870/yr** | Maximum **£6,137/yr**
  - **London Fringe (5% of base):** Minimum **£1,346/yr** | Maximum **£2,270/yr**

## 2026/27 NHS Agenda for Change Pay Scales & Monthly Net Take-Home Table (Bands 2 to 9)

| NHS Band | Entry Gross (Monthly Net) | Top Step Gross (Monthly Net) | Hourly Rate Range | Entry Pension Tier | Inner London Entry Net/Mo |
| :--- | :--- | :--- | :--- | :--- | :--- |
${bandRows}

## 2026/27 NHS Pension Scheme (2015 CARE) Employee & Employer Contribution Tiers

| Tier | Whole-Time Equivalent Pensionable Pay (2026/27) | Employee Contribution Rate | Employer Contribution Rate |
| :--- | :--- | :--- | :--- |
${pensionRows}

## Frequently Asked Questions

### How is NHS net take-home pay calculated in 2026/27?
NHS net pay is calculated by taking your gross Agenda for Change salary (plus pensionable HCAS London Weighting and any non-pensionable unsocial hours), deducting your 2015 CARE NHS Pension contribution first under the Net-Pay Arrangement, and then applying HMRC PAYE Income Tax and Class 1 Employee National Insurance (8% / 2%).

### What is the 2026/27 Band 5 Nurse starting salary and monthly take-home pay?
In 2026/27, a Band 5 Nurse in England starts on **£32,073 gross per year** (£16.40/hr). After an 8.3% NHS Pension contribution (£222/mo), Income Tax (£288/mo), and National Insurance (£130/mo), the standard monthly net take-home pay outside London is **£2,033 per month** (or **£2,367/month** in Inner London with 20% HCAS).

## Related Calculators & Guides
- [NHS Take-Home Pay Calculator](${SITE.url}/)
- [NHS Pension Calculator (2015 CARE Scheme)](${SITE.url}/pension-calculator/)
- [NHS Sick Pay & Half-Pay Calculator](${SITE.url}/sick-pay-calculator/)
- [NHS Maternity Pay (OMP + SMP) Calculator](${SITE.url}/maternity-pay-calculator/)
- [NHS Annual Leave & Pro-Rata Holiday Calculator](${SITE.url}/annual-leave-calculator/)
- [NHS Bank Shift, Overtime & Section 2 Unsocial Hours Calculator](${SITE.url}/bank-shift-calculator/)
`;
}

function renderPensionMd() {
  const tierRows = nhsData.pensionTiers
    .map((t, i) => {
      const range =
        t.max && t.max < 9000000
          ? `${fmtGBP(t.min)} – ${fmtGBP(t.max)}`
          : `${fmtGBP(t.min)}+`;
      return `| Tier ${i + 1} | ${range} | ${(t.rate * 100).toFixed(1)}% | 23.7% | 1/54th of pensionable pay |`;
    })
    .join("\n");

  const bandExamples = nhsData.bands
    .map((b) => {
      const sal = b.points[0].annualSalary;
      const rate = getPensionRate(sal);
      const grossMo = Math.round((sal * rate) / 12);
      const taxReliefRate = sal > 50270 ? 0.4 : 0.2;
      const netCostMo = Math.round(grossMo * (1 - taxReliefRate));
      const employerMo = Math.round((sal * 0.237) / 12);
      const annualAccrual = Math.round(sal / 54);
      return `| ${b.band} Entry (${fmtGBP(sal)}) | ${(rate * 100).toFixed(1)}% | ${fmtGBP(grossMo)}/mo | ${fmtGBP(netCostMo)}/mo (${taxReliefRate * 100}% relief) | ${fmtGBP(employerMo)}/mo | +${fmtGBP(annualAccrual)}/yr for life |`;
    })
    .join("\n");

  return `# NHS Pension Calculator 2026/27 — 2015 CARE Scheme Tiers, Tax Relief & Annual Accrual

> Calculate your exact 2026/27 NHS Pension monthly cost after PAYE tax relief, 23.7% employer contribution, and 1/54th guaranteed annual CARE pension accrual.

Canonical: ${SITE.url}/pension-calculator/
Last updated: ${SITE.updated}

## 2026/27 NHS Pension Scheme Mechanics (2015 CARE Section)
- **Accrual Rate:** **1/54th (1.85%)** of your pensionable earnings each scheme year is added to your guaranteed annual pension pot for life.
- **In-Service Revaluation:** Revalued every April by **CPI inflation + 1.5%** (Treasury Order).
- **Employer Contribution:** Your NHS Trust contributes **23.7%** of your pensionable pay on top of your own contribution.
- **Net-Pay Tax Relief:** Employee contributions are deducted from gross pay *before* PAYE Income Tax, granting automatic 20%, 40%, or 45% tax relief at source.
- **Part-Time Tier Rule:** Your contribution tier percentage is determined by your **whole-time equivalent (1.0 FTE)** salary, then applied to your actual pro-rata pensionable earnings.

## 2026/27 NHS Pension Employee Contribution Tiers

| Tier | Whole-Time Equivalent Pensionable Pay | Employee Rate | Employer Rate | Annual CARE Accrual |
| :--- | :--- | :--- | :--- | :--- |
${tierRows}

## Band-by-Band Monthly Pension Cost vs. Guaranteed Retirement Accrual (2026/27)

| Band & Entry Salary | Tier Rate | Gross Monthly Deduction | True Net Cost After Tax Relief | NHS Employer 23.7% Deposit | Annual Pension Added Per Year Worked |
| :--- | :--- | :--- | :--- | :--- | :--- |
${bandExamples}

## Related
- [NHS Pension Calculator (Interactive HTML)](${SITE.url}/pension-calculator/)
- [NHS Salary & Take-Home Calculator](${SITE.url}/)
- [NHS Sick Pay Calculator](${SITE.url}/sick-pay-calculator/)
`;
}

function renderSickPayMd() {
  const bandRows = nhsData.bands
    .map((b) => {
      const sal = b.points[0].annualSalary;
      const fullPay = calculateNet(sal, { bandSlug: b.slug });
      const cappedGross = Math.min(sal, sal * 0.5 + 118.75 * 52.143);
      const halfCalc = calculateNet(cappedGross, { bandSlug: b.slug });
      return `| ${b.band} Entry (${fmtGBP(sal)}) | ${fmtGBP(fullPay.netMonthly)}/mo | ${fmtGBP(halfCalc.netMonthly)}/mo | -${fmtGBP(fullPay.netMonthly - halfCalc.netMonthly)}/mo |`;
    })
    .join("\n");

  return `# NHS Sick Pay Calculator 2026/27 — Section 14 Full Pay, Half Pay & SSP Take-Home

> Calculate your exact 2026/27 NHS Occupational Sick Pay entitlement by years of continuous NHS service, plus net monthly take-home during Full Pay and Half Pay + Statutory Sick Pay (SSP).

Canonical: ${SITE.url}/sick-pay-calculator/
Last updated: ${SITE.updated}

## NHS Terms & Conditions Handbook (Section 14) Sick Pay Entitlement Table

| Continuous NHS Service | Full Pay Entitlement (100% Gross) | Half Pay Entitlement (50% Gross + SSP) | Combined Protected Window |
| :--- | :--- | :--- | :--- |
| During 1st year of service | **1 month** | **2 months** | 3 months |
| During 2nd year of service | **2 months** | **2 months** | 4 months |
| During 3rd year of service | **4 months** | **4 months** | 8 months |
| During 4th and 5th years | **5 months** | **5 months** | 10 months |
| After 5 years completed service | **6 months** | **6 months** | 12 months |

## Statutory Sick Pay (SSP) Integration Rules (2026/27)
- **2026/27 Statutory Sick Pay (SSP) Rate:** **£118.75 per week** (~£514.58/month), payable for up to 28 weeks.
- **Full Pay Phase:** 100% of normal basic salary + HCAS + regularly scheduled unsocial hours enhancements (inclusive of SSP).
- **Half Pay Phase:** 50% of normal salary **plus** £118.75/wk SSP, capped so that total gross pay does not exceed 100% normal full pay.

## 2026/27 Full Pay vs. Half Pay + SSP Monthly Net Take-Home by Band

| Band & Entry Salary | Full Pay Net/Month | Half Pay + SSP Net/Month | Monthly Net Drop on Half Pay |
| :--- | :--- | :--- | :--- |
${bandRows}

## Related
- [NHS Sick Pay Calculator (Interactive HTML)](${SITE.url}/sick-pay-calculator/)
- [NHS Maternity Pay Calculator](${SITE.url}/maternity-pay-calculator/)
- [NHS Take-Home Pay Calculator](${SITE.url}/)
`;
}

function renderMaternityMd() {
  const bandRows = nhsData.bands
    .map((b) => {
      const sal = b.points[0].annualSalary;
      const wkGross = sal / 52.143;
      const smp = 187.18;
      const wk1_8 = wkGross * 8;
      const wk9_26 = Math.min(wkGross, wkGross * 0.5 + smp) * 18;
      const wk27_39 = Math.min(wkGross * 0.9, smp) * 13;
      const totalGross52 = wk1_8 + wk9_26 + wk27_39;
      const avgMoGross = Math.round(totalGross52 / 12);
      const calcSpread = calculateNet(totalGross52, { bandSlug: b.slug });
      return `| ${b.band} Entry (${fmtGBP(sal)}) | ${fmtGBP(totalGross52)} | ${fmtGBP(avgMoGross)}/mo | ${fmtGBP(calcSpread.netMonthly)}/mo |`;
    })
    .join("\n");

  return `# NHS Maternity Pay Calculator 2026/27 — Section 15 OMP & SMP 52-Week Breakdown

> Calculate your 2026/27 NHS Occupational Maternity Pay (OMP), Statutory Maternity Pay (SMP £187.18/wk), Equal Monthly Spread option, and Holiday Accrual across all 52 weeks.

Canonical: ${SITE.url}/maternity-pay-calculator/
Last updated: ${SITE.updated}

## 2026/27 NHS Occupational Maternity Pay (OMP) 4-Phase Timeline
To qualify for NHS Occupational Maternity Pay (Section 15), you must have **12 months of continuous NHS service** by the beginning of the 11th week before your Expected Week of Childbirth (EWC) and commit to returning to NHS employment for at least 3 months:

1. **Weeks 1 to 8 (8 Weeks):** **100% Full Pay** (inclusive of SMP).
2. **Weeks 9 to 26 (18 Weeks):** **50% Half Pay + Statutory Maternity Pay (£187.18/week)**, capped at 100% normal full pay.
3. **Weeks 27 to 39 (13 Weeks):** **Statutory Maternity Pay (£187.18/week)** (or 90% of average weekly earnings if lower).
4. **Weeks 40 to 52 (13 Weeks):** **Unpaid Maternity Leave** (many staff use accrued annual leave + 8 bank holidays to bridge this phase on 100% full pay).

## 2026/27 Total 52-Week Maternity Pay & Equal Monthly Spread by Band

| Band & Entry Salary | Total 52-Week Gross OMP+SMP | Equal Monthly Spread (Gross) | Equal Monthly Spread (Estimated Net/Mo) |
| :--- | :--- | :--- | :--- |
${bandRows}

## Related
- [NHS Maternity Pay Calculator (Interactive HTML)](${SITE.url}/maternity-pay-calculator/)
- [NHS Annual Leave Calculator](${SITE.url}/annual-leave-calculator/)
- [NHS Salary Calculator](${SITE.url}/)
`;
}

function renderAnnualLeaveMd() {
  return `# NHS Annual Leave Calculator 2026/27 — Section 13 Pro-Rata Hours & Bank Holiday Entitlement

> Convert your 2026/27 NHS Annual Leave and 8 Public Bank Holidays into exact working hours or days based on years of NHS service (0–4 yrs, 5–9 yrs, 10+ yrs), weekly contract hours, and shift length.

Canonical: ${SITE.url}/annual-leave-calculator/
Last updated: ${SITE.updated}

## 2026/27 NHS Agenda for Change Annual Leave Tiers (Section 13)

| Reckonable NHS Service | Annual Leave Days (1.0 FTE) | Bank Holidays (1.0 FTE) | Combined Total Days | Total Annual Hours (at 37.5h/wk) | 12.5-Hour Long Shifts Equivalent |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0 to 4 Years Service** | 27 days (202.5 hrs) | 8 days (60.0 hrs) | **35 days** | **262.5 hours** | 21.0 shifts |
| **5 to 9 Years Service** | 29 days (217.5 hrs) | 8 days (60.0 hrs) | **37 days** | **277.5 hours** | 22.2 shifts |
| **10+ Years Service** | 33 days (247.5 hrs) | 8 days (60.0 hrs) | **41 days** | **307.5 hours** | 24.6 shifts |

## Part-Time Pro-Rata NHS Holiday Hours Matrix (Leave + Bank Holidays Combined)

| Weekly Contracted Hours (FTE) | 0–4 Years Service | 5–9 Years Service | 10+ Years Service |
| :--- | :--- | :--- | :--- |
| **37.5 hrs/wk (1.00 FTE)** | 262.5 hrs (202.5 AL + 60.0 BH) | 277.5 hrs (217.5 AL + 60.0 BH) | 307.5 hrs (247.5 AL + 60.0 BH) |
| **30.0 hrs/wk (0.80 FTE)** | 210.0 hrs (162.0 AL + 48.0 BH) | 222.0 hrs (174.0 AL + 48.0 BH) | 246.0 hrs (198.0 AL + 48.0 BH) |
| **22.5 hrs/wk (0.60 FTE)** | 157.5 hrs (121.5 AL + 36.0 BH) | 166.5 hrs (130.5 AL + 36.0 BH) | 184.5 hrs (148.5 AL + 36.0 BH) |
| **18.75 hrs/wk (0.50 FTE)** | 131.25 hrs (101.25 AL + 30.0 BH) | 138.75 hrs (108.75 AL + 30.0 BH) | 153.75 hrs (123.75 AL + 30.0 BH) |
| **15.0 hrs/wk (0.40 FTE)** | 105.0 hrs (81.0 AL + 24.0 BH) | 111.0 hrs (87.0 AL + 24.0 BH) | 123.0 hrs (99.0 AL + 24.0 BH) |

## Related
- [NHS Annual Leave Calculator (Interactive HTML)](${SITE.url}/annual-leave-calculator/)
- [NHS Maternity Pay Calculator](${SITE.url}/maternity-pay-calculator/)
- [NHS Salary Calculator](${SITE.url}/)
`;
}

function renderBankShiftMd() {
  const bandRows = nhsData.bands
    .map((b) => {
      const sal = b.points[0].annualSalary;
      const baseHr = +(sal / 1955.357).toFixed(2);
      const nightMult = b.slug === "band-2" || b.slug === "band-3" ? 1.44 : 1.30;
      const sunMult = b.slug === "band-2" || b.slug === "band-3" ? 1.88 : 1.60;
      const nightHr = (baseHr * nightMult).toFixed(2);
      const sunHr = (baseHr * sunMult).toFixed(2);
      const wtdDayShift = (baseHr * 11.5 * 1.1207).toFixed(2);
      const wtdSunShift = (baseHr * sunMult * 11.5 * 1.1207).toFixed(2);
      return `| ${b.band} Entry (${fmtGBP(sal)}) | £${baseHr.toFixed(2)}/hr | £${nightHr}/hr (+${Math.round((nightMult - 1) * 100)}%) | £${sunHr}/hr (+${Math.round((sunMult - 1) * 100)}%) | £${wtdDayShift} | £${wtdSunShift} |`;
    })
    .join("\n");

  return `# NHS Bank Shift & Overtime Calculator 2026/27 — Section 2 Unsocial Hours & Net Shift Pay

> Calculate your real 2026/27 NHS Bank Shift or Overtime take-home pay after marginal PAYE tax (20%/40%), 8% National Insurance, Section 2 night/weekend enhancements, and 12.07% WTD holiday pay.

Canonical: ${SITE.url}/bank-shift-calculator/
Last updated: ${SITE.updated}

## NHS Agenda for Change Section 2 Unsocial Hours Multipliers (2026/27)

| Pay Band Group | Standard Day | Nights (8pm–6am) & Saturdays | Sundays & Public Bank Holidays | Overtime (>37.5h/wk, Bands 2–7) | Bank Shift WTD Holiday Uplift |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Band 2 & Band 3** | 1.00x (Plain Time) | **1.44x (+44%)** | **1.88x (+88%)** | **1.50x (Time-and-a-half)** | +12.07% rolled-up |
| **Bands 4 to 9** | 1.00x (Plain Time) | **1.30x (+30%)** | **1.60x (+60%)** | **1.50x (Bands 4–7)** | +12.07% rolled-up |

## 2026/27 Hourly Bank Rates & 11.5-Hour Paid Long Shift Gross Earnings (Including +12.07% WTD)

| Band & Entry Salary | Plain Hourly Rate | Night/Saturday Hourly Rate | Sunday/BH Hourly Rate | 11.5h Paid Day Shift (incl. WTD) | 11.5h Paid Sunday Shift (incl. WTD) |
| :--- | :--- | :--- | :--- | :--- | :--- |
${bandRows}

## Related
- [NHS Bank Shift Calculator (Interactive HTML)](${SITE.url}/bank-shift-calculator/)
- [NHS Salary Calculator](${SITE.url}/)
- [NHS Pension Calculator](${SITE.url}/pension-calculator/)
`;
}

function renderBandMd(bandObj) {
  const bName = bandObj.band;
  const slug = bandObj.slug;
  const entry = bandObj.points[0];
  const top = bandObj.points[bandObj.points.length - 1];
  const roleSummary = bandObj.typicalRoles.slice(0, 3).join(", ");

  const stepRows = bandObj.points
    .map((pt) => {
      const uk = calculateNet(pt.annualSalary, { bandSlug: slug });
      const scot = calculateNet(pt.annualSalary, { bandSlug: slug, scotland: true });
      const inner = calculateNet(pt.annualSalary, { bandSlug: slug, hcasRegion: "inner" });
      const outer = calculateNet(pt.annualSalary, { bandSlug: slug, hcasRegion: "outer" });
      const fringe = calculateNet(pt.annualSalary, { bandSlug: slug, hcasRegion: "fringe" });
      return `| ${pt.step} (${pt.yearsExperience} yrs) | ${fmtGBP(pt.annualSalary)} | £${pt.hourlyRate.toFixed(2)}/hr | ${uk.pensionRate}% (${fmtGBP(uk.pensionMonthly)}/mo) | **${fmtGBP(uk.netMonthly)}/mo** | ${fmtGBP(scot.netMonthly)}/mo | ${fmtGBP(fringe.netMonthly)}/mo | ${fmtGBP(outer.netMonthly)}/mo | ${fmtGBP(inner.netMonthly)}/mo |`;
    })
    .join("\n");

  const fteRows = [
    { label: "Full-Time (37.5 hrs/wk · 1.00 FTE)", fte: 1, nights: 0 },
    { label: "Full-Time + 1 Night Shift/wk (11.5h night)", fte: 1, nights: 11.5 },
    { label: "Part-Time 4 Days (30.0 hrs/wk · 0.80 FTE)", fte: 0.8, nights: 0 },
    { label: "Part-Time 3 Days (22.5 hrs/wk · 0.60 FTE)", fte: 0.6, nights: 0 },
    { label: "Part-Time Half-Time (18.75 hrs/wk · 0.50 FTE)", fte: 0.5, nights: 0 },
  ]
    .map((pat) => {
      const c = calculateNet(entry.annualSalary, {
        bandSlug: slug,
        fte: pat.fte,
        nightHoursPerWeek: pat.nights,
      });
      return `| ${pat.label} | ${fmtGBP(c.grossAnnual)}/yr | ${fmtGBP(c.pensionMonthly)}/mo | ${fmtGBP(c.taxMonthly)}/mo | ${fmtGBP(c.niMonthly)}/mo | **${fmtGBP(c.netMonthly)}/mo** |`;
    })
    .join("\n");

  return `# NHS ${bName} Salary 2026/27 — Pay Scale Steps, Hourly Rate & Monthly Net Take-Home

> Official 2026/27 NHS Agenda for Change ${bName} (${roleSummary}) salary breakdown: ${fmtGBP(entry.annualSalary)} to ${fmtGBP(top.annualSalary)} gross per year, exact monthly net pay after pension, PAYE tax, and NICs across England, Scotland, and London HCAS zones.

Canonical: ${SITE.url}/bands/${slug}/
Last updated: ${SITE.updated}

## ${bName} Overview (${roleSummary})
- **2026/27 Gross Salary Range:** **${fmtGBP(entry.annualSalary)}** (Entry) to **${fmtGBP(top.annualSalary)}** (Top Step)
- **Hourly Rate Range (37.5h/wk):** **£${entry.hourlyRate.toFixed(2)}/hr** to **£${top.hourlyRate.toFixed(2)}/hr**
- **Typical NHS Roles:** ${bandObj.typicalRoles.join(", ")}
- **NHS Pension Tier (2015 CARE):** **${calculateNet(entry.annualSalary, { bandSlug: slug }).pensionRate}%** (Entry) to **${calculateNet(top.annualSalary, { bandSlug: slug }).pensionRate}%** (Top Step)

## ${bName} Step Progression & Regional Net Monthly Take-Home Table (2026/27)

| Pay Step (Tenure) | Annual Gross | Hourly Rate | Pension Tier (Mo) | Rest of UK Net/Mo | Scotland Net/Mo | Fringe (+5%) Net/Mo | Outer London (+15%) Net/Mo | Inner London (+20%) Net/Mo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${stepRows}

## ${bName} Entry (${fmtGBP(entry.annualSalary)}) Full-Time, Part-Time Pro-Rata & Night Shift Matrix

| Working Pattern | Annual Gross (incl. Unsocial) | Monthly Pension | Monthly PAYE Tax | Monthly NICs | Monthly Net Take-Home |
| :--- | :--- | :--- | :--- | :--- | :--- |
${fteRows}

## Related
- [${bName} Interactive Calculator & Full Guide](${SITE.url}/bands/${slug}/)
- [NHS Salary & Pension Calculator](${SITE.url}/)
- [NHS Pension Calculator](${SITE.url}/pension-calculator/)
- [NHS Bank Shift Calculator](${SITE.url}/bank-shift-calculator/)
`;
}

function renderBackPayMd() {
  const rows = nhsData.bands
    .map((b) => {
      const sal = b.points[0].annualSalary;
      const oldSal = Math.round(sal / 1.033);
      const gain = sal - oldSal;
      const gross6Mo = Math.round(gain * 0.5);
      const rate = getPensionRate(sal);
      const taxRate = sal > 50270 ? 0.4 : 0.2;
      const niRate = sal > 50270 ? 0.02 : 0.08;
      const net6Mo = Math.round(
        gross6Mo * (1 - rate - (1 - rate) * taxRate - niRate)
      );
      return `| ${b.band} Entry | ${fmtGBP(oldSal)} | ${fmtGBP(sal)} | +${fmtGBP(gain)}/yr | ${fmtGBP(gross6Mo)} | **${fmtGBP(net6Mo)}** |`;
    })
    .join("\n");

  return `# NHS Back Pay & 3.3% Pay Rise Calculator 2026/27 — Net Arrears After Tax & Pension

> Calculate your exact 2026/27 NHS 3.3% Agenda for Change backdated arrears lump sum from 1 April after PAYE tax, National Insurance, NHS Pension, and Student Loan deductions.

Canonical: ${SITE.url}/pay-rise-backpay-calculator/
Last updated: ${SITE.updated}

## 2026/27 NHS 3.3% Pay Rise & 6-Month Arrears Table (Bands 2 to 9)

| NHS Band | Pre-Uplift Gross | 2026/27 New Gross | Annual Gross Gain (+3.3%) | 6-Mo Gross Back Pay | 6-Mo Net Back Pay Kept |
| :--- | :--- | :--- | :--- | :--- | :--- |
${rows}

## Related
- [NHS Back Pay & Pay Rise Calculator (Interactive HTML)](${SITE.url}/pay-rise-backpay-calculator/)
- [NHS Band Promotion Calculator](${SITE.url}/promotion-calculator/)
- [NHS Salary & Take-Home Calculator](${SITE.url}/)
`;
}

function renderPromotionMd() {
  const rows = nhsData.bands
    .slice(0, -1)
    .map((fromB, i) => {
      const toB = nhsData.bands[i + 1];
      const fSal = fromB.points[0].annualSalary;
      const tSal = toB.points[0].annualSalary;
      const fCalc = calculateNet(fSal, { bandSlug: fromB.slug });
      const tCalc = calculateNet(tSal, { bandSlug: toB.slug });
      return `| ${fromB.band} → ${toB.band} | ${fmtGBP(fSal)} | ${fmtGBP(tSal)} | +${fmtGBP(tSal - fSal)}/yr | ${fCalc.pensionRate}% → ${tCalc.pensionRate}% | **+${fmtGBP(tCalc.netMonthly - fCalc.netMonthly)}/mo** |`;
    })
    .join("\n");

  return `# NHS Band Promotion & Pension Bracket Trap Calculator 2026/27 — Band 5 to Band 6 Net Take-Home Reality

> Direct Answer: Is stepping up from Band 5 to Band 6 financially worth it in the NHS? Analysis of the £50/month promotion trap, 9.8% pension tier cliffs, and losing unsocial ward shifts.

Canonical: ${SITE.url}/promotion-calculator/
Last updated: ${SITE.updated}

## Executive Summary: Band 5 to Band 6 Promotion Reality (2026/27)

1. **The £50/Month Trap (Top of Band 5 to Band 6 Entry):**
   - Top of Band 5 (£39,043) to Band 6 Entry (£39,959) gives a gross raise of +£916/year (+£76.33/month).
   - After subtracting 9.8% NHS Pension (£7.48/mo), 20% basic PAYE tax (£13.77/mo), and 8% National Insurance (£6.11/mo), the net increase is only **+£48.98/month** (a 37.8% marginal deduction rate).
   - With a Plan 2 Student Loan (9%), the marginal deduction rate reaches **46.8%**, leaving just **+£42.11/month** (+£1.39/day).

2. **The Shift Loss Reality (Ward Night Shifts to Mon–Fri 9–5):**
   - A Band 5 Nurse working 1 night per week (+30% unsocial hours) earns ~£2,445/month net.
   - Stepping into a 9–5 clinic or specialist Band 6 post without enhancements yields £2,489/month net (+£44 difference).
   - Working 2 nights/week as Band 5 yields ~£2,650/month net; moving to a 9–5 Band 6 post results in an immediate **take-home pay cut of over -£160/month**.

3. **The Long-Term Career Win (Why Band 6 Pays Off):**
   - After 2 years, Band 6 reaches £42,170 (+£160/mo net).
   - After 5 years, Band 6 reaches £48,117 (+£470/mo net over Band 5 top).
   - 2015 CARE Pension: Top of Band 6 builds **£891.06/year of guaranteed annual retirement pension for life** (accrued at 1/54th of pensionable earnings), an extra +£168.04/year compared to Top of Band 5.

## 2026/27 NHS Band-to-Band Promotion Net Monthly Gain Table (Entry to Entry)

| Promotion Transition | Current Gross | Promoted Gross | Annual Gross Increase | Pension Tier Shift | Monthly Net Take-Home Gain |
| :--- | :--- | :--- | :--- | :--- | :--- |
${rows}

## Frequently Asked Questions

### Why is the pay rise from Band 5 to Band 6 so small in month 1?
Because the base salary gap between the top of Band 5 (£39,043) and the entry of Band 6 (£39,959) is only £916/year (£76.33/mo). After statutory deductions (9.8% pension + 20% tax + 8% NI), over 37.8% of the pay rise is withheld at source.

### How does the NHS Pension tier cliff impact promotions?
Tier 3 is 8.3% (earnings up to £35,155) and Tier 4 is 9.8% (earnings £35,155 to £52,778). Advancing past £35,155 increases pension contributions by 1.5% across your entire salary, deducting an extra £955/year in pension contributions.

## Related
- [NHS Band Promotion & Pension Trap Calculator (Interactive HTML)](${SITE.url}/promotion-calculator/)
- [NHS Back Pay Calculator](${SITE.url}/pay-rise-backpay-calculator/)
- [NHS Salary & Take-Home Calculator](${SITE.url}/)
`;
}

function renderRedundancyMd() {
  const rows = nhsData.bands
    .map((b) => {
      const sal = Math.min(80000, Math.max(23000, b.points[0].annualSalary));
      const mo = sal / 12;
      return `| ${b.band} Entry | ${fmtGBP(sal)} | ${fmtGBP(mo * 5)} | ${fmtGBP(mo * 10)} | ${fmtGBP(mo * 15)} | **${fmtGBP(Math.min(160000, mo * 24))}** |`;
    })
    .join("\n");

  return `# NHS Redundancy & MARS Severance Calculator 2026/27 — Section 16 & £30k Tax-Free

> Calculate your 2026/27 NHS Section 16 contractual redundancy pay (1 month per year of service up to 24 years, £80k salary cap) and NHS MARS voluntary severance after the £30,000 HMRC tax-free allowance.

Canonical: ${SITE.url}/redundancy-pay-calculator/
Last updated: ${SITE.updated}

## 2026/27 NHS Section 16 Redundancy Payout Matrix by Band & Reckonable Service

| NHS Band | Reckonable Salary (Cap £80k) | 5 Years (5 Mos) | 10 Years (10 Mos) | 15 Years (15 Mos) | 24 Years Max (24 Mos) |
| :--- | :--- | :--- | :--- | :--- | :--- |
${rows}

## Related
- [NHS Redundancy & MARS Calculator (Interactive HTML)](${SITE.url}/redundancy-pay-calculator/)
- [NHS Pension Calculator](${SITE.url}/pension-calculator/)
- [NHS Salary Calculator](${SITE.url}/)
`;
}

function renderInternationalMd() {
  return `# NHS Salary & Health and Care Worker Visa Guide 2026/27 — International Healthcare Recruits

> Authoritative guidance for overseas nurses, doctors, and allied health professionals joining the UK NHS: Pre-OSCE (Band 4) vs Post-OSCE (Band 5) take-home pay, IHS exemption savings, and monthly remittance benchmarks.

Canonical: ${SITE.url}/international/
Last updated: ${SITE.updated}

## 1. Pre-OSCE (Band 4) vs Post-OSCE (Band 5) Pay Progression

| Stage | Agenda for Change Band | Gross Annual Salary | Gross Monthly Pay | NHS Pension Deduction | Monthly Take-Home Net |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Arrival & Pre-OSCE** | Band 4 Entry | £28,392 | £2,366.00 | -£153.79 (6.5%) | **~£1,889.63 / mo** |
| **Post-OSCE NMC PIN** | Band 5 Entry | £32,073 | £2,672.75 | -£221.84 (8.3%) | **~£2,080.39 / mo** |
| **Band 5 with Nights** | Band 5 + 1 Night/Wk | ~£35,665 | ~£2,972.08 | -£246.68 (8.3%) | **~£2,280.00 / mo** |

*Immediate OSCE Pass Pay Gain:* Passing your OSCE awards an extra **+£190.76/month net cash** (+£2,289/year clean take-home).

## 2. Monthly Remittance Benchmarks to Philippines, India & Overseas

| Country & Currency | Monthly Remittance (£ GBP) | Local Currency Equivalent | Typical Usage |
| :--- | :--- | :--- | :--- |
| **Philippines (PHP)** | £600 – £1,000 / mo | ₱43,500 – ₱72,500 PHP | Family upkeep, home mortgage, savings |
| **India (INR)** | £600 – £1,200 / mo | ₹64,000 – ₹128,000 INR | Education loans, family investments |
| **Spain / Eurozone (EUR)** | £500 – £900 / mo | €580 – €1,050 EUR | Eurozone savings, property payments |
| **Nigeria (NGN)** | £500 – £1,000 / mo | ₦950,000 – ₦1,900,000 NGN | Family upkeep, real estate construction |

## 3. Crucial Visa & Payroll Rules for Overseas Staff

1. **100% IHS Surcharge Exemption:** Health and Care Worker Visa holders are completely exempt from the £1,035/year Immigration Health Surcharge.
2. **Do NOT Opt Out of the NHS Pension:** The NHS 2015 CARE Pension builds an inflation-protected guaranteed income for life (1/54th annual accrual). The Trust contributes 23.7% on your behalf plus £64,000+ life assurance cover.
3. **UK Tax Code 1257L:** Verify your first ESR payslip shows tax code 1257L (standard £12,570 personal allowance).

## Related
- [NHS International Recruits Guide (Interactive HTML)](${SITE.url}/international/)
- [NHS Salary & Take-Home Calculator](${SITE.url}/)
- [NHS Band Promotion & Pension Trap Calculator](${SITE.url}/promotion-calculator/)
`;
}

// ---------------------------------------------------------------------------
// 2. Build Registry & Generate All Files
// ---------------------------------------------------------------------------
const markdownRegistry = [
  {
    route: "/",
    mdPath: "/index.md",
    fileOut: path.join(PUBLIC_DIR, "index.md"),
    title: "NetPayScale UK — 2026/27 NHS Salary & Pension Calculator",
    description:
      "2026/27 NHS Agenda for Change Band 2 to Band 9 salary tables, net monthly take-home pay, London Weighting (HCAS), and pension tiers.",
    category: "core",
    render: renderHomeMd,
  },
  {
    route: "/pension-calculator/",
    mdPath: "/pension-calculator.md",
    fileOut: path.join(PUBLIC_DIR, "pension-calculator.md"),
    title: "NHS Pension Calculator 2026/27 (2015 CARE Scheme)",
    description:
      "7-tier NHS employee contribution rates (5.2%–12.5%), 23.7% employer contribution, Net-Pay tax relief, and 1/54th annual pension accrual.",
    category: "core",
    render: renderPensionMd,
  },
  {
    route: "/sick-pay-calculator/",
    mdPath: "/sick-pay-calculator.md",
    fileOut: path.join(PUBLIC_DIR, "sick-pay-calculator.md"),
    title: "NHS Sick Pay & Half-Pay Calculator 2026/27 (Section 14)",
    description:
      "NHS Occupational Sick Pay entitlements by years of service (1 to 6 months Full Pay + 2 to 6 months Half Pay) and Statutory Sick Pay (£118.75/wk).",
    category: "core",
    render: renderSickPayMd,
  },
  {
    route: "/maternity-pay-calculator/",
    mdPath: "/maternity-pay-calculator.md",
    fileOut: path.join(PUBLIC_DIR, "maternity-pay-calculator.md"),
    title: "NHS Maternity Pay Calculator 2026/27 (OMP + SMP Section 15)",
    description:
      "52-week NHS Occupational Maternity Pay timeline (8 wks 100%, 18 wks 50% + SMP £187.18/wk, 13 wks SMP, 13 wks unpaid), equal spread, and leave accrual.",
    category: "core",
    render: renderMaternityMd,
  },
  {
    route: "/annual-leave-calculator/",
    mdPath: "/annual-leave-calculator.md",
    fileOut: path.join(PUBLIC_DIR, "annual-leave-calculator.md"),
    title: "NHS Annual Leave & Pro-Rata Holiday Calculator 2026/27 (Section 13)",
    description:
      "27, 29, and 33 days NHS annual leave plus 8 public bank holidays converted into exact hours and shifts for full-time and part-time contracts.",
    category: "core",
    render: renderAnnualLeaveMd,
  },
  {
    route: "/bank-shift-calculator/",
    mdPath: "/bank-shift-calculator.md",
    fileOut: path.join(PUBLIC_DIR, "bank-shift-calculator.md"),
    title: "NHS Bank Shift, Overtime & Section 2 Unsocial Hours Calculator 2026/27",
    description:
      "Section 2 unsocial hours multipliers (+44%/+88% Bands 2–3, +30%/+60% Bands 4–9), 1.5x overtime, +12.07% WTD holiday uplift, and net shift pay.",
    category: "core",
    render: renderBankShiftMd,
  },
  {
    route: "/pay-rise-backpay-calculator/",
    mdPath: "/pay-rise-backpay-calculator.md",
    fileOut: path.join(PUBLIC_DIR, "pay-rise-backpay-calculator.md"),
    title: "NHS Back Pay & 3.3% Pay Rise Arrears Calculator 2026/27",
    description:
      "Backdated 2026/27 NHS 3.3% Agenda for Change pay award arrears from 1 April after PAYE tax, 8% NICs, NHS Pension, and Student Loan.",
    category: "core",
    render: renderBackPayMd,
  },
  {
    route: "/promotion-calculator/",
    mdPath: "/promotion-calculator.md",
    fileOut: path.join(PUBLIC_DIR, "promotion-calculator.md"),
    title: "NHS Band Promotion & Spine Step Net Pay Comparator 2026/27",
    description:
      "Side-by-side net monthly pay comparison across any two NHS Bands or spine steps, factoring in NHS Pension tier cliffs and unsocial shift changes.",
    category: "core",
    render: renderPromotionMd,
  },
  {
    route: "/redundancy-pay-calculator/",
    mdPath: "/redundancy-pay-calculator.md",
    fileOut: path.join(PUBLIC_DIR, "redundancy-pay-calculator.md"),
    title: "NHS Redundancy & MARS Severance Calculator 2026/27 (Section 16)",
    description:
      "NHS Section 16 contractual redundancy (1 month per year up to 24 years, £80k salary cap), MARS severance, and £30,000 HMRC tax-free exemption.",
    category: "core",
    render: renderRedundancyMd,
  },
  {
    route: "/international/",
    mdPath: "/international.md",
    fileOut: path.join(PUBLIC_DIR, "international.md"),
    title: "NHS Salary & Visa Guide for International Recruits 2026/27",
    description:
      "Complete guide for overseas nurses, doctors, and healthcare staff: Pre-OSCE (Band 4) vs Post-OSCE (Band 5) pay, Health and Care Worker Visa exemptions, and remittances.",
    category: "core",
    render: renderInternationalMd,
  },
  ...nhsData.bands.map((b) => {
    const slug = b.slug;
    const roleSummary = b.typicalRoles.slice(0, 2).join(", ");
    return {
      route: `/bands/${slug}/`,
      mdPath: `/bands/${slug}.md`,
      fileOut: path.join(PUBLIC_DIR, "bands", `${slug}.md`),
      title: `NHS ${b.band} Salary 2026/27 (${roleSummary})`,
      description: `2026/27 ${b.band} pay scale (${fmtGBP(b.points[0].annualSalary)}–${fmtGBP(b.points[b.points.length - 1].annualSalary)}), hourly rates, step progression, and regional net pay.`,
      category: "bands",
      render: () => renderBandMd(b),
    };
  }),
];

// Ensure directories exist
fs.mkdirSync(path.join(PUBLIC_DIR, "bands"), { recursive: true });
fs.mkdirSync(path.join(PUBLIC_DIR, "api", "md"), { recursive: true });

// Write individual .md files
for (const item of markdownRegistry) {
  const md = item.render();
  fs.writeFileSync(item.fileOut, md, "utf8");
}

// Write /api/md/_catalog
const catalogPayload = {
  site: SITE.name,
  url: SITE.url,
  updated: SITE.updated,
  totalMarkdownRoutes: markdownRegistry.length,
  totalHtmlRoutes: 515,
  routes: markdownRegistry.map((r) => ({
    htmlUrl: `${SITE.url}${r.route}`,
    markdownUrl: `${SITE.url}${r.mdPath}`,
    title: r.title,
    description: r.description,
    category: r.category,
  })),
};
fs.writeFileSync(
  path.join(PUBLIC_DIR, "api", "md", "_catalog"),
  JSON.stringify(catalogPayload, null, 2),
  "utf8"
);

// Write /llms.txt
const coreLinks = markdownRegistry
  .filter((r) => r.category === "core")
  .map((r) => `- [${r.title}](${SITE.url}${r.mdPath}): ${r.description}`)
  .join("\n");

const bandLinks = markdownRegistry
  .filter((r) => r.category === "bands")
  .map((r) => `- [${r.title}](${SITE.url}${r.mdPath}): ${r.description}`)
  .join("\n");

const llmsTxt = `# ${SITE.name}
# Keep in sync with /robots.txt and /ai.txt

> ${SITE.description}

NetPayScale UK is an open-access statutory payroll reference and calculator suite for UK National Health Service (NHS) staff employed under the Agenda for Change (AfC) framework. All figures reflect the confirmed 2026/27 tax year (effective 1 April 2026), including the 3.3% AfC consolidated pay uplift, HMRC PAYE Income Tax (England/Wales/NI and Scottish 6-band regimes), Class 1 National Insurance (8% / 2%), 2015 CARE NHS Pension tiers (5.2% to 12.5%), and High Cost Area Supplements (Inner London 20%, Outer London 15%, Fringe 5%). Contact: ${SITE.contact}.

## Core Calculators (Markdown Twins)
${coreLinks}

## 2026/27 NHS Agenda for Change Band Guides (Markdown Twins)
${bandLinks}

## Popular Role & Regional Salary Benchmarks (HTML)
- [Band 5 Nurse Salary — Inner London](${SITE.url}/calculator/band-5-nurse-salary-inner-london/): £32,073 base + £6,415 HCAS = £38,488 gross (£2,367/mo net take-home)
- [Band 6 Senior Paramedic Salary — Scotland](${SITE.url}/calculator/band-6-senior-paramedic-salary-scotland/): £38,619 to £46,580 gross under Scottish 6-band Income Tax
- [Band 7 Clinical Manager Salary — Manchester](${SITE.url}/calculator/band-7-clinical-manager-salary-manchester/): £47,810 to £54,710 gross (£2,855 to £3,190/mo net take-home)
- [Band 8a Matron Salary — Inner London](${SITE.url}/calculator/band-8a-matron-salary-inner-london/): £55,690 base + £8,746 HCAS = £64,436 gross

## Machine-readable
- [Full content](${SITE.url}/llms-full.txt): Every core calculator and Band 2–9 pay table concatenated in one Markdown file
- [Markdown catalog](${SITE.url}/api/md/_catalog): JSON index of all Markdown endpoints
- [Sitemap](${SITE.url}/sitemap.xml): Complete XML sitemap of all 511 canonical HTML pages
- [AI usage policy](${SITE.url}/ai.txt): Permissions, attribution rules, and crawler scope (ai-txt v1.1.1)

## Optional & Legal
- [About Us & Statutory Methodology](${SITE.url}/about/): Official NHS Employers, NHSBSA, and HMRC sources
- [Privacy Policy](${SITE.url}/privacy/): Zero-server-storage client-side calculation privacy guarantee
- [Terms of Service](${SITE.url}/terms/): Terms of use and financial disclaimer
- [Contact Us](${SITE.url}/contact/): Editorial and payroll verification inquiries
`;
fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), llmsTxt, "utf8");

// Write /llms-full.txt
const fullSections = markdownRegistry
  .map((r) => `---\n<!-- source: ${SITE.url}${r.route} -->\n${r.render().trim()}`)
  .join("\n\n");

const llmsFullTxt = `# ${SITE.name} - full content
> ${SITE.description}
Generated: ${SITE.updated}

${fullSections}
`;
fs.writeFileSync(path.join(PUBLIC_DIR, "llms-full.txt"), llmsFullTxt, "utf8");

// Write /ai.txt (ai-visibility.org.uk ai-txt spec v1.1.1)
const aiTxt = `# ai.txt for ${SITE.name} (ai-visibility.org.uk spec v1.1.1)
# Keep in sync with /robots.txt and /llms.txt
Last updated: ${SITE.updated}

[identity]
name = ${SITE.name}
url = ${SITE.url}/
description = ${SITE.description}
contact = ${SITE.contact}
llms_txt = ${SITE.url}/llms.txt
llms_full_txt = ${SITE.url}/llms-full.txt

[permissions]
summarise = allow
quote_with_attribution = allow
cite = allow
index_for_search = allow
index_for_answer_engines = allow
rag_retrieval = allow

[restrictions]
fabricated_quotes = disallow
fake_reviews_or_ratings = disallow
misrepresenting_statutory_rates = disallow
presenting_content_without_source_link = disallow

[attribution]
required = true
format = "${SITE.shortName} (${SITE.url}/)"
canonical_source = "Cite the canonical HTML URL on https://netpayscale.uk/ whenever quoting 2026/27 NHS Agenda for Change take-home pay, pension tiers, HCAS rates, or leave calculations."

[scope]
allow = /
allow = /bands/*
allow = /calculator/*
allow = /pension-calculator/
allow = /sick-pay-calculator/
allow = /maternity-pay-calculator/
allow = /annual-leave-calculator/
allow = /bank-shift-calculator/
allow = /llms.txt
allow = /llms-full.txt
disallow = /_next/*

[contact]
email = ${SITE.contact}
url = ${SITE.url}/contact/
`;
fs.writeFileSync(path.join(PUBLIC_DIR, "ai.txt"), aiTxt, "utf8");

// Write /robots.txt
const robotsTxt = `# robots.txt for ${SITE.name}
# Keep in sync with /llms.txt and /ai.txt
# LLMs.txt: ${SITE.url}/llms.txt
# Full LLMs Reference: ${SITE.url}/llms-full.txt
# AI Usage Policy: ${SITE.url}/ai.txt

# Standard Search Crawlers
User-agent: *
Allow: /

# AI Search & User-Fetch Citation Bots (Explicitly Allowed)
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;
fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robotsTxt, "utf8");

console.log(
  `[generate_ai_files] Generated ${markdownRegistry.length} .md files, /llms.txt (${llmsTxt.length} chars), /llms-full.txt (${llmsFullTxt.length} chars), /ai.txt, /robots.txt, and /api/md/_catalog.`
);
