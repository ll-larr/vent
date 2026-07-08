'use client';

import { useEffect, useRef, useState } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { useMagnet } from '@/lib/useMagnet';
import { useCalculator } from '@/lib/calculator-context';
import {
  PACKAGES,
  SERVICES,
  computePrice,
  type PackageKey,
  type ServiceKey,
  type Service,
} from '@/lib/pricing';
import { Minus, Plus, ArrowRight, Edit } from '@/lib/icons';

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
const fmtFromRubles = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(Math.round(n / 100) * 100);

const QUICK_AREAS = [50, 120, 200, 300];
const AREA_MIN = 0;
// Slider tops out at a realistic 300 m²; manual entry stays unbounded above.
const SLIDER_MAX = 300;

function serviceRateLabel(s: Service): string {
  if (s.kind === 'linear') return `${s.min} ₽/пог.м`;
  if (s.kind === 'unit') return `${s.price} ₽/шт`;
  return `${s.price} ₽`;
}

function serviceShortName(key: ServiceKey): string {
  switch (key) {
    case 'grease': return 'Чистка от жира';
    case 'hood': return 'Зонты';
    case 'dust': return 'Пыль';
    case 'disinfect': return 'Дезинфекция';
    case 'diag': return 'Диагностика';
  }
}

// When user clicks a `data-calc-jump="<svcKey>"` link, preselect package + add service
const SVC_TO_PKG: Record<ServiceKey, PackageKey> = {
  grease: 'restaurant',
  hood: 'restaurant',
  dust: 'office',
  disinfect: 'warehouse',
  diag: 'custom',
};

