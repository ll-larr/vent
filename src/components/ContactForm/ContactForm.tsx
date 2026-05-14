'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitSchema, type SubmitFormData, serviceOptions } from '@/lib/schemas';
import { SERVICES } from '@/lib/pricing';
import type { ServiceId } from '@/components/Calculator/types';
import { z } from 'zod';

const serviceLabels: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.label])
);

interface ContactFormProps {
  preselectedServices?: ServiceId[];
  preselectedArea?: number;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

// Input type (before Zod transforms defaults) for useForm
type FormInput = z.input<typeof submitSchema>;

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
      <div className="bg-brand-light border border-brand/20 rounded-card p-10 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-semibold text-xl text-gray-900 mb-2">Заявка отправлена!</h3>
        <p className="text-brand-muted">Перезвоним в течение 30 минут в рабочее время</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          Имя <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          placeholder="Алексей"
          className="w-full border border-brand/20 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          {...register('phone')}
          placeholder="+7 (999) 000-00-00"
          type="tel"
          className="w-full border border-brand/20 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Object type */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          Тип объекта <span className="text-red-500">*</span>
        </label>
        <input
          {...register('objectType')}
          placeholder='Ресторан "Доминос пицца"'
          className="w-full border border-brand/20 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
        />
        {errors.objectType && (
          <p className="text-red-500 text-xs mt-1">{errors.objectType.message}</p>
        )}
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Какие услуги нужны
        </label>
        <div className="space-y-2">
          {serviceOptions.map((id) => (
            <label key={id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                value={id}
                {...register('services')}
                defaultChecked={preselectedServices.includes(id as ServiceId)}
                className="w-4 h-4 accent-brand"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {serviceLabels[id] ?? id}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1.5">
          Комментарий
        </label>
        <textarea
          {...register('comment')}
          rows={3}
          placeholder="Дополнительная информация об объекте, удобное время звонка..."
          className="w-full border border-brand/20 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-brand text-white font-semibold py-4 rounded-pill hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
      </button>

      <p className="text-xs text-brand-muted text-center">
        Нажимая кнопку, вы соглашаетесь с{' '}
        <a href="/privacy" className="underline hover:text-brand transition-colors">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );
}
