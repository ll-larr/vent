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
