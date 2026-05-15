import type { PackageKey } from '@/lib/pricing';

export type PackageDisplay = {
  key: PackageKey;
  title: string;
  description: string;
};

export const PACKAGE_DISPLAY: Record<PackageKey, PackageDisplay> = {
  restaurant: { key: 'restaurant', title: 'Общепит',      description: 'кухня + зонты + жир' },
  office:     { key: 'office',     title: 'Офис',         description: 'пыль + кондиционеры' },
  warehouse:  { key: 'warehouse',  title: 'Производство', description: 'пыль + дезинфекция' },
  custom:     { key: 'custom',     title: 'Своё',         description: 'соберу сам' },
};
