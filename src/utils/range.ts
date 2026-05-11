import { getDateRange, parseLocalDate, formatLocalDate } from "@/utils/date";

export type StatsRangeKey = "7d" | "30d" | "all";

export interface StatsRangeOption {
  key: StatsRangeKey;
  label: string;
  days: number | null;
}

export const STATS_RANGE_OPTIONS: StatsRangeOption[] = [
  { key: "7d", label: "近 7 天", days: 7 },
  { key: "30d", label: "近 30 天", days: 30 },
  { key: "all", label: "全部", days: null },
];

export function getStatsRangeKeys(range: StatsRangeKey): { startKey: string; endKey: string } | null {
  if (range === "all") return null;
  const option = STATS_RANGE_OPTIONS.find((item) => item.key === range);
  if (!option?.days) return null;
  return getDateRange(option.days);
}

export function clampDateKey(dateKey: string): string | null {
  return parseLocalDate(dateKey) ? formatLocalDate(parseLocalDate(dateKey) as Date) : null;
}
