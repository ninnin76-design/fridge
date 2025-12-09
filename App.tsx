
import React, { useState, useEffect } from 'react';
import { Plus, Snowflake, Layers, ChefHat, Search, ArrowLeft, Package, ClipboardList, RefreshCw, ShoppingCart, Heart, Coffee, Utensils, CheckSquare, List, Users, AlertTriangle, Sparkles } from 'lucide-react';
import { Ingredient, StorageType, Recipe, Category } from './types';
import { DEFAULT_BASIC_SEASONINGS, CATEGORY_LABELS, CATEGORY_COLORS } from './constants';
import { IngredientItem } from './components/IngredientItem';
import { AddIngredientModal } from './components/AddIngredientModal';
import { RecipeCard } from './components/RecipeCard';
import { TotalListView } from './components/TotalListView';
import { BasicSeasoningManager } from './components/BasicSeasoningManager';
import { DataSyncModal } from './components/DataSyncModal';
import { SaltShakerIcon } from './components/SaltShakerIcon';
import { searchPublicRecipes } from './services/mafraService';
import { suggestSpecificRecipes as suggestAIRecipes } from './services/geminiService';
import { autoDetectCategory } from './categoryHelper';
import { db } from './services/db';

export default function App() {
  // State
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [basicSeasonings, setBasicSeasonings] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<StorageType>(StorageType.FRIDGE);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [view, setView] = useState<'INVENTORY' | 'RECIPES' | 'TOTAL' | 'SEASONINGS' | 'SAVED_RECIPES'>('INVENTORY');
  
  // Recipe State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeRecipeTab, setActiveRecipeTab] = useState<'MAIN' | 'SIDE' | 'SNACK'>('MAIN');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [isUsingAI, setIsUsingAI] = useState(false); // Track if current results are from AI
  
  // Tab-specific loading state (allows browsing other tabs while one regenerates)
  const [regeneratingTab, setRegeneratingTab] = useState<'MAIN' | 'SIDE' | 'SNACK' | null>(null);

  // Track background loading for non-active tabs (initial load)
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  
  // Shopping List State (derived from Saved Recipes)
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [selectedShoppingItems, setSelectedShoppingItems] = useState<Set<string>>(new Set());

  // Load from IndexedDB and LocalStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dbIngredients, dbSeasonings, dbRecipes] = await Promise.all([
          db.getAllIngredients(),
          db.getAllSeasonings(),
          db.getAllSavedRecipes()
        ]);

        setIngredients(dbIngredients);
        setSavedRecipes(dbRecipes);

        // If seasonings DB is empty (first run), initialize with defaults
        if (dbSeasonings.length === 0) {
           await db.setAllSeasonings(DEFAULT_BASIC_SEASONINGS);
           setBasicSeasonings(DEFAULT_BASIC_SEASONINGS);
        } else {
           setBasicSeasonings(dbSeasonings);
        }

      } catch (error) {
        console.error("Failed to load data from DB:", error);
      }
    };

    loadData();
  }, []);

  const handleSaveIngredient = async (data: (Omit<Ingredient, 'id'> & { id?: string }) | (Omit<Ingredient, 'id'> & { id?: string })[]) => {
    const dataArray = Array.isArray(data) ? data : [data];
    const itemsToSave: Ingredient[] = [];

    // Prepare Items
    dataArray.forEach(item => {
        const newItem: Ingredient = {
            ...item,
            id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
        itemsToSave.push(newItem);
    });

    // Save to DB
    await db.bulkAddIngredients(itemsToSave);

    // Update Local State
    setIngredients(prev => {
      let next = [...prev];
      itemsToSave.forEach(newItem => {
          const index = next.findIndex(i => i.id === newItem.id);
          if (index !== -1) {
              next[index] = newItem; // Update
          } else {
              next.push(newItem); // Add
          }
      });
      return next;
    });
    
    setEditingIngredient(null);
  };

  const handleDeleteIngredient = async (id: string) => {
    // Removed confirmation dialog for immediate deletion
    await db.deleteIngredient(id);
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsAddModalOpen(true);
  };

  // Wrapper for updating seasonings to sync with DB
  const updateBasicSeasonings = async (newSeasonings: string[]) => {
      await db.setAllSeasonings(newSeasonings);
      setBasicSeasonings(newSeasonings);
  };

  const handleToggleSaveRecipe = async (recipe: Recipe) => {
      const isAdded = await db.toggleSavedRecipe(recipe);
      
      setSavedRecipes(prev => {
          if (!isAdded) {
              // Removed
              return prev.filter(r => r.id !== recipe.id);
          } else {
              // Added
              return [recipe, ...prev];
          }
      });
  };

  const isRecipeSaved = (id: string) => savedRecipes.some(r => r.id === id);

  // Import Data Handler
  const handleImportData = async (rawIngredients: any[], rawSeasonings?: string[]) => {
      const ingCount = Array.isArray(rawIngredients) ? rawIngredients.length : 0;
      const seaCount = Array.isArray(rawSeasonings) ? rawSeasonings.length : 0;

      if (ingCount === 0 && seaCount === 0) {
        alert("추가할 데이터가 없습니다.");
        return;
      }

      const validIngredients: Ingredient[] = [];
      let counts = { [StorageType.FRIDGE]: 0, [StorageType.FREEZER]: 0, [StorageType.PANTRY]: 0 };

      if (Array.isArray(rawIngredients)) {
        rawIngredients.forEach(item => {
          if (!item.name) return;
          let storage = StorageType.FRIDGE;
          const s = String(item.storage || '').toUpperCase();
          if (s.includes('FREEZE') || s.includes('냉동')) storage = StorageType.FREEZER;
          else if (s.includes('PANTRY') || s.includes('실온')) storage = StorageType.PANTRY;
          
          let category = Category.ETC;
          const cRaw = String(item.category || '').trim();
          const cUpper = cRaw.toUpperCase();
          if (Object.keys(Category).includes(cUpper)) category = cUpper as Category;
          else {
             const matchedKey = Object.keys(CATEGORY_LABELS).find(key => CATEGORY_LABELS[key as Category] === cRaw);
             if (matchedKey) category = matchedKey as Category;
          }

          // Check for existing ingredient with same name and storage
          const exists = ingredients.some(i => 
              i.name === item.name && i.storage === storage
          );

          if (!exists) {
              validIngredients.push({
                  id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name: item.name,
                  quantity: '',
                  storage: storage,
                  category: category,
                  isAlwaysAvailable: false
              });
              counts[storage]++;
          }
        });
      }

      const validSeasonings = Array.isArray(rawSeasonings) 
          ? rawSeasonings.filter(s => typeof s === 'string' && s.trim() !== '')
          : [];

      let addedIngredientsCount = 0;
      let addedSeasoningsCount = 0;

      if (validIngredients.length > 0) {
          addedIngredientsCount = validIngredients.length;
          await db.bulkAddIngredients(validIngredients);
          setIngredients(prev => [...prev, ...validIngredients]);
      }
      
      if (validSeasonings.length > 0) {
          const prevSet = new Set(basicSeasonings);
          const newUnique = validSeasonings.filter(s => !prevSet.has(s));
          addedSeasoningsCount = newUnique.length;
          if (addedSeasoningsCount > 0) {
              const mergedSeasonings = [...basicSeasonings, ...newUnique];
              await db.setAllSeasonings(mergedSeasonings);
              setBasicSeasonings(mergedSeasonings);
          }
      }

      setTimeout(() => {
          if (addedIngredientsCount > 0) {
            // Smart Tab Switching: Switch to the tab where most items were added
            if (counts[StorageType.FREEZER] > 0 && counts[StorageType.FREEZER] >= counts[StorageType.FRIDGE]) {
                setActiveTab(StorageType.FREEZER);
            } else if (counts[StorageType.PANTRY] > 0 && counts[StorageType.PANTRY] >= counts[StorageType.FRIDGE]) {
                setActiveTab(StorageType.PANTRY);
            } else {
                setActiveTab(StorageType.FRIDGE);
            }
          }
          let msg = `✅ 데이터 동기화 완료!`;
          if (addedIngredientsCount === 0 && addedSeasoningsCount === 0) msg = `✅ 이미 모든 재료가 최신 상태입니다.`;
          else {
              if (addedIngredientsCount > 0) msg += `\n[신규 재료 ${addedIngredientsCount}개]`;
              if (addedSeasoningsCount > 0) msg += `\n[신규 양념 ${addedSeasoningsCount}개]`;
          }
          alert(msg);
      }, 100);
  };

  const filteredIngredients = ingredients.filter(i => i.storage === activeTab);

  const groupedIngredients = filteredIngredients.reduce((acc, ingredient) => {
    const cat = ingredient.category || Category.ETC;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ingredient);
    return acc;
  }, {} as Record<Category, Ingredient[]>);

  const categoryOrder = [
    Category.VEGETABLE, Category.FRUIT, Category.MEAT,
    Category.FISH, Category.DAIRY, Category.GRAIN,
    Category.PROCESSED, Category.SAUCE, Category.ETC
  ];

  const getAllAvailableIngredients = () => {
    const basicSeasoningIngredients: Ingredient[] = basicSeasonings.map(name => ({
      id: `basic-${name}`,
      name: name,
      quantity: '',
      category: autoDetectCategory(name) || Category.SAUCE,
      storage: StorageType.PANTRY,
      isAlwaysAvailable: true
    }));
    return [...ingredients, ...basicSeasoningIngredients];
  };

  // Recipe Generation Logic
  const generateRecipesCommon = async (useAI: boolean) => {
      setView('RECIPES');
      
      // Clear previous recipes immediately to prevent stale data visibility
      setRecipes([]);
      setActiveRecipeTab('MAIN');
      setIsGeneratingRecipes(true);
      setBackgroundLoading(false);
      setRegeneratingTab(null);
      setIsUsingAI(useAI);

      const allIngredients = getAllAvailableIngredients();

      try {
          // Determine Fetch Function
          let fetchFn: (type: 'MAIN' | 'SIDE' | 'SNACK') => Promise<Recipe[]>;
          
          if (useAI) {
              fetchFn = (type) => suggestAIRecipes(allIngredients, type, type === 'MAIN' ? 3 : 2);
          } else {
              fetchFn = (type) => searchPublicRecipes(allIngredients, type);
          }

          // Step 1: Fetch MAIN dishes FIRST
          const mainRecipes = await fetchFn('MAIN');
          setRecipes(mainRecipes);
          
          setIsGeneratingRecipes(false);
          setBackgroundLoading(true);

          // Step 2: Fetch SIDE and SNACK in background
          Promise.all([
              fetchFn('SIDE'),
              fetchFn('SNACK')
          ]).then(([sideRecipes, snackRecipes]) => {
              setRecipes(prev => [...prev, ...sideRecipes, ...snackRecipes]);
              setBackgroundLoading(false);
          }).catch(err => {
              console.warn("Background recipe fetch failed", err);
              setBackgroundLoading(false);
          });

      } catch (error: any) {
          console.error("Error generating recipes:", error);
          setIsGeneratingRecipes(false);
          
          if (useAI) {
              alert('AI 연결에 실패했습니다.\n환경 설정을 확인해주세요.');
          } else {
              alert("레시피를 불러오는 중 오류가 발생했습니다.");
          }
      }
  };

  const handleGeneratePublicRecipes = () => generateRecipesCommon(false);
  
  const handleGenerateAIRecipes = () => {
      // PERMANENCE CHECK:
      // If we already have AI recipes generated and we are in AI mode, 
      // just show the existing list instead of regenerating.
      if (recipes.length > 0 && isUsingAI) {
          setView('RECIPES');
          return;
      }

      generateRecipesCommon(true);
  };

  const handleRegenerateCurrentCategory = async () => {
      if (regeneratingTab) return;

      const targetTab = activeRecipeTab;
      setRegeneratingTab(targetTab);
      
      const allIngredients = getAllAvailableIngredients();
      let newRecipes: Recipe[] = [];

      try {
        if (isUsingAI) {
            newRecipes = await suggestAIRecipes(allIngredients, targetTab, targetTab === 'MAIN' ? 3 : 2);
        } else {
            newRecipes = await searchPublicRecipes(allIngredients, targetTab);
        }
        
        setRecipes(prev => {
            const others = prev.filter(r => r.recipeType !== targetTab);
            return [...others, ...newRecipes];
        });
      } catch (e: any) {
          console.error("Regeneration failed", e);
          setRegeneratingTab(null); // Clear loading state immediately on error
          alert("다시 추천받기에 실패했습니다.");
      }
      
      setRegeneratingTab(null);
  };

  const displayRecipes = recipes.filter(r => r.recipeType === activeRecipeTab);

  const getShoppingList = () => {
      const listMap = new Map<string, string[]>();
      savedRecipes.forEach(recipe => {
          if (recipe.missingIngredients && recipe.missingIngredients.length > 0) {
              recipe.missingIngredients.forEach(ing => {
                  const cleanedName = ing.trim();
                  if (!listMap.has(cleanedName)) listMap.set(cleanedName, []);
                  listMap.get(cleanedName)?.push(recipe.name);
              });
          }
      });
      return Array.from(listMap.entries()).map(([name, recipes]) => ({ name, recipes }));
  };

  const handleToggleShoppingItem = (name: string) => {
    const newSet = new Set(selectedShoppingItems);
    if (newSet.has(name)) newSet.delete(name);
    else newSet.add(name);
    setSelectedShoppingItems(newSet);
  };

  const handleConfirmShopping = async () => {
      if (selectedShoppingItems.size === 0) return;
      
      const itemsToBuy = Array.from(selectedShoppingItems) as string[];
      const newIngredients: Ingredient[] = [];

      // 1. Add to Inventory
      itemsToBuy.forEach(name => {
           const category = autoDetectCategory(name) || Category.ETC;
           let storage = StorageType.FRIDGE;
           if (category === Category.GRAIN || category === Category.SAUCE || category === Category.ETC) storage = StorageType.PANTRY;
           
           newIngredients.push({
               id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
               name: name, 
               category, 
               storage, 
               quantity: '', 
               isAlwaysAvailable: false
           });
      });

      await handleSaveIngredient(newIngredients);

      // 2. Remove from Missing Ingredients in Saved Recipes
      const updatedRecipes = savedRecipes.map(r => {
          if (!r.missingIngredients) return r;
          
          // Filter out items that are now bought
          const remaining = r.missingIngredients.filter(ing => !selectedShoppingItems.has(ing));
          
          // If no change, return original
          if (remaining.length === r.missingIngredients.length) return r;
          
          return { ...r, missingIngredients: remaining };
      });

      // 3. Update DB only if changes occurred
      const changedRecipes = updatedRecipes.filter((r, i) => r !== savedRecipes[i]);
      if (changedRecipes.length > 0) {
          await db.bulkUpdateSavedRecipes(changedRecipes);
          setSavedRecipes(updatedRecipes);
      }

      alert(`${itemsToBuy.length}개의 재료를 냉장고에 등록했습니다! 🎊`);
      setSelectedShoppingItems(new Set());
  };

  if (view === 'TOTAL') {
    return (
      <TotalListView 
        ingredients={ingredients} 
        basicSeasonings={basicSeasonings}
        onClose={() => setView('INVENTORY')} 
      />
    );
  }

  if (view === 'SEASONINGS') {
    return (
      <BasicSeasoningManager 
        seasonings={basicSeasonings} 
        onUpdate={updateBasicSeasonings} 
        onClose={() => setView('INVENTORY')} 
      />
    );
  }

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative">
      
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between app-header">
        {(view === 'RECIPES' || view === 'SAVED_RECIPES') ? (
          <button onClick={() => setView('INVENTORY')} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
            <ArrowLeft />
          </button>
        ) : (
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">엄마의 냉장고</h1>
            <p className="text-sm text-slate-500 font-medium">오늘 뭐 먹지 고민 해결!</p>
          </div>
        )}
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-full">
          {view === 'INVENTORY' && (
            <div className="flex gap-1">
                <button 
                  onClick={() => setIsSyncModalOpen(true)}
                  className="bg-white p-2 rounded-full text-slate-600 shadow-sm hover:text-green-600 transition-colors"
                  title="데이터 동기화 (아이들과 공유)"
                >
                  <Users size={20} />
                </button>
                <button 
                  onClick={() => setView('SEASONINGS')}
                  className="bg-white p-2 rounded-full text-slate-600 shadow-sm hover:text-amber-600 transition-colors"
                  title="기본 양념/소스 관리"
                >
                  <SaltShakerIcon size={20} />
                </button>
                <button 
                  onClick={() => setView('TOTAL')}
                  className="bg-white p-2 rounded-full text-slate-600 shadow-sm hover:text-slate-900 transition-colors"
                  title="전체 재고 확인"
                >
                  <ClipboardList size={20} />
                </button>
            </div>
          )}
        </div>
        
        {view === 'INVENTORY' && (
            <button 
            onClick={() => setView('SAVED_RECIPES')}
            className="bg-pink-50 p-2.5 rounded-full text-pink-500 hover:bg-pink-100 transition-colors relative ml-2"
            title="내가 찜한 레시피"
            >
            <Heart size={20} fill={savedRecipes.length > 0 ? "currentColor" : "none"} />
            {savedRecipes.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {savedRecipes.length}
                </span>
            )}
            </button>
        )}
        
        {view === 'RECIPES' && (
          <h1 className="text-xl font-bold text-slate-800">추천 메뉴</h1>
        )}
        {view === 'SAVED_RECIPES' && (
          <h1 className="text-xl font-bold text-slate-800">내 픽(Pick) 레시피</h1>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4">
        
        {view === 'INVENTORY' && (
          <>
            <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden app-stats">
               <div className="relative z-10">
                 <h2 className="font-bold text-lg mb-1">재료가 {ingredients.length}개 있어요!</h2>
                 <p className="text-indigo-100 text-sm mb-4">아이들이 배고파하나요? 지금 바로 확인해보세요.</p>
                 <div className="flex gap-2">
                    <button 
                      onClick={handleGeneratePublicRecipes}
                      className="flex-1 bg-white text-indigo-600 px-3 py-2.5 rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <ChefHat size={16} />
                      믿고 먹는 요리추천
                    </button>
                    <div className="flex-1 relative group">
                        <button 
                        onClick={handleGenerateAIRecipes}
                        className="w-full bg-purple-700 text-white px-3 py-2.5 rounded-lg font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 border border-purple-500"
                        >
                        <Sparkles size={16} />
                        AI 셰프의 요리추천
                        </button>
                    </div>
                 </div>
               </div>
               <div className="absolute -right-4 -bottom-8 opacity-20 transform rotate-12">
                 <ChefHat size={120} />
               </div>
            </div>

            {/* Storage Tabs */}
            <div className="flex p-1 bg-gray-200 rounded-xl mb-4 gap-0.5 app-nav">
              <button
                onClick={() => setActiveTab(StorageType.FRIDGE)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === StorageType.FRIDGE 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Layers size={15} />
                냉장 ({ingredients.filter(i => i.storage === StorageType.FRIDGE).length})
              </button>
              <button
                onClick={() => setActiveTab(StorageType.FREEZER)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === StorageType.FREEZER 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Snowflake size={15} />
                냉동 ({ingredients.filter(i => i.storage === StorageType.FREEZER).length})
              </button>
              <button
                onClick={() => setActiveTab(StorageType.PANTRY)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === StorageType.PANTRY 
                    ? 'bg-white text-amber-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Package size={15} />
                실온 ({ingredients.filter(i => i.storage === StorageType.PANTRY).length})
              </button>
            </div>

            <div className="space-y-4 pb-20">
              {filteredIngredients.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <Search size={24} />
                  </div>
                  <p className="text-gray-500 font-medium">등록된 재료가 없어요.</p>
                  <p className="text-gray-400 text-sm mt-1">아래 + 버튼을 눌러 추가해주세요.</p>
                </div>
              ) : (
                categoryOrder.map(cat => {
                  const items = groupedIngredients[cat];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={cat} className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <h3 className="font-bold text-slate-700 text-sm">{CATEGORY_LABELS[cat]}</h3>
                        <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded-full font-medium">{items.length}</span>
                      </div>
                      <div className="space-y-0">
                        {items.map(ingredient => (
                          <IngredientItem 
                            key={ingredient.id} 
                            ingredient={ingredient} 
                            onDelete={handleDeleteIngredient}
                            onEdit={handleEditIngredient}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {view === 'RECIPES' && (
          <div className="animate-fade-in">
            {isGeneratingRecipes && recipes.length === 0 ? (
              <div className="text-center py-20">
                <div className="animate-bounce mb-4 text-4xl">
                    {isUsingAI ? '🤖' : '🧑‍🍳'}
                </div>
                {recipes.length > 0 ? (
                    <>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                             메뉴를 다시 생각 중입니다!
                        </h2>
                        <p className="text-slate-500">조금만 기다려주세요...</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            {isUsingAI ? 'AI 셰프가 고민 중!' : '공공 레시피를 찾는 중!'}
                        </h2>
                        <p className="text-slate-500">
                            {isUsingAI 
                                ? '당신의 재료로 창의적인 요리를 생각하고 있습니다...' 
                                : '내장된 레시피 데이터베이스에서 맛있는 요리를 찾고 있습니다...'
                            }
                        </p>
                    </>
                )}
              </div>
            ) : recipes.length > 0 ? (
              <div className="pb-10">
                <div className="flex p-1 bg-gray-200 rounded-xl mb-6 gap-0.5 sticky top-[5.5rem] z-10 shadow-sm">
                  {['MAIN', 'SIDE', 'SNACK'].map(tab => (
                     <button
                     key={tab}
                     onClick={() => setActiveRecipeTab(tab as any)}
                     className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all relative ${
                       activeRecipeTab === tab 
                         ? 'bg-white text-indigo-700 shadow-sm' 
                         : 'text-slate-500 hover:text-slate-700'
                     }`}
                   >
                     {tab === 'MAIN' ? <ChefHat size={16} /> : tab === 'SIDE' ? <Utensils size={16} /> : <Coffee size={16} />} 
                     {tab === 'MAIN' ? '메인요리' : tab === 'SIDE' ? '반찬' : '간식'}
                     {/* Loading Indicators */}
                     {(backgroundLoading && activeRecipeTab !== tab && (recipes.filter(r => r.recipeType === tab).length === 0)) || regeneratingTab === tab ? (
                         <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                     ) : null}
                   </button>
                  ))}
                </div>

                <div className="animate-fade-in min-h-[50vh]">
                    {regeneratingTab === activeRecipeTab ? (
                         <div className="flex flex-col items-center justify-center py-20 h-full animate-fade-in">
                            <div className="animate-spin text-indigo-500 mb-4"><RefreshCw size={32}/></div>
                            <h3 className="text-lg font-bold text-slate-700 text-center leading-relaxed">
                                {isUsingAI ? 'AI 셰프가' : '다른 추천'}<br/>
                                {activeRecipeTab === 'MAIN' ? '메인 요리' : activeRecipeTab === 'SIDE' ? '반찬' : '간식'} 메뉴를<br/>
                                다시 찾고 있어요!
                            </h3>
                        </div>
                    ) : displayRecipes.length > 0 ? (
                        displayRecipes.map(recipe => (
                            <RecipeCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                isSaved={isRecipeSaved(recipe.id)}
                                onToggleSave={handleToggleSaveRecipe}
                            />
                        ))
                    ) : (
                         <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                             {backgroundLoading ? (
                                <>
                                    <div className="animate-spin text-indigo-500 mb-2 mx-auto"><RefreshCw size={24}/></div>
                                    <p className="text-slate-500 font-medium">메뉴를 불러오고 있습니다...</p>
                                </>
                             ) : (
                                <>
                                    <p className="text-slate-400 font-medium">추천된 메뉴가 없습니다.</p>
                                    <p className="text-xs text-slate-300 mt-2">다른 카테고리를 확인해보세요.</p>
                                </>
                             )}
                         </div>
                    )}
                </div>

                {/* AI Disclaimer */}
                <div className="my-8 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                        <strong>{isUsingAI ? 'AI 셰프 안내' : '추천 레시피 안내'}:</strong><br/>
                        {isUsingAI 
                            ? '생성형 AI(Gemini)가 추천한 레시피로, 실제 조리법과 다를 수 있습니다.' 
                            : '검증된 인기 레시피 데이터베이스를 기반으로 추천된 결과입니다.'
                        }
                    </p>
                </div>

                {/* Regenerate Button - NOW FOR BOTH MODES */}
                <div className="pt-4 pb-4 text-center">
                    <button
                        onClick={handleRegenerateCurrentCategory}
                        disabled={regeneratingTab !== null}
                        className="bg-white text-indigo-600 border border-indigo-200 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 mx-auto disabled:opacity-50 disabled:active:scale-100"
                    >
                        <RefreshCw size={18} className={regeneratingTab ? 'animate-spin' : ''} />
                        {regeneratingTab 
                            ? '메뉴 다시 찾는 중...' 
                            : isUsingAI 
                                ? `${activeRecipeTab === 'MAIN' ? '메인 요리' : activeRecipeTab === 'SIDE' ? '반찬' : '간식'}만 다시 요청하기`
                                : `${activeRecipeTab === 'MAIN' ? '메인 요리' : activeRecipeTab === 'SIDE' ? '반찬' : '간식'} 다시 검색하기`
                        }
                    </button>
                    <p className="text-xs text-slate-400 mt-2">
                        {isUsingAI ? '현재 탭의 메뉴를 AI에게 다시 요청합니다.' : '현재 재료로 만들 수 있는 다른 메뉴를 찾아봅니다.'}
                    </p>
                </div>
                
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500">추천할 수 있는 레시피가 없어요 😭<br/>재료를 더 등록해보세요!</p>
              </div>
            )}
          </div>
        )}

        {/* ... Saved Recipes View (Kept same) ... */}
        {view === 'SAVED_RECIPES' && (
             <div className="animate-fade-in pb-40">
                {savedRecipes.length > 0 ? (
                    <>
                        <div className="bg-pink-50 p-4 rounded-xl mb-6 border border-pink-100 flex items-start gap-3">
                            <Heart className="text-pink-500 mt-1 shrink-0" fill="currentColor" size={20} />
                            <div className="text-sm text-pink-800">
                                <p className="font-bold mb-1">찜해둔 요리 목록입니다.</p>
                                <p>언제든지 레시피를 다시 확인하고 요리할 수 있어요.</p>
                            </div>
                        </div>

                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                            <button 
                                onClick={() => setShowShoppingList(false)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${!showShoppingList ? 'bg-white shadow-sm text-pink-600' : 'text-slate-400'}`}
                            >
                                <List size={16} /> 레시피 보기
                            </button>
                            <button 
                                onClick={() => setShowShoppingList(true)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${showShoppingList ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                            >
                                <CheckSquare size={16} /> 장보기 리스트
                            </button>
                        </div>

                        {showShoppingList ? (
                            <div className="animate-fade-in">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                                    <ShoppingCart size={20} className="text-indigo-600" />
                                    장보기 체크리스트
                                </h3>
                                {getShoppingList().length > 0 ? (
                                    <>
                                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-32">
                                            {getShoppingList().map((item, idx) => (
                                                <label key={idx} className="p-4 border-b border-slate-100 last:border-0 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer group select-none">
                                                    <div className="relative flex items-center mt-1">
                                                        <input 
                                                            type="checkbox" 
                                                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                                                            onChange={() => handleToggleShoppingItem(item.name)}
                                                            checked={selectedShoppingItems.has(item.name)}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-bold text-base transition-colors ${selectedShoppingItems.has(item.name) ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-indigo-700'}`}>
                                                            {item.name}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {item.recipes.map((r, i) => (
                                                                <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                                                                    {r}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        
                                        {/* Fixed Bottom Footer for Confirmation */}
                                        {selectedShoppingItems.size > 0 && (
                                            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 p-4 pb-8 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                                <button
                                                    onClick={handleConfirmShopping}
                                                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-base"
                                                >
                                                    <CheckSquare size={20} />
                                                    냉장고에 넣기 ({selectedShoppingItems.size}개)
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                                        <p className="text-slate-500 font-bold">살 것이 없어요! 🎉</p>
                                        <p className="text-xs text-slate-400 mt-1">모든 재료가 냉장고에 있습니다.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            savedRecipes.map(recipe => (
                                <RecipeCard 
                                    key={recipe.id} 
                                    recipe={recipe} 
                                    isSaved={true}
                                    onToggleSave={handleToggleSaveRecipe}
                                />
                            ))
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-300">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 mb-2">아직 찜한 요리가 없어요.</h2>
                        <p className="text-slate-500 text-sm">
                            '요리 추천 받기'에서 마음에 드는 메뉴의<br/>
                            하트(❤️)를 눌러 저장해보세요!
                        </p>
                    </div>
                )}
             </div>
        )}

        {view === 'INVENTORY' && (
          <button
            onClick={() => {
              setEditingIngredient(null);
              setIsAddModalOpen(true);
            }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 rounded-full text-white shadow-xl flex items-center justify-center hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all z-40 app-fab"
          >
            <Plus size={28} />
          </button>
        )}

      </main>

      <AddIngredientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveIngredient}
        initialData={editingIngredient}
        defaultStorage={activeTab}
        existingIngredients={ingredients}
      />

      {isSyncModalOpen && (
        <DataSyncModal 
          onClose={() => setIsSyncModalOpen(false)}
          onImport={handleImportData}
          ingredients={ingredients}
          basicSeasonings={basicSeasonings}
        />
      )}

    </div>
  );
}
