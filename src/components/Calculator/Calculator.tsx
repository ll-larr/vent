'use client';
import { useState, useCallback } from 'react';
import { PACKAGES, SERVICES, calculatePrice, formatPrice, getPackageById } from '@/lib/pricing';
import type { PackageId, ServiceId, CalculatorState } from './types';

interface CalculatorProps {
  onOrder: (services: ServiceId[], area: number) => void;
}

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
    <section id="calculator" className="py-24 px-6 bg-bg">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand mb-3 block">
            Рассчитать стоимость
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-gray-900 mb-4">
            Калькулятор услуг
          </h2>
          <p className="text-brand-muted text-lg">
            Выберите пакет под ваш объект — получите ориентировочную стоимость
          </p>
        </div>

        <div className="bg-white rounded-card border border-black/[0.05] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
            {/* Left: configuration */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r border-black/[0.06]">

              {/* Step 1: Package selection */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-muted mb-4">
                  Шаг 1 — Выберите пакет
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => selectPackage(pkg.id)}
                      className={[
                        'p-4 rounded-xl border text-left transition-all',
                        state.packageId === pkg.id
                          ? 'bg-brand text-white border-brand'
                          : 'bg-brand-light text-brand border-brand/20 hover:border-brand',
                      ].join(' ')}
                    >
                      <div className="text-2xl mb-2">{pkg.icon}</div>
                      <div className="font-semibold text-sm">{pkg.label}</div>
                      <div className={`text-xs mt-1 ${state.packageId === pkg.id ? 'text-white/70' : 'text-brand-muted'}`}>
                        {pkg.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Services + area */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand-muted mb-4">
                  Шаг 2 — Состав и площадь
                </p>

                <div className="space-y-1 mb-6">
                  {SERVICES.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-light cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={state.selectedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="w-4 h-4 accent-brand cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 flex-1">{service.label}</span>
                      {service.id === 'diagnostics' && (
                        <span className="text-xs text-brand font-semibold shrink-0">Бесплатно</span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Hood count — only when hoods selected */}
                {state.selectedServices.includes('hoods') && (
                  <div className="mb-4 p-4 bg-brand-light rounded-xl">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Количество вытяжных зонтов
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={state.hoodCount}
                      onChange={(e) =>
                        setState((p) => ({ ...p, hoodCount: Number(e.target.value) }))
                      }
                      className="w-full border border-brand/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white text-gray-900"
                    />
                  </div>
                )}

                {/* Area input */}
                <div className="p-4 bg-brand-light rounded-xl">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Площадь помещения (м²)
                  </label>
                  <p className="text-xs text-brand-muted mb-3">
                    Укажите площадь вашего ресторана, кафе или объекта — не трубы
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={20}
                      max={2000}
                      step={10}
                      value={state.area}
                      onChange={(e) =>
                        setState((p) => ({ ...p, area: Number(e.target.value) }))
                      }
                      className="flex-1 accent-brand"
                    />
                    <div className="flex items-center gap-1 bg-white border border-brand/20 rounded-lg px-3 py-2 min-w-[80px]">
                      <input
                        type="number"
                        min={20}
                        max={2000}
                        value={state.area}
                        onChange={(e) =>
                          setState((p) => ({ ...p, area: Number(e.target.value) }))
                        }
                        className="w-12 text-sm font-semibold text-gray-900 focus:outline-none bg-transparent"
                      />
                      <span className="text-xs text-brand-muted">м²</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: price + CTA */}
            <div className="p-8 bg-brand text-white flex flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/50 mb-6">
                Ориентировочная стоимость
              </p>

              {hasServices ? (
                <>
                  <div className="flex-1">
                    <div className="text-4xl font-bold tracking-[-0.03em] text-white mb-1">
                      от {formatPrice(price.min)}
                    </div>
                    {price.max > price.min && (
                      <div className="text-white/60 text-sm">
                        до {formatPrice(price.max)}
                      </div>
                    )}
                    <p className="text-white/40 text-xs mt-4 leading-relaxed">
                      Точная стоимость — после осмотра объекта специалистом. Выезд бесплатно.
                    </p>
                    <div className="mt-6 space-y-2">
                      {state.selectedServices.map((id) => {
                        const s = SERVICES.find((sv) => sv.id === id);
                        return s ? (
                          <div key={id} className="flex items-center gap-2 text-xs text-white/60">
                            <span className="text-white/30">✓</span>
                            {s.label}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => onOrder(state.selectedServices, state.area)}
                    className="mt-8 w-full bg-white text-brand font-semibold py-4 rounded-pill hover:bg-brand-light transition-colors"
                  >
                    Оставить заявку →
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/40 text-sm text-center">
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
