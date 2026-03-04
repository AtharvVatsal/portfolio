import React, { useRef, useEffect } from 'react';

const MouseGlow = ({ 
  mousePosition, 
  size = 800,          // px diameter
  blur = 80,           // blur amount  
  smoothing = 0.08,    // lerp factor (0.05 = floaty, 0.15 = snappy)
  gradient,            // CSS gradient string
  className = '',      // extra classes
}) => {
  const glowRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  // Update target on every mouse move (no re-render)
  useEffect(() => {
    targetRef.current = { 
      x: mousePosition?.x || 0, 
      y: mousePosition?.y || 0 
    };
  }, [mousePosition?.x, mousePosition?.y]);

  // rAF lerp loop — runs independently of React renders
  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    const halfSize = size / 2;

    const animate = () => {
      // Lerp current position toward target
      posRef.current.x += (targetRef.current.x - posRef.current.x) * smoothing;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * smoothing;

      // Apply via transform (GPU-composited, no layout/paint)
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
      className={`absolute top-0 left-0 rounded-full pointer-events-none ${className}`}
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