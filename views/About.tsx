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
    <div className="space-y-6 animate-fade-in pb-32 px-4 pt-4">
      
      {/* Profile Section */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl relative mt-8">
          <div className="absolute -top-12 left-6">
            <div className="relative group/avatar">
              <div 
                onClick={handleImageClick}
                className="w-24 h-24 bg-zinc-900 rounded-3xl border-4 border-zinc-950 flex items-center justify-center overflow-hidden shadow-2xl cursor-pointer hover:border-accent/50 transition-all"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-zinc-600" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={handleImageClick}
                className="absolute -bottom-1 -right-1 p-2 bg-accent text-black rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="mt-14 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="bg-zinc-950 border border-accent/30 rounded-lg px-3 py-1 text-lg font-black uppercase tracking-tight text-white focus:outline-none focus:border-accent w-full"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                    />
                    <button onClick={handleSaveUsername} className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors shrink-0">
                      <Check size={18} />
                    </button>
                    <button onClick={handleCancelEdit} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors shrink-0">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 group/name">
                    <h2 className="text-xl font-black uppercase tracking-tight">{username}</h2>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 opacity-0 group-hover/name:opacity-100 text-zinc-500 hover:text-accent transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">{userEmail}</p>
                <div className="mt-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border tracking-widest ${
                    role === 'ADMIN' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-accent/10 text-accent border-accent/20'
                  }`}>
                    {role}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center gap-2"
              >
                <LogOut size={18} />
                <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Sign Out</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4 hover:border-accent/20 transition-colors">
                <Calendar className="text-accent" size={20} />
                <div>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Initialization</p>
                  <p className="text-sm font-bold">{joinDate || new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4 hover:border-accent/20 transition-colors">
                <SecurityShield className="text-blue-400" size={20} />
                <div>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Security Status</p>
                  <p className="text-sm font-bold text-green-500">Cloud Sync Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
         
         <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-zinc-950 rounded-[1.5rem] flex items-center justify-center border border-zinc-800 shadow-xl mb-4 group-hover:scale-105 transition-transform duration-500 group-hover:border-green-500/30 overflow-hidden relative">
                <div className="absolute inset-0 bg-green-500/5" />
                <Hexagon size={40} className="text-green-500" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-1">XTermux</h2>
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">v{APP_VERSION}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded">STABLE</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                The ultimate companion for Termux users. Comprehensive documentation, AI assistance, and package management.
            </p>
         </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
         <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
            <Code size={20} className="text-blue-400" />
            <span className="text-xs font-bold text-zinc-300">2000+ Packages</span>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
            <Smartphone size={20} className="text-purple-400" />
            <span className="text-xs font-bold text-zinc-300">Mobile Optimized</span>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
            <Star size={20} className="text-yellow-400" />
            <span className="text-xs font-bold text-zinc-300">Premium UI</span>
         </div>
         <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
            <Heart size={20} className="text-red-400" />
            <span className="text-xs font-bold text-zinc-300">Free Forever</span>
         </div>
      </div>

      <div className="text-center pt-4 pb-4">
         <p className="text-[10px] font-medium text-zinc-600">© 2024 XTermux Project.</p>
         <p className="text-[9px] text-zinc-700">Made with 💚 by Kz.tutorial</p>
      </div>

    </div>
  );
};

export default About;
