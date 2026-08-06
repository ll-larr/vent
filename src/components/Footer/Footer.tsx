import Link from 'next/link';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/lib/nav';

export function Footer() {
  return (
    <footer className="bg-ink text-bg mt-6">
      <div className="max-w-[1320px] mx-auto px-4 pt-[60px] pb-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-7 lg:gap-[30px] items-start">
        {/* Mark */}
        <div className="flex flex-col gap-4 max-w-[360px]">
          <div className="font-display font-light text-[clamp(40px,5vw,76px)] leading-[.95] tracking-[-.025em]">
            vent<em className="not-italic font-logo text-accent text-[.85em]">.team</em>
            <br />
            чистим то,
            <br />
            что <em className="italic text-accent">не&nbsp;видно.</em>
          </div>
          <p className="font-sans text-[13px] text-bg/65 max-w-[36ch] leading-[1.5]">
            Промышленный сервис по чистке вентиляции, вытяжек и зонтов. Москва и область в радиусе 100 км, с 2021 года.
          </p>
        </div>

        <FooterCol
          title="услуги"
          items={[
            { label: 'Чистка от жира', href: '/uslugi/chistka-ot-zhira' },
            { label: 'Чистка от пыли', href: '/uslugi/chistka-ot-pyli' },
            { label: 'Зонты и вытяжки', href: '/uslugi/vytyazhki-i-zonty' },
            { label: 'Дезинфекция', href: '/uslugi/dezinfekciya' },
            { label: 'Видеоинспекция', href: '/uslugi/videoinspekciya' },
          ]}
        />
        <FooterCol
          title="компания"
          items={[
            { label: 'Кейсы', href: '#cases' },
            { label: 'Объекты', href: '#venues' },
            { label: 'Процесс', href: '#process' },
            { label: 'Лицензии', href: '#trust' },
            { label: 'Статьи', href: '/blog' },
            { label: 'Калькулятор', href: '/calculator' },
            { label: 'Контакты', href: '/contacts' },
          ]}
        />
        <FooterCol
          title="контакты"
          items={[
            { label: CONTACT_PHONE, href: CONTACT_PHONE_HREF },
            { label: CONTACT_EMAIL, href: CONTACT_EMAIL_HREF },
            { label: 'Telegram', href: 'https://t.me/vent' },
            { label: 'WhatsApp', href: 'https://wa.me/74951200404' },
          ]}
        />
      </div>

      <div
        className="max-w-[1320px] mx-auto px-4 pt-4.5 pb-8 flex justify-between gap-3 flex-wrap font-mono text-[10.5px] uppercase tracking-[.12em] text-bg/50"
        style={{ borderTop: '1px solid rgba(246,243,236,.1)' }}
      >
        <span>© 2021–2026 Vent.team</span>
        <Link
          href="/privacy"
          className="text-bg/70 border-b border-bg/[.15] hover:text-accent hover:border-accent transition-colors"
        >
          Политика конфиденциальности
        </Link>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h6 className="font-mono text-[11px] uppercase tracking-[.14em] text-bg/55 mb-3.5">{title}</h6>
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {items.map((it) => (
          <li key={it.label}>
            {it.href.startsWith('/') ? (
              <Link
                href={it.href}
                className="font-mono text-[12px] tracking-[.06em] text-bg/85 uppercase hover:text-accent transition-colors"
              >
                {it.label}
              </Link>
            ) : (
              <a
                href={it.href}
                className="font-mono text-[12px] tracking-[.06em] text-bg/85 uppercase hover:text-accent transition-colors"
              >
                {it.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
