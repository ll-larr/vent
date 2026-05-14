# Clean Vent — Plan 2: Calculator, Form & Google Sheets

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the interactive price calculator with service packages, the contact form with validation, and the Google Sheets API integration. Also create the `/contacts` and `/privacy` pages.

**Architecture:** Calculator is a pure client-side React component (useState) with pricing logic in a separate `src/lib/pricing.ts`. Form validation uses React Hook Form + Zod. Submissions go to `src/app/api/submit/route.ts` which writes to Google Sheets via the googleapis library. Calculator pre-fills form fields when user clicks «Оставить заявку».

**Tech Stack:** React Hook Form, Zod, googleapis, Next.js API Routes (App Router)

**Prerequisites:** Plan 1 complete. All base components and Tailwind config are in place.

> **Design note:** When implementing UI components (Tasks 1–2), invoke `ui-ux-pro-max` and `frontend-design` skills.

---

## File Map

**Create:**
- `src/lib/pricing.ts` — pricing constants and calculation logic
- `src/lib/schemas.ts` — Zod schemas for form and API
- `src/components/Calculator/Calculator.tsx` — package selector + price display
- `src/components/Calculator/types.ts` — shared TypeScript types
- `src/components/ContactSection/ContactSection.tsx` — form + contacts wrapper
- `src/components/ContactForm/ContactForm.tsx` — React Hook Form component
- `src/app/api/submit/route.ts` — Google Sheets API route
- `src/lib/sheets.ts` — Google Sheets client
- `src/app/contacts/page.tsx` — standalone contacts page
- `src/app/privacy/page.tsx` — privacy policy page
- `.env.local` (manual — not committed)
- `.env.example` — committed, shows required vars

**Modify:**
- `src/app/page.tsx` — add Calculator and ContactSection
- `package.json` — add googleapis, react-hook-form, zod, @hookform/resolvers

---

## Task 1: Install form and API dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install React Hook Form and Zod**

```bash
npm install react-hook-form zod @hookform/resolvers
```

- [ ] **Step 2: Install Google Sheets client**

```bash
npm install googleapis
npm install --save-dev @types/node
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install react-hook-form, zod, googleapis"
```

---

## Task 2: Calculator types and pricing logic

**Files:**
- Create: `src/components/Calculator/types.ts`
- Create: `src/lib/pricing.ts`

- [ ] **Step 1: Create `src/components/Calculator/types.ts`**

```ts
export type ServiceId =
  | 'vent-dust'
  | 'vent-grease'
  | 'hoods'
  | 'disinfection'
  | 'pipes-dust'
  | 'pipes-grease'
  | 'reservoirs'
  | 'diagnostics';

export type PriceUnit = 'per-sqm' | 'fixed' | 'per-unit';

export interface ServiceDef {
  id: ServiceId;
  label: string;
  unit: PriceUnit;
  priceMin: number; // ₽
  priceMax: number; // ₽
  /** true = priced per m² of room area (with internal pog.m conversion) */
  perSqm: boolean;
}

export type PackageId = 'catering' | 'office' | 'production' | 'custom';

export interface Package {
  id: PackageId;
  label: string;
  icon: string;
  description: string;
  defaultServices: ServiceId[];
}

export interface CalculatorState {
  packageId: PackageId;
  selectedServices: ServiceId[];
  area: number; // m² of room
  hoodCount: number; // number of exhaust hoods
}

export interface PriceRange {
  min: number;
  max: number;
}
```

- [ ] **Step 2: Create `src/lib/pricing.ts`**

