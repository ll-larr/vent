# AUDIT — Bento Modern reference vs. Next.js port

**Reference:** `vent bento modern/handoff_bento_modern/Vent - Bento Modern.html`
**Date:** 2026-05-16
**Method:** read reference top-to-bottom (CSS tokens → atoms → bento sections → JS scripts) and grep the port for each selector / keyframe / event listener.

Items are checked off as fixed. `□` = open, `■` = fixed in this pass.

---

## 1. Fonts

| # | Issue | Reference | Port | Fix |
|---|---|---|---|---|
| F1 | Fraunces axes | `ital,opsz@9..144,wght@300..600` | `axes: ['SOFT']`, no `opsz`, no italic | ■ replace `next/font` Fraunces with `<link>` to Google Fonts (matches reference exactly, also unblocks Cyrillic). |
| F2 | Fraunces Cyrillic | reference loads Cyrillic by default | `subsets: ['latin','latin-ext']` (next/font types reject `'cyrillic'` for Fraunces in `next@14.2`) | ■ same as F1 — `<link>` request includes Cyrillic via `&subset=cyrillic`. |
| F3 | Inter Tight weights | reference uses `400/500/600` | port loads `400/500/600/700` (700 unused) | ■ drop 700. |
| F4 | `.font-display` override in `globals.css` | n/a | line 154-157: `.font-display { font-family: 'Fraunces', Georgia, serif; }` — clobbers the `var(--font-fraunces)` from next/font | ■ delete the rule. |
| F5 | `CLAUDE.md` documentation | n/a | claims `font-sans = Onest`, mentions `HomeOrchestrator` (removed), wrong section order | ■ rewrite to match current architecture. |
| F6 | `tailwind.config.ts` legacy `fontFamily` | n/a | duplicates v4 `@theme` definitions; in Tailwind v4 only `@theme` is read, but having both is a foot-gun | ■ remove `fontFamily` from `tailwind.config.ts`. Trim other duplicated `colors`/`borderRadius` if they conflict; keep only what `@theme` doesn't cover. |
| F7 | Body explicit font | reference: `body { font-family: var(--sans); }` | port body has `font-family: var(--font-inter-tight)…` — works but only Latin glyphs | ■ keeps working after F1-F3 fixes (next/font Inter Tight has Cyrillic). No further change. |

---

## 2. Animations / Transitions

| # | Reference selector | What animates | Port status | Fix |
|---|---|---|---|---|
| A1 | `.btn.lime::before` (line 121) | `transform: scaleX(0→1) .45s cubic-bezier(.65,0,.35,1)` wipe-fill ink, text turns lime | No such class in port; `.btn.lime` doesn't exist; Services feature CTA, Hero status CTA, calc result CTA all use ad-hoc Tailwind that mimics but inconsistently | ■ add `.btn-lime` and `.btn-ink` utility classes in `globals.css` with `::before` wipe + arrow translate. Use across Services, Hero status, Calculator result, Mini-calc footer. |
| A2 | `.btn.lime:hover .arrow` | `translateX(4) .35s cubic-bezier(.65,0,.35,1)` | mixed `translate-x-0.5` / `translate-x-1` in different components, no shared easing | ■ part of `.btn-lime` class — single source of truth. |
| A3 | `.btn:hover .arrow` (non-lime) | `translateX(3) .25s` | inconsistent | ■ same `.btn-*` family. |
| A4 | `.pill .dot.live` + `.h-status .live-dot` | `pulse 1.6s ease-in-out infinite`, keyframe = `50% { box-shadow: 0 0 0 8px rgba(200,255,62,0); }` | port has `live-pulse` keyframe identical to reference; `animate-live-pulse` utility applied in Hero `.h-status` and MiniCalc badge ✓ | OK |
| A5 | `.compare-grip::after` | `ringspin 9s linear infinite` dashed ring | port has `animate-ringspin` on `<span>` inside grip ✓ | OK |
| A6 | `.compare` JS (line 2488) | auto ping-pong 28↔72% 4.8s cos, IO-gated, hover takes control | port `Cases.tsx CompareSlider` ports the same RAF + IO logic. Check: `userControl` releases on `mouseleave`, `t0Ref` rebases. Looks correct. ✓ | OK |
| A7 | `.h-status .now-foot a.now-cta::before` | wipe-fill lime `.45s cubic-bezier(.65,0,.35,1)`, text turns ink | port implements in JSX via `<span>` overlay — works but verbose, will refactor to shared `.btn-lime` class | ■ refactor to shared utility. |
| A8 | `.case-tile:hover .case-expand` | grid-rows `0fr→1fr .35s cubic-bezier(.16,1,.3,1)` + opacity `.25s` | port uses `grid-rows-[0fr] group-hover:grid-rows-[1fr]` ✓ | OK |
| A9 | `.ven-tile:hover img` | grayscale .3→0, opacity .88→1, scale 1.03; `filter .35s, transform .8s` | port: `group-hover:opacity-100 group-hover:[filter:grayscale(0)_contrast(1)]` with `duration-[800ms]` ✓ | OK |
| A10 | `.ven-tile:hover .ven-popup` | translateY(6)→0 + opacity 0→1, pointer-events on | port has `group-hover:opacity-100 group-hover:translate-y-0` ✓ | OK |
| A11 | `.pr-step:hover` | translateY(-2px) `.35s cubic-bezier(.16,1,.3,1)` | port `hover:-translate-y-0.5` ≈ -2px ✓ | OK |
| A12 | `.pr-step .pr-popup` / `[data-hint=open]` | popup `translateY(8)→0` + opacity, static fades out | port uses `group-data-[hint=open]:[…]`. **Risk:** Tailwind v4 group-data syntax — may or may not match. | ■ replace with explicit CSS rule in `globals.css` (`.pr-step[data-hint=open] .pr-popup { opacity:1; transform:none; pointer-events:auto }` etc.) — guarantees match. |
| A13 | HowWeWork auto-demo | 500ms after section visible → first card `data-hint='open'` for 1500ms; cancelled on hover | port `useEffect` does exactly this ✓ — works after A12 selector fix. | depends on A12 |
| A14 | Counters (line 2716) | 0 → target over 1.1s easeOutCubic via RAF, once on IO threshold 0.4 | port `useCounter(target, 1100)` hook does this ✓ | OK |
| A15 | `.calc-slider` thumb | `transform: scale(1.08) .15s` on hover; inset 7px brand | port has `<style jsx global>` block with `::-webkit-slider-thumb` styles ✓ | OK |
| A16 | `.calc-slider .fill` | `transition: width .08s linear` | port: `transition-[width] duration-75` ≈ .075s — close enough ✓ | OK |
| A17 | `.mc-field--hood` | `flex-grow .45s cubic-bezier(.16,1,.3,1)` collapse when no-hood pkg | port conditionally **mounts/unmounts** the field — abrupt | ■ render unconditionally; toggle `data-hood-shown` attribute → CSS animates `flex-grow`/`opacity`. |
| A18 | `.case-tile .case-info` | bg → `rgba(20,19,18,.85) .25s` on hover | port: `group-hover:bg-ink/85 transition-colors` ✓ | OK |
| A19 | `[data-anim]` reveal | **none** in reference | port already neutralised in globals.css (opacity:1, transform:none) ✓ | OK |

