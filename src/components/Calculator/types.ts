export type ServiceId =
  | 'vent-dust'
  | 'vent-grease'
  | 'hoods'
  | 'disinfection'
  | 'pipes-dust'
  | 'pipes-grease'
  | 'reservoirs'
  | 'diagnostics';

export type PriceUnit = 'per-sqm' | 'fixed' | 'per-unit';

export interface ServiceDef {
  id: ServiceId;
  label: string;
  unit: PriceUnit;
  priceMin: number;
  priceMax: number;
  perSqm: boolean;
}

export type PackageId = 'catering' | 'office' | 'production' | 'custom';

export interface Package {
  id: PackageId;
  label: string;
  icon: string;
  description: string;
  defaultServices: ServiceId[];
}

export interface CalculatorState {
  packageId: PackageId;
  selectedServices: ServiceId[];
  area: number;
  hoodCount: number;
}

export interface PriceRange {
  min: number;
  max: number;
}
