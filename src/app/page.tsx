import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { Services } from '@/components/Services/Services';
import { Cases } from '@/components/Cases/Cases';
import { BigVenues } from '@/components/BigVenues/BigVenues';
import { HowWeWork } from '@/components/HowWeWork/HowWeWork';
import { TrustSection } from '@/components/TrustSection/TrustSection';
import { Calculator } from '@/components/Calculator/Calculator';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { Footer } from '@/components/Footer/Footer';
import { CalculatorProvider } from '@/lib/calculator-context';

export default function HomePage() {
  return (
    <CalculatorProvider>
      <Header />
      <main id="main">
        {/* 01 — Hero */}
        <span id="top" className="sr-only" aria-hidden="true" />
        <Hero />
        {/* 02 — Services */}
        <Services />
        {/* 03 — Cases */}
        <Cases />
        {/* 04 — Venues */}
        <BigVenues />
        {/* 05 — Process */}
        <HowWeWork />
        {/* 06 — Trust + Reviews */}
        <TrustSection />
        {/* 07 — Calculator (full) */}
        <Calculator />
        {/* 08 — Contact */}
        <ContactSection />
      </main>
      <Footer />
    </CalculatorProvider>
  );
}
