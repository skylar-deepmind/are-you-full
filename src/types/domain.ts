export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type FullnessLevel = 1 | 2 | 3 | 4 | 5;

export interface MealRecord {
  id: string;
  dateKey: string;
  mealType: MealType;
  fullness: FullnessLevel;
  time: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// 方便表单先写入草稿，再由 repository 补齐 id 和时间字段。
export type MealRecordDraft = Omit<
  MealRecord,
  "id" | "createdAt" | "updatedAt" | "time"
> &
  Partial<Pick<MealRecord, "time">> &
  Partial<Pick<MealRecord, "id" | "createdAt" | "updatedAt">>;

export interface AppSettings {
  preferredWeekStart?: "sunday" | "monday";
  compactMode?: boolean;
  locale?: string;
}

export interface ExportPayload {
  app: "撑了么";
  version: 1;
  exportedAt: string;
  records: MealRecord[];
  settings?: AppSettings;
}

export interface ImportResult {
  ok: boolean;
  records: MealRecord[];
  message: string;
}

export interface DateRange {
  startKey: string;
  endKey: string;
}

export interface MealTypeStat {
  mealType: MealType;
  label: string;
  count: number;
  averageFullness: number;
  latestRecordAt: string | null;
}

export interface StatsSummary {
  totalRecords: number;
  uniqueDays: number;
  averageFullness: number;
  latestRecordAt: string | null;
  mealTypeStats: MealTypeStat[];
}

export interface DailyTrendPoint {
  dateKey: string;
  label: string;
  count: number;
  averageFullness: number;
  records: MealRecord[];
}

export interface RecordGroup {
  dateKey: string;
  label: string;
  records: MealRecord[];
  totalCount: number;
  averageFullness: number;
}

export interface DrawerContext {
  dateKey: string;
  mealType: MealType;
  recordId: string | null;
}
