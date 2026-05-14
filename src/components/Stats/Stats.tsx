'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';

const stats = [
  { value: '500+', label: 'Объектов почищено' },
  { value: '8 лет', label: 'На рынке' },
  { value: '98%', label: 'Клиентов возвращаются' },
  { value: '24ч', label: 'Выезд специалиста' },
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} className="py-24 px-6 bg-brand">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.label} data-anim className="text-center">
              <div className="text-5xl md:text-6xl font-bold tracking-[-0.03em] text-white mb-3">
                {s.value}
              </div>
              <div className="text-white/60 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
