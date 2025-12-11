import { Ingredient, Recipe, Category } from "../types";

// [확장] 내장 데이터베이스: 한국인 인기 집밥 메뉴 100선 (완성판)
// 서버 연결 없이 즉시 추천 가능한 안전한 데이터입니다.

const INTERNAL_RECIPE_DB: Recipe[] = [
  // --- [MAIN] 메인 요리 (밥, 면, 국, 메인반찬) ---
  {
    id: 'loc-main-1', name: '돼지고기 김치찌개', recipeType: 'MAIN', description: '한국인의 소울푸드', emoji: '🥘',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '30분',
    instructions: ['김치와 돼지고기를 먹기 좋게 썹니다.', '냄비에 기름을 두르고 고기와 김치를 볶습니다.', '물을 붓고 끓이다가 다진마늘, 고춧가루, 국간장으로 간을 합니다.', '두부와 대파를 넣고 한소끔 더 끓입니다.']
  },
  {
    id: 'loc-main-2', name: '된장찌개', recipeType: 'MAIN', description: '구수한 맛이 일품', emoji: '🍲',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['멸치 육수를 냅니다.', '된장을 풀고 감자, 애호박, 양파를 넣어 끓입니다.', '두부와 팽이버섯, 청양고추를 넣습니다.', '마지막에 대파를 넣어 마무리합니다.']
  },
  {
    id: 'loc-main-3', name: '제육볶음', recipeType: 'MAIN', description: '매콤달콤 밥도둑', emoji: '🍖',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['돼지고기는 고추장, 간장, 설탕, 마늘 양념에 재워둡니다.', '팬에 기름을 두르고 고기를 볶습니다.', '양파, 대파, 당근을 넣고 함께 볶아냅니다.', '통깨를 뿌려 완성합니다.']
  },
  {
    id: 'loc-main-4', name: '소불고기', recipeType: 'MAIN', description: '달콤한 간장 양념', emoji: '🥩',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '30분',
    instructions: ['소고기는 간장, 설탕, 배즙, 마늘, 참기름 양념에 재웁니다.', '팬에 고기를 볶다가 양파, 버섯, 당근을 넣습니다.', '국물이 자박해질 때까지 익힙니다.']
  },
  {
    id: 'loc-main-5', name: '닭볶음탕', recipeType: 'MAIN', description: '얼큰한 국물 닭요리', emoji: '🐔',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '50분',
    instructions: ['닭을 한번 데쳐 불순물을 제거합니다.', '물에 닭, 감자, 당근, 양파를 넣고 끓입니다.', '고추장, 고춧가루, 간장, 마늘로 만든 양념장을 넣습니다.', '국물이 걸쭉해질 때까지 푹 끓입니다.']
  },
  {
    id: 'loc-main-6', name: '오징어 볶음', recipeType: 'MAIN', description: '매콤한 술안주 겸 반찬', emoji: '🦑',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['오징어는 먹기 좋게 썰고 야채는 채 썹니다.', '고추장 양념장을 만듭니다.', '센 불에 오징어와 야채를 빠르게 볶아냅니다.']
  },
  {
    id: 'loc-main-7', name: '비빔밥', recipeType: 'MAIN', description: '냉장고 털이 끝판왕', emoji: '🥗',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['집에 있는 나물이나 야채(호박, 당근, 시금치 등)를 볶습니다.', '계란 후라이를 합니다.', '밥 위에 재료를 얹고 고추장과 참기름을 뿌립니다.']
  },
  {
    id: 'loc-main-8', name: '카레라이스', recipeType: 'MAIN', description: '아이들이 좋아하는 메뉴', emoji: '🍛',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['고기, 감자, 당근, 양파를 깍둑썰기 합니다.', '냄비에 재료를 볶다가 물을 붓고 익힙니다.', '카레가루를 물에 풀어 넣고 걸쭉하게 끓입니다.']
  },
  {
    id: 'loc-main-9', name: '미역국', recipeType: 'MAIN', description: '따뜻하고 든든한 국', emoji: '🥣',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '40분',
    instructions: ['불린 미역과 소고기를 참기름에 달달 볶습니다.', '물을 붓고 푹 끓입니다.', '국간장과 소금으로 간을 맞춥니다.']
  },
  {
    id: 'loc-main-10', name: '삼겹살 구이', recipeType: 'MAIN', description: '국민 외식 메뉴', emoji: '🥓',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['팬이나 그릴을 달굽니다.', '삼겹살을 앞뒤로 노릇하게 굽습니다.', '김치, 마늘, 버섯을 곁들여 굽습니다.', '쌈장과 야채를 곁들입니다.']
  },
  {
    id: 'loc-main-11', name: '잡채', recipeType: 'MAIN', description: '잔칫날 필수 메뉴', emoji: '🍝',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '40분',
    instructions: ['당면을 삶아 건져냅니다.', '시금치, 당근, 양파, 버섯, 고기를 각각 볶습니다.', '모든 재료를 간장, 설탕, 참기름 양념에 버무립니다.']
  },
  {
    id: 'loc-main-12', name: '순두부 찌개', recipeType: 'MAIN', description: '부드럽고 얼큰한 맛', emoji: '🥘',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['뚝배기에 고추기름을 내고 고기와 야채를 볶습니다.', '물과 순두부를 넣고 끓입니다.', '계란을 하나 톡 터뜨려 넣습니다.']
  },
  {
    id: 'loc-main-13', name: '김치볶음밥', recipeType: 'MAIN', description: '반찬 없을 때 최고', emoji: '🍳',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['김치와 햄(또는 고기)을 잘게 썹니다.', '기름 두른 팬에 파기름을 내고 재료를 볶습니다.', '밥을 넣고 볶다가 간장, 참기름으로 마무리합니다.', '계란후라이를 얹습니다.']
  },
  {
    id: 'loc-main-14', name: '오므라이스', recipeType: 'MAIN', description: '아이들 특식', emoji: '🍛',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '25분',
    instructions: ['다진 야채와 햄을 밥과 함께 볶습니다 (케찹 베이스).', '계란을 얇게 지단 부쳐 볶음밥을 감쌉니다.', '케찹이나 돈까스 소스를 뿌립니다.']
  },
  {
    id: 'loc-main-15', name: '만둣국', recipeType: 'MAIN', description: '뜨끈한 국물', emoji: '🥟',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['멸치 육수나 사골 국물을 끓입니다.', '냉동 만두를 넣고 끓입니다.', '계란을 풀고 대파와 김가루를 넣습니다.']
  },
  {
    id: 'loc-main-16', name: '떡국', recipeType: 'MAIN', description: '새해 필수 메뉴', emoji: '🍲',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['사골 국물이나 고기 육수를 끓입니다.', '떡국떡을 물에 불려 넣습니다.', '국간장으로 간을 하고 계란 지단, 파를 올립니다.']
  },
  {
    id: 'loc-main-17', name: '짜장밥', recipeType: 'MAIN', description: '다른 반찬 필요 없음', emoji: '🍛',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['고기, 양파, 감자, 호박을 잘게 썰어 볶습니다.', '물과 짜장가루(또는 춘장)를 넣고 걸쭉하게 끓입니다.', '밥 위에 얹어 냅니다.']
  },
  {
    id: 'loc-main-18', name: '잔치국수', recipeType: 'MAIN', description: '후루룩 넘어가는 맛', emoji: '🍜',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['진하게 멸치 육수를 냅니다.', '소면을 삶아 찬물에 헹굽니다.', '호박, 당근, 계란 지단 고명을 올리고 양념장을 곁들입니다.']
  },
  {
    id: 'loc-main-19', name: '콩나물국', recipeType: 'MAIN', description: '시원하고 개운함', emoji: '🍲',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['멸치 육수에 콩나물을 넣고 뚜껑을 열고 끓입니다.', '다진마늘, 파, 소금(또는 새우젓)으로 간을 합니다.']
  },
  {
    id: 'loc-main-20', name: '북어국', recipeType: 'MAIN', description: '해장에 최고', emoji: '🥣',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['참기름에 북어채를 달달 볶습니다.', '물을 넣고 뽀얗게 우러나도록 끓입니다.', '계란을 풀고 파를 넣습니다.']
  },
  {
    id: 'loc-main-21', name: '소고기 뭇국', recipeType: 'MAIN', description: '깔끔하고 담백함', emoji: '🍲',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '30분',
    instructions: ['소고기와 무를 참기름에 볶습니다.', '물을 붓고 무가 투명해질 때까지 끓입니다.', '국간장, 다진마늘, 소금으로 간을 합니다.']
  },
  {
    id: 'loc-main-22', name: '부대찌개', recipeType: 'MAIN', description: '햄 가득 종합 선물세트', emoji: '🥘',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '30분',
    instructions: ['햄, 소세지, 김치, 두부, 콩나물을 냄비에 담습니다.', '사골육수와 양념장을 넣고 끓입니다.', '라면사리를 추가하면 더 맛있습니다.']
  },
  {
    id: 'loc-main-23', name: '오징어 뭇국', recipeType: 'MAIN', description: '시원 칼칼한 맛', emoji: '🥣',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['무를 나박썰기하여 들기름에 볶습니다.', '물을 붓고 끓이다가 오징어와 다진마늘을 넣습니다.', '고춧가루와 국간장으로 간을 합니다.']
  },
  {
    id: 'loc-main-24', name: '갈비찜', recipeType: 'MAIN', description: '특별한 날 메뉴', emoji: '🍖',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '60분',
    instructions: ['고기 핏물을 빼고 한번 데칩니다.', '간장 양념장에 고기, 무, 당근을 넣고 푹 조립니다.', '밤, 대추 등을 넣고 국물이 자작해질 때까지 끓입니다.']
  },
  {
    id: 'loc-main-25', name: '수육/보쌈', recipeType: 'MAIN', description: '김장철 생각나는 맛', emoji: '🥩',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '50분',
    instructions: ['돼지고기 통삼겹이나 앞다리살을 준비합니다.', '된장, 커피, 월계수잎, 파 등을 넣은 물에 40분 이상 삶습니다.', '먹기 좋게 썰어 김치와 냅니다.']
  },
  {
    id: 'loc-main-26', name: '알리오 올리오', recipeType: 'MAIN', description: '마늘 향 가득 파스타', emoji: '🍝',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['끓는 물에 파스타면을 삶습니다.', '팬에 올리브유를 넉넉히 두르고 편마늘과 페페론치노를 볶습니다.', '면과 면수를 넣고 유화(에멀전)시킵니다.']
  },
  {
    id: 'loc-main-27', name: '크림 파스타', recipeType: 'MAIN', description: '고소한 우유/생크림', emoji: '🍝',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['베이컨과 양파, 버섯을 볶습니다.', '우유와 생크림을 1:1로 붓고 끓입니다.', '삶은 면을 넣고 소스가 걸쭉해질 때까지 조립니다.']
  },
  {
    id: 'loc-main-28', name: '토마토 파스타', recipeType: 'MAIN', description: '상큼한 토마토 소스', emoji: '🍝',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['다진 고기와 야채를 볶습니다.', '시판 토마토 소스를 넣고 끓입니다.', '삶은 면을 넣고 버무립니다.']
  },
  {
    id: 'loc-main-29', name: '마파두부 덮밥', recipeType: 'MAIN', description: '매콤한 중화요리', emoji: '🍛',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['파기름에 다진 고기를 볶습니다.', '두반장(또는 고추장+된장) 소스와 물을 넣고 끓입니다.', '두부를 넣고 전분물로 농도를 맞춥니다.']
  },
  {
    id: 'loc-main-30', name: '강된장', recipeType: 'MAIN', description: '쌈 싸먹기 좋은', emoji: '🥘',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['다진 야채와 고기, 우렁 등을 볶습니다.', '된장을 듬뿍 넣고 자작하게 끓입니다.', '밥에 비벼먹거나 쌈을 싸 먹습니다.']
  },
  {
    id: 'loc-main-31', name: '닭갈비', recipeType: 'MAIN', description: '매콤한 춘천 스타일', emoji: '🐔',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '30분',
    instructions: ['닭고기를 고추장 양념에 재웁니다.', '양배추, 고구마, 떡과 함께 철판(팬)에 볶습니다.', '마지막에 볶음밥은 필수!']
  },
  {
    id: 'loc-main-32', name: '콩국수', recipeType: 'MAIN', description: '여름철 별미', emoji: '🍜',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['두부, 우유, 견과류(땅콩, 깨), 소금을 믹서에 곱게 갑니다.', '소면을 삶아 찬물에 헹굽니다.', '콩물을 붓고 오이, 토마토를 올립니다.']
  },
  {
    id: 'loc-main-33', name: '어묵국', recipeType: 'MAIN', description: '포장마차 그 맛', emoji: '🍲',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['멸치 다시마 육수를 냅니다.', '무와 어묵을 넣고 끓입니다.', '국간장으로 간을 하고 쑥갓이나 파를 올립니다.']
  },
  {
    id: 'loc-main-34', name: '김치 우동', recipeType: 'MAIN', description: '얼큰하고 따뜻함', emoji: '🍜',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['멸치 육수에 김치를 넣고 끓입니다.', '우동면과 어묵을 넣습니다.', '고춧가루와 파를 넣어 얼큰하게 마무리합니다.']
  },
  {
    id: 'loc-main-35', name: '동태찌개', recipeType: 'MAIN', description: '시원한 생선찌개', emoji: '🥘',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '30분',
    instructions: ['무와 물을 넣고 끓입니다.', '동태와 양념장(고추장, 고춧가루)을 넣습니다.', '두부, 쑥갓, 대파를 넣고 푹 끓입니다.']
  },

  // --- [SIDE] 반찬 ---
  {
    id: 'loc-side-1', name: '계란말이', recipeType: 'SIDE', description: '도시락 단골 반찬', emoji: '🥚',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['계란을 풀고 다진 당근, 파를 섞습니다.', '소금간을 합니다.', '팬에 조금씩 부어가며 돌돌 맙니다.']
  },
  {
    id: 'loc-side-2', name: '시금치 나물', recipeType: 'SIDE', description: '건강한 초록 반찬', emoji: '🌿',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['시금치를 끓는 물에 살짝 데칩니다.', '찬물에 헹궈 물기를 꽉 짭니다.', '국간장, 다진마늘, 참기름, 깨로 조물조물 무칩니다.']
  },
  {
    id: 'loc-side-3', name: '어묵 볶음', recipeType: 'SIDE', description: '단짠단짠 밥반찬', emoji: '🍢',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['어묵을 먹기 좋게 썹니다.', '팬에 기름을 두르고 어묵과 양파를 볶습니다.', '간장, 올리고당을 넣고 윤기나게 조립니다.']
  },
  {
    id: 'loc-side-4', name: '두부 조림', recipeType: 'SIDE', description: '매콤한 밥도둑', emoji: '🧊',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['두부를 적당한 크기로 잘라 노릇하게 굽습니다.', '간장, 고춧가루, 설탕, 마늘로 양념장을 만듭니다.', '두부 위에 양념장과 물을 조금 붓고 자작하게 조립니다.']
  },
  {
    id: 'loc-side-5', name: '감자채 볶음', recipeType: 'SIDE', description: '담백하고 고소함', emoji: '🥔',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['감자를 채 썰어 물에 담가 전분을 뺍니다.', '팬에 기름을 두르고 감자와 양파를 볶습니다.', '소금과 후추로 간을 합니다.']
  },
  {
    id: 'loc-side-6', name: '진미채 볶음', recipeType: 'SIDE', description: '오래 두고 먹는 밑반찬', emoji: '🦑',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['진미채를 마요네즈에 살짝 버무려 둡니다 (부드럽게).', '고추장 양념을 팬에 끓입니다.', '불을 끄고 진미채를 넣어 버무립니다.']
  },
  {
    id: 'loc-side-7', name: '멸치 볶음', recipeType: 'SIDE', description: '칼슘 왕', emoji: '🐟',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['마른 팬에 멸치를 볶아 비린내를 날립니다.', '기름과 설탕, 간장을 넣고 볶습니다.', '마지막에 올리고당이나 물엿으로 코팅합니다.']
  },
  {
    id: 'loc-side-8', name: '호박전', recipeType: 'SIDE', description: '달큰한 애호박 맛', emoji: '🥞',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['애호박을 둥글게 썹니다.', '밀가루와 계란물을 묻힙니다.', '기름 두른 팬에 노릇하게 부쳐냅니다.']
  },
  {
    id: 'loc-side-9', name: '콩나물 무침', recipeType: 'SIDE', description: '아삭아삭한 식감', emoji: '🌱',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['콩나물을 삶습니다.', '찬물에 헹궈 물기를 뺍니다.', '소금, 참기름, 다진마늘, 고춧가루(선택)로 무칩니다.']
  },
  {
    id: 'loc-side-10', name: '계란찜', recipeType: 'SIDE', description: '부드러운 식감', emoji: '🥚',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['계란에 물과 소금을 넣고 잘 풉니다.', '뚝배기나 냄비에 넣고 중탕하거나 약불로 익힙니다.', '파를 송송 썰어 올립니다.']
  },
  {
    id: 'loc-side-11', name: '소세지 야채볶음', recipeType: 'SIDE', description: '아이들 최애 반찬', emoji: '🌭',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['비엔나 소세지에 칼집을 냅니다.', '양파, 피망, 당근을 큼직하게 썹니다.', '케찹, 굴소스, 설탕 소스에 볶아냅니다.']
  },
  {
    id: 'loc-side-12', name: '무생채', recipeType: 'SIDE', description: '새콤달콤 입맛 돋우기', emoji: '🥗',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['무를 얇게 채 썹니다.', '소금에 살짝 절였다가 물기를 짭니다.', '고춧가루, 식초, 설탕, 다진마늘, 파를 넣고 무칩니다.']
  },
  {
    id: 'loc-side-13', name: '오이 무침', recipeType: 'SIDE', description: '아삭하고 시원함', emoji: '🥒',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['오이를 동그랗게 썹니다.', '양파와 함께 고추장, 식초, 설탕, 다진마늘 양념에 무칩니다.']
  },
  {
    id: 'loc-side-14', name: '버섯 볶음', recipeType: 'SIDE', description: '쫄깃한 식감', emoji: '🍄',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['버섯(느타리, 표고 등)을 먹기 좋게 찢습니다.', '팬에 기름을 두르고 양파, 당근과 함께 볶습니다.', '굴소스나 소금으로 간을 합니다.']
  },
  {
    id: 'loc-side-15', name: '메추리알 장조림', recipeType: 'SIDE', description: '밥 도둑', emoji: '🥚',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '25분',
    instructions: ['삶은 메추리알을 준비합니다.', '간장, 물, 설탕, 다시마를 넣고 끓입니다.', '색이 배어들 때까지 은근하게 조립니다.']
  },
  {
    id: 'loc-side-16', name: '숙주 나물', recipeType: 'SIDE', description: '가볍고 아삭함', emoji: '🌱',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['숙주를 끓는 물에 살짝 데칩니다.', '찬물에 헹궈 물기를 짭니다.', '소금, 참기름, 다진마늘, 쪽파로 무칩니다.']
  },
  {
    id: 'loc-side-17', name: '감자 조림', recipeType: 'SIDE', description: '포슬포슬 단짠', emoji: '🥔',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['감자를 깍둑썰기 합니다.', '기름에 살짝 볶다가 간장 양념과 물을 붓습니다.', '국물이 거의 없어질 때까지 조립니다.']
  },
  {
    id: 'loc-side-18', name: '김 구이', recipeType: 'SIDE', description: '가장 쉬운 반찬', emoji: '🍙',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '5분',
    instructions: ['김에 참기름을 바르고 소금을 뿌립니다.', '달군 팬에 앞뒤로 바삭하게 굽습니다.', '먹기 좋은 크기로 자릅니다.']
  },
  {
    id: 'loc-side-19', name: '가지 볶음', recipeType: 'SIDE', description: '부드러운 식감', emoji: '🍆',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['가지를 어슷썰기 합니다.', '팬에 파기름을 내고 가지를 볶습니다.', '간장, 굴소스, 설탕으로 간을 하고 참기름으로 마무리합니다.']
  },
  {
    id: 'loc-side-20', name: '오이 냉국', recipeType: 'SIDE', description: '여름철 별미', emoji: '🥒',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['오이를 채 썰고 미역을 불립니다.', '물, 식초, 설탕, 소금을 섞어 냉국물을 만듭니다.', '재료를 넣고 얼음을 띄웁니다.']
  },
  {
    id: 'loc-side-21', name: '단무지 무침', recipeType: 'SIDE', description: '초간단 반찬', emoji: '🥗',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '5분',
    instructions: ['단무지를 물기를 꽉 짭니다.', '고춧가루, 참기름, 다진마늘, 깨, 파를 넣고 조물조물 무칩니다.']
  },
  {
    id: 'loc-side-22', name: '파래 무침', recipeType: 'SIDE', description: '바다의 향기', emoji: '🌊',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['파래를 굵은 소금으로 씻어 헹굽니다.', '무를 얇게 채 썹니다.', '국간장, 식초, 설탕, 다진마늘 양념에 무칩니다.']
  },
  {
    id: 'loc-side-23', name: '견과류 멸치 볶음', recipeType: 'SIDE', description: '고소함 폭발', emoji: '🐟',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['멸치와 견과류(아몬드, 호두 등)를 마른 팬에 볶습니다.', '간장, 설탕, 맛술을 끓여 시럽을 만듭니다.', '재료를 넣고 빠르게 버무립니다.']
  },
  {
    id: 'loc-side-24', name: '깻잎 찜', recipeType: 'SIDE', description: '밥에 싸먹는 맛', emoji: '🍃',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['간장, 고춧가루, 다진마늘, 파, 당근으로 양념장을 만듭니다.', '깻잎 사이사이에 양념을 바릅니다.', '전자레인지나 찜기에 3~5분 찝니다.']
  },
  {
    id: 'loc-side-25', name: '양파 장아찌', recipeType: 'SIDE', description: '고기 친구', emoji: '🧅',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['양파와 고추를 큼직하게 썹니다.', '간장, 물, 식초, 설탕을 1:1:1:1 비율로 끓입니다.', '뜨거울 때 야채에 붓습니다.']
  },
  {
    id: 'loc-side-26', name: '마늘쫑 볶음', recipeType: 'SIDE', description: '아삭하고 달큰함', emoji: '🌱',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['마늘쫑을 먹기 좋은 길이로 자릅니다.', '기름에 볶다가 소금을 뿌립니다.', '간장과 올리고당을 넣어 윤기나게 조립니다. 건새우를 넣어도 좋습니다.']
  },
  {
    id: 'loc-side-27', name: '애호박 볶음', recipeType: 'SIDE', description: '달달한 호박맛', emoji: '🥒',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['애호박을 반달 모양으로 썹니다.', '기름 두른 팬에 볶다가 새우젓(또는 소금)으로 간을 합니다.', '다진마늘과 파를 넣습니다.']
  },
  {
    id: 'loc-side-28', name: '브로콜리 두부 무침', recipeType: 'SIDE', description: '영양 만점', emoji: '🥦',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['브로콜리를 데치고 두부는 물기를 짜서 으깹니다.', '소금, 참기름, 깨를 넣고 고소하게 무칩니다.']
  },
  {
    id: 'loc-side-29', name: '참치전', recipeType: 'SIDE', description: '아이들이 좋아하는 맛', emoji: '🥞',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['참치캔 기름을 뺍니다.', '다진 양파, 당근, 계란, 부침가루를 섞습니다.', '한 숟가락씩 떠서 노릇하게 부칩니다.']
  },
  {
    id: 'loc-side-30', name: '베이컨 팽이버섯 말이', recipeType: 'SIDE', description: '비주얼 담당', emoji: '🥓',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['팽이버섯 밑동을 자릅니다.', '베이컨으로 버섯을 돌돌 맙니다.', '팬에 굴려가며 노릇하게 굽습니다.']
  },
  {
    id: 'loc-side-31', name: '햄 감자채 볶음', recipeType: 'SIDE', description: '업그레이드 감자볶음', emoji: '🥔',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['감자와 햄(스팸 등)을 비슷하게 채 썹니다.', '감자를 먼저 볶다가 햄과 양파를 넣습니다.', '소금과 후추로 간을 합니다.']
  },
  {
    id: 'loc-side-32', name: '도토리묵 무침', recipeType: 'SIDE', description: '막걸리 안주 겸 반찬', emoji: '🥗',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['도토리묵을 썰고 상추, 오이, 양파를 준비합니다.', '간장, 고춧가루, 설탕, 참기름 양념장에 살살 버무립니다.']
  },
  {
    id: 'loc-side-33', name: '맛살 계란말이', recipeType: 'SIDE', description: '색감이 예쁜 반찬', emoji: '🥚',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['계란을 풉니다.', '맛살을 통으로 넣거나 잘게 찢어 넣습니다.', '팬에서 돌돌 말아 익힙니다.']
  },

  // --- [SNACK] 간식 ---
  {
    id: 'loc-snack-1', name: '떡볶이', recipeType: 'SNACK', description: '국민 간식', emoji: '🍡',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['물에 고추장, 설탕, 간장을 풀어 끓입니다.', '떡과 어묵, 대파를 넣습니다.', '국물이 걸쭉해질 때까지 조립니다.']
  },
  {
    id: 'loc-snack-2', name: '김치전', recipeType: 'SNACK', description: '비 오는 날 최고', emoji: '🥞',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['김치를 잘게 썹니다.', '부침가루와 물, 김치국물을 섞어 반죽합니다.', '기름을 넉넉히 두르고 바삭하게 부칩니다.']
  },
  {
    id: 'loc-snack-3', name: '프렌치 토스트', recipeType: 'SNACK', description: '달콤한 브런치', emoji: '🍞',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['계란에 우유와 설탕을 섞습니다.', '식빵을 계란물에 푹 적십니다.', '버터를 두른 팬에 노릇하게 굽습니다.', '설탕을 뿌려 마무리합니다.']
  },
  {
    id: 'loc-snack-4', name: '고구마 맛탕', recipeType: 'SNACK', description: '달콤 바삭', emoji: '🍠',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '25분',
    instructions: ['고구마를 한입 크기로 썰어 물기를 제거합니다.', '기름에 노릇하게 튀깁니다.', '팬에 식용유와 설탕을 녹여 시럽을 만들고 고구마를 버무립니다.']
  },
  {
    id: 'loc-snack-5', name: '라면', recipeType: 'SNACK', description: '출출할 땐 라면', emoji: '🍜',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '5분',
    instructions: ['물이 끓으면 면과 스프를 넣습니다.', '계란을 풀고 파를 썰어 넣습니다.']
  },
  {
    id: 'loc-snack-6', name: '길거리 토스트', recipeType: 'SNACK', description: '추억의 맛', emoji: '🥪',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['양배추와 당근을 채 썰어 계란과 섞습니다.', '팬에 버터를 두르고 계란 패티를 만듭니다.', '식빵을 구워 패티, 설탕, 케찹을 뿌려 샌드합니다.']
  },
  {
    id: 'loc-snack-7', name: '콘치즈', recipeType: 'SNACK', description: '고소한 옥수수', emoji: '🌽',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['옥수수 통조림의 물기를 뺍니다.', '마요네즈와 설탕을 섞습니다.', '피자치즈를 올리고 전자레인지나 팬에 녹입니다.']
  },
  {
    id: 'loc-snack-8', name: '주먹밥', recipeType: 'SNACK', description: '간편한 한 끼', emoji: '🍙',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['밥에 참기름, 소금, 깨, 김가루를 넣고 섞습니다.', '참치나 멸치 등을 넣고 동그랗게 뭉칩니다.']
  },
  {
    id: 'loc-snack-9', name: '감자전', recipeType: 'SNACK', description: '쫀득한 식감', emoji: '🥔',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '30분',
    instructions: ['감자를 강판에 갈거나 믹서에 갑니다.', '물기를 살짝 짜내고 전분을 가라앉힙니다.', '소금간을 하고 팬에 노릇하게 부칩니다.']
  },
  {
    id: 'loc-snack-10', name: '군만두', recipeType: 'SNACK', description: '바삭바삭', emoji: '🥟',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['팬에 기름을 두르고 냉동 만두를 올립니다.', '중약불에서 뒤집어가며 모든 면을 노릇하게 굽습니다.']
  },
  {
    id: 'loc-snack-11', name: '떡꼬치', recipeType: 'SNACK', description: '추억의 분식', emoji: '🍡',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['떡볶이 떡을 꼬치에 끼웁니다.', '기름에 살짝 튀기듯 굽습니다.', '고추장, 케찹, 올리고당 소스를 발라줍니다.']
  },
  {
    id: 'loc-snack-12', name: '라볶이', recipeType: 'SNACK', description: '라면과 떡볶이의 만남', emoji: '🥘',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['떡볶이 국물을 넉넉하게 만듭니다.', '떡과 어묵을 끓이다가 라면 사리를 넣습니다.', '면이 익으면 대파를 넣고 마무리합니다.']
  },
  {
    id: 'loc-snack-13', name: '계란 토스트', recipeType: 'SNACK', description: '초간단 간식', emoji: '🍞',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['식빵 가운데를 컵으로 눌러 구멍을 냅니다.', '팬에 빵을 올리고 구멍에 계란을 깨트립니다.', '소금간을 하고 익힙니다.']
  },
  {
    id: 'loc-snack-14', name: '고구마 라떼', recipeType: 'SNACK', description: '따뜻하고 부드러움', emoji: '🥛',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['삶은 고구마 껍질을 벗깁니다.', '우유, 꿀과 함께 믹서기에 갑니다.', '따뜻하게 데워 마십니다.']
  },
  {
    id: 'loc-snack-15', name: '소떡소떡', recipeType: 'SNACK', description: '휴게소 인기 메뉴', emoji: '🍢',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['떡과 비엔나 소세지를 번갈아 꼬치에 끼웁니다.', '팬에 구운 뒤 케찹+고추장 소스를 바릅니다.']
  },
  {
    id: 'loc-snack-16', name: '식빵 피자', recipeType: 'SNACK', description: '오븐 없이 만드는 피자', emoji: '🍕',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['식빵에 토마토 소스(또는 케찹)를 바릅니다.', '양파, 햄, 옥수수 등을 올립니다.', '피자치즈를 듬뿍 올리고 전자레인지나 팬에 뚜껑 덮고 익힙니다.']
  },
  {
    id: 'loc-snack-17', name: '계란 샌드위치', recipeType: 'SNACK', description: '부드러운 에그마요', emoji: '🥪',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['계란을 완숙으로 삶아 으깹니다.', '마요네즈, 설탕, 소금, 후추를 넣고 섞습니다.', '식빵 사이에 듬뿍 넣습니다.']
  },
  {
    id: 'loc-snack-18', name: '바나나 팬케이크', recipeType: 'SNACK', description: '달콤한 브런치', emoji: '🥞',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['바나나를 으깨고 계란, 밀가루(또는 핫케이크 가루)를 섞습니다.', '기름 두른 팬에 약불로 굽습니다.', '꿀이나 시럽을 뿌립니다.']
  },
  {
    id: 'loc-snack-19', name: '참치마요 주먹밥', recipeType: 'SNACK', description: '편의점보다 맛있는 맛', emoji: '🍙',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['기름 뺀 참치에 마요네즈, 설탕을 섞습니다.', '밥에 소금, 참기름, 깨로 밑간을 합니다.', '밥 속에 참치마요를 넣고 뭉칩니다.']
  },
  {
    id: 'loc-snack-20', name: '베이컨 떡말이', recipeType: 'SNACK', description: '짭조름하고 쫄깃함', emoji: '🥓',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['떡볶이 떡이나 가래떡을 베이컨으로 맙니다.', '팬에 노릇하게 굽습니다.', '머스타드 소스를 곁들입니다.']
  },
  {
    id: 'loc-snack-21', name: '떡국떡 츄러스', recipeType: 'SNACK', description: '바삭바삭 달콤함', emoji: '🥨',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['떡국떡을 물에 불린 후 물기를 제거합니다.', '기름에 튀기듯 볶습니다.', '설탕과 계피가루를 봉지에 넣고 떡과 함께 흔듭니다.']
  },
  {
    id: 'loc-snack-22', name: '버터 감자 구이', recipeType: 'SNACK', description: '휴게소 감자 맛', emoji: '🥔',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '25분',
    instructions: ['알감자나 작은 감자를 삶습니다.', '팬에 버터를 넉넉히 녹이고 감자를 굴려가며 굽습니다.', '설탕과 소금을 뿌립니다.']
  },
  {
    id: 'loc-snack-23', name: '옥수수 전', recipeType: 'SNACK', description: '톡톡 터지는 식감', emoji: '🌽',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['옥수수 통조림 물기를 뺍니다.', '부침가루(또는 튀김가루)와 물을 조금 섞어 반죽합니다.', '기름에 바삭하게 튀기듯 부칩니다. 연유를 찍어먹으면 맛있습니다.']
  },
  {
    id: 'loc-snack-24', name: '까르보나라 떡볶이', recipeType: 'SNACK', description: '고소한 크림 맛', emoji: '🍝',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['우유와 생크림(또는 슬라이스 치즈)을 끓입니다.', '떡과 베이컨, 양파, 브로콜리를 넣습니다.', '걸쭉해질 때까지 끓이고 후추를 뿌립니다.']
  },
  {
    id: 'loc-snack-25', name: '기름 떡볶이', recipeType: 'SNACK', description: '통인시장 스타일', emoji: '🥘',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['떡을 고춧가루, 간장, 설탕, 참기름 양념에 버무립니다.', '기름을 넉넉히 두른 팬에 약불로 볶습니다.']
  },
  {
    id: 'loc-snack-26', name: '과일 샐러드', recipeType: 'SNACK', description: '상큼한 디저트', emoji: '🥗',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['사과, 배, 귤, 단감 등 과일을 한입 크기로 썹니다.', '마요네즈와 약간의 설탕(또는 꿀, 요거트)에 버무립니다. 건포도나 견과류를 넣어도 좋습니다.']
  },
  {
    id: 'loc-snack-27', name: '요거트 볼', recipeType: 'SNACK', description: '건강한 간식', emoji: '🥣',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '5분',
    instructions: ['그릇에 요거트를 담습니다.', '바나나, 블루베리 등 과일과 시리얼, 견과류를 토핑합니다.', '꿀을 뿌립니다.']
  },
  {
    id: 'loc-snack-28', name: '인절미 토스트', recipeType: 'SNACK', description: '카페 디저트', emoji: '🍞',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '10분',
    instructions: ['식빵 두 장 사이에 인절미 떡을 넣습니다.', '팬이나 오븐에 구워 떡을 녹입니다.', '콩가루와 꿀, 아몬드 슬라이스를 뿌립니다.']
  },
  {
    id: 'loc-snack-29', name: '치즈 스틱', recipeType: 'SNACK', description: '쭉 늘어나는 치즈', emoji: '🧀',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '15분',
    instructions: ['스트링 치즈나 모짜렐라 치즈를 준비합니다.', '밀가루 -> 계란물 -> 빵가루 순으로 튀김옷을 입힙니다.', '기름에 노릇하게 튀깁니다.']
  },
  {
    id: 'loc-snack-30', name: '미니 핫도그', recipeType: 'SNACK', description: '식빵으로 만드는 핫도그', emoji: '🌭',
    ingredientsUsed: [], missingIngredients: [], cookingTime: '20분',
    instructions: ['식빵 테두리를 자르고 밀대로 밉니다.', '소세지를 넣고 돌돌 만 뒤 계란물을 묻힙니다.', '빵가루를 묻혀 튀기듯 굽습니다.']
  }
];

