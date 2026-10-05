import React, { useState, useRef, lazy, Suspense } from 'react';
import { Bot, Loader2 } from 'lucide-react';

const AIChatbotLazy = lazy(() => import('./AIChatbot'));

const FloatingActionButtons = ({ showAIAssistant, setShowAIAssistant }) => {
  const [chatbotLoading, setChatbotLoading] = useState(false);
  const [chatbotReady, setChatbotReady] = useState(false);
  const launcherRef = useRef(null);

  // Closing from inside the panel (its close button or Escape) returns focus to
  // the launcher, so keyboard users are not left on a removed element.
  const closeAssistant = () => {
    setShowAIAssistant(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

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
      {/* Back to top lives in the footer on every route; this is the assistant only. */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-3">
        <button
          ref={launcherRef}
          type="button"
          onClick={handleChatbotToggle}
          aria-label="AI Assistant"
          aria-expanded={showAIAssistant}
          className={`group relative flex h-11 w-11 items-center justify-center border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
            showAIAssistant
              ? 'border-accent bg-accent text-notebook-bg'
              : 'border-notebook-border-light bg-notebook-bg hover:border-accent'
          }`}
        >
          {chatbotLoading ? (
            <Loader2 size={20} className="text-ink-muted motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <Bot
              size={20}
              aria-hidden="true"
              className={`transition-colors duration-200 ${
                showAIAssistant ? 'text-notebook-bg' : 'text-ink-muted group-hover:text-accent'
              }`}
            />
          )}
        </button>
      </div>

      {/* AI Chatbot - Lazy loaded */}
      {showAIAssistant && (
        <Suspense fallback={
          <div role="status" className="chat-panel fixed bottom-24 right-4 sm:right-6 z-50 flex h-[400px] w-[90vw] items-center justify-center border border-notebook-border-light bg-notebook-bg shadow-lg sm:w-96">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={24} className="text-accent motion-safe:animate-spin" aria-hidden="true" />
              <p className="text-small text-ink-muted">Loading the assistant…</p>
            </div>
          </div>
        }>
          <AIChatbotLazy
            isOpen={showAIAssistant}
            onClose={closeAssistant}
            onReady={handleChatbotReady}
          />
        </Suspense>
      )}
    </>
  );
};

export default FloatingActionButtons;
