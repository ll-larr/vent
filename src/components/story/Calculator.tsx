'use client';

import { useCalculator } from '@/lib/calculator-context';
import {
  CALCULATOR_SERVICES,
  PACKAGES,
  SERVICES,
  SERVICE_SHORT,
  UNIT_SERVICES,
  computeEstimate,
  formatNumber,
  unitCount,
  type PackageKey,
  type ServiceKey,
} from '@/lib/pricing';
import { SectionLabel } from './SectionLabel';

/* Left half of section 07 — four steps down the page, then the dark total.

   Every service is offered under every object type: the chip row is not
   filtered by package, only the coefficient behind м² → пог.м changes. */

const STEP_LABEL = 'mono-label mb-2.5 text-[10.5px] text-ink/50';

const CHIP =
  'mono-label cursor-pointer rounded-pill border px-4 py-[11px] text-[10.5px] tracking-[.1em] transition-[background-color,color,border-color] duration-300';
const CHIP_ON = 'border-ink bg-ink text-bg';
const CHIP_OFF = 'border-ink/[.14] bg-surface text-ink';

const QUICK_AREAS = [50, 120, 200, 300];
const QUICK_LM = [20, 50, 100, 200];
const TICKS_M2 = ['0 м²', '100', '200', '300+'];
const TICKS_LM = ['0 пог.м', '100', '250', '400+'];

const COUNT_BTN =
  'grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-pill bg-surface transition-colors duration-300 hover:bg-ink hover:text-accent';

/** Каждая штучная услуга подписывает свой счётчик сама. */
function COUNT_LABEL(key: ServiceKey): string {
  const service = SERVICES[key];
  return service.kind === 'unit' ? service.countLabel : '';
}

function rate(key: (typeof CALCULATOR_SERVICES)[number]): string {
  const service = SERVICES[key];
  if (service.kind === 'linear') return `${service.min} ₽/пог.м`;
  if (service.kind === 'unit') return `${service.price} ₽/шт`;
  return `${service.price} ₽`;
}

