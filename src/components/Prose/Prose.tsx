import type { ReactNode } from 'react';

// No @tailwindcss/typography in deps — arbitrary variants replicate the
// handful of tags long-form content actually needs, same technique as the
// hand-rolled BulletList/[&_p] rules in src/app/privacy/page.tsx.
export function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        'max-w-[70ch] text-[16px] md:text-[17px] leading-[1.6] text-ink/80',
        '[&_p]:max-w-[70ch] [&_p]:mb-4 [&_p:last-child]:mb-0',
        '[&_ul]:max-w-[70ch] [&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0 [&_ul]:mb-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2',
        '[&_li]:relative [&_li]:pl-[22px]',
        "[&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:top-[.65em] [&_li]:before:w-1.5 [&_li]:before:h-1.5 [&_li]:before:rounded-full [&_li]:before:bg-brand",
        '[&_h2]:font-display [&_h2]:font-normal [&_h2]:text-[clamp(22px,2.4vw,30px)] [&_h2]:leading-[1.15] [&_h2]:tracking-[-.015em] [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-3.5 [&_h2:first-child]:mt-0',
        '[&_h3]:font-display [&_h3]:font-normal [&_h3]:text-[20px] [&_h3]:leading-[1.2] [&_h3]:tracking-[-.01em] [&_h3]:text-ink [&_h3]:mt-8 [&_h3]:mb-2.5',
        '[&_strong]:font-semibold [&_strong]:text-ink',
        '[&_a]:text-brand [&_a]:border-b [&_a]:border-current hover:[&_a]:text-ink [&_a]:transition-colors',
        '[&_table]:block [&_table]:w-full [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-[14px]',
        '[&_th]:text-left [&_th]:font-mono [&_th]:text-[10.5px] [&_th]:uppercase [&_th]:tracking-[.12em] [&_th]:text-ink/50 [&_th]:pb-2.5 [&_th]:pr-4 [&_th]:border-b [&_th]:border-line-2 [&_th]:whitespace-nowrap',
        '[&_td]:py-3 [&_td]:pr-4 [&_td]:border-b [&_td]:border-line [&_td]:align-top',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export default Prose;
