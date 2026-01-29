import React from 'react';
import { Ingredient, StorageType } from '../types';
import { Trash2, Edit2, Infinity, ArrowRight } from 'lucide-react';

interface Props {
  ingredient: Ingredient;
  onDelete: (id: string) => void;
  onEdit: (ingredient: Ingredient) => void;
  onQuickMove: (id: string) => void;
}

export const IngredientItem: React.FC<Props> = ({ ingredient, onDelete, onEdit, onQuickMove }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 mb-2 transition-transform active:scale-[0.99] group">
      <div className="flex-1 min-w-0 mr-2">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">{ingredient.name}</h3>
        
        {ingredient.isAlwaysAvailable && (
          <div className="flex items-center gap-1 text-indigo-500 text-[10px] font-medium mt-0.5">
             <Infinity size={12} />
             <span>항상 있음</span>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <button 
          onClick={() => onQuickMove(ingredient.id)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="보관장소 변경"
        >
          <ArrowRight size={16} />
        </button>
         <button 
          onClick={() => onEdit(ingredient)}
          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="수정"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(ingredient.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="삭제"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};