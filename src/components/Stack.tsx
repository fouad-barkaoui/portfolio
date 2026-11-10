import { ArrowUpRight } from 'lucide-react';
import { siClaude, siClaudecode, siGithub, siSupabase, siVercel, type SimpleIcon } from 'simple-icons';
import { builtWith, projects, stack, ui } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { scrollToId } from '@/lib/scroll';
import type { CSSProperties } from 'react';
import { Note, SectionHead } from './primitives';
import { Sticker } from './Sticker';

const NAMES = Object.fromEntries(projects.map((p) => [p.id, p.name]));

/**
 * Official logo files dropped into src/assets/logos/<slug>.svg are picked up at
 * build time and win over everything else.
 */
const LOGO_FILES = import.meta.glob<string>('../assets/logos/*.{svg,png,webp}', { eager: true, query: '?url', import: 'default' });
const logoFor = (slug: string): string | undefined =>
  Object.entries(LOGO_FILES).find(([path]) => path.replace(/^.*\//, '').replace(/\.[a-z]+$/, '') === slug)?.[1];

/** Brand marks from Simple Icons (CC0), used as shipped. No entry: the chip shows text. */
const MARKS: Readonly<Record<string, SimpleIcon | undefined>> = {
  supabase: siSupabase,
  claude: siClaude,
  'claude-code': siClaudecode,
  vercel: siVercel,
  github: siGithub,
};

/** A brand's own colour, unless it is near black: those follow the theme's ink. */
function markColor(hex: string): string | undefined {
  const n = parseInt(hex, 16);
  const luma = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return luma < 48 ? undefined : `#${hex}`;
}

export function Stack(): JSX.Element {
  const { t } = useLang();
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <SectionHead
        id="stack-title"
        note={ui.notes.tools}
        title={ui.section.stack}
        sticker={<Sticker name="pip-headphones" size={84} rot={-7} drift={-18} float />}
      />
      <dl className="stack">
        {stack.map((g) => (
          <div key={g.id} className="stack-row">
            <dt className="mono" data-reveal="up">
              {t(g.group)}
            </dt>
            <dd>
              <ul>
                {g.items.map((it, k) => (
                  <li key={it.name} className="chip" data-reveal="pop" style={{ '--k': k + 1 } as CSSProperties}>
                    <span>{it.label ? t(it.label) : it.name}</span>
                    {it.usedIn?.map((pid) => (
                      <a
                        key={pid}
                        href="#work"
                        className="chip-link mono"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToId(`case-${pid}`);
                        }}
                        aria-label={`${it.name}: ${t(ui.usedIn)} ${NAMES[pid]}`}
                      >
                        {NAMES[pid]}
                      </a>
                    ))}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function BuiltWith(): JSX.Element {
  const { t } = useLang();
  return (
    <section className="built" aria-labelledby="built-title">
      <Note>{t(ui.notes.thanks)}</Note>
      <h2 id="built-title" className="built-title" data-reveal="up">
        {t(ui.section.builtWith)}
      </h2>
      <p className="built-sub" data-reveal="up" style={{ '--k': 1 } as CSSProperties}>
        {t(ui.section.builtWithSub)}
      </p>
      <div className="built-pill" data-reveal="up" style={{ '--k': 2 } as CSSProperties}>
        <ul className="built-row" dir="ltr">
          <li className="built-chip is-blank" aria-hidden />
          {builtWith.map((b) => {
            const logo = logoFor(b.slug);
            const mark = MARKS[b.slug];
            return (
              <li key={b.slug} className="built-chip" data-name={b.name}>
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="built-mark" aria-label={b.name}>
                  {logo ? (
                    <img src={logo} alt="" loading="lazy" />
                  ) : mark ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: markColor(mark.hex) }} aria-hidden>
                      <path d={mark.path} />
                    </svg>
                  ) : (
                    <span className="built-text mono">{b.short ?? b.name}</span>
                  )}
                </a>
              </li>
            );
          })}
          <li className="built-chip is-blank" aria-hidden />
        </ul>
      </div>
      <a
        className="btn btn-sm built-cta"
        href="#work"
        data-reveal="up"
        style={{ '--k': 3 } as CSSProperties}
        onClick={(e) => {
          e.preventDefault();
          scrollToId('work');
        }}
      >
        {t(ui.seeWork)}
        <ArrowUpRight className="flip-rtl" size={16} strokeWidth={2} aria-hidden />
      </a>
    </section>
  );
}
