import React, { useState } from 'react';
import { User, Vault, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Edit2, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import FlashcardView from './FlashcardView';

const cn = (...inputs) => twMerge(clsx(inputs));

const MessageBubble = ({ message, onRegenerate, onEdit }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [reaction, setReaction] = useState(null); // 'up' or 'down'
  
  const isAI = message.role === 'assistant';
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const hasFlashcards = (text) => {
    return text.includes('Q:') && text.includes('A:');
  };

  const parseFlashcards = (text) => {
    const cards = [];
    const lines = text.split('\n');
    let currentQ = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('Q:')) {
        currentQ = trimmed.replace('Q:', '').trim();
      } else if (trimmed.startsWith('A:') && currentQ) {
        cards.push({
          question: currentQ,
          answer: trimmed.replace('A:', '').trim()
        });
        currentQ = null;
      }
    }
    return cards;
  };

  return (
    <div className={cn(
      "group flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full",
      isAI ? "flex-row" : "flex-row-reverse"
    )}>
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
        isAI ? "bg-gradient-to-tr from-zyricon-purple to-zyricon-purpleLight text-white" : "bg-zyricon-card text-zyricon-textMuted"
      )}>
        {isAI ? <Vault className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      <div className={cn(
        "flex flex-col max-w-[85%] md:max-w-[80%] gap-1",
        isAI ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "relative px-5 py-4 rounded-[20px] shadow-sm transition-all border",
          isAI 
            ? "bg-zyricon-card border-zyricon-border text-zyricon-text" 
            : "bg-zyricon-purple/10 border-zyricon-purple/20 text-zyricon-text"
        )}>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  ) : (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-zyricon-purple" {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 last:mb-0 list-disc ml-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 last:mb-0 list-decimal ml-4 space-y-1">{children}</ol>,
                h1: ({ children }) => <h1 className="text-xl font-bold mb-4 mt-6 text-zyricon-text">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-3 mt-5 text-zyricon-text">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-bold mb-2 mt-4 text-zyricon-text">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-zyricon-purple/50 pl-4 italic my-4 text-zyricon-textMuted">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Actions on Hover */}
          <div className={cn(
            "absolute top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 bg-zyricon-bg border border-zyricon-border rounded-lg shadow-xl",
            isAI ? "-right-12 translate-x-4" : "-left-12 -translate-x-4"
          )}>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-white/10 text-zyricon-textMuted hover:text-zyricon-text transition-colors"
              title="Copy message"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            
            {isAI ? (
              <>
                <button
                  onClick={onRegenerate}
                  className="p-1.5 rounded-md hover:bg-white/10 text-zyricon-textMuted hover:text-zyricon-text transition-colors"
                  title="Regenerate"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
                <button
                  onClick={() => setReaction(reaction === 'up' ? null : 'up')}
                  className={cn(
                    "p-1.5 rounded-md hover:bg-white/10 transition-colors",
                    reaction === 'up' ? "text-zyricon-purple" : "text-zyricon-textMuted hover:text-zyricon-text"
                  )}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setReaction(reaction === 'down' ? null : 'down')}
                  className={cn(
                    "p-1.5 rounded-md hover:bg-white/10 transition-colors",
                    reaction === 'down' ? "text-red-400" : "text-zyricon-textMuted hover:text-zyricon-text"
                  )}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-md hover:bg-white/10 text-zyricon-textMuted hover:text-zyricon-text transition-colors"
                title="Edit message"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          {isAI && hasFlashcards(message.content) && (
            <div className="mt-4 pt-4 border-t border-zyricon-border">
              <button
                onClick={() => setShowFlashcards(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zyricon-purple/10 text-zyricon-purple font-bold text-sm hover:bg-zyricon-purple hover:text-white transition-all shadow-sm"
              >
                <Zap className="w-4 h-4" />
                Study with Flashcards
              </button>
            </div>
          )}
        </div>
        
        <span className="text-[10px] font-bold text-zyricon-textMuted uppercase tracking-widest px-2 mt-1">
          {isAI ? 'ThinkVault' : 'You'} • {timestamp}
        </span>
      </div>

      {showFlashcards && (
        <FlashcardView 
          cards={parseFlashcards(message.content)} 
          onClose={() => setShowFlashcards(false)} 
        />
      )}
    </div>
  );
};

export default MessageBubble;
