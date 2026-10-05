import React from 'react';

// Shown only while a route's code chunk downloads (usually a few frames).
// A plain status line: no fake steps, no progress it cannot measure. Held
// invisible for 300ms so a fast load never flashes it.
const PageLoader = () => (
  <div role="status" className="archive-container pt-16">
    <p className="meta-label opacity-0 animate-[loaderIn_200ms_ease-out_300ms_forwards] motion-reduce:opacity-100 motion-reduce:animate-none">
      Opening entry…
    </p>
  </div>
);

export default PageLoader;
