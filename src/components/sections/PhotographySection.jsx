import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight, Sparkles } from 'lucide-react';
import { photoCategories } from '../../data';
import { galleryPhotos } from '../../data/gallery';
import { MouseGlow } from '../common';

const PhotographySection = ({ isVisible, mousePosition }) => {
  const [imageErrors, setImageErrors] = useState({});
  
  // Get all photos for the background (featured first, then others)
  const allPhotos = useMemo(() => {
    const featured = galleryPhotos.filter(photo => photo.featured);
    const others = galleryPhotos.filter(photo => !photo.featured);
    return [...featured, ...others];
  }, []);

  const handleImageError = (photoId) => {
    setImageErrors(prev => ({ ...prev, [photoId]: true }));
  };

  // Create rows with different photos
  const row1Photos = allPhotos.slice(0, Math.ceil(allPhotos.length / 2));
  const row2Photos = allPhotos.slice(Math.ceil(allPhotos.length / 2));
  
  // Duplicate for seamless loop
  const row1 = [...row1Photos, ...row1Photos, ...row1Photos];
  const row2 = [...row2Photos, ...row2Photos, ...row2Photos];

  const PhotoCard = ({ photo, index, row }) => {
    const hasValidImage = (photo.thumbnail || photo.src) && !imageErrors[photo.id];
    
    if (!hasValidImage) return null;
    
    return (
      <div
        className="relative flex-shrink-0 group"
        style={{
          width: row === 1 ? '280px' : '240px',
          height: row === 1 ? '180px' : '160px',
        }}
      >
        {/* Photo container with 3D effect */}
        <div 
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-105"
          style={{
            transform: `perspective(1000px) rotateY(${row === 1 ? -3 : 3}deg) rotateX(2deg)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.15)',
          }}
        >
          {/* Image */}
          <img
            src={photo.thumbnail || photo.src}
            alt={photo.title}
            width={row === 1 ? 280 : 240}
            height={row === 1 ? 180 : 160}
            className="w-full h-full object-cover"
            onError={() => handleImageError(photo.id)}
            loading="lazy"
            decoding="async"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Color tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 mix-blend-overlay" />
          
          {/* Title on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-white text-sm font-medium truncate">{photo.title}</p>
            <p className="text-gray-300 text-xs">{photo.location}</p>
          </div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        
        {/* Reflection */}
        <div 
          className="absolute -bottom-12 left-0 right-0 h-12 rounded-2xl overflow-hidden opacity-20 blur-sm scale-y-[-1]"
          style={{ transform: 'scaleY(-1) perspective(1000px) rotateX(60deg)' }}
        >
          <img
            src={photo.thumbnail || photo.src}
            alt=""
            width={row === 1 ? 280 : 240}
            height={row === 1 ? 180 : 160}
            className="w-full h-full object-cover object-bottom"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    );
  };

  return (
    <section 
      id="photography" 
      className={`min-h-screen flex items-center justify-center relative overflow-hidden py-12 sm:py-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Animated Photo Background - Infinite Marquee */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dark base */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        
        {/* Row 1 - Scrolling Left */}
        <div className="absolute top-[5%] left-0 right-0 overflow-hidden">
          <div 
            className="flex gap-6 animate-marquee-left"
            style={{ width: 'max-content' }}
          >
            {row1.map((photo, index) => (
              <PhotoCard key={`row1-${photo.id}-${index}`} photo={photo} index={index} row={1} />
            ))}
          </div>
        </div>
        
        {/* Row 2 - Scrolling Right */}
        <div className="absolute bottom-[8%] left-0 right-0 overflow-hidden">
          <div 
            className="flex gap-6 animate-marquee-right"
            style={{ width: 'max-content' }}
          >
            {row2.map((photo, index) => (
              <PhotoCard key={`row2-${photo.id}-${index}`} photo={photo} index={index} row={2} />
            ))}
          </div>
        </div>
        
        {/* Center gradient fade - creates focus area */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        
        {/* Radial spotlight effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 70%)',
          }}
        />
        
        {/* Purple ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Mouse follow gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <MouseGlow
          mousePosition={mousePosition}
          size={500}
          blur={60}
          smoothing={0.08}
          className="opacity-60"
          gradient="radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.2) 40%, transparent 70%)"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/50 blur-xl rounded-full animate-pulse" />
              <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-white/10">
                <Camera size={44} className="sm:w-14 sm:h-14 text-purple-400" />
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
              Photography Gallery
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Capturing moments, creating memories
          </p>
          
          <div className="flex justify-center mt-4">
            <Sparkles className="text-purple-400/60 animate-pulse" size={24} />
          </div>
        </div>

        {/* Photo Categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {photoCategories.map((category, index) => (
            <Link
              to="/gallery"
              key={category.name}
              className="group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/15 transition-all duration-700 hover:scale-105 hover:border-purple-400/50 cursor-pointer animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-700" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              
              <div className="relative z-10 text-center">
                <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700">
                  {category.image}
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                  {category.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">{category.count} photos</p>
              </div>
            </Link>
          ))}
        </div>

        {/* View Gallery Button */}
        <div className="text-center">
          <Link 
            to="/gallery"
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-500 hover:scale-105 font-semibold text-lg overflow-hidden"
          >
            {/* Button shine */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl bg-purple-500/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            
            <Camera size={22} className="relative z-10" />
            <span className="relative z-10">Explore Full Gallery</span>
            <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        
        .animate-marquee-left {
          animation: marquee-left 60s linear infinite;
          will-change: transform;
        }
        
        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
          will-change: transform;
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Disable heavy animations on mobile */
        @media (max-width: 639px) {
          .animate-marquee-left,
          .animate-marquee-right {
            animation: none;
          }
          .animate-pulse-slow {
            animation: none;
            opacity: 0.5;
          }
          .animate-gradient {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default PhotographySection;