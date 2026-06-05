import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Settings,
  Trash2,
  Inbox,
  Search,
  MoreVertical,
  Edit3,
  Archive,
  Grid
} from 'lucide-react';

const Sidebar = ({ 
  sessions, 
  currentId, 
  onSelect, 
  onNewChat, 
  onArchive, 
  onDelete, 
  view, 
  setView,
  onOpenSettings,
  onRenameChat,
  userProfile
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeSessions = sessions.filter(s => !s.archived);
  const archivedSessions = sessions.filter(s => s.archived);

  const filteredSessions = (view === 'chat' ? activeSessions : archivedSessions)
    .filter(s => (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()));

  const handleStartRename = (e, session) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditValue(session.title);
  };

  const handleFinishRename = (id) => {
    if (editValue.trim()) {
      onRenameChat(id, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="w-72 h-full bg-zyricon-sidebar border-r border-zyricon-border flex flex-col p-4 text-zyricon-textMuted overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zyricon-purple to-zyricon-purpleLight flex items-center justify-center text-white shadow-lg shadow-zyricon-purple/20">
          <Grid size={20} />
        </div>
        <span className="font-bold text-xl tracking-tight text-zyricon-text">ThinkVault</span>
      </div>

      {/* New Chat Button */}
      <button 
        onClick={onNewChat}
        className="flex items-center gap-3 w-full bg-white/5 border border-white/10 p-3.5 rounded-2xl mb-6 hover:bg-white/10 transition-all active:scale-[0.98] group"
      >
        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-zyricon-purple transition-colors">
          <Plus size={14} className="group-hover:text-zyricon-purple" />
        </div>
        <span className="text-sm font-bold text-zyricon-text">New Chat</span>
        <span className="ml-auto text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono opacity-40">Ctrl K</span>
      </button>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zyricon-textMuted" size={14} />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-transparent focus:border-zyricon-purple/30 rounded-xl py-2.5 pl-9 pr-4 text-xs outline-none transition-all placeholder:text-zyricon-textMuted"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-xl border border-white/5">
        <button 
          onClick={() => setView('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${view === 'chat' ? 'bg-zyricon-card text-zyricon-purple shadow-sm border border-zyricon-border' : 'text-zyricon-textMuted hover:text-zyricon-text'}`}
        >
          <MessageSquare size={14} />
          Chats
        </button>
        <button 
          onClick={() => setView('archived')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${view === 'archived' ? 'bg-zyricon-card text-zyricon-purple shadow-sm border border-zyricon-border' : 'text-zyricon-textMuted hover:text-zyricon-text'}`}
        >
          <Inbox size={14} />
          Archive
        </button>
      </div>

      {/* Dynamic List Section */}
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
        <h3 className="text-[10px] font-bold text-zyricon-textMuted uppercase tracking-[0.2em] mb-4 px-2">
          {view === 'chat' ? 'Recent History' : 'Archived'}
        </h3>
        
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center opacity-30">
            <MessageSquare size={32} className="mb-2" />
            <p className="text-xs italic">No chats found</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div 
              key={session.id}
              className={`group relative flex items-center gap-3 w-full p-3 rounded-xl transition-all cursor-pointer border ${currentId === session.id ? 'bg-zyricon-purple/10 text-zyricon-purple border-zyricon-purple/20 shadow-lg shadow-zyricon-purple/5' : 'hover:bg-white/5 text-zyricon-textMuted hover:text-zyricon-text border-transparent'}`}
              onClick={() => onSelect(session.id)}
            >
              <MessageSquare size={16} className={currentId === session.id ? 'text-zyricon-purple' : 'opacity-40'} />
              
              {editingId === session.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleFinishRename(session.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFinishRename(session.id)}
                  className="bg-transparent border-0 focus:ring-0 p-0 text-sm font-medium w-full text-zyricon-text"
                />
              ) : (
                <span className="text-sm font-medium truncate flex-1">{session.title}</span>
              )}

              <div className={`flex items-center gap-1 ${currentId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <button 
                  onClick={(e) => handleStartRename(e, session)}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                  title="Rename"
                >
                  <Edit3 size={12} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onArchive(session.id); }}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                  title={view === 'chat' ? 'Archive' : 'Unarchive'}
                >
                  {view === 'chat' ? <Archive size={12} /> : <Plus size={12} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                  className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Profile */}
      <div className="mt-auto pt-4 border-t border-zyricon-border flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-zyricon-purple to-pink-500 overflow-hidden border border-white/10 shadow-lg">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.full_name || 'ThinkVault'}`} alt="avatar" />
        </div>
        <div className="flex-1 overflow-hidden text-left">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-zyricon-text truncate">{userProfile?.full_name || 'Anonymous'}</p>
            {userProfile?.id === 'demo-user' && (
              <span className="text-[8px] bg-zyricon-purple/20 text-zyricon-purple px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Demo</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            <p className="text-[10px] text-zyricon-textMuted truncate uppercase tracking-wider font-bold">{userProfile?.plan || 'Free'} Plan</p>
          </div>
        </div>
        <button 
          onClick={onOpenSettings}
          className="p-2 text-zyricon-textMuted hover:text-zyricon-text hover:bg-white/5 rounded-xl transition-all"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