```ts
import type { ServiceDef, ServiceId, Package, PackageId, CalculatorState, PriceRange } from '@/components/Calculator/types';

// Coefficient: linear meters of ductwork per m² of room area
// Based on industry average for commercial spaces
const POGM_PER_SQM = 0.25;

export const SERVICES: ServiceDef[] = [
  {
    id: 'vent-dust',
    label: 'Чистка вентиляции (от пыли)',
    unit: 'per-sqm',
    priceMin: Math.round(90 * POGM_PER_SQM),   // ~23 ₽/м²
    priceMax: Math.round(135 * POGM_PER_SQM),  // ~34 ₽/м²
    perSqm: true,
  },
  {
    id: 'vent-grease',
    label: 'Чистка вентиляции (от жира)',
    unit: 'per-sqm',
    priceMin: Math.round(270 * POGM_PER_SQM),  // ~68 ₽/м²
    priceMax: Math.round(360 * POGM_PER_SQM),  // ~90 ₽/м²
    perSqm: true,
  },
  {
    id: 'hoods',
    label: 'Чистка вытяжек (зонты)',
    unit: 'per-unit',
    priceMin: 1800,
    priceMax: 2700,
    perSqm: false,
  },
  {
    id: 'disinfection',
    label: 'Дезинфекция воздуховодов',
    unit: 'per-sqm',
    priceMin: Math.round(27 * POGM_PER_SQM),   // ~7 ₽/м²
    priceMax: Math.round(40 * POGM_PER_SQM),   // ~10 ₽/м²
    perSqm: true,
  },
  {
    id: 'pipes-dust',
    label: 'Чистка труб (от пыли)',
    unit: 'per-sqm',
    priceMin: Math.round(90 * POGM_PER_SQM),
    priceMax: Math.round(135 * POGM_PER_SQM),
    perSqm: true,
  },
  {
    id: 'pipes-grease',
    label: 'Чистка труб (от жира)',
    unit: 'per-sqm',
    priceMin: Math.round(270 * POGM_PER_SQM),
    priceMax: Math.round(360 * POGM_PER_SQM),
    perSqm: true,
  },
  {
    id: 'reservoirs',
    label: 'Чистка резервуаров',
    unit: 'fixed',
    priceMin: 3500,
    priceMax: 8000,
    perSqm: false,
  },
  {
    id: 'diagnostics',
    label: 'Диагностика / осмотр',
    unit: 'fixed',
    priceMin: 0,
    priceMax: 0,
    perSqm: false,
  },
];

export const PACKAGES: Package[] = [
  {
    id: 'catering',
    label: 'Общепит',
    icon: '🍽️',
    description: 'Для ресторанов, кафе, столовых',
    defaultServices: ['vent-grease', 'hoods', 'disinfection'],
  },
  {
    id: 'office',
    label: 'Офис',
    icon: '🏢',
    description: 'Для офисов и бизнес-центров',
    defaultServices: ['vent-dust'],
  },
  {
    id: 'production',
    label: 'Производство',
    icon: '🏭',
    description: 'Для заводов и складов',
    defaultServices: ['vent-dust', 'disinfection'],
  },
  {
    id: 'custom',
    label: 'Своё',
    icon: '⚙️',
    description: 'Выбери услуги самостоятельно',
    defaultServices: [],
  },
];

export function getServiceById(id: ServiceId): ServiceDef {
  const s = SERVICES.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown service: ${id}`);
  return s;
}

export function getPackageById(id: PackageId): Package {
  const p = PACKAGES.find((p) => p.id === id);
  if (!p) throw new Error(`Unknown package: ${id}`);
  return p;
}

export function calculatePrice(state: CalculatorState): PriceRange {
  let min = 0;
  let max = 0;

  for (const serviceId of state.selectedServices) {
    const service = getServiceById(serviceId);

    if (service.id === 'diagnostics') continue; // free with order

    if (service.perSqm) {
      min += service.priceMin * state.area;
      max += service.priceMax * state.area;
    } else if (service.id === 'hoods') {
      min += service.priceMin * Math.max(1, state.hoodCount);
      max += service.priceMax * Math.max(1, state.hoodCount);
    } else {
      min += service.priceMin;
      max += service.priceMax;
    }
  }

  return { min: Math.round(min), max: Math.round(max) };
}

