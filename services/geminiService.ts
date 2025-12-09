
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Ingredient, Recipe, InventoryUpdate, StorageType, Category } from "../types";

const MODEL_NAME = "gemini-2.5-flash";

// Helper to clean JSON string if markdown blocks are present
function cleanJsonString(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  return cleaned;
}

const generateInventoryDescription = (ingredients: Ingredient[]) => {
    return ingredients
    .map(i => {
        let storageLabel = '냉장';
        if (i.storage === StorageType.FREEZER) storageLabel = '냉동';
        if (i.storage === StorageType.PANTRY) storageLabel = '실온';
        return `- ${i.name} [${storageLabel}]`;
    })
    .join('\n');
};

/**
 * Validates the API Key by making a direct REST API call.
 * This bypasses the SDK's potential auto-authentication in dev environments (like AI Studio/IDX),
 * ensuring the key provided is ACTUALLY valid.
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey || apiKey.trim().length < 15) return false;

  try {
    // Direct REST call to bypass SDK environment magic
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
    
    const challengeCode = `VALIDATION_${Date.now()}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `Reply with: ${challengeCode}` }]
            }]
        })
    });

    // If the key is invalid, Google returns 400 or 403
    if (!response.ok) {
        console.warn(`API Validation Failed: ${response.status}`);
        return false;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Strict content check
    if (text && text.includes(challengeCode)) {
        return true;
    }
    
    return false;
  } catch (error) {
    console.warn("API Key Validation Network Error:", error);
    return false;
  }
};

export const suggestSpecificRecipes = async (
  apiKey: string,
  ingredients: Ingredient[], 
  type: 'MAIN' | 'SIDE' | 'SNACK', 
  count: number
): Promise<Recipe[]> => {
  if (ingredients.length === 0) return [];
  
  // STRICT VALIDATION: Block keys shorter than 15 chars immediately
  if (!apiKey || apiKey.trim().length < 15) {
      throw new Error("INVALID_API_KEY");
  }

  try {
    // Instantiate AI with the user-provided key
    const ai = new GoogleGenAI({ apiKey });

    const inventoryDescription = generateInventoryDescription(ingredients);
    const typeLabel = type === 'MAIN' ? '메인 요리 (MAIN)' : type === 'SIDE' ? '반찬 (SIDE)' : '간식 (SNACK)';

    const prompt = `
      당신은 아이들을 위한 전문 요리사입니다. 내 냉장고 재료를 활용해 "${typeLabel}" 메뉴를 ${count}가지 추천해주세요.
      
      [보유 재료 목록]
      ${inventoryDescription}
      
      [기본 전제 조건]
      1. 이 목록에 있는 재료는 요리하기에 충분한 양이 있다고 가정하세요.
      2. 기본 조미료(소금, 설탕, 간장 등)는 집에 있다고 가정하세요.

      [요청 사항]
      - 카테고리: ${type}
      - 개수: ${count}개
      - 'missingIngredients' 필드 필수: 내 냉장고에 없지만 꼭 필요한 재료만 적으세요.
      - **장보기 최적화**: 부족한 재료는 반드시 '마트에서 구매할 수 있는 원재료명'으로 적으세요. (예: 밥 -> 쌀, 토스트 -> 식빵, 계란후라이 -> 계란)
      - 아이들이 좋아할 만한 메뉴 위주로 선정해주세요.
      - 창의적이고 맛있는 레시피를 제안해주세요.

      [출력 형식]
      JSON 배열로 응답하세요. 모든 항목의 recipeType은 반드시 "${type}"이어야 합니다.
    `;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          emoji: { type: Type.STRING },
          recipeType: { type: Type.STRING, enum: [type] },
          ingredientsUsed: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of ingredients from my inventory used in this recipe"
          },
          missingIngredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Raw ingredients needed for shopping that are NOT in my inventory"
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          cookingTime: { type: Type.STRING }
        },
        required: ["name", "description", "emoji", "recipeType", "ingredientsUsed", "instructions", "cookingTime"]
      }
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8, 
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text from AI");
    }
    
    const rawRecipes = JSON.parse(cleanJsonString(text)) as Partial<Recipe>[];
    
    return rawRecipes.map((r, index) => ({
      id: r.id || `ai-${type}-${Date.now()}-${index}`,
      name: r.name || 'AI 추천 메뉴',
      description: r.description || 'AI 셰프가 추천하는 맛있는 요리입니다.',
      emoji: r.emoji || '🤖',
      recipeType: type,
      ingredientsUsed: Array.isArray(r.ingredientsUsed) ? r.ingredientsUsed : [],
      missingIngredients: Array.isArray(r.missingIngredients) ? r.missingIngredients : [],
      instructions: Array.isArray(r.instructions) ? r.instructions : ['조리법이 제공되지 않았습니다.'],
      cookingTime: r.cookingTime || '15분'
    }));

  } catch (error: any) {
    console.error(`AI Generation Failed:`, error);
    
    // CRITICAL: Treat ANY error in this block as an API Key/Auth issue.
    throw new Error("INVALID_API_KEY");
  }
};

export const parseInventoryFromImage = async (apiKey: string, base64Image: string): Promise<Ingredient[]> => {
  if (!apiKey || apiKey.length < 15) throw new Error("INVALID_API_KEY");
  
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Analyze this image of a refrigerator inventory list/report.
      Extract all the ingredients listed.
      
      For each item, identify:
      1. Name (Korean)
      2. Storage Location (Infer based on the section header in the image if possible. Options: 'FRIDGE', 'FREEZER', 'PANTRY'. Default to 'FRIDGE' if unsure.)
      3. Category (Infer based on the item name. Options: 'VEGETABLE', 'FRUIT', 'MEAT', 'FISH', 'DAIRY', 'GRAIN', 'PROCESSED', 'ETC'. Default to 'ETC'.)
      
      Return a JSON array of ingredients. Quantity information is NOT needed.
    `;

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image
      }
    };

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          storage: { type: Type.STRING, enum: ['FRIDGE', 'FREEZER', 'PANTRY'] },
          category: { type: Type.STRING, enum: ['VEGETABLE', 'FRUIT', 'MEAT', 'FISH', 'DAIRY', 'GRAIN', 'PROCESSED', 'SAUCE', 'ETC'] }
        },
        required: ["name", "storage", "category"]
      }
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          imagePart, 
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) return [];

    const parsedItems = JSON.parse(cleanJsonString(text)) as any[];
    
    return parsedItems.map(item => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      name: item.name,
      quantity: '',
      storage: item.storage as StorageType,
      category: item.category as Category,
      isAlwaysAvailable: false
    }));

  } catch (error: any) {
    console.error("Error parsing image inventory with AI:", error);
    throw new Error("INVALID_API_KEY");
  }
};
