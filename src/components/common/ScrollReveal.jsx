import React, { useRef, useEffect, useState, useCallback } from 'react';

// Apple-style easing
const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

const variantConfig = {
  'fade-up':    { y: 40, x: 0,   scale: 1,    blur: 0 },
  'fade-down':  { y: -40, x: 0,  scale: 1,    blur: 0 },
  'fade-left':  { y: 0,  x: 40,  scale: 1,    blur: 0 },
  'fade-right': { y: 0,  x: -40, scale: 1,    blur: 0 },
  'scale':      { y: 20, x: 0,   scale: 0.92, blur: 0 },
  'fade-scale': { y: 30, x: 0,   scale: 0.96, blur: 0 },
  'fade-blur':  { y: 20, x: 0,   scale: 1,    blur: 6 },
};

const ScrollReveal = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 1000,
  className = '',
  entryZone = 12,
  exitZone = 8,
}) => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const [delayDone, setDelayDone] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setDelayDone(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  const calculate = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;

    // Element center position
    const elCenter = rect.top + rect.height / 2;

    // Define the "fully visible" zone in the middle of the viewport
    const visibleTop = vh * (exitZone / 100);      // e.g. 10% from top
    const visibleBottom = vh * (1 - entryZone / 100); // e.g. 85% from top

    // Entry from bottom: element center moves from below visibleBottom into zone
    // Exit from top: element center moves from above visibleTop out of zone

    let p;

    if (elCenter >= visibleTop && elCenter <= visibleBottom) {
      // Element center is in the fully visible zone
      p = 1;
    } else if (elCenter > visibleBottom) {
      // Below the visible zone — entering from bottom
      const transitionRange = vh * 0.45; // 45% of viewport to complete entry
      const distance = elCenter - visibleBottom;
      p = 1 - Math.min(1, distance / transitionRange);
    } else if (elCenter < visibleTop) {
      // Above the visible zone — exiting from top
      const transitionRange = vh * 0.35; // 35% of viewport for top exit
      const distance = visibleTop - elCenter;
      p = 1 - Math.min(1, distance / transitionRange);
    } else {
      p = 0;
    }

    setProgress(easeOutQuint(Math.max(0, Math.min(1, p))));
  }, [entryZone, exitZone]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(calculate);
    };

    // Initial + resize
    calculate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', calculate, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', calculate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [calculate]);

  const config = variantConfig[variant] || variantConfig['fade-up'];
  const p = delayDone ? progress : 0;

  const style = {
    opacity: p,
    transform: `translate3d(${config.x * (1 - p)}px, ${config.y * (1 - p)}px, 0) scale(${config.scale + (1 - config.scale) * p})`,
    filter: config.blur > 0 ? `blur(${config.blur * (1 - p)}px)` : undefined,
    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), filter ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

// Staggered group
export const ScrollRevealGroup = ({
  children,
  variant = 'fade-up',
  stagger = 100,
  duration = 800,
  className = '',
}) => (
  <div className={className}>
    {React.Children.map(children, (child, i) => (
      <ScrollReveal variant={variant} delay={i * stagger} duration={duration}>
        {child}
      </ScrollReveal>
    ))}
  </div>
);

export default ScrollReveal;