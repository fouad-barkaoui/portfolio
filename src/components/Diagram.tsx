import { Fragment } from 'react';
import type { Diagram as DiagramData } from '@/content/content';
import { useLang } from '@/lib/i18n';

/** Lanes of boxes joined by labelled dashed arrows; flips with the language direction. */
export function Diagram({ data, label, concept = false }: { data: DiagramData; label: string; concept?: boolean }): JSX.Element {
  const { t } = useLang();
  const item = (it: string | { en: string; ar: string }): string => (typeof it === 'string' ? it : t(it));

  return (
    <figure className="diagram" data-concept={concept || undefined} aria-label={label}>
      <figcaption className="diagram-label mono">
        {concept ? <span className="status" data-tone="soon">{label}</span> : label}
      </figcaption>
      <div className="diagram-body" data-framed={data.frame ? true : undefined}>
        {data.frame ? <span className="diagram-frame-label mono">{t(data.frame)}</span> : null}
        <div className="diagram-lanes" style={{ ['--lanes' as string]: data.lanes.length }}>
          {data.lanes.map((lane, i) => (
            <Fragment key={lane.label.en}>
              <div className="lane">
                <span className="lane-label mono">{t(lane.label)}</span>
                <ul className="lane-nodes">
                  {lane.nodes.map((n) => (
                    <li key={n.title.en} className="node" data-accent={n.accent || undefined}>
                      <span className="node-title">{t(n.title)}</span>
                      <span className="node-items">
                        {n.items.map((it) => (
                          <span key={item(it)}>{item(it)}</span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {i < data.links.length ? (
                <div className="link" aria-hidden>
                  <span className="link-line" />
                  <span className="link-label mono">{t(data.links[i]!)}</span>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
      <p className="diagram-foot mono">{t(data.foot)}</p>
    </figure>
  );
}
