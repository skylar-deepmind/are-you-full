<template>
  <div class="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
    <TransitionGroup name="toast">
      <div
        v-for="toast in ui.toastQueue"
        :key="toast.id"
        class="pointer-events-auto mb-2 max-w-[480px] rounded-[var(--app-card-radius)] border px-4 py-3 text-sm shadow-[var(--app-card-shadow)]"
        :class="toneClasses[toast.tone ?? 'neutral']"
        @click="ui.dismissToast(toast.id)"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/uiStore";

const ui = useUiStore();

const toneClasses = {
  neutral: "border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-fg)]",
  success: "border-[var(--app-accent-strong)] bg-[var(--app-accent-soft)] text-[var(--app-green-brand)]",
  warning: "border-[var(--app-gold)] bg-[#faf6ee] text-[var(--app-green-house)]",
} as const;
</script>
