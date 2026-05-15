'use client';

import { PackageChips } from './PackageChips';
import { ServiceList } from './ServiceList';
import { AreaInput } from './AreaInput';
import { PriceResult } from './PriceResult';

export function Calculator() {
  return (
    <section id="calculator" className="bg-ink/[.03] py-24" data-anim>
      <div className="max-w-[1100px] mx-auto px-5 lg:px-0">
        <div className="bg-surface rounded-[32px] p-7 md:p-12 shadow-card">
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
            <span className="w-3.5 h-px bg-brand inline-block" />
            калькулятор стоимости
          </div>
          <h2 className="font-display font-light text-[clamp(36px,4.5vw,64px)] leading-none tracking-[-.02em] mb-2">
            Сколько это <em className="italic text-brand">стоит?</em>
          </h2>
          <p className="text-ink/60 text-[15px] mb-9">
            Выберите пакет, скорректируйте список услуг, укажите площадь — увидите вилку цены до осмотра.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">
                1 / тип объекта
              </div>
              <PackageChips variant="full" />

              <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">
                2 / услуги
              </div>
              <ServiceList />

              <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">
                3 / площадь объекта
              </div>
              <AreaInput variant="full" />
            </div>

            <PriceResult variant="full" />
          </div>
        </div>
      </div>
    </section>
  );
}
