# Vent — Full Site Redesign

**Date:** 2026-05-15
**Status:** Approved (awaiting spec review → implementation plan)
**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · shadcn/ui · React Hook Form + Zod · googleapis

---

## 1. Context

Vent is a B2B ventilation-cleaning service. Primary clients: foodservice (restaurants, cafés, canteens, fast food), offices, warehouses, small production. Large clients (arenas, factories) are accepted but not the site's focus.

The current site (single-page landing at `/` plus `/contacts` and `/privacy`) is functional but generic. The redesign goal is a fresh, memorable, trustworthy interface that stands out against competitors in the niche — which are dominated by bright-blue cookie-cutter cleaning sites with stock photos of vent ducts.

The flagship feature is an **interactive cost calculator** with adaptive service packages, real-time pricing, and form prefill.

## 2. Goals & success criteria

- **Visual:** distinctive, intentional editorial-meets-technical aesthetic; memorable on first scroll
- **Trust:** B2B credibility via real before/after cases, technical-mono license badges, hedged-but-honest stats
- **Conversion:** calculator visible in the first viewport (mini version), full calculator in section 4 of 9, form prefills from calculator state
- **SEO:** ranks for "чистка вентиляции [city]", "рассчитать стоимость чистки вытяжек", etc. via structured metadata and JSON-LD
- **Honesty:** no fake client logos, fake reviews, or fake license scans — only what can be backed up

## 3. Visual system

### 3.1 Aesthetic direction
**Hybrid editorial:** large serif typography as the load-bearing element, monospace for technical labels (breadcrumbs, license IDs, micro-stats, calc breakdowns), bento cards only in data-dense sections (calculator result panel, trust section).

This combines:
- Editorial gravitas → trustworthy serif headlines (Fraunces)
- Engineering credibility → mono-typed technical metadata (JetBrains Mono)
- Modern density → bento cards where information density warrants

### 3.2 Palette (CSS custom properties — added to `tailwind.config.ts`)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#f6f3ec` | Cream page background |
| `--ink` | `#141312` | Primary text, dark fills |
| `--brand` | `#1e5c32` | CTAs, badges, em-highlights in headlines |
| `--brand-dark` | `#0f3d22` | Brand hover state |
| `--accent` | `#c8ff3e` | Lime: live indicators, hover flashes, headline em alt, calc numbers |
| `--surface` | `#ffffff` | Bento card surfaces |
| `--mute` | `#5a6b5e` | Secondary text |
| `--line` | `rgba(20,19,18,0.08)` | Thin dividers |

Contrast: `--ink` on `--bg` = 14.6:1 (WCAG AAA).

### 3.3 Typography (loaded via `next/font/google`)

| Family | Role | Loading priority |
|--------|------|------------------|
| **Fraunces** (variable, opsz + wght + SOFT axis) | Display: all h1/h2, calc prices, big numbers in stats | Preload |
| **Inter Tight** | Body: paragraphs, nav, service descriptions, form labels | Preload |
| **JetBrains Mono** | Mono: breadcrumbs (`01 / hero`), license badges, live labels, breakdown rows | Default swap |

Type scale (clamp for fluid responsive): 12 / 13 / 15 / 17 / 22 / 32 / 48 / 72 / 108–124 px.

### 3.4 Layout & spacing
- Container max-width 1280px desktop, full-bleed mobile with 5vw side gutters
- Section vertical rhythm: 64 / 96 / 128 px (mobile / tablet / desktop)
- Bento card radius 20–32px; tag/chip radius 999px; button radius 999px (pill); fields 10–14px
- Spacing scale follows Tailwind's 4-pt grid

### 3.5 Motion
- Scroll-reveal via existing `useScrollAnim` (`[data-anim]` → `.visible`, 70ms stagger)
- Spring easing for chips/buttons: `cubic-bezier(.2,.8,.2,1)`, 200–250ms
- `prefers-reduced-motion` → disables reveal stagger and hover transforms (kept opacity/color transitions)
- Hard cap: 1–2 simultaneously animated elements per viewport

## 4. Site structure

