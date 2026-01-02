"use client";
import React, { useState, useEffect } from 'react';
import HomeView from './views/Home';
import PackagesView from './views/Packages';
import ScriptsView from './views/Scripts';
import AIChatView from './views/AIChat';
import GuidesView from './views/Guides';
import UserProfileView from './views/About';
import BottomNav from './components/BottomNav';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState('HOME');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  const renderView = () => {
    switch (currentView) {
      case 'HOME': return <HomeView onNavigate={setCurrentView} />;
      case 'PACKAGES': return <PackagesView />;
      case 'SCRIPTS': return <ScriptsView />;
      case 'AI_CHAT': return <AIChatView />;
      case 'GUIDES': return <GuidesView />;
      case 'ABOUT': return <UserProfileView />;
      default: return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent/30">
      <main className="pb-20">
        {renderView()}
      </main>
      <BottomNav activeTab={currentView} onTabChange={setCurrentView} />
    </div>
  );
}
