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
      return {
        ...state,
        packageKey: action.key,
        services: pkg.default.slice(),
        hoodCount: pkg.default.includes('hood') ? state.hoodCount : 1,
      };
    }
    case 'TOGGLE_SERVICE': {
      const exists = state.services.includes(action.key);
      const services = exists
        ? state.services.filter((s) => s !== action.key)
        : [...state.services, action.key];
      return { ...state, services };
    }
    case 'SET_AREA':
      return { ...state, areaM2: action.value };
    case 'SET_HOOD_COUNT':
      return { ...state, hoodCount: Math.max(1, Math.min(20, action.value)) };
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
