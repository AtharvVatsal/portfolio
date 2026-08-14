import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowUp, Bot, Loader2 } from 'lucide-react';

const AIChatbotLazy = lazy(() => import('./AIChatbot'));

const FloatingActionButtons = ({ scrollY, showAIAssistant, setShowAIAssistant }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isOnHero, setIsOnHero] = useState(true);
  const [chatbotLoading, setChatbotLoading] = useState(false);
  const [chatbotReady, setChatbotReady] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showScrollTop = scrollY > 500;

  useEffect(() => {
    setIsOnHero(scrollY < window.innerHeight * 0.8);
  }, [scrollY]);

  const shouldPulse = !showAIAssistant && (isOnHero || isHovering);

  const handleChatbotToggle = () => {
    if (!showAIAssistant && !chatbotReady) {
      setChatbotLoading(true);
    }
    setShowAIAssistant(!showAIAssistant);
  };

  const handleChatbotReady = () => {
    setChatbotLoading(false);
    setChatbotReady(true);
  };

  return (
    <>
      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-3">
        
        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className={`group w-10 h-10 flex items-center justify-center border border-notebook-border bg-notebook-bg/90 backdrop-blur-sm hover:border-blueprint/30 transition-all duration-500 hover:scale-105 ${
            showScrollTop 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp 
            size={18} 
            className="text-ink-muted group-hover:text-ink-primary group-hover:-translate-y-0.5 transition-all duration-300" 
          />
        </button>

        {/* AI Assistant Toggle */}
        <button
          onClick={handleChatbotToggle}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`group relative w-11 h-11 flex items-center justify-center transition-all duration-500 hover:scale-105 ${
            showAIAssistant
              ? 'bg-blueprint border border-blueprint text-white'
              : 'border border-notebook-border bg-notebook-bg/90 backdrop-blur-sm hover:border-blueprint/30'
          }`}
          aria-label={showAIAssistant ? 'Close AI Assistant' : 'Open AI Assistant'}
        >
          {chatbotLoading ? (
            <Loader2 size={20} className="text-ink-muted animate-spin" />
          ) : (
            <>
              {shouldPulse && (
                <span className="absolute inset-0 border border-blueprint/40 animate-ping" />
              )}
              
              <Bot 
                size={20} 
                className={`transition-all duration-300 ${
                  showAIAssistant 
                    ? 'text-white' 
                    : 'text-ink-muted group-hover:text-blueprint'
                }`}
              />
              
              {shouldPulse && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
              )}
            </>
          )}
        </button>
      </div>

      {/* AI Chatbot - Lazy loaded */}
      {showAIAssistant && (
        <Suspense fallback={
          <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[90vw] sm:w-96 h-[400px] bg-notebook-bg border border-notebook-border shadow-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={24} className="text-blueprint animate-spin" />
              <p className="text-ink-muted text-xs font-mono">Retrieving archive...</p>
            </div>
          </div>
        }>
          <AIChatbotLazy 
            isOpen={showAIAssistant} 
            onClose={() => setShowAIAssistant(false)}
            onReady={handleChatbotReady}
          />
        </Suspense>
      )}
    </>
  );
};

export default FloatingActionButtons;
