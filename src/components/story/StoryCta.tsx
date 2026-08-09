import Link from 'next/link';
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/site';

/* The dark closing strip used by every page that is not the story itself:
   article, article list, service pages, contacts. Heading and copy change,
   the shape does not. */
export function StoryCta({
  heading,
  text,
  action = 'Открыть калькулятор',
  href = '/#07',
}: {
  heading: string;
  text: string;
  action?: string;
  href?: string;
}) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-6 bg-ink px-[clamp(22px,3vw,56px)] py-[clamp(40px,6vh,72px)] text-bg">
      <div className="min-w-0">
        <h2 className="mb-2.5 font-display text-[clamp(28px,3.6vw,56px)] font-light leading-none tracking-[-.032em]">
          {heading}
        </h2>
        <p className="max-w-[48ch] text-[clamp(15px,1.1vw,17px)] leading-[1.6] text-bg/70">{text}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href={href}
          className="inline-flex items-center gap-2.5 rounded-pill bg-accent px-6 py-[15px] text-[14.5px] font-medium text-ink transition-colors duration-[350ms] hover:bg-bg"
        >
          {action} <span aria-hidden="true">→</span>
        </Link>
        <a
          href={CONTACT_PHONE_HREF}
          className="inline-flex items-center gap-2.5 rounded-pill border border-bg/[.24] px-[22px] py-3.5 text-[14.5px] transition-colors duration-[350ms] hover:border-accent hover:text-accent"
        >
          {CONTACT_PHONE}
        </a>
      </div>
    </section>
  );
}

export default StoryCta;
