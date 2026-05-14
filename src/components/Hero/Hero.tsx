import { ArrowRight, ShieldCheck, BadgeCheck, Gauge } from '@/lib/icons';

export default function Hero() {
  return (
    <section
      id="hero"
      className="hero-section relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #0a2414 0%, #1e5c32 50%, #0d3520 100%)' }}
    >
      {/* Noise grain texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">

          {/* Left: text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-pill px-4 py-2 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-brand-accent rounded-full animate-[pulse-dot_2s_ease-in-out_infinite]" />
              <span className="text-white/80 text-sm font-medium tracking-wide">Выезд специалиста — бесплатно</span>
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.6rem,6vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-white mb-6">
              Чистим вентиляцию —<br />
              <span
                className="font-display font-semibold italic"
                style={{
                  background: 'linear-gradient(90deg, #86efac 0%, #4ade80 50%, #86efac 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 4s linear infinite',
                }}
              >
                ваш бизнес дышит
              </span>
            </h1>

            <p className="text-lg text-white/55 max-w-[520px] mb-10 leading-relaxed">
              Полный комплекс работ по чистке и дезинфекции вентиляции
              для ресторанов, офисов и производств. Договор, акт, гарантия.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#contacts"
                className="group inline-flex items-center justify-center gap-2 bg-white text-brand font-semibold px-7 py-4 rounded-pill text-base hover:bg-brand-light transition-all hover:shadow-float hover:-translate-y-0.5 active:translate-y-0"
              >
                Вызвать специалиста
                <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center border border-white/20 text-white font-medium px-7 py-4 rounded-pill text-base hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Наши услуги
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-white/40 text-sm">
              {['8 лет на рынке', '500+ объектов', 'Договор и акт', 'Гарантия качества'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-brand-accent/60">✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: floating stats card */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Main card */}
            <div className="bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-xl2 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
                Результат работы
              </p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: <Gauge size={20} strokeWidth={1.5} />, val: '98%',   label: 'КПД вентиляции\nпосле чистки' },
                  { icon: <ShieldCheck size={20} strokeWidth={1.5} />, val: '100%', label: 'Соответствие\nнормам СанПиН' },
                  { icon: <BadgeCheck size={20} strokeWidth={1.5} />, val: '500+', label: 'Объектов\nобслужено' },
                  { icon: <ArrowRight size={20} strokeWidth={1.5} />, val: '24ч',  label: 'Срок выезда\nспециалиста' },
                ].map(({ icon, val, label }) => (
                  <div key={val} className="flex flex-col gap-2">
                    <div className="text-brand-accent/70">{icon}</div>
                    <div className="text-3xl font-bold tracking-tight">{val}</div>
                    <div className="text-white/40 text-xs leading-snug whitespace-pre-line">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary card — compliance */}
            <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-accent/20 rounded-lg flex items-center justify-center text-brand-accent shrink-0">
                <ShieldCheck size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Соответствие СанПиН</p>
                <p className="text-white/50 text-xs mt-0.5">Обязательно для общепита и медицины</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 pointer-events-none">
        <span className="text-white text-[10px] uppercase tracking-[0.2em]">Листать</span>
        <div className="w-px h-7 bg-white animate-bounce" />
      </div>
    </section>
  );
}
