import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ContainerScroll, ContainerSticky, GalleryContainer, GalleryCol, SCALE_FROM, useContainerScrollContext,
} from './animatedGallery';

// The photographic wall on /gallery: the 21st.dev Animated Scroll Gallery
// motion model with the archive's own photographs.
//
// Sequence (3 columns from 1024 px, 2 from 640 px):
//   approach  - the wall comes up the page tilted back 70deg and enlarged 1.18x;
//   pin       - the stage pins under the page header; the wall rotates to face
//               the viewer (rotateX 70 -> 0) over ~0.9 screen of scroll;
//   columns   - the outer columns travel down and the middle column travels up
//               (the reference's directions), each through its whole length, so
//               every photograph passes the stage; scale settles 1.18 -> 1;
//   release   - the stage unpins and the page continues.
// Phones: one column, no 3D (alternate frames drift a few px, CSS).
// Reduced motion, or a selection too short to travel: the same columns,
// standing still.
//
// Every photograph is used once. Distribution is deterministic: archive order
// (newest first) into the shortest column. Photographs keep their real
// proportions (no crop, no object-fit), square edges, one line of record.

const PIN_TOP = 56; // the sticky PageHeader (h-14 from 640px up)
const GAP = 12;
const GUTTER = 12; // px-3 on the wall
const MAX_WALL = 72; // max-w-6xl, in rem
const META_REM = 1.875; // record line: 0.375rem margin + 1.5rem line (see .obs-item__meta)
const META_FRACTION = 0.07; // record line + gap as a fraction of column width (distribution only)
const ROTATE_SCREENS = 0.9; // scroll spent turning the wall, in stage heights
const COLUMN_SPEED = 1.15; // column travel per px of scroll at the fastest column
const PARK_BELOW = 1.25; // while tilted, photographs further below than this (stage heights) wait
const STATIC_STAGGER = { 2: [0, 40], 3: [0, 48, 24] };
const SIZES = '(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw';

