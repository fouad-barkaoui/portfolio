import { ArrowLeft, ArrowRight, Check, Copy, Download, Mail, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { briefSteps, briefUi, type Field, type Step } from '@/content/brief';
import { identity } from '@/content/content';
import { useLang } from '@/lib/i18n';

type Value = string | string[];
type Values = Record<string, Value>;

const STORE = 'fb.brief.v1';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Longest email body we trust every mail app to accept from a mailto: link. */
const MAILTO_BODY_MAX = 1800;

function load(): Values {
  try {
    const raw = window.localStorage.getItem(STORE);
    return { currency: 'MAD', ...(raw ? (JSON.parse(raw) as Values) : {}) };
  } catch {
    return { currency: 'MAD' };
  }
}

function makeRef(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const n = new Uint16Array(1);
  crypto.getRandomValues(n);
  return `BRF-${ymd}-${n[0]!.toString(16).toUpperCase().padStart(4, '0')}`;
}

const asList = (v: Value | undefined): string[] => (Array.isArray(v) ? v : v ? [v] : []);
const isEmpty = (v: Value | undefined): boolean => (Array.isArray(v) ? v.length === 0 : !v || !v.trim());

/** Human text for a field's answer, in English (the brief is written for Fouad). */
function answerEn(f: Field, v: Value | undefined): string {
  if (isEmpty(v)) return '';
  if (!f.options) return String(v).trim();
  return asList(v)
    .map((id) => f.options!.find((o) => o.id === id)?.label.en ?? id)
    .join(', ');
}

/** The brief as Markdown — what gets emailed, copied or downloaded. */
function toMarkdown(values: Values, ref: string, lang: string): string {
  const lines: string[] = [];
  const level = briefSteps.flatMap((s) => s.fields).find((f) => f.id === 'level')!;
  lines.push(`# Project brief: ${String(values.projectName || '').trim() || 'untitled'}`);
  lines.push('');
  lines.push(`Reference: ${ref}  `);
  lines.push(`Date: ${new Date().toISOString().slice(0, 10)}  `);
  lines.push(`Filled in: ${lang === 'ar' ? 'Arabic' : 'English'}  `);
  lines.push(`Security level: ${answerEn(level, values.level) || 'not set'}`);
  for (const step of briefSteps) {
    lines.push('', `## ${step.title.en}`, '');
    for (const f of step.fields) {
      const a = answerEn(f, values[f.id]);
      if (!a) continue;
      if (f.kind === 'textarea') lines.push(`**${f.label.en}**`, '', a, '');
      else lines.push(`- **${f.label.en}:** ${a}`);
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** A short version for mail apps that cut long mailto: links. */
function toShortText(values: Values, ref: string): string {
  const all = briefSteps.flatMap((s) => s.fields);
  const pick = (id: string): string => answerEn(all.find((f) => f.id === id)!, values[id]);
  const desc = pick('description');
  const opt = (label: string, id: string): string | null => (pick(id) ? `${label}: ${pick(id)}` : null);
  return [
    `Project brief ${ref}`,
    '',
    `Name: ${pick('name')}`,
    `Email: ${pick('email')}`,
    opt('Company', 'company'),
    `Type: ${pick('type')}`,
    `Security level: ${pick('level')}`,
    opt('Timeline', 'timeline'),
    pick('budget') ? `Budget: ${pick('budget')} ${pick('currency')}` : null,
    '',
    desc.length > 600 ? `${desc.slice(0, 600)}…` : desc,
    '',
    `The full brief is attached as brief-${ref}.md.`,
  ]
    .filter((x): x is string => x !== null)
    .join('\n');
}

function download(name: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ── Fields ───────────────────────────────────────────────────────────── */

function FieldView({
  f,
  value,
  error,
  onChange,
}: {
  f: Field;
  value: Value | undefined;
  error?: string;
  onChange: (v: Value) => void;
}): JSX.Element {
  const { t } = useLang();
  const id = `brief-${f.id}`;
  const hintId = f.hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;
  const label = (
    <>
      {t(f.label)}
      {f.required ? <span className="brief-req" aria-hidden> *</span> : null}
    </>
  );
  const hint = f.hint ? (
    <span id={hintId} className="brief-hint">
      {t(f.hint)}
    </span>
  ) : null;
  const err = error ? (
    <span id={errId} className="brief-err" role="alert">
      {error}
    </span>
  ) : null;

  if (f.kind === 'radio' || f.kind === 'cards' || f.kind === 'checks') {
    const multi = f.kind === 'checks';
    const list = asList(value);
    const toggle = (oid: string): void => {
      if (!multi) return onChange(oid);
      onChange(list.includes(oid) ? list.filter((x) => x !== oid) : [...list, oid]);
    };
    return (
      <fieldset className="brief-field brief-group" data-kind={f.kind} data-field={f.id} aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
        <legend className="brief-label">{label}</legend>
        {hint}
        <div className="brief-options">
          {f.options!.map((o) => {
            const on = list.includes(o.id);
            return (
              <label key={o.id} className="brief-option" data-on={on || undefined} data-level={f.id === 'level' ? o.id : undefined}>
                <input
                  type={multi ? 'checkbox' : 'radio'}
                  name={id}
                  value={o.id}
                  checked={on}
                  onChange={() => toggle(o.id)}
                  required={f.required && !multi}
                />
                {f.kind === 'cards' ? (
                  <span className="brief-card">
                    {f.id === 'level' ? (
                      <span className="brief-meter" aria-hidden>
                        {[1, 2, 3, 4].map((n) => (
                          <i key={n} data-lit={n <= Number(o.id) || undefined} />
                        ))}
                      </span>
                    ) : null}
                    <b>{t(o.label)}</b>
                    {o.hint ? <span>{t(o.hint)}</span> : null}
                  </span>
                ) : (
                  <span className="brief-chip">
                    {multi ? <Check size={13} strokeWidth={2.6} aria-hidden /> : null}
                    {t(o.label)}
                  </span>
                )}
              </label>
            );
          })}
        </div>
        {err}
      </fieldset>
    );
  }

  const common = {
    id,
    name: f.id,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    required: f.required,
    placeholder: f.placeholder ? t(f.placeholder) : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(e.target.value),
  };
  return (
    <div className="brief-field" data-half={f.half || undefined} data-field={f.id}>
      <label className="brief-label" htmlFor={id}>
        {label}
      </label>
      {f.kind === 'textarea' ? (
        <textarea {...common} rows={f.rows ?? 3} value={String(value ?? '')} maxLength={4000} />
      ) : f.kind === 'select' ? (
        <select {...common} value={String(value ?? f.options![0]!.id)}>
          {f.options!.map((o) => (
            <option key={o.id} value={o.id}>
              {t(o.label)}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={f.kind}
          value={String(value ?? '')}
          maxLength={200}
          autoComplete={f.id === 'name' ? 'name' : f.id === 'email' ? 'email' : f.id === 'phone' ? 'tel' : f.id === 'company' ? 'organization' : undefined}
          dir={f.kind === 'email' || f.kind === 'tel' || f.kind === 'url' ? 'ltr' : undefined}
        />
      )}
      {hint}
      {err}
    </div>
  );
}

/* ── Review ───────────────────────────────────────────────────────────── */

function Review({ values, goTo }: { values: Values; goTo: (i: number) => void }): JSX.Element {
  const { t } = useLang();
  return (
    <div className="brief-review">
      {briefSteps.map((s, i) => (
        <section key={s.id} className="brief-review-block" aria-labelledby={`review-${s.id}`}>
          <header>
            <h3 id={`review-${s.id}`}>{t(s.title)}</h3>
            <button type="button" className="brief-link" onClick={() => goTo(i)}>
              {t(briefUi.edit)}
            </button>
          </header>
          <dl>
            {s.fields
              .filter((f) => !isEmpty(values[f.id]))
              .map((f) => (
                <div key={f.id} data-wide={f.kind === 'textarea' || undefined}>
                  <dt>{t(f.label)}</dt>
                  <dd>
                    {f.options
                      ? asList(values[f.id])
                          .map((id) => {
                            const o = f.options!.find((x) => x.id === id);
                            return o ? t(o.label) : id;
                          })
                          .join(' · ')
                      : String(values[f.id])}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

/* ── The form ─────────────────────────────────────────────────────────── */

export default function BriefForm({ onClose }: { onClose: () => void }): JSX.Element {
  const { t, lang } = useLang();
  const dlg = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Values>(load);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [consentErr, setConsentErr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const ref = useMemo(makeRef, []);
  const total = briefSteps.length;
  const onReview = step === total;
  const current: Step | undefined = briefSteps[step];

  useEffect(() => {
    const d = dlg.current;
    if (d && !d.open) d.showModal();
    document.documentElement.classList.add('is-locked');
    return () => document.documentElement.classList.remove('is-locked');
  }, []);

  // Save the draft as the visitor types.
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORE, JSON.stringify(values));
      } catch {
        /* storage blocked — the draft just isn't kept */
      }
    }, 300);
    return () => window.clearTimeout(id);
  }, [values]);

  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [step]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  const set = (id: string, v: Value): void => {
    setValues((p) => ({ ...p, [id]: v }));
    if (errors[id]) setErrors((e) => ({ ...e, [id]: '' }));
  };

  const validate = (s: Step): boolean => {
    const next: Record<string, string> = {};
    for (const f of s.fields) {
      const v = values[f.id];
      if (f.required && isEmpty(v)) next[f.id] = t(briefUi.errRequired);
      else if (f.kind === 'email' && !isEmpty(v) && !EMAIL_RE.test(String(v).trim())) next[f.id] = t(briefUi.errEmail);
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      window.setTimeout(() => {
        const el = body.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        el?.querySelector<HTMLElement>('input, textarea, select')?.focus({ preventScroll: true });
      }, 20);
      return false;
    }
    return true;
  };

  const goNext = (): void => {
    if (current && !validate(current)) return;
    setStep((s) => Math.min(total, s + 1));
  };
  const goTo = (i: number): void => {
    // Jumping forward only past steps that are complete.
    for (let k = 0; k < Math.min(i, total); k++) {
      const s = briefSteps[k]!;
      if (s.fields.some((f) => f.required && isEmpty(values[f.id]))) {
        setStep(k);
        window.setTimeout(() => validate(s), 0);
        return;
      }
    }
    setErrors({});
    setStep(i);
  };

  const markdown = (): string => toMarkdown(values, ref, lang);
  const fileName = `brief-${ref}.md`;

  const confirm = (): boolean => {
    if (!consent) {
      setConsentErr(true);
      return false;
    }
    return true;
  };

  const sendMail = (): void => {
    if (!confirm()) return;
    const full = markdown();
    const subjectBits = [String(values.projectName || '').trim(), String(values.name || '').trim()].filter(Boolean).join(', ');
    const subject = `Project brief ${ref}${subjectBits ? `, ${subjectBits}` : ''}`;
    let text = full;
    if (full.length > MAILTO_BODY_MAX) {
      download(fileName, full);
      text = toShortText(values, ref);
    }
    window.location.href = `mailto:${identity.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    setSent(true);
  };

  const copy = async (): Promise<void> => {
    if (!confirm()) return;
    try {
      await navigator.clipboard.writeText(markdown());
      setCopied(true);
    } catch {
      /* clipboard blocked — download still works */
    }
  };

  const clear = (): void => {
    setValues({ currency: 'MAD' });
    setErrors({});
    setConsent(false);
    setStep(0);
    try {
      window.localStorage.removeItem(STORE);
    } catch {
      /* ignore */
    }
  };

  const progress = ((onReview ? total : step) / total) * 100;

  return (
    <dialog
      ref={dlg}
      className="brief"
      data-lenis-prevent
      aria-labelledby="brief-title"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        dlg.current?.close();
      }}
    >
      <form
        className="brief-sheet"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!onReview) goNext();
        }}
      >
        <header className="brief-top">
          <div className="brief-heading">
            <span className="brief-icon" aria-hidden>
              <ShieldCheck size={18} strokeWidth={2} />
            </span>
            <div>
              <h2 id="brief-title">{t(briefUi.title)}</h2>
              <p className="mono">{ref}</p>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={() => dlg.current?.close()} aria-label={t(briefUi.close)}>
            <X size={18} strokeWidth={1.9} aria-hidden />
          </button>
          <ol className="brief-steps">
            {[...briefSteps.map((s) => s.title), briefUi.review].map((title, i) => (
              <li key={title.en} data-state={i < step ? 'done' : i === step ? 'current' : undefined}>
                <button type="button" onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}>
                  <span className="mono" aria-hidden>
                    {i < step ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </span>
                  <em>{t(title)}</em>
                </button>
              </li>
            ))}
          </ol>
          <span className="brief-bar" aria-hidden>
            <i style={{ width: `${progress}%` }} />
          </span>
        </header>

        <div ref={body} className="brief-body">
          {step === 0 ? <p className="brief-lead">{t(briefUi.intro)}</p> : null}
          <p className="brief-kicker mono">
            {onReview ? t(briefUi.review) : `${t(briefUi.step)} ${step + 1} ${t(briefUi.of)} ${total}`}
          </p>
          <h3 className="brief-step-title">{onReview ? t(briefUi.review) : t(current!.title)}</h3>
          <p className="brief-step-intro">{onReview ? t(briefUi.reviewIntro) : t(current!.intro)}</p>

          {onReview ? (
            <>
              <Review values={values} goTo={goTo} />
              <label className="brief-consent" data-error={consentErr || undefined}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setConsentErr(false);
                  }}
                />
                <span>{t(briefUi.consent)}</span>
              </label>
              {consentErr ? (
                <p className="brief-err" role="alert">
                  {t(briefUi.errConsent)}
                </p>
              ) : null}
              {sent ? (
                <div className="brief-sent" role="status">
                  <b>{t(briefUi.sentTitle)}</b>
                  <span>{t(briefUi.sentText)}</span>
                </div>
              ) : null}
            </>
          ) : (
            <div className="brief-grid">
              {current!.fields.map((f) => (
                <FieldView key={f.id} f={f} value={values[f.id]} error={errors[f.id] || undefined} onChange={(v) => set(f.id, v)} />
              ))}
            </div>
          )}
        </div>

        <footer className="brief-foot">
          {step > 0 ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="flip-rtl" size={16} strokeWidth={2} aria-hidden />
              {t(briefUi.back)}
            </button>
          ) : (
            <button type="button" className="brief-link brief-clear" onClick={clear}>
              <RotateCcw size={14} strokeWidth={2} aria-hidden />
              {t(briefUi.clear)}
            </button>
          )}
          <span className="brief-saved mono" aria-hidden>
            <i />
            {t(briefUi.saved)}
          </span>
          {onReview ? (
            <div className="brief-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => void copy()}>
                {copied ? <Check size={15} strokeWidth={2.4} aria-hidden /> : <Copy size={15} strokeWidth={2} aria-hidden />}
                {copied ? t(briefUi.copied) : t(briefUi.copy)}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  if (confirm()) download(fileName, markdown());
                }}
              >
                <Download size={15} strokeWidth={2} aria-hidden />
                {t(briefUi.download)}
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={sendMail} title={t(briefUi.sendHint)}>
                <Mail size={15} strokeWidth={2} aria-hidden />
                {t(briefUi.send)}
              </button>
            </div>
          ) : (
            <button type="submit" className="btn btn-primary btn-sm">
              {t(briefUi.next)}
              <ArrowRight className="flip-rtl" size={16} strokeWidth={2} aria-hidden />
            </button>
          )}
        </footer>
      </form>
    </dialog>
  );
}
