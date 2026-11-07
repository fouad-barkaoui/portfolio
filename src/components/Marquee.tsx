import { Pause, Play } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { identity, ui } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { prefersReducedMotion } from '@/lib/motion';
import { onScrollVelocity } from '@/lib/scroll';
import { StickerDot, type StickerName } from './Sticker';

/** One sticker after each role, in this order. */
const DOTS: readonly StickerName[] = ['sparkles', 'nazar', 'flame', 'cosmic-eye', 'star', 'peace-hand', 'eye-splat', 'globe', 'sparkle-trio'];
/** Copies of the strip: enough to cover an ultrawide screen while it loops. */
const COPIES = 3;

/**
 * A band of Fouad's roles drifting across the page, a sticker between each.
 * It follows the last scroll direction and speeds up while you scroll, then
 * eases back. Hovering pauses it, and the button stops it for good (WCAG
 * 2.2.2). Reduced motion: the band stands still. The roles are already on
 * the page as text, so the band is hidden from assistive tech; only the
 * pause button is exposed.
 */
export function Marquee(): JSX.Element {
  const { t } = useLang();
  const [stopped, setStopped] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const stoppedRef = useRef(false);
  stoppedRef.current = stopped;

  useEffect(() => {
    const el = track.current;
    const host = band.current;
    if (!el || !host || prefersReducedMotion()) return;

    // Off screen: let it rest.
    const io = new IntersectionObserver(([e]) => {
      if (e) host.toggleAttribute('data-offscreen', !e.isIntersecting);
    });
    io.observe(host);

    let dir = 1;
    let boost = 0;
    let frame = 0;
    const anim = (): Animation | undefined => el.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName.startsWith('marquee'));
    const tick = (): void => {
      boost *= 0.9;
      const a = anim();
      if (a) a.playbackRate = dir * (1 + boost);
      frame = boost > 0.02 ? requestAnimationFrame(tick) : 0;
    };
    const off = onScrollVelocity((v) => {
      if (stoppedRef.current || Math.abs(v) < 0.2) return;
      dir = v > 0 ? 1 : -1;
      boost = Math.min(5, Math.max(boost, Math.abs(v) * 0.35));
      if (!frame) frame = requestAnimationFrame(tick);
    });

    return () => {
      off();
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const roles = identity.roles.map((r) => t(r));
  return (
    <div ref={band} className="marquee" data-stopped={stopped || undefined}>
      <div className="marquee-view" aria-hidden>
        <div ref={track} className="marquee-track">
          {Array.from({ length: COPIES }, (_, c) => (
            <div key={c} className="marquee-group">
              {roles.map((r, k) => (
                <Fragment key={r}>
                  <span className="marquee-word" data-tone={k % 2 ? 'outline' : undefined}>
                    {r}
                  </span>
                  <StickerDot name={DOTS[k % DOTS.length]!} rot={k % 2 ? 9 : -8} />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="icon-btn marquee-toggle"
        aria-pressed={stopped}
        aria-label={t(ui.marquee.pause)}
        title={stopped ? t(ui.marquee.play) : t(ui.marquee.pause)}
        onClick={() => setStopped((v) => !v)}
      >
        {stopped ? <Play size={14} strokeWidth={2.2} aria-hidden /> : <Pause size={14} strokeWidth={2.2} aria-hidden />}
      </button>
    </div>
  );
}
