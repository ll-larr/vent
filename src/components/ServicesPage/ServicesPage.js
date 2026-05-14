'use client';
import { useRef } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero/PageHero';
import useScrollAnim from '@/lib/useScrollAnim';
import './style.scss';

const services = [
  { img: '/images/ico-pipes.png', title: 'Чистка от грязи и пыли', desc: 'Удаление пыли, мусора и загрязнений из вентиляционных каналов. Восстанавливаем воздухообмен и снижаем риск аллергических реакций.' },
  { img: '/images/ico-hood.png', title: 'Устранение жира', desc: 'Очистка вытяжных систем и воздуховодов от жировых отложений. Снижаем пожароопасность и возвращаем эффективность.' },
  { img: '/images/ico-chimney.png', title: 'Чистка дымоходов', desc: 'Удаление сажи и креозота из дымоходных каналов. Безопасная эксплуатация и правильная тяга.' },
  { img: '/images/ico-house.png', title: 'Частные дома / МКД', desc: 'Обслуживание вентиляции в частных домах и многоквартирных зданиях. Диагностика и чистка всех типов систем.' },
  { img: '/images/ico-reservoir.png', title: 'Зачистка резервуаров', desc: 'Очистка и дезинфекция резервуаров от нефтепродуктов и загрязнений. Ёмкости любого объёма.' },
  { img: '/images/ico-other.png', title: 'Прочие услуги', desc: 'Видеодиагностика воздуховодов, промывка вентиляционных решёток, очистка жироуловителей.' },
];

const prices = [
  ['Очистка от пыли','от 90 ₽/м'], ['Очистка от жира','от 270 ₽/м'], ['Чистка вытяжки','от 1 800 ₽'], ['Видеодиагностика','от 1 350 ₽'],
];

export default function ServicesPage() {
  const ref = useRef(null);
  useScrollAnim(ref);
  return (
    <main>
      <PageHero>
        <div className="svc-hero">
          <div className="svc-hero__text">
            <h1>Чистим то, что<br/><span className="accent-line">другие не видят</span></h1>
            <p>Вентиляция, вытяжки, дымоходы и резервуары — удаляем пыль, жир, сажу и сложные загрязнения специализированным оборудованием.</p>
          </div>
          <div className="svc-hero__pricebox">
            <div className="pricebox__header"><span className="pricebox__title">Часто заказывают</span><span className="pricebox__badge">Скидка 10%</span></div>
            <div className="pricebox__rows">
              {prices.map(([s,p])=><div key={s} className="pricebox__row"><span className="pricebox__service">{s}</span><span className="pricebox__dots"/><span className="pricebox__price">{p}</span></div>)}
            </div>
          </div>
        </div>
      </PageHero>
      <section className="svc-grid-section" ref={ref}>
        <div className="svc-grid">
          {services.map(s=>(
            <a href="#" className="svc-card" key={s.title} data-anim>
              <div className="svc-card__visual"><img src={s.img} alt={s.title}/><div className="svc-card__overlay"><h3>{s.title}</h3></div></div>
              <p className="svc-card__desc">{s.desc}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="svc-cta">
        <div className="svc-cta__inner">
          <h2 data-anim>Нужна консультация?</h2>
          <p data-anim>Оставьте заявку, и наш специалист свяжется с вами в течение 15 минут</p>
          <div data-anim><a href="tel:+74951234567" className="btn-primary-dark">Позвонить</a> <Link href="/contacts" className="btn-primary">Оставить заявку</Link></div>
        </div>
      </section>
    </main>
  );
}
