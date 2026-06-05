import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Square, 
  X, 
  FileText, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DeepThinkingDropdown from './DeepThinkingDropdown';

const ChatInput = ({ onSendMessage, onUpload, isLoading, isUploading, activeMode, onModeChange, onStop }) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Voice Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const handleSend = () => {
    if ((input.trim() || files.length > 0) && !isLoading) {
      // If there are files, we should probably upload them first or send them with the message
      // For now, let's follow the existing pattern where handleUpload is separate
      if (files.length > 0) {
        onUpload(files.map(f => f.file));
        setFiles([]);
      }
      
      if (input.trim()) {
        onSendMessage(input.trim());
        setInput('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setFiles(prev => [...prev, ...newFiles]);
    e.target.value = null; // Reset input
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pb-6">
      <div className="relative flex flex-col bg-zyricon-card rounded-[24px] border border-zyricon-border focus-within:border-zyricon-purple/50 transition-all duration-300 shadow-2xl overflow-hidden glow-focus">
        
        {/* File Chips */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 p-3 pb-0 border-b border-white/5"
            >
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1.5 rounded-xl group"
                >
                  {file.preview ? (
                    <img src={file.preview} alt="" className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <FileText size={14} className="text-zyricon-purple" />
                  )}
                  <span className="text-xs text-zyricon-textMuted max-w-[120px] truncate">{file.name}</span>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-0.5 hover:bg-white/10 rounded-md transition-colors text-zyricon-textMuted hover:text-zyricon-text"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 p-2 px-3">
          <textarea
            ref={textareaRef}
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you?"
            className="flex-1 bg-transparent resize-none border-0 focus:ring-0 py-3 text-zyricon-text placeholder:text-zyricon-textMuted text-[15px] min-h-[44px] max-h-[200px] smooth-textarea"
          />
          
          <div className="flex items-center gap-1 mb-1">
            <button
              onClick={toggleRecording}
              className={`p-2.5 rounded-full transition-all ${
                isRecording 
                  ? 'bg-red-500/20 text-red-500 animate-pulse' 
                  : 'text-zyricon-textMuted hover:text-zyricon-text hover:bg-white/5'
              }`}
            >
              <Mic size={20} />
            </button>
            
            <button
              onClick={isLoading ? onStop : handleSend}
              disabled={(!input.trim() && files.length === 0) && !isLoading}
              className={`p-2.5 rounded-full transition-all ${
                (!input.trim() && files.length === 0) && !isLoading
                  ? 'bg-zyricon-bg text-zyricon-textMuted cursor-not-allowed'
                  : isLoading
                    ? 'bg-zyricon-text text-zyricon-bg hover:scale-105 active:scale-95'
                    : 'bg-gradient-to-tr from-zyricon-purple to-zyricon-purpleLight text-white shadow-lg shadow-zyricon-purple/20 hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <Square size={20} fill="currentColor" />
              ) : (
                <Send size={20} className="ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-t border-zyricon-border">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zyricon-textMuted hover:text-zyricon-text hover:bg-white/5 transition-all text-xs font-medium"
            >
              <Paperclip size={14} />
              <span>Attach</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              className="hidden" 
              accept=".pdf,.docx,.pptx,image/*"
            />
            
            <DeepThinkingDropdown 
              activeMode={activeMode} 
              onChange={onModeChange} 
            />
          </div>
          
          <div className="text-[10px] text-zyricon-textMuted font-medium uppercase tracking-wider px-2">
            {input.length} / 4000
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-center mt-3 text-zyricon-textMuted font-medium uppercase tracking-widest opacity-60">
        ThinkVault AI can make mistakes. Verify important info.
      </p>
    </div>
  );
};

export default ChatInput;
