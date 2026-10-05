import React from 'react';

// The system of a case, drawn only from what its record states - nothing is
// added, renamed or inferred.
//   mode 'pipeline'     the record's pipelineSteps. A step written as
//                       "A → B → C" is drawn as a flow of its own parts; a step
//                       without arrows (e.g. "Both pipelines run concurrently…")
//                       is drawn as a note under the flows.
//   mode 'composition'  the record's architecture line, "X (role) + Y for role
//                       + Z", drawn as a ledger of components and their stated
//                       roles (a role is shown only when the record gives one).
// Screen readers get each step / component once as plain text; the drawn
// boxes and arrows are hidden from them.

const pad = (n) => String(n).padStart(2, '0');

export const parseComposition = (architecture = '') =>
  architecture.split(/\s+\+\s+/).map((part) => {
    const paren = part.match(/^(.*?)\s*\((.+)\)\s*$/);
    if (paren) return { name: paren[1].trim(), role: paren[2].trim() };
    const forRole = part.match(/^(.*?)\s+for\s+(.+)$/);
    if (forRole) return { name: forRole[1].trim(), role: forRole[2].trim() };
    return { name: part.trim(), role: null };
  }).filter((c) => c.name);

const Frame = ({ label, caption, children, className = '' }) => (
  <figure className={`min-w-0 border border-notebook-border bg-notebook-surface ${className}`}>
    <div className="border-b border-notebook-border px-4 py-2.5 font-mono text-meta uppercase text-ink-faint">{label}</div>
    <div className="px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    <figcaption className="border-t border-notebook-border px-4 py-3 text-small text-ink-muted">{caption}</figcaption>
  </figure>
);

const Pipeline = ({ steps }) => {
  const flows = steps.filter((s) => s.includes('→'));
  const notes = steps.filter((s) => !s.includes('→'));
  return (
    <>
      <ol className="space-y-6 sm:space-y-7">
        {flows.map((step, i) => {
          const parts = step.split('→').map((p) => p.trim()).filter(Boolean);
          return (
            <li key={step} className="grid gap-3 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
              <span aria-hidden="true" className="font-mono text-meta text-accent sm:pt-2.5">{pad(i + 1)}</span>
              <span className="sr-only">{step}</span>
              <div aria-hidden="true" className="flex min-w-0 flex-col items-stretch gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                {parts.map((part, j) => (
                  <React.Fragment key={part}>
                    {j > 0 && <span className="self-center px-1 text-accent sm:self-auto"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span>}
                    <span className={`border px-3 py-2 text-small leading-snug ${j === 0 ? 'border-notebook-border-light text-ink-muted' : j === parts.length - 1 ? 'border-accent/60 text-ink-primary' : 'border-notebook-border-light text-ink-secondary'}`}>
                      {part}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
      {notes.length > 0 && (
        <ul className="mt-6 space-y-2 border-t border-notebook-border pt-4">
          {notes.map((n) => (
            <li key={n} className="grid grid-cols-[1.5rem_1fr] text-small text-ink-secondary">
              <span aria-hidden="true" className="text-accent">&mdash;</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const Composition = ({ items }) => (
  <dl className="divide-y divide-notebook-border border-y border-notebook-border">
    {items.map((c) => (
      <div key={c.name} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
        <dt className="text-small text-ink-primary">{c.name}</dt>
        <dd className="text-small text-ink-muted">{c.role || <span aria-hidden="true">—</span>}{!c.role && <span className="sr-only">no role recorded</span>}</dd>
      </div>
    ))}
  </dl>
);

const SystemFigure = ({ record, mode, number, className = '' }) => {
  const figureNo = number ? `Figure ${pad(number)} · ` : '';
  if (mode === 'pipeline') {
    return (
      <Frame
        className={className}
        label={`${figureNo}Pipeline, as recorded`}
        caption="Drawn from the pipeline steps in the case record; every label is the record's own wording."
      >
        <Pipeline steps={record.pipelineSteps} />
      </Frame>
    );
  }
  return (
    <Frame
      className={className}
      label={`${figureNo}System composition, as recorded`}
      caption="Drawn from the architecture line in the case record: each component with the role it is given there."
    >
      <Composition items={parseComposition(record.architecture)} />
    </Frame>
  );
};

export default SystemFigure;
