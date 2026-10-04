import { Check, Copy } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { identity, ui, type L } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { describeGap, tzOffsetMinutes, useNow } from '@/lib/time';

/** Dashed rule across the page with plus marks where it meets the frame. */
export function Rule(): JSX.Element {
  return (
    <div className="rule" aria-hidden>
      <i className="plus" data-side="start" />
      <i className="plus" data-side="end" />
    </div>
  );
}

/** Hatched band between two dashed lines, edge to edge. */
export function Hatch(): JSX.Element {
  return <div className="hatch" aria-hidden />;
}

/** Handwritten aside in the margin with a curved arrow. Wide screens only. */
export function Note({ children }: { children: ReactNode }): JSX.Element {
  return (
    <span className="note" aria-hidden>
      <span className="note-text">{children}</span>
      <svg className="note-arrow" viewBox="0 0 44 40" width="44" height="40">
        <path d="M6 3c-2 12 2 24 14 29c5 2 11 2 17 0" />
        <path d="M30 27l7 5l-7 5" />
      </svg>
    </span>
  );
}

/** Small amber "not finished yet" pill. */
export function Status({ children, tone = 'soon' }: { children: ReactNode; tone?: 'soon' | 'live' | 'dev' }): JSX.Element {
  return (
    <span className="status" data-tone={tone}>
      {children}
    </span>
  );
}

/** Section heading with its margin note and an optional count. */
export function SectionHead({
  id,
  note,
  title,
  count,
  sub,
}: {
  id: string;
  note: L;
  title: L;
  count?: number;
  sub?: L;
}): JSX.Element {
  const { t } = useLang();
  return (
    <header className="section-head">
      <Note>{t(note)}</Note>
      <h2 id={id} className="section-title">
        {t(title)}
        {count !== undefined ? <sup className="count">({count})</sup> : null}
      </h2>
      {sub ? <p className="section-sub">{t(sub)}</p> : null}
    </header>
  );
}

/** Live Morocco time with the gap to the visitor's own clock. */
export function LocalTime({ compact = false }: { compact?: boolean }): JSX.Element {
  const { t, lang } = useLang();
  const now = useNow();
  const time = !now
    ? '--:--'
    : now.toLocaleTimeString(lang === 'ar' ? 'ar-MA' : 'en-GB', {
    timeZone: identity.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    numberingSystem: 'latn',
  });
  const gap = now ? describeGap(tzOffsetMinutes(identity.timeZone, now), -now.getTimezoneOffset(), lang) : '';
  return (
    <span className="localtime">
      <span className="live-dot" aria-hidden />
      {compact ? null : <span className="localtime-place">{t(identity.country)}</span>}
      <time className="mono">
        {time}
      </time>
      <span className="localtime-gap">
        · {gap}
      </span>
      <span className="sr-only">{t(ui.inMorocco)}</span>
    </span>
  );
}

/** Email link with a copy-to-clipboard button. */
export function CopyEmail({ big = false }: { big?: boolean }): JSX.Element {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  return (
    <span className="copy-email" data-big={big || undefined}>
      <a href={`mailto:${identity.email}`} className="email-link" dir="ltr">
        {identity.email}
      </a>
      <button
        type="button"
        className="icon-btn"
        data-copied={copied || undefined}
        aria-label={copied ? t(ui.copied) : t(ui.copyEmail)}
        title={copied ? t(ui.copied) : t(ui.copyEmail)}
        onClick={() => void copy()}
      >
        {copied ? <Check size={big ? 18 : 15} strokeWidth={2.4} aria-hidden /> : <Copy size={big ? 18 : 15} strokeWidth={1.8} aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t(ui.copiedLive) : ''}
      </span>
    </span>
  );
}
