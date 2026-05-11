import { STORAGE_KEYS } from "@/constants/meal";
import {
  formatTime,
  getTodayKey,
  isSameDate,
  parseLocalDate,
} from "@/utils/date";
import type {
  ExportPayload,
  ImportResult,
  MealRecord,
  MealRecordDraft,
} from "@/types/domain";

const MEMORY_STORAGE = new Map<string, string>();

function readStorage(key: string): string | null {
  if (typeof window === "undefined") {
    return MEMORY_STORAGE.get(key) ?? null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return MEMORY_STORAGE.get(key) ?? null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") {
    MEMORY_STORAGE.set(key, value);
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    MEMORY_STORAGE.set(key, value);
  }
}

function removeStorage(key: string): void {
  if (typeof window === "undefined") {
    MEMORY_STORAGE.delete(key);
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    MEMORY_STORAGE.delete(key);
  }
}

function safeParseRecords(raw: string | null): MealRecord[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMealRecord);
  } catch {
    return [];
  }
}

function isMealRecord(value: unknown): value is MealRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MealRecord>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.dateKey === "string" &&
    typeof candidate.mealType === "string" &&
    typeof candidate.fullness === "number" &&
    typeof candidate.time === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    parseLocalDate(candidate.dateKey) !== null
  );
}

function sortRecords(records: MealRecord[]): MealRecord[] {
  return [...records].sort((a, b) => {
    const dateCompare = a.dateKey.localeCompare(b.dateKey);
    if (dateCompare !== 0) return dateCompare;

    const mealOrder = ["breakfast", "lunch", "dinner", "snack"] as const;
    const aIndex = mealOrder.indexOf(a.mealType as (typeof mealOrder)[number]);
    const bIndex = mealOrder.indexOf(b.mealType as (typeof mealOrder)[number]);
    if (aIndex !== bIndex) return aIndex - bIndex;

    const updatedCompare = a.updatedAt.localeCompare(b.updatedAt);
    if (updatedCompare !== 0) return updatedCompare;

    return a.id.localeCompare(b.id);
  });
}

function createId(): string {
  return `record_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeDraft(draft: MealRecordDraft): MealRecord {
  const now = new Date().toISOString();
  const fallbackTime = formatTime(new Date());
  return {
    id: draft.id ?? createId(),
    dateKey: draft.dateKey,
    mealType: draft.mealType,
    fullness: draft.fullness,
    time: draft.time ?? fallbackTime,
    note: draft.note?.trim() || undefined,
    createdAt: draft.createdAt ?? now,
    updatedAt: now,
  };
}

function upsertIntoRecords(
  records: MealRecord[],
  nextRecord: MealRecord,
): MealRecord[] {
  const index = records.findIndex(
    (record) =>
      record.dateKey === nextRecord.dateKey &&
      record.mealType === nextRecord.mealType,
  );

  if (index >= 0) {
    const merged = [...records];
    const existing = merged[index];
    if (!existing) {
      return sortRecords([...records, nextRecord]);
    }
    merged[index] = {
      ...existing,
      ...nextRecord,
      createdAt: existing.createdAt,
      updatedAt: nextRecord.updatedAt,
    };
    return sortRecords(merged);
  }

  return sortRecords([...records, nextRecord]);
}

function isValidExportPayload(value: unknown): value is ExportPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ExportPayload>;
  return (
    candidate.app === "撑了么" &&
    candidate.version === 1 &&
    typeof candidate.exportedAt === "string" &&
    Array.isArray(candidate.records)
  );
}

export const recordRepository = {
  list(): MealRecord[] {
    return safeParseRecords(readStorage(STORAGE_KEYS.records));
  },

  save(records: MealRecord[]): void {
    writeStorage(STORAGE_KEYS.records, JSON.stringify(sortRecords(records)));
  },

  upsert(record: MealRecordDraft): MealRecord[] {
    const current = this.list();
    const nextRecord = normalizeDraft(record);
    const next = upsertIntoRecords(current, nextRecord);
    this.save(next);
    return next;
  },

  remove(id: string): MealRecord[] {
    const next = this.list().filter((record) => record.id !== id);
    this.save(next);
    return next;
  },

  clear(): void {
    removeStorage(STORAGE_KEYS.records);
  },

  exportData(): ExportPayload {
    return {
      app: "撑了么",
      version: 1,
      exportedAt: new Date().toISOString(),
      records: this.list(),
    };
  },

  importData(payload: unknown): ImportResult {
    if (!isValidExportPayload(payload)) {
      return {
        ok: false,
        records: this.list(),
        message: "文件不是「撑了么」的备份格式。",
      };
    }

    const records = payload.records.filter(isMealRecord).sort((a, b) => {
      if (isSameDate(new Date(a.createdAt), new Date(b.createdAt))) {
        return a.updatedAt.localeCompare(b.updatedAt);
      }
      return a.dateKey.localeCompare(b.dateKey);
    });

    if (records.length !== payload.records.length) {
      return {
        ok: false,
        records: this.list(),
        message: "备份里有无法识别的记录，暂时没有导入。",
      };
    }

    // 导入采用覆盖策略：备份文件是完整快照，导入后以文件内容为准。
    this.save(records);
    return {
      ok: true,
      records,
      message: "已导入备份，当前本地数据已被覆盖。",
    };
  },
};

export function createEmptyRecordDraft(): MealRecordDraft {
  return {
    dateKey: getTodayKey(),
    mealType: "lunch",
    fullness: 3,
    time: formatTime(new Date()),
  };
}
