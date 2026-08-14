import React, { useState, useRef, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AboutSection = () => {
  const [inViewRef, inView] = useInView({ threshold: 0.05 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [tiltHovered, setTiltHovered] = useState(false);
  const [typed, setTyped] = useState('');
  const [textAnimRef, textAnim] = useScrollAnimation({ rootMargin: '0px 0px -100px 0px' });
  const [photoAnimRef, photoAnim] = useScrollAnimation({ rootMargin: '0px 0px -100px 0px' });

  useEffect(() => {
    if (!inView) return;
    const txt = '01 / Curiosity';
    let i = 0;
    setTyped('');
    const t = setInterval(() => {
      setTyped(txt.slice(0, i + 1));
      i++;
      if (i >= txt.length) clearInterval(t);
    }, 70);
    return () => clearInterval(t);
  }, [inView]);

  const handleSectionMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleTilt = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: y * -8 });
  };

  return (
    <section
      ref={(node) => { inViewRef.current = node; }}
      onMouseMove={handleSectionMouse}
      id="about"
      className={`relative pt-16 sm:pt-20 lg:pt-24 overflow-hidden transition-all duration-1000 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Ambient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-blueprint/[0.015] to-blueprint/[0.01]" />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.3) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Mountain range silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full" fill="currentColor" style={{ color: 'rgba(99,102,241,0.6)' }}>
          <path d="M0,80L120,50L240,90L360,20L480,70L600,30L720,85L840,10L960,55L1080,40L1200,75L1320,25L1440,45V120H0Z" />
          <path d="M0,100L180,70L360,95L540,40L720,90L900,30L1080,80L1260,55L1440,75V120H0Z" />
        </svg>
      </div>

      {/* Floating rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-20 w-56 h-56 border border-blueprint/[0.03] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.008}px, ${mousePos.y * -0.008}px)` }} />
        <div className="absolute top-[5%] -right-10 w-40 h-40 border border-blueprint/[0.02] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * -0.012}px, ${mousePos.y * 0.012}px)` }} />
      </div>

      {/* Compass rose Ã¢â‚¬â€ bottom right */}
      <div className="absolute bottom-8 right-8 opacity-[0.015] pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="16" cy="16" r="14" />
          <path d="M16 2V30M2 16H30" strokeDasharray="2 2" />
          <polygon points="16,2 18,12 16,10 14,12" fill="currentColor" />
          <polygon points="16,30 14,20 16,22 18,20" fill="currentColor" />
          <polygon points="2,16 12,18 10,16 12,14" fill="currentColor" />
          <polygon points="30,16 20,14 22,16 20,18" fill="currentColor" />
        </svg>
      </div>

      {/* Spotlight */}
      <div className="absolute pointer-events-none transition-all duration-[500ms] ease-out"
        style={{
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.035) 0%, transparent 65%)',
          left: mousePos.x - 300, top: mousePos.y - 300,
        }}
      />

      {/* Scan line overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025] z-20">
        <div className="w-full h-px" style={{ background: 'rgba(99,102,241,0.3)', animation: 'scan 6s linear infinite' }} />
      </div>

      {/* Crosshair cursor follower */}
      <div className="absolute pointer-events-none transition-all duration-[400ms] ease-out z-20"
        style={{
          left: mousePos.x, top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          opacity: mousePos.x > 0 ? 1 : 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="0.75">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 0V6M10 14V20M0 10H6M14 10H20" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-20">
          {/* Text side */}
          <div ref={textAnimRef} className="lg:w-[52%]"
            style={{
              opacity: textAnim.progress,
              transform: `translateY(${24 * (1 - textAnim.progress)}px)`,
              transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform, opacity',
            }}
          >
            <span className="font-mono text-[0.85rem] text-ink-faint/70 uppercase tracking-[0.2em]">
              {typed}<span className="animate-pulse text-blueprint/60">_</span>
            </span>

            {/* Pull quote Ã¢â‚¬â€ the heart of the section */}
            <div className="relative mt-8 mb-10">
              <div className="flex gap-4">
                <div className="hidden sm:flex flex-col items-center">
                  <span className="font-editorial text-[5.5rem] sm:text-[7rem] leading-[0.7] select-none"
                    style={{ color: 'rgba(99,102,241,0.1)' }}>&ldquo;</span>
                  <div className="flex-1 w-px mt-3" style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.08), transparent)' }} />
                </div>
                <div className="flex-1">
                  <p className="font-editorial text-[clamp(1.5rem,3.2vw,2.6rem)] text-ink-primary leading-[1.2] relative sm:pt-2">
                    I grew up in Dharamshala,<br />
                    <span className="text-ink-muted">at the edge of the Himalayas.</span>
                  </p>
                  <div className="mt-5 h-px w-12" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.15), transparent)' }} />
                </div>
              </div>
            </div>

            <div className="space-y-7 text-[0.95rem] sm:text-[1.05rem] text-ink-secondary leading-[1.75] tracking-[0.015em]">
              <div className="flex gap-4 sm:gap-5">
                <span className="font-mono text-[0.9rem] uppercase tracking-[0.25em] shrink-0 pt-1.5 select-none"
                  style={{ color: 'rgba(99,102,241,0.2)' }}>01</span>
                <p>
                  <span className="float-left text-[3.8rem] sm:text-[4.5rem] font-editorial leading-[0.7] mr-3 mt-0.5"
                    style={{ color: 'rgba(99,102,241,0.25)' }}>M</span>
                  ountains teach you to observe. You watch light change, weather shift, landscapes transform. I didn't know it then, but that habit of watching would become the foundation for everything I build.
                </p>
              </div>
              <div className="flex gap-4 sm:gap-5">
                <span className="font-mono text-[0.9rem] uppercase tracking-[0.25em] shrink-0 pt-1.5 select-none"
                  style={{ color: 'rgba(99,102,241,0.2)' }}>02</span>
                <p className="text-ink-muted">
                  Somewhere between photographing a sunset and debugging a neural network, I realized these are the same practice: careful observation followed by deliberate action. Engineering gave me the tools to build what photography taught me to see.
                </p>
              </div>
              <div className="flex gap-4 sm:gap-5">
                <span className="font-mono text-[0.9rem] uppercase tracking-[0.25em] shrink-0 pt-1.5 select-none"
                  style={{ color: 'rgba(99,102,241,0.2)' }}>03</span>
                <p>
                  Now I study Computer Science at VIT, specializing in AI/ML. I build systems that learn from the world Ã¢â‚¬â€ computer vision, reinforcement learning, NLP Ã¢â‚¬â€ and I photograph the world those systems try to understand.
                </p>
              </div>
            </div>

            {/* Colophon / signature line */}
            <div className="mt-10 pt-5 border-t flex items-end justify-between"
              style={{ borderColor: 'rgba(140,134,125,0.06)' }}>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center"
                  style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
                  <span className="font-editorial text-[0.9rem]" style={{ color: 'rgba(99,102,241,0.4)' }}>AV</span>
                </div>
                <div>
                  <span className="block font-editorial text-sm text-ink-primary">Atharv Vatsal</span>
                  <span className="block font-mono text-[0.8rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.4)' }}>Dharamshala Ã‚Â· HP Ã‚Â· India</span>
                </div>
              </div>
              <div className="text-right leading-none">
                <span className="font-mono text-[0.9rem] tracking-[0.25em] block"
                  style={{ color: 'rgba(140,134,125,0.15)' }}>32.2432Ã‚Â°N  Ã‚Â·  76.3239Ã‚Â°E</span>
                <span className="font-mono text-[0.35rem] tracking-[0.3em] block mt-1"
                  style={{ color: 'rgba(140,134,125,0.08)' }}>REF: AV-ARCH-001</span>
              </div>
            </div>
          </div>

          {/* Photo side */}
          <div ref={photoAnimRef} className="mt-10 lg:mt-0 lg:w-[48%] shrink-0"
            style={{
              opacity: photoAnim.progress,
              transform: `translateX(${300 * (1 - photoAnim.progress)}px)`,
              transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform, opacity',
              perspective: '1200px',
            }}
          >
            <div
              ref={cardRef}
              onMouseMove={handleTilt}
              onMouseEnter={() => setTiltHovered(true)}
              onMouseLeave={() => { setTiltHovered(false); setTilt({ x: 0, y: 0 }); }}
              className="relative transition-all duration-500 ease-out"
              style={{
                transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transformStyle: 'preserve-3d',
                transition: tiltHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
              }}
            >
              {/* Outer frame Ã¢â‚¬â€ archival mat */}
              <div className="relative" style={{ transform: 'translateZ(10px)' }}>
                {/* Outer shadow Ã¢â‚¬â€ deep, warm */}
                <div className="absolute -inset-6 bg-gradient-to-br from-blueprint/[0.02] via-transparent to-amber/[0.02] blur-2xl rounded-2xl" />
                <div className="absolute -inset-3 bg-gradient-to-br from-blueprint/[0.04] to-transparent blur-lg rounded-2xl" />

                {/* Mat board Ã¢â‚¬â€ wide border */}
                <div className="relative bg-notebook-surface p-4 sm:p-5 shadow-lg"
                  style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(99,102,241,0.05)' }}>

                  {/* Inner bevel shadow */}
                  <div className="absolute inset-0 pointer-events-none z-10"
                    style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.03), inset 0 -1px 2px rgba(0,0,0,0.15)' }} />

                  {/* Image area */}
                  <div className="relative overflow-hidden" style={{ transform: 'translateZ(20px)' }}>
                    <img
                      src="/avPhoto.webp"
                      alt="Atharv Vatsal"
                      className="w-full h-auto scale-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                      style={{ transformStyle: 'preserve-3d' }}
                    />
                    {/* Subtle vignette on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-notebook-bg/30 via-transparent to-notebook-bg/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>

                  {/* Vintage corner tabs */}
                  <svg className="absolute top-0 left-0 w-5 h-5 text-notebook-bg z-20" viewBox="0 0 20 20" fill="currentColor" style={{ transform: 'translateZ(5px)' }}>
                    <path d="M0 0H14L20 6V20L0 0Z" opacity="0.92" />
                    <path d="M0 0H14L20 6V20L0 0Z" fill="none" stroke="rgba(99,102,241,0.05)" strokeWidth="0.5" />
                  </svg>
                  <svg className="absolute top-0 right-0 w-5 h-5 text-notebook-bg z-20" viewBox="0 0 20 20" fill="currentColor" style={{ transform: 'translateZ(5px)' }}>
                    <path d="M20 0H6L0 6V20L20 0Z" opacity="0.92" />
                    <path d="M20 0H6L0 6V20L20 0Z" fill="none" stroke="rgba(99,102,241,0.05)" strokeWidth="0.5" />
                  </svg>
                  <svg className="absolute bottom-0 left-0 w-5 h-5 text-notebook-bg z-20" viewBox="0 0 20 20" fill="currentColor" style={{ transform: 'translateZ(5px)' }}>
                    <path d="M0 20H14L20 14V0L0 20Z" opacity="0.92" />
                    <path d="M0 20H14L20 14V0L0 20Z" fill="none" stroke="rgba(99,102,241,0.05)" strokeWidth="0.5" />
                  </svg>
                  <svg className="absolute bottom-0 right-0 w-5 h-5 text-notebook-bg z-20" viewBox="0 0 20 20" fill="currentColor" style={{ transform: 'translateZ(5px)' }}>
                    <path d="M20 20H6L0 14V0L20 20Z" opacity="0.92" />
                    <path d="M20 20H6L0 14V0L20 20Z" fill="none" stroke="rgba(99,102,241,0.05)" strokeWidth="0.5" />
                  </svg>

                  {/* Frame border glow on hover */}
                  <div className="absolute inset-0 pointer-events-none transition-all duration-700 z-10"
                    style={{ boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.03)' }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'inset 0 0 0 0.5px rgba(99,102,241,0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'inset 0 0 0 0.5px rgba(255,255,255,0.03)'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient bridge to next section */}
      <div className={`relative py-5 sm:py-6 transition-all duration-1000 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.012))'
        }} />
      </div>
    </section>
  );
};

export default AboutSection;
