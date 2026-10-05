import React, { useEffect, useRef } from 'react';
import { trackGlow } from './glowTracker';

// Spotlight glow for borders, from the supplied spotlight-card.tsx (GlowCard),
// ported to JSX for this Create React App project (no TypeScript).
//
// The light is the original's: a spotlight that follows the pointer and lights
// the border it passes - a coloured ring with a bright core where the pointer
// is nearest, a soft blurred halo round the edge, and a faint pool of light on
// the surface - its hue drifting with the pointer's place across the screen.
//
// Two ways to use it:
//
//   <GlowBorder />  the light alone, for an existing card or frame. Put it
//     inside any element with a border, and give that element `relative
//     isolate` (Tailwind): it then lights that element's own border and draws
//     nothing else, so the card keeps its layout, colours and corners. The
//     border width is read from --glow-bw (1px by default). Inside a box that
//     clips its content (overflow-hidden), pass `inset` and the ring is drawn
//     just inside the border instead.
//
//   <GlowCard>      the original card itself (rounded, translucent, 3px
//     border, its sm/md/lg sizes), with the original props.
//
// Changed from the original, to keep the site smooth and its touch screens
// usable: one shared pointer listener instead of one per card, light drawn in
// each card's own box instead of with background-attachment: fixed (which
// forces main-thread scrolling), layers switched on only near the pointer, the
// styles in index.css once instead of a <style> tag per card, and no
// touch-action: none (it stopped a page from scrolling when a swipe began on a
// card). The glow follows a mouse or pen; on touch screens it stays off.
// 'amber' (the archive accent, drifting towards gold) is added to the colours.

const glowColorMap = {
  amber: { base: 28, spread: 16 },
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
};

export const GlowBorder = ({ glowColor = 'amber', inset = false, className = '' }) => {
  const ref = useRef(null);
  useEffect(() => trackGlow(ref.current), []);
  const { base, spread } = glowColorMap[glowColor] || glowColorMap.amber;
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`glow-border ${className}`.trim()}
      data-inset={inset ? '' : undefined}
      style={{ '--glow-base': base, '--glow-spread': spread }}
    >
      <span className="glow-border__fill" />
      <span className="glow-border__halo" />
      <span className="glow-border__ring" />
    </span>
  );
};

export const GlowCard = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false, // when true, ignores size and uses width/height or className
}) => {
  const style = {
    '--glow-bw': '3px',
    '--glow-radius': '14px',
    backgroundColor: 'hsl(0 0% 60% / 0.12)',
    border: '3px solid hsl(0 0% 60% / 0.12)',
    borderRadius: '14px',
  };
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      style={style}
      className={`${customSize ? '' : `${sizeMap[size]} aspect-[3/4]`} relative isolate grid grid-rows-[1fr_auto] gap-4 p-4 shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[5px] ${className}`}
    >
      <GlowBorder glowColor={glowColor} />
      {children}
    </div>
  );
};
