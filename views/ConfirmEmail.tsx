import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabase';

interface ConfirmEmailProps {
  onNavigate: (view: string) => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setStatus('error');
      } else {
        setStatus('success');
      }
    };

    handleEmailConfirmation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-in fade-in duration-700">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8 border border-accent/20">
                <Loader2 className="text-accent animate-spin" size={40} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Verifying Account</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">Please wait while we finalize your secure connection...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-24 h-24 bg-accent/20 rounded-[2rem] flex items-center justify-center mb-8 border-2 border-accent/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                <CheckCircle2 className="text-accent" size={48} />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Welcome Aboard!</h2>
              <p className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-6">Email Successfully Verified</p>
              <p className="text-zinc-400 text-sm leading-relaxed mb-10 px-4">
                Your XTermux account is now fully synced and ready for action. Dive into the toolbox and start exploring.
              </p>
              
              <button 
                onClick={() => onNavigate('HOME')}
                className="w-full bg-accent text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-3 group"
              >
                <span>LAUNCH TOOLBOX</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20">
                <ShieldCheck className="text-red-500" size={40} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Verification Issue</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">No confirmation session found. Please check your email link or try logging in again.</p>
              <button 
                onClick={() => onNavigate('HOME')}
                className="w-full bg-zinc-800 text-white font-black py-4 rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                BACK TO LOGIN
              </button>
            </>
          )}
        </div>
      </div>
      <p className="mt-8 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">XTermux • Neural Link Security</p>
    </div>
  );
};

export default ConfirmEmail;
