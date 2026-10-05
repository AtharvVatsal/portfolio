import React from 'react';

// The technical record of one photograph, exactly as filed in gallery.js.
// A row appears only when the field exists; nothing is filled in.
const ObservationRecord = ({ observation: o, className = '' }) => {
  const rows = [
    ['Place', o.location],
    ['Date', o.when ? <time dateTime={o.when.iso}>{o.when.label}</time> : o.date],
    ['Subject', o.category],
    ['Camera', o.camera],
    ['Lens', o.lens],
    ['Exposure', o.exposure.length ? o.exposure.join(' · ') : null],
  ].filter(([, value]) => value);

  return (
    <dl className={`grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-1.5 font-mono text-meta ${className}`}>
      {rows.map(([label, value]) => (
        <React.Fragment key={label}>
          <dt className="uppercase text-ink-faint">{label}</dt>
          <dd className="text-ink-secondary">{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

export default ObservationRecord;
