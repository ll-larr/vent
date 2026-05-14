# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js on localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npx tsc --noEmit # Type-check without building
```

No test runner is configured.

## Architecture

**Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form + Zod, lucide-react, googleapis

**Path alias:** `@/` maps to `src/`

### Site structure

Single-page landing at `/` assembles all sections via `HomeOrchestrator`. Only two additional routes exist: `/contacts` and `/privacy`. There are no dynamic routes.

The home page render order: `Header → Hero → Services → HowWeWork → Portfolio → Stats → Reviews → About → Promos → HomeOrchestrator (Calculator + ContactSection) → Footer`

### Component conventions

Every component lives in `src/components/<Name>/<Name>.tsx`. All are `.tsx` (not `.jsx`). Styles are Tailwind utility classes only — no SCSS.

Components that use scroll animations or browser APIs must include `'use client'` at the top.

### Design tokens

All design tokens live in `tailwind.config.ts` under `theme.extend`. Key values:
- Brand colors: `brand` (#1e5c32), `brand-dark` (#0f3d22), `brand-accent` (#22c55e), `brand-light` (#eef5ef), `brand-muted` (#5a6b5e)
- Background: `bg` (#f7faf7), `stone` (#f4f4f2), `ink` (#111827)
- Border radius: `card` (16px), `xl2` (24px), `pill` (980px)
- Shadows: `card`, `lifted`, `float`
- Fonts: `font-sans` = Onest, `font-display` = Fraunces (loaded via Google Fonts in `layout.tsx`)

`src/app/globals.css` defines animation keyframes and the `[data-anim]` / `[data-anim].visible` scroll-reveal system.

### Icons

All icons come from `src/lib/icons.tsx` which re-exports from `lucide-react`. Always import icons from `@/lib/icons`, never directly from `lucide-react`. Use `strokeWidth={1.5}` consistently.

### Scroll animations

`src/lib/useScrollAnim.ts` — pass a `ref` to a section element. It watches all `[data-anim]` children with IntersectionObserver and adds the `visible` class with staggered `transition-delay` (70ms per element by default).

**Critical:** Never put hover/dynamic styles on the same element that has `data-anim`. The CSS rule `[data-anim].visible { opacity: 1 }` has higher specificity than Tailwind classes and will override them. Pattern: outer `<div data-anim>` for reveal, inner `<div style={...}>` for dynamic styles (use inline `style` prop, not Tailwind classes, for any state-driven opacity/transform).

`src/lib/useCounter.ts` — attach `ref` to a number element; animates from 0 to `target` on scroll with ease-out cubic easing.

### Header behaviour

`Header.tsx` uses IntersectionObserver on `.hero-section` to toggle a `visible` class on itself. Without `.hero-section` (inner pages), it becomes visible immediately. The `visible` class switches from `opacity-0 -translate-y-full` to full visibility, and the background switches from `bg-brand` to glassmorphism (`bg-white/95 backdrop-blur-md`).

### Calculator → ContactForm flow

`HomeOrchestrator.tsx` holds shared state (`preselectedServices`, `preselectedArea`). Calculator calls `onOrder(services, area)` → state updates → `ContactSection` receives props → `ContactForm` is remounted via `key` prop to reset `defaultValues`. `ContactForm` uses `useForm<FormInput, unknown, SubmitFormData>` (three generics) because Zod's `.optional().default([])` makes output type differ from input type.

### Google Sheets integration

Form submissions POST to `/api/submit` → `src/lib/sheets.ts` appends a row to Google Sheets via `googleapis` JWT auth. Requires `.env.local` with `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID`. The private key must keep literal `\n` characters (the code calls `.replace(/\\n/g, '\n')` at runtime).

### Shared nav data

`src/lib/nav.tsx` exports `navLinks` (anchor links) and `LogoSvg`. Import from here for both Header and Footer.
