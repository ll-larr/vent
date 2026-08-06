'use client';

import { useEffect, useState } from 'react';
import {
  navLinks,
  navHrefToId,
  LogoMark,
  LogoWord,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
} from '@/lib/nav';
import { Menu, X, ArrowRight, ChevronLeft, Phone, Mail } from '@/lib/icons';
import { useMagnet } from '@/lib/useMagnet';

type Variant = 'landing' | 'back';

export function Header({ variant = 'landing' }: { variant?: Variant }) {
  const [activeId, setActiveId] = useState<string>('services');
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerCtaRef = useMagnet<HTMLAnchorElement>({ strength: 0.15 });

  // Active-section highlight only makes sense on landing where sections exist.
  useEffect(() => {
    if (variant !== 'landing') return;
    const ids = navLinks.map((l) => navHrefToId(l.href));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        }
        if (best) setActiveId(best.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [variant]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // BACK variant: brand + "Назад" — matches HTML privacy.html topbar
  if (variant === 'back') {
    return (
      <>
        <header className="sticky top-3 z-50 px-4">
          <div className="max-w-[1320px] mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-3 bg-ink/[.92] backdrop-blur-md text-bg pl-[18px] pr-[12px] py-[10px] rounded-full">
            <a href="/" className="flex items-center gap-2.5 font-medium hover:text-accent transition-colors" aria-label="Vent — на главную">
              <LogoMark />
              <LogoWord />
            </a>
            <span aria-hidden="true" />
            <a
              href="/"
              className="group inline-flex items-center gap-2 bg-accent text-ink px-3.5 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-[.14em] hover:bg-bg transition-colors whitespace-nowrap"
            >
              <ChevronLeft size={14} strokeWidth={2} aria-hidden="true" />
              Назад
            </a>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-accent focus:text-ink focus:text-sm focus:font-mono focus:uppercase focus:tracking-wider focus:shadow-lifted"
      >
        Перейти к содержимому
      </a>

      <header className="sticky top-3 z-50 px-4">
        <div className="max-w-[1320px] mx-auto grid grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto_auto] items-center gap-3.5 bg-ink/[.92] backdrop-blur-md text-bg pl-[18px] pr-[12px] py-[10px] rounded-full">
          <a href="/#top" className="flex items-center gap-2.5 font-medium" aria-label="Vent — на главную">
            <LogoMark />
            <LogoWord />
          </a>

          <nav className="hidden lg:flex justify-center gap-1 font-mono text-[11px] tracking-[.14em] uppercase" aria-label="Основная навигация">
            {navLinks.map((l) => {
              const id = navHrefToId(l.href);
              const active = id === activeId;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'true' : undefined}
                  className={`px-3 py-2 rounded-full transition-colors ${
                    active
                      ? 'text-accent'
                      : 'text-bg/70 hover:bg-bg/[.07] hover:text-bg'
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3.5 pr-3.5 border-r border-bg/[.14]">
            <a
              href={CONTACT_PHONE_HREF}
              className="inline-flex items-center gap-1.5 text-[12.5px] tracking-[.04em] text-bg hover:text-accent transition-colors whitespace-nowrap"
              aria-label="Позвонить"
            >
              <Phone size={13} strokeWidth={1.7} aria-hidden="true" />
              {CONTACT_PHONE}
            </a>
            <a
              href={CONTACT_EMAIL_HREF}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[.08em] uppercase text-bg/80 hover:text-accent transition-colors whitespace-nowrap"
              aria-label="Написать"
            >
              <Mail size={13} strokeWidth={1.7} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <a
            ref={headerCtaRef}
            href="/#calculator"
            data-magnet
            className="hidden lg:inline-flex items-center gap-2 bg-accent text-ink px-[14px] py-[10px] rounded-full font-medium text-[12px] hover:bg-bg whitespace-nowrap transition-[background-color,color] duration-200 group"
          >
            Рассчитать
            <ArrowRight
              size={14}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={mobileOpen}
            className="lg:hidden justify-self-end -mr-1 w-11 h-11 grid place-items-center rounded-full bg-bg/[.08] text-bg hover:bg-bg/[.14] transition-colors"
          >
            <Menu size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-ink text-bg flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-bg/[.12]">
            <a href="/#top" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5" aria-label="Vent — на главную">
              <LogoMark />
              <LogoWord />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
              className="w-11 h-11 grid place-items-center rounded-full bg-bg/[.08] hover:bg-bg/[.14] transition-colors"
            >
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col px-5 py-6 gap-0 overflow-y-auto" aria-label="Мобильная навигация">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-4 font-display font-light text-[clamp(28px,7vw,40px)] leading-none tracking-[-.02em] border-b border-bg/[.08]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="px-5 py-6 flex flex-col gap-3 border-t border-bg/[.12]">
            <a
              href={CONTACT_PHONE_HREF}
              className="inline-flex items-center gap-2.5 text-[16px] text-bg hover:text-accent"
              onClick={() => setMobileOpen(false)}
            >
              <Phone size={15} strokeWidth={1.7} aria-hidden="true" />
              {CONTACT_PHONE}
            </a>
            <a
              href={CONTACT_EMAIL_HREF}
              className="inline-flex items-center gap-2.5 text-[14px] font-mono text-bg/80 hover:text-accent"
              onClick={() => setMobileOpen(false)}
            >
              <Mail size={14} strokeWidth={1.7} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <a
              href="/#calculator"
              onClick={() => setMobileOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 bg-accent text-ink px-6 py-4 rounded-full font-medium text-[15px] min-h-[48px]"
            >
              Рассчитать
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
