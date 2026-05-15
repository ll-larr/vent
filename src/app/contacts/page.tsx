import type { Metadata } from 'next';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { CalculatorProvider } from '@/lib/calculator-context';
import { Phone, Mail, MapPinned, Clock } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Контакты — Vent',
  description: 'Свяжитесь с Vent — промышленная чистка вентиляции для бизнеса. Москва и Подмосковье.',
};

export default function ContactsPage() {
  return (
    <CalculatorProvider>
      <Header />
      <main className="pt-32 bg-bg">
        <section className="px-5 md:px-[5vw] py-12">
          <div className="max-w-5xl mx-auto">
            <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">
              /contacts
            </div>
            <h1 className="font-display font-light text-[clamp(40px,6vw,84px)] leading-none tracking-[-.025em] mb-12">
              Свяжитесь <em className="italic text-brand">с нами.</em>
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-surface rounded-2xl p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
                  <Phone size={13} strokeWidth={1.5} />
                  Телефон
                </div>
                <a href="tel:+74951234567" className="font-display text-[28px] hover:text-brand transition-colors">
                  +7 (495) 123-45-67
                </a>
                <p className="text-[13px] text-ink/55 mt-2">Перезваниваем в течение 2 часов в рабочее время.</p>
              </div>

              <div className="bg-surface rounded-2xl p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
                  <Mail size={13} strokeWidth={1.5} />
                  Email
                </div>
                <a href="mailto:info@cleanvent.ru" className="font-display text-[28px] hover:text-brand transition-colors">
                  info@cleanvent.ru
                </a>
              </div>

              <div className="bg-surface rounded-2xl p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
                  <MapPinned size={13} strokeWidth={1.5} />
                  География
                </div>
                <div className="font-display text-[22px]">Москва и Подмосковье</div>
                <p className="text-[13px] text-ink/55 mt-2">Выезд по согласованию в другие регионы.</p>
              </div>

              <div className="bg-surface rounded-2xl p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
                  <Clock size={13} strokeWidth={1.5} />
                  Часы работы
                </div>
                <div className="font-display text-[22px]">Пн–Пт · 9:00–20:00</div>
                <p className="text-[13px] text-ink/55 mt-2">Сб–Вс — по предварительной договорённости.</p>
              </div>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </CalculatorProvider>
  );
}
