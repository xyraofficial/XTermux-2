import React, { useState } from 'react';
import { X, Key, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { showToast } from './Toast';

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated: () => void;
}

const LicenseActivationModal: React.FC<LicenseActivationModalProps> = ({ isOpen, onClose, onActivated }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      showToast('Please enter a license key', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if license exists and is not used
      const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .select('*')
        .eq('key', licenseKey.trim())
        .eq('is_used', false)
        .single();

      if (licenseError || !license) {
        throw new Error('Invalid or already used license key');
      }

      // 1. Mark license as used
      const { error: updateLicenseError } = await supabase
        .from('licenses')
        .update({ 
          is_used: true, 
          used_by: user.id,
          used_by_email: user.email,
          used_at: new Date().toISOString()
        })
        .eq('id', license.id);

      if (updateLicenseError) throw updateLicenseError;

      // 2. Update user profile to premium
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + license.duration_days);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true, 
          license_key: licenseKey.trim(),
          license_expiry: expiryDate.toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      showToast('License activated successfully!', 'success');
      onActivated();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Activation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Key size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Activate License</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">License Key</label>
            <input 
              type="text" 
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          <button 
            onClick={handleActivate}
            disabled={loading}
            className="w-full py-5 bg-blue-500 text-white font-black rounded-3xl hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
            ACTIVATE PROTOCOL
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseActivationModal;
