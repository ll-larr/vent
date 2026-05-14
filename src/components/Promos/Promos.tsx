'use client';
import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';

const promos = [
  {
    img: '/images/promo-audit.jpg',
    title: 'Бесплатный аудит',
    desc: 'Выезд специалиста и оценка системы вентиляции бесплатно при заключении договора',
  },
  {
    img: '/images/promo-friend.jpg',
    title: 'Приведи друга',
    desc: 'Скидка 10% вам и другу при оформлении заказа по рекомендации',
  },
  {
    img: '/images/promo-restaurant.jpg',
    title: 'Пакет «Общепит»',
    desc: 'Комплексная чистка вентиляции и вытяжек по выгодной цене для ресторанов',
  },
  {
    img: '/images/promo-volume.jpg',
    title: 'Объёмный заказ',
    desc: 'Скидка до 20% при объёме работ от 500 пог.м',
  },
];

export default function Promos() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="promos" ref={ref} className="py-24 px-6 bg-brand-light">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Специальные предложения
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-gray-900">
            Акции
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promos.map((p) => (
            <div
              key={p.title}
              data-anim
              className="bg-white rounded-card overflow-hidden border border-black/[0.05] shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
