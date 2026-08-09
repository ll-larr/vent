'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Apple-style custom cursor: small dot + ring that lags behind, both
 * using `mix-blend-mode: difference` so they auto-invert against any
 * background. Native cursor hidden via `cursor: none` (see globals.css
 * `.has-custom-cursor` block).
 *
 * Self-disables on:
 * - touch / coarse-pointer devices (`hover: none`)
 * - users who set `prefers-reduced-motion: reduce`
 *
 * In those cases renders empty fragments and does not attach any listeners.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Capability check + class toggle on <html>. Re-evaluates on resize so
  // toggling DevTools mobile view turns the cursor off mid-session.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');

    const update = () => {
      const on = !reducedMq.matches && hoverMq.matches;
      setEnabled(on);
      document.documentElement.classList.toggle('has-custom-cursor', on);
    };

    update();
    reducedMq.addEventListener('change', update);
    hoverMq.addEventListener('change', update);
    return () => {
      reducedMq.removeEventListener('change', update);
      hoverMq.removeEventListener('change', update);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Position state. Dot snaps to cursor each frame; ring lerps toward target.
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let visible = false;

    const tick = () => {
      // Ring follows with a small lag for the Apple feel.
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        dot.classList.add('is-visible');
        ring.classList.add('is-visible');
      }
    };

    const onLeaveWindow = () => {
      visible = false;
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    };

    const onEnterWindow = () => {
      // re-enable on next move
    };

    // Hover-state tracking — the ring grows over anything interactive.
    const INTERACTIVE_SEL =
      'a, button, [role="button"], [role="checkbox"], [role="radio"], [role="slider"], input, textarea, select, label, summary, [data-hoverable]';

    const updateHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      ring.classList.toggle('is-link', !!target.closest(INTERACTIVE_SEL));
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousemove', updateHover, { passive: true });
    window.addEventListener('mouseleave', onLeaveWindow);
    window.addEventListener('mouseenter', onEnterWindow);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', updateHover);
      window.removeEventListener('mouseleave', onLeaveWindow);
      window.removeEventListener('mouseenter', onEnterWindow);
    };
  }, [enabled]);

  if (!enabled) {
    // Render empty placeholders so React tree shape stays stable.
    return <></>;
  }

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
    </>
  );
}

export default CustomCursor;
