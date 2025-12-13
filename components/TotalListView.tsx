
import React, { useState } from 'react';
import { Ingredient, StorageType, Category } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS, STORAGE_LABELS } from '../constants';
import { Printer, ArrowLeft, Layers, Snowflake, Package, Loader2 } from 'lucide-react';
import { SaltShakerIcon } from './SaltShakerIcon';

interface Props {
  ingredients: Ingredient[];
  basicSeasonings: string[];
  onClose: () => void;
}

export const TotalListView: React.FC<Props> = ({ ingredients, basicSeasonings, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = () => {
    setIsPrinting(true);

    const userAgent = navigator.userAgent.toLowerCase();
    const isInApp = userAgent.includes('kakao') || 
                    userAgent.includes('naver') || 
                    userAgent.includes('instagram') || 
                    userAgent.includes('line');

    if (isInApp) {
      const proceed = window.confirm('현재 카카오톡/네이버 등 인앱 브라우저를 사용 중입니다.\n\n보안 정책상 인쇄/PDF 저장이 차단될 수 있습니다.\n\n가급적 크롬(Chrome)이나 사파리(Safari) 브라우저를 이용해주세요.\n\n그래도 시도하시겠습니까?');
      if (!proceed) {
          setIsPrinting(false);
          return;
      }
    }

    if (typeof window.print !== 'function') {
      alert('이 브라우저/기기에서는 인쇄 기능을 지원하지 않습니다.\n화면 캡쳐를 이용해주세요.');
      setIsPrinting(false);
      return;
    }
    
    setTimeout(() => {
        try {
            window.print();
        } catch (e) {
            console.error(e);
            alert('인쇄 명령을 실행하는 중 오류가 발생했습니다.');
        } finally {
            setIsPrinting(false);
        }
    }, 100);
  };

  // Predefined Category Order
  const categoryOrder = [
    Category.VEGETABLE, Category.FRUIT, Category.MEAT,
    Category.FISH, Category.DAIRY, Category.GRAIN,
    Category.PROCESSED, Category.SAUCE, Category.ETC
  ];

  const groupedData: Record<string, Record<string, Ingredient[]>> = {};

  categoryOrder.forEach(cat => {
    groupedData[cat] = {
      [StorageType.FRIDGE]: [],
      [StorageType.FREEZER]: [],
      [StorageType.PANTRY]: [],
    };
  });

  ingredients.forEach(ing => {
    const cat = ing.category || Category.ETC;
    if (!groupedData[cat]) {
      groupedData[cat] = {
        [StorageType.FRIDGE]: [],
        [StorageType.FREEZER]: [],
        [StorageType.PANTRY]: [],
      };
    }
    groupedData[cat][ing.storage].push(ing);
  });

  const activeCategories = categoryOrder.filter(cat => {
    const storageGroups = groupedData[cat];
    if (!storageGroups) return false;
    return Object.values(storageGroups).some(list => list.length > 0);
  });

  const hasIngredients = activeCategories.length > 0;
  const hasSeasonings = basicSeasonings.length > 0;

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const getStorageIcon = (type: StorageType) => {
    switch(type) {
      case StorageType.FRIDGE: return <Layers size={14} className="text-indigo-500" />;
      case StorageType.FREEZER: return <Snowflake size={14} className="text-blue-500" />;
      case StorageType.PANTRY: return <Package size={14} className="text-amber-500" />;
    }
  };

  const getStorageColor = (type: StorageType) => {
    switch(type) {
      case StorageType.FRIDGE: return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case StorageType.FREEZER: return "bg-blue-50 text-blue-700 border-blue-100";
      case StorageType.PANTRY: return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  // Helper to get item style based on storage
  const getItemStyle = (type: StorageType) => {
    switch(type) {
      case StorageType.FRIDGE: return "bg-indigo-50 text-indigo-800 border-indigo-100";
      case StorageType.FREEZER: return "bg-blue-50 text-blue-800 border-blue-100";
      case StorageType.PANTRY: return "bg-amber-50 text-amber-800 border-amber-100";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto flex flex-col">
      
      {/* Print Loading Toast */}
      {isPrinting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in no-print">
            <div className="bg-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                <Loader2 size={24} className="text-indigo-600 animate-spin" />
                <div>
                    <p className="font-bold text-slate-800">인쇄 미리보기 준비 중...</p>
                    <p className="text-xs text-slate-500">잠시만 기다려주세요.</p>
                </div>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10 no-print shadow-sm">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-slate-600 font-bold hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          돌아가기
        </button>
        
        <div className="flex gap-2">
            <button 
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
            <Printer size={18} />
            인쇄 / PDF
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="print-area p-6 md:p-10 max-w-5xl mx-auto w-full bg-white min-h-screen">
        
        {/* Report Title */}
        <div className="text-center mb-10 border-b-2 border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">재료 재고 현황표</h1>
          <div className="flex justify-center items-center gap-4 text-sm font-bold text-slate-500">
             <span>📅 {currentDate}</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span>총 {ingredients.length + basicSeasonings.length}개 품목</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-8">
          {(!hasIngredients && !hasSeasonings) ? (
             <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
               <p className="text-slate-400 font-bold text-lg">등록된 재료가 없습니다.</p>
               <p className="text-slate-400 text-sm mt-1">재료를 먼저 등록해주세요.</p>
             </div>
          ) : (
            <>
              {/* Main Ingredients Categories */}
              {activeCategories.map(cat => {
                const storageGroups = groupedData[cat];
                const totalInCat = Object.values(storageGroups).flat().length;
                const categoryColorClass = CATEGORY_COLORS[cat as Category] || "bg-gray-100 text-gray-800 border-gray-200";

                return (
                  <div key={cat} className="break-inside-avoid border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Category Header */}
                    <div className={`px-4 py-3 border-b flex justify-between items-center ${categoryColorClass} bg-opacity-50`}>
                      <h2 className="font-black text-lg flex items-center gap-2">
                        {CATEGORY_LABELS[cat as Category]}
                        <span className="text-xs font-normal opacity-80 bg-white/50 px-2 py-0.5 rounded-full">
                          {totalInCat}
                        </span>
                      </h2>
                    </div>

                    {/* Storage Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                      {[StorageType.FRIDGE, StorageType.FREEZER, StorageType.PANTRY].map(stType => {
                         const items = storageGroups[stType];
                         return (
                           <div key={stType} className="p-4 bg-white min-h-[100px]">
                             <div className="flex items-center gap-2 mb-3">
                               <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${getStorageColor(stType as StorageType)}`}>
                                 {getStorageIcon(stType as StorageType)}
                                 {STORAGE_LABELS[stType as StorageType]}
                               </span>
                             </div>
                             
                             {items.length === 0 ? (
                               <div className="text-slate-300 text-xs pl-1 font-medium">-</div>
                             ) : (
                               <div className="flex flex-wrap gap-2">
                                 {items.map(item => (
                                   <span 
                                     key={item.id} 
                                     className={`px-2.5 py-1 rounded-md text-sm font-bold border ${getItemStyle(stType as StorageType)}`}
                                   >
                                     {item.name}
                                   </span>
                                 ))}
                               </div>
                             )}
                           </div>
                         );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Basic Seasonings Section (Moved to Bottom) */}
              {hasSeasonings && (
                <div className="break-inside-avoid border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-8">
                   <div className="px-4 py-3 border-b flex justify-between items-center bg-yellow-100 text-yellow-800 border-yellow-200 bg-opacity-50">
                    <h2 className="font-black text-lg flex items-center gap-2">
                      <SaltShakerIcon size={18} />
                      기본 재료/양념
                      <span className="text-xs font-normal opacity-80 bg-white/50 px-2 py-0.5 rounded-full">
                        {basicSeasonings.length}
                      </span>
                    </h2>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex flex-wrap gap-2">
                        {basicSeasonings.map((item, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-yellow-50 text-yellow-800 rounded-lg text-sm font-bold border border-yellow-100">
                                {item}
                            </span>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-slate-400">
                        * 이곳에 있는 재료들은 항상 구비되어 있다고 가정합니다.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Print Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            <span>Mom's Smart Fridge App</span>
            <span>Generated on {currentDate}</span>
        </div>
      </div>
    </div>
  );
};