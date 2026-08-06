import Link from 'next/link';
import { breadcrumbSchema, jsonLdScript } from '@/lib/schema';

export type BreadcrumbItem = { name: string; href: string };

// Callers pass only the trail past the home page — "Главная" is prepended
// here so every content page gets the same first crumb for free.
const HOME_CRUMB: BreadcrumbItem = { name: 'Главная', href: '/' };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const trail = [HOME_CRUMB, ...items];
  const jsonLd = breadcrumbSchema(trail.map((item) => ({ name: item.name, url: item.href })));

  return (
    <>
      <nav aria-label="Хлебные крошки" className="mb-4">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 list-none p-0 m-0 font-mono text-[11px] uppercase tracking-[.15em] text-ink/50">
          {trail.map((item, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-ink/70">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-brand transition-colors">
                    {item.name}
                  </Link>
                )}
                {!isLast && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(jsonLd)} />
    </>
  );
}

export default Breadcrumbs;
