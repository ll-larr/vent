'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import './style.scss';

const items = [
  { icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>, title: 'Работа по договору', text: 'Полный пакет документов и акт для Роспотребнадзора' },
  { icon: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>, title: 'Бесплатная диагностика', text: 'При оформлении заявки — бесплатная проверка оборудования' },
  { icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>, title: 'Лучшие цены', text: 'Специальные условия при долгосрочном обслуживании' },
  { icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>, title: 'Оперативность', text: 'Выезд мастера для оценки в день обращения' },
  { icon: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></>, title: 'Любые объекты', text: 'Рестораны, офисы, ТЦ, жилые дома и промышленные объекты' },
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, title: 'Сертифицированные средства', text: 'Только проверенные и сертифицированные препараты' },
];

export default function Advantages() {
  const ref = useRef(null);
  useScrollAnim(ref);
  return (
    <section className="advs" id="advantages">
      <div className="section-header">
        <span className="section-label advs__label">Почему мы</span>
        <h2 className="advs__h2">Преимущества работы с Clean Vent</h2>
        <p className="advs__sub">Мы делаем всё, чтобы воздух в вашем помещении был чистым и безопасным</p>
      </div>
      <div className="advs__grid" ref={ref}>
        {items.map(i => (
          <div className="advs__card" key={i.title} data-anim>
            <div className="advs__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{i.icon}</svg></div>
            <h3>{i.title}</h3><p>{i.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
