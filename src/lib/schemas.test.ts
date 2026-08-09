import { describe, it, expect } from 'vitest';
import { submitSchema } from './schemas';

/* The lead form builds this payload by hand in LeadForm.tsx. A field renamed
   on one side and not the other would only surface as a 400 on a real
   submission, in production, on a real lead — so the shape is pinned here. */
const storyPayload = {
  ticket: 'VNT-0809-4321',
  name: 'Лариса',
  phone: '+79991234567',
  objectName: 'Кухня',
  packageKey: 'restaurant',
  areaM2: 120,
  lmValue: 60,
  unit: 'm2',
  hoodCount: 2,
  services: ['grease', 'hood'],
  comment: 'кухня 140 м², четыре зонта',
  website: '',
};

describe('submitSchema', () => {
  it('accepts what the story lead form sends', () => {
    const parsed = submitSchema.safeParse(storyPayload);
    expect(parsed.success).toBe(true);
  });

  it('accepts a пог.м submission', () => {
    const parsed = submitSchema.safeParse({ ...storyPayload, unit: 'lm', lmValue: 240 });
    expect(parsed.success).toBe(true);
  });

  it('defaults unit and lmValue for older payloads', () => {
    const { unit, lmValue, ...withoutVolumeMode } = storyPayload;
    const parsed = submitSchema.parse(withoutVolumeMode);
    expect(parsed.unit).toBe('m2');
    expect(parsed.lmValue).toBe(0);
  });

  it('rejects a phone that is not +7 plus ten digits', () => {
    expect(submitSchema.safeParse({ ...storyPayload, phone: '9991234567' }).success).toBe(false);
  });

  // Name, phone and consent are the only required fields on the story form —
  // a lead who unchecked every service must not hit a validation error.
  it('accepts an empty service list', () => {
    expect(submitSchema.safeParse({ ...storyPayload, services: [] }).success).toBe(true);
  });

  it('rejects the service key dropped in the redesign', () => {
    expect(
      submitSchema.safeParse({ ...storyPayload, services: ['disinfect'] }).success,
    ).toBe(false);
  });
});
