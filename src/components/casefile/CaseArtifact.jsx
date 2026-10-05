import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// One numbered piece of evidence filed with a case. A single figure handles
// every kind, so a real screenshot can later replace a pending slot without
// any layout change:
//   image    { src, alt, caption, ratio: [w, h], meta, href?, sizes?, srcSet? }
//   excerpt  { text, caption }           recorded console / log text
//   link     { href, label, host, note }  external record (repository, post, app)
//   note     { to, label, title }         related field note on this site
//   pending  { title?, from? }            requested evidence, not filed yet: an
//                                         empty labelled slot citing the record
//   mark     { src, alt, caption, ratio } the project's own identity mark
// size: 'primary' (large evidence) or 'compact' (lists, previews).

const pad = (n) => String(n).padStart(2, '0');

const KIND_LABEL = {
  image: 'Visual record',
  excerpt: 'Recorded output',
  link: 'External record',
  note: 'Field note',
  pending: 'Requested evidence',
  mark: 'Project mark',
};

const Header = ({ number, kind, meta }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-notebook-border px-4 py-2.5">
    <span className="font-mono text-meta uppercase text-ink-faint">
      {number ? <>Artifact {pad(number)}<span className="text-notebook-border-light"> / </span></> : null}
      {KIND_LABEL[kind]}
    </span>
    {meta && <span className="font-mono text-meta text-ink-faint">{meta}</span>}
  </div>
);

// A filed screenshot, diagram or photograph at its true proportions (the box
// is sized before the file arrives, so nothing moves). If the file fails to
// load the frame says so instead of showing a broken image.
const ImageArtifact = ({ artifact, size, frame }) => {
  const [failed, setFailed] = useState(false);
  const [w, h] = artifact.ratio || [16, 10];
  const img = failed ? (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center" style={{ aspectRatio: `${w} / ${h}` }}>
      <span className="font-editorial text-body text-ink-secondary">This file could not be loaded</span>
      <span className="mt-2 max-w-sm text-small text-ink-muted">{artifact.alt}</span>
    </div>
  ) : (
    <img
      src={artifact.src}
      srcSet={artifact.srcSet}
      sizes={artifact.sizes}
      alt={artifact.alt}
      width={w}
      height={h}
      loading={size === 'primary' ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className="block w-full h-auto"
      style={{ aspectRatio: `${w} / ${h}` }}
    />
  );
  return (
    <figure className={frame}>
      <Header number={artifact.number} kind="image" meta={artifact.meta} />
      {artifact.href && !failed ? (
        <a href={artifact.href} target="_blank" rel="noopener noreferrer" aria-label={`${artifact.alt} (full size, opens in a new tab)`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus">
          {img}
        </a>
      ) : img}
      {/* Captions cite repository paths, which may break anywhere on narrow screens. */}
      {artifact.caption && <figcaption className="border-t border-notebook-border px-4 py-3 text-body-sm text-ink-muted [overflow-wrap:anywhere]">{artifact.caption}</figcaption>}
    </figure>
  );
};

// The project's identity mark. If the file fails to load, the project's name
// is set as text in the same box, so nothing breaks or moves.
const MarkArtifact = ({ artifact, size, frame }) => {
  const [failed, setFailed] = useState(false);
  const [w, h] = artifact.ratio || [3, 1];
  const box = `block h-auto w-full ${size === 'primary' ? 'max-w-[16rem]' : 'max-w-[11rem]'}`;
  return (
    <figure className={frame}>
      <Header number={artifact.number} kind="mark" />
      <div className="flex items-center justify-center px-6 py-8 sm:py-10">
        {failed ? (
          <span className={`${box} flex items-center justify-center font-editorial text-title text-ink-primary`} style={{ aspectRatio: `${w} / ${h}` }}>
            {artifact.alt}
          </span>
        ) : (
          <img
            src={artifact.src}
            alt={artifact.alt}
            width={w}
            height={h}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className={box}
            style={{ aspectRatio: `${w} / ${h}` }}
          />
        )}
      </div>
      {artifact.caption && <figcaption className="border-t border-notebook-border px-4 py-3 text-body-sm text-ink-muted">{artifact.caption}</figcaption>}
    </figure>
  );
};

const CaseArtifact = ({ artifact, size = 'primary', className = '' }) => {
  const { kind, number } = artifact;
  const frame = `case-artifact min-w-0 border border-notebook-border bg-notebook-surface ${className}`;

  if (kind === 'image') return <ImageArtifact artifact={artifact} size={size} frame={frame} />;

  if (kind === 'excerpt') {
    return (
      <figure className={frame}>
        <Header number={number} kind={kind} />
        <pre tabIndex={0} aria-label="Console excerpt" className="overflow-x-auto px-4 py-4 font-mono text-meta leading-relaxed text-ink-secondary whitespace-pre focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus">{artifact.text}</pre>
        {artifact.caption && <figcaption className="border-t border-notebook-border px-4 py-3 text-body-sm text-ink-muted">{artifact.caption}</figcaption>}
      </figure>
    );
  }

  if (kind === 'link' || kind === 'note') {
    const isNote = kind === 'note';
    const body = (
      <>
        <span className="block font-editorial text-title leading-tight text-ink-primary group-hover:text-accent-strong transition-colors duration-200">
          {isNote ? artifact.title : artifact.label}
        </span>
        <span className="mt-1 block font-mono text-meta text-ink-faint">
          {isNote ? 'Field Notes' : artifact.host}
          <span aria-hidden="true"> <span className="arrow">{isNote ? '→' : '↗'}</span></span>
        </span>
        {artifact.note && <span className="mt-1 block text-body-sm text-ink-muted">{artifact.note}</span>}
      </>
    );
    const linkClass = 'group arrow-link block px-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus';
    return (
      <figure className={frame}>
        <Header number={number} kind={kind} />
        {isNote ? (
          <Link to={artifact.to} className={linkClass}>{body}</Link>
        ) : (
          <a href={artifact.href} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={`${artifact.label}, ${artifact.host} (opens in a new tab)`}>{body}</a>
        )}
      </figure>
    );
  }

  if (kind === 'mark') return <MarkArtifact artifact={artifact} size={size} frame={frame} />;

  // pending: a mounted, empty evidence slot naming what is requested and the
  // record it would prove - never a stand-in image.
  return (
    <figure className={frame}>
      <Header number={number} kind={kind} />
      <div className={`case-pending relative flex flex-col items-center justify-center text-center px-6 py-10 ${size === 'primary' ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[16/10]'}`}>
        <span aria-hidden="true" className="case-pending__corner case-pending__corner--tl" />
        <span aria-hidden="true" className="case-pending__corner case-pending__corner--tr" />
        <span aria-hidden="true" className="case-pending__corner case-pending__corner--bl" />
        <span aria-hidden="true" className="case-pending__corner case-pending__corner--br" />
        <span className={`max-w-md font-editorial text-ink-secondary ${size === 'primary' ? 'text-title' : 'text-body'}`}>
          {artifact.title || 'Visual evidence pending'}
        </span>
        <span className="mt-3 max-w-sm text-small text-ink-muted">Not yet filed: no screenshot, diagram or recording of this is on record.</span>
      </div>
      {artifact.from && (
        <figcaption className="border-t border-notebook-border px-4 py-3 text-small text-ink-muted">
          <span className="font-mono text-meta uppercase text-ink-faint">Would show </span>
          {artifact.from}
        </figcaption>
      )}
    </figure>
  );
};

export default CaseArtifact;
