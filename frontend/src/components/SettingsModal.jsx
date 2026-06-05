import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Database, 
  ChevronRight,
  Sun,
  Moon,
  Trash2,
  Download,
  LogOut,
  Sparkles
} from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, sessions, onDeleteAll, userProfile, onLogout }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('thinkvault_theme') || 'default');

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('thinkvault_theme', theme);
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  if (!isOpen) return null;

  const themes = [
    { id: 'default', name: 'Zyricon (Default)', color: '#8B5CF6' },
    { id: 'midnight', name: 'Midnight Blue', color: '#3B82F6' },
    { id: 'emerald', name: 'Emerald Forest', color: '#10B981' },
    { id: 'rose', name: 'Rose Petal', color: '#F43F5E' },
    { id: 'amber', name: 'Amber Sunset', color: '#F59E0B' },
  ];

  const tabs = [
    { id: 'general', name: 'General', icon: <SettingsIcon size={16} /> },
    { id: 'profile', name: 'Profile', icon: <User size={16} /> },
    { id: 'data', name: 'Data Controls', icon: <Database size={16} /> },
    { id: 'security', name: 'Security', icon: <Shield size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-zyricon-sidebar border border-zyricon-border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[500px]"
      >
        {/* Left Sidebar */}
        <div className="w-full md:w-56 bg-black/20 p-4 border-r border-zyricon-border">
          <h2 className="text-white font-bold mb-6 px-2">Settings</h2>
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-zyricon-purple/20 text-zyricon-purple' : 'text-zyricon-textMuted hover:text-white hover:bg-white/5'}`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
          <button 
            onClick={onLogout}
            className="mt-auto w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-zyricon-bg">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white capitalize">{activeTab}</h3>
            <button onClick={onClose} className="text-zyricon-textMuted hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-bold text-white">Interface Theme</p>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${currentTheme === t.id ? 'bg-zyricon-purple/10 border-zyricon-purple' : 'bg-black/20 border-zyricon-border hover:border-white/10'}`}
                      >
                        <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: t.color }} />
                        <span className={`text-xs font-medium ${currentTheme === t.id ? 'text-white' : 'text-zyricon-textMuted'}`}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zyricon-border">
                  <div>
                    <p className="text-sm font-bold text-white">AI Model</p>
                    <p className="text-xs text-zyricon-textMuted">Current: ThinkVault Optimized</p>
                  </div>
                  <button className="text-xs font-bold text-zyricon-purple hover:underline flex items-center gap-1">
                    Upgrade Plan <Sparkles size={12} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-zyricon-purple to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-zyricon-bg">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.full_name || 'ThinkVault'}`} alt="avatar" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{userProfile?.full_name || 'Anonymous User'}</p>
                  <p className="text-sm text-zyricon-textMuted">{userProfile?.email || 'No email provided'}</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zyricon-purple/10 text-zyricon-purple text-[10px] font-bold uppercase tracking-wider">
                    {userProfile?.plan || 'Free'} Member
                  </div>
                  <p className="text-[10px] text-zyricon-textMuted mt-4 uppercase tracking-widest">
                    Joined {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <button className="w-full bg-white/5 border border-zyricon-border py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
                  Edit Profile
                </button>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <p className="text-sm font-bold text-red-400 mb-4">Danger Zone</p>
                  <div className="space-y-3">
                    <button 
                      onClick={() => { if(window.confirm('Delete all chats?')) onDeleteAll(); }}
                      className="w-full flex items-center justify-between text-left p-3 rounded-xl hover:bg-red-500/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 size={16} className="text-red-400" />
                        <div>
                          <p className="text-xs font-bold text-white">Delete all chats</p>
                          <p className="text-[10px] text-zyricon-textMuted">Permanently clear history</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-zyricon-textMuted group-hover:text-white" />
                    </button>
                    
                    <button className="w-full flex items-center justify-between text-left p-3 rounded-xl hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-3">
                        <Download size={16} className="text-zyricon-textMuted" />
                        <div>
                          <p className="text-xs font-bold text-white">Export data</p>
                          <p className="text-[10px] text-zyricon-textMuted">Download chat history as JSON</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-zyricon-textMuted group-hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
