'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import useCounter from '@/lib/useCounter';

interface StatItem {
  numericValue: number;
  suffix: string;
  label: string;
  note?: string;
}

const stats: StatItem[] = [
  { numericValue: 500, suffix: '+',   label: 'Объектов почищено',       note: 'Рестораны, офисы, заводы' },
  { numericValue: 8,   suffix: ' лет',label: 'На рынке',                note: 'Профессиональный опыт' },
  { numericValue: 98,  suffix: '%',   label: 'Клиентов продлевают договор', note: 'Ежегодное обслуживание' },
  { numericValue: 24,  suffix: 'ч',   label: 'Срок выезда специалиста', note: 'В рабочие дни' },
];

function CounterStat({ item }: { item: StatItem }) {
  const { value, ref } = useCounter(item.numericValue, 1800);
  return (
    <div className="flex flex-col items-center lg:items-start">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="text-[clamp(2.8rem,5vw,4rem)] font-bold tracking-[-0.04em] text-white leading-none mb-3 tabular-nums"
      >
        {value}{item.suffix}
      </div>
      <p className="text-white/80 font-medium text-sm mb-1">{item.label}</p>
      {item.note && (
        <p className="text-white/35 text-xs">{item.note}</p>
      )}
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 bg-brand relative overflow-hidden">
      {/* Decorative background circles */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-content mx-auto relative z-10">
        {/* Section label */}
        <p className="text-center text-xs font-bold uppercase tracking-[0.12em] text-white/30 mb-14" data-anim>
          Цифры говорят сами за себя
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((s, i) => (
            <div key={s.label} data-anim className={['text-center lg:text-left', i > 0 ? 'lg:pl-12' : ''].join(' ')}>
              <CounterStat item={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
