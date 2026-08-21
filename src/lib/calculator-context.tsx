'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  DEFAULT_COUNT,
  PACKAGES,
  SERVICES,
  type PackageKey,
  type ServiceKey,
  type UnitCounts,
  type VolumeUnit,
} from './pricing';

/** The three object types the lead form offers (no "своё" — a lead needs one). */
export type ObjectKey = 'restaurant' | 'office' | 'warehouse';

export const OBJECT_LABELS: Record<ObjectKey, string> = {
  restaurant: 'Кухня',
  office: 'Офис',
  warehouse: 'Склад · цех',
};

export type CalcState = {
  packageKey: PackageKey;
  services: ServiceKey[];
  unit: VolumeUnit;
  /** Floor area, m² — live even while the input is in пог.м mode. */
  areaM2: number;
  /** Duct length, пог.м. */
  lmValue: number;
  /** штуки per counted service — зонты, установки, крыльчатки и остальные. */
  counts: UnitCounts;
  /** Object type in the lead form; presets keep it in step with packageKey. */
  objectKey: ObjectKey;
};

export type CalcAction =
  | { type: 'SET_PACKAGE'; key: PackageKey }
  | { type: 'TOGGLE_SERVICE'; key: ServiceKey }
  | { type: 'SET_AREA'; value: number }
  | { type: 'SET_LM'; value: number }
  | { type: 'SET_UNIT'; unit: VolumeUnit }
  | { type: 'SET_COUNT'; key: ServiceKey; value: number }
  | { type: 'SET_OBJECT'; key: ObjectKey }
  /** Deep link from sections 02 and 05: package + its defaults + one extra. */
  | { type: 'PRESET'; key: PackageKey; extra?: ServiceKey };

export const INITIAL_STATE: CalcState = {
  packageKey: 'restaurant',
  services: ['grease', 'hood'],
  unit: 'm2',
  areaM2: 120,
  lmValue: 60,
  counts: { hood: 2 },
  objectKey: 'restaurant',
};

/** Upper bound for a counter, from the service that owns it. */
function countMax(key: ServiceKey): number {
  const service = SERVICES[key];
  return service.kind === 'unit' ? service.countMax : 0;
}

function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'SET_PACKAGE': {
      // Picking a type never clears a selection the visitor made by hand; the
      // package defaults only fill an empty basket.
      const services = state.services.length
        ? state.services
        : PACKAGES[action.key].default.slice();
      return { ...state, packageKey: action.key, services };
    }
    case 'TOGGLE_SERVICE': {
      const exists = state.services.includes(action.key);
      if (exists) {
        return { ...state, services: state.services.filter((s) => s !== action.key) };
      }
      // Ticking a counted service for the first time seeds its counter, so the
      // line never lands in the estimate as "0 шт".
      const seeded =
        SERVICES[action.key].kind === 'unit' && state.counts[action.key] === undefined
          ? { ...state.counts, [action.key]: DEFAULT_COUNT }
          : state.counts;
      return { ...state, services: [...state.services, action.key], counts: seeded };
    }
    case 'SET_AREA':
      return { ...state, areaM2: Math.max(0, action.value) };
    case 'SET_LM':
      return { ...state, lmValue: Math.max(0, action.value) };
    case 'SET_UNIT': {
      if (action.unit === state.unit) return state;
      // Switching to пог.м seeds the field from the current area so the number
      // does not jump; switching back leaves the area untouched.
      if (action.unit === 'lm') {
        const coef = PACKAGES[state.packageKey].m2ToLm;
        return { ...state, unit: 'lm', lmValue: Math.max(5, Math.round(state.areaM2 * coef)) };
      }
      return { ...state, unit: 'm2' };
    }
    case 'SET_COUNT': {
      const value = Math.max(0, Math.min(countMax(action.key), action.value));
      return { ...state, counts: { ...state.counts, [action.key]: value } };
    }
    case 'SET_OBJECT':
      return { ...state, objectKey: action.key };
    case 'PRESET': {
      const services = PACKAGES[action.key].default.slice();
      if (action.extra && !services.includes(action.extra)) services.push(action.extra);
      return {
        ...state,
        packageKey: action.key,
        services,
        // "Своё" has no matching object type — the form keeps whatever it had.
        objectKey: action.key === 'custom' ? state.objectKey : action.key,
      };
    }
  }
}

type Ctx = { state: CalcState; dispatch: React.Dispatch<CalcAction> };
const CalculatorContext = createContext<Ctx | null>(null);

export function CalculatorProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<CalcState>;
}) {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE, ...initial });
  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>{children}</CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error('useCalculator must be used inside CalculatorProvider');
  return ctx;
}
