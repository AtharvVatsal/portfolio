import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP's ScrollTrigger, once registered (StrokeText and ScrollReveal both
// register it when their modules load), keeps an empty requestAnimationFrame
// loop running for the life of the page (`_rafBugFix`), plus scroll listeners,
// whether or not anything needs it. The archive has no idle frame loops, so
// the integration switches ScrollTrigger on only while something needs it:
// a ScrollReveal paragraph near the viewport holds it; with no holds it is
// disabled (its triggers keep their state and are re-enabled and refreshed on
// the next hold). The React Bits sources themselves are untouched.

let holds = 0;
let enabled = true; // registration leaves it enabled

const apply = () => {
  if (holds > 0 && !enabled) {
    ScrollTrigger.enable();
    ScrollTrigger.getAll().forEach((t) => t.enable(false));
    ScrollTrigger.refresh();
    enabled = true;
  } else if (holds === 0 && enabled) {
    ScrollTrigger.disable(false);
    enabled = false;
  }
};

// Something needs scroll-driven updates; returns its release.
export const holdScrollTrigger = () => {
  holds += 1;
  apply();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holds -= 1;
    apply();
  };
};

// Called after a module that registers ScrollTrigger has loaded but needs
// nothing from it (StrokeText on trigger="mount").
export const settleScrollTrigger = () => apply();