---

## 3. Interactions / JS-logic

| # | Reference | Port | Fix |
|---|---|---|---|
| I1 | Header active link via IO on `section[id]` | port `Header.tsx` IO on each id, sets `activeId` state, lime highlight ✓ | OK |
| I2 | Phone mask `+7 999 888 77 66`, prefix outside input, 10 digits in, leading 7/8 stripped | port `ContactForm.tsx` uses Controller + `digitsOnly`/`formatPhone` helpers, prefix `<span>+7</span>` outside `<input>` ✓ | OK |
| I3 | `data-calc-jump="<svc>"` from Services → preselects pkg + service in Calculator | port: Services renders attr, Calculator `useEffect` document-listener dispatches `SET_PACKAGE` + `TOGGLE_SERVICE` ✓ | OK |
| I4 | Mini-calc + Full-calc share state | port via `CalculatorContext` ✓ | OK |
| I5 | Counters fire once when in view | port `useCounter` ✓ | OK |
| I6 | HowWeWork auto-demo cancels on user hover | port has `mouseover` handler ✓ | OK after A12 |
| I7 | Compare-slider hover takes control, releases on mouseleave with smooth resume | port ✓ | OK |
| I8 | Reference button `.btn:not(.lime):hover .arrow { translateX(3) }` | port has it scattered as `group-hover:translate-x-0.5` etc. | ■ unified via shared `.btn-*` class (A1-A3). |

---

## Summary of edits planned

1. **Fonts (F1-F6):** rewrite `layout.tsx` to drop next/font for Fraunces, swap to `<link>` (matches reference). Trim Inter Tight weights. Delete `.font-display` override. Strip duplicate `fontFamily` from `tailwind.config.ts`. Update CLAUDE.md.
2. **Shared CTA classes (A1-A3, A7, I8):** add `.btn-ink`, `.btn-lime`, `.btn-ghost` utilities to `globals.css` with `::before` wipe + arrow translate. Replace ad-hoc bento-buttons across Hero, Services, Calculator, HowWeWork, ContactForm with these classes.
3. **HowWeWork data-hint (A12-A13):** add plain CSS in `globals.css`: `.pr-step[data-hint="open"] .pr-popup { opacity:1; transform:none; pointer-events:auto }` and inverse for static content fade-out. Drop Tailwind `group-data-[hint=…]` selectors.
4. **Mini-calc hood field (A17):** render always, toggle `data-hood-shown="false"` attribute; CSS animates `flex-grow`/`flex-basis`/`opacity`/`pointer-events`.
5. **Verify:** `npx tsc --noEmit`, `npm test`, `npm run build`.
