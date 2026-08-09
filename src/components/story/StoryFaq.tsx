'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FAQ } from '@/data/story';
import { SectionLabel } from './SectionLabel';

/* 08 · Вопросы.

   Exactly one item is open at a time — clicking the open one closes it and
   leaves the accordion empty (index -1). The plus rotates 45° into a cross
   rather than swapping glyphs. */
export function StoryFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="08"
      data-sec="08"
      className="border-t border-ink/10 bg-bg px-[clamp(22px,3vw,56px)] py-[clamp(48px,6.5vh,80px)]"
    >
      <div className="grid grid-cols-1 items-start gap-[clamp(22px,4vw,64px)] min-[900px]:grid-cols-[34%_1fr]">
        <div className="min-w-0">
          <SectionLabel className="mb-3">08 · вопросы</SectionLabel>
          <h2
            data-reveal=""
            data-delay="70"
            className="mb-[14px] font-display text-[clamp(30px,3.8vw,62px)] font-light leading-none tracking-[-.032em] [--reveal-y:22px]"
          >
            Частые вопросы.
          </h2>
          <p
            data-reveal=""
            data-delay="120"
            className="mb-4 max-w-[34ch] text-[clamp(15px,1.1vw,17px)] leading-[1.6] text-ink/[.66] [--reveal-y:16px]"
          >
            Не нашли свой — спросите у инженера по телефону, отвечаем без скриптов.
          </p>
          <Link
            href="/blog"
            data-reveal=""
            data-delay="170"
            className="mono-label inline-flex items-center gap-[9px] border-b border-brand/40 pb-1 text-[10.5px] text-brand transition-colors duration-300 hover:text-ink [--reveal-y:16px]"
          >
            разборы в статьях <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="flex min-w-0 flex-col">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                data-reveal=""
                data-delay={String(i * 50)}
                className="border-t border-ink/[.16] [--reveal-y:16px]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className={[
                    'flex w-full cursor-pointer items-start justify-between gap-5 py-[clamp(14px,1.9vh,20px)] text-left',
                    'transition-colors duration-300',
                    isOpen ? 'text-ink' : 'text-ink/[.78]',
                  ].join(' ')}
                >
                  <span className="font-display text-[clamp(18px,1.6vw,27px)] font-normal leading-[1.2] tracking-[-.02em]">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={[
                      'grid h-[30px] w-[30px] flex-[0_0_auto] place-items-center rounded-pill text-[15px]',
                      'transition-[background-color,color,transform] duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)]',
                      isOpen ? 'rotate-45 bg-ink text-accent' : 'bg-ink/[.07] text-ink',
                    ].join(' ')}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  hidden={!isOpen}
                  className="max-w-[66ch] pb-[clamp(16px,2vh,22px)]"
                >
                  <p className="text-[clamp(15px,1.05vw,16.5px)] leading-[1.6] text-ink/[.72]">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="border-t border-ink/[.16]" />
        </div>
      </div>
    </section>
  );
}

export default StoryFaq;
