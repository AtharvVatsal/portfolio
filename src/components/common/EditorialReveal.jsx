import React, { useEffect, useLayoutEffect, useRef } from 'react';

// The archive's text motion. One component, a few deliberate treatments:
//
//   mode  'fade'   the element moves as one block (labels, metadata, supporting lines)
//         'words'  words rise into place one after another (titles)
//         'mask'   words rise out of their own baseline mask (section headings, hero)
//         'lines'  words grouped by the line they wrap onto; lines rise in turn
//                  (short descriptions). Measured at reveal time, so it follows
//                  whatever wrapping the current viewport produces.
//         'heading' the whole heading rises 24px out of a 5px blur into place
//                  (page, section and editorial headings - see EditorialHeading)
//   replay true: when the element has fully left the viewport it is re-armed,
//          so it reveals again each time it re-enters, in either scroll
//          direction. Off by default (every current use arrives once).
//   level 'micro' | 'editorial' | 'feature'  timing tokens, see MOTION in index.css
//   delay ms after the element is in view (metadata -> title -> description)
//   ready false holds the reveal (the hero waits for the preloader)
//
// Progressive enhancement: the text renders readable. Only just before first
// paint, and only when the browser can show it again (IntersectionObserver,
// no reduced-motion preference, element not already scrolled past), is it put
// in its hidden state ("armed"). It reveals once when it enters the viewport;
// a safety net (a timer, then a scroll check) catches anything the observer
// misses. When the reveal ends the attribute is removed and the words are
// plain inline text again: selectable, found by find-in-page, read normally
// by screen readers. Words are inline-blocks only while they move. A replaying
// element is only ever re-armed while it is completely off-screen, so nothing
// visible ever disappears; the text node itself is never hidden from
// assistive technology (only its opacity/position change).

const SAFETY_MS = 6000;

// Two observers shared by every reveal on the page: "enter" fires when an
// element reaches the lower 90% of the viewport, "leave" when it has gone
// completely out of view (replay only).
const entering = new Map();
const leaving = new Map();
let enterObserver = null;
let leaveObserver = null;
const watch = (node, onEnter) => {
  if (!enterObserver) {
    enterObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && entering.has(e.target)) entering.get(e.target)();
      }),
      { rootMargin: '0px 0px -10% 0px' }
    );
  }
  entering.set(node, onEnter);
  enterObserver.observe(node);
};
const watchLeave = (node, handlers) => {
  if (!leaveObserver) {
    leaveObserver = new IntersectionObserver((entries) => entries.forEach((e) => {
      const h = leaving.get(e.target);
      if (h) (e.isIntersecting ? h.visible : h.leave)();
    }));
  }
  leaving.set(node, handlers);
  leaveObserver.observe(node);
};
const unwatch = (node) => {
  entering.delete(node);
  if (enterObserver) enterObserver.unobserve(node);
};
const unwatchLeave = (node) => {
  leaving.delete(node);
  if (leaveObserver) leaveObserver.unobserve(node);
};

// Keyboard focus must never sit on, or inside, invisible text. One document
// listener: focus arriving inside a reveal, or on a control that contains one
// (a card link around its heading), shows it at once. Focus on a non-interactive
// container (main after a route change, tabindex -1) does not count.
const focusables = new Map();
const CONTROL = 'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';
const holdsFocus = (node, el) => !!el && el instanceof Element
  && (node.contains(el) || (el.matches(CONTROL) && el.contains(node)));
const onDocumentFocusIn = (e) => focusables.forEach((show, node) => { if (holdsFocus(node, e.target)) show(); });
const watchFocus = (node, show) => {
  if (!focusables.size) document.addEventListener('focusin', onDocumentFocusIn);
  focusables.set(node, show);
};
const unwatchFocus = (node) => {
  focusables.delete(node);
  if (!focusables.size) document.removeEventListener('focusin', onDocumentFocusIn);
};

const SPLIT_MODES = ['words', 'mask', 'lines'];

const splitWords = (node, counter, mask) => {
  if (typeof node === 'string') {
    return node.split(/(\s+)/).map((part) => {
      if (!part.trim()) return part;
      const index = counter.i++;
      return (
        <span key={index} className="reveal-word" style={{ '--i': index }}>
          {mask ? <span className="reveal-word__inner">{part}</span> : part}
        </span>
      );
    });
  }
  // One level of styled phrases, e.g. <span className="text-ink-muted">...</span>
  if (React.isValidElement(node) && typeof node.props.children === 'string') {
    return React.cloneElement(node, undefined, splitWords(node.props.children, counter, mask));
  }
  return node;
};

