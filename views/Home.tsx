import React, { useState, useEffect } from 'react';
import { Bot, Terminal, PenTool, Package, BookOpen, User } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: string) => void;
  initialCommand?: {label: string, cmd: string} | null;
  onCommandStarted?: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="px-4 py-8 space-y-10 pb-32 max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">v1.0.0 Online</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase">
              XTermux
            </h2>
            <p className="text-zinc-500 font-medium text-sm max-w-xs mx-auto text-balance">Professional tools & command helper for Android terminal enthusiasts.</p>
          </div>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button onClick={() => onNavigate('PACKAGES')} className="w-full py-4 bg-accent text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20">
              <Terminal size={20} />
              EXPLORE TOOLS
            </button>
            <button onClick={() => onNavigate('GUIDES')} className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
              <BookOpen size={20} />
              DOCUMENTATION
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Tools</div>
          <div className="text-2xl font-black text-white text-center">2.4k+</div>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Users</div>
          <div className="text-2xl font-black text-white text-center">10k+</div>
        </div>
      </div>

      {/* Feature Grid - Optimized for Mobile All Menus */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-1">Core Systems</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'AI_CHAT', icon: Bot, title: 'AI Assistant', color: 'accent' },
            { id: 'PACKAGES', icon: Package, title: 'Tool Vault', color: 'purple-500' },
            { id: 'SCRIPTS', icon: Terminal, title: 'Scripts', color: 'blue-500' },
            { id: 'GUIDES', icon: BookOpen, title: 'Codex', color: 'orange-500' },
            { id: 'ARCHITECT', icon: PenTool, title: 'Forge', color: 'red-500' },
            { id: 'ABOUT', icon: User, title: 'Profile', color: 'zinc-400' }
          ].map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className="group relative w-full text-left active:scale-[0.98] transition-all duration-300">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-2xl group-hover:bg-zinc-900/60 transition-all" />
              <div className="relative p-4 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border border-white/5">
                  <item.icon size={18} className="text-accent" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-tighter">{item.title}</h4>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <PenTool size={18} className="text-accent" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Protocol Start</h3>
          </div>
          <div className="space-y-4">
            {[
              "Install Termux from F-Droid",
              "Execute update & upgrade",
              "Pick tool from Vault",
              "Paste & Run command"
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0">
                  {i + 1}
                </div>
                <p className="text-[11px] text-zinc-400 font-medium pt-0.5">{step}</p>
              </div>
            ))}
          </div>
      </div>

      <footer className="pt-10 border-t border-white/5 text-center space-y-4 pb-10">
        <p className="text-[10px] text-zinc-600 leading-relaxed max-w-[200px] mx-auto italic">
          Disclaimer: Community tool. Not affiliated with official Termux.
        </p>
        <div className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em]">© 2026 XTermux Nexus</div>
      </footer>
    </div>
  );
};

export default Home;
