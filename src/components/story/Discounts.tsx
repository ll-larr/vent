import Link from 'next/link';
import { SectionLabel } from './SectionLabel';

/* 06 · Скидки. Two cards on the green surface, seam drawn by `gap: 1px`. */
export function Discounts() {
  return (
    <section
      id="06"
      data-sec="06"
      className="bg-brand px-[clamp(22px,3vw,56px)] py-[clamp(40px,5.5vh,66px)] text-bg"
    >
      <div className="mb-[clamp(18px,2.5vh,28px)] flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          <SectionLabel tone="dark" className="mb-3 text-bg/60">
            06 · условия
          </SectionLabel>
          <h2
            data-reveal=""
            data-delay="70"
            className="font-display text-[clamp(30px,3.6vw,58px)] font-light leading-none tracking-[-.032em] [--reveal-y:22px]"
          >
            Два повода не откладывать.
          </h2>
        </div>
        <Link
          href="/#07"
          data-reveal=""
          data-delay="140"
          className="inline-flex items-center gap-[11px] whitespace-nowrap rounded-pill bg-accent px-[22px] py-[14px] text-[14.5px] font-medium text-ink transition-colors duration-[350ms] hover:bg-bg [--reveal-y:16px]"
        >
          Посчитать со скидкой <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-px bg-bg/20">
        <div
          data-reveal=""
          data-delay="120"
          className="flex items-start gap-[clamp(16px,2vw,28px)] bg-bg p-[clamp(20px,2.2vw,34px)] text-ink [--reveal-y:22px]"
        >
          <div className="flex-[0_0_auto] font-display text-[clamp(46px,5.6vw,96px)] font-light leading-[.82] tracking-[-.045em]">
            −20<span className="text-[.4em]">%</span>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="mono-label text-[10.5px] text-brand">первый заказ</div>
            <p className="text-[clamp(15px,1.05vw,17px)] leading-[1.5] text-ink/75">
              Скидка на первую чистку. Убедитесь в нашем профессионализме на выгодных условиях
            </p>
            <div className="mono-label border-t border-ink/[.14] pt-2 text-[10px] leading-[1.9] tracking-[.1em] text-ink/55">
              заказ от 30 000 ₽ · один раз на объект
            </div>
          </div>
        </div>

        <div
          data-reveal=""
          data-delay="180"
          className="flex items-start gap-[clamp(16px,2vw,28px)] bg-ink p-[clamp(20px,2.2vw,34px)] text-bg [--reveal-y:22px]"
        >
          <div className="flex-[0_0_auto] font-display text-[clamp(46px,5.6vw,96px)] font-light leading-[.82] tracking-[-.045em] text-accent">
            −10<span className="text-[.4em]">%</span>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="mono-label text-[10.5px] text-bg/60">договор на обслуживание</div>
            <p className="text-[clamp(15px,1.05vw,17px)] leading-[1.5] text-bg/[.78]">
              На каждую чистку по договору. Мы приходим по графику раз в 3–6 месяцев и сами
              напоминаем о сроке.
            </p>
            <div className="mono-label border-t border-bg/[.16] pt-2 text-[10px] leading-[1.9] tracking-[.1em] text-bg/55">
              договор от 12 месяцев · все плановые чистки
              <br />
              пока действует договор
            </div>
          </div>
        </div>
      </div>

      <p
        data-reveal=""
        data-delay="240"
        className="mono-label mt-4 max-w-[78ch] text-[10px] leading-[1.9] tracking-[.1em] text-bg/50 [--reveal-y:16px]"
      >
        Скидки не суммируются. Размер и условия зафиксированы в оферте. Скидка не
        распространяется на выезд за пределы Московской области.
      </p>
    </section>
  );
}

export default Discounts;
