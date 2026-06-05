import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Paperclip, 
  Settings, 
  Grid, 
  Mic, 
  ArrowUp,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Archive,
  FileText,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LoadingOrb = ({ size = "md" }) => {
  const scale = size === "sm" ? 0.4 : 1;
  
  return (
    <div className="relative flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
      {/* Outer Glowing Aura */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-zyricon-purple via-blue-500 to-pink-500 blur-[40px]"
      />

      {/* Orbiting Rings */}
      {[0, 45, 90, 135].map((rotation, i) => (
        <motion.div
          key={i}
          style={{ rotate: rotation }}
          animate={{ rotate: rotation + 360 }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 rounded-full border border-white/10"
        />
      ))}

      {/* Dotted Orbit */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-56 h-56 rounded-full border border-dashed border-white/20 opacity-40"
      />

      {/* Main Iridescent Sphere */}
      <motion.div
        animate={{ 
          borderRadius: ["40% 60% 60% 40% / 40% 40% 60% 60%", "60% 40% 40% 60% / 60% 60% 40% 40%", "40% 60% 60% 40% / 40% 40% 60% 60%"],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative z-10 w-32 h-32 bg-gradient-to-br from-zyricon-purpleLight via-blue-400 to-pink-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] overflow-hidden"
      >
        {/* Inner Liquid Effect */}
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-white/10" />
      </motion.div>

      {/* Particle Orbiting Dot */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute w-60 h-60"
      >
        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white] absolute top-0 left-1/2 -translate-x-1/2" />
      </motion.div>
    </div>
  );
};

const ChatDashboard = ({ onSendMessage, onUpload, messages, isLoading, isUploading, uploadedFiles, onOpenSettings }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zyricon-bg h-full relative overflow-hidden">
      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        className="hidden" 
        onChange={onFileChange}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
      />

      {/* Top Bar */}
      <div className="h-16 border-b border-zyricon-border flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          {/* Brand/Model indicator */}
          <div className="flex items-center gap-2 text-zyricon-textMuted text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-zyricon-purple animate-pulse" />
            ThinkVault v1.0
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <Settings size={14} />
            <span>Configuration</span>
          </button>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            <ExternalLink size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center relative" ref={scrollRef}>
        <AnimatePresence mode="wait">
          {messages.length === 0 && !isLoading ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              {/* Central Orb Replacement */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <LoadingOrb />
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                Ready to Create Something New?
              </h1>
              
              {/* Quick Actions */}
              <div className="flex gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-zyricon-textMuted hover:text-white">
                  <Paperclip size={14} />
                  Upload Notes
                </button>
                <button 
                  onClick={() => onSendMessage("Can you summarize my uploaded notes?")}
                  className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-zyricon-textMuted hover:text-white"
                >
                  <Sparkles size={14} />
                  Summarize
                </button>
                <button 
                  onClick={() => onSendMessage("Can you create a quiz for me based on these materials?")}
                  className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 text-zyricon-textMuted hover:text-white"
                >
                  <Archive size={14} />
                  Create Quiz
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-3xl space-y-8 pb-32"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-zyricon-purple text-white shadow-lg' : 'bg-zyricon-card border border-zyricon-border text-zyricon-text'}`}>
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/30">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zyricon-card border border-zyricon-border p-6 rounded-2xl flex flex-col items-center gap-4">
                    <LoadingOrb size="sm" />
                    <span className="text-xs text-zyricon-textMuted animate-pulse uppercase tracking-widest font-bold">ThinkVault is thinking...</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Input Bar */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center px-8 z-20">
        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="w-full max-w-3xl flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-zyricon-purple/20 border border-zyricon-purple/30 px-3 py-1.5 rounded-full text-xs text-zyricon-purple font-medium">
                <FileText size={12} />
                <span className="max-w-[100px] truncate">{file.name}</span>
              </div>
            ))}
            {isUploading && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-zyricon-textMuted animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
        )}

        <div className="w-full max-w-3xl bg-zyricon-card/80 backdrop-blur-xl border border-zyricon-border rounded-3xl p-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-zyricon-purple" size={18} />
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isUploading ? "Waiting for upload..." : "Ask Anything..."}
              disabled={isUploading}
              className="flex-1 bg-transparent border-none focus:ring-0 text-zyricon-text placeholder:text-zyricon-textMuted resize-none h-12 py-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-zyricon-textMuted transition-colors">
                <Mic size={18} />
              </button>
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isUploading}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${inputText.trim() && !isUploading ? 'bg-zyricon-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-white/5 text-zyricon-textMuted cursor-not-allowed'}`}
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-white/5 px-2">
            <div className="flex gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 text-xs font-medium text-zyricon-textMuted hover:text-white transition-colors disabled:opacity-50"
              >
                <Paperclip size={14} />
                <span>Attach</span>
              </button>
              <button className="flex items-center gap-2 text-xs font-medium text-zyricon-textMuted hover:text-white transition-colors">
                <Settings size={14} />
                <span>Settings</span>
              </button>
              <button className="flex items-center gap-2 text-xs font-medium text-zyricon-textMuted hover:text-white transition-colors">
                <Grid size={14} />
                <span>Options</span>
              </button>
            </div>
            {isUploading && <span className="text-[10px] text-zyricon-purple animate-pulse uppercase tracking-widest font-bold">Processing Files...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;
