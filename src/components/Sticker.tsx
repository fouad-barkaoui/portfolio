import { useEffect, useRef, type CSSProperties } from 'react';
import cosmicEye from '@/assets/stickers/cosmic-eye.svg?url';
import eyeSplat from '@/assets/stickers/eye-splat.svg?url';
import flame from '@/assets/stickers/flame.svg?url';
import globe from '@/assets/stickers/globe.svg?url';
import kuroLaptop from '@/assets/stickers/kuro-laptop.svg?url';
import kuroRocket from '@/assets/stickers/kuro-rocket.svg?url';
import nazar from '@/assets/stickers/nazar.svg?url';
import peaceHand from '@/assets/stickers/peace-hand.svg?url';
import pipCoffee from '@/assets/stickers/pip-coffee.svg?url';
import pipDetective from '@/assets/stickers/pip-detective.svg?url';
import pipHeadphones from '@/assets/stickers/pip-headphones.svg?url';
import sparkleTrio from '@/assets/stickers/sparkle-trio.svg?url';
import sparkles from '@/assets/stickers/sparkles.svg?url';
import star from '@/assets/stickers/star.svg?url';
import { finePointer, prefersReducedMotion } from '@/lib/motion';

/**
 * Die-cut vinyl stickers from the "Stick It Up" pack by Samiran De
 * (see src/assets/stickers/LICENSE.md). Self-hosted, so the CSP's
 * img-src 'self' holds. Width and height are the files' own, for layout.
 */
export const STICKERS = {
  'cosmic-eye': { src: cosmicEye, w: 516, h: 464 },
  'eye-splat': { src: eyeSplat, w: 305, h: 300 },
  flame: { src: flame, w: 248, h: 275 },
  globe: { src: globe, w: 320, h: 320 },
  'kuro-laptop': { src: kuroLaptop, w: 528, h: 528 },
  'kuro-rocket': { src: kuroRocket, w: 528, h: 528 },
  nazar: { src: nazar, w: 400, h: 400 },
  'peace-hand': { src: peaceHand, w: 289, h: 301 },
  'pip-coffee': { src: pipCoffee, w: 456, h: 456 },
  'pip-detective': { src: pipDetective, w: 456, h: 456 },
  'pip-headphones': { src: pipHeadphones, w: 456, h: 456 },
  'sparkle-trio': { src: sparkleTrio, w: 307, h: 307 },
  sparkles: { src: sparkles, w: 302, h: 301 },
  star: { src: star, w: 725, h: 637 },
} as const;

export type StickerName = keyof typeof STICKERS;

interface StickerProps {
  name: StickerName;
  /** Width in px on wide screens (phones get about two thirds). */
  size: number;
  /** Resting angle in degrees. */
  rot?: number;
  /** Placement class from index.css (`stk-…`). */
  className?: string;
  /** Gentle idle bob. */
  float?: boolean;
  /** Scroll parallax distance in px (negative drifts the other way). */
  drift?: number;
  /** Extra delay before it slaps on, in ms. */
  delay?: number;
  /** Part of the hero intro instead of a scroll reveal. */
  intro?: boolean;
}

/** How far the pointer must travel before a press becomes a drag. */
const DRAG_SLOP = 4;

/**
 * A sticker slapped onto the page. It lands with a little overshoot when it
 * scrolls in, lifts and tilts toward the cursor with a vinyl sheen, and with a
 * mouse it can be peeled off and stuck somewhere else in its section (double
 * click puts it back). A tap or click without moving gives it a wiggle.
 * Decorative only: hidden from assistive tech and never focusable.
 */
