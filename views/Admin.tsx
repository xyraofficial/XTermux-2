import React, { useState, useEffect } from 'react';
import { Shield, Plus, Key, Calendar, User as UserIcon, Loader2, Copy, Users, BarChart3, Bell, Trash2, Search } from 'lucide-react';
import { supabase } from '../supabase';
import { showToast } from '../components/Toast';

const Admin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'licenses' | 'users' | 'analytics'>('licenses');
  
  // License State
  const [licenseKey, setLicenseKey] = useState('');
  const [days, setDays] = useState('30');
  const [recentLicenses, setRecentLicenses] = useState<any[]>([]);

  // Users State
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Analytics State
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalLicenses: 0,
    usedLicenses: 0
  });

  useEffect(() => {
    checkAdmin();
    if (activeTab === 'licenses') fetchRecentLicenses();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'analytics') fetchAnalytics();
  }, [activeTab]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setIsAdmin(profile?.role === 'admin');
    }
  };

  const fetchRecentLicenses = async () => {
    const { data } = await supabase
      .from('licenses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setRecentLicenses(data);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch user emails from auth.users via a secure RPC or profiles table if available
      // Note: In Supabase, auth.users is protected. We usually sync emails to profiles table.
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      
      const filteredData = (data || []).sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      setUsers(filteredData);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    const [uCount, pCount, lCount, ulCount] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
      supabase.from('licenses').select('*', { count: 'exact', head: true }),
      supabase.from('licenses').select('*', { count: 'exact', head: true }).eq('is_used', true)
    ]);
    
    setStats({
      totalUsers: uCount.count || 0,
      premiumUsers: pCount.count || 0,
      totalLicenses: lCount.count || 0,
      usedLicenses: ulCount.count || 0
    });
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
    try {
      const { error } = await supabase
        .from('licenses')
        .insert([{ key: licenseKey, duration_days: parseInt(days) }]);
      if (error) throw error;
      showToast('License key saved', 'success');
      setLicenseKey('');
      fetchRecentLicenses();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: !currentStatus })
      .eq('id', userId);
    if (!error) {
      showToast('User status updated', 'success');
      fetchUsers();
    }
  };

  const handleRemoveLicense = async (lic: any) => {
    // Custom beautiful confirmation dialog instead of window.confirm
    const confirmed = await new Promise((resolve) => {
      showToast(
        <div className="flex flex-col gap-3 p-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Trash2 size={16} className="text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-tight">Confirm Deletion</p>
              <p className="text-[8px] text-zinc-500 uppercase font-bold">This will revoke user premium</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { resolve(true); }}
              className="flex-1 py-2.5 bg-red-500 text-white text-[9px] font-black rounded-xl uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all"
            >
              Confirm Delete
            </button>
            <button 
              onClick={() => { resolve(false); }}
              className="flex-1 py-2.5 bg-zinc-800 text-zinc-400 text-[9px] font-black rounded-xl uppercase border border-white/5 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>,
        'info'
      );
    });

    if (!confirmed) return;
    
    setLoading(true);
    try {
      if (lic.is_used && lic.used_by) {
        await supabase
          .from('profiles')
          .update({ 
            is_premium: false, 
            license_key: null, 
            license_expiry: null 
          })
          .eq('id', lic.used_by);
      }

      const { error } = await supabase
        .from('licenses')
        .delete()
        .eq('id', lic.id);

      if (error) throw error;

      showToast('System Reset Complete', 'success');
      fetchRecentLicenses();
      if (activeTab === 'analytics') fetchAnalytics();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied', 'success');
  };

  if (!isAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black p-6 text-center">
        <Shield size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-black text-white uppercase italic">Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-32 bg-black min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Shield className="text-red-500" size={24} />
          <h1 className="text-xl font-black text-white uppercase italic">Admin Terminal</h1>
        </div>
        <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
          <button onClick={() => setActiveTab('licenses')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'licenses' ? 'bg-red-500 text-white' : 'text-zinc-500'}`}>Keys</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'users' ? 'bg-red-500 text-white' : 'text-zinc-500'}`}>Users</button>
          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'analytics' ? 'bg-red-500 text-white' : 'text-zinc-500'}`}>Stats</button>
        </div>
      </div>

      {activeTab === 'licenses' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase px-1">Generate Key</label>
                <div className="flex gap-2">
                  <input type="text" readOnly value={licenseKey} className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono text-sm" />
                  <button onClick={generateKey} className="p-4 bg-zinc-800 text-white rounded-2xl border border-white/5"><Plus size={20} /></button>
                </div>
              </div>
              <select value={days} onChange={(e) => setDays(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none">
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="365">365 Days</option>
              </select>
              <button onClick={handleCreateLicense} disabled={loading || !licenseKey} className="w-full py-5 bg-red-500 text-white font-black rounded-3xl flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Key size={20} />} CREATE LICENSE
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase px-2">Recent Keys</h3>
            {recentLicenses.map((lic, i) => (
              <div key={i} className="bg-zinc-900/30 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-white">{lic.key}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${lic.is_used ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-green-500/20 text-green-500 border border-green-500/30'}`}>
                      {lic.is_used ? 'Used' : 'Available'}
                    </span>
                    <p className="text-[9px] text-zinc-500 uppercase">
                      {lic.is_used ? `BY: ${lic.used_by_email || 'Unknown'}` : 'Unused'} • {lic.duration_days}D
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => copyToClipboard(lic.key)} className="p-2 text-zinc-500 hover:text-white"><Copy size={16} /></button>
                  <button onClick={() => handleRemoveLicense(lic)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white outline-none" 
            />
          </div>
          <div className="space-y-3">
            {users
              .filter(u => 
                !searchQuery || 
                (u.username?.toLowerCase().includes(searchQuery.toLowerCase())) || 
                (u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((user, i) => (
              <div key={i} className="bg-zinc-900/30 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.is_premium ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-zinc-800'}`}>
                    <UserIcon size={18} className={user.is_premium ? 'text-yellow-500' : 'text-zinc-500'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-white">{user.username || 'Anonymous'}</p>
                      {user.is_premium && (
                        <span className="bg-yellow-500 text-black text-[7px] font-black px-1 rounded uppercase">Premium</span>
                      )}
                    </div>
                    <p className="text-[9px] text-zinc-500 font-mono">{user.email || 'No Email'}</p>
                    {user.license_key && (
                      <p className="text-[8px] text-blue-400 font-mono uppercase mt-0.5">Key: {user.license_key}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => togglePremium(user.id, user.is_premium)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${user.is_premium ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                >
                  {user.is_premium ? 'Revoke' : 'Grant'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl space-y-1">
              <p className="text-[9px] font-black text-zinc-500 uppercase">Total Users</p>
              <p className="text-2xl font-black text-white italic">{stats.totalUsers}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl space-y-1">
              <p className="text-[9px] font-black text-zinc-500 uppercase">Premium</p>
              <p className="text-2xl font-black text-yellow-500 italic">{stats.premiumUsers}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl space-y-1">
              <p className="text-[9px] font-black text-zinc-500 uppercase">Total Keys</p>
              <p className="text-2xl font-black text-blue-500 italic">{stats.totalLicenses}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl space-y-1">
              <p className="text-[9px] font-black text-zinc-500 uppercase">Used Keys</p>
              <p className="text-2xl font-black text-green-500 italic">{stats.usedLicenses}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
