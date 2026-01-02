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
    const interval = setInterval(() => {
        setSysStats({
            cpu: Math.floor(Math.random() * 25) + 5,
            ram: Math.floor(Math.random() * 5) + 38,
        });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 space-y-10 pb-32 md:px-8 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase md:text-4xl">XTermux</h2>
          <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Online</span>
          </div>
        </div>
        <div onClick={() => onNavigate('ABOUT')} className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg cursor-pointer active:scale-90 transition-transform md:w-14 md:h-14">
           <Hexagon size={24} className="text-accent md:w-7 md:h-7" />
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* AI Chat Card */}
          <button onClick={() => onNavigate('AI_CHAT')} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 text-left relative overflow-hidden group active:scale-[0.98] transition-all min-h-[140px]">
              <Bot size={120} className="absolute -right-4 -bottom-4 text-accent opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-accent rounded-xl"><Bot size={20} className="text-black" /></div>
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">X-Vision AI</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">AI Intelligence</h3>
                <p className="text-[12px] text-zinc-500">Analyze errors and chat with neural AI.</p>
              </div>
          </button>

          {/* Tools Registry Card */}
          <button onClick={() => onNavigate('PACKAGES')} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 text-left relative overflow-hidden group active:scale-[0.98] transition-all min-h-[140px]">
              <Package size={120} className="absolute -right-4 -bottom-4 text-purple-500 opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-purple-500 rounded-xl"><Package size={20} className="text-black" /></div>
                  <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Registry</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">Tools Library</h3>
                <p className="text-[12px] text-zinc-500">Search 2000+ packages and installations.</p>
              </div>
          </button>

          {/* Guides Card */}
          <button onClick={() => onNavigate('GUIDES')} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 text-left relative overflow-hidden group active:scale-[0.98] transition-all min-h-[140px]">
              <BookOpen size={120} className="absolute -right-4 -bottom-4 text-orange-400 opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-orange-500 rounded-xl"><BookOpen size={20} className="text-black" /></div>
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Tutorials</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">User Guides</h3>
                <p className="text-[12px] text-zinc-500">Step-by-step Termux configurations.</p>
              </div>
          </button>

          {/* GitHub Tools Card */}
          <button onClick={() => onNavigate('SCRIPTS')} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 text-left relative overflow-hidden group active:scale-[0.98] transition-all min-h-[140px]">
              <Terminal size={120} className="absolute -right-4 -bottom-4 text-green-500 opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-green-500 rounded-xl"><Terminal size={20} className="text-black" /></div>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Repository</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">GitHub Scripts</h3>
                <p className="text-[12px] text-zinc-500">Install specialized tools and scripts.</p>
              </div>
          </button>

          {/* Architect Card */}
          <button onClick={() => onNavigate('ARCHITECT')} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 text-left relative overflow-hidden group active:scale-[0.98] transition-all min-h-[140px]">
              <PenTool size={120} className="absolute -right-4 -bottom-4 text-blue-400 opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-blue-500 rounded-xl"><PenTool size={20} className="text-black" /></div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Forge</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">X-Architect</h3>
                <p className="text-[12px] text-zinc-500">Generate complex script blueprints.</p>
              </div>
          </button>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-5 md:p-8">
          <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Command History</span>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {history.length > 0 ? history.slice(0, 4).map((cmd, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-zinc-800/50 group hover:border-accent/30 transition-colors">
                      <code className="text-[11px] text-zinc-400 truncate flex-1 font-mono">{cmd} codes...</code>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => { navigator.clipboard.writeText(cmd); showToast('Copied', 'success'); }} className="p-1.5 text-zinc-600 hover:text-accent">
                              <Copy size={14} />
                          </button>
                      </div>
                  </div>
              )) : (
                  <div className="py-2 text-center text-[10px] text-zinc-600 font-bold uppercase md:col-span-2">No recent activity</div>
              )}
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
