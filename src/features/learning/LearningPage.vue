<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { listTopics } from '@/services/contentLoader'
import type { TopicIndex } from '@/types/content'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()

const topics = ref<TopicIndex[]>(listTopics())
const selectedGrade = ref<number | 'all'>('all')
const selectedCategory = ref<'all' | 'basic' | 'olympiad'>('all')

const gradeOptions = [
  { value: 'all' as const, label: '全部' },
  { value: 1, label: '一年级' },
  { value: 2, label: '二年级' },
  { value: 3, label: '三年级' },
  { value: 4, label: '四年级' },
  { value: 5, label: '五年级' },
  { value: 6, label: '六年级' }
]

const categoryOptions = [
  { value: 'all' as const, label: '全部' },
  { value: 'basic' as const, label: '校内基础' },
  { value: 'olympiad' as const, label: '奥数专题' }
]

const filteredTopics = computed(() => {
  return topics.value.filter(t => {
    const gradeOk = selectedGrade.value === 'all' || t.grade === selectedGrade.value
    const categoryOk = selectedCategory.value === 'all' || t.category === selectedCategory.value
    return gradeOk && categoryOk
  })
})

function goToTopic(id: string) {
  router.push(`/learning/topic/${id}`)
}

function difficultyStars(d: number) {
  return '⭐'.repeat(d)
}

function categoryLabel(c: 'basic' | 'olympiad') {
  return c === 'basic' ? '基础' : '奥数'
}

function gradeLabel(g: number) {
  return `${g}年级`
}
</script>

<template>
  <AppLayout>
    <div class="learning-page">
      <header class="lp-header">
        <h1>📚 专题学习</h1>
        <p class="muted">选择一个专题，开启数学探索之旅</p>
      </header>

      <!-- 年级选择 -->
      <div class="filter-section">
        <div class="filter-label">按年级</div>
        <div class="chip-group">
          <button
            v-for="opt in gradeOptions"
            :key="opt.value"
            class="chip"
            :class="{ active: selectedGrade === opt.value }"
            @click="selectedGrade = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="filter-section">
        <div class="filter-label">按分类</div>
        <div class="chip-group">
          <button
            v-for="opt in categoryOptions"
            :key="opt.value"
            class="chip"
            :class="[
              { active: selectedCategory === opt.value },
              opt.value !== 'all' ? `chip--${opt.value}` : ''
            ]"
            @click="selectedCategory = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 统计 -->
      <div class="stats-bar">
        <span>共 <strong>{{ filteredTopics.length }}</strong> 个专题</span>
      </div>

      <!-- 专题列表 -->
      <div class="topic-grid">
        <article
          v-for="topic in filteredTopics"
          :key="topic.id"
          class="topic-card"
          :class="`topic-card--${topic.category}`"
          tabindex="0"
          role="button"
          @click="goToTopic(topic.id)"
          @keydown.enter.space.prevent="goToTopic(topic.id)"
        >
          <div class="topic-card__head">
            <span class="topic-card__icon">{{ topic.icon || '📖' }}</span>
            <div class="topic-card__meta">
              <span class="topic-card__badge">{{ gradeLabel(topic.grade) }}</span>
              <span class="topic-card__badge" :class="`badge--${topic.category}`">{{ categoryLabel(topic.category) }}</span>
            </div>
          </div>
          <h3 class="topic-card__title">{{ topic.title }}</h3>
          <p class="topic-card__summary">{{ topic.summary }}</p>
          <div class="topic-card__footer">
            <span class="topic-card__stars" :title="`难度 ${topic.difficulty}/5`">
              {{ difficultyStars(topic.difficulty) }}
            </span>
            <span class="topic-card__arrow">进入学习 →</span>
          </div>
        </article>
      </div>

      <div v-if="filteredTopics.length === 0" class="empty">
        <p>🔍 没有符合筛选条件的专题</p>
        <button class="btn-reset" @click="selectedGrade = 'all'; selectedCategory = 'all'">
          重置筛选
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.learning-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6, 24px) var(--space-4, 16px);
}

.lp-header {
  text-align: center;
  margin-bottom: var(--space-8, 32px);
}
.lp-header h1 {
  font-size: var(--text-3xl, 32px);
  color: var(--text-primary, #1f2937);
  margin-bottom: var(--space-2, 8px);
}
.muted {
  color: var(--text-tertiary, #9aa0a6);
  font-size: var(--text-base, 16px);
}

.filter-section {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 16px);
  padding: var(--space-4, 16px);
  margin-bottom: var(--space-4, 16px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.05));
  display: flex;
  gap: var(--space-4, 16px);
  align-items: flex-start;
  flex-wrap: wrap;
}

