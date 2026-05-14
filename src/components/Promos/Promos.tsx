'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { ArrowRight } from '@/lib/icons';

interface Promo {
  badge: string;
  title: string;
  desc: string;
  cta: string;
  gradient: string;
  pattern: string;
  light: boolean;
}

const promos: Promo[] = [
  {
    badge: 'Бесплатно',
    title: 'Аудит\nвентиляции',
    desc: 'Выезд специалиста и оценка системы бесплатно при заключении договора',
    cta: 'Вызвать специалиста',
    gradient: 'linear-gradient(135deg, #0f3d22 0%, #1e5c32 100%)',
    pattern: 'radial-gradient(ellipse at 80% 20%, rgba(34,197,94,0.25) 0%, transparent 60%)',
    light: false,
  },
  {
    badge: '−10%',
    title: 'Приведи\nдруга',
    desc: 'Скидка 10% вам и другу при оформлении заказа по рекомендации',
    cta: 'Узнать подробнее',
    gradient: 'linear-gradient(135deg, #eef5ef 0%, #d1fae5 100%)',
    pattern: 'radial-gradient(ellipse at 20% 80%, rgba(30,92,50,0.12) 0%, transparent 60%)',
    light: true,
  },
  {
    badge: 'Выгодно',
    title: 'Пакет\n«Общепит»',
    desc: 'Комплексная чистка вентиляции и вытяжек по выгодной цене для ресторанов',
    cta: 'Рассчитать цену',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    pattern: 'radial-gradient(ellipse at 80% 80%, rgba(30,92,50,0.1) 0%, transparent 60%)',
    light: true,
  },
  {
    badge: '−20%',
    title: 'Объёмный\nзаказ',
    desc: 'Скидка до 20% при объёме работ от 500 пог.м — для крупных объектов',
    cta: 'Оставить заявку',
    gradient: 'linear-gradient(135deg, #163d24 0%, #2d7d46 100%)',
    pattern: 'radial-gradient(ellipse at 10% 90%, rgba(134,239,172,0.2) 0%, transparent 60%)',
    light: false,
  },
];

export default function Promos() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="promos" ref={ref} className="py-24 px-4 sm:px-6 bg-stone">
      <div className="max-w-content mx-auto">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand mb-3 block">
            Специальные предложения
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-ink">
            Акции
          </h2>
        </div>

        {/* Promo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {promos.map((p) => (
            <div
              key={p.title}
              data-anim
              className="group relative rounded-xl2 overflow-hidden flex flex-col min-h-[260px] hover:-translate-y-1 hover:shadow-lifted transition-all duration-300 cursor-pointer"
              style={{ background: p.gradient }}
            >
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: p.pattern }}
                aria-hidden="true"
              />

              {/* Geometric accent — top right circle */}
              <div
                className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-10 pointer-events-none"
                style={{ background: p.light ? '#1e5c32' : 'white' }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col flex-1 p-7">
                {/* Badge */}
                <div className="mb-4">
                  <span
                    className={[
                      'inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full',
                      p.light
                        ? 'bg-brand/10 text-brand'
                        : 'bg-white/15 text-white',
                    ].join(' ')}
                  >
                    {p.badge}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={[
                    'font-display text-2xl font-semibold leading-[1.1] mb-3 whitespace-pre-line',
                    p.light ? 'text-ink' : 'text-white',
                  ].join(' ')}
                >
                  {p.title}
                </h3>

                {/* Description */}
                <p
                  className={[
                    'text-sm leading-relaxed flex-1',
                    p.light ? 'text-brand-muted' : 'text-white/60',
                  ].join(' ')}
                >
                  {p.desc}
                </p>

                {/* CTA */}
                <a
                  href="#contacts"
                  className={[
                    'mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5',
                    p.light ? 'text-brand' : 'text-white',
                  ].join(' ')}
                >
                  {p.cta}
                  <ArrowRight size={14} strokeWidth={2} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
