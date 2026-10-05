import React from 'react';
import { Link } from 'react-router-dom';
import { caseFiles } from '../../data/caseFiles';
import EditorialHeading from '../common/EditorialHeading';
import SectionHeading from '../common/SectionHeading';
import CaseArtifact from '../casefile/CaseArtifact';

// The home page's Case Files: a curated index, not the documentation. Each
// entry gives its reference, the problem in the record's own first sentence,
// one result (a recorded before → after, else a recorded metric, else the
// outcome's first sentence) and the strongest real artifact on file (a visual
// record, the project mark, or recorded output). The evidence lives on the
// case file. Static: four entries are a repeated pattern.

const list = caseFiles.slice(0, 4);

const firstSentence = (text = '') => (text.match(/^.*?[.!?](?=\s|$)/) || [text])[0].trim();

const StatusBadge = ({ status }) => {
  const colors = {
    ongoing: 'text-accent border-accent/60',
    completed: 'text-success border-success/50',
    archived: 'text-ink-muted border-notebook-border-light',
  };
  return (
    <span className={`border px-2 py-0.5 font-mono text-meta uppercase ${colors[status] || colors.archived}`}>
      {status === 'ongoing' ? 'Active' : status}
    </span>
  );
};

// One result, as recorded.
const Result = ({ c }) => {
  const r = c.record;
  const change = c.measures[0];
  if (change) {
    return (
      <div>
        <p className="meta-label">{change.measure}</p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-3 font-editorial">
          <span className="text-body text-ink-muted"><span className="sr-only">from </span>{change.before}</span>
          <span aria-hidden="true" className="text-body text-accent">→</span>
          <span className="text-title leading-none text-ink-primary"><span className="sr-only">to </span>{change.after}</span>
        </p>
      </div>
    );
  }
  const metric = r.metrics && r.metrics[0];
  if (metric) {
    return (
      <div>
        <p className="meta-label">{metric.label}</p>
        <p className="mt-2 font-editorial text-title leading-none text-ink-primary">{metric.value}</p>
      </div>
    );
  }
  if (r.outcome) {
    return (
      <div>
        <p className="meta-label">Result</p>
        <p className="mt-2 text-small text-ink-secondary">{firstSentence(r.outcome)}</p>
      </div>
    );
  }
  return null;
};

const Card = ({ c }) => {
  const r = c.record;
  const artifact = c.leadArtifact;
  // A mark or picture sits beside the text; recorded output needs the full
  // width so its lines are not cut, so it sits underneath.
  const beside = artifact && artifact.kind !== 'excerpt';
  return (
    <article className="border border-notebook-border bg-notebook-surface">
      <div className={`grid gap-8 p-6 sm:p-8 ${beside ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-10' : ''}`}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={r.status} />
            <span className="font-mono text-meta text-ink-faint">{r.period}</span>
            <span className="font-mono text-meta uppercase text-ink-faint">{r.caseNumber}</span>
          </div>

          <EditorialHeading as="h3" variant="subsection" className="mt-5 !leading-[1.15]">
            {r.title}
          </EditorialHeading>
          {r.subtitle && <p className="mt-1 text-small text-ink-muted">{r.subtitle}</p>}

          {r.problem && (
            <div className="mt-6 max-w-xl">
              <p className="meta-label">The problem</p>
              <p className="mt-2 text-small sm:text-body-sm text-ink-secondary">{firstSentence(r.problem)}</p>
            </div>
          )}

          <div className="mt-6"><Result c={c} /></div>

          <Link
            to={`/projects/${c.slug}`}
            className="arrow-link mt-7 inline-flex min-h-11 items-center gap-1.5 text-small text-ink-primary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Open case file<span className="sr-only">: {r.title}</span> <span aria-hidden="true" className="arrow">{'→'}</span>
          </Link>
        </div>

        {artifact && (
          <div className="min-w-0 self-start">
            {/* Preview only: the full-size link belongs to the case file itself. */}
            <CaseArtifact artifact={{ ...artifact, number: undefined, href: undefined }} size="compact" />
          </div>
        )}
      </div>
    </article>
  );
};

const TechProjectsSection = () => {
  return (
    <section
      id="tech"
      aria-labelledby="tech-title"
      className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden"
    >
      <div className="archive-container relative z-10">
        <div className="max-w-5xl">
          <SectionHeading number="03" id="tech-title" className="mb-8" reveal="lines">Case Files</SectionHeading>

          <div className="space-y-6 sm:space-y-8">
            {list.map((c) => <Card key={c.slug} c={c} />)}
          </div>

          <div className="mt-12 pt-6 border-t border-notebook-border flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-meta text-ink-faint">{list.length} of {caseFiles.length} cases shown</span>
            <Link
              to="/projects"
              className="arrow-link inline-flex min-h-11 items-center gap-2 text-small text-ink-primary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              View all cases <span aria-hidden="true" className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="py-5 sm:py-6" />
    </section>
  );
};

export default TechProjectsSection;
