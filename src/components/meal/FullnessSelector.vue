<template>
  <div class="grid grid-cols-5 gap-2">
    <button
      v-for="option in FULLNESS_OPTIONS"
      :key="option.value"
      type="button"
      class="rounded-2xl border px-2 py-3 text-center transition"
      :class="option.value === modelValue ? activeClass : inactiveClass"
      @click="select(option.value)"
    >
      <div class="text-sm font-semibold">{{ option.value }}</div>
      <div class="mt-1 text-[11px]">{{ option.label }}</div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { FULLNESS_OPTIONS } from "@/constants/meal";
import type { FullnessLevel } from "@/types/domain";

defineProps<{
  modelValue: FullnessLevel;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: FullnessLevel];
}>();

const activeClass = "border-[var(--app-accent-strong)] bg-[var(--app-accent-soft)] text-[var(--app-accent-strong)]";
const inactiveClass = "border-[var(--app-border)] bg-white text-[var(--app-muted)]";

function select(value: FullnessLevel): void {
  emit("update:modelValue", value);
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(8);
  }
}
</script>
