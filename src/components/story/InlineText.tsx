import { Fragment } from 'react';
import Link from 'next/link';
import { parseInline } from '@/lib/inline-link';

/* Renders body text that may carry `[текст](/uslugi/…)` markup. The parser in
   lib/inline-link.ts decides what is a link; this only styles the result. */
export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((token, i) => (
        <Fragment key={i}>
          {token.href ? (
            <Link
              href={token.href}
              className="border-b border-brand/40 text-brand transition-colors hover:border-brand hover:text-ink"
            >
              {token.text}
            </Link>
          ) : (
            token.text
          )}
        </Fragment>
      ))}
    </>
  );
}

export default InlineText;
