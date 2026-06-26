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
      <div class="mistake-card__icon-wrap">
        <span class="mistake-card__icon">⚠️</span>
      </div>
      <div class="mistake-card__title-wrap">
        <span class="mistake-card__label">常见误区</span>
        <h2 v-if="title" class="mistake-card__title">{{ title }}</h2>
        <h2 v-else class="mistake-card__title">容易出错的地方</h2>
      </div>
    </div>

    <div class="mistake-card__list">
      <div
        v-for="(mistake, index) in mistakes"
        :key="index"
        class="mistake-card__item"
      >
        <div class="mistake-card__item-header">
          <span class="mistake-card__num">{{ index + 1 }}</span>
          <span class="mistake-card__layer" :class="`mistake-card__layer--${mistake.errorLayer.toLowerCase()}`">
            {{ mistake.errorLayer }}
          </span>
        </div>

        <div class="mistake-card__block mistake-card__block--error">
          <span class="mistake-card__block-label">❌ 错误做法</span>
          <p class="mistake-card__block-text">{{ mistake.mistake }}</p>
        </div>

        <div class="mistake-card__block mistake-card__block--reason">
          <span class="mistake-card__block-label">💭 原因</span>
          <p class="mistake-card__block-text">{{ mistake.reason }}</p>
        </div>

        <div class="mistake-card__block mistake-card__block--correct">
          <span class="mistake-card__block-label">✅ 正确做法</span>
          <p class="mistake-card__block-text">{{ mistake.correction }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mistake-card {
  background: var(--bg-card);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.mistake-card__header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px 32px 20px;
  background: linear-gradient(135deg, var(--card-red-bg) 0%, rgba(254, 226, 226, 0.8) 50%, var(--card-red-bg) 100%);
  border-bottom: 1px solid rgba(239, 68, 68, 0.15);
}

.mistake-card__icon-wrap {
  width: 60px;
  height: 60px;
  background: var(--bg-card);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  flex-shrink: 0;
}

.mistake-card__icon { font-size: 28px; }
.mistake-card__title-wrap { flex: 1; min-width: 0; }

.mistake-card__label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-danger);
  background: rgba(185, 28, 28, 0.12);
  padding: 4px 10px;
  border-radius: 8px;
  margin-bottom: 6px;
}

.mistake-card__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.mistake-card__list {
  padding: 24px 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mistake-card__item {
  background: var(--bg-hover);
  border-radius: 20px;
  padding: 20px 22px;
  border: 2px solid var(--border-color);
}

.mistake-card__item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.mistake-card__num {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-danger) 0%, #dc2626 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.25);
}

.mistake-card__layer {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.mistake-card__layer--l1 { background: linear-gradient(135deg, var(--color-primary), #2563eb); }
.mistake-card__layer--l2 { background: linear-gradient(135deg, var(--color-warning), #d97706); }
.mistake-card__layer--l3 { background: linear-gradient(135deg, var(--color-danger), #dc2626); }
.mistake-card__layer--l4 { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.mistake-card__block {
  padding: 12px 14px;
  margin-bottom: 10px;
  border-radius: 14px;
}
.mistake-card__block:last-child { margin-bottom: 0; }

.mistake-card__block--error {
  background: rgba(239, 68, 68, 0.1);
  border-left: 4px solid var(--color-danger);
}
.mistake-card__block--reason {
  background: rgba(245, 158, 11, 0.1);
  border-left: 4px solid var(--color-warning);
}
.mistake-card__block--correct {
  background: rgba(16, 185, 129, 0.1);
  border-left: 4px solid var(--color-success);
}

.mistake-card__block-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.mistake-card__block--error .mistake-card__block-label { color: var(--color-danger); }
.mistake-card__block--reason .mistake-card__block-label { color: var(--color-warning); }
.mistake-card__block--correct .mistake-card__block-label { color: var(--color-success); }

.mistake-card__block-text {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.7;
  color: var(--text-primary);
  margin: 0;
}

@media (max-width: 640px) {
  .mistake-card__header { padding: 22px 22px 16px; }
  .mistake-card__list { padding: 20px 22px 22px; }
  .mistake-card__icon-wrap { width: 52px; height: 52px; }
  .mistake-card__title { font-size: 18px; }
  .mistake-card__item { padding: 16px; }
}
</style>
