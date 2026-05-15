'use client';

import { useRef } from 'react';
import Image from 'next/image';
import useScrollAnim from '@/lib/useScrollAnim';
import { VENUES } from '@/data/venues';

export function BigVenues() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} className="px-5 md:px-[5vw] py-16 border-y border-line bg-bg">
      <div className="max-w-7xl mx-auto">
        <div
          className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 text-center mb-8"
          data-anim
        >
          05 / Среди объектов, на которых работали
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VENUES.map((v, i) => (
            <div
              key={v.id}
              className="relative aspect-[3/2] rounded-xl overflow-hidden grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
              data-anim
              style={{ ['--delay' as any]: `${i * 60}ms` }}
            >
              <Image src={v.src} alt={v.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-2 left-3 font-mono text-[11px] uppercase tracking-wider text-white">
                {v.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BigVenues;
