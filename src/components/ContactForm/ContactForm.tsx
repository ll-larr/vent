'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitSchema, type SubmitFormData, type SubmitFormInput } from '@/lib/schemas';
import { useCalculator } from '@/lib/calculator-context';
import { useMagnet } from '@/lib/useMagnet';
import { PACKAGES, SERVICES } from '@/lib/pricing';
import { ArrowRight } from '@/lib/icons';
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from '@/lib/site';

type Status = 'idle' | 'loading' | 'success' | 'error';

// Ticket id shown to the user and written to the first sheet column: VNT-MMDD-XXXX
function generateTicket(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VNT-${mm}${dd}-${rand}`;
}

const PHONE_TEL = CONTACT_PHONE_TEL;
const PHONE_HUMAN = CONTACT_PHONE;

const NEXT_STEPS = [
  { n: '01', label: 'Звонок инженера', desc: 'уточним адрес, объект и удобное окно для выезда', when: '~ 30 мин' },
  { n: '02', label: 'Видеоосмотр и КП', desc: 'фиксируем состояние воздуховодов, считаем точную цену', when: 'в течение дня' },
  { n: '03', label: 'Договор и выезд', desc: 'бригада на объекте в согласованную дату, оплата по факту', when: '1–3 дня' },
];

// Extract digits, drop leading 7/8 from 11-digit paste, cap at 10.
function digitsOnly(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (d.length === 11 && (d[0] === '7' || d[0] === '8')) d = d.slice(1);
  return d.slice(0, 10);
}

// Format 10 digits as "999 888 77 66"
function formatPhone(digits: string): string {
  const p = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ].filter(Boolean);
  return p.join(' ');
}

export function ContactForm() {
  const { state } = useCalculator();
  const [status, setStatus] = useState<Status>('idle');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [ticket, setTicket] = useState('');
  // Final-CTA submit gets a stronger magnet pull than body buttons.
  const submitRef = useMagnet<HTMLButtonElement>({ strength: 0.35 });

  const form = useForm<SubmitFormInput, unknown, SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      ticket: '',
      name: '',
      phone: '',
      objectName: '',
      packageKey: state.packageKey,
      areaM2: state.areaM2,
      hoodCount: state.hoodCount,
      services: state.services,
      comment: '',
      website: '',
    },
  });

  // Generate the ticket once on mount (client-only — keeps SSR markup stable and
  // avoids a hydration mismatch from Date/Math.random), then mirror it into the
  // form so it ships as the first field of the payload.
  useEffect(() => {
    const t = generateTicket();
    setTicket(t);
    form.setValue('ticket', t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync hidden fields with calculator state
  useEffect(() => {
    form.setValue('packageKey', state.packageKey);
    form.setValue('areaM2', state.areaM2);
    form.setValue('hoodCount', state.hoodCount);
    form.setValue('services', state.services);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.packageKey, state.areaM2, state.hoodCount, state.services]);

  const onSubmit = async (data: SubmitFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  // "Отправить ещё одну" — reset the form, mint a fresh ticket, show the form again.
  const handleReset = () => {
    const t = generateTicket();
    setTicket(t);
    form.reset({
      ticket: t,
      name: '',
      phone: '',
      objectName: '',
      packageKey: state.packageKey,
      areaM2: state.areaM2,
      hoodCount: state.hoodCount,
      services: state.services,
      comment: '',
      website: '',
    });
    setPhoneDisplay('');
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div
        className="ct-success col-span-12 lg:col-span-7 row-span-3 text-bg rounded-[28px] px-[22px] py-7 sm:px-[34px] sm:py-8 min-h-[460px] flex flex-col justify-between gap-6 relative overflow-hidden"
        style={{ background: 'var(--color-brand)', animation: 'ct-success-in .55s cubic-bezier(.2,.7,.2,1) both' }}
        role="status"
        aria-live="polite"
      >
        {/* decorative lime radial in the bottom-right corner */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            inset: 'auto -25% -55% auto',
            width: '60%',
            aspectRatio: '1 / 1',
            background: 'radial-gradient(closest-side, rgba(200,255,62,.16), transparent 70%)',
          }}
        />

        {/* 1) meta line */}
        <div
          className="relative inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[.14em]"
          style={{ color: 'rgba(246,243,236,.65)' }}
        >
          <span className="inline-block" style={{ width: 22, height: 1, background: 'rgba(246,243,236,.4)' }} aria-hidden="true" />
          заявка №{ticket} · принята
        </div>

        {/* 2) head: checkmark + title */}
        <div className="relative flex flex-wrap items-center gap-[18px]">
          <div
            className="grid place-items-center rounded-full shrink-0"
            style={{
              width: 56,
              height: 56,
              background: 'var(--color-accent)',
              color: 'var(--color-ink)',
              boxShadow: '0 0 0 8px rgba(200,255,62,.12)',
              animation: 'ct-check-pop .6s cubic-bezier(.2,.8,.2,1) .15s both',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="font-display font-light text-[clamp(38px,4.4vw,56px)] leading-none tracking-[-.022em]">
            Заявка <em className="not-italic text-accent">принята.</em>
          </h3>
        </div>

        {/* 3) paragraph */}
        <p className="relative text-[15px] leading-[1.55] max-w-[48ch]" style={{ color: 'rgba(246,243,236,.78)' }}>
          В рабочее время свяжемся за <b className="font-medium text-bg">30 минут</b>. После — на следующее утро.
          Если срочно — позвоните{' '}
          <a href={`tel:${PHONE_TEL}`} className="text-accent" style={{ borderBottom: '1px solid rgba(200,255,62,.4)' }}>
            {PHONE_HUMAN}
          </a>
          .
        </p>

        {/* 4) next-steps */}
        <div className="relative grid" style={{ borderTop: '1px solid rgba(246,243,236,.14)' }}>
          {NEXT_STEPS.map((s) => (
            <div
              key={s.n}
              className="grid grid-cols-[28px_1fr] sm:grid-cols-[36px_1fr_auto] gap-x-3.5 gap-y-0.5 py-3.5 items-baseline"
              style={{ borderBottom: '1px dashed rgba(246,243,236,.14)' }}
            >
              <span className="font-mono text-[10.5px] tracking-[.14em]" style={{ color: 'rgba(246,243,236,.42)' }}>
                {s.n}
              </span>
              <span className="font-display font-normal text-[17px] text-bg leading-[1.2]">
                {s.label}
                <small className="block font-sans text-[12.5px] mt-[3px] tracking-normal" style={{ color: 'rgba(246,243,236,.6)' }}>
                  {s.desc}
                </small>
              </span>
              <span className="col-start-2 sm:col-start-3 font-mono text-[10.5px] uppercase tracking-[.14em] text-accent whitespace-nowrap">
                {s.when}
              </span>
            </div>
          ))}
        </div>

        {/* 5) foot: ticket ref + CTAs */}
        <div className="relative flex flex-wrap items-end justify-between gap-[18px]">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[.14em]" style={{ color: 'rgba(246,243,236,.55)' }}>
              номер заявки
            </div>
            <div
              className="font-mono text-[13px] font-medium text-bg mt-1"
              style={{ letterSpacing: '.08em', fontVariantNumeric: 'tabular-nums' }}
            >
              {ticket}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${PHONE_TEL}`} className="btn-lime">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Позвонить сейчас
            </a>
            <button type="button" onClick={handleReset} className="btn-ghost-on-dark">
              Отправить ещё одну
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="ct-form col-span-12 lg:col-span-7 row-span-3 bg-bg rounded-[28px] px-7 py-7 lg:px-[30px] lg:py-7 min-h-[460px] flex flex-col gap-3.5"
      style={{ border: '1px solid rgba(20,19,18,.14)' }}
      data-anim
      noValidate
    >
      {/* Ticket number — first field so it lands in the first sheet/CRM column */}
      <input type="hidden" id="ct-ticket" {...form.register('ticket')} />

      <div>
        <h3 className="font-display font-light text-[clamp(34px,4.4vw,56px)] leading-none tracking-[-.022em]">
          Заявка <em className="italic text-brand">на выезд.</em>
        </h3>
        <p className="text-ink/60 text-[14px] mt-2.5 max-w-[44ch] leading-[1.55]">
          Осмотр специалистом — с видеодиагностикой, фиксированным счётом и без обязательств.
        </p>
      </div>

      {/* Calculator state preview */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        <span className="font-mono text-[10px] uppercase tracking-[.14em] px-2.5 py-1.5 bg-surface rounded-md text-ink/70">
          {PACKAGES[state.packageKey].label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[.14em] px-2.5 py-1.5 bg-surface rounded-md text-ink/70">
          {state.areaM2} м²
        </span>
        {state.services.map((k) => (
          <span
            key={k}
            className="font-mono text-[10px] uppercase tracking-[.14em] px-2.5 py-1.5 bg-surface rounded-md text-ink/70"
          >
            {SERVICES[k].label}
          </span>
        ))}
      </div>

      {/* Honeypot — kept off-screen but findable to bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...form.register('website')}
        className="sr-only"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
        {/* Name */}
        <div className="bg-surface rounded-[14px] px-3.5 py-3">
          <label htmlFor="ct-name" className="block font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">
            как к вам обращаться
          </label>
          <input
            id="ct-name"
            type="text"
            autoComplete="name"
            placeholder="Иван Иванов"
            {...form.register('name')}
            aria-invalid={!!form.formState.errors.name}
            aria-describedby={form.formState.errors.name ? 'ct-name-err' : undefined}
            className="w-full border-0 outline-0 bg-transparent font-sans text-[15px] text-ink mt-1 placeholder:text-ink/30"
          />
          {form.formState.errors.name && (
            <p id="ct-name-err" role="alert" className="text-[12px] text-red-700 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="bg-surface rounded-[14px] px-3.5 py-3">
          <label htmlFor="ct-phone" className="block font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">
            телефон
          </label>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-sans text-[15px] text-ink select-none">+7</span>
            <Controller
              control={form.control}
              name="phone"
              render={({ field }) => (
                <input
                  id="ct-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={13}
                  placeholder="999 888 77 66"
                  value={phoneDisplay}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData('text');
                    const digits = digitsOnly(pasted);
                    e.preventDefault();
                    setPhoneDisplay(formatPhone(digits));
                    field.onChange(digits.length === 10 ? '+7' + digits : '');
                  }}
                  onChange={(e) => {
                    const digits = digitsOnly(e.target.value);
                    setPhoneDisplay(formatPhone(digits));
                    field.onChange(digits.length === 10 ? '+7' + digits : '');
                  }}
                  onKeyDown={(e) => {
                    if (e.key.length === 1 && !/\d/.test(e.key) && !e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                    }
                  }}
                  aria-invalid={!!form.formState.errors.phone}
                  aria-describedby={form.formState.errors.phone ? 'ct-phone-err' : undefined}
                  className="flex-1 border-0 outline-0 bg-transparent font-sans text-[15px] text-ink placeholder:text-ink/30"
                />
              )}
            />
          </div>
          {form.formState.errors.phone && (
            <p id="ct-phone-err" role="alert" className="text-[12px] text-red-700 mt-1">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        {/* Area override */}
        <div className="bg-surface rounded-[14px] px-3.5 py-3">
          <label htmlFor="ct-area" className="block font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">
            площадь объекта, м²
          </label>
          <input
            id="ct-area"
            type="number"
            inputMode="numeric"
            placeholder="220"
            {...form.register('areaM2', { valueAsNumber: true })}
            aria-invalid={!!form.formState.errors.areaM2}
            aria-describedby={form.formState.errors.areaM2 ? 'ct-area-err' : undefined}
            className="w-full border-0 outline-0 bg-transparent font-sans text-[15px] text-ink mt-1 placeholder:text-ink/30"
          />
          {form.formState.errors.areaM2 && (
            <p id="ct-area-err" role="alert" className="text-[12px] text-red-700 mt-1">
              {form.formState.errors.areaM2.message}
            </p>
          )}
        </div>

        {/* Object — free-text, required (packageKey still ships hidden from calc) */}
        <div className="bg-surface rounded-[14px] px-3.5 py-3">
          <label htmlFor="ct-object" className="block font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">
            объект
          </label>
          <input
            id="ct-object"
            type="text"
            placeholder="напр. ресторан, ул. Тверская 5"
            {...form.register('objectName')}
            aria-invalid={!!form.formState.errors.objectName}
            aria-describedby={form.formState.errors.objectName ? 'ct-object-err' : undefined}
            className="w-full border-0 outline-0 bg-transparent font-sans text-[15px] text-ink mt-1 placeholder:text-ink/30"
          />
          {form.formState.errors.objectName && (
            <p id="ct-object-err" role="alert" className="text-[12px] text-red-700 mt-1">
              {form.formState.errors.objectName.message}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="bg-surface rounded-[14px] px-3.5 py-3 sm:col-span-2">
          <label htmlFor="ct-comment" className="block font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">
            комментарий
          </label>
          <textarea
            id="ct-comment"
            rows={3}
            placeholder="что нужно почистить, когда удобно, есть ли срочность"
            {...form.register('comment')}
            className="w-full border-0 outline-0 bg-transparent font-sans text-[15px] text-ink mt-1 placeholder:text-ink/30 resize-y min-h-[56px]"
          />
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3.5 mt-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[.12em] text-ink/45 flex-1 basis-[360px] leading-[1.5]">
          Отправляя форму, вы соглашаетесь на{' '}
          <a href="/privacy" className="text-ink/70 border-b border-ink/25 hover:text-brand hover:border-brand transition-colors">
            обработку персональных данных
          </a>
          {' '}в соответствии с офертой.
        </span>
        <button
          ref={submitRef}
          type="submit"
          data-magnet
          disabled={status === 'loading'}
          className="btn-ink disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Отправляем…' : 'Отправить заявку'}
          <ArrowRight size={14} strokeWidth={2} className="arrow" aria-hidden="true" />
        </button>
      </div>

      {status === 'error' && (
        <p role="alert" className="text-red-700 text-[13px] mt-2">
          Не удалось отправить. Попробуйте ещё раз или позвоните{' '}
          <a href={`tel:${PHONE_TEL}`} className="underline">{PHONE_HUMAN}</a>.
        </p>
      )}
    </form>
  );
}

export default ContactForm;
