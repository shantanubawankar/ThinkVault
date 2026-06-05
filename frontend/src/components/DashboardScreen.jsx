import React from 'react';
import { motion } from 'framer-motion';
import { Menu, ArrowUpRight, MessageSquare, Image, MoreVertical, Mic } from 'lucide-react';

const DashboardScreen = ({ onStartChat }) => {
  const historyItems = [
    { id: 1, text: "I need some UI inspiration for dark...", icon: <Mic size={16} />, color: "buddy-lime" },
    { id: 2, text: "Show me some color palettes for AI...", icon: <MessageSquare size={16} />, color: "buddy-purple" },
    { id: 3, text: "What are the best mobile apps 2023...", icon: <Image size={16} />, color: "buddy-pink" },
  ];

  return (
    <div className="min-h-screen bg-buddy-black text-white p-6 space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-full bg-buddy-dark border border-white/10 flex items-center justify-center">
          <Menu size={20} />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold tracking-tight">ThinkVault</p>
          <p className="text-[9px] text-white/30 uppercase tracking-widest">by Shantanu Developer</p>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maddy" alt="avatar" />
        </div>
      </div>

      {/* Hero Text */}
      <h1 className="text-3xl font-medium tracking-tight">
        How may I help<br />you today?
      </h1>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Large Card */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => onStartChat('talk')}
          className="col-span-1 row-span-2 bg-buddy-lime text-buddy-black p-6 rounded-[32px] flex flex-col justify-between aspect-[3/4]"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full border border-buddy-black/20 flex items-center justify-center">
              <Mic size={20} />
            </div>
            <ArrowUpRight size={20} />
          </div>
          <h2 className="text-3xl font-bold leading-tight">Talk<br />with Bot</h2>
        </motion.div>

        {/* Small Cards */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => onStartChat('chat')}
          className="bg-buddy-purple text-buddy-black p-5 rounded-[24px] flex flex-col justify-between aspect-square"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full border border-buddy-black/20 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
            <ArrowUpRight size={16} />
          </div>
          <p className="font-bold text-sm">Chat with Bot</p>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="bg-buddy-pink text-buddy-black p-5 rounded-[24px] flex flex-col justify-between aspect-square"
        >
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full border border-buddy-black/20 flex items-center justify-center">
              <Image size={16} />
            </div>
            <ArrowUpRight size={16} />
          </div>
          <p className="font-bold text-sm">Search by Image</p>
        </motion.div>
      </div>

      {/* History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">History</h3>
          <button className="text-sm text-white/50">See all</button>
        </div>
        
        <div className="space-y-3">
          {historyItems.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-buddy-dark/50 p-4 rounded-[20px] flex items-center justify-between border border-white/5"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-full bg-${item.color} text-buddy-black flex items-center justify-center`}>
                  {item.icon}
                </div>
                <p className="text-sm text-white/80 truncate">{item.text}</p>
              </div>
              <MoreVertical size={16} className="text-white/30" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
