import { Category, StorageType } from "./types";
import { Snowflake, Layers, Package } from "lucide-react";

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.VEGETABLE]: "야채",
  [Category.FRUIT]: "과일",
  [Category.MEAT]: "육류",
  [Category.FISH]: "수산물",
  [Category.DAIRY]: "유제품/계란",
  [Category.GRAIN]: "곡류/면",
  [Category.PROCESSED]: "가공식품",
  [Category.SAUCE]: "양념/소스",
  [Category.ETC]: "기타",
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  [Category.VEGETABLE]: "🥬",
  [Category.FRUIT]: "🍎",
  [Category.MEAT]: "🥩",
  [Category.FISH]: "🐟",
  [Category.DAIRY]: "🥛",
  [Category.GRAIN]: "🍚",
  [Category.PROCESSED]: "🌭",
  [Category.SAUCE]: "🧂",
  [Category.ETC]: "📦",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.VEGETABLE]: "bg-green-100 text-green-800 border-green-200",
  [Category.FRUIT]: "bg-pink-100 text-pink-800 border-pink-200",
  [Category.MEAT]: "bg-red-100 text-red-800 border-red-200",
  [Category.FISH]: "bg-blue-100 text-blue-800 border-blue-200",
  [Category.DAIRY]: "bg-orange-100 text-orange-800 border-orange-200",
  [Category.GRAIN]: "bg-amber-100 text-amber-800 border-amber-200",
  [Category.PROCESSED]: "bg-purple-100 text-purple-800 border-purple-200",
  [Category.SAUCE]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [Category.ETC]: "bg-gray-100 text-gray-800 border-gray-200",
};

export const STORAGE_LABELS: Record<StorageType, string> = {
  [StorageType.FREEZER]: "냉동실",
  [StorageType.FRIDGE]: "냉장실",
  [StorageType.PANTRY]: "실온",
};

export const STORAGE_ICONS: Record<StorageType, any> = {
  [StorageType.FREEZER]: Snowflake,
  [StorageType.FRIDGE]: Layers, 
  [StorageType.PANTRY]: Package,
};

export const DEFAULT_BASIC_SEASONINGS = [
  "설탕", "고춧가루", "소금", "후추", "깨", "마늘", 
  "고추장", "된장", "진간장", "양조간장", 
  "액젓", "식초", "올리고당", "식용유", "참기름", 
  "들기름", "맛술", "케찹", "마요네즈"
];

// Grouped suggestions for Quick Add in Modal
export const COMMON_INGREDIENTS: Record<Category, string[]> = {
  [Category.VEGETABLE]: [
    "김치", "양파", "대파", "마늘", "감자", "고구마", "당근", "애호박", 
    "오이", "콩나물", "시금치", "양배추", "무", "브로콜리", 
    "버섯", "팽이버섯", "상추", "깻잎", "청양고추", "파프리카"
  ],
  [Category.MEAT]: [
    "돼지고기", "삼겹살", "목살", "다짐육", "소고기", "국거리", 
    "구이용 소고기", "차돌박이", "닭고기", "닭볶음탕용", "닭가슴살", "오리고기"
  ],
  [Category.FISH]: [
    "고등어", "오징어", "새우", "멸치", "조개", "굴", "미역", 
    "김", "갈치", "어묵", "참치캔"
  ],
  [Category.DAIRY]: [
    "계란", "우유", "치즈", "요거트", "버터", "메추리알", "두부", "순두부"
  ],
  [Category.FRUIT]: [
    "사과", "배", "바나나", "귤", "포도", "딸기", "토마토", 
    "방울토마토", "블루베리", "수박", "참외", "복숭아"
  ],
  [Category.GRAIN]: [
    "쌀", "현미", "잡곡", "파스타면", "소면", "라면", "식빵", 
    "떡국떡", "떡볶이떡", "당면", "부침가루"
  ],
  [Category.PROCESSED]: [
    "햄", "소시지", "베이컨", "만두", "돈까스", "맛살", 
    "단무지", "피클", "통조림", "즉석밥"
  ],
  [Category.SAUCE]: [], // Handled in Basic Seasoning Manager
  [Category.ETC]: []
};