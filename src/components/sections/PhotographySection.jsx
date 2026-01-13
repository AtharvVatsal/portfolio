import React from 'react';
import { Camera, ArrowRight } from 'lucide-react';
import { photoCategories } from '../../data';
import { SOCIAL_LINKS } from '../../config/links';

const PhotographySection = ({ isVisible, mousePosition }) => {
  const handleViewGallery = () => {
    window.open(SOCIAL_LINKS.photography, '_blank', 'noopener,noreferrer');
  };

  return (
    <section 
      id="photography" 
      className={`min-h-screen flex items-center justify-center relative overflow-hidden py-12 sm:py-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] md:w-[700px] md:h-[700px] rounded-full pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.25) 40%, transparent 70%)`,
            left: `${(mousePosition?.x || 0) - 350}px`,
            top: `${(mousePosition?.y || 0) - 350}px`,
            filter: 'blur(100px)',
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 backdrop-blur-xl animate-pulse-slow">
              <Camera size={40} className="sm:w-12 sm:h-12 text-purple-400" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Photography Gallery
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">Capturing moments, creating memories</p>
        </div>

        {/* Photo Categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {photoCategories.map((category, index) => (
            <div
              key={category.name}
              className="group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:border-purple-400/50 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10 text-center">
                <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform duration-700">
                  {category.image}
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                  {category.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">{category.count} photos</p>
              </div>
            </div>
          ))}
        </div>

        {/* View Gallery Button */}
        <div className="text-center mt-12">
          <button 
            onClick={handleViewGallery}
            className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-700 hover:scale-105 font-medium group"
          >
            <span className="flex items-center gap-2">
              View Full Gallery
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PhotographySection;
