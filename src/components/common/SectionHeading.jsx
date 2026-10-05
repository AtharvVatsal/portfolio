import React from 'react';
import EditorialHeading from './EditorialHeading';

// A home-page section's heading: its archive number (a reference, in mono)
// and its name as a real h2.
//   reveal  an EditorialReveal arrival for the name ('heading', 'mask', 'words',
//           'lines', 'fade'); static when omitted
const SectionHeading = ({ number, id, reveal = false, children, className = '' }) => (
  <div className={`flex items-baseline gap-4 ${className}`}>
    <span className="font-mono text-meta text-accent" aria-hidden="true">{number}</span>
    <EditorialHeading as="h2" variant="section" id={id} reveal={reveal}>{children}</EditorialHeading>
  </div>
);

export default SectionHeading;
