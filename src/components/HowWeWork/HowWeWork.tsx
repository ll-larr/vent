'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';

const steps = [
  {
    num: '01',
    title: 'Заявка',
    desc: 'Оставляете заявку на сайте или звоните — перезваниваем в течение 30 минут в рабочее время',
  },
  {
    num: '02',
    title: 'Осмотр',
    desc: 'Выезжаем на объект бесплатно. Оцениваем объём работ и рассчитываем финальную стоимость',
  },
  {
    num: '03',
    title: 'Договор',
    desc: 'Заключаем договор с фиксированной ценой и чёткими сроками. Никаких скрытых платежей',
  },
  {
    num: '04',
    title: 'Работа',
    desc: 'Выполняем чистку в удобное для вас время. Видеофиксация процесса до и после работ',
  },
  {
    num: '05',
    title: 'Акт',
    desc: 'Подписываем акт выполненных работ. Предоставляем гарантию на все выполненные услуги',
  },
];

export default function HowWeWork() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="how-we-work" ref={ref} className="py-24 px-6 bg-brand-light">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Процесс
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-gray-900">
            Как мы работаем
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((s, i) => (
            <div key={s.num} data-anim className="relative">
              {/* Connector line between steps (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px bg-brand/20 -translate-x-1/2 z-0" />
              )}
              <div className="relative z-10">
                <div className="text-4xl font-bold text-brand/25 mb-3 font-mono">{s.num}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
