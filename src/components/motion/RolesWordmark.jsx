import React, { Suspense, lazy, useEffect, useRef } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';

// The hero's authored roles line ("Engineer · Photographer · Observer") as an
// outline wordmark (Aceternity TextHoverEffect, ported unchanged to JSX in
// ../ui/text-hover-effect.jsx). The outline draws itself in once on arrival;
// under the pointer a warm reveal follows the cursor across the letters.
//
// Integration, all from the outside:
// - The component draws into a fixed 300×100 viewBox with centred 72px demo
//   type. Here the type is sized so the line spans the viewBox (measured with
//   getComputedTextLength after fonts load) - centred then reads as aligned
//   to the archive's left edge. The box crops the viewBox to a fixed band
//   (aspect-ratio in CSS) just taller than the fitted type, so refitting when
//   the fonts arrive never changes its height (no layout shift).
// - Its outline and gradient colours are re-set to archive tokens by CSS
//   (.roles-wordmark in index.css); its own neutral/rainbow values are unused.
// - Screen readers get the line once, as text; the SVG (three copies of the
//   text) is hidden from them.
// - It is a pointer interaction, so it is mounted only for a hovering fine
//   pointer with motion allowed. Touch screens and reduced motion get the same
//   line as plain, immediately readable text - nothing to hover, nothing to wait for.
// - Used once: the component's gradient and mask ids are document-global.

const TextHoverEffect = lazy(() =>
  import('../ui/text-hover-effect').then((m) => ({ default: m.TextHoverEffect })));

const INTERACTIVE = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const SPAN = 294; // target text length in viewBox units (of 300)

const fit = (box) => {
  const text = box.querySelector('svg text');
  if (!text) return false;
  const size = parseFloat(getComputedStyle(text).fontSize);
  const length = text.getComputedTextLength();
  if (!size || !length) return false;
  const next = (size * SPAN) / length;
  box.style.setProperty('--roles-size', `${next}px`);
  return true;
};

const RolesWordmark = ({ text, className = '' }) => {
  const interactive = useMediaQuery(INTERACTIVE);
  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!interactive || !box) return undefined;
    let alive = true;
    const refit = () => { if (alive) fit(box); };
    // The SVG arrives with the lazy chunk; fit when it appears, again when
    // the web fonts settle (the measurement depends on them).
    const mo = new MutationObserver(() => { if (fit(box)) mo.disconnect(); });
    mo.observe(box, { childList: true, subtree: true });
    refit();
    (document.fonts?.ready ?? Promise.resolve()).then(refit);
    return () => { alive = false; mo.disconnect(); };
  }, [interactive]);

  if (!interactive) return <p className={className}>{text}</p>;
  return (
    <div className={className} data-motion="text-hover">
      <div ref={boxRef} aria-hidden="true" className="roles-wordmark">
        <Suspense fallback={null}>
          <TextHoverEffect text={text} duration={0.25} />
        </Suspense>
      </div>
      <p className="sr-only">{text}</p>
    </div>
  );
};

export default RolesWordmark;
