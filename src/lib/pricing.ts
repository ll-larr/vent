export type ServiceKey = 'grease' | 'dust' | 'disinfect' | 'hood' | 'diag';
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
type UnitService  = { kind: 'unit';  price: number; label: string; hint: string };
type FixedService = { kind: 'fixed'; price: number; label: string; hint: string };
export type Service = LinearService | UnitService | FixedService;

export const SERVICES: Record<ServiceKey, Service> = {
  grease: {
    kind: 'linear',
    min: 300,
    max: 400,
    label: 'Чистка вентиляции от жира',
    hint: 'для кухонь общепита',
    diameterTiers: [
      { code: 'pipe-small', label: 'труба Ø ≤ 600 мм',   rate: 300 },
      { code: 'box-small',  label: 'короб ≤ 600×400 мм', rate: 350 },
      { code: 'pipe-large', label: 'труба Ø > 600 мм',   rate: 400 },
      { code: 'box-large',  label: 'короб > 600×400 мм', rate: 400 },
    ],
  },
  dust: {
    kind: 'linear',
    min: 100,
    max: 220,
    label: 'Чистка вентиляции от пыли',
    hint: 'для офисов и складов',
    diameterTiers: [
      { code: 'pipe-small', label: 'труба Ø ≤ 600 мм',   rate: 100 },
      { code: 'box-small',  label: 'короб ≤ 600×400 мм', rate: 120 },
      { code: 'pipe-large', label: 'труба Ø > 600 мм',   rate: 180 },
      { code: 'box-large',  label: 'короб > 600×400 мм', rate: 220 },
    ],
  },
  disinfect: {
    kind: 'linear',
    min: 30,
    max: 30,
    label: 'Дезинфекция',
    hint: 'противомикробная обработка воздуховодов',
  },
  hood: {
    kind: 'unit',
    price: 1000,
    label: 'Чистка вытяжек / зонтов',
    hint: 'за каждый зонт пищеблока',
  },
  diag: {
    kind: 'fixed',
    price: 4500,
    label: 'Диагностика / видеоинспекция',
    hint: 'осмотр и видеоконтроль каналов перед чисткой',
  },
};

export type Package = {
  label: string;
  m2ToLm: number;
  default: ServiceKey[];
  available: ServiceKey[];
};

export const PACKAGES: Record<PackageKey, Package> = {
  restaurant: { label: 'Общепит',      m2ToLm: 0.45, default: ['grease', 'hood'],    available: ['grease', 'hood', 'dust', 'diag'] },
  office:     { label: 'Офис',         m2ToLm: 0.30, default: ['dust'],              available: ['dust', 'diag'] },
  warehouse:  { label: 'Производство', m2ToLm: 0.25, default: ['dust', 'disinfect'], available: ['dust', 'disinfect', 'grease', 'diag'] },
  custom:     { label: 'Своё',         m2ToLm: 0.30, default: [],                    available: ['grease', 'dust', 'hood', 'disinfect', 'diag'] },
};

export type PriceLine = { key: ServiceKey; label: string; amount: number };
export type PriceComputation = { totalMin: number; breakdown: PriceLine[] };

const round100 = (n: number) => Math.round(n / 100) * 100;

export function computePrice(
  services: ServiceKey[],
  areaM2: number,
  packageKey: PackageKey,
  hoodCount: number = 1,
): PriceComputation {
  const coef = PACKAGES[packageKey].m2ToLm;
  const breakdown: PriceLine[] = [];

  for (const key of services) {
    const s = SERVICES[key];
    let amount = 0;
    if (s.kind === 'linear') {
      amount = round100(areaM2 * coef * s.min);
    } else if (s.kind === 'unit') {
      amount = hoodCount * s.price;
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
