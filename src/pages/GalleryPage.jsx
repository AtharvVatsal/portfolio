import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { galleryPhotos, galleryCategories } from '../data/gallery';
import { SEO } from '../components/common';
import PageHeader from '../components/layout/PageHeader';
import { useInView } from '../hooks/useInView';

const aspectClass = (ratio) => {
  const r = (ratio || '').toLowerCase();
  if (r === 'portrait') return 'aspect-[2/3]';
  if (r === 'square') return 'aspect-square';
  return 'aspect-[4/3]';
};

const Card = ({ photo, index, onClick, visible, phase, staggerBase }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const stagger = staggerBase + Math.min(index * 30, 450);
  const isExiting = phase === 'exiting';
  const isEntering = phase === 'entering';

  return (
    <div
      onClick={() => onClick(photo, index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer break-inside-avoid mb-8 sm:mb-10"
      style={{
        opacity: isExiting ? 0 : (visible ? 1 : 0),
        translate: isExiting ? '0 -12px' : (visible ? '0 0' : '0 20px'),
        willChange: 'transform, opacity',
        transition: isExiting
          ? `opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), translate 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)`
          : isEntering
            ? `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${stagger}ms, translate 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) ${stagger}ms`
            : `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${stagger}ms, translate 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) ${stagger}ms`,
      }}
    >
      <div
        className={`relative overflow-hidden ${aspectClass(photo.aspectRatio)}`}
        style={{
          transform: hovered ? 'scale(1.015)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        <img
          src={photo.thumbnail}
          alt={photo.title}
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            filter: loaded ? 'brightness(1)' : 'brightness(0.6) blur(12px)',
            transition: 'filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />
      </div>

      <div className="mt-3 sm:mt-4">
        <p className="font-editorial text-lg sm:text-xl text-ink-primary leading-snug">
          {photo.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-mono text-[0.9rem] uppercase tracking-widest" style={{ color: 'rgba(99,102,241,0.35)' }}>
            {photo.category}
          </span>
          <span className="text-ink-faint/15">Ã‚Â·</span>
          <div className="flex items-center gap-1">
            <MapPin size={9} className="text-ink-faint/60" />
            <span className="font-mono text-[0.9rem] uppercase tracking-wider text-ink-faint/45">
              {photo.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gridRef, gridVisible] = useInView({ threshold: 0.05, once: true });
  const [filtersIn, setFiltersIn] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState('entering');
  const uiTimerRef = useRef(null);
  const navLockRef = useRef(false);
  const prevPhotoRef = useRef(null);
  const imgKeyRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setFiltersIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  const resetUiTimer = useCallback(() => {
    setUiVisible(true);
    if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
    uiTimerRef.current = setTimeout(() => setUiVisible(false), 2500);
  }, []);

  useEffect(() => {
    resetUiTimer();
    return () => { if (uiTimerRef.current) clearTimeout(uiTimerRef.current); };
  }, [selectedPhoto, resetUiTimer]);

  const filteredPhotos = useMemo(() =>
    galleryPhotos.filter(
      photo => selectedCategory === 'All' || photo.category === selectedCategory
    ),
    [selectedCategory]
  );

  const handleFilterClick = (name) => {
    if (name === selectedCategory || transitionPhase === 'exiting') return;
    if (transitionPhase === 'entering') {
      setTransitionPhase('idle');
    }
    setTransitionPhase('exiting');
    setTimeout(() => {
      setSelectedCategory(name);
      setTransitionPhase('entering');
      setTimeout(() => {
        setTransitionPhase('idle');
      }, 700);
    }, 250);
  };

  const openLightbox = (photo, index) => {
    prevPhotoRef.current = null;
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
    if (uiTimerRef.current) clearTimeout(uiTimerRef.current);
    prevPhotoRef.current = null;
  };

  const navigate = useCallback((dir) => {
    if (navLockRef.current) return;
    navLockRef.current = true;
    prevPhotoRef.current = selectedPhoto;
    imgKeyRef.current += 1;
    const newIndex = dir === 'prev'
      ? (currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1)
      : (currentIndex === filteredPhotos.length - 1 ? 0 : currentIndex + 1);
    setCurrentIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
    resetUiTimer();
    setTimeout(() => {
      navLockRef.current = false;
      prevPhotoRef.current = null;
    }, 500);
  }, [currentIndex, filteredPhotos, selectedPhoto, resetUiTimer]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate('prev');
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhoto, navigate]);

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary">
      <SEO
        title="Observations Ã¢â‚¬â€ Photography Gallery"
        description="Observation log by Atharv Vatsal Ã¢â‚¬â€ landscapes, wildlife, concerts, street photography."
        url="/gallery"
      />

      <PageHeader title="Observations" />

      {/* Filters */}
      <section className="border-b border-notebook-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none"
            style={{
              opacity: filtersIn ? 1 : 0,
              transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {galleryCategories.map((c, i) => {
              const active = selectedCategory === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => handleFilterClick(c.name)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: active ? 'rgba(99,102,241,0.07)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(99,102,241,0.2)' : 'rgba(40,37,31,0.3)'}`,
                    opacity: filtersIn ? 1 : 0,
                    translate: filtersIn ? '0 0' : '0 -8px',
                    willChange: 'transform, opacity',
                    transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.035}s, translate 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.035}s, background 0.3s, border-color 0.3s`,
                  }}
                >
                  <span
                    className="font-mono text-[0.9rem] tracking-[0.15em] uppercase whitespace-nowrap"
                    style={{
                      color: active ? 'rgba(245,242,237,0.85)' : 'rgba(140,134,125,0.3)',
                      transition: 'color 0.3s',
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="font-mono text-[0.9rem]"
                    style={{
                      color: active ? 'rgba(99,102,241,0.4)' : 'rgba(140,134,125,0.35)',
                      transition: 'color 0.3s',
                    }}
                  >
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section ref={gridRef} className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {filteredPhotos.length > 0 ? (
            <div className="columns-1 sm:columns-2 gap-6 sm:gap-8 lg:gap-10">
              {filteredPhotos.map((photo, index) => (
                <Card
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onClick={openLightbox}
                  visible={gridVisible}
                  phase={transitionPhase}
                  staggerBase={transitionPhase === 'entering' ? 200 : 0}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-editorial text-xl text-ink-muted">No photographs in this category yet.</p>
              <p className="font-mono text-xs text-ink-faint/60 mt-2 tracking-wider">Check back after the next expedition.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100]"
          onClick={closeLightbox}
          style={{
            background: 'rgba(0,0,0,0)',
            animation: 'lbOverlay 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
          }}
        >
          <style>{`
            @keyframes lbOverlay { from { background: rgba(0,0,0,0); } to { background: rgba(0,0,0,1); } }
            @keyframes lbIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
            @keyframes lbOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.97); } }
          `}</style>

          {/* Previous image Ã¢â‚¬â€ crossfade out */}
          {prevPhotoRef.current && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
              <img
                src={prevPhotoRef.current.src}
                alt=""
                className="w-full h-full object-contain select-none"
                draggable={false}
                style={{
                  animation: 'lbOut 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) both',
                  willChange: 'opacity, transform',
                }}
              />
            </div>
          )}

          {/* Current image Ã¢â‚¬â€ crossfade in */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
            <img
              key={imgKeyRef.current}
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="w-full h-full object-contain select-none"
              draggable={false}
              style={{
                animation: 'lbIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
                willChange: 'opacity, transform',
              }}
            />
          </div>

          {/* UI overlay */}
          <div
            className="absolute inset-0 z-20"
            onMouseMove={resetUiTimer}
            onTouchStart={resetUiTimer}
            style={{ pointerEvents: 'none' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full"
              style={{
                background: uiVisible ? 'rgba(40,37,31,0.25)' : 'rgba(40,37,31,0)',
                color: uiVisible ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0)',
                pointerEvents: 'auto',
                willChange: 'opacity, background',
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(40,37,31,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
            >
              <X size={16} />
            </button>

            <div
              className="absolute top-5 left-5"
              style={{
                opacity: uiVisible ? 1 : 0,
                willChange: 'opacity',
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span className="font-mono text-xs tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {String(currentIndex + 1).padStart(2, '0')} / {String(filteredPhotos.length).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full"
              style={{
                background: uiVisible ? 'rgba(40,37,31,0.15)' : 'rgba(40,37,31,0)',
                color: uiVisible ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0)',
                pointerEvents: 'auto',
                willChange: 'opacity, background',
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, color 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(40,37,31,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate('next'); }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full"
              style={{
                background: uiVisible ? 'rgba(40,37,31,0.15)' : 'rgba(40,37,31,0)',
                color: uiVisible ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0)',
                pointerEvents: 'auto',
                willChange: 'opacity, background',
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, color 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(40,37,31,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Caption */}
            <div
              className="absolute bottom-0 left-0 right-0"
              onClick={(e) => e.stopPropagation()}
              style={{
                opacity: uiVisible ? 1 : 0,
                translate: uiVisible ? '0 0' : '0 20px',
                willChange: 'transform, opacity',
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), translate 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                pointerEvents: uiVisible ? 'auto' : 'none',
              }}
            >
              <div className="pb-6 sm:pb-8 px-6 sm:px-10">
                <div
                  className="inline-block max-w-lg rounded-lg px-4 py-3"
                  style={{ background: 'rgba(16,15,13,0.8)', backdropFilter: 'blur(12px)' }}
                >
                  <h2 className="font-editorial text-base sm:text-lg text-white leading-snug">
                    {selectedPhoto.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1">
                      <MapPin size={9} className="text-white/45" />
                      <span className="font-mono text-[0.85rem] tracking-wider text-white/45 uppercase">
                        {selectedPhoto.location}
                      </span>
                    </div>
                    <span className="text-white/10">Ã‚Â·</span>
                    <span className="font-mono text-[0.85rem] tracking-wider text-white/55">
                      {selectedPhoto.date}
                    </span>
                    <span className="text-white/10">Ã‚Â·</span>
                    <span className="font-mono text-[0.85rem] tracking-widest text-white/70 uppercase">
                      {selectedPhoto.category}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-3 mt-2 pt-2 font-mono text-[0.8rem] tracking-wider"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
                  >
                    <span>{selectedPhoto.camera}</span>
                    <span>Ã‚Â·</span>
                    <span>{selectedPhoto.settings.aperture}</span>
                    <span>Ã‚Â·</span>
                    <span>{selectedPhoto.settings.shutter}</span>
                    <span>Ã‚Â·</span>
                    <span>ISO {selectedPhoto.settings.iso}</span>
                    <span>Ã‚Â·</span>
                    <span>{selectedPhoto.lens}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
