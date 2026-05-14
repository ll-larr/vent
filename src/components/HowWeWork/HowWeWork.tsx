'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { Phone, MapPin, FileText, Wrench, CheckCircle2 } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react';

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    num: '01',
    icon: Phone,
    title: 'Заявка',
    desc: 'Оставляете заявку на сайте или звоните — перезваниваем в течение 30 минут',
  },
  {
    num: '02',
    icon: MapPin,
    title: 'Осмотр',
    desc: 'Выезжаем на объект бесплатно, оцениваем объём и рассчитываем стоимость',
  },
  {
    num: '03',
    icon: FileText,
    title: 'Договор',
    desc: 'Заключаем договор с фиксированной ценой и сроками. Без скрытых платежей',
  },
  {
    num: '04',
    icon: Wrench,
    title: 'Работа',
    desc: 'Выполняем чистку в удобное время. Видеофиксация до и после работ',
  },
  {
    num: '05',
    icon: CheckCircle2,
    title: 'Акт',
    desc: 'Подписываем акт выполненных работ и предоставляем гарантию',
  },
];

export default function HowWeWork() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref, { staggerMs: 100 });

  return (
    <section id="how-we-work" ref={ref} className="py-24 px-4 sm:px-6 bg-stone">
      <div className="max-w-content mx-auto">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand mb-3 block">
            Процесс
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-ink">
            Как мы работаем
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop connector line */}
          <div
            className="hidden lg:block absolute top-[2.75rem] left-0 right-0 h-px bg-brand/15 mx-[10%]"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.num} data-anim className="relative flex flex-col items-center lg:items-start text-center lg:text-left">
                  {/* Icon circle — sits on the connector line */}
                  <div className="relative z-10 flex items-center justify-center w-[3.25rem] h-[3.25rem] rounded-full bg-brand-light border-2 border-brand-light ring-4 ring-bg mb-5 transition-all duration-300 group-hover:border-brand">
                    <Icon size={20} strokeWidth={1.5} className="text-brand" />
                  </div>

                  {/* Step number */}
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-brand/40 mb-2 font-mono">
                    {s.num}
                  </span>

                  <h3 className="font-semibold text-ink text-[1.05rem] mb-2">{s.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{s.desc}</p>

                  {/* Mobile connector */}
                  {i < steps.length - 1 && (
                    <div className="lg:hidden w-px h-6 bg-brand/20 mt-5" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
