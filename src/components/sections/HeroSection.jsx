import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { galleryPhotos } from '../../data/gallery';
import { getGalleryImageUrl } from '../../config/cloudinary';
import { roles, taglines } from '../../data/roles';

const HeroSection = memo(() => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleSectionMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const photo = galleryPhotos.find(p => p.id === 1) || galleryPhotos[0];
  const url = photo ? getGalleryImageUrl(photo.publicId) : null;
  const onLoad = useCallback(() => setLoaded(true), []);

  const startTyping = useCallback((idx) => {
    setTyping(true);
    setTaglineVisible(false);
    setFading(false);
    setDisplayed('');
    const role = roles[idx];
    let i = 0;
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    intervalRef.current = setInterval(() => {
      if (i < role.length) {
        setDisplayed(role.substring(0, i + 1));
        i++;
      } else {
        clearInterval(intervalRef.current);
        setTyping(false);
        timeoutRef.current = setTimeout(() => setTaglineVisible(true), 200);
      }
    }, 40);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    startTyping(0);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [loaded, startTyping]);

  useEffect(() => {
    if (!taglineVisible || fading) return;
    timeoutRef.current = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        const next = (index + 1) % roles.length;
        setIndex(next);
        startTyping(next);
      }, 500);
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [taglineVisible, fading, index, startTyping]);

  return (
    <section id="home" onMouseMove={handleSectionMouse} className="relative w-full h-dvh overflow-hidden bg-neutral-950">
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] -right-16 w-64 h-64 border border-white/[0.03] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.008}px, ${mousePos.y * -0.008}px)` }} />
        <div className="absolute top-[10%] -right-8 w-44 h-44 border border-white/[0.02] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * -0.012}px, ${mousePos.y * 0.012}px)` }} />
        <div className="absolute top-[30%] left-[8%] w-0.5 h-0.5 rounded-full bg-white/[0.03]" />
        <div className="absolute top-[60%] right-[12%] w-1 h-1 rounded-full bg-white/[0.02]" />
        <div className="absolute bottom-[25%] left-[15%] w-0.5 h-0.5 rounded-full bg-white/[0.03]" />
        <div className="absolute top-[20%] right-[5%] w-1 h-1 rounded-full bg-white/[0.02]" />
        <svg className="absolute bottom-[30%] right-[8%] opacity-[0.015]" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="24" cy="24" r="10" />
          <path d="M24 0V14M24 34V48M14 24H0M34 24H48" />
          <path d="M24 4L26 12H22L24 4Z" fill="currentColor" />
        </svg>
      </div>

      {/* Spotlight */}
      <div className="absolute pointer-events-none transition-all duration-[500ms] ease-out"
        style={{
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 65%)',
          left: mousePos.x - 350, top: mousePos.y - 350,
        }}
      />

      {url && !error ? (
        <img
          src={url.full}
          alt=""
          aria-hidden="true"
          onLoad={onLoad}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out ${
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-2xl scale-110'
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-blueprint/5" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      <div
        className={`relative z-10 w-full h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 transition-all duration-[1200ms] ease-out ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl">
          <p className="font-mono text-[0.85rem] text-white/80 tracking-[0.3em] uppercase mb-5">
            Atharv Vatsal
          </p>

          <h1 className="font-editorial text-[clamp(2.4rem,6.5vw,5.5rem)] text-white leading-[1.05] font-light tracking-tight">
            {displayed}
            {typing && (
              <span className="inline-block w-[2px] h-[0.85em] bg-white/70 ml-1 align-middle animate-pulse" />
            )}
          </h1>

          <div
            className={`transition-all duration-700 ease-out ${
              taglineVisible && !fading
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            } ${fading ? 'opacity-0 translate-y-3' : ''}`}
          >
            <p className="font-mono text-[1rem] sm:text-[1.1rem] text-white/65 mt-8 max-w-xl leading-relaxed tracking-[0.02em]">
              {taglines[index]}
            </p>
          </div>

          <div className={`mt-10 flex items-center gap-2 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            {roles.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-700 ease-out ${
                  i === index
                    ? 'w-8 h-[2px] bg-white/70'
                    : 'w-2 h-[2px] bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-[1500ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[0.85rem] text-white/70 tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
