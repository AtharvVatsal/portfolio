import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO, DocumentHeader, EditorialHeading } from '../components/common';
import { pageHeaders } from '../data/archiveMeta';
import { getAnnotation } from '../data/annotations';
import { observations, archiveSpan, subjectFilters, singleSubjects, camerasOnRecord } from '../data/observations';
import PageHeader from '../components/layout/PageHeader';
import AnimatedPhotoWall from '../components/observations/AnimatedPhotoWall';
import ObservationViewer from '../components/observations/ObservationViewer';
import { TextAnimate } from '../components/ui/text-animate';

// Observations: the photographic archive. A short header and the subject
// index, then the whole collection as one photographic wall that turns to face
// the visitor and runs its columns past as they scroll (AnimatedPhotoWall, the
// 21st.dev Animated Scroll Gallery motion model), then the closing record.
// Any photograph opens the viewer with its full record.

const ALL = 'All';
const intro = getAnnotation('photography', 0)?.text;

const ObservationsPage = () => {
  const header = pageHeaders.gallery;
  const [subject, setSubject] = useState(ALL);
  const [viewer, setViewer] = useState(null);
  const opener = useRef(null);

  const shown = subject === ALL ? observations : observations.filter((o) => o.subjects.includes(subject));

  const open = (o, trigger) => {
    opener.current = trigger;
    setViewer({ index: shown.indexOf(o) });
  };

  // Closing the viewer returns focus to the photograph that opened it.
  useEffect(() => {
    if (viewer || !opener.current) return;
    opener.current.focus({ preventScroll: true });
    opener.current = null;
  }, [viewer]);

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary">
      <SEO
        title="Observations"
        description="Observation log by Atharv Vatsal — landscapes, wildlife, concerts, street photography."
        url="/gallery"
      />

      <PageHeader title="Observations" />

      <header className="archive-container pt-8 sm:pt-14 pb-6 sm:pb-8">
        <div>
          <DocumentHeader type={header.type} docRef={header.ref} classification={header.classification} note={header.note} />
        </div>
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div>
            <EditorialHeading as="h1" variant="page" reveal delay={100}>
              Observations
            </EditorialHeading>
            {intro && (
              <TextAnimate by="word" animation="blurInUp" delay={0.35} className="mt-4 max-w-2xl text-body-sm sm:text-body text-ink-secondary">
                {intro}
              </TextAnimate>
            )}
          </div>
          <p className="font-mono text-meta text-ink-muted lg:pb-2">
            {observations.length} photographs &middot; {archiveSpan}
          </p>
        </div>
      </header>

      <section aria-label="Subject index" className="archive-container pb-6 sm:pb-8">
        <div className="border-t border-notebook-border pt-5 flex flex-col gap-3 lg:flex-row lg:items-baseline lg:gap-6">
          {/* Phones: one sideways row (the cut-off last button shows it scrolls); wider: wraps. */}
          <p id="subject-label" className="font-mono text-meta uppercase text-ink-faint shrink-0">Subject</p>
          <div role="group" aria-labelledby="subject-label" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {[{ name: ALL, count: observations.length }, ...subjectFilters].map((f) => {
              const active = subject === f.name;
              return (
                <button
                  key={f.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSubject(f.name)}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap border px-3 font-mono text-meta transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                    active
                      ? 'border-accent text-ink-primary'
                      : 'border-notebook-border text-ink-muted hover:border-notebook-border-light hover:text-ink-primary'
                  }`}
                >
                  {f.name}
                  <span className={active ? 'text-accent' : 'text-ink-faint'}>{f.count}</span>
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="font-mono text-meta text-ink-muted lg:ml-auto lg:text-right">
            {subject === ALL ? `All ${observations.length}, newest first` : `${shown.length} of ${observations.length} · ${subject}`}
          </p>
        </div>

      </section>

      {/* The wall runs wider than the text column: a full photographic field. */}
      <section aria-labelledby="archive-title" className="pb-16 sm:pb-20">
        <h2 id="archive-title" className="sr-only">The archive</h2>
        <AnimatedPhotoWall key={subject} items={shown} onOpen={open} />
      </section>

      <section aria-labelledby="archive-end" className="border-t border-notebook-border">
        <div className="archive-container py-12 sm:py-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <EditorialHeading as="h2" variant="section" id="archive-end">End of the archive</EditorialHeading>
            <p className="mt-3 font-mono text-meta text-ink-muted">
              {observations.length} photographs &middot; {archiveSpan}
            </p>
            {singleSubjects.length > 0 && (
              <TextAnimate by="text" animation="fadeIn" className="mt-2 text-body-sm text-ink-muted">{`Subjects with a single photograph: ${singleSubjects.join(', ')}.`}</TextAnimate>
            )}
            {camerasOnRecord.length > 0 && (
              <TextAnimate by="text" animation="fadeIn" delay={0.1} className="mt-2 text-body-sm text-ink-muted">{`Cameras on record: ${camerasOnRecord.join(', ')}.`}</TextAnimate>
            )}
          </div>
          <Link
            to="/"
            className="arrow-link inline-flex min-h-11 items-center gap-2 self-start font-editorial text-body text-ink-primary underline decoration-notebook-border-light underline-offset-[6px] hover:decoration-ink-primary transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
          >
            Back to the archive <span aria-hidden="true" className="arrow">&rarr;</span>
          </Link>
        </div>
      </section>

      {viewer && (
        <ObservationViewer
          list={shown}
          index={viewer.index}
          context={subject === ALL ? null : subject}
          onIndex={(index) => setViewer({ index })}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
};

export default ObservationsPage;
