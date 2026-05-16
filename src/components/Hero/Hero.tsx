'use client';

import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { MiniCalculator } from '@/components/Calculator/MiniCalculator';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} className="hero-section px-4 pt-[22px] pb-3" aria-label="Hero">
      <div
        className="max-w-[1320px] mx-auto grid grid-cols-12 gap-3"
        style={{ gridAutoRows: 'minmax(96px, auto)' }}
      >
        {/* HEADLINE — 8 × 3 cream */}
        <div
          className="col-span-12 lg:col-span-8 row-span-2 lg:row-span-3 bg-bg rounded-[28px] px-6 py-7 md:px-8 md:py-8 flex flex-col justify-between relative overflow-hidden min-h-[380px] lg:min-h-[540px]"
          data-anim
        >
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.14em] text-ink/55">
            <span className="w-[18px] h-px bg-brand inline-block" />
            01 / vent — промышленная чистка вентсистем
          </div>
          <h1
            className="font-display font-light text-[clamp(56px,7.6vw,124px)] leading-[.96] tracking-[-.028em] mt-6"
            data-anim
            style={{ ['--delay' as any]: '70ms' }}
          >
            Чистим то,<br />
            <em className="italic text-brand font-light">что никто</em>
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '1.5px #141312' }}
            >
              не видит.
            </span>
          </h1>
          <p
            className="max-w-[460px] font-sans text-[16px] leading-[1.55] text-ink/70 mt-4"
            data-anim
            style={{ ['--delay' as any]: '140ms' }}
          >
            Спецсервис по чистке вентканалов, вытяжек и зонтов для общепита, офисов и складов.
            Видеоинспекция перед работой, фото-отчёт и протокол СЭС после.
          </p>
        </div>

        {/* PROMO — 4 × 2 brand */}
        <div
          className="col-span-12 lg:col-span-4 row-span-2 bg-brand text-bg rounded-[28px] p-6 flex flex-col justify-between relative overflow-hidden min-h-[220px]"
          data-anim
          style={{ ['--delay' as any]: '120ms' }}
        >
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.14em] text-bg/70">
            <span className="w-[18px] h-px bg-accent inline-block" />
            02 / о сервисе
          </div>
          <h3 className="font-display font-light text-[30px] leading-[1.05] tracking-[-.015em] max-w-[14ch] relative z-10">
            Видеоинспекция <em className="italic text-accent">до.</em>
            <br />
            Протокол СЭС <em className="italic text-accent">после.</em>
          </h3>
          <div className="flex gap-3 font-mono text-[10.5px] uppercase tracking-[.14em] text-bg/70 relative z-10">
            <span>● ночные смены</span>
            <span>● без остановки бизнеса</span>
          </div>
          {/* Decorative pattern */}
          <svg
            className="absolute -right-[30px] -bottom-[30px] w-[180px] h-[180px] opacity-[.18] pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden="true"
          >
            <g stroke="#c8ff3e" strokeWidth="1.5">
              <circle cx="100" cy="100" r="92" />
              <circle cx="100" cy="100" r="62" />
              <circle cx="100" cy="100" r="34" />
              <path d="M100 8 V192 M8 100 H192 M30 30 L170 170 M170 30 L30 170" />
            </g>
          </svg>
        </div>

        {/* STAT 1 — 2 × 1 ink, lime numeral */}
        <div
          className="col-span-6 lg:col-span-2 bg-ink text-bg rounded-[22px] p-[18px] flex flex-col justify-between min-h-[96px]"
          data-anim
          style={{ ['--delay' as any]: '180ms' }}
        >
          <div className="font-display font-light text-[56px] leading-[.85] tracking-[-.04em] text-accent">
            200<span className="text-[24px]">+</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[.14em] text-bg/60">
            объектов / 5 лет работы
          </div>
        </div>

        {/* STAT 2 — 2 × 1 lime tile, ink numeral */}
        <div
          className="col-span-6 lg:col-span-2 bg-accent rounded-[22px] p-[18px] flex flex-col justify-between min-h-[96px]"
          data-anim
          style={{ ['--delay' as any]: '220ms' }}
        >
          <div className="font-display font-light text-[56px] leading-[.85] tracking-[-.04em] text-ink">
            4–6<span className="text-[24px]">дн</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[.14em] text-ink/65">
            средний срок под ключ
          </div>
        </div>

        {/* MINI CALC — 7 × 2 surface */}
        <div
          className="col-span-12 lg:col-span-7 row-span-2 bg-surface rounded-[28px] px-6 py-6 min-h-[220px]"
          data-anim
          style={{ ['--delay' as any]: '260ms' }}
        >
          <MiniCalculator />
        </div>

        {/* LICENSES — 5 × 1 surface */}
        <div
          className="col-span-12 lg:col-span-5 bg-surface rounded-[22px] p-[18px] flex flex-col justify-between min-h-[96px]"
          data-anim
          style={{ ['--delay' as any]: '300ms' }}
        >
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.14em] text-ink/55">
            <span className="w-[18px] h-px bg-brand inline-block" />
            03 / лицензии
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'МЧС', tail: ' · противопожарные' },
              { label: 'СЭС', tail: ' · протокол' },
              { label: 'СРО', tail: '' },
              { label: '', tail: 'ГОСТ Р 53300' },
            ].map((l, i) => (
              <span
                key={i}
                className="font-mono text-[11px] tracking-[.04em] px-2.5 py-1.5 border border-line-2 rounded-lg text-ink"
                style={{ borderColor: 'rgba(20,19,18,.14)' }}
              >
                {l.label && <strong className="text-brand font-medium">{l.label}</strong>}
                {l.tail}
              </span>
            ))}
          </div>
        </div>

        {/* STATUS — 5 × 1 ink */}
        <div
          className="col-span-12 lg:col-span-5 bg-ink text-bg rounded-[28px] p-[22px] flex flex-col justify-between min-h-[96px] relative overflow-hidden"
          data-anim
          style={{ ['--delay' as any]: '340ms' }}
        >
          <div className="inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[.14em] text-bg/65">
            <span
              className="w-[7px] h-[7px] rounded-full bg-accent animate-live-pulse"
              style={{ boxShadow: '0 0 0 4px rgba(200,255,62,.18)' }}
              aria-hidden="true"
            />
            есть свободная бригада · завтра
          </div>
          <div className="font-display font-light italic text-[19px] leading-[1.2] tracking-[-.005em]">
            Ответ на заявку — от 30 мин,<br />
            осмотр перед началом работ — <em className="not-italic text-accent">бесплатно</em>
          </div>
          <div className="flex justify-between items-end gap-3 font-mono text-[10.5px] uppercase tracking-[.14em] text-bg/55">
            <span>пн–вс · 24/7</span>
            <a href="#contact" className="btn-now-cta">
              оставить заявку
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
