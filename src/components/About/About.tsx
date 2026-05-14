'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { BadgeCheck } from '@/lib/icons';

const certs = [
  'Лицензия СРО на проведение работ по чистке вентиляции',
  'Допуск к работам в пищевых производствах',
  'Сертификат соответствия ГОСТ Р',
  'Аккредитованная лаборатория для анализов ОМЧ и БГКП',
];

const clients = [
  { name: 'Газпром',   industry: 'Энергетика'  },
  { name: 'Мираторг',  industry: 'Общепит'     },
  { name: 'Мултон',    industry: 'Производство' },
  { name: 'СКА',       industry: 'Спорт'       },
  { name: 'Росатом',   industry: 'Промышленность' },
  { name: 'Fix Price',  industry: 'Ритейл'      },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="about" ref={ref} className="py-24 px-4 sm:px-6 bg-bg">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* Left: company info + certs */}
          <div data-anim>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand mb-3 block">
              О компании
            </span>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-ink leading-[1.1] mb-6">
              8 лет чистим воздух<br />
              <span className="italic text-brand-muted font-normal">для бизнеса</span>
            </h2>
            <p className="text-brand-muted leading-relaxed mb-10 text-[1rem]">
              Специализируемся на чистке вентиляционных систем для предприятий общественного
              питания, офисных и производственных помещений. Работаем по договору с актом
              выполненных работ.
            </p>

            {/* Certs */}
            <ul className="space-y-3">
              {certs.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm text-ink/75">
                  <BadgeCheck size={17} strokeWidth={1.5} className="text-brand shrink-0 mt-0.5" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: trust client badges */}
          <div data-anim>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-muted mb-6">
              Нам доверяют
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {clients.map((c) => (
                <div
                  key={c.name}
                  className="group bg-white border border-black/[0.06] rounded-xl p-4 flex flex-col gap-1 hover:border-brand/25 hover:shadow-card transition-all duration-200"
                >
                  <span className="font-semibold text-ink text-sm">{c.name}</span>
                  <span className="text-brand-muted text-xs">{c.industry}</span>
                </div>
              ))}
            </div>

            {/* Additional trust note */}
            <p className="mt-6 text-brand-muted text-xs leading-relaxed">
              Работаем с крупными корпорациями, сетевым общепитом и малым бизнесом.
              Полный пакет документов для любого заказчика.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
