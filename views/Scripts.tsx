
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Terminal, Github, X, ShieldAlert, Globe, Lock, Wrench, AlertTriangle, Zap, ChevronDown, ShieldCheck, AlertOctagon, Copy, Skull } from 'lucide-react';
import { SCRIPTS } from '../constants';
import CodeBlock from '../components/CodeBlock';
import { ScriptItem } from '../types';
import { showToast } from '../components/Toast';

type CategoryType = 'All' | 'Phishing' | 'OSINT' | 'Exploit' | 'Utility' | 'Spam';

const ITEMS_PER_PAGE = 10;
const DISCLAIMER_KEY = 'xtermux_disclaimer_dismissed';

const CATEGORIES: { name: CategoryType; icon: React.ReactNode; description: string }[] = [
  { name: 'All', icon: <Terminal size={14} />, description: 'Browse all available tools in the repository' },
  { name: 'OSINT', icon: <Globe size={14} />, description: 'Open Source Intelligence & Reconnaissance tools' },
  { name: 'Phishing', icon: <Lock size={14} />, description: 'Social Engineering & Credential Testing tools' },
  { name: 'Spam', icon: <AlertTriangle size={14} />, description: 'Stress Testing, SMS & Call Bombing tools' },
  { name: 'Utility', icon: <Wrench size={14} />, description: 'General Purpose Helpers, Installers & System tools' },
  { name: 'Exploit', icon: <Zap size={14} />, description: 'System Vulnerability Scanners & Exploitation Frameworks' },
];

// Helper to determine risk level based on category
const getRiskInfo = (category: string) => {
    switch (category) {
        case 'Phishing':
        case 'Exploit':
            return { level: 'High Risk', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <AlertOctagon size={10} /> };
        case 'Spam':
            return { level: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: <AlertTriangle size={10} /> };
        case 'OSINT':
        case 'Utility':
        default:
            return { level: 'Safe', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <ShieldCheck size={10} /> };
    }
};

