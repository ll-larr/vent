# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js on localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npx tsc --noEmit # Type-check without building
npm test         # Run vitest (pricing engine unit tests)
```

## Architecture

**Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 4 (CSS-first config in `@theme`), shadcn/ui primitives, React Hook Form + Zod, lucide-react, googleapis, vitest.

**Path alias:** `@/` maps to `src/`

### Site structure

Single-page landing at `/` (bento-modern layout) plus three additional routes: `/calculator`, `/contacts`, `/privacy`. No dynamic routes.

Home page render order (matches `vent bento modern/handoff_bento_modern/Vent - Bento Modern.html`):

```
Header → Hero → Services → Cases → BigVenues → HowWeWork → TrustSection → Calculator → ContactSection → Footer
```

`Header` and `ContactSection` are wrapped in `CalculatorProvider` (in `app/page.tsx`) so MiniCalculator, Calculator, and ContactForm share state.

### Visual reference (handoff)

`vent bento modern/handoff_bento_modern/Vent - Bento Modern.html` is the **canonical** design reference. All visual decisions, spacing, animations, and interactions must match it 1-to-1. When in doubt, open the HTML reference and find the corresponding selector before writing port code.

`AUDIT.md` in repo root tracks reference-vs-port deltas as they're discovered.

### Component conventions

Every component lives in `src/components/<Name>/<Name>.tsx`. Tailwind utility classes only — no SCSS. Components using hooks or browser APIs must start with `'use client'`.

### Design tokens (`src/app/globals.css` @theme)

| Token | Value |
|---|---|
| `--color-bg` | `#f6f3ec` |
| `--color-ink` | `#141312` |
| `--color-brand` | `#1e5c32` |
| `--color-brand-dark` | `#0f3d22` |
| `--color-accent` | `#c8ff3e` (lime) |
| `--color-surface` | `#ffffff` |
| `--color-stone` | `#f4f4f2` |
| `--color-line` | `rgba(20,19,18,.08)` |
| `--color-line-2` | `rgba(20,19,18,.14)` |
| `--radius-tile` | 22px |
| `--radius-tile-lg` | 28px (large bento tiles) |
| `--radius-card` | 14px (inputs) |
| `--radius-pill` | 999px |
| `--max-width-content` | 1320px |

`tailwind.config.ts` does NOT define `fontFamily` — Tailwind v4 reads `--font-{name}` directly from `@theme`. Adding `fontFamily` in the config creates two sources of truth.

### Fonts

- **Inter Tight** (body, sans) — loaded via `next/font/google` in `src/app/layout.tsx` with `subsets: ['latin', 'cyrillic']`, weights `400/500/600`. Exposes `--font-inter-tight`.
- **JetBrains Mono** (mono) — same pattern, Latin only, weights `400/500`. Exposes `--font-jetbrains-mono`.
- **Fraunces** (display) — loaded via `<link>` tag in `layout.tsx`'s `<head>` because next/font v14.2 types don't expose Cyrillic or the full `opsz` axis for Fraunces. The `<link>` requests `ital,opsz,wght@0,9..144,300..600;1,9..144,300..500` which matches the bento reference exactly.

In CSS, `--font-display: "Fraunces", Georgia, serif;`. **Never** add a `.font-display { font-family: ... }` rule in `globals.css` — it would override the `@theme` token.

### Shared CTAs

`globals.css` defines reusable button utilities to mirror reference `.btn` / `.btn.lime` / `.btn.ghost`:

| Class | Use | Visual |
|---|---|---|
| `.btn-ink` | Dark CTA | bg ink → brand on hover, arrow translateX(3) |
| `.btn-lime` | Primary lime CTA | accent bg, wipe-fill ink on hover, arrow translateX(4) |
| `.btn-ghost` | Outline on light bg | transparent → ink fill on hover |
| `.btn-ghost-on-dark` | Outline on ink/brand bg | transparent → bg/.08 fill, accent border |
| `.btn-now-cta` | Hero status mini CTA | accent text + bottom-line, lime wipe on hover |

Each expects an `.arrow` element inside for the slide-on-hover animation.

### Icons

All icons from `src/lib/icons.tsx` (re-exports `lucide-react`). Always import from `@/lib/icons`. Default `strokeWidth={1.5}` unless small inline glyphs.

### Calculator state

`src/lib/calculator-context.tsx` — React Context + `useReducer`. State shape:

```ts
{ packageKey, services: ServiceKey[], areaM2, hoodCount }
```

`MiniCalculator` (hero), `Calculator` (full), and `ContactForm` all consume it. Logic in `src/lib/pricing.ts` (pure, unit-tested in `pricing.test.ts`).

### `data-calc-jump` deep links

`[data-calc-jump="<svc>"]` on Services anchor links triggers Calculator to dispatch `SET_PACKAGE` + `TOGGLE_SERVICE`. Handler lives in `Calculator.tsx` via a document-level click listener.

### HowWeWork popup

Tile is `.pr-step` (article). Inside: `.pr-static` (default visible) and `.pr-popup` (hidden). On `:hover` or `[data-hint="open"]` on `.pr-step`, popup fades in, static fades out. Selectors are in `globals.css` — we don't rely on Tailwind's `group-data-[*]:` because v4 matching against arbitrary `data-*` values can be flaky.

Auto-demo: first tile gets `data-hint="open"` 500ms after section enters viewport, held for 1500ms, cancelled if user hovers any tile first.

### Compare slider (Cases)

`CompareSlider` in `Cases.tsx` runs a `requestAnimationFrame` ping-pong cos curve 28%↔72% over 4.8s, gated by IntersectionObserver. Hover takes over with smooth resume (`t0Ref` rebase on `mouseleave`). Respects `prefers-reduced-motion`.

### Header

Sticky pill on `top:12px` with `bg-ink/.92 backdrop-blur-md`. Variants:
- `landing` (default): full nav + contacts + lime CTA. Active section highlighted lime via IntersectionObserver on each `section[id]`.
- `back`: brand + "На главную" pill. Used on `/privacy` (and `/contacts`/`/calculator` if needed).

Mobile (<lg): burger → full-screen drawer.

### Google Sheets integration

Form POSTs to `/api/submit` → `src/lib/sheets.ts` appends a row via `googleapis` JWT. Requires `.env.local` with `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (with literal `\n`), `GOOGLE_SHEET_ID`.

### Phone mask

`+7 999 888 77 66` — `+7` prefix rendered outside the input, user types 10 digits. Leading 7/8 stripped on paste. Full E.164 (`+7XXXXXXXXXX`) stored in form state.

### Scroll reveal — INTENTIONALLY DISABLED

Reference has no `[data-anim]` entrance reveals. `globals.css` neutralises the `[data-anim] { opacity:1; transform:none }`. `useScrollAnim` hook and `[data-anim]` markup remain in components but are visual no-ops. Don't re-enable.

### What NOT to touch

- `src/lib/pricing.ts` (formula)
- `src/data/*.ts` (data)
- `/api/submit` and `src/lib/sheets.ts`
- Stack (React 18 / Next 14 / Tailwind v4 / shadcn)
