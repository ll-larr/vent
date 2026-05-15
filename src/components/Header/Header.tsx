'use client';

import { useEffect, useRef, useState } from 'react';
import { navLinks } from '@/lib/nav';
import { Menu, X, ArrowRight } from '@/lib/icons';

export function Header() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero-section');
    if (!hero) {
      setScrolled(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // Close mobile drawer on resize ≥ md or on Esc
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg/95 backdrop-blur-md border-b border-line'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-[5vw] py-4 flex items-center justify-between gap-6">
          <a href="/" className="font-display font-medium text-[24px] tracking-[-.02em] flex items-baseline gap-2 text-ink">
            Vent<span className="text-brand font-light italic">—</span>
            <span className="font-mono text-[11px] tracking-[.1em] uppercase text-ink/50 font-normal">est. 2014</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-[14px] text-ink/70">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-ink transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#calculator"
            className="hidden md:inline-flex items-center gap-2 bg-brand text-bg px-5 py-2.5 rounded-full text-[14px] font-medium hover:bg-brand-dark transition-colors"
          >
            Рассчитать
            <ArrowRight size={14} strokeWidth={2} />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
            className="md:hidden p-2 -mr-2 text-ink"
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-bg flex flex-col md:hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <span className="font-display font-medium text-[24px] tracking-[-.02em]">Vent</span>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню" className="p-2 -mr-2 text-ink">
              <X size={24} strokeWidth={1.75} />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-8 gap-2 text-2xl font-display">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="py-3 border-b border-line">
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#calculator"
            onClick={() => setMobileOpen(false)}
            className="mx-5 mt-auto mb-8 bg-brand text-bg px-6 py-4 rounded-full text-center font-medium"
          >
            Рассчитать стоимость
          </a>
        </div>
      )}
    </>
  );
}

export default Header;
