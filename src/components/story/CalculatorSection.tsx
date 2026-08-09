'use client';

import { Calculator } from './Calculator';
import { LeadForm } from './LeadForm';

/* 07 · Расчёт и заявка. Calculator on cream, form on white, one seam between
   them. Both halves read the same calculator context, so a preset clicked in
   section 02 or 05 lands in the estimate and in the lead payload at once. */
export function CalculatorSection() {
  const focusForm = () => {
    const el = document.querySelector<HTMLInputElement>('[data-form-name]');
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 140;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: still ? 'auto' : 'smooth' });
    window.setTimeout(() => el.focus({ preventScroll: true }), still ? 0 : 500);
  };

  return (
    <section
      id="07"
      data-sec="07"
      className="grid grid-cols-1 items-stretch bg-bg min-[900px]:grid-cols-[54%_46%]"
    >
      <Calculator onSendEstimate={focusForm} />
      <LeadForm />
    </section>
  );
}

export default CalculatorSection;
