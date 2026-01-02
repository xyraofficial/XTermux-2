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
    <div className="breathing-room space-y-16 py-8 pb-48 md:space-y-24 md:py-12 lg:px-4 max-w-6xl mx-auto">
      <div className="relative group px-2 md:px-0">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-accent/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-accent/30 transition-all duration-1000" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-1000" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between relative z-10 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
                <div className="h-[1px] w-8 bg-accent/50" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">Terminal Interface</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-700 leading-none">
              XTermux
            </h2>
          </div>
          <div onClick={() => onNavigate('ABOUT')} className="group relative self-start md:self-auto">
            <div className="absolute inset-0 bg-accent/20 rounded-3xl blur-2xl group-hover:bg-accent/40 transition-all duration-700" />
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-zinc-900/40 backdrop-blur-3xl border border-white/10 flex items-center justify-center shadow-2xl cursor-pointer active:scale-90 transition-all duration-500 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
               <Hexagon size={28} className="text-accent group-hover:rotate-12 transition-transform duration-700 md:w-8 md:h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
          {/* AI Chat Card */}
          <button onClick={() => onNavigate('AI_CHAT')} className="group relative min-h-[240px] md:min-h-[280px] text-left active:scale-[0.98] transition-all duration-500">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] md:rounded-[3rem] group-hover:border-accent/40 group-hover:bg-zinc-900/80 transition-all duration-700 shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-[2.5rem] md:rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative h-full p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-accent/10 rounded-full blur-[80px] group-hover:bg-accent/20 transition-all duration-1000" />
                <Bot size={180} className="absolute -right-12 -bottom-12 md:size-[220px] md:-right-16 md:-bottom-16 text-accent opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 pointer-events-none" />
                
                <div className="space-y-4 md:space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 bg-accent/10 rounded-full border border-accent/20 backdrop-blur-xl shadow-inner group-hover:bg-accent/20 transition-colors">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] md:text-[11px] font-black text-accent uppercase tracking-[0.25em]">Neural Link</span>
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 md:mb-3 tracking-tighter uppercase leading-none">Nexus</h3>
                    <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed max-w-[240px] group-hover:text-zinc-400 transition-colors">Advanced cognitive synthesis for system architecture.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-accent text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0">
                  <span className="h-[1px] w-6 bg-accent" />
                  Connect
                </div>
              </div>
          </button>

          {/* Tools Registry Card */}
          <button onClick={() => onNavigate('PACKAGES')} className="group relative min-h-[240px] md:min-h-[280px] text-left active:scale-[0.98] transition-all duration-500">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] md:rounded-[3rem] group-hover:border-purple-500/40 group-hover:bg-zinc-900/80 transition-all duration-700 shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-[2.5rem] md:rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative h-full p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-all duration-1000" />
                <Package size={180} className="absolute -right-12 -bottom-12 md:size-[220px] md:-right-16 md:-bottom-16 text-purple-500 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 pointer-events-none" />
                
                <div className="space-y-4 md:space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 bg-purple-500/10 rounded-full border border-purple-500/20 backdrop-blur-xl shadow-inner group-hover:bg-purple-500/20 transition-colors">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-[10px] md:text-[11px] font-black text-purple-500 uppercase tracking-[0.25em]">Vault Core</span>
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 md:mb-3 tracking-tighter uppercase leading-none">Archive</h3>
                    <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed max-w-[240px] group-hover:text-zinc-400 transition-colors">Secure repository of decentralized terminal toolkits.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-purple-500 text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0">
                  <span className="h-[1px] w-6 bg-purple-500" />
                  Decrypt
                </div>
              </div>
          </button>

          {/* Guides Card */}
          <button onClick={() => onNavigate('GUIDES')} className="group relative min-h-[240px] md:min-h-[280px] text-left active:scale-[0.98] transition-all duration-500">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] md:rounded-[3rem] group-hover:border-orange-500/40 group-hover:bg-zinc-900/80 transition-all duration-700 shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent rounded-[2.5rem] md:rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative h-full p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-all duration-1000" />
                <BookOpen size={180} className="absolute -right-12 -bottom-12 md:size-[220px] md:-right-16 md:-bottom-16 text-orange-500 opacity-[0.03] group-hover:opacity-[0.1] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-1000 pointer-events-none" />
                
                <div className="space-y-4 md:space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 bg-orange-500/10 rounded-full border border-orange-500/20 backdrop-blur-xl shadow-inner group-hover:bg-orange-500/20 transition-colors">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] md:text-[11px] font-black text-orange-500 uppercase tracking-[0.25em]">Protocol</span>
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 md:mb-3 tracking-tighter uppercase leading-none">Codex</h3>
                    <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed max-w-[240px] group-hover:text-zinc-400 transition-colors">Master database for deep terminal exploitation.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-orange-500 text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0">
                  <span className="h-[1px] w-6 bg-orange-500" />
                  Master
                </div>
              </div>
          </button>
      </div>

      <div className="relative group mx-2 md:mx-0">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-blue-500/10 rounded-[2.5rem] md:rounded-[3rem] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
        <div className="relative bg-zinc-900/40 backdrop-blur-3xl border border-white/[0.03] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
                <Terminal size={120} className="text-white opacity-[0.02] -rotate-12 hidden md:block" />
            </div>
            <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-accent animate-pulse shadow-[0_0_15px_var(--accent-color)]" />
                  <span className="text-[10px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.5em]">Activity Log</span>
                </div>
                <div className="text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-widest">System Trace</div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {history.length > 0 ? history.slice(0, 4).map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between p-4 md:p-6 bg-black/40 rounded-2xl md:rounded-[2rem] border border-white/[0.03] group/item hover:border-accent/40 hover:bg-black/60 transition-all duration-500">
                        <div className="flex items-center gap-4 md:gap-5 overflow-hidden">
                          <div className="p-2.5 md:p-3 bg-zinc-900/50 rounded-xl md:rounded-2xl group-hover/item:text-accent transition-colors">
                            <Terminal size={16} className="text-zinc-500 shrink-0 md:size-[18px]" />
                          </div>
                          <code className="text-[13px] md:text-sm text-zinc-300 truncate font-mono font-bold tracking-tight">{cmd}</code>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(cmd); showToast('Trace Copied', 'success'); }} className="p-2.5 md:p-3 text-zinc-600 hover:text-accent transition-all hover:scale-110 active:scale-90">
                            <Copy size={16} className="md:size-[18px]" />
                        </button>
                    </div>
                )) : (
                    <div className="py-12 md:py-20 text-center md:col-span-2 border-2 border-dashed border-white/[0.02] rounded-[2.5rem] md:rounded-[3rem]">
                      <div className="text-[10px] md:text-[12px] text-zinc-600 font-black uppercase tracking-[0.5em] mb-2">No Trace Detected</div>
                      <div className="text-[9px] md:text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Awaiting system initialization</div>
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
