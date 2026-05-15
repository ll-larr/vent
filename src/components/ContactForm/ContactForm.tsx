'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitSchema, type SubmitFormData, type SubmitFormInput } from '@/lib/schemas';
import { SERVICES, PACKAGES } from '@/lib/pricing';
import { useCalculator } from '@/lib/calculator-context';
import { CheckCircle2, ArrowRight, Check } from '@/lib/icons';

type Status = 'idle' | 'loading' | 'success' | 'error';

const inputBase =
  'w-full bg-white/[.04] border border-white/15 rounded-xl px-4 py-3 text-[15px] text-bg placeholder:text-bg/35 focus:outline-none focus:border-accent focus:bg-white/[.08] transition-colors';
const labelBase = 'block text-[13px] font-medium text-bg/85 mb-2';
const errBase = 'text-red-300 text-xs mt-1.5';

// Phone mask helper: format input to +7 (XXX) XXX-XX-XX
function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^[78]/, '').slice(0, 10);
  let out = '+7';
  if (digits.length === 0) return out;
  out += ' (' + digits.slice(0, 3);
  if (digits.length >= 3) out += ')';
  if (digits.length > 3) out += ' ' + digits.slice(3, 6);
  if (digits.length > 6) out += '-' + digits.slice(6, 8);
  if (digits.length > 8) out += '-' + digits.slice(8, 10);
  return out;
}

export function ContactForm() {
  const { state } = useCalculator();
  const [status, setStatus] = useState<Status>('idle');

  const form = useForm<SubmitFormInput, unknown, SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      name: '',
      phone: '',
      packageKey: state.packageKey,
      areaM2: state.areaM2,
      services: state.services,
      comment: '',
      consent: false,
    },
  });

  // Keep form in sync when calculator state changes (without remounting)
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
      <div className="bg-accent/15 border border-accent/30 rounded-2xl p-10 text-center flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center">
          <CheckCircle2 size={28} strokeWidth={2} className="text-ink" />
        </div>
        <h3 className="font-display text-2xl text-bg">Заявка принята</h3>
        <p className="text-bg/65 text-sm max-w-sm">Свяжемся в течение 2 часов в рабочее время.</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Prefill summary */}
      <div className="flex flex-wrap gap-2 mb-2 text-[12px] font-mono uppercase tracking-wider text-bg/55">
        <span className="px-2 py-1 bg-white/[.08] rounded-md">{PACKAGES[state.packageKey].label}</span>
        <span className="px-2 py-1 bg-white/[.08] rounded-md">{state.areaM2} м²</span>
        {state.services.map((k) => (
          <span key={k} className="px-2 py-1 bg-white/[.08] rounded-md">{SERVICES[k].label}</span>
        ))}
      </div>

      {/* packageKey, areaM2, services live in form state via setValue (see useEffect) */}

      <div>
        <label className={labelBase} htmlFor="cf-name">
          Имя <span className="text-accent">*</span>
        </label>
        <input id="cf-name" {...form.register('name')} placeholder="Алексей" className={inputBase} autoComplete="name" />
        {form.formState.errors.name && <p className={errBase}>{form.formState.errors.name.message}</p>}
      </div>

      <div>
        <label className={labelBase} htmlFor="cf-phone">
          Телефон <span className="text-accent">*</span>
        </label>
        <Controller
          control={form.control}
          name="phone"
          render={({ field }) => (
            <input
              id="cf-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (___) ___-__-__"
              className={inputBase}
              value={field.value}
              onChange={(e) => field.onChange(maskPhone(e.target.value))}
            />
          )}
        />
        {form.formState.errors.phone && <p className={errBase}>{form.formState.errors.phone.message}</p>}
      </div>

      <div>
        <label className={labelBase} htmlFor="cf-comment">Комментарий</label>
        <textarea
          id="cf-comment"
          {...form.register('comment')}
          rows={3}
          placeholder="Удобное время звонка, особенности объекта…"
          className={`${inputBase} resize-none`}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <span className="relative mt-0.5 flex-shrink-0">
          <input type="checkbox" {...form.register('consent')} className="peer sr-only" />
          <span className="w-5 h-5 rounded border-[1.5px] border-bg/30 peer-checked:bg-accent peer-checked:border-accent inline-flex items-center justify-center transition-colors">
            <Check size={12} strokeWidth={3} color="#141312" className="opacity-0 peer-checked:opacity-100" />
          </span>
        </span>
        <span className="text-[13px] text-bg/65 leading-snug">
          Согласен с обработкой персональных данных в соответствии с{' '}
          <a href="/privacy" className="underline hover:text-bg">политикой конфиденциальности</a>.
        </span>
      </label>
      {form.formState.errors.consent && <p className={errBase}>{form.formState.errors.consent.message}</p>}

      {status === 'error' && (
        <p role="alert" className="text-red-300 text-sm bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-3">
          Не удалось отправить. Попробуйте ещё раз или позвоните нам.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group w-full bg-accent text-ink font-semibold py-4 rounded-full hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? 'Отправляем…' : (
          <>
            Отправить заявку
            <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;
