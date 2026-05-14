'use client';
import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';

const certs = [
  'Лицензия СРО на проведение работ по чистке вентиляции',
  'Допуск к работам в пищевых производствах',
  'Сертификат соответствия ГОСТ Р',
  'Аккредитованная лаборатория для анализов ОМЧ и БГКП',
];

const clients = [
  { src: '/images/trust-gazprom.jpg', alt: 'Газпром' },
  { src: '/images/trust-miratorg.jpg', alt: 'Мираторг' },
  { src: '/images/trust-multon.jpg', alt: 'Мултон' },
  { src: '/images/trust-ska.jpg', alt: 'СКА' },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="about" ref={ref} className="py-24 px-6 bg-bg">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-anim>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
              О компании
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-gray-900 mb-6">
              8 лет чистим воздух<br />для бизнеса
            </h2>
            <p className="text-brand-muted leading-relaxed mb-8 text-lg">
              Специализируемся на чистке вентиляционных систем для предприятий общественного питания,
              офисных и производственных помещений. Работаем по договору с актом выполненных работ.
            </p>
            <ul className="space-y-3">
              {certs.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-brand font-bold mt-0.5 shrink-0">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div data-anim>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-muted mb-6">
              Нам доверяют
            </p>
            <div className="grid grid-cols-2 gap-4">
              {clients.map((c) => (
                <div
                  key={c.alt}
                  className="bg-white rounded-card p-6 flex items-center justify-center border border-black/[0.05] aspect-video relative"
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
