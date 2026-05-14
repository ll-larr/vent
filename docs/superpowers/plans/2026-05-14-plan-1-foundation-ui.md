# Clean Vent — Plan 1: Foundation & UI Sections

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the project to TypeScript + Tailwind + shadcn/ui and build all visual sections of the landing page (Hero through Promos), Header, and Footer.

**Architecture:** Full stack migration from JS+Sass to TS+Tailwind. Each landing section is a standalone component under `src/components/`. The home page (`src/app/page.tsx`) assembles them in order. No interactivity in this plan — Calculator and Form are Plan 2.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, shadcn/ui, Onest font (Google Fonts)

> **Design note:** When implementing UI components (Tasks 6–15), invoke the `ui-ux-pro-max` and `frontend-design` skills. Use green palette: `brand-DEFAULT=#1e5c32`, `brand-hover=#2d7d46`, `brand-light=#eef5ef`, `brand-muted=#5a6b5e`, `bg=#f7faf7`. Ensure all text has sufficient contrast — no text should blend with its background.

---

## File Map

**Create:**
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.js`
- `components.json`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/lib/nav.ts`
- `src/lib/useScrollAnim.ts`
- `src/components/Header/Header.tsx`
- `src/components/Footer/Footer.tsx`
- `src/components/Hero/Hero.tsx`
- `src/components/Services/Services.tsx`
- `src/components/HowWeWork/HowWeWork.tsx`
- `src/components/Portfolio/Portfolio.tsx`
- `src/components/Stats/Stats.tsx`
- `src/components/Reviews/Reviews.tsx`
- `src/components/About/About.tsx`
- `src/components/Promos/Promos.tsx`

**Delete (after migration):**
- `src/app/variables.scss`
- `src/app/globals.scss`
- `jsconfig.json`
- `src/lib/nav.js`
- `src/lib/useScrollAnim.js`
- All `src/components/*/style.scss`
- All `src/components/**/*.js` (replaced by .tsx)
- `src/app/services/`, `src/app/trust/`, `src/app/prices/`, `src/app/promos/` directories

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install TypeScript and type packages**

```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

- [ ] **Step 2: Install Tailwind CSS**

```bash
npm install --save-dev tailwindcss postcss autoprefixer
```

- [ ] **Step 3: Install shadcn/ui peer dependencies**

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react @radix-ui/react-checkbox @radix-ui/react-label
```

- [ ] **Step 4: Verify package.json has all deps, then commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install typescript, tailwind, shadcn deps"
```

---

## Task 2: Configure TypeScript

**Files:**
- Create: `tsconfig.json`
- Delete: `jsconfig.json`

- [ ] **Step 1: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Delete `jsconfig.json`**

```bash
rm jsconfig.json
```

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: configure typescript"
```

---

## Task 3: Configure Tailwind CSS

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`

- [ ] **Step 1: Create `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 2: Create `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1e5c32',
          hover: '#2d7d46',
          light: '#eef5ef',
          muted: '#5a6b5e',
        },
        bg: '#f7faf7',
      },
      fontFamily: {
        sans: ['Onest', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      maxWidth: {
        content: '1120px',
      },
      borderRadius: {
        pill: '980px',
        card: '20px',
      },
      backgroundImage: {
        hero: 'linear-gradient(160deg, #0f2d1a 0%, #1e5c32 60%, #163d24 100%)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts postcss.config.js
git commit -m "chore: configure tailwind css"
```

---

## Task 4: Configure shadcn/ui utilities

**Files:**
- Create: `src/lib/utils.ts`
- Create: `components.json`

- [ ] **Step 1: Create `src/lib/utils.ts`** (shadcn helper)

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create `components.json`** (shadcn config)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": false
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/utils.ts components.json
git commit -m "chore: add shadcn/ui utilities"
```

---

## Task 5: Global styles and layout

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Delete: `src/app/globals.scss`, `src/app/variables.scss`

- [ ] **Step 1: Create `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    background-color: #f7faf7;
    color: #1a1a1a;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
}

