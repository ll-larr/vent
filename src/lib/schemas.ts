import { z } from 'zod';

export const SERVICE_KEYS = [
  'grease',
  'dust',
  'hood',
  'ahu',
  'impellerGrease',
  'impellerAir',
  'hydrofilter',
  'grille',
  'valve',
  'diag',
] as const;
export const PACKAGE_KEYS = ['restaurant', 'office', 'warehouse', 'custom'] as const;

// Phone is stored as full E.164-ish: +7XXXXXXXXXX (12 chars: +7 + 10 digits)
const PHONE_FULL = /^\+7\d{10}$/;

export const submitSchema = z.object({
  // Ticket id (VNT-MMDD-XXXX) — kept first so it maps to the first sheet column.
  ticket: z.string().regex(/^VNT-\d{4}-\d{4}$/, 'Некорректный номер заявки'),
  name: z.string().min(1, 'Введите имя').max(60, 'Слишком длинное имя'),
  phone: z.string().regex(PHONE_FULL, 'Введите 10-значный номер телефона'),
  objectName: z.string().min(1, 'Укажите объект').max(120, 'Слишком длинное название'),
  packageKey: z.enum(PACKAGE_KEYS),
  areaM2: z.coerce
    .number()
    .int('Введите целое число')
    .min(0, 'Площадь не может быть отрицательной')
    .max(100_000, 'Слишком большая площадь'),
  // The calculator can be driven in duct metres instead of floor area; the
  // server recomputes the estimate the same way the page does, so it needs
  // both the mode and the metres.
  unit: z.enum(['m2', 'lm']).default('m2'),
  lmValue: z.coerce.number().int().min(0).max(100_000).default(0),
  // Mirrors the calculator so the server can recompute the estimate for the
  // sheet. Keys outside SERVICE_KEYS are dropped by the route before pricing,
  // so a stale client cannot inflate a quote through this field.
  counts: z.record(z.string(), z.coerce.number().int().min(0).max(200)).default({}),
  // May be empty. The story form asks only for name, phone and consent — a
  // visitor who cleared every chip is still a lead, and rejecting them here
  // would show a failed-to-send error for a form that looked complete.
  services: z.array(z.enum(SERVICE_KEYS)).default([]),
  comment: z.string().max(500, 'Слишком длинный комментарий').optional().default(''),
  // Honeypot — must be empty
  website: z.string().max(0).optional().default(''),
});

export type SubmitFormData = z.infer<typeof submitSchema>;
export type SubmitFormInput = z.input<typeof submitSchema>;
