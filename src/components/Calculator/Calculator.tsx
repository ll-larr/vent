'use client';
import { useState, useCallback } from 'react';
import { PACKAGES, SERVICES, calculatePrice, formatPrice, getPackageById } from '@/lib/pricing';
import { UtensilsCrossed, Building2, Factory, Settings2, CheckCircle2, ArrowRight } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react';
import type { PackageId, ServiceId, CalculatorState } from './types';

interface CalculatorProps {
  onOrder: (services: ServiceId[], area: number) => void;
}

const PACKAGE_ICONS: Record<PackageId, LucideIcon> = {
  catering:   UtensilsCrossed,
  office:     Building2,
  production: Factory,
  custom:     Settings2,
};

const DEFAULT_AREA = 100;
const DEFAULT_HOOD_COUNT = 3;

export default function Calculator({ onOrder }: CalculatorProps) {
  const [state, setState] = useState<CalculatorState>({
    packageId: 'catering',
    selectedServices: getPackageById('catering').defaultServices,
    area: DEFAULT_AREA,
    hoodCount: DEFAULT_HOOD_COUNT,
  });

  const selectPackage = useCallback((id: PackageId) => {
    setState((prev) => ({
      ...prev,
      packageId: id,
      selectedServices: getPackageById(id).defaultServices,
    }));
  }, []);

  const toggleService = useCallback((id: ServiceId) => {
    setState((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }));
  }, []);

  const price = calculatePrice(state);
  const hasServices = state.selectedServices.length > 0;

  return (
    <section id="calculator" className="py-24 px-4 sm:px-6 bg-stone">
      <div className="max-w-content mx-auto">

        {/* Section header */}
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand mb-3 block">
            Рассчитать стоимость
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-ink leading-[1.1] mb-4">
            Калькулятор услуг
          </h2>
          <p className="text-brand-muted text-lg">
            Выберите пакет под ваш объект — получите ориентировочную стоимость
          </p>
        </div>

        <div className="bg-white rounded-xl2 border border-black/[0.05] shadow-lifted overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">

            {/* Left: configuration */}
            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-black/[0.06]">

              {/* Step 1: Package tabs */}
              <div className="mb-8">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-muted mb-4">
                  Шаг 1 — Выберите пакет
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {PACKAGES.map((pkg) => {
                    const Icon = PACKAGE_ICONS[pkg.id];
                    const active = state.packageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => selectPackage(pkg.id)}
                        className={[
                          'p-4 rounded-xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                          active
                            ? 'bg-brand text-white border-brand shadow-card'
                            : 'bg-brand-light/60 text-brand border-brand/15 hover:border-brand/40 hover:bg-brand-light',
                        ].join(' ')}
                      >
                        <div className="mb-2.5">
                          <Icon size={20} strokeWidth={1.5} />
                        </div>
                        <div className="font-semibold text-sm leading-tight">{pkg.label}</div>
                        <div className={['text-xs mt-1 leading-tight', active ? 'text-white/65' : 'text-brand-muted'].join(' ')}>
                          {pkg.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Services */}
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-muted mb-4">
                  Шаг 2 — Состав и площадь
                </p>

                <div className="space-y-1 mb-6">
                  {SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-light/60 cursor-pointer transition-colors group"
                    >
                      <div className={[
                        'w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all',
                        state.selectedServices.includes(service.id)
                          ? 'bg-brand border-brand'
                          : 'border-brand/25 bg-white group-hover:border-brand/50',
                      ].join(' ')}>
                        {state.selectedServices.includes(service.id) && (
                          <CheckCircle2 size={13} strokeWidth={2.5} className="text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={state.selectedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="sr-only"
                      />
                      <span className="text-sm text-ink/75 flex-1">{service.label}</span>
                      {service.id === 'diagnostics' && (
                        <span className="text-[0.7rem] font-semibold text-brand/70 shrink-0 bg-brand-light px-2 py-0.5 rounded-full">
                          Бесплатно
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Hood count */}
                {state.selectedServices.includes('hoods') && (
                  <div className="mb-4 p-4 bg-brand-light/60 rounded-xl border border-brand/10">
                    <label htmlFor="hood-count" className="block text-sm font-medium text-ink mb-2">
                      Количество вытяжных зонтов
                    </label>
                    <input
                      id="hood-count"
                      type="number"
                      min={1}
                      max={50}
                      value={state.hoodCount}
                      onChange={(e) => setState((p) => ({ ...p, hoodCount: Number(e.target.value) }))}
                      className="w-full border border-brand/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
                    />
                  </div>
                )}

                {/* Area input */}
                <div className="p-4 bg-brand-light/60 rounded-xl border border-brand/10">
                  <label className="block text-sm font-medium text-ink mb-1">
                    Площадь помещения (м²)
                  </label>
                  <p className="text-xs text-brand-muted mb-4">
                    Укажите площадь вашего ресторана, кафе или объекта — не трубы
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={20}
                      max={2000}
                      step={10}
                      value={state.area}
                      onChange={(e) => setState((p) => ({ ...p, area: Number(e.target.value) }))}
                      className="flex-1 accent-brand h-1.5"
                    />
                    <div className="flex items-center gap-1 bg-white border border-brand/20 rounded-lg px-3 py-2 min-w-[88px]">
                      <input
                        type="number"
                        min={20}
                        max={2000}
                        value={state.area}
                        onChange={(e) => setState((p) => ({ ...p, area: Number(e.target.value) }))}
                        className="w-14 text-sm font-semibold text-ink focus:outline-none bg-transparent"
                      />
                      <span className="text-xs text-brand-muted">м²</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: price result */}
            <div className="p-6 sm:p-8 bg-brand text-white flex flex-col">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/40 mb-6">
                Ориентировочная стоимость
              </p>

              {hasServices ? (
                <>
                  <div className="flex-1">
                    <div className="font-display text-[2.4rem] font-semibold tracking-[-0.03em] text-white leading-none mb-1">
                      от {formatPrice(price.min)}
                    </div>
                    {price.max > price.min && (
                      <div className="text-white/50 text-sm mt-1">
                        до {formatPrice(price.max)}
                      </div>
                    )}
                    <p className="text-white/35 text-xs mt-5 leading-relaxed">
                      Точная стоимость — после осмотра объекта специалистом. Выезд бесплатно.
                    </p>

                    <div className="mt-6 space-y-2.5">
                      {state.selectedServices.map((id) => {
                        const s = SERVICES.find((sv) => sv.id === id);
                        return s ? (
                          <div key={id} className="flex items-center gap-2 text-xs text-white/55">
                            <CheckCircle2 size={13} strokeWidth={2} className="text-brand-accent/60 shrink-0" />
                            {s.label}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => onOrder(state.selectedServices, state.area)}
                    className="group mt-8 w-full bg-white text-brand font-semibold py-4 rounded-pill hover:bg-brand-light transition-all flex items-center justify-center gap-2 hover:shadow-float"
                  >
                    Оставить заявку
                    <ArrowRight size={15} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/35 text-sm text-center leading-relaxed px-4">
                  Выберите хотя бы одну услугу слева
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
