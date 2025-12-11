import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Sparkles } from 'lucide-react';
import { SaltShakerIcon } from './SaltShakerIcon';
import { DEFAULT_BASIC_SEASONINGS } from '../constants';

interface Props {
  seasonings: string[];
  onUpdate: (seasonings: string[]) => void;
  onClose: () => void;
}

// Extended list of common items for suggestions
const COMMON_SUGGESTIONS = Array.from(new Set([
  ...DEFAULT_BASIC_SEASONINGS,
  // Add common staples that are NOT in the default list but user might want
  "굴소스", "칠리소스", "머스타드", "와사비", "겨자", 
  "쌈장", "초고추장", "매실청", "다시다", "미원", "치킨스톡",
  "버터", "치즈", "카레가루", "짜장가루", "파슬리", "바질", 
  "돈까스소스", "스테이크소스", "스파게티소스", "연두"
]));

export const BasicSeasoningManager: React.FC<Props> = ({ seasonings, onUpdate, onClose }) => {
  const [newSeasoning, setNewSeasoning] = useState('');

  const handleAdd = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !seasonings.includes(trimmed)) {
      onUpdate([...seasonings, trimmed]);
      setNewSeasoning('');
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAdd(newSeasoning);
  };

  const handleDelete = (item: string) => {
    onUpdate(seasonings.filter(s => s !== item));
  };

  // Filter suggestions that are not already in the list
  const availableSuggestions = COMMON_SUGGESTIONS.filter(s => !seasonings.includes(s));

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">기본 재료/양념 관리</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-lg mx-auto w-full">
        <div className="bg-amber-50 rounded-xl p-4 mb-6 text-amber-800 text-sm leading-relaxed border border-amber-100">
          <p className="font-bold flex items-center gap-2 mb-1">
            <SaltShakerIcon size={16} />
            기본 재료란?
          </p>
          설탕, 소금, 간장, 식용유 등 <strong>"항상 구비해두는"</strong> 양념이나 기초 식재료입니다. 
          매번 재료로 등록할 필요 없이 이곳에 한 번만 저장해두면, 요리 추천 시 자동으로 보유한 것으로 처리됩니다.
        </div>

        {/* Input Form */}
        <form onSubmit={onSubmit} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newSeasoning}
            onChange={(e) => setNewSeasoning(e.target.value)}
            placeholder="이름 직접 입력 (예: 트러플오일)"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 rounded-xl font-bold shadow-md active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        </form>

        {/* Current List */}
        <div className="mb-10">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            나의 기본 저장소 <span className="text-indigo-600 text-sm bg-indigo-50 px-2 py-0.5 rounded-full">{seasonings.length}</span>
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {seasonings.map((item) => (
              <div 
                key={item}
                className="group flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm hover:border-indigo-300 transition-colors"
              >
                <span className="font-medium text-slate-700">{item}</span>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {seasonings.length === 0 && (
              <div className="w-full text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                등록된 기본 재료가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {availableSuggestions.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
              <Sparkles size={16} className="text-amber-500" />
              자주 쓰는 재료 추천 (터치하여 추가)
            </h2>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleAdd(item)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-colors active:scale-95"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};