export function formatPrice(n: number): string {
  return n.toLocaleString('ru-RU') + ' ₽';
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Calculator/types.ts src/lib/pricing.ts
git commit -m "feat: add calculator types and pricing logic"
```

---

## Task 3: Zod schemas

**Files:**
- Create: `src/lib/schemas.ts`

- [ ] **Step 1: Create `src/lib/schemas.ts`**

```ts
import { z } from 'zod';

export const serviceOptions = [
  'vent-dust',
  'vent-grease',
  'hoods',
  'disinfection',
  'pipes-dust',
  'pipes-grease',
  'reservoirs',
  'diagnostics',
] as const;

export const submitSchema = z.object({
  name: z.string().min(2, 'Введите имя'),
  phone: z
    .string()
    .min(10, 'Введите номер телефона')
    .regex(/^[\d\s\-\+\(\)]{10,18}$/, 'Некорректный номер телефона'),
  objectType: z.string().min(2, 'Укажите тип объекта'),
  services: z.array(z.enum(serviceOptions)).optional().default([]),
  comment: z.string().optional().default(''),
  area: z.number().positive().optional(),
});

export type SubmitFormData = z.infer<typeof submitSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/schemas.ts
git commit -m "feat: add zod form schemas"
```

---

## Task 4: Calculator UI component

**Files:**
- Create: `src/components/Calculator/Calculator.tsx`

> **Design:** Use `ui-ux-pro-max` + `frontend-design`. Three-step flow within one section: (1) package tabs, (2) service checkboxes + area input, (3) price result + CTA. Price updates live on every change. Area input has label «Площадь помещения (м²)» and hint «укажите площадь вашего ресторана, кафе или объекта».

- [ ] **Step 1: Create `src/components/Calculator/Calculator.tsx`**

```tsx
'use client';
import { useState, useCallback } from 'react';
import { PACKAGES, SERVICES, calculatePrice, formatPrice, getPackageById } from '@/lib/pricing';
import type { PackageId, ServiceId, CalculatorState } from './types';

interface CalculatorProps {
  /** Called when user clicks "Оставить заявку" — passes selected services for form pre-fill */
  onOrder: (services: ServiceId[], area: number) => void;
}

const DEFAULT_AREA = 100;
const DEFAULT_HOOD_COUNT = 3;

export default function Calculator({ onOrder }: CalculatorProps) {
  const [state, setState] = useState<CalculatorState>({
    packageId: 'catering',
    selectedServices: getPackageById('catering').defaultServices,
    area: DEFAULT_AREA,
    hoodCount: DEFAULT_HOOD_COUNT,
  });

  const selectPackage = useCallback((id: PackageId) => {
    setState((prev) => ({
      ...prev,
      packageId: id,
      selectedServices: getPackageById(id).defaultServices,
    }));
  }, []);

  const toggleService = useCallback((id: ServiceId) => {
    setState((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }));
  }, []);

  const price = calculatePrice(state);
  const hasServices = state.selectedServices.length > 0;

  return (
    <section id="calculator" className="py-24 px-6 bg-bg">
      {/* Implementation: invoke ui-ux-pro-max for full visual design */}
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Рассчитать стоимость
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
            Калькулятор услуг
          </h2>
          <p className="text-brand-muted text-lg">
            Выберите пакет под ваш объект — получите ориентировочную стоимость
          </p>
        </div>

        <div className="bg-white rounded-card border border-black/[0.04] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
            {/* Left: configuration */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r border-black/[0.06]">

              {/* Step 1: Package selection */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-muted mb-4">
                  Шаг 1 — Выберите пакет
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => selectPackage(pkg.id)}
                      className={[
                        'p-4 rounded-xl border text-left transition-all',
                        state.packageId === pkg.id
                          ? 'bg-brand text-white border-brand'
                          : 'bg-brand-light text-brand border-brand/20 hover:border-brand',
                      ].join(' ')}
                    >
                      <div className="text-2xl mb-2">{pkg.icon}</div>
                      <div className="font-semibold text-sm">{pkg.label}</div>
                      <div className={`text-xs mt-1 ${state.packageId === pkg.id ? 'text-white/70' : 'text-brand-muted'}`}>
                        {pkg.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Services + area */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-muted mb-4">
                  Шаг 2 — Состав и площадь
                </p>

                <div className="space-y-2 mb-6">
                  {SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-light cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={state.selectedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="w-4 h-4 accent-brand cursor-pointer"
                      />
                      <span className="text-sm flex-1">{service.label}</span>
                      {service.id === 'diagnostics' && (
                        <span className="text-xs text-brand font-semibold">Бесплатно при заказе</span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Hood count — only show when hoods selected */}
                {state.selectedServices.includes('hoods') && (
                  <div className="mb-4 p-4 bg-brand-light rounded-xl">
                    <label className="block text-sm font-medium mb-2">
                      Количество вытяжных зонтов
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={state.hoodCount}
                      onChange={(e) => setState((p) => ({ ...p, hoodCount: Number(e.target.value) }))}
                      className="w-full border border-brand/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                )}

                {/* Area input */}
                <div className="p-4 bg-brand-light rounded-xl">
                  <label className="block text-sm font-medium mb-1">
                    Площадь помещения (м²)
                  </label>
                  <p className="text-xs text-brand-muted mb-3">
                    Укажите площадь вашего ресторана, кафе или объекта — не трубы
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={20}
                      max={2000}
                      step={10}
                      value={state.area}
                      onChange={(e) => setState((p) => ({ ...p, area: Number(e.target.value) }))}
                      className="flex-1 accent-brand"
                    />
                    <div className="flex items-center gap-1 bg-white border border-brand/20 rounded-lg px-3 py-2 min-w-[80px]">
                      <input
                        type="number"
                        min={20}
                        max={2000}
                        value={state.area}
                        onChange={(e) => setState((p) => ({ ...p, area: Number(e.target.value) }))}
                        className="w-12 text-sm font-semibold focus:outline-none"
                      />
                      <span className="text-xs text-brand-muted">м²</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: price + CTA */}
            <div className="p-8 bg-brand text-white flex flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/50 mb-6">
                Ориентировочная стоимость
              </p>

              {hasServices ? (
                <>
                  <div className="flex-1">
                    <div className="text-4xl font-bold tracking-[-0.03em] mb-1">
                      от {formatPrice(price.min)}
                    </div>
                    {price.max > price.min && (
                      <div className="text-white/60 text-sm">
                        до {formatPrice(price.max)}
                      </div>
                    )}
                    <p className="text-white/40 text-xs mt-4 leading-relaxed">
                      Точная стоимость — после осмотра объекта специалистом. Выезд бесплатно.
                    </p>

                    <div className="mt-6 space-y-2">
                      {state.selectedServices.map((id) => {
                        const s = SERVICES.find((s) => s.id === id);
                        return s ? (
                          <div key={id} className="flex items-center gap-2 text-xs text-white/60">
                            <span className="text-white/30">✓</span>
                            {s.label}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => onOrder(state.selectedServices, state.area)}
                    className="mt-8 w-full bg-white text-brand font-semibold py-4 rounded-pill hover:bg-brand-light transition-colors"
                  >
                    Оставить заявку →
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/40 text-sm text-center">
                  Выберите хотя бы одну услугу слева
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Calculator/Calculator.tsx
git commit -m "feat: add Calculator component with live price calculation"
```

---

## Task 5: Contact form component

**Files:**
- Create: `src/components/ContactForm/ContactForm.tsx`

> **Design:** Use `ui-ux-pro-max`. Clean form on white/light background. Fields: name, phone, objectType, services (checkboxes), comment. Submit button brand green. Success state with confirmation message. Error state with retry.

- [ ] **Step 1: Create `src/components/ContactForm/ContactForm.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitSchema, type SubmitFormData, serviceOptions } from '@/lib/schemas';
import { SERVICES } from '@/lib/pricing';
import type { ServiceId } from '@/components/Calculator/types';

const serviceLabels: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.label])
);

interface ContactFormProps {
  /** Pre-selected services from Calculator */
  preselectedServices?: ServiceId[];
  preselectedArea?: number;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm({ preselectedServices = [], preselectedArea }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      services: preselectedServices,
      area: preselectedArea,
    },
  });

  const onSubmit = async (data: SubmitFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-brand-light border border-brand/20 rounded-card p-10 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-semibold text-xl mb-2">Заявка отправлена!</h3>
        <p className="text-brand-muted">Перезвоним в течение 30 минут в рабочее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          placeholder="Алексей"
          className="w-full border border-brand/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          {...register('phone')}
          placeholder="+7 (999) 000-00-00"
          type="tel"
          className="w-full border border-brand/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      {/* Object type */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          Тип объекта <span className="text-red-500">*</span>
        </label>
        <input
          {...register('objectType')}
          placeholder='Ресторан "Доминос пицца"'
          className="w-full border border-brand/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
        />
        {errors.objectType && <p className="text-red-500 text-xs mt-1">{errors.objectType.message}</p>}
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-medium mb-3">Какие услуги нужны</label>
        <div className="space-y-2">
          {serviceOptions.map((id) => (
            <label key={id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                value={id}
                {...register('services')}
                defaultChecked={preselectedServices.includes(id as ServiceId)}
                className="w-4 h-4 accent-brand"
              />
              <span className="text-sm text-brand-muted group-hover:text-brand-DEFAULT transition-colors">
                {serviceLabels[id] ?? id}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Комментарий</label>
        <textarea
          {...register('comment')}
          rows={3}
          placeholder="Дополнительная информация об объекте, удобное время звонка..."
          className="w-full border border-brand/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-brand text-white font-semibold py-4 rounded-pill hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
      </button>

      <p className="text-xs text-brand-muted text-center">
        Нажимая кнопку, вы соглашаетесь с{' '}
        <a href="/privacy" className="underline hover:text-brand transition-colors">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactForm/ContactForm.tsx
git commit -m "feat: add ContactForm with react-hook-form and zod validation"
```

---

## Task 6: Contact section (landing wrapper)

**Files:**
- Create: `src/components/ContactSection/ContactSection.tsx`

> **Design:** Use `ui-ux-pro-max`. Two-column layout: left — form, right — contact info (phone, email, address, working hours). Dark green background or alternating.

- [ ] **Step 1: Create `src/components/ContactSection/ContactSection.tsx`**

```tsx
'use client';
import { useState, useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import ContactForm from '@/components/ContactForm/ContactForm';
import type { ServiceId } from '@/components/Calculator/types';

interface ContactSectionProps {
  preselectedServices?: ServiceId[];
  preselectedArea?: number;
}

export default function ContactSection({ preselectedServices, preselectedArea }: ContactSectionProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="contacts" ref={ref} className="py-24 px-6 bg-brand">
      {/* Implementation: invoke ui-ux-pro-max for full design */}
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/50 mb-3 block">
            Связаться с нами
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white mb-4">
            Оставить заявку
          </h2>
          <p className="text-white/60 text-lg">
            Перезвоним в течение 30 минут в рабочее время
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10" data-anim>
          {/* Form — key forces remount when preselected services change from Calculator */}
          <div className="bg-white rounded-card p-8">
            <ContactForm
              key={preselectedServices.join(',') + String(preselectedArea)}
              preselectedServices={preselectedServices}
              preselectedArea={preselectedArea}
            />
          </div>

          {/* Contact info */}
          <div className="text-white space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">Телефон</p>
              <a href="tel:+74951234567" className="text-2xl font-semibold hover:text-white/80 transition-colors">
                +7 (495) 123-45-67
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">Email</p>
              <a href="mailto:info@cleanvent.ru" className="text-lg hover:text-white/80 transition-colors">
                info@cleanvent.ru
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">Режим работы</p>
              <p className="text-lg">Пн–Пт 9:00–19:00</p>
              <p className="text-white/60 text-sm mt-1">Выезд в выходные по договорённости</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">Выезд</p>
              <p className="text-lg">Москва и область</p>
              <p className="text-white/60 text-sm mt-1">Бесплатный осмотр объекта</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactSection/ContactSection.tsx
git commit -m "feat: add ContactSection with form and contact info"
```

---

## Task 7: Google Sheets client

**Files:**
- Create: `src/lib/sheets.ts`
- Create: `.env.example`
- Create (manually, not committed): `.env.local`

- [ ] **Step 1: Create `.env.example`**

```bash
# Copy to .env.local and fill in your values
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

- [ ] **Step 2: Add `.env.local` to `.gitignore`**

Add this line to `.gitignore`:
```
.env.local
```

- [ ] **Step 3: Create `src/lib/sheets.ts`**

```ts
import { google } from 'googleapis';

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !key) {
    throw new Error('Missing Google service account credentials in environment variables');
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function appendRow(values: string[]): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('Missing GOOGLE_SHEET_ID');

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/sheets.ts .env.example .gitignore
git commit -m "feat: add Google Sheets client"
```

---

## Task 8: API route for form submission

**Files:**
- Create: `src/app/api/submit/route.ts`

- [ ] **Step 1: Create `src/app/api/submit/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server';
import { submitSchema } from '@/lib/schemas';
import { appendRow } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = submitSchema.parse(body);

    const timestamp = new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const row = [
      timestamp,
      data.name,
      data.phone,
      data.objectType,
      data.services.join(', ') || '—',
      data.comment || '—',
      data.area ? `${data.area} м²` : '—',
    ];

    await appendRow(row);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Submit error:', err);
    if (err instanceof Error && err.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/submit/route.ts
git commit -m "feat: add form submission API route with Google Sheets"
```

---

## Task 9: Wire Calculator → Home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create home page orchestrator component**

Create `src/components/HomeOrchestrator/HomeOrchestrator.tsx`:

```tsx
'use client';
import { useState } from 'react';
import Calculator from '@/components/Calculator/Calculator';
import ContactSection from '@/components/ContactSection/ContactSection';
import type { ServiceId } from '@/components/Calculator/types';

export default function HomeOrchestrator() {
  const [preselectedServices, setPreselectedServices] = useState<ServiceId[]>([]);
  const [preselectedArea, setPreselectedArea] = useState<number | undefined>();

  const handleOrder = (services: ServiceId[], area: number) => {
    setPreselectedServices(services);
    setPreselectedArea(area);
    // Scroll to contacts
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Calculator onOrder={handleOrder} />
      <ContactSection
        preselectedServices={preselectedServices}
        preselectedArea={preselectedArea}
      />
    </>
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx` to include orchestrator**

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
import HomeOrchestrator from '@/components/HomeOrchestrator/HomeOrchestrator';

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
        <HomeOrchestrator />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

Expected: compiled successfully.

- [ ] **Step 4: Commit**

```bash
git add src/components/HomeOrchestrator/HomeOrchestrator.tsx src/app/page.tsx
git commit -m "feat: wire calculator to contact form via orchestrator"
```

---

## Task 10: Google Sheets setup (manual)

This task is done manually in the Google Cloud Console — not code.

- [ ] **Step 1: Create Google Cloud project and enable Sheets API**

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Enable «Google Sheets API» in the API Library

- [ ] **Step 2: Create Service Account**

1. Go to IAM & Admin → Service Accounts
2. Create service account, name it `cleanvent-sheets`
3. Click on the account → Keys → Add Key → JSON
4. Download the JSON file

- [ ] **Step 3: Extract credentials to `.env.local`**

From the JSON file, copy:
```
client_email → GOOGLE_SERVICE_ACCOUNT_EMAIL
private_key  → GOOGLE_PRIVATE_KEY
```

Create `.env.local` in project root:
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=cleanvent-sheets@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=<id from spreadsheet URL>
```

- [ ] **Step 4: Create Google Sheet and share it**

1. Create a new Google Sheet
2. Add headers in row 1: `Дата | Имя | Телефон | Объект | Услуги | Комментарий | Площадь`
3. Share the sheet with the service account email (Editor access)
4. Copy the sheet ID from URL: `https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`

- [ ] **Step 5: Test the integration**

```bash
npm run dev
```

Fill in the contact form and submit. Verify a new row appears in the Google Sheet.

---

## Task 11: /contacts page

**Files:**
- Create: `src/app/contacts/page.tsx`

> **Design:** Use `ui-ux-pro-max`. Standalone page with Header, Footer, and the ContactSection component.

- [ ] **Step 1: Create `src/app/contacts/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ContactSection from '@/components/ContactSection/ContactSection';

export const metadata: Metadata = {
  title: 'Контакты — Clean Vent',
  description: 'Оставьте заявку на чистку вентиляции. Перезвоним в течение 30 минут.',
};

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Delete old contacts files**

```bash
rm -rf src/components/ContactsPage
```

- [ ] **Step 3: Commit**

```bash
git add src/app/contacts/page.tsx
git commit -m "feat: add /contacts page"
```

---

## Task 12: /privacy page

**Files:**
- Create: `src/app/privacy/page.tsx`

- [ ] **Step 1: Create `src/app/privacy/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — Clean Vent',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-24 px-6 max-w-content mx-auto">
        <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>

        <div className="prose prose-neutral max-w-none text-brand-muted space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-brand-DEFAULT mb-2">1. Общие положения</h2>
            <p>
              Настоящая политика конфиденциальности описывает, как Clean Vent (далее — «Компания»)
              собирает, использует и защищает информацию, которую вы предоставляете при использовании сайта.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-DEFAULT mb-2">2. Какие данные мы собираем</h2>
            <p>
              При заполнении формы заявки мы собираем: имя, номер телефона, тип объекта, выбранные услуги
              и комментарий. Эти данные необходимы исключительно для обработки вашего обращения.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-DEFAULT mb-2">3. Использование данных</h2>
            <p>
              Полученные данные используются только для связи с вами по вопросу вашей заявки.
              Мы не передаём ваши данные третьим лицам и не используем их в маркетинговых целях
              без вашего согласия.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-DEFAULT mb-2">4. Хранение данных</h2>
            <p>
              Данные хранятся в защищённой таблице Google Sheets, доступной только сотрудникам компании.
              Срок хранения — не более 3 лет с момента получения заявки.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-DEFAULT mb-2">5. Ваши права</h2>
            <p>
              Вы вправе запросить удаление ваших данных, направив письмо на{' '}
              <a href="mailto:info@cleanvent.ru" className="text-brand underline">info@cleanvent.ru</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand-DEFAULT mb-2">6. Контакты</h2>
            <p>
              По вопросам конфиденциальности: <a href="mailto:info@cleanvent.ru" className="text-brand underline">info@cleanvent.ru</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Delete old privacy component**

```bash
rm -rf src/components/PrivacyPage
```

- [ ] **Step 3: Final build check**

```bash
npm run build 2>&1 | tail -20
```

Expected: compiled successfully, all routes generated.

- [ ] **Step 4: Final commit**

```bash
git add src/app/privacy/page.tsx
git commit -m "feat: add /privacy page, complete Plan 2"
```

---

## Plan 2 Complete

The full site is now live:
- All landing sections (Plan 1)
- Interactive calculator with package selection and live price
- Contact form with validation → Google Sheets
- `/contacts` and `/privacy` pages

**Next steps to consider:**
- Add Telegram notification in `src/app/api/submit/route.ts` (add `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` env vars, call Bot API after `appendRow`)
- Deploy to Vercel (add env vars in Vercel dashboard)
- Replace placeholder phone/email with real contact info
- Add real team photos and certifications to About section
