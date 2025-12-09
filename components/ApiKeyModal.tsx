
import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { CustomKeyIcon } from './CustomKeyIcon';
import { validateApiKey } from '../services/geminiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('user_gemini_api_key');
      if (storedKey) setApiKey(storedKey);
    }
  }, [isOpen]);

  const handleSave = async () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      alert('API 키를 입력해주세요.');
      return;
    }

    if (trimmedKey.length < 15) {
      alert('API 키가 너무 짧습니다 (최소 15자).');
      setApiKey(''); // Clear input
      return;
    }

    setIsValidating(true);
    try {
        // [CHECKPOINT] This MUST return true from the service before proceeding.
        const isValid = await validateApiKey(trimmedKey);
        
        if (isValid) {
            localStorage.setItem('user_gemini_api_key', trimmedKey);
            onSave(trimmedKey);
            onClose();
            alert('API 키가 확인되었습니다! 안전하게 저장되었습니다.');
        } else {
            alert('유효하지 않은 API 키입니다.\n키 값을 다시 확인해주세요.');
            setApiKey(''); // Clear input on failure
        }
    } catch (e) {
        alert('API 키 확인 중 오류가 발생했습니다.');
        setApiKey(''); // Clear input on error
    } finally {
        setIsValidating(false);
    }
  };

  const handleClear = () => {
    if (!window.confirm('정말 API 키를 삭제하시겠습니까?')) return;

    // 1. Remove from storage
    localStorage.removeItem('user_gemini_api_key');
    
    // 2. Clear local state
    setApiKey('');
    
    // 3. Update parent state
    onSave(''); 
    
    // 4. Close modal
    onClose();
    
    alert('API 키가 삭제되었습니다.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CustomKeyIcon size={20} /> AI 셰프 설정
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-sm text-indigo-800 leading-relaxed">
            <h3 className="font-bold flex items-center gap-2 mb-2 text-indigo-900">
                <AlertCircle size={16} /> 개인 API 키란?
            </h3>
            <p>
                본인의 <strong>Google Gemini API Key</strong>를 입력하면, 공공데이터 대신 최신 AI가 더 창의적이고 맞춤화된 레시피를 추천해줍니다.
            </p>
            <p className="mt-2 text-xs text-indigo-600">
                * 입력한 키는 <strong>오직 사용자님의 기기(브라우저)에만 저장</strong>되며, 어디로도 전송되지 않아 안전합니다.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
              Gemini API Key
            </label>
            <div className="relative">
                <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AI Studio에서 발급받은 키 입력"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-mono text-sm"
                />
                <CustomKeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            <div className="mt-2 text-right">
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-indigo-500 underline hover:text-indigo-700">
                    API 키 발급받기 (Google AI Studio)
                </a>
            </div>
          </div>

          <div className="flex gap-2">
            {apiKey && (
                 <button
                 onClick={handleClear}
                 disabled={isValidating}
                 className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
               >
                 삭제
               </button>
            )}
            <button
              onClick={handleSave}
              disabled={isValidating}
              className="flex-[2] py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-slate-500"
            >
              {isValidating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  확인 중...
                </>
              ) : (
                <>
                  <Check size={18} />
                  저장 및 사용
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
