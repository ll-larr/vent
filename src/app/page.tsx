import type { Metadata } from 'next';
import { Topbar } from '@/components/story/Topbar';
import { ProgressBar } from '@/components/story/ProgressBar';
import { StoryEngine } from '@/components/story/StoryEngine';
import { Hero } from '@/components/story/Hero';
import { Technology } from '@/components/story/Technology';
import { Process } from '@/components/story/Process';
import { Objects } from '@/components/story/Objects';
import { Advantages } from '@/components/story/Advantages';
import { Discounts } from '@/components/story/Discounts';
import { CalculatorSection } from '@/components/story/CalculatorSection';
import { StoryFaq } from '@/components/story/StoryFaq';
import { CalculatorProvider } from '@/lib/calculator-context';
import { StoryFooter } from '@/components/story/StoryFooter';
import { FAQ, TECH_STEPS } from '@/data/story';
import { serviceSchema, faqSchema, howToSchema, jsonLdScript } from '@/lib/schema';
import { CALCULATOR_SERVICES, SERVICES, formatPrice, type ServiceKey } from '@/lib/pricing';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Structured data mirrors what the page actually offers — every calculator
// service, the six-step method of section 02 and the six questions of
// section 08. Every node is generated from the same data the sections render,
// so a rate change in pricing.ts cannot leave stale prices in the markup.
const priceRange = (key: ServiceKey): string => {
  const service = SERVICES[key];
  if (service.kind === 'linear') return `от ${service.min} ₽/пог.м`;
  if (service.kind === 'unit') return `от ${formatPrice(service.price)}/шт`;
  return formatPrice(service.price);
};

const homeJsonLd = jsonLdScript([
  ...CALCULATOR_SERVICES.map((key) =>
    serviceSchema(SERVICES[key].label, priceRange(key), SERVICES[key].hint),
  ),
  howToSchema(TECH_STEPS),
  faqSchema(FAQ),
]);

export default function HomePage() {
  return (
    <>
      <ProgressBar />
      <Topbar />
      {/* The provider wraps the sections that share calculator state: presets
          clicked in the story land in section 07 and in the lead payload. */}
      <CalculatorProvider>
        <main id="main">
          <Hero />
          <Technology />
          <Process />
          <Advantages />
          <Objects />
          <Discounts />
          <CalculatorSection />
          <StoryFaq />
        </main>
      </CalculatorProvider>
      <StoryFooter />
      <StoryEngine />
      <script type="application/ld+json" dangerouslySetInnerHTML={homeJsonLd} />
    </>
  );
}
