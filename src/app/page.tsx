import type { Metadata } from 'next';
import { Topbar } from '@/components/story/Topbar';
import { ProgressBar } from '@/components/story/ProgressBar';
import { StoryEngine } from '@/components/story/StoryEngine';
import { Process } from '@/components/story/Process';
import { Advantages } from '@/components/story/Advantages';
import { Discounts } from '@/components/story/Discounts';
import { CalculatorSection } from '@/components/story/CalculatorSection';
import { StoryFaq } from '@/components/story/StoryFaq';
import { CalculatorProvider } from '@/lib/calculator-context';
import { StoryFooter } from '@/components/story/StoryFooter';
import { FAQ } from '@/data/story';
import { serviceSchema, faqSchema, jsonLdScript } from '@/lib/schema';
import { SERVICES } from '@/lib/pricing';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Structured data mirrors what the page actually offers — the four calculator
// services and the six questions rendered in section 08.
const homeJsonLd = jsonLdScript([
  serviceSchema(SERVICES.grease.label, 'от 300 ₽/пог.м', SERVICES.grease.hint),
  serviceSchema(SERVICES.dust.label, 'от 100 ₽/пог.м', SERVICES.dust.hint),
  serviceSchema(SERVICES.hood.label, 'от 2 000 ₽/шт', SERVICES.hood.hint),
  serviceSchema(SERVICES.diag.label, '4 500 ₽', SERVICES.diag.hint),
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
          <Process />
          <Advantages />
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
