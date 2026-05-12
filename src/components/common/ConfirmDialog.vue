<template>
  <div v-if="ui.confirmState.open" class="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 px-4 pb-4 pt-16 sm:items-center">
    <div class="w-full max-w-md rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-xl">
      <h2 class="text-base font-semibold">{{ ui.confirmState.title }}</h2>
      <p class="mt-2 text-sm leading-6 text-[var(--app-muted)]">{{ ui.confirmState.message }}</p>
      <div class="mt-4 flex gap-2">
        <button class="btn btn-ghost flex-1 rounded-2xl" @click="ui.closeConfirm">
          {{ ui.confirmState.cancelLabel }}
        </button>
        <button class="btn btn-warning flex-1 rounded-2xl border-0 text-[var(--app-accent-strong)]" @click="ui.confirm">
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
