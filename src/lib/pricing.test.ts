import { describe, it, expect } from 'vitest';
import {
  computeEstimate,
  computePrice,
  linearMeters,
  unitCount,
  CALCULATOR_SERVICES,
  DISCOUNT_THRESHOLD,
  PACKAGES,
  SERVICES,
  UNIT_SERVICES,
  type ServiceKey,
} from './pricing';

describe('SERVICES catalog', () => {
  it('carries the ten services the calculator offers', () => {
    expect(Object.keys(SERVICES).sort()).toEqual(
      ['ahu', 'diag', 'dust', 'grease', 'grille', 'hood', 'hydrofilter', 'impellerAir',
       'impellerGrease', 'valve'].sort(),
    );
  });

  // Everything in the calculator must be sellable without a licence: the
  // 2026 list gates disinfection, ОМЧ/БГКП, санэпид-обследование, instrumented
  // measurements and chimney work behind permits, so none of them may appear.
  it('excludes every service that needs a licence or accreditation', () => {
    const gated = ['disinfect', 'omch', 'bgkp', 'sanepid', 'measure', 'chimney', 'heatex'];
    for (const key of gated) expect(Object.keys(SERVICES)).not.toContain(key);
  });

  it('every chip in the row has a catalog entry, and vice versa', () => {
    expect([...CALCULATOR_SERVICES].sort()).toEqual((Object.keys(SERVICES) as ServiceKey[]).sort());
  });

  it('both linear services carry four diameter tiers', () => {
    expect((SERVICES.grease as any).diameterTiers).toHaveLength(4);
    expect((SERVICES.dust as any).diameterTiers).toHaveLength(4);
  });

  // The gap the 2026 list left at короб > 500×300 was closed at 180 ₽, so the
  // ladder has to stay monotone — a cheaper large короб would misprice jobs.
  it('dust tiers never step down as the section grows', () => {
    const rates = (SERVICES.dust as any).diameterTiers.map((t: any) => t.rate);
    expect(rates).toEqual([85, 130, 130, 180]);
    expect((SERVICES.dust as any).max).toBe(180);
  });

  // Grease and soot on a мангальный impeller is a different job from dust on a
  // ВП/ВВ one, and the price list bills them apart.
  it('prices the two impeller jobs apart', () => {
    expect((SERVICES.impellerGrease as any).price).toBe(2550);
    expect((SERVICES.impellerAir as any).price).toBe(1700);
  });

  it('linear minimums match the published 2026 rates', () => {
    expect((SERVICES.grease as any).min).toBe(340);
    expect((SERVICES.dust as any).min).toBe(85);
  });

  it('counted services all declare a counter caption and ceiling', () => {
    expect(UNIT_SERVICES.sort()).toEqual(
      ['ahu', 'grille', 'hood', 'hydrofilter', 'impellerAir', 'impellerGrease', 'valve'].sort(),
    );
    for (const key of UNIT_SERVICES) {
      const service = SERVICES[key] as any;
      expect(service.countLabel).toBeTruthy();
      expect(service.countMax).toBeGreaterThan(0);
    }
  });
});

