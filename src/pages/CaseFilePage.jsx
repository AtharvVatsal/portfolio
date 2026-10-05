import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SEO, DocumentHeader, EditorialReveal, EditorialHeading } from '../components/common';
import PageHeader from '../components/layout/PageHeader';
import CaseArtifact from '../components/casefile/CaseArtifact';
import SystemFigure from '../components/casefile/SystemFigure';
import CaseMeasures from '../components/casefile/CaseMeasures';
import { getCaseFile } from '../data/caseFiles';
import NotFoundPage from './NotFoundPage';
import { GlowBorder } from '../components/ui/spotlight-card';
import { TextAnimate } from '../components/ui/text-animate';
import ReadingReveal from '../components/motion/ReadingReveal';

// One case file, rendered from its existing project record and the evidence
// registers in data/caseFiles.js. The page reads as a case: the author's note
// and objective, the lead figure, then problem -> approach -> first attempt
// and revision -> evidence -> result -> lessons -> technical record. A section
// appears only when the record holds material for it; nothing is filled in.

const pad = (n) => String(n).padStart(2, '0');

const buildSections = (r, c) => [
  r.problem && { id: 'problem', label: 'The problem' },
  (r.approach || r.architecture || r.pipelineSteps) && { id: 'approach', label: 'Approach' },
  (r.firstAttemptFailed || r.revisionNote) && { id: 'revision', label: 'First attempt and revision' },
  (c.evidence.length || c.excerpts.length) && { id: 'evidence', label: 'Evidence' },
  (r.outcome || (r.metrics && r.metrics.length) || c.measures.length) && { id: 'result', label: 'Result' },
  r.lessons && r.lessons.length && { id: 'lessons', label: 'Lessons' },
  ((r.tech && r.tech.length) || c.records.length) && { id: 'record', label: 'Technical record' },
].filter(Boolean).map((s, i) => ({ ...s, n: pad(i + 1) }));

const Section = ({ section, children }) => (
  <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24 border-t border-notebook-border pt-8 sm:pt-10 mt-12 sm:mt-16 first:mt-0">
    <p className="font-mono text-meta text-ink-faint">{section.n}</p>
    <EditorialHeading as="h2" variant="subsection" id={`${section.id}-title`} className="mt-2">
      {section.label}
    </EditorialHeading>
    <div className="mt-5">{children}</div>
  </section>
);

// Section prose arrives a line at a time; the result is read into focus.
const Prose = ({ children }) => <TextAnimate by="line" animation="slideUp" className="max-w-2xl text-body-sm text-ink-secondary">{children}</TextAnimate>;
const Label = ({ children, className = '' }) => <p className={`font-mono text-meta uppercase text-ink-faint ${className}`}>{children}</p>;

