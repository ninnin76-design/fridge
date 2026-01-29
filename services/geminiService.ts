
import { GoogleGenAI, Type } from "@google/genai";
import { Ingredient, Recipe, StorageType, Category } from "../types";

// Always use recommended model for standard text tasks
const MODEL_NAME = "gemini-3-flash-preview";

// Helper to clean JSON string if markdown blocks are present
function cleanJsonString(text: string): string {
  let cleaned = text.trim();
  // Remove markdown code blocks (```json ... ```)
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  return cleaned;
}

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export const suggestSpecificRecipes = async (
  ingredients: Ingredient[], 
  type: 'MAIN' | 'SIDE' | 'SNACK', 
  count: number,
  apiKey?: string
): Promise<Recipe[]> => {
  if (ingredients.length === 0) return [];
  
  const rawKey = apiKey || process.env.API_KEY || '';
  const finalApiKey = rawKey.trim();

  if (!finalApiKey) {
      // API Key check should happen immediately, no need to retry
      throw new Error("API Key가 설정되지 않았습니다.");
  }

  // Always initialize GoogleGenAI with a named parameter
  const ai = new GoogleGenAI({ apiKey: finalApiKey });

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

    결과는 반드시 JSON 배열 형식으로만 응답해주세요.
  `;

  let lastError: any = null;
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
        // Use ai.models.generateContent with model name and prompt/config
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            temperature: 0.7, 
            // Correct way to request JSON output using responseMimeType and responseSchema
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  emoji: { type: Type.STRING },
                  recipeType: { type: Type.STRING },
                  ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cookingTime: { type: Type.STRING }
                },
                required: ["name", "description", "emoji", "recipeType", "ingredientsUsed", "missingIngredients", "instructions", "cookingTime"],
              }
            }
          },
        });

        // Use response.text property (not a method)
        const text = response.text;
        if (!text) {
            throw new Error("AI 응답이 비어있습니다.");
        }
        
        let rawRecipes;
        try {
            rawRecipes = JSON.parse(cleanJsonString(text)) as Partial<Recipe>[];
        } catch (e) {
            console.error("JSON Parse Error:", text);
            throw new Error("AI 응답 형식이 올바르지 않습니다. (JSON Parsing Failed)");
        }
        
        if (!Array.isArray(rawRecipes)) {
            throw new Error("AI 응답이 목록 형식이 아닙니다.");
        }

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
        lastError = error;
        const msg = (error.message || "").toLowerCase();
        
        // 503 Service Unavailable or Overloaded - Retry logic
        if (msg.includes("503") || msg.includes("overloaded") || msg.includes("unavailable")) {
            console.warn(`AI Model Overloaded (Attempt ${attempt + 1}/${MAX_RETRIES}). Retrying...`);
            if (attempt < MAX_RETRIES - 1) {
                await delay(1500 * (attempt + 1)); // Exponential backoff: 1.5s, 3s, 4.5s
                continue;
            }
        }
        
        // Break loop for other errors (403, 400, etc.)
        break;
    }
  }

  // Handle final error if all retries failed
  console.error(`AI Generation Failed after attempts:`, lastError);
  
  let errorMessage = "알 수 없는 오류가 발생했습니다.";
  const msg = (lastError?.message || "").toLowerCase();

  if (msg.includes("503") || msg.includes("overloaded") || msg.includes("unavailable")) {
      errorMessage = "👩‍🍳 AI 셰프가 지금 너무 바빠요! (접속량 폭주)\n잠시만 기다렸다가 다시 시도해주세요.";
  } else if (msg.includes("403") || msg.includes("not enabled")) {
      errorMessage = "🚨 API 권한 오류 (403)\n\n구글 AI Studio 또는 Cloud Console에서 'Generative Language API'가 활성화되지 않았습니다.\n해당 프로젝트에서 API 사용 설정을 켜주세요.";
  } else if (msg.includes("api key")) {
      errorMessage = "🚨 API 키 오류\n\n입력하신 키가 올바르지 않습니다. 공백이 포함되었거나 만료된 키인지 확인해주세요.";
  } else if (msg.includes("400") || msg.includes("invalid_argument")) {
      errorMessage = "요청 오류 (400)\nAI 모델이 요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.";
  } else if (msg.includes("429")) {
      errorMessage = "사용량 초과 (429)\n무료 사용량을 모두 소진했습니다. 잠시 후 다시 시도해주세요.";
  } else if (msg.includes("404") || msg.includes("not found")) {
      errorMessage = `모델 오류 (404)\n'${MODEL_NAME}' 모델을 찾을 수 없거나 접근 권한이 없습니다.`;
  } else {
      errorMessage = `오류 내용: ${lastError?.message || "응답 없음"}`;
  }
  
  throw new Error(errorMessage);
};

export const parseInventoryFromImage = async (base64Image: string, apiKey?: string): Promise<Ingredient[]> => {
  try {
    const rawKey = apiKey || process.env.API_KEY || '';
    const finalApiKey = rawKey.trim();
    
    if (!finalApiKey) {
        throw new Error("API 키가 없습니다.");
    }
    const ai = new GoogleGenAI({ apiKey: finalApiKey });

    const prompt = `
      Analyze this image of a refrigerator inventory list.
      Extract ingredients.
      Return JSON array with properties: name, storage, category.
    `;

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image
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
        temperature: 0.4,
        // Enforce JSON structure via config
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              storage: { type: Type.STRING, description: 'FRIDGE, FREEZER, or PANTRY' },
              category: { type: Type.STRING }
            },
            required: ["name", "storage", "category"]
          }
        }
      },
    });

    // Use response.text property
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
    throw error;
  }
};
