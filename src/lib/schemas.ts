import { z } from 'zod';

export const SERVICE_KEYS = ['grease', 'dust', 'disinfect', 'hood', 'diag'] as const;
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
  // Mirrors the calculator so the server can recompute the estimate for the sheet.
  hoodCount: z.coerce.number().int().min(0).max(40).default(0),
  services: z.array(z.enum(SERVICE_KEYS)).min(1, 'Выберите хотя бы одну услугу'),
  comment: z.string().max(500, 'Слишком длинный комментарий').optional().default(''),
  // Honeypot — must be empty
  website: z.string().max(0).optional().default(''),
});

export type SubmitFormData = z.infer<typeof submitSchema>;
export type SubmitFormInput = z.input<typeof submitSchema>;
