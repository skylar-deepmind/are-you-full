<template>
  <article class="app-card-soft px-4 py-3">
    <button class="block w-full text-left" @click="$emit('edit')">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-[var(--app-fg)]">{{ mealLabel }} · {{ record.time }}</p>
          <p class="mt-1 text-xs text-[var(--app-muted)]">{{ emoji }} {{ fullnessLabel }}</p>
        </div>
        <span class="rounded-full border border-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-[var(--app-accent-strong)]">编辑</span>
      </div>
      <p v-if="record.note" class="mt-2 text-sm leading-6 text-[var(--app-fg)]">{{ record.note }}</p>
    </button>

    <div class="mt-3 flex items-center justify-between">
      <span class="text-xs text-[var(--app-muted)]">{{ record.dateKey }}</span>
      <button class="rounded-full px-3 py-1 text-xs font-semibold text-[var(--app-danger)] transition active:scale-95" @click="$emit('remove')">
        删除
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FULLNESS_EMOJI, MEAL_OPTIONS } from "@/constants/meal";
import { getFullnessLabel } from "@/utils/stats";
import type { MealRecord } from "@/types/domain";

const props = defineProps<{
  record: MealRecord;
}>();

defineEmits<{
  edit: [];
  remove: [];
}>();

const mealLabel = computed(() => MEAL_OPTIONS.find((option) => option.value === props.record.mealType)?.label ?? "");
const fullnessLabel = computed(() => getFullnessLabel(props.record.fullness));
const emoji = computed(() => FULLNESS_EMOJI[props.record.fullness]);
</script>
