
import React from 'react';

interface IOSModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const IOSModal: React.FC<IOSModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Oke',
  cancelText = 'Batal'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[270px] bg-[#1c1c1e]/90 backdrop-blur-xl rounded-[14px] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 flex flex-col items-center text-center">
          <h3 className="text-[17px] font-semibold text-white leading-tight">{title}</h3>
          <p className="mt-1 text-[13px] text-white leading-tight">{message}</p>
        </div>
        
        <div className="flex border-t border-white/10 h-11">
          <button 
            onClick={onCancel}
            className="flex-1 text-[17px] text-[#0a84ff] font-normal border-r border-white/10 active:bg-white/5 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 text-[17px] text-[#0a84ff] font-semibold active:bg-white/5 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IOSModal;