// 레시피별 필요 재료 매핑 (핵심 재료만) - 확장됨
const RECIPE_INGREDIENTS: Record<string, string[]> = {
    '돼지고기 김치찌개': ['돼지고기', '김치', '두부', '대파'],
    '된장찌개': ['된장', '두부', '애호박', '양파', '감자'],
    '제육볶음': ['돼지고기', '양파', '대파', '당근'],
    '소불고기': ['소고기', '양파', '당근', '버섯'],
    '닭볶음탕': ['닭고기', '감자', '양파', '당근'],
    '오징어 볶음': ['오징어', '양파', '대파', '당근'],
    '비빔밥': ['밥', '계란', '시금치', '콩나물', '호박', '당근'], 
    '카레라이스': ['카레가루', '감자', '양파', '당근', '고기'],
    '미역국': ['미역', '소고기'],
    '삼겹살 구이': ['삼겹살', '상추', '마늘', '김치'],
    '잡채': ['당면', '시금치', '당근', '양파', '고기', '버섯'],
    '순두부 찌개': ['순두부', '계란', '돼지고기', '바지락'],
    '김치볶음밥': ['김치', '밥', '햄', '계란', '대파'],
    '오므라이스': ['계란', '밥', '햄', '양파', '당근', '케찹'],
    '만둣국': ['만두', '계란', '대파', '멸치'],
    '떡국': ['떡국떡', '계란', '대파', '소고기'],
    '짜장밥': ['짜장가루', '밥', '고기', '양파', '감자'],
    '잔치국수': ['소면', '멸치', '계란', '호박', '김'],
    '콩나물국': ['콩나물', '대파', '멸치', '마늘'],
    '북어국': ['북어', '계란', '대파', '무'],
    '소고기 뭇국': ['소고기', '무', '대파', '마늘'],
    '부대찌개': ['햄', '소세지', '김치', '라면', '두부', '콩나물'],
    '오징어 뭇국': ['오징어', '무', '대파', '마늘'],
    '갈비찜': ['소고기', '무', '당근', '양파', '밤'],
    '수육/보쌈': ['돼지고기', '된장', '마늘', '양파', '대파'],
    '알리오 올리오': ['파스타면', '마늘', '페페론치노', '오일'],
    '크림 파스타': ['파스타면', '우유', '생크림', '베이컨'],
    '토마토 파스타': ['파스타면', '토마토', '다짐육', '양파'],
    '마파두부 덮밥': ['두부', '다짐육', '두반장', '파'],
    '강된장': ['된장', '두부', '양파', '호박'],
    '닭갈비': ['닭고기', '양배추', '고구마', '떡'],
    '콩국수': ['소면', '두부', '우유', '오이'],
    '어묵국': ['어묵', '무', '대파', '다시마'],
    '김치 우동': ['우동', '김치', '어묵', '대파'],
    '동태찌개': ['동태', '무', '두부', '쑥갓'],
    
    '계란말이': ['계란', '대파', '당근'],
    '시금치 나물': ['시금치'],
    '어묵 볶음': ['어묵', '양파'],
    '두부 조림': ['두부', '양파', '대파'],
    '감자채 볶음': ['감자', '양파'],
    '진미채 볶음': ['진미채'],
    '멸치 볶음': ['멸치'],
    '호박전': ['애호박', '계란', '밀가루'],
    '콩나물 무침': ['콩나물'],
    '계란찜': ['계란', '대파'],
    '소세지 야채볶음': ['소세지', '양파', '피망', '당근', '케찹'],
    '무생채': ['무', '대파', '고춧가루'],
    '오이 무침': ['오이', '양파'],
    '버섯 볶음': ['버섯', '양파', '당근'],
    '메추리알 장조림': ['메추리알', '간장'],
    '숙주 나물': ['숙주', '쪽파'],
    '감자 조림': ['감자', '간장'],
    '김 구이': ['김'],
    '가지 볶음': ['가지', '파'],
    '오이 냉국': ['오이', '미역', '식초'],
    '단무지 무침': ['단무지', '파'],
    '파래 무침': ['파래', '무'],
    '견과류 멸치 볶음': ['멸치', '아몬드', '호두'],
    '깻잎 찜': ['깻잎', '당근', '파'],
    '양파 장아찌': ['양파', '고추', '간장', '식초'],
    '마늘쫑 볶음': ['마늘쫑', '건새우'],
    '애호박 볶음': ['애호박', '새우젓', '파'],
    '브로콜리 두부 무침': ['브로콜리', '두부'],
    '참치전': ['참치캔', '계란', '양파'],
    '베이컨 팽이버섯 말이': ['베이컨', '팽이버섯'],
    '햄 감자채 볶음': ['햄', '감자', '양파'],
    '도토리묵 무침': ['도토리묵', '상추', '오이'],
    '맛살 계란말이': ['맛살', '계란'],

    '떡볶이': ['떡', '어묵', '대파'],
    '김치전': ['김치', '밀가루'],
    '프렌치 토스트': ['식빵', '계란', '우유'],
    '고구마 맛탕': ['고구마'],
    '라면': ['라면', '계란', '대파'],
    '길거리 토스트': ['식빵', '계란', '양배추', '햄'],
    '콘치즈': ['옥수수', '치즈', '마요네즈'],
    '주먹밥': ['밥', '김', '참치', '단무지'],
    '감자전': ['감자'],
    '군만두': ['만두'],
    '떡꼬치': ['떡', '고추장', '케찹'],
    '라볶이': ['떡', '라면', '어묵', '대파'],
    '계란 토스트': ['식빵', '계란'],
    '고구마 라떼': ['고구마', '우유', '꿀'],
    '소떡소떡': ['떡', '소세지', '케찹'],
    '식빵 피자': ['식빵', '치즈', '햄', '옥수수', '케찹'],
    '계란 샌드위치': ['식빵', '계란', '마요네즈'],
    '바나나 팬케이크': ['바나나', '계란', '밀가루'],
    '참치마요 주먹밥': ['밥', '참치캔', '마요네즈', '김'],
    '베이컨 떡말이': ['떡', '베이컨'],
    '떡국떡 츄러스': ['떡국떡', '설탕', '계피가루'],
    '버터 감자 구이': ['감자', '버터', '설탕'],
    '옥수수 전': ['옥수수', '부침가루', '연유'],
    '까르보나라 떡볶이': ['떡', '우유', '베이컨', '치즈'],
    '기름 떡볶이': ['떡', '고춧가루', '설탕'],
    '과일 샐러드': ['사과', '귤', '마요네즈'],
    '요거트 볼': ['요거트', '과일', '시리얼'],
    '인절미 토스트': ['식빵', '떡', '콩가루', '꿀'],
    '치즈 스틱': ['치즈', '빵가루', '계란'],
    '미니 핫도그': ['식빵', '소세지', '빵가루']
};

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

