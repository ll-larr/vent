'use client';
import { useRef, useState } from 'react';
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
  const [hovered, setHovered] = useState<string | null>(null);
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
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
          onMouseLeave={() => setHovered(null)}
        >
          {services.map((s) => {
            const Icon = s.icon;
            // A card is "active" (green) when hovered, OR when nothing is hovered and it's featured
            const isActive = hovered ? hovered === s.title : !!s.featured;
            // Dim non-hovered cards when something is hovered
            const isDimmed = hovered !== null && hovered !== s.title;

            return (
              <div
                key={s.title}
                data-anim
                onMouseEnter={() => setHovered(s.title)}
                className={[
                  'group relative flex flex-col rounded-xl2 p-7 cursor-default',
                  'transition-all duration-300 ease-out',
                  isActive
                    ? '-translate-y-1.5 shadow-float bg-brand border-brand'
                    : 'bg-white border border-black/[0.05] shadow-card',
                  isDimmed ? 'opacity-60 scale-[0.98]' : '',
                ].join(' ')}
              >
                {/* Icon */}
                <div
                  className={[
                    'w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-all duration-300',
                    isActive ? 'bg-white/15 scale-110' : 'bg-brand-light',
                  ].join(' ')}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className={isActive ? 'text-white' : 'text-brand'}
                  />
                </div>

                <h3
                  className={[
                    'font-semibold text-[1.05rem] mb-2.5 transition-colors duration-300',
                    isActive ? 'text-white' : 'text-ink',
                  ].join(' ')}
                >
                  {s.title}
                </h3>

                <p
                  className={[
                    'text-sm leading-relaxed flex-1 transition-colors duration-300',
                    isActive ? 'text-white/65' : 'text-brand-muted',
                  ].join(' ')}
                >
                  {s.description}
                </p>

                {/* Price + arrow */}
                <div
                  className={[
                    'mt-6 pt-5 flex items-center justify-between border-t transition-colors duration-300',
                    isActive ? 'border-white/15' : 'border-brand-light',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'text-sm font-semibold transition-colors duration-300',
                      isActive ? 'text-brand-accent' : 'text-brand',
                    ].join(' ')}
                  >
                    {s.price}
                  </span>
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className={[
                      'transition-all duration-300',
                      isActive ? 'text-white/50 translate-x-1' : 'text-brand-muted',
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
