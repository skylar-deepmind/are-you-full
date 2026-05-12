<template>
  <div class="space-y-4">
    <section
      class="rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
    >
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold">历史</h2>
          <p class="mt-1 text-sm text-[var(--app-muted)]">
            按天回看每顿饭的感觉。
          </p>
        </div>
      </div>
    </section>

    <EmptyState v-if="groupedRecords.length === 0">
      <template #title>还没有任何历史记录</template>
      先在“今日”页记一顿，过几天这里就会慢慢有内容了。
    </EmptyState>

    <div v-else class="space-y-4">
      <section
        v-for="group in groupedRecords"
        :key="group.dateKey"
        class="rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold">{{ group.label }}</h3>
            <p class="mt-1 text-xs text-[var(--app-muted)]">
              {{ group.totalCount }} 条记录 · 平均
              {{ group.averageFullness.toFixed(1) }}
            </p>
          </div>
        </div>

        <div class="mt-4 space-y-3">
          <HistoryRecordItem
            v-for="record in group.records"
            :key="record.id"
            :record="record"
            @edit="openRecord(record)"
            @remove="askRemove(record)"
          />
        </div>
      </section>
    </div>

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
import HistoryRecordItem from "@/components/history/HistoryRecordItem.vue";
import RecordDrawer from "@/components/meal/RecordDrawer.vue";
import { useRecordStore } from "@/stores/recordStore";
import { useUiStore } from "@/stores/uiStore";
import type { MealRecord } from "@/types/domain";

const recordStore = useRecordStore();
const ui = useUiStore();

onMounted(() => {
  recordStore.ensureLoaded();
});

const groupedRecords = computed(() => recordStore.groupedRecords.slice());
const drawerContext = computed(() => ui.drawer.context);
const currentRecord = computed(() => {
  const context = drawerContext.value;
  if (!context?.recordId) return null;
  return recordStore.getRecordById(context.recordId) ?? null;
});

function openRecord(record: MealRecord): void {
  ui.openDrawer({
    dateKey: record.dateKey,
    mealType: record.mealType,
    recordId: record.id,
  });
}

function askRemove(record: MealRecord): void {
  ui.openConfirm({
    title: "删除这条记录？",
    message: "删掉后这顿饭就不会留在历史里了。",
    confirmLabel: "删除",
    cancelLabel: "取消",
    onConfirm: () => {
      recordStore.removeRecord(record.id);
      ui.pushToast("已经删掉这条记录", "warning");
    },
  });
}

function closeDrawer(): void {
  ui.closeDrawer();
}
</script>
