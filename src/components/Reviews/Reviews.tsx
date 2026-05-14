'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { Star } from '@/lib/icons';

const reviews = [
  {
    name: 'Алексей Петров',
    role: 'Управляющий',
    company: 'Ресторан «Якорь»',
    text: 'Работаем с Clean Vent уже 3 года. Всегда приезжают вовремя, качество на высоте. После чистки вытяжки запах жира в зале пропал полностью.',
    rating: 5,
    initials: 'АП',
  },
  {
    name: 'Марина Соколова',
    role: 'Технический директор',
    company: 'Офисный центр «Меридиан»',
    text: 'Обслуживают наш бизнес-центр ежеквартально. Документы, акты — всё в порядке. Санэпидстанция претензий не имеет.',
    rating: 5,
    initials: 'МС',
  },
  {
    name: 'Дмитрий Козлов',
    role: 'Начальник АХО',
    company: 'Столовая завода «Прогресс»',
    text: 'Большой объём работ выполнили за выходные, не мешая производству. Цена честная, всё как договорились.',
    rating: 5,
    initials: 'ДК',
  },
];

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="reviews" ref={ref} className="py-24 px-4 sm:px-6 bg-bg">
      <div className="max-w-content mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14" data-anim>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand mb-3 block">
              Отзывы клиентов
            </span>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-ink leading-[1.1]">
              Нам доверяют
            </h2>
          </div>
          <div className="flex items-center gap-2 text-brand-muted text-sm shrink-0">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} strokeWidth={0} className="fill-brand text-brand" />
              ))}
            </div>
            <span>5.0 — средняя оценка</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              data-anim
              className="group relative bg-white rounded-xl2 p-7 border border-black/[0.05] shadow-card hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Large quote mark */}
              <div
                className="font-display text-[4.5rem] leading-none text-brand/10 select-none absolute top-4 right-6 pointer-events-none"
                aria-hidden="true"
              >
                "
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} strokeWidth={0} className="fill-brand text-brand" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-ink/75 text-[0.9rem] leading-relaxed flex-1 mb-6">
                {r.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-brand-light/80">
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand text-xs font-bold shrink-0">
                  {r.initials}
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm leading-tight">{r.name}</p>
                  <p className="text-brand-muted text-xs mt-0.5">{r.role} · {r.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
