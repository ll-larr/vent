/* Pricing catalog and the two estimators the site runs on.

   Only services that need no licence, accreditation or ПП 410 admission live
   here — the calculator must never quote work the company cannot legally sell.
   Disinfection, lab analyses, санэпид-обследование, instrumented measurements
   and chimney work are priced in the PDF price list instead.

   Rates are the 2026 list less 15%, rounded to 5 ₽. The −20% first-order
   promo in section 06 sits on top of these and is deliberately unchanged. */

export type ServiceKey =
  // linear — priced per погонный метр of duct
  | 'grease'
  | 'dust'
  // counted — priced per штука, each with its own counter in section 07
  | 'hood'
  | 'ahu'
  | 'impellerGrease'
  | 'impellerAir'
  | 'hydrofilter'
  | 'grille'
  | 'valve'
  // fixed — one price per visit
  | 'diag';

export type PackageKey = 'restaurant' | 'office' | 'warehouse' | 'custom';

export type DiameterTier = { code: string; label: string; rate: number };

type LinearService = {
  kind: 'linear';
  min: number;
  max: number;
  label: string;
  hint: string;
  diameterTiers?: DiameterTier[];
};
type UnitService = {
  kind: 'unit';
  price: number;
  label: string;
  hint: string;
  /** Caption above the −/+ counter this service adds to section 07. */
  countLabel: string;
  countMax: number;
};
type FixedService = { kind: 'fixed'; price: number; label: string; hint: string };
export type Service = LinearService | UnitService | FixedService;

export const SERVICES: Record<ServiceKey, Service> = {
  grease: {
    kind: 'linear',
    min: 340,
    max: 470,
    label: 'Чистка вентиляции от жира',
    hint: 'для кухонь общепита',
    diameterTiers: [
      { code: 'pipe-small', label: 'труба Ø ≤ 500 мм',   rate: 340 },
      { code: 'box-small',  label: 'короб ≤ 500×300 мм', rate: 340 },
      { code: 'pipe-large', label: 'труба Ø > 500 мм',   rate: 470 },
      { code: 'box-large',  label: 'короб > 500×300 мм', rate: 470 },
    ],
  },
  dust: {
    kind: 'linear',
    min: 85,
    max: 180,
    label: 'Чистка вентиляции от пыли',
    hint: 'для офисов и складов',
    // The 2026 list stops at труба > 500 and leaves короб > 500×300 unpriced.
    // 180 ₽ closes it: жир steps ×1.38 from the small короб to the large one,
    // and the same step off пыль's 130 ₽ lands within 3% of the old site's
    // 220 ₽ less 15%. Approved by the client — see AUDIT.md.
    diameterTiers: [
      { code: 'pipe-small', label: 'труба Ø ≤ 500 мм',   rate: 85 },
      { code: 'box-small',  label: 'короб ≤ 500×300 мм', rate: 130 },
      { code: 'pipe-large', label: 'труба Ø > 500 мм',   rate: 130 },
      { code: 'box-large',  label: 'короб > 500×300 мм', rate: 180 },
    ],
  },
  hood: {
    kind: 'unit',
    price: 1700,
    label: 'Чистка вытяжек и зонтов',
    hint: 'за зонт пищеблока до 1500×1500 мм',
    countLabel: 'зонты',
    countMax: 40,
  },
  ahu: {
    kind: 'unit',
    price: 4250,
    label: 'Чистка приточных и вытяжных установок',
    hint: 'за установку с расходом воздуха до 10 000 м³/ч',
    countLabel: 'установки',
    countMax: 20,
  },
  // Two different jobs, not one: a мангальный impeller carries polymerised
  // grease and soot and takes the alkaline treatment, a ВП/ВВ impeller carries
  // dust. The 2026 list prices them apart and so does the calculator.
  impellerGrease: {
    kind: 'unit',
    price: 2550,
    label: 'Очистка крыльчаток вытяжных и мангальных вентиляторов',
    hint: 'жир и сажа, за крыльчатку',
    countLabel: 'крыльчатки вытяжек',
    countMax: 40,
  },
  impellerAir: {
    kind: 'unit',
    price: 1700,
    label: 'Очистка крыльчаток вентиляторов ВП/ВВ',
    hint: 'приточные и вытяжные, пыль, за крыльчатку',
    countLabel: 'крыльчатки ВП/ВВ',
    countMax: 40,
  },
  hydrofilter: {
    kind: 'unit',
    price: 1700,
    label: 'Очистка мангальных гидрофильтров',
    hint: 'за гидрофильтр',
    countLabel: 'гидрофильтры',
    countMax: 20,
  },
  grille: {
    kind: 'unit',
    price: 130,
    label: 'Промывка вентиляционных решёток',
    hint: 'потолочные и настенные, за решётку',
    countLabel: 'решётки',
    countMax: 200,
  },
  valve: {
    kind: 'unit',
    price: 850,
    label: 'Врезка дренажного сливного клапана',
    hint: 'нержавеющий, с последующей герметизацией',
    countLabel: 'клапаны',
    countMax: 20,
  },
  diag: {
    kind: 'fixed',
    price: 3825,
    label: 'Диагностика / видеоинспекция',
    hint: 'осмотр и видеоконтроль каналов перед чисткой',
  },
};

