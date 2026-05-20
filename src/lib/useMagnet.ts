'use client';

import { useEffect, useRef } from 'react';

export type MagnetOptions = {
  /** How aggressively the element follows the cursor (0–1). Big CTAs ≈ 0.35, body buttons ≈ 0.22, nav ≈ 0.12. */
  strength?: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Pulls the bound element toward the cursor on mousemove, releases on leave.
 * Smoothness (both pull and return-to-rest) comes from a RAF lerp loop — same
 * approach as the design reference — so NO CSS `transition: transform` is
 * needed (which would otherwise clobber the button's colour crossfade).
 *
 * Also exposes `--mx` / `--my` CSS variables (cursor-relative %) for children.
 *
 * Skipped on touch / no-hover / prefers-reduced-motion.
 */
export function useMagnet<T extends HTMLElement>({ strength = 0.22 }: MagnetOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduced || !hoverFine) return;

    let raf = 0;
    let cx = 0;
    let cy = 0;
    let tx = 0; // target x
    let ty = 0; // target y

    const tick = () => {
      cx = lerp(cx, tx, 0.18);
      cy = lerp(cy, ty, 0.18);
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        if (tx === 0 && ty === 0) el.style.transform = '';
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;

      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--mx', `${mx.toFixed(2)}%`);
      el.style.setProperty('--my', `${my.toFixed(2)}%`);

      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    };
  }, [strength]);

  return ref;
}

export default useMagnet;
