import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { galleryPhotos } from '../../data/gallery';
import { pageHeaders } from '../../data/archiveMeta';
import PhotoPrint from './PhotoPrint';
import EditorialReveal from '../common/EditorialReveal';
import SectionHeading from '../common/SectionHeading';

const ARROW = '\u2192';
const LAND = '(min-width: 1024px) 28vw, (min-width: 768px) 60vw, 76vw';
const PORT = '(min-width: 1024px) 17vw, (min-width: 768px) 42vw, 56vw';

// The homepage desk: a curated handful of prints from data/gallery.js.
// The full collection lives at /gallery. Order = stacking order on desktop
// (last on top) and reading order on smaller screens (first on top).
// ratio = the photograph's real proportions (from the Cloudinary assets),
// used only to reserve space before each image loads.
// lg: free-form composition (% of desk) \u00B7 sm/md: loose overlapping column.
const DESK = [
  // Bottom row.
  { id: 32, ratio: [3, 2], sizes: LAND, lg: { x: '6%', y: '66%', w: '27%', r: -2 }, md: { x: '0%', w: '58%' }, sm: { x: '0%', w: '76%', r: -2 } },
  { id: 24, ratio: [3, 2], sizes: LAND, lg: { x: '37%', y: '64.5%', w: '29%', r: 2.5 }, md: { x: '40%', w: '58%' }, sm: { x: '24%', w: '76%', r: 1.5 } },
  { id: 39, ratio: [800, 537], sizes: LAND, lg: { x: '69%', y: '66%', w: '27%', r: -2.5 }, md: { x: '4%', w: '58%' }, sm: { x: '2%', w: '76%', r: -1.5 } },
  // Middle row.
  { id: 11, ratio: [3, 2], sizes: LAND, lg: { x: '2%', y: '35%', w: '26%', r: 2 }, md: { x: '38%', w: '58%' }, sm: { x: '22%', w: '76%', r: 2 } },
  { id: 14, ratio: [2, 3], sizes: PORT, lg: { x: '29%', y: '37%', w: '14.5%', r: -3 }, md: { x: '8%', w: '42%' }, sm: { x: '6%', w: '56%', r: -1.5 } },
  { id: 5, ratio: [3, 2], sizes: LAND, lg: { x: '46%', y: '35%', w: '26%', r: 1.5 }, md: { x: '40%', w: '58%' }, sm: { x: '24%', w: '76%', r: 1.5 } },
  { id: 10, ratio: [3, 2], sizes: LAND, lg: { x: '73%', y: '39.5%', w: '25%', r: -2.5 }, md: { x: '2%', w: '58%' }, sm: { x: '2%', w: '76%', r: -2 } },
  // Top row.
  { id: 3, ratio: [3, 2], sizes: LAND, lg: { x: '3%', y: '4%', w: '27%', r: -3 }, md: { x: '40%', w: '58%' }, sm: { x: '24%', w: '76%', r: 1 } },
  { id: 8, ratio: [2, 3], sizes: PORT, lg: { x: '31%', y: '9%', w: '15%', r: 3.5 }, md: { x: '8%', w: '42%' }, sm: { x: '6%', w: '56%', r: -1.5 } },
  { id: 41, ratio: [3, 2], sizes: LAND, lg: { x: '48%', y: '2%', w: '28%', r: -2 }, md: { x: '38%', w: '60%' }, sm: { x: '22%', w: '78%', r: 2 } },
  { id: 13, ratio: [800, 1256], sizes: PORT, lg: { x: '79%', y: '3%', w: '16%', r: 4 }, md: { x: '6%', w: '42%' }, sm: { x: '4%', w: '56%', r: -2 } },
];

const PRINTS = DESK
  .map((slot) => ({ slot, photo: galleryPhotos.find((p) => p.id === slot.id) }))
  .filter((item) => item.photo);

const PhotographySection = () => {
  const deskRef = useRef(null);
  const printRefs = useRef([]);
  const topZ = useRef(PRINTS.length);

  // A handled print comes to the front of the pile.
  const raise = useCallback((node) => {
    topZ.current += 1;
    node.style.zIndex = String(topZ.current);
  }, []);

  const restack = useCallback((animate) => {
    topZ.current = PRINTS.length;
    printRefs.current.forEach((print) => print && print.reset(animate));
  }, []);

  // Desk and column layouts use different coordinates; start fresh on switch.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => restack(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [restack]);

  if (PRINTS.length === 0) return null;

  return (
    <section
      id="photography"
      aria-labelledby="observations-title"
      className="relative overflow-x-clip pt-20 pb-24 sm:pt-28 lg:pt-32"
    >
      <div className="archive-container">
        <header className="max-w-2xl">
          <SectionHeading number="05" id="observations-title" reveal="heading">Observations</SectionHeading>
          <EditorialReveal
            mode="mask"
            delay={120}
            className="mt-6 font-editorial text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.1] text-ink-primary"
          >
            {pageHeaders.gallery.note}
          </EditorialReveal>
        </header>

        <p id="photo-desk-help" className="sr-only">
          Each photograph can be moved: drag it, or focus it and use the arrow keys
          (hold Shift for larger steps). Restack returns every print to its place.
        </p>

        <div ref={deskRef} className="photo-desk mt-12 sm:mt-16">
          {PRINTS.map(({ photo, slot }, i) => (
            <PhotoPrint
              key={photo.id}
              ref={(node) => { printRefs.current[i] = node; }}
              photo={photo}
              slot={slot}
              stack={PRINTS.length - i}
              deskRef={deskRef}
              onRaise={raise}
              describedBy="photo-desk-help"
            />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-notebook-border pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p className="text-small text-ink-muted">
              <span className="hidden lg:inline">Drag the prints</span>
              <span className="lg:hidden">Slide a print sideways to move it</span>
            </p>
            <button
              type="button"
              onClick={() => restack(true)}
              className="inline-flex min-h-11 items-center text-small text-ink-secondary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-300 hover:text-ink-primary hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              Restack
            </button>
          </div>
          <div className="flex flex-col gap-1 sm:items-end">
            <Link
              to="/gallery"
              className="arrow-link inline-flex min-h-11 items-center gap-2 font-editorial text-lead leading-tight text-ink-primary underline decoration-notebook-border-light underline-offset-[6px] transition-colors duration-300 hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              View the full archive <span aria-hidden="true" className="arrow">{ARROW}</span>
            </Link>
            <p className="text-small text-ink-muted">
              {PRINTS.length} of {galleryPhotos.length} photographs on this desk
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotographySection;
