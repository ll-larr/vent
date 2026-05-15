import { z } from 'zod';

export const SERVICE_KEYS = ['grease', 'dust', 'disinfect', 'hood', 'diag'] as const;
export const PACKAGE_KEYS = ['restaurant', 'office', 'warehouse', 'custom'] as const;

export const submitSchema = z.object({
  name: z.string().min(1, 'Введите имя').max(60, 'Слишком длинное имя'),
  phone: z
    .string()
    .regex(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, 'Формат: +7 (XXX) XXX-XX-XX'),
  packageKey: z.enum(PACKAGE_KEYS),
  areaM2: z.coerce.number().int().min(20, 'Минимум 20 м²').max(5000, 'Свяжитесь с нами для крупных объектов'),
  services: z.array(z.enum(SERVICE_KEYS)).min(1, 'Выберите хотя бы одну услугу'),
  comment: z.string().max(500, 'Слишком длинный комментарий').optional().default(''),
  consent: z.boolean().refine((v) => v === true, { message: 'Подтвердите согласие на обработку данных' }),
});

export type SubmitFormData = z.infer<typeof submitSchema>;
export type SubmitFormInput = z.input<typeof submitSchema>;