### 4.1 Routes

| Route | Purpose |
|-------|---------|
| `/` | Single-page landing (full conversion funnel) |
| `/calculator` | Standalone full calculator (SEO + shareable) |
| `/contacts` | Contact details, map, legal info |
| `/privacy` | Privacy policy (`noindex`) |

### 4.2 Landing (`/`) — section order

| # | Section | Component | Purpose |
|---|---------|-----------|---------|
| 1 | Hero | `Hero` + `MiniCalculator` | Attention + instant micro-quote |
| 2 | Services | `Services` | What we do (4 cards) |
| 3 | Cases (before/after) | `Cases` | Proof before price |
| 4 | Calculator (full) | `Calculator` | Conversion → quote |
| 5 | Big venues strip | `BigVenues` | Authority (monochrome, low-emphasis) |
| 6 | How we work | `HowWeWork` | Reduce friction (4 steps) |
| 7 | Trust + numbers + licenses | `TrustSection` | Final credibility push |
| 8 | Contact form | `ContactSection` + `ContactForm` | Close |
| 9 | Footer | `Footer` | Nav, legal |

### 4.3 Header
- Hero (above scroll 80px) → transparent over cream
- Scrolled → cream surface + `backdrop-filter: blur(20px)` + thin bottom line
- Logo + links (Услуги / Кейсы / Цены / О нас / Контакты) + CTA "Рассчитать"
- Mobile (< 900px): hamburger → slide-in drawer with same links

### 4.4 Sections deprecated from current site
- `Reviews.tsx` — no real reviews exist; do not fake. Re-add when real reviews collected.
- `Promos.tsx` — current 4 promo cards are noise; nothing today blocks conversion this way.
- `Stats.tsx` — merged into the new `TrustSection`.
- `About.tsx` — collapsed into a short paragraph inside Hero/Footer; no full section.
- `Portfolio.tsx` — replaced by `Cases.tsx` (before/after focus, not gallery).
- `HomeOrchestrator.tsx` — logic moves into `app/page.tsx` via Context.

## 5. Calculator — full spec

### 5.1 Pricing engine

Pure TypeScript module `src/lib/pricing.ts` (no React imports, fully testable). Prices benchmarked against competitors (mosecoclean.ru, gor-vent.ru) on 2026-05-15.

The actual rate per linear meter for `grease` and `dust` depends on duct geometry (pipe vs box, ≤ 600 mm vs > 600 mm). The calculator shows the **minimum** of that range as "от N ₽/пог.м" and exposes the full range via a tooltip — clients don't know duct dimensions and don't want a 4-tier selector. Exact rate is confirmed after on-site inspection.

The m² → пог.м coefficient varies by venue type — kitchens have denser ductwork than warehouses. The coefficient lives on the `PACKAGES` map, not as a global constant.

