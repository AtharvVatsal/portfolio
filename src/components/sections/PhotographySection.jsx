import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { galleryPhotos } from '../../data/gallery';
import { getGalleryImageUrl } from '../../config/cloudinary';
import { useInView } from '../../hooks/useInView';

const PHOTOS = galleryPhotos;
const isPortrait = (p) => {
  const ratio = (p.aspectRatio || '').toLowerCase();
  return ratio === 'portrait';
};

const PhotographySection = () => {
  const [inViewRef, inView] = useInView({ threshold: 0.05 });
  const [filmstripInViewRef, filmstripVisible] = useInView({ threshold: 0.1, once: true });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [loaded, setLoaded] = useState({});
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const loadingId = useRef(0);
  const transitionTimeoutRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  const DURATION = 500;

  const preloadImage = useCallback((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }, []);

  const handleSectionMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const startTransition = useCallback((targetIdx) => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    setTransitioning(true);
    setNext(targetIdx);
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrent(targetIdx);
      setNext(null);
      setTransitioning(false);
      transitionTimeoutRef.current = null;
    }, DURATION);
  }, []);

  const advance = useCallback(async () => {
    if (transitioning || PHOTOS.length < 2) return;
    const myId = ++loadingId.current;
    const nextIdx = (current + 1) % PHOTOS.length;
    const nextPhoto = PHOTOS[nextIdx];
    const nextUrl = getGalleryImageUrl(nextPhoto.publicId);
    await preloadImage(nextUrl.full);
    if (loadingId.current !== myId || transitioning) return;
    setLoaded(p => ({ ...p, [nextPhoto.id]: true }));
    startTransition(nextIdx);
  }, [current, transitioning, preloadImage, startTransition]);

  const goTo = useCallback(async (idx) => {
    if (idx === current) return;
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    const myId = ++loadingId.current;
    setPaused(true);
    setTransitioning(false);
    setNext(null);
    const targetPhoto = PHOTOS[idx];
    const targetUrl = getGalleryImageUrl(targetPhoto.publicId);
    await preloadImage(targetUrl.full);
    if (loadingId.current !== myId) return;
    setLoaded(p => ({ ...p, [targetPhoto.id]: true }));
    startTransition(idx);
    pauseTimeoutRef.current = setTimeout(() => setPaused(false), DURATION + 4000);
  }, [current, preloadImage, startTransition]);

  useEffect(() => {
    if (paused || PHOTOS.length < 2) return;
    timerRef.current = setInterval(advance, 4500);
    return () => clearInterval(timerRef.current);
  }, [advance, paused]);

  const onLoad = useCallback((id) => {
    setLoaded(p => ({ ...p, [id]: true }));
  }, []);

  const ThumbnailBtn = ({ p, i, current, goTo, isPortrait, visible }) => {
    const ref = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const thumbUrl = getGalleryImageUrl(p.publicId);

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: x * 8, y: y * -8 });
    };

    return (
      <button
        ref={ref}
        onClick={() => goTo(i)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
        className={`flex-shrink-0 overflow-hidden ${
          i === current ? 'ring-2 ring-blueprint/70' : 'ring-1 ring-white/5'
        } ${isPortrait(p) ? 'w-10 h-14 sm:w-12 sm:h-16 rounded-md' : 'w-16 h-11 sm:w-20 sm:h-14 rounded-sm'}`}
        style={{
          opacity: visible ? 1 : 0,
          translate: visible ? '0 0' : '0 24px',
          willChange: 'transform, opacity',
          transform: hovered
            ? `perspective(400px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${i === current ? 1.08 : 1.04})`
            : i === current
              ? 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1.05)'
              : 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)',
          transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s, translate 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.06}s, transform ${hovered ? '0.1s ease-out' : '0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'}`,
        }}
      >
        <img src={thumbUrl.thumbnail} alt={p.title} className="w-full h-full object-cover" />
      </button>
    );
  };

  if (PHOTOS.length === 0) return null;

  const photo = PHOTOS[current];
  const nextPhoto = next !== null ? PHOTOS[next] : null;
  const url = getGalleryImageUrl(photo.publicId);
  const nextUrl = nextPhoto ? getGalleryImageUrl(nextPhoto.publicId) : null;
  const portrait = isPortrait(photo);
  const nextPortrait = nextPhoto ? isPortrait(nextPhoto) : false;

  const blurBg = (p) => {
    if (!isPortrait(p)) return null;
    const u = getGalleryImageUrl(p.publicId);
    return (
      <img
        src={u.full}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
      />
    );
  };

  return (
    <section
      ref={(node) => { inViewRef.current = node; }}
      onMouseMove={handleSectionMouse}
      id="photography"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="absolute top-[10%] -right-20 w-56 h-56 border border-white/[0.03] rounded-full transition-transform duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.008}px, ${mousePos.y * -0.008}px)` }} />
        <div className="absolute top-[5%] -right-10 w-40 h-40 border border-white/[0.02] rounded-full transition-transform duration-1000"
          style={{ transform: `translate(${mousePos.x * -0.012}px, ${mousePos.y * 0.012}px)` }} />
        <div className="absolute top-[30%] left-[10%] w-0.5 h-0.5 rounded-full bg-white/[0.04]" />
        <div className="absolute top-[55%] right-[15%] w-1 h-1 rounded-full bg-white/[0.03]" />
        <div className="absolute bottom-[35%] left-[20%] w-0.5 h-0.5 rounded-full bg-white/[0.02]" />
        <div className="absolute top-[70%] right-[25%] w-1 h-1 rounded-full bg-white/[0.02]" />
        <div className="absolute top-[15%] left-[30%] w-0.5 h-0.5 rounded-full bg-white/[0.03]" />
        <svg className="absolute bottom-24 left-12 opacity-[0.012]" width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M0 60L60 0" />
          <path d="M15 60L60 15" strokeDasharray="2 3" />
          <path d="M0 45L45 0" strokeDasharray="2 3" />
        </svg>
        <div className="absolute top-16 left-8 opacity-[0.015]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
            <path d="M4 20V4H20" />
          </svg>
        </div>
      </div>

      <div className="absolute pointer-events-none transition-all duration-[500ms] ease-out z-20"
        style={{
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%)',
          left: mousePos.x - 300, top: mousePos.y - 300,
        }}
      />

      <div className="relative">
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: 'clamp(100px, 18vh, 220px)',
            background: 'linear-gradient(to bottom, rgb(10,9,8) 0%, rgba(10,9,8,0.75) 20%, rgba(10,9,8,0.35) 45%, rgba(10,9,8,0.1) 65%, rgba(10,9,8,0.02) 80%, transparent 100%)'
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: 'clamp(100px, 18vh, 220px)',
            background: 'linear-gradient(to top, rgb(10,9,8) 0%, rgba(10,9,8,0.75) 20%, rgba(10,9,8,0.35) 45%, rgba(10,9,8,0.1) 65%, rgba(10,9,8,0.02) 80%, transparent 100%)'
          }}
        />
        <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 transition-transform duration-[800ms] ease-out"
          style={{
            transform: `translate(${mousePos.x * 0.015}px, ${mousePos.y * -0.015}px)`,
          }}
        >
          {portrait && blurBg(photo)}
          {nextPhoto && nextPortrait && blurBg(nextPhoto)}

          {url && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: transitioning ? 0 : 1,
                transition: `opacity ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <img
                src={url.full}
                alt={photo.title}
                onLoad={() => onLoad(photo.id)}
                className={`w-full h-full rounded-2xl ${portrait ? 'max-w-[85%] max-h-[85%] object-contain' : 'object-cover'} ${
                  loaded[photo.id] ? 'blur-0' : 'blur-2xl'
                }`}
              />
            </div>
          )}

          {nextUrl && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: transitioning ? 1 : 0,
                transition: `opacity ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <img
                src={nextUrl.full}
                alt={nextPhoto.title}
                className={`w-full h-full rounded-2xl blur-0 ${nextPortrait ? 'max-w-[85%] max-h-[85%] object-contain' : 'object-cover'}`}
              />
            </div>
          )}
        </div>

        <div className={`absolute inset-0 transition-opacity duration-700 ${
          portrait ? 'bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-neutral-950/30' : 'bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent'
        }`} />

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16">
          <div className={`transition-all duration-700 ease-out delay-200 ${transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <p className="font-editorial text-[clamp(1.3rem,2.8vw,2.2rem)] text-white leading-[1.1] mb-2">
              {photo.title}
            </p>
            <div className="flex items-center gap-2 font-mono text-[0.9rem] text-white/70 tracking-wider uppercase flex-wrap">
              <span>{photo.category}</span>
              <span className="text-white/60">Ã‚Â·</span>
              <span>{photo.location}</span>
              {photo.date && (
                <>
                  <span className="text-white/60">Ã‚Â·</span>
                  <span>{photo.date}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 lg:top-10 lg:right-10 flex items-center gap-2">
          <span className="font-mono text-[0.85rem] text-white/60 tracking-wider tabular-nums">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="text-white/60 text-[0.85rem]">/</span>
          <span className="font-mono text-[0.85rem] text-white/60 tracking-wider tabular-nums">
            {String(PHOTOS.length).padStart(2, '0')}
          </span>
        </div>

        <button
          onClick={() => goTo((current - 1 + PHOTOS.length) % PHOTOS.length)}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white/60 hover:bg-white/5 rounded-full transition-all duration-300 z-10"
          aria-label="Previous"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10 3L5 8L10 13" />
          </svg>
        </button>
        <button
          onClick={() => goTo((current + 1) % PHOTOS.length)}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white/60 hover:bg-white/5 rounded-full transition-all duration-300 z-10"
          aria-label="Next"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 3L11 8L6 13" />
          </svg>
        </button>
      </div>
      </div>

      <div ref={filmstripInViewRef} className="px-6 sm:px-10 lg:px-16 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {PHOTOS.map((p, i) => (
              <ThumbnailBtn key={p.id} p={p} i={i} current={current} goTo={goTo} isPortrait={isPortrait} visible={filmstripVisible} />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="font-mono text-[0.85rem] text-white/60 uppercase tracking-wider">Observations</div>
            <Link
              to="/gallery"
              className="font-mono text-[0.9rem] text-white/60 hover:text-white/70 transition-colors duration-300 tracking-wider uppercase"
            >
              Full gallery &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className={`relative py-5 sm:py-6 transition-opacity duration-1000 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.015))'
        }} />
      </div>
    </section>
  );
};

export default PhotographySection;
