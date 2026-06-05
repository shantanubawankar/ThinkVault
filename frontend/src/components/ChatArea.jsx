import React, { useState, useRef, useEffect } from 'react';
import { Zap, GraduationCap, Lightbulb, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import ExportMenu from './ExportMenu';

const SUGGESTIONS = [
  { title: "Exam Preparation", text: "Create a 7-day study plan based on these notes.", icon: <GraduationCap className="w-6 h-6" /> },
  { title: "Deep Understanding", text: "Explain the most complex concepts with analogies.", icon: <Lightbulb className="w-6 h-6" /> },
  { title: "Quick Review", text: "Summarize the key points and main takeaways.", icon: <Sparkles className="w-6 h-6" /> },
  { title: "Self Testing", text: "Generate 5 exam-style questions to test me.", icon: <Zap className="w-6 h-6" /> },
];

const ChatArea = ({ 
  messages, 
  onSendMessage, 
  onUpload, 
  isLoading, 
  isUploading,
  chatTitle, 
  activeMode, 
  onModeChange,
  onRegenerate,
  onEditMessage,
  onStopGeneration
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <main className="flex flex-col flex-1 h-full bg-zyricon-bg overflow-hidden relative">
      {/* Header with Export */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-20 bg-gradient-to-b from-zyricon-bg via-zyricon-bg/80 to-transparent pointer-events-none">
        <h2 className="text-sm font-bold text-zyricon-textMuted truncate max-w-[200px] md:max-w-md pointer-events-auto">
          {chatTitle || 'New Chat'}
        </h2>
        <div className="pointer-events-auto">
          <ExportMenu messages={messages} chatTitle={chatTitle} />
        </div>
      </div>

      {/* Scrollable Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
        id="chat-messages-container"
      >
        <div className="max-w-4xl mx-auto w-full px-4 pt-24 pb-12">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-12">
              <div className="p-4 rounded-3xl bg-zyricon-purple/10 mb-6">
                <Zap className="w-12 h-12 text-zyricon-purple" />
              </div>
              <h1 className="text-4xl font-extrabold text-zyricon-text mb-3">
                Unlock Your Knowledge
              </h1>
              <p className="text-lg text-zyricon-textMuted mb-12 max-w-2xl">
                Upload your course materials to ThinkVault and let me help you master your studies.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(suggestion.text)}
                    className="flex flex-col items-start p-6 text-left rounded-[24px] bg-zyricon-card border border-zyricon-border hover:border-zyricon-purple/30 hover:shadow-2xl hover:shadow-zyricon-purple/5 transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-white/5 text-zyricon-purple mb-3 group-hover:scale-110 transition-transform">
                      {suggestion.icon}
                    </div>
                    <h3 className="font-bold text-zyricon-text mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-zyricon-textMuted">{suggestion.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((msg, idx) => (
                <MessageBubble 
                  key={idx} 
                  message={msg} 
                  onRegenerate={() => onRegenerate(idx)}
                  onEdit={() => onEditMessage(idx)}
                />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="w-full bg-gradient-to-t from-zyricon-bg via-zyricon-bg to-transparent pt-8">
        <ChatInput 
          onSendMessage={onSendMessage} 
          onUpload={onUpload}
          isLoading={isLoading} 
          isUploading={isUploading}
          activeMode={activeMode}
          onModeChange={onModeChange}
          onStop={onStopGeneration}
        />
      </div>
    </main>
  );
};

export default ChatArea;
