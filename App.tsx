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
    <button onClick={onClick} className="relative flex-1 flex flex-col items-center justify-center h-full group gap-0.5 pt-1">
      <div className={`z-10 transition-all duration-300 ease-in-out ${active ? 'text-accent -translate-y-0.5 scale-110' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{icon}</div>
      <span className={`text-[10px] font-bold tracking-tight transition-all duration-300 ease-in-out ${active ? 'text-accent' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{label}</span>
      {active && <div className="absolute bottom-1.5 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_var(--accent-color)] transition-all duration-300" />}
    </button>
  );

  return (
    <div className="h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-accent/30 overflow-hidden relative">
      <style>{`
        :root { --accent-color: ${accentColor}; }
        .text-accent { color: var(--accent-color); }
        .bg-accent { background-color: var(--accent-color); }
        .border-accent { border-color: var(--accent-color); }
        .bg-accent-10 { background-color: color-mix(in srgb, var(--accent-color), transparent 90%); }
        .bg-accent-20 { background-color: color-mix(in srgb, var(--accent-color), transparent 80%); }
        body { background-color: #09090b; }
      `}</style>

      <ToastContainer />
      {!isLegalView && (
          <header className="sticky top-0 z-[60] bg-zinc-950/50 backdrop-blur-2xl border-b border-white/5">
            <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md group-hover:bg-accent/40 transition-all" />
                  <div className="relative w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent-color)]" />
                  </div>
                </div>
                <h1 className="text-xl font-black text-white tracking-tighter uppercase">{getTitle()}</h1>
              </div>
              <div className="flex items-center gap-4">
                {session && (
                  <>
                    <SystemMonitor />
                    <button 
                      onClick={() => setShowThemePicker(!showThemePicker)}
                      className="p-2.5 text-zinc-400 hover:text-white transition-all bg-zinc-900/50 hover:bg-zinc-800 rounded-xl border border-white/5 backdrop-blur-md"
                    >
                      <Palette size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>
      )}

      <main 
        tabIndex={-1}
        className={`flex-1 max-w-5xl mx-auto w-full relative outline-none focus:outline-none focus-visible:outline-none pb-safe ${[ViewState.AI_CHAT, ViewState.ARCHITECT].includes(currentView) ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden p-0 scroll-smooth pb-32 no-scrollbar'}`}
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
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
            <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-around h-[76px] px-4">
                <NavButton active={currentView === ViewState.HOME} onClick={() => navigate(ViewState.HOME)} icon={<Home size={22} />} label="Home" />
                <NavButton 
                  active={currentView === ViewState.PACKAGES} 
                  onClick={() => navigate(ViewState.PACKAGES)} 
                  icon={
                    <div className="relative">
                      <Package size={22} />
                      {savedCount > 0 && (
                        <span className="absolute -top-2 -right-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-black text-black ring-2 ring-zinc-950 shadow-[0_0_10px_var(--accent-color)]">
                          {savedCount}
                        </span>
                      )}
                    </div>
                  } 
                  label="Tools" 
                />
                <NavButton active={currentView === ViewState.AI_CHAT} onClick={() => navigate(ViewState.AI_CHAT)} icon={<Bot size={24} />} label="Assistant" />
                <NavButton active={currentView === ViewState.GUIDES} onClick={() => navigate(ViewState.GUIDES)} icon={<BookOpen size={22} />} label="Codex" />
                <NavButton active={currentView === ViewState.ABOUT} onClick={() => navigate(ViewState.ABOUT)} icon={<User size={22} />} label="Profile" />
            </div>
        </nav>
      )}
    </div>
  );
};

const App: React.FC = () => (
    <AppContent />
);

export default App;