/** Keys whose amount is `count × price` — each renders its own counter row. */
export const UNIT_SERVICES: ServiceKey[] = (Object.keys(SERVICES) as ServiceKey[]).filter(
  (key) => SERVICES[key].kind === 'unit',
);

/** How many штук of each counted service the visitor asked for. */
export type UnitCounts = Partial<Record<ServiceKey, number>>;

/** Counter default when a service is ticked but nothing was typed yet. */
export const DEFAULT_COUNT = 1;

export function unitCount(counts: UnitCounts | undefined, key: ServiceKey): number {
  const value = counts?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : DEFAULT_COUNT;
}

export type Package = {
  label: string;
  m2ToLm: number;
  default: ServiceKey[];
  available: ServiceKey[];
};

// `available` is the same key list everywhere on purpose: the story design
// offers every service under every object type, so nothing filters the chips.
// The field stays because /uslugi pages and the API still read package labels
// and coefficients from this table.
const ALL_SERVICES: ServiceKey[] = Object.keys(SERVICES) as ServiceKey[];

export const PACKAGES: Record<PackageKey, Package> = {
  restaurant: { label: 'Общепит',      m2ToLm: 0.45, default: ['grease', 'hood'], available: ALL_SERVICES },
  office:     { label: 'Офис',         m2ToLm: 0.30, default: ['dust'],           available: ALL_SERVICES },
  warehouse:  { label: 'Производство', m2ToLm: 0.25, default: ['dust'],           available: ALL_SERVICES },
  custom:     { label: 'Своё',         m2ToLm: 0.30, default: [],                 available: ALL_SERVICES },
};

export type PriceLine = { key: ServiceKey; label: string; amount: number };
export type PriceComputation = { totalMin: number; breakdown: PriceLine[] };

const round100 = (n: number) => Math.round(n / 100) * 100;

export function computePrice(
  services: ServiceKey[],
  areaM2: number,
  packageKey: PackageKey,
  counts: UnitCounts = {},
): PriceComputation {
  const coef = PACKAGES[packageKey].m2ToLm;
  const breakdown: PriceLine[] = [];

  for (const key of services) {
    const s = SERVICES[key];
    let amount = 0;
    if (s.kind === 'linear') {
      amount = round100(areaM2 * coef * s.min);
    } else if (s.kind === 'unit') {
      amount = unitCount(counts, key) * s.price;
    } else {
      amount = s.price;
    }
    breakdown.push({ key, label: s.label, amount });
  }

  const totalMin = breakdown.reduce((sum, line) => sum + line.amount, 0);
  return { totalMin, breakdown };
}

export const formatPrice = (n: number): string =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

