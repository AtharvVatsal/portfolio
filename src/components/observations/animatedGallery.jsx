import React, { createContext, useContext, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

// The 21st.dev "Animated Scroll Gallery" primitives, adapted to this CRA /
// JavaScript archive (no TypeScript, no shadcn `cn`). The motion model is the
// reference's, kept intact:
//   ContainerScroll  -> one scrollYProgress for the whole sequence
//   ContainerSticky  -> the pinned, perspective (1000px, origin center top) stage
//   GalleryContainer -> rotateX 70 -> 0 over the first part of the sequence,
//                       scale 1.18 -> 1 over the next (reference: 75 -> 0 over
//                       [0, 0.5], 1.2 -> 1 over [0.5, 0.9])
//   GalleryCol       -> each column's own scroll-linked y over the rest
//                       (reference yRange: outer columns move down, the middle
//                       column moves up)
// Adapted: the phase boundaries and the column ranges are numbers derived from
// the measured wall (22 real photographs make columns ~3x taller than the
// demo's four 16:9 tiles, so a fixed "-10% -> 2%" would only ever show the
// top third of each column). Everything is scroll-linked through MotionValues:
// no React state per frame, no listeners of our own, nothing moves by itself.
// ContainerStagger / ContainerAnimated (blur entrances) are not used: the scroll
// transformation is the animation, and EditorialReveal handles the text.

export const ROTATE_FROM = 70;
export const SCALE_FROM = 1.18;

const ScrollContext = createContext(null);

export const useContainerScrollContext = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useContainerScrollContext must be used within a ContainerScroll component');
  return ctx;
};

// The scroll track. Progress runs 0 -> 1 from the moment the track's top meets
// the pin line (under the sticky page header) to the moment its bottom meets
// the bottom of the viewport. Before that (the approach) progress stays 0: the
// wall is seen tilted and enlarged as it comes up the page.
export const ContainerScroll = ({ trackRef, pinTop, height, phases, children, className = '' }) => {
  const { scrollYProgress } = useScroll({ target: trackRef, offset: [`start ${pinTop}px`, 'end end'] });
  return (
    <ScrollContext.Provider value={{ scrollYProgress, phases }}>
      <div ref={trackRef} className={`relative ${className}`} style={{ height }}>
        {children}
      </div>
    </ScrollContext.Provider>
  );
};

// Transformers read their parameters from a ref: the scroll subscription keeps
// one stable function, and useTransform also re-evaluates on every render, so a
// new measurement (resize, new selection) applies at once without waiting for
// the next scroll event.
const useLatest = (value) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};

// The pinned window. `overflow: clip` (not hidden) so it is never a scroll
// container (focus can't scroll it sideways into a broken state). The
// reference's `transform-style: preserve-3d` is omitted here and on the wall:
// the columns are flat, so the stage's perspective alone gives the same image,
// and the extra 3D rendering context made hit-testing (axe's colour checks)
// effectively hang.
export const ContainerSticky = ({ top, height, children, className = '' }) => (
  <div
    className={`sticky w-full overflow-clip ${className}`}
    style={{ top, height, perspective: '1000px', perspectiveOrigin: 'center top' }}
  >
    {children}
  </div>
);

// The whole collection, transformed as one wall.
export const GalleryContainer = ({ children, className = '', style }) => {
  const { scrollYProgress, phases } = useContainerScrollContext();
  const p = useLatest(phases);
  const rotateX = useTransform(scrollYProgress, (v) => ROTATE_FROM * (1 - Math.min(1, v / p.current.rotateEnd)));
  const scale = useTransform(scrollYProgress, (v) => {
    // scaleFrom: the reference's 1.18, capped by the wall when that would push
    // the wall past the viewport's edges (tablets, small laptops).
    const { scaleStart: a, scaleEnd: b, scaleFrom = SCALE_FROM } = p.current;
    return v <= a ? scaleFrom : v >= b ? 1 : scaleFrom + (1 - scaleFrom) * ((v - a) / (b - a));
  });
  return (
    <motion.div
      className={`relative grid h-full ${className}`}
      style={{ rotateX, scale, ...style }}
    >
      {children}
    </motion.div>
  );
};

// One column. `from` / `to` are px; the column holds `from` until the
// column phase starts, then travels to `to` by the end of the sequence.
export const GalleryCol = ({ from, to, children, className = '', style, ...rest }) => {
  const { scrollYProgress, phases } = useContainerScrollContext();
  const p = useLatest({ from, to, s: phases.colStart });
  const y = useTransform(scrollYProgress, (v) => {
    const { from: f, to: t, s } = p.current;
    return v <= s ? f : f + (t - f) * Math.min(1, (v - s) / (1 - s));
  });
  return (
    <motion.ol className={`relative flex w-full flex-col self-start ${className}`} style={{ ...style, y }} {...rest}>
      {children}
    </motion.ol>
  );
};