describe('unitCount', () => {
  it('falls back to one so a ticked service never prices as zero', () => {
    expect(unitCount(undefined, 'hood')).toBe(1);
    expect(unitCount({}, 'ahu')).toBe(1);
  });

  it('takes the stored count when there is one', () => {
    expect(unitCount({ hood: 4 }, 'hood')).toBe(4);
    expect(unitCount({ hood: 0 }, 'hood')).toBe(0);
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
  // section 07 renders all of them unconditionally, so no package may narrow it.
  it('offers every service under every package', () => {
    const all = (Object.keys(SERVICES) as ServiceKey[]).sort();
    for (const pkg of Object.values(PACKAGES)) {
      expect([...pkg.available].sort()).toEqual(all);
    }
  });
});

describe('computePrice — linear services', () => {
  it('grease at 180 m² restaurant uses 0.45 coef and 340 min', () => {
    const r = computePrice(['grease'], 180, 'restaurant');
    expect(r.totalMin).toBe(27500);
    expect(r.breakdown).toEqual([{ key: 'grease', label: 'Чистка вентиляции от жира', amount: 27500 }]);
  });

  it('dust at 480 m² office uses 0.30 coef and 85 min', () => {
    const r = computePrice(['dust'], 480, 'office');
    expect(r.totalMin).toBe(12200);
  });

  it('dust at 200 m² warehouse uses the 0.25 coef', () => {
    const r = computePrice(['dust'], 200, 'warehouse');
    expect(r.totalMin).toBe(4300);
  });
});

describe('computePrice — unit and fixed services', () => {
  it('hood multiplies by its count', () => {
    const r = computePrice(['hood'], 0, 'restaurant', { hood: 3 });
    expect(r.totalMin).toBe(5100);
  });

  it('each counted service reads its own counter', () => {
    const r = computePrice(['hood', 'ahu', 'grille'], 0, 'restaurant', {
      hood: 2,
      ahu: 1,
      grille: 10,
    });
    expect(r.breakdown.map((l) => l.amount)).toEqual([3400, 4250, 1300]);
  });

  it('diag is the fixed 3 825 ₽ package', () => {
    const r = computePrice(['diag'], 100, 'office');
    expect(r.totalMin).toBe(3825);
  });
});

describe('computePrice — combined', () => {
  it('restaurant grease + 3 hoods at 180 m² = 32 600', () => {
    const r = computePrice(['grease', 'hood'], 180, 'restaurant', { hood: 3 });
    expect(r.totalMin).toBe(32600);
    expect(r.breakdown).toHaveLength(2);
  });
});

describe('computePrice — rounding', () => {
  it('rounds linear lines to nearest 100', () => {
    expect(computePrice(['dust'], 50, 'office').totalMin).toBe(1300);
    expect(computePrice(['dust'], 77, 'office').totalMin).toBe(2000);
  });
});

describe('computeEstimate — the story calculator', () => {
  const m2 = (areaM2: number) => ({ unit: 'm2' as const, areaM2, lmValue: 0 });
  const lm = (lmValue: number) => ({ unit: 'lm' as const, areaM2: 0, lmValue });

  it('converts m² to duct metres with the package coefficient', () => {
    expect(linearMeters(m2(120), 'restaurant')).toBeCloseTo(54);
    expect(linearMeters(m2(120), 'office')).toBeCloseTo(36);
    expect(linearMeters(m2(120), 'warehouse')).toBeCloseTo(30);
  });

  it('takes duct metres as given in пог.м mode — no coefficient', () => {
    expect(linearMeters(lm(60), 'restaurant')).toBe(60);
  });

  // The hero hook quotes this exact number: 120 м² kitchen with two hoods.
  it('prices the hero example at 21 800 ₽', () => {
    const r = computeEstimate(['grease', 'hood'], m2(120), 'restaurant', { hood: 2 });
    expect(r.total).toBe(21_800);
    expect(r.lines.map((l) => l.amount)).toEqual([18_400, 3_400]);
  });

  it('quotes the same work identically in both units', () => {
    const byArea = computeEstimate(['grease'], m2(120), 'restaurant', {});
    const byMetres = computeEstimate(['grease'], lm(54), 'restaurant', {});
    expect(byMetres.total).toBe(byArea.total);
  });

  it('rounds every linear line to the nearest 100', () => {
    expect(computeEstimate(['dust'], m2(77), 'office', {}).total).toBe(2_000);
  });

  // The −20% first-order promo sits on top of the 2026 rates, which already
  // carry −15%. The threshold itself is unchanged, so cheaper пыль work now
  // reaches it later and dearer жир work reaches it sooner.
  it('shows the 20% discount only from 30 000 ₽ up', () => {
    const below = computeEstimate(['grease'], lm(88), 'custom', {});
    expect(below.total).toBe(29_900);
    expect(below.total).toBeLessThan(DISCOUNT_THRESHOLD);
    expect(below.discounted).toBeNull();

    const at = computeEstimate(['grease'], lm(89), 'custom', {});
    expect(at.total).toBe(30_300);
    expect(at.discounted).toBe(24_240);
  });

  it('keeps the breakdown in chip order regardless of click order', () => {
    const r = computeEstimate(['diag', 'hood', 'grease'], m2(100), 'restaurant', { hood: 1 });
    expect(r.lines.map((l) => l.key)).toEqual(['grease', 'hood', 'diag']);
  });

  // ВП/ВВ must survive as an abbreviation — a blanket toLowerCase() used to
  // render it «вп/вв», which reads as a typo in the estimate breakdown.
  it('labels breakdown lines without mangling abbreviations', () => {
    const r = computeEstimate(['impellerGrease', 'impellerAir'], lm(0), 'custom', {});
    expect(r.lines.map((l) => l.label)).toEqual(['крыльчатки от жира', 'крыльчатки ВП/ВВ']);
  });

  it('reports quantities per line', () => {
    const r = computeEstimate(['grease', 'hood', 'diag'], lm(40), 'restaurant', { hood: 3 });
    expect(r.lines.map((l) => l.qty)).toEqual(['40 пог.м', '3 шт', '']);
  });

  it('prices the services added in the 2026 update', () => {
    const r = computeEstimate(
      ['ahu', 'impellerGrease', 'impellerAir', 'hydrofilter', 'grille', 'valve'],
      lm(0),
      'custom',
      { ahu: 1, impellerGrease: 2, impellerAir: 2, hydrofilter: 1, grille: 12, valve: 1 },
    );
    expect(r.lines.map((l) => l.amount)).toEqual([4_250, 5_100, 3_400, 1_700, 1_560, 850]);
    expect(r.total).toBe(16_860);
  });

  it('totals zero with nothing selected', () => {
    const r = computeEstimate([], m2(200), 'restaurant', { hood: 4 });
    expect(r.total).toBe(0);
    expect(r.lines).toEqual([]);
    expect(r.discounted).toBeNull();
  });
});

describe('computePrice — edge cases', () => {
  it('returns 0 with empty service list', () => {
    const r = computePrice([] as ServiceKey[], 100, 'custom');
    expect(r.totalMin).toBe(0);
    expect(r.breakdown).toEqual([]);
  });

  it('ignores counts for services that are not selected', () => {
    const r = computePrice(['dust'], 100, 'office', { hood: 5 });
    expect(r.totalMin).toBe(2600);
  });
});
