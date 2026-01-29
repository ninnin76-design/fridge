import React, { useState, useEffect } from 'react';
import { Ingredient, StorageType, Category } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS, STORAGE_LABELS, CATEGORY_EMOJIS } from '../constants';
import { Printer, ArrowLeft, Layers, Snowflake, Package, Loader2, Info, AlertCircle } from 'lucide-react';
import { SaltShakerIcon } from './SaltShakerIcon';

interface Props {
  ingredients: Ingredient[];
  basicSeasonings: string[];
  onClose: () => void;
}

export const TotalListView: React.FC<Props> = ({ ingredients, basicSeasonings, onClose }) => {
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);
  const [printError, setPrintError] = useState(false);
  
  const handlePrint = () => {
    setPrintError(false);
    setIsPreparingPrint(true);

    // Give time for UI feedback
    setTimeout(() => {
      try {
        window.print();
        // Reset state after a delay as print dialog blocks JS
        setTimeout(() => setIsPreparingPrint(false), 2000);
      } catch (e) {
        console.error("Print Error:", e);
        setPrintError(true);
        setIsPreparingPrint(false);
      }
    }, 500);
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
  });

  const getStorageColor = (type: StorageType) => {
    switch(type) {
      case StorageType.FRIDGE: return "text-indigo-600 print:text-black font-bold";
      case StorageType.FREEZER: return "text-blue-600 print:text-black font-bold";
      case StorageType.PANTRY: return "text-amber-600 print:text-black font-bold";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto flex flex-col no-scrollbar">
      
      {/* Print Feedback Toast */}
      {isPreparingPrint && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in no-print">
            <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-xs text-center border border-slate-100">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <Loader2 size={32} className="text-indigo-600 animate-spin" />
                </div>
                <div>
                    <p className="font-black text-slate-900 text-lg">인쇄 준비 중</p>
                    <p className="text-sm text-slate-500 mt-1">인쇄창이 곧 열립니다.</p>
                </div>
            </div>
        </div>
      )}

      {/* Header (Hidden on Print) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10 no-print shadow-sm">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-slate-600 font-bold hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          돌아가기
        </button>
        
        <div className="flex items-center gap-3">
            {printError && (
              <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded">브라우저 메뉴에서 인쇄해주세요</span>
            )}
            <button 
              onClick={handlePrint}
              disabled={isPreparingPrint}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Printer size={18} />
              인쇄하기
            </button>
        </div>
      </div>

      {/* Content Area (Targeted for Print) */}
      <div className="print-area p-6 md:p-12 print:p-0 w-full max-w-4xl mx-auto bg-white min-h-screen">
        
        {/* Report Title */}
        <div className="text-center mb-8 print:mb-4 pb-4 border-b-2 border-slate-900">
          <h1 className="text-2xl print:text-lg font-black text-slate-900 tracking-tight">재료 재고 현황 (엄마의 냉장고)</h1>
          <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-500 print:text-[10px] mt-1">
             <span>📅 {currentDate}</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span>총 {ingredients.length + basicSeasonings.length}개 품목</span>
          </div>
        </div>

        {/* Content Grid with 2-Column Print Support */}
        <div className="print-columns">
          {!hasIngredients && !hasSeasonings ? (
             <div className="text-center py-20 text-slate-400">데이터가 없습니다.</div>
          ) : (
            <>
              {/* Main Ingredients Categories */}
              {activeCategories.map(cat => {
                const storageGroups = groupedData[cat];
                const categoryEmoji = CATEGORY_EMOJIS[cat as Category];
                const categoryLabel = CATEGORY_LABELS[cat as Category];
                const categoryColorClass = CATEGORY_COLORS[cat as Category] || "bg-gray-50";

                return (
                  <div key={cat} className="print-item-group mb-6 border border-slate-200 rounded-xl overflow-hidden print:border-slate-100">
                    {/* Category Header */}
                    <div className={`px-4 py-2 print:py-1 print:px-2 border-b flex justify-between items-center ${categoryColorClass} print:bg-slate-100 print:border-slate-200`}>
                      <h2 className="font-black text-sm print:text-xs flex items-center gap-1.5">
                        <span className="text-lg print:text-sm">{categoryEmoji}</span>
                        {categoryLabel}
                      </h2>
                    </div>

                    {/* Storage List */}
                    <div className="divide-y divide-slate-100 print:divide-slate-50">
                      {[StorageType.FRIDGE, StorageType.FREEZER, StorageType.PANTRY].map(stType => {
                         const items = storageGroups[stType];
                         if (items.length === 0) return null;
                         return (
                           <div key={stType} className="p-3 print:p-1.5 bg-white">
                             <div className="flex items-center gap-1.5 mb-1.5 print:mb-0.5">
                               <span className={`text-[10px] print:text-[8px] ${getStorageColor(stType as StorageType)}`}>
                                 ● {STORAGE_LABELS[stType as StorageType]}
                               </span>
                             </div>
                             
                             <div className="flex flex-wrap gap-1.5 print:gap-1">
                               {items.map(item => (
                                 <span 
                                   key={item.id} 
                                   className="px-2 py-1 print:px-1 print:py-0 text-xs print:text-[10px] text-slate-700 bg-white border border-slate-100 print:border-none rounded-md"
                                 >
                                   {item.name}
                                 </span>
                               ))}
                             </div>
                           </div>
                         );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Basic Seasonings Section (Condensed for Print) */}
              {hasSeasonings && (
                <div className="print-item-group mb-6 border border-slate-200 rounded-xl overflow-hidden print:border-slate-100">
                   <div className="px-4 py-2 print:py-1 print:px-2 border-b flex items-center gap-1.5 bg-yellow-100 print:bg-slate-100 print:border-slate-200">
                    <SaltShakerIcon size={14} className="text-yellow-700 print:text-black" />
                    <h2 className="font-black text-sm print:text-xs">기본 상비 양념</h2>
                  </div>
                  <div className="p-3 print:p-1.5 bg-white">
                    <div className="flex flex-wrap gap-1.5 print:gap-1">
                        {basicSeasonings.map((item, idx) => (
                            <span key={idx} className="px-2 py-1 print:px-1 print:py-0 bg-yellow-50 print:bg-transparent text-xs print:text-[10px] text-slate-700 rounded-md">
                                {item}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Print Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-[9px] print:text-[7px] text-slate-400 font-bold flex justify-between items-center">
            <span>© 엄마의 냉장고 | 스마트 인벤토리</span>
            <span>출력 일시: {new Date().toLocaleString('ko-KR')}</span>
        </div>
      </div>
    </div>
  );
};