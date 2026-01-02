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
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Terminal className="text-green-500" size={20} />
                <h3 className="font-black text-white uppercase tracking-widest truncate">{selectedScript.name}</h3>
              </div>
              <button onClick={() => setSelectedScript(null)} className="p-2 bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 no-scrollbar">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Protocol Description</span>
                <p className="text-sm text-zinc-400 leading-relaxed">{selectedScript.description}</p>
              </div>

              {selectedScript.requiredPackages && selectedScript.requiredPackages.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Required Packages</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedScript.requiredPackages.map((pkg: string) => (
                      <span key={pkg} className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-[10px] font-black uppercase">
                        {pkg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedScript.setupInfo && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Setup Guide (Termux)</span>
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                      <p className="text-xs text-zinc-500 leading-relaxed italic">"{selectedScript.setupInfo}"</p>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="group relative">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            1. System Preparation
                          </p>
                        </div>
                        <div className="relative group/cmd">
                          <div className="bg-black/40 p-3 pr-12 rounded-xl border border-white/5 font-mono text-[10px] text-green-500/70 break-all leading-relaxed">
                            termux-setup-storage && pkg update && pkg upgrade -y
                          </div>
                          <button 
                            onClick={() => { navigator.clipboard.writeText('termux-setup-storage && pkg update && pkg upgrade -y'); showToast('Copied!', 'success'); }} 
                            className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 bg-zinc-800/80 backdrop-blur-sm border border-white/5 rounded-lg text-zinc-500 hover:text-white hover:border-green-500/30 transition-all active:scale-90 opacity-100"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                      
                      {selectedScript.requiredPackages && selectedScript.requiredPackages.length > 0 && (
                        <div className="group relative">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2">
                              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                              2. Dependency Setup
                            </p>
                          </div>
                          <div className="relative group/cmd">
                            <div className="bg-black/40 p-3 pr-12 rounded-xl border border-white/5 font-mono text-[10px] text-green-500/70 break-all leading-relaxed">
                              pkg install {selectedScript.requiredPackages.join(' ')} -y
                            </div>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(`pkg install ${selectedScript.requiredPackages.join(' ')} -y`); showToast('Copied!', 'success'); }} 
                              className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 bg-zinc-800/80 backdrop-blur-sm border border-white/5 rounded-lg text-zinc-500 hover:text-white hover:border-green-500/30 transition-all active:scale-90 opacity-100"
                            >
                              <Copy size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="group relative">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            3. Final Execution
                          </p>
                        </div>
                        <div className="relative group/cmd">
                          <div className="bg-black/40 p-3 pr-12 rounded-xl border border-white/5 font-mono text-[10px] text-green-500/70 break-all leading-relaxed">
                            {selectedScript.installCommand}
                          </div>
                          <button 
                            onClick={() => { navigator.clipboard.writeText(selectedScript.installCommand); showToast('Copied!', 'success'); }} 
                            className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 bg-zinc-800/80 backdrop-blur-sm border border-white/5 rounded-lg text-zinc-500 hover:text-white hover:border-green-500/30 transition-all active:scale-90 opacity-100"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Live Output Preview</span>
                <div className="bg-black border border-white/5 rounded-2xl overflow-hidden shadow-inner relative">
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                    <div className="w-full h-[2px] bg-green-500/50 absolute top-0 animate-scanline shadow-[0_0_10px_green]"></div>
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900/50 border-b border-white/5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/40"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/40"></div>
                  </div>
                  <div className="p-4 max-h-48 overflow-y-auto no-scrollbar font-mono text-[11px] text-green-500 opacity-80 leading-snug whitespace-pre-wrap select-none relative z-10">
                    {selectedScript.previewOutput}
                  </div>
                </div>
              </div>
              <button onClick={() => window.open(selectedScript.githubUrl, '_blank')} className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
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
