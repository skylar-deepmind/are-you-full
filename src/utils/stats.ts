import { FULLNESS_OPTIONS, MEAL_OPTIONS } from "@/constants/meal";
import { formatDateLabel, formatLocalDate, parseLocalDate } from "@/utils/date";
import type {
  DailyTrendPoint,
  MealRecord,
  MealType,
  MealTypeStat,
  StatsSummary,
} from "@/types/domain";

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const total = numbers.reduce((sum, value) => sum + value, 0);
  return total / numbers.length;
}

export function getMealTypeStats(records: MealRecord[]): MealTypeStat[] {
  return MEAL_OPTIONS.map((option) => {
    const items = records.filter((record) => record.mealType === option.value);
    const fullnessValues = items.map((record) => record.fullness);
    const sortedByTime = [...items].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

    return {
      mealType: option.value,
      label: option.label,
      count: items.length,
      averageFullness: average(fullnessValues),
      latestRecordAt: sortedByTime.at(-1)?.updatedAt ?? null,
    };
  });
}

export function getStatsSummary(records: MealRecord[]): StatsSummary {
  const uniqueDays = new Set(records.map((record) => record.dateKey)).size;
  const sortedByTime = [...records].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

  return {
    totalRecords: records.length,
    uniqueDays,
    averageFullness: average(records.map((record) => record.fullness)),
    latestRecordAt: sortedByTime.at(-1)?.updatedAt ?? null,
    mealTypeStats: getMealTypeStats(records),
  };
}

export function getDailyTrend(records: MealRecord[], days: number): DailyTrendPoint[] {
  const safeDays = Math.max(1, Math.floor(days));
  const recentDates: string[] = [];
  const now = new Date();

  for (let index = safeDays - 1; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - index);
    recentDates.push(formatLocalDate(date));
  }

  return recentDates.map((dateKey) => {
    const items = records.filter((record) => record.dateKey === dateKey);
    return {
      dateKey,
      label: formatDateLabel(dateKey),
      count: items.length,
      averageFullness: average(items.map((record) => record.fullness)),
      records: [...items].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt)),
    };
  });
}

export function filterRecordsByRange(records: MealRecord[], range: { startKey: string; endKey: string }): MealRecord[] {
  return records.filter((record) => record.dateKey >= range.startKey && record.dateKey <= range.endKey);
}

export function getMealTypeLabel(mealType: MealType): string {
  return MEAL_OPTIONS.find((option) => option.value === mealType)?.label ?? mealType;
}

export function getFullnessLabel(fullness: number): string {
  return FULLNESS_OPTIONS.find((option) => option.value === fullness)?.label ?? String(fullness);
}

export function sortRecordsForDisplay(records: MealRecord[]): MealRecord[] {
  return [...records].sort((a, b) => {
    const dateCompare = b.dateKey.localeCompare(a.dateKey);
    if (dateCompare !== 0) return dateCompare;
    const mealCompare = MEAL_OPTIONS.findIndex((option) => option.value === a.mealType) - MEAL_OPTIONS.findIndex((option) => option.value === b.mealType);
    if (mealCompare !== 0) return mealCompare;
    return a.updatedAt.localeCompare(b.updatedAt);
  });
}

export function isRecordDateValid(record: MealRecord): boolean {
  return parseLocalDate(record.dateKey) !== null;
}
