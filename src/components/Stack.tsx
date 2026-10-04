import { builtWith, projects, stack, ui } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { scrollToId } from '@/lib/scroll';
import { Note, SectionHead } from './primitives';

const NAMES = Object.fromEntries(projects.map((p) => [p.id, p.name]));

/**
 * Official logo files dropped into src/assets/logos/<slug>.svg are picked up at
 * build time; a company without a file shows its name as text.
 */
const LOGO_FILES = import.meta.glob<string>('../assets/logos/*.{svg,png,webp}', { eager: true, query: '?url', import: 'default' });
const logoFor = (slug: string): string | undefined =>
  Object.entries(LOGO_FILES).find(([path]) => path.replace(/^.*\//, '').replace(/\.[a-z]+$/, '') === slug)?.[1];

export function Stack(): JSX.Element {
  const { t } = useLang();
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <SectionHead id="stack-title" note={ui.notes.tools} title={ui.section.stack} />
      <dl className="stack">
        {stack.map((g) => (
          <div key={g.id} className="stack-row">
            <dt className="mono">{t(g.group)}</dt>
            <dd>
              <ul>
                {g.items.map((it) => (
                  <li key={it.name} className="chip">
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
                        aria-label={`${it.name} — ${t(ui.usedIn)} ${NAMES[pid]}`}
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
      <h2 id="built-title" className="built-title mono">
        {t(ui.section.builtWith)}
      </h2>
      <ul className="built-grid">
        {builtWith.map((b) => {
          const logo = logoFor(b.slug);
          return (
            <li key={b.slug}>
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="built-name" dir="ltr">
                {logo ? <img src={logo} alt={b.name} className="built-logo" loading="lazy" /> : b.name}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
