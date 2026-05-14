'use client';
import { useRef } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero/PageHero';
import useScrollAnim from '@/lib/useScrollAnim';
import './style.scss';

const clients = [
  { img: '/images/trust-ska.jpg', name: 'СКА Арена' },
  { img: '/images/trust-gazprom.jpg', name: 'Газпром Арена' },
  { img: '/images/trust-miratorg.jpg', name: 'Мираторг' },
  { img: '/images/trust-multon.jpg', name: 'Мултон Партнерс' },
];

export default function TrustPage() {
  const ref = useRef(null);
  useScrollAnim(ref);
  return (
    <main>
      <PageHero>
        <div className="trust-hero">
          <div className="trust-hero__text">
            <h1>Качество, которому<br/><span className="accent-line">доверяют</span></h1>
            <p>Очистка вентиляции, вытяжек, дымоходов и резервуаров на объектах, где важны безопасность и стабильная работа инженерных систем.</p>
          </div>
          <div className="trust-hero__highlights">
            {[['Санитарные требования','Соблюдаем все нормы, документация для Роспотребнадзора',<path key="a" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>],
              ['Предсказуемый результат','Аккуратная работа, согласованные сроки и подтверждённое качество',<><circle key="b" cx="12" cy="12" r="10"/><polyline key="c" points="12 6 12 12 16 14"/></>],
              ['Профессиональное оборудование','Специализированная техника и эффективные технологии очистки',<><path key="d" d="M12 2L2 7l10 5 10-5-10-5z"/><path key="e" d="M2 17l10 5 10-5"/><path key="f" d="M2 12l10 5 10-5"/></>],
            ].map(([t,d,icon])=>(
              <div className="trust-hl" key={t}>
                <div className="trust-hl__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">{icon}</svg></div>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </PageHero>
      <section className="trust-clients" ref={ref}>
        <div className="trust-clients__inner">
          <h2 className="trust-clients__h2">Наши сотрудники уже обслужили:</h2>
          <div className="trust-clients__grid">
            {clients.map(c=><div className="trust-card" key={c.name} data-anim><div className="trust-card__img"><img src={c.img} alt={c.name} loading="lazy"/></div><div className="trust-card__name">{c.name}</div></div>)}
          </div>
          <p className="trust-clients__text">Нас выбирают крупные производители и импортёры, которым важны надёжность подрядчика, соблюдение санитарных и технических требований, а также стабильная работа инженерных систем.</p>
        </div>
      </section>
      <section className="trust-certs">
        <div className="trust-certs__inner">
          <h2>Подтверждённая квалификация</h2>
          <p className="trust-certs__sub">Сертификаты компании и дипломы специалистов</p>
          <div className="trust-certs__grid">
            {[1,2,3,4,5,6].map(i=><div className="cert-card" key={i} data-anim><div className="cert-card__ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><circle cx="12" cy="15" r="2"/></svg><span>Сертификат {i}</span></div></div>)}
          </div>
        </div>
      </section>
      <section className="trust-cta">
        <h2 data-anim>Доверяете нам?<br/>Свяжитесь для бесплатной консультации</h2>
        <p data-anim>Расскажем о подходе, подберём решение под ваш объект</p>
        <div data-anim className="trust-cta__actions"><a href="tel:+74951234567" className="btn-primary-dark">Позвонить</a><Link href="/contacts" className="btn-primary">Оставить заявку</Link></div>
      </section>
    </main>
  );
}
