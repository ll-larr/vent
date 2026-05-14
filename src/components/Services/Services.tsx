'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';

const services = [
  {
    icon: '🌀',
    title: 'Чистка вентиляции',
    description:
      'Очистка вентиляционных каналов от пыли и жировых отложений. Восстанавливаем проектную пропускную способность системы.',
    price: 'от 90 ₽/пог.м',
    featured: true,
  },
  {
    icon: '🔲',
    title: 'Чистка вытяжек',
    description:
      'Комплексная чистка вытяжных зонтов, крыльчаток вентиляторов и гидрофильтров. Обязательно для общепита по СанПиН.',
    price: 'от 1 800 ₽/шт',
    featured: false,
  },
  {
    icon: '〰️',
    title: 'Трубы и воздуховоды',
    description:
      'Очистка труб различного диаметра от пыли, жира и загрязнений. Механический и химический методы под любой тип загрязнения.',
    price: 'от 90 ₽/пог.м',
    featured: false,
  },
  {
    icon: '🪣',
    title: 'Резервуары',
    description:
      'Чистка и дезинфекция резервуаров для воды. Лабораторный контроль качества с выдачей акта.',
    price: 'от 350 ₽/м³',
    featured: false,
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="services" ref={ref} className="py-24 px-6 bg-bg">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Что мы делаем
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-gray-900 mb-4">
            Услуги
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed">
            Полный комплекс работ по чистке вентиляционных систем любой сложности
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              data-anim
              className="bg-white rounded-card p-6 border border-black/[0.05] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{s.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-5 flex-1">
                {s.description}
              </p>
              <div className="pt-4 border-t border-brand-light">
                <span className="text-brand font-semibold text-sm">{s.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
