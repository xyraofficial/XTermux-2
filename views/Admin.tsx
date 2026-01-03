import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { 
  Shield, Users, Database, AlertTriangle, Loader2, 
  ChevronRight, Lock, UserPlus, Trash2, HardDrive, 
  Activity, Search as SearchIcon, Key, ArrowLeft
} from 'lucide-react';
import { showToast } from '../components/Toast';

const AdminView: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'audit' | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', username: '', role: 'user' });
  const [systemLogs, setSystemLogs] = useState<any[]>([
    { id: 1, type: 'AUTH', message: 'Login Attempt: admin_root', time: '2 mins ago', color: 'text-yellow-500' },
    { id: 2, type: 'SYS', message: 'DB Connection Refreshed', time: '5 mins ago', color: 'text-blue-500' },
    { id: 3, type: 'SEC', message: 'New Device Registered', time: '12 mins ago', color: 'text-accent' },
    { id: 4, type: 'AUTH', message: 'Failed password attempt: user_88', time: '20 mins ago', color: 'text-red-500' },
  ]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if (error) throw error;
          
          const isUserAdmin = profile?.role === 'admin';
          setIsAdmin(isUserAdmin);
          
          if (isUserAdmin) {
            fetchUsers();
            // Fetch real system logs if table exists, else keep mock
            fetchSystemLogs();
          }
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Admin check error:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
      if (profilesError) throw profilesError;

      if (profiles) {
        const sortedData = [...profiles].sort((a: any, b: any) => {
          const dateA = new Date(a.updated_at || 0).getTime();
          const dateB = new Date(b.updated_at || 0).getTime();
          return dateB - dateA;
        });
        setUsers(sortedData);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      showToast('Failed to fetch users', 'error');
    }
  };

  const fetchSystemLogs = async () => {
    // Optionally fetch from an audit_logs table if you have one
    // For now, we'll enhance the mock data with a timestamp
    setSystemLogs(prev => prev.map(log => ({ ...log, time: new Date().toLocaleTimeString() })));
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      showToast(`Role updated to ${newRole}`, 'success');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Error updating role', 'error');
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.password) {
        showToast('Email and password are required', 'error');
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: { data: { username: newUser.username } }
      });
      if (error) throw error;
      
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: newUser.username || newUser.email.split('@')[0],
          email: newUser.email, // Store email in profile table
          role: newUser.role
        });
      }
      
      showToast('User created successfully', 'success');
      setShowAddUser(false);
      setNewUser({ email: '', password: '', username: '', role: 'user' });
      fetchUsers();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: isBlocked ? 'blocked' : 'user' }).eq('id', userId);
      if (error) throw error;
      showToast(isBlocked ? 'User blocked' : 'User unblocked', 'success');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handlePermanentDelete = async (userId: string) => {
    if (!confirm('PERMANENT DELETE? This cannot be undone from the profiles table.')) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      showToast('Profile deleted permanently', 'success');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-black">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );

  if (!isAdmin) return (
    <div className="h-full flex flex-col items-center justify-center bg-black p-6 text-center space-y-4">
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500">
        <Shield size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-white uppercase tracking-tight">Access Denied</h2>
        <p className="text-sm text-zinc-500 max-w-xs">You do not have administrative privileges to access this neural sector.</p>
      </div>
    </div>
  );

  if (activeTab === 'users') {
    const filteredUsers = users.filter(u => 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="p-6 space-y-6 pb-32 bg-black min-h-full overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between">
          <button onClick={() => setActiveTab(null)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </button>
          <button 
            onClick={() => setShowAddUser(true)}
            className="px-4 py-2 bg-accent text-black text-[10px] font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <UserPlus size={14} /> Add User
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase">Neural Registry</h2>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">System User Management</p>
        </div>

        <div className="relative">
          <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="SEARCH IDENTITY..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white placeholder:text-zinc-700 focus:border-accent/30 outline-none transition-all"
          />
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <Users size={20} className="text-zinc-600" />
                    )}
                    {user.role === 'admin' && <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-zinc-900 shadow-blue-500 shadow-sm" />}
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1 uppercase italic">
                      {user.username || 'Anonymous'}
                      {user.role === 'admin' && <Shield size={10} className="text-blue-500" />}
                    </div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase">{user.email || 'Identity Masked'}</div>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                  user.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 
                  user.role === 'blocked' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {user.role || 'USER'}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button 
                  onClick={() => {
                    const newRole = prompt('Role (admin/user/blocked):', user.role || 'user');
                    if (newRole) handleUpdateRole(user.id, newRole);
                  }}
                  className="flex-1 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center justify-center gap-2 transition-all"
                >
                  <Key size={12} /> Role
                </button>
                <button 
                  onClick={() => handleBlockUser(user.id, user.role !== 'blocked')}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    user.role === 'blocked' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  <Lock size={12} /> {user.role === 'blocked' ? 'Unblock' : 'Block'}
                </button>
                <button 
                  onClick={() => handlePermanentDelete(user.id)}
                  className="p-2 bg-red-500/5 hover:bg-red-500/20 rounded-xl text-red-500/50 hover:text-red-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase italic">Add Neural User</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Register New Identity</p>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-accent/30"
                />
                <input 
                  type="password" 
                  placeholder="SECURE PASSWORD" 
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-accent/30"
                />
                <input 
                  type="text" 
                  placeholder="USERNAME" 
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-accent/30"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowAddUser(false)} className="flex-1 py-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                <button 
                  onClick={handleAddUser} 
                  disabled={loading}
                  className="flex-1 py-4 bg-accent text-black text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'audit') {
    return (
      <div className="p-6 space-y-6 pb-32 bg-black min-h-full overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-300">
        <button onClick={() => setActiveTab(null)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Control</span>
        </button>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase">Security Audit</h2>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Neural System Logs</p>
        </div>
        <div className="space-y-2">
          {systemLogs.map((log) => (
            <div key={log.id} className="p-4 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase ${log.color}`}>[{log.type}]</span>
                <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">{log.time}</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">{log.message}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-32 bg-black min-h-full overflow-y-auto no-scrollbar">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">TEMPA (ADMIN)</h1>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Central System Control</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* User Management */}
        <button 
          onClick={() => setActiveTab('users')}
          className="w-full text-left bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] space-y-6 transition-all hover:border-accent/30 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-2xl text-accent"><Users size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">User Management</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Manage Roles & Access</p>
              </div>
            </div>
            <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><ChevronRight size={18} /></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
              <div className="text-xl font-black text-white">{users.length}</div>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Users</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
              <div className="text-xl font-black text-accent">Active</div>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</span>
            </div>
          </div>
        </button>

        {/* System Resources */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] space-y-6 transition-all hover:border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Database size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">System Resources</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">DB & Storage Control</p>
              </div>
            </div>
            <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><HardDrive size={18} /></div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <HardDrive size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Database Status</span>
              </div>
              <span className="text-[9px] font-black text-green-500 uppercase">Optimal</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">System Load</span>
              </div>
              <span className="text-[9px] font-black text-blue-400 uppercase">12%</span>
            </div>
          </div>
        </div>

        {/* Audit Control */}
        <button 
          onClick={() => setActiveTab('audit')}
          className="w-full text-left bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] space-y-6 transition-all hover:border-yellow-500/30 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500"><AlertTriangle size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Audit Control</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Security Logs</p>
              </div>
            </div>
            <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400"><SearchIcon size={18} /></div>
          </div>

          <div className="bg-black/50 rounded-2xl p-4 font-mono text-[9px] space-y-2 border border-white/5">
            {systemLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="flex items-center gap-2 text-zinc-600">
                <span className={log.color}>[{log.type}]</span> {log.message}
              </div>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminView;