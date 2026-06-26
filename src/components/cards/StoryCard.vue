<script setup lang="ts">
defineProps<{ title?: string; content: string }>()
</script>

<template>
  <div class="card-story">
    <div class="card-story__header">
      <div class="card-story__icon-wrap">
        <span class="card-story__icon">📖</span>
      </div>
      <div class="card-story__title-wrap">
        <span class="card-story__label">故事引入</span>
        <h2 class="card-story__title" v-if="title">{{ title }}</h2>
      </div>
    </div>
    <div class="card-story__body" v-html="content"></div>
  </div>
</template>

<style scoped>
.card-story {
  background: var(--bg-card);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.card-story__header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px 32px 20px;
  background: linear-gradient(135deg, var(--card-yellow-bg) 0%, rgba(253, 227, 138, 0.8) 50%, var(--card-yellow-bg) 100%);
  border-bottom: 1px solid rgba(234, 179, 8, 0.15);
}

.card-story__icon-wrap {
  width: 60px;
  height: 60px;
  background: var(--bg-card);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(180, 83, 9, 0.15);
  flex-shrink: 0;
}

.card-story__icon { font-size: 28px; }

.card-story__title-wrap { flex: 1; min-width: 0; }

.card-story__label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--card-yellow-text);
  background: rgba(180, 83, 9, 0.12);
  padding: 4px 10px;
  border-radius: 8px;
  margin-bottom: 6px;
}

.card-story__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--card-yellow-text);
  margin: 0;
  line-height: 1.3;
}

.card-story__body {
  padding: 28px 32px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-primary);
}

.card-story__body :deep(p) {
  margin: 0 0 16px;
}
.card-story__body :deep(p:last-child) { margin-bottom: 0; }

.card-story__body :deep(h4) {
  font-size: 17px;
  color: var(--card-yellow-text);
  margin: 24px 0 12px;
  font-weight: 700;
}
.card-story__body :deep(h5) {
  font-size: 15px;
  color: var(--card-yellow-text);
  margin: 20px 0 10px;
  font-weight: 700;
}

.card-story__body :deep(strong) {
  color: var(--card-yellow-text);
  font-weight: 700;
}

.card-story__body :deep(ul),
.card-story__body :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.card-story__body :deep(li) {
  margin-bottom: 8px;
  line-height: 1.7;
}

.card-story__body :deep(hr) {
  border: none;
  border-top: 1px dashed rgba(180, 83, 9, 0.15);
  margin: 28px 0;
}

.card-story__body :deep(code) {
  background: var(--card-yellow-bg);
  color: var(--card-yellow-text);
  padding: 2px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9em;
}

@media (max-width: 640px) {
  .card-story__header { padding: 22px 22px 16px; }
  .card-story__body { padding: 22px; font-size: 14px; }
  .card-story__icon-wrap { width: 52px; height: 52px; }
  .card-story__title { font-size: 18px; }
}
</style>
