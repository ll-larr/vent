# Vent Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full from-scratch redesign of the Vent ventilation-cleaning B2B landing site per [spec](../specs/2026-05-15-vent-redesign-design.md) — new visual system, new structure, adaptive pricing calculator, prefilled form, SEO essentials.

**Architecture:** Next.js 14 App Router single-page landing at `/` + dedicated `/calculator` route, shared calculator state via React Context + useReducer, pure pricing engine in `src/lib/pricing.ts` (unit-tested). Old components are kept in tree until new ones replace their consumer (page.tsx) in a single swap, then removed.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind, shadcn/ui (Radix primitives), React Hook Form + Zod, lucide-react, googleapis (Sheets). Adds **vitest** for unit-testing the pricing engine.

**Visual references** (open in browser before starting):
- `design-preview.html` — 4 visual directions + Hybrid (chosen)
- `palette-preview.html` — 4 palettes, A (cream + brand-green + lime) is locked
- `calc-preview.html` — 3 calculator patterns, Pattern 1 (Mini + Full) is locked

---

## File Structure (target)

```
src/
├── app/
│   ├── page.tsx                        # REWRITE — single-page landing
│   ├── layout.tsx                      # MODIFY — fonts, metadata, JSON-LD root
│   ├── globals.css                     # MODIFY — add new keyframes
│   ├── calculator/page.tsx             # NEW
│   ├── contacts/page.tsx               # MODIFY — minor cleanup
│   ├── privacy/page.tsx                # UNCHANGED
│   ├── api/submit/route.ts             # MODIFY — drop email field
│   ├── sitemap.ts                      # NEW
│   ├── robots.ts                       # NEW
│   └── opengraph-image.tsx             # NEW
│
├── components/
│   ├── Header/Header.tsx               # REWRITE
│   ├── Hero/Hero.tsx                   # REWRITE (composes MiniCalculator)
│   ├── Services/Services.tsx           # REWRITE
│   ├── Cases/Cases.tsx                 # NEW (replaces Portfolio)
│   ├── Calculator/
│   │   ├── Calculator.tsx              # NEW
│   │   ├── MiniCalculator.tsx          # NEW
│   │   ├── PackageChips.tsx            # NEW
│   │   ├── ServiceList.tsx             # NEW
│   │   ├── AreaInput.tsx               # NEW
│   │   └── PriceResult.tsx             # NEW
│   ├── BigVenues/BigVenues.tsx         # NEW
│   ├── HowWeWork/HowWeWork.tsx         # REWRITE
│   ├── TrustSection/TrustSection.tsx   # NEW (Stats + Licenses merged)
│   ├── ContactSection/ContactSection.tsx  # MODIFY
│   ├── ContactForm/ContactForm.tsx     # MODIFY (drop email, prefill)
│   ├── Footer/Footer.tsx               # REWRITE
│   └── ui/                             # shadcn primitives (existing)
│
├── lib/
│   ├── pricing.ts                      # NEW (TDD)
│   ├── calculator-context.tsx          # NEW
│   ├── schema.ts                       # NEW (JSON-LD)
│   ├── icons.tsx                       # MODIFY (add icons)
│   ├── nav.tsx                         # MODIFY (anchors)
│   ├── sheets.ts                       # MODIFY (drop email)
│   ├── useScrollAnim.ts                # UNCHANGED
│   └── useCounter.ts                   # UNCHANGED
│
├── data/
│   ├── services.ts                     # NEW
│   ├── packages.ts                     # NEW
│   ├── cases.ts                        # NEW
│   └── venues.ts                       # NEW
│
└── (DELETE in final task)
    ├── components/Portfolio/
    ├── components/Reviews/
    ├── components/Promos/
    ├── components/Stats/
    ├── components/About/
    └── components/HomeOrchestrator/

tailwind.config.ts                      # MODIFY (palette, fonts)
vitest.config.ts                        # NEW
package.json                            # MODIFY (vitest + script)
```

---

## Task 1: Set up Vitest

**Why:** The pricing engine has nontrivial branching (linear/unit/fixed, per-package coefficient, diameter tiers). Unit tests guarantee no regressions when prices or matrix change. No UI tests in scope.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/pricing.test.ts` (placeholder, real tests in Task 7)

- [ ] **Step 1: Install vitest**

```bash
npm install --save-dev vitest @vitest/ui
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Add npm script to `package.json`**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create placeholder test file `src/lib/pricing.test.ts`**

```ts
import { describe, it, expect } from 'vitest';

describe('pricing', () => {
  it('placeholder — implemented in Task 7', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 5: Verify vitest runs**

```bash
npm test
```
Expected: `1 passed`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/pricing.test.ts
git commit -m "chore: add vitest for unit tests"
```

---

## Task 2: Update Tailwind tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace the `theme.extend.colors` block with the spec palette**

```ts
colors: {
  bg:          '#f6f3ec',
  ink:         '#141312',
  brand:       '#1e5c32',
  'brand-dark':'#0f3d22',
  accent:      '#c8ff3e',
  surface:     '#ffffff',
  mute:        '#5a6b5e',
  line:        'rgba(20,19,18,0.08)',
  // keep stone for compatibility during migration
  stone:       '#f4f4f2',
},
```

- [ ] **Step 2: Replace `theme.extend.fontFamily` to reference next/font CSS variables**

```ts
fontFamily: {
  display: ['var(--font-fraunces)', 'serif'],
  sans:    ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
  mono:    ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
},
```

- [ ] **Step 3: Verify `borderRadius`, `boxShadow`, and existing tokens — leave as-is**

The spec keeps existing `card` (16px), `xl2` (24px), `pill` (980px) radii and `card`, `lifted`, `float` shadows. Confirm they're still in the file.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts
git commit -m "chore: update Tailwind palette and fontFamily tokens to redesign spec"
```

---

## Task 3: Configure next/font

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the existing font imports at the top of `layout.tsx` with three `next/font/google` calls**

```ts
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin', 'cyrillic'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600'],
});

const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter-tight',
  weight: ['400', '500', '600', '700'],
});

const jetMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
});
```

- [ ] **Step 2: Apply the variables on `<html>`**

In the `RootLayout` JSX, set:
```tsx
<html lang="ru" className={`${fraunces.variable} ${interTight.variable} ${jetMono.variable}`}>
  <body className="font-sans bg-bg text-ink antialiased">
    {children}
  </body>
