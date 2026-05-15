import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { Services } from '@/components/Services/Services';
import { Cases } from '@/components/Cases/Cases';
import { Calculator } from '@/components/Calculator/Calculator';
import { BigVenues } from '@/components/BigVenues/BigVenues';
import { HowWeWork } from '@/components/HowWeWork/HowWeWork';
import { TrustSection } from '@/components/TrustSection/TrustSection';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { Footer } from '@/components/Footer/Footer';
import { CalculatorProvider } from '@/lib/calculator-context';

export default function HomePage() {
  return (
    <CalculatorProvider>
      <Header />
      <main>
        <Hero />
        <Services />
        <Cases />
        <Calculator />
        <BigVenues />
        <HowWeWork />
        <TrustSection />
        <ContactSection />
      </main>
      <Footer />
    </CalculatorProvider>
  );
}