const REDUCE = '(prefers-reduced-motion: reduce)';
const useReducedMotionPreference = () => {
  const [reduce, setReduce] = useState(() => typeof window !== 'undefined' && window.matchMedia(REDUCE).matches);
  useEffect(() => {
    const q = window.matchMedia(REDUCE);
    const update = () => setReduce(q.matches);
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);
  return reduce;
};

const columnCount = () => {
  if (typeof window === 'undefined') return 3;
  if (window.matchMedia('(min-width: 1024px)').matches) return 3;
  if (window.matchMedia('(min-width: 640px)').matches) return 2;
  return 1;
};

const useColumnCount = () => {
  const [cols, setCols] = useState(columnCount);
  useEffect(() => {
    const queries = ['(min-width: 1024px)', '(min-width: 640px)'].map((q) => window.matchMedia(q));
    const update = () => setCols(columnCount());
    queries.forEach((q) => q.addEventListener('change', update));
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, []);
  return cols;
};

const distribute = (items, cols) => {
  const columns = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  let portraits = 0;
  items.forEach((o) => {
    let c = 0;
    for (let i = 1; i < cols; i++) if (heights[i] < heights[c] - 1e-6) c = i;
    const side = cols === 1 && o.orientation === 'portrait' ? (portraits++ % 2 ? 'right' : 'left') : undefined;
    columns[c].push({ o, side });
    heights[c] += 1 / o.ratio + META_FRACTION;
  });
  return columns;
};

const PhotoArchiveItem = ({ o, side, index, parked, eager, onOpen }) => (
  <li
    className={`obs-item group${parked ? ' obs-item--parked' : ''}`}
    data-i={index}
    data-orient={o.orientation}
    data-side={side}
    style={{ '--r': o.ratio }}
  >
    <button
      type="button"
      onClick={(e) => onOpen(o, e.currentTarget)}
      aria-label={`Open ${o.number}, ${o.title}`}
      className="obs-item__open block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
    >
      <img
        src={o.field.src}
        srcSet={o.field.srcSet}
        sizes={SIZES}
        width={o.width}
        height={o.height}
        alt={o.description || o.title}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className="obs-item__img"
      />
    </button>
    <p className="obs-item__meta truncate font-mono text-meta text-ink-faint transition-colors duration-200 group-hover:text-accent">
      {o.number} &middot; {o.place}{o.when ? <> &middot; {o.when.year}</> : null}
    </p>
  </li>
);

// Inside the scroll context. While the wall is tilted, photographs of a column
// that lie far below the stage (only the upward-travelling column has any)
// are "parked": taken out of flow at the column's top, invisible, still in the
// DOM and the accessibility tree. At a 70deg tilt they would otherwise swing
// past the 1000px perspective plane, where their projected boxes become
// effectively infinite (it made axe / Lighthouse hit-testing hang). They are
// off-screen either way; they return to their places as the tilt reaches 0,
// still below the stage, before the column brings them in. One state change
// per crossing, not per frame.
const WallColumns = ({ columns, model, onOpen }) => {
  const { scrollYProgress } = useContainerScrollContext();
  const [tilted, setTilted] = useState(() => scrollYProgress.get() < model.rotateEnd);
  useEffect(() => {
    setTilted(scrollYProgress.get() < model.rotateEnd);
    return scrollYProgress.on('change', (v) => setTilted(v < model.rotateEnd));
  }, [scrollYProgress, model.rotateEnd]);
  return columns.map((col, c) => (
    <GalleryCol key={c} from={model.ranges[c].from} to={model.ranges[c].to} data-col={c} className="obs-col" style={{ gap: GAP }}>
      {col.map(({ o, side }, i) => (
        <PhotoArchiveItem key={o.id} o={o} side={side} index={i} parked={tilted && model.parked[c][i]} eager onOpen={onOpen} />
      ))}
    </GalleryCol>
  ));
};

const AnimatedPhotoWall = ({ items, onOpen }) => {
  const reduce = useReducedMotionPreference();
  const cols = useColumnCount();
  const columns = useMemo(() => distribute(items, cols), [items, cols]);
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const canAnimate = !reduce && cols > 1;

  // Width of the wall and height of the stage, re-measured only on resize.
  const [geo, setGeo] = useState(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measure = () => {
      const width = Math.round(root.getBoundingClientRect().width);
      const S = window.innerHeight - PIN_TOP;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const vw = document.documentElement.clientWidth;
      setGeo((g) => (g && g.S === S && g.width === width && g.rem === rem && g.vw === vw ? g : { S, width, rem, vw }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // Column geometry from the photographs' measured ratios (not from the DOM,
  // so parking photographs never feeds back into the layout).
  const model = useMemo(() => {
    if (!canAnimate || !geo) return null;
    const { S, width, rem, vw } = geo;
    const inner = Math.min(width, MAX_WALL * rem) - 2 * GUTTER;
    // The travel phase enlarges the wall (reference: 1.18x). Where the wall already
    // spans (nearly) the whole viewport - tablets, small laptops - that pushed the
    // outer photographs and their record lines past the screen edges, so the
    // enlargement is capped at what the viewport can show. Wide screens keep 1.18.
    const scaleFrom = Math.max(1, Math.min(SCALE_FROM, vw / Math.min(width, MAX_WALL * rem)));
    const colW = (inner - GAP * (cols - 1)) / cols;
    const meta = META_REM * rem;
    const tops = columns.map((col) => {
      let y = 0;
      return col.map(({ o }) => {
        const t = y;
        y += colW / o.ratio + meta + GAP;
        return t;
      });
    });
    const heights = columns.map((col, c) => (col.length
      ? tops[c][col.length - 1] + colW / col[col.length - 1].o.ratio + meta
      : 0));
    // A selection too short to pass through the stage stands still instead.
    if (Math.max(...heights) < S * 1.3) return null;
    const last = cols - 1;
    const ranges = heights.map((H, c) => {
      const outer = c === 0 || c === last;
      if (cols === 2 ? c === 0 : outer) {
        // travels down: starts showing its lower photographs, ends at its top
        return { from: S - H - 0.04 * S, to: (c === 0 ? 0.06 : 0.02) * S };
      }
      // travels up: starts a little above the stage (the reference's raised
      // middle column, mt-[-50%]), ends at its bottom
      return { from: -0.12 * S, to: S - H - 0.08 * S };
    });
    const parked = tops.map((t, c) => t.map((top) => top + ranges[c].from > PARK_BELOW * S));
    const travel = Math.max(...ranges.map((r) => Math.abs(r.to - r.from)));
    const R = ROTATE_SCREENS * S;
    const C = travel / COLUMN_SPEED;
    const P = R + C;
    const rotateEnd = R / P;
    const scaleEnd = (R + 0.8 * C) / P;
    return {
      S, colW, meta, tops, heights, ranges, parked, R, C, P, track: S + P, rotateEnd, scaleEnd, scaleFrom,
      phases: { rotateEnd, scaleStart: rotateEnd, scaleEnd, colStart: rotateEnd, scaleFrom },
    };
  }, [canAnimate, geo, cols, columns]);

  // Keyboard focus on a photograph inside the moving wall: scroll to the point
  // of the sequence where its column holds it in the middle of the stage.
  const onFocus = useCallback((e) => {
    if (!model || !e.target.matches(':focus-visible')) return;
    const li = e.target.closest('[data-i]');
    const col = e.target.closest('[data-col]');
    if (!li || !col || !trackRef.current) return;
    const c = Number(col.dataset.col);
    const i = Number(li.dataset.i);
    const { from, to } = model.ranges[c];
    const center = model.tops[c][i] + (model.colW / columns[c][i].o.ratio + model.meta) / 2;
    let best = 0;
    let bestErr = Infinity;
    for (let k = 0; k <= 100; k++) {
      const q = k / 100;
      const v = (model.R + q * model.C) / model.P;
      const s = v >= model.scaleEnd ? 1 : model.scaleFrom + (1 - model.scaleFrom) * ((v - model.rotateEnd) / (model.scaleEnd - model.rotateEnd));
      const y = from + q * (to - from) + center;
      const err = Math.abs((y - model.S / 2) * s);
      if (err < bestErr) { bestErr = err; best = q; }
    }
    const trackTop = trackRef.current.getBoundingClientRect().top + window.scrollY;
    // 'instant': the page's smooth scrolling would leave the photograph mid-flight.
    window.scrollTo({ top: trackTop - PIN_TOP + model.R + best * model.C, behavior: 'instant' });
  }, [model, columns]);

  const gridCols = cols === 3 ? 'grid-cols-3' : 'grid-cols-2';

  if (model) {
    return (
      <div ref={rootRef} className="obs-wall" data-mode="wall" data-cols={cols} onFocus={onFocus}>
        <ContainerScroll trackRef={trackRef} pinTop={PIN_TOP} height={model.track} phases={model.phases}>
          <ContainerSticky top={PIN_TOP} height={model.S}>
            <GalleryContainer className={`mx-auto max-w-6xl px-3 items-start ${gridCols}`} style={{ gap: GAP }}>
              <WallColumns columns={columns} model={model} onOpen={onOpen} />
            </GalleryContainer>
          </ContainerSticky>
        </ContainerScroll>
      </div>
    );
  }

  // Static (reduced motion, a short selection, or before the first measure)
  // and the phone stream: the same columns in normal flow.
  const mode = cols === 1 ? (reduce ? 'static' : 'stream') : 'static';
  return (
    <div ref={rootRef} className="obs-wall" data-mode={mode} data-cols={cols}>
      <div className={cols === 1 ? 'px-5' : `mx-auto grid max-w-6xl px-3 items-start ${gridCols}`} style={cols === 1 ? undefined : { gap: GAP }}>
        {columns.map((col, c) => (
          <ol
            key={c}
            data-col={c}
            className="obs-col flex flex-col"
            style={{ gap: cols === 1 ? 40 : GAP, paddingTop: cols === 1 ? 0 : STATIC_STAGGER[cols][c] }}
          >
            {col.map(({ o, side }, i) => (
              <PhotoArchiveItem key={o.id} o={o} side={side} index={i} eager={false} onOpen={onOpen} />
            ))}
          </ol>
        ))}
      </div>
    </div>
  );
};

export default AnimatedPhotoWall;
