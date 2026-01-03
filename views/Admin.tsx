import React, { useState, useEffect } from 'react';
import { Shield, Plus, Key, Calendar, User as UserIcon, Loader2, Copy, Users, BarChart3, Bell, Trash2, Search, X } from 'lucide-react';
import { supabase } from '../supabase';
import { showToast } from '../components/Toast';

const Admin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'licenses' | 'users' | 'analytics'>('licenses');
  const [expiryType, setExpiryType] = useState<'duration' | 'custom'>('duration');
  const [customExpiry, setCustomExpiry] = useState('');
  
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

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [revokeConfirm, setRevokeConfirm] = useState<{show: boolean, lic: any}>({ show: false, lic: null });
  const [editDuration, setEditDuration] = useState<{show: boolean, lic: any, days: string, type: 'duration' | 'custom', customDate: string}>({ 
    show: false, 
    lic: null, 
    days: '',
    type: 'duration',
    customDate: ''
  });

  useEffect(() => {
    checkAdmin();
    if (activeTab === 'licenses') fetchRecentLicenses();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'analytics') fetchAnalytics();
  }, [activeTab]);

  const checkAdmin = async () => {
    setCheckingAuth(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setIsAdmin(profile?.role === 'admin');
      }
    } finally {
      setCheckingAuth(false);
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
    
    let duration_days = parseInt(days);
    let expires_at = null;

    if (expiryType === 'custom') {
      if (!customExpiry) {
        showToast('Set custom expiry date/time', 'error');
        return;
      }
      const expiryDate = new Date(customExpiry);
      if (expiryDate <= new Date()) {
        showToast('Expiry must be in the future', 'error');
        return;
      }
      expires_at = expiryDate.toISOString();
      // Calculate duration_days as a fallback or for display
      const diff = expiryDate.getTime() - new Date().getTime();
      duration_days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('licenses')
        .insert([{ 
          key: licenseKey, 
          duration_days,
          expires_at // We'll need to make sure this column exists or handle it
        }]);
      if (error) throw error;
      showToast('License key saved', 'success');
      setLicenseKey('');
      setCustomExpiry('');
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
      setRevokeConfirm({ show: false, lic: null });
      fetchRecentLicenses();
      if (activeTab === 'analytics') fetchAnalytics();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDuration = async () => {
    if (!editDuration.lic) return;
    
    let duration_days = parseInt(editDuration.days);
    let expires_at = null;

    if (editDuration.type === 'custom') {
      if (!editDuration.customDate) {
        showToast('Set custom expiry date/time', 'error');
        return;
      }
      const expiryDate = new Date(editDuration.customDate);
      if (expiryDate <= new Date()) {
        showToast('Expiry must be in the future', 'error');
        return;
      }
      expires_at = expiryDate.toISOString();
      const diff = expiryDate.getTime() - new Date().getTime();
      duration_days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('licenses')
        .update({ 
          duration_days,
          expires_at 
        })
        .eq('id', editDuration.lic.id);

      if (error) throw error;
      
      showToast('Protocol updated', 'success');
      setEditDuration({ 
        show: false, 
        lic: null, 
        days: '', 
        type: 'duration', 
        customDate: '' 
      });
      fetchRecentLicenses();
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

  if (checkingAuth) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black p-6">
        <Loader2 size={48} className="text-red-500 animate-spin mb-4" />
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] animate-pulse">Synchronizing Terminal...</p>
      </div>
    );
  }

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
              <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-2xl">
                <button 
                  onClick={() => setExpiryType('duration')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${expiryType === 'duration' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                >
                  Duration
                </button>
                <button 
                  onClick={() => setExpiryType('custom')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${expiryType === 'custom' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                >
                  Custom Date
                </button>
              </div>

              {expiryType === 'duration' ? (
                <select value={days} onChange={(e) => setDays(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none appearance-none">
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="365">365 Days</option>
                </select>
              ) : (
                <div className="space-y-2">
                  <input 
                    type="datetime-local" 
                    value={customExpiry}
                    onChange={(e) => setCustomExpiry(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none [color-scheme:dark]"
                  />
                </div>
              )}
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
                  <button 
                    onClick={() => setEditDuration({ 
                      show: true, 
                      lic: lic, 
                      days: lic.duration_days.toString(),
                      type: lic.expires_at ? 'custom' : 'duration',
                      customDate: lic.expires_at ? new Date(lic.expires_at).toISOString().slice(0, 16) : ''
                    })} 
                    className="p-2 text-zinc-500 hover:text-blue-500 transition-colors"
                  >
                    <Calendar size={16} />
                  </button>
                  <button onClick={() => copyToClipboard(lic.key)} className="p-2 text-zinc-500 hover:text-white transition-colors"><Copy size={16} /></button>
                  <button onClick={() => setRevokeConfirm({ show: true, lic: lic })} className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${user.is_premium ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-zinc-800'}`}>
                    <UserIcon size={18} className={user.is_premium ? 'text-yellow-500' : 'text-zinc-500'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-white group-hover:text-red-500 transition-colors">{user.username || 'Anonymous'}</p>
                      {user.is_premium && (
                        <span className="bg-yellow-500 text-black text-[7px] font-black px-1 rounded uppercase">Premium</span>
                      )}
                    </div>
                    <p className="text-[9px] text-zinc-500 font-mono italic">
                      {user.email || (user.username ? `${user.username.toLowerCase()}@xtermux.id` : 'No Identity')}
                    </p>
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

      {selectedUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-white uppercase tracking-tight italic">User Protocol</h3>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-black/40 p-4 rounded-3xl border border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
                  <UserIcon size={32} className={selectedUser.is_premium ? 'text-yellow-500' : 'text-zinc-500'} />
                </div>
                <div>
                  <p className="text-lg font-black text-white uppercase italic leading-tight">{selectedUser.username || 'Anonymous'}</p>
                  <p className="text-xs font-mono text-zinc-500 truncate">
                    {selectedUser.email || (selectedUser.username ? `${selectedUser.username.toLowerCase()}@xtermux.id` : 'N/A')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 p-4 rounded-3xl border border-white/5">
                  <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Status</p>
                  <p className={`text-[10px] font-black uppercase ${selectedUser.is_premium ? 'text-yellow-500' : 'text-green-500'}`}>
                    {selectedUser.is_premium ? 'Premium' : 'Free Member'}
                  </p>
                </div>
                <div className="bg-black/40 p-4 rounded-3xl border border-white/5">
                  <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Protocol</p>
                  <p className="text-[10px] font-black text-white uppercase">{selectedUser.role || 'User'}</p>
                </div>
              </div>

              {selectedUser.is_premium && (
                <div className="bg-blue-500/5 p-4 rounded-3xl border border-blue-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Key size={12} className="text-blue-500" />
                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Active License</p>
                  </div>
                  <p className="text-[10px] font-mono text-white bg-black/40 p-3 rounded-2xl border border-white/5 break-all">
                    {selectedUser.license_key || 'Manual Activation'}
                  </p>
                  {selectedUser.license_expiry && (
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar size={12} className="text-zinc-600" />
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                        Expiry: {new Date(selectedUser.license_expiry).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-black/40 p-4 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Neural ID</p>
                <p className="text-[9px] font-mono text-zinc-500 truncate">{selectedUser.id}</p>
              </div>

              <button 
                onClick={() => {
                  togglePremium(selectedUser.id, selectedUser.is_premium);
                  setSelectedUser(null);
                }}
                className={`w-full py-4 font-black rounded-3xl transition-all active:scale-95 text-[11px] uppercase tracking-widest ${selectedUser.is_premium ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
              >
                {selectedUser.is_premium ? 'Revoke Premium Access' : 'Grant Premium Access'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {revokeConfirm.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-red-500/20">
                <Trash2 size={32} className="text-red-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase italic">Revoke Access?</h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  Revoke premium for <span className="text-white font-mono">{revokeConfirm.lic.used_by_email || revokeConfirm.lic.key}</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setRevokeConfirm({ show: false, lic: null })}
                  className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-black rounded-3xl text-[11px] uppercase tracking-widest hover:bg-zinc-700 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleRemoveLicense(revokeConfirm.lic)}
                  disabled={loading}
                  className="flex-1 py-4 bg-red-500 text-white font-black rounded-3xl text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Oke'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Duration Modal */}
      {editDuration.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-white uppercase tracking-tight italic">License Protocol</h3>
                <button 
                  onClick={() => setEditDuration({ 
                    show: false, 
                    lic: null, 
                    days: '', 
                    type: 'duration', 
                    customDate: '' 
                  })} 
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[8px] font-black text-zinc-600 uppercase">Target Key</p>
                  <p className="text-xs font-mono text-white truncate">{editDuration.lic.key}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-2xl">
                    <button 
                      onClick={() => setEditDuration(prev => ({ ...prev, type: 'duration' }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${editDuration.type === 'duration' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                    >
                      Duration
                    </button>
                    <button 
                      onClick={() => setEditDuration(prev => ({ ...prev, type: 'custom' }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${editDuration.type === 'custom' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                    >
                      Custom Date
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase px-1">Adjustment</label>
                    {editDuration.type === 'duration' ? (
                      <select 
                        value={editDuration.days} 
                        onChange={(e) => setEditDuration(prev => ({ ...prev, days: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none appearance-none"
                      >
                        <option value="1">1 Day</option>
                        <option value="7">7 Days</option>
                        <option value="30">30 Days</option>
                        <option value="90">90 Days</option>
                        <option value="365">365 Days</option>
                      </select>
                    ) : (
                      <input 
                        type="datetime-local" 
                        value={editDuration.customDate}
                        onChange={(e) => setEditDuration(prev => ({ ...prev, customDate: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm outline-none [color-scheme:dark]"
                      />
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleUpdateDuration}
                  disabled={loading}
                  className="w-full py-4 bg-blue-500 text-white font-black rounded-3xl text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Calendar size={16} />} 
                  Update Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
