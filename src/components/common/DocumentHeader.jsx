import React from 'react';

const DocumentHeader = ({
  type = 'ARCHIVE ENTRY',
  docRef = 'AV-ARCH-000',
  classification = 'PUBLIC',
  date,
  note,
  className = '',
}) => {
  return (
    <div className={`meta-label ${className}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-blueprint/60">{type}</span>
        <span className="text-ink-faint/70">|</span>
        <span>{docRef}</span>
        <span className="text-ink-faint/70">|</span>
        <span className={classification === 'PUBLIC' ? 'text-ink-faint/60' : 'text-amber/60'}>
          {classification}
        </span>
        {date && (
          <>
            <span className="text-ink-faint/70">|</span>
            <span>{date}</span>
          </>
        )}
      </div>
      {note && (
        <p className="mt-1 text-meta text-ink-faint/60 tracking-normal normal-case font-normal italic">
          {note}
        </p>
      )}
    </div>
  );
};

export default DocumentHeader;
