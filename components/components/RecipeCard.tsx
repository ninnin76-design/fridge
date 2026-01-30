import React, { useState } from 'react';
import { Recipe } from '../types';
import { Clock, ChefHat, Youtube, ChevronDown, ChevronUp, AlertCircle, ShoppingCart, Heart, Utensils, Coffee } from 'lucide-react';

interface Props {
  recipe: Recipe;
  isSaved?: boolean;
  onToggleSave?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<Props> = ({ recipe, isSaved = false, onToggleSave }) => {
  // [CRITICAL FIX] If recipe data is corrupted (null/undefined), render nothing to prevent app crash
  if (!recipe || !recipe.name) {
      return null;
  }

  const [expanded, setExpanded] = useState(false);

  // Safety checks to prevent crashes if AI returns incomplete data
  const ingredientsUsed = recipe.ingredientsUsed || [];
  const missingIngredients = recipe.missingIngredients || [];
  const instructions = recipe.instructions || [];

  const isMissingKeyItems = missingIngredients.length > 0;

  // Generate YouTube Search URL
  const youtubeQuery = encodeURIComponent(`${recipe.name} 레시피`);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${youtubeQuery}`;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
        onToggleSave(recipe);
    }
  };

  const getTypeBadge = () => {
    if (recipe.recipeType === 'SIDE') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold border border-green-200 uppercase tracking-wide shrink-0">
          <Utensils size={10} /> 반찬
        </span>
      );
    }
    if (recipe.recipeType === 'SNACK') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold border border-orange-200 uppercase tracking-wide shrink-0">
          <Coffee size={10} /> 간식
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200 uppercase tracking-wide shrink-0">
        <ChefHat size={10} /> 메인
      </span>
    );
  };

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden mb-6 transition-all duration-300 border ${isMissingKeyItems ? 'bg-orange-50/50 border-orange-200' : 'bg-white border-slate-100'}`}>
      {/* Header */}
      <div 
        className="w-full text-left p-5 cursor-pointer hover:bg-black/5 transition-colors relative"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-8">
            <div className="flex items-start gap-3">
               <div className="text-4xl mb-3 animate-bounce-slow shrink-0">{recipe.emoji}</div>
               <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 mb-1.5">
                    {getTypeBadge()}
                    {isMissingKeyItems && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 max-w-full">
                          <ShoppingCart size={10} className="shrink-0" />
                          <span className="truncate">부족: {missingIngredients.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight">{recipe.name}</h3>
               </div>
            </div>
            
            <p className="text-slate-500 text-sm line-clamp-2 mt-1">{recipe.description}</p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
             {/* Save Button */}
             <button
                onClick={handleToggleSave}
                className={`p-2 rounded-full transition-all active:scale-90 z-10 ${
                    isSaved 
                    ? 'text-pink-500 bg-pink-50 hover:bg-pink-100' 
                    : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                }`}
                title={isSaved ? "찜 취소" : "찜하기"}
             >
                <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
             </button>
             
             <div className="text-slate-400">
                {expanded ? <ChevronUp /> : <ChevronDown />}
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-md border border-slate-100">
            <Clock size={14} className="text-orange-500" />
            {recipe.cookingTime || '조리시간 미정'}
          </div>
          <div className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-md border border-slate-100">
            <ChefHat size={14} className="text-indigo-500" />
            재료 {ingredientsUsed.length}개 사용
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-5 pt-0 border-t border-slate-100/50 bg-white/50 animate-fade-in">
          <div className="mt-4">
            
            {/* Missing Ingredients Alert */}
            {isMissingKeyItems && (
                <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div>
                        <h4 className="font-bold text-red-700 text-sm mb-1">이 재료가 부족해요!</h4>
                        <div className="flex flex-wrap gap-2">
                            {missingIngredients.map((ing, idx) => (
                                <span key={idx} className="bg-white text-red-600 px-2 py-1 rounded-md font-bold text-xs shadow-sm border border-red-100">
                                    + {ing}
                                </span>
                            ))}
                        </div>
                        <p className="text-red-400 text-xs mt-2">이것만 사오면 맛있는 요리가 됩니다.</p>
                    </div>
                </div>
            )}

            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              사용하는 보유 재료
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {ingredientsUsed.length > 0 ? ingredientsUsed.map((ing, idx) => (
                <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium border border-indigo-100">
                  {ing}
                </span>
              )) : (
                <span className="text-xs text-slate-400">정보 없음</span>
              )}
            </div>

            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              조리 순서
            </h4>
            {instructions.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm leading-relaxed mb-6">
                {instructions.map((step, idx) => (
                  <li key={idx} className="pl-1"><span className="text-slate-800">{step}</span></li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-400 mb-6">조리법 정보가 없습니다.</p>
            )}

            {/* External Links Section */}
            <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100 hover:bg-red-100 transition-colors shadow-sm active:scale-95"
                >
                    <Youtube size={16} />
                    유튜브에서 영상 보기
                </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};