</html>
```

- [ ] **Step 3: Verify dev server compiles**

```bash
npm run dev
```
Open `http://localhost:3000` — page renders without font-loading errors in the console.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "chore: load Fraunces, Inter Tight, JetBrains Mono via next/font"
```

---

## Task 4: Add new icons to icons.tsx

**Files:**
- Modify: `src/lib/icons.tsx`

- [ ] **Step 1: Add re-exports for icons referenced in the spec**

Append to the existing exports:

```ts
export {
  ClipboardList,   // How-we-work step 1 — Заявка
  Eye,             // step 2 — Осмотр
  Sparkles,        // step 3 — Чистка
  FileCheck,       // step 4 — Протокол
  ArrowRight,      // CTAs
  ArrowDown,       // "подробный расчёт ↓"
  Plus, Minus,     // hood stepper
  Check,           // service checkbox
  Info,            // diameter tooltip
  X,               // close (mobile drawer)
  Menu,            // burger
  Phone, MapPin, Mail,   // contacts
  ChevronRight,    // breadcrumb
} from 'lucide-react';
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/icons.tsx
git commit -m "chore: re-export additional lucide icons used by the redesign"
```

---

## Task 5: Add scroll-reveal keyframes (verify existing)

**Files:**
- Modify (verify): `src/app/globals.css`

- [ ] **Step 1: Open `globals.css` and confirm the existing `[data-anim]` system is present**

It should already contain:
```css
[data-anim] { opacity: 0; transform: translateY(12px); transition: opacity .55s ease-out, transform .55s ease-out; }
[data-anim].visible { opacity: 1; transform: translateY(0); }
```

- [ ] **Step 2: Add `prefers-reduced-motion` guard at the bottom of the file**

```css
@media (prefers-reduced-motion: reduce) {
  [data-anim], [data-anim].visible { opacity: 1; transform: none; transition: none; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 3: Add a `pulse` keyframe used by live indicators (calculator badge, online dot)**

```css
@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
.animate-pulse-soft { animation: pulse 1.8s ease-in-out infinite; }
```

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "chore: add reduced-motion guard and pulse keyframe to globals.css"
```

---

## Task 6: Create data files

**Files:**
- Create: `src/data/services.ts`, `src/data/packages.ts`, `src/data/cases.ts`, `src/data/venues.ts`

- [ ] **Step 1: Create `src/data/services.ts`**

```ts
import { ServiceKey } from '@/lib/pricing';

export type ServiceDisplay = {
  key: ServiceKey;
  title: string;
  description: string;
  iconName: 'Wind' | 'Hood' | 'Spray' | 'Stethoscope' | 'ShieldCheck';
};

export const SERVICE_DISPLAY: Record<ServiceKey, ServiceDisplay> = {
  grease: {
    key: 'grease',
    title: 'Чистка вентиляции от жира',
    description: 'Для кухонь общепита. Удаляем жировые отложения до металла по протоколу СЭС.',
    iconName: 'Wind',
  },
  dust: {
    key: 'dust',
    title: 'Чистка вентиляции от пыли',
    description: 'Для офисов и складов. Восстанавливаем воздухообмен, убираем аллергены.',
    iconName: 'Wind',
  },
  hood: {
    key: 'hood',
    title: 'Чистка вытяжек и зонтов',
    description: 'Профессиональная мойка зонтов пищеблока с разбором и сборкой.',
    iconName: 'Hood',
  },
  disinfect: {
    key: 'disinfect',
    title: 'Дезинфекция воздуховодов',
    description: 'Противомикробная обработка после чистки. Для производства и медицинских объектов.',
    iconName: 'Spray',
  },
  diag: {
    key: 'diag',
    title: 'Диагностика / видеоинспекция',
    description: 'Видеоконтроль каналов перед чисткой. Отчёт с фото и состоянием системы.',
    iconName: 'Stethoscope',
  },
};
```

- [ ] **Step 2: Create `src/data/packages.ts`** (re-exports + display labels — pricing lives in `src/lib/pricing.ts`)

```ts
import { PackageKey } from '@/lib/pricing';

export type PackageDisplay = {
  key: PackageKey;
  title: string;
  description: string;
};

export const PACKAGE_DISPLAY: Record<PackageKey, PackageDisplay> = {
  restaurant: { key: 'restaurant', title: 'Общепит',     description: 'кухня, зонты, жировые отложения' },
  office:     { key: 'office',     title: 'Офис',        description: 'пыль, аллергены, кондиционеры' },
  warehouse:  { key: 'warehouse',  title: 'Производство',description: 'пыль и дезинфекция' },
  custom:     { key: 'custom',     title: 'Своё',        description: 'соберите пакет сами' },
};
```

- [ ] **Step 3: Create `src/data/cases.ts`** — before/after stories

```ts
export type CaseStudy = {
  id: string;
  title: string;
  venueType: string;
  beforeSrc: string;
  afterSrc: string;
  description: string;
};

export const CASES: CaseStudy[] = [
  {
    id: 'grease1',
    title: 'Ресторан в БЦ',
    venueType: 'Общепит · 220 м²',
    beforeSrc: '/images/compare-grease1-before.jpg',
    afterSrc:  '/images/compare-grease1-after.jpg',
    description: 'Чистка вытяжных зонтов и воздуховодов от жира после 3 лет без обслуживания.',
  },
  {
    id: 'grease2',
    title: 'Сеть кафе',
    venueType: 'Общепит · 150 м²',
    beforeSrc: '/images/compare-grease2-before.jpg',
    afterSrc:  '/images/compare-grease2-after.jpg',
    description: 'Плановая полугодовая чистка кухонной вытяжной системы.',
  },
  {
    id: 'dust',
    title: 'Офис в БЦ',
    venueType: 'Офис · 480 м²',
    beforeSrc: '/images/compare-dust-before.jpg',
    afterSrc:  '/images/compare-dust-after.jpg',
    description: 'Чистка вентканалов от пыли после 5 лет эксплуатации.',
  },
];
```

- [ ] **Step 4: Create `src/data/venues.ts`** — big-venue strip

```ts
export type Venue = { id: string; name: string; src: string; alt: string };

export const VENUES: Venue[] = [
  { id: 'gazprom',  name: 'Газпром Арена', src: '/images/trust-gazprom.jpg',  alt: 'Газпром Арена — стадион' },
  { id: 'miratorg', name: 'Мираторг',      src: '/images/trust-miratorg.jpg', alt: 'Мираторг — производство' },
  { id: 'multon',   name: 'Мультон',       src: '/images/trust-multon.jpg',   alt: 'Мультон — производство' },
  { id: 'ska',      name: 'СКА',           src: '/images/trust-ska.jpg',      alt: 'СКА — ледовая арена' },
];
```

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "feat: add data files for services, packages, cases, and venues"
```

---

## Task 7: Build pricing engine (TDD)

**Files:**
- Create: `src/lib/pricing.ts`
- Rewrite: `src/lib/pricing.test.ts`

This task is fully test-driven. Each sub-task writes a failing test, then minimal code to pass.

- [ ] **Step 1: Replace `src/lib/pricing.test.ts` with the full test suite**

```ts
import { describe, it, expect } from 'vitest';
import { computePrice, PACKAGES, SERVICES, type ServiceKey } from './pricing';

describe('SERVICES catalog', () => {
  it('has all five expected services', () => {
    expect(Object.keys(SERVICES).sort()).toEqual(['diag', 'disinfect', 'dust', 'grease', 'hood'].sort());
  });

  it('grease and dust have diameter tiers', () => {
    expect(SERVICES.grease.diameterTiers).toHaveLength(4);
    expect(SERVICES.dust.diameterTiers).toHaveLength(4);
  });
});

describe('PACKAGES catalog', () => {
  it('exposes per-package m²→пог.м coefficient', () => {
    expect(PACKAGES.restaurant.m2ToLm).toBe(0.45);
    expect(PACKAGES.office.m2ToLm).toBe(0.30);
    expect(PACKAGES.warehouse.m2ToLm).toBe(0.25);
    expect(PACKAGES.custom.m2ToLm).toBe(0.30);
  });

  it('restaurant default selects grease and hood', () => {
    expect(PACKAGES.restaurant.default).toEqual(['grease', 'hood']);
  });
});

describe('computePrice — linear services', () => {
  it('grease at 180 m² restaurant uses 0.45 coef and 300 min', () => {
    const r = computePrice(['grease'], 180, 'restaurant');
    // 180 * 0.45 * 300 = 24300, rounded to nearest 100 = 24300
    expect(r.totalMin).toBe(24300);
    expect(r.breakdown).toEqual([{ key: 'grease', label: 'Чистка вентиляции от жира', amount: 24300 }]);
  });

  it('dust at 480 m² office uses 0.30 coef and 100 min', () => {
    const r = computePrice(['dust'], 480, 'office');
    // 480 * 0.30 * 100 = 14400
    expect(r.totalMin).toBe(14400);
  });

  it('disinfect at 200 m² warehouse uses 0.25 coef and 30 rate', () => {
    const r = computePrice(['disinfect'], 200, 'warehouse');
    // 200 * 0.25 * 30 = 1500
    expect(r.totalMin).toBe(1500);
  });
});

describe('computePrice — unit and fixed services', () => {
  it('hood multiplies by hoodCount', () => {
    const r = computePrice(['hood'], 0, 'restaurant', 3);
    expect(r.totalMin).toBe(3000);
  });

  it('diag is a fixed 4500', () => {
    const r = computePrice(['diag'], 100, 'office');
    expect(r.totalMin).toBe(4500);
  });
});

describe('computePrice — combined', () => {
  it('restaurant grease + 3 hoods at 180 m² = 27 300', () => {
    const r = computePrice(['grease', 'hood'], 180, 'restaurant', 3);
    expect(r.totalMin).toBe(27300);
    expect(r.breakdown).toHaveLength(2);
  });
});

describe('computePrice — rounding', () => {
  it('rounds linear lines to nearest 100', () => {
    // 50 m² * 0.30 * 100 = 1500 (already exact)
    expect(computePrice(['dust'], 50, 'office').totalMin).toBe(1500);
    // 77 m² * 0.30 * 100 = 2310 → rounds to 2300
    expect(computePrice(['dust'], 77, 'office').totalMin).toBe(2300);
  });
});

describe('computePrice — edge cases', () => {
  it('returns 0 with empty service list', () => {
    const r = computePrice([], 100, 'custom');
    expect(r.totalMin).toBe(0);
    expect(r.breakdown).toEqual([]);
  });

  it('ignores hoodCount when hood is not selected', () => {
    const r = computePrice(['dust'], 100, 'office', 5);
    expect(r.totalMin).toBe(3000); // pure dust calc
  });
});
```

- [ ] **Step 2: Run tests, confirm all fail**

```bash
npm test
```
Expected: all tests fail with module-not-found or undefined-export errors.

- [ ] **Step 3: Create `src/lib/pricing.ts`**

```ts
export type ServiceKey = 'grease' | 'dust' | 'disinfect' | 'hood' | 'diag';
export type PackageKey = 'restaurant' | 'office' | 'warehouse' | 'custom';

type LinearService = {
  kind: 'linear';
  min: number;
  max: number;
  label: string;
  hint: string;
  diameterTiers?: { code: string; label: string; rate: number }[];
};
type UnitService  = { kind: 'unit';  price: number; label: string; hint: string };
type FixedService = { kind: 'fixed'; price: number; label: string; hint: string };
export type Service = LinearService | UnitService | FixedService;

export const SERVICES: Record<ServiceKey, Service> = {
  grease: {
    kind: 'linear', min: 300, max: 400,
    label: 'Чистка вентиляции от жира',
    hint: 'для кухонь общепита',
    diameterTiers: [
      { code: 'pipe-small', label: 'труба Ø ≤ 600 мм',   rate: 300 },
      { code: 'box-small',  label: 'короб ≤ 600×400 мм', rate: 350 },
      { code: 'pipe-large', label: 'труба Ø > 600 мм',   rate: 400 },
      { code: 'box-large',  label: 'короб > 600×400 мм', rate: 400 },
    ],
  },
  dust: {
    kind: 'linear', min: 100, max: 220,
    label: 'Чистка вентиляции от пыли',
    hint: 'для офисов и складов',
    diameterTiers: [
      { code: 'pipe-small', label: 'труба Ø ≤ 600 мм',   rate: 100 },
      { code: 'box-small',  label: 'короб ≤ 600×400 мм', rate: 120 },
      { code: 'pipe-large', label: 'труба Ø > 600 мм',   rate: 180 },
      { code: 'box-large',  label: 'короб > 600×400 мм', rate: 220 },
    ],
  },
  disinfect: { kind: 'linear', min: 30, max: 30, label: 'Дезинфекция',                  hint: 'противомикробная обработка воздуховодов' },
  hood:      { kind: 'unit',   price: 1000,      label: 'Чистка вытяжек / зонтов',     hint: 'за каждый зонт пищеблока' },
  diag:      { kind: 'fixed',  price: 4500,      label: 'Диагностика / видеоинспекция',hint: 'осмотр и видеоконтроль каналов перед чисткой' },
};

export type Package = {
  label: string;
  m2ToLm: number;
  default: ServiceKey[];
  available: ServiceKey[];
};

export const PACKAGES: Record<PackageKey, Package> = {
  restaurant: { label: 'Общепит',      m2ToLm: 0.45, default: ['grease', 'hood'],    available: ['grease', 'hood', 'dust', 'diag'] },
  office:     { label: 'Офис',         m2ToLm: 0.30, default: ['dust'],              available: ['dust', 'diag'] },
  warehouse:  { label: 'Производство', m2ToLm: 0.25, default: ['dust', 'disinfect'], available: ['dust', 'disinfect', 'grease', 'diag'] },
  custom:     { label: 'Своё',         m2ToLm: 0.30, default: [],                    available: ['grease', 'dust', 'hood', 'disinfect', 'diag'] },
};

export type PriceLine = { key: ServiceKey; label: string; amount: number };
export type PriceComputation = { totalMin: number; breakdown: PriceLine[] };

const round100 = (n: number) => Math.round(n / 100) * 100;

export function computePrice(
  services: ServiceKey[],
  areaM2: number,
  packageKey: PackageKey,
  hoodCount: number = 1,
): PriceComputation {
  const coef = PACKAGES[packageKey].m2ToLm;
  const breakdown: PriceLine[] = [];

  for (const key of services) {
    const s = SERVICES[key];
    let amount = 0;
    if (s.kind === 'linear') {
      amount = round100(areaM2 * coef * s.min);
    } else if (s.kind === 'unit') {
      amount = hoodCount * s.price;
    } else {
      amount = s.price;
    }
    breakdown.push({ key, label: s.label, amount });
  }

  const totalMin = breakdown.reduce((sum, line) => sum + line.amount, 0);
  return { totalMin, breakdown };
}
```

- [ ] **Step 4: Run tests, confirm all pass**

```bash
npm test
```
Expected: all 12+ tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/pricing.ts src/lib/pricing.test.ts
git commit -m "feat: add pricing engine with per-package coefficients and diameter tiers"
```

---

## Task 8: Build calculator context

**Files:**
- Create: `src/lib/calculator-context.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PACKAGES, type PackageKey, type ServiceKey } from './pricing';

export type CalcState = {
  packageKey: PackageKey;
  services: ServiceKey[];
  areaM2: number;
  hoodCount: number;
};

export type CalcAction =
  | { type: 'SET_PACKAGE'; key: PackageKey }
  | { type: 'TOGGLE_SERVICE'; key: ServiceKey }
  | { type: 'SET_AREA'; value: number }
  | { type: 'SET_HOOD_COUNT'; value: number };

export const INITIAL_STATE: CalcState = {
  packageKey: 'restaurant',
  services: PACKAGES.restaurant.default.slice(),
  areaM2: 180,
  hoodCount: 3,
};

function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'SET_PACKAGE': {
      return {
        ...state,
        packageKey: action.key,
        services: PACKAGES[action.key].default.slice(),
        hoodCount: PACKAGES[action.key].default.includes('hood') ? state.hoodCount : 1,
      };
    }
    case 'TOGGLE_SERVICE': {
      const exists = state.services.includes(action.key);
      const services = exists
        ? state.services.filter(s => s !== action.key)
        : [...state.services, action.key];
      return { ...state, services };
    }
    case 'SET_AREA':
      return { ...state, areaM2: action.value };
    case 'SET_HOOD_COUNT':
      return { ...state, hoodCount: Math.max(1, Math.min(20, action.value)) };
  }
}

