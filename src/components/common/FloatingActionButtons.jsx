import React from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';

const FloatingActionButtons = ({ 
  scrollY, 
  showAIAssistant, 
  setShowAIAssistant 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 sm:bottom-8 right-4 sm:right-8 z-40 flex flex-col gap-3 sm:gap-4">
      {/* AI Assistant Button */}
      <button
        onClick={() => setShowAIAssistant(!showAIAssistant)}
        className="relative p-3 sm:p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-700 hover:scale-110 group"
        aria-label="AI Assistant"
      >
        <MessageCircle size={20} className="sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-500" />
        {showAIAssistant && (
          <div className="absolute bottom-full right-0 mb-4 w-56 sm:w-64 p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animate-fade-in">
            <p className="text-xs sm:text-sm text-gray-300">Ask me about my projects!</p>
          </div>
        )}
      </button>

      {/* Scroll to Top Button */}
      {scrollY > 500 && (
        <button
          onClick={scrollToTop}
          className="p-3 sm:p-4 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-700 hover:scale-110 group animate-fade-in"
          aria-label="Scroll to top"
        >
          <ChevronDown size={20} className="sm:w-6 sm:h-6 rotate-180 group-hover:-translate-y-1 transition-transform duration-500" />
        </button>
      )}
    </div>
  );
};

export default FloatingActionButtons;
