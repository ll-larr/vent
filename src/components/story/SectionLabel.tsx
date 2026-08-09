/* The 20×1px rule plus a tracked mono caption that opens every section.
   Green on light surfaces, lime on dark ones — that is the only difference. */
export function SectionLabel({
  children,
  tone = 'light',
  className = '',
}: {
  children: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div
      data-reveal=""
      className={[
        'mono-label flex items-center gap-[11px] text-[11px] [--reveal-y:16px]',
        tone === 'light' ? 'text-ink/50' : 'text-bg/55',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        aria-hidden="true"
        className={`h-px w-5 ${tone === 'light' ? 'bg-brand' : 'bg-accent'}`}
      />
      {children}
    </div>
  );
}

export default SectionLabel;
