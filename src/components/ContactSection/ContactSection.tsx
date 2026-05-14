'use client';
import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import ContactForm from '@/components/ContactForm/ContactForm';
import type { ServiceId } from '@/components/Calculator/types';

interface ContactSectionProps {
  preselectedServices?: ServiceId[];
  preselectedArea?: number;
}

export default function ContactSection({
  preselectedServices,
  preselectedArea,
}: ContactSectionProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section id="contacts" ref={ref} className="py-24 px-6 bg-brand">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16" data-anim>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/50 mb-3 block">
            Связаться с нами
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white mb-4">
            Оставить заявку
          </h2>
          <p className="text-white/60 text-lg">
            Перезвоним в течение 30 минут в рабочее время
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start"
          data-anim
        >
          {/* Form — key forces remount when preselected services change from Calculator */}
          <div className="bg-white rounded-card p-8">
            <ContactForm
              key={(preselectedServices ?? []).join(',') + String(preselectedArea)}
              preselectedServices={preselectedServices}
              preselectedArea={preselectedArea}
            />
          </div>

          {/* Contact info */}
          <div className="text-white space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">
                Телефон
              </p>
              <a
                href="tel:+74951234567"
                className="text-2xl font-semibold hover:text-white/80 transition-colors"
              >
                +7 (495) 123-45-67
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">
                Email
              </p>
              <a
                href="mailto:info@cleanvent.ru"
                className="text-lg hover:text-white/80 transition-colors"
              >
                info@cleanvent.ru
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">
                Режим работы
              </p>
              <p className="text-lg">Пн–Пт 9:00–19:00</p>
              <p className="text-white/60 text-sm mt-1">
                Выезд в выходные по договорённости
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">
                Выезд
              </p>
              <p className="text-lg">Москва и область</p>
              <p className="text-white/60 text-sm mt-1">Бесплатный осмотр объекта</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
