import React from 'react';
import { Github, Linkedin, Instagram, ChevronDown, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTypingEffect } from '../../hooks';
import { useGreeting } from '../../hooks';
import { roles, taglines } from '../../data';
import { SOCIAL_LINKS } from '../../config/links';
import { MouseGlow } from '../common';

const HeroSection = ({ mousePosition, scrollY, parallaxOffset }) => {
  const { theme } = useTheme();
  const { displayText, currentIndex, cursorBlink } = useTypingEffect(roles);
  const greeting = useGreeting();

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSocialClick = (platform) => {
    const url = SOCIAL_LINKS[platform];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 px-4"
      style={{
        transform: parallaxOffset ? `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)` : 'none',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mouse spotlight */}
        <MouseGlow
          mousePosition={mousePosition}
          size={800}
          blur={80}
          smoothing={0.08}
          className="hidden md:block"
          gradient={`radial-gradient(circle, rgba(34, 211, 238, ${0.4 - (scrollY || 0) * 0.0003}) 0%, rgba(168, 85, 247, ${0.3 - (scrollY || 0) * 0.0002}) 40%, transparent 70%)`}
        />
        <MouseGlow
          mousePosition={mousePosition}
          size={600}
          blur={80}
          smoothing={0.08}
          className="md:hidden"
          gradient={`radial-gradient(circle, rgba(34, 211, 238, ${0.4 - (scrollY || 0) * 0.0003}) 0%, rgba(168, 85, 247, ${0.3 - (scrollY || 0) * 0.0002}) 40%, transparent 70%)`}
        />

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>

        {/* Gradient orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, transparent 70%)`,
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow transition-all duration-1000" 
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Greeting */}
        <div className="mb-4 animate-fade-in">
          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300 max-w-full">
            <Sparkles className="inline w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{greeting}, Welcome to my Portfolio</span>
          </span>
        </div>

        {/* Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Atharv Vatsal
          </span>
        </h1>

        {/* Typing Effect */}
        <div className="h-12 sm:h-16 flex items-center justify-center mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light">
            I'm a{' '}
            <span className="text-cyan-400 font-medium">
              {displayText}
              <span className={`${cursorBlink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
            </span>
          </h2>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {taglines[currentIndex]}
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {[
            { icon: Github, platform: 'github', color: 'hover:text-cyan-400 hover:border-cyan-400' },
            { icon: Linkedin, platform: 'linkedin', color: 'hover:text-blue-400 hover:border-blue-400' },
            { icon: Instagram, platform: 'instagram', color: 'hover:text-pink-400 hover:border-pink-400' },
          ].map((social) => (
            <button
              key={social.platform}
              onClick={() => handleSocialClick(social.platform)}
              className={`p-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 transition-all duration-500 hover:scale-110 hover:bg-white/10 ${social.color}`}
            >
              <social.icon size={24} />
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToAbout}
          className="animate-bounce-slow"
          aria-label="Scroll to about section"
        >
          <ChevronDown size={32} className="text-gray-400 hover:text-cyan-400 transition-colors duration-300" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;