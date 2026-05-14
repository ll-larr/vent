'use client';
import { useRef, useEffect } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import './style.scss';

const stats = [
  { num: '10', suffix: '+', label: 'Лет на рынке' },
  { num: '2000', suffix: '+', label: 'Выполненных проектов' },
  { num: '24/7', suffix: '', label: 'Работаем без выходных' },
  { num: '100', suffix: '%', label: 'Документальное оформление' },
];

export default function Stats() {
  const ref = useRef(null);
  useScrollAnim(ref);
  return (
    <section className="stats" ref={ref}>
      <div className="stats__inner">
        {stats.map(s => (
          <div className="stats__item" key={s.label} data-anim>
            <div className="stats__num">{s.num}{s.suffix && <span className="stats__accent">{s.suffix}</span>}</div>
            <div className="stats__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
