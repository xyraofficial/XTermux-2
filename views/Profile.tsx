import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Camera, LogOut, Save, Loader2, Shield, Bell, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Toast';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username, avatar })
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const data = await response.json();
      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
      // Refresh user data or local storage if needed
      if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('storage'));
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 pb-32">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="relative group">
          <div className="h-32 w-full bg-gradient-to-r from-accent/20 to-accent/5 rounded-3xl border border-zinc-800" />
          <div className="absolute -bottom-10 left-8">
            <div className="relative">
              <div className="w-24 h-24 bg-zinc-900 rounded-3xl border-4 border-zinc-950 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-zinc-600" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-accent text-black rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">{user.username || 'Anonymous User'}</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Identity'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Codename</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-accent/40 transition-all"
                  placeholder="New Username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Avatar Matrix (URL)</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-accent/40 transition-all"
                  placeholder="https://..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-black font-black uppercase py-4 rounded-2xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Sync Changes</>}
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
                <Calendar className="text-accent" size={20} />
                <div>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Initialization</p>
                  <p className="text-sm font-bold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
                <Shield className="text-blue-400" size={20} />
                <div>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Security Status</p>
                  <p className="text-sm font-bold text-green-500">Encrypted</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest p-6 pb-2">Interface Preferences</h3>
          <div className="divide-y divide-zinc-800">
            <button className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <Bell className="text-orange-400" size={20} />
                <span className="text-sm font-bold">Push Notifications</span>
              </div>
              <div className="w-10 h-6 bg-zinc-800 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-600 rounded-full" />
              </div>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <Smartphone className="text-purple-400" size={20} />
                <span className="text-sm font-bold">Auto-Sync Tools</span>
              </div>
              <div className="w-10 h-6 bg-accent rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
              </div>
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <button
          onClick={logout}
          className="w-full bg-zinc-900 border border-zinc-800 text-red-500 font-black uppercase py-5 rounded-3xl shadow-xl hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center gap-3"
        >
          <LogOut size={20} />
          Terminate Session
        </button>

        <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">XTermux User Management System v1.0</p>
      </div>
    </div>
  );
};

export default Profile;
