# NetPayScale UK (NHS Edition) - Product Specification

## 1. Product Identity & Overview
NetPayScale UK is a Tier-1 interactive financial utility and Programmatic SEO (pSEO) portal for the United Kingdom's 1.3M+ NHS workforce. It calculates exact net take-home pay under the **2026/2027 Agenda for Change (AfC)** pay framework (inclusive of the official 3.3% pay uplift), taking into account:
- Exact AfC pay steps (Bands 2 through 9)
- High Cost Area Supplements (HCAS / London Weighting) with statutory caps and floors
- Section 2 Unsocial Hours Enhancements (night/Saturday +30%, Sunday/Bank holiday +60%)
- Pre-tax NHS Pension contribution tiers (5.2% to 12.5%)
- UK Income Tax (2026/27 Personal Allowance £12,570, basic, higher, additional rate with allowance taper over £100k)
- National Insurance (2026/27 8% between PT and UEL, 2% above UEL)
- Optional Student Loan repayments (Plan 1, Plan 2, Plan 4, Postgraduate)

## 2. Design System & Art Direction (Impeccable & Taste-Skill)
- **Mode:** Hybrid Operate (Precision financial calculator) & Persuade (pSEO landing page engagement).
- **Color Palette:**
  - Official NHS Blue (`#005EB8`) & Navy (`#003087`) accents for authoritative institutional trust.
  - Deep slate backgrounds & borders (`slate-50`, `slate-100`, `slate-200`, `slate-800`, `slate-900`) for crisp contrast.
  - Emerald (`#10B981`) for Net Take-Home deposit.
  - Violet (`#8B5CF6`) for NHS Pension contribution.
  - Crimson / Amber for Tax and National Insurance.
- **Typography:** Strict typographic hierarchy, system fonts (`-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`), tabular numbers (`font-mono` / `tabular-nums`) for currency comparisons to avoid jitter.
- **Motion (Emil Kowalski Philosophy):**
  - Smooth ease-out transitions (`transition-all duration-300 ease-out`).
  - Tactile slider feedback and real-time visual progress bar showing gross earnings breakdown.
  - Zero layout shift (CLS): all ad slots and breakdown charts reserve exact layout geometry.

## 3. Monetization & Geo-Arbitrage Strategy
- **Ad Placements:** Reserved high-viewability slots for premium UK healthcare audience (Raptive / Journey by Mediavine target: $25-$38+ RPM).
- **Affiliate Lead-Gen:** Contextual keyworker finance cards:
  - NHS Additional Voluntary Contributions (AVCs) / SIPP comparison
  - Tax-Free Cash ISAs (Moneyfarm / Trading212 / Hargreaves Lansdown)
  - NHS Keyworker Mortgage Specialists
  - NHS Salary Sacrifice Green Car Schemes

## 4. Programmatic SEO (pSEO) Engine
- Dynamic URL routing: `/calculator/[band]-[role]-salary-[region]`
- Static pre-rendering for top 30+ high-volume UK search terms.
- Dynamic hydration: pre-selects band, experience step, and region on page load.
- Editorial narrative: 300+ word contextual region & band guide above the calculator fold.
- Structured Schema (`FAQPage`, `FinancialProduct`) for rich Google search snippets.
