import type { DateRange } from "@/types/domain";

const LOCAL_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const WEEKDAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] as const;

function toLocalDateParts(date: Date): { year: number; month: number; day: number } {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function toDateKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatLocalDate(date: Date): string {
  const { year, month, day } = toLocalDateParts(date);
  return toDateKeyFromParts(year, month, day);
}

export function formatTime(date: Date): string {
  return TIME_FORMATTER.format(date);
}

export function getTodayKey(): string {
  return formatLocalDate(new Date());
}

export function getWeekdayLabel(date: Date): string {
  return WEEKDAY_LABELS[date.getDay()] ?? WEEKDAY_LABELS[0];
}

export function parseLocalDate(dateKey: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function isSameDate(a: Date, b: Date): boolean {
  return formatLocalDate(a) === formatLocalDate(b);
}

export function getDateRange(days: number): DateRange {
  const safeDays = Math.max(1, Math.floor(days));
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (safeDays - 1));

  return {
    startKey: formatLocalDate(start),
    endKey: formatLocalDate(end),
  };
}

export function sortDateKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => a.localeCompare(b));
}

export function makeLocalDate(dateKey: string): Date | null {
  return parseLocalDate(dateKey);
}

export function formatDateLabel(dateKey: string): string {
  const parsed = parseLocalDate(dateKey);
  if (!parsed) return dateKey;
  return LOCAL_DATE_FORMATTER.format(parsed);
}
