<template>
  <button
    class="flex w-full flex-col gap-3 rounded-[1.25rem] border p-4 text-left transition active:scale-[0.99]"
    :class="cardClass"
    @click="$emit('select')"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-medium">{{ title }}</p>
        <p class="mt-1 text-xs text-[var(--app-muted)]">{{ subtitle }}</p>
      </div>
      <span class="rounded-full px-3 py-1 text-xs font-medium" :class="statusClass">
        {{ record ? `饱腹 ${record.fullness}/5` : "未记录" }}
      </span>
    </div>

    <div class="flex items-end justify-between gap-3">
      <div>
        <p class="text-2xl font-semibold leading-none text-[var(--app-accent-strong)]">
          {{ record ? fullnessLabel : "—" }}
        </p>
        <p class="mt-2 text-xs text-[var(--app-muted)]">{{ record?.note || emptyHint }}</p>
      </div>
      <span class="text-lg leading-none text-[var(--app-accent-strong)]">+</span>
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
    ? "border-[var(--app-accent-soft)] bg-[var(--app-surface)] shadow-[0_10px_24px_rgba(184,145,93,0.08)]"
    : "border-[var(--app-border)] bg-[var(--app-surface)]",
);

const statusClass = computed(() =>
  props.record ? "bg-[var(--app-accent-soft)] text-[var(--app-accent-strong)]" : "bg-neutral-100 text-[var(--app-muted)]",
);
</script>
