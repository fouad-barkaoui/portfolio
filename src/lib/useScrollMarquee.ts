import { useEffect, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from './motion';
import { onScrollVelocity } from './scroll';

/**
 * Drives every CSS `marquee*` animation inside `band`: they follow the last
 * scroll direction and speed up while the page scrolls, then ease back. The
 * band gets `data-offscreen` while it is out of view so the CSS can pause it.
 * Strips that run the other way just use `animation-direction: reverse`, so
 * one signed playback rate keeps them opposite. Reduced motion: does nothing.
 */
export function useScrollMarquee(band: RefObject<HTMLElement>, stopped: boolean): void {
  const stoppedRef = useRef(stopped);
  stoppedRef.current = stopped;

  useEffect(() => {
    const host = band.current;
    if (!host || prefersReducedMotion()) return;

    const io = new IntersectionObserver(([e]) => {
      if (e) host.toggleAttribute('data-offscreen', !e.isIntersecting);
    });
    io.observe(host);

    const runs = (): Animation[] =>
      host.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation && a.animationName.startsWith('marquee'));

    let dir = 1;
    let boost = 0;
    let frame = 0;
    const tick = (): void => {
      boost *= 0.9;
      for (const a of runs()) a.playbackRate = dir * (1 + boost);
      frame = boost > 0.02 ? requestAnimationFrame(tick) : 0;
    };
    const off = onScrollVelocity((v) => {
      if (stoppedRef.current || Math.abs(v) < 0.2 || host.hasAttribute('data-offscreen')) return;
      dir = v > 0 ? 1 : -1;
      boost = Math.min(5, Math.max(boost, Math.abs(v) * 0.35));
      if (!frame) frame = requestAnimationFrame(tick);
    });

    return () => {
      off();
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [band]);
}
