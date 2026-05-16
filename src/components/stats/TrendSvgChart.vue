<template>
  <section class="app-card p-4">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-semibold text-[var(--app-green-brand)]">饱腹趋势</h3>
      <span class="text-xs text-[var(--app-muted)]">0 - 5</span>
    </div>

    <div class="mt-3 overflow-hidden rounded-[var(--app-card-radius)] bg-[var(--app-surface-soft)]">
      <svg viewBox="0 0 320 180" class="h-44 w-full" role="img" aria-label="饱腹趋势图">
        <g stroke="rgba(0,0,0,0.12)" stroke-width="1">
          <line v-for="line in gridLines" :key="line" x1="36" :y1="line" x2="300" :y2="line" />
        </g>
        <g fill="none" stroke="var(--app-accent-strong)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path :d="pathD" />
        </g>
        <g v-for="point in points" :key="point.dateKey">
          <circle :cx="point.cx" :cy="point.cy" r="4" fill="var(--app-accent-strong)" />
        </g>
        <g fill="var(--app-muted)" font-size="10">
          <text x="10" y="20">5</text>
          <text x="10" y="164">0</text>
          <text v-for="point in labelPoints" :key="point.dateKey" :x="point.cx - 18" y="176">
            {{ point.label }}
          </text>
        </g>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DailyTrendPoint } from "@/types/domain";

const props = defineProps<{
  points: DailyTrendPoint[];
}>();

const chartWidth = 320;
const chartHeight = 180;
const innerLeft = 36;
const innerRight = 300;
const innerTop = 24;
const innerBottom = 156;

const gridLines = [24, 57, 90, 123, 156];

const points = computed(() => {
  const count = Math.max(props.points.length, 1);
  const step = count === 1 ? 0 : (innerRight - innerLeft) / (count - 1);

  return props.points.map((point, index) => {
    const normalized = Math.max(0, Math.min(5, point.averageFullness));
    const cx = innerLeft + step * index;
    const cy = innerBottom - (normalized / 5) * (innerBottom - innerTop);
    return { ...point, cx, cy };
  });
});

const pathD = computed(() => {
  if (points.value.length === 0) return "";
  return points.value
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.cx} ${point.cy}`)
    .join(" ");
});

const labelPoints = computed(() =>
  points.value.filter((_, index) => index === 0 || index === points.value.length - 1 || index % 2 === 0),
);
</script>
