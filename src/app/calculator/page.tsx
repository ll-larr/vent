import type { Metadata } from 'next';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Calculator } from '@/components/Calculator/Calculator';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { CalculatorProvider } from '@/lib/calculator-context';

export const metadata: Metadata = {
  title: 'Калькулятор стоимости чистки вентиляции — Vent',
  description:
    'Рассчитайте онлайн стоимость промышленной чистки вентиляции и вытяжек для общепита, офиса или производства. Цены от 100 ₽/пог.м.',
  alternates: { canonical: '/calculator' },
};

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <Header />
      <main className="pt-32 bg-bg">
        <div className="px-5 md:px-[5vw] max-w-7xl mx-auto mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-4">
            калькулятор · /calculator
          </div>
          <h1 className="font-display font-light text-[clamp(40px,6vw,84px)] leading-none tracking-[-.025em] max-w-3xl">
            Стоимость чистки <em className="italic text-brand">вентиляции.</em>
          </h1>
          <p className="text-ink/65 text-[16px] mt-6 max-w-2xl">
            Выберите тип объекта, скорректируйте список услуг и укажите площадь. Точная стоимость определяется
            после бесплатного осмотра.
          </p>
        </div>
        <Calculator />
        <ContactSection />
      </main>
      <Footer />
    </CalculatorProvider>
  );
}
