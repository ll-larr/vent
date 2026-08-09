import Image from 'next/image';
import Link from 'next/link';
import { computeEstimate, formatNumber } from '@/lib/pricing';

/* 01 · Кто мы.

   Three stacked layers behind the text: the photo (desaturated, at 40%, moved
   by the shared parallax frame), a diagonal hatch, and the darkening gradient.
   The hook price is computed with the same function the calculator uses, so
   the headline number cannot drift from the estimate below. */

const HOOK = computeEstimate(
  ['grease', 'hood'],
  { unit: 'm2', areaM2: 120, lmValue: 0 },
  'restaurant',
  2,
);

export function Hero() {
  return (
    <section
      id="01"
      data-sec="01"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-ink px-[clamp(22px,3vw,56px)] pb-[clamp(26px,4vh,46px)] pt-24 text-bg"
    >
      <div data-parallax="0.05" className="absolute inset-x-0 -bottom-[8%] -top-[8%]">
        <Image
          src="/images/hero-main.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 [filter:grayscale(.55)_contrast(1.05)]"
        />
        <div className="absolute inset-0 [background:repeating-linear-gradient(112deg,rgba(246,243,236,.05)_0_2px,transparent_2px_10px)]" />
      </div>
      <div className="absolute inset-0 [background:radial-gradient(100%_70%_at_78%_4%,rgba(30,92,50,.34),transparent_62%),linear-gradient(0deg,rgba(14,13,12,.96)_0%,rgba(14,13,12,.5)_58%,rgba(14,13,12,.78)_100%)]" />

      <div className="relative flex flex-col gap-[clamp(16px,2.6vh,30px)]">
        <div
          data-reveal=""
          className="mono-label flex items-center gap-[11px] text-[11px] text-bg/60 [--reveal-y:18px]"
        >
          <span aria-hidden="true" className="h-px w-5 bg-accent" />
          промышленная чистка вентиляции · москва и область
        </div>

        <h1
          data-reveal=""
          data-delay="90"
          className="font-display text-[clamp(50px,10.5vw,190px)] font-light leading-[.88] tracking-[-.04em] [--reveal-y:30px]"
        >
          Чистим то,
          <br />
          что никто{' '}
          {/* The mobile mock breaks before the outlined words; wider screens
              keep the two-line break of the desktop reference. */}
          <br className="min-[560px]:hidden" />
          <span className="hero-outline">не видит.</span>
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-[26px] border-t border-bg/[.14] pt-[clamp(14px,2.2vh,26px)]">
          <p
            data-reveal=""
            data-delay="180"
            className="max-w-[80ch] flex-[1_1_340px] text-[clamp(15px,1.15vw,19px)] leading-[1.6] text-bg/[.74] [--reveal-y:20px]"
          >
            Спецсервис по чистке вентиляционных каналов для ресторанов, офисов и складов.
          </p>
          <div
            data-reveal=""
            data-delay="260"
            className="flex flex-col items-start gap-2.5 pr-[clamp(0px,3vw,48px)] [--reveal-y:20px]"
          >
            <Link
              href="/#07"
              className="inline-flex items-center gap-[11px] border-b border-accent/50 pb-[5px] font-display text-[clamp(19px,1.7vw,28px)] font-light tracking-[-.015em] text-bg transition-colors duration-[350ms] hover:border-accent hover:text-accent"
            >
              Кухня 120 м² — от {formatNumber(HOOK.total)} ₽ <span aria-hidden="true">→</span>
            </Link>
            <span className="mono-label text-[10px] text-bg/45">
              ориентир до осмотра · полный расчёт ниже
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
