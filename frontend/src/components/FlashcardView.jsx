import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, Zap, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardView = ({ cards, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([...cards]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + shuffledCards.length) % shuffledCards.length);
    }, 150);
  };

  const handleShuffle = () => {
    const newCards = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(newCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const progress = ((currentIndex + 1) / shuffledCards.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        
        <div className="absolute -top-16 left-0 right-0 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-light dark:bg-accent-dark text-white shadow-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Flashcard Session</h2>
              <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest opacity-60">
                Card {currentIndex + 1} of {shuffledCards.length}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-red-500 hover:border-red-500 transition-all shadow-md group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="w-full h-4 bg-white/30 dark:bg-white/5 rounded-full mb-12 overflow-hidden ring-1 ring-border-light/50 dark:ring-border-dark/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-accent-light to-primary-light shadow-lg"
          />
        </div>

        <div 
          className="relative w-full h-[400px] perspective-1000 cursor-pointer group"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-full preserve-3d relative duration-500"
          >
            {/* Front Side */}
            <div className="absolute inset-0 backface-hidden w-full h-full p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-card-dark rounded-[2.5rem] shadow-2xl border-2 border-border-light dark:border-border-dark group-hover:border-primary-light/50 dark:group-hover:border-primary-dark/50 transition-colors ring-1 ring-black/5">
              <span className="absolute top-8 left-8 text-xs font-bold text-primary-light dark:text-primary-dark uppercase tracking-[0.2em] opacity-40">Question</span>
              <p className="text-2xl md:text-3xl font-bold leading-tight text-text-primary-light dark:text-text-primary-dark">
                {shuffledCards[currentIndex].question}
              </p>
              <p className="absolute bottom-8 text-xs font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-[0.1em] opacity-50 flex items-center gap-2">
                <RotateCcw className="w-3 h-3" /> Tap to reveal answer
              </p>
            </div>

            {/* Back Side */}
            <div 
              className="absolute inset-0 backface-hidden w-full h-full p-12 flex flex-col items-center justify-center text-center bg-primary-light dark:bg-primary-dark rounded-[2.5rem] shadow-2xl border-2 border-primary-light/50 dark:border-primary-dark/50 [transform:rotateY(180deg)] ring-1 ring-black/10"
            >
              <span className="absolute top-8 left-8 text-xs font-bold text-white uppercase tracking-[0.2em] opacity-40">Answer</span>
              <p className="text-2xl md:text-3xl font-bold leading-tight text-white">
                {shuffledCards[currentIndex].answer}
              </p>
              <p className="absolute bottom-8 text-xs font-bold text-white uppercase tracking-[0.1em] opacity-60 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> You've got this!
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-6 mt-12">
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="p-5 rounded-3xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-all shadow-lg active:scale-90"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); handleShuffle(); }}
            className="px-8 py-4 rounded-3xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-bold hover:bg-sidebar-light dark:hover:bg-sidebar-dark transition-all shadow-lg flex items-center gap-3 active:scale-95"
          >
            <LayoutGrid className="w-5 h-5 text-accent-light" />
            Shuffle
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="p-5 rounded-3xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-all shadow-lg active:scale-90"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default FlashcardView;