```ts
export const SERVICES = {
  grease: {
    kind: 'linear',
    min: 300,      // труба Ø ≤ 600 мм
    max: 400,      // труба > 600 мм / короб > 600×400
    label: 'Чистка вентиляции от жира',
    hint: 'для кухонь общепита',
    diameterTiers: [
      { code: 'pipe-small', label: 'труба Ø ≤ 600 мм',     rate: 300 },
      { code: 'box-small',  label: 'короб ≤ 600×400 мм',   rate: 350 },
      { code: 'pipe-large', label: 'труба Ø > 600 мм',     rate: 400 },
      { code: 'box-large',  label: 'короб > 600×400 мм',   rate: 400 },
    ],
  },
  dust: {
    kind: 'linear',
    min: 100,
    max: 220,
    label: 'Чистка вентиляции от пыли',
    hint: 'для офисов и складов',
    diameterTiers: [
      { code: 'pipe-small', label: 'труба Ø ≤ 600 мм',     rate: 100 },
      { code: 'box-small',  label: 'короб ≤ 600×400 мм',   rate: 120 },
      { code: 'pipe-large', label: 'труба Ø > 600 мм',     rate: 180 },
      { code: 'box-large',  label: 'короб > 600×400 мм',   rate: 220 },
    ],
  },
  disinfect: {
    kind: 'linear',
    min: 30, max: 30,
    label: 'Дезинфекция',
    hint: 'противомикробная обработка воздуховодов',
  },
  hood: {
    kind: 'unit',
    price: 1000,
    label: 'Чистка вытяжек / зонтов',
    hint: 'за каждый зонт пищеблока',
  },
  diag: {
    kind: 'fixed',
    price: 4500,
    label: 'Диагностика / видеоинспекция',
    hint: 'осмотр и видеоконтроль каналов перед чисткой',
  },
} as const;

export const PACKAGES = {
  restaurant: { label: 'Общепит',      m2ToLm: 0.45, default: ['grease', 'hood'],    available: ['grease', 'hood', 'dust', 'diag'] },
  office:     { label: 'Офис',         m2ToLm: 0.30, default: ['dust'],              available: ['dust', 'diag'] },
  warehouse:  { label: 'Производство', m2ToLm: 0.25, default: ['dust', 'disinfect'], available: ['dust', 'disinfect', 'grease', 'diag'] },
  custom:     { label: 'Своё',         m2ToLm: 0.30, default: [],                    available: ['grease', 'dust', 'hood', 'disinfect', 'diag'] },
} as const;

export function computePrice(services, areaM2, packageKey, hoodCount = 1): { totalMin: number; breakdown: { key, label, amount }[] }
  // const coef = PACKAGES[packageKey].m2ToLm
  // linear: areaM2 * coef * SERVICES[k].min      (uses .min for "от N ₽")
  // unit:   hoodCount * SERVICES.hood.price
  // fixed:  SERVICES[k].price as-is
  // Each line rounded to nearest 100 ₽
```

Displayed as **`от {totalMin} ₽`** with subline "точная стоимость — после осмотра". Max range stored and shown in the diameter tooltip but not in the headline price (visual noise).

**Coefficient rationale:** kitchens (foodservice) have ~0.45 пог.м of ductwork per 1 m² of floor area (compact, dense). Offices average ~0.30. Warehouses are sparse (large open volumes) at ~0.25. Custom defaults to 0.30 — closest to the broadest case.

**Worked example** — 180 m² restaurant, package `restaurant` (coef 0.45, grease + hood × 3):
- Grease: 180 × 0.45 × 300 = 24 300 ₽ (rounded to 24 300)
- Hoods: 3 × 1 000 = 3 000 ₽
- **Total: от 27 300 ₽**

### 5.2 Full Calculator UI

**Left column (input):**
1. **Step 1 — Тип объекта**: 4 chip-cards (`Общепит / Офис / Производство / Своё`). Active chip: `--ink` fill, `--bg` text.
2. **Step 2 — Услуги**: list filtered by package's `available[]`. Each row: custom checkbox + label + hint text + price-per-unit (mono, right-aligned). Active row: `rgba(200,255,62,.15)` background tint. For services with `diameterTiers` (grease, dust), a small `(i)` tooltip-icon next to the price-per-unit reveals the full diameter breakdown ("труба Ø ≤ 600 мм — 300; короб — 350; > 600 мм — 400 ₽/пог.м · точно определим при осмотре").
3. **Step 3 — Площадь**: large numeric input with hint "площадь вашего ресторана, офиса или объекта". Suffix `м²`.
4. **(conditional)** When `hood` service is active → stepper "вытяжек: − 3 +" inline.

**Right column (sticky result):**
- Dark surface (`--ink`), white text
- Price in Fraunces 64px, lime em on the number
- Breakdown rows (mono, dim text + amount). Hood row includes an inline editable stepper for count.
- CTA "Оставить заявку →" — `--accent` fill, ink text. Click → smooth-scroll to form + prefill calc state.

### 5.3 Mini Calculator (Hero)
Compact variant: chips + area input + price line + "подробный расчёт ↓" link to scroll to full. Synchronized state with full via Context.

### 5.4 Adaptive behavior on package change
- Service list animates (250ms fade) — hidden services unmount, available ones mount
- Default services for the new package become checked (any prior selection resets)
- Mini ↔ Full always in sync via shared Context state
- Hood count resets to 1 when switching away from a hood-eligible package

