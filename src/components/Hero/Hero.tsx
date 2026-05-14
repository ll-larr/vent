import Link from 'next/link';

export default function Hero() {
  return (
    <section
      id="hero"
      className="hero-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f2d1a 0%, #1e5c32 60%, #163d24 100%)' }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-content mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-pill px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/80 text-sm font-medium">Выезд специалиста бесплатно</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.04em] text-white mb-6">
          Чистая вентиляция —<br />
          <span
            className="inline-block"
            style={{
              background: 'linear-gradient(90deg, #86efac, #4ade80, #86efac)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            здоровый воздух
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Полный комплекс услуг по очистке и дезинфекции систем вентиляции
          для ресторанов, офисов и производств. Договор и акт выполненных работ.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contacts"
            className="bg-white text-brand font-semibold px-8 py-4 rounded-pill text-lg hover:bg-brand-light transition-all hover:scale-105 w-full sm:w-auto text-center shadow-lg shadow-black/20"
          >
            Вызвать специалиста
          </a>
          <a
            href="#services"
            className="border border-white/25 text-white font-medium px-8 py-4 rounded-pill text-lg hover:bg-white/10 transition-all w-full sm:w-auto text-center"
          >
            Наши услуги
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm">
          <span>&#10003; 8 лет на рынке</span>
          <span>&#10003; 500+ объектов</span>
          <span>&#10003; Договор и акт</span>
          <span>&#10003; Гарантия качества</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-white text-xs uppercase tracking-widest">Листать</span>
        <div className="w-px h-8 bg-white animate-bounce" />
      </div>
    </section>
  );
}
