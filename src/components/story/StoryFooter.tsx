import Link from 'next/link';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  CONTACT_TELEGRAM_HREF,
  CONTACT_WHATSAPP_HREF,
} from '@/lib/site';

/* Two footers, one component:

   `full`    — the landing footer: wordmark slogan, three link columns, legal
               strip. Columns are an auto-fit grid, so they collapse on their
               own without a breakpoint.
   `compact` — the single legal strip used under articles and secondary pages.

   The handoff links "Диагностика" to /uslugi/diagnostika; the route has always
   been /uslugi/videoinspekciya, so the real one is used here (see AUDIT.md). */

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: 'услуги',
    links: [
      { label: 'Чистка от жира', href: '/uslugi/chistka-ot-zhira' },
      { label: 'Чистка от пыли', href: '/uslugi/chistka-ot-pyli' },
      { label: 'Зонты и вытяжки', href: '/uslugi/vytyazhki-i-zonty' },
      { label: 'Диагностика', href: '/uslugi/videoinspekciya' },
    ],
  },
  {
    title: 'компания',
    links: [
      { label: 'Технология', href: '/#02' },
      { label: 'Порядок работы', href: '/#03' },
      { label: 'Объекты и работы', href: '/#05' },
      { label: 'Калькулятор', href: '/#07' },
      { label: 'Вопросы', href: '/#08' },
      { label: 'Статьи', href: '/blog' },
    ],
  },
  {
    title: 'контакты',
    links: [
      { label: CONTACT_PHONE, href: CONTACT_PHONE_HREF, external: true },
      { label: CONTACT_EMAIL, href: CONTACT_EMAIL_HREF, external: true },
      { label: 'Telegram', href: CONTACT_TELEGRAM_HREF, external: true },
      { label: 'WhatsApp', href: CONTACT_WHATSAPP_HREF, external: true },
    ],
  },
];

const LINK_CLASS = 'py-1 text-bg/85 transition-colors duration-300 hover:text-accent';

const LEGAL_STRIP =
  'mono-label flex flex-wrap justify-between gap-[14px] text-[10px] tracking-[.12em] text-bg/45';

export function StoryFooter({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <footer className="bg-ink px-[clamp(22px,3vw,56px)] pb-7 pt-0 text-bg">
        <div className={`${LEGAL_STRIP} border-t border-bg/[.12] pt-4`}>
          <span>Vent.team · чистка вентиляции · москва и область</span>
          <Link href="/" className="border-b border-bg/20 text-bg/70 hover:text-accent">
            На главную
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-ink px-[clamp(22px,3vw,56px)] pb-7 pt-[clamp(44px,6vh,76px)] text-bg">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] items-start gap-[clamp(24px,3vw,56px)]">
        <div className="col-span-2 min-w-0 max-[719px]:col-span-1">
          <div className="font-display text-[clamp(30px,4.4vw,72px)] font-light leading-[.93] tracking-[-.032em]">
            vent
            <span className="font-logo text-[.85em] text-accent">.team</span>
            <br />
            чистим то,
            <br />
            что не видно.
          </div>
          <p className="mt-4 max-w-[38ch] text-[14px] leading-[1.55] text-bg/60">
            Промышленный сервис по чистке вентиляции, вытяжек и зонтов. Москва и область в
            радиусе 100 км.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <div className="mono-label mb-[14px] text-[10.5px] text-bg/50">{column.title}</div>
            <div className="mono-label flex flex-col gap-px text-[11.5px] tracking-[.06em]">
              {column.links.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className={LINK_CLASS}
                    {...(link.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className={LINK_CLASS}>
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={`${LEGAL_STRIP} mt-[34px] border-t border-bg/10 pt-4`}>
        <span>Vent.team · реквизиты — после регистрации юрлица</span>
        <Link href="/privacy" className="border-b border-bg/20 text-bg/70 hover:text-accent">
          Политика конфиденциальности
        </Link>
      </div>
    </footer>
  );
}

export default StoryFooter;
