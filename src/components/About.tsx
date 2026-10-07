import { Briefcase, Clock, Languages, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bio, howIWork, identity, ui } from '@/content/content';
import { Rich, useLang } from '@/lib/i18n';
import { greetingFor } from '@/lib/time';
import { CopyEmail, LocalTime, Note } from './primitives';

function MoroccoFlag(): JSX.Element {
  return (
    <svg className="flag" viewBox="0 0 24 16" width="18" height="12" aria-hidden>
      <rect width="24" height="16" rx="2" fill="#c1272d" />
      <path d="M12 3.6l1.6 4.9-4.1-3h5l-4.1 3z" fill="none" stroke="#006233" strokeWidth="0.9" strokeLinejoin="round" />
    </svg>
  );
}

export function About(): JSX.Element {
  const { t } = useLang();
  // Set after mount from the visitor's own hour (the HTML is prerendered).
  const [part, setPart] = useState<keyof typeof ui.greeting>('afternoon');
  useEffect(() => setPart(greetingFor(new Date().getHours())), []);
  const greeting = ui.greeting[part];

  const facts = [
    { icon: Briefcase, label: ui.overview.role, value: <>{t(identity.oneLine)}</> },
    {
      icon: MapPin,
      label: ui.overview.based,
      value: (
        <>
          {t(identity.country)} <MoroccoFlag />
        </>
      ),
    },
    { icon: Clock, label: ui.overview.time, value: <LocalTime compact /> },
    { icon: Languages, label: ui.overview.languages, value: <>{t(identity.languages)}</> },
    { icon: Mail, label: ui.overview.email, value: <CopyEmail /> },
  ];

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="about-grid">
        <div className="about-main">
          <header className="section-head">
            <Note>{t(ui.notes.sayHi)}</Note>
            <p className="eyebrow mono">{t(ui.section.about)}</p>
            <h2 id="about-title" className="greeting">
              {t(greeting)}
            </h2>
          </header>
          <div className="bio">
            {bio.map((p, k) => (
              <p key={k}>
                <Rich text={t(p)} />
              </p>
            ))}
          </div>
        </div>

        <aside className="facts card" aria-label={t(ui.notes.basics)}>
          <Note>{t(ui.notes.basics)}</Note>
          <dl>
            {facts.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label.en} className="fact">
                  <dt>
                    <Icon size={15} strokeWidth={1.8} aria-hidden />
                    {t(f.label)}
                  </dt>
                  <dd>{f.value}</dd>
                </div>
              );
            })}
          </dl>
        </aside>
      </div>

      <div className="how">
        <h3 className="how-title">{t(ui.section.howIWork)}</h3>
        <ol className="how-steps">
          {howIWork.map((s, k) => (
            <li key={s.title.en} className="how-step">
              <span className="how-num mono">{String(k + 1).padStart(2, '0')}</span>
              <span className="how-step-title">{t(s.title)}</span>
              <span className="how-line">{t(s.line)}</span>
              {k < howIWork.length - 1 ? <span className="how-arrow" aria-hidden /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
