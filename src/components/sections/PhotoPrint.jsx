import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { getCloudinaryUrl } from '../../config/cloudinary';

const SRC_WIDTHS = [400, 640, 960];
const KEY_STEP = 16;
const KEY_STEP_LARGE = 64;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (v, min, max) => (min > max ? (min + max) / 2 : Math.min(max, Math.max(min, v)));

// Throw physics. A released print keeps the velocity it was let go with,
// slows as it slides across the desk, and bounces off the edges it may not
// pass - losing part of its speed each time - then settles. Its lean follows
// its sideways speed and flips when it bounces.
const FRICTION = 3.2;      // per second: the share of speed the desk takes away
const RESTITUTION = 0.5;   // share of speed kept through a bounce
const MAX_SPEED = 3200;    // px/s, so a flick never launches a print absurdly
const REST_SPEED = 12;     // px/s below which the print has stopped
const SAMPLE_MS = 90;      // release velocity: pointer movement over this window

// One physical print on the desk. Moves only while the visitor drags it
// (pointer), as it slides to rest after being thrown, or when nudged (arrow
// keys); nothing animates on its own. Reduced motion: no throw - a print
// stays where it is let go.
const PhotoPrint = forwardRef(({ photo, slot, stack, deskRef, onRaise, describedBy }, ref) => {
  const el = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const drag = useRef(null);
  const flight = useRef(0);

  const land = () => {
    cancelAnimationFrame(flight.current);
    flight.current = 0;
    if (el.current) el.current.style.rotate = '';
  };
  useEffect(() => () => cancelAnimationFrame(flight.current), []);

  const apply = () => {
    el.current.style.translate = `${offset.current.x}px ${offset.current.y}px`;
  };

  // Allowed offset range. Sideways the print may travel to the edges of the
  // screen; up and down it stays on the desk, hanging over its edge a little,
  // so it is never lost. Measured on the print's on-screen box, which
  // includes its rotation.
  const bounds = () => {
    const desk = deskRef.current.getBoundingClientRect();
    const card = el.current.getBoundingClientRect();
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const overY = card.height * (wide ? 0.1 : 0.05);
    const screen = document.documentElement.clientWidth;
    const { x, y } = offset.current;
    return {
      minX: x - card.left,
      maxX: x + screen - card.right,
      minY: y + (desk.top - overY) - card.top,
      maxY: y + (desk.bottom + overY) - card.bottom,
    };
  };

  useImperativeHandle(ref, () => ({
    reset(animate) {
      land();
      offset.current = { x: 0, y: 0 };
      if (!el.current) return;
      el.current.classList.toggle('is-restacking', Boolean(animate));
      el.current.style.zIndex = '';
      apply();
    },
  }));

  const pickUp = () => {
    el.current.classList.remove('is-restacking');
    el.current.classList.add('is-lifted');
    onRaise(el.current);
  };

  // Slide on from the release velocity (px/s) until it comes to rest.
  const throwPrint = (vx, vy, b) => {
    const speed = Math.hypot(vx, vy);
    if (speed > MAX_SPEED) { vx *= MAX_SPEED / speed; vy *= MAX_SPEED / speed; }
    if (Math.hypot(vx, vy) < REST_SPEED * 4) return;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const keep = Math.exp(-FRICTION * dt);
      vx *= keep;
      vy *= keep;
      let { x, y } = offset.current;
      x += vx * dt;
      y += vy * dt;
      // An edge sends the print back the way it came, slower; it is placed
      // as far inside as it would have gone past. The desk's top and bottom
      // edges are the bounds measured at pick-up; the screen's sides are
      // measured on the print as it is now (below), since its lean changes
      // how wide it stands.
      if (y < b.minY) { y = Math.min(b.maxY, b.minY + (b.minY - y) * RESTITUTION); vy = -vy * RESTITUTION; }
      else if (y > b.maxY) { y = Math.max(b.minY, b.maxY - (y - b.maxY) * RESTITUTION); vy = -vy * RESTITUTION; }
      const lean = clamp(vx * 0.0025, -4, 4);
      el.current.style.rotate = `calc(var(--r) + ${lean.toFixed(2)}deg)`;
      offset.current = { x, y };
      apply();
      // The screen's sides: the print's actual corners, lean included.
      const r = el.current.getBoundingClientRect();
      const screen = document.documentElement.clientWidth;
      const past = r.right > screen ? r.right - screen : r.left < 0 ? r.left : 0;
      if (past) {
        offset.current.x -= past * (1 + RESTITUTION);
        if (Math.sign(vx) === Math.sign(past)) vx = -vx * RESTITUTION;
        apply();
      }
      if (Math.hypot(vx, vy) > REST_SPEED) flight.current = requestAnimationFrame(step);
      else land();
    };
    flight.current = requestAnimationFrame(step);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    land(); // catching a sliding print stops it where it is
    const isMouse = e.pointerType === 'mouse';
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      samples: [[performance.now(), e.clientX, e.clientY]],
      x0: offset.current.x,
      y0: offset.current.y,
      b: bounds(),
      tilt: !prefersReducedMotion(),
      // Touch/pen: wait until the gesture is clearly sideways, so a vertical
      // swipe stays a page scroll and never nudges the print.
      active: isMouse,
    };
    if (isMouse) {
      el.current.setPointerCapture(e.pointerId);
      pickUp();
    }
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.active) {
      const dx = Math.abs(e.clientX - d.startX);
      const dy = Math.abs(e.clientY - d.startY);
      if (dx < 8 && dy < 8) return;
      if (dy >= dx) { drag.current = null; return; }
      d.active = true;
      el.current.setPointerCapture(e.pointerId);
      pickUp();
    }
    offset.current = {
      x: clamp(d.x0 + e.clientX - d.startX, d.b.minX, d.b.maxX),
      y: clamp(d.y0 + e.clientY - d.startY, d.b.minY, d.b.maxY),
    };
    apply();
    if (d.tilt) {
      // A print lags slightly against the direction it is pulled.
      const lean = clamp((e.clientX - d.lastX) * 0.35, -3, 3);
      el.current.style.rotate = `calc(var(--r) + ${lean.toFixed(2)}deg)`;
    }
    d.lastX = e.clientX;
    const now = performance.now();
    d.samples.push([now, e.clientX, e.clientY]);
    while (d.samples.length > 2 && now - d.samples[0][0] > SAMPLE_MS) d.samples.shift();
  };

  const endDrag = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    el.current.classList.remove('is-lifted');
    el.current.style.rotate = '';
    if (!d.active || !d.tilt || e.type === 'pointercancel') return;
    // Release velocity from the last moments of the drag; a print held still
    // before letting go is simply put down.
    const [t0, x0, y0] = d.samples[0];
    const [t1, x1, y1] = d.samples[d.samples.length - 1];
    const dt = (t1 - t0) / 1000;
    if (dt <= 0 || performance.now() - t1 > 60) return;
    throwPrint((x1 - x0) / dt, (y1 - y0) / dt, d.b);
  };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!delta) return;
    e.preventDefault();
    land();
    onRaise(el.current);
    const b = bounds();
    el.current.classList.remove('is-restacking');
    offset.current = {
      x: clamp(offset.current.x + delta[0], b.minX, b.maxX),
      y: clamp(offset.current.y + delta[1], b.minY, b.maxY),
    };
    apply();
  };

  const [hw, hh] = slot.ratio;
  const number = `No. ${String(photo.id).padStart(3, '0')}`;

  return (
    <figure
      ref={el}
      className="photo-print"
      style={{
        '--stack': stack,
        '--w-sm': slot.sm.w, '--x-sm': slot.sm.x, '--r-sm': `${slot.sm.r}deg`,
        '--w-md': slot.md.w, '--x-md': slot.md.x,
        '--w-lg': slot.lg.w, '--x-lg': slot.lg.x, '--y-lg': slot.lg.y, '--r-lg': `${slot.lg.r}deg`,
      }}
      tabIndex={0}
      role="group"
      aria-roledescription="movable photograph"
      aria-label={`${number}, ${photo.title}`}
      aria-describedby={describedBy}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onKeyDown={onKeyDown}
    >
      <img
        src={getCloudinaryUrl(photo.publicId, { width: 640, quality: 'auto:good' })}
        srcSet={SRC_WIDTHS.map(
          (w) => `${getCloudinaryUrl(photo.publicId, { width: w, quality: 'auto:good' })} ${w}w`
        ).join(', ')}
        sizes={slot.sizes}
        width={hw * 400}
        height={hh * 400}
        alt={photo.description || photo.title}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-1 pb-2 pt-2.5">
        <span className="font-editorial text-[1.0625rem] leading-tight text-notebook-bg">{photo.title}</span>
        <span className="shrink-0 font-mono text-xs text-notebook-border">{number}</span>
      </figcaption>
    </figure>
  );
});

PhotoPrint.displayName = 'PhotoPrint';

export default PhotoPrint;
