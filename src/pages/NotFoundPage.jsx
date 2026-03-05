import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Ghost } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/common';
import {CustomCursor} from '../components/common';

const NotFoundPage = () => {
  const { currentTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white flex items-center justify-center relative overflow-hidden`}>
      <SEO title="404 — Page Not Found" description="The page you're looking for doesn't exist." noIndex />
        <CustomCursor />
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + i * 16}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-lg mx-auto">
        <div
          className={`transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Ghost icon */}
          <div className="flex justify-center mb-6">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <Ghost
                size={48}
                className="text-purple-400"
                style={{
                  animation: 'ghostBob 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* 404 number */}
          <h1
            className={`text-8xl sm:text-9xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none transition-all duration-200 ${
              glitchActive ? 'skew-x-2 scale-[1.02]' : ''
            }`}
            style={{
              textShadow: glitchActive
                ? '3px 0 rgba(34,211,238,0.5), -3px 0 rgba(236,72,153,0.5)'
                : 'none',
            }}
          >
            404
          </h1>

          {/* Message */}
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
            Lost in the void
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
            This page doesn't exist — maybe it wandered off, or maybe it was never here.
            Either way, let's get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 font-medium text-sm active:scale-[0.98]"
            >
              <Home size={18} />
              Back to Home
            </Link>

            <Link
              to="/blog"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 font-medium text-sm text-gray-300 hover:text-white active:scale-[0.98]"
            >
              <Search size={18} />
              Browse Blog
            </Link>
          </div>

          {/* Breadcrumb hint */}
          <button
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={12} />
            Or go back to the previous page
          </button>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        @keyframes ghostBob {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;