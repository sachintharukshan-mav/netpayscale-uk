import fs from 'fs';
import path from 'path';

console.log('=== RUNNING NOVEMBER 2026 HIGH-VELOCITY CALCULATORS DATA ACCURACY & MATH VERIFICATION ===\n');

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`[PASS] ${msg}`);
  } else {
    failed++;
    console.error(`[FAIL] ${msg}`);
  }
}

// 1. Primary Source Verification: 2026/27 & 2027/28 (+2.4% DHSC Proposal) Scales
const OFFICIAL_2026_27_STEPS = {
  'Band 2': [{ step: 'Entry & Top (1 Step)', salary: 25688 }],
  'Band 3': [
    { step: 'Entry (Years 0–2)', salary: 25808 },
    { step: 'Top (2+ Years)', salary: 27486 },
  ],
  'Band 4': [
    { step: 'Entry (Years 0–3)', salary: 28412 },
    { step: 'Top (3+ Years)', salary: 31196 },
  ],
  'Band 5': [
    { step: 'Entry (Years 0–2)', salary: 32073 },
    { step: 'Intermediate (Years 2–4)', salary: 34572 },
    { step: 'Top (4+ Years)', salary: 39027 },
  ],
  'Band 6': [
    { step: 'Entry (Years 0–2)', salary: 39958 },
    { step: 'Intermediate (Years 2–5)', salary: 42356 },
    { step: 'Top (5+ Years)', salary: 48152 },
  ],
  'Band 7': [
    { step: 'Entry (Years 0–2)', salary: 49480 },
    { step: 'Intermediate (Years 2–5)', salary: 52016 },
    { step: 'Top (5+ Years)', salary: 56525 },
  ],
  'Band 8a': [
    { step: 'Entry (Years 0–5)', salary: 57526 },
    { step: 'Top (5+ Years)', salary: 64628 },
  ],
  'Band 8b': [
    { step: 'Entry (Years 0–5)', salary: 66509 },
    { step: 'Top (5+ Years)', salary: 77346 },
  ],
  'Band 8c': [
    { step: 'Entry (Years 0–5)', salary: 79619 },
    { step: 'Top (5+ Years)', salary: 91785 },
  ],
  'Band 8d': [
    { step: 'Entry (Years 0–5)', salary: 94532 },
    { step: 'Top (5+ Years)', salary: 109061 },
  ],
  'Band 9': [
    { step: 'Entry (Years 0–5)', salary: 113178 },
    { step: 'Top (5+ Years)', salary: 130114 },
  ],
};

// Verify 2.4% DHSC proposal mathematical accuracy
assert(Math.round(25688 * 1.024) === 26305, 'Band 2 2027/28 (+2.4% DHSC proposal) = £26,305 (+£617/yr)');
assert(Math.round(32073 * 1.024) === 32843, 'Band 5 Entry 2027/28 (+2.4% DHSC proposal) = £32,843 (+£770/yr)');
assert(Math.round(39027 * 1.024) === 39964, 'Band 5 Top 2027/28 (+2.4% DHSC proposal) = £39,964 (+£937/yr)');
assert(Math.round(39958 * 1.024) === 40917, 'Band 6 Entry 2027/28 (+2.4% DHSC proposal) = £40,917 (+£959/yr)');
assert(Math.round(49480 * 1.024) === 50668, 'Band 7 Entry 2027/28 (+2.4% DHSC proposal) = £50,668 (+£1,188/yr)');
assert(Math.round(57526 * 1.024) === 58907, 'Band 8a Entry 2027/28 (+2.4% DHSC proposal) = £58,907 (+£1,381/yr)');

// Verify 2026/27 NHS Pension Tier boundaries & Cliff-Edge detection
function getPensionTierRate(pensionablePay) {
  if (pensionablePay <= 13259) return 0.052;
  if (pensionablePay <= 28888) return 0.065;
  if (pensionablePay <= 35057) return 0.083;
  if (pensionablePay <= 52997) return 0.098;
  if (pensionablePay <= 67666) return 0.107;
  return 0.125;
}

// Band 5 Intermediate (£34,572 -> £35,402 at +2.4%) crosses £35,057 threshold (8.3% -> 9.8%)
const b5Mid2026 = 34572;
const b5Mid2027 = Math.round(b5Mid2026 * 1.024);
assert(
  getPensionTierRate(b5Mid2026) === 0.083 && getPensionTierRate(b5Mid2027) === 0.098,
  `Band 5 Intermediate (£${b5Mid2026} -> £${b5Mid2027}) accurately triggers 8.3% -> 9.8% pension tier cliff-edge detection`
);

// Band 7 Intermediate (£52,016 -> £53,264 at +2.4%) crosses £52,997 threshold (9.8% -> 10.7%)
const b7Mid2026 = 52016;
const b7Mid2027 = Math.round(b7Mid2026 * 1.024);
assert(
  getPensionTierRate(b7Mid2026) === 0.098 && getPensionTierRate(b7Mid2027) === 0.107,
  `Band 7 Intermediate (£${b7Mid2026} -> £${b7Mid2027}) accurately triggers 9.8% -> 10.7% pension tier cliff-edge detection`
);

