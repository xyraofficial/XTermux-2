import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';
import { ViewState } from '../types';

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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-zinc-950 rounded-[1.5rem] flex items-center justify-center border border-zinc-800 shadow-xl mb-6">
                <Loader2 size={40} className="text-accent animate-spin" />
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Verifying Account</h1>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Inisiasi data verifikasi...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-500/10 rounded-[1.5rem] flex items-center justify-center border border-green-500/20 shadow-xl mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Email Confirmed</h1>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-8">Akun Anda telah berhasil diverifikasi.</p>
              
              <button 
                onClick={() => onNavigate('HOME')}
                className="w-full bg-accent text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>MASUK KE DASHBOARD</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/10 rounded-[1.5rem] flex items-center justify-center border border-red-500/20 shadow-xl mb-6">
                <XCircle size={40} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Verification Failed</h1>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-8">Tautan verifikasi tidak valid atau telah kedaluwarsa.</p>
              
              <button 
                onClick={() => onNavigate('HOME')}
                className="w-full bg-zinc-800 text-white font-black py-4 rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <span>KEMBALI KE LOGIN</span>
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
