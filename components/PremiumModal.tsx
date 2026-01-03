import React, { useState } from 'react';
import { X, Star, Crown, Zap, Shield, Check, MessageSquare, Key } from 'lucide-react';
import LicenseActivationModal from './LicenseActivationModal';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [showSubOptions, setShowSubOptions] = useState(false);
  const [showActivation, setShowActivation] = useState(false);

  if (!isOpen) return null;

  const features = [
    { icon: <Zap className="text-amber-400" />, title: "AI Builder Pro", desc: "Build advanced system orchestrations with neural networks" },
    { icon: <Shield className="text-blue-400" />, title: "Elite Scripts", desc: "Access premium penetration and automation scripts" },
    { icon: <Crown className="text-purple-400" />, title: "Nexus Priority", desc: "Higher priority for AI processing and support" },
    { icon: <Check className="text-green-400" />, title: "Ad-Free Interface", desc: "Clean, professional terminal environment" }
  ];

  if (showSubOptions) {
    return (
      <>
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Premium Access</h3>
              <p className="text-zinc-500 text-xs">Choose your activation method</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  window.open('https://sociabuzz.com/xyraofficial/shop', '_blank');
                }}
                className="w-full py-5 bg-accent text-black font-black rounded-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
              >
                <Star size={18} />
                Buy License
              </button>
              
              <button 
                onClick={() => setShowActivation(true)}
                className="w-full py-5 bg-zinc-800 border border-white/5 text-white font-black rounded-3xl hover:bg-zinc-700 active:scale-95 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
              >
                <Key size={18} className="text-blue-400" />
                Input License
              </button>
            </div>

            <button 
              onClick={() => setShowSubOptions(false)}
              className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>

        <LicenseActivationModal 
          isOpen={showActivation} 
          onClose={() => setShowActivation(false)}
          onActivated={() => {
            onUpgrade();
            onClose();
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.1)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white bg-zinc-800/50 rounded-xl border border-white/5 transition-all"
          >
            <X size={20} />
          </button>

          <div className="p-8 pt-12 text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
                <Star size={12} className="text-accent fill-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">Upgrade to Nexus Premium</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Unleash Full Potential</h2>
              <p className="text-zinc-500 text-sm font-medium">Unlock advanced neural tools and elite automation protocols.</p>
            </div>

            <div className="space-y-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl text-left border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="p-2.5 bg-zinc-900 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{f.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium leading-tight">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <button 
                onClick={() => setShowSubOptions(true)}
                className="w-full py-5 bg-accent text-black font-black rounded-3xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
              >
                <Star size={18} />
                Upgrade Premium
              </button>
            </div>
          </div>
        </div>
      </div>

      <LicenseActivationModal 
        isOpen={showActivation} 
        onClose={() => setShowActivation(false)}
        onActivated={() => {
          onUpgrade();
          onClose();
        }}
      />
    </>
  );
};

export default PremiumModal;
