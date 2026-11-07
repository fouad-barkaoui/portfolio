import type Lenis from 'lenis';
import { prefersReducedMotion } from './motion';

let lenis: Lenis | null = null;

type VelocityListener = (velocity: number) => void;
const velocityListeners = new Set<VelocityListener>();

/** Scroll velocity from Lenis (px per frame, signed). Silent without smooth scroll. */
export function onScrollVelocity(fn: VelocityListener): () => void {
  velocityListeners.add(fn);
  return () => velocityListeners.delete(fn);
}

/** Smooth scrolling (Lenis) — skipped entirely for reduced motion. */
export async function startSmoothScroll(): Promise<() => void> {
  if (prefersReducedMotion()) return () => undefined;
  const { default: LenisCtor } = await import('lenis');
  lenis = new LenisCtor({ lerp: 0.12, wheelMultiplier: 1 });
  lenis.on('scroll', (l: Lenis) => velocityListeners.forEach((fn) => fn(l.velocity)));
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

/** Pauses page scrolling (an open menu) and resumes it. */
export function lockScroll(on: boolean): void {
  document.documentElement.style.overflow = on ? 'hidden' : '';
  if (on) lenis?.stop();
  else lenis?.start();
}

const targetFor = (id: string): HTMLElement | null => (id === 'top' ? document.body : document.getElementById(id));

const focusTarget = (id: string, el: HTMLElement): void => {
  if (id !== 'top') {
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
  history.replaceState(null, '', `${window.location.search}${id === 'top' ? '' : `#${id}`}` || window.location.pathname);
};

const HEADER_GAP = 72;

/**
 * Sections below the fold skip layout until needed (content-visibility), so
 * the page can grow or shrink right after a jump. Re-measure for a few
 * frames and nudge until the target sits under the header.
 */
function settle(el: HTMLElement, tries = 6): void {
  requestAnimationFrame(() => {
    const off = el.getBoundingClientRect().top - HEADER_GAP;
    if (Math.abs(off) > 2) {
      const y = window.scrollY + off;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: 'instant' });
    }
    if (tries > 0) settle(el, tries - 1);
  });
}

/** Jumps straight to a section (used while the screen is covered). */
export function jumpToId(id: string): void {
  if (id.startsWith('case-')) window.dispatchEvent(new CustomEvent('fb:case', { detail: id }));
  const el = targetFor(id);
  if (!el) return;
  const y = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - HEADER_GAP;
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: 'instant' });
  if (id !== 'top') settle(el);
  focusTarget(id, el);
}

/** Scrolls to a section and moves keyboard focus there. */
export function scrollToId(id: string): void {
  // Case studies live in a carousel: bring the right slide on screen first.
  if (id.startsWith('case-')) window.dispatchEvent(new CustomEvent('fb:case', { detail: id }));
  const el = targetFor(id);
  if (!el) return;
  if (lenis) {
    // One more glide if the page grew under us while scrolling.
    const again = (): void => {
      if (Math.abs(el.getBoundingClientRect().top - HEADER_GAP) > 2) lenis?.scrollTo(el, { offset: -HEADER_GAP });
    };
    lenis.scrollTo(id === 'top' ? 0 : el, { offset: -HEADER_GAP, onComplete: id === 'top' ? undefined : again });
  }
  else if (prefersReducedMotion()) {
    window.scrollTo({ top: id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - HEADER_GAP, behavior: 'instant' });
    if (id !== 'top') settle(el);
  } else {
    window.scrollTo({ top: id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - HEADER_GAP, behavior: 'smooth' });
  }
  focusTarget(id, el);
}
