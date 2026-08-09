'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

/* Before/after slider.

   The position is written straight to the DOM rather than held in React
   state: a pointer drag repaints on every move, and re-rendering two
   next/image trees at that rate is wasted work. React owns the markup, the
   handlers own the four properties that change.

   Behaviour per the handoff: starts closed, plays itself open to 62% once on
   first sight, drags with the pointer, moves 6% per arrow key, and resets
   when the object tab changes. Reduced motion skips the animation and simply
   sits at the halfway point. */

const AUTOPLAY_TO = 0.62;
const AUTOPLAY_DELAY_MS = 240;
const REPLAY_DELAY_MS = 140;
const KEY_STEP = 0.06;
const SMOOTH = '1.15s cubic-bezier(.16,1,.3,1)';

export function CompareSlider({
  before,
  after,
  caption,
  /** Changing this replays the intro — the object tabs pass their key. */
  replayKey,
  size = 'main',
  className = '',
  sizes,
}: {
  before: string;
  after: string;
  caption: string;
  replayKey: string;
  size?: 'main' | 'side';
  className?: string;
  sizes: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const afterWrap = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const badgeBefore = useRef<HTMLSpanElement>(null);
  const badgeAfter = useRef<HTMLSpanElement>(null);
  const position = useRef(0);

  const paint = (value: number, smooth: boolean) => {
    const p = Math.min(1, Math.max(0, value));
    position.current = p;
    const ms = smooth ? SMOOTH : '0s';
    if (afterWrap.current) {
      afterWrap.current.style.transition = `clip-path ${ms}`;
      afterWrap.current.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`;
    }
    if (line.current) {
      line.current.style.transition = `left ${ms}`;
      line.current.style.left = `${(p * 100).toFixed(2)}%`;
    }
    if (badgeBefore.current) badgeBefore.current.style.opacity = p > 0.8 ? '0' : '1';
    if (badgeAfter.current) badgeAfter.current.style.opacity = p < 0.2 ? '0' : '1';
    root.current?.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  };

  // Intro: once when first seen, and again whenever the tab changes.
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = root.current;
    if (!el) return;

    let timer = 0;
    const play = () => {
      if (still) {
        paint(0.5, false);
        return;
      }
      paint(0, false);
      timer = window.setTimeout(() => paint(AUTOPLAY_TO, true), REPLAY_DELAY_MS);
    };

    // First mount waits for the element to come into view; later tab changes
    // replay immediately, because the section is already on screen.
    if (el.dataset.played === '1') {
      play();
      return () => window.clearTimeout(timer);
    }

    paint(0, false);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || el.dataset.played === '1') return;
          el.dataset.played = '1';
          if (still) paint(0.5, false);
          else timer = window.setTimeout(() => paint(AUTOPLAY_TO, true), AUTOPLAY_DELAY_MS);
          io.unobserve(el);
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayKey]);

  const at = (clientX: number) => {
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return;
    paint((clientX - rect.left) / rect.width, false);
  };

  const dragging = useRef(false);

  const badge =
    size === 'main'
      ? 'mono-label absolute top-3.5 z-[4] rounded-pill px-[13px] py-[7px] text-[10px] tracking-[.16em]'
      : 'mono-label absolute top-[11px] z-[4] rounded-pill px-2.5 py-[5px] text-[9px] tracking-[.16em]';

  return (
    <div
      ref={root}
      role="slider"
      tabIndex={0}
      aria-label={`Сравнение до и после — ${caption}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        at(e.clientX);
        // preventDefault stops the drag from selecting the photos, but it also
        // suppresses the focus a click would normally give — without this the
        // arrow keys do nothing until the visitor tabs to the slider.
        e.preventDefault();
        e.currentTarget.focus({ preventScroll: true });
      }}
      onPointerMove={(e) => {
        if (dragging.current) at(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          paint(position.current - KEY_STEP, false);
          e.preventDefault();
        }
        if (e.key === 'ArrowRight') {
          paint(position.current + KEY_STEP, false);
          e.preventDefault();
        }
      }}
      className={`relative select-none overflow-hidden bg-black-deep outline-none [cursor:ew-resize] [touch-action:none] ${className}`}
    >
      <Image
        src={before}
        alt="Участок до чистки"
        fill
        sizes={sizes}
        className="pointer-events-none object-cover"
      />
      <span ref={afterWrap} className="absolute inset-0 block [clip-path:inset(0_100%_0_0)]">
        <Image
          src={after}
          alt="Тот же участок после чистки"
          fill
          sizes={sizes}
          className="pointer-events-none object-cover"
        />
      </span>

      <div
        ref={line}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-[3] w-[1.5px] bg-accent"
      >
        <span
          className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill bg-accent text-ink ${
            size === 'main'
              ? 'h-[42px] w-[42px] text-[15px] shadow-[0_4px_22px_rgba(0,0,0,.35)]'
              : 'h-8 w-8 text-[12px] shadow-[0_4px_18px_rgba(0,0,0,.35)]'
          }`}
        >
          ⇄
        </span>
      </div>

      <span
        ref={badgeBefore}
        className={`${badge} ${size === 'main' ? 'left-3.5' : 'left-[11px]'} pointer-events-none bg-ink/[.86] text-bg transition-opacity duration-300`}
      >
        до
      </span>
      <span
        ref={badgeAfter}
        className={`${badge} ${size === 'main' ? 'right-3.5' : 'right-[11px]'} pointer-events-none bg-accent text-ink opacity-0 transition-opacity duration-300`}
      >
        после
      </span>
      <span
        className={`mono-label pointer-events-none absolute z-[4] rounded-pill bg-black-deep/50 text-bg/[.72] ${
          size === 'main'
            ? 'bottom-3.5 left-3.5 px-[11px] py-1.5 text-[9.5px]'
            : 'bottom-[11px] left-[11px] px-2.5 py-[5px] text-[9px]'
        }`}
      >
        {caption}
      </span>
    </div>
  );
}

export default CompareSlider;
