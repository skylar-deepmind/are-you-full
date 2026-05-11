<template>
  <section class="rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
    <p class="text-xs font-medium text-[var(--app-muted)]">{{ label }}</p>
    <div class="mt-2 flex items-end justify-between gap-3">
      <p class="text-2xl font-semibold text-[var(--app-accent-strong)]">{{ value }}</p>
      <span v-if="hint" class="text-xs text-[var(--app-muted)]">{{ hint }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  hint?: string;
}>();
</script>
