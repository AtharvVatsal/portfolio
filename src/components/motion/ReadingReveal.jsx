import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import useMediaQuery, { REDUCED_MOTION } from '../../hooks/useMediaQuery';

// Scroll-linked editorial text, used at most once per route (the About thesis
// paragraph on home, a case file's result): the words come into focus as the
// reader scrolls through them -
// blur and opacity scrubbed to scroll, no rotation (React Bits ScrollReveal,
// source unmodified in ../reactbits). Scrubbing ends when the paragraph's foot
// reaches the bottom of the viewport, so a paragraph fully on screen is fully
// legible.
//
// Lifecycle (accessibility and performance):
// - ScrollReveal is mounted only while the paragraph is on, or within 10% of,
//   the viewport. Everywhere else the same paragraph is plain, full-contrast
//   text - so no off-screen text ever sits in ScrollReveal's faint starting
//   state (find-in-page, axe and anyone jumping to it see readable text). The
//   swap happens while it is off screen, so it is never seen.
// - While mounted it holds ScrollTrigger (scrollTriggerGate); unmounting kills
//   its triggers (ScrollReveal's own cleanup) and releases the hold, so no
//   ScrollTrigger work or frame loop remains for a paragraph out of view.
//
// Semantics: ScrollReveal renders its text as <h2><p>…</p></h2>. This paragraph
// is not a heading, so the visible text is aria-hidden and screen readers get
// the paragraph once, as a plain sr-only <p>. Text size, colour and measure come
// from `className`; ScrollReveal's own display sizing is neutralised from the
// outside. Reduced motion: the plain paragraph, nothing else. ScrollReveal's
// cleanup kills every ScrollTrigger on the page, so it is used once per route.

const ScrollReveal = lazy(() => import('../reactbits/ScrollReveal'));

const NEUTRAL_TEXT = '!text-[length:inherit] !leading-[inherit] !font-normal';


const ReadingReveal = ({ text, className = '' }) => {
  const reduce = useMediaQuery(REDUCED_MOTION);
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (reduce || !el) return undefined;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Hold ScrollTrigger while the paragraph is near, and mount ScrollReveal only
  // once the hold is active: a ScrollTrigger created while ScrollTrigger is
  // globally disabled is silently inert, which left the words frozen at their
  // faint start after navigating back to the page (cached chunk, same commit).
  useEffect(() => {
    if (reduce || !near) { setHeld(false); return undefined; }
    let alive = true;
    let release = null;
    import('./scrollTriggerGate').then((m) => {
      if (!alive) return;
      release = m.holdScrollTrigger();
      setHeld(true);
    });
    return () => { alive = false; if (release) release(); };
  }, [reduce, near]);

  if (reduce) return <p className={className}>{text}</p>;
  const active = near && held;
  // Inactive: one plain, accessible paragraph. Active: ScrollReveal's markup,
  // hidden from assistive technology, then the paragraph once for it.
  return (
    <div ref={ref} className={className} data-motion="scroll-reveal">
      {active ? (
        <>
          <div aria-hidden="true">
            <Suspense fallback={<p>{text}</p>}>
              <ScrollReveal
                baseOpacity={0.2}
                enableBlur
                baseRotation={0}
                blurStrength={4}
                containerClassName="!my-0"
                textClassName={NEUTRAL_TEXT}
              >
                {text}
              </ScrollReveal>
            </Suspense>
          </div>
          <p className="sr-only">{text}</p>
        </>
      ) : <p>{text}</p>}
    </div>
  );
};

export default ReadingReveal;
