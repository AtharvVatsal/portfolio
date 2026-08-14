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
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
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
    <div 
      className={`fixed bottom-24 right-4 sm:right-6 z-50 transition-all duration-300 ${
        isMinimized ? 'w-72' : 'w-[90vw] sm:w-96'
      }`}
    >
      {/* Chat Container */}
      <div className="bg-notebook-bg border border-notebook-border shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-notebook-bg border-b border-notebook-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-blueprint/30 flex items-center justify-center">
              <Bot size={18} className="text-blueprint" />
            </div>
            <div>
              <h3 className="font-mono text-sm text-ink-primary">AI Terminal</h3>
              <p className="text-[10px] font-mono text-ink-faint">
                {isLoading ? 'Processing...' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 text-ink-faint hover:text-ink-primary transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-faint hover:text-ink-primary transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh] min-h-[300px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-7 h-7 flex items-center justify-center text-xs font-mono ${
                      message.role === 'user' 
                        ? 'border border-blueprint/30 text-blueprint' 
                        : 'border border-notebook-border text-ink-faint'
                    }`}>
                      {message.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-blueprint/10 border border-blueprint/20 text-ink-primary'
                        : message.isError
                          ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                          : 'bg-surface border border-notebook-border text-ink-secondary'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-[10px] mt-1 font-mono ${
                        message.role === 'user' ? 'text-blueprint/60' : 'text-ink-faint'
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
                    <div className="flex-shrink-0 w-7 h-7 border border-notebook-border flex items-center justify-center text-ink-faint">
                      <Bot size={14} />
                    </div>
                    <div className="border border-notebook-border px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-blueprint" />
                        <span className="text-sm text-ink-muted font-mono">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-ink-faint font-mono mb-2">Quick queries:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="text-[11px] px-2.5 py-1 font-mono text-ink-muted border border-notebook-border hover:border-blueprint/30 hover:text-ink-primary transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-notebook-border">
              <div className="flex items-center gap-2">
                <span className="text-ink-faint font-mono text-xs hidden sm:inline">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent border border-notebook-border px-3 py-2 text-sm font-mono text-ink-primary placeholder-ink-faint focus:outline-none focus:border-blueprint/40 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-blueprint text-white hover:bg-blueprint/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
              
              <p className="text-[10px] text-ink-faint font-mono mt-2 text-center">
                Powered by Google Gemini
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatbot;
