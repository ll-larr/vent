# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js on localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npx tsc --noEmit # Type-check without building
npm test         # Run vitest (pricing engine + submit schema)
```

Do not `rm -rf .next` while `npm run dev` is running — it leaves the dev server
serving a half-deleted manifest until restarted.

## Architecture

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4 (CSS-first
config in `@theme`), React Hook Form + Zod, lucide-react, googleapis, vitest.

**Path alias:** `@/` maps to `src/`

### Site structure

The home page is a scroll story of eight sections plus the footer:

```
01 Hero → 02 Technology → 03 Process → 04 Advantages → 05 Objects
→ 06 Discounts → 07 Calculator + LeadForm → 08 FAQ → Footer
```

Section ids are the numbers themselves (`#01` … `#08`) and double as the menu anchors, so
`/#07` from any page lands on the calculator.

Other routes: `/blog` (article list), `/blog/[slug]` (five articles, statically generated),
`/calculator`, `/contacts`, `/privacy`, `/uslugi` (hub + four service pages).

### Visual reference (handoff)

`design_handoff_vent_landing/README.md` is the **canonical specification** — tokens, type scale,
section-by-section layout, interactions, calculator formulas. `design/*.dc.html` are working
prototypes of the same thing; open them when a measurement is ambiguous. Their runtime
(`support.js`, `<x-dc>`, `<sc-*>`, inline styles) is not part of the port.

`design/img/` is gitignored — the photos are byte-identical to `public/images/*.jpg`. To view the
prototypes with pictures: `cp public/images/*.jpg design_handoff_vent_landing/design/img/`.

`AUDIT.md` tracks reference-vs-port deltas and the reasons for each.

### Component conventions

Story components live in `src/components/story/<Name>.tsx`; the few shared leftovers
(`Breadcrumbs`, `ContentPage`, `Prose`, `CustomCursor`) keep the older `<Name>/<Name>.tsx` shape.
Tailwind utility classes only. Components using hooks or browser APIs start with `'use client'`.

Sizes come from the handoff as `clamp(min, preferred, max)` and line lengths as `max-width` in
`ch` — both are load-bearing, not approximations.

### Design tokens (`src/app/globals.css` @theme)

| Token | Value |
|---|---|
| `--color-bg` | `#f6f3ec` |
| `--color-ink` | `#141312` |
| `--color-black-deep` | `#0e0d0c` (behind photography) |
| `--color-ink-hover` | `#191817` (dark card hover) |
| `--color-brand` | `#1e5c32` |
| `--color-accent` | `#c8ff3e` (lime) |
| `--color-surface` | `#ffffff` |
| `--color-stone` | `#f4f4f2` |
| `--color-line` / `--color-line-2` | `rgba(20,19,18,.08)` / `.14` |
| `--radius-pill` | 999px |

**Radius is 999px or nothing.** Rectangular blocks are never rounded; the single exception is the
3px checkbox square inside the calculator chips, which is written inline where it is used.

`tailwind.config.ts` carries only content globs — in v4 the tokens live in `@theme`, and copies in
both places drift.

### Card grids draw seams with `gap: 1px`

Every card grid (advantages, discounts, article cards, related) sits on a tinted background and
separates its cards with a 1px gap, not with per-card borders. Borders double up on the seams.

### Fonts

- **Inter Tight** (body), **JetBrains Mono** (labels), **Fraunces** (display) and **Marggraff**
  (the `.team` wordmark tail only) — all self-hosted via `next/font` in `src/app/layout.tsx`.
- Fraunces ships no Cyrillic, so Russian headings render in Georgia. The prototype behaves the
  same way; do not "fix" it by swapping the family.
- Mono text is always uppercase and tracked — use the `.mono-label` class rather than repeating
  the three declarations.

### Scroll engine (`src/lib/story-scroll.ts`)

`useStoryScroll()` paints **everything scroll-dependent in one `requestAnimationFrame`** per
scroll/resize: sticky tracks, parallax, topbar state, active menu item, progress bar. Splitting
this across listeners is what made the prototype's menu lag. The active section is the one
crossing `0.38 × viewport height` — deliberately not an IntersectionObserver.

The engine only writes attributes (`data-on`, `data-solid`) plus two numeric transforms; the
colours and transitions live in `globals.css`. Every CSS default is the no-JS state.

`useStoryReveal()` handles entrance animations. The hidden state exists only while
`html.story-reveal` is set, and only the hook sets it, so a dead observer or missing JS leaves the
page fully readable. A 4s failsafe reveals anything the observer missed.

`prefers-reduced-motion` disables reveals, parallax, the slider intro, smooth scrolling and the
custom cursor.

### Section 02 must degrade

Below 900px wide **or** 620px tall the sticky track becomes ordinary flow, the frame column is
hidden and all six steps show at full strength. This lives in `globals.css` (`.story-track`,
`.story-track-pane`); the engine detects the degraded state by reading computed `position`. Without
it the steps cannot be scrolled through on a short laptop screen.

### Calculator state

`src/lib/calculator-context.tsx` — React Context + `useReducer`:

```ts
{ packageKey, services, unit, areaM2, lmValue, hoodCount, objectKey }
```

The provider wraps `<main>` on the home page, so sections 02, 05 and 07 share one state. A
`PRESET` action sets the package, its default services plus one extra, and syncs the form's object
field; callers then `scrollToSection('07')`.

Pricing lives in `src/lib/pricing.ts` (pure, unit-tested). `computeEstimate` is what the story
uses: volume in m² or in duct metres, chip-ordered breakdown, lines rounded to 100 ₽, and the
−20% discount surfacing at 30 000 ₽. Coefficients and rates come from the handoff README.

### Lead form

Posts to `/api/submit` → `src/lib/sheets.ts` appends a row via `googleapis` JWT. Requires
`.env.local` with `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (literal `\n`),
`GOOGLE_SHEET_ID`. The route recomputes the estimate server-side rather than trusting the client.

The submit button is disabled until name, phone and the personal-data consent are present, and its
label names what is missing — that is a specified state, not decoration. Phone is stored as
`+7XXXXXXXXXX`; the input shows 10 digits grouped `3 3 2 2` and drops a pasted leading 7/8.

`src/lib/schemas.test.ts` pins the payload shape: the form builds it by hand, and a field renamed
on one side only would otherwise surface as a 400 on a real lead.

### Articles

Content lives in `src/data/articles.ts` as typed blocks (`p / h / quote / list / img / pair /
note`) rendered by `src/components/story/ArticleBody.tsx`. Heading blocks get `#h1`, `#h2` … and
the table of contents is built from the same counter. Body copy is final — transferred verbatim
from the handoff and not to be rewritten.

Each article also carries a `faq` array that predates the redesign; it renders under the body and
feeds `FAQPage` structured data.

### Before/after slider

`src/components/story/CompareSlider.tsx` writes its position straight to the DOM instead of React
state — a drag repaints on every pointer move. It starts closed, plays to 62% once on first sight,
takes 6% per arrow key, and replays when the object tab changes. `role="slider"` with live
`aria-valuenow`.

### What NOT to touch

- Copy anywhere on the site — every string is final client-approved text.
- `src/lib/pricing.ts` formulas without updating `pricing.test.ts` and the handoff README together.
- `/api/submit` and `src/lib/sheets.ts`.
- The palette and the four typefaces.
- Article URLs (`/blog/<slug>`) — they are indexed.
