import { ADVANTAGES } from '@/data/story';
import { SectionLabel } from './SectionLabel';

/* 04 · Преимущества.

   The card grid draws its rules with `gap: 1px` over a tinted background plus
   a border of the same colour, not with per-card borders — borders would
   double up on every seam. */
export function Advantages() {
  return (
    <section
      id="04"
      data-sec="04"
      className="bg-ink px-[clamp(22px,3vw,56px)] py-[clamp(48px,6.5vh,80px)] text-bg"
    >
      <div className="mb-[clamp(24px,3.5vh,40px)] flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0 flex-[1_1_460px]">
          <SectionLabel tone="dark" className="mb-[14px]">
            04 · ответственность
          </SectionLabel>
          <h2
            data-reveal=""
            data-delay="80"
            className="font-display text-[clamp(32px,4.4vw,76px)] font-light leading-[.98] tracking-[-.034em] [--reveal-y:26px]"
          >
            Наши преимущества —
            <br />
            <span className="text-accent">ваши привилегии.</span>
          </h2>
        </div>
        <p
          data-reveal=""
          data-delay="150"
          className="flex-[0_1_40ch] text-justify text-[clamp(15px,1.1vw,18px)] leading-[1.6] text-bg/70 [--reveal-y:18px]"
        >
          Всё, что обычно съедает время заказчика — согласования, документы, контроль
          качества — мы берём на себя и фиксируем в договоре.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(258px,1fr))] gap-px border border-bg/[.16] bg-bg/[.16]">
        {ADVANTAGES.map((item, i) => (
          <div
            key={item.n}
            data-reveal=""
            data-delay={String(i * 60)}
            className="flex min-h-[180px] flex-col gap-[9px] bg-ink p-[clamp(20px,2vw,30px)] transition-colors duration-[400ms] hover:bg-ink-hover [--reveal-y:20px]"
          >
            <span className="mono-label text-[10px] tracking-[.16em] text-accent">{item.n}</span>
            <h3 className="font-display text-[clamp(20px,1.6vw,27px)] font-normal leading-[1.12] tracking-[-.02em]">
              {item.title}
            </h3>
            <p className="text-[15px] leading-[1.55] text-bg/[.68]">{item.text}</p>
          </div>
        ))}
      </div>

      <div
        data-reveal=""
        data-delay="300"
        className="mt-[clamp(20px,3vh,32px)] flex flex-wrap items-center justify-between gap-[18px] [--reveal-y:18px]"
      >
        <p className="font-display text-[clamp(22px,2.6vw,42px)] font-light leading-[1.08] tracking-[-.03em] text-accent">
          Можете быть спокойны за вентиляцию.
        </p>
        <p className="mono-label max-w-[52ch] text-[9.5px] leading-[1.9] tracking-[.12em] text-bg/45">
          условия зафиксированы в договоре и оферте · дополнительные услуги после подписания
          договора фиксируются отдельно
        </p>
      </div>
    </section>
  );
}

export default Advantages;
