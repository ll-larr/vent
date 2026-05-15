'use client';

import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import useCounter from '@/lib/useCounter';
import { REVIEWS, type Review } from '@/data/reviews';

function Counter({ to, suffix }: { to: number; suffix?: string }) {
  const { value, ref } = useCounter(to, 1100);
  return (
    <span className="font-display font-light tracking-[-.03em] leading-[.9] text-brand">
      <span ref={ref as React.Ref<HTMLSpanElement>}>{value}</span>
      {suffix}
    </span>
  );
}

function emphasizeQuote(quote: string, emphasized?: string): React.ReactNode {
  if (!emphasized) return quote;
  const idx = quote.indexOf(emphasized);
  if (idx === -1) return quote;
  return (
    <>
      {quote.slice(0, idx)}
      <em className="italic text-brand not-italic [font-style:italic]">{emphasized}</em>
      {quote.slice(idx + emphasized.length)}
    </>
  );
}

function emphasizeQuoteDark(quote: string, emphasized?: string): React.ReactNode {
  if (!emphasized) return quote;
  const idx = quote.indexOf(emphasized);
  if (idx === -1) return quote;
  return (
    <>
      {quote.slice(0, idx)}
      <em className="italic text-accent not-italic [font-style:italic]">{emphasized}</em>
      {quote.slice(idx + emphasized.length)}
    </>
  );
}

function PrimaryQuoteTile({ r }: { r: Review }) {
  return (
    <article
      className="col-span-12 lg:col-span-7 row-span-2 bg-bg rounded-[28px] p-7 lg:p-[30px_32px] flex flex-col justify-between min-h-[320px]"
      style={{ border: '1px solid rgba(20,19,18,.14)' }}
      data-anim
    >
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-3.5">
          {r.industryLabel}
        </div>
        <p className="font-display font-light text-[clamp(22px,2.4vw,34px)] leading-[1.25] tracking-[-.01em] m-0">
          <span className="font-display italic text-brand">«</span>
          {emphasizeQuote(r.quote, r.emphasized)}
          <span className="font-display italic text-brand">»</span>
        </p>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
        <span className="w-[42px] h-[42px] rounded-full bg-brand text-bg grid place-items-center font-display text-[17px]">
          {r.initials}
        </span>
        <div>
          <div className="font-display text-[18px]">{r.name}</div>
          <div className="font-mono text-[10.5px] uppercase tracking-[.12em] text-ink/50 mt-0.5">
            {r.roleLine}
          </div>
        </div>
        <div className="font-mono text-[10.5px] uppercase tracking-[.12em] text-brand whitespace-nowrap">
          {r.metric}
        </div>
      </div>
    </article>
  );
}

function SecondaryQuoteTile({ r, dark }: { r: Review; dark?: boolean }) {
  const bgClass = dark ? 'bg-ink text-bg' : 'bg-bg';
  const borderStyle = dark
    ? { borderColor: 'transparent' }
    : { border: '1px solid rgba(20,19,18,.14)' };
  const metaTextClass = dark ? 'text-accent' : 'text-brand';
  const qmarkClass = dark ? 'text-accent' : 'text-brand';
  const roleTextClass = dark ? 'text-bg/55' : 'text-ink/50';
  const avaBgClass = dark ? 'bg-accent text-ink' : 'bg-brand text-bg';
  return (
    <article
      className={`col-span-12 lg:col-span-6 ${bgClass} rounded-[28px] p-7 flex flex-col justify-between min-h-[250px]`}
      style={borderStyle as React.CSSProperties}
      data-anim
    >
      <div>
        <div className={`font-mono text-[11px] uppercase tracking-[.18em] ${metaTextClass} mb-2.5`}>
          {r.industryLabel}
        </div>
        <p
          className={`font-display font-light text-[22px] leading-[1.25] tracking-[-.01em] m-0 ${
            dark ? 'text-bg' : ''
          }`}
        >
          <span className={`font-display italic ${qmarkClass}`}>«</span>
          {dark ? emphasizeQuoteDark(r.quote, r.emphasized) : emphasizeQuote(r.quote, r.emphasized)}
          <span className={`font-display italic ${qmarkClass}`}>»</span>
        </p>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
        <span className={`w-[42px] h-[42px] rounded-full grid place-items-center font-display text-[17px] ${avaBgClass}`}>
          {r.initials}
        </span>
        <div>
          <div className={`font-display text-[18px] ${dark ? 'text-bg' : ''}`}>{r.name}</div>
          <div className={`font-mono text-[10.5px] uppercase tracking-[.12em] mt-0.5 ${roleTextClass}`}>
            {r.roleLine}
          </div>
        </div>
        <div className={`font-mono text-[10.5px] uppercase tracking-[.12em] whitespace-nowrap ${metaTextClass}`}>
          {r.metric}
        </div>
      </div>
    </article>
  );
}

