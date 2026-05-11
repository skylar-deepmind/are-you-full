<template>
  <nav class="border-t border-[var(--app-border)] bg-[var(--app-surface)]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur">
    <div class="grid grid-cols-4 gap-2">
      <RouterLink
        v-for="item in tabs"
        :key="item.to"
        :to="item.to"
        class="btn btn-ghost flex h-auto min-h-0 flex-col gap-1 rounded-2xl border-0 px-2 py-2 text-[11px] font-medium normal-case text-[var(--app-muted)]"
        :class="{ 'bg-[var(--app-accent-soft)] text-[var(--app-accent-strong)]': route.path === item.to }"
      >
        <span class="text-base leading-none">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

defineProps<{
  tabs: Array<{ to: string; label: string; icon: string }>;
}>();
</script>
