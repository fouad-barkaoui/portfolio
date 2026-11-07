import { prefersReducedMotion } from './motion';
import { holdOnScreen, playHeld } from './reveal';
import { jumpToId, scrollToId } from './scroll';

/** Power1 in-out, the curve the stroke is drawn and wiped with. */
const EASE = 'cubic-bezier(0.45, 0, 0.55, 1)';
const COVER_MS = 950;
const UNCOVER_MS = 1150;

let busy = false;

const frame = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));
const wait = (ms: number): Promise<void> => new Promise((r) => window.setTimeout(r, ms));

/**
 * Menu navigation with a screen-wide transition: a lime scribble draws on
 * and thickens until it covers the page, the page jumps to the section
 * underneath, then the scribble wipes off from its start while the
 * section's headings and cards rise in. Without motion (reduced motion, no
 * Web Animations), it falls back to a plain smooth scroll.
 */
export async function navigateTo(id: string): Promise<void> {
  const wrap = document.querySelector<HTMLElement>('.wipe');
  const path = wrap?.querySelector<SVGPathElement>('path');
  if (!wrap || !path || prefersReducedMotion() || typeof path.animate !== 'function') {
    scrollToId(id);
    return;
  }
  if (busy) return;
  busy = true;
  wrap.setAttribute('data-on', '');

  try {
    // Draw on, then thicken (the width starts a beat later, like a brush).
    const draw = path.animate([{ strokeDasharray: '0 1' }, { strokeDasharray: '0.85 1' }], {
      duration: COVER_MS,
      easing: EASE,
      fill: 'forwards',
    });
    const grow = path.animate([{ strokeWidth: '5%' }, { strokeWidth: '30%' }], {
      duration: COVER_MS - 240,
      delay: 240,
      easing: EASE,
      fill: 'both',
    });
    await Promise.all([draw.finished, grow.finished]);

    // Covered: move the page, hide what will rise in.
    jumpToId(id);
    const held = holdOnScreen();
    await frame();
    await frame();

    // Wipe off from the start of the stroke while it thins back down.
    const off = path.animate(
      [
        { strokeDasharray: '1 1', strokeDashoffset: '0', strokeWidth: '30%' },
        { strokeDasharray: '0 1', strokeDashoffset: '-1', strokeWidth: '5%' },
      ],
      { duration: UNCOVER_MS, easing: EASE, fill: 'forwards' },
    );
    draw.cancel();
    grow.cancel();
    await wait(380);
    playHeld(held);
    await off.finished;
    off.cancel();
  } finally {
    wrap.removeAttribute('data-on');
    busy = false;
  }
}
