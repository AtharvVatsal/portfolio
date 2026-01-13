import React from 'react';
import { Sparkles } from 'lucide-react';

const QuoteSection = ({ isVisible }) => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Top decorative element */}
        <div 
          className={`flex justify-center mb-8 sm:mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="relative">
            <Sparkles className="text-cyan-400 opacity-40" size={32} />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="text-purple-400 opacity-20" size={32} />
            </div>
          </div>
        </div>

        {/* Main Quote Card */}
        <div 
          className={`relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 lg:p-16 transition-all duration-1000 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl group ${
            isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-20 scale-95'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {/* Decorative corner sparkles */}
          <Sparkles 
            className={`absolute -top-4 -left-4 sm:-top-6 sm:-left-6 text-cyan-400 opacity-0 group-hover:opacity-60 transition-all duration-700 ${
              isVisible ? 'animate-pulse-slow' : ''
            }`}
            size={24} 
          />
          <Sparkles 
            className={`absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 text-purple-400 opacity-0 group-hover:opacity-60 transition-all duration-700 ${
              isVisible ? 'animate-pulse-slow' : ''
            }`}
            size={24}
            style={{ animationDelay: '1s' }}
          />

          {/* Quote marks - Opening */}
          <div 
            className={`absolute -top-4 left-8 sm:-top-6 sm:left-12 text-6xl sm:text-7xl lg:text-8xl font-serif leading-none transition-all duration-1000 ${
              isVisible 
                ? 'opacity-30 translate-y-0 rotate-0' 
                : 'opacity-0 -translate-y-4 -rotate-12'
            }`}
            style={{ 
              transitionDelay: '600ms',
              background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            "
          </div>

          {/* Quote marks - Closing */}
          <div 
            className={`absolute -bottom-4 right-8 sm:-bottom-6 sm:right-12 text-6xl sm:text-7xl lg:text-8xl font-serif leading-none transition-all duration-1000 ${
              isVisible 
                ? 'opacity-30 translate-y-0 rotate-0' 
                : 'opacity-0 translate-y-4 rotate-12'
            }`}
            style={{ 
              transitionDelay: '800ms',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            "
          </div>

          {/* Quote Content */}
          <blockquote className="relative z-10">
            <p 
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-200 leading-relaxed transition-all duration-1000 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: '700ms',
                fontFamily: 'Georgia, serif',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              Merging{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold">
                  logic
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-50"></span>
              </span>
              {' '}with{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
                  light
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 opacity-50"></span>
              </span>
              {' '}—{' '}
              <br className="hidden sm:block" />
              engineering solutions and capturing stories.
            </p>

            {/* Author attribution */}
            <footer 
              className={`mt-6 sm:mt-8 transition-all duration-1000 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                <cite className="not-italic text-sm sm:text-base text-gray-400 font-medium">
                  Atharv Vatsal
                </cite>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              </div>
            </footer>
          </blockquote>

          {/* Bottom decorative line */}
          <div 
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-4/5 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-1000 rounded-full ${
              isVisible ? 'opacity-50' : 'opacity-0'
            }`}
            style={{ transitionDelay: '1000ms' }}
          ></div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-1000 pointer-events-none"></div>
        </div>

        {/* Bottom decorative element */}
        <div 
          className={`flex justify-center mt-8 sm:mt-12 gap-2 transition-all duration-1000 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '1100ms' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
