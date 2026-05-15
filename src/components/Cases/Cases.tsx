'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';
import { CASES, type CaseStudy } from '@/data/cases';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function CompareSlider({ before, after, beforeAlt, afterAlt, sizes }: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  sizes: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const beforeWrapRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const userCtrlRef = useRef(false);
  const pctRef = useRef(50);
  const rafRef = useRef<number | null>(null);
  const t0Ref = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = prefersReducedMotion();

    const apply = (p: number) => {
      pctRef.current = Math.max(0, Math.min(100, p));
      if (beforeWrapRef.current) {
        beforeWrapRef.current.style.clipPath = `inset(0 ${100 - pctRef.current}% 0 0)`;
      }
      if (handleRef.current) handleRef.current.style.left = pctRef.current + '%';
      if (gripRef.current) gripRef.current.style.left = pctRef.current + '%';
    };

    apply(50);
    t0Ref.current = performance.now();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visibleRef.current = e.isIntersecting)),
      { threshold: 0.2 },
    );
    io.observe(root);

    // Auto-animation (ping-pong) — skipped when reduced motion
    const tick = (t: number) => {
      if (!userCtrlRef.current && visibleRef.current && !reduced) {
        const phase = ((t - t0Ref.current) % 4800) / 4800;
        const eased = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
        apply(28 + eased * 44);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const move = (clientX: number) => {
      const r = root.getBoundingClientRect();
      apply(((clientX - r.left) / r.width) * 100);
    };

    const onEnter = () => (userCtrlRef.current = true);
    const onLeave = () => {
      userCtrlRef.current = false;
      // Resume from current position smoothly
      t0Ref.current = performance.now() - ((pctRef.current - 28) / 44) * 4800 * 0.5;
    };
    const onMove = (e: MouseEvent) => {
      userCtrlRef.current = true;
      move(e.clientX);
    };
    const onTouch = (e: TouchEvent) => {
      userCtrlRef.current = true;
      if (e.touches[0]) move(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      setTimeout(() => (userCtrlRef.current = false), 1500);
    };

    root.addEventListener('mouseenter', onEnter);
    root.addEventListener('mouseleave', onLeave);
    root.addEventListener('mousemove', onMove);
    root.addEventListener('touchstart', onTouch, { passive: true });
    root.addEventListener('touchmove', onTouch, { passive: true });
    root.addEventListener('touchend', onTouchEnd);

    return () => {
      io.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      root.removeEventListener('mouseenter', onEnter);
      root.removeEventListener('mouseleave', onLeave);
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('touchstart', onTouch);
      root.removeEventListener('touchmove', onTouch);
      root.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 bg-ink select-none overflow-hidden cursor-crosshair"
      aria-label="Сравнение до и после чистки. Перетащите ползунок горизонтально."
      role="img"
    >
      <Image
        src={after}
        alt={afterAlt}
        fill
        sizes={sizes}
        className="object-cover absolute inset-0"
      />
      <div ref={beforeWrapRef} className="absolute inset-0 overflow-hidden will-change-[clip-path]">
        <Image src={before} alt={beforeAlt} fill sizes={sizes} className="object-cover" />
      </div>

      {/* tag.before — moved to row 2 to avoid overlap with corner badge */}
      <span className="absolute top-[60px] left-[18px] z-[2] px-3 py-1.5 rounded-full font-mono text-[10.5px] uppercase tracking-[.14em] bg-ink/70 text-bg backdrop-blur-sm">
        До
      </span>
      <span className="absolute top-[18px] right-[18px] z-[2] px-3 py-1.5 rounded-full font-mono text-[10.5px] uppercase tracking-[.14em] bg-accent/[.92] text-ink backdrop-blur-sm">
        После
      </span>

      {/* Handle line */}
      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 w-0.5 bg-accent pointer-events-none will-change-[left]"
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 0 28px rgba(200,255,62,.45)' }}
        aria-hidden="true"
      />

      {/* Grip */}
      <div
        ref={gripRef}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full bg-accent text-ink grid place-items-center pointer-events-none will-change-[left]"
        style={{
          boxShadow: '0 10px 30px rgba(0,0,0,.35), inset 0 0 0 4px rgba(255,255,255,.18)',
        }}
        aria-hidden="true"
      >
        <svg width="20" height="16" viewBox="0 0 18 14" fill="none">
          <path d="M5 1L1 7l4 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 1l4 6-4 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Dashed spinning ring */}
        <span
          className="absolute -inset-2.5 rounded-full border border-dashed animate-ringspin"
          style={{ borderColor: 'rgba(200,255,62,.55)' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function CaseTile({ c, size }: { c: CaseStudy; size: 'big' | 'mid' }) {
  const colClass = size === 'big' ? 'col-span-12' : 'col-span-12 sm:col-span-6';
  const minH = size === 'big' ? 'min-h-[520px]' : 'min-h-[460px]';
  const sizes = size === 'big' ? '100vw' : '(min-width: 640px) 50vw, 100vw';
  return (
    <article
      className={`${colClass} ${minH} group bg-ink rounded-[28px] overflow-hidden relative text-bg`}
      data-anim
    >
      <CompareSlider
        before={c.beforeSrc}
        after={c.afterSrc}
        beforeAlt={`До чистки: ${c.title}, ${c.category}`}
        afterAlt={`После чистки: ${c.title}, ${c.category}`}
        sizes={sizes}
      />

      {/* Corner badge */}
      <div className="absolute top-[18px] left-[18px] z-[3] inline-flex items-center gap-2 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[.14em] bg-ink/70 text-bg rounded-full backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        {c.badge}
      </div>

      {/* Glass info panel — always full width */}
      <div
        className="absolute left-[18px] right-[18px] bottom-[18px] z-[3] flex flex-col gap-2.5 px-[18px] py-3.5 rounded-2xl text-bg group-hover:bg-ink/85 transition-colors"
        style={{
          background: 'rgba(20,19,18,.72)',
          backdropFilter: 'blur(14px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.1)',
          border: '1px solid rgba(246,243,236,.08)',
        }}
      >
        <div className="flex flex-col gap-1">
          <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-accent">{c.category}</div>
          <h4 className="font-display font-normal text-[clamp(20px,1.9vw,26px)] leading-[1.1] tracking-[-.012em] text-bg">
            {c.title}
          </h4>
        </div>

        {/* Expandable details — grid-template-rows trick */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100 transition-[grid-template-rows,opacity] duration-[350ms] ease-[cubic-bezier(.16,1,.3,1)]">
          <div className="overflow-hidden flex flex-col gap-2.5">
            <p className="text-[13px] text-bg/[.78] leading-[1.5]">{c.description}</p>
            <div className="flex gap-1.5 flex-wrap">
              {c.footTags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] uppercase tracking-[.12em] px-2.5 py-1.5 rounded-full text-bg/85"
                  style={{
                    background: 'rgba(246,243,236,.08)',
                    border: '1px solid rgba(246,243,236,.12)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Cases() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="cases" className="px-4">
      <div className="max-w-[1320px] mx-auto px-4 pt-14 pb-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-3">
        <div data-anim>
          <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-2.5">03 / кейсы</div>
          <h2 className="font-display font-light text-[clamp(40px,5.2vw,76px)] leading-[.98] tracking-[-.025em]">
            Не описания — <em className="italic text-brand">снимки.</em>
          </h2>
        </div>
        <p className="font-sans text-[14px] text-ink/60 max-w-[38ch] lg:text-right leading-[1.5]" data-anim>
          Двигайте бегунок и сравните «до / после». Без ретуши, без подмены ракурса.
        </p>
      </div>

      <div className="max-w-[1320px] mx-auto grid grid-cols-12 gap-3">
        <CaseTile c={CASES[0]} size="big" />
        <CaseTile c={CASES[1]} size="mid" />
        <CaseTile c={CASES[2]} size="mid" />
        <p className="col-span-12 text-center font-mono text-[11px] uppercase tracking-[.14em] text-ink/45 py-1">
          ⇔ ползунок движется сам · наведите, чтобы взять управление
        </p>
      </div>
    </section>
  );
}

export default Cases;
