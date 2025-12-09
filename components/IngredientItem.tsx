import React from 'react';
import { Ingredient } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../constants';
import { Trash2, Edit2, Infinity } from 'lucide-react';

interface Props {
  ingredient: Ingredient;
  onDelete: (id: string) => void;
  onEdit: (ingredient: Ingredient) => void;
}

export const IngredientItem: React.FC<Props> = ({ ingredient, onDelete, onEdit }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 mb-3 transition-transform active:scale-[0.99]">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[ingredient.category]}`}>
            {CATEGORY_LABELS[ingredient.category]}
          </span>
          <h3 className="font-semibold text-slate-800">{ingredient.name}</h3>
        </div>
        
        {ingredient.isAlwaysAvailable && (
          <div className="flex items-center gap-1 text-indigo-500 text-sm font-medium pl-1">
             <Infinity size={14} />
             <span>항상 있음</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
         <button 
          onClick={() => onEdit(ingredient)}
          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => onDelete(ingredient.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};