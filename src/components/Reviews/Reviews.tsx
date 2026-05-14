'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';

const reviews = [
  {
    name: 'Алексей Петров',
    company: 'Ресторан «Якорь»',
    text: 'Работаем с Clean Vent уже 3 года. Всегда приезжают вовремя, качество на высоте. После чистки вытяжки запах жира в зале пропал полностью.',
    rating: 5,
  },
  {
    name: 'Марина Соколова',
    company: 'Офисный центр «Меридиан»',
    text: 'Обслуживают наш бизнес-центр ежеквартально. Документы, акты — всё в порядке. Санэпидстанция претензий не имеет.',
    rating: 5,
  },
  {
    name: 'Дмитрий Козлов',
    company: 'Столовая завода «Прогресс»',
    text: 'Большой объём работ выполнили за выходные, не мешая производству. Цена честная, всё как договорились.',
    rating: 5,
  },
];

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="reviews" ref={ref} className="py-24 px-6 bg-brand-light">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Отзывы
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-gray-900">
            Нам доверяют
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              data-anim
              className="bg-white rounded-card p-6 border border-black/[0.05] shadow-sm flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-brand text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="pt-4 border-t border-brand-light/50">
                <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                <p className="text-brand-muted text-xs mt-0.5">{r.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