type Ctx = { state: CalcState; dispatch: React.Dispatch<CalcAction> };
const CalculatorContext = createContext<Ctx | null>(null);

export function CalculatorProvider({ children, initial }: { children: ReactNode; initial?: Partial<CalcState> }) {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE, ...initial });
  return <CalculatorContext.Provider value={{ state, dispatch }}>{children}</CalculatorContext.Provider>;
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error('useCalculator must be used inside CalculatorProvider');
  return ctx;
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/calculator-context.tsx
git commit -m "feat: add CalculatorContext with reducer for package/services/area/hoods state"
```

---

## Task 9: Update sheets.ts and submit API (drop email)

**Files:**
- Modify: `src/lib/sheets.ts`
- Modify: `src/app/api/submit/route.ts`

- [ ] **Step 1: Open `src/lib/sheets.ts`. Update the row-shape so it has no email column. Update the column-mapping comment.**

The expected row layout (new):

| Timestamp | Name | Phone | Package | Area (m²) | Services | Comment |

Update `sheets.ts` to map `payload` fields in that order, omitting any prior `email` field.

- [ ] **Step 2: Open `src/app/api/submit/route.ts`. Update the Zod schema for the POST body to remove `email` and require `packageKey`, `areaM2`, `services` (array of strings), `name`, `phone`, optional `comment`, and `consent: true`.**

```ts
import { z } from 'zod';

