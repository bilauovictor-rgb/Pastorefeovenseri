import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, X, Volume2, Loader2 } from 'lucide-react';

// Define types for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

const SpeechRecognition = (window as unknown as IWindow).SpeechRecognition || (window as unknown as IWindow).webkitSpeechRecognition;

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigate = useNavigate();
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!SpeechRecognition || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    synthRef.current = window.speechSynthesis;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setResponse('');
    };

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      processCommand(text);
    };

    recognitionRef.current.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setResponse('Microphone access denied. Please allow microphone permissions.');
      } else if (event.error === 'network') {
        setResponse('Network error. Please check your internet connection or browser settings.');
      } else if (event.error === 'no-speech') {
        setResponse('I didn\'t hear anything. Please tap the microphone and try again.');
      } else {
        setResponse('Sorry, I didn\'t catch that. Please try again.');
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [navigate]);

  const processCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    let reply = '';
    let route = '';

    if (lowerText.includes('who is') || lowerText.includes('about') || lowerText.includes('biography')) {
      reply = "Navigating to Pastor Efe's biography.";
      route = '/about';
    } else if (lowerText.includes('sermon') || lowerText.includes('watch') || lowerText.includes('listen') || lowerText.includes('resource')) {
      reply = "Taking you to the resources and sermons.";
      route = '/resources/sermons';
    } else if (lowerText.includes('contact') || lowerText.includes('partner') || lowerText.includes('give')) {
      reply = "Opening the contact and partnership page.";
      route = '/contact';
    } else if (lowerText.includes('home') || lowerText.includes('start')) {
      reply = "Going to the home page.";
      route = '/';
    } else if (lowerText.includes('service') || lowerText.includes('ministry')) {
      reply = "Exploring the ministry arms.";
      route = '/services';
    } else {
      reply = `I heard you say "${text}". Try asking about sermons, biography, or contacting us.`;
    }

    setResponse(reply);
    speak(reply);

    if (route) {
      setTimeout(() => {
        navigate(route);
        setIsOpen(false);
      }, 2000);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (synthRef.current) synthRef.current.cancel();
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Recognition already started", e);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <button 
          className="w-14 h-14 rounded-full bg-bg-dark-secondary border border-border-dark-soft text-text-on-dark-muted flex items-center justify-center shadow-lg cursor-not-allowed"
          title="Voice not supported on this device"
        >
          <MicOff className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[5.5rem] right-6 z-50 flex flex-col items-end">
      {/* UI Panel */}
      {isOpen && (
        <div className="mb-4 w-80 bg-bg-dark-secondary border border-border-gold-soft rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-border-dark-soft flex justify-between items-center bg-[#1A0B2E] text-text-on-dark-primary">
            <h3 className="font-display font-bold text-accent-gold-primary flex items-center gap-2 text-sm">
              <Volume2 className="w-4 h-4" /> Voice Assistant
            </h3>
            <button 
              onClick={() => {
                setIsOpen(false);
                if (isListening) recognitionRef.current?.stop();
                if (synthRef.current) synthRef.current.cancel();
              }}
              className="text-text-on-dark-secondary hover:text-text-on-dark-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5 space-y-4 min-h-[120px] flex flex-col justify-center">
            {isListening ? (
              <div className="flex flex-col items-center justify-center text-accent-gold-secondary space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-accent-gold-soft flex items-center justify-center animate-pulse">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-accent-gold-secondary animate-ping opacity-20"></div>
                </div>
                <p className="text-sm font-medium">Listening...</p>
              </div>
            ) : (
              <>
                {transcript && (
                  <div className="bg-bg-dark-primary p-3 rounded-lg border border-border-dark-soft">
                    <p className="text-xs text-text-on-dark-muted mb-1 font-medium">You said:</p>
                    <p className="text-sm text-text-on-dark-primary">"{transcript}"</p>
                  </div>
                )}
                
                {response && (
                  <div className="bg-accent-purple-soft/10 p-3 rounded-lg border border-accent-purple-soft/20">
                    <p className="text-xs text-accent-lavender-soft mb-1 font-medium flex items-center gap-1">
                      {isSpeaking && <Loader2 className="w-3 h-3 animate-spin" />}
                      Assistant:
                    </p>
                    <p className="text-sm text-text-on-dark-primary">{response}</p>
                  </div>
                )}

                {!transcript && !response && (
                  <p className="text-center text-sm text-text-on-dark-secondary">
                    Tap the microphone and say "Who is Pastor Efe?" or "Watch sermon".
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
            toggleListen();
          } else {
            toggleListen();
          }
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-saas-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 text-text-on-dark-primary hover:bg-red-600 scale-110' 
            : 'bg-accent-gold-primary text-bg-dark-primary hover:bg-accent-gold-secondary hover:scale-105'
        }`}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>
    </div>
  );
}
