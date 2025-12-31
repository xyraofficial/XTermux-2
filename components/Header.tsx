
import React from 'react';
import { Terminal } from 'lucide-react';

interface HeaderProps {
  title: string;
  onInfoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
            <Terminal size={18} className="text-green-500" />
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
