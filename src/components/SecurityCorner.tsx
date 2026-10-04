import { Activity, Crosshair, Radar, Terminal, type LucideIcon } from 'lucide-react';
import { attackTactics, security, ui } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { SectionHead } from './primitives';

const ICONS: Record<string, LucideIcon> = { soc: Activity, cti: Radar, attack: Crosshair, kali: Terminal };

export function SecurityCorner(): JSX.Element {
  const { t } = useLang();
  return (
    <section id="security" className="section" aria-labelledby="security-title">
      <SectionHead id="security-title" note={ui.notes.practise} title={ui.section.security} sub={ui.section.securitySub} />

      <ul className="sec-grid">
        {security.map((s) => {
          const Icon = ICONS[s.id] ?? Activity;
          return (
            <li key={s.id} className="sec-card card" data-id={s.id}>
              <div className="sec-top">
                <span className="sec-icon" aria-hidden>
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <span className="sec-kind mono">{t(s.kind)}</span>
              </div>
              <h3 className="sec-title">{t(s.title)}</h3>
              <p className="sec-line">{t(s.line)}</p>
              <ul className="tags">
                {s.tools.map((tool) => (
                  <li key={tool} className="tag mono">
                    {tool}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <figure className="attack" aria-labelledby="attack-cap">
        <ol className="attack-row" dir="ltr">
          {attackTactics.map((tac, k) => (
            <li key={tac} className="attack-cell">
              <span className="mono attack-id">{String(k + 1).padStart(2, '0')}</span>
              <span className="attack-name">{tac}</span>
            </li>
          ))}
        </ol>
        <figcaption id="attack-cap" className="attack-cap mono">
          MITRE ATT&amp;CK · {t(ui.attackCaption)}
        </figcaption>
      </figure>
    </section>
  );
}