export function Calculator({ onSendEstimate }: { onSendEstimate: () => void }) {
  const { state, dispatch } = useCalculator();
  const isLm = state.unit === 'lm';
  const amount = isLm ? state.lmValue : state.areaM2;
  const estimate = computeEstimate(
    state.services,
    { unit: state.unit, areaM2: state.areaM2, lmValue: state.lmValue },
    state.packageKey,
    state.counts,
  );

  const setAmount = (value: number) =>
    dispatch(isLm ? { type: 'SET_LM', value } : { type: 'SET_AREA', value });

  const amountAria = isLm ? 'Длина каналов, погонных метров' : 'Площадь объекта, м²';

  return (
    <div className="min-w-0 px-[clamp(22px,3vw,56px)] pb-[clamp(40px,5.5vh,66px)] pr-[clamp(22px,3vw,48px)] pt-[clamp(48px,6.5vh,80px)]">
      <SectionLabel className="mb-3.5">07 · калькулятор</SectionLabel>
      <h2 className="mb-2.5 font-display text-[clamp(32px,4vw,66px)] font-light leading-[.96] tracking-[-.032em]">
        Сколько это стоит?
      </h2>
      <p className="mb-6 max-w-[78ch] text-[clamp(15px,1.1vw,18px)] leading-[1.6] text-ink/[.66]">
        Выберите тип объекта, отметьте услуги и площадь помещения.
      </p>

      <div className={STEP_LABEL}>1 / тип объекта</div>
      <div className="mb-[22px] flex flex-wrap gap-2">
        {(Object.keys(PACKAGES) as PackageKey[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={state.packageKey === key}
            onClick={() => dispatch({ type: 'SET_PACKAGE', key })}
            className={`${CHIP} ${state.packageKey === key ? CHIP_ON : CHIP_OFF}`}
          >
            {PACKAGES[key].label}
          </button>
        ))}
      </div>

      <div className={STEP_LABEL}>2 / услуги</div>
      <div className="mb-[22px] flex flex-wrap gap-2">
        {CALCULATOR_SERVICES.map((key) => {
          const on = state.services.includes(key);
          return (
            <button
              key={key}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => dispatch({ type: 'TOGGLE_SERVICE', key })}
              className={`${CHIP} inline-flex items-center gap-[9px] ${on ? CHIP_ON : CHIP_OFF}`}
            >
              {/* The only 3px radius in the whole design. */}
              <span
                aria-hidden="true"
                className={`grid h-3 w-3 place-items-center rounded-[3px] text-[9px] text-ink ${
                  on ? 'bg-accent' : 'bg-ink/10'
                }`}
              >
                {on ? '✓' : ''}
              </span>
              {SERVICE_SHORT[key]} · {rate(key)}
            </button>
          );
        })}
      </div>

      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
        <span className="mono-label text-[10.5px] text-ink/50">3 / объём работ</span>
        <span className="inline-flex gap-[3px] rounded-pill border border-ink/[.12] bg-surface p-[3px]">
          <button
            type="button"
            aria-pressed={!isLm}
            onClick={() => dispatch({ type: 'SET_UNIT', unit: 'm2' })}
            className={`mono-label cursor-pointer rounded-pill px-[15px] py-2 text-[10px] tracking-[.12em] transition-colors duration-300 ${
              isLm ? 'text-ink/60' : 'bg-ink text-bg'
            }`}
          >
            площадь · м²
          </button>
          <button
            type="button"
            aria-pressed={isLm}
            onClick={() => dispatch({ type: 'SET_UNIT', unit: 'lm' })}
            className={`mono-label cursor-pointer rounded-pill px-[15px] py-2 text-[10px] tracking-[.12em] transition-colors duration-300 ${
              isLm ? 'bg-ink text-bg' : 'text-ink/60'
            }`}
          >
            каналы · пог.м
          </button>
        </span>
      </div>

      <div className="bg-surface px-[22px] py-5">
        <div className="flex flex-wrap items-end justify-between gap-3.5">
          <label className="inline-flex cursor-text items-baseline gap-[7px]">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
              aria-label={amountAria}
              className="w-[4ch] font-display text-[clamp(36px,3.2vw,50px)] font-light tracking-[-.025em] outline-none"
            />
            <span className="font-display text-2xl font-light text-ink/45">
              {isLm ? 'пог.м' : 'м²'}
            </span>
          </label>
          <div className="flex gap-1.5">
            {(isLm ? QUICK_LM : QUICK_AREAS).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`mono-label cursor-pointer rounded-pill px-3 py-2 text-[10px] tracking-[.12em] transition-colors duration-300 ${
                  amount === value ? 'bg-brand text-bg' : 'bg-stone text-ink/60'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={isLm ? 400 : 300}
          step={5}
          value={Math.min(amount, isLm ? 400 : 300)}
          onChange={(e) => setAmount(parseInt(e.target.value, 10))}
          aria-label={amountAria}
          className="mt-3.5 w-full cursor-pointer accent-brand"
        />
        <div className="mono-label mt-1 flex justify-between text-[9.5px] tracking-[.12em] text-ink/40">
          {(isLm ? TICKS_LM : TICKS_M2).map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        {!isLm && (
          <div className="mono-label mt-2.5 border-t border-ink/10 pt-2.5 text-[10px] tracking-[.12em] text-ink/45">
            ≈ {formatNumber(estimate.lm)} пог.м каналов для этого типа объекта
          </div>
        )}
      </div>

      {UNIT_SERVICES.filter((key) => state.services.includes(key)).map((key) => {
        const count = unitCount(state.counts, key);
        const caption = COUNT_LABEL(key);
        return (
          <div
            key={key}
            className="mt-0.5 flex items-center justify-between gap-3.5 bg-surface py-3 pl-[22px] pr-3.5"
          >
            <span className="mono-label text-[10.5px] text-ink/50">{caption}</span>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-bg p-[5px]">
              <button
                type="button"
                aria-label={`Меньше: ${caption}`}
                onClick={() => dispatch({ type: 'SET_COUNT', key, value: count - 1 })}
                className={COUNT_BTN}
              >
                −
              </button>
              <span className="inline-flex items-baseline gap-[5px] px-2">
                <b className="font-display text-[28px] font-light tracking-[-.02em]">{count}</b>
                <span className="mono-label text-[10.5px] text-ink/50">шт</span>
              </span>
              <button
                type="button"
                aria-label={`Больше: ${caption}`}
                onClick={() => dispatch({ type: 'SET_COUNT', key, value: count + 1 })}
                className={COUNT_BTN}
              >
                +
              </button>
            </span>
          </div>
        );
      })}

      <div className="mt-3.5 flex flex-wrap items-start justify-between gap-[clamp(16px,2.5vw,36px)] bg-ink p-[clamp(18px,2vw,26px)] text-bg">
        <div className="min-w-0">
          <div className="mono-label mb-1.5 text-[10.5px] text-bg/55">итоговая вилка · до осмотра</div>
          <div className="font-display text-[clamp(42px,5vw,86px)] font-light leading-[.88] tracking-[-.042em] text-accent">
            {formatNumber(estimate.total)}
            <span className="ml-1.5 align-super text-[.24em] text-bg/70">₽</span>
          </div>
          {estimate.discounted !== null && (
            <div className="mono-label mt-2 text-[11.5px] normal-case tracking-[.04em] text-accent">
              со скидкой −20% · <b className="font-medium">{formatNumber(estimate.discounted)} ₽</b>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-[7px]">
          {estimate.lines.map((line) => (
            <div
              key={line.key}
              className="mono-label flex justify-between gap-3 border-b border-bg/[.12] pb-1.5 text-[11.5px] normal-case tracking-[.04em] text-bg/[.72]"
            >
              <span>
                {line.label}
                {line.qty && ` · ${line.qty}`}
              </span>
              <b className="font-medium text-bg">{formatNumber(line.amount)} ₽</b>
            </div>
          ))}
          {estimate.lines.length === 0 && (
            <div className="mono-label text-[11px] normal-case text-bg/55">
              выберите хотя бы одну услугу
            </div>
          )}

          <div className="mt-1.5 flex flex-wrap gap-[9px]">
            <button
              type="button"
              onClick={onSendEstimate}
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-pill bg-accent px-5 py-[13px] text-[14px] font-medium text-ink transition-colors duration-[350ms] hover:bg-bg"
            >
              Отправить расчёт <span aria-hidden="true">→</span>
            </button>
            <a
              href="/files/vent-pricelist-2026.pdf"
              className="mono-label inline-flex items-center gap-2.5 rounded-pill border border-bg/[.22] px-[18px] py-3 text-[10.5px] transition-colors duration-[350ms] hover:border-accent hover:text-accent"
            >
              прайс · pdf
            </a>
          </div>
          <p className="mono-label mt-0.5 text-[9.5px] leading-[1.8] tracking-[.1em] text-bg/45">
            цена зависит от типа и сечения канала · не является публичной офертой
          </p>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