### 5.5 Edge cases
| Condition | Behavior |
|-----------|----------|
| `areaM2 < 20` | Price hidden, text "минимум 20 м²" |
| `areaM2 > 5000` | Price hidden, text "крупные объекты — звоните +7 ..." |
| `services.length === 0` (only possible in "Своё") | "выберите услуги" |
| Only `diag` selected | Show "3 500 ₽" without "от" prefix |

### 5.6 `/calculator` standalone page
- Same full calculator + form directly below
- No section nav, no hero
- H1: "Калькулятор стоимости чистки вентиляции"
- Trust strip (license badges only) below the form
- Sticky result panel on desktop, accordion-style on mobile

## 6. Contact form

### 6.1 Fields

| Field | Type | Required | Prefill source |
|-------|------|----------|----------------|
| Имя | text | yes | — |
| Телефон | tel + mask `+7 (___) ___-__-__` | yes | — |
| Тип объекта | hidden | auto | calc `packageKey` |
| Площадь, м² | number | yes | calc `areaM2` |
| Услуги | multi-checkbox | yes (min 1) | calc `services` |
| Комментарий | textarea | no | — |
| Согласие на обработку ПД | checkbox | yes | — |

Email field is intentionally removed — phone-first is more natural for B2B service inquiries in Russia, and reduces field friction.

### 6.2 Validation (Zod)
- Phone: regex matching `+7 (XXX) XXX-XX-XX` mask shape after stripping
- Area: integer, `[20, 5000]` (matches calc bounds)
- Name: non-empty, max 60 chars
- Comment: max 500 chars
- PD-consent: must be `true`

### 6.3 Submit flow
1. Click → button disabled + spinner ("Отправляем...")
2. POST → `/api/submit` → existing `sheets.ts` integration (column "Email" removed)
3. Success → form replaces with confirmation block "Заявка принята. Свяжемся в течение 2 часов." + "Вернуться на сайт" button
4. Error → toast with `role="alert"` + retry hint with phone fallback

## 7. Visual content

### 7.1 Assets — reused from `public/images/`
- **Before/after pairs**: `compare-dust-*`, `compare-grease1-*`, `compare-grease2-*` (reservoir pair **skipped** per user)
- **Service icons** (PNG): **replaced** by Lucide SVGs from `src/lib/icons.tsx` (one consistent visual language)
- **Service photos**: `service-ventilation.jpg`, `service-diagnostics.jpg`, `service-disinfection.jpg` — used as decorative cropped imagery in Services section
- **Big venue photos**: `trust-gazprom.jpg`, `trust-miratorg.jpg`, `trust-multon.jpg`, `trust-ska.jpg` — used in monochrome `BigVenues` strip ("Среди объектов, на которых работали"), small and low-emphasis

### 7.2 Assets — to source
- **Hero**: no photo. The editorial typography is the visual; no background image, no atmospheric blur. (Can be revisited in a later iteration if needed.)
- **Process / How we work icons**: 4 Lucide icons — `ClipboardList` (заявка), `Eye` (осмотр), `Sparkles` (чистка), `FileCheck` (протокол). Imported via `src/lib/icons.tsx`.

### 7.3 Assets explicitly NOT used
- **Fake client logos** — never. `BigVenues` uses photos of work locations, framed honestly as "Среди объектов".
- **Fake license scans** — license info is shown as mono text badges only ("МЧС", "СЭС", "СРО") without specific IDs until verified.
- **Fake reviews** — `Reviews` section is removed from this iteration.

### 7.4 Numbers and claims
All numbers are deliberately hedged (per user input "частично уверен"):
- "Более 200 объектов" (not "240+")
- "Более 10 лет опыта" (not "с 2014 года" specifically)
- "Лицензии МЧС и СЭС" (no specific numbers)
- Real numbers can be swapped in by editing `src/data/*.ts` files when verified

## 8. SEO

