import React, { useRef, useEffect } from 'react';

const Atmosphere = () => {
  const grainRef = useRef(null);

  useEffect(() => {
    const el = grainRef.current;
    if (!el) return;

    let frame;
    let lastTime = 0;
    let isActive = true;

    const animate = (time) => {
      if (!isActive) {
        return;
      }
      if (time - lastTime > 120) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        el.style.backgroundPosition = `${x}% ${y}%`;
        lastTime = time;
      }
      frame = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      isActive = !document.hidden;
      if (isActive && !frame) {
        frame = requestAnimationFrame(animate);
      } else if (!isActive && frame) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <>
      {/* Film grain — organic noise texture */}
      <div
        ref={grainRef}
        className="fixed inset-0 pointer-events-none z-[90]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Scan lines — CRT monitor horizontal lines */}
      <div
        className="fixed inset-0 pointer-events-none z-[90]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      {/* Warm tint — subtle amber wash */}
      <div
        className="fixed inset-0 pointer-events-none z-[90]"
        style={{
          background: 'rgba(245, 166, 35, 0.008)',
        }}
      />

      {/* Vignette — darker edges like a viewfinder */}
      <div
        className="fixed inset-0 pointer-events-none z-[90]"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(10, 9, 8, 0.25) 100%)',
        }}
      />

      {/* Breathing light — monitor glow pulse */}
      <div
        className="fixed inset-0 pointer-events-none z-[90]"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 25% 30%, rgba(99, 102, 241, 0.018) 0%, transparent 70%)',
          animation: 'breathe 8s ease-in-out infinite',
        }}
      />

      {/* Subtle top edge glow */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none z-[90]"
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.15), transparent)',
        }}
      />
    </>
  );
};

export default Atmosphere;
