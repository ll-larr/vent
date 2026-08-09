import Image from 'next/image';
import type { ArticleBlock } from '@/lib/content';

/* Renderer for article body blocks.

   Anchors: every `h` block gets #h1, #h2 … in document order and the table of
   contents is built from the same counter, so the two can't drift. Other
   blocks get a positional id purely so the wrapper has one.

   Images are next/image with explicit aspect boxes; the photos in article
   bodies are the only non-final assets in the design (see AUDIT.md). */

export function articleHeadings(blocks: ArticleBlock[]): Array<{ id: string; text: string }> {
  let n = 0;
  return blocks
    .filter((b): b is Extract<ArticleBlock, { t: 'h' }> => b.t === 'h')
    .map((b) => ({ id: `h${++n}`, text: b.v }));
}

const FRAME = 'relative block overflow-hidden bg-black-deep';
const CAPTION = 'mono-label mt-2.5 text-[10px] tracking-[.12em] text-ink/45';
const BADGE =
  'mono-label absolute left-2.5 top-2.5 rounded-pill px-[11px] py-1.5 text-[9px] tracking-[.16em]';

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
          {block.v}
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
              {item}
            </span>
          ))}
          <span className="border-t border-ink/[.14]" />
        </div>
      );
    case 'img':
      return (
        <figure className="my-[clamp(6px,1.4vh,16px)]">
          <span className={`${FRAME} aspect-[16/9]`}>
            <Image src={block.src} alt={block.cap} fill sizes="(max-width: 900px) 100vw, 820px" className="object-cover" />
          </span>
          <figcaption className={CAPTION}>{block.cap}</figcaption>
        </figure>
      );
    case 'pair':
      return (
        <figure className="my-[clamp(6px,1.4vh,16px)]">
          <span className="grid grid-cols-2 gap-2">
            <span className={`${FRAME} aspect-[4/3]`}>
              <Image src={block.src} alt="До чистки" fill sizes="(max-width: 900px) 50vw, 410px" className="object-cover" />
              <span className={`${BADGE} bg-ink/[.86] text-bg`}>до</span>
            </span>
            <span className={`${FRAME} aspect-[4/3]`}>
              <Image src={block.src2} alt="После чистки" fill sizes="(max-width: 900px) 50vw, 410px" className="object-cover" />
              <span className={`${BADGE} bg-accent text-ink`}>после</span>
            </span>
          </span>
          <figcaption className={CAPTION}>{block.cap}</figcaption>
        </figure>
      );
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
