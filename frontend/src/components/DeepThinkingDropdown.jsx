import React, { useState, useRef, useEffect } from 'react';
import { Brain, Zap, GraduationCap, MessageSquare, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MODES = [
  { id: 'normal', label: 'Normal mode', icon: <MessageSquare size={16} />, description: 'Standard ThinkVault assistant' },
  { id: 'deep', label: 'Deep thinking', icon: <Brain size={16} />, description: 'Slower, more detailed analysis' },
  { id: 'quick', label: 'Quick answer', icon: <Zap size={16} />, description: 'Faster, concise responses' },
  { id: 'study', label: 'Study mode', icon: <GraduationCap size={16} />, description: 'Structured for optimal learning' },
];

const DeepThinkingDropdown = ({ activeMode, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedMode = MODES.find(m => m.id === activeMode) || MODES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-zyricon-border text-zyricon-textMuted hover:text-zyricon-text hover:bg-white/10 transition-all text-sm font-medium"
      >
        <span className="text-zyricon-purple">{selectedMode.icon}</span>
        <span>{selectedMode.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-zyricon-card border border-zyricon-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2 space-y-1">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onChange(mode.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${
                    activeMode === mode.id 
                      ? 'bg-zyricon-purple/10 text-zyricon-purple border border-zyricon-purple/20' 
                      : 'text-zyricon-textMuted hover:bg-white/5 hover:text-zyricon-text border border-transparent'
                  }`}
                >
                  <div className={`mt-0.5 ${activeMode === mode.id ? 'text-zyricon-purple' : 'text-zyricon-textMuted'}`}>
                    {mode.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{mode.label}</div>
                    <div className="text-[11px] opacity-60 leading-tight">{mode.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeepThinkingDropdown;
