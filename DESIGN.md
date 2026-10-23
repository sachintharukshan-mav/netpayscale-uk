# DESIGN.md — NetPayScale UK (NHS Edition) Design System

## 1. Product Identity & Design Ethos

**NetPayScale UK (NHS Edition)** is a high-intent, high-converting financial portal built for the 1.3M+ NHS healthcare workforce. It translates Byzantine UK government pay circulars, multi-tiered pension regulations, and regional London weighting rules into sub-10ms, transparent take-home pay calculations.

### Core Philosophy
* **Anti-Slop & Craft Restraint:** No nested card-in-card fatigue, no neon gradient blobs, and no generic marketing filler. Surfaces are crisp, quiet, and grounded in institutional trust.
* **British Fintech Clarity:** Visual tone sits at the intersection of **Monzo** (approachable, human, clear), **Bloomberg Terminal** (honest, data-dense, razor-sharp numerals), and **NHS Institutional Trust** (official NHS Blue `#005EB8`).
* **Emil Kowalski Tactile Physics:** Real-time feedback on every interaction. Sliders and steppers adjust with micro-spring responsiveness, buttons compress on press (`scale-97`), and numbers update with zero layout shift.
* **Mobile-First Clinical Ergonomics:** Designed for nurses, HCAs, and paramedics checking their rota on mobile devices during 15-minute ward breaks. Sticky summary dock eliminates endless scrolling.

---

## 2. Color System & Design Tokens

### Semantic Palette

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **`--bg-page`** | `#FAFAFA` | Page-level background canvas (clean neutral) |
| **`--surface-card`** | `#FFFFFF` | Primary component and card surface |
| **`--surface-muted`** | `#F4F4F5` | Secondary backgrounds, segmented pill tracks, presets |
| **`--border-subtle`** | `#E4E4E7` | 1px clean card micro-borders |
| **`--border-strong`** | `#D4D4D8` | Active states, hover borders, table dividers |
| **`--text-ink`** | `#09090B` | Primary headings, prominent take-home numerals |
| **`--text-body`** | `#27272A` | Standard body text, table row labels |
| **`--text-muted`** | `#71717A` | Metadata, micro-labels, timestamps |
| **`--nhs-blue`** | `#005EB8` | Official NHS brand accent, primary badges, active highlights |
| **`--nhs-navy`** | `#003087` | Deep contrast variant for links and focus rings |
| **`--cash-emerald`**| `#059669` | Net take-home pay, positive shift yield, retention rate |
| **`--pension-indigo`**| `#4F46E5` | NHS Pension Scheme 2015 CARE deductions |
| **`--tax-rose`** | `#E11D48` | PAYE Income Tax deductions |
| **`--ni-amber`** | `#D97706` | National Insurance (Class 1) deductions |
| **`--loan-pink`** | `#DB2777` | Student loan repayments (Plans 1, 2, 4, 5, PG) |

---

## 3. Typography & Numerical Precision

### Hierarchy & Typefaces
* **Interface Labels & Prose:** System Grotesque (`Inter`, `SF Pro Text`, `-apple-system`, `sans-serif`). Clean, legible at small point sizes (`11px` to `13px`).
* **Financial Quantities:** Strictly Tabular Monospace (`font-mono`, `tabular-nums`) across all currency figures (`£X,XXX.XX`), hourly rates (`£XX.XX/hr`), percentages (`XX.X%`), and hours (`XX.Xh`).

### Typographic Scale
* **Display Hero Net Pay:** `text-4xl` to `text-5xl` (`font-extrabold`, `tracking-tight`, `font-mono`).
* **Section Headers:** `text-lg` (`font-bold`, `text-zinc-950`).
* **Component Titles:** `text-sm` (`font-semibold`, `text-zinc-900`).
* **Input Labels:** `text-xs` (`font-semibold`, `uppercase`, `tracking-wider`, `text-zinc-500`).
* **Table Rows:** `text-xs` (`tabular-nums`, `font-mono`).
* **Micro Metadata:** `text-[11px]` to `text-[10px]` (`text-zinc-400` to `text-zinc-500`).

---

## 4. Layout Architecture & Responsive Grids

