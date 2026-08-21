import type { ArticleBlock } from '@/lib/content';
import { Figure, BeforeAfter } from '@/components/ContentPage/Figure';
import { InlineText } from '@/components/story/InlineText';
import { stripInline } from '@/lib/inline-link';

/* Renderer for article body blocks.

   Anchors: every `h` block gets #h1, #h2 … in document order and the table of
   contents is built from the same counter, so the two can't drift. Other
   blocks get a positional id purely so the wrapper has one.

   Images come from ContentPage/Figure, shared with the service pages; the
   photos in article bodies are the only non-final assets in the design
   (see AUDIT.md).

   `p` and `list` items go through InlineText, so body copy can carry
   `[текст](/uslugi/…)` links. Headings deliberately do not: they are anchor
   targets and feed the table of contents as plain strings. */

export function articleHeadings(blocks: ArticleBlock[]): Array<{ id: string; text: string }> {
  let n = 0;
  return blocks
    .filter((b): b is Extract<ArticleBlock, { t: 'h' }> => b.t === 'h')
    .map((b) => ({ id: `h${++n}`, text: stripInline(b.v) }));
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.t) {
    case 'h':
      return (
        <h2 className="mt-[clamp(10px,1.6vh,20px)] max-w-[24ch] font-display text-[clamp(26px,2.9vw,44px)] font-light leading-[1.06] tracking-[-.03em]">
          {block.v}
        </h2>
      );
    case 'p':
      return (
        <p className="max-w-[68ch] text-[clamp(16px,1.15vw,18.5px)] leading-[1.65] text-ink/80">
          <InlineText text={block.v} />
        </p>
      );
    case 'quote':
      return (
        <p className="max-w-[34ch] border-l-2 border-accent py-1.5 pl-[clamp(16px,2vw,28px)] font-display text-[clamp(22px,2.4vw,36px)] font-light italic leading-[1.22] tracking-[-.026em] text-brand">
          {block.v}
        </p>
      );
    case 'note':
      return (
        // The closing disclaimer is the one mono block that is not uppercased.
        <p className="max-w-[74ch] border-t border-ink/[.14] pt-3.5 font-mono text-[11px] leading-[1.85] tracking-[.06em] text-ink/50">
          {block.v}
        </p>
      );
    case 'list':
      return (
        <div className="flex max-w-[68ch] flex-col">
          {block.items.map((item, i) => (
            <span
              key={i}
              className="grid grid-cols-[26px_1fr] gap-3 border-t border-ink/[.14] py-[11px] text-[clamp(15.5px,1.1vw,17.5px)] leading-[1.5] text-ink/80"
            >
              <span className="mono-label pt-1 text-[10.5px] tracking-[.1em] text-brand">
                {String(i + 1).padStart(2, '0')}
              </span>
              <InlineText text={item} />
            </span>
          ))}
          <span className="border-t border-ink/[.14]" />
        </div>
      );
    case 'img':
      return <Figure src={block.src} cap={block.cap} />;
    case 'pair':
      return <BeforeAfter src={block.src} src2={block.src2} cap={block.cap} />;
  }
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  let headings = 0;
  return (
    <div className="flex min-w-0 flex-col gap-[clamp(16px,2.4vh,26px)]">
      {blocks.map((block, i) => {
        const id = block.t === 'h' ? `h${++headings}` : `b${i}`;
        return (
          <div key={id} id={id} className="scroll-mt-24">
            <Block block={block} />
          </div>
        );
      })}
    </div>
  );
}

export default ArticleBody;