const Scripts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [hoveredCategory, setHoveredCategory] = useState<CategoryType | null>(null);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Check persistent storage for disclaimer
  useEffect(() => {
    const isDismissed = localStorage.getItem(DISCLAIMER_KEY);
    if (!isDismissed) {
        setShowDisclaimer(true);
    }
  }, []);

  const handleDismissDisclaimer = () => {
      setShowDisclaimer(false);
      localStorage.setItem(DISCLAIMER_KEY, 'true');
  };

  const filteredScripts = useMemo(() => {
    return SCRIPTS.filter(script => {
      const matchesSearch = 
        script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All' || script.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, selectedCategory]);

  const visibleScripts = useMemo(() => {
    return filteredScripts.slice(0, visibleCount);
  }, [filteredScripts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const handleCopyInstall = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    showToast('Installation command copied!', 'success');
  };

  const handleScriptClick = (script: ScriptItem) => {
      setSelectedScript(script);
  };

  return (
    <div className="flex flex-col h-full relative">

      {/* Search & Filter Header */}
      <div className="sticky top-[-1px] z-40 bg-zinc-950 border-b border-zinc-900/50">
        <div className="px-4 pt-2 pb-2">
          <div className="relative group">
            <Search 
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                searchTerm ? 'text-green-500' : 'text-zinc-500'
              }`} 
              size={18} 
            />
            <input 
              type="text"
              placeholder="Search GitHub tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 text-white pl-12 pr-10 py-3.5 rounded-2xl border border-zinc-800 focus:outline-none focus:border-green-500/50 focus:ring-4 focus:ring-green-500/5 transition-all text-[14px] font-medium placeholder:text-zinc-600 shadow-inner"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap text-[12px] font-bold transition-all duration-300 active:scale-95 ${
                selectedCategory === cat.name
                  ? 'bg-green-500/10 border-green-500/50 text-green-500'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Contextual Description Popup */}
        {hoveredCategory && (
            <div className="absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 p-2.5 shadow-2xl flex justify-center items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                <div className="p-1.5 bg-zinc-800 rounded-full border border-zinc-700">
                    {CATEGORIES.find(c => c.name === hoveredCategory)?.icon}
                </div>
                <span className="text-[11px] font-medium text-zinc-200 tracking-wide">
                    {CATEGORIES.find(c => c.name === hoveredCategory)?.description}
                </span>
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-4 pb-24">
        
        {/* Disclaimer Banner */}
        {showDisclaimer && (
            <div className="mb-4 bg-red-500/5 border border-red-500/20 rounded-[1.5rem] p-5 relative animate-in fade-in slide-in-from-top-2">
                <button 
                    onClick={handleDismissDisclaimer}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
                <div className="flex gap-4">
                    <div className="p-3 bg-red-500/10 rounded-2xl h-fit border border-red-500/20 shrink-0">
                        <ShieldAlert size={20} className="text-red-500" />
                    </div>
                    <div className="pr-4">
                        <h4 className="text-sm font-bold text-red-400 mb-1">Usage Disclaimer</h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium text-justify">
                            These tools are provided for <strong>EDUCATIONAL</strong> purposes only and legitimate security testing. 
                            The user is fully responsible for any misuse. 
                            The developer is not responsible for any damage or illegal actions committed.
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.25em]">GitHub Tools Repository</h3>
            <span className="text-[10px] font-bold text-zinc-400">{filteredScripts.length} Scripts</span>
        </div>

        <div className="grid gap-4">
            {visibleScripts.map((script) => {
              const risk = getRiskInfo(script.category);
              return (
                <div 
                  key={script.id} 
                  className="bg-zinc-900/40 border border-zinc-800/60 rounded-[1.5rem] p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 group relative overflow-hidden cursor-pointer"
                  onClick={() => handleScriptClick(script)}
                >
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-green-500/30 transition-colors shadow-lg shadow-black/50">
                          <Terminal size={20} className="text-zinc-400 group-hover:text-green-500 transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-[16px] tracking-tight flex items-center gap-2">
                            {script.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-zinc-500">by {script.author}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${risk.bg} ${risk.border}`}>
                                {risk.icon}
                                <span className={`text-[9px] font-black uppercase tracking-widest ${risk.color}`}>
                                    {risk.level}
                                </span>
                            </div>
                            {script.isRoot && (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-red-500/20 bg-red-500/10 text-red-500">
                                    <Skull size={10} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">ROOT</span>
                                </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[13px] text-zinc-400 mb-5 leading-relaxed font-medium line-clamp-2 relative z-10">
                    {script.description}
                  </p>

                  <div className="relative z-10">
                      <div className="space-y-3">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                                    {script.category}
                                  </span>
                              </div>
                              <a 
                                  href={script.githubUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-bold text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                              >
                                  <Github size={10} /> View Source
                              </a>
                          </div>
                          <CodeBlock code={script.installCommand} />
                      </div>
                  </div>
                </div>
              );
            })}

            {/* Load More Button */}
            {visibleCount < filteredScripts.length && (
              <button 
                onClick={handleLoadMore}
                className="w-full py-4 mt-2 flex items-center justify-center gap-2 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-green-500/50 hover:bg-zinc-900/80 transition-all active:scale-95 group"
              >
                <span className="text-xs font-bold uppercase tracking-wider">Load More Tools ({filteredScripts.length - visibleCount})</span>
                <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            )}

            {filteredScripts.length === 0 && (
                <div className="text-center py-12 px-4 bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-800/50">
                    <p className="text-zinc-500 font-bold mb-2">No scripts found</p>
                    <button 
                        onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                        className="text-[11px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Mac-Style Preview Modal */}
      {selectedScript && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-zinc-700/50 flex flex-col max-h-[85vh]">
                
                {/* Mac-Style Header */}
                <div className="px-4 py-3 bg-[#252526] border-b border-[#333333] flex items-center justify-between shrink-0">
                    <div className="flex gap-2">
                        <button onClick={() => setSelectedScript(null)} className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 border border-[#E0443E] transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                         <Github size={12} />
                         <span className="text-xs font-medium text-zinc-300">bash — 80x24</span>
                    </div>
                    <div className="w-14" /> {/* Spacer for centering */}
                </div>

                {/* Terminal Content */}
                <div className="p-4 bg-[#0c0c0c] overflow-y-auto font-mono text-xs flex-1">
                    {selectedScript.isRoot && (
                        <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
                            <Skull size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-red-400 font-bold">Root Access Required</p>
                                <p className="text-red-300/70 leading-relaxed">
                                    This tool requires <code>sudo</code> or <code>tsu</code> permissions. It interacts with low-level system hardware (like WiFi cards).
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="mb-2 text-zinc-500 select-none">$ ./preview_tool.sh</div>
                    <pre className="text-green-400 whitespace-pre leading-snug font-bold">
                        {selectedScript.previewOutput}
                    </pre>
                    <div className="mt-2 flex items-center gap-1 animate-pulse">
                        <span className="text-zinc-500">$</span>
                        <span className="w-2 h-4 bg-zinc-500" />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-[#1e1e1e] border-t border-zinc-700/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                        <span>Script by <span className="text-zinc-300 font-bold">{selectedScript.author}</span></span>
                        <span>{selectedScript.category}</span>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedScript(null)}
                            className="flex-1 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm transition-all active:scale-[0.98] border border-zinc-700"
                        >
                            Close
                        </button>
                        <button 
                            onClick={() => {
                                handleCopyInstall(selectedScript.installCommand);
                            }}
                            className="flex-[2] py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                        >
                            <Copy size={16} />
                            Copy Command
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Scripts;
