'use client';

import { useState } from 'react';
import Image from 'next/image';
import { OBJECT_TABS } from '@/data/story';
import { useCalculator } from '@/lib/calculator-context';
import { scrollToSection } from '@/lib/story-scroll';
import { SectionLabel } from './SectionLabel';
import { CompareSlider } from './CompareSlider';

/* 05 · Объекты и примеры работ.

   Three object tabs, three before/after pairs each: one large slider and two
   stacked beside it. Switching tabs swaps all six photos and replays the
   intro. The CTA presets the calculator for the selected type and jumps to
   section 07. */

export function Objects() {
  const [tabKey, setTabKey] = useState(OBJECT_TABS[0].key);
  const { dispatch } = useCalculator();
  const tab = OBJECT_TABS.find((t) => t.key === tabKey) ?? OBJECT_TABS[0];

  const calculateForTab = () => {
    dispatch({ type: 'PRESET', key: tab.key });
    window.setTimeout(() => scrollToSection('07'), 60);
  };

  return (
    <section
      id="05"
      data-sec="05"
      className="bg-bg px-[clamp(22px,3vw,56px)] py-[clamp(48px,6.5vh,80px)]"
    >
      <SectionLabel className="mb-3.5">05 · объекты · примеры работ</SectionLabel>
      <div className="mb-[clamp(20px,3vh,34px)] flex flex-wrap items-end justify-between gap-5">
        <h2
          data-reveal=""
          data-delay="80"
          className="flex-[1_1_420px] font-display text-[clamp(34px,4.6vw,80px)] font-light leading-[.95] tracking-[-.034em] [--reveal-y:26px]"
        >
          Найдите <span className="italic text-brand">свой объект.</span>
        </h2>
        <p
          data-reveal=""
          data-delay="150"
          className="flex-[0_1_38ch] text-[clamp(15px,1.1vw,18px)] leading-[1.6] text-ink/[.66] [--reveal-y:18px]"
        >
          Выберите тип объекта — увидите состав работ и наши кадры «до / после» с этого типа.
          Ползунок в центре снимка можно тянуть.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(10px,1.2vw,16px)]">
        {OBJECT_TABS.map((item) => {
          const on = item.key === tabKey;
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={on}
              onClick={() => setTabKey(item.key)}
              className={`flex cursor-pointer flex-col gap-3 border p-[clamp(14px,1.4vw,20px)] text-left transition-colors duration-[400ms] ${
                on ? 'border-ink bg-ink text-bg' : 'border-ink/[.14] bg-surface text-ink'
              }`}
            >
              <span className="relative block h-[clamp(78px,9vw,116px)] overflow-hidden bg-black-deep">
                <Image
                  src={item.thumb}
                  alt=""
                  fill
                  sizes="(max-width: 899px) 100vw, 30vw"
                  className={`object-cover transition-opacity duration-[400ms] ${
                    on ? 'opacity-100' : 'opacity-75'
                  }`}
                />
              </span>
              <span className="block font-display text-[clamp(19px,1.6vw,26px)] font-normal leading-[1.1] tracking-[-.02em]">
                {item.title}
              </span>
              <span className="block text-[14px] leading-[1.45] opacity-70">{item.sub}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-[clamp(12px,1.5vw,18px)] bg-ink p-[clamp(14px,1.5vw,22px)] text-bg">
        <div className="grid grid-cols-1 gap-[clamp(10px,1.2vw,16px)] min-[900px]:grid-cols-[2.05fr_1fr]">
          <CompareSlider
            replayKey={tab.key}
            before={tab.pairs[0].before}
            after={tab.pairs[0].after}
            caption={tab.pairs[0].caption}
            sizes="(max-width: 899px) 100vw, 60vw"
            className="min-h-[48vh] min-[900px]:min-h-[clamp(320px,52vh,560px)]"
          />
          <div className="grid min-h-[38vh] grid-rows-2 gap-[clamp(10px,1.2vw,16px)] min-[900px]:min-h-0">
            {tab.pairs.slice(1).map((pair) => (
              <CompareSlider
                key={pair.caption}
                size="side"
                replayKey={tab.key}
                before={pair.before}
                after={pair.after}
                caption={pair.caption}
                sizes="(max-width: 899px) 100vw, 30vw"
              />
            ))}
          </div>
        </div>

        <div className="mt-[clamp(14px,1.8vh,22px)] grid grid-cols-1 gap-[clamp(18px,3vw,52px)] border-t border-bg/[.14] pt-[clamp(18px,2.4vh,28px)] min-[900px]:grid-cols-[1.1fr_1fr]">
          <div className="min-w-0">
            <h3 className="mb-2.5 font-display text-[clamp(26px,3vw,46px)] font-light leading-none tracking-[-.03em]">
              {tab.heading}
            </h3>
            <p className="max-w-[46ch] text-[clamp(15px,1.05vw,17px)] leading-[1.55] text-bg/70">
              {tab.description}
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-[9px]">
            {tab.bullets.map((bullet) => (
              <span
                key={bullet}
                className="flex gap-[11px] text-[clamp(14.5px,1.05vw,16.5px)] leading-[1.5] text-bg/[.82]"
              >
                <span aria-hidden="true" className="flex-[0_0_auto] text-accent">
                  •
                </span>
                {bullet}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(16px,2.2vh,26px)] flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={calculateForTab}
            className="inline-flex cursor-pointer items-center gap-[11px] rounded-pill bg-accent px-6 py-[15px] text-[14.5px] font-medium text-ink transition-colors duration-[350ms] hover:bg-bg"
          >
            Рассчитать для такого объекта <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Objects;
