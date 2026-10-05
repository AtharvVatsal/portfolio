import React from 'react';
import { GlowBorder } from '../ui/spotlight-card';

// The measured result of a case: before → after changes quoted from the
// record (data/caseFiles.js MEASURED_CHANGES, each citing its source field)
// and the record's own metrics, set large so the numbers carry the result.
// Conflicting figures on record are listed beneath, so none reads as settled.

const CaseMeasures = ({ changes = [], metrics = [], notes = [] }) => {
  if (!changes.length && !metrics.length && !notes.length) return null;
  return (
    <div className="max-w-4xl">
      {changes.length > 0 && (
        <ul className="space-y-4">
          {changes.map((c) => (
            <li key={c.measure} className="relative isolate border border-notebook-border bg-notebook-surface px-4 py-5 sm:px-6">
              <GlowBorder />
              <p className="meta-label">{c.measure}</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-editorial">
                <span className="text-title text-ink-muted"><span className="sr-only">from </span>{c.before}</span>
                <span aria-hidden="true" className="text-title text-accent">→</span>
                <span className="text-headline leading-none text-ink-primary"><span className="sr-only">to </span>{c.after}</span>
              </p>
              <p className="mt-3 font-mono text-meta text-ink-faint">Source: {c.source}</p>
            </li>
          ))}
        </ul>
      )}

      {metrics.length > 0 && (
        <figure className={changes.length ? 'mt-8' : ''}>
          <dl className="grid grid-cols-1 border-l border-t border-notebook-border sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col-reverse border-b border-r border-notebook-border px-4 py-5">
                <dt className="mt-2 text-small text-ink-muted">{m.label}</dt>
                <dd className="font-editorial text-title leading-tight text-ink-primary">{m.value}</dd>
              </div>
            ))}
          </dl>
          <figcaption className="mt-2 font-mono text-meta text-ink-faint">Figures as recorded in the case notes</figcaption>
        </figure>
      )}

      {notes.length > 0 && (
        <div role="note" aria-label="Notes on the record" className="mt-8 border-l-2 border-warning/70 pl-4">
          <p className="meta-label !text-warning">Note on the record</p>
          <ul className="mt-2 space-y-1.5">
            {notes.map((n) => <li key={n} className="text-small text-ink-secondary">{n} <span className="text-ink-muted">Awaiting the author&rsquo;s confirmation.</span></li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CaseMeasures;
