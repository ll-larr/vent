'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitSchema, type SubmitFormData, serviceOptions } from '@/lib/schemas';
import { SERVICES } from '@/lib/pricing';
import type { ServiceId } from '@/components/Calculator/types';
import { CheckCircle2, ArrowRight } from '@/lib/icons';
import { z } from 'zod';

const serviceLabels: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.label])
);

interface ContactFormProps {
  preselectedServices?: ServiceId[];
  preselectedArea?: number;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type FormInput = z.input<typeof submitSchema>;

const inputClass =
  'w-full border border-black/[0.12] rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white transition-shadow placeholder:text-ink/30';

export default function ContactForm({
  preselectedServices = [],
  preselectedArea,
}: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, SubmitFormData>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      services: preselectedServices,
      area: preselectedArea,
    },
  });

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
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-brand-light border border-brand/20 rounded-xl2 p-10 text-center flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 size={28} strokeWidth={1.5} className="text-white" />
        </div>
        <h3 className="font-semibold text-xl text-ink">Заявка отправлена!</h3>
        <p className="text-brand-muted text-sm">Перезвоним в течение 30 минут в рабочее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Имя <span className="text-red-400">*</span>
        </label>
        <input {...register('name')} placeholder="Алексей" className={inputClass} />
        {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Телефон <span className="text-red-400">*</span>
        </label>
        <input
          {...register('phone')}
          placeholder="+7 (999) 000-00-00"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className={inputClass}
        />
        {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone.message}</p>}
      </div>

      {/* Object type */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Тип объекта <span className="text-red-400">*</span>
        </label>
        <input
          {...register('objectType')}
          placeholder='Ресторан "Доминос пицца"'
          className={inputClass}
        />
        {errors.objectType && <p className="text-red-400 text-xs mt-1.5">{errors.objectType.message}</p>}
      </div>

      {/* Area — now shown in form */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">
          Площадь помещения (м²)
        </label>
        <input
          {...register('area', { valueAsNumber: true })}
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="Например: 150"
          defaultValue={preselectedArea}
          className={inputClass}
        />
        <p className="text-ink/35 text-xs mt-1.5">
          Укажите примерную площадь — это поможет точнее рассчитать стоимость
        </p>
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-medium text-ink mb-3">
          Какие услуги нужны
        </label>
        <div className="space-y-1.5">
          {serviceOptions.map((id) => (
            <label key={id} className="flex items-center gap-3 cursor-pointer group px-1 py-0.5">
              <input
                type="checkbox"
                value={id}
                {...register('services')}
                defaultChecked={preselectedServices.includes(id as ServiceId)}
                className="w-4 h-4 accent-brand rounded"
              />
              <span className="text-sm text-ink/65 group-hover:text-ink transition-colors">
                {serviceLabels[id] ?? id}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Комментарий</label>
        <textarea
          {...register('comment')}
          rows={3}
          placeholder="Дополнительная информация, удобное время звонка..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group w-full bg-brand text-white font-semibold py-4 rounded-pill hover:bg-brand-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lifted"
      >
        {status === 'loading' ? 'Отправляем...' : (
          <>
            Отправить заявку
            <ArrowRight size={15} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="text-xs text-ink/35 text-center">
        Нажимая кнопку, вы соглашаетесь с{' '}
        <a href="/privacy" className="underline hover:text-brand transition-colors">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );
}
