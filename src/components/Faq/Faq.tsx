import type { ReactNode } from 'react';
import { Plus } from '@/lib/icons';

export type FaqItem = { q: string; a: ReactNode };

// `<details>`/`<summary>` — accessible accordion with zero JS, and crawlers
// see the answer text without needing to execute anything.
//
// This component renders markup ONLY. FAQPage JSON-LD needs plain-text
// answers (schema.org acceptedAnswer.text), but `a` here is ReactNode so it
// can carry links/emphasis — the consuming page must build its own
// plain-text items and call faqSchema() from src/lib/schema.ts separately.
export function Faq({ items, heading }: { items: FaqItem[]; heading?: string }) {
  return (
    <div>
      {heading && (
        <h2 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-.015em] leading-[1.15] mb-5">
          {heading}
        </h2>
      )}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group bg-surface rounded-2xl shadow-card px-6 open:pb-5 [&::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none font-display text-[17px] tracking-[-.005em] text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus
                size={16}
                strokeWidth={1.75}
                className="flex-shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <div className="text-[14.5px] text-ink/65 leading-[1.6] pr-8">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default Faq;
