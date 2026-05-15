import { ContactForm } from '@/components/ContactForm/ContactForm';

export function ContactSection() {
  return (
    <section id="contact" className="px-5 md:px-[5vw] py-24 bg-ink text-bg" data-anim>
      <div className="max-w-3xl mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[.15em] text-bg/60 mb-3">
          08 / заявка
        </div>
        <h2 className="font-display font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[-.025em] mb-3">
          Оставьте <em className="italic text-accent">заявку.</em>
        </h2>
        <p className="text-bg/70 text-[15px] mb-10 max-w-md">
          Перезвоним в течение 2 часов в рабочее время. Бесплатный осмотр и точная смета.
        </p>
        <ContactForm />
      </div>
    </section>
  );
}

export default ContactSection;
