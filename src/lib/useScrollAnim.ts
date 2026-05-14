'use client';
import { useEffect, RefObject } from 'react';

export default function useScrollAnim(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref?.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = Array.from(
              entry.target.parentElement?.children ?? []
            ).filter((c) => c.hasAttribute('data-anim'));
            const delay = siblings.indexOf(entry.target as Element) * 120;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    ref.current.querySelectorAll('[data-anim]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}