@layer utilities {
  /* attribute selector — matches elements with data-anim attribute, not a class */
  [data-anim] {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  [data-anim].visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 2: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clean Vent — Чистка вентиляции',
  description: 'Профессиональная чистка и дезинфекция систем вентиляции для бизнеса',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Delete old style files**

```bash
rm src/app/globals.scss src/app/variables.scss
```

- [ ] **Step 4: Verify `npm run dev` starts without errors**

```bash
npm run dev
```

Expected: server starts on localhost:3000, no compilation errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: migrate global styles to tailwind"
```

---

## Task 6: Navigation data and scroll animation hook

**Files:**
- Create: `src/lib/nav.ts`
- Create: `src/lib/useScrollAnim.ts`
- Delete: `src/lib/nav.js`, `src/lib/useScrollAnim.js`

- [ ] **Step 1: Create `src/lib/nav.ts`**

```ts
export interface NavLink {
  href: string;
  label: string;
  anchor?: boolean;
}

export const navLinks: NavLink[] = [
  { href: '#services', label: 'Услуги', anchor: true },
  { href: '#portfolio', label: 'Портфолио', anchor: true },
  { href: '#about', label: 'О компании', anchor: true },
  { href: '#promos', label: 'Акции', anchor: true },
  { href: '#calculator', label: 'Цены', anchor: true },
  { href: '#contacts', label: 'Контакты', anchor: true },
];

export const LogoSvg = () => (
  <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
    <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M14 6C14 6 18 10 18 14C18 18 14 22 14 22C14 22 10 18 10 14C10 10 14 6 14 6Z"
      fill="currentColor"
      opacity="0.2"
    />
    <path
      d="M6 14C6 14 10 10 14 10C18 10 22 14 22 14C22 14 18 18 14 18C10 18 6 14 6 14Z"
      fill="currentColor"
      opacity="0.2"
    />
    <circle cx="14" cy="14" r="3" fill="currentColor" />
  </svg>
);
```

- [ ] **Step 2: Create `src/lib/useScrollAnim.ts`**

```ts
'use client';
import { useEffect, RefObject } from 'react';

export default function useScrollAnim(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref?.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = Array.from(
              entry.target.parentElement?.children ?? []
            ).filter((c) => c.hasAttribute('data-anim'));
            const delay = siblings.indexOf(entry.target as Element) * 120;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    ref.current.querySelectorAll('[data-anim]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}
```

- [ ] **Step 3: Delete old JS files**

```bash
rm src/lib/nav.js src/lib/useScrollAnim.js
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/nav.ts src/lib/useScrollAnim.ts
git commit -m "feat: migrate nav and scroll animation hook to typescript"
```

---

## Task 7: Header component

**Files:**
- Create: `src/components/Header/Header.tsx`
- Delete: `src/components/Header/Header.js`, `src/components/Header/style.scss`

> **Design:** Use `ui-ux-pro-max` and `frontend-design` skills. Dark green background (`bg-brand`), white text, sticky top-0, hidden by default (`opacity-0 -translate-y-full`), becomes visible (`opacity-100 translate-y-0`) when `.hero-section` scrolls out of view. On pages without `.hero-section` — always visible. Smooth transition. Mobile: hamburger menu.

- [ ] **Step 1: Create `src/components/Header/Header.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { navLinks, LogoSvg } from '@/lib/nav';

export default function Header() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = document.querySelector('.hero-section');
    if (!hero || !navRef.current) {
      navRef.current?.classList.add('visible');
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => navRef.current?.classList.toggle('visible', !e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'bg-brand text-white',
        'opacity-0 -translate-y-full',
        'transition-all duration-300 ease-out',
        '[&.visible]:opacity-100 [&.visible]:translate-y-0',
      ].join(' ')}
    >
      {/* Implementation: invoke ui-ux-pro-max for full design */}
      {/* Required elements: logo left, anchor links center, phone + CTA button right */}
      {/* Mobile: collapse links into hamburger toggle */}
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <LogoSvg />
          <span>Clean Vent</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a href="tel:+74951234567" className="hidden md:block text-sm text-white/80 hover:text-white">
            +7 (495) 123-45-67
          </a>
          <a
            href="#contacts"
            className="bg-white text-brand font-medium text-sm px-4 py-2 rounded-pill hover:bg-brand-light transition-colors"
          >
            Оставить заявку
          </a>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Delete old files**

```bash
rm src/components/Header/Header.js src/components/Header/style.scss
```

- [ ] **Step 3: Verify header compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: no TypeScript errors for Header.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header/Header.tsx
git commit -m "feat: migrate Header to typescript + tailwind"
```

---

## Task 8: Footer component

**Files:**
- Create: `src/components/Footer/Footer.tsx`
- Delete: `src/components/Footer/Footer.js`, `src/components/Footer/style.scss`

> **Design:** Use `ui-ux-pro-max`. Dark green background, white text. Three columns: logo+description, navigation links, contact info. Bottom bar with copyright and link to `/privacy`.

- [ ] **Step 1: Create `src/components/Footer/Footer.tsx`**

```tsx
import Link from 'next/link';
import { navLinks, LogoSvg } from '@/lib/nav';

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      {/* Implementation: invoke ui-ux-pro-max for full design */}
      {/* Required: 3-column grid, logo+tagline, nav links, contacts */}
      {/* Bottom bar: © 2024 Clean Vent · Политика конфиденциальности */}
      <div className="max-w-content mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg mb-4">
              <LogoSvg />
              <span>Clean Vent</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Профессиональная чистка вентиляционных систем для бизнеса
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/50">
              Навигация
            </h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/50">
              Контакты
            </h4>
            <div className="space-y-2 text-sm text-white/70">
              <p><a href="tel:+74951234567" className="hover:text-white transition-colors">+7 (495) 123-45-67</a></p>
              <p><a href="mailto:info@cleanvent.ru" className="hover:text-white transition-colors">info@cleanvent.ru</a></p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Clean Vent. Все права защищены.</p>
          <Link href="/privacy" className="hover:text-white/70 transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Delete old files**

```bash
rm src/components/Footer/Footer.js src/components/Footer/style.scss
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer/Footer.tsx
git commit -m "feat: migrate Footer to typescript + tailwind"
```

---

## Task 9: Hero section

**Files:**
- Create: `src/components/Hero/Hero.tsx`
- Delete: `src/components/HomeHero/`, `src/components/HeroHeader/`

> **Design:** Use `ui-ux-pro-max` + `frontend-design`. Full-height dark green gradient hero (`bg-hero`). Large white heading, subtitle text. Two buttons: «Вызвать специалиста» (primary, white bg) and «Узнать больше» (secondary, outline). Scroll indicator dot at bottom. Add class `hero-section` to the section element — Header uses this to detect scroll position.

- [ ] **Step 1: Create `src/components/Hero/Hero.tsx`**

```tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      id="hero"
      className="hero-section relative min-h-screen flex flex-col items-center justify-center bg-hero text-white overflow-hidden"
    >
      {/* Background grid overlay */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-content mx-auto px-6 text-center">
        {/* Implementation: invoke ui-ux-pro-max for full typography + spacing design */}
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-[-0.04em] mb-6">
          Чистая вентиляция —<br />
          <span className="text-brand-light">здоровый воздух</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Полный комплекс услуг по очистке и дезинфекции систем вентиляции
          для ресторанов, офисов и производств
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contacts"
            className="bg-white text-brand font-semibold px-8 py-4 rounded-pill text-lg hover:bg-brand-light transition-all hover:scale-105 w-full sm:w-auto text-center"
          >
            Вызвать специалиста
          </a>
          <a
            href="#services"
            className="border border-white/20 text-white font-medium px-8 py-4 rounded-pill text-lg hover:bg-white/10 transition-all w-full sm:w-auto text-center"
          >
            Наши услуги
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-[1px] h-8 bg-white animate-bounce" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete old components**

```bash
rm -rf src/components/HomeHero src/components/HeroHeader
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero/Hero.tsx
git commit -m "feat: add Hero section"
```

---

## Task 10: Services section

**Files:**
- Create: `src/components/Services/Services.tsx`
- Delete: `src/components/HomeServices/`, `src/components/FeaturesStrip/`

> **Design:** Use `ui-ux-pro-max`. Light background (`bg-bg`). Section label + heading. 4 service cards in grid: Вентиляция (основное), Вытяжки, Трубы и воздуховоды, Резервуары. Each card: icon, title, short description, «от X ₽» price tag. Cards have `data-anim` for scroll animation.

- [ ] **Step 1: Create `src/components/Services/Services.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';

const services = [
  {
    icon: '🌀',
    title: 'Чистка вентиляции',
    description: 'Очистка вентиляционных каналов от пыли и жира. Восстанавливаем проектную пропускную способность.',
    price: 'от 90 ₽/пог.м',
    featured: true,
  },
  {
    icon: '🔲',
    title: 'Чистка вытяжек',
    description: 'Комплексная чистка вытяжных зонтов, крыльчаток, гидрофильтров. Обязательно для общепита.',
    price: 'от 1 800 ₽/шт',
    featured: false,
  },
  {
    icon: '〰️',
    title: 'Трубы и воздуховоды',
    description: 'Очистка труб различного диаметра от пыли, жира и загрязнений. Механический и химический методы.',
    price: 'от 90 ₽/пог.м',
    featured: false,
  },
  {
    icon: '🪣',
    title: 'Резервуары',
    description: 'Чистка и дезинфекция резервуаров для воды. Лабораторный контроль качества.',
    price: 'от 350 ₽/м³',
    featured: false,
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="services" ref={ref} className="py-24 px-6 bg-bg">
      {/* Implementation: invoke ui-ux-pro-max for full design */}
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Что мы делаем
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
            Услуги
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed">
            Полный комплекс работ по чистке вентиляционных систем любой сложности
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              data-anim
              className="bg-white rounded-card p-6 border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-4">{s.description}</p>
              <span className="text-brand font-semibold text-sm">{s.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete old components**

```bash
rm -rf src/components/HomeServices src/components/FeaturesStrip src/components/Advantages
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Services/Services.tsx
git commit -m "feat: add Services section"
```

---

## Task 11: HowWeWork section

**Files:**
- Create: `src/components/HowWeWork/HowWeWork.tsx`

> **Design:** Use `ui-ux-pro-max`. Alternating or numbered steps layout. Steps: 1. Заявка → 2. Осмотр объекта → 3. Договор → 4. Работа → 5. Акт выполненных работ. Brand green accent on step numbers.

- [ ] **Step 1: Create `src/components/HowWeWork/HowWeWork.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';

const steps = [
  { num: '01', title: 'Заявка', desc: 'Оставляете заявку на сайте или звоните — перезваниваем в течение 30 минут' },
  { num: '02', title: 'Осмотр', desc: 'Выезжаем на объект бесплатно. Оцениваем объём работ и рассчитываем стоимость' },
  { num: '03', title: 'Договор', desc: 'Заключаем договор с фиксированной ценой. Никаких скрытых платежей' },
  { num: '04', title: 'Работа', desc: 'Выполняем чистку в удобное для вас время. Видеофиксация до и после' },
  { num: '05', title: 'Акт', desc: 'Подписываем акт выполненных работ. Гарантия на все услуги' },
];

export default function HowWeWork() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="how-we-work" ref={ref} className="py-24 px-6 bg-brand-light">
      {/* Implementation: invoke ui-ux-pro-max for full design */}
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Процесс
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em]">
            Как мы работаем
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((s) => (
            <div key={s.num} data-anim className="relative">
              <div className="text-4xl font-bold text-brand/20 mb-3">{s.num}</div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{s.desc}</p>
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
git commit -m "feat: add HowWeWork section"
```

---

## Task 12: Portfolio section

**Files:**
- Create: `src/components/Portfolio/Portfolio.tsx`
- Delete: `src/components/Comparison/`

> **Design:** Use `ui-ux-pro-max`. «До / После» image sliders or side-by-side cards. Use existing images from `public/images/compare-*.jpg`. Filter tabs by category optional.

- [ ] **Step 1: Create `src/components/Portfolio/Portfolio.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';

const items = [
  { before: '/images/compare-dust-before.jpg', after: '/images/compare-dust-after.jpg', label: 'Чистка от пыли' },
  { before: '/images/compare-grease1-before.jpg', after: '/images/compare-grease1-after.jpg', label: 'Чистка от жира' },
  { before: '/images/compare-grease2-before.jpg', after: '/images/compare-grease2-after.jpg', label: 'Жировые отложения' },
  { before: '/images/compare-reservoir-before.jpg', after: '/images/compare-reservoir-after.jpg', label: 'Резервуар' },
];

export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="portfolio" ref={ref} className="py-24 px-6 bg-bg">
      {/* Implementation: invoke ui-ux-pro-max for full design with image sliders */}
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Наши работы
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
            До и после
          </h2>
          <p className="text-brand-muted text-lg">Реальные объекты наших клиентов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div key={item.label} data-anim className="rounded-card overflow-hidden bg-white border border-black/[0.04] shadow-sm">
              <div className="grid grid-cols-2">
                <div className="relative aspect-[4/3]">
                  <Image src={item.before} alt={`${item.label} до`} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">До</span>
                </div>
                <div className="relative aspect-[4/3]">
                  <Image src={item.after} alt={`${item.label} после`} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-brand text-white text-xs px-2 py-1 rounded">После</span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete old component**

```bash
rm -rf src/components/Comparison
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Portfolio/Portfolio.tsx
git commit -m "feat: add Portfolio before/after section"
```

---

## Task 13: Stats section

**Files:**
- Create: `src/components/Stats/Stats.tsx` (replace existing)

> **Design:** Use `ui-ux-pro-max`. Dark green background, white text. 4 large numbers with labels. Animated count-up on scroll optional.

- [ ] **Step 1: Overwrite `src/components/Stats/Stats.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';

const stats = [
  { value: '500+', label: 'Объектов почищено' },
  { value: '8 лет', label: 'На рынке' },
  { value: '98%', label: 'Клиентов возвращаются' },
  { value: '24ч', label: 'Выезд специалиста' },
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} className="py-24 px-6 bg-brand text-white">
      {/* Implementation: invoke ui-ux-pro-max for typography and layout */}
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.label} data-anim className="text-center">
              <div className="text-5xl md:text-6xl font-bold tracking-[-0.03em] mb-2">{s.value}</div>
              <div className="text-white/60 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete old files**

```bash
rm -f src/components/Stats/Stats.js src/components/Stats/style.scss
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Stats/Stats.tsx
git commit -m "feat: migrate Stats section to typescript + tailwind"
```

---

## Task 14: Reviews section

**Files:**
- Create: `src/components/Reviews/Reviews.tsx`

> **Design:** Use `ui-ux-pro-max`. Card grid or horizontal scroll. Each card: stars, review text, client name, company name. Light background.

- [ ] **Step 1: Create `src/components/Reviews/Reviews.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';

const reviews = [
  {
    name: 'Алексей Петров',
    company: 'Ресторан «Якорь»',
    text: 'Работаем с Clean Vent уже 3 года. Всегда приезжают вовремя, качество на высоте. После чистки вытяжки запах жира в зале пропал полностью.',
    rating: 5,
  },
  {
    name: 'Марина Соколова',
    company: 'Офисный центр «Меридиан»',
    text: 'Обслуживают наш бизнес-центр ежеквартально. Документы, акты — всё в порядке. Санэпидстанция претензий не имеет.',
    rating: 5,
  },
  {
    name: 'Дмитрий Козлов',
    company: 'Столовая завода «Прогресс»',
    text: 'Большой объём работ выполнили за выходные, не мешая производству. Цена честная, всё как договорились.',
    rating: 5,
  },
];

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="reviews" ref={ref} className="py-24 px-6 bg-brand-light">
      {/* Implementation: invoke ui-ux-pro-max for full design */}
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Отзывы
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em]">
            Нам доверяют
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} data-anim className="bg-white rounded-card p-6 border border-black/[0.04] shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-brand text-lg">★</span>
                ))}
              </div>
              <p className="text-brand-muted text-sm leading-relaxed mb-6">"{r.text}"</p>
              <div>
                <p className="font-semibold text-sm">{r.name}</p>
                <p className="text-brand-muted text-xs">{r.company}</p>
              </div>
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
git add src/components/Reviews/Reviews.tsx
git commit -m "feat: add Reviews section"
```

---

## Task 15: About section

**Files:**
- Create: `src/components/About/About.tsx`
- Delete: `src/components/TrustPage/`

> **Design:** Use `ui-ux-pro-max`. Two columns: left — text about company + list of certifications/licenses; right — team photos or trust logos. Use existing `public/images/trust-*.jpg`.

- [ ] **Step 1: Create `src/components/About/About.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';

const clients = [
  { src: '/images/trust-gazprom.jpg', alt: 'Газпром' },
  { src: '/images/trust-miratorg.jpg', alt: 'Мираторг' },
  { src: '/images/trust-multon.jpg', alt: 'Мултон' },
  { src: '/images/trust-ska.jpg', alt: 'СКА' },
];

const certs = [
  'Лицензия СРО на проведение работ по чистке вентиляции',
  'Допуск к работам в пищевых производствах',
  'Сертификат соответствия ГОСТ Р',
  'Аккредитованная лаборатория для анализов ОМЧ и БГКП',
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="about" ref={ref} className="py-24 px-6 bg-bg">
      {/* Implementation: invoke ui-ux-pro-max for full design */}
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-anim>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
              О компании
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6">
              8 лет чистим воздух для бизнеса
            </h2>
            <p className="text-brand-muted leading-relaxed mb-8">
              Мы специализируемся на чистке вентиляционных систем для предприятий общественного питания,
              офисных и производственных помещений. Работаем по договору с актом выполненных работ.
            </p>
            <ul className="space-y-3">
              {certs.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-brand-muted">
                  <span className="text-brand mt-0.5">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div data-anim>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-muted mb-6">
              Нам доверяют
            </p>
            <div className="grid grid-cols-2 gap-4">
              {clients.map((c) => (
                <div key={c.alt} className="bg-white rounded-card p-4 flex items-center justify-center border border-black/[0.04] aspect-video relative">
                  <Image src={c.src} alt={c.alt} fill className="object-contain p-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete old component**

```bash
rm -rf src/components/TrustPage
```

- [ ] **Step 3: Commit**

```bash
git add src/components/About/About.tsx
git commit -m "feat: add About section"
```

---

## Task 16: Promos section

**Files:**
- Create: `src/components/Promos/Promos.tsx`
- Delete: `src/components/HomeCTA/`, `src/components/PromosPage/`

> **Design:** Use `ui-ux-pro-max`. Grid of promo cards. Use existing `public/images/promo-*.jpg`. Each card: image, title, description, validity.

- [ ] **Step 1: Create `src/components/Promos/Promos.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';

const promos = [
  {
    img: '/images/promo-audit.jpg',
    title: 'Бесплатный аудит',
    desc: 'Выезд специалиста и оценка системы вентиляции бесплатно при заключении договора',
  },
  {
    img: '/images/promo-friend.jpg',
    title: 'Приведи друга',
    desc: 'Скидка 10% вам и другу при оформлении заказа по рекомендации',
  },
  {
    img: '/images/promo-restaurant.jpg',
    title: 'Пакет «Общепит»',
    desc: 'Комплексная чистка вентиляции и вытяжек по выгодной цене для ресторанов',
  },
  {
    img: '/images/promo-volume.jpg',
    title: 'Объёмный заказ',
    desc: 'Скидка до 20% при объёме работ от 500 пог.м',
  },
];

export default function Promos() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="promos" ref={ref} className="py-24 px-6 bg-brand-light">
      {/* Implementation: invoke ui-ux-pro-max for full design */}
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Специальные предложения
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em]">
            Акции
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promos.map((p) => (
            <div key={p.title} data-anim className="bg-white rounded-card overflow-hidden border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-2">{p.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete old components**

```bash
rm -rf src/components/HomeCTA src/components/PromosPage
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Promos/Promos.tsx
git commit -m "feat: add Promos section"
```

---

## Task 17: Home page assembly

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Hero from '@/components/Hero/Hero';
import Services from '@/components/Services/Services';
import HowWeWork from '@/components/HowWeWork/HowWeWork';
import Portfolio from '@/components/Portfolio/Portfolio';
import Stats from '@/components/Stats/Stats';
import Reviews from '@/components/Reviews/Reviews';
import About from '@/components/About/About';
import Promos from '@/components/Promos/Promos';

export const metadata: Metadata = {
  title: 'Clean Vent — Чистка вентиляции для бизнеса',
  description: 'Профессиональная чистка вентиляционных систем для ресторанов, офисов, производств. Бесплатный выезд специалиста.',
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <HowWeWork />
        <Portfolio />
        <Stats />
        <Reviews />
        <About />
        <Promos />
        {/* Calculator and ContactSection added in Plan 2 */}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run build to check for errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: compiled successfully, no type errors.

- [ ] **Step 3: Start dev server and verify all sections render**

```bash
npm run dev
```

Open http://localhost:3000. Check: Hero → Services → HowWeWork → Portfolio → Stats → Reviews → About → Promos → Footer. Header should be hidden on hero, appear when scrolling.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble home page with all visual sections"
```

---

## Task 18: Delete remaining old pages and components

**Files:**
- Delete: `src/app/services/`, `src/app/trust/`, `src/app/prices/`, `src/app/promos/`
- Delete: `src/components/ServicesPage/`, `src/components/PricesPage/`, `src/components/PageHero/`

- [ ] **Step 1: Delete old route directories**

```bash
rm -rf src/app/services src/app/trust src/app/prices src/app/promos
```

- [ ] **Step 2: Delete old page components**

```bash
rm -rf src/components/ServicesPage src/components/PricesPage src/components/PageHero
```

- [ ] **Step 3: Verify build still passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: no errors.

- [ ] **Step 4: Final commit for Plan 1**

```bash
git add -A
git commit -m "chore: remove old pages and components, complete Plan 1"
```

---

## Plan 1 Complete

All visual sections are live. Proceed to **Plan 2** for the Calculator, Contact Form, and Google Sheets integration.
