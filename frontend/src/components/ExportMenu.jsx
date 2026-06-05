import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileJson, FileCode, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportMenu = ({ messages, chatTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportAsTXT = () => {
    const content = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle || 'chat'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportAsMD = () => {
    const content = messages.map(m => `### ${m.role.toUpperCase()}\n${m.content}`).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle || 'chat'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportAsPDF = async () => {
    setIsOpen(false);
    const element = document.getElementById('chat-messages-container');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0d0d0d',
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${chatTitle || 'chat'}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-zyricon-border text-zyricon-textMuted hover:text-zyricon-text hover:bg-white/10 transition-all text-sm font-medium"
      >
        <Download size={16} />
        <span>Export</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-48 bg-zyricon-card border border-zyricon-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-1">
              <button
                onClick={exportAsPDF}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-zyricon-textMuted hover:bg-white/5 hover:text-zyricon-text transition-all text-left text-sm"
              >
                <FileText size={16} className="text-red-400" />
                <span>PDF Document</span>
              </button>
              <button
                onClick={exportAsTXT}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-zyricon-textMuted hover:bg-white/5 hover:text-zyricon-text transition-all text-left text-sm"
              >
                <FileCode size={16} className="text-blue-400" />
                <span>Text File (.txt)</span>
              </button>
              <button
                onClick={exportAsMD}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-zyricon-textMuted hover:bg-white/5 hover:text-zyricon-text transition-all text-left text-sm"
              >
                <FileJson size={16} className="text-zyricon-purple" />
                <span>Markdown (.md)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportMenu;
