import React from 'react';
import { Sun, Moon, Trash2, Vault } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, onClearChat }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 border-b border-border-light dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary-light dark:bg-primary-dark">
          <Vault className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-primary-light dark:text-primary-dark">ThinkVault</span>
      </div>
      
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
          Your Knowledge. <span className="text-primary-light dark:text-primary-dark italic">Unlocked.</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onClearChat}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden md:inline">Clear Chat</span>
        </button>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:bg-sidebar-light dark:hover:bg-sidebar-dark transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
