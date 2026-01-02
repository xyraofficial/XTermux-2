import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Shield, Users, Database, AlertTriangle, Loader2 } from 'lucide-react';

const AdminView: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-black">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="h-full flex flex-col items-center justify-center bg-black p-6 text-center space-y-4">
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500">
        <Shield size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Access Denied</h2>
        <p className="text-sm text-zinc-500 max-w-xs">You do not have administrative privileges to access this neural sector.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 pb-32 bg-black min-h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">AI ARCHITECT</h1>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">System Design & Automation</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-2xl text-accent"><Users size={24} /></div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">System Architect</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Neural Design Interface</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Database size={24} /></div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Core Templates</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">System Foundation Blueprints</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500"><AlertTriangle size={24} /></div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Neural Sync</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Real-time Automation Logs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;