
import { Category, StorageType } from './types';

// Priority is important: Check longer/specific words first, then shorter/generic words.
const KEYWORD_RULES: [string, Category][] = [
    // Specific Sauce/Condiments
    ['고추장', Category.SAUCE],
    ['초고추장', Category.SAUCE],
    ['쌈장', Category.SAUCE],
    ['된장', Category.SAUCE],
    ['간장', Category.SAUCE],
    ['맛간장', Category.SAUCE],
    ['초간장', Category.SAUCE],
    ['소금', Category.SAUCE],
    ['설탕', Category.SAUCE],
    ['참기름', Category.SAUCE],
    ['들기름', Category.SAUCE],
    ['식초', Category.SAUCE],
    ['케찹', Category.SAUCE],
    ['케첩', Category.SAUCE],
    ['마요네즈', Category.SAUCE],
    ['머스타드', Category.SAUCE],
    ['후추', Category.SAUCE],
    ['소스', Category.SAUCE],
    ['드레싱', Category.SAUCE],
    ['액젓', Category.SAUCE],
    ['올리고당', Category.SAUCE],
    ['물엿', Category.SAUCE],
    ['다시다', Category.SAUCE],
    ['미원', Category.SAUCE],
    ['잼', Category.SAUCE],
    ['버터', Category.DAIRY], // Moved Butter to Dairy or Sauce? Usually kept with Dairy but used as fat. Let's keep Dairy for now as it is milk product.

    // Processed Food & Snacks (Specifics)
    ['밀키트', Category.PROCESSED], // Meal Kit
    ['붕어빵', Category.PROCESSED], // Snack (contains 'bread' but is processed/snack)
    ['호떡', Category.PROCESSED],
    ['핫도그', Category.PROCESSED],
    ['피자', Category.PROCESSED],
    ['햄버거', Category.PROCESSED],
    ['치즈볼', Category.PROCESSED],
    ['감자튀김', Category.PROCESSED],
    ['아이스크림', Category.PROCESSED],
    ['과자', Category.PROCESSED],
    ['스낵', Category.PROCESSED],
    ['쿠키', Category.PROCESSED],
    ['케이크', Category.PROCESSED],
    
    // Canned & Processed Meats
    ['참치캔', Category.PROCESSED],
    ['통조림', Category.PROCESSED],
    ['스팸', Category.PROCESSED],
    ['리챔', Category.PROCESSED],
    ['햄', Category.PROCESSED],
    ['소세지', Category.PROCESSED],
    ['소시지', Category.PROCESSED],
    ['베이컨', Category.PROCESSED],
    ['만두', Category.PROCESSED],
    ['교자', Category.PROCESSED],
    ['돈까스', Category.PROCESSED],
    ['돈가스', Category.PROCESSED],
    ['떡갈비', Category.PROCESSED],
    ['너겟', Category.PROCESSED],
    ['동그랑땡', Category.PROCESSED],
    ['어묵', Category.PROCESSED],
    ['오뎅', Category.PROCESSED],
    ['맛살', Category.PROCESSED],
    ['크래미', Category.PROCESSED],
    ['유부', Category.PROCESSED],
    ['두부', Category.PROCESSED], // Tofu is processed bean
    ['순두부', Category.PROCESSED],
    ['라면', Category.PROCESSED], // Instant noodle
    ['컵라면', Category.PROCESSED],
    ['즉석밥', Category.PROCESSED],
    ['햇반', Category.PROCESSED],

    // Dairy & Eggs
    ['우유', Category.DAIRY],
    ['치즈', Category.DAIRY],
    ['계란', Category.DAIRY],
    ['달걀', Category.DAIRY],
    ['메추리알', Category.DAIRY],
    ['요거트', Category.DAIRY],
    ['요구르트', Category.DAIRY],
    ['생크림', Category.DAIRY],
    ['휘핑크림', Category.DAIRY],
    ['연유', Category.DAIRY],

    // Meat
    ['돼지', Category.MEAT],
    ['삼겹', Category.MEAT],
    ['목살', Category.MEAT],
    ['항정살', Category.MEAT],
    ['앞다리', Category.MEAT],
    ['뒷다리', Category.MEAT],
    ['소고기', Category.MEAT],
    ['한우', Category.MEAT],
    ['차돌', Category.MEAT],
    ['양지', Category.MEAT],
    ['등심', Category.MEAT],
    ['안심', Category.MEAT],
    ['갈비', Category.MEAT],
    ['채끝', Category.MEAT],
    ['닭', Category.MEAT],
    ['치킨', Category.MEAT],
    ['오리', Category.MEAT],
    ['양고기', Category.MEAT],
    ['다짐육', Category.MEAT],
    ['민찌', Category.MEAT],
    
    // Fish & Seafood
    ['고등어', Category.FISH],
    ['삼치', Category.FISH],
    ['갈치', Category.FISH],
    ['꽁치', Category.FISH],
    ['참치', Category.FISH], // Raw tuna
    ['연어', Category.FISH],
    ['광어', Category.FISH],
    ['우럭', Category.FISH],
    ['오징어', Category.FISH],
    ['낙지', Category.FISH],
    ['문어', Category.FISH],
    ['쭈꾸미', Category.FISH],
    ['새우', Category.FISH],
    ['게', Category.FISH],
    ['꽃게', Category.FISH],
    ['대게', Category.FISH],
    ['조개', Category.FISH],
    ['홍합', Category.FISH],
    ['바지락', Category.FISH],
    ['굴', Category.FISH],
    ['전복', Category.FISH],
    ['멸치', Category.FISH],
    ['진미채', Category.FISH],
    ['황태', Category.FISH],
    ['북어', Category.FISH],
    ['미역', Category.FISH],
    ['김', Category.FISH],
    ['다시마', Category.FISH],

    // Grain & Noodles
    ['파스타', Category.GRAIN], // Check before '파'
    ['스파게티', Category.GRAIN],
    ['쌀', Category.GRAIN],
    ['현미', Category.GRAIN],
    ['잡곡', Category.GRAIN],
    ['흑미', Category.GRAIN],
    ['밥', Category.GRAIN], // 볶음밥 etc
    ['국수', Category.GRAIN],
    ['소면', Category.GRAIN],
    ['중면', Category.GRAIN],
    ['당면', Category.GRAIN],
    ['우동', Category.GRAIN],
    ['칼국수', Category.GRAIN],
    ['떡', Category.GRAIN],
    ['식빵', Category.GRAIN],
    ['빵', Category.GRAIN],
    ['모닝빵', Category.GRAIN],
    ['베이글', Category.GRAIN],
    ['밀가루', Category.GRAIN],
    ['부침가루', Category.GRAIN],
    ['튀김가루', Category.GRAIN],
    ['시리얼', Category.GRAIN],
    ['오트밀', Category.GRAIN],

    // Fruit
    ['사과', Category.FRUIT],
    ['배', Category.FRUIT], 
    ['포도', Category.FRUIT],
    ['귤', Category.FRUIT],
    ['오렌지', Category.FRUIT],
    ['한라봉', Category.FRUIT],
    ['바나나', Category.FRUIT],
    ['딸기', Category.FRUIT],
    ['토마토', Category.FRUIT], // Culinary fruit often
    ['방울토마토', Category.FRUIT],
    ['키위', Category.FRUIT],
    ['복숭아', Category.FRUIT],
    ['수박', Category.FRUIT],
    ['참외', Category.FRUIT],
    ['자두', Category.FRUIT],
    ['메론', Category.FRUIT],
    ['멜론', Category.FRUIT],
    ['망고', Category.FRUIT],
    ['레몬', Category.FRUIT],
    ['블루베리', Category.FRUIT],
    ['체리', Category.FRUIT],
    ['파인애플', Category.FRUIT],

    // Vegetable (Check last as single chars like '파', '무' might match other things if checked too early)
    ['김치', Category.VEGETABLE], // Added Kimchi
    ['양파', Category.VEGETABLE],
    ['대파', Category.VEGETABLE],
    ['쪽파', Category.VEGETABLE],
    ['마늘', Category.VEGETABLE],
    ['고추', Category.VEGETABLE],
    ['상추', Category.VEGETABLE],
    ['깻잎', Category.VEGETABLE],
    ['배추', Category.VEGETABLE],
    ['양배추', Category.VEGETABLE],
    ['무', Category.VEGETABLE],
    ['당근', Category.VEGETABLE],
    ['오이', Category.VEGETABLE],
    ['호박', Category.VEGETABLE],
    ['애호박', Category.VEGETABLE],
    ['단호박', Category.VEGETABLE],
    ['가지', Category.VEGETABLE],
    ['감자', Category.VEGETABLE],
    ['고구마', Category.VEGETABLE],
    ['버섯', Category.VEGETABLE],
    ['팽이', Category.VEGETABLE], // Mushroom
    ['표고', Category.VEGETABLE], // Mushroom
    ['송이', Category.VEGETABLE], // Mushroom
    ['시금치', Category.VEGETABLE],
    ['콩나물', Category.VEGETABLE],
    ['숙주', Category.VEGETABLE],
    ['브로콜리', Category.VEGETABLE],
    ['피망', Category.VEGETABLE],
    ['파프리카', Category.VEGETABLE],
    ['부추', Category.VEGETABLE],
    ['쑥갓', Category.VEGETABLE],
    ['미나리', Category.VEGETABLE],
    ['청경채', Category.VEGETABLE],
    ['아스파라거스', Category.VEGETABLE],
    ['파', Category.VEGETABLE], // Single char matches last
    ['콩', Category.VEGETABLE], // Or Grain?

    // Generic Sauce fallback
    ['기름', Category.SAUCE],
    ['오일', Category.SAUCE],
    ['청', Category.SAUCE], // 매실청 etc
    ['가루', Category.SAUCE], // 고춧가루 etc. Could be flour (grain), but grain checked earlier.
];

