<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title?: string
  content: string
  hasInteractive?: boolean
}>()

defineEmits<{
  (e: 'interaction', data: unknown): void
}>()

const interacted = ref(false)
</script>

<template>
  <div class="concept-card" :class="{ 'concept-card--interacted': interacted }">
    <div class="concept-card__header">
      <span class="concept-card__icon">💡</span>
      <h3 v-if="title" class="concept-card__title">{{ title }}</h3>
    </div>
    <div class="concept-card__content" v-html="content"></div>
    <div v-if="hasInteractive" class="concept-card__interactive">
      <slot name="interactive"></slot>
    </div>
    <div class="concept-card__key-point">
      <span class="concept-card__key-icon">⭐</span>
      <span>关键发现</span>
    </div>
    <slot name="parent-notes"></slot>
  </div>
</template>

<style scoped>
.concept-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 2px solid var(--border-color);
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.concept-card--interacted {
  border-color: var(--color-success);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.concept-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.concept-card__icon {
  font-size: var(--text-2xl);
}

.concept-card__title {
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin: 0;
}

.concept-card__content {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.concept-card__content :deep(p) {
  margin-bottom: var(--space-3);
}

.concept-card__content :deep(strong) {
  color: var(--color-primary);
  font-weight: 600;
}

.concept-card__interactive {
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin: var(--space-4) 0;
}

.concept-card__key-point {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  font-weight: 600;
  margin-top: var(--space-4);
}

.concept-card__key-icon {
  font-size: var(--text-lg);
}
</style>
