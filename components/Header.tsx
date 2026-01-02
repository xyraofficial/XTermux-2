
import React from 'react';
import { Terminal } from 'lucide-react';

interface HeaderProps {
  title: string;
  onInfoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-[60] bg-zinc-950/50 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md group-hover:bg-accent/40 transition-all" />
            <div className="relative w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
              <Terminal size={20} className="text-accent group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