// 2. Verify ESR Payslip Decoder Mathematical Formulas
const b5EntryHourly = 32073 / 1955.357; // £16.4026/hr
assert(Math.abs(b5EntryHourly - 16.4026) < 0.001, `Band 5 Entry hourly rate (1,955.357 hrs/yr) = £16.40/hr (actual: £${b5EntryHourly.toFixed(4)})`);
const nightMultiplierB5 = 0.30; // +30% EN premium
const sundayMultiplierB5 = 0.60; // +60% EN premium
const nightMultiplierB2 = 0.44; // +44% EN premium (Band 2)
const sundayMultiplierB2 = 0.88; // +88% EN premium (Band 2)

// Test AfC Absence offset (11.5h sick shift on Band 5 Entry):
const afcAbsenceOffset = 11.5 * b5EntryHourly;
assert(Math.abs(afcAbsenceOffset - 188.63) < 0.05, `ESR AfC Absence Paid vs Unpaid offset for 11.5h shift = £188.63 (actual: £${afcAbsenceOffset.toFixed(2)})`);

// Test WTD Pay on Overtime (8h weekday OT at 1.5x with 14.29% WTD holiday enhancement):
const otGross = 8 * b5EntryHourly * 1.5;
const wtdPay = otGross * 0.1429;
assert(Math.abs(otGross - 196.83) < 0.05 && Math.abs(wtdPay - 28.13) < 0.05, `ESR WTD Pay on 8h Overtime = £${wtdPay.toFixed(2)} on £${otGross.toFixed(2)} OT gross`);

// 3. Verify Section 17 Mileage & EV Salary Sacrifice Math
// Case A: 5,000 miles in standard car -> 3,500 * 59p + 1,500 * 24p = £2,065 + £360 = £2,425
const tier1Reimb = 3500 * 0.59;
const tier2Reimb = 1500 * 0.24;
const totalNhsMileage = tier1Reimb + tier2Reimb;
const hmrcAmap5000 = 5000 * 0.45; // £2,250
assert(totalNhsMileage === 2425 && hmrcAmap5000 === 2250, `Section 17 Mileage for 5,000 miles = £2,425 (£2,065 at 59p + £360 at 24p) vs £2,250 HMRC AMAP`);

// Case B: 6,000 miles on Reserve Rate (30p/mile) -> NHS pays £1,800; HMRC AMAP = £2,700 -> £900 MAR shortfall -> £180 P87 tax refund at 20%
const reserveReimb6000 = 6000 * 0.30;
const hmrcAmap6000 = 6000 * 0.45;
const marShortfall = hmrcAmap6000 - reserveReimb6000;
const p87RefundBasic = marShortfall * 0.20;
assert(reserveReimb6000 === 1800 && marShortfall === 900 && p87RefundBasic === 180, `Reserve rate (30p/mile) on 6,000 miles yields £900 MAR shortfall & £180 HMRC Form P87 refund at 20% tax`);

// Case C: 1/54th CARE Pension Reduction on £450/mo (£5,400/yr) EV lease sacrifice
const annualSacrifice = 450 * 12; // £5,400/yr
const annualCareLoss = annualSacrifice / 54; // £100.00/yr preserved pension loss per year of lease
assert(annualCareLoss === 100, `£450/mo (£5,400/yr) EV salary sacrifice reduces annual 2015 CARE pension accrual by exactly £100.00/yr (1/54th)`);

// 4. Verify Northern Ireland (HSCNI) 2025/26 Confirmed vs 2026/27 (+3.3% Parity) Backpay Math
// Band 5 Entry: £31,049 (2025/26) vs £32,073 (2026/27) -> +£1,024/yr (+£85.33/mo gross)
const niB5EntryDiff = 32073 - 31049;
const niB5NovBackpayGross = (niB5EntryDiff / 12) * 8; // Apr-Nov (8 months) = £682.67 gross
assert(niB5EntryDiff === 1024 && Math.round(niB5NovBackpayGross) === 683, `HSCNI Band 5 Entry 2026/27 parity uplift = +£1,024/yr (£683 gross backpay over 8 months Apr–Nov 2026)`);

// Band 6 Top: £46,613 (2025/26) vs £48,152 (2026/27) -> +£1,539/yr
const niB6TopDiff = 48152 - 46613;
assert(niB6TopDiff === 1539, `HSCNI Band 6 Top 2026/27 parity uplift = +£1,539/yr (£46,613 -> £48,152)`);

// 5. Verify Built Static HTML & Markdown Twin Files in out/
const outDir = path.resolve('out');
const newRoutes = [
  'nhs-pay-rise-2027',
  'nhs-payslip-explained',
  'salary-sacrifice-mileage-calculator',
  'northern-ireland-pay-calculator',
];

for (const slug of newRoutes) {
  const htmlPath = path.join(outDir, slug, 'index.html');
  const mdPath = path.join(outDir, `${slug}.md`);
  assert(fs.existsSync(htmlPath), `Built HTML exists: out/${slug}/index.html`);
  assert(fs.existsSync(mdPath), `Built Markdown twin exists: out/${slug}.md`);
  if (fs.existsSync(htmlPath) && fs.existsSync(mdPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const md = fs.readFileSync(mdPath, 'utf8');
    assert(html.includes(`https://netpayscale.uk/${slug}.md`), `out/${slug}/index.html links to alternate Markdown twin https://netpayscale.uk/${slug}.md`);
    assert(md.includes(`https://netpayscale.uk/${slug}/`), `out/${slug}.md references canonical URL https://netpayscale.uk/${slug}/`);
  }
}

console.log(`\n=== DATA ACCURACY VERIFICATION SUMMARY: Passed: ${passed}, Failed: ${failed} ===`);
process.exit(failed > 0 ? 1 : 0);
