import React, { useState, useEffect } from 'react';
import { Home, Package, BookOpen, Bot, User, Palette, X, Terminal } from 'lucide-react';
import SystemMonitor from './components/SystemMonitor';
import { ViewState } from './types';
import { supabase } from './supabase';
import { Auth } from './components/Auth';
import { Session } from '@supabase/supabase-js';

// Components
import HomeView from './views/Home';
import PackagesView from './views/Packages';
import GuidesView from './views/Guides';
import AboutView from './views/About';
import AIChatView from './views/AIChat';
import ScriptsView from './views/Scripts';
import ArchitectView from './views/Architect';
import ConfirmEmailView from './views/ConfirmEmail';
import ResetPasswordView from './views/ResetPassword';

// Legal Views
import HelpView from './views/legal/Help';
import PrivacyView from './views/legal/Privacy';
import TermsView from './views/legal/Terms';

import { ToastContainer } from './components/Toast';

const AppContent: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    if (path === '/confirm-email') return ViewState.CONFIRM_EMAIL;
    if (path === '/reset-password') return ViewState.RESET_PASSWORD;
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
      case ViewState.ABOUT: path = '/about'; break;
      case ViewState.HELP: path = '/help'; break;
      case ViewState.PRIVACY: path = '/privacy'; break;
      case ViewState.TERMS: path = '/terms'; break;
      case ViewState.CONFIRM_EMAIL: path = '/confirm-email'; break;
      case ViewState.RESET_PASSWORD: path = '/reset-password'; break;
      default: path = '/';
    }
    window.history.pushState({}, '', path);
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
      case ViewState.CONFIRM_EMAIL: return <div {...viewProps}><ConfirmEmailView onNavigate={(v) => navigate(ViewState[v as keyof typeof ViewState])} /></div>;
      case ViewState.RESET_PASSWORD: return <div {...viewProps}><ResetPasswordView /></div>;
      default: return <div {...viewProps}><HomeView onNavigate={(v) => navigate(ViewState[v as keyof typeof ViewState])} /></div>;
    }
  };

  const isLegalView = [ViewState.HELP, ViewState.PRIVACY, ViewState.TERMS, ViewState.CONFIRM_EMAIL, ViewState.RESET_PASSWORD].includes(currentView);

  const NavButton: React.FC<{active: boolean; onClick: () => void; icon: React.ReactNode; label: string}> = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className="relative flex-1 flex flex-col items-center justify-center h-full group gap-1 transition-all duration-300">
      <div className={`z-10 transition-all duration-300 ease-in-out ${active ? 'text-accent -translate-y-1 scale-110' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{icon}</div>
      <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ease-in-out ${active ? 'text-accent opacity-100' : 'text-zinc-500 group-hover:text-zinc-300 opacity-60'}`}>{label}</span>
      {active && <div className="absolute top-1 w-8 h-1 bg-accent rounded-full shadow-[0_0_12px_var(--accent-color)]" />}
    </button>
  );

  return (
    <div className="h-[100dvh] bg-black text-zinc-100 flex flex-col font-sans selection:bg-accent/30 overflow-hidden relative">
      <style>{`
        :root { --accent-color: ${accentColor}; }
        .text-accent { color: var(--accent-color); }
        .bg-accent { background-color: var(--accent-color); }
        .border-accent { border-color: var(--accent-color); }
        .bg-accent-10 { background-color: color-mix(in srgb, var(--accent-color), transparent 90%); }
        .bg-accent-20 { background-color: color-mix(in srgb, var(--accent-color), transparent 80%); }
        body { background-color: #000000; overflow: hidden; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <ToastContainer />
      
      <main 
        tabIndex={-1}
        className={`flex-1 w-full relative outline-none focus:outline-none focus-visible:outline-none ${[ViewState.AI_CHAT, ViewState.ARCHITECT].includes(currentView) ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden scroll-smooth pb-28 no-scrollbar'}`}
      >
        {!session ? <Auth /> : renderContent()}
      </main>

      {session && !isLegalView && (
        <button 
          onClick={() => setShowThemePicker(true)}
          className="fixed top-4 right-4 z-50 p-3 text-white transition-all bg-zinc-900/80 hover:bg-zinc-800 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl active:scale-90"
        >
          <Palette size={20} />
        </button>
      )}

      {!isLegalView && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-3xl border-t border-white/5 pb-safe">
            <div className="max-w-lg mx-auto flex items-center justify-around h-[70px] px-1">
                <NavButton active={currentView === ViewState.HOME} onClick={() => navigate(ViewState.HOME)} icon={<Home size={18} />} label="Home" />
                <NavButton active={currentView === ViewState.PACKAGES} onClick={() => navigate(ViewState.PACKAGES)} icon={<Package size={18} />} label="Tools" />
                <NavButton active={currentView === ViewState.SCRIPTS} onClick={() => navigate(ViewState.SCRIPTS)} icon={<Terminal size={18} />} label="Script" />
                <NavButton active={currentView === ViewState.AI_CHAT} onClick={() => navigate(ViewState.AI_CHAT)} icon={<Bot size={20} />} label="AI" />
                <NavButton active={currentView === ViewState.GUIDES} onClick={() => navigate(ViewState.GUIDES)} icon={<BookOpen size={18} />} label="Codex" />
                <NavButton active={currentView === ViewState.ABOUT} onClick={() => navigate(ViewState.ABOUT)} icon={<User size={18} />} label="User" />
            </div>
        </nav>
      )}

      {showThemePicker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white tracking-tight">Spectrum</h3>
                <button onClick={() => setShowThemePicker(false)} className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 rounded-xl border border-white/5">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setAccentColor(color);
                      setShowThemePicker(false);
                    }}
                    className={`w-full aspect-square rounded-2xl transition-all duration-300 shadow-lg \${accentColor === color ? 'ring-2 ring-white ring-offset-4 ring-offset-zinc-900 scale-90' : 'hover:scale-110 active:scale-95'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

const App: React.FC = () => (
    <AppContent />
);

export default App;
