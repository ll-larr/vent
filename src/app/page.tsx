import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Hero from '@/components/Hero/Hero';
import Services from '@/components/Services/Services';
import HowWeWork from '@/components/HowWeWork/HowWeWork';
import Portfolio from '@/components/Portfolio/Portfolio';
import Stats from '@/components/Stats/Stats';
import Reviews from '@/components/Reviews/Reviews';
import About from '@/components/About/About';
import Promos from '@/components/Promos/Promos';

export const metadata: Metadata = {
  title: 'Clean Vent — Чистка вентиляции для бизнеса',
  description: 'Профессиональная чистка вентиляционных систем для ресторанов, офисов, производств. Бесплатный выезд специалиста.',
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <HowWeWork />
        <Portfolio />
        <Stats />
        <Reviews />
        <About />
        <Promos />
        {/* Calculator and ContactSection will be added in Plan 2 */}
      </main>
      <Footer />
    </>
  );
}
