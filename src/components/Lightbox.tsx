import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ui } from '@/content/content';
import { useLang } from '@/lib/i18n';
import { Picture } from './Picture';

export interface LightboxShot {
  pic: ImagetoolsPicture;
  alt: string;
  caption: string;
}

/**
 * Full-screen viewer for a case study's screenshots. A native modal <dialog>
 * keeps focus inside and closes on Escape; arrow keys step through the set.
 */
export function Lightbox({
  shots,
  index,
  onIndex,
  onClose,
}: {
  shots: readonly LightboxShot[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}): JSX.Element | null {
  const { t, lang } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  const shot = shots[index];
  const many = shots.length > 1;
  const step = (d: number): void => onIndex((index + d + shots.length) % shots.length);

  useEffect(() => {
    const dlg = ref.current;
    if (dlg && !dlg.open) dlg.showModal();
    document.documentElement.classList.add('is-locked');
    return () => document.documentElement.classList.remove('is-locked');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (!many) return;
      // In Arabic the next image sits to the left.
      const fwd = lang === 'ar' ? 'ArrowLeft' : 'ArrowRight';
      const back = lang === 'ar' ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === fwd) step(1);
      else if (e.key === back) step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!shot) return null;
  return (
    <dialog
      ref={ref}
      className="lightbox"
      data-lenis-prevent
      aria-label={shot.caption}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className="lightbox-bar">
        <p className="lightbox-caption mono">
          {many ? (
            <span className="lightbox-count" dir="ltr">
              {index + 1} / {shots.length}
            </span>
          ) : null}
          {shot.caption}
        </p>
        <button type="button" className="icon-btn" onClick={() => ref.current?.close()} aria-label={t(ui.close)} autoFocus>
          <X size={18} strokeWidth={1.9} aria-hidden />
        </button>
      </div>
      <div className="lightbox-stage" onClick={(e) => e.target === e.currentTarget && ref.current?.close()}>
        <Picture key={index} pic={shot.pic} alt={shot.alt} sizes="94vw" className="lightbox-pic" eager />
      </div>
      {many ? (
        <>
          <button type="button" className="lightbox-nav is-prev" onClick={() => step(-1)} aria-label={t(ui.project.prev)}>
            <ChevronLeft className="flip-rtl" size={22} strokeWidth={2} aria-hidden />
          </button>
          <button type="button" className="lightbox-nav is-next" onClick={() => step(1)} aria-label={t(ui.project.next)}>
            <ChevronRight className="flip-rtl" size={22} strokeWidth={2} aria-hidden />
          </button>
        </>
      ) : null}
    </dialog>
  );
}
