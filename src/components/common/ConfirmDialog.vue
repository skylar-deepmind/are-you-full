<template>
  <div v-if="ui.confirmState.open" class="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 px-4 pb-4 pt-16 sm:items-center">
    <div class="app-card w-full max-w-md p-4 shadow-[var(--app-float-shadow)]">
      <h2 class="text-base font-semibold text-[var(--app-green-brand)]">{{ ui.confirmState.title }}</h2>
      <p class="mt-2 text-sm leading-6 text-[var(--app-muted)]">{{ ui.confirmState.message }}</p>
      <div class="mt-4 flex gap-2">
        <button class="app-pill-button flex-1 text-sm font-semibold text-[var(--app-muted)]" @click="ui.closeConfirm">
          {{ ui.confirmState.cancelLabel }}
        </button>
        <button class="app-pill-button flex-1 border border-[var(--app-danger)] text-sm font-semibold text-[var(--app-danger)]" @click="ui.confirm">
          {{ ui.confirmState.confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/uiStore";

const ui = useUiStore();
</script>
