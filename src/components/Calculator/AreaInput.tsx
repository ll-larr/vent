'use client';

import { useCalculator } from '@/lib/calculator-context';

type Variant = 'mini' | 'full';

export function AreaInput({ variant = 'mini' }: { variant?: Variant }) {
  const { state, dispatch } = useCalculator();
  const setArea = (v: number) => dispatch({ type: 'SET_AREA', value: v });

  if (variant === 'mini') {
    return (
      <div className="flex justify-between items-center px-3.5 py-3 bg-bg rounded-[10px] font-mono text-[13px] text-ink/55">
        <label htmlFor="area-mini">площадь, м²</label>
        <input
          id="area-mini"
          type="number"
          min={20}
          max={5000}
          value={state.areaM2 || ''}
          onChange={(e) => setArea(parseInt(e.target.value) || 0)}
          className="font-display font-normal text-[22px] bg-transparent border-none w-[90px] text-right text-ink focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3.5 bg-bg border border-transparent focus-within:border-ink rounded-[14px] pl-4.5 pr-2 py-2 transition-colors">
        <label htmlFor="area-full" className="flex-1 font-mono text-[12px] uppercase tracking-[.1em] text-ink/55">
          площадь
        </label>
        <input
          id="area-full"
          type="number"
          min={20}
          max={5000}
          value={state.areaM2 || ''}
          onChange={(e) => setArea(parseInt(e.target.value) || 0)}
          className="font-display font-light text-[32px] bg-transparent border-none w-[120px] text-right text-ink focus:outline-none"
        />
        <span className="font-mono text-[14px] text-ink/55 px-3 py-2">м²</span>
      </div>
      <p className="text-[13px] text-ink/50 mt-2">Площадь вашего ресторана, офиса или объекта.</p>
    </div>
  );
}
