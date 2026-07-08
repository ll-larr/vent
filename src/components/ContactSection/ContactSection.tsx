'use client';

import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { ContactForm } from '@/components/ContactForm/ContactForm';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/lib/site';

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="contact" className="px-4 pt-[88px] pb-12">
      <div className="max-w-[1320px] mx-auto px-4 pb-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-3">
        <div data-anim>
          <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-2.5">08 / связаться</div>
          <h2 className="font-display font-light text-[clamp(40px,5.2vw,76px)] leading-[.98] tracking-[-.025em]">
            Оставьте номер — <em className="italic text-brand">перезвоним.</em>
          </h2>
        </div>
        <p className="font-sans text-[14px] text-ink/60 max-w-[38ch] lg:text-right leading-[1.5]" data-anim>
          В рабочее время — за 30 минут. После — на следующее утро.
        </p>
      </div>

      <div className="max-w-[1320px] mx-auto grid grid-cols-12 gap-3" style={{ gridAutoRows: 'minmax(96px, auto)' }}>
        {/* ct-form 7×3 — handled inside ContactForm */}
        <ContactForm />

        {/* ct-info-1 5×1 brand */}
        <div
          className="col-span-12 lg:col-span-5 bg-brand text-bg rounded-[28px] p-[22px_24px] min-h-[150px] flex flex-col justify-between"
          data-anim
        >
          <h5 className="font-mono text-[11px] uppercase tracking-[.14em] text-bg/70">прямой контакт</h5>
          <div>
            <a
              href={CONTACT_PHONE_HREF}
              className="block font-display font-light text-[clamp(28px,3.2vw,40px)] tracking-[-.015em] leading-none hover:text-accent transition-colors"
            >
              {CONTACT_PHONE}
            </a>
            <a
              href={CONTACT_EMAIL_HREF}
              className="block font-mono text-[12.5px] text-bg/85 mt-1.5 hover:text-accent transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-bg/60">
            пн–вс · круглосуточно по заявкам
          </span>
        </div>

        {/* ct-hours 5×1 surface */}
        <div
          className="col-span-12 lg:col-span-5 bg-surface rounded-[28px] p-[22px_24px] min-h-[150px] flex flex-col justify-between"
          data-anim
          style={{ ['--delay' as any]: '60ms' }}
        >
          <h5 className="font-mono text-[11px] uppercase tracking-[.14em] text-ink/50">часы дежурства</h5>
          <div className="font-display font-light text-[38px] leading-none tracking-[-.02em]">
            <em className="italic text-brand">24 / 7</em> диспетчер
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[.1em] text-ink/55 flex flex-col gap-1">
            <span>пн–пт · выезд за 1 день</span>
            <span>сб–вс · аварийные за 4 часа</span>
          </div>
        </div>

        {/* ct-area 5×1 accent */}
        <div
          className="col-span-12 lg:col-span-5 bg-accent rounded-[28px] p-[22px_24px] min-h-[150px] flex flex-col justify-between"
          data-anim
          style={{ ['--delay' as any]: '120ms' }}
        >
          <h5 className="font-mono text-[11px] uppercase tracking-[.14em] text-ink/60">география</h5>
          <div className="font-display font-light text-[30px] leading-[1.05] tracking-[-.015em]">
            Москва, СПб,
            <br />
            48 регионов РФ
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[.1em] text-ink/60">
            база ↗ мск / спб / казань / екатеринбург
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
