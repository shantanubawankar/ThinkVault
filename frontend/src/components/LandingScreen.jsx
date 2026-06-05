import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ChevronRight } from 'lucide-react';

const LandingScreen = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-screen bg-buddy-black text-white flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="#D9FF00" strokeWidth="0.1">
            <animate attributeName="d" dur="10s" repeatCount="indefinite"
              values="M0,50 Q25,30 50,50 T100,50; M0,50 Q25,70 50,50 T100,50; M0,50 Q25,30 50,50 T100,50" />
          </path>
          <path d="M0,40 Q25,20 50,40 T100,40" fill="none" stroke="#D9FF00" strokeWidth="0.05">
             <animate attributeName="d" dur="12s" repeatCount="indefinite"
              values="M0,40 Q25,20 50,40 T100,40; M0,40 Q25,60 50,40 T100,40; M0,40 Q25,20 50,40 T100,40" />
          </path>
        </svg>
      </div>

      {/* Top Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center gap-1"
      >
        <div className="bg-buddy-lime text-buddy-black px-4 py-1.5 rounded-full text-sm font-bold tracking-tight">
          ThinkVault
        </div>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
          Created by Shantanu Developer
        </p>
      </motion.div>

      {/* Mascot Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center">
        {/* Glow Effect */}
        <div className="absolute w-64 h-64 bg-buddy-lime/20 blur-[80px] rounded-full" />
        
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="relative z-10 w-48 h-48 bg-buddy-lime rounded-[60px] flex items-center justify-center shadow-[0_0_50px_rgba(217,255,0,0.3)]"
        >
          <Bot size={80} className="text-buddy-black" strokeWidth={1.5} />
          {/* Decorative Mouth/Face */}
          <div className="absolute bottom-12 w-12 h-1.5 bg-buddy-black/20 rounded-full" />
        </motion.div>
      </div>

      {/* Footer Section */}
      <div className="z-10 w-full max-w-sm text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-medium tracking-tight"
        >
          How may I help<br />you today!
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onGetStarted}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-white text-buddy-black py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
        >
          Get Started
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default LandingScreen;
