<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const wrongBook = ref([
  {
    id: '1',
    stem: '小明有30个苹果，小红的苹果是小明的4倍，小红有多少个？',
    wrongAnswer: '30 × 4 = 120',
    correctAnswer: '30 × 4 = 120（个）',
    knowledgeId: 'sum-multiple',
    errorLayer: 'L2'
  },
  {
    id: '2',
    stem: '鸡和兔共10只，脚共28只，问鸡和兔各几只？',
    wrongAnswer: '鸡5只，兔5只',
    correctAnswer: '鸡6只，兔4只',
    knowledgeId: 'chicken-rabbit',
    errorLayer: 'L3'
  }
])
</script>

<template>
  <AppLayout>
    <div class="wrong-book">
      <h1>📝 错题本</h1>
      <p class="wrong-book__count">共 {{ wrongBook.length }} 道错题</p>

      <div class="wrong-book__list">
        <div v-for="item in wrongBook" :key="item.id" class="wrong-book__item">
          <div class="wrong-book__question">{{ item.stem }}</div>
          <div class="wrong-book__answers">
            <div class="wrong-book__answer wrong-book__answer--wrong">
              <span>错误答案</span>
              <span>{{ item.wrongAnswer }}</span>
            </div>
            <div class="wrong-book__answer wrong-book__answer--correct">
              <span>正确答案</span>
              <span>{{ item.correctAnswer }}</span>
            </div>
          </div>
          <div class="wrong-book__meta">
            <span class="wrong-book__layer" :class="`wrong-book__layer--${item.errorLayer.toLowerCase()}`">
              {{ item.errorLayer }}
            </span>
            <button class="wrong-book__review">复习</button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.wrong-book {
  max-width: 600px;
  margin: 0 auto;
}

.wrong-book h1 {
  text-align: center;
  margin-bottom: var(--space-2);
}

.wrong-book__count {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.wrong-book__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.wrong-book__item {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.wrong-book__question {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.wrong-book__answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.wrong-book__answer {
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
}

.wrong-book__answer span:first-child {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}

.wrong-book__answer--wrong {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.wrong-book__answer--correct {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.wrong-book__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrong-book__layer {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: white;
}

.wrong-book__layer--l1 { background: #3b82f6; }
.wrong-book__layer--l2 { background: #f59e0b; }
.wrong-book__layer--l3 { background: #ef4444; }
.wrong-book__layer--l4 { background: #8b5cf6; }

.wrong-book__review {
  padding: var(--space-1) var(--space-3);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
}
</style>
