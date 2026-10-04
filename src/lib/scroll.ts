import type Lenis from 'lenis';
import { prefersReducedMotion } from './motion';

let lenis: Lenis | null = null;

/** Smooth scrolling (Lenis) — skipped entirely for reduced motion. */
export async function startSmoothScroll(): Promise<() => void> {
  if (prefersReducedMotion()) return () => undefined;
  const { default: LenisCtor } = await import('lenis');
  lenis = new LenisCtor({ lerp: 0.12, wheelMultiplier: 1 });
  let frame = 0;
  const raf = (time: number): void => {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);
  return () => {
    cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = null;
  };
}

/** Scrolls to a section and moves keyboard focus there. */
export function scrollToId(id: string): void {
  // Case studies live in a carousel: bring the right slide on screen first.
  if (id.startsWith('case-')) window.dispatchEvent(new CustomEvent('fb:case', { detail: id }));
  const el = id === 'top' ? document.body : document.getElementById(id);
  if (!el) return;
  const offset = id === 'top' ? 0 : -72;
  if (lenis) lenis.scrollTo(id === 'top' ? 0 : el, { offset });
  else {
    const y = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
  if (id !== 'top') {
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
  history.replaceState(null, '', `${window.location.search}${id === 'top' ? '' : `#${id}`}` || window.location.pathname);
}
