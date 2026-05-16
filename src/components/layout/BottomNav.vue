<template>
  <nav
    class="bg-[var(--app-surface)] px-3 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-2 shadow-[var(--app-nav-shadow)]"
  >
    <div class="grid grid-cols-4 gap-2">
      <RouterLink
        v-for="item in tabs"
        :key="item.to"
        :to="item.to"
        class="app-pill-button flex h-auto min-h-0 flex-col items-center justify-center gap-1 border border-transparent px-2 py-2 text-[11px] font-semibold text-[var(--app-muted)] outline-none focus-visible:border-[var(--app-accent-strong)] focus-visible:ring-2 focus-visible:ring-[var(--app-accent-soft)]"
        :class="{
          'border-[var(--app-accent-strong)] bg-[var(--app-accent-soft)] text-[var(--app-green-brand)]':
            route.path === item.to,
        }"
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
