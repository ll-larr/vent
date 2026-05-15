'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';
import { CASES } from '@/data/cases';

function CompareSlider({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none touch-pan-y bg-ink/5"
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <Image src={after} alt={`После: ${alt}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={`До: ${alt}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-accent pointer-events-none" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-accent rounded-full grid place-items-center text-ink text-xs font-mono shadow-card">⇿</div>
      </div>
      <div className="absolute top-3 left-3 px-2 py-1 bg-ink/70 text-bg text-[11px] font-mono uppercase tracking-wider rounded">До</div>
      <div className="absolute top-3 right-3 px-2 py-1 bg-accent text-ink text-[11px] font-mono uppercase tracking-wider rounded">После</div>
    </div>
  );
}

export function Cases() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="cases" className="px-5 md:px-[5vw] py-24 bg-bg">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3" data-anim>
          03 / кейсы
        </div>
        <h2
          className="font-display font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[-.025em] mb-12 max-w-3xl"
          data-anim
          style={{ ['--delay' as any]: '70ms' }}
        >
          Не описания — <em className="italic text-brand">снимки.</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {CASES.map((c, i) => (
            <article key={c.id} data-anim style={{ ['--delay' as any]: `${i * 80}ms` }}>
              <CompareSlider before={c.beforeSrc} after={c.afterSrc} alt={c.title} />
              <h3 className="font-display text-[24px] mt-5">{c.title}</h3>
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink/50 mt-1">{c.venueType}</div>
              <p className="text-[14px] text-ink/65 mt-2">{c.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Cases;
