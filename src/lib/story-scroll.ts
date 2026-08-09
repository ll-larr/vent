'use client';

import { useEffect } from 'react';

/* ===========================================================================
   Story scroll engine — the React port of design/story-scroll.js.

   Everything scroll-dependent is painted inside ONE requestAnimationFrame per
   scroll/resize: sticky tracks, parallax, the topbar state, the active nav
   item and the progress bar. Splitting these across separate listeners is what
   made the prototype's highlight lag behind the scroll, so the single frame is
   a hard requirement, not a micro-optimisation.

   The engine only writes attributes (`data-on`, `data-solid`) and two numeric
   transforms. Colours and transitions live in globals.css, so a paint is one
   attribute write instead of six style writes, and the visual contract stays
   readable in CSS rather than encoded in JS strings.
   =========================================================================== */

const REVEAL_FAILSAFE_MS = 4000;
const SOLID_TOPBAR_AFTER_PX = 60;
/** Active section = the one crossing this fraction of the viewport height. */
const ACTIVE_LINE = 0.38;

const reduceMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------- paint --- */

function paintTrack(track: HTMLElement, vh: number) {
  const pane = track.firstElementChild as HTMLElement | null;
  if (pane && getComputedStyle(pane).position !== 'sticky') {
    // Degraded track (short or narrow viewport): rows are no longer revealed
    // one per scroll step, so every row shows at full strength.
    if (track.dataset.idx === 'flow') return;
    track.dataset.idx = 'flow';
    track.querySelectorAll<HTMLElement>('[data-item]').forEach((item) => {
      item.dataset.on = '1';
    });
    return;
  }

  const rect = track.getBoundingClientRect();
  const span = rect.height - vh;
  const progress =
    span > 0
      ? Math.min(1, Math.max(0, -rect.top / span))
      : rect.top < vh * 0.4
        ? 1
        : 0;

  const frames = track.querySelectorAll<HTMLElement>('[data-frame]');
  const items = track.querySelectorAll<HTMLElement>('[data-item]');
  const count = frames.length || items.length;
  if (!count) return;

  const idx = Math.min(count - 1, Math.floor(progress * count * 0.999 + 0.0001));
  if (track.dataset.idx === String(idx)) return;
  track.dataset.idx = String(idx);

  frames.forEach((frame, i) => {
    frame.dataset.on = i === idx ? '1' : '0';
  });
  items.forEach((item, i) => {
    item.dataset.on = i === idx ? '1' : '0';
  });
}

function paintParallax(vh: number) {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const k = parseFloat(el.dataset.parallax || '') || 0.12;
    const rect = el.getBoundingClientRect();
    const mid = rect.top + rect.height / 2 - vh / 2;
    el.style.transform = `translate3d(0,${(-mid * k).toFixed(1)}px,0)`;
  });
}

function activeSection(vh: number): string {
  const sections = document.querySelectorAll<HTMLElement>('section[data-sec]');
  if (!sections.length) return '';

  const line = vh * ACTIVE_LINE;
  let hit: HTMLElement | null = null;
  let nearest: HTMLElement | null = null;
  let nearestDistance = Infinity;

  for (const section of Array.from(sections)) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= line && rect.bottom > line) hit = section;
    const distance = Math.abs(rect.top - line);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = section;
    }
  }

  let el: HTMLElement | null = hit ?? nearest;
  // At the very bottom of the document the last section always wins, however
  // short it is — otherwise the final menu item can never light up.
  const scroller = document.scrollingElement || document.documentElement;
  if (scroller.scrollTop + vh >= scroller.scrollHeight - 4) {
    el = sections[sections.length - 1];
  }
  return el?.dataset.sec ?? '';
}

function paintNav(vh: number) {
  const id = activeSection(vh);
  document.querySelectorAll<HTMLElement>('[data-nav-item]').forEach((link) => {
    link.dataset.on = link.dataset.navItem === id ? '1' : '0';
  });
}

function paintTopbar(solid: boolean) {
  const bar = document.querySelector<HTMLElement>('[data-topbar="story"]');
  if (bar) bar.dataset.solid = solid ? '1' : '0';
}

function paintProgress(vh: number) {
  const bar = document.querySelector<HTMLElement>('[data-progress-bar]');
  if (!bar) return;
  const height = document.documentElement.scrollHeight - vh;
  const p = height > 0 ? window.scrollY / height : 0;
  bar.style.transform = `scaleX(${p.toFixed(4)})`;
}

/**
 * Mounts the single scroll frame. Call once, from the page shell.
 */
export function useStoryScroll() {
  useEffect(() => {
    const still = reduceMotion();
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      document
        .querySelectorAll<HTMLElement>('[data-track]')
        .forEach((track) => paintTrack(track, vh));
      if (!still) paintParallax(vh);
      paintNav(vh);
      paintTopbar(window.scrollY > SOLID_TOPBAR_AFTER_PX);
      paintProgress(vh);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      // Track geometry changed — drop the memoised index so the next frame
      // repaints even if the active step happens to land on the same number.
      document.querySelectorAll<HTMLElement>('[data-track]').forEach((track) => {
        delete track.dataset.idx;
      });
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    frame();
    // Late layout (fonts, images) shifts every measurement taken above.
    const settle = window.setTimeout(frame, 400);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}

/* --------------------------------------------------------------- reveal --- */

/**
 * Entrance reveals.
 *
 * The hidden state is opt-in: `story-reveal` on <html> is what makes
 * `[data-reveal]` elements invisible, and this hook is the only thing that
 * sets it. No JS, a thrown effect or a dead observer therefore leave the page
 * fully readable. A failsafe reveals anything the observer missed.
 */
export function useStoryReveal() {
  useEffect(() => {
    if (reduceMotion() || typeof IntersectionObserver === 'undefined') return;

    const root = document.documentElement;
    root.classList.add('story-reveal');

    const show = (el: Element) => el.setAttribute('data-revealed', '1');
    const timers: number[] = [];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.delay || '0', 10);
          if (delay > 0) timers.push(window.setTimeout(() => show(el), delay));
          else show(el);
          io.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    const failsafe = window.setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach(show);
    }, REVEAL_FAILSAFE_MS);

    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
      window.clearTimeout(failsafe);
      root.classList.remove('story-reveal');
    };
  }, []);
}

/* --------------------------------------------------------------- scroll --- */

/** Scroll offset that keeps a section clear of the fixed topbar. */
export const SECTION_SCROLL_OFFSET = 60;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET,
    behavior: reduceMotion() ? 'auto' : 'smooth',
  });
}