const SubmitSchema = z.object({
  name: z.string().min(1).max(60),
  phone: z.string().regex(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/),
  packageKey: z.enum(['restaurant', 'office', 'warehouse', 'custom']),
  areaM2: z.number().int().min(20).max(5000),
  services: z.array(z.enum(['grease','dust','disinfect','hood','diag'])).min(1),
  comment: z.string().max(500).optional(),
  consent: z.literal(true),
});
```

Wire the validated payload into `appendRow` from `sheets.ts` in the new column order.

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/sheets.ts src/app/api/submit/route.ts
git commit -m "feat: drop email column from form submission and Sheets payload"
```

---

## Task 10: Build PackageChips component

**Files:**
- Create: `src/components/Calculator/PackageChips.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client';

import { useCalculator } from '@/lib/calculator-context';
import { PACKAGES, type PackageKey } from '@/lib/pricing';

type Variant = 'mini' | 'full';

export function PackageChips({ variant = 'mini' }: { variant?: Variant }) {
  const { state, dispatch } = useCalculator();
  const keys = Object.keys(PACKAGES) as PackageKey[];

  if (variant === 'mini') {
    return (
      <div className="flex gap-1.5 flex-wrap mb-3.5">
        {keys.map(k => (
          <button
            key={k}
            type="button"
            aria-pressed={state.packageKey === k}
            onClick={() => dispatch({ type: 'SET_PACKAGE', key: k })}
            className={`px-3 py-1.5 text-[13px] rounded-full transition-colors border ${
              state.packageKey === k
                ? 'bg-ink text-bg border-ink'
                : 'bg-ink/[.05] text-ink/75 border-transparent hover:border-ink/15'
            }`}
          >
            {PACKAGES[k].label}
          </button>
        ))}
      </div>
    );
  }

  // full
  return (
    <div className="grid grid-cols-2 gap-2 mb-6">
      {keys.map(k => (
        <button
          key={k}
          type="button"
          aria-pressed={state.packageKey === k}
          onClick={() => dispatch({ type: 'SET_PACKAGE', key: k })}
          className={`text-left p-4 rounded-2xl border transition-colors ${
            state.packageKey === k
              ? 'bg-ink text-bg border-ink'
              : 'bg-surface text-ink border-ink/10 hover:border-ink'
          }`}
        >
          <div className="font-medium text-[15px]">{PACKAGES[k].label}</div>
          <div className="text-[12px] opacity-60 mt-1">
            {k === 'restaurant' && 'кухня + зонты + жир'}
            {k === 'office' && 'пыль + кондиционеры'}
            {k === 'warehouse' && 'пыль + дезинфекция'}
            {k === 'custom' && 'соберу сам'}
          </div>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Calculator/PackageChips.tsx
git commit -m "feat: add PackageChips component for calculator"
```

---

## Task 11: Build ServiceList component

**Files:**
- Create: `src/components/Calculator/ServiceList.tsx`

This component renders only services available for the current package. Each service is a clickable row with a custom checkbox. For services with `diameterTiers` (grease, dust), an `Info` icon reveals a tooltip with the per-diameter rates.

- [ ] **Step 1: Create the file**