const STORAGE_RULES: [string, StorageType][] = [
    // 1. Freezer (Prioritize frozen items)
    ['냉동', StorageType.FREEZER],
    ['얼음', StorageType.FREEZER],
    ['아이스', StorageType.FREEZER],
    ['만두', StorageType.FREEZER],
    ['피자', StorageType.FREEZER],
    ['핫도그', StorageType.FREEZER],
    ['치즈볼', StorageType.FREEZER],
    ['감자튀김', StorageType.FREEZER],
    ['돈까스', StorageType.FREEZER],
    ['너겟', StorageType.FREEZER],
    ['동그랑땡', StorageType.FREEZER],

    // 2. Pantry (Room Temperature)
    ['라면', StorageType.PANTRY],
    ['국수', StorageType.PANTRY],
    ['파스타', StorageType.PANTRY],
    ['당면', StorageType.PANTRY],
    ['통조림', StorageType.PANTRY],
    ['참치캔', StorageType.PANTRY],
    ['스팸', StorageType.PANTRY],
    ['리챔', StorageType.PANTRY],
    ['즉석밥', StorageType.PANTRY],
    ['햇반', StorageType.PANTRY],
    ['가루', StorageType.PANTRY],
    ['설탕', StorageType.PANTRY],
    ['소금', StorageType.PANTRY],
    ['식용유', StorageType.PANTRY],
    ['기름', StorageType.PANTRY],
    ['간장', StorageType.PANTRY],
    ['과자', StorageType.PANTRY],
    ['스낵', StorageType.PANTRY],
    ['시리얼', StorageType.PANTRY],
    ['식빵', StorageType.PANTRY],
    ['양파', StorageType.PANTRY], // Often pantry
    ['감자', StorageType.PANTRY], // Often pantry
    ['고구마', StorageType.PANTRY], // Often pantry
    ['바나나', StorageType.PANTRY],
    ['귤', StorageType.PANTRY],
    ['김', StorageType.PANTRY],

    // 3. Fridge (Fresh Produce/Meat/Dairy)
    ['우유', StorageType.FRIDGE],
    ['치즈', StorageType.FRIDGE],
    ['요거트', StorageType.FRIDGE],
    ['계란', StorageType.FRIDGE],
    ['두부', StorageType.FRIDGE],
    ['콩나물', StorageType.FRIDGE],
    ['시금치', StorageType.FRIDGE],
    ['김치', StorageType.FRIDGE],
    ['무', StorageType.FRIDGE], 
    ['파', StorageType.FRIDGE], 
    ['고추', StorageType.FRIDGE],
    ['오이', StorageType.FRIDGE],
    ['호박', StorageType.FRIDGE],
    ['배추', StorageType.FRIDGE],
    ['상추', StorageType.FRIDGE],
    ['깻잎', StorageType.FRIDGE],
    ['고기', StorageType.FRIDGE],
    ['삼겹', StorageType.FRIDGE],
    ['목살', StorageType.FRIDGE],
    ['소고기', StorageType.FRIDGE],
    ['닭', StorageType.FRIDGE],
    ['어묵', StorageType.FRIDGE],
    ['맛살', StorageType.FRIDGE],
    ['햄', StorageType.FRIDGE], 
    ['베이컨', StorageType.FRIDGE],
    ['소세지', StorageType.FRIDGE],
];

export function autoDetectCategory(name: string): Category | null {
    const n = name.replace(/\s+/g, ''); // Remove spaces for better matching
    if (!n) return null;
    
    for (const [keyword, category] of KEYWORD_RULES) {
        if (n.includes(keyword)) {
            return category;
        }
    }
    return null;
}

export function autoDetectStorage(name: string): StorageType | null {
    const n = name.replace(/\s+/g, '');
    for (const [keyword, storage] of STORAGE_RULES) {
        if (n.includes(keyword)) {
            return storage;
        }
    }
    return null;
}
