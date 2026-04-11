import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

// Type definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! Welcome to Pastor Efe Ovenseri\'s ministry. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  // Store the chat session
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for speech support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        setVoiceError(null);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setVoiceError("I didn't hear anything. Please try again.");
        } else if (event.error === 'network') {
          setVoiceError("Network error. Please check your connection.");
        } else if (event.error === 'not-allowed') {
          setVoiceError("Microphone access denied.");
        } else {
          setVoiceError("Speech recognition failed.");
        }
        
        // Clear error after 3 seconds
        setTimeout(() => setVoiceError(null), 3000);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize chat session
    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a helpful and compassionate assistant for Pastor Efe Ovenseri's ministry website. You provide information about the ministry, sermons, events, and offer spiritual guidance based on Christian principles. Keep your answers concise, respectful, and uplifting.",
        },
      });
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || !isVoiceEnabled) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [isVoiceEnabled]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Stop any current speaking
      if (synthRef.current) synthRef.current.cancel();
      setIsSpeaking(false);
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized");
      }
      
      const response = await chatRef.current.sendMessage({ message: userMessage });
      const modelText = response.text || "I'm sorry, I couldn't process that request.";
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: modelText
      }]);

      // Speak the response if enabled
      speak(modelText);
    } catch (error) {
      console.error("Chat error:", error);
      const errorText = "I apologize, but I'm having trouble connecting right now. Please try again later.";
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: errorText
      }]);
      speak(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-bg-navy-deep rounded-2xl shadow-2xl border border-border-soft w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#1A0B2E] p-4 flex items-center justify-between text-text-on-dark-primary shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-gold-primary flex items-center justify-center shadow-inner">
                  <MessageCircle className="w-5 h-5 text-bg-dark-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-text-on-dark-primary">Ministry Assistant</h3>
                  <p className="text-[10px] text-accent-gold-primary font-bold uppercase tracking-wider">
                    {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {synthRef.current && (
                  <button
                    onClick={() => {
                      const newState = !isVoiceEnabled;
                      setIsVoiceEnabled(newState);
                      if (!newState && synthRef.current) {
                        synthRef.current.cancel();
                        setIsSpeaking(false);
                      }
                    }}
                    className={`p-2 rounded-full transition-colors ${isVoiceEnabled ? 'text-accent-gold-primary bg-white/10' : 'text-text-on-dark-secondary hover:bg-white/10'}`}
                    title={isVoiceEnabled ? "Disable voice" : "Enable voice"}
                  >
                    {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-on-dark-primary"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-midnight">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-accent-gold-primary text-bg-midnight rounded-tr-sm' 
                        : 'bg-bg-navy-soft border border-border-soft text-white rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-navy-soft border border-border-soft p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-accent-gold-primary animate-spin" />
                    <span className="text-xs text-text-muted">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-bg-navy-deep border-t border-border-soft">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={voiceError || (isListening ? "Listening..." : "Ask a question...")}
                    className={`w-full pl-4 pr-10 py-3 bg-bg-midnight border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold-primary focus:border-transparent transition-all ${
                      voiceError ? 'border-red-300 placeholder-red-400' : 'border-border-soft'
                    }`}
                    disabled={isLoading}
                  />
                  {isSpeechSupported && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`absolute right-2 p-1.5 rounded-full transition-colors ${
                        isListening 
                          ? 'bg-red-500 text-text-on-dark-primary animate-pulse' 
                          : 'text-text-on-light-secondary hover:bg-bg-light-secondary'
                      }`}
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-accent-gold-primary text-bg-dark-primary rounded-full hover:bg-accent-gold-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-accent-gold-primary text-bg-dark-primary rounded-full shadow-lg flex items-center justify-center hover:bg-accent-gold-secondary transition-colors z-50"
        aria-label="Toggle chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
