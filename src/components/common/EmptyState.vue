<template>
  <section class="rounded-[var(--app-card-radius)] border border-dashed border-[var(--app-green-brand)] bg-[var(--app-accent-soft)]/40 px-4 py-7 text-center">
    <p class="text-sm font-semibold text-[var(--app-green-brand)]">
      <slot name="title" />
    </p>
    <p class="mt-1 text-sm leading-6 text-[var(--app-muted)]">
      <slot />
    </p>
  </section>
</template>
