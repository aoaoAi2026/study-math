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
      <span class="variant-card__badge">变式 {{ variantIndex }}</span>
      <h4 v-if="title" class="variant-card__title">{{ title }}</h4>
    </div>
    <div class="variant-card__stem" v-html="stem"></div>
    <div class="variant-card__actions">
      <button v-if="!showHint" class="variant-card__btn variant-card__btn--hint" @click="showHint = true">
        需要提示
      </button>
      <button class="variant-card__btn variant-card__btn--solve" @click="$emit('solve')">
        我来解答
      </button>
    </div>
    <slot name="hint"></slot>
  </div>
</template>

<style scoped>
.variant-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  border: 2px solid var(--border-color);
  transition: border-color var(--transition-fast);
}

.variant-card:hover {
  border-color: var(--color-warning);
}

.variant-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.variant-card__badge {
  background: var(--color-warning);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
}

.variant-card__title {
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin: 0;
}

.variant-card__stem {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.variant-card__actions {
  display: flex;
  gap: var(--space-3);
}

.variant-card__btn {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: 500;
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.variant-card__btn--hint {
  background: var(--bg-hover);
  color: var(--text-secondary);
  border: 1px dashed var(--border-color);
}

.variant-card__btn--hint:hover {
  border-color: var(--color-info);
  color: var(--color-info);
}

.variant-card__btn--solve {
  background: var(--color-warning);
  color: white;
}

.variant-card__btn--solve:hover {
  background: #d97706;
}
</style>
