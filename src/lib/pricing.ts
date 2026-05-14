import type { ServiceDef, ServiceId, Package, PackageId, CalculatorState, PriceRange } from '@/components/Calculator/types';

const POGM_PER_SQM = 0.25;

export const SERVICES: ServiceDef[] = [
  {
    id: 'vent-dust',
    label: 'Чистка вентиляции (от пыли)',
    unit: 'per-sqm',
    priceMin: Math.round(90 * POGM_PER_SQM),
    priceMax: Math.round(135 * POGM_PER_SQM),
    perSqm: true,
  },
  {
    id: 'vent-grease',
    label: 'Чистка вентиляции (от жира)',
    unit: 'per-sqm',
    priceMin: Math.round(270 * POGM_PER_SQM),
    priceMax: Math.round(360 * POGM_PER_SQM),
    perSqm: true,
  },
  {
    id: 'hoods',
    label: 'Чистка вытяжек (зонты)',
    unit: 'per-unit',
    priceMin: 1800,
    priceMax: 2700,
    perSqm: false,
  },
  {
    id: 'disinfection',
    label: 'Дезинфекция воздуховодов',
    unit: 'per-sqm',
    priceMin: Math.round(27 * POGM_PER_SQM),
    priceMax: Math.round(40 * POGM_PER_SQM),
    perSqm: true,
  },
  {
    id: 'pipes-dust',
    label: 'Чистка труб (от пыли)',
    unit: 'per-sqm',
    priceMin: Math.round(90 * POGM_PER_SQM),
    priceMax: Math.round(135 * POGM_PER_SQM),
    perSqm: true,
  },
  {
    id: 'pipes-grease',
    label: 'Чистка труб (от жира)',
    unit: 'per-sqm',
    priceMin: Math.round(270 * POGM_PER_SQM),
    priceMax: Math.round(360 * POGM_PER_SQM),
    perSqm: true,
  },
  {
    id: 'reservoirs',
    label: 'Чистка резервуаров',
    unit: 'fixed',
    priceMin: 3500,
    priceMax: 8000,
    perSqm: false,
  },
  {
    id: 'diagnostics',
    label: 'Диагностика / осмотр',
    unit: 'fixed',
    priceMin: 0,
    priceMax: 0,
    perSqm: false,
  },
];

export const PACKAGES: Package[] = [
  {
    id: 'catering',
    label: 'Общепит',
    icon: '🍽️',
    description: 'Для ресторанов, кафе, столовых',
    defaultServices: ['vent-grease', 'hoods', 'disinfection'],
  },
  {
    id: 'office',
    label: 'Офис',
    icon: '🏢',
    description: 'Для офисов и бизнес-центров',
    defaultServices: ['vent-dust'],
  },
  {
    id: 'production',
    label: 'Производство',
    icon: '🏭',
    description: 'Для заводов и складов',
    defaultServices: ['vent-dust', 'disinfection'],
  },
  {
    id: 'custom',
    label: 'Своё',
    icon: '⚙️',
    description: 'Выбери услуги самостоятельно',
    defaultServices: [],
  },
];

export function getServiceById(id: ServiceId): ServiceDef {
  const s = SERVICES.find((s) => s.id === id);
  if (!s) throw new Error(`Unknown service: ${id}`);
  return s;
}

export function getPackageById(id: PackageId): Package {
  const p = PACKAGES.find((p) => p.id === id);
  if (!p) throw new Error(`Unknown package: ${id}`);
  return p;
}

export function calculatePrice(state: CalculatorState): PriceRange {
  let min = 0;
  let max = 0;

  for (const serviceId of state.selectedServices) {
    const service = getServiceById(serviceId);
    if (service.id === 'diagnostics') continue;

    if (service.perSqm) {
      min += service.priceMin * state.area;
      max += service.priceMax * state.area;
    } else if (service.id === 'hoods') {
      min += service.priceMin * Math.max(1, state.hoodCount);
      max += service.priceMax * Math.max(1, state.hoodCount);
    } else {
      min += service.priceMin;
      max += service.priceMax;
    }
  }

  return { min: Math.round(min), max: Math.round(max) };
}

export function formatPrice(n: number): string {
  return n.toLocaleString('ru-RU') + ' ₽';
}
