'use client';

import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { MiniCalculator } from '@/components/Calculator/MiniCalculator';
import { ArrowRight } from '@/lib/icons';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section
      ref={ref}
      className="hero-section min-h-dvh px-5 md:px-[5vw] pt-32 pb-20 flex flex-col justify-center bg-bg"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-16 items-end">
        <div>
          <div
            className="inline-flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[.15em] text-ink/55 mb-7"
            data-anim
          >
            <span className="w-6 h-px bg-brand inline-block" />
            01 / промышленная чистка вентсистем
          </div>

          <h1
            className="font-display font-light text-[clamp(56px,7.5vw,124px)] leading-[.97] tracking-[-.025em] text-ink"
            data-anim
            style={{ ['--delay' as any]: '70ms' }}
          >
            Чистим то,<br />
            <em className="italic text-brand font-light">что никто</em>
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '1.5px #141312' }}
            >
              не видит.
            </span>
          </h1>

          <p
            className="font-sans text-[17px] leading-[1.55] text-ink/70 max-w-[440px] mt-9 mb-10"
            data-anim
            style={{ ['--delay' as any]: '140ms' }}
          >
            Спецсервис по чистке вентканалов, вытяжек и зонтов для общепита, офисов и складов.
            С 2014 года, по протоколу МЧС и СЭС.
          </p>

          <div className="flex flex-wrap gap-4 items-center" data-anim style={{ ['--delay' as any]: '210ms' }}>
            <a
              href="#calculator"
              className="group inline-flex items-center gap-2.5 bg-ink text-bg px-6 py-4 rounded-full font-medium text-[15px] hover:bg-brand transition-colors"
            >
              Рассчитать стоимость
              <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#cases"
              className="inline-flex items-center gap-2 text-ink py-4 text-[15px] border-b border-ink hover:gap-3 transition-[gap]"
            >
              Смотреть кейсы
              <ArrowRight size={14} strokeWidth={2} />
            </a>
          </div>

          <div
            className="mt-7 font-mono text-[11px] uppercase tracking-[.15em] text-ink/45 flex flex-wrap gap-x-5 gap-y-2"
            data-anim
            style={{ ['--delay' as any]: '280ms' }}
          >
            <span>● более <b className="text-brand font-normal">200</b> объектов</span>
            <span>● срок <b className="text-brand font-normal">4 дня</b></span>
            <span>● лицензии <b className="text-brand font-normal">МЧС и СЭС</b></span>
          </div>
        </div>

        <div data-anim style={{ ['--delay' as any]: '160ms' }}>
          <MiniCalculator />
        </div>
      </div>
    </section>
  );
}

export default Hero;
