import React, { useState, useRef, useEffect } from 'react';
import { Youtube, Mail, Facebook, User, Camera, Calendar, Shield, Edit2, Check, X, LogOut, Loader2, Smartphone, Code, Star, Heart } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { supabase } from '../supabase';
import { showToast } from '../components/Toast';

const About: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setUser({ ...user, profile });
      setUsername(profile?.username || 'X-User');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) return <div className="h-full flex items-center justify-center bg-black"><Loader2 className="animate-spin text-accent" size={24} /></div>;

  return (
    <div className="p-4 space-y-8 pb-32 bg-black min-h-full">
      <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="relative inline-block group">
          <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] border-2 border-white/10 flex items-center justify-center overflow-hidden mx-auto shadow-2xl">
            {user?.profile?.avatar_url ? <img src={user.profile.avatar_url} className="w-full h-full object-cover" /> : <User size={40} className="text-zinc-700" />}
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2.5 bg-accent text-black rounded-xl shadow-xl active:scale-90"><Camera size={16} /></button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={() => {}} />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{username}</h2>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">{user?.email}</p>
        </div>

        <div className="flex justify-center gap-3">
          <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-xl text-[10px] font-black text-accent uppercase tracking-widest">Sync Active</span>
          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest">v{APP_VERSION}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Calendar size={20} />, label: "Join Date", val: new Date(user?.created_at).toLocaleDateString() },
          { icon: <Shield size={20} />, label: "Security", val: "Verified" }
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900/30 border border-white/5 p-4 rounded-3xl text-center space-y-2">
            <div className="text-accent mx-auto w-fit">{s.icon}</div>
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{s.label}</p>
              <p className="text-xs font-black text-white">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-2">Social Nexus</h3>
        <div className="flex gap-2">
          {[
            { icon: <Youtube size={20} />, color: "hover:text-red-500", url: "https://youtube.com/@kz.tutorial" },
            { icon: <Facebook size={20} />, color: "hover:text-blue-500", url: "https://facebook.com/kz.tutorial" },
            { icon: <Mail size={20} />, color: "hover:text-accent", url: "mailto:xyraofficialsup@gmail.com" }
          ].map((s, i) => (
            <button key={i} onClick={() => window.open(s.url, '_blank')} className={`flex-1 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-500 transition-all active:scale-95 ${s.color}`}>
              {s.icon}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSignOut} className="w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[11px] uppercase tracking-[0.2em] rounded-3xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
        <LogOut size={18} /> Exit Neural Protocol
      </button>

      <div className="pt-8 text-center space-y-2 opacity-30">
        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">© 2026 XTermux Nexus</p>
        <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest italic text-balance px-10">Crafted for professional Android terminal orchestration.</p>
      </div>
    </div>
  );
};

export default About;
