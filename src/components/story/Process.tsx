import { PROCESS_STEPS } from '@/data/story';
import { SectionLabel } from './SectionLabel';

/* 03 · Порядок работы.

   Five cards at >=1180px, three below that with the last one spanning two
   columns, one column under 900px. Each card is a 2px ink rule and text — no
   box, no radius. */
export function Process() {
  return (
    <section
      id="03"
      data-sec="03"
      className="border-t border-ink/10 bg-bg px-[clamp(22px,3vw,56px)] py-[clamp(48px,6.5vh,80px)]"
    >
      <div className="mb-[clamp(24px,3.5vh,42px)] flex flex-wrap items-end justify-between gap-[clamp(20px,3vw,48px)]">
        <SectionLabel className="mb-[14px] flex-[1_1_100%]">03 · порядок работы</SectionLabel>
        <h2
          data-reveal=""
          data-delay="80"
          className="flex-[1_1_420px] font-display text-[clamp(34px,4.6vw,80px)] font-light leading-[.95] tracking-[-.034em] [--reveal-y:26px]"
        >
          От звонка до чистых каналов.
        </h2>
        {/* 351px is a hand-set width from the client, kept alongside the 34ch
            basis exactly as the reference has it. */}
        <p
          data-reveal=""
          data-delay="150"
          className="w-[351px] max-w-full flex-[0_1_34ch] text-[20px] leading-[1.6] text-ink/[.66] [--reveal-y:18px]"
        >
          Пять шагов. Вам нужно участвовать в двух — на осмотре и на приёмке.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[clamp(14px,1.6vw,28px)] min-[900px]:grid-cols-3 min-[1180px]:grid-cols-5">
        {PROCESS_STEPS.map((step, i) => (
          <div
            key={step.n}
            data-reveal=""
            data-delay={String(i * 70)}
            className={[
              'flex flex-col gap-2.5 border-t-2 border-ink pt-[clamp(13px,1.8vh,18px)] [--reveal-y:22px]',
              // The fifth card fills the empty tail of the three-column grid.
              i === PROCESS_STEPS.length - 1
                ? 'min-[900px]:col-span-2 min-[1180px]:col-span-1'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="mono-label text-[10.5px] text-brand">{step.n}</span>
            <div className="min-w-0">
              <h3 className="mb-[5px] font-display text-[clamp(20px,1.8vw,30px)] font-normal leading-[1.1] tracking-[-.015em]">
                {step.title}
              </h3>
              <p className="max-w-[62ch] text-[clamp(14.5px,1.05vw,16.5px)] leading-[1.55] text-ink/70">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Process;
