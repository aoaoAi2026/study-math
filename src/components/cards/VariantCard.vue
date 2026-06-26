<script setup lang="ts">
defineProps<{
  title?: string
  stem: string
  variantIndex?: number
}>()

defineEmits<{
  (e: 'solve'): void
}>()

const showHint = defineModel('showHint', { default: false })
</script>

<template>
  <div class="variant-card">
    <div class="variant-card__header">
      <div class="variant-card__icon-wrap">
        <span class="variant-card__icon">🔄</span>
      </div>
      <div class="variant-card__title-wrap">
        <span class="variant-card__label">变式练习 {{ variantIndex ? `#${variantIndex}` : '' }}</span>
        <h2 v-if="title" class="variant-card__title">{{ title }}</h2>
      </div>
    </div>

    <div class="variant-card__stem">
      <span class="variant-card__stem-badge">题目</span>
      <p class="variant-card__stem-text" v-html="stem"></p>
    </div>

    <div class="variant-card__actions" v-if="!showHint">
      <button class="variant-card__btn variant-card__btn--hint" @click="showHint = true">
        💡 需要提示
      </button>
      <button class="variant-card__btn variant-card__btn--solve" @click="$emit('solve')">
        ✍️ 我来解答
      </button>
    </div>

    <slot name="hint"></slot>
  </div>
</template>

<style scoped>
.variant-card {
  background: var(--bg-card);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.variant-card__header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px 32px 20px;
  background: linear-gradient(135deg, var(--card-yellow-bg) 0%, rgba(253, 227, 138, 0.8) 50%, var(--card-yellow-bg) 100%);
  border-bottom: 1px solid rgba(245, 158, 11, 0.15);
}

.variant-card__icon-wrap {
  width: 60px;
  height: 60px;
  background: var(--bg-card);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  flex-shrink: 0;
}

.variant-card__icon { font-size: 28px; }
.variant-card__title-wrap { flex: 1; min-width: 0; }

.variant-card__label {
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

.variant-card__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.variant-card__stem {
  padding: 24px 32px;
  background: var(--bg-hover);
  border-bottom: 1px solid var(--border-color);
}

.variant-card__stem-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
}

.variant-card__stem-text {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.7;
  margin: 0;
}

.variant-card__stem-text :deep(strong) { color: var(--card-yellow-text); font-weight: 700; }
.variant-card__stem-text :deep(p) { margin: 0 0 12px; }
.variant-card__stem-text :deep(p:last-child) { margin-bottom: 0; }

.variant-card__actions {
  display: flex;
  gap: 16px;
  padding: 24px 32px 28px;
}

.variant-card__btn {
  flex: 1;
  padding: 14px 20px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  font-family: inherit;
}

.variant-card__btn--hint {
  background: var(--card-yellow-bg);
  color: var(--card-yellow-text);
  border: 2px solid rgba(245, 158, 11, 0.3);
}
.variant-card__btn--hint:hover {
  background: rgba(253, 227, 138, 0.8);
  border-color: var(--color-warning);
}

.variant-card__btn--solve {
  background: linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}
.variant-card__btn--solve:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
}

@media (max-width: 640px) {
  .variant-card__header { padding: 22px 22px 16px; }
  .variant-card__stem { padding: 20px 22px; }
  .variant-card__actions { padding: 20px 22px 22px; }
  .variant-card__icon-wrap { width: 52px; height: 52px; }
  .variant-card__title { font-size: 18px; }
  .variant-card__actions { flex-direction: column; }
}
</style>