export function Calculator() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);
  const { state, dispatch } = useCalculator();
  const submitCtaRef = useMagnet<HTMLAnchorElement>({ strength: 0.3 });
  const [pdfLoading, setPdfLoading] = useState(false);

  // Lazy-load jsPDF + fonts only on click → no weight on the initial bundle.
  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const { downloadPriceEstimate } = await import('@/lib/price-pdf');
      await downloadPriceEstimate(state);
    } catch (err) {
      console.error('Не удалось сформировать PDF:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  // Handle data-calc-jump links from anywhere on the page
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-calc-jump]') as HTMLElement | null;
      if (!target) return;
      const svc = target.getAttribute('data-calc-jump') as ServiceKey | null;
      if (!svc) return;
      const pkg = SVC_TO_PKG[svc] ?? 'restaurant';
      dispatch({ type: 'SET_PACKAGE', key: pkg });
      // After SET_PACKAGE (defaults), ensure the target service is selected
      // We do this in a microtask so the package state has resolved.
      queueMicrotask(() => {
        if (!PACKAGES[pkg].default.includes(svc)) {
          dispatch({ type: 'TOGGLE_SERVICE', key: svc });
        }
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [dispatch]);

  const result = computePrice(state.services, state.areaM2, state.packageKey, state.hoodCount);
  const coef = PACKAGES[state.packageKey].m2ToLm;
  const lm = state.areaM2 * coef;

  // Breakdown shaped for bento (service · qty · amount)
  const breakdownLines = result.breakdown.map((line) => {
    const svc = SERVICES[line.key];
    let qty = '';
    if (svc.kind === 'linear') qty = `${Math.round(lm)} пог.м`;
    else if (svc.kind === 'unit') qty = `${state.hoodCount} шт`;
    return {
      key: line.key,
      label: `${serviceShortName(line.key)}${qty ? ' · ' + qty : ''}`,
      amount: line.amount,
    };
  });

  const fillPct = Math.max(0, Math.min(100, ((state.areaM2 - AREA_MIN) / (SLIDER_MAX - AREA_MIN)) * 100));

  const pkgKeys = Object.keys(PACKAGES) as PackageKey[];
  const svcKeys: ServiceKey[] = ['grease', 'hood', 'dust', 'disinfect', 'diag'];

  return (
    <section
      ref={ref}
      id="calculator"
      className="mt-16 px-4 py-20 lg:py-[80px_16px_90px] bg-ink"
    >
      <div className="max-w-[1320px] mx-auto bg-bg rounded-[32px] p-6 md:p-7 lg:p-[28px_32px] grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-7">
        {/* LEFT */}
        <div className="lg:pr-2">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.14em] text-ink/55 mb-2.5">
            <span className="w-3.5 h-px bg-brand inline-block" />
            07 / калькулятор
          </div>
          <h3 className="font-display font-light text-[clamp(36px,4.5vw,60px)] leading-none tracking-[-.02em]">
            Сколько это <em className="italic text-brand">стоит?</em>
          </h3>
          <p className="text-ink/60 mt-2.5 max-w-[44ch] text-[15px] leading-[1.55]">
            Выберите тип объекта, отметьте услуги и площадь — получите вилку до выезда. Точная
            цена — после видеоосмотра.
          </p>

          {/* Step 1 — package */}
          <div className="flex flex-col gap-2.5 mt-5">
            <div className="font-mono text-[11px] uppercase tracking-[.14em] text-ink/55">
              1 / тип объекта
            </div>
            <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Тип объекта">
              {pkgKeys.map((k) => {
                const active = state.packageKey === k;
                return (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => dispatch({ type: 'SET_PACKAGE', key: k })}
                    className={`px-3.5 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-[.08em] transition-all border ${
                      active
                        ? 'bg-ink text-bg border-ink'
                        : 'bg-surface text-ink border-transparent hover:bg-stone'
                    }`}
                  >
                    {PACKAGES[k].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — services */}
          <div className="flex flex-col gap-2.5 mt-5">
            <div className="font-mono text-[11px] uppercase tracking-[.14em] text-ink/55">
              2 / услуги
            </div>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Услуги">
              {svcKeys.map((k) => {
                const active = state.services.includes(k);
                const s = SERVICES[k];
                return (
                  <button
                    key={k}
                    type="button"
                    role="checkbox"
                    aria-checked={active}
                    onClick={() => dispatch({ type: 'TOGGLE_SERVICE', key: k })}
                    className={`px-3.5 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-[.08em] transition-all border inline-flex items-center gap-2 ${
                      active
                        ? 'bg-ink text-bg border-ink'
                        : 'bg-surface text-ink border-transparent hover:bg-stone'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-[3px] grid place-items-center text-[10px] ${
                        active ? 'bg-accent text-ink' : 'bg-ink/10'
                      }`}
                      aria-hidden="true"
                    >
                      {active ? '✓' : ''}
                    </span>
                    {serviceShortName(k)} · {serviceRateLabel(s)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 — area slider + hood stepper */}
          <div className="flex flex-col gap-2.5 mt-5">
            <div className="font-mono text-[11px] uppercase tracking-[.14em] text-ink/55">
              3 / площадь и зонты
            </div>

            {/* Area slider */}
            <div
              className="bg-surface rounded-[18px] p-[18px_20px] grid grid-cols-[1fr_auto] gap-3 items-center"
              style={{ gridTemplateAreas: '"value quick" "range range" "ticks ticks"' }}
            >
              {/* Value */}
              <label
                className="relative inline-flex items-baseline gap-1.5 px-3.5 py-2 pb-2.5 rounded-[14px] bg-stone hover:bg-bg focus-within:bg-bg focus-within:[box-shadow:0_0_0_2px_var(--color-brand)] transition-all w-fit cursor-text"
                style={{ gridArea: 'value' }}
                htmlFor="area-full"
              >
                <input
                  id="area-full"
                  type="number"
                  inputMode="numeric"
                  min={AREA_MIN}
                  value={state.areaM2 || ''}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    dispatch({
                      type: 'SET_AREA',
                      value: Number.isNaN(v) ? AREA_MIN : Math.max(AREA_MIN, v),
                    });
                  }}
                  aria-label="Площадь объекта в квадратных метрах"
                  className="bg-transparent border-0 outline-0 font-display font-light text-[44px] tracking-[-.02em] caret-brand min-w-[80px] max-w-[140px] w-[5ch] p-0 text-left"
                  style={{ MozAppearance: 'textfield' } as React.CSSProperties}
                />
                <span className="font-display font-light text-[24px] tracking-[-.01em] text-ink/45">
                  м²
                </span>
                <span
                  className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-brand text-bg rounded-full grid place-items-center opacity-0 scale-75 translate-y-0.5 pointer-events-none hover:[&]:opacity-100 group-focus-within:[&]:opacity-100 [.group:hover_&]:opacity-100 transition-all duration-200"
                  aria-hidden="true"
                  style={{
                    boxShadow: '0 4px 12px rgba(30,92,50,.25)',
                  }}
                >
                  <Edit size={12} strokeWidth={2.2} />
                </span>
              </label>

              {/* Quick fill buttons */}
              <div className="flex gap-1.5 self-end pb-0.5" style={{ gridArea: 'quick' }}>
                {QUICK_AREAS.map((q) => {
                  const active = state.areaM2 === q;
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => dispatch({ type: 'SET_AREA', value: q })}
                      className={`px-2.5 py-1.5 rounded-full font-mono text-[10.5px] uppercase tracking-[.12em] transition-colors ${
                        active
                          ? 'bg-brand text-bg'
                          : 'bg-stone text-ink/60 hover:bg-ink hover:text-bg'
                      }`}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>

              {/* Range slider */}
              <div className="relative h-7 mt-1" style={{ gridArea: 'range' }}>
                <div
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-stone pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full pointer-events-none transition-[width] duration-75"
                  style={{
                    width: `${fillPct}%`,
                    background: 'linear-gradient(90deg, var(--color-brand) 0%, #2d7d46 100%)',
                  }}
                  aria-hidden="true"
                />
                <input
                  type="range"
                  min={AREA_MIN}
                  max={SLIDER_MAX}
                  step={5}
                  value={Math.min(SLIDER_MAX, Math.max(AREA_MIN, state.areaM2))}
                  onChange={(e) => dispatch({ type: 'SET_AREA', value: parseInt(e.target.value, 10) })}
                  aria-label="Площадь, ползунок"
                  className="calc-range absolute inset-0 w-full h-7 bg-transparent cursor-pointer appearance-none m-0 p-0 z-[2]"
                />
              </div>

              <div
                className="flex justify-between -mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-ink/40"
                style={{ gridArea: 'ticks' }}
              >
                <span>0 м²</span>
                <span>100</span>
                <span>200</span>
                <span>300+</span>
              </div>
            </div>

            {/* Hood stepper — visible when 'hood' service is selected */}
            {state.services.includes('hood') && (
              <div className="bg-surface rounded-[16px] p-[14px_16px_14px_22px] flex items-center justify-between gap-3.5 mt-1">
                <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-ink/50">
                  зонты
                </span>
                <div className="inline-flex items-center gap-1.5 bg-bg rounded-full p-1">
                  <button
                    type="button"
                    aria-label="Меньше зонтов"
                    onClick={() => dispatch({ type: 'SET_HOOD_COUNT', value: state.hoodCount - 1 })}
                    disabled={state.hoodCount <= 0}
                    className="w-9 h-9 rounded-full bg-surface text-ink grid place-items-center hover:bg-ink hover:text-accent transition-colors disabled:opacity-35 disabled:cursor-not-allowed active:scale-90"
                  >
                    <Minus size={14} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <span className="inline-flex items-baseline gap-1 px-2.5">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={40}
                      value={state.hoodCount}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_HOOD_COUNT',
                          value: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      aria-label="Количество зонтов"
                      className="font-display font-light text-[28px] tracking-[-.02em] bg-transparent border-0 outline-0 text-right min-w-[24px] w-[auto] [field-sizing:content]"
                      style={{ MozAppearance: 'textfield' } as React.CSSProperties}
                    />
                    <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ink/50">шт</span>
                  </span>
                  <button
                    type="button"
                    aria-label="Больше зонтов"
                    onClick={() => dispatch({ type: 'SET_HOOD_COUNT', value: state.hoodCount + 1 })}
                    disabled={state.hoodCount >= 40}
                    className="w-9 h-9 rounded-full bg-surface text-ink grid place-items-center hover:bg-ink hover:text-accent transition-colors disabled:opacity-35 disabled:cursor-not-allowed active:scale-90"
                  >
                    <Plus size={14} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — total panel */}
        <aside className="bg-ink text-bg rounded-[20px] p-[22px_24px] flex flex-col gap-3.5">
          <h4 className="font-mono text-[11px] uppercase tracking-[.14em] text-bg/60">
            итоговая вилка
          </h4>
          <div className="font-display font-light text-[clamp(48px,6.5vw,84px)] text-accent leading-[.9] tracking-[-.03em]">
            {fmt(result.totalMin)}
            <small className="text-[18px] align-super text-bg/70 ml-1">₽</small>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[.14em] text-bg/55">
            от · до выезда инженера
          </div>

          <div className="flex flex-col gap-1.5 border-t border-bg/[.12] pt-3.5 mt-1">
            {breakdownLines.length === 0 && (
              <div className="font-mono text-[11px] text-bg/55">выберите хотя бы одну услугу</div>
            )}
            {breakdownLines.map((line) => (
              <div
                key={line.key}
                className="flex justify-between font-mono text-[11.5px] tracking-[.04em] text-bg/75"
              >
                <span>{line.label.toLowerCase()}</span>
                <b className="text-bg font-medium">{fmtFromRubles(line.amount)} ₽</b>
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap mt-1.5">
            <a ref={submitCtaRef} href="#contact" data-magnet className="btn-lime">
              Оставить заявку
              <ArrowRight size={14} strokeWidth={2} className="arrow" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfLoading || result.breakdown.length === 0}
              className="btn-ghost-on-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pdfLoading ? 'Готовим PDF…' : 'Скачать расчёт PDF'}
            </button>
          </div>
        </aside>
      </div>

    </section>
  );
}

export default Calculator;