// Desktop section index: shows where the reader is in a long case file.
const useActiveSection = (idKey) => {
  const [active, setActive] = useState(idKey.split(',')[0]);
  useEffect(() => {
    const ids = idKey.split(',');
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-25% 0px -65% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [idKey]);
  return active;
};

const CaseFile = ({ caseFile }) => {
  const c = caseFile;
  const { record: r, prev, next } = c;
  const sections = buildSections(r, c);
  const active = useActiveSection(sections.map((s) => s.id).join(','));
  const by = Object.fromEntries(sections.map((s) => [s.id, s]));

  // The lead figure: a filed visual record if there is one; otherwise the
  // system as the record describes it (its pipeline, else its composition).
  const visuals = c.evidence.filter((a) => a.kind === 'image');
  const requests = c.evidence.filter((a) => a.kind === 'pending');
  const hasPipeline = r.pipelineSteps && r.pipelineSteps.length > 0;
  const lead = visuals[0] ? 'visual' : hasPipeline ? 'pipeline' : r.architecture ? 'composition' : null;
  // Figures in the approach section: whichever system views the lead did not use.
  const approachFigures = [
    hasPipeline && lead !== 'pipeline' && 'pipeline',
    r.architecture && lead !== 'composition' && 'composition',
  ].filter(Boolean);
  const revisionChanges = c.measures.filter((m) => m.source === 'Revision note');
  const resultChanges = c.measures.filter((m) => m.source !== 'Revision note');
  const remainingVisuals = lead === 'visual' ? visuals.slice(1) : visuals;
  let figureNo = lead && lead !== 'visual' ? 1 : 0;

  return (
    <article className="archive-container pt-8 sm:pt-12 pb-20">
      {/* Case header */}
      <header className={`grid gap-8 ${c.mark ? 'lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-14' : ''}`}>
        <div className="max-w-4xl">
          <DocumentHeader type={r.classification} docRef={r.caseNumber} classification="PUBLIC" date={r.period} />
          <EditorialHeading as="h1" variant="page" reveal="mask" delay={80} className="mt-6">
            {r.title}
          </EditorialHeading>
          {r.subtitle && <p className="mt-3 text-body text-ink-muted">{r.subtitle}</p>}
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-meta">
            {[
              ['Status', r.ongoing ? 'Ongoing' : r.status],
              ['Revision', r.revision],
              ['Context', r.location],
              ['Duration', r.duration],
              ['Stack', r.tech && `${r.tech.slice(0, 3).join(' · ')}${r.tech.length > 3 ? ` +${r.tech.length - 3}` : ''}`],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="text-ink-faint uppercase">{k}</dt>
                  <dd className={k === 'Stack' ? 'text-ink-secondary' : 'text-ink-secondary capitalize'}>{v}</dd>
                </div>
              ))}
          </dl>
        </div>
        {c.mark && <CaseArtifact artifact={{ kind: 'mark', ...c.mark }} size="compact" />}
      </header>

      {/* The author's own note on the case, then its stated objective */}
      <div className="mt-10 sm:mt-14 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14 items-start">
        {r.annotation && (
          <figure className="max-w-3xl">
            <EditorialReveal as="blockquote" mode="fade" className="font-editorial text-title italic text-ink-primary">
              {`“${r.annotation}”`}
            </EditorialReveal>
            <figcaption className="mt-3 font-mono text-meta uppercase text-ink-faint">Case note</figcaption>
          </figure>
        )}
        {r.objective && (
          <div>
            <Label>Objective</Label>
            <TextAnimate by="word" animation="blurIn" delay={0.3} className="mt-2 text-body-sm text-ink-secondary">{r.objective}</TextAnimate>
          </div>
        )}
      </div>

      {/* Lead figure */}
      {lead && (
        <div className="mt-10 sm:mt-14">
          {lead === 'visual'
            ? <CaseArtifact artifact={visuals[0]} size="primary" />
            : <SystemFigure record={r} mode={lead} number={1} />}
        </div>
      )}

      <div className="mt-14 sm:mt-20 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14">
        <nav aria-label="Sections of this case file" className="hidden lg:block">
          <ol className="sticky top-24 space-y-1 border-l border-notebook-border">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'location' : undefined}
                  className={`-ml-px block border-l py-1.5 pl-4 text-body-sm leading-snug transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus ${
                    active === s.id ? 'border-accent text-ink-primary' : 'border-transparent text-ink-muted hover:text-ink-secondary'
                  }`}
                >
                  <span className="font-mono text-meta text-ink-faint mr-2">{s.n}</span>{s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0">
          {by.problem && <Section section={by.problem}><Prose>{r.problem}</Prose></Section>}

          {by.approach && (
            <Section section={by.approach}>
              {r.approach && <Prose>{r.approach}</Prose>}
              {approachFigures.map((mode) => (
                <SystemFigure key={mode} record={r} mode={mode} number={(figureNo += 1)} className="mt-8 max-w-4xl" />
              ))}
            </Section>
          )}

          {by.revision && (
            <Section section={by.revision}>
              <div className="grid gap-6 sm:grid-cols-2 max-w-4xl">
                {r.firstAttemptFailed && (
                  <div className="border-l-2 border-notebook-border-light pl-5">
                    <h3 className="font-mono text-meta uppercase text-ink-faint">First attempt</h3>
                    <TextAnimate by="text" animation="fadeIn" className="mt-2 text-body-sm text-ink-secondary">{r.firstAttemptFailed}</TextAnimate>
                  </div>
                )}
                {r.revisionNote && (
                  <div className="border-l-2 border-accent pl-5">
                    <h3 className="font-mono text-meta uppercase text-accent">
                      Revision{r.revision ? ` ${r.revision}` : ''}
                    </h3>
                    <TextAnimate by="text" animation="fadeIn" delay={0.12} className="mt-2 text-body-sm text-ink-secondary">{r.revisionNote}</TextAnimate>
                  </div>
                )}
              </div>
              {revisionChanges.length > 0 && (
                <div className="mt-8"><CaseMeasures changes={revisionChanges} /></div>
              )}
            </Section>
          )}

          {by.evidence && (
            <Section section={by.evidence}>
              <p className="max-w-2xl text-small text-ink-muted">
                {remainingVisuals.length || visuals.length
                  ? 'Artifacts filed with this case.'
                  : 'What is on file for this case. Screenshots and recordings are requested below; until the author files them, each slot names the artifact and the claim in the record it would show.'}
              </p>
              <div className="mt-6 space-y-8">
                {remainingVisuals.map((a) => <CaseArtifact key={a.number} artifact={a} size="primary" />)}
                {c.excerpts.map((a) => <CaseArtifact key={a.number} artifact={a} size="primary" />)}
                {requests.length > 0 && (
                  <div className={`grid gap-5 ${requests.length > 1 ? 'md:grid-cols-2' : 'max-w-3xl'}`}>
                    {requests.map((a) => <CaseArtifact key={a.number} artifact={a} size={requests.length > 1 ? 'compact' : 'primary'} />)}
                  </div>
                )}
              </div>
            </Section>
          )}

          {by.result && (
            <Section section={by.result}>
              {r.outcome && <ReadingReveal className="max-w-2xl text-body-sm text-ink-secondary" text={r.outcome} />}
              <div className={r.outcome ? 'mt-8' : ''}>
                <CaseMeasures changes={resultChanges} metrics={r.metrics || []} notes={c.recordNotes} />
              </div>
            </Section>
          )}

          {by.lessons && (
            <Section section={by.lessons}>
              <ul className="max-w-2xl space-y-4">
                {r.lessons.map((l) => (
                  <li key={l} className="grid grid-cols-[1.5rem_1fr] text-body-sm text-ink-secondary">
                    <span aria-hidden="true" className="text-accent">&mdash;</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {by.record && (
            <Section section={by.record}>
              {r.tech && r.tech.length > 0 && (
                <>
                  <Label>Stack</Label>
                  <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 max-w-4xl font-mono text-meta text-ink-secondary">
                    {r.tech.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </>
              )}
              {c.records.length > 0 && (
                <>
                  <Label className="mt-10">Collected records</Label>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {c.records.map((a) => <CaseArtifact key={a.number} artifact={a} size="compact" />)}
                  </div>
                </>
              )}
              {c.unreachable.length > 0 && (
                <p className="mt-8 max-w-2xl text-small text-ink-muted">
                  A repository is on record ({c.unreachable.map((u) => u.replace(/^https?:\/\//, '')).join(', ')}) but it is not public: it returned
                  HTTP 404 when checked on 2026-10-03, so it is not linked.
                </p>
              )}
              {c.privateProject ? (
                <p className="mt-8 max-w-2xl text-small text-ink-muted">A private project: no repository, demo or material from it is public.</p>
              ) : c.records.length === 0 && c.unreachable.length === 0 && (
                <p className="mt-8 max-w-2xl text-small text-ink-muted">No public repository, demo or post is on record for this case.</p>
              )}
            </Section>
          )}
        </div>
      </div>

      {/* Reference and neighbouring cases */}
      <footer className="mt-20 border-t border-notebook-border pt-6">
        <p className="font-mono text-meta text-ink-faint">
          {[r.caseNumber, r.revision && `REV ${r.revision}`, r.period].filter(Boolean).join(' · ')}
        </p>
        <nav aria-label="Other case files" className="mt-8 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link to={`/projects/${prev.slug}`} className="group relative isolate block border border-notebook-border p-4 hover:border-notebook-border-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-200">
              <GlowBorder />
              <span className="font-mono text-meta text-ink-faint">Previous case · {prev.ref}</span>
              <span className="mt-1 block font-editorial text-title text-ink-primary group-hover:text-accent-strong transition-colors duration-200">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/projects/${next.slug}`} className="group relative isolate block border border-notebook-border p-4 sm:text-right hover:border-notebook-border-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-200">
              <GlowBorder />
              <span className="font-mono text-meta text-ink-faint">Next case · {next.ref}</span>
              <span className="mt-1 block font-editorial text-title text-ink-primary group-hover:text-accent-strong transition-colors duration-200">{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
        <p className="mt-8">
          <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 text-small text-ink-primary underline decoration-notebook-border-light underline-offset-4 hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
            <span aria-hidden="true">{'←'}</span> All case files
          </Link>
        </p>
      </footer>
    </article>
  );
};

const CaseFilePage = () => {
  const { slug } = useParams();
  const caseFile = getCaseFile(slug);

  // Moving between case files keeps this page mounted; start each at the top.
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [slug]);

  if (!caseFile) return <NotFoundPage />;
  const r = caseFile.record;

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary">
      <SEO title={`${r.title} — Case File`} description={r.objective || r.subtitle} url={`/projects/${caseFile.slug}`} />
      <PageHeader title={r.caseNumber} trail={[{ label: 'Case Files', to: '/projects' }]} />
      <CaseFile key={caseFile.slug} caseFile={caseFile} />
    </div>
  );
};

export default CaseFilePage;
