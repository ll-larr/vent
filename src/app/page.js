import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import HomeHero from '@/components/HomeHero/HomeHero';
import FeaturesStrip from '@/components/FeaturesStrip/FeaturesStrip';
import HomeServices from '@/components/HomeServices/HomeServices';
import Comparison from '@/components/Comparison/Comparison';
import Stats from '@/components/Stats/Stats';
import Advantages from '@/components/Advantages/Advantages';
import HomeCTA from '@/components/HomeCTA/HomeCTA';

export const metadata = { title: 'Clean Vent — Чистка вентиляции' };

export default function Home() {
  return (
    <>
      <Header />
      <HomeHero />
      <FeaturesStrip />
      <HomeServices />
      <Comparison />
      <Stats />
      <Advantages />
      <HomeCTA />
      <Footer />
    </>
  );
}
