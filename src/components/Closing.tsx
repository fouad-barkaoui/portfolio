import { ArrowUp, ArrowUpRight, FilePenLine, FileText, Mail } from 'lucide-react';
import { identity, motto, projects, socials, soon, ui, type Social } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { useMagnetic } from '@/lib/motion';
import { scrollToId } from '@/lib/scroll';
import { useNow } from '@/lib/time';
import { briefUi } from '@/content/brief';
import { openBrief } from '@/lib/brief';
import { BrandIcon, isBrand } from './BrandIcons';
import { Logo } from './Logo';
import { SignalField } from './SignalField';
import { CopyEmail, SectionHead, Status } from './primitives';

/* ── Experience & Recognition: empty on purpose ──────────────────────── */

function SoonPanel({ id, note, title, text }: { id: string; note: typeof ui.notes.worked; title: typeof ui.section.experience; text: typeof soon.experience }): JSX.Element {
  const { t } = useLang();
  return (
    <section className="soon-col" aria-labelledby={id}>
      <SectionHead id={id} note={note} title={title} />
      <div className="soon">
        <Status>{t(ui.status.soon)}</Status>
        <p>{t(text)}</p>
      </div>
    </section>
  );
}

export function SoonPanels(): JSX.Element {
  return (
    <div className="section soon-grid">
      <SoonPanel id="experience-title" note={ui.notes.worked} title={ui.section.experience} text={soon.experience} />
      <SoonPanel id="recognition-title" note={ui.notes.milestones} title={ui.section.recognition} text={soon.recognition} />
    </div>
  );
}

/* ── Motto ────────────────────────────────────────────────────────────── */

function Sparkle({ className }: { className: string }): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0Z" />
    </svg>
  );
}

export function Motto(): JSX.Element {
  const { t } = useLang();
  return (
    <div className="motto-wrap">
      <figure className="motto">
        <blockquote className="sr-only">
          {t(motto.lead)} {t(motto.big)}
        </blockquote>
        <p className="motto-lead" aria-hidden>
          <span className="motto-bubble">
            <i />
            <i />
            <i />
          </span>
          <span className="motto-lead-text">{t(motto.lead)}</span>
        </p>
        <p className="motto-big" aria-hidden>
          <span className="motto-sel">
            {t(motto.big)}
            <i className="motto-handle is-start" />
            <i className="motto-handle is-end" />
          </span>
          <span className="motto-sparks">
            <Sparkle className="is-a" />
            <Sparkle className="is-b" />
            <Sparkle className="is-c" />
          </span>
        </p>
      </figure>
    </div>
  );
}

/* ── Contact ──────────────────────────────────────────────────────────── */

function SocialTile({ s }: { s: Social }): JSX.Element {
  const { t } = useLang();
  const noteId = s.note ? `social-note-${s.id}` : undefined;
  const body = (
    <>
      <span className="social-icon" data-brand={isBrand(s.id) ? s.id : undefined} aria-hidden>
        {isBrand(s.id) ? <BrandIcon id={s.id} size={20} /> : <FileText size={18} strokeWidth={1.7} />}
      </span>
      <span className="social-text">
        <span className="social-name">
          {t(s.name)}
          {s.status ? <Status>{t(ui.status[s.status])}</Status> : null}
        </span>
        <span className="social-handle" dir="auto">
          {t(s.handle)}
        </span>
        {s.note ? (
          <span id={noteId} className="social-note">
            {t(s.note)}
          </span>
        ) : null}
      </span>
      {s.url ? <ArrowUpRight className="social-go flip-rtl" size={16} strokeWidth={1.8} aria-hidden /> : null}
    </>
  );
  return s.url ? (
    <a className="social" href={s.url} target="_blank" rel="noopener noreferrer me" aria-describedby={noteId}>
      {body}
    </a>
  ) : (
    <div className="social is-locked" aria-describedby={noteId}>
      {body}
    </div>
  );
}

/** The 30-second version for recruiters: roles, proof, how to reach me. */
function HireCard(): JSX.Element {
  const { t } = useLang();
  return (
    <aside id="hire" className="hire" aria-labelledby="hire-title" tabIndex={-1}>
      <p className="hire-head">
        <span className="hire-pulse" aria-hidden />
        <span className="mono">{t(ui.hire.badge)}</span>
      </p>
      <h3 id="hire-title" className="hire-title">
        {t(ui.hire.title)}
      </h3>
      <dl className="hire-list">
        <div>
          <dt className="mono">{t(ui.hire.looking)}</dt>
          <dd>
            {ui.hire.roles.map((r) => (
              <span key={r.en} className="hire-role">
                {t(r)}
              </span>
            ))}
            <span className="hire-where">{t(ui.hire.based)}</span>
          </dd>
        </div>
        <div>
          <dt className="mono">{t(ui.hire.proof)}</dt>
          <dd>
            <ul className="hire-proofs">
              {ui.hire.proofs.map((p) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(p.id);
                    }}
                  >
                    <span>{t(p.text)}</span>
                    <b>{p.name}</b>
                    <ArrowUpRight className="flip-rtl" size={14} strokeWidth={2} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
      <p className="hire-foot">{t(ui.hire.resume)}</p>
    </aside>
  );
}

