import React, { useState, useEffect } from 'react';
import { Bot, Hexagon, Terminal, PenTool, Copy, Package, BookOpen } from 'lucide-react';
import { showToast } from '../components/Toast';

interface HomeProps {
  onNavigate: (view: string) => void;
  initialCommand?: {label: string, cmd: string} | null;
  onCommandStarted?: () => void;
}

const HISTORY_KEY = 'xtermux_exec_history';

const Home: React.FC<HomeProps> = ({ onNavigate, initialCommand, onCommandStarted }) => {
  const [sysStats, setSysStats] = useState({ cpu: 12, ram: 42 });
  const [history] = useState<string[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    let lastStats = { cpu: 12, ram: 42 };
    const interval = setInterval(() => {
        const targetCpu = Math.floor(Math.random() * 25) + 5;
        const targetRam = Math.floor(Math.random() * 5) + 38;
        
        // Smoothing with lerp-like effect
        lastStats = {
          cpu: Math.floor(lastStats.cpu * 0.7 + targetCpu * 0.3),
          ram: Math.floor(lastStats.ram * 0.7 + targetRam * 0.3)
        };
        
        setSysStats(lastStats);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-12 pb-32 md:px-10 lg:px-16">
      <div className="relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-zinc-500">
              XTermux
            </h2>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-1 h-3 bg-accent/40 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-accent animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Operational Nexus</span>
            </div>
          </div>
          <div onClick={() => onNavigate('ABOUT')} className="group relative">
            <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-lg group-hover:bg-accent/40 transition-all duration-500" />
            <div className="relative w-14 h-14 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl cursor-pointer active:scale-90 transition-all duration-300 md:w-16 md:h-16 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
               <Hexagon size={28} className="text-accent md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* AI Chat Card */}
          <button onClick={() => onNavigate('AI_CHAT')} className="group relative aspect-[4/3] md:aspect-auto min-h-[180px] text-left active:scale-[0.98] transition-all duration-300">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] group-hover:border-accent/50 group-hover:bg-zinc-900/60 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full p-8 flex flex-col justify-between overflow-hidden">
                <Bot size={160} className="absolute -right-8 -bottom-8 text-accent opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/20 backdrop-blur-md">
                    <Bot size={14} className="text-accent" />
                    <span className="text-[9px] font-black text-accent uppercase tracking-widest">Neural core</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">AI Insight</h3>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-[200px]">Next-gen neural assistant for system diagnostics.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Initialize <Terminal size={12} />
                </div>
              </div>
          </button>

          {/* Tools Registry Card */}
          <button onClick={() => onNavigate('PACKAGES')} className="group relative aspect-[4/3] md:aspect-auto min-h-[180px] text-left active:scale-[0.98] transition-all duration-300">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] group-hover:border-purple-500/50 group-hover:bg-zinc-900/60 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full p-8 flex flex-col justify-between overflow-hidden">
                <Package size={160} className="absolute -right-8 -bottom-8 text-purple-500 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full border border-purple-500/20 backdrop-blur-md">
                    <Package size={14} className="text-purple-500" />
                    <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Registry v2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Vault</h3>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-[200px]">Advanced repository with 2000+ curated modules.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-purple-500 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Explore <Terminal size={12} />
                </div>
              </div>
          </button>

          {/* Guides Card */}
          <button onClick={() => onNavigate('GUIDES')} className="group relative aspect-[4/3] md:aspect-auto min-h-[180px] text-left active:scale-[0.98] transition-all duration-300">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] group-hover:border-orange-500/50 group-hover:bg-zinc-900/60 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full p-8 flex flex-col justify-between overflow-hidden">
                <BookOpen size={160} className="absolute -right-8 -bottom-8 text-orange-500 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20 backdrop-blur-md">
                    <BookOpen size={14} className="text-orange-500" />
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Codex</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Academy</h3>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-[200px]">Master Termux through structured protocol guides.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-orange-500 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  Learn <Terminal size={12} />
                </div>
              </div>
          </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-blue-500/5 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Command Matrix</span>
                </div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase">System History</div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {history.length > 0 ? history.slice(0, 4).map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group/item hover:border-accent/30 hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Terminal size={14} className="text-zinc-500 shrink-0" />
                          <code className="text-xs text-zinc-300 truncate font-mono">{cmd}</code>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(cmd); showToast('Matrix Copied', 'success'); }} className="p-2 text-zinc-500 hover:text-accent transition-colors">
                            <Copy size={14} />
                        </button>
                    </div>
                )) : (
                    <div className="py-8 text-center md:col-span-2">
                      <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">No Trace Detected</div>
                      <div className="text-[9px] text-zinc-700 font-medium">Activity logs are currently empty</div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const MetricItem: React.FC<{label: string, value: string, color: string, progress: number}> = ({ label, value, color, progress }) => (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3 shadow-xl md:p-6">
        <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
            <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
        </div>
        <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 ease-out ${color.replace('text', 'bg')}`} style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
    </div>
);

export default Home;