```tsx
'use client';

import { useCalculator } from '@/lib/calculator-context';
import { PACKAGES, SERVICES, type ServiceKey } from '@/lib/pricing';
import { Info, Check } from '@/lib/icons';

function formatRate(s: typeof SERVICES[ServiceKey]): string {
  if (s.kind === 'linear') return `от ${s.min} ₽/пог.м`;
  if (s.kind === 'unit')   return `от ${s.price} ₽/шт`;
  return `${s.price} ₽`;
}

export function ServiceList() {
  const { state, dispatch } = useCalculator();
  const available = PACKAGES[state.packageKey].available;

  return (
    <ul className="flex flex-col gap-2 mb-6" role="group" aria-label="Услуги">
      {available.map(key => {
        const s = SERVICES[key];
        const active = state.services.includes(key);
        return (
          <li key={key}>
            <button
              type="button"
              role="checkbox"
              aria-checked={active}
              onClick={() => dispatch({ type: 'TOGGLE_SERVICE', key })}
              className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-colors border ${
                active ? 'bg-accent/15 border-brand/20' : 'bg-ink/[.03] border-transparent hover:bg-ink/[.06]'
              }`}
            >
              <span className={`w-5.5 h-5.5 rounded-md border-[1.5px] flex items-center justify-center flex-shrink-0 ${
                active ? 'bg-brand border-brand' : 'border-ink/20 bg-white'
              }`} style={{ width: 22, height: 22 }}>
                {active && <Check size={14} strokeWidth={3} color="#fff" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-[15px]">{s.label}</span>
                <span className="block text-[12px] text-ink/55 mt-0.5">{s.hint}</span>
              </span>
              <span className="font-mono text-[12px] text-ink/55 flex items-center gap-1.5 flex-shrink-0">
                {formatRate(s)}
                {s.kind === 'linear' && 'diameterTiers' in s && s.diameterTiers && (
                  <span
                    className="cursor-help"
                    title={s.diameterTiers.map(t => `${t.label} — ${t.rate}`).join('; ') + ' ₽/пог.м · точно определим при осмотре'}
                  >
                    <Info size={13} strokeWidth={1.5} />
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Calculator/ServiceList.tsx
git commit -m "feat: add ServiceList with adaptive filtering and diameter tooltip"
```

---

## Task 12: Build AreaInput component

**Files:**
- Create: `src/components/Calculator/AreaInput.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client';

import { useCalculator } from '@/lib/calculator-context';

type Variant = 'mini' | 'full';

export function AreaInput({ variant = 'mini' }: { variant?: Variant }) {
  const { state, dispatch } = useCalculator();
  const setArea = (v: number) => dispatch({ type: 'SET_AREA', value: v });

  if (variant === 'mini') {
    return (
      <div className="flex justify-between items-center px-3.5 py-3 bg-bg rounded-[10px] font-mono text-[13px] text-ink/55">
        <label htmlFor="area-mini">площадь, м²</label>
        <input
          id="area-mini"
          type="number"
          min={20}
          max={5000}
          value={state.areaM2 || ''}
          onChange={e => setArea(parseInt(e.target.value) || 0)}
          className="font-display font-normal text-[22px] bg-transparent border-none w-[90px] text-right text-ink focus:outline-none"
        />
      </div>
    );
  }

  // full
  return (
    <div>
      <div className="flex items-center gap-3.5 bg-bg border border-transparent focus-within:border-ink rounded-[14px] pl-4.5 pr-2 py-2 transition-colors">
        <label htmlFor="area-full" className="flex-1 font-mono text-[12px] uppercase tracking-[.1em] text-ink/55">площадь</label>
        <input
          id="area-full"
          type="number"
          min={20}
          max={5000}
          value={state.areaM2 || ''}
          onChange={e => setArea(parseInt(e.target.value) || 0)}
          className="font-display font-light text-[32px] bg-transparent border-none w-[120px] text-right text-ink focus:outline-none"
        />
        <span className="font-mono text-[14px] text-ink/55 px-3 py-2">м²</span>
      </div>
      <p className="text-[13px] text-ink/50 mt-2">Площадь вашего ресторана, офиса или объекта.</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Calculator/AreaInput.tsx
git commit -m "feat: add AreaInput component with mini and full variants"
```

---

## Task 13: Build PriceResult component

**Files:**
- Create: `src/components/Calculator/PriceResult.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client';

import { useCalculator } from '@/lib/calculator-context';
import { computePrice } from '@/lib/pricing';
import { Plus, Minus, ArrowRight } from '@/lib/icons';

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n);

export function PriceResult({ variant = 'mini' }: { variant?: 'mini' | 'full' }) {
  const { state, dispatch } = useCalculator();
  const valid = state.areaM2 >= 20 && state.areaM2 <= 5000;
  const result = computePrice(state.services, state.areaM2, state.packageKey, state.hoodCount);
  const hasHood = state.services.includes('hood');

  const message =
    state.areaM2 < 20  ? 'минимум 20 м²'  :
    state.areaM2 > 5000? 'крупные объекты — звоните +7 (000) 000-00-00' :
    state.services.length === 0 ? 'выберите услуги' : null;

  const isFixedOnly = state.services.length === 1 && state.services[0] === 'diag';
  const fromLabel = isFixedOnly ? '' : 'от ';

  if (variant === 'mini') {
    return (
      <div className="flex justify-between items-end mt-4.5 pt-3.5 border-t border-ink/8" aria-live="polite">
        <span className="font-display font-normal text-[36px] leading-none tracking-[-.02em]">
          {message ? (
            <span className="text-[15px] text-ink/55 font-sans">{message}</span>
          ) : (
            <>
              {fromLabel}
              <em className="italic text-brand">{fmt(result.totalMin)}</em>
              &nbsp;₽
            </>
          )}
        </span>
        {!message && <small className="font-mono text-[10px] uppercase tracking-[.15em] text-ink/45">точно — после осмотра</small>}
      </div>
    );
  }

  // full
  return (
    <aside className="bg-ink text-bg rounded-3xl p-7 flex flex-col gap-4.5 sticky top-6" aria-live="polite">
      <span className="font-mono text-[11px] uppercase tracking-[.15em] opacity-55">ориентировочная стоимость</span>
      {message ? (
        <span className="font-display font-light text-[40px] leading-none tracking-[-.025em]">
          <span className="text-base opacity-70">{message}</span>
        </span>
      ) : (
        <>
          <span className="font-display font-light text-[64px] leading-none tracking-[-.025em]">
            {fromLabel}<em className="italic text-accent not-italic">{fmt(result.totalMin)}</em>&nbsp;₽
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[.1em] opacity-55">точная — после осмотра</span>

          <div className="flex flex-col gap-1.5 pt-3.5 border-t border-dashed border-white/15 text-[13px]">
            {result.breakdown.map(line => (
              <div key={line.key} className="flex justify-between opacity-80">
                <span className="flex items-center gap-2">
                  {line.label}
                  {line.key === 'hood' && hasHood && (
                    <span className="inline-flex items-center gap-1 ml-1">
                      ×
                      <button type="button" aria-label="убавить" onClick={() => dispatch({ type: 'SET_HOOD_COUNT', value: state.hoodCount - 1 })} className="px-1"><Minus size={12} /></button>
                      <span className="font-mono">{state.hoodCount}</span>
                      <button type="button" aria-label="прибавить" onClick={() => dispatch({ type: 'SET_HOOD_COUNT', value: state.hoodCount + 1 })} className="px-1"><Plus size={12} /></button>
                    </span>
                  )}
                </span>
                <b className="font-mono font-normal">~ {fmt(line.amount)} ₽</b>
              </div>
            ))}
          </div>
        </>
      )}
      <a href="#contact" className="bg-accent text-ink p-4.5 rounded-[14px] font-semibold text-[16px] flex items-center justify-center gap-2.5 hover:bg-white transition-colors mt-2">
        Оставить заявку <ArrowRight size={18} strokeWidth={2} />
      </a>
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Calculator/PriceResult.tsx
git commit -m "feat: add PriceResult with breakdown, hood stepper, and edge-case messaging"
```

---

## Task 14: Build Calculator orchestrator and MiniCalculator

**Files:**
- Create: `src/components/Calculator/Calculator.tsx`
- Create: `src/components/Calculator/MiniCalculator.tsx`

- [ ] **Step 1: Create `MiniCalculator.tsx`**

```tsx
'use client';

import { PackageChips } from './PackageChips';
import { AreaInput } from './AreaInput';
import { PriceResult } from './PriceResult';
import { ArrowDown } from '@/lib/icons';

export function MiniCalculator() {
  return (
    <div className="bg-surface rounded-[20px] p-6 shadow-[0_1px_0_rgba(0,0,0,.04),0_8px_24px_rgba(0,0,0,.05)]">
      <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3.5 flex justify-between items-center">
        <span>калькулятор</span>
        <span className="inline-flex items-center gap-1.5 text-brand">
          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-soft"></span>
          live
        </span>
      </div>
      <PackageChips variant="mini" />
      <AreaInput variant="mini" />
      <PriceResult variant="mini" />
      <a href="#calculator" className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-brand">
        подробный расчёт <ArrowDown size={13} strokeWidth={2} />
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Create `Calculator.tsx`** (full version, used in landing section #4 and in `/calculator` page)

```tsx
'use client';

import { PackageChips } from './PackageChips';
import { ServiceList } from './ServiceList';
import { AreaInput } from './AreaInput';
import { PriceResult } from './PriceResult';

export function Calculator() {
  return (
    <section id="calculator" className="bg-ink/[.03] py-24" data-anim>
      <div className="max-w-[1100px] mx-auto px-5 lg:px-0">
        <div className="bg-surface rounded-[32px] p-7 md:p-12 shadow-[0_2px_0_rgba(0,0,0,.03),0_24px_60px_rgba(0,0,0,.06)]">
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
            <span className="w-3.5 h-px bg-brand inline-block"></span>
            калькулятор стоимости
          </div>
          <h2 className="font-display font-light text-[clamp(36px,4.5vw,64px)] leading-none tracking-[-.02em] mb-2">
            Сколько это <em className="italic text-brand">стоит?</em>
          </h2>
          <p className="text-ink/60 text-[15px] mb-9">Выберите пакет, скорректируйте список услуг, укажите площадь — увидите вилку цены до осмотра.</p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">1 / тип объекта</div>
              <PackageChips variant="full" />
              <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">2 / услуги</div>
              <ServiceList />
              <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">3 / площадь объекта</div>
              <AreaInput variant="full" />
            </div>
            <PriceResult variant="full" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Manual visual check**

```bash
npm run dev
```
Temporarily add `<CalculatorProvider><Calculator /></CalculatorProvider>` to a test page (or replace `app/page.tsx` body for the moment). Confirm at `http://localhost:3000`:
- Switching packages updates service list and defaults
- Toggling services updates the breakdown
- Changing area updates price live
- Hood stepper (+/−) updates count and price
- Edge cases: enter `0`, then `6000`, then clear → messages appear

Revert the test page after verifying.

- [ ] **Step 4: Commit**

```bash
git add src/components/Calculator/Calculator.tsx src/components/Calculator/MiniCalculator.tsx
git commit -m "feat: add Calculator orchestrator and MiniCalculator hero variant"
```

---

## Task 15: Update ContactForm (drop email, prefill from context)

**Files:**
- Modify: `src/components/ContactForm/ContactForm.tsx`

- [ ] **Step 1: Update the Zod schema and types at the top of the file**

```ts
import { z } from 'zod';
import { PACKAGES, SERVICES, type PackageKey, type ServiceKey } from '@/lib/pricing';
import { useCalculator } from '@/lib/calculator-context';

const FormSchema = z.object({
  name: z.string().min(1, 'Введите имя').max(60),
  phone: z.string().regex(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, 'Формат: +7 (XXX) XXX-XX-XX'),
  packageKey: z.enum(['restaurant', 'office', 'warehouse', 'custom']),
  areaM2: z.coerce.number().int().min(20).max(5000),
  services: z.array(z.enum(['grease', 'dust', 'disinfect', 'hood', 'diag'])).min(1, 'Выберите хотя бы одну услугу'),
  comment: z.string().max(500).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Подтвердите согласие' }) }),
});

type FormInput = z.input<typeof FormSchema>;
type FormData  = z.output<typeof FormSchema>;
```

- [ ] **Step 2: Replace email field with prefill via `useCalculator`**

In the component body, read calculator state and use it as `defaultValues`:

```tsx
export function ContactForm() {
  const { state } = useCalculator();
  const form = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
      packageKey: state.packageKey,
      areaM2: state.areaM2,
      services: state.services,
      comment: '',
      consent: false,
    },
  });

  // Remount keying to reset defaults when calculator state changes:
  const formKey = `${state.packageKey}-${state.services.join(',')}-${state.areaM2}`;
  // ... pass key={formKey} on the outer <form> wrapper
```

Remove all email input JSX. Add hidden inputs for `packageKey`, `areaM2`, `services` (registered via `register`). Add visible chip-style readouts above the name field so the user sees what's prefilled.

- [ ] **Step 3: Update the submit handler**

```ts
async function onSubmit(data: FormData) {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    setSubmitState('error');
    return;
  }
  setSubmitState('success');
}
```

`submitState` is `'idle' | 'loading' | 'success' | 'error'`. On `success`, render a confirmation block in place of the form ("Заявка принята. Свяжемся в течение 2 часов.").

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactForm/ContactForm.tsx
git commit -m "feat: prefill ContactForm from calculator context and drop email field"
```

---

## Task 16: Rewrite Header

**Files:**
- Modify: `src/components/Header/Header.tsx`
- Modify: `src/lib/nav.tsx` (update anchor list)

- [ ] **Step 1: Update `src/lib/nav.tsx`**

Change `navLinks` to:
```ts
export const navLinks = [
  { href: '#services',   label: 'Услуги' },
  { href: '#cases',      label: 'Кейсы' },
  { href: '#calculator', label: 'Цены' },
  { href: '#trust',      label: 'О нас' },
  { href: '#contact',    label: 'Контакты' },
];
```

- [ ] **Step 2: Rewrite `Header.tsx`** matching `design-preview.html` (Variant 5 Hybrid, palette A)

Behavior:
- On hero (scrollY < 80) → transparent over cream, ink text
- Scrolled (≥ 80) → cream `bg-bg/95` with `backdrop-blur-md` and a `border-b border-line`
- Logo: `Vent — est. 2014` (Fraunces + mono est tag)
- Center nav (hidden < md): map over `navLinks`
- Right CTA: pill button "Рассчитать стоимость" → links to `#calculator`
- Mobile: hamburger toggles a full-screen overlay drawer with the same links, closes on link tap

Use IntersectionObserver on `.hero-section` (existing convention from CLAUDE.md) to switch the `visible`/scrolled class.

- [ ] **Step 3: Visual check**

`npm run dev` → confirm scroll behavior and mobile drawer.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header/Header.tsx src/lib/nav.tsx
git commit -m "feat: rewrite Header with sticky cream surface and mobile drawer"
```

---

## Task 17: Build Hero (composes MiniCalculator)

**Files:**
- Modify: `src/components/Hero/Hero.tsx`

- [ ] **Step 1: Rewrite the file** as a two-column grid (stacks on mobile)

Match `design-preview.html` Variant 5 + `palette-preview.html` palette A:

- Wrapper: `<section className="hero-section min-h-dvh px-5 md:px-[5vw] pt-32 pb-20 flex flex-col justify-center">`
- Grid: `grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-15 items-end`
- Left column:
  - Breadcrumb `01 / промышленная чистка вентсистем` (font-mono with leading 24px brand-green line)
  - `<h1>` Fraunces light, `text-[clamp(56px,7.5vw,124px)]`: `Чистим то, <em>что никто</em> <span>не видит.</span>` (the `span` uses `-webkit-text-stroke: 1.5px theme(colors.ink)` + `text-transparent`)
  - Paragraph ink/70, max-w-440
  - CTA row: filled ink→brand-on-hover button `Рассчитать стоимость`; secondary underline `Смотреть кейсы →`
  - Micro-stats row mono `● более 200 объектов · ● срок 4 дня · ● лицензии МЧС и СЭС` (brand-green `b` tags)
- Right column: `<MiniCalculator />` wrapped in CalculatorProvider context (which lives in `page.tsx`, not here)

- [ ] **Step 2: Visual check**

Render on dev server; confirm hero renders, mini calc works.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero/Hero.tsx
git commit -m "feat: rewrite Hero with editorial typography and MiniCalculator placement"
```

---

## Task 18: Rewrite Services section

**Files:**
- Modify: `src/components/Services/Services.tsx`

- [ ] **Step 1: Render a 4-card grid** (stacks 2×2 on tablet, 1×4 on mobile), iterating over the four primary services (`grease`, `dust`, `hood`, `disinfect`). Skip `diag` for now — it lives in the calculator only.

For each card:
- Card surface: white `bg-surface rounded-[24px] p-7 shadow-card`
- Icon (Wind / Hood / Spray / Stethoscope) in a 56px `bg-bg` circle, ink stroke at 1.5
- Title — Fraunces 24px font-medium
- Description — Inter 15px ink/65
- "Подробнее →" link in mono at the bottom, brand-green
- Hover: `transition` slight `translateY(-3px)` and stronger shadow

Use `[data-anim]` on each card for stagger reveal.

- [ ] **Step 2: Commit**

```bash
git add src/components/Services/Services.tsx
git commit -m "feat: rewrite Services section with 4-card layout and SVG icons"
```

---

## Task 19: Build Cases section (before/after sliders)

**Files:**
- Create: `src/components/Cases/Cases.tsx`

- [ ] **Step 1: Build a draggable before/after slider** as a self-contained client component

```tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { CASES } from '@/data/cases';

function CompareSlider({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none touch-pan-y"
      onMouseMove={e => handleMove(e.clientX)}
      onTouchMove={e => handleMove(e.touches[0].clientX)}
    >
      <Image src={after} alt={`После: ${alt}`} fill className="object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`До: ${alt}`} fill className="object-cover" />
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-accent" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-accent rounded-full grid place-items-center text-ink text-xs font-mono shadow-card">⟷</div>
      </div>
      <div className="absolute top-3 left-3 px-2 py-1 bg-ink/70 text-bg text-[11px] font-mono uppercase tracking-wider rounded">До</div>
      <div className="absolute top-3 right-3 px-2 py-1 bg-accent text-ink text-[11px] font-mono uppercase tracking-wider rounded">После</div>
    </div>
  );
}

export function Cases() {
  return (
    <section id="cases" className="px-5 md:px-[5vw] py-24" data-anim>
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">02 / кейсы</div>
        <h2 className="font-display font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[-.025em] mb-12">
          Не описания — <em className="italic text-brand">снимки.</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {CASES.map((c, i) => (
            <article key={c.id} data-anim style={{ transitionDelay: `${i * 80}ms` }}>
              <CompareSlider before={c.beforeSrc} after={c.afterSrc} alt={c.title} />
              <h3 className="font-display text-[22px] mt-4">{c.title}</h3>
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink/50 mt-1">{c.venueType}</div>
              <p className="text-[14px] text-ink/65 mt-2">{c.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Cases/Cases.tsx
git commit -m "feat: add Cases section with draggable before/after sliders"
```

---

## Task 20: Build BigVenues monochrome strip

**Files:**
- Create: `src/components/BigVenues/BigVenues.tsx`

- [ ] **Step 1: Create the file**

```tsx
import Image from 'next/image';
import { VENUES } from '@/data/venues';

export function BigVenues() {
  return (
    <section className="px-5 md:px-[5vw] py-16 border-y border-line" data-anim>
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 text-center mb-8">
          Среди объектов, на которых работали
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VENUES.map(v => (
            <div key={v.id} className="relative aspect-[3/2] rounded-xl overflow-hidden grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500" data-anim>
              <Image src={v.src} alt={v.alt} fill className="object-cover" />
              <div className="absolute bottom-2 left-3 font-mono text-[11px] uppercase tracking-wider text-white drop-shadow">{v.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BigVenues/BigVenues.tsx
git commit -m "feat: add BigVenues monochrome strip"
```

---

## Task 21: Rewrite HowWeWork section

**Files:**
- Modify: `src/components/HowWeWork/HowWeWork.tsx`

- [ ] **Step 1: Build a 4-step horizontal flow** that wraps to 2×2 on mobile

```tsx
import { ClipboardList, Eye, Sparkles, FileCheck } from '@/lib/icons';

const STEPS = [
  { n: 1, Icon: ClipboardList, title: 'Заявка',   desc: 'Свяжетесь — обсудим объём, согласуем выезд.' },
  { n: 2, Icon: Eye,           title: 'Осмотр',   desc: 'Инженер выезжает, делает видеодиагностику, считает точную цену.' },
  { n: 3, Icon: Sparkles,      title: 'Чистка',   desc: 'Работаем ночью или в нерабочее время, не нарушая бизнес.' },
  { n: 4, Icon: FileCheck,     title: 'Протокол', desc: 'Выдаём фото-отчёт и протокол СЭС — храните для проверок.' },
];

export function HowWeWork() {
  return (
    <section id="how" className="px-5 md:px-[5vw] py-24 bg-bg" data-anim>
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">04 / процесс</div>
        <h2 className="font-display font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[-.025em] mb-12">
          Как мы <em className="italic text-brand">работаем.</em>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="bg-surface rounded-2xl p-7 shadow-card" data-anim style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="font-mono text-[12px] text-brand mb-4">{String(s.n).padStart(2, '0')}</div>
              <s.Icon size={28} strokeWidth={1.5} className="text-ink mb-4" />
              <h3 className="font-display text-[24px] leading-tight">{s.title}</h3>
              <p className="text-[14px] text-ink/65 mt-3">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HowWeWork/HowWeWork.tsx
git commit -m "feat: rewrite HowWeWork with 4-step card grid and SVG icons"
```

---

## Task 22: Build TrustSection (numbers + licenses)

**Files:**
- Create: `src/components/TrustSection/TrustSection.tsx`

- [ ] **Step 1: Build a two-area section** — big counters on left, mono license badges on right

```tsx
'use client';

import { useRef } from 'react';
import { useCounter } from '@/lib/useCounter';

function Stat({ to, label, suffix = '+' }: { to: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useCounter(ref, to);
  return (
    <div>
      <div className="font-display font-light text-[clamp(48px,7vw,96px)] leading-none tracking-[-.03em] text-brand">
        <span ref={ref}>0</span>{suffix}
      </div>
      <div className="font-mono text-[12px] uppercase tracking-[.15em] text-ink/60 mt-2">{label}</div>
    </div>
  );
}

const LICENSES = ['МЧС', 'СЭС', 'СРО', 'ГОСТ Р 53300-2009'];

export function TrustSection() {
  return (
    <section id="trust" className="px-5 md:px-[5vw] py-24" data-anim>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-end">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">07 / цифры</div>
          <div className="grid grid-cols-2 gap-8">
            <Stat to={200} label="объектов" />
            <Stat to={10}  label="лет опыта" />
          </div>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">лицензии и допуски</div>
          <div className="flex flex-wrap gap-2">
            {LICENSES.map(l => (
              <span key={l} className="px-3 py-2 border border-ink/15 rounded-md font-mono text-[13px] tracking-wide">{l}</span>
            ))}
          </div>
          <p className="text-[13px] text-ink/55 mt-6 max-w-md">Работаем по протоколу СЭС и нормативам МЧС. Документы предоставляем при заключении договора.</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TrustSection/TrustSection.tsx
git commit -m "feat: add TrustSection with animated counters and license badges"
```

---

## Task 23: Update ContactSection wrapper

**Files:**
- Modify: `src/components/ContactSection/ContactSection.tsx`

- [ ] **Step 1: Refactor as a thin wrapper around `ContactForm`** with the section heading and visual frame

```tsx
import { ContactForm } from '@/components/ContactForm/ContactForm';

export function ContactSection() {
  return (
    <section id="contact" className="px-5 md:px-[5vw] py-24 bg-ink text-bg" data-anim>
      <div className="max-w-3xl mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[.15em] text-bg/60 mb-3">08 / заявка</div>
        <h2 className="font-display font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[-.025em] mb-3">
          Оставьте <em className="italic text-accent">заявку.</em>
        </h2>
        <p className="text-bg/70 text-[15px] mb-10 max-w-md">Перезвоним в течение 2 часов в рабочее время.</p>
        <ContactForm />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `ContactForm` so it works on a dark background** (use `bg-ink` + `text-bg` color values where contrast requires)

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactSection/ContactSection.tsx src/components/ContactForm/ContactForm.tsx
git commit -m "feat: wrap ContactForm in dark ContactSection"
```

---

## Task 24: Rewrite Footer

**Files:**
- Modify: `src/components/Footer/Footer.tsx`

- [ ] **Step 1: Build a 3-column footer** — logo + ИНН on left, nav middle, legal links right

Includes:
- Repeat of `navLinks` from `src/lib/nav.tsx`
- Phone, email, address (placeholders, marked TODO via comments to fill with real data)
- Links to `/contacts` and `/privacy`
- "© 2014–2026 Vent" line in mono

Bottom note in mono: `Vent — промышленная чистка вентиляции для бизнеса. Москва и Подмосковье.`

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer/Footer.tsx
git commit -m "feat: rewrite Footer with 3-column layout and mono branding"
```

---

## Task 25: Assemble new landing in app/page.tsx

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { Services } from '@/components/Services/Services';
import { Cases } from '@/components/Cases/Cases';
import { Calculator } from '@/components/Calculator/Calculator';
import { BigVenues } from '@/components/BigVenues/BigVenues';
import { HowWeWork } from '@/components/HowWeWork/HowWeWork';
import { TrustSection } from '@/components/TrustSection/TrustSection';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { Footer } from '@/components/Footer/Footer';
import { CalculatorProvider } from '@/lib/calculator-context';

export default function HomePage() {
  return (
    <CalculatorProvider>
      <Header />
      <main>
        <Hero />
        <Services />
        <Cases />
        <Calculator />
        <BigVenues />
        <HowWeWork />
        <TrustSection />
        <ContactSection />
      </main>
      <Footer />
    </CalculatorProvider>
  );
}
```

- [ ] **Step 2: `npm run dev` and load `http://localhost:3000`**

Walk the whole page. Confirm:
- Header sticky behavior works
- All sections render in the right order
- Mini calc in hero syncs with full calc
- Form is pre-filled from calc state
- Form submits successfully to Sheets

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble new landing page with CalculatorProvider"
```

---

## Task 26: Build /calculator standalone route

**Files:**
- Create: `src/app/calculator/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
import type { Metadata } from 'next';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Calculator } from '@/components/Calculator/Calculator';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { CalculatorProvider } from '@/lib/calculator-context';

export const metadata: Metadata = {
  title: 'Калькулятор стоимости чистки вентиляции — Vent',
  description: 'Рассчитайте онлайн стоимость промышленной чистки вентиляции и вытяжек для общепита, офиса или производства. Цены от 100 ₽/пог.м.',
  alternates: { canonical: '/calculator' },
};

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <Header />
      <main className="pt-32">
        <div className="px-5 md:px-[5vw] max-w-7xl mx-auto mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">калькулятор · /calculator</div>
          <h1 className="font-display font-light text-[clamp(40px,6vw,84px)] leading-none tracking-[-.025em] max-w-3xl">
            Стоимость чистки <em className="italic text-brand">вентиляции.</em>
          </h1>
        </div>
        <Calculator />
        <ContactSection />
      </main>
      <Footer />
    </CalculatorProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/calculator/page.tsx
git commit -m "feat: add /calculator standalone page"
```

---

## Task 27: Simplify /contacts page

**Files:**
- Modify: `src/app/contacts/page.tsx`

- [ ] **Step 1: Update copy and visuals** to match the new design system (cream bg, Fraunces heading, mono labels, JetBrains for phone numbers).

Sections: H1, Phone block, Email block, Address block, Hours block, optional map iframe. Use the new `Header` and `Footer`.

- [ ] **Step 2: Add `metadata`**

```ts
export const metadata: Metadata = {
  title: 'Контакты — Vent',
  description: 'Свяжитесь с Vent — промышленная чистка вентиляции для бизнеса. Москва и Подмосковье.',
};
```

- [ ] **Step 3: Commit**

```bash
git add src/app/contacts/page.tsx
git commit -m "feat: restyle /contacts page in redesign system"
```

---

## Task 28: Update layout.tsx (metadata, JSON-LD root, header preload)

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add root `metadata` export**

```ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://cleanvent.ru'),  // adjust to actual domain when known
  title: {
    default: 'Vent — промышленная чистка вентиляции для общепита, офисов и складов',
    template: '%s · Vent',
  },
  description: 'Промышленная чистка вентканалов, вытяжек и зонтов для общепита, офисов и складов. По протоколу МЧС и СЭС.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://cleanvent.ru',
    siteName: 'Vent',
  },
  twitter: { card: 'summary_large_image' },
};
```

- [ ] **Step 2: Inject JSON-LD `LocalBusiness` schema in the layout body**

(Will use `src/lib/schema.ts` once Task 29 builds it — for now stub a simple script tag with the object.)

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add root metadata and OpenGraph defaults in layout"
```

---

## Task 29: Build src/lib/schema.ts

**Files:**
- Create: `src/lib/schema.ts`

- [ ] **Step 1: Create JSON-LD generators**

```ts
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Vent',
    description: 'Промышленная чистка вентиляции для бизнеса',
    telephone: '+7 (000) 000-00-00',  // TODO: real
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Москва',
      addressRegion: 'Москва и Подмосковье',
      addressCountry: 'RU',
    },
    areaServed: 'Москва и Московская область',
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '20:00' },
    ],
  };
}

export function serviceSchema(name: string, priceRange: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    provider: { '@type': 'LocalBusiness', name: 'Vent' },
    areaServed: 'Москва',
    offers: { '@type': 'Offer', priceCurrency: 'RUB', priceRange },
  };
}
```

- [ ] **Step 2: Mount in `layout.tsx`** via a `<script type="application/ld+json">` block.

- [ ] **Step 3: Commit**

```bash
git add src/lib/schema.ts src/app/layout.tsx
git commit -m "feat: add JSON-LD LocalBusiness and Service schema generators"
```

---

## Task 30: Build sitemap.ts and robots.ts

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cleanvent.ru';
  const now = new Date();
  return [
    { url: `${base}/`,           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contacts`,   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
```

- [ ] **Step 2: `src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/privacy', '/api/'] },
    sitemap: 'https://cleanvent.ru/sitemap.xml',
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap and robots metadata routes"
```

---

## Task 31: Build dynamic opengraph-image.tsx

**Files:**
- Create: `src/app/opengraph-image.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Vent — промышленная чистка вентиляции';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 80, background: '#f6f3ec', color: '#141312', fontFamily: 'serif' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 18, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1e5c32' }}>
          Vent — est. 2014
        </div>
        <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 300 }}>
          Чистим то, что <i style={{ color: '#1e5c32' }}>никто не видит.</i>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#5a6b5e' }}>
          Чистка вентиляции для общепита, офисов и складов
        </div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/opengraph-image.tsx
git commit -m "feat: add dynamic OpenGraph image"
```

---

## Task 32: Remove obsolete components

**Files:**
- Delete: `src/components/Portfolio/`, `src/components/Reviews/`, `src/components/Promos/`, `src/components/Stats/`, `src/components/About/`, `src/components/HomeOrchestrator/`

- [ ] **Step 1: Confirm no remaining imports reference these**

```bash
npx grep -rE "Portfolio|Reviews|Promos|Stats|About|HomeOrchestrator" src/ --include="*.tsx" --include="*.ts"
```
Expected: only matches inside the directories themselves.

- [ ] **Step 2: Delete folders**

```bash
rm -rf src/components/Portfolio src/components/Reviews src/components/Promos src/components/Stats src/components/About src/components/HomeOrchestrator
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove obsolete components replaced by redesign"
```

---

## Task 33: Final verification

**Files:** none (verification only)

- [ ] **Step 1: TypeScript**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 2: Tests**

```bash
npm test
```
Expected: all pricing tests pass.

- [ ] **Step 3: Production build**

```bash
npm run build
```
Expected: build succeeds. Note any warnings about missing alt text or layout shifts.

- [ ] **Step 4: Dev server manual QA pass**

```bash
npm run dev
```

Open `http://localhost:3000` and walk through:
- Hero renders, fonts loaded, header sticky works
- Mini calc → full calc sync (change package in one, verify other follows)
- Service list filters by package (Office hides hood and disinfect; Restaurant hides disinfect)
- Hood stepper increments / decrements price
- Edge cases: area 0 → "минимум 20 м²"; area 8000 → "крупные объекты"
- Cases section sliders work (drag the handle)
- BigVenues hover de-grays
- TrustSection counters animate when scrolled into view
- Form prefills, submits, success state appears
- `/calculator` route renders standalone
- `/contacts` styled to match
- Mobile (375 width): no horizontal scroll, drawer works, calculator stacks cleanly

- [ ] **Step 5: Lighthouse (optional but recommended)**

In Chrome DevTools → Lighthouse → Mobile → Performance + SEO + Accessibility. Targets: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.

- [ ] **Step 6: Final commit if any fixes were applied during verification**

```bash
git add -A
git commit -m "fix: address issues found in QA pass"  # only if needed
```

---

## Done

The redesign is complete when:
- All 33 tasks have all checkboxes ticked
- `npm test` passes
- `npm run build` produces a clean build
- Manual QA covers the items in Task 33 Step 4
- The site renders at 375 / 768 / 1280 widths without layout breaks
