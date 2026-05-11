import type { FullnessLevel, MealType } from "@/types/domain";

export const MEAL_OPTIONS: Array<{ value: MealType; label: string }> = [
  { value: "breakfast", label: "早餐" },
  { value: "lunch", label: "午餐" },
  { value: "dinner", label: "晚餐" },
  { value: "snack", label: "加餐" },
];

export const FULLNESS_OPTIONS: Array<{ value: FullnessLevel; label: string; hint: string }> = [
  { value: 1, label: "很饿", hint: "还差很多" },
  { value: 2, label: "有点饿", hint: "可以先吃一点" },
  { value: 3, label: "刚好", hint: "舒服的状态" },
  { value: 4, label: "偏饱", hint: "再吃就有点顶" },
  { value: 5, label: "撑了", hint: "明显吃太多了" },
];

export const STORAGE_KEYS = {
  records: "are-you-full.records.v1",
  settings: "are-you-full.settings.v1",
} as const;

export const FULLNESS_EMOJI: Record<FullnessLevel, string> = {
  1: "😣",
  2: "🙂",
  3: "😌",
  4: "😮‍💨",
  5: "😵‍💫",
};
