
import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Save, ChevronDown, ChevronUp, Plus, Search } from 'lucide-react';
import { Ingredient, StorageType, Category } from '../types';
import { CATEGORY_LABELS, COMMON_INGREDIENTS, CATEGORY_COLORS } from '../constants';
import { autoDetectCategory, autoDetectStorage } from '../categoryHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: (Omit<Ingredient, 'id'> & { id?: string }) | (Omit<Ingredient, 'id'> & { id?: string })[]) => void;
  initialData?: Ingredient | null;
  defaultStorage: StorageType;
  existingIngredients: Ingredient[]; // Added to check for duplicates
}

export const AddIngredientModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData, defaultStorage, existingIngredients }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.VEGETABLE);
  const [storage, setStorage] = useState<StorageType>(defaultStorage);
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(Category.VEGETABLE);
  
  // Track visually selected items in the quick add list (Flash effect)
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  
  // UI Feedback State
  const [showSuccess, setShowSuccess] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const successTimerRef = useRef<any>(null);
  
  // Track if user explicitly clicked a storage tab (to disable auto-detect on typing)
  const [userSelectedStorage, setUserSelectedStorage] = useState(false);

  // Create a set of existing ingredient names for fast lookup
  const existingNames = new Set(existingIngredients.map(i => i.name));

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit Mode
        setName(initialData.name);
        setCategory(initialData.category);
        setStorage(initialData.storage);
        setExpandedCategory(null); // Collapse lists in edit mode
        setAddedItems(new Set());
        setUserSelectedStorage(false);
      } else {
        // Add Mode
        resetForm();
        setStorage(defaultStorage); // Respect default storage initially
        setExpandedCategory(Category.VEGETABLE); // Default expand vegetable
        setAddedItems(new Set()); // Reset visual selection
        setUserSelectedStorage(false);
      }
    }
  }, [initialData, defaultStorage, isOpen]);

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen && !initialData) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialData]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const resetForm = (keepContext = false) => {
    setName('');
    // Optimized for batch entry: Keep Category and Storage if keepContext is true
    if (!keepContext) {
      setCategory(Category.VEGETABLE);
      setStorage(defaultStorage);
      setUserSelectedStorage(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    
    // Auto-detect category
    const detectedCat = autoDetectCategory(val);
    if (detectedCat) {
      if (detectedCat === Category.SAUCE) {
        setCategory(Category.ETC);
      } else {
        setCategory(detectedCat);
      }
    }

    // Auto-detect storage (Fridge/Freezer/Pantry)
    // ONLY if user hasn't explicitly clicked a storage tab
    if (!userSelectedStorage) {
        const detectedStorage = autoDetectStorage(val);
        if (detectedStorage) {
            setStorage(detectedStorage);
        }
    }
  };

  if (!isOpen) return null;

  const createItemData = (overrideName?: string, overrideCategory?: Category): Omit<Ingredient, 'id'> => ({
    name: overrideName || name,
    quantity: '', // No quantity logic
    category: overrideCategory || category,
    storage,
    isAlwaysAvailable: false
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    
    const item = createItemData();

    if (initialData) {
      // Edit Mode - Save and Close
      onSave({ ...item, id: initialData.id });
      onClose();
    } else {
      // Add Mode - Save and RESET (Continuous Entry)
      onSave(item);
      triggerSuccessFeedback();
      setName(''); // Clear name only, keep storage
      nameInputRef.current?.focus();
    }
  };

  const handleQuickAdd = (itemName: string, cat: Category) => {
    // Instant add when clicking a chip
    // We use the currently selected storage (no auto-detect override)
    
    const item = {
        name: itemName,
        quantity: '',
        category: cat,
        storage: storage,
        isAlwaysAvailable: false
    };
    
    onSave(item);
    
    // 1. Add to visual set (Turn Purple)
    setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.add(itemName);
        return newSet;
    });

    triggerSuccessFeedback();

    // 2. Remove after delay (Turn back to White) to allow re-clicking with feedback
    setTimeout(() => {
        setAddedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemName);
            return newSet;
        });
    }, 500); // 0.5s flash effect
  };

  const triggerSuccessFeedback = () => {
    setShowSuccess(true);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setShowSuccess(false), 1500);
  };

  const toggleCategory = (cat: Category) => {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  const isEditMode = !!initialData;

  // Categories to display in Quick Select (Exclude Sauce/ETC if empty)
  const quickCategories = [
    Category.VEGETABLE, Category.FRUIT, Category.MEAT,
    Category.FISH, Category.DAIRY, Category.GRAIN,
    Category.PROCESSED
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        
        {/* ENHANCED Success Toast (Non-intrusive) */}
        {showSuccess && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-fade-in z-50 pointer-events-none backdrop-blur-sm">
              <Check size={14} className="text-green-400" strokeWidth={3} />
              <span className="text-xs font-bold">저장되었습니다</span>
            </div>
        )}

        <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-lg font-bold">
            {isEditMode ? '재료 수정' : '재료 등록'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 relative flex flex-col">
          
          {/* 1. Storage Selection (Top Priority) */}
          <div className="mb-4 shrink-0">
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-xl">
              <button
                type="button"
                className={`py-3 text-sm font-bold rounded-lg transition-all ${storage === StorageType.FRIDGE ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => { setStorage(StorageType.FRIDGE); setUserSelectedStorage(true); }}
              >
                냉장실
              </button>
              <button
                type="button"
                className={`py-3 text-sm font-bold rounded-lg transition-all ${storage === StorageType.FREEZER ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => { setStorage(StorageType.FREEZER); setUserSelectedStorage(true); }}
              >
                냉동실
              </button>
              <button
                type="button"
                className={`py-3 text-sm font-bold rounded-lg transition-all ${storage === StorageType.PANTRY ? 'bg-white text-amber-600 shadow-sm ring-1 ring-amber-50' : 'text-slate-400 hover:text-slate-600'}`}
                onClick={() => { setStorage(StorageType.PANTRY); setUserSelectedStorage(true); }}
              >
                실온
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
                👆 보관함을 선택하고 재료를 누르세요.
            </p>
          </div>

          {/* 2. Manual Input Form */}
          <form onSubmit={handleSubmit} className="mb-6 shrink-0 relative">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">직접 입력</label>
            <div className="flex gap-2">
                <input 
                ref={nameInputRef}
                type="text" 
                value={name}
                onChange={handleNameChange}
                placeholder="찾는 재료가 없다면 입력하세요"
                className="flex-1 px-4 py-3 text-base rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold placeholder:font-normal"
                />
                <button
                    type="submit"
                    className="bg-slate-900 text-white px-4 rounded-xl font-bold shadow-md active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>
            {name && (
                <div className="absolute -bottom-5 left-1 flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">자동 감지:</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[category]}`}>
                        {CATEGORY_LABELS[category]}
                    </span>
                </div>
            )}
          </form>

          {/* 3. Quick Selection List */}
          {!isEditMode && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase">또는 목록에서 선택</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <div className="space-y-3 pb-4">
                    {quickCategories.map(cat => {
                        // Filter out ingredients that are already in the inventory
                        const visibleItems = COMMON_INGREDIENTS[cat].filter(item => !existingNames.has(item));

                        return (
                          <div key={cat} className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                              <button
                                  type="button" 
                                  onClick={() => toggleCategory(cat)}
                                  className={`w-full px-4 py-3 flex justify-between items-center text-sm font-bold transition-colors ${expandedCategory === cat ? 'bg-slate-50 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                              >
                                  <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat].split(' ')[0].replace('bg-', 'bg-')}`}></span>
                                      {CATEGORY_LABELS[cat]}
                                  </div>
                                  {expandedCategory === cat ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                              
                              {expandedCategory === cat && (
                                  <div className="p-3 bg-slate-50/50 border-t border-slate-100 animate-fade-in">
                                      {visibleItems.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {visibleItems.map(item => {
                                                const isSelected = addedItems.has(item);
                                                return (
                                                    <button
                                                        key={item}
                                                        type="button"
                                                        onClick={() => handleQuickAdd(item, cat)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium shadow-sm active:scale-95 transition-all border flex items-center gap-1.5 ${
                                                            isSelected 
                                                            ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-200' 
                                                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                                        }`}
                                                    >
                                                        {isSelected && <Check size={14} strokeWidth={3} />}
                                                        {item}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                      ) : (
                                        <div className="text-center py-4 text-xs text-slate-400">
                                          ✨ 이 카테고리의 모든 재료가 등록되었습니다.
                                        </div>
                                      )}
                                  </div>
                              )}
                          </div>
                      );
                    })}
                </div>
              </div>
          )}

          {isEditMode && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-xs text-yellow-800 border border-yellow-100 mb-20">
                  ⚠️ 수정 모드에서는 목록 선택이 비활성화됩니다. 위 입력창을 통해 수정해주세요.
              </div>
          )}

        </div>
        
        {/* Footer Save Button (Only for manual edits mostly) */}
        {isEditMode && (
            <div className="p-4 border-t border-slate-100 shrink-0 bg-white">
            <button
                onClick={(e) => handleSubmit(e)}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98] hover:bg-slate-800"
            >
                <Check size={20} />
                수정 완료
            </button>
            </div>
        )}
      </div>
    </div>
  );
};
