import React, { Suspense, lazy, useEffect, useState } from 'react';
import useMediaQuery, { REDUCED_MOTION } from '../../hooks/useMediaQuery';

// The hero's roles line as a technical drawing (React Bits TechText, source
// unmodified in ../reactbits). Point at a letter (or touch and drag it) and it
// is selected: its fill gives way to a dashed outline, a measured frame with
// corner handles and a size label closes round it, and the frame's specks
// tick along its edge. A letter can be dragged off the line; it springs back.
//
// Motion is bounded. On arrival - once per visit, after the name has been
// drawn - the selection sweeps the line once, left to right (under five
// seconds), then rests; after that it moves only with the pointer. Reduced
// motion keeps the line still (TechText skips the sweep itself) and drops the
// specks; the line still answers the pointer.
//
// Screen readers and find-in-page get the line once, as text (the sr-only
// copy); the canvas, which TechText labels as an image, is hidden from them.
// TechText centres its type in its own box and fits it to 90% of the box
// width, so .hero-roles sizes that box (11.1% wider than the line, centred on
// it) to put the type exactly on the column's left edge. The box is sized in
// CSS before the drawing code loads, so nothing moves.
//
// The web fonts' stylesheet loads without blocking, and TechText measures
// and rasterises its letters once, with whatever font exists when it mounts
// (it is told of no later font). So it mounts once Inter 600 has loaded -
// while the name above is still being drawn - or after FONT_WAIT_MS with the
// metric-matched fallback, and is remounted if Inter arrives after that.

const loadTechText = () => import('../reactbits/TechText');
const TechText = lazy(loadTechText);

const DRAWN_NAME_MS = 2600; // DrawnText: 1.4s strokes + stagger + ink wipe
const FONT_WAIT_MS = 2500;
const SWEEP_SPEED = 1.5;
// TechText's sweep crosses the line once in pi / 0.45 seconds at speed 1.
const SWEEP_MS = (Math.PI / 0.45 / SWEEP_SPEED) * 1000 + 150;

let swept = false; // once per visit (module state lives for the SPA session)

const INTER_600 = '600 16px Inter';
const isInter = (face) => face.family.replace(/["']/g, '') === 'Inter';
// A face's weight is one value ('600') or, for a variable font, a range ('400 700').
const covers600 = (face) => {
  const [from, to = from] = String(face.weight).split(' ').map(Number);
  return from <= 600 && 600 <= to;
};

const useInterLoaded = () => {
  const [loaded, setLoaded] = useState(() =>
    typeof document !== 'undefined' && !!document.fonts &&
    [...document.fonts].some((f) => isInter(f) && f.status === 'loaded' && covers600(f)));
  useEffect(() => {
    const fonts = document.fonts;
    if (loaded || !fonts) return undefined;
    let alive = true;
    // Ask for Inter 600 now, and again whenever any font finishes loading
    // (the stylesheet has arrived) until it resolves to Inter itself.
    const attempt = () => fonts.load(INTER_600).then((faces) => {
      if (alive && faces.some(isInter)) setLoaded(true);
    }, () => {});
    fonts.addEventListener('loadingdone', attempt);
    attempt();
    return () => { alive = false; fonts.removeEventListener('loadingdone', attempt); };
  }, [loaded]);
  return loaded;
};

const TechRoles = ({ text, className = '' }) => {
  const reduce = useMediaQuery(REDUCED_MOTION);
  const [sweep, setSweep] = useState(false);
  const interLoaded = useInterLoaded();
  const [waited, setWaited] = useState(false);
  useEffect(() => {
    loadTechText(); // fetch the drawing code while the font loads
    const t = setTimeout(() => setWaited(true), FONT_WAIT_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduce || swept) return undefined;
    const start = setTimeout(() => { swept = true; setSweep(true); }, DRAWN_NAME_MS);
    const stop = setTimeout(() => setSweep(false), DRAWN_NAME_MS + SWEEP_MS);
    return () => { clearTimeout(start); clearTimeout(stop); };
  }, [reduce]);

  return (
    <div className={className} data-motion={reduce ? undefined : 'tech-text'}>
      <div aria-hidden="true" className="hero-roles">
        <div className="hero-roles__canvas">
          <Suspense fallback={null}>
            {(interLoaded || waited) && <TechText
              key={interLoaded ? 'inter' : 'fallback'}
              text={text}
              fontWeight={600}
              fontSize={200}
              letterSpacing={-0.02}
              color="#F5F2ED"
              accentColor="#DAA466"
              reach={200}
              softness={0.7}
              dashLength={4}
              dashGap={2}
              strokeWidth={1.5}
              lineStyle="dashed"
              reveal="letter"
              specks={reduce ? 0 : 15}
              selection
              labels
              draggable
              sweep={sweep}
              speed={SWEEP_SPEED}
            />}
          </Suspense>
        </div>
      </div>
      <p className="sr-only">{text}</p>
    </div>
  );
};

export default TechRoles;
