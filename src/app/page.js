import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Hero from '@/components/Hero/Hero';
import Services from '@/components/Services/Services';
import HowWeWork from '@/components/HowWeWork/HowWeWork';
import Comparison from '@/components/Comparison/Comparison';
import Stats from '@/components/Stats/Stats';
import HomeCTA from '@/components/HomeCTA/HomeCTA';

export const metadata = { title: 'Clean Vent — Чистка вентиляции' };

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <HowWeWork />
      <Comparison />
      <Stats />
      <HomeCTA />
      <Footer />
    </>
  );
}
