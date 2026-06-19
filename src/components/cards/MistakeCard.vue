<script setup lang="ts">
import type { CommonMistake } from '@/types/exercise'

defineProps<{
  title?: string
  mistakes: CommonMistake[]
}>()
</script>

<template>
  <div class="mistake-card">
    <div class="mistake-card__header">
      <span class="mistake-card__icon">⚠️</span>
      <h3 v-if="title" class="mistake-card__title">{{ title }}</h3>
      <span v-else class="mistake-card__title">常见错误</span>
    </div>

    <div class="mistake-card__list">
      <div
        v-for="(mistake, index) in mistakes"
        :key="index"
        class="mistake-card__item"
      >
        <div class="mistake-card__item-header">
          <span class="mistake-card__error-label">错误</span>
          <span class="mistake-card__layer" :class="`mistake-card__layer--${mistake.errorLayer.toLowerCase()}`">
            {{ mistake.errorLayer }}
          </span>
        </div>
        <p class="mistake-card__error-text">{{ mistake.mistake }}</p>

        <div class="mistake-card__reason">
          <span class="mistake-card__reason-icon">❓</span>
          <span>原因：{{ mistake.reason }}</span>
        </div>

        <div class="mistake-card__correction">
          <span class="mistake-card__correction-icon">✓</span>
          <span>纠正：{{ mistake.correction }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mistake-card {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 2px solid #fca5a5;
}

.mistake-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.mistake-card__icon {
  font-size: var(--text-2xl);
}

.mistake-card__title {
  font-size: var(--text-xl);
  color: #991b1b;
  margin: 0;
}

.mistake-card__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.mistake-card__item {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.mistake-card__item-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.mistake-card__error-label {
  font-weight: 600;
  color: #991b1b;
  font-size: var(--text-sm);
}

.mistake-card__layer {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  color: white;
}

.mistake-card__layer--l1 { background: #3b82f6; }
.mistake-card__layer--l2 { background: #f59e0b; }
.mistake-card__layer--l3 { background: #ef4444; }
.mistake-card__layer--l4 { background: #8b5cf6; }

.mistake-card__error-text {
  color: #7f1d1d;
  font-weight: 500;
  margin: 0 0 var(--space-3);
}

.mistake-card__reason,
.mistake-card__correction {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-sm);
  margin-bottom: var(--space-2);
}

.mistake-card__reason {
  color: #92400e;
}

.mistake-card__correction {
  color: #065f46;
  font-weight: 500;
}

.mistake-card__reason-icon,
.mistake-card__correction-icon {
  flex-shrink: 0;
}
</style>
