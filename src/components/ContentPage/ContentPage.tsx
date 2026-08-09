import type { ReactNode } from 'react';
import { Topbar } from '@/components/story/Topbar';
import { StoryFooter } from '@/components/story/StoryFooter';
import { StoryCta } from '@/components/story/StoryCta';
import { SectionLabel } from '@/components/story/SectionLabel';
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

/* Shell for the service pages. They are not in the story handoff, so they wear
   its chrome — sticky light topbar, dark closing strip, full footer — over
   their own long-form body. */
export function ContentPage({ breadcrumbs, eyebrow, title, lead, children, jsonLd }: ContentPageProps) {
  return (
    <>
      <Topbar variant="solid" />
      <main id="main" className="bg-bg">
        <div className="mx-auto max-w-[1180px] px-[clamp(22px,3vw,56px)] pb-[clamp(30px,5vh,60px)] pt-[clamp(28px,5vh,64px)]">
          <Breadcrumbs items={breadcrumbs} />
          {eyebrow && <SectionLabel className="mb-3.5">{eyebrow}</SectionLabel>}
          <h1 className="max-w-[20ch] font-display text-[clamp(34px,5.4vw,86px)] font-light leading-[.96] tracking-[-.036em]">
            {title}
          </h1>
          {lead && (
            <p className="mt-5 max-w-[56ch] text-[clamp(17px,1.5vw,24px)] leading-[1.5] text-ink/[.72]">
              {lead}
            </p>
          )}
        </div>
        <div className="mx-auto max-w-[1180px] px-[clamp(22px,3vw,56px)] pb-[clamp(40px,6vh,80px)]">
          {children}
        </div>
        <StoryCta
          heading="Посчитать для своего объекта."
          text="Калькулятор даёт вилку за минуту. Точную сумму инженер называет на осмотре — и дальше она не меняется."
        />
      </main>
      <StoryFooter />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />}
    </>
  );
}

export default ContentPage;
