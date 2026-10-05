import React, { Suspense, lazy, useEffect, useRef } from 'react';
import useMediaQuery, { REDUCED_MOTION } from '../../hooks/useMediaQuery';

// Archival registration: text drawn onto the page - an accent outline traced
// letter by letter, then the ink wiped in - once, on arrival (React Bits
// StrokeText, source unmodified in ../reactbits). It never loops or redraws:
// it is drawn once per visit - returning to the page later in the same visit
// shows the finished text as ordinary serif type. Used once: the hero name.
//
// Render it inside the real element (here a <p>): the text is given to screen
// readers once, as text; the SVG, which StrokeText labels as an image, is
// hidden from them. Reduced motion shows the finished text as ordinary serif
// type. Until the drawing code loads the line holds its height, so nothing
// below moves.
//
// StrokeText centres its drawing in a full-width SVG. To keep the text on the
// archive's left edge, the box around it is sized to the drawing: once
// StrokeText has measured the glyphs (its viewBox), width = height × aspect.

const StrokeText = lazy(() => import('../reactbits/StrokeText'));

// Rendered beside StrokeText inside its Suspense boundary, so it runs once the
// module (which registers ScrollTrigger as a side effect) has loaded. Drawing
// needs no ScrollTrigger (it starts on mount), so ScrollTrigger is switched off
// unless a ScrollReveal paragraph is holding it (see scrollTriggerGate).
const SettleScrollTrigger = () => {
  useEffect(() => {
    let alive = true;
    import('./scrollTriggerGate').then((m) => { if (alive) m.settleScrollTrigger(); });
    return () => { alive = false; };
  }, []);
  return null;
};

// Texts already drawn in this visit (module state lives for the SPA session).
const drawn = new Set();

const fitToDrawing = (box) => {
  const svg = box.querySelector('svg');
  const vb = svg?.viewBox?.baseVal;
  if (!vb || !vb.width || !vb.height) return;
  box.style.width = `${(svg.getBoundingClientRect().height * vb.width) / vb.height}px`;
};

const DrawnText = ({
  text,
  size = 44,          // SVG type size in px from 640px up; the line is size × 1.3 tall
  smallSize = 34,     // below 640px
  fill = '#F5F2ED',   // archive ink
  stroke = '#C98C42', // archive accent
  className = '',
}) => {
  const prefersReduced = useMediaQuery(REDUCED_MOTION);
  // Decided once per mount: draw only the first time this text appears.
  const [already] = React.useState(() => drawn.has(text));
  useEffect(() => { drawn.add(text); }, [text]);
  const reduce = prefersReduced || already;
  const wide = useMediaQuery('(min-width: 640px)');
  const px = wide ? size : smallSize;
  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (reduce || !box) return undefined;
    box.style.width = '';
    const mo = new MutationObserver(() => fitToDrawing(box));
    mo.observe(box, { attributes: true, attributeFilter: ['viewBox'], subtree: true, childList: true });
    fitToDrawing(box);
    return () => mo.disconnect();
  }, [reduce, px]);

  const height = Math.round(px * 1.3);
  return (
    <span className={`block ${className}`} data-motion={reduce ? undefined : 'stroke-text'}>
      {reduce ? (
        <span className="block font-editorial leading-[1.3] text-white" style={{ fontSize: px }}>{text}</span>
      ) : (
        <span ref={boxRef} aria-hidden="true" className="-ml-1 block max-w-full" style={{ width: '16rem', minHeight: height }}>
          <Suspense fallback={<span className="block" style={{ height }} />}>
            <StrokeText
              key={px}
              text={text}
              className="font-editorial"
              strokeColor={stroke}
              fillColor={fill}
              strokeWidth={0.9}
              drawDuration={1.4}
              fillDelay={0.15}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={px}
              fontWeight={400}
              letterSpacing={0.5}
            />
            <SettleScrollTrigger />
          </Suspense>
        </span>
      )}
      {!reduce && <span className="sr-only">{text}</span>}
    </span>
  );
};

export default DrawnText;
