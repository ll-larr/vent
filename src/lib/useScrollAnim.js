'use client';
import { useEffect } from 'react';

export default function useScrollAnim(ref) {
  useEffect(() => {
    if (!ref?.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = Array.from(entry.target.parentElement.children).filter(c => c.hasAttribute('data-anim'));
            const delay = siblings.indexOf(entry.target) * 120;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    ref.current.querySelectorAll('[data-anim]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}
