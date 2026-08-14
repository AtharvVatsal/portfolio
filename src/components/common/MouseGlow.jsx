import React, { useRef, useEffect } from 'react';

const MouseGlow = ({ 
  mousePosition, 
  size = 800,
  blur = 80,
  smoothing = 0.08,
  gradient,
  className = '',
}) => {
  const glowRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    targetRef.current = { 
      x: mousePosition?.x || 0, 
      y: mousePosition?.y || 0 
    };
  }, [mousePosition?.x, mousePosition?.y]);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const halfSize = size / 2;

    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * smoothing;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * smoothing;

      el.style.transform = `translate3d(${posRef.current.x - halfSize}px, ${posRef.current.y - halfSize}px, 0)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [size, smoothing]);

  return (
    <div
      ref={glowRef}
      className={`absolute top-0 left-0 pointer-events-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: gradient,
        filter: `blur(${blur}px)`,
        willChange: 'transform',
      }}
    />
  );
};

export default MouseGlow;
