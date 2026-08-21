import Image from 'next/image';

/* Figures shared by the article body and the service pages. The class
   constants are the single source of the frame/caption/badge look — before
   this module they lived only in ArticleBody, which is why the two surfaces
   render identically. */

export const FRAME = 'relative block overflow-hidden bg-black-deep';
export const CAPTION = 'mono-label mt-2.5 text-[10px] tracking-[.12em] text-ink/45';
export const BADGE =
  'mono-label absolute left-2.5 top-2.5 rounded-pill px-[11px] py-1.5 text-[9px] tracking-[.16em]';

/** Single 16:9 frame. `alt` defaults to the caption when the two would match. */
export function Figure({
  src,
  cap,
  alt,
  className = '',
}: {
  src: string;
  cap: string;
  alt?: string;
  className?: string;
}) {
  return (
    <figure className={`my-[clamp(6px,1.4vh,16px)] ${className}`.trim()}>
      <span className={`${FRAME} aspect-[16/9]`}>
        <Image
          src={src}
          alt={alt ?? cap}
          fill
          sizes="(max-width: 900px) 100vw, 820px"
          className="object-cover"
        />
      </span>
      <figcaption className={CAPTION}>{cap}</figcaption>
    </figure>
  );
}

/** Before/after pair. Alt text is per-image so it can name the actual object
    rather than repeating "до чистки" on every page. */
export function BeforeAfter({
  src,
  src2,
  cap,
  alt,
  alt2,
  className = '',
}: {
  src: string;
  src2: string;
  cap: string;
  alt?: string;
  alt2?: string;
  className?: string;
}) {
  return (
    <figure className={`my-[clamp(6px,1.4vh,16px)] ${className}`.trim()}>
      <span className="grid grid-cols-2 gap-2">
        <span className={`${FRAME} aspect-[4/3]`}>
          <Image
            src={src}
            alt={alt ?? 'До чистки'}
            fill
            sizes="(max-width: 900px) 50vw, 410px"
            className="object-cover"
          />
          <span className={`${BADGE} bg-ink/[.86] text-bg`}>до</span>
        </span>
        <span className={`${FRAME} aspect-[4/3]`}>
          <Image
            src={src2}
            alt={alt2 ?? 'После чистки'}
            fill
            sizes="(max-width: 900px) 50vw, 410px"
            className="object-cover"
          />
          <span className={`${BADGE} bg-accent text-ink`}>после</span>
        </span>
      </span>
      <figcaption className={CAPTION}>{cap}</figcaption>
    </figure>
  );
}
