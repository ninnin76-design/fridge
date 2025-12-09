
import React, { useState, useEffect } from 'react';
import { X, Check, Key, Trash2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { CustomKeyIcon } from './CustomKeyIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<Props> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInputKey(currentKey);
      setError(null);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedKey = inputKey.trim();
    
    if (!trimmedKey) {
      setError('API 키를 입력해주세요.');
      return;
    }

    // 기존의 AIza 시작 여부 검사 로직 제거 (다양한 키 형식 허용)
    onSave(trimmedKey);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('저장된 API 키를 삭제하시겠습니까?')) {
      onSave('');
      setInputKey('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CustomKeyIcon size={20} /> API 키 설정
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-800 leading-relaxed mb-6">
            <p>
                Google AI Studio에서 발급받은 <strong>Gemini API 키</strong>를 입력해주세요.
                <br/>
                입력한 키는 브라우저에만 저장됩니다.
            </p>
          </div>

          <div className="mb-2 relative">
             <div className="relative">
                <input 
                    type={showKey ? "text" : "password"}
                    value={inputKey}
                    onChange={(e) => {
                        setInputKey(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder="API Key 입력"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border ${error ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-slate-200 bg-slate-50 focus:border-indigo-500'} focus:ring-4 focus:ring-opacity-50 outline-none transition-all font-mono text-sm`}
                />
                <button 
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             </div>
             {error && (
                 <div className="flex items-center gap-1 text-red-500 text-xs mt-2 font-bold px-1">
                     <AlertCircle size={12} />
                     {error}
                 </div>
             )}
          </div>

          <div className="flex gap-2 mt-6">
            {currentKey && (
                <button
                    onClick={handleDelete}
                    className="flex-1 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold shadow-sm hover:bg-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Trash2 size={18} />
                    삭제
                </button>
            )}
            <button
              onClick={handleSave}
              className="flex-[2] py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              {currentKey ? '수정 완료' : '등록하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
