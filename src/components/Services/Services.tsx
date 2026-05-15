'use client';

import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';
import { ArrowRight } from '@/lib/icons';

export function Services() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="services" className="px-4">
      {/* Section head */}
      <div className="max-w-[1320px] mx-auto px-4 pt-14 pb-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-3">
        <div data-anim>
          <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-2.5">02 / услуги</div>
          <h2 className="font-display font-light text-[clamp(40px,5.2vw,76px)] leading-[.98] tracking-[-.025em]">
            Что мы <em className="italic text-brand">делаем.</em>
          </h2>
        </div>
        <p className="font-sans text-[14px] text-ink/60 max-w-[38ch] lg:text-right leading-[1.5]" data-anim>
          Четыре направления плюс диагностика. Каждое — отдельный протокол СЭС и фото-отчёт.
        </p>
      </div>

      {/* Bento */}
      <div
        className="max-w-[1320px] mx-auto grid grid-cols-12 gap-3"
        style={{ gridAutoRows: 'minmax(96px, auto)' }}
      >
        {/* svc-feature — Жир — 7 × 3 brand */}
        <article
          className="col-span-12 lg:col-span-7 row-span-3 bg-brand text-bg rounded-[28px] p-7 lg:p-[28px_28px_28px_28px] flex flex-col justify-between min-h-[320px] lg:min-h-[380px] relative overflow-hidden"
          data-anim
        >
          {/* Radial accent glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: '-20%',
              bottom: '-50%',
              width: '70%',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(200,255,62,.18), transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="flex gap-3 items-baseline font-mono text-[11px] uppercase tracking-[.14em] text-bg/70 mb-4">
              <span className="text-bg/85">01 / жир</span>
              <span>· для кухонь общепита</span>
            </div>
            <h3 className="font-display font-light text-[clamp(36px,4.6vw,64px)] leading-none tracking-[-.025em] max-w-[18ch]">
              Чистка <em className="italic text-accent">от жира</em>
              <br />
              до металла.
            </h3>
            <p className="text-[15px] text-bg/[.78] max-w-[46ch] leading-[1.55] mt-3.5">
              Снимаем зонты, разбираем воздуховоды, удаляем жировой нагар по протоколу СЭС.
              После — дезинфекция и видеоотчёт по каждой ветке.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {[
                'труба Ø ≤ 600 — 300 ₽/пог.м',
                'труба Ø > 600 — 400 ₽/пог.м',
                'зонт — 1 000 ₽/шт',
              ].map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10.5px] uppercase tracking-[.12em] px-2.5 py-1.5 border border-bg/[.22] rounded-full text-bg/85"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between gap-4 relative">
            <div className="font-display font-light text-[52px] leading-none tracking-[-.03em] text-accent inline-flex items-baseline gap-2 whitespace-nowrap">
              300
              <span className="font-mono text-[11px] uppercase tracking-[.14em] text-bg/70 self-end pb-1.5">
                ₽ / пог.м
              </span>
            </div>
            <a
              href="#calculator"
              data-calc-jump="grease"
              className="group inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-accent text-ink text-[14px] font-medium hover:bg-bg transition-colors"
            >
              Рассчитать
              <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>
        </article>

        {/* svc-card — Пыль — 5 × 2 surface */}
        <ServiceCard
          idx="02"
          meta="100–220 ₽/пог.м"
          title={<>Чистка <em className="italic text-brand">от пыли</em></>}
          desc="Для офисов и складов. Восстанавливаем воздухообмен, убираем аллергены и микробиологию."
          price="от 100 ₽/пог.м"
          calcJump="dust"
          delay={120}
        />

        {/* svc-photo — 5 × 1 ink with image */}
        <article
          className="col-span-12 sm:col-span-6 lg:col-span-5 rounded-[22px] bg-ink min-h-[210px] overflow-hidden relative text-bg flex items-end p-5"
          data-anim
          style={{ ['--delay' as any]: '200ms' }}
        >
          <Image
            src="/images/service-ventilation.jpg"
            alt="Вентиляционные каналы и короба в производственном помещении"
            fill
            sizes="(max-width: 1024px) 100vw, 35vw"
            className="object-cover opacity-[.58]"
            style={{ filter: 'grayscale(.2) contrast(1.05)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(20,19,18,0) 0%, rgba(20,19,18,.85) 90%)' }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col gap-2.5 font-mono text-[10.5px] uppercase tracking-[.14em] leading-[1.4] text-bg/70">
            <em className="not-italic font-display font-normal text-[22px] leading-[1.05] tracking-[-.01em] text-bg normal-case [letter-spacing:-.01em]">
              Каналы, короба, колодцы.
            </em>
            <span>работаем со всеми типами систем</span>
          </div>
        </article>

        {/* svc-card — Зонты — 5 × 2 surface */}
        <ServiceCard
          idx="03"
          meta="1 000 ₽/шт"
          title={<>Вытяжки <em className="italic text-brand">и зонты</em></>}
          desc="Профессиональная мойка зонтов пищеблока — с разбором, ванной и сборкой. Не повреждаем металл."
          price="1 000 ₽/шт"
          calcJump="hood"
          delay={240}
        />

        {/* svc-included — 7 × 2 ink */}
        <article
          className="col-span-12 lg:col-span-7 row-span-2 bg-ink text-bg rounded-[28px] p-6 lg:p-[24px_26px] min-h-[280px] relative overflow-hidden"
          data-anim
          style={{ ['--delay' as any]: '280ms' }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              right: '-40px',
              bottom: '-40px',
              width: '220px',
              height: '220px',
              background: 'radial-gradient(closest-side, rgba(200,255,62,.10), transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 relative z-10 h-full">
            <div className="flex flex-col justify-between gap-3.5">
              <div>
                <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.14em] text-bg/60">
                  <span className="w-[18px] h-px bg-accent inline-block" />
                  входит в любую услугу
                </div>
                <h3 className="font-display font-light text-[clamp(28px,3.2vw,42px)] leading-[1.02] tracking-[-.02em] mt-3.5 text-bg">
                  Без <em className="italic text-accent">скрытых</em>
                  <br />
                  доплат и сюрпризов.
                </h3>
                <p className="text-[14px] text-bg/65 leading-[1.55] max-w-[32ch] mt-3">
                  Цена фиксируется после видеоосмотра и не меняется. Документы и гарантия — по договору.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <a
                  href="#calculator"
                  className="group inline-flex items-center gap-2.5 px-4 py-3 bg-accent text-ink rounded-full text-[14px] font-medium hover:bg-bg transition-colors"
                >
                  Рассчитать
                  <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a
                  href="#process"
                  className="inline-flex items-center gap-2 px-4 py-3 bg-transparent text-bg border border-bg/[.22] rounded-full text-[14px] hover:bg-bg/[.08] hover:border-accent hover:text-accent transition-colors"
                >
                  Как это идёт
                </a>
              </div>
            </div>
            <ul className="flex flex-col justify-between gap-0 h-full">
              {[
                { n: '01', t: 'Видеоинспекция до и после работ', note: 'эндоскоп' },
                { n: '02', t: 'Фото-отчёт по каждой ветке', note: 'после работ' },
                { n: '03', t: 'Протокол СЭС и акт выполненных работ', note: 'договор' },
                { n: '04', t: 'Ночные смены — без остановки бизнеса', note: '0 дней простоя' },
                { n: '05', t: 'Гарантия 12 мес на выполненные работы', note: 'гост 53300' },
              ].map((row, i) => (
                <li
                  key={row.n}
                  className={`grid grid-cols-[32px_1fr_auto] gap-3 py-3 items-baseline flex-1 ${
                    i === 0 ? 'pt-0.5' : 'border-t border-bg/[.1]'
                  }`}
                >
                  <span className="font-mono text-[10.5px] tracking-[.14em] text-accent">{row.n}</span>
                  <span className="text-[14px] text-bg leading-[1.3]">{row.t}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[.14em] text-bg/40 whitespace-nowrap">
                    {row.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* svc-cards-row — 3 flat tiles */}
        <div className="col-span-12 grid grid-cols-12 gap-3">
          <FlatCard
            idx="04 / дезинфекция"
            price="30 ₽/пог.м"
            title="Дезинфекция воздуховодов"
            desc="Противомикробная обработка после чистки. Для производства, ресторанов и медицинских объектов."
            delay={340}
          />
          <FlatCard
            idx="05 / диагностика"
            price="4 500 ₽"
            title="Видеоинспекция каналов"
            desc="Видеоконтроль каналов до и после чистки. Отчёт с фото, метражом и состоянием каждой ветки."
            delay={380}
          />
          <FlatCard
            idx="06 / договор"
            price="от 6 мес"
            title="Регулярное обслуживание"
            desc="График раз в 3–6 месяцев под нормативы СЭС. Фиксированная цена, протокол к каждому визиту."
            dark
            delay={420}
          />
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  idx,
  meta,
  title,
  desc,
  price,
  calcJump,
  delay,
}: {
  idx: string;
  meta: string;
  title: React.ReactNode;
  desc: string;
  price: string;
  calcJump: string;
  delay: number;
}) {
  return (
    <article
      className="col-span-12 sm:col-span-6 lg:col-span-5 row-span-2 bg-surface rounded-[28px] p-6 flex flex-col justify-between min-h-[250px] relative overflow-hidden"
      data-anim
      style={{ ['--delay' as any]: `${delay}ms` }}
    >
      <div className="flex items-baseline justify-between gap-2.5">
        <div className="font-display font-light text-[80px] leading-[.8] tracking-[-.04em] text-ink/10 select-none">
          {idx}
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[.14em] text-ink/55">{meta}</div>
      </div>
      <div className="mt-2">
        <h3 className="font-display font-normal text-[26px] leading-[1.05] tracking-[-.012em]">
          {title}
        </h3>
        <p className="text-[14px] text-ink/65 leading-[1.55] mt-2">{desc}</p>
      </div>
      <div className="flex justify-between items-end gap-2.5 mt-3.5">
        <div className="font-display font-normal text-[22px] text-brand">{price}</div>
        <a
          href="#calculator"
          data-calc-jump={calcJump}
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.14em] text-ink px-3.5 py-2.5 rounded-full bg-stone border border-transparent hover:bg-ink hover:text-accent transition-all"
        >
          в расчёт
          <ArrowRight size={12} strokeWidth={2.2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function FlatCard({
  idx,
  price,
  title,
  desc,
  dark,
  delay,
}: {
  idx: string;
  price: string;
  title: string;
  desc: string;
  dark?: boolean;
  delay: number;
}) {
  return (
    <article
      className={`col-span-12 sm:col-span-6 lg:col-span-4 rounded-[22px] p-5 min-h-[160px] flex flex-col justify-between ${
        dark ? 'bg-ink text-bg' : 'bg-surface'
      }`}
      data-anim
      style={{ ['--delay' as any]: `${delay}ms` }}
    >
      <div className="flex justify-between items-baseline">
        <div
          className={`font-mono text-[11px] uppercase tracking-[.14em] ${
            dark ? 'text-bg/55' : 'text-ink/50'
          }`}
        >
          {idx}
        </div>
        <div
          className={`font-mono text-[11px] uppercase tracking-[.14em] ${
            dark ? 'text-accent' : 'text-brand'
          }`}
        >
          {price}
        </div>
      </div>
      <div>
        <h4 className={`font-display font-normal text-[22px] leading-[1.1] tracking-[-.012em] mt-3 ${dark ? 'text-bg' : ''}`}>
          {title}
        </h4>
        <p
          className={`text-[13.5px] leading-[1.5] mt-1.5 ${
            dark ? 'text-bg/65' : 'text-ink/60'
          }`}
        >
          {desc}
        </p>
      </div>
    </article>
  );
}

export default Services;
