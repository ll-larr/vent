'use client';
import { useEffect, type RefObject } from 'react';

interface ScrollAnimOptions {
  threshold?: number;
  rootMargin?: string;
  staggerMs?: number;
}

export default function useScrollAnim(
  ref: RefObject<HTMLElement | null>,
  {
    threshold = 0.1,
    rootMargin = '0px 0px -60px 0px',
    staggerMs = 70,
  }: ScrollAnimOptions = {}
) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const els = Array.from(container.querySelectorAll<HTMLElement>('[data-anim]'));

    // Apply stagger delays via inline transition-delay
    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * staggerMs}ms`;
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ref, threshold, rootMargin, staggerMs]);
}
