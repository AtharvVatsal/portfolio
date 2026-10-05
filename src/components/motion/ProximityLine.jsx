import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';

// One short line whose letters thicken as the pointer comes near (React Bits
// VariableProximity, source unmodified in ../reactbits), in the site's own
// Inter - served as a variable font (wght 400-700) so the weight can move
// letter by letter, instead of the component's default Roboto Flex.
//
// Kept to one line of one sentence on purpose: a letter's width grows with
// its weight, so in wrapping text the lines would reflow under the pointer.
// On a single line nothing below it moves.
//
// VariableProximity runs a requestAnimationFrame loop and window pointer
// listeners for as long as it is mounted, so it is mounted only while the line
// is on screen, for a hovering fine pointer, with motion allowed, from 1024px
// (where the line has room to widen). Everywhere else - touch screens, reduced
// motion, off screen - the same text is a plain line. The component reads the
// line to screen readers once (its own sr-only copy); its letters are hidden.

const VariableProximity = lazy(() => import('../reactbits/VariableProximity'));

const INTERACTIVE = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (min-width: 1024px)';

const ProximityLine = ({ text, as: Tag = 'p', className = '' }) => {
  const interactive = useMediaQuery(INTERACTIVE);
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!interactive || !el) return undefined;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [interactive]);

  const live = interactive && near;
  return (
    <Tag ref={ref} className={`${className} ${live ? 'whitespace-nowrap' : ''}`.trim()} data-motion={live ? 'variable-proximity' : undefined}>
      {live ? (
        <Suspense fallback={text}>
          <VariableProximity
            label={text}
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 700"
            containerRef={ref}
            radius={90}
            falloff="gaussian"
            style={{ fontFamily: 'inherit' }}
          />
        </Suspense>
      ) : text}
    </Tag>
  );
};

export default ProximityLine;
