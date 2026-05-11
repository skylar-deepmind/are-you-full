import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/TodayView.vue"),
    },
    {
      path: "/history",
      name: "history",
      component: () => import("@/views/HistoryView.vue"),
    },
    {
      path: "/stats",
      name: "stats",
      component: () => import("@/views/StatsView.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/SettingsView.vue"),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
