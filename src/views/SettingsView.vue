<template>
  <div class="space-y-4">
    <section
      class="rounded-[1.25rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
    >
      <h2 class="text-lg font-semibold">设置</h2>
      <p class="mt-1 text-sm text-[var(--app-muted)]">
        所有数据只保存在你的设备里，不会上云。
      </p>

      <div class="mt-4 space-y-3 text-sm leading-6 text-[var(--app-fg)]">
        <div class="rounded-2xl bg-white px-4 py-3">
          <p class="font-medium">本地隐私说明</p>
          <p class="mt-1 text-[var(--app-muted)]">
            「撑了么」只会把记录存在本机浏览器里，默认不会创建账号，也不会上传你的饮食记录。
          </p>
        </div>

        <div class="rounded-2xl bg-white px-4 py-3">
          <p class="font-medium">导出 JSON</p>
          <p class="mt-1 text-[var(--app-muted)]">
            可以把当前所有记录导成备份文件，方便留存或迁移。
          </p>
        </div>

        <div class="rounded-2xl bg-white px-4 py-3">
          <p class="font-medium">导入 JSON</p>
          <p class="mt-1 text-[var(--app-muted)]">
            导入时会校验 app、version 和 records，成功后以文件内容覆盖本地数据。
          </p>
        </div>

        <div class="rounded-2xl bg-white px-4 py-3">
          <p class="font-medium">添加到主屏幕</p>
          <ol class="mt-1 list-decimal space-y-1 pl-5 text-[var(--app-muted)]">
            <li>用 Safari 打开「撑了么」</li>
            <li>点击底部分享按钮</li>
            <li>选择「添加到主屏幕」</li>
            <li>以后就可以像 App 一样打开</li>
          </ol>
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-3">
        <button
          class="btn btn-outline rounded-2xl border-[var(--app-border)]"
          @click="exportJson"
        >
          导出 JSON
        </button>
        <label class="btn btn-outline rounded-2xl border-[var(--app-border)]">
          导入 JSON
          <input
            class="hidden"
            type="file"
            accept="application/json"
            @change="importJson"
          />
        </label>
        <button
          class="btn btn-ghost rounded-2xl text-amber-700"
          @click="clearAll"
        >
          清空全部数据
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRecordStore } from "@/stores/recordStore";
import { useUiStore } from "@/stores/uiStore";

const recordStore = useRecordStore();
const ui = useUiStore();

function exportJson(): void {
  const data = recordStore.exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fileName = `chenglema-backup-${data.exportedAt.slice(0, 10)}.json`;
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  ui.pushToast("已导出 JSON 备份", "success");
}

async function importJson(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const result = recordStore.importData(JSON.parse(text));
    ui.pushToast(result.message, result.ok ? "success" : "warning");
  } catch {
    ui.pushToast("导入失败，文件内容不是有效 JSON。", "warning");
  }

  target.value = "";
}

function clearAll(): void {
  ui.openConfirm({
    title: "清空全部数据？",
    message: "这会删除本地所有记录，操作后不能恢复。",
    confirmLabel: "清空",
    cancelLabel: "先不",
    onConfirm: () => {
      recordStore.clearRecords();
      ui.pushToast("已经清空全部数据", "warning");
    },
  });
}
</script>
