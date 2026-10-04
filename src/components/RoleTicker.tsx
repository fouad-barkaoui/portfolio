import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { identity } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { prefersReducedMotion } from '@/lib/motion';

/** useLayoutEffect in the browser, useEffect while prerendering. */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * One role at a time in a pill that eases to each word's width. The hairline
 * along the bottom is the clock: its animationend advances the word, so
 * hovering (which pauses it) pauses the ticker. Reduced motion: a still list.
 */
export function RoleTicker(): JSX.Element {
  const { t } = useLang();
  const roles = useMemo(() => identity.roles.map((r) => t(r)), [t]);
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const measure = useRef<HTMLSpanElement>(null);
  // Decided after mount so the prerendered HTML and the first client render match.
  // `mounted` also restarts the clock bar once handlers are attached.
  const [still, setStill] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setStill(prefersReducedMotion());
    setMounted(true);
  }, []);

  useIsoLayoutEffect(() => {
    if (measure.current) setWidth(Math.ceil(measure.current.getBoundingClientRect().width));
  }, [i, roles]);

  if (still) {
    return (
      <p className="roles-still">
        {roles.map((r, k) => (
          <span key={r}>
            {r}
            {k < roles.length - 1 ? <span aria-hidden> · </span> : null}
          </span>
        ))}
      </p>
    );
  }

  const next = (): void => {
    setPrev(i);
    setI((n) => (n + 1) % roles.length);
  };

  return (
    <div className="ticker" data-paused={paused || undefined} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <span className="sr-only">{roles.join(', ')}</span>
      <span className="ticker-pill" aria-hidden>
        <span className="ticker-dot" />
        <span className="ticker-window" style={{ width }}>
          {prev !== null ? (
            <span key={`out-${prev}-${i}`} className="ticker-word is-out">
              {roles[prev]}
            </span>
          ) : null}
          <span key={`in-${i}`} className="ticker-word is-in">
            {roles[i]}
          </span>
        </span>
        <span key={`bar-${i}-${mounted ? 1 : 0}`} className="ticker-bar" onAnimationEnd={next} />
        <span ref={measure} className="ticker-measure">
          {roles[i]}
        </span>
      </span>
      <span className="ticker-count mono" aria-hidden>
        {String(i + 1).padStart(2, '0')}
        <span>/{String(roles.length).padStart(2, '0')}</span>
      </span>
    </div>
  );
}
