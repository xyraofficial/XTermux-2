import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Lock, Loader2, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { showToast } from '../components/Toast';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setCompleted(true);
      showToast('Password updated successfully!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 animate-fade-in">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl text-center space-y-4">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
            <CheckCircle2 className="text-green-500" size={40} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Success!</h2>
          <p className="text-zinc-500 text-sm">Your password has been updated. Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl">
        <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent/20">
          <KeyRound className="text-accent" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 text-center">
          Update Password
        </h2>
        <p className="text-zinc-500 text-center text-xs uppercase tracking-widest mb-8">
          Enter your new password below
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-accent transition-all"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            UPDATE PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
