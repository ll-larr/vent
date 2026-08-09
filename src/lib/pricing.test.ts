import { describe, it, expect } from 'vitest';
import { computePrice, PACKAGES, SERVICES, type ServiceKey } from './pricing';

describe('SERVICES catalog', () => {
  it('has all four expected services', () => {
    expect(Object.keys(SERVICES).sort()).toEqual(['diag', 'dust', 'grease', 'hood'].sort());
  });

  it('grease and dust have diameter tiers', () => {
    expect((SERVICES.grease as any).diameterTiers).toHaveLength(4);
    expect((SERVICES.dust as any).diameterTiers).toHaveLength(4);
  });
});

describe('PACKAGES catalog', () => {
  it('exposes per-package m²→пог.м coefficient', () => {
    expect(PACKAGES.restaurant.m2ToLm).toBe(0.45);
    expect(PACKAGES.office.m2ToLm).toBe(0.30);
    expect(PACKAGES.warehouse.m2ToLm).toBe(0.25);
    expect(PACKAGES.custom.m2ToLm).toBe(0.30);
  });

  it('restaurant default selects grease and hood', () => {
    expect(PACKAGES.restaurant.default).toEqual(['grease', 'hood']);
  });

  // Story design lets any service pair with any object type — the chip row in
  // section 07 renders all four unconditionally, so no package may narrow it.
  it('offers every service under every package', () => {
    for (const pkg of Object.values(PACKAGES)) {
      expect([...pkg.available].sort()).toEqual(['diag', 'dust', 'grease', 'hood']);
    }
  });
});

describe('computePrice — linear services', () => {
  it('grease at 180 m² restaurant uses 0.45 coef and 300 min', () => {
    const r = computePrice(['grease'], 180, 'restaurant');
    expect(r.totalMin).toBe(24300);
    expect(r.breakdown).toEqual([{ key: 'grease', label: 'Чистка вентиляции от жира', amount: 24300 }]);
  });

  it('dust at 480 m² office uses 0.30 coef and 100 min', () => {
    const r = computePrice(['dust'], 480, 'office');
    expect(r.totalMin).toBe(14400);
  });

  it('dust at 200 m² warehouse uses the 0.25 coef', () => {
    const r = computePrice(['dust'], 200, 'warehouse');
    expect(r.totalMin).toBe(5000);
  });
});

describe('computePrice — unit and fixed services', () => {
  it('hood multiplies by hoodCount', () => {
    const r = computePrice(['hood'], 0, 'restaurant', 3);
    expect(r.totalMin).toBe(6000);
  });

  it('diag is a fixed 4500', () => {
    const r = computePrice(['diag'], 100, 'office');
    expect(r.totalMin).toBe(4500);
  });
});

describe('computePrice — combined', () => {
  it('restaurant grease + 3 hoods at 180 m² = 30 300', () => {
    const r = computePrice(['grease', 'hood'], 180, 'restaurant', 3);
    expect(r.totalMin).toBe(30300);
    expect(r.breakdown).toHaveLength(2);
  });
});

describe('computePrice — rounding', () => {
  it('rounds linear lines to nearest 100', () => {
    expect(computePrice(['dust'], 50, 'office').totalMin).toBe(1500);
    expect(computePrice(['dust'], 77, 'office').totalMin).toBe(2300);
  });
});

describe('computePrice — edge cases', () => {
  it('returns 0 with empty service list', () => {
    const r = computePrice([] as ServiceKey[], 100, 'custom');
    expect(r.totalMin).toBe(0);
    expect(r.breakdown).toEqual([]);
  });

  it('ignores hoodCount when hood is not selected', () => {
    const r = computePrice(['dust'], 100, 'office', 5);
    expect(r.totalMin).toBe(3000);
  });
});
