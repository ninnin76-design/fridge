
import React, { useState } from 'react';
import { X, Clipboard, Check, AlertCircle, Utensils, Package, Upload, Copy, Share2, Info } from 'lucide-react';
import { Ingredient } from '../types';

interface Props {
  onClose: () => void;
  onImport: (ingredients: Ingredient[], basicSeasonings?: string[]) => void;
  ingredients: Ingredient[];
  basicSeasonings: string[];
}

export const DataSyncModal: React.FC<Props> = ({ onClose, onImport, ingredients, basicSeasonings }) => {
  // Default to IMPORT if user has no ingredients, otherwise EXPORT
  const [activeTab, setActiveTab] = useState<'EXPORT' | 'IMPORT'>(
    ingredients.length > 0 ? 'EXPORT' : 'IMPORT'
  );
  
  // Import State
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ingredients: Ingredient[], seasonings: string[]} | null>(null);
  const [textCode, setTextCode] = useState('');
  
  // Export State
  const [copySuccess, setCopySuccess] = useState(false);

  // --- Import Logic ---
  const handleCodeSubmit = () => {
      if (!textCode.trim()) {
          setError("코드를 입력해주세요.");
          return;
      }

      try {
          const parsed = JSON.parse(textCode);
          let ings: Ingredient[] = [];
          let seas: string[] = [];

          // Handle minified format { i: [{n,s,c}], b: [] }
          if (parsed.i && Array.isArray(parsed.i)) {
              ings = parsed.i.map((item: any) => ({
                  id: `imported-${Date.now()}-${Math.random()}`,
                  name: item.n,
                  storage: item.s,
                  category: item.c,
                  quantity: '',
                  isAlwaysAvailable: false
              }));
          }
          if (parsed.b && Array.isArray(parsed.b)) {
              seas = parsed.b;
          }

          // Fallback to standard JSON
          if (!parsed.i && Array.isArray(parsed)) {
               ings = parsed.map((item:any) => ({...item, quantity: ''}));
          } else if (!parsed.i && parsed.ingredients) {
               ings = parsed.ingredients.map((item:any) => ({...item, quantity: ''}));
               seas = parsed.basicSeasonings || [];
          }

          if (ings.length === 0 && seas.length === 0) {
              setError("올바른 데이터 코드가 아닙니다.");
              return;
          }

          setPreviewData({ ingredients: ings, seasonings: seas });
          setError(null);
      } catch (e) {
          setError("코드를 해석할 수 없습니다. 정확히 복사했는지 확인해주세요.");
      }
  };

  const handleConfirmImport = () => {
    if (previewData) {
      onImport(previewData.ingredients, previewData.seasonings);
      onClose();
    }
  };

  // --- Export Logic ---
  const getExportData = () => {
      return JSON.stringify({
        i: ingredients.map(ing => ({
            n: ing.name,
            s: ing.storage,
            c: ing.category
        })),
        b: basicSeasonings
      });
  };

  const handleCopyCode = async () => {
    try {
        const code = getExportData();
        await navigator.clipboard.writeText(code);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
        alert('복사에 실패했습니다. 텍스트를 직접 복사해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Share2 size={20} /> 데이터 동기화
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 shrink-0">
          <button
            onClick={() => setActiveTab('EXPORT')}
            className={`flex-1 py-3 text-sm font-bold transition-all rounded-lg flex items-center justify-center gap-2 ${
              activeTab === 'EXPORT' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Upload size={16} /> 보내기
          </button>
          <button
            onClick={() => setActiveTab('IMPORT')}
            className={`flex-1 py-3 text-sm font-bold transition-all rounded-lg flex items-center justify-center gap-2 ${
              activeTab === 'IMPORT' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clipboard size={16} /> 받기
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            
            {/* --- EXPORT TAB --- */}
            {activeTab === 'EXPORT' && (
                <div className="animate-fade-in space-y-6">
                    <div className="text-center">
                        <p className="text-slate-800 font-bold text-lg mb-2">내 냉장고 데이터 보내기</p>
                        <p className="text-sm text-slate-500">
                            아래 버튼을 눌러 데이터를 복사한 후,<br/>
                            카카오톡으로 공유해주세요.
                        </p>
                    </div>

                    <button 
                      onClick={handleCopyCode}
                      className="w-full bg-indigo-50 border-2 border-indigo-100 p-6 rounded-2xl flex flex-col items-center gap-3 hover:bg-indigo-100 transition-colors group active:scale-[0.98]"
                    >
                        <div className={`p-4 rounded-full transition-all duration-300 ${copySuccess ? 'bg-green-500 text-white scale-110' : 'bg-indigo-500 text-white group-hover:scale-110'}`}>
                            {copySuccess ? <Check size={32} /> : <Copy size={32} />}
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold text-indigo-900 text-lg">
                                {copySuccess ? "복사되었습니다!" : "텍스트 코드 복사하기"}
                            </h4>
                            <p className="text-indigo-600 text-xs mt-1">
                                {copySuccess ? "카카오톡에 붙여넣기 하세요" : "터치하여 복사"}
                            </p>
                        </div>
                    </button>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600">
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                           <Info size={16}/> 공유 현황
                        </h4>
                        <ul className="space-y-1 text-xs">
                           <li className="flex justify-between">
                               <span>총 냉장고 재료:</span>
                               <span className="font-bold">{ingredients.length}개</span>
                           </li>
                           <li className="flex justify-between">
                               <span>총 기본 양념:</span>
                               <span className="font-bold">{basicSeasonings.length}개</span>
                           </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* --- IMPORT TAB --- */}
            {activeTab === 'IMPORT' && (
                <>
                  {!previewData && (
                      <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                          <div className="w-full">
                              <p className="text-slate-800 font-bold text-lg mb-2 text-center">공유받은 데이터 넣기</p>
                              <p className="text-xs text-slate-500 mb-4 text-center">
                                  카톡으로 받은 긴 코드를 복사해서<br/>아래 상자에 붙여넣기 하세요.
                              </p>
                              <textarea
                                  value={textCode}
                                  onChange={(e) => setTextCode(e.target.value)}
                                  placeholder='여기에 붙여넣기 (꾹 눌러서 붙여넣기)'
                                  className="w-full h-40 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none mb-4 resize-none"
                              ></textarea>
                              <button 
                                  onClick={handleCodeSubmit}
                                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
                              >
                                  데이터 확인하기
                              </button>
                          </div>
                      </div>
                  )}

                  {error && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm font-bold mb-4 animate-fade-in">
                          <AlertCircle size={18} className="shrink-0 mt-0.5" />
                          {error}
                      </div>
                  )}

                  {previewData && (
                      <div className="animate-fade-in">
                           <div className="bg-green-50 p-4 rounded-xl mb-4 border border-green-100">
                              <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-2">
                                  <Check size={18} />
                                  데이터 분석 완료!
                              </div>
                              <div className="flex gap-4 text-sm">
                                  <div className="flex-1 bg-white p-2 rounded-lg border border-green-100 text-center shadow-sm">
                                      <span className="block text-2xl font-black text-slate-800">{previewData.ingredients.length}</span>
                                      <span className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1">
                                          <Package size={12} /> 냉장고 재료
                                      </span>
                                  </div>
                                  <div className="flex-1 bg-white p-2 rounded-lg border border-green-100 text-center shadow-sm">
                                      <span className="block text-2xl font-black text-slate-800">{previewData.seasonings.length}</span>
                                      <span className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1">
                                          <Utensils size={12} /> 기본 양념
                                      </span>
                                  </div>
                              </div>
                           </div>
                           
                           {(previewData.ingredients.length > 0 || previewData.seasonings.length > 0) ? (
                               <div className="max-h-[30vh] overflow-y-auto border border-slate-100 rounded-lg bg-slate-50 custom-scrollbar shadow-inner">
                                  {previewData.seasonings.map((s, idx) => (
                                      <div key={`seasoning-${idx}`} className="flex justify-between p-3 border-b border-slate-100 bg-white text-sm first:rounded-t-lg">
                                          <span className="font-bold text-amber-700 flex items-center gap-1.5">
                                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                              {s}
                                          </span>
                                          <span className="text-amber-500 text-[10px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-medium">기본양념</span>
                                      </div>
                                  ))}
                                  {previewData.ingredients.map((ing, idx) => (
                                      <div key={idx} className="flex justify-between p-3 border-b border-slate-100 bg-white text-sm first:rounded-t-lg">
                                          <span className="font-bold text-slate-700">{ing.name}</span>
                                      </div>
                                  ))}
                               </div>
                           ) : (
                               <div className="text-center py-8 text-slate-400 text-sm mb-4 bg-slate-50 rounded-lg">
                                   데이터가 비어있습니다.
                               </div>
                           )}
                      </div>
                  )}
                </>
            )}
        </div>

        {/* Footer Actions - Only for Import Preview Mode */}
        {activeTab === 'IMPORT' && previewData && (
             <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex flex-col gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <button
                    onClick={handleConfirmImport}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
                >
                    내 냉장고에 적용하기
                </button>
                
                <button
                    onClick={() => { setPreviewData(null); setError(null); }}
                    className="w-full text-slate-400 py-3 font-medium text-sm hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    취소하고 다시 입력
                </button>
             </div>
        )}
      </div>
    </div>
  );
};
