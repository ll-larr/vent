'use client';

import { useCalculator } from '@/lib/calculator-context';
import { PACKAGES, computePrice, type PackageKey } from '@/lib/pricing';
import { ArrowRight, Plus, Minus } from '@/lib/icons';

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n / 100) * 100);

export function MiniCalculator() {
  const { state, dispatch } = useCalculator();
  const result = computePrice(state.services, state.areaM2, state.packageKey, state.hoodCount);
  const isRestaurant = state.packageKey === 'restaurant';

  const pkgKeys = Object.keys(PACKAGES) as PackageKey[];

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-3.5 h-full">
      {/* Head */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display font-light text-[24px] leading-none tracking-[-.015em]">
          Прикинуть <em className="italic text-brand">стоимость.</em>
        </h3>
        <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full font-mono text-[11px] tracking-[.12em] uppercase border border-line-2"
              style={{ borderColor: 'rgba(20,19,18,.14)' }}>
          <span
            className="w-1.5 h-1.5 rounded-full bg-accent animate-live-pulse"
            style={{ boxShadow: '0 0 0 4px rgba(200,255,62,.25)' }}
            aria-hidden="true"
          />
          30 секунд
        </span>
      </div>

      {/* Grid */}
      <div className={`grid gap-2.5 ${isRestaurant ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {/* Package */}
        <div className="bg-stone rounded-[14px] px-3.5 py-3 min-h-[96px] flex flex-col justify-between gap-1.5 overflow-hidden">
          <span className="font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">Тип объекта</span>
          <div className="flex gap-1.5 flex-wrap">
            {pkgKeys.map((k) => {
              const active = state.packageKey === k;
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={active}
                  onClick={() => dispatch({ type: 'SET_PACKAGE', key: k })}
                  className={`px-2.5 py-1.5 rounded-full font-mono text-[10.5px] tracking-[.08em] uppercase transition-all border ${
                    active
                      ? 'bg-ink text-bg border-ink'
                      : 'bg-surface text-ink border-transparent hover:bg-bg'
                  }`}
                >
                  {PACKAGES[k].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Area */}
        <div className="bg-stone rounded-[14px] px-3.5 py-3 min-h-[96px] flex flex-col justify-between gap-1.5 overflow-hidden">
          <label htmlFor="area-mini" className="font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">
            Площадь
          </label>
          <div className="flex items-baseline gap-1.5 px-3 py-2 bg-surface rounded-[10px] border border-transparent focus-within:border-brand transition-colors">
            <input
              id="area-mini"
              type="number"
              inputMode="numeric"
              min={20}
              max={20000}
              value={state.areaM2 || ''}
              onChange={(e) => dispatch({ type: 'SET_AREA', value: parseInt(e.target.value) || 0 })}
              className="w-full bg-transparent border-0 outline-0 font-display font-light text-[28px] text-ink tracking-[-.02em] caret-brand"
              style={{ MozAppearance: 'textfield' } as React.CSSProperties}
            />
            <span className="font-display font-light text-[16px] tracking-[-.01em] text-ink/40 flex-shrink-0">
              м²
            </span>
          </div>
        </div>

        {/* Hood stepper (only for restaurant) */}
        {isRestaurant && (
          <div className="bg-stone rounded-[14px] px-3.5 py-3 min-h-[96px] flex flex-col justify-between gap-1.5 overflow-hidden">
            <span className="font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">Зонты</span>
            <div className="flex items-center gap-1 bg-surface rounded-full p-[3px] w-full">
              <button
                type="button"
                aria-label="Меньше зонтов"
                onClick={() => dispatch({ type: 'SET_HOOD_COUNT', value: state.hoodCount - 1 })}
                disabled={state.hoodCount <= 0}
                className="w-[26px] h-[26px] rounded-full bg-stone text-ink grid place-items-center font-display font-light text-[18px] leading-none hover:bg-ink hover:text-accent transition-colors disabled:opacity-35 disabled:cursor-not-allowed active:scale-90 flex-shrink-0"
              >
                <Minus size={11} strokeWidth={2} aria-hidden="true" />
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={40}
                value={state.hoodCount}
                onChange={(e) => dispatch({ type: 'SET_HOOD_COUNT', value: parseInt(e.target.value) || 0 })}
                className="flex-1 min-w-0 text-center bg-transparent border-0 outline-0 font-display font-light text-[19px] text-ink tracking-[-.02em]"
                style={{ MozAppearance: 'textfield' } as React.CSSProperties}
              />
              <button
                type="button"
                aria-label="Больше зонтов"
                onClick={() => dispatch({ type: 'SET_HOOD_COUNT', value: state.hoodCount + 1 })}
                disabled={state.hoodCount >= 40}
                className="w-[26px] h-[26px] rounded-full bg-stone text-ink grid place-items-center font-display font-light text-[18px] leading-none hover:bg-ink hover:text-accent transition-colors disabled:opacity-35 disabled:cursor-not-allowed active:scale-90 flex-shrink-0"
              >
                <Plus size={11} strokeWidth={2} aria-hidden="true" />
              </button>
              <span className="font-mono text-[10px] tracking-[.12em] uppercase text-ink/50 pr-2 flex-shrink-0">шт</span>
            </div>
          </div>
        )}

        {/* Result */}
        <div className="bg-ink text-bg rounded-[14px] px-3.5 py-3 min-h-[96px] flex flex-col justify-between gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[.14em] text-bg/55">от</span>
          <span className="font-display font-light text-[30px] text-accent tracking-[-.02em] leading-none">
            {fmt(result.totalMin)} ₽
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[.12em] text-bg/50">
            точная сумма — после осмотра
          </span>
        </div>
      </div>

      {/* Foot */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap gap-1.5">
          {['● осмотр инженера', '● договор', '● оплата по факту'].map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] uppercase tracking-[.12em] text-ink/55 px-2.5 py-1.5 bg-bg rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
        <a
          href="#calculator"
          className="group inline-flex items-center gap-2 px-3.5 py-2.5 bg-ink text-bg rounded-full font-medium text-[13px] hover:bg-brand transition-colors"
        >
          Полный расчёт
          <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export default MiniCalculator;
