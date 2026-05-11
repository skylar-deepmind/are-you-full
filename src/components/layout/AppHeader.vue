<template>
  <header
    class="border-b border-[var(--app-border)] bg-[var(--app-surface)]/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-xs font-medium tracking-wide text-[var(--app-muted)]">
          轻记录
        </p>
        <h1 class="text-lg font-semibold leading-tight">
          <slot name="title">今天吃得刚刚好</slot>
        </h1>
      </div>
      <span
        class="badge badge-soft badge-warning border-0 px-3 py-3 text-xs font-medium text-[var(--app-accent-strong)]"
      >
        <slot name="badge">撑了么v0.1</slot>
      </span>
    </div>
  </header>
</template>
