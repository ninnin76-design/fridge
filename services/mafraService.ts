import { Ingredient, Recipe } from "../types";

// 내부적으로 사용할 레시피 타입 정의 (필요 재료 포함)
interface InternalRecipe extends Recipe {
  requiredIngredients: string[];
  score?: number; // 정렬을 위한 선택적 속성 추가
}

// [확장] 내장 데이터베이스: 한국인 인기 집밥 메뉴 (안전한 데이터셋)
const INTERNAL_RECIPE_DB: InternalRecipe[] = [
  // --- [MAIN] 메인 요리 ---
  {
    id: 'loc-main-1', name: '돼지고기 김치찌개', recipeType: 'MAIN', description: '한국인의 소울푸드', emoji: '🥘',
    cookingTime: '30분', instructions: ['김치와 돼지고기를 먹기 좋게 썹니다.', '냄비에 기름을 두르고 고기와 김치를 볶습니다.', '물을 붓고 끓이다가 다진마늘, 고춧가루, 국간장으로 간을 합니다.', '두부와 대파를 넣고 한소끔 더 끓입니다.'],
    requiredIngredients: ['돼지고기', '김치', '두부', '대파'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-2', name: '된장찌개', recipeType: 'MAIN', description: '구수한 맛이 일품', emoji: '🍲',
    cookingTime: '20분', instructions: ['멸치 육수를 냅니다.', '된장을 풀고 감자, 애호박, 양파를 넣어 끓입니다.', '두부와 팽이버섯, 청양고추를 넣습니다.', '마지막에 대파를 넣어 마무리합니다.'],
    requiredIngredients: ['된장', '두부', '애호박', '양파', '감자'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-3', name: '제육볶음', recipeType: 'MAIN', description: '매콤달콤 밥도둑', emoji: '🍖',
    cookingTime: '20분', instructions: ['돼지고기는 고추장, 간장, 설탕, 마늘 양념에 재워둡니다.', '팬에 기름을 두르고 고기를 볶습니다.', '양파, 대파, 당근을 넣고 함께 볶아냅니다.', '통깨를 뿌려 완성합니다.'],
    requiredIngredients: ['돼지고기', '양파', '대파', '당근'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-4', name: '소불고기', recipeType: 'MAIN', description: '달콤한 간장 양념', emoji: '🥩',
    cookingTime: '30분', instructions: ['소고기는 간장, 설탕, 배즙, 마늘, 참기름 양념에 재웁니다.', '팬에 고기를 볶다가 양파, 버섯, 당근을 넣습니다.', '국물이 자박해질 때까지 익힙니다.'],
    requiredIngredients: ['소고기', '양파', '당근', '버섯'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-5', name: '닭볶음탕', recipeType: 'MAIN', description: '얼큰한 국물 닭요리', emoji: '🐔',
    cookingTime: '50분', instructions: ['닭을 한번 데쳐 불순물을 제거합니다.', '물에 닭, 감자, 당근, 양파를 넣고 끓입니다.', '고추장, 고춧가루, 간장, 마늘로 만든 양념장을 넣습니다.', '국물이 걸쭉해질 때까지 푹 끓입니다.'],
    requiredIngredients: ['닭고기', '감자', '양파', '당근'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-6', name: '오징어 볶음', recipeType: 'MAIN', description: '매콤한 술안주 겸 반찬', emoji: '🦑',
    cookingTime: '15분', instructions: ['오징어는 먹기 좋게 썰고 야채는 채 썹니다.', '고추장 양념장을 만듭니다.', '센 불에 오징어와 야채를 빠르게 볶아냅니다.'],
    requiredIngredients: ['오징어', '양파', '대파', '당근'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-7', name: '비빔밥', recipeType: 'MAIN', description: '냉장고 털이 끝판왕', emoji: '🥗',
    cookingTime: '15분', instructions: ['집에 있는 나물이나 야채(호박, 당근, 시금치 등)를 볶습니다.', '계란 후라이를 합니다.', '밥 위에 재료를 얹고 고추장과 참기름을 뿌립니다.'],
    requiredIngredients: ['밥', '계란', '시금치', '콩나물', '호박', '당근'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-8', name: '카레라이스', recipeType: 'MAIN', description: '아이들이 좋아하는 메뉴', emoji: '🍛',
    cookingTime: '20분', instructions: ['고기, 감자, 당근, 양파를 깍둑썰기 합니다.', '냄비에 재료를 볶다가 물을 붓고 익힙니다.', '카레가루를 물에 풀어 넣고 걸쭉하게 끓입니다.'],
    requiredIngredients: ['카레가루', '감자', '양파', '당근', '고기'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-9', name: '미역국', recipeType: 'MAIN', description: '따뜻하고 든든한 국', emoji: '🥣',
    cookingTime: '40분', instructions: ['불린 미역과 소고기를 참기름에 달달 볶습니다.', '물을 붓고 푹 끓입니다.', '국간장과 소금으로 간을 맞춥니다.'],
    requiredIngredients: ['미역', '소고기'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-10', name: '삼겹살 구이', recipeType: 'MAIN', description: '국민 외식 메뉴', emoji: '🥓',
    cookingTime: '15분', instructions: ['팬이나 그릴을 달굽니다.', '삼겹살을 앞뒤로 노릇하게 굽습니다.', '김치, 마늘, 버섯을 곁들여 굽습니다.', '쌈장과 야채를 곁들입니다.'],
    requiredIngredients: ['삼겹살', '상추', '마늘', '김치'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-11', name: '잡채', recipeType: 'MAIN', description: '잔칫날 필수 메뉴', emoji: '🍝',
    cookingTime: '40분', instructions: ['당면을 삶아 건져냅니다.', '시금치, 당근, 양파, 버섯, 고기를 각각 볶습니다.', '모든 재료를 간장, 설탕, 참기름 양념에 버무립니다.'],
    requiredIngredients: ['당면', '시금치', '당근', '양파', '고기', '버섯'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-12', name: '순두부 찌개', recipeType: 'MAIN', description: '부드럽고 얼큰한 맛', emoji: '🥘',
    cookingTime: '15분', instructions: ['뚝배기에 고추기름을 내고 고기와 야채를 볶습니다.', '물과 순두부를 넣고 끓입니다.', '계란을 하나 톡 터뜨려 넣습니다.'],
    requiredIngredients: ['순두부', '계란', '돼지고기', '바지락'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-13', name: '김치볶음밥', recipeType: 'MAIN', description: '반찬 없을 때 최고', emoji: '🍳',
    cookingTime: '15분', instructions: ['김치와 햄(또는 고기)을 잘게 썹니다.', '기름 두른 팬에 파기름을 내고 재료를 볶습니다.', '밥을 넣고 볶다가 간장, 참기름으로 마무리합니다.', '계란후라이를 얹습니다.'],
    requiredIngredients: ['김치', '밥', '햄', '계란', '대파'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-14', name: '오므라이스', recipeType: 'MAIN', description: '아이들 특식', emoji: '🍛',
    cookingTime: '25분', instructions: ['다진 야채와 햄을 밥과 함께 볶습니다 (케찹 베이스).', '계란을 얇게 지단 부쳐 볶음밥을 감쌉니다.', '케찹이나 돈까스 소스를 뿌립니다.'],
    requiredIngredients: ['계란', '밥', '햄', '양파', '당근', '케찹'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-main-15', name: '만둣국', recipeType: 'MAIN', description: '뜨끈한 국물', emoji: '🥟',
    cookingTime: '15분', instructions: ['멸치 육수나 사골 국물을 끓입니다.', '냉동 만두를 넣고 끓입니다.', '계란을 풀고 대파와 김가루를 넣습니다.'],
    requiredIngredients: ['만두', '계란', '대파', '멸치'],
    ingredientsUsed: [], missingIngredients: []
  },

  // --- [SIDE] 반찬 ---
  {
    id: 'loc-side-1', name: '계란말이', recipeType: 'SIDE', description: '도시락 단골 반찬', emoji: '🥚',
    cookingTime: '10분', instructions: ['계란을 풀고 다진 당근, 파를 섞습니다.', '소금간을 합니다.', '팬에 조금씩 부어가며 돌돌 맙니다.'],
    requiredIngredients: ['계란', '대파', '당근'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-2', name: '시금치 나물', recipeType: 'SIDE', description: '건강한 초록 반찬', emoji: '🌿',
    cookingTime: '10분', instructions: ['시금치를 끓는 물에 살짝 데칩니다.', '찬물에 헹궈 물기를 꽉 짭니다.', '국간장, 다진마늘, 참기름, 깨로 조물조물 무칩니다.'],
    requiredIngredients: ['시금치'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-3', name: '어묵 볶음', recipeType: 'SIDE', description: '단짠단짠 밥반찬', emoji: '🍢',
    cookingTime: '10분', instructions: ['어묵을 먹기 좋게 썹니다.', '팬에 기름을 두르고 어묵과 양파를 볶습니다.', '간장, 올리고당을 넣고 윤기나게 조립니다.'],
    requiredIngredients: ['어묵', '양파'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-4', name: '두부 조림', recipeType: 'SIDE', description: '매콤한 밥도둑', emoji: '🧊',
    cookingTime: '20분', instructions: ['두부를 적당한 크기로 잘라 노릇하게 굽습니다.', '간장, 고춧가루, 설탕, 마늘로 양념장을 만듭니다.', '두부 위에 양념장과 물을 조금 붓고 자작하게 조립니다.'],
    requiredIngredients: ['두부', '양파', '대파'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-5', name: '감자채 볶음', recipeType: 'SIDE', description: '담백하고 고소함', emoji: '🥔',
    cookingTime: '15분', instructions: ['감자를 채 썰어 물에 담가 전분을 뺍니다.', '팬에 기름을 두르고 감자와 양파를 볶습니다.', '소금과 후추로 간을 합니다.'],
    requiredIngredients: ['감자', '양파'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-6', name: '진미채 볶음', recipeType: 'SIDE', description: '오래 두고 먹는 밑반찬', emoji: '🦑',
    cookingTime: '15분', instructions: ['진미채를 마요네즈에 살짝 버무려 둡니다 (부드럽게).', '고추장 양념을 팬에 끓입니다.', '불을 끄고 진미채를 넣어 버무립니다.'],
    requiredIngredients: ['진미채'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-7', name: '멸치 볶음', recipeType: 'SIDE', description: '칼슘 왕', emoji: '🐟',
    cookingTime: '10분', instructions: ['마른 팬에 멸치를 볶아 비린내를 날립니다.', '기름과 설탕, 간장을 넣고 볶습니다.', '마지막에 올리고당이나 물엿으로 코팅합니다.'],
    requiredIngredients: ['멸치'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-8', name: '호박전', recipeType: 'SIDE', description: '달큰한 애호박 맛', emoji: '🥞',
    cookingTime: '20분', instructions: ['애호박을 둥글게 썹니다.', '밀가루와 계란물을 묻힙니다.', '기름 두른 팬에 노릇하게 부쳐냅니다.'],
    requiredIngredients: ['애호박', '계란', '밀가루'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-9', name: '콩나물 무침', recipeType: 'SIDE', description: '아삭아삭한 식감', emoji: '🌱',
    cookingTime: '10분', instructions: ['콩나물을 삶습니다.', '찬물에 헹궈 물기를 뺍니다.', '소금, 참기름, 다진마늘, 고춧가루(선택)로 무칩니다.'],
    requiredIngredients: ['콩나물'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-side-10', name: '계란찜', recipeType: 'SIDE', description: '부드러운 식감', emoji: '🥚',
    cookingTime: '15분', instructions: ['계란에 물과 소금을 넣고 잘 풉니다.', '뚝배기나 냄비에 넣고 중탕하거나 약불로 익힙니다.', '파를 송송 썰어 올립니다.'],
    requiredIngredients: ['계란', '대파'],
    ingredientsUsed: [], missingIngredients: []
  },

  // --- [SNACK] 간식 ---
  {
    id: 'loc-snack-1', name: '떡볶이', recipeType: 'SNACK', description: '국민 간식', emoji: '🍡',
    cookingTime: '20분', instructions: ['물에 고추장, 설탕, 간장을 풀어 끓입니다.', '떡과 어묵, 대파를 넣습니다.', '국물이 걸쭉해질 때까지 조립니다.'],
    requiredIngredients: ['떡', '어묵', '대파'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-snack-2', name: '김치전', recipeType: 'SNACK', description: '비 오는 날 최고', emoji: '🥞',
    cookingTime: '20분', instructions: ['김치를 잘게 썹니다.', '부침가루와 물, 김치국물을 섞어 반죽합니다.', '기름을 넉넉히 두르고 바삭하게 부칩니다.'],
    requiredIngredients: ['김치', '밀가루'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-snack-3', name: '프렌치 토스트', recipeType: 'SNACK', description: '달콤한 브런치', emoji: '🍞',
    cookingTime: '10분', instructions: ['계란에 우유와 설탕을 섞습니다.', '식빵을 계란물에 푹 적십니다.', '버터를 두른 팬에 노릇하게 굽습니다.', '설탕을 뿌려 마무리합니다.'],
    requiredIngredients: ['식빵', '계란', '우유'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-snack-4', name: '고구마 맛탕', recipeType: 'SNACK', description: '달콤 바삭', emoji: '🍠',
    cookingTime: '25분', instructions: ['고구마를 한입 크기로 썰어 물기를 제거합니다.', '기름에 노릇하게 튀깁니다.', '팬에 식용유와 설탕을 녹여 시럽을 만들고 고구마를 버무립니다.'],
    requiredIngredients: ['고구마'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-snack-5', name: '라면', recipeType: 'SNACK', description: '출출할 땐 라면', emoji: '🍜',
    cookingTime: '5분', instructions: ['물이 끓으면 면과 스프를 넣습니다.', '계란을 풀고 파를 썰어 넣습니다.'],
    requiredIngredients: ['라면', '계란', '대파'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-snack-6', name: '길거리 토스트', recipeType: 'SNACK', description: '추억의 맛', emoji: '🥪',
    cookingTime: '15분', instructions: ['양배추와 당근을 채 썰어 계란과 섞습니다.', '팬에 버터를 두르고 계란 패티를 만듭니다.', '식빵을 구워 패티, 설탕, 케찹을 뿌려 샌드합니다.'],
    requiredIngredients: ['식빵', '계란', '양배추', '햄'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-snack-7', name: '콘치즈', recipeType: 'SNACK', description: '고소한 옥수수', emoji: '🌽',
    cookingTime: '10분', instructions: ['옥수수 통조림의 물기를 뺍니다.', '마요네즈와 설탕을 섞습니다.', '피자치즈를 올리고 전자레인지나 팬에 녹입니다.'],
    requiredIngredients: ['옥수수', '치즈', '마요네즈'],
    ingredientsUsed: [], missingIngredients: []
  },
  {
    id: 'loc-snack-8', name: '주먹밥', recipeType: 'SNACK', description: '간편한 한 끼', emoji: '🍙',
    cookingTime: '10분', instructions: ['밥에 참기름, 소금, 깨, 김가루를 넣고 섞습니다.', '참치나 멸치 등을 넣고 동그랗게 뭉칩니다.'],
    requiredIngredients: ['밥', '김', '참치', '단무지'],
    ingredientsUsed: [], missingIngredients: []
  }
];

const KEYWORD_MAPPING: Record<string, string> = {
  '삼겹살': '돼지고기', '목살': '돼지고기', '대패삼겹살': '돼지고기', '다짐육': '돼지고기',
  '차돌박이': '소고기', '양지': '소고기', '국거리': '소고기',
  '닭가슴살': '닭고기', '치킨': '닭고기',
  '스팸': '햄', '리챔': '햄', '참치캔': '참치',
  '파': '대파', '쪽파': '대파', '묵은지': '김치',
  '달걀': '계란', '메추리알': '계란',
  '우유': '우유', '치즈': '치즈',
  '오뎅': '어묵',
  '떡국떡': '떡', '떡볶이떡': '떡',
  '식빵': '식빵', '모닝빵': '식빵',
  '밥': '밥', '햇반': '밥',
  '카레': '카레가루',
  '비엔나': '소세지', '후랑크': '소세지',
  '파스타': '파스타면', '스파게티': '파스타면',
  '우동사리': '우동', '우동면': '우동',
  '만두': '만두', '물만두': '만두', '군만두': '만두'
};

const cleanName = (name: string) => {
  if (!name || typeof name !== 'string') return '';
  return name.replace(/\(.*\)/g, '').replace(/[0-9]/g, '').trim();
};

export const searchPublicRecipes = async (ingredients: Ingredient[], type: 'MAIN' | 'SIDE' | 'SNACK'): Promise<Recipe[]> => {
    try {
        // 1. 내 재료 목록 정규화
        const myItems = new Set<string>();
        if (ingredients && Array.isArray(ingredients)) {
            ingredients.forEach(ing => {
                if (!ing || !ing.name) return;
                const name = cleanName(ing.name);
                if (!name) return;
                myItems.add(name);
                if (KEYWORD_MAPPING[name]) myItems.add(KEYWORD_MAPPING[name]);
            });
        }

        // 2. 카테고리 필터링 (DB가 유효한지 확인)
        const candidates = (INTERNAL_RECIPE_DB || []).filter(r => r && r.recipeType === type);

        // 3. 점수 계산
        const scoredRecipes = candidates.map(recipe => {
            if (!recipe || !recipe.name) return null;

            // 통합된 requiredIngredients 사용
            const requiredIngredients = recipe.requiredIngredients || [];
            let matchCount = 0;
            const used: string[] = [];
            const missing: string[] = [];

            requiredIngredients.forEach(req => {
                const hasItem = Array.from(myItems).some(my => my.includes(req) || req.includes(my));
                if (hasItem) {
                    matchCount++;
                    used.push(req);
                } else {
                    missing.push(req);
                }
            });
            
            // Return valid Recipe object with score
            return {
                ...recipe,
                ingredientsUsed: used,
                missingIngredients: missing,
                score: matchCount
            };
        }).filter(r => r !== null) as InternalRecipe[];

        // 4. 정렬 (점수 높은 순, 같으면 랜덤)
        const results = scoredRecipes
            .filter(r => r.score && r.score > 0 || !ingredients || ingredients.length === 0) 
            .sort((a, b) => {
                const scoreA = a.score || 0;
                const scoreB = b.score || 0;
                const scoreDiff = scoreB - scoreA;
                if (scoreDiff !== 0) return scoreDiff;
                return Math.random() - 0.5;
            })
            .slice(0, 5);

        // 5. 결과 반환 (매칭 실패시 랜덤 추천 - Fallback)
        if (results.length === 0) {
            const randomPicks = candidates.sort(() => Math.random() - 0.5).slice(0, 5);
            return randomPicks.map(recipe => ({
                ...recipe,
                ingredientsUsed: [],
                missingIngredients: recipe.requiredIngredients || []
            }));
        }

        // Return as Recipe[] (InternalRecipe is compatible)
        return results;

    } catch (error) {
        console.error("Recipe Search Error:", error);
        // 오류 발생 시 빈 배열 대신 랜덤 추천을 반환하여 앱이 죽지 않게 함
        const fallback = (INTERNAL_RECIPE_DB || [])
            .filter(r => r && r.recipeType === type)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(recipe => ({
                ...recipe,
                ingredientsUsed: [],
                missingIngredients: recipe.requiredIngredients || []
            }));
        return fallback;
    }
};