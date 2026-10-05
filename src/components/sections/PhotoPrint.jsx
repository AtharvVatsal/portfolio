import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { getCloudinaryUrl } from '../../config/cloudinary';

const SRC_WIDTHS = [400, 640, 960];
const KEY_STEP = 16;
const KEY_STEP_LARGE = 64;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (v, min, max) => (min > max ? (min + max) / 2 : Math.min(max, Math.max(min, v)));

// One physical print on the desk. Moves only while the visitor drags it
// (pointer) or nudges it (arrow keys); nothing animates on its own.
const PhotoPrint = forwardRef(({ photo, slot, stack, deskRef, onRaise, describedBy }, ref) => {
  const el = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const drag = useRef(null);

  const apply = () => {
    el.current.style.translate = `${offset.current.x}px ${offset.current.y}px`;
  };

  // Allowed offset range: the print may hang over the desk edge a little
  // (more on narrow screens, so it can be moved aside), never get lost.
  const bounds = () => {
    const desk = deskRef.current.getBoundingClientRect();
    const card = el.current.getBoundingClientRect();
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const overX = card.width * (wide ? 0.15 : 0.5);
    const overY = card.height * (wide ? 0.1 : 0.05);
    const { x, y } = offset.current;
    return {
      minX: x + (desk.left - overX) - card.left,
      maxX: x + (desk.right + overX) - card.right,
      minY: y + (desk.top - overY) - card.top,
      maxY: y + (desk.bottom + overY) - card.bottom,
    };
  };

  useImperativeHandle(ref, () => ({
    reset(animate) {
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

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const isMouse = e.pointerType === 'mouse';
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
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
  };

  const endDrag = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    el.current.classList.remove('is-lifted');
    el.current.style.rotate = '';
  };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!delta) return;
    e.preventDefault();
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
