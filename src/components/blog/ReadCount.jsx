import React from 'react';

// A field note's read count as the last item of a mono meta line, with its own
// "·" separator. Until the count is known (loading, or the counter is
// unreachable) both are held invisible, so nothing shifts when it arrives.
// Imported by path, not through ./index, so the home page does not pull in the
// Markdown renderer.
const ReadCount = ({ count }) => {
  const known = Number.isFinite(count);
  return (
    <>
      <span aria-hidden="true" className={known ? 'text-ink-faint' : 'invisible'}>·</span>
      {known ? (
        <span className="text-ink-faint">
          {count.toLocaleString('en-US')} {count === 1 ? 'read' : 'reads'}
        </span>
      ) : (
        <span aria-hidden="true" className="invisible">0 reads</span>
      )}
    </>
  );
};

export default ReadCount;
