import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { SOCIAL_LINKS } from '../config/links';
import { SEO, DocumentHeader, EditorialHeading } from '../components/common';
import { pageHeaders } from '../data/archiveMeta';
import { caseFiles } from '../data/caseFiles';
import PageHeader from '../components/layout/PageHeader';
import CaseArtifact from '../components/casefile/CaseArtifact';
import ProximityLine from '../components/motion/ProximityLine';

// The Case Files register: every project as an entry in the archive, grouped
// by the year in its reference number, in the archive's own order. Each entry
// opens its case file. On wide screens a preview beside the register shows the
// entry under the pointer or keyboard focus (the same material the case file
// holds, so it is hidden from assistive tech to avoid reading it twice).

const byYear = caseFiles.reduce((groups, c) => {
  const last = groups[groups.length - 1];
  if (last && last.year === c.year) last.items.push(c);
  else groups.push({ year: c.year, items: [c] });
  return groups;
}, []);

const years = [...new Set(caseFiles.map((c) => c.year))].sort();
const span = years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : years[0];

// What is actually on file, counted honestly: filed visual records (or how
// many are still requested), recorded output, and linked records.
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
const evidenceLine = (c) => {
  const parts = [];
  if (c.privateProject) parts.push('Private project');
  if (c.visualCount) parts.push(plural(c.visualCount, 'visual record'));
  else if (c.requestCount) parts.push(`Visual evidence requested (${c.requestCount})`);
  if (c.excerpts.length) parts.push(plural(c.excerpts.length, 'recorded output'));
  if (c.linkCount) parts.push(plural(c.linkCount, 'linked record'));
  return parts.join(' · ');
};

const Entry = ({ c, onPreview }) => {
  const r = c.record;
  return (
    <li
      className="case-entry group relative grid gap-3 border-t border-notebook-border py-7 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-focus"
      onMouseEnter={() => onPreview(c.slug)}
      onFocus={() => onPreview(c.slug)}
    >
      <div className="font-mono text-meta leading-relaxed">
        <span className="block text-ink-secondary">{r.caseNumber}</span>
        <span className="block text-ink-faint">{r.period}</span>
        <span className="block text-ink-faint uppercase">{r.ongoing ? 'Ongoing' : r.status}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-editorial text-title text-ink-primary">
          {/* The title link is stretched over the whole entry: one focus stop, the title as its name. */}
          <Link
            to={`/projects/${c.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-accent-strong transition-colors duration-200"
          >
            {r.title}
          </Link>
        </h3>
        {r.subtitle && <p className="mt-1 text-body-sm text-ink-muted">{r.subtitle}</p>}
        <p className="mt-3 font-mono text-meta text-ink-faint">
          {r.tech.slice(0, 4).join(' / ')}
          {r.tech.length > 4 && ` +${r.tech.length - 4}`}
        </p>
        <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="text-body-sm text-ink-muted">{evidenceLine(c)}</span>
          <span aria-hidden="true" className="arrow-link text-small text-ink-secondary group-hover:text-accent-strong transition-colors duration-200">
            Open case file <span className="arrow">{'→'}</span>
          </span>
        </p>
      </div>
    </li>
  );
};

const Preview = ({ c }) => {
  const r = c.record;
  return (
    <div aria-hidden="true" className="sticky top-24">
      <p className="font-mono text-meta text-ink-faint">{r.caseNumber} &middot; Preview</p>
      <p className="mt-3 font-editorial text-title text-ink-primary">{r.title}</p>
      {r.annotation && <p className="mt-4 font-editorial text-body italic text-ink-secondary">{`“${r.annotation}”`}</p>}
      {r.problem && <p className="mt-4 text-body-sm text-ink-muted line-clamp-5">{r.problem}</p>}
      {c.leadArtifact && (
        <div className="mt-6">
          {/* A decorative duplicate (aria-hidden): no full-size link, which lives on the case page. */}
          <CaseArtifact artifact={{ ...c.leadArtifact, href: undefined }} size="compact" />
        </div>
      )}
    </div>
  );
};

const ProjectsPage = () => {
  const header = pageHeaders.projects;
  const [previewSlug, setPreviewSlug] = useState(caseFiles[0]?.slug);
  const preview = caseFiles.find((c) => c.slug === previewSlug) || caseFiles[0];

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary">
      <SEO
        title="Case Files"
        description="Case files from Atharv Vatsal's archive — ML systems, computer vision pipelines, and engineering experiments."
        url="/projects"
        keywords={['projects', 'YOLOv8', 'U-Net', 'machine learning projects', 'computer vision', 'NLP']}
      />

      <PageHeader title="Case Files" />

      <div className="archive-container">
        <header className="pt-12 sm:pt-16 pb-10 sm:pb-14 max-w-4xl">
          <DocumentHeader type={header.type} docRef={header.ref} classification={header.classification} note={header.note} />
          <EditorialHeading as="h1" variant="page" reveal delay={80} className="mt-6">
            Case Files
          </EditorialHeading>
          <p className="mt-4 font-mono text-meta text-ink-muted">
            {caseFiles.length} case files &middot; {span}
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 pb-16">
          <div>
            {byYear.map((group) => (
              <section key={group.year} aria-labelledby={`cases-${group.year}`} className="mb-10">
                <h2 id={`cases-${group.year}`} className="font-mono text-meta text-accent pb-3">{group.year}</h2>
                <ol>
                  {group.items.map((c) => <Entry key={c.slug} c={c} onPreview={setPreviewSlug} />)}
                </ol>
              </section>
            ))}
          </div>

          <aside className="hidden lg:block" aria-hidden="true">
            {preview && <Preview c={preview} />}
          </aside>
        </div>
      </div>

      <section className="border-t border-notebook-border">
        <div className="archive-container py-12 sm:py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="font-mono text-meta uppercase text-ink-faint">Additional experiments</p>
            <ProximityLine className="mt-2 text-body-sm text-ink-secondary" text="More projects, contributions, and experiments on GitHub." />
          </div>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="arrow-link inline-flex items-center gap-2 self-start border border-notebook-border px-5 py-2.5 text-body-sm text-ink-primary hover:border-notebook-border-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus transition-colors duration-200"
          >
            <Github size={14} aria-hidden="true" />
            <span>View GitHub</span>
            <span aria-hidden="true" className="arrow">{'↗'}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
