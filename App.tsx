import React, { useState, useEffect, useRef } from 'react';
import { Plus, Snowflake, Layers, ChefHat, Search, ArrowLeft, Package, ClipboardList, RefreshCw, ShoppingCart, Heart, Coffee, Utensils, CheckSquare, List, Users, AlertTriangle, Sparkles, Share2, Download, X, MoreVertical, Globe, Loader2, Smartphone, ArrowRightLeft, Key } from 'lucide-react';
import { Ingredient, StorageType, Recipe, Category } from './types';
import { DEFAULT_BASIC_SEASONINGS, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_EMOJIS, STORAGE_LABELS } from './constants';
import { IngredientItem } from './components/IngredientItem';
import { AddIngredientModal } from './components/AddIngredientModal';
import { RecipeCard } from './components/RecipeCard';
import { TotalListView } from './components/TotalListView';
import { BasicSeasoningManager } from './components/BasicSeasoningManager';
import { DataSyncModal } from './components/DataSyncModal';
import { SaltShakerIcon } from './components/SaltShakerIcon';
import { CustomKeyIcon } from './components/CustomKeyIcon';
import { ApiKeyModal } from './components/ApiKeyModal';
import { MessageModal } from './components/MessageModal';
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
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [view, setView] = useState<'INVENTORY' | 'RECIPES' | 'TOTAL' | 'SEASONINGS' | 'SAVED_RECIPES'>('INVENTORY');
  
  // Recipe State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeRecipeTab, setActiveRecipeTab] = useState<'MAIN' | 'SIDE' | 'SNACK'>('MAIN');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [isUsingAI, setIsUsingAI] = useState(false); 
  
  const [regeneratingTab, setRegeneratingTab] = useState<'MAIN' | 'SIDE' | 'SNACK' | null>(null);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [selectedShoppingItems, setSelectedShoppingItems] = useState<Set<string>>(new Set());

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false); 
  
  const installStartRef = useRef<number>(0);

  // Alert Modal State
  const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; onConfirm?: () => void }>({
    isOpen: false,
    message: '',
  });

  const showAlert = (message: string, onConfirm?: () => void) => {
    setAlertState({ isOpen: true, message, onConfirm });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
    if (alertState.onConfirm) {
        alertState.onConfirm();
    }
  };

  const loadSavedRecipes = async () => {
    try {
      const dbRecipes = await db.getAllSavedRecipes();
      const validRecipes = Array.isArray(dbRecipes) 
        ? dbRecipes.filter(r => r && typeof r === 'object' && r.id && r.name)
        : [];
      setSavedRecipes(validRecipes);
    } catch (error) {
      console.error("Failed to load saved recipes:", error);
      setSavedRecipes([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dbIngredients, dbSeasonings] = await Promise.all([
          db.getAllIngredients(),
          db.getAllSeasonings()
        ]);
        setIngredients(dbIngredients);
        await loadSavedRecipes();
        if (dbSeasonings.length === 0) {
           await db.setAllSeasonings(DEFAULT_BASIC_SEASONINGS);
           setBasicSeasonings(DEFAULT_BASIC_SEASONINGS);
        } else {
           setBasicSeasonings(dbSeasonings);
        }
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setCustomApiKey(savedKey);
      } catch (error) {
        console.error("Failed to load data from DB:", error);
      }
    };
    loadData();
    const checkEnvironment = () => {
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
        setIsInstallable(!isStandalone);
    };
    checkEnvironment();
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    const handleAppInstalled = () => {
        setIsInstalling(false);
        setDeferredPrompt(null);
        setIsInstallable(false);
        if (installStartRef.current > 0 && Date.now() - installStartRef.current < 5000) return;
        showAlert("설치가 완료되었습니다!\n홈 화면에서 앱을 실행해주세요. 🎉");
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (view === 'SAVED_RECIPES') loadSavedRecipes();
  }, [view]);

  const handleSaveIngredient = async (data: (Omit<Ingredient, 'id'> & { id?: string }) | (Omit<Ingredient, 'id'> & { id?: string })[]) => {
    const dataArray = Array.isArray(data) ? data : [data];
    const itemsToSave: Ingredient[] = [];
    dataArray.forEach(item => {
        const newItem: Ingredient = {
            ...item,
            id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
        itemsToSave.push(newItem);
    });
    await db.bulkAddIngredients(itemsToSave);
    setIngredients(prev => {
      let next = [...prev];
      itemsToSave.forEach(newItem => {
          const index = next.findIndex(i => i.id === newItem.id);
          if (index !== -1) next[index] = newItem;
          else next.push(newItem);
      });
      return next;
    });
    setEditingIngredient(null);
  };

  const handleQuickMove = async (id: string) => {
    const item = ingredients.find(i => i.id === id);
    if (!item) return;

    let nextStorage: StorageType;
    if (item.storage === StorageType.FRIDGE) nextStorage = StorageType.FREEZER;
    else if (item.storage === StorageType.FREEZER) nextStorage = StorageType.PANTRY;
    else nextStorage = StorageType.FRIDGE;

    const updatedItem = { ...item, storage: nextStorage };
    await db.saveIngredient(updatedItem);
    
    setIngredients(prev => prev.map(i => i.id === id ? updatedItem : i));
  };

  const handleDeleteIngredient = async (id: string) => {
    await db.deleteIngredient(id);
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsAddModalOpen(true);
  };

  const updateBasicSeasonings = async (newSeasonings: string[]) => {
      await db.setAllSeasonings(newSeasonings);
      setBasicSeasonings(newSeasonings);
  };

  const handleToggleSaveRecipe = async (recipe: Recipe) => {
      const isAdded = await db.toggleSavedRecipe(recipe);
      setSavedRecipes(prev => {
          if (!isAdded) return prev.filter(r => r.id !== recipe.id);
          else return [recipe, ...prev];
      });
  };

  const isRecipeSaved = (id: string) => Array.isArray(savedRecipes) && savedRecipes.some(r => r.id === id);

  const handleFactoryReset = async () => {
    if (window.confirm("모든 데이터가 삭제됩니다. 초기화 하시겠습니까?")) {
        try {
            await db.deleteDatabase();
            localStorage.clear();
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) await registration.unregister();
            }
            alert("초기화되었습니다.");
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("초기화 중 오류가 발생했습니다.");
        }
    }
  };

  const handleImportData = async (rawIngredients: any[], rawSeasonings?: string[]) => {
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
          const matchedKey = Object.keys(CATEGORY_LABELS).find(key => CATEGORY_LABELS[key as Category] === cRaw);
          if (matchedKey) category = matchedKey as Category;
          const exists = ingredients.some(i => i.name === item.name && i.storage === storage);
          if (!exists) {
              validIngredients.push({
                  id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  name: item.name,
                  quantity: '',
                  storage, category,
                  isAlwaysAvailable: false
              });
              counts[storage]++;
          }
        });
      }
      const validSeasonings = Array.isArray(rawSeasonings) ? rawSeasonings.filter(s => typeof s === 'string' && s.trim() !== '') : [];
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
            if (counts[StorageType.FREEZER] > 0 && counts[StorageType.FREEZER] >= counts[StorageType.FRIDGE]) setActiveTab(StorageType.FREEZER);
            else if (counts[StorageType.PANTRY] > 0 && counts[StorageType.PANTRY] >= counts[StorageType.FRIDGE]) setActiveTab(StorageType.PANTRY);
            else setActiveTab(StorageType.FRIDGE);
          }
          showAlert(`✅ 데이터 동기화 완료!`);
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

  const generateRecipesCommon = async (useAI: boolean) => {
      setView('RECIPES');
      setRecipes([]);
      setActiveRecipeTab('MAIN');
      setIsGeneratingRecipes(true);
      setBackgroundLoading(false);
      setRegeneratingTab(null);
      setIsUsingAI(useAI);
      const allIngredients = getAllAvailableIngredients();
      try {
          let fetchFn: (type: 'MAIN' | 'SIDE' | 'SNACK') => Promise<Recipe[]>;
          if (useAI) fetchFn = (type) => suggestAIRecipes(allIngredients, type, type === 'MAIN' ? 3 : 2, customApiKey);
          else fetchFn = (type) => searchPublicRecipes(allIngredients, type);
          const mainRecipes = await fetchFn('MAIN');
          setRecipes(Array.isArray(mainRecipes) ? mainRecipes : []);
          setIsGeneratingRecipes(false);
          setBackgroundLoading(true);
          Promise.all([fetchFn('SIDE'), fetchFn('SNACK')]).then(([sideRecipes, snackRecipes]) => {
              setRecipes(prev => [...prev, ...(Array.isArray(sideRecipes) ? sideRecipes : []), ...(Array.isArray(snackRecipes) ? snackRecipes : [])]);
              setBackgroundLoading(false);
          }).catch(() => setBackgroundLoading(false));
      } catch (error: any) {
          setIsGeneratingRecipes(false);
          showAlert(`AI 연결에 실패했습니다.\n\n${error.message}`);
      }
  };

  const handleGeneratePublicRecipes = () => generateRecipesCommon(false);
  const handleGenerateAIRecipes = () => {
      if (!customApiKey) {
          showAlert("AI 기능을 위해 API 키 설정이 필요합니다.", () => setIsApiKeyModalOpen(true));
          return;
      }
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
      try {
        const newRecipes = isUsingAI 
          ? await suggestAIRecipes(allIngredients, targetTab, targetTab === 'MAIN' ? 3 : 2, customApiKey)
          : await searchPublicRecipes(allIngredients, targetTab);
        setRecipes(prev => [...prev.filter(r => r.recipeType !== targetTab), ...(Array.isArray(newRecipes) ? newRecipes : [])]);
      } catch (e: any) {
          showAlert(`실패했습니다.\n\n${e.message}`);
      }
      setRegeneratingTab(null);
  };

  const displayRecipes = recipes.filter(r => r.recipeType === activeRecipeTab);

  const getShoppingList = () => {
      const listMap = new Map<string, string[]>();
      savedRecipes.forEach(recipe => {
          if (recipe.missingIngredients) {
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
      itemsToBuy.forEach(name => {
           const category = autoDetectCategory(name) || Category.ETC;
           let storage = StorageType.FRIDGE;
           if (category === Category.GRAIN || category === Category.SAUCE || category === Category.ETC) storage = StorageType.PANTRY;
           newIngredients.push({
               id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
               name, category, storage, quantity: '', isAlwaysAvailable: false
           });
      });
      await handleSaveIngredient(newIngredients);
      const updatedRecipes = savedRecipes.map(r => {
          if (!r.missingIngredients) return r;
          const remaining = r.missingIngredients.filter(ing => !selectedShoppingItems.has(ing));
          return { ...r, missingIngredients: remaining };
      });
      await db.bulkUpdateSavedRecipes(updatedRecipes);
      setSavedRecipes(updatedRecipes);
      showAlert(`${itemsToBuy.length}개의 재료를 등록했습니다!`);
      setSelectedShoppingItems(new Set());
  };
  
  const handleSaveApiKey = (key: string) => {
      setCustomApiKey(key);
      if (key) localStorage.setItem('gemini_api_key', key);
      else localStorage.removeItem('gemini_api_key');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showAlert('주소가 복사되었습니다!');
    } catch (err) {
      showAlert('실패했습니다.');
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
           setDeferredPrompt(null);
           installStartRef.current = Date.now();
           setIsInstalling(false);
           showAlert("설치 중입니다.");
        } else setIsInstalling(false);
      } catch (e) {
        setIsInstalling(false);
      }
    } else setShowInstallModal(true);
  };

  const fridgeCount = ingredients.filter(i => i.storage === StorageType.FRIDGE).length;
  const freezerCount = ingredients.filter(i => i.storage === StorageType.FREEZER).length;
  const pantryCount = ingredients.filter(i => i.storage === StorageType.PANTRY).length;

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between app-header">
        {(view === 'RECIPES' || view === 'SAVED_RECIPES' || view === 'TOTAL' || view === 'SEASONINGS') ? (
          <button onClick={() => setView('INVENTORY')} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full"><ArrowLeft /></button>
        ) : (
          <div className="flex flex-col min-w-0 mr-2">
            <h1 className="text-lg sm:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-800 whitespace-nowrap leading-none mb-1 truncate">엄마의 냉장고</h1>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wide whitespace-nowrap opacity-75 truncate">오늘 뭐 먹지 고민 해결! 🥘</p>
          </div>
        )}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-full shrink-0">
          {view === 'INVENTORY' && (
            <div className="flex gap-0.5">
                <button onClick={handleShare} className="bg-white p-1.5 rounded-full text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"><Share2 size={16} /></button>
                <button onClick={() => setIsSyncModalOpen(true)} className="bg-white p-1.5 rounded-full text-slate-600 shadow-sm hover:text-green-600 transition-colors"><Users size={16} /></button>
                <button onClick={() => setView('SEASONINGS')} className="bg-white p-1.5 rounded-full text-slate-600 shadow-sm hover:text-amber-600 transition-colors"><SaltShakerIcon size={16} /></button>
                <button onClick={() => setView('TOTAL')} className="bg-white p-1.5 rounded-full text-slate-600 shadow-sm hover:text-slate-900 transition-colors"><ClipboardList size={16} /></button>
            </div>
          )}
        </div>
        {view === 'INVENTORY' && (
            <button onClick={() => setView('SAVED_RECIPES')} className="bg-pink-50 p-2 rounded-full text-pink-500 hover:bg-pink-100 transition-colors relative ml-1 shrink-0">
            <Heart size={20} fill={savedRecipes.length > 0 ? "currentColor" : "none"} />
            {savedRecipes.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{savedRecipes.length}</span>}
            </button>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4">
        {view === 'INVENTORY' && (
          <>
            {/* Redesigned Hero Dashboard Card */}
            <div className="mb-6 bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden app-stats">
               <div className="relative z-10">
                 <div className="mb-1">
                    <h2 className="text-2xl font-black tracking-tight leading-tight">재료가 {ingredients.length}개 있어요!</h2>
                    <p className="text-white/80 text-sm font-medium mt-1">아이들이 배고파하나요? 지금 바로 확인해보세요.</p>
                 </div>

                 <div className="flex gap-3 mt-8">
                    <button 
                      onClick={handleGeneratePublicRecipes} 
                      className="flex-1 h-14 bg-white text-[#6366f1] rounded-2xl font-black text-base shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <ChefHat size={20} /> 요리추천
                    </button>
                    <div className="flex-1 relative">
                      <button 
                        onClick={handleGenerateAIRecipes} 
                        className="w-full h-14 bg-black/20 text-white rounded-2xl font-black text-base shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10 backdrop-blur-md"
                      >
                          <Sparkles size={20} /> AI 추천
                      </button>
                      
                      {/* API Key Access Button - Relocated to top right of AI Recommendation button and icon changed to Key */}
                      <button 
                        onClick={() => setIsApiKeyModalOpen(true)} 
                        className="absolute -top-3 -right-2 w-10 h-10 flex items-center justify-center bg-white/20 text-white hover:bg-white/30 rounded-full transition-all backdrop-blur-md shadow-lg border border-white/10"
                        title="API 키 설정"
                      >
                         <Key size={18} />
                      </button>
                    </div>
                 </div>
               </div>
               
               <div className="absolute -right-8 -bottom-12 opacity-10 transform rotate-[-15deg] pointer-events-none">
                  <ChefHat size={180} />
               </div>
            </div>

            {/* Storage Tabs */}
            <div className="flex p-1 bg-gray-200 rounded-xl mb-4 gap-0.5 app-nav">
              <button onClick={() => setActiveTab(StorageType.FRIDGE)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === StorageType.FRIDGE ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Layers size={15} />{STORAGE_LABELS[StorageType.FRIDGE]} ({fridgeCount})
              </button>
              <button onClick={() => setActiveTab(StorageType.FREEZER)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === StorageType.FREEZER ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Snowflake size={15} />{STORAGE_LABELS[StorageType.FREEZER]} ({freezerCount})
              </button>
              <button onClick={() => setActiveTab(StorageType.PANTRY)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${activeTab === StorageType.PANTRY ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Package size={15} />{STORAGE_LABELS[StorageType.PANTRY]} ({pantryCount})
              </button>
            </div>

            <div className="space-y-4 pb-20">
              {filteredIngredients.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400"><Search size={24} /></div>
                  <p className="text-gray-500 font-medium">이곳은 비어있습니다.</p>
                </div>
              ) : (
                categoryOrder.map(cat => {
                  const items = groupedIngredients[cat];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={cat} className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <h3 className="font-bold text-slate-700 text-xs flex items-center"><span className="mr-1.5 text-lg leading-none">{CATEGORY_EMOJIS[cat]}</span>{CATEGORY_LABELS[cat]}</h3>
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{items.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {items.map(ingredient => (
                          <IngredientItem 
                            key={ingredient.id} 
                            ingredient={ingredient} 
                            onDelete={handleDeleteIngredient}
                            onEdit={handleEditIngredient}
                            onQuickMove={handleQuickMove}
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
                <div className="animate-bounce mb-4 text-4xl">{isUsingAI ? '🤖' : '🧑‍🍳'}</div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">요리 추천 중...</h2>
              </div>
            ) : recipes.length > 0 ? (
              <div className="pb-10">
                <div className="flex p-1 bg-gray-200 rounded-xl mb-6 gap-0.5 sticky top-[5.5rem] z-10 shadow-sm">
                  {['MAIN', 'SIDE', 'SNACK'].map(tab => (
                     <button key={tab} onClick={() => setActiveRecipeTab(tab as any)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeRecipeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                     {tab === 'MAIN' ? '메인요리' : tab === 'SIDE' ? '반찬' : '간식'}
                   </button>
                  ))}
                </div>
                <div className="animate-fade-in min-h-[50vh]">
                    {regeneratingTab === activeRecipeTab ? (
                         <div className="flex flex-col items-center justify-center py-20 h-full animate-fade-in">
                            <div className="animate-spin text-indigo-500 mb-4"><RefreshCw size={32}/></div>
                            <h3 className="text-lg font-bold text-slate-700 text-center">다시 추천 중...</h3>
                        </div>
                    ) : displayRecipes.length > 0 ? (
                        displayRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} isSaved={isRecipeSaved(recipe.id)} onToggleSave={handleToggleSaveRecipe} />)
                    ) : <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">추천 결과가 없습니다.</div>}
                </div>
                <div className="pt-4 pb-4 text-center">
                    <button onClick={handleRegenerateCurrentCategory} disabled={regeneratingTab !== null} className="bg-white text-indigo-600 border border-indigo-200 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2 mx-auto"><RefreshCw size={18} className={regeneratingTab ? 'animate-spin' : ''} />{regeneratingTab ? '추천 중...' : '다른 메뉴 추천받기'}</button>
                </div>
              </div>
            ) : <div className="text-center py-20"><p className="text-slate-500">추천할 수 있는 레시피가 없어요 😭</p></div>}
          </div>
        )}

        {view === 'SAVED_RECIPES' && (
          <div className="animate-fade-in min-h-[50vh]">
            {savedRecipes.length > 0 ? (
               <div className="space-y-6 pb-20">
                   {!showShoppingList ? (
                       <button onClick={() => setShowShoppingList(true)} className="w-full bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm active:scale-95 transition-all group">
                           <div className="flex items-center gap-3">
                               <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors"><ShoppingCart size={20} /></div>
                               <div className="text-left"><h3 className="font-bold text-slate-800 text-sm">부족한 재료 장보기</h3><p className="text-xs text-slate-500">찜한 레시피 재료 확인</p></div>
                           </div>
                           <List size={20} className="text-slate-400" />
                       </button>
                   ) : (
                       <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden shadow-lg animate-fade-in">
                           <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center"><h3 className="font-bold text-indigo-900 flex items-center gap-2"><ShoppingCart size={18} />장보기 목록</h3><button onClick={() => setShowShoppingList(false)} className="text-indigo-400 hover:text-indigo-700"><X size={18} /></button></div>
                           <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">{getShoppingList().length > 0 ? getShoppingList().map(item => (
                                        <div key={item.name} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" onClick={() => handleToggleShoppingItem(item.name)}>
                                            <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${selectedShoppingItems.has(item.name) ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 bg-white'}`}>{selectedShoppingItems.has(item.name) && <CheckSquare size={14} />}</div>
                                            <div className="flex-1"><div className="font-bold text-slate-700 text-sm">{item.name}</div><div className="text-[10px] text-slate-400 truncate w-48">{item.recipes.join(', ')}</div></div>
                                        </div>
                                    )) : <div className="text-center py-8 text-slate-400 text-sm">부족한 재료가 없습니다! 🎉</div>}</div>
                           {getShoppingList().length > 0 && <div className="p-3 bg-slate-50 border-t border-slate-100"><button onClick={handleConfirmShopping} disabled={selectedShoppingItems.size === 0} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"><Package size={16} />냉장고에 넣기 ({selectedShoppingItems.size})</button></div>}
                       </div>
                   )}
                   {savedRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} isSaved={true} onToggleSave={handleToggleSaveRecipe} />)}
               </div>
            ) : <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">찜한 레시피가 없습니다.</div>}
          </div>
        )}

        {view === 'TOTAL' && (
          <TotalListView 
            ingredients={ingredients} 
            basicSeasonings={basicSeasonings} 
            onClose={() => setView('INVENTORY')} 
          />
        )}

        {view === 'SEASONINGS' && (
          <BasicSeasoningManager 
            seasonings={basicSeasonings} 
            onUpdate={updateBasicSeasonings} 
            onClose={() => setView('INVENTORY')} 
          />
        )}

        {view === 'INVENTORY' && (
          <button onClick={() => { setEditingIngredient(null); setIsAddModalOpen(true); }} className={`fixed right-6 w-14 h-14 bg-slate-900 rounded-full text-white shadow-xl flex items-center justify-center hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all z-40 app-fab ${isInstallable ? 'bottom-24' : 'bottom-6'}`}><Plus size={28} /></button>
        )}
      </main>

      <MessageModal isOpen={alertState.isOpen} message={alertState.message} onClose={closeAlert} />
      <AddIngredientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveIngredient} initialData={editingIngredient} defaultStorage={activeTab} existingIngredients={ingredients} />
      {isSyncModalOpen && <DataSyncModal onClose={() => setIsSyncModalOpen(false)} onImport={handleImportData} onReset={handleFactoryReset} ingredients={ingredients} basicSeasonings={basicSeasonings} />}
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} onSave={handleSaveApiKey} currentKey={customApiKey} />
    </div>
  );
}