### 8.1 Per-page `metadata` (Next.js 14 metadata API)
- `/` — title "Vent — промышленная чистка вентиляции для общепита, офисов и складов", description with key phrases
- `/calculator` — title "Калькулятор стоимости чистки вентиляции — Vent", description "Рассчитайте онлайн..."
- `/contacts` — title "Контакты — Vent"
- `/privacy` — `robots: { index: false }`

### 8.2 JSON-LD (`src/lib/schema.ts` generators)
- `LocalBusiness` in root layout (name, phone, address, openingHours, geo)
- `Service` (×5, one per service offering) with `priceRange`
- `BreadcrumbList` for `/calculator`, `/contacts`
- `FAQPage` — opt-in via data, not added in initial release

### 8.3 Tech SEO
- `sitemap.ts` — dynamic, includes all routes
- `robots.ts` — allow all, disallow `/privacy` and `/api/*`
- `opengraph-image.tsx` — dynamic OG image generated server-side (Fraunces headline + cream bg + brand-green mark)
- Twitter Card `summary_large_image`
- `<html lang="ru">`
- Semantic headings: one h1 per page, sequential h2 → h6
- `alt` attributes mandatory on all images (descriptive, not "image of...")
- Russian key phrases woven naturally: "промышленная чистка вентиляции", "чистка вытяжек в ресторане", "вентиляция от жира", "по протоколу СЭС", "лицензированно МЧС"

## 9. Performance (Core Web Vitals targets)

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | ≤ 2.5s | Hero text is system-rendered ASAP; Fraunces with `font-display: swap`; no hero image |
| CLS | ≤ 0.1 | Explicit `width`/`height` on all `<Image>`s; reserved heights on counter elements |
| INP | ≤ 200ms | All calculator state changes are pure synchronous reducer dispatches |
| Bundle | ≤ 200kb gzip initial | Dynamic `import()` for `Calculator` full section (mini stays inline); shadcn primitives tree-shaken |
| Images | WebP/AVIF | `next/image` auto-conversion, lazy below-fold, `priority` on Hero |

## 10. Accessibility (WCAG AA)

- Text contrast ≥ 4.5:1 verified for all token pairs
- Focus rings: visible 2px lime outline, never removed
- All interactive elements: `<button>` or `role="button"` + `aria-label` where icon-only
- Calculator: `aria-pressed` on package chips, `aria-checked` on service rows, `aria-live="polite"` on price result so screen readers announce updates
- Form: visible labels (not placeholder-only), errors below the field with `role="alert"`, first invalid field auto-focused on submit-error
- Tab order matches visual order
- `prefers-reduced-motion`: scroll-reveal stagger disabled, hover-transforms reduced to color only

## 11. File structure (target)

```
src/
├── app/
│   ├── page.tsx                       # Landing (assembled, Context provider here)
│   ├── layout.tsx                     # Fonts, metadata, JSON-LD root
│   ├── calculator/page.tsx            # /calculator standalone
│   ├── contacts/page.tsx              # /contacts
│   ├── privacy/page.tsx               # /privacy
│   ├── api/submit/route.ts            # POST → sheets
│   ├── sitemap.ts                     # NEW
│   ├── robots.ts                      # NEW
│   ├── opengraph-image.tsx            # NEW (dynamic OG)
│   └── globals.css                    # Keyframes, [data-anim] system
│
├── components/
│   ├── Header/Header.tsx              # Rewrite
│   ├── Hero/Hero.tsx                  # Rewrite (composes MiniCalculator)
│   ├── Services/Services.tsx          # Rewrite
│   ├── Cases/Cases.tsx                # NEW (replaces Portfolio)
│   ├── Calculator/
│   │   ├── Calculator.tsx             # Full calculator orchestrator
│   │   ├── MiniCalculator.tsx         # Hero variant
│   │   ├── PackageChips.tsx           # Step 1
│   │   ├── ServiceList.tsx            # Step 2 (animated mount/unmount)
│   │   ├── AreaInput.tsx              # Step 3
│   │   └── PriceResult.tsx            # Sticky result + breakdown
│   ├── BigVenues/BigVenues.tsx        # NEW
│   ├── HowWeWork/HowWeWork.tsx        # Rewrite (4 steps)
│   ├── TrustSection/TrustSection.tsx  # NEW (Stats + Licenses merged)
│   ├── ContactSection/ContactSection.tsx
│   ├── ContactForm/ContactForm.tsx    # Email removed, validation updated
│   ├── Footer/Footer.tsx              # Rewrite
│   └── ui/                            # shadcn primitives
│
├── lib/
│   ├── pricing.ts                     # NEW (pure pricing engine)
│   ├── calculator-context.tsx         # NEW (React Context + reducer)
│   ├── icons.tsx                      # Extend with new icons
│   ├── nav.tsx                        # Update anchors
│   ├── sheets.ts                      # Remove email column
│   ├── schema.ts                      # NEW (JSON-LD generators)
│   ├── useScrollAnim.ts               # Unchanged
│   └── useCounter.ts                  # Unchanged
│
└── data/
    ├── services.ts                    # NEW
    ├── packages.ts                    # NEW (matrix)
    ├── cases.ts                       # NEW
    └── venues.ts                      # NEW
```

