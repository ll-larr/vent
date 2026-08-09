import type { Metadata } from 'next';
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
import { serviceSchema, jsonLdScript } from '@/lib/schema';
import { SERVICES } from '@/lib/pricing';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Service structured data mirrors the live pricing catalog — one source of truth.
const serviceJsonLd = jsonLdScript([
  serviceSchema(SERVICES.grease.label, 'от 300 ₽/пог.м', SERVICES.grease.hint),
  serviceSchema(SERVICES.dust.label, 'от 100 ₽/пог.м', SERVICES.dust.hint),
  serviceSchema(SERVICES.hood.label, 'от 2 000 ₽/шт', SERVICES.hood.hint),
  serviceSchema(SERVICES.diag.label, '4 500 ₽', SERVICES.diag.hint),
]);

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
        {/* 03 — Calculator (full) — moved up, right after Services */}
        <Calculator />
        {/* 04 — Cases */}
        <Cases />
        {/* 05 — Venues */}
        <BigVenues />
        {/* 06 — Process */}
        <HowWeWork />
        {/* 07 — Trust + Reviews */}
        <TrustSection />
        {/* 08 — Contact */}
        <ContactSection />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={serviceJsonLd} />
    </CalculatorProvider>
  );
}
