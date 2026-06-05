import React from 'react';
import { motion } from 'framer-motion';

const LoadingOrb = ({ size = "sm" }) => {
  const scale = size === "sm" ? 0.4 : 1;
  
  return (
    <div className="relative flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-zyricon-purple via-zyricon-purpleLight to-pink-500 blur-[20px]"
      />
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
        className="relative z-10 w-12 h-12 bg-gradient-to-br from-zyricon-purple via-zyricon-purpleLight to-pink-400 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay animate-pulse" />
      </motion.div>
    </div>
  );
};

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-4 animate-in fade-in duration-300">
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-zyricon-card text-zyricon-textMuted overflow-hidden">
        <LoadingOrb />
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="px-5 py-4 rounded-[20px] bg-zyricon-card rounded-tl-none border border-zyricon-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-zyricon-purple rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-zyricon-purple rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-zyricon-purple rounded-full animate-bounce"></div>
            </div>
            <span className="text-xs font-bold text-zyricon-textMuted uppercase tracking-widest opacity-60">ThinkVault is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
