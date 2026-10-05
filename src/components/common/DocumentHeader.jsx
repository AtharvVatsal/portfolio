import React from 'react';

// The archive reference line that opens a page: TYPE · REF (· date), in mono,
// with an optional note under it in the body face. "PUBLIC" is the default
// state of everything here, so it is not printed; any other classification is.
const DocumentHeader = ({
  type = 'ARCHIVE ENTRY',
  docRef = 'AV-ARCH-000',
  classification = 'PUBLIC',
  date,
  note,
  className = '',
}) => {
  const parts = [docRef, classification !== 'PUBLIC' && classification, date].filter(Boolean);
  return (
    <div className={className}>
      <p className="meta-label flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-accent">{type}</span>
        {parts.map((part) => (
          <React.Fragment key={part}>
            <span aria-hidden="true" className="text-ink-faint">·</span>
            <span>{part}</span>
          </React.Fragment>
        ))}
      </p>
      {note && <p className="mt-2 max-w-2xl text-small text-ink-muted">{note}</p>}
    </div>
  );
};

export default DocumentHeader;
