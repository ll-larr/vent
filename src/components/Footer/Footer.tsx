import Link from 'next/link';
import { navLinks, LogoSvg } from '@/lib/nav';
import { Phone, Mail, Clock, MapPinned } from '@/lib/icons';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-content mx-auto px-4 sm:px-6 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold text-base mb-4 text-white hover:text-white/90 transition-colors"
            >
              <LogoSvg />
              <span>Clean Vent</span>
            </Link>
            <p className="text-white/45 text-sm leading-relaxed max-w-[200px]">
              Профессиональная чистка вентиляционных систем для бизнеса
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">
              Навигация
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">
              Контакты
            </h4>
            <div className="space-y-3.5">
              <a
                href="tel:+74951234567"
                className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors group"
              >
                <Phone size={14} strokeWidth={1.5} className="shrink-0 text-white/30 group-hover:text-white/60" />
                +7 (495) 123-45-67
              </a>
              <a
                href="mailto:info@cleanvent.ru"
                className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors group"
              >
                <Mail size={14} strokeWidth={1.5} className="shrink-0 text-white/30 group-hover:text-white/60" />
                info@cleanvent.ru
              </a>
            </div>
          </div>

          {/* Working hours */}
          <div>
            <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/35 mb-5">
              Режим работы
            </h4>
            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 text-sm text-white/55">
                <Clock size={14} strokeWidth={1.5} className="shrink-0 text-white/30 mt-0.5" />
                <div>
                  <p>Пн–Пт 9:00–19:00</p>
                  <p className="text-white/30 text-xs mt-0.5">Выезд в выходные по договорённости</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-white/55">
                <MapPinned size={14} strokeWidth={1.5} className="shrink-0 text-white/30 mt-0.5" />
                <div>
                  <p>Москва и область</p>
                  <p className="text-white/30 text-xs mt-0.5">Бесплатный осмотр объекта</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.07] pt-7 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/25">
          <p>© {new Date().getFullYear()} Clean Vent. Все права защищены.</p>
          <Link href="/privacy" className="hover:text-white/50 transition-colors">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
