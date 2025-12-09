
import React from 'react';
import { DailyPlan, Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { Sunrise, Sun, Moon, Sparkles } from 'lucide-react';

interface Props {
  plan: DailyPlan | null;
  isLoading: boolean;
  onGenerate: () => void;
  onToggleSave: (recipe: Recipe) => void;
  isRecipeSaved: (id: string) => boolean;
}

export const DailyMealPlanView: React.FC<Props> = ({ plan, isLoading, onGenerate, onToggleSave, isRecipeSaved }) => {
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="bg-indigo-50 p-6 rounded-full mb-6 relative">
             <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-20"></div>
             <Sparkles size={48} className="text-indigo-600 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">오늘의 식단을 짜고 있어요!</h2>
        <p className="text-slate-500 text-center leading-relaxed">
          아침은 간편하게,<br/>
          점심과 저녁은 든든하게 구성 중입니다...
        </p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
           <Sun size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">오늘 뭐 해먹지?</h2>
        <p className="text-slate-500 mb-8 px-8">
            냉장고 재료로 아침, 점심, 저녁<br/>
            하루 식단을 한 번에 추천해드립니다.
        </p>
        <button 
          onClick={onGenerate}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center gap-2 mx-auto"
        >
           <Sparkles size={20} />
           1일 식단 추천받기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-6">
        <h2 className="text-2xl font-black mb-1">오늘의 추천 식단 📅</h2>
        <p className="text-blue-100 text-sm">재료 상황에 맞춘 완벽한 하루!</p>
      </div>

      {/* Breakfast */}
      <div>
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="bg-orange-100 p-2 rounded-full text-orange-500">
                <Sunrise size={24} />
            </div>
            <div>
                <h3 className="text-lg font-black text-slate-800">아침 식사</h3>
                <p className="text-xs text-slate-500 font-bold">간편하고 속 편한 시작</p>
            </div>
        </div>
        <RecipeCard 
            recipe={plan.breakfast} 
            isSaved={isRecipeSaved(plan.breakfast.id)}
            onToggleSave={onToggleSave}
        />
      </div>

      {/* Lunch */}
      <div>
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                <Sun size={24} />
            </div>
            <div>
                <h3 className="text-lg font-black text-slate-800">점심 식사</h3>
                <p className="text-xs text-slate-500 font-bold">활력을 채워주는 메뉴</p>
            </div>
        </div>
        <RecipeCard 
            recipe={plan.lunch} 
            isSaved={isRecipeSaved(plan.lunch.id)}
            onToggleSave={onToggleSave}
        />
      </div>

      {/* Dinner */}
      <div>
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                <Moon size={24} />
            </div>
            <div>
                <h3 className="text-lg font-black text-slate-800">저녁 식사</h3>
                <p className="text-xs text-slate-500 font-bold">온 가족이 즐거운 마무리</p>
            </div>
        </div>
        <RecipeCard 
            recipe={plan.dinner} 
            isSaved={isRecipeSaved(plan.dinner.id)}
            onToggleSave={onToggleSave}
        />
      </div>

      <div className="pt-6 text-center">
        <button 
           onClick={onGenerate}
           className="text-slate-400 font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm"
        >
            <Sparkles size={14} />
            다른 식단으로 다시 추천받기
        </button>
      </div>

    </div>
  );
};
