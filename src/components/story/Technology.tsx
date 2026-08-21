'use client';

import Image from 'next/image';
import { TECH_STEPS } from '@/data/story';
import { useCalculator } from '@/lib/calculator-context';
import { scrollToSection } from '@/lib/story-scroll';
import type { PackageKey, ServiceKey } from '@/lib/pricing';

/* 02 · Технология.

   A 380vh track whose inner pane is sticky: scrolling through it advances the
   active step and swaps the frame on the left. The engine picks the step from
   the track's scroll progress and writes data-on; the layout — including the
   degraded form on short or narrow viewports — lives in globals.css.

   Steps 03 and 05 are buttons: they preset the calculator and jump to 07. */

/** Which object type a service implies when it is clicked out of context. */
const SVC_TO_PACKAGE: Record<ServiceKey, PackageKey> = {
  grease: 'restaurant',
  hood: 'restaurant',
  impellerGrease: 'restaurant',
  hydrofilter: 'restaurant',
  dust: 'office',
  grille: 'office',
  ahu: 'office',
  impellerAir: 'office',
  valve: 'custom',
  diag: 'custom',
};

const ROW =
  'flex gap-3.5 border-t border-ink/[.14] py-[clamp(9px,1.4vh,14px)] text-left last:border-b';

export function Technology() {
  const { dispatch } = useCalculator();

  const preset = (svc: ServiceKey) => {
    dispatch({ type: 'PRESET', key: SVC_TO_PACKAGE[svc], extra: svc });
    window.setTimeout(() => scrollToSection('07'), 60);
  };

  return (
    <section id="02" data-sec="02" className="bg-bg">
      <div data-track="" className="story-track">
        <div className="story-track-pane">
          <div className="story-track-frames relative overflow-hidden bg-black-deep">
            {TECH_STEPS.map((step, i) => (
              <div
                key={step.n}
                data-frame=""
                data-on={i === 0 ? '1' : '0'}
                className="absolute inset-0 bg-black-deep"
              >
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="(max-width: 899px) 100vw, 44vw"
                  className={`object-cover ${i === 0 ? '[filter:grayscale(.2)]' : ''}`}
                />
              </div>
            ))}
          </div>

          <div className="flex min-w-0 flex-col justify-center pb-[clamp(28px,4vh,48px)] pl-[clamp(22px,3.5vw,60px)] pr-[clamp(22px,4vw,72px)] pt-[clamp(56px,7vh,84px)]">
            <div className="mono-label mb-3 flex items-center gap-[11px] text-[11px] text-ink/50">
              <span aria-hidden="true" className="h-px w-5 bg-brand" />
              02 · технология
            </div>
            <h2 className="mb-2 font-display text-[clamp(30px,3.8vw,64px)] font-light leading-[.98] tracking-[-.032em]">
              Механически,
              <br />
              до металла.
            </h2>
            <p className="mb-[clamp(10px,2vh,20px)] max-w-[54ch] text-[clamp(14.5px,1.05vw,17px)] leading-[1.55] text-ink/65">
              Отложения снимаются щёткой, а не растворителем: жир и пыль вытягиваются из канала в
              фильтр, помещение остаётся чистым. Химию используем только там, где без неё нельзя.
            </p>

            {TECH_STEPS.map((step, i) => {
              const body = (
                <>
                  <span className="mono-label flex-[0_0_22px] pt-[5px] text-[10px] text-brand">
                    {step.n}
                  </span>
                  <span className="min-w-0 flex-[1_1_auto]">
                    <span className="block font-display text-[clamp(18px,1.5vw,26px)] font-normal leading-[1.15] tracking-[-.015em]">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-[14.5px] leading-[1.5] text-ink/65">
                      {step.text}
                    </span>
                    <span
                      data-bar=""
                      className="mt-2.5 block h-px origin-left bg-brand"
                      aria-hidden="true"
                    />
                  </span>
                  {step.price && (
                    <span className="mono-label whitespace-nowrap pt-1.5 text-right text-[10.5px] tracking-[.1em] text-ink/55">
                      {step.price.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  )}
                </>
              );

              return step.svc ? (
                <button
                  key={step.n}
                  type="button"
                  data-item=""
                  data-on={i === 0 ? '1' : '0'}
                  onClick={() => preset(step.svc as ServiceKey)}
                  className={`${ROW} w-full cursor-pointer text-ink`}
                >
                  {body}
                </button>
              ) : (
                <div key={step.n} data-item="" data-on={i === 0 ? '1' : '0'} className={ROW}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Technology;
