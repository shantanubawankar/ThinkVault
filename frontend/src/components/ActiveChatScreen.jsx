import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Keyboard, Send, Loader2, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ActiveChatScreen = ({ onBack, onSendMessage, messages, isLoading }) => {
  const [isTextInput, setIsTextInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, transcript, isListening, isLoading]);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      if (transcript.trim()) {
        onSendMessage(transcript);
        setTranscript('');
      }
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      setIsTextInput(false);
    }
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      setIsTextInput(false);
    }
  };

  const assistantMessages = messages.filter(m => m.role === 'assistant');
  const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();

  const displayContent = isListening 
    ? (transcript || "Listening...") 
    : (isLoading ? "Thinking..." : (lastAssistantMessage?.content || lastUserMessage?.content || "How may I help you today?"));

  return (
    <div className="h-screen bg-buddy-black text-white p-6 flex flex-col items-center justify-between py-10 overflow-hidden">
      {/* Header Badge */}
      <div className="flex flex-col items-center gap-1 z-20">
        <div className="bg-buddy-lime text-buddy-black px-4 py-1.5 rounded-full text-sm font-bold">
          ThinkVault
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-buddy-lime" />
            <span className="text-xs text-white/50">Online</span>
          </div>
          <p className="text-[8px] text-white/20 uppercase tracking-[0.2em]">by Shantanu Developer</p>
        </div>
      </div>

      {/* Iridescent Sphere Section - Shrunk to give more room for text */}
      <div className="relative flex-[0.6] flex items-center justify-center w-full min-h-[180px]">
        {/* Iridescent Glow */}
        <motion.div 
          animate={{ 
            scale: isListening ? [1, 1.4, 1] : [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ 
            duration: isListening ? 2 : 10, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-48 h-48 rounded-full opacity-30 blur-[40px] bg-gradient-to-tr from-buddy-lime via-buddy-purple to-buddy-pink"
        />
        
        {/* Main Sphere */}
        <motion.div
          animate={{ 
            borderRadius: ["40% 60% 60% 40% / 40% 40% 60% 60%", "60% 40% 40% 60% / 60% 60% 40% 40%", "40% 60% 60% 40% / 40% 40% 60% 60%"],
            scale: isLoading ? [1, 0.9, 1] : 1
          }}
          transition={{ 
            duration: isLoading ? 1.5 : 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10 w-40 h-40 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center"
        >
          {/* Internal Swirls */}
          <div className="absolute inset-0 bg-gradient-to-br from-buddy-lime/30 via-buddy-purple/30 to-buddy-pink/30 mix-blend-overlay animate-pulse" />
          {isLoading && <Loader2 className="animate-spin text-white/50" size={32} />}
        </motion.div>
      </div>

      {/* Text Content - Fixed Height with Scroll */}
      <div className="w-full max-w-lg flex flex-col flex-1 overflow-hidden px-2 mb-6">
        <AnimatePresence mode="wait">
          {!isTextInput ? (
            <motion.div 
              key="display-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              ref={scrollRef}
              className="flex-1 overflow-y-auto scrollbar-hide pr-2"
            >
              <div className="text-lg font-medium tracking-tight leading-relaxed text-white/90 prose prose-invert prose-buddy">
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => <h2 className="text-buddy-lime text-xl font-bold mt-4 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-buddy-purple text-lg font-bold mt-3 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-buddy-lime font-bold" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="ml-2" {...props} />,
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="input-text"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full"
            >
              <textarea
                autoFocus
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-buddy-dark border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-buddy-lime/50 resize-none h-32"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendText();
                  }
                }}
              />
              <button 
                onClick={handleSendText}
                className="absolute bottom-4 right-4 p-2 bg-buddy-lime text-buddy-black rounded-full shadow-lg"
              >
                <Send size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-sm px-4 z-20">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsTextInput(!isTextInput);
            if (isListening) toggleVoice();
          }}
          className={`w-12 h-12 rounded-full border transition-colors flex items-center justify-center ${isTextInput ? 'bg-buddy-purple text-buddy-black border-buddy-purple' : 'bg-buddy-dark border-white/10 text-buddy-purple'}`}
        >
          <Keyboard size={20} />
        </motion.button>

        <div className="relative">
          {/* Concentric Circles */}
          {isListening && (
            <>
              <div className="absolute inset-0 -m-4 rounded-full border border-buddy-lime/40 animate-ping" />
              <div className="absolute inset-0 -m-8 rounded-full border border-buddy-lime/20 animate-pulse" />
            </>
          )}
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleVoice}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-buddy-lime text-buddy-black shadow-[0_0_30px_rgba(217,255,0,0.4)]'}`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </motion.button>
        </div>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-buddy-dark border border-white/10 flex items-center justify-center text-white/50"
        >
          <X size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default ActiveChatScreen;
