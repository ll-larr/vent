'use client';

import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { Wind, Fan, SprayCan, Stethoscope, ArrowRight } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react';
import { SERVICE_DISPLAY } from '@/data/services';
import type { ServiceKey } from '@/lib/pricing';

const ICON_MAP: Record<string, LucideIcon> = {
  Wind,
  Fan,
  SprayCan,
  Stethoscope,
};

const ORDER: ServiceKey[] = ['grease', 'dust', 'hood', 'disinfect'];

export function Services() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="services" className="px-5 md:px-[5vw] py-24 bg-bg">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3" data-anim>
          02 / услуги
        </div>
        <h2
          className="font-display font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[-.025em] mb-12 max-w-3xl"
          data-anim
          style={{ ['--delay' as any]: '70ms' }}
        >
          Что мы <em className="italic text-brand">делаем.</em>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ORDER.map((key, i) => {
            const s = SERVICE_DISPLAY[key];
            const Icon = ICON_MAP[s.iconName] ?? Wind;
            return (
              <article
                key={key}
                className="group bg-surface rounded-3xl p-7 shadow-card hover:shadow-lifted transition-all duration-300 hover:-translate-y-1"
                data-anim
                style={{ ['--delay' as any]: `${i * 70}ms` }}
              >
                <div className="w-14 h-14 bg-bg rounded-full flex items-center justify-center mb-6">
                  <Icon size={26} strokeWidth={1.5} className="text-ink" />
                </div>
                <h3 className="font-display text-[24px] font-medium leading-tight mb-3">{s.title}</h3>
                <p className="text-[14px] text-ink/65 leading-snug mb-6">{s.description}</p>
                <a
                  href="#calculator"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.15em] text-brand"
                >
                  Подробнее
                  <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
