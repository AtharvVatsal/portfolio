import React, { useState, useEffect, useRef } from 'react';

const FULL_TEXT = "Hi, I'm Atharv Vatsal";
const CHARS = FULL_TEXT.split('');
const HEX_POOL = '0123456789ABCDEF';

const randomHex = () => HEX_POOL[Math.floor(Math.random() * HEX_POOL.length)];

const WheelSlot = ({ char: displayChar, targetChar, isSettled, isFlashing, idx }) => {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: targetChar === ' ' ? '1.4rem' : 'clamp(1.2rem, 3.6vw, 2rem)',
        height: 'clamp(2.4rem, 5.5vw, 3.6rem)',
        overflow: 'hidden',
        borderRadius: '3px',
        background: isSettled ? 'rgba(99,102,241,0.06)' : 'transparent',
        transition: 'background 0.2s ease',
      }}
    >
      {/* Wheel bevel shadows — top and bottom curvature */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: '35%', background: 'linear-gradient(to bottom, rgba(10,9,8,0.9), transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: '35%', background: 'linear-gradient(to top, rgba(10,9,8,0.9), transparent)' }}
      />
      {/* Left edge shadow */}
      <div
        className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.04), transparent)' }}
      />

      {/* Character */}
      <span
        className="font-mono select-none"
        style={{
          color: isSettled ? '#F5F2ED' : 'rgba(129,140,248,0.8)',
          fontSize: 'clamp(1.3rem, 4vw, 2.6rem)',
          lineHeight: 1,
          transition: 'color 0.25s ease',
          opacity: targetChar === ' ' ? 0 : 1,
          fontWeight: isSettled ? 400 : 300,
          willChange: 'color, opacity',
        }}
      >
        {displayChar}
      </span>

      {/* Clack bounce overlay — remounts when settling */}
      {isFlashing && targetChar !== ' ' && (
        <span
          className="absolute inset-0 flex items-center justify-center font-mono select-none pointer-events-none"
          style={{
            color: '#F5F2ED',
            fontSize: 'clamp(1.3rem, 4vw, 2.6rem)',
            lineHeight: 1,
            animation: 'odometerClack 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            willChange: 'transform, opacity',
          }}
        >
          {targetChar}
        </span>
      )}

      {/* Permanent faint amber underline for every settled character */}
      {isSettled && targetChar !== ' ' && (
        <div
          className="absolute bottom-0 z-10 pointer-events-none"
          style={{
            left: '2px',
            right: '2px',
            height: '1px',
            background: '#F5A623',
            borderRadius: '1px',
            opacity: 0.04,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Bright flash underline on settle */}
      {isFlashing && targetChar !== ' ' && (
        <div
          className="absolute bottom-0 z-20 pointer-events-none"
          style={{
            left: '2px',
            right: '2px',
            height: '1.5px',
            background: '#F5A623',
            borderRadius: '1px',
            animation: 'amberFlash 0.7s ease-out forwards',
            boxShadow: '0 0 6px rgba(245,166,35,0.4)',
            willChange: 'opacity, transform',
          }}
        />
      )}
    </div>
  );
};

const OdometerPreloader = ({ progress, isLoading, isReturnVisit }) => {
  const [phase, setPhase] = useState('spinning');
  const [settledUpTo, setSettledUpTo] = useState(-1);
  const [displayChars, setDisplayChars] = useState(() => CHARS.map(() => randomHex()));
  const [hidden, setHidden] = useState(false);
  const [readyToReveal, setReadyToReveal] = useState(false);
  const [flashIdx, setFlashIdx] = useState(-1);
  const settledRef = useRef(-1);
  const revealStartedRef = useRef(false);
  const flashTimerRef = useRef(null);
  const skipPreloader = useRef(isReturnVisit).current;

  // Safety timeout — force hide after 5s regardless of state machine
  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Spinning phase — rapid hex cycling for all unsolved positions
  useEffect(() => {
    if (phase !== 'spinning' && phase !== 'settling') return;
    const interval = setInterval(() => {
      setDisplayChars(prev =>
        prev.map((c, i) => (i <= settledRef.current ? CHARS[i] : randomHex()))
      );
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // Start settling after initial spin
  useEffect(() => {
    if (phase !== 'spinning') return;
    const timer = setTimeout(() => setPhase('settling'), 750);
    return () => clearTimeout(timer);
  }, [phase]);

  // Settle one by one, left to right
  useEffect(() => {
    if (phase !== 'settling') return;
    if (settledUpTo >= CHARS.length - 1) {
      setPhase('complete');
      return;
    }
    const delay = CHARS[settledUpTo + 1] === ' ' ? 30 : 60;
    const timer = setTimeout(() => {
      const next = settledUpTo + 1;
      settledRef.current = next;
      setSettledUpTo(next);

      // Flash this character for 700ms
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      setFlashIdx(next);
      flashTimerRef.current = setTimeout(() => {
        setFlashIdx(-1);
      }, 700);

      setDisplayChars(prev => {
        const nextChars = [...prev];
        nextChars[next] = CHARS[next];
        return nextChars;
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [phase, settledUpTo]);

  // Complete phase — wait then signal ready to reveal
  useEffect(() => {
    if (phase !== 'complete') return;
    const timer = setTimeout(() => setReadyToReveal(true), 400);
    return () => clearTimeout(timer);
  }, [phase]);

  // Reveal when both ready and loaded
  useEffect(() => {
    if (!readyToReveal || progress < 100 || revealStartedRef.current) return;
    revealStartedRef.current = true;
    const timer = setTimeout(() => setPhase('reveal'), 300);
    return () => clearTimeout(timer);
  }, [readyToReveal, progress]);

  // Reveal phase — fade out and hide
  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => setHidden(true), 700);
    return () => clearTimeout(timer);
  }, [phase]);

  if (skipPreloader) return null;
  if (hidden) return null;

  const isComplete = phase === 'complete' || phase === 'reveal';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden" style={{ background: '#0A0908' }}>
      {/* Background noise */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.3\'/%3E%3C/svg%3E")' }} />

      {/* Main content */}
      <div
        className="relative flex flex-col items-center gap-10"
        style={{
          opacity: phase === 'reveal' ? 0 : 1,
          transform: phase === 'reveal' ? 'scale(0.97)' : 'scale(1)',
          transition: 'opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)',
          willChange: 'opacity, transform',
        }}
      >
        {/* Logo */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: isComplete ? 0.15 : 0.25,
            transform: isComplete ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <img src="/av.svg" alt="" className="w-8 h-8 object-contain" />
        </div>

        {/* Odometer line */}
        <div
          className="relative flex items-center justify-center"
          style={{
            gap: '1px',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            background: isComplete ? 'rgba(99,102,241,0.02)' : 'transparent',
            transition: 'background 0.5s ease, transform 0.5s ease',
            transform: isComplete ? 'scale(1.01)' : 'scale(1)',
            transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            willChange: 'transform',
          }}
        >
          {/* Blueprint glow pulse — tracks the settling frontier */}
          {settledUpTo >= 0 && settledUpTo < CHARS.length - 1 && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${((settledUpTo + 1) / CHARS.length) * 100}%`,
                width: '5em',
                height: '100%',
                background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)',
                transform: 'translateX(-50%)',
                transition: 'left 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
                willChange: 'left',
              }}
            />
          )}

          {/* Wheels */}
          {CHARS.map((targetChar, i) => (
            <WheelSlot
              key={i}
              idx={i}
              targetChar={targetChar}
              char={displayChars[i]}
              isSettled={i <= settledUpTo}
              isFlashing={i <= settledUpTo && i === flashIdx}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="transition-all duration-500"
          style={{
            opacity: isComplete ? 0.3 : 0.6,
            transition: 'opacity 0.5s ease',
          }}
        >
          <div className="relative" style={{ width: 180, height: '1px' }}>
            <div className="absolute inset-0" style={{ background: 'rgba(245,242,237,0.04)' }} />
            <div
              className="absolute top-0 left-0 h-full transition-all duration-200 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: isComplete
                  ? 'rgba(99,102,241,0.15)'
                  : 'linear-gradient(90deg, rgba(99,102,241,0.08), rgba(99,102,241,0.2))',
              }}
            />
          </div>
        </div>

        {/* Tagline */}
        <p
          className="font-editorial text-[0.85rem] tracking-[0.15em] leading-relaxed text-center transition-all duration-500"
          style={{
            color: isComplete
              ? 'rgba(245,242,237,0.12)'
              : 'rgba(245,242,237,0.16)',
            transition: 'color 0.5s ease',
          }}
        >
          The Personal Archive
        </p>
      </div>
    </div>
  );
};

export default OdometerPreloader;