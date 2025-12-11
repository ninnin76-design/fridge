import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export const MessageModal: React.FC<Props> = ({ isOpen, message, onClose, type = 'info' }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-[90%] max-w-sm shadow-2xl overflow-hidden animate-bounce-in flex flex-col max-h-[60vh] my-auto" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center overflow-y-auto custom-scrollbar flex-1">
          <div className="mb-4 flex justify-center">
             {type === 'error' ? (
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 shrink-0">
                     <AlertCircle size={24} />
                 </div>
             ) : (
                 <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                     <CheckCircle size={24} />
                 </div>
             )}
          </div>
          
          <p className="text-slate-800 font-bold text-lg mb-2">알림</p>
          <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line break-keep break-words">
            {message}
          </p>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 shrink-0">
            <button 
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all"
            >
                확인
            </button>
        </div>
      </div>
    </div>
  );
};