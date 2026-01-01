import React, { useState, useEffect } from 'react';
import { User, Calendar, Camera, Shield, Bell, Smartphone } from 'lucide-react';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('X-User');
  const [avatar, setAvatar] = useState('');

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
              <h2 className="text-xl font-black uppercase tracking-tight">{username}</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">guest@xtermux.local</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
              <Calendar className="text-accent" size={20} />
              <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Initialization</p>
                <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl flex items-center gap-4">
              <Shield className="text-blue-400" size={20} />
              <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Security Status</p>
                <p className="text-sm font-bold text-green-500">Local Only</p>
              </div>
            </div>
          </div>
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

        <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">XTermux Anonymous Mode v1.0</p>
      </div>
    </div>
  );
};

export default Profile;
