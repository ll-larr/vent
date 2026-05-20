'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitSchema, type SubmitFormData, type SubmitFormInput } from '@/lib/schemas';
import { useCalculator } from '@/lib/calculator-context';
import { useMagnet } from '@/lib/useMagnet';
import { PACKAGES, SERVICES } from '@/lib/pricing';
import { ArrowRight, CheckCircle2 } from '@/lib/icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

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
  // Final-CTA submit gets a stronger magnet pull than body buttons.
  const submitRef = useMagnet<HTMLButtonElement>({ strength: 0.35 });

  const form = useForm<SubmitFormInput, unknown, SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      name: '',
      phone: '',
      packageKey: state.packageKey,
      areaM2: state.areaM2,
      services: state.services,
      comment: '',
      website: '',
    },
  });

  // Sync hidden fields with calculator state
  useEffect(() => {
    form.setValue('packageKey', state.packageKey);
    form.setValue('areaM2', state.areaM2);
    form.setValue('services', state.services);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.packageKey, state.areaM2, state.services]);

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

  if (status === 'success') {
    return (
      <div className="bg-bg rounded-[28px] px-7 py-9 lg:px-[30px] lg:py-12 flex flex-col items-start gap-4" style={{ border: '1px solid rgba(20,19,18,.14)' }}>
        <div className="w-14 h-14 grid place-items-center rounded-full bg-brand text-bg">
          <CheckCircle2 size={28} strokeWidth={1.7} aria-hidden="true" />
        </div>
        <h3 className="font-display font-light text-[clamp(28px,3.8vw,40px)] leading-none tracking-[-.022em]">
          Заявка <em className="italic text-brand">принята.</em>
        </h3>
        <p className="text-ink/65 text-[15px] leading-[1.55] max-w-[44ch]">
          В рабочее время свяжемся за 30 минут. После — на следующее утро. Если срочно — позвоните{' '}
          <a href="tel:+74951200404" className="text-brand border-b border-brand/40 hover:border-brand">
            +7 (495) 120-04-04
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="col-span-12 lg:col-span-7 row-span-3 bg-bg rounded-[28px] px-7 py-7 lg:px-[30px] lg:py-7 min-h-[460px] flex flex-col gap-3.5"
      style={{ border: '1px solid rgba(20,19,18,.14)' }}
      data-anim
      noValidate
    >
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

        {/* Package (read-only display, mirrors calculator) */}
        <div className="bg-surface rounded-[14px] px-3.5 py-3">
          <label htmlFor="ct-pkg" className="block font-mono text-[10px] uppercase tracking-[.14em] text-ink/50">
            тип объекта
          </label>
          <div id="ct-pkg" className="font-sans text-[15px] text-ink mt-1">
            {PACKAGES[state.packageKey].label}
          </div>
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
          <a href="tel:+74951200404" className="underline">+7 (495) 120-04-04</a>.
        </p>
      )}
    </form>
  );
}

export default ContactForm;
