<template>
  <div class="space-y-4">
    <section class="rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold">统计</h2>
          <p class="mt-1 text-sm text-[var(--app-muted)]">看看最近这段时间的吃饭感觉。</p>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <button
          v-for="option in STATS_RANGE_OPTIONS"
          :key="option.key"
          class="btn rounded-2xl"
          :class="selectedRange === option.key ? activeRangeClass : inactiveRangeClass"
          @click="selectedRange = option.key"
        >
          {{ option.label }}
        </button>
      </div>
    </section>

    <EmptyState v-if="filteredRecords.length === 0">
      <template #title>这段时间还没有数据</template>
      换个范围看看，或者先去“今日”页记一顿。
    </EmptyState>

    <template v-else>
      <section class="grid grid-cols-2 gap-3">
        <StatCard label="总记录数" :value="summary.totalRecords" hint="条" />
        <StatCard label="平均饱腹度" :value="summary.averageFullness.toFixed(1)" hint="满分 5" />
        <StatCard label="吃撑次数" :value="overfullCount" hint="fullness ≥ 3" />
        <StatCard label="舒服吃饭率" :value="calmRatio" hint="fullness = 2" />
      </section>

      <MealAverageList :items="mealAverages" />

      <TrendSvgChart :points="trendPoints" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import EmptyState from "@/components/common/EmptyState.vue";
import MealAverageList from "@/components/stats/MealAverageList.vue";
import StatCard from "@/components/stats/StatCard.vue";
import TrendSvgChart from "@/components/stats/TrendSvgChart.vue";
import { MEAL_OPTIONS } from "@/constants/meal";
import { STATS_RANGE_OPTIONS, getStatsRangeKeys, type StatsRangeKey } from "@/utils/range";
import { average, getStatsSummary, getDailyTrend } from "@/utils/stats";
import { useRecordStore } from "@/stores/recordStore";

const recordStore = useRecordStore();
const selectedRange = ref<StatsRangeKey>("7d");

onMounted(() => {
  recordStore.ensureLoaded();
});

const filteredRecords = computed(() => {
  const range = getStatsRangeKeys(selectedRange.value);
  if (!range) return recordStore.sortedRecords;
  return recordStore.getRecordsInRange(range.startKey, range.endKey);
});

const summary = computed(() => getStatsSummary(filteredRecords.value));

const overfullCount = computed(() => filteredRecords.value.filter((record) => record.fullness >= 3).length);

const calmRatio = computed(() => {
  if (filteredRecords.value.length === 0) return "0%";
  const ratio = filteredRecords.value.filter((record) => record.fullness === 2).length / filteredRecords.value.length;
  return `${Math.round(ratio * 100)}%`;
});

const mealAverages = computed(() =>
  MEAL_OPTIONS.map((option) => {
    const records = filteredRecords.value.filter((record) => record.mealType === option.value);
    return {
      label: option.label,
      count: records.length,
      average: average(records.map((record) => record.fullness)),
    };
  }),
);

const trendPoints = computed(() => {
  const range = getStatsRangeKeys(selectedRange.value);
  const source = range ? filteredRecords.value : recordStore.sortedRecords;
  const days = selectedRange.value === "30d" ? 30 : selectedRange.value === "7d" ? 7 : Math.max(7, recordStore.groupedRecords.length);
  return getDailyTrend(source, days);
});

const activeRangeClass = "border-[var(--app-accent-strong)] bg-[var(--app-accent-soft)] text-[var(--app-accent-strong)]";
const inactiveRangeClass = "border-[var(--app-border)] bg-white text-[var(--app-muted)]";
</script>
