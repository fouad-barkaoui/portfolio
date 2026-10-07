import { useEffect, useRef } from 'react';
import { finePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * The page's dot grid, lit in lime around the cursor. The lit dots sit on the
 * same 26px lattice as the body's dots, so it reads as one grid. The script
 * only feeds the cursor position and the grid offset; on touch screens and
 * with reduced motion the dots simply stay still.
 */
export function SignalField({ variant }: { variant: 'hero' | 'footer' }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    // Keep the lit dots on the same 26px lattice as the body's dot grid.
    const align = (): void => {
      const r = el.getBoundingClientRect();
      const ox = -((r.left + window.scrollX) % 26);
      const oy = -((r.top + window.scrollY) % 26);
      el.style.setProperty('--ox', `${ox.toFixed(1)}px`);
      el.style.setProperty('--oy', `${oy.toFixed(1)}px`);
    };
    align();
    window.addEventListener('resize', align, { passive: true });

    if (prefersReducedMotion() || !finePointer()) return () => window.removeEventListener('resize', align);

    let frame = 0;
    const move = (e: PointerEvent): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
        el.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
        el.dataset.live = '';
      });
    };
    const leave = (): void => {
      cancelAnimationFrame(frame);
      delete el.dataset.live;
    };
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', align);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={ref} className="field" data-variant={variant} data-intro={variant === 'hero' ? 'field' : undefined} aria-hidden>
      <span className="field-dots" />
    </div>
  );
}
