import { useEffect, useState } from 'react';
import type { Lang } from '@/content/content';
import { ui } from '@/content/content';

/** Minutes the given time zone is ahead of UTC at `at` (DST-aware). */
export function tzOffsetMinutes(timeZone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);
  const get = (type: Intl.DateTimeFormatPartTypes): number => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000);
}

/** Arabic counted noun: 1, 2, 3–10, 11+. */
function arUnit(n: number, one: string, two: string, few: string, many: string): string {
  if (n === 1) return one;
  if (n === 2) return two;
  const tens = n % 100;
  return tens >= 3 && tens <= 10 ? `${n} ${few}` : `${n} ${many}`;
}

function amount(mins: number, lang: Lang): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (lang === 'en') return [h ? `${h}h` : '', m ? `${m}m` : ''].filter(Boolean).join(' ');
  const hs = h ? arUnit(h, 'ساعة', 'ساعتين', 'ساعات', 'ساعة') : '';
  const ms = m ? arUnit(m, 'دقيقة', 'دقيقتين', 'دقائق', 'دقيقة') : '';
  return hs && ms ? `${hs} و${ms}` : hs || ms;
}

/** "1h ahead of you", "same time as you" … */
export function describeGap(homeMinutes: number, visitorMinutes: number, lang: Lang): string {
  const diff = homeMinutes - visitorMinutes;
  if (diff === 0) return ui.gap.same[lang];
  const tpl = diff > 0 ? ui.gap.ahead[lang] : ui.gap.behind[lang];
  return tpl.replace('{amount}', amount(Math.abs(diff), lang));
}

export function greetingFor(hour: number): keyof typeof ui.greeting {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * The visitor's clock, ticking every 20 s. `null` until mounted, so the
 * prerendered HTML and the first client render agree.
 */
export function useNow(intervalMs = 20_000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** "09.2026" from "2026-09". */
export function formatMonth(start: string): string {
  const [y, m] = start.split('-');
  return `${m}.${y}`;
}

/** Calendar months from `start` (YYYY-MM) to now, at least 1 — "1m", "1y 2m". */
export function formatDuration(start: string, now: Date, lang: Lang): string {
  const [y, m] = start.split('-').map(Number) as [number, number];
  const months = Math.max(1, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m));
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (lang === 'en') return [years ? `${years}y` : '', rest ? `${rest}m` : ''].filter(Boolean).join(' ');
  const ys = years ? arUnit(years, 'سنة', 'سنتان', 'سنوات', 'سنة') : '';
  const ms = rest ? arUnit(rest, 'شهر', 'شهران', 'أشهر', 'شهرًا') : '';
  return ys && ms ? `${ys} و${ms}` : ys || ms;
}
