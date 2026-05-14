'use client';
import { useRef } from 'react';
import Link from 'next/link';
import useScrollAnim from '@/lib/useScrollAnim';
import './style.scss';

export default function HomeCTA() {
  const ref = useRef(null);
  useScrollAnim(ref);
  return (
    <section className="hcta" ref={ref}>
      <div className="hcta__inner">
        <h2 data-anim>Закажите бесплатную диагностику</h2>
        <p data-anim>Оставьте заявку, и наш специалист свяжется с вами в течение 15 минут</p>
        <div className="hcta__actions" data-anim>
          <a href="tel:+74951234567" className="btn-primary-dark">Позвонить</a>
          <Link href="/contacts" className="btn-primary">Оставить заявку</Link>
        </div>
      </div>
    </section>
  );
}
