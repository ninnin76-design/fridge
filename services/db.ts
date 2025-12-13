
import { Ingredient, Recipe } from '../types';

const DB_NAME = 'MomsSmartFridgeDB';
const DB_VERSION = 1;
const STORE_INGREDIENTS = 'ingredients';
const STORE_SEASONINGS = 'seasonings';
const STORE_SAVED_RECIPES = 'saved_recipes';

export const db = {
  // Open Database
  open: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_INGREDIENTS)) {
          db.createObjectStore(STORE_INGREDIENTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_SEASONINGS)) {
          db.createObjectStore(STORE_SEASONINGS, { keyPath: 'name' });
        }
        if (!db.objectStoreNames.contains(STORE_SAVED_RECIPES)) {
          db.createObjectStore(STORE_SAVED_RECIPES, { keyPath: 'id' });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // --- Ingredients Operations ---

  getAllIngredients: async (): Promise<Ingredient[]> => {
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_INGREDIENTS, 'readonly');
      const store = tx.objectStore(STORE_INGREDIENTS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },
  
  saveIngredient: async (ingredient: Ingredient): Promise<void> => {
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_INGREDIENTS, 'readwrite');
      const store = tx.objectStore(STORE_INGREDIENTS);
      const request = store.put(ingredient); // put handles both add and update
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  deleteIngredient: async (id: string): Promise<void> => {
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_INGREDIENTS, 'readwrite');
      const store = tx.objectStore(STORE_INGREDIENTS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  bulkAddIngredients: async (ingredients: Ingredient[]): Promise<void> => {
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_INGREDIENTS, 'readwrite');
      const store = tx.objectStore(STORE_INGREDIENTS);
      ingredients.forEach(ing => store.put(ing));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  // --- Seasonings Operations ---

  getAllSeasonings: async (): Promise<string[]> => {
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_SEASONINGS, 'readonly');
      const store = tx.objectStore(STORE_SEASONINGS);
      const request = store.getAll();
      request.onsuccess = () => {
          // Map back from object {name: 'salt'} to string 'salt'
          const names = (request.result as {name:string}[]).map(i => i.name);
          resolve(names);
      };
      request.onerror = () => reject(request.error);
    });
  },

  setAllSeasonings: async (names: string[]): Promise<void> => {
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_SEASONINGS, 'readwrite');
      const store = tx.objectStore(STORE_SEASONINGS);
      
      // Efficiently replace list: clear -> bulk add
      store.clear().onsuccess = () => {
          names.forEach(name => store.put({ name }));
      };
      
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  // --- Saved Recipes Operations ---

  getAllSavedRecipes: async (): Promise<Recipe[]> => {
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_SAVED_RECIPES, 'readonly');
      const store = tx.objectStore(STORE_SAVED_RECIPES);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  toggleSavedRecipe: async (recipe: Recipe): Promise<boolean> => {
    // Returns true if added, false if removed
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_SAVED_RECIPES, 'readwrite');
      const store = tx.objectStore(STORE_SAVED_RECIPES);
      
      const getReq = store.get(recipe.id);
      getReq.onsuccess = () => {
          if (getReq.result) {
              store.delete(recipe.id);
              resolve(false); // Removed
          } else {
              store.put(recipe);
              resolve(true); // Added
          }
      };
      getReq.onerror = () => reject(getReq.error);
    });
  },

  bulkUpdateSavedRecipes: async (recipes: Recipe[]): Promise<void> => {
    const dbInstance = await db.open();
    return new Promise((resolve, reject) => {
      const tx = dbInstance.transaction(STORE_SAVED_RECIPES, 'readwrite');
      const store = tx.objectStore(STORE_SAVED_RECIPES);
      recipes.forEach(r => store.put(r));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  deleteDatabase: async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        console.warn("Database deletion blocked.");
      };
    });
  }
};
