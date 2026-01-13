import React, { useState, useEffect } from 'react';

const Preloader = ({ progress, isLoading }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setIsRevealing(true), 50);
      setTimeout(() => setIsHidden(true), 450);
    }
  }, [progress]);

  if (isHidden) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      
      {/* Left Panel */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full"
        style={{
          background: 'linear-gradient(135deg, #050510 0%, #0a0a1a 50%, #12082a 100%)',
          transform: isRevealing ? 'translateX(-102%)' : 'translateX(0)',
          transition: 'transform 0.40s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Right Panel */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full"
        style={{
          background: 'linear-gradient(225deg, #050510 0%, #0a0a1a 50%, #12082a 100%)',
          transform: isRevealing ? 'translateX(102%)' : 'translateX(0)',
          transition: 'transform 0.40s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Center Glow Line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full"
        style={{
          background: 'linear-gradient(to bottom, transparent 5%, rgba(139, 92, 246, 0.6) 30%, rgba(34, 211, 238, 0.8) 50%, rgba(139, 92, 246, 0.6) 70%, transparent 95%)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(34, 211, 238, 0.3)',
          opacity: isRevealing ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Center Content */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: isRevealing ? 0 : 1,
          transform: isRevealing ? 'scale(0.9)' : 'scale(1)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        <div className="flex flex-col items-center gap-8">
          
          {/* Logo with glow */}
          <div className="relative">
            {/* Glow behind logo */}
            <div 
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                transform: 'scale(2)',
                animation: 'breathe 3s ease-in-out infinite',
              }}
            />
            
            {/* Logo container */}
            <div 
              className="relative w-24 h-24 rounded-2xl flex items-center justify-center border border-white/10"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src="/av.svg"
                alt="Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
          </div>

          {/* Name with letter spacing */}
          <div className="text-center">
            <h1 
              className="text-2xl sm:text-3xl font-extralight tracking-[0.4em] uppercase"
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
              }}
            >
              Atharv Vatsal
            </h1>
            
            {/* Subtle tagline */}
            <p 
              className="mt-3 text-xs tracking-[0.25em] uppercase"
              style={{
                color: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              Engineer • Photographer • Creator
            </p>
          </div>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.5; transform: scale(2); }
          50% { opacity: 0.8; transform: scale(2.2); }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
