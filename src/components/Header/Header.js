'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { navLinks, LogoSvg } from '@/lib/nav';
import './style.scss';

export default function Header() {
  const navRef = useRef(null);

  useEffect(() => {
    const heroHeader = document.querySelector('.hero-header');
    if (!heroHeader || !navRef.current) {
      // No hero-header on this page — always show sticky nav
      navRef.current?.classList.add('visible');
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => navRef.current?.classList.toggle('visible', !e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(heroHeader);
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="nav" id="nav" ref={navRef}>
      <Link href="/" className="nav__logo"><LogoSvg /><span>Clean Vent</span></Link>
      <div className="nav__links">
        {navLinks.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
      </div>
      <div className="nav__right">
        <a href="tel:+74951234567" className="nav__phone">+7 (495) 123-45-67</a>
        <Link href="/contacts" className="nav__cta">Заказать звонок</Link>
      </div>
    </nav>
  );
}
