'use client';
import { useRef } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero/PageHero';
import useScrollAnim from '@/lib/useScrollAnim';
import './style.scss';

const promos = [
  { img:'/images/promo-audit.jpg', badge:'Бесплатно', color:'#1db954', title:'Бесплатный аудит', desc:'При заказе очистки — бесплатное обследование вентиляционной системы с составлением отчёта.' },
  { img:'/images/promo-restaurant.jpg', badge:'−10%', color:'#0071e3', title:'Комплекс «Общепит» —10%', desc:'Комплексная чистка вентиляции для ресторанов, кафе и столовых.' },
  { img:'/images/promo-volume.jpg', badge:'до −10%', color:'#0071e3', title:'Скидка от объёма', desc:'От 500 пог.м — 5%. От 1000 пог.м — 10%.' },
  { img:'/images/promo-friend.jpg', badge:'−5%', color:'#0071e3', title:'Приведи друга — 5%', desc:'Скидка 5% на следующую чистку за каждого нового клиента.' },
];

export default function PromosPage() {
  const ref = useRef(null);
  useScrollAnim(ref);
  return (
    <main>
      <PageHero>
        <div style={{textAlign:'center',maxWidth:700,margin:'0 auto'}}>
          <h1 style={{fontSize:'clamp(36px,5vw,56px)',fontWeight:700,color:'#f5f5f7',letterSpacing:'-0.04em',marginBottom:16,opacity:0,animation:'fadeUp .8s .3s forwards'}}>Акции и <span className="accent-line">спецпредложения</span></h1>
          <p style={{fontSize:17,color:'#8b95a8',lineHeight:1.6,opacity:0,animation:'fadeUp .8s .5s forwards'}}>Выгодные условия для постоянных клиентов, ресторанов и крупных объектов</p>
        </div>
      </PageHero>
      <section className="promos-body" ref={ref}>
        <div className="promos-grid">
          {promos.map(p=>(
            <div className="promo-card" key={p.title} data-anim>
              <div className="promo-card__img"><img src={p.img} alt={p.title} loading="lazy"/><span className="promo-card__badge" style={{background:p.color}}>{p.badge}</span></div>
              <div className="promo-card__body"><h3>{p.title}</h3><p>{p.desc}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section className="promos-cta">
        <h2 data-anim>Хотите узнать подробности?</h2>
        <p data-anim>Свяжитесь с нами — подберём лучшее предложение</p>
        <div data-anim className="promos-cta__actions"><a href="tel:+74951234567" className="btn-primary-dark">Позвонить</a><Link href="/contacts" className="btn-primary">Оставить заявку</Link></div>
      </section>
    </main>
  );
}
