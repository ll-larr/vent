import { describe, it, expect } from 'vitest';
import { howToSchema } from './schema';
import { SITE_URL } from './site';
import { TECH_STEPS } from '@/data/story';

/* The HowTo node is generated from the same TECH_STEPS the section renders, so
   the risk is not the copy — it is the plumbing: relative image paths, steps
   drifting out of order, or the section silently shrinking. */
describe('howToSchema', () => {
  const schema = howToSchema(TECH_STEPS) as Record<string, unknown>;
  const steps = schema.step as Array<Record<string, unknown>>;

  it('emits one HowToStep per step of section 02, in scroll order', () => {
    expect(steps).toHaveLength(TECH_STEPS.length);
    expect(steps.map((step) => step.name)).toEqual(TECH_STEPS.map((step) => step.title));
    expect(steps.map((step) => step.position)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('makes every image an absolute URL', () => {
    for (const step of steps) {
      expect(String(step.image).startsWith(`${SITE_URL}/images/`)).toBe(true);
    }
  });

  it('carries no per-step price — HowToStep has no such property', () => {
    for (const step of steps) {
      expect(step).not.toHaveProperty('price');
      expect(step).not.toHaveProperty('offers');
    }
  });
});
