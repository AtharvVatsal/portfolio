import { useEffect, useState, useRef } from 'react';

const renderCursorImage = (scale = 1) => {
  const s = Math.round(28 * scale);
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s + 4 * scale;
  const ctx = c.getContext('2d');

  const p = (v) => v * scale;

  const path = new Path2D();
  path.moveTo(0, 0);
  path.lineTo(p(11), p(17.5));
  path.lineTo(p(8), p(17.5));
  path.lineTo(p(10.5), p(23.5));
  path.lineTo(p(6.5), p(25.5));
  path.lineTo(p(4), p(19.5));
  path.lineTo(0, p(19.5));
  path.closePath();

  ctx.save();
  ctx.translate(p(0.5), p(0.5));
  ctx.shadowColor = 'rgba(10, 9, 8, 0.18)';
  ctx.shadowBlur = p(1.5);
  ctx.shadowOffsetX = p(0.5);
  ctx.shadowOffsetY = p(0.5);
  ctx.fillStyle = '#f5f2ed';
  ctx.fill(path);
  ctx.restore();

  ctx.strokeStyle = 'rgba(10, 9, 8, 0.07)';
  ctx.lineWidth = Math.max(0.3, p(0.3));
  ctx.stroke(path);

  return c.toDataURL('image/png');
};

const CustomCursor = () => {
  const styleRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsTouchDevice(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      prefersReducedMotion.matches
    );
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const dpr = window.devicePixelRatio || 1;
    const url = renderCursorImage(dpr);
    const arrow = `url("${url}") 0 0, auto`;

    const style = document.createElement('style');
    style.textContent = `
      * { cursor: ${arrow} !important; }
      input, textarea, [contenteditable] { cursor: text !important; }
      a, button, [role="button"], label, select, summary, [tabindex]:not([tabindex="-1"]) { cursor: pointer !important; }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    return () => {
      style.remove();
      styleRef.current = null;
    };
  }, [isTouchDevice]);

  return null;
};

export default CustomCursor;
