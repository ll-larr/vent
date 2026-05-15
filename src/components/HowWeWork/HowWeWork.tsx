'use client';

import { useRef } from 'react';
import useScrollAnim from '@/lib/useScrollAnim';
import { ClipboardList, Eye, Sparkles, FileCheck } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react';

type Step = { n: number; Icon: LucideIcon; title: string; desc: string };

const STEPS: Step[] = [
  { n: 1, Icon: ClipboardList, title: 'Заявка',   desc: 'Свяжетесь — обсудим объём, согласуем выезд.' },
  { n: 2, Icon: Eye,           title: 'Осмотр',   desc: 'Инженер выезжает, делает видеодиагностику, считает точную цену.' },
  { n: 3, Icon: Sparkles,      title: 'Чистка',   desc: 'Работаем ночью или в нерабочее время, не нарушая бизнес.' },
  { n: 4, Icon: FileCheck,     title: 'Протокол', desc: 'Выдаём фото-отчёт и протокол СЭС — храните для проверок.' },
];

export function HowWeWork() {
  const ref = useRef<HTMLElement>(null);
  useScrollAnim(ref);

  return (
    <section ref={ref} id="how" className="px-5 md:px-[5vw] py-24 bg-bg">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3" data-anim>
          06 / процесс
        </div>
        <h2
          className="font-display font-light text-[clamp(40px,5vw,72px)] leading-none tracking-[-.025em] mb-12 max-w-3xl"
          data-anim
          style={{ ['--delay' as any]: '70ms' }}
        >
          Как мы <em className="italic text-brand">работаем.</em>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="bg-surface rounded-3xl p-7 shadow-card"
              data-anim
              style={{ ['--delay' as any]: `${i * 80}ms` }}
            >
              <div className="font-mono text-[12px] text-brand mb-5">{String(s.n).padStart(2, '0')}</div>
              <s.Icon size={28} strokeWidth={1.5} className="text-ink mb-5" />
              <h3 className="font-display font-medium text-[24px] leading-tight">{s.title}</h3>
              <p className="text-[14px] text-ink/65 mt-3 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWeWork;
