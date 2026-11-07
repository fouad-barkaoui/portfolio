import type { ReactNode } from 'react';

/**
 * A full-width sheet with rounded top corners that slides over the one
 * before it. While it rises it widens from a slightly narrower card to the
 * full page, and the sheet it covers sinks back and dims (CSS scroll
 * timelines, see "Sheets" in index.css). Where those aren't supported, or
 * with reduced motion, the sheets simply stack. Content keeps the page's
 * dashed frame inside each sheet.
 */
export function Sheet({ tone = 'base', children, id }: { tone?: 'base' | 'raised' | 'lime'; children: ReactNode; id?: string }): JSX.Element {
  return (
    <div className="sheet" data-tone={tone} id={id}>
      <div className="frame">{children}</div>
    </div>
  );
}