// 검색 엔진
export const searchPublicRecipes = async (ingredients: Ingredient[], type: 'MAIN' | 'SIDE' | 'SNACK'): Promise<Recipe[]> => {
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

    // 2. 카테고리 필터링
    const candidates = INTERNAL_RECIPE_DB.filter(r => r.recipeType === type);

    // 3. 점수 계산 (매칭되는 재료가 많을수록 높은 점수)
    const scoredRecipes = candidates.map(recipe => {
        const requiredIngredients = RECIPE_INGREDIENTS[recipe.name] || [];
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
        
        return {
            ...recipe,
            ingredientsUsed: used,
            missingIngredients: missing,
            score: matchCount
        };
    });

    // 4. 정렬: 점수 높은 순 -> 랜덤 (점수가 같으면 섞음)
    const results = scoredRecipes
        .filter(r => r.score > 0 || !ingredients || ingredients.length === 0) // 재료가 하나라도 맞거나, 냉장고가 비었으면 추천
        .sort((a, b) => {
            const scoreDiff = b.score - a.score;
            if (scoreDiff !== 0) return scoreDiff;
            return Math.random() - 0.5; // Same score? Shuffle.
        })
        .slice(0, 5); // [변경] 상위 10개 -> 상위 5개로 제한

    // 5. 결과 반환 (만약 매칭되는게 하나도 없으면 랜덤으로 몇 개 추천)
    if (results.length === 0) {
        return candidates.sort(() => Math.random() - 0.5).slice(0, 5);
    }

    return results;
};