/* Inline links for article body copy.

   The handoff copy is final and must not be rewritten, but the audit asked for
   contextual links from articles into the commercial pages. This is the
   compromise: authors wrap words that are *already in the sentence* in
   markdown-style `[текст](/uslugi/foo)`, so stripping the markup gives back the
   original string character for character. No wording is added or changed.

   Only site-relative paths are linkable — an href that does not start with a
   single "/" stays inert text. That keeps `javascript:` and protocol-relative
   "//evil.tld" out of the body, and keeps external links (which need
   rel/target decisions) an explicit change rather than an accident.

   Parsing lives here, rendering in components/story/InlineText.tsx: the test
   config only picks up `.ts`, and this half is the half worth pinning. */

const LINK = /\[([^\]\n]+)\]\((\/[^)\s]*)\)/g;

export type InlineToken = { text: string; href?: string };

const isSiteRelative = (href: string): boolean => href.startsWith('/') && !href.startsWith('//');

/** Splits body text into plain and linked runs, in document order. */
export function parseInline(text: string): InlineToken[] {
  // Fast path: most blocks carry no links at all.
  if (!text.includes('](')) return [{ text }];

  const out: InlineToken[] = [];
  let last = 0;

  for (const match of text.matchAll(LINK)) {
    const [raw, label, href] = match;
    const start = match.index;
    if (start > last) out.push({ text: text.slice(last, start) });
    out.push(isSiteRelative(href) ? { text: label, href } : { text: raw });
    last = start + raw.length;
  }

  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** The same string with the link markup removed — for anywhere the text has to
    be plain (structured data, meta tags, table of contents). */
export function stripInline(text: string): string {
  return text.replace(LINK, '$1');
}

/** Every site-relative href in the text, in order. Used by the link-integrity
    test so a typo'd slug fails the suite instead of shipping a 404. */
export function inlineHrefs(text: string): string[] {
  return parseInline(text)
    .map((token) => token.href)
    .filter((href): href is string => href !== undefined);
}
