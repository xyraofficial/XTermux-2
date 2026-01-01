
import React, { useState, useEffect } from 'react';
import { Home, Package, BookOpen, Bot, User, Palette, PenTool, Terminal, Cpu } from 'lucide-react';
import { ViewState } from './types';

// Components
import HomeView from './views/Home';
import PackagesView from './views/Packages';
import GuidesView from './views/Guides';
import AboutView from './views/About';
import AIChatView from './views/AIChat';
import ScriptsView from './views/Scripts';
import ArchitectView from './views/Architect';

// Legal Views
import HelpView from './views/legal/Help';
import PrivacyView from './views/legal/Privacy';
import TermsView from './views/legal/Terms';

import { ToastContainer, showToast } from './components/Toast';

const ACCENT_COLORS = [
  { name: 'Classic Green', hex: '#22c55e' },
  { name: 'Cyber Purple', hex: '#a855f7' },
  { name: 'Sky Blue', hex: '#0ea5e9' },
  { name: 'Hacker Red', hex: '#ef4444' },
];

const App: React.FC = () => {
  const getInitialView = (): ViewState => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/help') return ViewState.HELP;
    if (path === '/privacy') return ViewState.PRIVACY;
    if (path === '/terms') return ViewState.TERMS;
    if (path === '/architect') return ViewState.ARCHITECT;
    if (path === '/packages') return ViewState.PACKAGES;
    if (path === '/guides') return ViewState.GUIDES;
    if (path === '/scripts') return ViewState.SCRIPTS;
    if (path === '/ai') return ViewState.AI_CHAT;
    return ViewState.HOME;
  };

  const [currentView, setCurrentView] = useState<ViewState>(getInitialView);
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('xtermux_accent') || '#22c55e');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<{label: string, cmd: string} | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateSavedCount = () => {
      const saved = localStorage.getItem('xtermux_favorites');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedCount(Array.isArray(parsed) ? parsed.length : 0);
        } catch (e) {
          setSavedCount(0);
        }
      } else {
        setSavedCount(0);
      }
    };

    updateSavedCount();
    
    // Listen for custom event from Packages view
    window.addEventListener('favorites-updated', updateSavedCount);
    window.addEventListener('storage', updateSavedCount);
    const interval = setInterval(updateSavedCount, 2000);
    return () => {
      window.removeEventListener('favorites-updated', updateSavedCount);
      window.removeEventListener('storage', updateSavedCount);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    localStorage.setItem('xtermux_accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    const handleRunCommand = (e: any) => {
        setPendingCommand({ label: 'Execute', cmd: e.detail.cmd });
        navigate(ViewState.HOME);
    };
    // window.addEventListener('run-termux-cmd', handleRunCommand);
    return () => { /* window.removeEventListener('run-termux-cmd', handleRunCommand); */ };
  }, []);

  const navigate = (view: ViewState) => {
    setCurrentView(view);
    let path = '/';
    switch (view) {
      case ViewState.HOME: path = '/'; break;
      case ViewState.ARCHITECT: path = '/architect'; break;
      case ViewState.PACKAGES: path = '/packages'; break;
      case ViewState.AI_CHAT: path = '/ai'; break;
      case ViewState.GUIDES: path = '/guides'; break;
      case ViewState.SCRIPTS: path = '/scripts'; break;
      case ViewState.ABOUT: path = '/profile'; break;
      default: path = '/';
    }
    window.history.pushState({}, '', path);
  };

  const getTitle = () => {
    switch (currentView) {
      case ViewState.HOME: return 'XTermux';
      case ViewState.PACKAGES: return 'Tools';
      case ViewState.ARCHITECT: return 'Forge';
      case ViewState.SCRIPTS: return 'Scripts';
      case ViewState.GUIDES: return 'Guides';
      case ViewState.ABOUT: return 'Me';
      case ViewState.AI_CHAT: return 'AI Assistant';
      default: return 'XTermux';
    }
  };

  const renderContent = () => {
    const viewProps = { className: "h-full animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out" };
    switch (currentView) {
      case ViewState.HOME: return <div {...viewProps}><HomeView onNavigate={(v) => navigate(ViewState[v as keyof typeof ViewState])} initialCommand={pendingCommand} onCommandStarted={() => setPendingCommand(null)} /></div>;
      case ViewState.ARCHITECT: return <div {...viewProps}><ArchitectView /></div>;
      case ViewState.PACKAGES: return <div {...viewProps}><PackagesView /></div>;
      case ViewState.SCRIPTS: return <div {...viewProps}><ScriptsView /></div>;
      case ViewState.GUIDES: return <div {...viewProps}><GuidesView /></div>;
      case ViewState.ABOUT: return <div {...viewProps}><AboutView /></div>;
      case ViewState.AI_CHAT: return <div {...viewProps}><AIChatView /></div>;
      case ViewState.HELP: return <div {...viewProps}><HelpView onBack={() => navigate(ViewState.HOME)} /></div>;
      case ViewState.PRIVACY: return <div {...viewProps}><PrivacyView onBack={() => navigate(ViewState.HOME)} /></div>;
      case ViewState.TERMS: return <div {...viewProps}><TermsView onBack={() => navigate(ViewState.HOME)} /></div>;
      default: return <div {...viewProps}><HomeView onNavigate={(v) => navigate(ViewState[v as keyof typeof ViewState])} /></div>;
    }
  };

  const isLegalView = [ViewState.HELP, ViewState.PRIVACY, ViewState.TERMS].includes(currentView);

  return (
    <div className="h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-accent/30 overflow-hidden">
      <style>{`
        :root { --accent-color: ${accentColor}; }
        .text-accent { color: var(--accent-color); }
        .bg-accent { background-color: var(--accent-color); }
        .border-accent { border-color: var(--accent-color); }
        .bg-accent-10 { background-color: color-mix(in srgb, var(--accent-color), transparent 90%); }
        .bg-accent-20 { background-color: color-mix(in srgb, var(--accent-color), transparent 80%); }
      `}</style>

      <ToastContainer />
      {!isLegalView && (
          <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent-10 rounded-lg flex items-center justify-center border border-accent/20">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
                <h1 className="text-lg font-bold text-white tracking-tight">{getTitle()}</h1>
              </div>
              <button 
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900 rounded-xl border border-zinc-800"
              >
                <Palette size={18} />
              </button>
            </div>
          </header>
      )}

      {showThemePicker && (
        <div className="fixed top-20 right-4 z-[60] bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">System Accent</p>
          <div className="flex gap-3">
            {ACCENT_COLORS.map(color => (
              <button
                key={color.hex}
                onClick={() => { setAccentColor(color.hex); setShowThemePicker(false); }}
                className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 ${accentColor === color.hex ? 'border-white scale-110 shadow-lg shadow-black' : 'border-zinc-800'}`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      )}

      <main className={`flex-1 max-w-5xl mx-auto w-full relative ${[ViewState.AI_CHAT, ViewState.ARCHITECT].includes(currentView) ? 'overflow-hidden pb-24' : 'overflow-y-auto overflow-x-hidden p-0 scroll-smooth pb-32'}`}>
        {renderContent()}
      </main>

      {!isLegalView && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 pb-[env(safe-area-inset-bottom)]">
            <div className="max-w-5xl mx-auto flex items-center justify-around h-[70px] px-2">
                <NavButton active={currentView === ViewState.HOME} onClick={() => navigate(ViewState.HOME)} icon={<Home size={20} />} label="Home" />
                <NavButton 
                  active={currentView === ViewState.PACKAGES} 
                  onClick={() => navigate(ViewState.PACKAGES)} 
                  icon={
                    <div className="relative">
                      <Package size={20} />
                      {savedCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-black text-black ring-2 ring-zinc-950">
                          {savedCount}
                        </span>
                      )}
                    </div>
                  } 
                  label="Tools" 
                />
                <NavButton active={currentView === ViewState.AI_CHAT} onClick={() => navigate(ViewState.AI_CHAT)} icon={<Bot size={22} />} label="AI" />
                <NavButton active={currentView === ViewState.GUIDES} onClick={() => navigate(ViewState.GUIDES)} icon={<BookOpen size={20} />} label="Guides" />
                <NavButton active={currentView === ViewState.ABOUT} onClick={() => navigate(ViewState.ABOUT)} icon={<User size={20} />} label="Me" />
            </div>
        </nav>
      )}
    </div>
  );
};

const NavButton: React.FC<{active: boolean; onClick: () => void; icon: React.ReactNode; label: string}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className="relative flex-1 flex flex-col items-center justify-center h-full group gap-0.5 pt-1">
    <div className={`z-10 transition-all duration-300 ${active ? 'text-accent -translate-y-0.5 scale-110' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{icon}</div>
    <span className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${active ? 'text-accent' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{label}</span>
    {active && <div className="absolute bottom-1.5 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_var(--accent-color)]" />}
  </button>
);

export default App;
