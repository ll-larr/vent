'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { navLinks, LogoSvg } from '@/lib/nav';
import { Menu, X, Phone } from '@/lib/icons';

export default function Header() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero-section');

    if (!hero || !navRef.current) {
      navRef.current?.classList.add('visible');
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        const visible = !e.isIntersecting;
        navRef.current?.classList.toggle('visible', visible);
        setScrolled(visible);
      },
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // Close mobile menu on route change / escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={[
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300 ease-out',
          'opacity-0 -translate-y-full',
          '[&.visible]:opacity-100 [&.visible]:translate-y-0',
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-black/[0.06] shadow-card'
            : 'bg-brand',
        ].join(' ')}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className={[
              'flex items-center gap-2.5 font-semibold text-base shrink-0 transition-colors',
              scrolled ? 'text-brand' : 'text-white',
            ].join(' ')}
          >
            <LogoSvg />
            <span className="tracking-tight">Clean Vent</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={[
                  'text-sm font-medium transition-colors whitespace-nowrap',
                  scrolled
                    ? 'text-ink/60 hover:text-ink'
                    : 'text-white/70 hover:text-white',
                ].join(' ')}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+74951234567"
              className={[
                'hidden lg:flex items-center gap-1.5 text-sm font-medium transition-colors',
                scrolled ? 'text-ink/60 hover:text-ink' : 'text-white/70 hover:text-white',
              ].join(' ')}
            >
              <Phone size={15} strokeWidth={2} />
              +7 (495) 123-45-67
            </a>

            <a
              href="#contacts"
              className={[
                'text-sm font-semibold px-5 py-2.5 rounded-pill transition-all whitespace-nowrap',
                scrolled
                  ? 'bg-brand text-white hover:bg-brand-hover shadow-card'
                  : 'bg-white text-brand hover:bg-brand-light',
              ].join(' ')}
            >
              Оставить заявку
            </a>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Меню"
              className={[
                'lg:hidden p-2 rounded-lg transition-colors',
                scrolled ? 'text-ink hover:bg-black/5' : 'text-white hover:bg-white/10',
              ].join(' ')}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-white shadow-float flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-black/[0.06]">
              <span className="font-semibold text-brand">Навигация</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть меню"
                className="p-2 rounded-lg text-ink/50 hover:bg-black/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink/70 hover:text-brand hover:bg-brand-light font-medium transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="p-6 border-t border-black/[0.06] space-y-3">
              <a
                href="tel:+74951234567"
                className="flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                <Phone size={15} strokeWidth={2} />
                +7 (495) 123-45-67
              </a>
              <a
                href="#contacts"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-brand text-white font-semibold py-3 rounded-pill hover:bg-brand-hover transition-colors"
              >
                Оставить заявку
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
