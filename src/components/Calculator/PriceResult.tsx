'use client';

import { useCalculator } from '@/lib/calculator-context';
import { computePrice } from '@/lib/pricing';
import { Plus, Minus, ArrowRight } from '@/lib/icons';

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n);

type Variant = 'mini' | 'full';

export function PriceResult({ variant = 'mini' }: { variant?: Variant }) {
  const { state, dispatch } = useCalculator();
  const result = computePrice(state.services, state.areaM2, state.packageKey, state.hoodCount);
  const hasHood = state.services.includes('hood');

  const message =
    state.areaM2 < 20
      ? 'минимум 20 м²'
      : state.areaM2 > 5000
      ? 'крупные объекты — звоните +7 (000) 000-00-00'
      : state.services.length === 0
      ? 'выберите услуги'
      : null;

  const isFixedOnly = state.services.length === 1 && state.services[0] === 'diag';
  const fromLabel = isFixedOnly ? '' : 'от ';

  if (variant === 'mini') {
    return (
      <div className="flex justify-between items-end mt-4.5 pt-3.5 border-t border-line" aria-live="polite">
        <span className="font-display font-normal text-[36px] leading-none tracking-[-.02em]">
          {message ? (
            <span className="text-[15px] text-ink/55 font-sans">{message}</span>
          ) : (
            <>
              {fromLabel}
              <em className="italic text-brand not-italic font-medium">{fmt(result.totalMin)}</em>
              &nbsp;₽
            </>
          )}
        </span>
        {!message && (
          <small className="font-mono text-[10px] uppercase tracking-[.15em] text-ink/45">
            точно — после осмотра
          </small>
        )}
      </div>
    );
  }

  return (
    <aside
      className="bg-ink text-bg rounded-3xl p-7 flex flex-col gap-4.5 sticky top-6"
      aria-live="polite"
    >
      <span className="font-mono text-[11px] uppercase tracking-[.15em] opacity-55">
        ориентировочная стоимость
      </span>
      {message ? (
        <span className="font-display font-light text-[40px] leading-none tracking-[-.025em]">
          <span className="text-base opacity-70">{message}</span>
        </span>
      ) : (
        <>
          <span className="font-display font-light text-[64px] leading-none tracking-[-.025em]">
            {fromLabel}
            <em className="italic text-accent not-italic">{fmt(result.totalMin)}</em>&nbsp;₽
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[.1em] opacity-55">
            точная — после осмотра
          </span>

          <div className="flex flex-col gap-1.5 pt-3.5 border-t border-dashed border-white/15 text-[13px]">
            {result.breakdown.map((line) => (
              <div key={line.key} className="flex justify-between opacity-80">
                <span className="flex items-center gap-2">
                  {line.label}
                  {line.key === 'hood' && hasHood && (
                    <span className="inline-flex items-center gap-1 ml-1">
                      ×
                      <button
                        type="button"
                        aria-label="убавить количество вытяжек"
                        onClick={() => dispatch({ type: 'SET_HOOD_COUNT', value: state.hoodCount - 1 })}
                        className="px-1 hover:opacity-100 opacity-70"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono">{state.hoodCount}</span>
                      <button
                        type="button"
                        aria-label="прибавить количество вытяжек"
                        onClick={() => dispatch({ type: 'SET_HOOD_COUNT', value: state.hoodCount + 1 })}
                        className="px-1 hover:opacity-100 opacity-70"
                      >
                        <Plus size={12} />
                      </button>
                    </span>
                  )}
                </span>
                <b className="font-mono font-normal whitespace-nowrap">~ {fmt(line.amount)} ₽</b>
              </div>
            ))}
          </div>
        </>
      )}
      <a
        href="#contact"
        className="bg-accent text-ink p-4 rounded-[14px] font-semibold text-[16px] flex items-center justify-center gap-2.5 hover:bg-white transition-colors mt-2"
      >
        Оставить заявку
        <ArrowRight size={18} strokeWidth={2} />
      </a>
    </aside>
  );
}
