import { Pause, Play } from 'lucide-react';
import { Fragment, useRef, useState } from 'react';
import { howIWork, ui, type L } from '@/content/content';
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
  // Each run says everything twice so one run is wider than any screen.
  const words = [...items, ...items].map((w) => t(w));
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

/**
 * Two strips of tape crossing between the motto and the contact section: a
 * lime one with what Fouad is looking for, a light one with how he works.
 * They run in opposite directions, react to scrolling like the role band,
 * and tilt a little further as you scroll past. Words already on the page,
 * so the strips are hidden from assistive tech; the pause button is not.
 */
export function Tape(): JSX.Element {
  const { t } = useLang();
  const [stopped, setStopped] = useState(false);
  const band = useRef<HTMLDivElement>(null);
  useScrollMarquee(band, stopped);

  const hiring: readonly L[] = [ui.hire.badge, ...ui.hire.roles, ui.hire.based];
  const working: readonly L[] = howIWork.map((s) => s.title);

  return (
    <div ref={band} className="tape" data-reveal="tape" data-stopped={stopped || undefined}>
      <div className="tape-cross" aria-hidden>
        <Strip items={working} tone="ink" />
        <Strip items={hiring} tone="lime" />
      </div>
      <button
        type="button"
        className="icon-btn marquee-toggle"
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
