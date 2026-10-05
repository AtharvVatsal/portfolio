import React from 'react';

const RevisionTimeline = ({ revisions, className = '' }) => {
  if (!revisions || revisions.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="meta-label text-ink-faint mb-4">
        REVISION HISTORY
      </div>

      {/* Timeline */}
      <div className="relative pl-4">
        {/* Vertical line */}
        <div aria-hidden="true" className="absolute left-0 top-1 bottom-1 w-px bg-notebook-border" />

        {revisions.map((revision, index) => (
          <div key={index} className="relative pb-4 last:pb-0">
            {/* Dot */}
            <div
              className={`
                absolute -left-[1.22rem] top-1.5 w-2 h-2
                border border-notebook-border
                ${index === 0 ? 'bg-accent/40' : 'bg-notebook-surface'}
              `}
            />

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
              <div className="font-mono text-meta text-ink-faint shrink-0">
                <span className="text-accent">v{revision.version}</span>
                <span className="text-ink-faint mx-1.5">·</span>
                <span className="text-ink-faint">{revision.date}</span>
              </div>
              <span className="text-body-sm text-ink-muted">
                {revision.note}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevisionTimeline;
