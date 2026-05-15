'use client';

import { PackageChips } from './PackageChips';
import { AreaInput } from './AreaInput';
import { PriceResult } from './PriceResult';
import { ArrowDown } from '@/lib/icons';

export function MiniCalculator() {
  return (
    <div className="bg-surface rounded-[20px] p-6 shadow-card">
      <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3.5 flex justify-between items-center">
        <span>калькулятор</span>
        <span className="inline-flex items-center gap-1.5 text-brand">
          <span className="w-1.5 h-1.5 bg-brand rounded-full" style={{ animation: 'pulse-soft 1.8s ease-in-out infinite' }} />
          live
        </span>
      </div>
      <PackageChips variant="mini" />
      <AreaInput variant="mini" />
      <PriceResult variant="mini" />
      <a href="#calculator" className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[.1em] text-brand">
        подробный расчёт
        <ArrowDown size={13} strokeWidth={2} />
      </a>
    </div>
  );
}