export function Sticker({ name, size, rot = 0, className, float = false, drift = 22, delay = 0, intro = false }: StickerProps): JSX.Element {
  const body = useRef<HTMLSpanElement>(null);
  const s = STICKERS[name];

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const still = prefersReducedMotion();
    const mouse = finePointer();
    let frame = 0;
    let wiggleTimer = 0;
    let offset = { x: 0, y: 0 };
    let press: { x: number; y: number; id: number; dragging: boolean; min: DOMPoint; max: DOMPoint } | null = null;

    const setTilt = (e: PointerEvent): void => {
      if (still || !mouse) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', `${(-py * 18).toFixed(1)}deg`);
        el.style.setProperty('--ry', `${(px * 22).toFixed(1)}deg`);
        el.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(0)}%`);
      });
    };
    const clearTilt = (): void => {
      cancelAnimationFrame(frame);
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    };

    const wiggle = (): void => {
      el.removeAttribute('data-state');
      // Restart the keyframes even when clicked again mid-wiggle.
      void el.offsetWidth;
      el.setAttribute('data-state', 'wiggle');
      window.clearTimeout(wiggleTimer);
      wiggleTimer = window.setTimeout(() => el.removeAttribute('data-state'), 700);
    };

    const down = (e: PointerEvent): void => {
      if (!mouse || e.button !== 0) return;
      // Stay inside the section the sticker belongs to (sections clip their paint).
      const host = el.closest('.section, .hero, .motto-wrap, .footer') ?? document.body;
      const h = host.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      press = {
        x: e.clientX,
        y: e.clientY,
        id: e.pointerId,
        dragging: false,
        min: new DOMPoint(offset.x + (h.left - r.left) + 4, offset.y + (h.top - r.top) + 4),
        max: new DOMPoint(offset.x + (h.right - r.right) - 4, offset.y + (h.bottom - r.bottom) - 4),
      };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent): void => {
      if (!press || e.pointerId !== press.id) {
        setTilt(e);
        return;
      }
      const dx = e.clientX - press.x;
      const dy = e.clientY - press.y;
      if (!press.dragging) {
        if (Math.hypot(dx, dy) < DRAG_SLOP) return;
        press.dragging = true;
        clearTilt();
        el.setAttribute('data-state', 'lift');
        el.closest('.sticker')?.setAttribute('data-active', '');
      }
      const x = Math.min(press.max.x, Math.max(press.min.x, offset.x + dx));
      const y = Math.min(press.max.y, Math.max(press.min.y, offset.y + dy));
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    };
    const up = (e: PointerEvent): void => {
      if (!press || e.pointerId !== press.id) return;
      const p = press;
      press = null;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      if (!p.dragging) {
        wiggle();
        return;
      }
      offset = {
        x: Math.min(p.max.x, Math.max(p.min.x, offset.x + e.clientX - p.x)),
        y: Math.min(p.max.y, Math.max(p.min.y, offset.y + e.clientY - p.y)),
      };
      el.setAttribute('data-state', 'drop');
      el.closest('.sticker')?.removeAttribute('data-active');
      el.closest('.sticker')?.setAttribute('data-moved', '');
      window.clearTimeout(wiggleTimer);
      wiggleTimer = window.setTimeout(() => el.removeAttribute('data-state'), 450);
    };
    const reset = (): void => {
      if (!mouse) return;
      offset = { x: 0, y: 0 };
      el.style.translate = '';
      el.setAttribute('data-state', 'home');
      window.clearTimeout(wiggleTimer);
      wiggleTimer = window.setTimeout(() => el.removeAttribute('data-state'), 600);
    };
    // Touch and pen: a tap wiggles; scrolling stays the page's.
    const tap = (): void => {
      if (!mouse) wiggle();
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', clearTilt);
    el.addEventListener('dblclick', reset);
    el.addEventListener('click', tap);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(wiggleTimer);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('pointerleave', clearTilt);
      el.removeEventListener('dblclick', reset);
      el.removeEventListener('click', tap);
    };
  }, []);

  const style = {
    '--w': `${size}px`,
    '--rot': `${rot}deg`,
    '--drift': `${drift}px`,
    '--d': `${delay}ms`,
    '--mask': `url("${s.src}")`,
  } as CSSProperties;

  return (
    <span className={className ? `sticker ${className}` : 'sticker'} style={style} data-float={float || undefined} aria-hidden>
      <span className="sticker-float">
        <span ref={body} className="sticker-body" data-reveal={intro ? undefined : 'slap'} data-intro={intro ? 'sticker' : undefined}>
          <img src={s.src} width={s.w} height={s.h} alt="" draggable={false} loading={intro ? 'eager' : 'lazy'} decoding="async" />
          <span className="sticker-gloss" />
        </span>
      </span>
    </span>
  );
}

/** Small inline sticker for bands and separators (no interaction). */
export function StickerDot({ name, rot = 0 }: { name: StickerName; rot?: number }): JSX.Element {
  const s = STICKERS[name];
  return (
    <img
      className="sticker-dot"
      src={s.src}
      width={s.w}
      height={s.h}
      alt=""
      aria-hidden
      draggable={false}
      loading="lazy"
      decoding="async"
      style={{ '--rot': `${rot}deg` } as CSSProperties}
    />
  );
}
