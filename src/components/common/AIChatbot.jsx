import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  AlertCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { GEMINI_CONFIG, PORTFOLIO_CONTEXT } from '../../config/gemini';

const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! 👋 I'm Atharv's AI assistant. Feel free to ask me anything about his skills, projects, or experience!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
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
      // Check if API key exists
      if (!GEMINI_CONFIG.apiKey) {
        throw new Error('AI assistant is not configured. API key missing.');
      }

      // Build conversation history for context
      // Gemini requires first message to be 'user' role, so skip
      // any assistant messages before the first user message
      const allMessages = [...messages, { role: 'user', content: input.trim() }];
      
      const firstUserIndex = allMessages.findIndex(msg => msg.role === 'user');
      const relevantMessages = allMessages
        .slice(firstUserIndex)
        .filter(msg => !msg.isError) // skip error bubbles
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      // Gemini requires alternating roles — merge consecutive same-role messages
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

      // Try with primary model, retry with backoff, then fallback model
      const models = [GEMINI_CONFIG.model, 'gemini-2.5-flash-lite'];
      let lastError = null;

      for (const model of models) {
        for (let attempt = 0; attempt < 3; attempt++) {
          if (attempt > 0) {
            // Exponential backoff: 1s, 2s
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
              return; // Success — exit entirely
            } else {
              lastError = new Error('Invalid response format');
              break; // Don't retry format errors
            }
          }

          const errorData = await response.json().catch(() => ({}));
          console.error(`Gemini API error (${model}, attempt ${attempt + 1}):`, response.status, errorData);

          if (response.status === 429) {
            lastError = new Error('Rate limit hit — retrying...');
            continue; // Retry this model
          } else if (response.status === 400) {
            lastError = new Error('Bad request — check API key and model name.');
            break; // Try next model
          } else if (response.status === 403 || response.status === 401) {
            throw new Error('API key is invalid or expired.');
          } else if (response.status === 404) {
            lastError = new Error(`Model "${model}" not found.`);
            break; // Try next model
          } else {
            lastError = new Error(`API error: ${response.status}`);
            break;
          }
        }
      }

      // If we exhausted all retries and models
      throw lastError || new Error('Failed to get a response. Please try again.');
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `⚠️ ${err.message}\n\nFeel free to use the Contact section to reach Atharv directly!`,
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

  // Quick suggestions
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
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Chatbot</h3>
              <p className="text-xs text-white/70">
                {isLoading ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
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
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      message.role === 'user'
                        ? 'bg-cyan-600 text-white rounded-tr-none'
                        : message.isError
                          ? 'bg-red-500/20 text-red-200 rounded-tl-none'
                          : 'bg-white/10 text-gray-200 rounded-tl-none'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-cyan-200' : 'text-gray-500'
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-purple-400" />
                        <span className="text-sm text-gray-400">Thinking...</span>
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
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mt-2 text-center">
                Powered by Google Gemini ✨
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatbot;