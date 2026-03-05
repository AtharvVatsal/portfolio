import React, { useState, useEffect } from 'react';
import { ArrowUp, Bot, Sparkles } from 'lucide-react';
import AIChatbot from './AIChatbot';

const FloatingActionButtons = ({ scrollY, showAIAssistant, setShowAIAssistant }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isOnHero, setIsOnHero] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showScrollTop = scrollY > 500;

  // Track if user is on the hero section (roughly first viewport)
  useEffect(() => {
    setIsOnHero(scrollY < window.innerHeight * 0.8);
  }, [scrollY]);

  // Only pulse on hero section or when hovering near the button
  const shouldPulse = !showAIAssistant && (isOnHero || isHovering);

  return (
    <>
      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-3">
        
        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`group w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-110 shadow-lg ${
            showScrollTop 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp 
            size={20} 
            className="text-white group-hover:-translate-y-1 transition-transform duration-300" 
          />
        </button>

        {/* AI Assistant Toggle Button */}
        <button
          onClick={() => setShowAIAssistant(!showAIAssistant)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`group relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 shadow-lg ${
            showAIAssistant
              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
              : 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20'
          }`}
          aria-label={showAIAssistant ? 'Close AI Assistant' : 'Open AI Assistant'}
        >
          {/* Animated ring — only on hero section or hover */}
          {shouldPulse && (
            <span className="absolute inset-0 rounded-full border-2 border-purple-400/50 animate-ping" />
          )}
          
          <Bot 
            size={22} 
            className={`transition-all duration-300 ${
              showAIAssistant 
                ? 'text-white rotate-0' 
                : 'text-purple-400 group-hover:text-white'
            }`}
          />
          
          {/* Sparkle decoration — same condition */}
          {shouldPulse && (
            <Sparkles 
              size={10} 
              className="absolute -top-1 -right-1 text-amber-400 animate-pulse" 
            />
          )}
        </button>
      </div>

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)} 
      />
    </>
  );
};

export default FloatingActionButtons;