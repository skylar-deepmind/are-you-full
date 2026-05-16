<template>
  <header
    class="bg-[var(--app-surface)] px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.9rem)] shadow-[var(--app-nav-shadow)]"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span
          class="grid size-11 place-items-center rounded-full bg-[var(--app-green-brand)] text-lg font-semibold text-white shadow-[var(--app-card-shadow)]"
        >
          撑
        </span>
        <div>
          <p
            class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--app-green-brand)]"
          >
            轻记录
          </p>
          <h1 class="text-lg font-semibold leading-tight">
            <slot name="title">今天要吃刚刚好</slot>
          </h1>
        </div>
      </div>
      <span
        class="rounded-full border border-[var(--app-green-brand)] px-3 py-1.5 text-xs font-semibold text-[var(--app-green-brand)]"
      >
        <slot name="badge">撑了么v0.3</slot>
      </span>
    </div>
  </header>
</template>
