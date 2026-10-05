import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ObservationRecord from './ObservationRecord';

// The enlarged photograph: a modal dialog. The photograph sits on the archive
// ground at its real proportions; its record sits below it, never over it.
// Every control stays visible (nothing auto-hides).
// Keys: Esc closes, Left/Right step through the current selection, Tab stays
// inside. Touch: a sideways swipe on the photograph steps as well.
const SWIPE = 50;

const ObservationViewer = ({ list, index, context, onIndex, onClose }) => {
  const o = list[index];
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const swipe = useRef(null);

  const step = (dir) => onIndex((index + dir + list.length) % list.length);
  const stepRef = useRef(step);
  stepRef.current = step;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Open: focus the dialog's first control, hold the page still behind it.
  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onCloseRef.current(); return; }
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepRef.current(-1); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); stepRef.current(1); return; }
      if (e.key === 'Tab' && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll('button, [tabindex="0"]')];
        if (!items.length) return;
        const i = items.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1);
        items[next].focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Ask for the neighbouring photographs early, at the size this screen will use.
  useEffect(() => {
    [-1, 1].forEach((d) => {
      const n = list[(index + d + list.length) % list.length];
      if (!n || n === o) return;
      const img = new Image();
      img.sizes = '100vw';
      img.srcset = n.view.srcSet;
      img.src = n.view.src;
    });
  }, [index, list, o]);

  if (!o) return null;

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  const control = 'inline-flex items-center justify-center gap-2 min-h-11 px-4 border border-notebook-border text-body-sm text-ink-secondary hover:text-ink-primary hover:border-notebook-border-light transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
      className="obs-viewer fixed inset-0 z-[100] flex flex-col bg-notebook-bg text-ink-primary"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-notebook-border pl-4 pr-2 sm:pl-6 sm:pr-4 h-14">
        <p className="min-w-0 font-mono text-meta text-ink-muted truncate">
          {o.number}
          <span aria-hidden="true"> &middot; </span>
          {index + 1} of {list.length}
          {context && <><span aria-hidden="true"> &middot; </span>{context}</>}
        </p>
        <div className="flex shrink-0 gap-2">
          {list.length > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label="Previous photograph" className={`${control} w-11 px-0 sm:w-auto sm:px-4`}>
                <ChevronLeft size={18} aria-hidden="true" /><span className="hidden sm:inline">Previous</span>
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next photograph" className={`${control} w-11 px-0 sm:w-auto sm:px-4`}>
                <span className="hidden sm:inline">Next</span><ChevronRight size={18} aria-hidden="true" />
              </button>
            </>
          )}
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photograph" className={`${control} w-11 px-0`}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="obs-viewer__stage relative min-h-0 flex-1 p-3 sm:p-6"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { swipe.current = null; }}
      >
        <img
          key={o.id}
          src={o.view.src}
          srcSet={o.view.srcSet}
          sizes="100vw"
          width={o.width}
          height={o.height}
          alt={o.description || o.title}
          decoding="async"
          draggable={false}
          className="obs-viewer__img h-full w-full object-contain select-none"
        />
      </div>

      <div
        role="region"
        aria-label="Photograph record"
        tabIndex={0}
        className="shrink-0 max-h-[42svh] overflow-y-auto border-t border-notebook-border focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
      >
        <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-4 px-4 py-4 sm:px-6 sm:py-5 md:grid-cols-2">
          <div className="min-w-0">
            <h2 id="viewer-title" className="font-editorial text-title leading-tight text-ink-primary">{o.title}</h2>
            {o.description && <p className="mt-2 text-body-sm text-ink-secondary">{o.description}</p>}
          </div>
          <ObservationRecord observation={o} />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{`${o.number}, ${o.title}, ${index + 1} of ${list.length}`}</p>
    </div>,
    document.body
  );
};

export default ObservationViewer;
