import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Aperture,
  Timer,
  Gauge,
  Focus,
  Tag,
  Home,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { galleryPhotos, galleryCategories } from '../data/gallery';
import { useTheme } from '../context/ThemeContext';
import { CustomCursor, SEO } from '../components/common';

const GalleryPage = () => {
  const { currentTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleImageError = (photoId) => {
    setImageErrors(prev => ({ ...prev, [photoId]: true }));
  };

  const filteredPhotos = galleryPhotos.filter(
    photo => selectedCategory === 'All' || photo.category === selectedCategory
  );

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  }, [currentIndex, filteredPhotos]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === filteredPhotos.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  }, [currentIndex, filteredPhotos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, goToPrevious, goToNext]);

  const getAspectClass = (aspectRatio, index) => {
    const patterns = [
      'row-span-1', 'row-span-2', 'row-span-1', 'row-span-2',
      'row-span-1', 'row-span-1', 'row-span-2', 'row-span-1',
    ];
    if (aspectRatio === 'portrait') return 'row-span-2';
    if (aspectRatio === 'landscape') return 'row-span-1';
    return patterns[index % patterns.length];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white ${!isTouchDevice ? 'cursor-none' : ''}`}>
      <SEO
        title="Photography Gallery"
        description="Photography portfolio by Atharv Vatsal — capturing portraits, landscapes, concerts, and nature through a creative lens."
        url="/gallery"
        keywords={['photography', 'gallery', 'portrait', 'landscape', 'concert photography', 'Nikon']}
      />
      <CustomCursor isTouchDevice={isTouchDevice} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Portfolio</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-purple-400" />
            <span className="font-medium">Gallery</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div 
            className={`transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 backdrop-blur-xl">
                <Camera size={40} className="text-purple-400" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Photography
            </h1>
            
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
              A collection of moments frozen in time. Each frame tells a story, 
              each click captures an emotion.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {galleryCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-60">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[200px]">
            {filteredPhotos.map((photo, index) => {
              const hasValidImage = !imageErrors[photo.id];
              
              return (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(photo, index)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer ${getAspectClass(photo.aspectRatio, index)} ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    transition: 'opacity 0.5s ease, transform 0.5s ease'
                  }}
                >
                  {hasValidImage ? (
                    <>
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={() => handleImageError(photo.id)}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{photo.title}</h3>
                        <div className="flex items-center gap-2 text-gray-300 text-xs">
                          <MapPin size={12} />
                          <span className="line-clamp-1">{photo.location}</span>
                        </div>
                      </div>

                      {photo.featured && (
                        <div className="absolute top-3 right-3">
                          <Sparkles size={16} className="text-amber-400 drop-shadow-lg" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl">
                      <ImageIcon size={32} className="text-gray-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/5">
        <Sparkles size={24} className="inline-block text-purple-400/40 animate-pulse mb-4" />
        <p className="text-gray-600 text-sm mb-4">Every frame tells a story...</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors"
        >
          <Home size={16} />
          Back to Portfolio
        </Link>
      </footer>

      {/* Lightbox Overlay */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] flex"
          onClick={closeLightbox}
        >
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            style={{
              backgroundImage: `url(${selectedPhoto.placeholder || selectedPhoto.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(50px) brightness(0.3)',
            }}
          />
          
          <div className="relative w-full h-full flex flex-col lg:flex-row" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
            >
              <X size={24} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 lg:right-[340px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={28} />
            </button>

            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 lg:pr-[340px]">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                onError={() => handleImageError(selectedPhoto.id)}
              />
            </div>

            <div className="lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[320px] bg-black/50 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedPhoto.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedPhoto.description}</p>
                </div>

                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
                    {selectedPhoto.category}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin size={18} className="text-purple-400" />
                    <span>{selectedPhoto.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar size={18} className="text-purple-400" />
                    <span>{selectedPhoto.date}</span>
                  </div>
                </div>

                <div className="h-px bg-white/10"></div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Equipment</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Camera size={18} className="text-cyan-400" />
                      <span>{selectedPhoto.camera}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Focus size={18} className="text-cyan-400" />
                      <span>{selectedPhoto.lens}</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10"></div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Settings</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Aperture size={12} />
                        <span>Aperture</span>
                      </div>
                      <div className="text-white font-medium">{selectedPhoto.settings.aperture}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Timer size={12} />
                        <span>Shutter</span>
                      </div>
                      <div className="text-white font-medium">{selectedPhoto.settings.shutter}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Gauge size={12} />
                        <span>ISO</span>
                      </div>
                      <div className="text-white font-medium">{selectedPhoto.settings.iso}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Focus size={12} />
                        <span>Focal</span>
                      </div>
                      <div className="text-white font-medium">{selectedPhoto.settings.focalLength}</div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10"></div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-white/10">
                  <span className="text-gray-500 text-sm">
                    {currentIndex + 1} / {filteredPhotos.length}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-gray-600 text-xs">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">←</kbd>
                    <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">→</kbd>
                    <span className="ml-1">Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">Esc</kbd>
                    <span className="ml-1">Close</span>
                  </span>
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