const LICENSES = ['МЧС', 'СЭС', 'СРО', 'ГОСТ Р 53300-2009'];

export function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="trust" className="px-4">
      <div className="max-w-[1320px] mx-auto px-4 pt-14 pb-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-3">
        <div data-anim>
          <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-2.5">06 / отзывы и доверие</div>
          <h2 className="font-display font-light text-[clamp(40px,5.2vw,76px)] leading-[.98] tracking-[-.025em]">
            Говорят <em className="italic text-brand">заказчики.</em>
          </h2>
        </div>
        <p className="font-sans text-[14px] text-ink/60 max-w-[38ch] lg:text-right leading-[1.5]" data-anim>
          Три реальных истории из общепита, склада и пищевого производства.
        </p>
      </div>

      <div className="max-w-[1320px] mx-auto grid grid-cols-12 gap-3" style={{ gridAutoRows: 'minmax(96px, auto)' }}>
        {/* Primary quote */}
        <PrimaryQuoteTile r={REVIEWS[0]} />

        {/* trust-num (5x1 surface) — 200+ objects + 5 years */}
        <div
          className="col-span-12 lg:col-span-5 bg-surface rounded-[22px] p-[22px] min-h-[140px] grid grid-cols-2 gap-[18px] items-end"
          data-anim
        >
          <div className="flex flex-col gap-1.5">
            <span className="font-display font-light text-[clamp(48px,6vw,78px)] tracking-[-.03em] leading-[.9] text-brand">
              <Counter to={200} suffix="+" />
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-ink/55">объектов</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-display font-light text-[clamp(48px,6vw,78px)] tracking-[-.03em] leading-[.9] text-brand">
              <Counter to={5} />
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-ink/55">лет опыта</span>
          </div>
        </div>

        {/* trust-lic (5x1 ink) */}
        <div
          className="col-span-12 lg:col-span-5 bg-ink text-bg rounded-[22px] p-[20px_22px] min-h-[140px] flex flex-col justify-between"
          data-anim
          style={{ ['--delay' as any]: '120ms' }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[.18em] text-accent mb-3.5">лицензии и допуски</div>
          <div className="flex flex-wrap gap-1.5">
            {LICENSES.map((l) => (
              <span
                key={l}
                className="font-mono text-[11px] tracking-[.06em] px-2.5 py-1.5 rounded-lg text-bg"
                style={{ border: '1px solid rgba(246,243,236,.18)' }}
              >
                {l}
              </span>
            ))}
          </div>
          <p className="text-[13px] text-bg/65 leading-[1.55] max-w-[36ch] mt-3">
            Работаем по протоколу СЭС и нормативам МЧС. Документы — при заключении договора.
          </p>
        </div>

        {/* Secondary quotes */}
        <SecondaryQuoteTile r={REVIEWS[1]} />
        <SecondaryQuoteTile r={REVIEWS[2]} dark />
      </div>
    </section>
  );
}

export default TrustSection;
