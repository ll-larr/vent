import Link from 'next/link';
import { navLinks } from '@/lib/nav';
import { Phone, Mail, MapPinned } from '@/lib/icons';

export function Footer() {
  return (
    <footer className="bg-ink text-bg px-5 md:px-[5vw] py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <div className="font-display font-medium text-[28px] tracking-[-.02em] flex items-baseline gap-2">
            Vent<span className="text-accent italic font-light">—</span>
            <span className="font-mono text-[11px] tracking-[.1em] uppercase text-bg/55 font-normal">est. 2014</span>
          </div>
          <p className="mt-5 text-[14px] text-bg/65 leading-relaxed max-w-xs">
            Промышленная чистка вентиляции для бизнеса. Москва и Подмосковье.
          </p>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-bg/45 mb-4">навигация</div>
          <ul className="flex flex-col gap-2 text-[14px]">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-accent transition-colors">{l.label}</a>
              </li>
            ))}
            <li>
              <Link href="/contacts" className="hover:text-accent transition-colors">Контакты</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-accent transition-colors">Политика</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-bg/45 mb-4">связаться</div>
          <ul className="flex flex-col gap-3 text-[14px]">
            <li className="flex items-center gap-2.5">
              <Phone size={14} strokeWidth={1.5} className="text-bg/55" />
              <a href="tel:+74951234567" className="hover:text-accent transition-colors">+7 (495) 123-45-67</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={14} strokeWidth={1.5} className="text-bg/55" />
              <a href="mailto:info@cleanvent.ru" className="hover:text-accent transition-colors">info@cleanvent.ru</a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPinned size={14} strokeWidth={1.5} className="text-bg/55" />
              <span className="text-bg/65">Москва и Подмосковье</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-bg/10 flex flex-wrap gap-3 justify-between font-mono text-[11px] uppercase tracking-[.1em] text-bg/45">
        <span>© 2014–2026 Vent</span>
        <span>промышленная чистка вентиляции</span>
      </div>
    </footer>
  );
}

export default Footer;
