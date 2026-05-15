'use client';

import { useEffect, useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { ClipboardList, Eye, Sparkles, FileCheck } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react';

type Step = {
  n: string;
  dur: string;
  Icon: LucideIcon;
  title: string;
  shortDesc: string;
  popupHead: string;
  popupItems: string[];
  outLabel: string;
  outValue: string;
  alt: boolean;
};

const STEPS: Step[] = [
  {
    n: '01 / 1–2 ч',
    dur: '1–2 часа',
    Icon: ClipboardList,
    title: 'Заявка',
    shortDesc: 'Связываетесь — обсуждаем объём и согласуем выезд инженера на осмотр.',
    popupHead: 'Как это идёт',
    popupItems: [
      'Звонок, форма на сайте или telegram — выбираете удобный канал.',
      'Короткий опрос по объекту: тип, площадь, желаемые даты.',
      'Ориентировочный расчёт и бронь времени осмотра.',
    ],
    outLabel: 'на выходе',
    outValue: 'Дата выезда и вилка цены',
    alt: false,
  },
  {
    n: '02 / 1 день',
    dur: '1–2 часа на объекте',
    Icon: Eye,
    title: 'Осмотр',
    shortDesc: 'Инженер выезжает с эндоскопом и тепловизором. Видеодиагностика, точная цена.',
    popupHead: 'Что делает инженер',
    popupItems: [
      'Видеоинспекция каналов эндоскопом Ø 4–12 мм — фиксируем состояние каждой ветки.',
      'Замер метража и диаметра, осмотр зонтов и вентустановок.',
      'Составляем фиксированный счёт без скрытых доплат.',
    ],
    outLabel: 'на выходе',
    outValue: 'Счёт + фото до · фикс цены',
    alt: true,
  },
  {
    n: '03 / ночь',
    dur: '1–6 ночных смен',
    Icon: Sparkles,
    title: 'Чистка',
    shortDesc: 'Работаем ночью или в нерабочее время. Бизнес не останавливается, гости не замечают.',
    popupHead: 'Как работаем',
    popupItems: [
      'Бригада 2–4 чел., привозим оборудование, щётки и средства.',
      'Чистим каналы вращающимися щётками, при необходимости разбираем зонты и узлы вентустановок.',
      'Собираем обратно, вывозим отходы. К открытию объекта всё работает.',
    ],
    outLabel: 'на выходе',
    outValue: 'Чистые каналы · 0 дней простоя',
    alt: false,
  },
  {
    n: '04 / +24 ч',
    dur: 'в течение 24 ч',
    Icon: FileCheck,
    title: 'Протокол',
    shortDesc: 'Фото-отчёт, видеоконтроль и протокол СЭС. Храните для проверок — пригодится.',
    popupHead: 'Что вы получаете',
    popupItems: [
      'Фотографии «до/после» по каждой ветке.',
      'Осмотр внутри каналов после чистки.',
      'Протокол СЭС с подписами и акт выполненных работ.',
    ],
    outLabel: 'для чего',
    outValue: 'Под проверки СЭС · МЧС · HACCP',
    alt: true,
  },
];

function StepTile({ s, isFirst, autoDemo }: { s: Step; isFirst: boolean; autoDemo: boolean }) {
  const dataHintProps = isFirst && autoDemo ? { 'data-hint': 'open' as const } : {};
  const bgClass = s.alt ? 'bg-ink text-bg' : 'bg-surface';
  const nClass = s.alt ? 'text-accent' : 'text-brand';
  const pClass = s.alt ? 'text-bg/70' : 'text-ink/65';
  const glyphClass = s.alt
    ? 'border-bg/20 text-bg'
    : 'border-line-2 text-ink';

  return (
    <article
      className={`pr-step ${bgClass} group col-span-12 sm:col-span-6 lg:col-span-3 rounded-[28px] p-[22px] min-h-[290px] flex flex-col gap-3.5 relative overflow-hidden cursor-pointer transition-transform duration-[350ms] ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5`}
      {...dataHintProps}
    >
      {/* Static content — fades out on hover/hint */}
      <div className="contents [&>*]:transition-opacity [&>*]:duration-[250ms] group-hover:[&>*]:opacity-0 group-data-[hint=open]:[&>*]:opacity-0">
        <div className={`font-mono text-[11px] uppercase tracking-[.14em] ${nClass}`}>{s.n}</div>
        <div
          className={`w-9 h-9 rounded-[10px] border grid place-items-center ${glyphClass}`}
          style={{ borderColor: s.alt ? 'rgba(246,243,236,.2)' : 'rgba(20,19,18,.14)' }}
        >
          <s.Icon size={20} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h4 className="font-display font-normal text-[28px] tracking-[-.012em] leading-[1.05]">
          {s.title}
        </h4>
        <p className={`text-[13.5px] leading-[1.55] ${pClass}`}>{s.shortDesc}</p>
      </div>

      {/* Popup — slides in on hover or data-hint */}
      <div className="absolute inset-0 z-[3] p-[18px] flex flex-col gap-2.5 bg-ink text-bg opacity-0 translate-y-2 pointer-events-none transition-[opacity,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-data-[hint=open]:opacity-100 group-data-[hint=open]:translate-y-0 group-data-[hint=open]:pointer-events-auto overflow-y-auto">
        <div className="flex justify-between items-baseline gap-2.5 font-mono text-[10px] uppercase tracking-[.14em] flex-shrink-0">
          <span className="text-accent">{s.n.split(' / ')[0]} / {s.title.toLowerCase()}</span>
          <span className="text-bg/55">{s.dur}</span>
        </div>
        <h5 className="font-display font-normal text-[18px] leading-[1.1] tracking-[-.012em] flex-shrink-0">
          {s.popupHead}
        </h5>
        <ul className="flex flex-col gap-1.5 list-none p-0 m-0 flex-shrink">
          {s.popupItems.map((item, i) => (
            <li key={i} className="text-[12px] leading-[1.35] text-bg/[.86] flex gap-2 items-baseline">
              <span
                className="w-[5px] h-[5px] rounded-full bg-accent flex-shrink-0 relative top-1"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2 border-t border-bg/[.14] flex flex-col gap-0.5 flex-shrink-0">
          <span className="font-mono text-[9.5px] uppercase tracking-[.14em] text-bg/50">{s.outLabel}</span>
          <span className="font-display font-light italic text-[13.5px] leading-[1.3] text-accent">{s.outValue}</span>
        </div>
      </div>
    </article>
  );
}

export function HowWeWork() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  // Auto-demo first card 500ms after section visible, hold 1500ms, then close.
  // Cancel if user already hovered any card.
  const sectionRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  const firstStepRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const first = section.querySelector('.pr-step') as HTMLElement | null;
    firstStepRef.current = first;

    const cancelAuto = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.pr-step') && first) {
        first.removeAttribute('data-hint');
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            io.unobserve(en.target);
            setTimeout(() => {
              if (!first) return;
              const anyHovered = section.querySelector('.pr-step:hover');
              if (anyHovered) return;
              first.setAttribute('data-hint', 'open');
              setTimeout(() => first.removeAttribute('data-hint'), 1500);
            }, 500);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(section);
    section.addEventListener('mouseover', cancelAuto);

    return () => {
      io.disconnect();
      section.removeEventListener('mouseover', cancelAuto);
    };
  }, []);

  return (
    <section ref={ref} id="process" className="px-4">
      <div className="max-w-[1320px] mx-auto px-4 pt-14 pb-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-3">
        <div data-anim>
          <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-2.5">05 / процесс</div>
          <h2 className="font-display font-light text-[clamp(40px,5.2vw,76px)] leading-[.98] tracking-[-.025em]">
            Как мы <em className="italic text-brand">работаем.</em>
          </h2>
        </div>
        <p className="font-sans text-[14px] text-ink/60 max-w-[38ch] lg:text-right leading-[1.5]" data-anim>
          Четыре этапа. От заявки до протокола СЭС — обычно 3–4 дня.
        </p>
      </div>

      <div ref={sectionRef} className="max-w-[1320px] mx-auto grid grid-cols-12 gap-3">
        {STEPS.map((s, i) => (
          <StepTile key={s.n} s={s} isFirst={i === 0} autoDemo={true} />
        ))}
      </div>
    </section>
  );
}

export default HowWeWork;
