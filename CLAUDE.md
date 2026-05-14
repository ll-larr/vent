# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js on localhost:3000)
npm run build    # Production build
npm run start    # Start production server
```

No test runner is configured.

## Architecture

**Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form + Zod

**Path alias:** `@/` maps to `src/` (configured in `tsconfig.json`)

### Page structure

Each route under `src/app/` (e.g. `/services`, `/trust`, `/prices`, `/promos`, `/contacts`, `/privacy`) renders a single full-page component from `src/components/<PageName>Page/`. The root layout (`src/app/layout.js`) wraps all pages with global styles and the Google Fonts import (Onest).

### Component/style co-location

Every component lives in `src/components/<ComponentName>/` as a `.tsx` file. Styles use Tailwind utility classes — no per-component SCSS files.

### Styling conventions

- Design tokens (brand colors, radii) are defined in `tailwind.config.ts` under `theme.extend`.
- `src/app/globals.css` imports Tailwind base and defines only global resets and keyframes.
- Content width: `max-w-[1120px]`. Section padding: consistent Tailwind spacing (`py-24 px-6` at base, `py-16` on mobile).

### Scroll animations

`src/lib/useScrollAnim.js` is a client-side hook that uses `IntersectionObserver` to watch elements with the `data-anim` attribute inside a container ref. When they enter the viewport, it adds the `visible` class with a staggered delay (120ms per sibling). Components using this must be `'use client'` and apply `@mixin fade-up` in their SCSS.

### Header visibility

`Header.js` is a sticky nav that hides by default and becomes `.visible` when the `.hero-header` element scrolls out of view. On pages without a hero (inner pages), it immediately adds `visible`. The `HeroHeader` component renders the full-bleed dark hero used only on the home page.

### Shared navigation data

`src/lib/nav.js` exports `navLinks` (the route list) and `LogoSvg` (the inline SVG logo). Import from here rather than duplicating nav items.
