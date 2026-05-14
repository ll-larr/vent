'use client';
import { useRef } from 'react';
import Link from 'next/link';
import useScrollAnim from '@/lib/useScrollAnim';
import './style.scss';

const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4"/></svg>;

const services = [
  { img: '/images/service-ventilation.jpg', title: 'Очистка вентиляции', text: 'Регулярная чистка воздуховодов создает здоровый микроклимат. Удаляем пыль, жировые отложения и загрязнения.' },
  { img: '/images/service-reservoirs.jpg', title: 'Зачистка резервуаров', text: 'Очистка и дезинфекция резервуаров от нефтепродуктов и загрязнений. Работаем с ёмкостями любого объёма.' },
  { img: '/images/service-disinfection.jpg', title: 'Дезинфекция систем', text: 'Предотвращаем распространение вирусов и инфекций. Используем сертифицированные препараты.' },
  { img: '/images/service-diagnostics.jpg', title: 'Видеодиагностика', text: 'Обследование воздуховодов с помощью видеокамер для точной оценки состояния.' },
];

export default function HomeServices() {
  const ref = useRef(null);
  useScrollAnim(ref);
  return (
    <section className="hsvc" id="services">
      <div className="section-header">
        <span className="section-label">Услуги</span>
        <h2>Комплексное обслуживание систем</h2>
        <p>Профессиональная чистка, дезинфекция и диагностика систем любой сложности</p>
      </div>
      <div className="hsvc__grid" ref={ref}>
        {services.map(s => (
          <div className="hsvc__card" key={s.title} data-anim>
            <div className="hsvc__card-img"><img src={s.img} alt={s.title} loading="lazy" /></div>
            <div className="hsvc__card-body">
              <h3>{s.title}</h3><p>{s.text}</p>
              <Link href="/services" className="hsvc__link">Подробнее <Arrow /></Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
