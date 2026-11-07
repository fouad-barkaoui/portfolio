import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react';
import type { CSSProperties } from 'react';
import portrait from '@/assets/portrait/fouad.avif?w=320;480;640&format=avif;webp&as=picture';
import { identity, ui } from '@/content/content';
import { Rich, useLang } from '@/lib/i18n';
import { useMagnetic } from '@/lib/motion';
import { scrollToId } from '@/lib/scroll';
import { Picture } from './Picture';
import { LocalTime } from './primitives';
import { RoleTicker } from './RoleTicker';
import { SignalField } from './SignalField';
import { Sticker } from './Sticker';

/**
 * The one orchestrated moment on the page, in pure CSS so it starts with the
 * first paint of the prerendered HTML: construction lines draw in, the name
 * rises out of its masks, the portrait is uncovered, then the details settle.
 * It only runs when <html> has the `intro` class (set before paint unless the
 * visitor prefers reduced motion). Two stickers slap onto the portrait as the
 * intro ends; the rest of the page reveals itself as you scroll (lib/reveal).
 */
export function Hero(): JSX.Element {
  const { t } = useLang();
  const primary = useMagnetic<HTMLAnchorElement>();
  const secondary = useMagnetic<HTMLAnchorElement>();

  return (
    <section className="hero" aria-labelledby="hero-name">
      <SignalField variant="hero" />
      <div className="hero-guides" aria-hidden>
        <i data-intro="guide" style={{ top: '18%' }} />
        <i data-intro="guide" style={{ top: '82%' }} />
        <i data-intro="guide-v" className="v" style={{ insetInlineStart: '58%' }} />
      </div>

      <div className="hero-grid">
        <div className="hero-text">
          <div className="hero-kicker" data-intro="fade" style={{ '--i': 0 } as CSSProperties}>
            <a
              className="hire-badge"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('hire');
              }}
            >
              <span className="hire-pulse" aria-hidden />
              <b>{t(ui.hire.badge)}</b>
              <span className="hire-roles">{t(ui.hire.badgeRoles)}</span>
            </a>
            <LocalTime />
          </div>

          <h1 id="hero-name" className="hero-name">
            {identity.nameDisplay.map((w, k) => (
              <span key={w} className="mask">
                <span data-intro="name" style={{ '--i': k } as CSSProperties}>
                  {w}
                </span>
                {k === 0 ? ' ' : null}
              </span>
            ))}
          </h1>

          <div data-intro="fade" style={{ '--i': 1 } as CSSProperties}>
            <RoleTicker />
          </div>

          <p className="hero-oneline" data-intro="fade" style={{ '--i': 2 } as CSSProperties}>
            {t(identity.oneLine)}
          </p>
          <p className="hero-promise" data-intro="fade" style={{ '--i': 3 } as CSSProperties}>
            <Rich text={t(identity.promise)} />
          </p>

          <div className="hero-ctas" data-intro="fade" style={{ '--i': 4 } as CSSProperties}>
            <a ref={primary} className="btn btn-primary" href={`mailto:${identity.email}`}>
              <Mail size={17} strokeWidth={1.9} aria-hidden />
              {t(ui.writeToMe)}
              <ArrowUpRight className="flip-rtl" size={16} strokeWidth={1.9} aria-hidden />
            </a>
            <a
              ref={secondary}
              className="btn btn-ghost"
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('work');
              }}
            >
              {t(ui.seeWork)}
              <ArrowDown size={16} strokeWidth={1.9} aria-hidden />
            </a>
          </div>
        </div>

        <figure className="hero-figure">
          <div className="portrait-frame">
            <span className="tick tl" aria-hidden />
            <span className="tick tr" aria-hidden />
            <span className="tick bl" aria-hidden />
            <span className="tick br" aria-hidden />
            <Sticker name="nazar" size={104} rot={-11} className="stk-hero-nazar" drift={-26} delay={0} intro />
            <Sticker name="sparkle-trio" size={66} rot={10} className="stk-hero-spark" drift={34} delay={180} intro float />
            <span className="sticker-hint" aria-hidden>
              <span className="note-text">{t(ui.stickers.hint)}</span>
              <svg className="note-arrow" viewBox="0 0 44 40" width="44" height="40">
                <path d="M3 34c12 1 24-5 30-16c2-4 3-8 3-13" />
                <path d="M30 10l6-6l5 7" />
              </svg>
            </span>
            <div className="portrait-clip" data-intro="portrait">
              <Picture
                pic={portrait}
                alt={t(identity.portraitAlt)}
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 86vw"
                imgClassName="portrait-img"
                eager
              />
            </div>
          </div>
          <figcaption className="fig-caption mono" data-intro="fade" style={{ '--i': 5 } as CSSProperties}>
            <span>Fig. 1</span> {t(identity.nameLocal)}, {t(identity.country)}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
