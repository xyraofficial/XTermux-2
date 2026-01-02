import React, { useState, useEffect } from 'react';
import { Home, Package, BookOpen, Bot, User, Palette, X } from 'lucide-react';
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

  const getTitle = () => {
    switch (currentView) {
      case ViewState.HOME: return 'XTermux';
      case ViewState.PACKAGES: return 'Tools';
      case ViewState.ARCHITECT: return 'Forge';
      case ViewState.SCRIPTS: return 'Scripts';
      case ViewState.GUIDES: return 'Guides';
      case ViewState.ABOUT: return 'Me';
      case ViewState.AI_CHAT: return 'AI Assistant';
      case ViewState.HELP: return 'Help Center';
      case ViewState.PRIVACY: return 'Privacy Policy';
      case ViewState.TERMS: return 'Terms of Service';
      case ViewState.CONFIRM_EMAIL: return 'Confirm Email';
      case ViewState.RESET_PASSWORD: return 'Reset Password';
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
      case ViewState.CONFIRM_EMAIL: return <div {...viewProps}><ConfirmEmailView onNavigate={(v) => navigate(ViewState[v as keyof typeof ViewState])} /></div>;
      case ViewState.RESET_PASSWORD: return <div {...viewProps}><ResetPasswordView /></div>;
      default: return <div {...viewProps}><HomeView onNavigate={(v) => navigate(ViewState[v as keyof typeof ViewState])} /></div>;
    }
  };

  const isLegalView = [ViewState.HELP, ViewState.PRIVACY, ViewState.TERMS, ViewState.CONFIRM_EMAIL, ViewState.RESET_PASSWORD].includes(currentView);

  const NavButton: React.FC<{active: boolean; onClick: () => void; icon: React.ReactNode; label: string}> = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className="relative flex-1 flex flex-col items-center justify-center h-full group gap-1">
      <div className={`z-10 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${active ? 'text-accent -translate-y-1 scale-110' : 'text-zinc-500 group-hover:text-zinc-300 group-hover:-translate-y-0.5'}`}>{icon}</div>
      <span className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-500 ${active ? 'text-accent opacity-100' : 'text-zinc-500 opacity-60 group-hover:opacity-100'}`}>{label}</span>
      {active && (
        <div className="absolute -bottom-1 w-12 h-1 bg-accent rounded-full blur-[2px] shadow-[0_0_15px_var(--accent-color)] animate-pulse" />
      )}
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
        body { background-color: #000; overflow: hidden; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <ToastContainer />
      {!isLegalView && (
          <header className="sticky top-0 z-[60] bg-black/40 backdrop-blur-3xl border-b border-white/[0.03]">
            <div className="max-w-5xl mx-auto px-8 h-24 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => navigate(ViewState.HOME)}>
                  <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:bg-accent/40 transition-all duration-700" />
                  <div className="relative w-12 h-12 bg-zinc-900/80 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    <div className="w-3 h-3 rounded-full bg-accent animate-ping opacity-50 absolute" />
                    <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_15px_var(--accent-color)] relative" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{getTitle()}</h1>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">System v2.0.4</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {session && (
                  <>
                    <SystemMonitor />
                    <button 
                      onClick={() => setShowThemePicker(!showThemePicker)}
                      className="w-12 h-12 flex items-center justify-center text-zinc-400 hover:text-white transition-all bg-zinc-900/50 hover:bg-zinc-800 rounded-2xl border border-white/5 backdrop-blur-md group"
                    >
                      <Palette size={22} className="group-hover:rotate-12 transition-transform duration-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>
      )}

      <main 
        tabIndex={-1}
        className={`flex-1 max-w-5xl mx-auto w-full relative outline-none focus:outline-none focus-visible:outline-none pb-safe ${[ViewState.AI_CHAT, ViewState.ARCHITECT].includes(currentView) ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden px-4 md:px-8 lg:px-12 scroll-smooth pb-44 no-scrollbar'}`}
      >
        {!session ? <Auth /> : renderContent()}
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
                    className={`w-full aspect-square rounded-2xl transition-all duration-300 shadow-lg ${accentColor === color ? 'ring-2 ring-white ring-offset-4 ring-offset-zinc-900 scale-90' : 'hover:scale-110 active:scale-95'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {!isLegalView && (
        <div className="fixed bottom-10 left-0 right-0 z-50 px-8 pointer-events-none">
          <nav className="max-w-lg mx-auto pointer-events-auto">
            <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex items-center justify-around h-[84px] px-6 relative overflow-hidden group/nav">
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
                <NavButton active={currentView === ViewState.HOME} onClick={() => navigate(ViewState.HOME)} icon={<Home size={24} />} label="Home" />
                <NavButton 
                  active={currentView === ViewState.PACKAGES} 
                  onClick={() => navigate(ViewState.PACKAGES)} 
                  icon={
                    <div className="relative">
                      <Package size={24} />
                      {savedCount > 0 && (
                        <span className="absolute -top-2.5 -right-3.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-black text-black ring-4 ring-zinc-950/50 shadow-[0_0_15px_var(--accent-color)]">
                          {savedCount}
                        </span>
                      )}
                    </div>
                  } 
                  label="Tools" 
                />
                <NavButton active={currentView === ViewState.AI_CHAT} onClick={() => navigate(ViewState.AI_CHAT)} icon={<Bot size={26} />} label="Nexus" />
                <NavButton active={currentView === ViewState.GUIDES} onClick={() => navigate(ViewState.GUIDES)} icon={<BookOpen size={24} />} label="Codex" />
                <NavButton active={currentView === ViewState.ABOUT} onClick={() => navigate(ViewState.ABOUT)} icon={<User size={24} />} label="User" />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
    <AppContent />
);

export default App;
