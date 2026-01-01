import React, { useState, useEffect } from 'react';
import { Youtube, Mail, Facebook, ExternalLink, User, CheckCircle2, Star, Code, Heart, Smartphone, AlertTriangle, Shield, Hexagon, Camera, Calendar, Shield as SecurityShield, Edit2, Check, X, Bell, Moon, Sun } from 'lucide-react';
import { APP_VERSION } from '../constants';

const About: React.FC = () => {
  const [username, setUsername] = useState(() => localStorage.getItem('xtermux_username') || 'X-User');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [avatar] = useState('');

  const handleSaveUsername = () => {
    const trimmed = tempUsername.trim();
    if (trimmed) {
      setUsername(trimmed);
      localStorage.setItem('xtermux_username', trimmed);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempUsername(username);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-32 px-4 pt-4">
      
      {/* Profile Section */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="relative">
          <div className="h-32 w-full bg-gradient-to-r from-accent/20 to-accent/5 rounded-3xl border border-zinc-800" />
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              <div className="w-24 h-24 bg-zinc-900 rounded-3xl border-4 border-zinc-950 flex items-center justify-center overflow-hidden shadow-2xl">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-zinc-600" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-accent text-black rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all z-10">
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-xl">
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
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">guest@xtermux.local</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4 hover:border-accent/20 transition-colors">
              <Calendar className="text-accent" size={20} />
              <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Initialization</p>
                <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4 hover:border-accent/20 transition-colors">
              <SecurityShield className="text-blue-400" size={20} />
              <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Security Status</p>
                <p className="text-sm font-bold text-green-500">Local Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* App Info Card */}
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

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3">
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

      {/* Developer Section */}
      <div>
        <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4 px-2">Connect with Developer</h3>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
           <div className="p-5 border-b border-zinc-800 flex items-center gap-4 bg-zinc-800/30">
              <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-700 shadow-md">
                 <User className="text-zinc-400" size={20} />
              </div>
              <div>
                 <h4 className="text-white font-bold text-base">Kz.tutorial</h4>
                 <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-green-500 fill-green-500/10" />
                    <p className="text-[11px] text-zinc-500 font-medium">XyraOfficial • Lead Developer</p>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 divide-y divide-zinc-800">
              <a href="https://youtube.com/@Kz.tutorial" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-300 text-red-500">
                        <Youtube size={18} />
                    </div>
                    <div>
                        <p className="text-zinc-200 font-bold text-xs">YouTube Channel</p>
                    </div>
                 </div>
                 <ExternalLink size={14} className="text-zinc-600" />
              </a>

              <a href="https://www.tiktok.com/@kztutorial.dev?_r=1&_t=ZS-92bRt5Qgrsm" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 text-pink-500">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-zinc-200 font-bold text-xs">TikTok</p>
                    </div>
                 </div>
                 <ExternalLink size={14} className="text-zinc-600" />
              </a>

              <a href="https://www.facebook.com/pangkey.jul" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 text-blue-500">
                        <Facebook size={18} />
                    </div>
                    <div>
                        <p className="text-zinc-200 font-bold text-xs">Facebook</p>
                    </div>
                 </div>
                 <ExternalLink size={14} className="text-zinc-600" />
              </a>

              <a href="mailto:xyraofficialsup@gmail.com" 
                 className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 text-orange-500">
                        <Mail size={18} />
                    </div>
                    <div>
                        <p className="text-zinc-200 font-bold text-xs">Email Support</p>
                    </div>
                 </div>
                 <ExternalLink size={14} className="text-zinc-600" />
              </a>
           </div>
        </div>
      </div>

      {/* Legal & Privacy Section */}
      <div>
        <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4 px-2">Legal & Privacy</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 space-y-6">
            <div>
                <h4 className="text-orange-400 font-bold text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Disclaimer
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed text-justify font-medium">
                    XTermux is intended for <strong className="text-zinc-300">educational purposes only</strong>. The developer assumes no liability and is not responsible for any misuse or damage caused by the tools or guides provided. Users are responsible for obeying all applicable laws and regulations in their jurisdiction when using penetration testing tools.
                </p>
            </div>
            
            <div className="w-full h-px bg-zinc-800/50" />

            <div>
                <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                    <Shield size={16} />
                    Privacy Policy
                </h4>
                <div className="text-[11px] text-zinc-400 leading-relaxed text-justify font-medium space-y-2">
                    <p>We value your privacy. XTermux does not collect, store, or share any personal user data.</p>
                </div>
            </div>
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