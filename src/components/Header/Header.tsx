'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { navLinks, LogoSvg } from '@/lib/nav';

export default function Header() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = document.querySelector('.hero-section');
    if (!hero || !navRef.current) {
      navRef.current?.classList.add('visible');
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => navRef.current?.classList.toggle('visible', !e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'bg-brand text-white',
        'opacity-0 -translate-y-full',
        'transition-all duration-300 ease-out',
        '[&.visible]:opacity-100 [&.visible]:translate-y-0',
      ].join(' ')}
    >
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg shrink-0 text-white hover:text-white/90 transition-colors"
        >
          <LogoSvg />
          <span>Clean Vent</span>
        </Link>

        {/* Center nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/80 hover:text-white transition-colors whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right: phone + CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="tel:+74951234567"
            className="hidden lg:block text-sm text-white/80 hover:text-white transition-colors"
          >
            +7 (495) 123-45-67
          </a>
          <a
            href="#contacts"
            className="bg-white text-brand font-semibold text-sm px-5 py-2.5 rounded-pill hover:bg-brand-light transition-colors whitespace-nowrap"
          >
            Оставить заявку
          </a>
        </div>
      </div>
    </nav>
  );
}