.filter-label {
  font-size: var(--text-sm, 14px);
  color: var(--text-secondary, #4b5563);
  font-weight: 600;
  min-width: 56px;
  padding-top: var(--space-1, 4px);
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2, 8px);
}

.chip {
  padding: var(--space-2, 8px) var(--space-4, 16px);
  border-radius: var(--radius-full, 9999px);
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-hover, #f3f4f6);
  color: var(--text-secondary, #4b5563);
  font-size: var(--text-sm, 14px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.chip:hover {
  border-color: var(--color-primary, #6366f1);
  color: var(--color-primary, #6366f1);
}
.chip.active {
  background: var(--color-primary, #6366f1);
  border-color: var(--color-primary, #6366f1);
  color: white;
}
.chip.chip--basic.active {
  background: var(--color-info, #3b82f6);
  border-color: var(--color-info, #3b82f6);
}
.chip.chip--olympiad.active {
  background: var(--color-warning, #f59e0b);
  border-color: var(--color-warning, #f59e0b);
}

.stats-bar {
  display: flex;
  gap: var(--space-4, 16px);
  margin-bottom: var(--space-5, 20px);
  padding: var(--space-3, 12px) var(--space-4, 16px);
  background: var(--bg-hover, #f3f4f6);
  border-radius: var(--radius-lg, 12px);
  font-size: var(--text-sm, 14px);
  color: var(--text-secondary, #4b5563);
}
.stats-bar strong {
  color: var(--color-primary, #6366f1);
  font-size: var(--text-lg, 18px);
  margin: 0 var(--space-1, 4px);
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4, 16px);
}

.topic-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 16px);
  padding: var(--space-5, 20px);
  border: 2px solid transparent;
  border-left: 4px solid var(--color-primary, #6366f1);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.05));
}
.topic-card:hover,
.topic-card:focus {
  transform: translateY(-2px);
  border-color: var(--color-primary, #6366f1);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0,0,0,.08));
  outline: none;
}
.topic-card--basic {
  border-left-color: var(--color-info, #3b82f6);
}
.topic-card--basic:hover,
.topic-card--basic:focus {
  border-color: var(--color-info, #3b82f6);
}
.topic-card--olympiad {
  border-left-color: var(--color-warning, #f59e0b);
}
.topic-card--olympiad:hover,
.topic-card--olympiad:focus {
  border-color: var(--color-warning, #f59e0b);
}

.topic-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3, 12px);
}
.topic-card__icon {
  font-size: var(--text-2xl, 24px);
}
.topic-card__meta {
  display: flex;
  gap: var(--space-2, 8px);
  flex-wrap: wrap;
}

.topic-card__badge {
  font-size: var(--text-xs, 12px);
  padding: 2px var(--space-2, 8px);
  border-radius: var(--radius-sm, 6px);
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary, #6366f1);
  font-weight: 500;
}
.badge--basic {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-info, #3b82f6);
}
.badge--olympiad {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning, #b45309);
}

.topic-card__title {
  font-size: var(--text-lg, 18px);
  color: var(--text-primary, #1f2937);
  margin: 0 0 var(--space-2, 8px);
  font-weight: 700;
}

.topic-card__summary {
  color: var(--text-secondary, #4b5563);
  font-size: var(--text-sm, 14px);
  line-height: 1.6;
  margin: 0 0 var(--space-4, 16px);
  flex: 1;
}

.topic-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-3, 12px);
  border-top: 1px dashed var(--border-color, #e5e7eb);
}
.topic-card__stars {
  font-size: var(--text-sm, 14px);
}
.topic-card__arrow {
  color: var(--color-primary, #6366f1);
  font-size: var(--text-sm, 14px);
  font-weight: 600;
}

.empty {
  text-align: center;
  padding: var(--space-16, 64px) var(--space-4, 16px);
  color: var(--text-tertiary, #9aa0a6);
}
.empty p {
  margin-bottom: var(--space-4, 16px);
  font-size: var(--text-lg, 18px);
}
.btn-reset {
  padding: var(--space-3, 12px) var(--space-6, 24px);
  border: 1px solid var(--color-primary, #6366f1);
  background: transparent;
  color: var(--color-primary, #6366f1);
  border-radius: var(--radius-lg, 12px);
  font-size: var(--text-base, 16px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-reset:hover {
  background: var(--color-primary, #6366f1);
  color: white;
}

@media (max-width: 640px) {
  .topic-grid { grid-template-columns: 1fr; }
  .filter-section { flex-direction: column; }
}
</style>
