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
  const [systemLogs, setSystemLogs] = useState<any[]>([
    { id: 1, type: 'AUTH', message: 'Login Attempt: admin_root', time: '2 mins ago', color: 'text-yellow-500' },
    { id: 2, type: 'SYS', message: 'DB Connection Refreshed', time: '5 mins ago', color: 'text-blue-500' },
    { id: 3, type: 'SEC', message: 'New Device Registered', time: '12 mins ago', color: 'text-accent' },
    { id: 4, type: 'AUTH', message: 'Failed password attempt: user_88', time: '20 mins ago', color: 'text-red-500' },
  ]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setIsAdmin(profile?.role === 'admin');
        if (profile?.role === 'admin') {
          fetchUsers();
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) {
      showToast('Error fetching users', 'error');
    } else if (data) {
      setUsers(data);
    }
  };

  const handleAction = async (action: string, targetId: string) => {
    if (action === 'Edit Role') {
      const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', targetId);
      if (error) showToast('Error updating role', 'error');
      else {
        showToast('Role updated to admin', 'success');
        fetchUsers();
      }
    } else if (action === 'Restrict Access') {
      const { error } = await supabase.from('profiles').update({ role: 'restricted' }).eq('id', targetId);
      if (error) showToast('Error restricting user', 'error');
      else {
        showToast('User access restricted', 'success');
        fetchUsers();
      }
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
    return (
      <div className="p-6 space-y-6 pb-32 bg-black min-h-full animate-in slide-in-from-right duration-300">
        <button onClick={() => setActiveTab(null)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Control</span>
        </button>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase">User Registry</h2>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Direct Access Control</p>
        </div>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Users size={18} className="text-zinc-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">{user.email || 'Anonymous'}</div>
                  <div className="text-[9px] font-black text-accent uppercase tracking-tighter">{user.role || 'user'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction('Edit Role', user.id)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400"><Key size={14} /></button>
                <button onClick={() => handleAction('Restrict Access', user.id)} className="p-2 bg-red-500/10 rounded-lg text-red-500"><Lock size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'audit') {
    return (
      <div className="p-6 space-y-6 pb-32 bg-black min-h-full animate-in slide-in-from-right duration-300">
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
    <div className="p-6 space-y-8 pb-32 bg-black min-h-full no-scrollbar">
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