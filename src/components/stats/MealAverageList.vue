<template>
  <section class="rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
    <h3 class="text-sm font-semibold">各餐平均饱腹度</h3>
    <div class="mt-3 space-y-3">
      <div v-for="item in items" :key="item.label" class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-medium">{{ item.label }}</p>
          <p class="text-xs text-[var(--app-muted)]">{{ item.count }} 条记录</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-2 w-28 overflow-hidden rounded-full bg-neutral-100">
            <div class="h-full rounded-full bg-[var(--app-accent-soft)]" :style="{ width: `${(item.average / 5) * 100}%` }" />
          </div>
          <span class="w-10 text-right text-sm font-semibold text-[var(--app-accent-strong)]">
            {{ item.average.toFixed(1) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ label: string; average: number; count: number }>;
}>();
</script>
