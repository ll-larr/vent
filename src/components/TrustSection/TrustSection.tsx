'use client';

import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import useCounter from '@/lib/useCounter';

function Stat({ to, label, suffix = '+' }: { to: number; label: string; suffix?: string }) {
  const { value, ref } = useCounter(to);
  return (
    <div>
      <div className="font-display font-light text-[clamp(48px,7vw,96px)] leading-none tracking-[-.03em] text-brand">
        <span ref={ref as React.Ref<HTMLSpanElement>}>{value}</span>
        {suffix}
      </div>
      <div className="font-mono text-[12px] uppercase tracking-[.15em] text-ink/60 mt-2">{label}</div>
    </div>
  );
}

const LICENSES = ['МЧС', 'СЭС', 'СРО', 'ГОСТ Р 53300-2009'];

export function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="trust" className="px-5 md:px-[5vw] py-24 bg-bg">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-end">
        <div data-anim>
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-6">07 / цифры</div>
          <div className="grid grid-cols-2 gap-8">
            <Stat to={200} label="объектов" />
            <Stat to={10} label="лет опыта" />
          </div>
        </div>
        <div data-anim style={{ ['--delay' as any]: '120ms' }}>
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-6">лицензии и допуски</div>
          <div className="flex flex-wrap gap-2">
            {LICENSES.map((l) => (
              <span
                key={l}
                className="px-3 py-2 border border-ink/15 rounded-md font-mono text-[13px] tracking-wide"
              >
                {l}
              </span>
            ))}
          </div>
          <p className="text-[13px] text-ink/55 mt-6 max-w-md leading-snug">
            Работаем по протоколу СЭС и нормативам МЧС. Документы предоставляем при заключении договора.
          </p>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
