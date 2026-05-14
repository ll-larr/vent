import Link from 'next/link';
import { navLinks, LogoSvg } from '@/lib/nav';

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-content mx-auto px-6 py-16">
        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-lg mb-4 text-white hover:text-white/90 transition-colors"
            >
              <LogoSvg />
              <span>Clean Vent</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-[220px]">
              Профессиональная чистка вентиляционных систем для бизнеса
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/50">
              Навигация
            </h4>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact info */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/50">
              Контакты
            </h4>
            <div className="space-y-3 text-sm">
              <p>
                <a
                  href="tel:+74951234567"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  +7 (495) 123-45-67
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@cleanvent.ru"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  info@cleanvent.ru
                </a>
              </p>
              <p className="text-white/60">Пн–Пт 9:00–19:00</p>
              <p className="text-white/60">Москва и область</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Clean Vent. Все права защищены.</p>
          <Link href="/privacy" className="hover:text-white/70 transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
