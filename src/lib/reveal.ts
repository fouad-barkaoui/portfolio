import { prefersReducedMotion } from './motion';

/**
 * Scroll reveals for anything marked `data-reveal` (see the "Motion" block in
 * index.css for the variants).
 *
 * Nothing is hidden by default, so the prerendered page reads fine with no
 * JavaScript. Once this runs, an element that is already on screen is left
 * alone (no flash); one that is below the fold gets `data-wait` (hidden) and
 * plays its entrance the first time it scrolls in (`data-shown`). Elements that
 * React adds later (language switch, Arabic first render) are picked up by a
 * MutationObserver. Reduced motion: never starts.
 */
export function startReveal(): () => void {
  if (typeof window === 'undefined' || prefersReducedMotion() || !('IntersectionObserver' in window)) return () => undefined;

  const reveal = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        reveal.unobserve(el);
        el.removeAttribute('data-wait');
        el.setAttribute('data-shown', '');
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );

  // First look: on screen now → leave it be; off screen → hide and wait.
  const first = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      first.unobserve(el);
      if (e.isIntersecting) continue;
      el.setAttribute('data-wait', '');
      reveal.observe(el);
    }
  });

  const track = (el: Element): void => {
    if (el.hasAttribute('data-seen')) return;
    el.setAttribute('data-seen', '');
    first.observe(el);
  };
  const scan = (root: ParentNode): void => root.querySelectorAll('[data-reveal]').forEach(track);

  scan(document);
  document.documentElement.classList.add('has-reveal');

  const added = new MutationObserver((records) => {
    for (const r of records)
      r.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return;
        if (n.matches('[data-reveal]')) track(n);
        scan(n);
      });
  });
  const root = document.getElementById('root') ?? document.body;
  added.observe(root, { childList: true, subtree: true });

  return () => {
    added.disconnect();
    first.disconnect();
    reveal.disconnect();
  };
}
