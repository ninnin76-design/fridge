
export enum StorageType {
  FRIDGE = 'FRIDGE',
  FREEZER = 'FREEZER',
  PANTRY = 'PANTRY',
}

export enum Category {
  VEGETABLE = 'VEGETABLE', // 야채
  FRUIT = 'FRUIT',         // 과일
  MEAT = 'MEAT',           // 육류
  FISH = 'FISH',           // 어류/해산물
  DAIRY = 'DAIRY',         // 유제품/계란 (New)
  GRAIN = 'GRAIN',         // 곡류/면 (New)
  PROCESSED = 'PROCESSED', // 가공식품 (New)
  SAUCE = 'SAUCE',         // 소스/양념
  ETC = 'ETC',             // 기타
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string; // e.g., "300g", "2 items", "half bag", or "항상 있음"
  storage: StorageType;
  category: Category;
  isAlwaysAvailable?: boolean; // For items like salt, soy sauce
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  emoji: string;
  recipeType: 'MAIN' | 'SIDE' | 'SNACK';
  ingredientsUsed: string[]; // List of ingredient names used from inventory
  missingIngredients: string[]; // Small things mostly, salt/pepper etc.
  instructions: string[];
  cookingTime: string;
}

export interface InventoryUpdate {
  id: string;
  newQuantity: string;
  usedAmount: string; // Message about what was used
}

export interface DailyPlan {
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
}