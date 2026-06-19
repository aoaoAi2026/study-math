<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title?: string
  content: string
}>()

const showTip = ref(false)
</script>

<template>
  <div class="story-card">
    <div class="story-card__icon">📖</div>
    <h3 v-if="title" class="story-card__title">{{ title }}</h3>
    <div class="story-card__content" v-html="content"></div>
    <div class="story-card__question">
      <div class="story-card__question-icon">💭</div>
      <p class="story-card__question-text">
        思考一下：你能解决这个故事中的问题吗？
      </p>
    </div>
    <button class="story-card__btn" @click="$emit('continue')">
      开始探索 →
    </button>
  </div>
</template>

<style scoped>
.story-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 2px solid #fcd34d;
}

.story-card__icon {
  font-size: 48px;
  margin-bottom: var(--space-3);
}

.story-card__title {
  font-size: var(--text-xl);
  color: #92400e;
  margin-bottom: var(--space-3);
}

.story-card__content {
  color: #78350f;
  line-height: var(--leading-relaxed);
  font-size: var(--text-base);
}

.story-card__content :deep(p) {
  margin-bottom: var(--space-3);
}

.story-card__question {
  background: rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin: var(--space-4) 0;
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.story-card__question-icon {
  font-size: var(--text-xl);
}

.story-card__question-text {
  color: #92400e;
  font-weight: 500;
  margin: 0;
}

.story-card__btn {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-base);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.story-card__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}
</style>
