import Link from 'next/link';
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/site';

/* The story topbar has two lives:

   `story`  — fixed and transparent over the hero, turning solid past 60px.
              The scroll engine flips [data-solid] and the rules in
              globals.css do the colour work.
   `solid`  — sticky and light from the first pixel, used by the article pages
              and every secondary route. The CTA is ink instead of lime there,
              because a lime pill on a cream page has nothing to sit on.

   The menu disappears below 900px in both variants: the mobile reference has
   no burger, only the wordmark and the CTA. */

export type TopbarVariant = 'story' | 'solid';

type NavLink = { id: string; label: string; href: string };

/** Section anchors. `href` is absolute so the menu also works off the home page. */
const SECTION_LINKS: NavLink[] = [
  { id: '02', label: 'Технология', href: '/#02' },
  { id: '03', label: 'Как работаем', href: '/#03' },
  { id: '04', label: 'Преимущества', href: '/#04' },
  { id: '05', label: 'Объекты', href: '/#05' },
  { id: '06', label: 'Скидки', href: '/#06' },
  { id: '08', label: 'Вопросы', href: '/#08' },
];

const NAV_ITEM =
  'story-nav-item relative whitespace-nowrap py-[3px] text-[13.5px] max-[899px]:hidden';

export function Topbar({
  variant = 'story',
  activeArticles = false,
}: {
  variant?: TopbarVariant;
  activeArticles?: boolean;
}) {
  const story = variant === 'story';

  return (
    <header
      data-topbar={variant}
      data-solid={story ? '0' : '1'}
      className={[
        'story-topbar left-0 right-0 top-0 z-[55] flex items-center justify-between',
        'gap-[clamp(12px,2vw,32px)] border-b border-transparent',
        'px-[clamp(18px,3vw,56px)] py-[13px]',
        story ? 'fixed text-bg' : 'sticky text-ink',
      ].join(' ')}
    >
      <Link
        href={story ? '/#01' : '/'}
        className="flex flex-[0_0_auto] items-baseline gap-px font-display text-[21px] font-normal tracking-[-.02em] text-inherit"
      >
        vent
        <span className="story-logo-tail font-logo text-[.9em] text-accent">.team</span>
      </Link>

      <nav
        aria-label="Разделы сайта"
        className="flex flex-1 items-center justify-center gap-[clamp(13px,1.7vw,28px)]"
      >
        {SECTION_LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            data-nav-item={story ? link.id : undefined}
            className={NAV_ITEM}
          >
            {link.label}
            <span className="story-nav-underline absolute bottom-[-3px] left-0 right-0 h-[1.5px]" />
          </Link>
        ))}
        <Link
          href="/blog"
          data-active={activeArticles ? '1' : undefined}
          className="story-topbar-soft relative whitespace-nowrap py-[3px] text-[13.5px] transition-colors duration-[350ms] max-[899px]:hidden"
        >
          Статьи
          {activeArticles && (
            <span className="absolute bottom-[-3px] left-0 right-0 h-[1.5px] bg-brand" />
          )}
        </Link>
      </nav>

      <div className="flex flex-[0_0_auto] items-center gap-[clamp(10px,1.5vw,22px)]">
        <a
          href={CONTACT_PHONE_HREF}
          className="story-topbar-soft whitespace-nowrap font-mono text-[11.5px] tracking-[.06em] text-bg/[.68] transition-colors duration-[350ms] max-[899px]:hidden"
        >
          {CONTACT_PHONE}
        </a>
        <Link
          href="/#07"
          className={[
            'inline-flex items-center gap-[9px] whitespace-nowrap rounded-pill px-[17px] py-[10px]',
            'text-[13px] font-medium transition-colors duration-[350ms]',
            story
              ? 'bg-accent text-ink hover:bg-ink hover:text-accent'
              : 'bg-ink text-bg hover:bg-accent hover:text-ink',
          ].join(' ')}
        >
          Рассчитать <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