// Lines mode: every word on the same rendered line gets the same index.
const assignLines = (words) => {
  let line = -1;
  let lastTop = null;
  words.forEach((w) => {
    const top = w.getBoundingClientRect().top;
    if (lastTop === null || top > lastTop + 2) {
      line += 1;
      lastTop = top;
    }
    w.style.setProperty('--i', line);
  });
  return line + 1;
};

const ms = (value) => parseFloat(value) || 0;

const EditorialReveal = ({
  as: Tag = 'p',
  mode = 'words',
  level = 'editorial',
  delay = 0,
  ready = true,
  replay,
  className = '',
  style,
  children,
  ...rest
}) => {
  const ref = useRef(null);
  const state = useRef({ armed: false, seen: false, ready, reveal: null });
  const replays = !!replay;

  useLayoutEffect(() => {
    const node = ref.current;
    const s = state.current;
    if (
      !node ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (!replays && node.getBoundingClientRect().bottom <= 0)
    ) {
      return undefined;
    }

    let safety = null;
    let done = null;
    const onScreen = () => {
      const r = node.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    const onScroll = () => {
      if (onScreen()) s.reveal();
    };

    s.reveal = () => {
      if (!s.armed) return;
      s.armed = false;
      if (!replays) { unwatch(node); unwatchLeave(node); }
      clearTimeout(safety);
      window.removeEventListener('scroll', onScroll);
      const words = node.querySelectorAll('.reveal-word');
      const steps = mode === 'lines' ? assignLines(words) : Math.max(words.length, 1);
      // Long text tightens its stagger so no statement takes long to settle.
      const cs = getComputedStyle(node);
      const stagger = Math.min(
        ms(cs.getPropertyValue('--reveal-stagger')),
        ms(cs.getPropertyValue('--reveal-spread')) / Math.max(steps - 1, 1)
      );
      node.style.setProperty('--reveal-stagger', `${stagger}ms`);
      node.dataset.reveal = 'revealing';
      const total = delay + (steps - 1) * stagger + ms(cs.getPropertyValue('--reveal-duration'));
      // Back to plain, static text once everything has settled.
      done = setTimeout(() => delete node.dataset.reveal, total + 100);
    };

    // Keyboard focus arriving inside (or around) an element that has not
    // revealed yet shows it at once, without animation.
    const onFocusIn = () => {
      if (!s.armed) return;
      s.armed = false;
      if (!replays) { unwatch(node); unwatchLeave(node); }
      clearTimeout(safety);
      delete node.dataset.reveal;
    };
    watchFocus(node, onFocusIn);

    const arm = () => {
      clearTimeout(done);
      s.armed = true;
      node.dataset.reveal = 'armed';
    };
    // A replaying element that starts above the viewport (page loaded
    // scrolled down) is armed by the leave observer's first report instead.
    if (!replays || node.getBoundingClientRect().bottom > 0) arm();
    watch(node, () => {
      s.seen = true;
      if (s.ready) s.reveal();
    });
    // An armed element that is visible but never crosses the "enter" line
    // (one peeking into the bottom tenth of the screen, or the last heading of
    // a page that cannot scroll further) still reveals after a moment.
    // Replay: also re-arm once fully out of view.
    let visibleTimer = null;
    watchLeave(node, {
      leave: () => {
        clearTimeout(visibleTimer);
        if (replays && !s.armed && !holdsFocus(node, document.activeElement)) arm();
      },
      visible: () => {
        clearTimeout(visibleTimer);
        visibleTimer = setTimeout(() => { if (s.armed && onScreen()) s.reveal(); }, 600);
      },
    });
    safety = setTimeout(() => {
      if (!s.armed) return;
      if (onScreen()) s.reveal();
      else window.addEventListener('scroll', onScroll, { passive: true });
    }, SAFETY_MS);

    return () => {
      unwatchFocus(node);
      unwatch(node);
      unwatchLeave(node);
      clearTimeout(visibleTimer);
      clearTimeout(safety);
      clearTimeout(done);
      window.removeEventListener('scroll', onScroll);
      s.armed = false;
      delete node.dataset.reveal;
    };
  }, [mode, delay, replays]);

  useEffect(() => {
    const s = state.current;
    s.ready = ready;
    if (ready && s.seen && s.reveal) s.reveal();
  }, [ready]);

  const counter = { i: 0 };
  const content = SPLIT_MODES.includes(mode)
    ? React.Children.map(children, (child) => splitWords(child, counter, mode === 'mask'))
    : children;

  return (
    <Tag
      ref={ref}
      className={`editorial-reveal ${className}`}
      data-mode={mode}
      data-level={level}
      style={{ ...style, '--n': Math.max(counter.i, 1), '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {content}
    </Tag>
  );
};

export default EditorialReveal;
