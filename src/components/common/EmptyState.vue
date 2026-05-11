<template>
  <section class="rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-6 text-center">
    <p class="text-sm font-medium text-[var(--app-fg)]">
      <slot name="title" />
    </p>
    <p class="mt-1 text-sm leading-6 text-[var(--app-muted)]">
      <slot />
    </p>
  </section>
</template>
