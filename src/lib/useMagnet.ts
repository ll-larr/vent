'use client';

import { useEffect, useRef } from 'react';

export type MagnetOptions = {
  /** How aggressively the element follows the cursor (0–1). Big CTAs ≈ 0.35, body buttons ≈ 0.22, nav ≈ 0.12. */
  strength?: number;
  /** Element activates magnet only when the cursor is within this radius beyond its bounds (px). */
  radius?: number;
};

/**
 * Pulls the bound element toward the cursor on mouseover, releases on leave.
 * Also exposes `--mx` and `--my` CSS variables (0–100%) so children can use
 * cursor-relative origins (e.g. radial fill from the entry point).
 *
 * Skipped on touch / no-hover / prefers-reduced-motion.
 */
export function useMagnet<T extends HTMLElement>({
  strength = 0.22,
  radius = 0,
}: MagnetOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduced || !hoverFine) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // If a `radius` is set, only react when the cursor is within that buffer.
      if (radius > 0) {
        const halfW = rect.width / 2 + radius;
        const halfH = rect.height / 2 + radius;
        if (Math.abs(dx) > halfW || Math.abs(dy) > halfH) return;
      }

      tx = dx * strength;
      ty = dy * strength;

      // Relative origin for child effects (fill, glow, etc.)
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${mx.toFixed(2)}%`);
      el.style.setProperty('--my', `${my.toFixed(2)}%`);

      if (!raf) {
        raf = requestAnimationFrame(() => {
          apply();
          raf = 0;
        });
      }
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      // Animate back to rest via CSS transition (set in component class).
      el.style.transform = '';
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // Use `mousemove` on window so the magnet picks up the cursor even
    // before it crosses the element's bounding box (when radius > 0).
    const moveTarget: Window | HTMLElement = radius > 0 ? window : el;
    moveTarget.addEventListener('mousemove', onMove as EventListener);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      moveTarget.removeEventListener('mousemove', onMove as EventListener);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      // Reset transform so the element doesn't stay offset after unmount.
      el.style.transform = '';
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    };
  }, [strength, radius]);

  return ref;
}

export default useMagnet;
