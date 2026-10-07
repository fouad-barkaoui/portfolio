import { ArrowUp, Check, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ui, type L } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { scrollToId } from '@/lib/scroll';

interface Entry {
  id: string;
  label: L;
  level: 2 | 3;
}

const ENTRIES: readonly Entry[] = [
  { id: 'about', label: ui.nav.about, level: 2 },
  { id: 'work', label: ui.nav.work, level: 2 },
  { id: 'case-kanz', label: { en: 'Kanz', ar: 'Kanz' }, level: 3 },
  { id: 'case-prompt', label: { en: 'Prompt Engine', ar: 'Prompt Engine' }, level: 3 },
  { id: 'case-studio', label: { en: 'Resume Studio', ar: 'Resume Studio' }, level: 3 },
  { id: 'case-assas', label: { en: 'ASSAS', ar: 'ASSAS' }, level: 3 },
  { id: 'security', label: ui.nav.security, level: 2 },
  { id: 'stack', label: ui.nav.stack, level: 2 },
  { id: 'experience-title', label: ui.section.experience, level: 2 },
  { id: 'recognition-title', label: ui.section.recognition, level: 2 },
  { id: 'contact', label: ui.nav.contact, level: 2 },
];

const RING_R = 8.5;
const RING_C = 2 * Math.PI * RING_R;
/** A section counts as current once its top reaches this line under the header. */
const LINE = 120;

/**
 * Floating reading-progress pill (ported from Kanz): a ring that fills as you
 * scroll, an "Index" menu listing every section (the current one is marked and
 * each shows where it sits), and a live percentage. It rises in once you start
 * scrolling and tucks away again at the top.
 */
export function ScrollIndex(): JSX.Element {
  const { t } = useLang();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(-1);
  const [marks, setMarks] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const frame = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const update = useCallback(() => {
    frame.current = 0;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    setProgress(max > 64 ? Math.min(1, Math.max(0, y / max)) : 0);
    setVisible(max > 64 && y > 40);
    let idx = -1;
    ENTRIES.forEach((e, i) => {
      const el = document.getElementById(e.id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      // A case study in a carousel slide that isn't on screen doesn't count.
      if (el.closest('.carousel-slide:not([data-active])')) return;
      if (r.top <= LINE) idx = i;
    });
    setActive(idx);
  }, []);

  const measure = useCallback(() => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    setMarks(
      ENTRIES.map((e) => {
        const el = document.getElementById(e.id);
        return el ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY) / max)) : 0;
      }),
    );
  }, []);

  useEffect(() => {
    const schedule = (): void => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [update]);

  // Menu: measure where each section sits, focus the current one, close on
  // outside press, Escape or Tab.
  useEffect(() => {
    if (!open) return;
    measure();
    const items = menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    const current = menu.current?.querySelector<HTMLButtonElement>('[data-active="true"]');
    (current ?? items?.[0])?.focus({ preventScroll: true });
    const onDown = (e: PointerEvent): void => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, measure]);

  const close = (refocus: boolean): void => {
    setOpen(false);
    if (refocus) trigger.current?.focus({ preventScroll: true });
  };

  const go = (id: string): void => {
    setOpen(false);
    // let the menu close first so nothing competes with the smooth scroll
    window.setTimeout(() => scrollToId(id), 30);
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>): void => {
    const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    const at = items.indexOf(document.activeElement as HTMLButtonElement);
    const move = (to: number): void => {
      e.preventDefault();
      items[(to + items.length) % items.length]?.focus({ preventScroll: true });
    };
    if (e.key === 'ArrowDown') move(at + 1);
    else if (e.key === 'ArrowUp') move(at - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(items.length - 1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'Tab') close(false);
  };

  const pct = Math.round(progress * 100);
  const done = pct >= 100;
  const current = active >= 0 ? ENTRIES[active] : undefined;

  return (
    <div className="scroll-index-anchor">
      <div ref={root} className="scroll-index" data-visible={visible || open} data-done={done} role="navigation" aria-label={t(ui.index.progress)}>
        <svg className="scroll-index-ring" viewBox="0 0 22 22" width={22} height={22} aria-hidden>
          <circle cx="11" cy="11" r={RING_R} className="scroll-index-ring-track" />
          <circle
            cx="11"
            cy="11"
            r={RING_R}
            className="scroll-index-ring-fill"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - progress)}
          />
          {done ? <path d="M7.4 11.2l2.4 2.4 4.8-5" className="scroll-index-ring-check" /> : null}
        </svg>

        <button
          ref={trigger}
          type="button"
          className="scroll-index-trigger"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && !open) {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span className="sr-only">{t(ui.index.open)}: </span>
          <span className="scroll-index-label">
            {current ? (
              <span key={active} className="scroll-index-current">
                {t(current.label)}
              </span>
            ) : (
              t(ui.index.title)
            )}
          </span>
          <ChevronDown className="scroll-index-chev" size={14} strokeWidth={2.4} aria-hidden />
        </button>

        <span className="scroll-index-pct mono" dir="ltr" aria-hidden>
          {pct}%
        </span>

        {open ? (
          <div className="scroll-index-pop">
            <div ref={menu} id={menuId} className="scroll-index-menu" role="menu" aria-label={t(ui.index.title)} onKeyDown={onMenuKey}>
              <p className="scroll-index-head mono" aria-hidden>
                {t(ui.index.title)}
              </p>
              <button type="button" role="menuitem" tabIndex={-1} className="scroll-index-item" onClick={() => go('top')}>
                <ArrowUp className="scroll-index-up" size={13} strokeWidth={2} aria-hidden />
                <span className="scroll-index-text">{t(ui.index.top)}</span>
              </button>
              {ENTRIES.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  className="scroll-index-item"
                  data-active={i === active}
                  data-level={e.level}
                  style={{ ['--i' as string]: i + 1 }}
                  onClick={() => go(e.id)}
                >
                  <span className="scroll-index-dot" aria-hidden />
                  <span className="scroll-index-text">
                    {t(e.label)}
                    {i === active ? <span className="sr-only">, {t(ui.index.current)}</span> : null}
                  </span>
                  {i === active ? (
                    <Check className="scroll-index-check" size={12} strokeWidth={2.4} aria-hidden />
                  ) : (
                    <span className="scroll-index-at mono" dir="ltr" aria-hidden>
                      {Math.round((marks[i] ?? 0) * 100)}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
