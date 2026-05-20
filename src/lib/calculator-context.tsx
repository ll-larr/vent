'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PACKAGES, type PackageKey, type ServiceKey } from './pricing';

export type CalcState = {
  packageKey: PackageKey;
  services: ServiceKey[];
  areaM2: number;
  hoodCount: number;
};

export type CalcAction =
  | { type: 'SET_PACKAGE'; key: PackageKey }
  | { type: 'TOGGLE_SERVICE'; key: ServiceKey }
  | { type: 'SET_AREA'; value: number }
  | { type: 'SET_HOOD_COUNT'; value: number };

export const INITIAL_STATE: CalcState = {
  packageKey: 'restaurant',
  services: PACKAGES.restaurant.default.slice(),
  areaM2: 180,
  hoodCount: 3,
};

function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'SET_PACKAGE': {
      const pkg = PACKAGES[action.key];
      const includesHood = pkg.default.includes('hood');
      return {
        ...state,
        packageKey: action.key,
        services: pkg.default.slice(),
        // Keep current count when the package ships hoods, but never leave a
        // hood-bearing package at 0 (that would mean "checked but empty").
        hoodCount: includesHood ? Math.max(1, state.hoodCount) : 1,
      };
    }
    case 'TOGGLE_SERVICE': {
      const exists = state.services.includes(action.key);
      const services = exists
        ? state.services.filter((s) => s !== action.key)
        : [...state.services, action.key];
      // Re-checking hoods with a 0 count should seed at least one.
      const hoodCount =
        action.key === 'hood' && !exists && state.hoodCount === 0 ? 1 : state.hoodCount;
      return { ...state, services, hoodCount };
    }
    case 'SET_AREA':
      return { ...state, areaM2: action.value };
    case 'SET_HOOD_COUNT': {
      const hoodCount = Math.max(0, Math.min(40, action.value));
      // 0 hoods means the service leaves the cart (and unchecks); any positive
      // count keeps it selected.
      let services = state.services;
      if (hoodCount === 0) {
        services = state.services.filter((s) => s !== 'hood');
      } else if (!state.services.includes('hood')) {
        services = [...state.services, 'hood'];
      }
      return { ...state, hoodCount, services };
    }
  }
}

type Ctx = { state: CalcState; dispatch: React.Dispatch<CalcAction> };
const CalculatorContext = createContext<Ctx | null>(null);

export function CalculatorProvider({ children, initial }: { children: ReactNode; initial?: Partial<CalcState> }) {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE, ...initial });
  return <CalculatorContext.Provider value={{ state, dispatch }}>{children}</CalculatorContext.Provider>;
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error('useCalculator must be used inside CalculatorProvider');
  return ctx;
}
