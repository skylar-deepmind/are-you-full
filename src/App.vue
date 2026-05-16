<template>
  <div class="min-h-dvh bg-[var(--app-bg)] text-[var(--app-fg)]">
    <div class="app-container flex min-h-dvh flex-col">
      <AppShell />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppShell from "@/components/layout/AppShell.vue";
</script>
