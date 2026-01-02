
import React, { useState } from 'react';
import { Copy, Check, Play } from 'lucide-react';
import { showToast } from './Toast';

interface CodeBlockProps {
  code: string;
  label?: string;
  showCopy?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, label = 'bash', showCopy = true }) => {
  const [copied, setCopied] = React.useState(false);
  
  const normalizedLabel = label?.toLowerCase() || 'bash';
  const isTerminal = ['bash', 'sh', 'zsh', 'shell', 'termux', 'console', 'cmd'].includes(normalizedLabel);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = (e: React.MouseEvent) => {
      e.stopPropagation();
      // Dispatch custom event to trigger home terminal
      const event = new CustomEvent('run-termux-cmd', { detail: { cmd: code } });
      window.dispatchEvent(event);
      showToast('Running simulation...', 'info');
  };

  const getTextColor = () => {
    if (isTerminal) return 'text-[#4ade80]'; 
    if (normalizedLabel === 'python') return 'text-sky-400'; 
    if (['javascript', 'js', 'ts'].includes(normalizedLabel)) return 'text-yellow-400';
    return 'text-zinc-200';
  };

  return (
    <div className="my-4 rounded-2xl overflow-hidden bg-[#0c0c0c] border border-zinc-800/80 shadow-2xl group relative">
      <div className="px-4 py-2.5 flex items-center justify-between bg-zinc-900/50 border-b border-zinc-800">
        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
      </div>
      
      <div className="relative group/code">
        <div className="p-5 pr-14 flex items-start gap-4">
          <div className="flex-1 font-mono text-[11px] leading-relaxed break-all">
            <div className="flex items-start gap-2">
              {isTerminal && <span className="text-zinc-700 select-none font-bold mt-[1px]">$</span>}
              <span className={`${getTextColor()} whitespace-pre-wrap font-bold break-all opacity-90`} style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                {code}
              </span>
            </div>
          </div>
          
          {showCopy && (
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-white/5 text-zinc-500 hover:text-white hover:border-green-500/30 transition-all active:scale-90 opacity-100"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
