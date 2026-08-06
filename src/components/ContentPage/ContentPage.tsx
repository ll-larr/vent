import type { ReactNode } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { CalculatorProvider } from '@/lib/calculator-context';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs/Breadcrumbs';
import { jsonLdScript, type JsonLd } from '@/lib/schema';

export type ContentPageProps = {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  jsonLd?: JsonLd | JsonLd[];
};

// Shared shell for service/article pages — same Header/ContactSection/Footer
// scaffold as calculator and contacts pages, wrapped in CalculatorProvider
// because Header's calculator link and ContactSection both read that context.
export function ContentPage({ breadcrumbs, eyebrow, title, lead, children, jsonLd }: ContentPageProps) {
  return (
    <CalculatorProvider>
      <Header />
      <main id="main" className="pt-32 bg-bg">
        <div className="px-5 md:px-[5vw] max-w-7xl mx-auto">
          <div className="mb-12">
            <Breadcrumbs items={breadcrumbs} />
            {eyebrow && (
              <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-2.5">{eyebrow}</div>
            )}
            <h1 className="font-display font-light text-[clamp(40px,6vw,84px)] leading-none tracking-[-.025em]">
              {title}
            </h1>
            {lead && <p className="text-ink/65 text-[16px] mt-6 max-w-2xl">{lead}</p>}
          </div>
          {children}
        </div>
        <ContactSection />
      </main>
      <Footer />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />}
    </CalculatorProvider>
  );
}

export default ContentPage;
