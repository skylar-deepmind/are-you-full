import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { DrawerContext } from "@/types/domain";

export interface ToastMessage {
  id: string;
  message: string;
  tone?: "neutral" | "success" | "warning";
}

export interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (() => void) | null;
}

export interface DrawerState {
  open: boolean;
  context: DrawerContext | null;
}

export const useUiStore = defineStore("ui", () => {
  const drawer = ref<DrawerState>({
    open: false,
    context: null,
  });
  const toastQueue = ref<ToastMessage[]>([]);
  const confirmState = ref<ConfirmState>({
    open: false,
    title: "",
    message: "",
    confirmLabel: "确认",
    cancelLabel: "取消",
    onConfirm: null,
  });

  const activeToast = computed(() => toastQueue.value[0] ?? null);
  const drawerOpen = computed(() => drawer.value.open);

  function openDrawer(context: DrawerContext): void {
    drawer.value = {
      open: true,
      context,
    };
  }

  function closeDrawer(): void {
    drawer.value = {
      open: false,
      context: null,
    };
  }

  function toggleDrawer(open: boolean): void {
    drawer.value = open
      ? { ...drawer.value, open: true }
      : { open: false, context: null };
  }

  function pushToast(
    message: string,
    tone: ToastMessage["tone"] = "neutral",
  ): void {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    toastQueue.value = [...toastQueue.value, { id, message, tone }];

    // Auto-dismiss after 1s
    setTimeout(() => {
      dismissToast(id);
    }, 1000);
  }

  function dismissToast(id?: string): void {
    if (!id) {
      toastQueue.value = toastQueue.value.slice(1);
      return;
    }
    toastQueue.value = toastQueue.value.filter((toast) => toast.id !== id);
  }

  function openConfirm(
    options: Omit<ConfirmState, "open" | "onConfirm"> & {
      onConfirm: () => void;
    },
  ): void {
    confirmState.value = {
      open: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel,
      cancelLabel: options.cancelLabel,
      onConfirm: options.onConfirm,
    };
  }

  function closeConfirm(): void {
    confirmState.value = {
      open: false,
      title: "",
      message: "",
      confirmLabel: "确认",
      cancelLabel: "取消",
      onConfirm: null,
    };
  }

  function confirm(): void {
    confirmState.value.onConfirm?.();
    closeConfirm();
  }

  return {
    drawer,
    drawerOpen,
    activeToast,
    toastQueue,
    confirmState,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    pushToast,
    dismissToast,
    openConfirm,
    closeConfirm,
    confirm,
  };
});