### Desktop Layout (12-Column Responsive Grid)
* **Left Column (7 Columns / ~58% width):** Interactive Precision Controls
  1. Job Title Quick-Finder (Autocomplete search + popular clinical chips)
  2. Agenda for Change Pay Band selector (Bands 2–9 segmented row)
  3. Experience Progression Milestone cards (Entry, Mid, Top of Band)
  4. Contracted Hours slider with `[-]` and `[+]` steppers and FTE presets
  5. High Cost Area Supplement (HCAS) London Weighting zone grid
  6. Unsocial Hours Section 2 enhancements with Rota presets + Clean Cash callout
  7. Advanced Settings accordion (Tax code, Pension opt-out, Student loans)
* **Right Column (5 Columns / ~42% width):** Sticky Real-Time Ledger (`lg:sticky lg:top-20`)
  1. Sticky Net Pay Summary Card (Take-Home, Gross, Deductions, Pence-Kept metric)
  2. Proportional Visual Breakdown Bar (Ease-out stacked progress bar)
* **Below Fold:** Full-width Itemized Accounting Ledger & Official ESR Payslip View, followed by Promotion Step-Ups, worked clinical personas, and directory.

### Mobile Viewport (< 1024px)
* **Zero-Scroll Feedback:** Mobile Floating Bottom Dock (`fixed bottom-0 z-40`) delivers instant net pay numbers as sliders are dragged.
* **Native Bottom Sheet:** Tapping "Breakdown ▲" slides up the complete statutory ledger and visual progress bar.
* **Safe-Area Insets:** Dynamic bottom padding (`pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))]`) prevents obstruction by the iOS home indicator.

---

## 5. Component Design Standards

### A. Segmented Pay Band Row
* Single-level pill container (`bg-white border border-zinc-200/90 rounded-xl p-1`).
* Active item: Solid black (`bg-zinc-950 text-white shadow-xs`).
* Inactive item: Soft grey (`text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50`).
* Immediate, synchronous step clamping on selection to eliminate 1-frame visual desync.

### B. Precision Steppers & Range Sliders
* Thumb target: 18px circular thumb with subtle drop-shadow (`box-shadow: 0 1px 3px rgba(0,0,0,0.25)`).
* Complementary Touch Steppers: 32px × 32px `[-]` and `[+]` buttons flanking every range input to allow 1-tap micro-adjustments on mobile screens without dragging.

### C. Clean Shift Cash Yield Callout
* Rendered in soft emerald (`bg-emerald-50/90 border border-emerald-200/80`).
* Directly displays the marginal net gain after tax and NI:
  $$\text{Net Shift Yield} = \text{Net Pay}_{\text{with shifts}} - \text{Net Pay}_{\text{day worker}}$$
* Distinct from gross uplift so healthcare workers know the exact cash landing in their account.

### D. Official ESR Payslip Replica View
* High-fidelity emulation of the NHS Electronic Staff Record (ESR) pay advice.
* Dot-matrix and monospaced typography with authentic NHS header badge (`#005EB8`).
* Two-column split: Payments on left, Statutory Deductions on right.
* Action buttons: One-click formatted WhatsApp/SMS copy, plus 1-page printable PDF export.

### E. Side-by-Side Promotion Comparator (`ScenarioComparator`)
* Mode switcher tab: `[ Interactive Calculator | Compare Scenarios ]`.
* Scenario A (Current post) vs Scenario B (Proposed post).
* Delta metrics: Net Take-Home Change ($+/-$), Gross Pay Shift, and Pay Rise Retention Rate.
* Pension tier shift alert with cost impact.

---

## 6. Motion & Micro-Interactions (Emil Kowalski Philosophy)

* **Physical Button Press:** Active buttons scale down slightly on press:
  ```css
  active:scale-[0.97] transition-all duration-150 ease-out
  ```
* **Drawer & Modal Transitions:**
  ```css
  animate-in fade-in slide-in-from-bottom duration-200 ease-out
  ```
* **Visual Breakdown Bar:** Smooth proportional transition when inputs change:
  ```css
  transition-all duration-300 ease-out
  ```
* **Zero Laying Jitter:** All numerical containers use fixed tabular number widths (`tabular-nums`) to prevent shifting neighboring elements during slider dragging.

---

## 7. Print & Document Export Standards

The design system incorporates dedicated `@media print` rules in `app/globals.css`:
* When printing, all website chrome (navigation, footer, sticky ads, input controls) is completely hidden.
* Only the `#esr-payslip-print` container is isolated and formatted onto a single, crisp, high-resolution A4 page for bank and mortgage verification.
