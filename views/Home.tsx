import React, { useState, useEffect } from 'react';
import { Bot, Terminal, PenTool, Package, BookOpen, User, ShieldCheck as Shield, Crown } from 'lucide-react';
import PremiumModal from '../components/PremiumModal';

interface HomeProps {
  onNavigate: (view: string) => void;
  initialCommand?: {label: string, cmd: string} | null;
  onCommandStarted?: () => void;
}

import { LanguageProvider, useLanguage } from '../LanguageContext';
import { supabase } from '../supabase';

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const [isPremium, setIsPremium] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showRestrictedDialog, setShowRestrictedDialog] = useState<{show: boolean, title: string}>({ show: false, title: '' });
  
  useEffect(() => {
    const checkPremium = async () => {
      setIsSyncing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single();
        setIsPremium(!!profile?.is_premium);
      }
      setTimeout(() => setIsSyncing(false), 1500);
    };
    checkPremium();
  }, []);

  const handleNavigate = (viewId: string) => {
    if ((viewId === 'AI_BUILDER' || viewId === 'SCRIPTS') && !isPremium) {
      setShowRestrictedDialog({ 
        show: true, 
        title: viewId === 'AI_BUILDER' ? 'AI BUILDER' : 'SCRIPTS' 
      });
      return;
    }
    onNavigate(viewId);
  };
  
  const translations = {
    en: {
      status: "v1.0.0 Online",
      description: "Professional tools & command helper for Android terminal enthusiasts.",
      explore: "EXPLORE TOOLS",
      docs: "DOCUMENTATION",
      toolsCount: "Tools",
      usersCount: "Users",
      coreSystems: "Core Systems",
      ai: "AI BUILDER",
      vault: "Tool Vault",
      scripts: "Scripts",
      codex: "Codex",
      forge: "TEMPA",
      profile: "Profile",
      protocolStart: "Protocol Start",
      disclaimer: "Disclaimer: Community tool. Not affiliated with official Termux.",
      steps: [
        "Install Termux from F-Droid",
        "Execute update & upgrade",
        "Pick tool from Vault",
        "Paste & Run command"
      ]
    },
    id: {
      status: "v1.0.0 Online",
      description: "Alat profesional & pembantu perintah untuk penggemar terminal Android.",
      explore: "JELAJAHI ALAT",
      docs: "DOKUMENTASI",
      toolsCount: "Alat",
      usersCount: "Pengguna",
      coreSystems: "Sistem Inti",
      ai: "AI BUILDER",
      vault: "Gudang Alat",
      scripts: "Skrip",
      codex: "Kodeks",
      forge: "TEMPA",
      profile: "Profil",
      protocolStart: "Mulai Protokol",
      disclaimer: "Penafian: Alat komunitas. Tidak berafiliasi dengan Termux resmi.",
      steps: [
        "Instal Termux dari F-Droid",
        "Jalankan update & upgrade",
        "Pilih alat dari Vault",
        "Tempel & Jalankan perintah"
      ]
    },
    hi: {
      status: "v1.0.0 ऑनलाइन",
      description: "Android टर्मिनल उत्साही लोगों के लिए पेशेवर उपकरण और कमांड सहायक।",
      explore: "टूल्स एक्सप्लोर करें",
      docs: "दस्तावेज़",
      toolsCount: "टूल्स",
      usersCount: "उपयोगकर्ता",
      coreSystems: "कोर सिस्टम",
      ai: "AI BUILDER",
      vault: "टool वॉल्ट",
      scripts: "स्क्रिप्ट",
      codex: "कोडेक्स",
      forge: "TEMPA",
      profile: "प्रोफ़ाइल",
      protocolStart: "प्रोटोकॉल शुरू करें",
      disclaimer: "अस्वीकरण: सामुदायिक उपकरण। आधिकारिक Termux से संबद्ध नहीं है।",
      steps: [
        "F-Droid से Termux इंस्टॉल करें",
        "update और upgrade चलाएं",
        "वॉल्ट से टूल चुनें",
        "कमांड पेस्ट करें और चलाएं"
      ]
    }
  };

  const t = translations[language];

  if (isSyncing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </div>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Protokol Sinkronisasi</p>
          <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Pembangunan Tautan Syaraf...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 space-y-10 pb-32 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onUpgrade={() => {
          setIsPremium(true);
        }}
      />

      {showRestrictedDialog.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-xs bg-zinc-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <Crown size={28} className="text-amber-500" />
            </div>

            <h3 className="text-lg font-black text-white uppercase italic mb-2">Akses Terbatas</h3>
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mb-6">
              Fitur <span className="text-white font-black">{showRestrictedDialog.title}</span> hanya tersedia untuk anggota Premium. Tingkatkan protokol Anda sekarang.
            </p>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setShowRestrictedDialog({ show: false, title: '' });
                  setShowPremiumModal(true);
                }}
                className="w-full py-3.5 bg-amber-500 text-black text-[11px] font-black uppercase rounded-xl hover:bg-amber-400 active:scale-95 transition-all"
              >
                Upgrade Ke Premium
              </button>
              <button 
                onClick={() => setShowRestrictedDialog({ show: false, title: '' })}
                className="w-full py-3.5 bg-zinc-800 text-zinc-400 text-[11px] font-black uppercase rounded-xl hover:bg-zinc-700 transition-all"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{t.status}</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase">
              XTermux
            </h2>
            <p className="text-zinc-500 font-medium text-sm max-w-xs mx-auto text-balance">{t.description}</p>
          </div>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button onClick={() => onNavigate('PACKAGES')} className="w-full py-4 bg-accent text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20">
              <Terminal size={20} />
              {t.explore}
            </button>
            <button onClick={() => onNavigate('GUIDES')} className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-black rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
              <BookOpen size={20} />
              {t.docs}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">{t.toolsCount}</div>
          <div className="text-2xl font-black text-white text-center">2.4k+</div>
        </div>
        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">{t.usersCount}</div>
          <div className="text-2xl font-black text-white text-center">10k+</div>
        </div>
      </div>

      {/* Feature Grid - Optimized for Mobile All Menus */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-1">{t.coreSystems}</h3>
        
        {!isPremium && (
          <div className="relative group overflow-hidden mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-zinc-900/50 border border-amber-500/20 rounded-[2rem] p-6 flex items-center justify-between gap-6 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Crown size={80} className="text-amber-500" />
              </div>
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <Crown size={16} className="text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Premium Protocol</span>
                </div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Buka Potensi Penuh</h3>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed max-w-[200px]">
                  Akses AI Builder, Script Khusus, dan fitur eksklusif lainnya.
                </p>
                <button 
                  onClick={() => setShowPremiumModal(true)}
                  className="mt-2 px-6 py-2.5 bg-amber-500 text-black text-[10px] font-black uppercase rounded-xl hover:bg-amber-400 active:scale-95 transition-all"
                >
                  Upgrade Sekarang
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'AI_BUILDER', icon: PenTool, title: 'AI BUILDER', color: 'blue-500', premium: true },
            { id: 'SCRIPTS', icon: Terminal, title: t.scripts, color: 'blue-500', premium: true }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleNavigate(item.id)} 
              className={`group relative w-full text-left active:scale-[0.98] transition-all duration-300 ${item.premium && !isPremium ? 'opacity-80' : ''}`}
            >
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-2xl group-hover:bg-zinc-900/60 transition-all" />
              <div className="relative p-4 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border border-white/5">
                  <item.icon size={18} className="text-accent" />
                </div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-tighter">{item.title}</h4>
                  {item.premium && !isPremium && <Crown size={12} className="text-amber-500" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <PenTool size={18} className="text-accent" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">{t.protocolStart}</h3>
          </div>
          <div className="space-y-4">
            {t.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0">
                  {i + 1}
                </div>
                <p className="text-[11px] text-zinc-400 font-medium pt-0.5">{step}</p>
              </div>
            ))}
          </div>
      </div>

      <footer className="pt-10 border-t border-white/5 text-center space-y-4 pb-10">
        <p className="text-[10px] text-zinc-600 leading-relaxed max-w-[200px] mx-auto italic">
          {t.disclaimer}
        </p>
        <div className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em]">© 2026 XTermux Nexus</div>
      </footer>
    </div>
  );
};

export default Home;
