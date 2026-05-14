'use client';
import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';

const items = [
  { before: '/images/compare-dust-before.jpg', after: '/images/compare-dust-after.jpg', label: 'Чистка от пыли', type: 'Вентиляционный канал' },
  { before: '/images/compare-grease1-before.jpg', after: '/images/compare-grease1-after.jpg', label: 'Чистка от жира', type: 'Кухонная вытяжка' },
  { before: '/images/compare-grease2-before.jpg', after: '/images/compare-grease2-after.jpg', label: 'Жировые отложения', type: 'Воздуховод общепита' },
  { before: '/images/compare-reservoir-before.jpg', after: '/images/compare-reservoir-after.jpg', label: 'Резервуар', type: 'Водяной бак' },
];

export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="portfolio" ref={ref} className="py-24 px-6 bg-bg">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Наши работы
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-gray-900 mb-4">
            До и после
          </h2>
          <p className="text-brand-muted text-lg">Реальные объекты наших клиентов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div
              key={item.label}
              data-anim
              className="bg-white rounded-card overflow-hidden border border-black/[0.05] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-[4/3]">
                  <Image src={item.before} alt={`${item.label} — до`} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    До
                  </span>
                </div>
                <div className="relative aspect-[4/3]">
                  <Image src={item.after} alt={`${item.label} — после`} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-brand text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    После
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-brand-muted text-xs mt-0.5">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
