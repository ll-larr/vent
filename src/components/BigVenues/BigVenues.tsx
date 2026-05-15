'use client';

import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';
import { VENUES, type Venue } from '@/data/venues';

function VenTile({ v, span }: { v: Venue; span: 'sq' | 'wide' }) {
  // sq = grid-column span 3 on desktop / 6 on tablet
  // wide = grid-column span 6 on desktop (for the second row)
  const colClass = span === 'sq'
    ? 'col-span-12 sm:col-span-6 lg:col-span-3 row-span-2'
    : 'col-span-12 sm:col-span-6';
  const minH = span === 'sq' ? 'min-h-[260px]' : 'min-h-[240px]';

  return (
    <article
      className={`${colClass} ${minH} group relative bg-ink text-bg rounded-[28px] overflow-hidden cursor-pointer`}
      data-anim
    >
      <Image
        src={v.src}
        alt={v.alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-[.88] transition-[filter,opacity,transform] duration-[800ms] group-hover:opacity-100 group-hover:[filter:grayscale(0)_contrast(1)]"
        style={{ filter: 'grayscale(.3) contrast(1.06)' }}
      />

      {/* Date tag */}
      <span
        className="absolute top-3 left-3 z-[2] px-2.5 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-[.14em] text-ink bg-bg/[.92] transition-[opacity,transform] duration-300 group-hover:opacity-0 group-hover:-translate-y-1.5"
      >
        {v.date}
      </span>

      {/* Static info — visible by default */}
      <div
        className="absolute inset-x-0 bottom-0 px-4.5 py-4 z-[1] transition-[opacity,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:opacity-0 group-hover:translate-y-5"
        style={{
          background: 'linear-gradient(180deg, rgba(20,19,18,0) 0%, rgba(20,19,18,.9) 90%)',
        }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[.14em] text-bg/70">{v.category}</div>
        <h4 className="font-display font-normal text-[22px] tracking-[-.01em] mt-1">{v.name}</h4>
      </div>

      {/* Hover popup — full details */}
      <div
        className="absolute inset-0 z-[3] px-[18px] pt-[18px] pb-4 flex flex-col gap-2.5 opacity-0 translate-y-1.5 pointer-events-none transition-[opacity,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,19,18,.78) 0%, rgba(20,19,18,.92) 60%, rgba(20,19,18,.96) 100%)',
          backdropFilter: 'blur(10px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(10px) saturate(1.1)',
        }}
      >
        <div className="flex justify-between items-baseline gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[.14em] text-accent">
            {v.categoryShort}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[.12em] text-bg/55">
            {v.dateShort}
          </span>
        </div>
        <h5 className="font-display font-normal text-[20px] leading-[1.05] tracking-[-.012em] text-bg">
          {v.name}
        </h5>
        <div className="flex flex-col gap-[3px]">
          <span className="font-mono text-[9.5px] uppercase tracking-[.14em] text-bg/50">
            задачи
          </span>
          <span className="text-[12.5px] leading-[1.45] text-bg/85">{v.tasks}</span>
        </div>
        <div className="flex flex-col gap-[3px]">
          <span className="font-mono text-[9.5px] uppercase tracking-[.14em] text-bg/50">
            срок · результат
          </span>
          <span className="text-[12.5px] leading-[1.45] text-bg/85">{v.timeline}</span>
        </div>
        <div className="mt-1 pt-2 border-t border-bg/[.14]">
          <p className="font-display font-light italic text-[13px] leading-[1.35] text-bg/[.92] m-0">
            <span className="font-display italic text-accent text-[18px] leading-none align-[-2px] mr-1">«</span>
            {v.quote}
            <span className="font-display italic text-accent text-[18px] leading-none align-[-2px] ml-0.5">»</span>
          </p>
        </div>
      </div>
    </article>
  );
}

export function BigVenues() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="venues" className="px-4">
      <div className="max-w-[1320px] mx-auto px-4 pt-14 pb-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-3">
        <div data-anim>
          <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-2.5">04 / объекты</div>
          <h2 className="font-display font-light text-[clamp(40px,5.2vw,76px)] leading-[.98] tracking-[-.025em]">
            Среди наших — <em className="italic text-brand">крупные.</em>
          </h2>
        </div>
        <p className="font-sans text-[14px] text-ink/60 max-w-[38ch] lg:text-right leading-[1.5]" data-anim>
          Стадионы, мясопереработка, фабрики, ледовые арены. Работа в окнах между матчами и сменами.
        </p>
      </div>

      <div className="max-w-[1320px] mx-auto grid grid-cols-12 gap-3" style={{ gridAutoRows: 'minmax(96px, auto)' }}>
        {/* Intro tile — 6 × 2 cream dashed */}
        <div
          className="col-span-12 lg:col-span-6 row-span-2 bg-bg rounded-[28px] px-6 py-7 lg:px-7 lg:py-7 min-h-[260px] flex flex-col justify-between gap-3"
          style={{ border: '1px dashed rgba(20,19,18,.14)' }}
          data-anim
        >
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[.14em] text-brand mb-3.5">04.A / география</div>
            <h3 className="font-display font-light text-[clamp(28px,3.5vw,48px)] leading-none tracking-[-.02em]">
              200+ <em className="italic text-brand">объектов</em>
              <br />
              по&nbsp;48 регионам.
            </h3>
          </div>
          <p className="text-[14px] text-ink/65 max-w-[42ch] leading-[1.55]">
            От ресторана на 80 м² до пищевого комбината на 22 000 м². Ниже — четыре, о которых нам разрешили говорить.
          </p>
          <div className="flex gap-3.5 font-mono text-[11px] uppercase tracking-[.14em] text-ink/50">
            <span>
              <b className="text-brand font-medium">48</b> регионов
            </span>
            <span>
              <b className="text-brand font-medium">14</b> городов
            </span>
            <span>5 лет</span>
          </div>
        </div>

        {/* Square tiles */}
        <VenTile v={VENUES[0]} span="sq" />
        <VenTile v={VENUES[1]} span="sq" />

        {/* Second row — two wide tiles */}
        <div className="col-span-12 grid grid-cols-12 gap-3">
          <VenTile v={VENUES[2]} span="wide" />
          <VenTile v={VENUES[3]} span="wide" />
        </div>
      </div>
    </section>
  );
}

export default BigVenues;
