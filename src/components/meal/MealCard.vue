<template>
  <button
    class="flex w-full flex-col gap-4 rounded-[var(--app-card-radius)] border p-4 text-left transition active:scale-[0.99]"
    :class="cardClass"
    @click="$emit('select')"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-base font-semibold text-[var(--app-green-brand)]">{{ title }}</p>
        <p class="mt-1 text-xs text-[var(--app-muted)]">{{ subtitle }}</p>
      </div>
      <span class="rounded-full border px-3 py-1 text-xs font-semibold" :class="statusClass">
        {{ record ? `饱腹 ${record.fullness}/5` : "未记录" }}
      </span>
    </div>

    <div class="flex items-end justify-between gap-3">
      <div>
        <p class="text-2xl font-semibold leading-none text-[var(--app-fg)]">
          {{ record ? fullnessLabel : "—" }}
        </p>
        <p class="mt-2 text-xs text-[var(--app-muted)]">{{ record?.note || emptyHint }}</p>
      </div>
      <span class="grid size-10 place-items-center rounded-full bg-[var(--app-accent-strong)] text-xl leading-none text-white shadow-[var(--app-float-shadow)]">+</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FULLNESS_OPTIONS } from "@/constants/meal";
import type { MealRecord } from "@/types/domain";

const props = defineProps<{
  title: string;
  subtitle: string;
  emptyHint: string;
  record?: MealRecord | null;
}>();

defineEmits<{
  select: [];
}>();

const fullnessLabel = computed(() => FULLNESS_OPTIONS.find((option) => option.value === props.record?.fullness)?.label ?? "—");

const cardClass = computed(() =>
  props.record
    ? "border-[var(--app-accent-strong)] bg-[var(--app-surface)] shadow-[var(--app-card-shadow)]"
    : "border-[var(--app-border)] bg-[var(--app-surface)] shadow-[var(--app-card-shadow)]",
);

const statusClass = computed(() =>
  props.record
    ? "border-[var(--app-accent-strong)] bg-[var(--app-accent-soft)] text-[var(--app-green-brand)]"
    : "border-[var(--app-border)] bg-[var(--app-surface-soft)] text-[var(--app-muted)]",
);
</script>
