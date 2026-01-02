import React, { useState, useRef, useEffect } from 'react';
import { Youtube, Mail, Facebook, ExternalLink, User, CheckCircle2, Star, Code, Heart, Smartphone, AlertTriangle, Shield, Hexagon, Camera, Calendar, Shield as SecurityShield, Edit2, Check, X, LogOut, Loader2 } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { supabase } from '../supabase';
import { showToast } from '../components/Toast';

const About: React.FC = () => {
  const [username, setUsername] = useState('X-User');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [joinDate, setJoinDate] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        setJoinDate(new Date(user.created_at).toLocaleDateString());
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url, role')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          if (profile.username) {
            setUsername(profile.username);
            setTempUsername(profile.username);
          } else {
            setUsername('X-User');
            setTempUsername('X-User');
          }
          if (profile.avatar_url) setAvatar(profile.avatar_url);
          
          // Force admin status for specified emails in UI as a fallback
          const adminEmails = ['xyraofficialsup@gmail.com', 'pangkeyjulio2@gmail.com'];
          if (adminEmails.includes(user.email?.toLowerCase() || '')) {
            setRole('ADMIN');
          } else if (profile.role) {
            setRole(profile.role as 'USER' | 'ADMIN');
          }
        } else {
          setUsername('X-User');
          setTempUsername('X-User');
          // Still check for admin status even if profile is missing
          const adminEmails = ['xyraofficialsup@gmail.com', 'pangkeyjulio2@gmail.com'];
          if (adminEmails.includes(user.email?.toLowerCase() || '')) {
            setRole('ADMIN');
          }
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSaveUsername = async () => {
    const trimmed = tempUsername.trim();
    if (trimmed) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: user.id, username: trimmed, updated_at: new Date().toISOString() });
          
        if (error) {
          console.error('Supabase Profile Update Error:', error);
          showToast(`Gagal: ${error.message}. Pastikan tabel 'profiles' ada.`, 'error');
        } else {
          setUsername(trimmed);
          setIsEditing(false);
          showToast('Username diperbarui', 'success');
        }
      }
    }
  };

  const handleCancelEdit = () => {
    setTempUsername(username);
    setIsEditing(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: user.id, avatar_url: base64String, updated_at: new Date().toISOString() });
          
        if (error) {
          showToast('Gagal menyimpan foto profil', 'error');
        } else {
          setAvatar(base64String);
          showToast('Foto profil diperbarui', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast('Gagal keluar', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="text-accent animate-spin" size={32} />
        <p className="mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Syncing Neural Link...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-40 px-6 pt-10 md:px-12 lg:px-20">
      
      {/* Profile Section */}
      <div className="max-w-3xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-3xl border border-white/5 rounded-[3rem] group-hover:border-accent/30 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-accent/20 rounded-[2.5rem] blur-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                <div 
                  onClick={handleImageClick}
                  className="relative w-32 h-32 bg-zinc-900 rounded-[2.5rem] border-4 border-zinc-950 flex items-center justify-center overflow-hidden shadow-2xl cursor-pointer hover:border-accent transition-all duration-500 hover:scale-105"
                >
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={56} className="text-zinc-700" />
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <button 
                  onClick={handleImageClick}
                  className="absolute -bottom-2 -right-2 p-3 bg-accent text-black rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all z-10"
                >
                  <Camera size={20} />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left space-y-6">
                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="bg-zinc-950/50 backdrop-blur-md border border-accent/30 rounded-2xl px-5 py-2 text-2xl font-black uppercase tracking-tight text-white focus:outline-none focus:border-accent w-full shadow-inner"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSaveUsername} className="p-3 bg-accent text-black rounded-2xl hover:bg-white transition-all shadow-lg active:scale-90">
                          <Check size={20} />
                        </button>
                        <button onClick={handleCancelEdit} className="p-3 bg-zinc-800 text-zinc-400 rounded-2xl hover:bg-zinc-700 transition-all shadow-lg active:scale-90">
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center md:justify-start gap-4 group/name">
                      <h2 className="text-3xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">{username}</h2>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-2 opacity-0 group-hover/name:opacity-100 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-accent rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2 opacity-60">{userEmail}</p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl border tracking-[0.2em] shadow-lg ${
                    role === 'ADMIN' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-accent/10 text-accent border-accent/20'
                  }`}>
                    {role}
                  </span>
                  {role === 'ADMIN' && (
                    <div className="flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-xl shadow-lg">
                      <SecurityShield size={12} className="animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Agent</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-5 bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl flex flex-col items-center md:items-start gap-3 hover:border-accent/20 transition-all group/stat">
                    <Calendar className="text-accent group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-center md:text-left">
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Inception</p>
                      <p className="text-sm font-black text-zinc-300">{joinDate || new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="p-5 bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl flex flex-col items-center md:items-start gap-3 hover:border-blue-400/20 transition-all group/stat">
                    <SecurityShield className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-center md:text-left">
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Sync status</p>
                      <p className="text-sm font-black text-green-500">Active Node</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <a href="https://youtube.com/@kz.tutorial" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-[#FF0000] hover:scale-125 transition-all duration-300"><Youtube size={24} /></a>
                <a href="https://facebook.com/kz.tutorial" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-[#1877F2] hover:scale-125 transition-all duration-300"><Facebook size={24} /></a>
                <a href="mailto:xyraofficialsup@gmail.com" className="text-zinc-600 hover:text-accent hover:scale-125 transition-all duration-300"><Mail size={24} /></a>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full md:w-auto px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[11px] shadow-xl"
              >
                <LogOut size={20} />
                Sign Out Protocol
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 text-center overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent/20 rounded-[2rem] blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 bg-zinc-950 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-accent/5" />
                    <Hexagon size={48} className="text-accent group-hover:rotate-180 transition-transform duration-1000" strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase italic">XTermux</h2>
              <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-black px-3 py-1 bg-white/5 text-zinc-400 rounded-lg border border-white/5">ARCH v{APP_VERSION}</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Stable Core</span>
                  </div>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto font-medium">
                  The definitive nexus for Termux orchestration. Seamlessly integrating neural assistance, verified modules, and mission-critical documentation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
         {[
           { icon: <Code size={24} className="text-blue-400" />, label: "2K+ Nodes", sub: "Verified Modules" },
           { icon: <Smartphone size={24} className="text-purple-400" />, label: "Native UX", sub: "Mobile Optimized" },
           { icon: <Star size={24} className="text-yellow-400" />, label: "Premium Arch", sub: "Fluid Interface" },
           { icon: <Heart size={24} className="text-red-400" />, label: "Open Core", sub: "Community Driven" }
         ].map((item, i) => (
           <div key={i} className="bg-zinc-900/30 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:border-white/20 hover:bg-white/5 transition-all group shadow-xl">
              <div className="p-3 bg-zinc-950 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="space-y-1">
                <span className="text-xs font-black text-white uppercase tracking-tight block">{item.label}</span>
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">{item.sub}</span>
              </div>
           </div>
         ))}
      </div>

      <div className="text-center pt-8 opacity-40 group hover:opacity-100 transition-opacity">
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2">© 2024 XTermux Nexus Protocol</p>
         <div className="flex items-center justify-center gap-2">
           <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Forged in</span>
           <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
             <div className="w-1.5 h-1.5 rounded-full bg-accent" />
           </div>
           <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">by Kz.tutorial</span>
         </div>
      </div>

    </div>
  );
};

export default About;