/** Invitation to the project brief, for clients rather than recruiters. */
function BriefCta(): JSX.Element {
  const { t } = useLang();
  return (
    <button type="button" className="brief-cta" onClick={openBrief}>
      <span className="brief-cta-icon" aria-hidden>
        <FilePenLine size={20} strokeWidth={1.9} />
      </span>
      <span className="brief-cta-text">
        <b>{t(briefUi.cta)}</b>
        <span>{t(briefUi.ctaHint)}</span>
      </span>
      <ArrowUpRight className="flip-rtl" size={18} strokeWidth={2} aria-hidden />
    </button>
  );
}

export function Contact(): JSX.Element {
  const { t } = useLang();
  const cta = useMagnetic<HTMLAnchorElement>();
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div className="contact-main">
          <SectionHead id="contact-title" note={ui.notes.findMe} title={ui.section.contact} sub={ui.section.contactSub} />
          <CopyEmail big />
          <a ref={cta} className="btn btn-primary" href={`mailto:${identity.email}`}>
            <Mail size={17} strokeWidth={1.9} aria-hidden />
            {t(ui.writeToMe)}
          </a>
          <BriefCta />
          <HireCard />
        </div>
        <div className="contact-socials">
          <h3 className="sub-title">{t(ui.section.socials)}</h3>
          <ul className="socials">
            {socials.map((s) => (
              <li key={s.id}>
                <SocialTile s={s} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────── */

const KANZ_URL = projects.find((p) => p.id === 'kanz')?.url;

/** Morocco's clock, to the second. Dashes until mounted so SSR and hydration agree. */
function FooterClock(): JSX.Element {
  const { t, lang } = useLang();
  const now = useNow(1000);
  const locale = lang === 'ar' ? 'ar-MA' : 'en-GB';
  const time = now
    ? now.toLocaleTimeString('en-GB', { timeZone: identity.timeZone, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';
  const date = now
    ? now.toLocaleDateString(locale, { timeZone: identity.timeZone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', numberingSystem: 'latn' })
    : '\u00a0';
  return (
    <>
      <p className="footer-label mono">
        <span className="live-dot" aria-hidden />
        {t(ui.footer.localTime)}
      </p>
      <p className="footer-clock mono" dir="ltr">
        <time>{time}</time>
      </p>
      <p className="footer-date">{date}</p>
    </>
  );
}

function BackToTop(): JSX.Element {
  const { t } = useLang();
  return (
    <a
      href="#top"
      className="to-top"
      onClick={(e) => {
        e.preventDefault();
        scrollToId('top');
      }}
    >
      <span className="to-top-box" aria-hidden>
        <span className="to-top-arrows">
          <ArrowUp size={22} strokeWidth={1.8} />
          <ArrowUp size={22} strokeWidth={1.8} />
        </span>
        <i className="to-top-corner tl" />
        <i className="to-top-corner br" />
      </span>
      <span className="to-top-label mono">{t(ui.footer.top)}</span>
    </a>
  );
}

export function Footer(): JSX.Element {
  const { t } = useLang();
  const brands = socials.filter((s) => s.url && isBrand(s.id));
  return (
    <footer className="footer">
      <SignalField variant="footer" />

      <aside className="footer-cta" aria-labelledby="footer-cta-title">
        <p className="footer-cta-kicker mono">{t(ui.footer.ctaKicker)}</p>
        <p id="footer-cta-title" className="footer-cta-title">
          {t(ui.footer.ctaTitle)}
        </p>
        <a className="footer-cta-btn" href={`mailto:${identity.email}`}>
          {t(ui.footer.ctaButton)}
          <ArrowUpRight className="flip-rtl" size={20} strokeWidth={2} aria-hidden />
        </a>
      </aside>

      <div className="footer-main">
        <div className="footer-cols">
          <nav className="footer-col footer-links" aria-label={t(ui.footer.links)}>
            <ul>
              <li>
                <span className="footer-link is-locked">
                  {t(ui.footer.resume)}
                  <Status>{t(ui.status.soon)}</Status>
                </span>
              </li>
              {KANZ_URL ? (
                <li>
                  <a className="footer-link" href={KANZ_URL} target="_blank" rel="noopener noreferrer">
                    Kanz
                    <ArrowUpRight className="flip-rtl" size={15} strokeWidth={2} aria-hidden />
                  </a>
                </li>
              ) : null}
              <li>
                <a className="footer-link" href={`mailto:${identity.email}`}>
                  {t(ui.footer.email)}
                  <ArrowUpRight className="flip-rtl" size={15} strokeWidth={2} aria-hidden />
                </a>
              </li>
              <li>
                <a
                  className="footer-link"
                  href="#brief"
                  onClick={(e) => {
                    e.preventDefault();
                    openBrief();
                  }}
                >
                  {t(briefUi.menu)}
                  <ArrowUpRight className="flip-rtl" size={15} strokeWidth={2} aria-hidden />
                </a>
              </li>
            </ul>
          </nav>

          <div className="footer-col footer-top">
            <BackToTop />
          </div>

          <div className="footer-col footer-time">
            <FooterClock />
          </div>

          <div className="footer-col footer-copy">
            <Logo size={44} />
            <p className="mono" suppressHydrationWarning>
              © {new Date().getFullYear()}
              <br />
              {t(ui.footer.rights)}
            </p>
          </div>
        </div>

        <ul className="footer-socials" aria-label={t(ui.footer.socials)}>
          {brands.map((s) =>
            isBrand(s.id) ? (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer me" data-brand={s.id}>
                  <BrandIcon id={s.id} size={15} />
                  {t(s.name)}
                  <ArrowUpRight className="flip-rtl" size={13} strokeWidth={2.2} aria-hidden />
                </a>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </footer>
  );
}
