'use client';

import { useCalculator } from '@/lib/calculator-context';
import { PACKAGES, type PackageKey } from '@/lib/pricing';
import { PACKAGE_DISPLAY } from '@/data/packages';

type Variant = 'mini' | 'full';

export function PackageChips({ variant = 'mini' }: { variant?: Variant }) {
  const { state, dispatch } = useCalculator();
  const keys = Object.keys(PACKAGES) as PackageKey[];

  if (variant === 'mini') {
    return (
      <div className="flex gap-1.5 flex-wrap mb-3.5" role="group" aria-label="Тип объекта">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={state.packageKey === k}
            onClick={() => dispatch({ type: 'SET_PACKAGE', key: k })}
            className={`px-3 py-1.5 text-[13px] rounded-full transition-colors border ${
              state.packageKey === k
                ? 'bg-ink text-bg border-ink'
                : 'bg-ink/[.05] text-ink/75 border-transparent hover:border-ink/15'
            }`}
          >
            {PACKAGES[k].label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 mb-6" role="group" aria-label="Тип объекта">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          aria-pressed={state.packageKey === k}
          onClick={() => dispatch({ type: 'SET_PACKAGE', key: k })}
          className={`text-left p-4 rounded-2xl border transition-colors ${
            state.packageKey === k
              ? 'bg-ink text-bg border-ink'
              : 'bg-surface text-ink border-ink/10 hover:border-ink'
          }`}
        >
          <div className="font-medium text-[15px]">{PACKAGES[k].label}</div>
          <div className="text-[12px] opacity-60 mt-1">{PACKAGE_DISPLAY[k].description}</div>
        </button>
      ))}
    </div>
  );
}
