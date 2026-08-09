'use client';

import { useState } from 'react';

/* The per-article FAQ. It is not in the design handoff — it predates the
   redesign and carries the FAQPage markup that earns the rich result — so it
   borrows section 08's accordion behaviour and typography to sit inside the
   article body without looking bolted on. One item open at a time; a second
   click on the open one closes it. */
export function FaqList({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;

  return (
    <section className="mt-[clamp(30px,5vh,56px)] max-w-[68ch]">
      <div className="mono-label mb-4 text-[10px] text-ink/45">коротко по вопросам</div>
      <div className="flex flex-col">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-t border-ink/[.16]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-item-${i}`}
                className={[
                  'flex w-full cursor-pointer items-start justify-between gap-5 py-[clamp(13px,1.7vh,18px)] text-left transition-colors duration-300',
                  isOpen ? 'text-ink' : 'text-ink/[.78]',
                ].join(' ')}
              >
                <span className="font-display text-[clamp(17px,1.4vw,23px)] font-normal leading-[1.2] tracking-[-.02em]">
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
              <div id={`faq-item-${i}`} hidden={!isOpen} className="pb-[clamp(14px,2vh,20px)]">
                <p className="text-[clamp(15px,1.05vw,16.5px)] leading-[1.6] text-ink/[.72]">
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
        <div className="border-t border-ink/[.16]" />
      </div>
    </section>
  );
}

export default FaqList;
