<template>
  <Transition name="drawer">
    <div v-if="open" class="fixed inset-0 z-60 bg-black/30" @click.self="close">
      <div
        class="absolute inset-x-0 bottom-0 mx-auto w-full max-w-120 rounded-t-3xl border border-(--app-border) bg-(--app-surface) p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl"
      >
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <p class="text-xs text-(--app-muted)">{{ modeText }}</p>
            <h2 class="text-lg font-semibold">{{ mealLabel }}</h2>
          </div>
          <button class="btn btn-ghost btn-sm rounded-full" @click="close">
            关闭
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium">饱腹程度</label>
            <FullnessSelector v-model="draft.fullness" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium">时间</label>
            <input
              v-model="draft.time"
              type="time"
              class="input input-bordered w-full rounded-2xl bg-white"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium">备注</label>
            <textarea
              v-model="draft.note"
              maxlength="100"
              rows="4"
              class="textarea textarea-bordered w-full rounded-2xl bg-white"
              placeholder="吃得轻松一点，也可以写两句感受"
            />
            <p class="mt-1 text-right text-xs text-(--app-muted)">
              {{ draft.note.length }}/100
            </p>
          </div>
        </div>

        <div class="mt-5 flex gap-2">
          <button
            v-if="isEditing"
            class="btn btn-outline flex-1 rounded-2xl border-amber-300 text-amber-700"
            @click="requestDelete"
          >
            删除
          </button>
          <button
            class="btn btn-warning flex-1 rounded-2xl border-0 text-(--app-accent-strong)"
            @click="save"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import FullnessSelector from "@/components/meal/FullnessSelector.vue";
import { MEAL_OPTIONS } from "@/constants/meal";
import { formatLocalDate, formatTime } from "@/utils/date";
import { useRecordStore } from "@/stores/recordStore";
import { useUiStore } from "@/stores/uiStore";
import type { FullnessLevel, MealRecord, MealType } from "@/types/domain";

const props = defineProps<{
  open: boolean;
  record: MealRecord | null;
  dateKey: string;
  mealType: MealType;
}>();

const emit = defineEmits<{
  close: [];
}>();

const recordStore = useRecordStore();
const ui = useUiStore();

const draft = reactive({
  fullness: 2 as FullnessLevel,
  time: "12:00",
  note: "",
});

const isEditing = computed(() => props.record !== null);
const mealLabel = computed(
  () =>
    MEAL_OPTIONS.find((option) => option.value === props.mealType)?.label ?? "",
);
const modeText = computed(() =>
  isEditing.value ? "编辑这一餐" : "记一顿新的",
);

watch(
  () => [props.open, props.record, props.dateKey, props.mealType] as const,
  ([open, record]) => {
    if (!open) return;
    draft.fullness = record?.fullness ?? 2;
    draft.note = record?.note ?? "";
    draft.time = record?.time ?? formatTime(new Date());
  },
  { immediate: true },
);

function close(): void {
  emit("close");
}

function buildPayload(): {
  dateKey: string;
  mealType: MealType;
  fullness: FullnessLevel;
  time: string;
  note?: string;
  id?: string;
  createdAt?: string;
} {
  const currentDate = props.dateKey || formatLocalDate(new Date());

  return {
    id: props.record?.id,
    createdAt: props.record?.createdAt,
    dateKey: currentDate,
    mealType: props.mealType,
    fullness: draft.fullness,
    time: draft.time,
    note: draft.note.trim() || undefined,
  };
}

function save(): void {
  const payload = buildPayload();
  if (props.record) {
    recordStore.saveRecord(payload);
    ui.pushToast("已更新这一餐", "success");
  } else {
    recordStore.saveRecord(payload);
    ui.pushToast("已记下这一餐", "success");
  }
  close();
}

function requestDelete(): void {
  const currentId = props.record?.id;
  if (!currentId) return;
  ui.openConfirm({
    title: "要删掉这条记录吗",
    message: "删掉之后就不会保留这顿饭的饱腹感啦。",
    confirmLabel: "删掉",
    cancelLabel: "先不删",
    onConfirm: () => {
      recordStore.removeRecord(currentId);
      ui.pushToast("已经删掉了", "warning");
      close();
    },
  });
}
</script>
