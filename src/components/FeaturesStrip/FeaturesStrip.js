'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import './style.scss';

const items = [
  { icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, title: 'Быстрый выезд', text: 'Мастер приедет для оценки в день обращения' },
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, title: 'Гарантия качества', text: 'Акт выполненных работ для Роспотребнадзора' },
  { icon: <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>, title: 'Новейшие технологии', text: 'Современное оборудование и препараты' },
];

export default function FeaturesStrip() {
  const ref = useRef(null);
  useScrollAnim(ref);
  return (
    <section className="fstrip" ref={ref}>
      <div className="fstrip__inner">
        {items.map(({icon,title,text}) => (
          <div className="fstrip__item" key={title} data-anim>
            <div className="fstrip__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{icon}</svg></div>
            <h3>{title}</h3><p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
