<template>
  <div class="flex min-h-dvh flex-col bg-(--app-bg)">
    <AppHeader class="fixed inset-x-0 top-0 z-50 md:static" />

    <main
      class="px-4 py-4 pt-[calc(env(safe-area-inset-top)+5.25rem)] pb-[calc(env(safe-area-inset-bottom)+5.5rem)] md:pt-4 md:pb-4"
    >
      <RouterView />
    </main>

    <BottomNav class="fixed inset-x-0 bottom-0 z-50 md:static" :tabs="tabs" />

    <ToastHost />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import BottomNav from "@/components/layout/BottomNav.vue";
import ToastHost from "@/components/common/ToastHost.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

const tabs = [
  { to: "/", label: "今日", icon: "◌" },
  { to: "/history", label: "历史", icon: "☾" },
  { to: "/stats", label: "统计", icon: "≈" },
  { to: "/settings", label: "设置", icon: "⚙" },
];
</script>
