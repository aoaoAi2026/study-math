<script setup lang="ts">
defineProps<{ title?: string; content: string }>()
</script>

<template>
  <div class="card-concept">
    <div class="card-concept__header">
      <div class="card-concept__icon-wrap">
        <span class="card-concept__icon">💡</span>
      </div>
      <div class="card-concept__title-wrap">
        <span class="card-concept__label">概念讲解</span>
        <h2 class="card-concept__title" v-if="title">{{ title }}</h2>
      </div>
    </div>
    <div class="card-concept__body" v-html="content"></div>
  </div>
</template>

<style scoped>
.card-concept {
  background: var(--bg-card);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.card-concept__header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px 32px 20px;
  background: linear-gradient(135deg, var(--card-blue-bg) 0%, rgba(199, 210, 254, 0.8) 50%, var(--card-blue-bg) 100%);
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
}

.card-concept__icon-wrap {
  width: 60px;
  height: 60px;
  background: var(--bg-card);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  flex-shrink: 0;
}

.card-concept__icon { font-size: 28px; }

.card-concept__title-wrap { flex: 1; min-width: 0; }

.card-concept__label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: 4px 10px;
  border-radius: 8px;
  margin-bottom: 6px;
}

.card-concept__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.card-concept__body {
  padding: 28px 32px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-primary);
}

.card-concept__body :deep(p) {
  margin: 0 0 16px;
}
.card-concept__body :deep(p:last-child) { margin-bottom: 0; }

.card-concept__body :deep(h4) {
  font-size: 17px;
  color: var(--color-primary);
  margin: 24px 0 12px;
  font-weight: 700;
  padding-left: 12px;
  border-left: 4px solid var(--card-blue-bg);
}
.card-concept__body :deep(h5) {
  font-size: 15px;
  color: var(--color-primary);
  margin: 20px 0 10px;
  font-weight: 700;
}

.card-concept__body :deep(strong) {
  color: var(--color-primary);
  font-weight: 700;
}

.card-concept__body :deep(ul),
.card-concept__body :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.card-concept__body :deep(li) {
  margin-bottom: 8px;
  line-height: 1.7;
}

.card-concept__body :deep(hr) {
  border: none;
  border-top: 1px dashed rgba(99, 102, 241, 0.2);
  margin: 28px 0;
}

.card-concept__body :deep(code) {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  padding: 2px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9em;
}

@media (max-width: 640px) {
  .card-concept__header { padding: 22px 22px 16px; }
  .card-concept__body { padding: 22px; font-size: 14px; }
  .card-concept__icon-wrap { width: 52px; height: 52px; }
  .card-concept__title { font-size: 18px; }
}
</style>
