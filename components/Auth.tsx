import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Lock, Loader2, UserPlus, LogIn, Eye, EyeOff, KeyRound } from 'lucide-react';
import { showToast } from './Toast';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isResetting) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        showToast('Password reset link has been sent to your email!', 'success');
        setIsResetting(false);
      } else if (isSignUp) {
        // Supabase signUp returns success even if user exists for security (to prevent email enumeration)
        // unless you're using a specific configuration.
        // We'll try to detect if it's a silent "already exists" by checking the data.
        const { data, error } = await supabase.auth.signUp({ email, password });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            throw new Error('This email is already registered. Please sign in or reset your password.');
          }
          throw error;
        }

        // If data.user exists but data.session is null and identity is empty, 
        // it often means the user already exists (Supabase security feature)
        if (data.user && !data.session && data.user.identities && data.user.identities.length === 0) {
          throw new Error('This email is already registered. Please sign in or reset your password.');
        }

        showToast('Account created! Please check your email for confirmation.', 'success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Incorrect email or password. Please try again.');
          }
          throw error;
        }
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 text-center">
          {isResetting ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Welcome Back')}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-all"
              required
            />
          </div>
          {!isResetting && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-accent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {isResetting ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <KeyRound size={20} />}
              SEND RESET LINK
            </button>
          ) : (
            <>
              {!isSignUp && (
                <div className="flex justify-end pr-2">
                  <button
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-accent hover:text-accent/80 transition-colors text-[10px] font-bold uppercase tracking-widest"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />)}
                {isSignUp ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </>
          )}
        </form>
        
        <div className="mt-6 flex flex-col gap-3 text-center">
          <button
            onClick={() => {
              if (isResetting) {
                setIsResetting(false);
              } else {
                setIsSignUp(!isSignUp);
              }
            }}
            className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            {isResetting ? 'Back to Login' : (
              isSignUp ? (
                <>Already have an account? <span className="text-accent">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="text-accent">Sign Up</span></>
              )
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
