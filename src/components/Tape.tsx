import { Pause, Play } from 'lucide-react';
import { Fragment, useRef, useState } from 'react';
import { howIWork, identity, security, ui, type L } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { useScrollMarquee } from '@/lib/useScrollMarquee';

/** Copies of each strip's run: enough to cover an ultrawide screen while it loops. */
const COPIES = 3;

function Star(): JSX.Element {
  return (
    <svg className="tape-star" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0Z" />
    </svg>
  );
}

function Strip({ items, tone }: { items: readonly L[]; tone: 'lime' | 'ink' }): JSX.Element {
  const { t } = useLang();
  // Repeat short lists so one run is wider than any screen.
  const words = (items.length < 8 ? [...items, ...items] : items).map((w) => t(w));
  return (
    <div className="tape-strip" data-tone={tone}>
      <div className="tape-roll">
        <div className="tape-track">
          {Array.from({ length: COPIES }, (_, c) => (
            <div key={c} className="tape-run">
              {words.map((w, k) => (
                <Fragment key={k}>
                  <span className="tape-word">{w}</span>
                  <Star />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** What each tape says: the front (lime) strip and the back (light) one. */
const TAPES = {
  // Across the seam into the security sheet.
  roles: { front: identity.roles, back: security.map((s) => s.title) },
  // Across the seam between the motto and the contact sheet.
  hiring: { front: [ui.hire.badge, ...ui.hire.roles, ui.hire.based], back: howIWork.map((s) => s.title) },
} satisfies Record<string, { front: readonly L[]; back: readonly L[] }>;

/**
 * Two strips of tape crossing a seam between sheets, running in opposite
 * directions. They react to scrolling (faster while you scroll, following
 * its direction) and tilt a little further as you pass. The words are
 * already on the page, so the strips are hidden from assistive tech; the
 * pause button is not (WCAG 2.2.2).
 */
export function Tape({ variant }: { variant: keyof typeof TAPES }): JSX.Element {
  const { t } = useLang();
  const [stopped, setStopped] = useState(false);
  const band = useRef<HTMLDivElement>(null);
  useScrollMarquee(band, stopped);
  const { front, back } = TAPES[variant];

  return (
    <div ref={band} className="tape" data-reveal="tape" data-stopped={stopped || undefined}>
      <div className="tape-cross" aria-hidden>
        <Strip items={back} tone="ink" />
        <Strip items={front} tone="lime" />
      </div>
      <button
        type="button"
        className="icon-btn tape-toggle"
        aria-pressed={stopped}
        aria-label={t(ui.marquee.pauseTape)}
        title={stopped ? t(ui.marquee.play) : t(ui.marquee.pause)}
        onClick={() => setStopped((v) => !v)}
      >
        {stopped ? <Play size={14} strokeWidth={2.2} aria-hidden /> : <Pause size={14} strokeWidth={2.2} aria-hidden />}
      </button>
    </div>
  );
}
