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
        {/* svc-feature — Pricelist — 7 × 3 brand */}
        <article
          className="col-span-12 lg:col-span-7 row-span-3 text-bg rounded-[28px] p-7 lg:p-[26px_28px] flex flex-col justify-between gap-[22px] min-h-[320px] lg:min-h-[380px] relative overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(200,255,62,.04), transparent 30%), #1e5c32',
          }}
          data-anim
        >
          {/* Radial accent glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: '-25%',
              bottom: '-55%',
              width: '60%',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(200,255,62,.12), transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative">
            {/* Head: meta left + updated right */}
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-[18px]">
              <div className="flex gap-3 items-baseline font-mono text-[11px] uppercase tracking-[.14em] text-bg/70">
                <span className="text-bg/85">00 / прайс</span>
                <span>· все услуги одним документом</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[.14em] text-bg/55">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  style={{ boxShadow: '0 0 0 3px rgba(200,255,62,.18)' }}
                  aria-hidden="true"
                />
                обновлено 05.2026
              </div>
            </div>

            <h3 className="font-display font-light text-[clamp(32px,3.8vw,52px)] leading-none tracking-[-.025em] max-w-[14ch]">
              Полный прайс <em className="italic text-accent">на чистку</em>
              <br />
              и обслуживание.
            </h3>
            <p className="text-[15px] text-bg/[.78] max-w-[46ch] leading-[1.55] mt-3.5">
              14 категорий работ, ставки за погонный метр, штуку и выезд, надбавки за высоту и
              ночные смены — в одном PDF, который можно отправить тендерному отделу.
            </p>

            {/* Preview rows */}
            <div className="grid grid-cols-1 mt-[22px] border-t border-bg/[.12]">
              {[
                { idx: '01', name: 'Чистка от жира', sub: 'труба Ø ≤ 600 · общепит', pre: 'от ', val: '300', unit: '₽/пог.м' },
                { idx: '02', name: 'Чистка от пыли', sub: 'офисы, склады, БЦ', pre: 'от ', val: '100', unit: '₽/пог.м' },
                { idx: '03', name: 'Зонты и вытяжки', sub: 'с разбором и сборкой', pre: 'от ', val: '2 000', unit: '₽/шт' },
                { idx: '04', name: 'Дезинфекция', sub: 'после чистки, по СЭС', pre: 'от ', val: '40', unit: '₽/м²' },
              ].map((r) => (
                <div
                  key={r.idx}
                  className="grid grid-cols-[24px_1fr_auto] items-baseline gap-3.5 py-[11px] border-b border-dashed border-bg/[.12]"
                >
                  <span className="font-mono text-[10.5px] tracking-[.14em] text-bg/[.42]">{r.idx}</span>
                  <span className="font-display font-normal text-[18px] tracking-[-.005em] text-bg">
                    {r.name}
                    <small className="block font-sans font-normal text-[12px] text-bg/55 tracking-normal mt-0.5">
                      {r.sub}
                    </small>
                  </span>
                  <span className="font-mono text-[13px] text-bg/95 whitespace-nowrap tracking-[.01em] text-right">
                    {r.pre}
                    <b className="font-display font-semibold text-[18px] tracking-[-.01em] text-accent mr-0.5">
                      {r.val}
                    </b>
                    {r.unit}
                  </span>
                </div>
              ))}
              {/* +10 more */}
              <div className="grid grid-cols-[24px_1fr_auto] items-baseline gap-3.5 pt-3.5 font-mono text-[11px] uppercase tracking-[.14em] text-bg/50">
                <span>+10</span>
                <span>монтаж, ремонт, паспорт ВТЗ, аварийный выезд…</span>
                <span className="text-right">в PDF</span>
              </div>
            </div>
          </div>

          {/* Foot: doc meta + download CTA */}
          <div className="relative flex items-end justify-between gap-[18px] flex-wrap">
            <div className="flex items-center gap-3">
              <div
                className="relative w-11 h-14 rounded-md grid place-items-center font-mono text-[9px] tracking-[.14em] text-accent flex-shrink-0"
                style={{ background: 'rgba(246,243,236,.06)', border: '1px solid rgba(246,243,236,.18)' }}
                aria-hidden="true"
              >
                PDF
                <span
                  className="absolute top-0 right-0 w-3.5 h-3.5 rounded-bl-[3px]"
                  style={{ background: 'linear-gradient(225deg, rgba(246,243,236,.18) 50%, transparent 50%)' }}
                />
              </div>
              <div className="font-mono text-[10.5px] uppercase tracking-[.12em] text-bg/55 leading-[1.5]">
                <b className="block text-bg font-medium tracking-[.14em]">Прайс_Vent_05·2026</b>
                6 страниц · 412 КБ
              </div>
            </div>
            <a href="/files/vent-pricelist-2026.pdf" download className="pl-cta">
              скачать прайс-лист
              <span className="pl-ext">PDF</span>
              <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
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
          meta="от 2 000 ₽/шт"
          title={<>Вытяжки <em className="italic text-brand">и зонты</em></>}
          desc="Профессиональная мойка зонтов пищеблока — с разбором, ванной и сборкой. Не повреждаем металл."
          price="от 2 000 ₽/шт"
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
                <a href="#calculator" className="btn-lime">
                  Рассчитать
                  <ArrowRight size={14} strokeWidth={2} className="arrow" aria-hidden="true" />
                </a>
                <a href="#process" className="btn-ghost-on-dark">
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
