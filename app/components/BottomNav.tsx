"use client";
import React from 'react';
import { Home, Package, Terminal, Bot, BookOpen, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'HOME', icon: Home, label: 'Home' },
    { id: 'PACKAGES', icon: Package, label: 'Tools' },
    { id: 'SCRIPTS', icon: Terminal, label: 'Scripts' },
    { id: 'AI_CHAT', icon: Bot, label: 'AI' },
    { id: 'GUIDES', icon: BookOpen, label: 'Codex' },
    { id: 'ABOUT', icon: User, label: 'User' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 px-2 pb-safe">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300"
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-accent scale-110' : 'text-zinc-600'}`}>
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 transition-all duration-300 ${isActive ? 'text-accent opacity-100' : 'text-zinc-600 opacity-60'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-accent rounded-full shadow-[0_0_10px_#00ff00]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
