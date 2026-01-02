import React, { useState, useEffect } from 'react';
import { Cpu, Zap } from 'lucide-react';

const SystemMonitor: React.FC = () => {
  const [stats, setStats] = useState({ cpu: 12, ram: 42 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 25) + 5,
        ram: Math.floor(Math.random() * 5) + 38,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        <Cpu size={12} className="text-accent" />
        <div className="flex flex-col -space-y-0.5">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">CPU</span>
          <span className="text-[10px] font-mono font-bold text-accent">{stats.cpu}%</span>
        </div>
      </div>
      <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />
      <div className="flex items-center gap-1.5">
        <Zap size={12} className="text-blue-400" />
        <div className="flex flex-col -space-y-0.5">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">RAM</span>
          <span className="text-[10px] font-mono font-bold text-blue-400">{stats.ram}%</span>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
