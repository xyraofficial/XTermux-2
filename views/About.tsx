import React, { useState, useRef, useEffect } from 'react';
import { Youtube, Mail, Facebook, User, Camera, Calendar, Shield, Edit2, Check, X, LogOut, Loader2, Smartphone, Code, Star, Heart, Crown } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { supabase } from '../supabase';
import { showToast } from '../components/Toast';

import { LanguageProvider, useLanguage } from '../LanguageContext';
import IOSModal from '../components/IOSModal';
import PremiumModal from '../components/PremiumModal';

const About: React.FC = () => {
  const { language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [licenseExpiry, setLicenseExpiry] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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
      footerDesc: "Crafted for professional Android terminal orchestration.",
      premium: "Premium Status",
      free: "Free Member",
      pro: "Nexus Premium",
      upgrade: "Initialize Upgrade",
      license: "License Key",
      expiry: "Valid Until",
      notSet: "Not Assigned"
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
      footerDesc: "Dibuat untuk orkestrasi terminal Android profesional.",
      premium: "Status Premium",
      free: "Anggota Gratis",
      pro: "Nexus Premium",
      upgrade: "Mulai Upgrade",
      license: "Kunci Lisensi",
      expiry: "Masa Aktif",
      notSet: "Belum Diatur"
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
      footerDesc: "पेशेवर Android टर्मिनल ऑर्केस्ट्रेशन के लिए तैयार किया गया।",
      premium: "प्रीमियम स्थिति",
      free: "मुफ़्त सदस्य",
      pro: "Nexus प्रीमियम",
      upgrade: "अपग्रेड शुरू करें",
      license: "लाइसेंस कुंजी",
      expiry: "वैधता",
      notSet: "निर्धारित नहीं"
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Show loading for at least 3 seconds as requested for "sync" feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    fetchUser();
    
    // Listen for license activation to auto-refresh
    const handleRefresh = () => {
      showToast('Neural Identity Syncing...', 'success');
      fetchUser();
    };
    window.addEventListener('license-activated', handleRefresh);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('license-activated', handleRefresh);
    };
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setIsPremium(!!profile?.is_premium);
        setLicenseKey(profile?.license_key || null);
        setLicenseExpiry(profile?.license_expiry || null);
        
        // If profile doesn't exist, create it
        if (!profile) {
          // Extract username from email (e.g., xyraofficialsup@gmail.com -> xyraofficial)
          let extractedUsername = user.email?.split('@')[0] || 'X-User';
          // If ends with 'sup', remove it for cleaner name as requested
          if (extractedUsername.toLowerCase().endsWith('sup')) {
            extractedUsername = extractedUsername.slice(0, -3);
          }
          
          const { data: newProfile } = await supabase.from('profiles').insert([
            { id: user.id, username: extractedUsername, email: user.email, role: 'user' }
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
          // Update email in profile if missing
          if (!profile.email && user.email) {
            await supabase.from('profiles').update({ email: user.email }).eq('id', user.id);
            profile.email = user.email;
          }

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

  const [showEditName, setShowEditName] = useState(false);
  const [newName, setNewName] = useState('');

  const handleUpdateProfile = async (targetName: string) => {
    try {
      if (!targetName.trim()) return;
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      const { error } = await supabase
        .from('profiles')
        .update({ username: targetName, updated_at: new Date().toISOString() })
        .eq('id', currentUser.id);

      if (error) throw error;
      
      showToast('Profile updated successfully', 'success');
      fetchUser();
      setShowEditName(false);
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
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onUpgrade={() => {
          // Logic for upgrade is now handled inside PremiumModal via Activation
        }}
      />
      <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="relative inline-block group">
          <div className={`w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center overflow-hidden mx-auto shadow-2xl transition-all duration-500 ${user?.profile?.role === 'admin' ? 'border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' : 'border-2 border-white/10'}`}>
            {user?.profile?.avatar_url ? <img src={user.profile.avatar_url} className="w-full h-full object-cover" /> : <User size={40} className="text-zinc-700" />}
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2.5 bg-accent text-black rounded-xl shadow-xl active:scale-90 z-20"><Camera size={16} /></button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleAvatarUpload} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{username}</h2>
            {user?.profile?.role === 'admin' && (
              <div className="relative flex items-center justify-center group/admin-badge shrink-0">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-md animate-pulse" />
                <div className="relative bg-red-600 px-2 py-0.5 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-white/20 flex items-center justify-center gap-1">
                  <Shield size={10} className="text-white fill-white" />
                  <span className="text-[7px] font-black text-white uppercase tracking-tighter">Admin</span>
                </div>
              </div>
            )}
            {isPremium && (
              <div className="relative flex items-center justify-center group/badge shrink-0">
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md" />
                <div className="relative bg-amber-500 p-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)] border border-white/10 flex items-center justify-center w-4 h-4">
                  <Crown size={10} className="text-zinc-900 stroke-[3px]" />
                </div>
              </div>
            )}
            <button 
              onClick={() => {
                setNewName(username);
                setShowEditName(true);
              }}
              className="p-1 text-zinc-600 hover:text-accent transition-colors"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">{user?.email}</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3">
          <span className={`px-4 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-widest ${user?.profile?.role === 'admin' ? 'bg-red-500/10 border-red-500/20 text-red-500' : (isPremium ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-accent/10 border-accent/20 text-accent')}`}>
            {user?.profile?.role === 'admin' ? 'ADMIN' : (isPremium ? t.pro : t.free)}
          </span>
          <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-xl text-[10px] font-black text-accent uppercase tracking-widest">{t.syncActive}</span>
          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest">v{APP_VERSION}</span>
        </div>

        {!isPremium && (
          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={() => setShowPremiumModal(true)}
              className="group relative w-full py-4 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-3xl flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <Crown size={20} className="text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
              <div className="text-left">
                <p className="text-[11px] font-black text-amber-500 uppercase tracking-[0.2em]">{t.upgrade}</p>
                <p className="text-[8px] font-bold text-amber-500/40 uppercase tracking-widest">Access AI Builder & Pro Scripts</p>
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

      {isPremium && (
        <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Crown size={18} className="text-amber-500" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Neural License Info</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{t.license}</p>
              <p className="text-[10px] font-mono font-black text-white bg-black/40 p-2 rounded-xl border border-white/5 truncate">
                {licenseKey || t.notSet}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{t.expiry}</p>
              <p className="text-xs font-black text-amber-500">
                {licenseExpiry ? new Date(licenseExpiry).toLocaleDateString() : t.notSet}
              </p>
            </div>
          </div>
        </div>
      )}

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

      {showEditName && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[270px] bg-[#1c1c1e]/90 backdrop-blur-xl rounded-[20px] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10">
            <div className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                <Edit2 size={24} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-white leading-tight">Neural Identity</h3>
                <p className="mt-1 text-[12px] text-zinc-500 leading-tight">Update your system designation</p>
              </div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-center text-sm focus:border-accent/50 outline-none transition-all mt-2"
                placeholder="New Identity..."
                autoFocus
              />
            </div>
            
            <div className="flex border-t border-white/10 h-12">
              <button 
                onClick={() => setShowEditName(false)}
                className="flex-1 text-[15px] text-zinc-500 font-bold uppercase tracking-widest border-r border-white/10 active:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleUpdateProfile(newName)}
                className="flex-1 text-[15px] text-accent font-bold uppercase tracking-widest active:bg-white/5 transition-colors"
              >
                Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
