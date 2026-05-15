'use client';

import { useCalculator } from '@/lib/calculator-context';
import { PACKAGES, SERVICES, type Service, type ServiceKey } from '@/lib/pricing';
import { Info, Check } from '@/lib/icons';

function formatRate(s: Service): string {
  if (s.kind === 'linear') return `от ${s.min} ₽/пог.м`;
  if (s.kind === 'unit') return `от ${s.price} ₽/шт`;
  return `${s.price} ₽`;
}

function diameterTooltip(s: Service): string | undefined {
  if (s.kind !== 'linear' || !s.diameterTiers) return undefined;
  return s.diameterTiers.map((t) => `${t.label} — ${t.rate}`).join('; ') + ' ₽/пог.м · точно определим при осмотре';
}

export function ServiceList() {
  const { state, dispatch } = useCalculator();
  const available = PACKAGES[state.packageKey].available;

  return (
    <ul className="flex flex-col gap-2 mb-6" role="group" aria-label="Услуги">
      {available.map((key: ServiceKey) => {
        const s = SERVICES[key];
        const active = state.services.includes(key);
        const tooltip = diameterTooltip(s);
        return (
          <li key={key}>
            <button
              type="button"
              role="checkbox"
              aria-checked={active}
              onClick={() => dispatch({ type: 'TOGGLE_SERVICE', key })}
              className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-colors border ${
                active ? 'bg-accent/15 border-brand/20' : 'bg-ink/[.03] border-transparent hover:bg-ink/[.06]'
              }`}
            >
              <span
                className={`rounded-md border-[1.5px] flex items-center justify-center flex-shrink-0 ${
                  active ? 'bg-brand border-brand' : 'border-ink/20 bg-white'
                }`}
                style={{ width: 22, height: 22 }}
              >
                {active && <Check size={14} strokeWidth={3} color="#fff" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-[15px]">{s.label}</span>
                <span className="block text-[12px] text-ink/55 mt-0.5">{s.hint}</span>
              </span>
              <span className="font-mono text-[12px] text-ink/55 flex items-center gap-1.5 flex-shrink-0">
                {formatRate(s)}
                {tooltip && (
                  <span className="cursor-help inline-flex" title={tooltip} aria-label="Зависит от диаметра">
                    <Info size={13} strokeWidth={1.5} />
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
