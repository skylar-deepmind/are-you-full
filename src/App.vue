<template>
  <div class="min-h-dvh bg-[var(--app-bg)] text-[var(--app-fg)]">
    <div class="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
      <AppShell />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppShell from "@/components/layout/AppShell.vue";
</script>