/** Разрядка без знака валюты — для крупной цифры в итоговой панели. */
export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('ru-RU').format(Math.round(n));

/* ---------------------------------------------------------------------------
   Story calculator.

   The volume can be entered two ways: floor area, converted to duct metres by
   the package coefficient, or duct metres directly. Everything downstream
   works off the resulting linear metres, so the two modes cannot disagree.
   --------------------------------------------------------------------------- */

export type VolumeUnit = 'm2' | 'lm';

export type Volume = {
  unit: VolumeUnit;
  /** Floor area in m², used when unit === 'm2'. */
  areaM2: number;
  /** Duct length in linear metres, used when unit === 'lm'. */
  lmValue: number;
};

/** Order the chips are rendered in — and the order of the breakdown lines. */
export const CALCULATOR_SERVICES: ServiceKey[] = [
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
];

/** Short chip labels; SERVICES[].label is the long form used in documents. */
export const SERVICE_SHORT: Record<ServiceKey, string> = {
  grease: 'Жир',
  dust: 'Пыль',
  hood: 'Зонты',
  ahu: 'Вентустановки',
  impellerGrease: 'Крыльчатки от жира',
  impellerAir: 'Крыльчатки ВП/ВВ',
  hydrofilter: 'Гидрофильтры',
  grille: 'Решётки',
  valve: 'Клапан',
  diag: 'Диагностика',
};

/* Подписи строк в расшифровке сметы. Отдельно от SERVICE_SHORT, потому что
   строчная буква тут — решение вёрстки, а `ВП/ВВ` в нижнем регистре читается
   как опечатка: автоматический toLowerCase() ломал бы аббревиатуру. */
export const SERVICE_LINE: Record<ServiceKey, string> = {
  grease: 'жир',
  dust: 'пыль',
  hood: 'зонты',
  ahu: 'вентустановки',
  impellerGrease: 'крыльчатки от жира',
  impellerAir: 'крыльчатки ВП/ВВ',
  hydrofilter: 'гидрофильтры',
  grille: 'решётки',
  valve: 'клапан',
  diag: 'диагностика',
};

/** The first-order discount kicks in at this total and takes 20% off. */
export const DISCOUNT_THRESHOLD = 30_000;
export const DISCOUNT_RATE = 0.2;

export function linearMeters(volume: Volume, packageKey: PackageKey): number {
  return volume.unit === 'lm' ? volume.lmValue : volume.areaM2 * PACKAGES[packageKey].m2ToLm;
}

export type EstimateLine = PriceLine & {
  /** "· 54 пог.м" / "· 2 шт" — the quantity the amount was derived from. */
  qty: string;
};

export type Estimate = {
  lines: EstimateLine[];
  total: number;
  lm: number;
  /** Total less 20%, or null when the order is below the discount threshold. */
  discounted: number | null;
};

export function computeEstimate(
  services: ServiceKey[],
  volume: Volume,
  packageKey: PackageKey,
  counts: UnitCounts = {},
): Estimate {
  const lm = linearMeters(volume, packageKey);
  const lines: EstimateLine[] = [];

  for (const key of CALCULATOR_SERVICES) {
    if (!services.includes(key)) continue;
    const service = SERVICES[key];
    if (service.kind === 'linear') {
      lines.push({
        key,
        label: SERVICE_LINE[key],
        amount: round100(lm * service.min),
        qty: `${Math.round(lm)} пог.м`,
      });
    } else if (service.kind === 'unit') {
      const n = unitCount(counts, key);
      lines.push({
        key,
        label: SERVICE_LINE[key],
        amount: n * service.price,
        qty: `${n} шт`,
      });
    } else {
      lines.push({ key, label: SERVICE_LINE[key], amount: service.price, qty: '' });
    }
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return {
    lines,
    total,
    lm,
    discounted: total >= DISCOUNT_THRESHOLD ? Math.round(total * (1 - DISCOUNT_RATE)) : null,
  };
}
