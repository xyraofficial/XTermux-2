import React, { useState, useEffect } from 'react';
import { Shield, Plus, Key, Calendar, User as UserIcon, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';
import { showToast } from '../components/Toast';

const Admin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [days, setDays] = useState('30');
  const [recentLicenses, setRecentLicenses] = useState<any[]>([]);

  useEffect(() => {
    checkAdmin();
    fetchRecentLicenses();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setIsAdmin(profile?.role === 'admin');
    }
  };

  const fetchRecentLicenses = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('username, license_key, license_expiry, email')
      .not('license_key', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(5);
    if (data) setRecentLicenses(data);
  };

  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = 'XTX-';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 3) key += '-';
    }
    setLicenseKey(key);
  };

  const handleCreateLicense = async () => {
    if (!licenseKey) {
      showToast('Generate a key first', 'error');
      return;
    }
    setLoading(true);
    showToast('Key generated: ' + licenseKey, 'success');
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  if (!isAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black p-6 text-center">
        <Shield size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-black text-white uppercase italic">Access Denied</h2>
        <p className="text-zinc-500 text-sm mt-2">Restricted to System Administrators only.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 pb-32 bg-black min-h-full">
      <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Shield size={24} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">License Master</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Protocol Administration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Generate New Key</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={licenseKey}
                placeholder="Click Generate..."
                className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono text-sm outline-none"
              />
              <button 
                onClick={generateKey}
                className="p-4 bg-zinc-800 text-white rounded-2xl border border-white/5 active:scale-90 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Duration (Days)</label>
            <select 
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none appearance-none"
            >
              <option value="7">7 Days (Trial)</option>
              <option value="30">30 Days (Standard)</option>
              <option value="90">90 Days (Quarterly)</option>
              <option value="365">365 Days (Annual)</option>
            </select>
          </div>

          <button 
            onClick={handleCreateLicense}
            disabled={loading || !licenseKey}
            className="w-full py-5 bg-red-500 text-white font-black rounded-3xl hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-500/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Key size={20} />}
            INITIALIZE LICENSE KEY
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-2">Recent Allocations</h3>
        <div className="space-y-3">
          {recentLicenses.map((lic, i) => (
            <div key={i} className="bg-zinc-900/30 border border-white/5 p-4 rounded-3xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                  <UserIcon size={18} className="text-zinc-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-white truncate">{lic.username || lic.email}</p>
                  <p className="text-[9px] font-mono text-zinc-500 truncate">{lic.license_key}</p>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard(lic.license_key)}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
          {recentLicenses.length === 0 && (
            <p className="text-center text-[10px] text-zinc-700 uppercase font-black py-8 tracking-widest">No Recent Activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
