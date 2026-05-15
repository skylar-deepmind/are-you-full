import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  recordRepository,
  createEmptyRecordDraft,
} from "@/repositories/recordRepository";
import { formatDateLabel, getTodayKey } from "@/utils/date";
import {
  average,
  filterRecordsByRange,
  getDailyTrend,
  getStatsSummary,
  sortRecordsForDisplay,
} from "@/utils/stats";
import type {
  ExportPayload,
  ImportResult,
  MealRecord,
  MealRecordDraft,
  MealType,
  RecordGroup,
} from "@/types/domain";

export const useRecordStore = defineStore("record", () => {
  const records = ref<MealRecord[]>([]);
  const loaded = ref(false);

  const todayKey = computed(() => getTodayKey());
  const sortedRecords = computed(() => sortRecordsForDisplay(records.value));
  const todayRecords = computed(() =>
    sortedRecords.value.filter((record) => record.dateKey === todayKey.value),
  );
  const todayRecordsByMealType = computed(() => {
    const result = new Map<MealType, MealRecord | null>();
    for (const mealType of ["breakfast", "lunch", "dinner", "snack"] as const) {
      result.set(
        mealType,
        sortedRecords.value.find(
          (record) =>
            record.dateKey === todayKey.value && record.mealType === mealType,
        ) ?? null,
      );
    }
    return result;
  });
  // Group records by dateKey
  const groupedRecords = computed<RecordGroup[]>(() => {
    const groups = new Map<string, MealRecord[]>();
    for (const record of sortedRecords.value) {
      const bucket = groups.get(record.dateKey) ?? [];
      bucket.push(record);
      groups.set(record.dateKey, bucket);
    }

    return [...groups.entries()].map(([dateKey, items]) => ({
      dateKey,
      label: formatDateLabel(dateKey),
      records: items,
      totalCount: items.length,
      averageFullness: average(items.map((item) => item.fullness)),
    }));
  });

  const todaySummary = computed(() => getStatsSummary(todayRecords.value));
  const overallSummary = computed(() => getStatsSummary(sortedRecords.value));
  const todayTrend = computed(() => getDailyTrend(sortedRecords.value, 7));

  function hydrate(): void {
    records.value = recordRepository.list();
    loaded.value = true;
  }

  function ensureLoaded(): void {
    if (!loaded.value) {
      hydrate();
    }
  }

  function refresh(): void {
    hydrate();
  }

  function addRecord(draft: MealRecordDraft): MealRecord[] {
    const next = recordRepository.upsert(draft);
    records.value = next;
    return next;
  }

  function updateRecord(draft: MealRecordDraft): MealRecord[] {
    const next = recordRepository.upsert(draft);
    records.value = next;
    return next;
  }

  function saveRecord(draft: MealRecordDraft): MealRecord[] {
    const next = recordRepository.upsert(draft);
    records.value = next;
    return next;
  }

  function removeRecord(id: string): MealRecord[] {
    const next = recordRepository.remove(id);
    records.value = next;
    return next;
  }

  function clearRecords(): void {
    recordRepository.clear();
    records.value = [];
  }

  function exportData(): ExportPayload {
    return recordRepository.exportData();
  }

  function importData(payload: unknown): ImportResult {
    const result = recordRepository.importData(payload);
    if (result.ok) {
      records.value = result.records;
    }
    return result;
  }

  function getRecordById(id: string): MealRecord | undefined {
    return records.value.find((record) => record.id === id);
  }

  function getRecordsByDate(dateKey: string): MealRecord[] {
    return sortedRecords.value.filter((record) => record.dateKey === dateKey);
  }

  function getRecordsByMealType(mealType: MealType): MealRecord[] {
    return sortedRecords.value.filter((record) => record.mealType === mealType);
  }

  function getTodayRecordByMealType(mealType: MealType): MealRecord | null {
    return todayRecordsByMealType.value.get(mealType) ?? null;
  }

  function getRecordsInRange(startKey: string, endKey: string): MealRecord[] {
    return filterRecordsByRange(sortedRecords.value, { startKey, endKey });
  }

  return {
    records,
    loaded,
    todayKey,
    todayRecords,
    todayRecordsByMealType,
    groupedRecords,
    todaySummary,
    overallSummary,
    todayTrend,
    sortedRecords,
    hydrate,
    ensureLoaded,
    refresh,
    addRecord,
    updateRecord,
    saveRecord,
    removeRecord,
    clearRecords,
    exportData,
    importData,
    getRecordById,
    getRecordsByDate,
    getRecordsByMealType,
    getTodayRecordByMealType,
    getRecordsInRange,
    createEmptyRecordDraft,
  };
});
