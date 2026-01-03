import React, { useState, useRef, useEffect } from 'react';
import { Youtube, Mail, Facebook, User, Camera, Calendar, Shield, Edit2, Check, X, LogOut, Loader2, Smartphone, Code, Star, Heart } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { supabase } from '../supabase';
import { showToast } from '../components/Toast';

import { LanguageProvider, useLanguage } from '../LanguageContext';

const About: React.FC = () => {
  const { language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    en: {
      syncing: "Syncing Protocol",
      link: "Neural Link Establishment...",
      syncActive: "Sync Active",
      joinDate: "Join Date",
      security: "Security",
      verified: "Verified",
      social: "Social Nexus",
      exit: "Exit Neural Protocol",
      footerDesc: "Crafted for professional Android terminal orchestration."
    },
    id: {
      syncing: "Protokol Sinkronisasi",
      link: "Pembangunan Tautan Syaraf...",
      syncActive: "Sinkronisasi Aktif",
      joinDate: "Tanggal Bergabung",
      security: "Keamanan",
      verified: "Terverifikasi",
      social: "Nexus Sosial",
      exit: "Keluar Protokol Neural",
      footerDesc: "Dibuat untuk orkestrasi terminal Android profesional."
    },
    hi: {
      syncing: "सिंकिंग प्रोटोकॉल",
      link: "न्यूरल लिंक स्थापना...",
      syncActive: "सिंक सक्रिय",
      joinDate: "शामिल होने की तिथि",
      security: "सुरक्षा",
      verified: "सत्यापित",
      social: "सोशल नेक्सस",
      exit: "न्यूरल प्रोटोकॉल से बाहर निकलें",
      footerDesc: "पेशेवर Android टर्मिनल ऑर्केस्ट्रेशन के लिए तैयार किया गया।"
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Show loading for at least 3 seconds as requested for "sync" feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    fetchUser();
    
    return () => clearTimeout(timer);
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        
        // If profile doesn't exist, create it
        if (!profile) {
          // Extract username from email (e.g., xyraofficialsup@gmail.com -> xyraofficial)
          let extractedUsername = user.email?.split('@')[0] || 'X-User';
          // If ends with 'sup', remove it for cleaner name as requested
          if (extractedUsername.toLowerCase().endsWith('sup')) {
            extractedUsername = extractedUsername.slice(0, -3);
          }
          
          const { data: newProfile } = await supabase.from('profiles').insert([
            { id: user.id, username: extractedUsername, role: 'user' }
          ]).select().single();
          const freshUserData = { ...user, profile: newProfile };
          setUser(freshUserData);
          setUsername(newProfile?.username || extractedUsername);
          
          // Cache for next time
          localStorage.setItem('user_profile_cache', JSON.stringify({
            user: freshUserData,
            username: newProfile?.username || 'X-User'
          }));
        } else {
          // If profile exists but username is still an email, clean it up
          if (profile.username && profile.username.includes('@')) {
            let extracted = profile.username.split('@')[0];
            if (extracted.toLowerCase().endsWith('sup')) {
              extracted = extracted.slice(0, -3);
            }
            
            await supabase.from('profiles').update({ username: extracted }).eq('id', user.id);
            profile.username = extracted;
          }

          const userData = { ...user, profile };
          setUser(userData);
          setUsername(profile.username || 'X-User');
          
          // Cache for next time
          localStorage.setItem('user_profile_cache', JSON.stringify({
            user: userData,
            username: profile.username || 'X-User'
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('user_profile_cache');
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleUpdateProfile = async (newUsername: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      
      showToast('Profile updated successfully', 'success');
      fetchUser();
    } catch (err: any) {
      showToast(err.message || 'Error updating profile', 'error');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      showToast('Avatar updated', 'success');
      fetchUser();
    } catch (err: any) {
      showToast(err.message || 'Error uploading avatar', 'error');
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center bg-black gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">{t.syncing}</p>
        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{t.link}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-8 pb-32 bg-black min-h-full">
      <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="relative inline-block group">
          <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] border-2 border-white/10 flex items-center justify-center overflow-hidden mx-auto shadow-2xl">
            {user?.profile?.avatar_url ? <img src={user.profile.avatar_url} className="w-full h-full object-cover" /> : <User size={40} className="text-zinc-700" />}
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2.5 bg-accent text-black rounded-xl shadow-xl active:scale-90"><Camera size={16} /></button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpload} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{username}</h2>
            {user?.profile?.role === 'admin' && (
              <div className="relative flex items-center justify-center group/badge">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50 group-hover/badge:opacity-100 transition-opacity" />
                <div className="relative bg-blue-500 p-0.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-white/20">
                  <Check size={10} className="text-white stroke-[4px]" />
                </div>
              </div>
            )}
            <button 
              onClick={() => {
                const newName = prompt('Enter new username:', username);
                if (newName && newName !== username) handleUpdateProfile(newName);
              }}
              className="p-1 text-zinc-600 hover:text-accent transition-colors"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">{user?.email}</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3">
          <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-xl text-[10px] font-black text-accent uppercase tracking-widest">{user?.profile?.role || 'USER'}</span>
          <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-xl text-[10px] font-black text-accent uppercase tracking-widest">{t.syncActive}</span>
          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest">v{APP_VERSION}</span>
        </div>

        {user?.profile?.role === 'admin' && (
          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('navigate-to-admin'));
              }}
              className="group relative w-full py-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-3xl flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Shield size={20} className="text-red-500 group-hover:rotate-12 transition-transform duration-300" />
              <div className="text-left">
                <p className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em]">Admin Control Panel</p>
                <p className="text-[8px] font-bold text-red-500/40 uppercase tracking-widest">Access System Architect & Scripts</p>
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Calendar size={20} />, label: t.joinDate, val: new Date(user?.created_at).toLocaleDateString() },
          { icon: <Shield size={20} />, label: t.security, val: t.verified }
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
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-2">{t.social}</h3>
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
        <LogOut size={18} /> {t.exit}
      </button>

      <div className="pt-8 text-center space-y-2 opacity-30">
        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">© 2026 XTermux Nexus</p>
        <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest italic text-balance px-10">{t.footerDesc}</p>
      </div>
    </div>
  );
};

export default About;
