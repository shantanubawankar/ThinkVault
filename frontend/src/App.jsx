import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { uploadFiles, sendMessage } from './utils/api';
import { AnimatePresence } from 'framer-motion';

const MODE_PROMPTS = {
  normal: "",
  deep: "Think step by step. Analyze deeply before answering. Break down complex concepts thoroughly. Show your reasoning process.",
  quick: "Give a concise, direct answer in 2-3 sentences maximum. No lengthy explanations unless specifically asked.",
  study: "Structure all responses for optimal learning. Use:\n- Learning objectives at the start\n- Clear explanations with examples\n- Key takeaways at the end\n- Practice questions when relevant"
};

function Dashboard() {
  const { profile, signOut } = useAuth();
  
  // --- State for Persistence ---
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('thinkvault_sessions');
      if (!saved || saved === 'undefined' || saved === 'null') return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to parse sessions:', e);
      return [];
    }
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    try {
      const saved = localStorage.getItem('thinkvault_current_id');
      if (!saved || saved === 'undefined' || saved === 'null') return null;
      return saved;
    } catch (e) {
      return null;
    }
  });

  const [messages, setMessages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filesContext, setFilesContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [view, setView] = useState('chat'); // 'chat' or 'archived'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('normal');
  const abortControllerRef = React.useRef(null);

  // --- Persistence Logic ---
  useEffect(() => {
    localStorage.setItem('thinkvault_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('thinkvault_current_id', currentSessionId || '');
    // Load messages for current session
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        setMessages(session.messages || []);
        setUploadedFiles(session.files || []);
        setActiveMode(session.mode || 'normal');
        const context = (session.files || [])
          .map(f => `FILE: ${f.name}\nCONTENT:\n${f.content}`)
          .join('\n\n---\n\n');
        setFilesContext(context);
      }
    } else {
      setMessages([]);
      setUploadedFiles([]);
      setFilesContext('');
      setActiveMode('normal');
    }
  }, [currentSessionId, sessions]);

  // --- Handlers ---
  const handleNewChat = useCallback(() => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: 'New Chat',
      messages: [],
      files: [],
      mode: 'normal',
      archived: false,
      timestamp: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setView('chat');
  }, []);

  const handleRenameChat = (id, newTitle) => {
    setSessions(prev => prev.map(s => 
      s.id === id ? { ...s, title: newTitle } : s
    ));
  };

  const handleArchiveChat = (id) => {
    setSessions(prev => prev.map(s => 
      s.id === id ? { ...s, archived: !s.archived } : s
    ));
    if (id === currentSessionId) {
      setCurrentSessionId(null);
    }
  };

  const handleDeleteChat = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (id === currentSessionId) {
      setCurrentSessionId(null);
    }
  };

  const handleDeleteAll = () => {
    setSessions([]);
    setCurrentSessionId(null);
    setIsSettingsOpen(false);
  };

  const handleUpload = async (files) => {
    let activeId = currentSessionId;
    if (!activeId) {
      activeId = Date.now().toString();
      const newSession = { 
        id: activeId,
        title: 'New Chat',
        messages: [],
        files: [],
        mode: activeMode,
        archived: false,
        timestamp: new Date().toISOString()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(activeId);
    }

    setIsUploading(true);
    try {
      const result = await uploadFiles(files);
      const newFiles = result.files;
      
      const session = sessions.find(s => s.id === activeId);
      const currentFiles = session ? session.files : [];
      const updatedFiles = [...currentFiles, ...newFiles];
      
      const combinedContext = updatedFiles
        .map(f => `FILE: ${f.name}\nCONTENT:\n${f.content}`)
        .join('\n\n---\n\n');
      
      setUploadedFiles(updatedFiles);
      setFilesContext(combinedContext);
      
      setSessions(prevS => prevS.map(s => 
        s.id === activeId ? { ...s, files: updatedFiles } : s
      ));
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (content, isRegeneration = false, editIndex = -1) => {
    let activeId = currentSessionId;
    if (!activeId) {
      activeId = Date.now().toString();
      const newSession = {
        id: activeId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        files: [],
        mode: activeMode,
        archived: false,
        timestamp: new Date().toISOString()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(activeId);
    }

    let updatedMessages;
    if (editIndex !== -1) {
      updatedMessages = messages.slice(0, editIndex);
      updatedMessages.push({ role: 'user', content });
    } else if (isRegeneration) {
      updatedMessages = [...messages];
    } else {
      updatedMessages = [...messages, { role: 'user', content }];
    }

    setMessages(updatedMessages);
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const systemPrompt = MODE_PROMPTS[activeMode];
      const history = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      if (systemPrompt) {
        history[history.length - 1].content = `${systemPrompt}\n\nUSER REQUEST: ${content}`;
      }

      const result = await sendMessage(content, history.slice(0, -1), filesContext, abortControllerRef.current.signal);
      const aiMessage = { role: 'assistant', content: result.reply };
      const finalMessages = [...updatedMessages, aiMessage];
      
      setMessages(finalMessages);
      
      setSessions(prev => prev.map(s => 
        s.id === activeId ? { 
          ...s, 
          messages: finalMessages, 
          title: s.messages.length === 0 ? content.slice(0, 30) : s.title 
        } : s
      ));
    } catch (error) {
      console.error('Chat failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = (index) => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content, true);
    }
  };

  const handleEditMessage = (index) => {
    const msg = messages[index];
    if (msg.role === 'user') {
      handleSendMessage(msg.content, false, index);
    }
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    if (currentSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, mode } : s
      ));
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('thinkvault_sessions');
      localStorage.removeItem('thinkvault_current_id');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-zyricon-bg font-sans text-zyricon-text flex">
      <Sidebar 
        sessions={sessions}
        currentId={currentSessionId}
        onSelect={setCurrentSessionId}
        onNewChat={handleNewChat}
        onArchive={handleArchiveChat}
        onDelete={handleDeleteChat}
        onRenameChat={handleRenameChat}
        view={view}
        setView={setView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        userProfile={profile}
      />

      <main className="flex-1 h-full relative">
        <ChatArea 
          onSendMessage={handleSendMessage}
          onUpload={handleUpload}
          messages={messages}
          isLoading={isLoading}
          isUploading={isUploading}
          uploadedFiles={uploadedFiles}
          chatTitle={sessions.find(s => s.id === currentSessionId)?.title}
          activeMode={activeMode}
          onModeChange={handleModeChange}
          onRegenerate={handleRegenerate}
          onEditMessage={handleEditMessage}
          onStopGeneration={handleStopGeneration}
        />
      </main>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)}
            onDeleteAll={handleDeleteAll}
            userProfile={profile}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('thinkvault_theme');
    if (savedTheme && savedTheme !== 'default') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
