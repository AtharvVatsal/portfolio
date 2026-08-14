import React, { useRef, useEffect, useState, useCallback } from 'react';

// Mechanical easing — deliberate, no bounce
const easeOutDocument = (t) => 1 - Math.pow(1 - t, 4);

const variantConfig = {
  'fade-up':    { y: 24, x: 0,   scale: 1,    blur: 0 },
  'fade-down':  { y: -24, x: 0,  scale: 1,    blur: 0 },
  'fade-left':  { y: 0,  x: 24,  scale: 1,    blur: 0 },
  'fade-right': { y: 0,  x: -24, scale: 1,    blur: 0 },
  'scale':      { y: 12, x: 0,   scale: 0.98, blur: 0 },
  'fade-scale': { y: 16, x: 0,   scale: 0.99, blur: 0 },
  'fade-blur':  { y: 12, x: 0,   scale: 1,    blur: 4 },
};

const ScrollReveal = ({
  children,
  variant = 'fade-up',
  delay = 100,
  duration = 900,
  className = '',
  entryZone = 12,
  exitZone = 8,
}) => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const [delayDone, setDelayDone] = useState(delay === 0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const calculate = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const isVisible = rect.top < vh * 0.9 && rect.bottom > vh * 0.1;
      setProgress(isVisible ? 1 : 0);
      setDelayDone(true);
    };

    calculate();
    window.addEventListener('scroll', calculate, { passive: true });
    window.addEventListener('resize', calculate);

    return () => {
      window.removeEventListener('scroll', calculate);
      window.removeEventListener('resize', calculate);
    };
  }, [isMobile]);

  useEffect(() => {
    if (delay > 0 && !isMobile) {
      const t = setTimeout(() => setDelayDone(true), delay);
      return () => clearTimeout(t);
    } else {
      setDelayDone(true);
    }
  }, [delay, isMobile]);

  const calculate = useCallback(() => {
    const el = ref.current;
    if (!el || isMobile) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;

    const elCenter = rect.top + rect.height / 2;
    const visibleTop = vh * (exitZone / 100);
    const visibleBottom = vh * (1 - entryZone / 100);

    let p;

    if (elCenter >= visibleTop && elCenter <= visibleBottom) {
      p = 1;
    } else if (elCenter > visibleBottom) {
      const transitionRange = vh * 0.4;
      const distance = elCenter - visibleBottom;
      p = 1 - Math.min(1, distance / transitionRange);
    } else if (elCenter < visibleTop) {
      const transitionRange = vh * 0.3;
      const distance = visibleTop - elCenter;
      p = 1 - Math.min(1, distance / transitionRange);
    } else {
      p = 0;
    }

    setProgress(easeOutDocument(Math.max(0, Math.min(1, p))));
  }, [entryZone, exitZone, isMobile]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(calculate);
    };

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
    transform: isMobile
      ? undefined
      : `translate3d(${config.x * (1 - p)}px, ${config.y * (1 - p)}px, 0) scale(${config.scale + (1 - config.scale) * p})`,
    filter: !isMobile && config.blur > 0 ? `blur(${config.blur * (1 - p)}px)` : undefined,
    transition: isMobile
      ? `opacity 300ms ease-out`
      : `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), filter ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export const ScrollRevealGroup = ({
  children,
  variant = 'fade-up',
  stagger = 120,
  duration = 900,
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
