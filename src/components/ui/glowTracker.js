// One pointer tracker for every glow border on the page.
//
// The supplied GlowCard gave each card its own document pointermove listener
// and drew its gradients with background-attachment: fixed. Fixed backgrounds
// move all page scrolling onto the main thread, and dozens of listeners each
// restyle on every move. Here one listener, throttled to one update per frame,
// gives each visible glow the pointer in its own box (--glow-x/--glow-y, px),
// plus the pointer's place across the screen (--glow-xp, 0-1) for the hue.
// A glow is switched on (data-active) only while the pointer is near it, so
// the blurred layers cost nothing elsewhere. Scrolling and resizing re-place
// the light under a still pointer. Mouse and pen only: on touch the glow never
// appears and touch scrolling is untouched.

const REACH = 220; // px beyond a box at which its light has fully faded
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

const glows = new Set();
const visible = new Set();
const pointer = { x: 0, y: 0, in: false };
let io = null;
let raf = 0;
let listening = false;

const update = () => {
  raf = 0;
  const xp = (pointer.x / window.innerWidth).toFixed(3);
  // Read every box first, then write, so the frame lays out once.
  const boxes = [...visible].map((el) => [el, el.getBoundingClientRect()]);
  boxes.forEach(([el, r]) => {
    const near = pointer.in &&
      pointer.x > r.left - REACH && pointer.x < r.right + REACH &&
      pointer.y > r.top - REACH && pointer.y < r.bottom + REACH;
    if (near) {
      el.style.setProperty('--glow-x', `${(pointer.x - r.left).toFixed(1)}px`);
      el.style.setProperty('--glow-y', `${(pointer.y - r.top).toFixed(1)}px`);
      el.style.setProperty('--glow-xp', xp);
      if (!el.hasAttribute('data-active')) el.setAttribute('data-active', '');
    } else if (el.hasAttribute('data-active')) {
      el.removeAttribute('data-active');
    }
  });
};

const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };

const onMove = (e) => {
  if (e.pointerType === 'touch') return;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.in = true;
  schedule();
};
const onLeave = (e) => {
  if (e.relatedTarget) return; // still inside the document
  pointer.in = false;
  schedule();
};

const listen = (on) => {
  const method = on ? 'addEventListener' : 'removeEventListener';
  document[method]('pointermove', onMove, { passive: true });
  document.documentElement[method]('pointerout', onLeave, { passive: true });
  window[method]('scroll', schedule, { passive: true, capture: true });
  window[method]('resize', schedule, { passive: true });
  listening = on;
};

// Registers a glow element; returns its cleanup. A no-op where the pointer
// cannot hover (touch screens).
export const trackGlow = (el) => {
  if (!el || typeof window === 'undefined' || !window.matchMedia?.(FINE_POINTER).matches) return () => {};
  if (!io) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else { visible.delete(entry.target); entry.target.removeAttribute('data-active'); }
      });
      schedule();
    }, { rootMargin: `${REACH}px` });
  }
  glows.add(el);
  io.observe(el);
  if (!listening) listen(true);
  return () => {
    glows.delete(el);
    visible.delete(el);
    io.unobserve(el);
    if (!glows.size) {
      listen(false);
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
};
