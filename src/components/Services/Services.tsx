'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { Wind, Fan, Layers, Container, ArrowRight } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  featured?: boolean;
}

const services: Service[] = [
  {
    icon: Wind,
    title: 'Чистка вентиляции',
    description:
      'Очистка вентиляционных каналов от пыли и жировых отложений. Восстанавливаем проектную пропускную способность системы.',
    price: 'от 90 ₽/пог.м',
    featured: true,
  },
  {
    icon: Fan,
    title: 'Чистка вытяжек',
    description:
      'Комплексная чистка вытяжных зонтов, крыльчаток вентиляторов и гидрофильтров. Обязательно для общепита по СанПиН.',
    price: 'от 1 800 ₽/шт',
  },
  {
    icon: Layers,
    title: 'Трубы и воздуховоды',
    description:
      'Очистка труб различного диаметра от пыли, жира и загрязнений. Механический и химический методы.',
    price: 'от 90 ₽/пог.м',
  },
  {
    icon: Container,
    title: 'Резервуары',
    description:
      'Чистка и дезинфекция резервуаров для воды. Лабораторный контроль качества с выдачей акта.',
    price: 'от 350 ₽/м³',
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="services" ref={ref} className="py-24 px-4 sm:px-6 bg-bg">
      <div className="max-w-content mx-auto">

        {/* Section header */}
        <div className="max-w-xl mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand mb-3 block">
            Что мы делаем
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-ink leading-[1.1] mb-4">
            Услуги чистки<br />
            <span className="text-brand-muted font-normal italic">вентиляционных систем</span>
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed">
            Полный комплекс работ для любого типа объекта
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                data-anim
                className={[
                  'group relative flex flex-col rounded-xl2 p-7 transition-all duration-300',
                  'hover:-translate-y-1 hover:shadow-lifted',
                  s.featured
                    ? 'bg-brand text-white shadow-lifted'
                    : 'bg-white border border-black/[0.05] shadow-card',
                ].join(' ')}
              >
                {/* Icon */}
                <div
                  className={[
                    'w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110',
                    s.featured ? 'bg-white/15' : 'bg-brand-light',
                  ].join(' ')}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className={s.featured ? 'text-white' : 'text-brand'}
                  />
                </div>

                <h3
                  className={[
                    'font-semibold text-[1.05rem] mb-2.5',
                    s.featured ? 'text-white' : 'text-ink',
                  ].join(' ')}
                >
                  {s.title}
                </h3>

                <p
                  className={[
                    'text-sm leading-relaxed flex-1',
                    s.featured ? 'text-white/65' : 'text-brand-muted',
                  ].join(' ')}
                >
                  {s.description}
                </p>

                {/* Price + arrow */}
                <div
                  className={[
                    'mt-6 pt-5 flex items-center justify-between border-t',
                    s.featured ? 'border-white/15' : 'border-brand-light',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'text-sm font-semibold',
                      s.featured ? 'text-brand-accent' : 'text-brand',
                    ].join(' ')}
                  >
                    {s.price}
                  </span>
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className={[
                      'transition-transform group-hover:translate-x-1',
                      s.featured ? 'text-white/40' : 'text-brand-muted',
                    ].join(' ')}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
