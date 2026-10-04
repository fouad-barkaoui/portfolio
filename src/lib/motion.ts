import { useEffect, useRef, type RefObject } from 'react';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = (): boolean => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Magnetic hover: the element leans a few pixels toward the pointer and
 * settles back on leave. Off for touch and reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28, max = 8): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !finePointer()) return;
    let frame = 0;
    const move = (e: PointerEvent): void => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(-max, Math.min(max, (e.clientX - (r.left + r.width / 2)) * strength));
      const dy = Math.max(-max, Math.min(max, (e.clientY - (r.top + r.height / 2)) * strength));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
    };
    const leave = (): void => {
      cancelAnimationFrame(frame);
      el.style.transform = '';
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength, max]);
  return ref;
}
