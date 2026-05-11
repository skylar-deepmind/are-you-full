<template>
  <div class="space-y-4">
    <section class="rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <p class="text-xs text-[var(--app-muted)]">{{ todayLabel }}</p>
      <h2 class="mt-1 text-xl font-semibold">今天吃得怎么样？</h2>
      <p class="mt-2 text-sm leading-6 text-[var(--app-muted)]">
        记录一顿饭，慢慢找到最舒服的饱腹点。
      </p>
    </section>

    <section class="grid gap-3">
      <MealCard
        v-for="item in mealCards"
        :key="item.mealType"
        :title="item.title"
        :subtitle="item.subtitle"
        :empty-hint="item.emptyHint"
        :record="item.record"
        @select="openDrawer(item.mealType)"
      />
    </section>

    <section class="rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
      <p class="text-sm font-medium">今日摘要</p>
      <div class="mt-3 grid grid-cols-3 gap-3 text-center">
        <div class="rounded-2xl bg-[var(--app-accent-soft)]/60 px-3 py-3">
          <p class="text-lg font-semibold text-[var(--app-accent-strong)]">{{ recordStore.todaySummary.totalRecords }}</p>
          <p class="mt-1 text-xs text-[var(--app-muted)]">条记录</p>
        </div>
        <div class="rounded-2xl bg-[var(--app-accent-soft)]/60 px-3 py-3">
          <p class="text-lg font-semibold text-[var(--app-accent-strong)]">{{ recordStore.todaySummary.averageFullness.toFixed(1) }}</p>
          <p class="mt-1 text-xs text-[var(--app-muted)]">平均饱腹</p>
        </div>
        <div class="rounded-2xl bg-[var(--app-accent-soft)]/60 px-3 py-3">
          <p class="text-lg font-semibold text-[var(--app-accent-strong)]">{{ recordStore.todaySummary.uniqueDays }}</p>
          <p class="mt-1 text-xs text-[var(--app-muted)]">有记录天数</p>
        </div>
      </div>
    </section>

    <EmptyState v-if="recordStore.todayRecords.length === 0">
      <template #title>今天还没有记录</template>
      点任意一张餐次卡片，就能开始记第一顿。
    </EmptyState>

    <RecordDrawer
      :open="ui.drawerOpen"
      :record="currentRecord"
      :date-key="drawerContext?.dateKey ?? recordStore.todayKey"
      :meal-type="drawerContext?.mealType ?? 'lunch'"
      @close="closeDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import EmptyState from "@/components/common/EmptyState.vue";
import MealCard from "@/components/meal/MealCard.vue";
import RecordDrawer from "@/components/meal/RecordDrawer.vue";
import { MEAL_OPTIONS } from "@/constants/meal";
import { formatDateLabel, getWeekdayLabel, parseLocalDate } from "@/utils/date";
import { useRecordStore } from "@/stores/recordStore";
import { useUiStore } from "@/stores/uiStore";
import type { MealType } from "@/types/domain";

const recordStore = useRecordStore();
const ui = useUiStore();

onMounted(() => {
  recordStore.ensureLoaded();
});

const drawerContext = computed(() => ui.drawer.context);
const currentRecord = computed(() => {
  const context = drawerContext.value;
  if (!context?.recordId) return null;
  return recordStore.getRecordById(context.recordId) ?? null;
});

const todayLabel = computed(() => {
  const parsed = parseLocalDate(recordStore.todayKey);
  if (!parsed) return formatDateLabel(recordStore.todayKey);
  return `${formatDateLabel(recordStore.todayKey)} · ${getWeekdayLabel(parsed)}`;
});

const mealCards = computed(() =>
  MEAL_OPTIONS.map((option) => {
    const record = recordStore.getTodayRecordByMealType(option.value);
    return {
      mealType: option.value,
      title: option.label,
      subtitle: record ? `记录于 ${record.time}` : "还没记这顿",
      emptyHint: "点这里开始记录",
      record,
    };
  }),
);

function openDrawer(mealType: MealType): void {
  const record = recordStore.getTodayRecordByMealType(mealType);
  ui.openDrawer({
    dateKey: recordStore.todayKey,
    mealType,
    recordId: record?.id ?? null,
  });
}

function closeDrawer(): void {
  ui.closeDrawer();
}
</script>
