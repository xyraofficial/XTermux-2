import React, { useState, useMemo, useEffect } from 'react';
import { Search, Terminal, Github, ShieldAlert, Skull, ChevronDown, Copy, X, Info } from 'lucide-react';
import { SCRIPTS } from '../constants';
import CodeBlock from '../components/CodeBlock';
import { showToast } from '../components/Toast';

const CATEGORIES = ['All', 'Phishing', 'OSINT', 'Exploit', 'Utility', 'Spam'];

const Scripts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScript, setSelectedScript] = useState<any>(null);

  const filtered = useMemo(() => {
    return SCRIPTS.filter(s => {
      const match = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase());
      return match && (selectedCategory === 'All' || s.category === selectedCategory);
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col min-h-full bg-black">
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" placeholder="Search Scripts..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 pl-11 pr-4 py-3 rounded-2xl text-sm focus:border-green-500/50 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl border whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-green-500 text-black border-green-500' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {filtered.map((script) => (
          <div key={script.id} onClick={() => setSelectedScript(script)} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                <Terminal size={20} className="text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-white text-base truncate">{script.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{script.category}</span>
                  {script.isRoot && <span className="text-[8px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20 font-black">ROOT</span>}
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{script.description}</p>
          </div>
        ))}
      </div>

      {selectedScript && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md p-4 flex items-end">
          <div className="w-full bg-zinc-900 border border-white/10 rounded-t-[2.5rem] rounded-b-3xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-full duration-300">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="text-green-500" size={20} />
                <h3 className="font-black text-white uppercase tracking-widest">{selectedScript.name}</h3>
              </div>
              <button onClick={() => setSelectedScript(null)} className="p-2 bg-zinc-800 rounded-full text-zinc-500"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 no-scrollbar">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Protocol Description</span>
                <p className="text-sm text-zinc-400 leading-relaxed">{selectedScript.description}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Installation Command</span>
                <CodeBlock code={selectedScript.installCommand} />
              </div>
              <button onClick={() => window.open(selectedScript.githubUrl, '_blank')} className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                <Github size={18} /> View On GitHub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scripts;