**Removed:** `Portfolio.tsx`, `Reviews.tsx`, `Promos.tsx`, `Stats.tsx`, `About.tsx`, `HomeOrchestrator.tsx`.

## 12. State management

`src/lib/calculator-context.tsx` provides a React Context with `useReducer`:

```ts
type CalcState = {
  packageKey: 'restaurant' | 'office' | 'warehouse' | 'custom';
  services: ServiceKey[];
  areaM2: number;
  hoodCount: number;
};

type Action =
  | { type: 'SET_PACKAGE'; key: PackageKey }   // resets services to default
  | { type: 'TOGGLE_SERVICE'; key: ServiceKey }
  | { type: 'SET_AREA'; value: number }
  | { type: 'SET_HOOD_COUNT'; value: number };
```

Provider lives in `app/page.tsx` (landing) and `app/calculator/page.tsx` (standalone). `MiniCalculator`, `Calculator`, and `ContactForm` all consume the same context — guarantees mini ↔ full ↔ form prefill stay in sync without prop drilling.

No Zustand / Redux — overkill for a single feature scope.

## 13. Out of scope (for this iteration)

- Multi-language (`/en`, `/kz`) — Russian only
- Authentication / user accounts
- Online payment / booking calendar
- Real-time chat widget
- Blog / CMS integration
- A/B testing harness
- Analytics dashboard (Google Analytics tag goes in `layout.tsx` but no dashboards)
- FAQ section (schema is ready; copy not commissioned yet)

## 14. Acceptance criteria (for the redesign as a whole)

- [ ] Lighthouse Performance ≥ 90 on mobile (4G simulation) for `/` and `/calculator`
- [ ] All sections render correctly at 375 / 768 / 1280 / 1920 widths
- [ ] Calculator state synchronizes correctly between Mini and Full variants
- [ ] Switching package resets services to defaults of new package with smooth animation
- [ ] Service list filters correctly per matrix (hood not shown for Office; disinfection not shown for Restaurant; etc.)
- [ ] Form prefills package/area/services from calculator state
- [ ] Form submits to Google Sheets without email column; success/error states render
- [ ] `prefers-reduced-motion` honored across all animations
- [ ] No console errors / warnings on initial load
- [ ] All images have descriptive `alt` text
- [ ] `lang="ru"` on `<html>`, JSON-LD validates in Google Rich Results Test
- [ ] `sitemap.xml` and `robots.txt` accessible and well-formed

## 15. Migration notes

This is a **full redesign**, not an incremental refactor. The new component tree replaces the old one entirely. Implementation strategy:
1. Tailwind tokens + fonts updated first (foundation)
2. New components built in `src/components/` alongside old ones initially
3. New `app/page.tsx` switches the import wholesale once components are ready
4. Old components removed in the same commit that swaps `page.tsx` to keep the tree clean

Google Sheets integration kept intact at the API level — only the form/payload schema changes (email removed).

---

*End of design spec.*
