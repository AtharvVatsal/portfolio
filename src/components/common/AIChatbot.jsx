import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { GEMINI_CONFIG, PORTFOLIO_CONTEXT } from '../../config/gemini';

const AIChatbot = ({ isOpen, onClose, onReady }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm Atharv's AI assistant. Feel free to ask me anything about his skills, projects, or experience!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  useEffect(() => {
    // Scroll only the message list. scrollIntoView would also scroll every scrollable
    // ancestor, including the height-capped panel, pushing its header out of view.
    const list = messagesRef.current;
    list?.scrollTo({ top: list.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!GEMINI_CONFIG.apiKey) {
        throw new Error('AI assistant is not configured. API key missing.');
      }

      const allMessages = [...messages, { role: 'user', content: input.trim() }];
      
      const firstUserIndex = allMessages.findIndex(msg => msg.role === 'user');
      const relevantMessages = allMessages
        .slice(firstUserIndex)
        .filter(msg => !msg.isError)
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      const conversationHistory = relevantMessages.reduce((acc, msg) => {
        if (acc.length > 0 && acc[acc.length - 1].role === msg.role) {
          acc[acc.length - 1].parts[0].text += '\n' + msg.parts[0].text;
        } else {
          acc.push(msg);
        }
        return acc;
      }, []);

      const requestBody = JSON.stringify({
        contents: conversationHistory,
        systemInstruction: {
          parts: [{ text: PORTFOLIO_CONTEXT }]
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      });

      const models = [GEMINI_CONFIG.model, 'gemini-2.5-flash-lite'];
      let lastError = null;

      for (const model of models) {
        for (let attempt = 0; attempt < 3; attempt++) {
          if (attempt > 0) {
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
          }

          const response = await fetch(
            `${GEMINI_CONFIG.apiUrl}/${model}:generateContent?key=${GEMINI_CONFIG.apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody,
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
              const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: data.candidates[0].content.parts[0].text,
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, assistantMessage]);
              return;
            } else {
              lastError = new Error('Invalid response format');
              break;
            }
          }

          const errorData = await response.json().catch(() => ({}));
          console.error(`Gemini API error (${model}, attempt ${attempt + 1}):`, response.status, errorData);

          if (response.status === 429) {
            lastError = new Error('Rate limit hit — retrying...');
            continue;
          } else if (response.status === 400) {
            lastError = new Error('Bad request — check API key and model name.');
            break;
          } else if (response.status === 403 || response.status === 401) {
            throw new Error('API key is invalid or expired.');
          } else if (response.status === 404) {
            lastError = new Error(`Model "${model}" not found.`);
            break;
          } else {
            lastError = new Error(`API error: ${response.status}`);
            break;
          }
        }
      }

      throw lastError || new Error('Failed to get a response. Please try again.');
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `${err.message}\n\nFeel free to use the Contact section to reach Atharv directly!`,
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const suggestions = [
    "Who Is Atharv?",
    "What are Atharv's skills?",
    "Tell me about his projects",
    "How can I contact him?",
  ];

  if (!isOpen) return null;

  return (
    // A non-modal dialog: the page stays usable behind it. Escape closes it from
    // anywhere inside (focus then returns to the launcher, see FloatingActionButtons).
    <div
      role="dialog"
      aria-label="AI assistant"
      onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } }}
      className={`fixed bottom-24 right-4 sm:right-6 z-50 transition-all duration-300 ${
        isMinimized ? 'w-72' : 'w-[90vw] sm:w-96'
      }`}
    >
      {/* Chat Container: never taller than the visible viewport (small phones,
          landscape, on-screen keyboard); the message list is what gives way. */}
      <div className="chat-panel bg-notebook-bg border border-notebook-border-light shadow-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="shrink-0 bg-notebook-surface-alt border-b border-notebook-border py-1 pl-3 pr-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="w-9 h-9 border border-notebook-border flex items-center justify-center">
              <Bot size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="text-small text-ink-primary">AI Terminal</h3>
              <p className="font-mono text-meta text-ink-faint">
                {isLoading ? 'Thinking…' : 'Powered by Google Gemini'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              aria-expanded={!isMinimized}
              type="button"
              className="flex h-11 w-11 items-center justify-center text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              {isMinimized ? <Maximize2 size={16} aria-hidden="true" /> : <Minimize2 size={16} aria-hidden="true" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close chat"
              type="button"
              className="flex h-11 w-11 items-center justify-center text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div ref={messagesRef} className="flex-[0_1_300px] min-h-0 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div aria-hidden="true" className={`flex-shrink-0 w-7 h-7 flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'border border-accent/50 text-accent' 
                        : 'border border-notebook-border text-ink-faint'
                    }`}>
                      {message.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-accent/10 border border-accent/40 text-ink-primary'
                        : message.isError
                          ? 'border border-error/50 text-error'
                          : 'bg-notebook-surface border border-notebook-border text-ink-secondary'
                    }`}>
                      <p className="text-small whitespace-pre-wrap">{message.content}</p>
                      <p className={`mt-1 font-mono text-meta ${
                        message.role === 'user' ? 'text-accent' : 'text-ink-faint'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div aria-hidden="true" className="flex-shrink-0 w-7 h-7 border border-notebook-border flex items-center justify-center text-ink-faint">
                      <Bot size={14} />
                    </div>
                    <div className="border border-notebook-border px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} aria-hidden="true" className="motion-safe:animate-spin text-accent" />
                        <span className="text-small text-ink-muted">Thinking…</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && !isLoading && (
              <div className="shrink-0 px-4 pb-2 [@media(max-height:519px)]:hidden">
                <p className="meta-label mb-2">Quick queries</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setInput(suggestion)}
                      className="min-h-9 px-2.5 py-1 text-small text-ink-muted border border-notebook-border hover:border-notebook-border-light hover:text-ink-primary transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="shrink-0 p-3 border-t border-notebook-border">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  aria-label="Message the assistant"
                  placeholder="Ask me anything…"
                  disabled={isLoading}
                  className="min-h-11 min-w-0 flex-1 bg-transparent border border-ink-faint/70 px-3 text-small text-ink-primary placeholder-ink-faint transition-colors duration-200 focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  aria-label="Send message"
                  type="button"
                  disabled={!input.trim() || isLoading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-accent text-ink-primary transition-colors duration-200 hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:border-notebook-border disabled:text-ink-faint disabled:cursor-not-allowed"
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
              
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatbot;
