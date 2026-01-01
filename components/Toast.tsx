
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastEvent {
  message: string;
  type: ToastType;
}

// Helper function to trigger toast from anywhere
export const showToast = (message: string, type: ToastType = 'success') => {
  const event = new CustomEvent('xtermux-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<{id: number, message: string, type: ToastType}[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastEvent>).detail;
      const id = Date.now();
      
      setToasts(prev => {
        // Prevent duplicate messages appearing at the same time
        if (prev.some(t => t.message === detail.message)) return prev;
        // Limit total active toasts to 1 for cleaner look on mobile
        return [{ ...detail, id }];
      });
      
      // Auto dismiss
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    window.addEventListener('xtermux-toast', handleToast);
    return () => window.removeEventListener('xtermux-toast', handleToast);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map(t => (
        <div 
            key={t.id} 
            className="pointer-events-auto relative overflow-hidden bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black rounded-2xl py-3 px-4 flex items-center gap-3 w-full max-w-[320px] animate-in slide-in-from-top-4 fade-in duration-300"
        >
            <div className={`p-1.5 rounded-full shrink-0 ${
                t.type === 'success' ? 'bg-green-500/10 text-green-500' : 
                t.type === 'error' ? 'bg-red-500/10 text-red-500' : 
                'bg-blue-500/10 text-blue-500'
            }`}>
                {t.type === 'success' && <CheckCircle2 size={18} />}
                {t.type === 'error' && <AlertCircle size={18} />}
                {t.type === 'info' && <Info size={18} />}
            </div>
            
            <span className="text-[13px] font-semibold text-zinc-200 flex-1 leading-snug">{t.message}</span>
            
            <button 
                onClick={() => removeToast(t.id)}
                className="text-zinc-600 hover:text-zinc-400 p-1 rounded-full transition-colors"
            >
                <X size={16} />
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-[3px] bg-zinc-800 w-full">
                <div 
                    className={`h-full animate-progress origin-left ${
                         t.type === 'success' ? 'bg-green-500' : 
                         t.type === 'error' ? 'bg-red-500' : 
                         'bg-blue-500'
                    }`}
                    style={{ animationDuration: '4s', animationTimingFunction: 'linear', animationName: 'shrinkWidth' }}
                />
            </div>
            <style>{`
                @keyframes shrinkWidth {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
      ))}
    </div>
  );
};
