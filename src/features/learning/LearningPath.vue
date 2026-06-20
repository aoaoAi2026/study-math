<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { listTopics } from '@/services/contentLoader'
import type { TopicIndex } from '@/types/content'

const router = useRouter()

const topics = ref<TopicIndex[]>(listTopics())
const gradeFilter = ref<number | 'all'>('all')
const categoryFilter = ref<'all' | 'basic' | 'olympiad'>('all')

const gradeOptions = [
  { value: 'all' as const, label: '全部' },
  { value: 1, label: '1年级' },
  { value: 2, label: '2年级' },
  { value: 3, label: '3年级' },
  { value: 4, label: '4年级' },
  { value: 5, label: '5年级' },
  { value: 6, label: '6年级' }
]

const categoryOptions = [
  { value: 'all' as const, label: '全部' },
  { value: 'basic' as const, label: '校内基础' },
  { value: 'olympiad' as const, label: '奥数专题' }
]

const filteredTopics = computed(() => {
  return topics.value.filter(t => {
    const gradeOk = gradeFilter.value === 'all' || t.grade === gradeFilter.value
    const categoryOk = categoryFilter.value === 'all' || t.category === categoryFilter.value
    return gradeOk && categoryOk
  })
})

const groupedTopics = computed(() => {
  const groups: Record<number, TopicIndex[]> = {}
  for (const t of filteredTopics.value) {
    if (!groups[t.grade]) groups[t.grade] = []
    groups[t.grade].push(t)
  }
  return groups
})

const totalCount = computed(() => filteredTopics.value.length)

function renderStars(n: number) {
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

function categoryLabel(cat: 'basic' | 'olympiad') {
  return cat === 'basic' ? '校内基础' : '奥数专题'
}

function goToTopic(id: string) {
  router.push(`/learning/topic/${id}`)
}
</script>

<template>
  <div class="lp">
    <header class="lp-head">
      <h1>📚 学习路径</h1>
      <p class="lp-subtitle">从基础到精通，一步一步掌握每一个专题</p>
    </header>

    <section class="lp-filters">
      <div class="filter-group">
        <span class="filter-label">年级</span>
        <div class="filter-chips">
          <button
            v-for="opt in gradeOptions"
            :key="opt.value"
            class="chip"
            :class="{ active: gradeFilter === opt.value }"
            @click="gradeFilter = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">分类</span>
        <div class="filter-chips">
          <button
            v-for="opt in categoryOptions"
            :key="opt.value"
            class="chip"
            :class="{ active: categoryFilter === opt.value, 'is-basic': opt.value === 'basic', 'is-olympiad': opt.value === 'olympiad' }"
            @click="categoryFilter = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <div class="lp-count">共 <strong>{{ totalCount }}</strong> 个专题</div>
    </section>

    <div v-if="totalCount === 0" class="lp-empty">
      <div class="lp-empty-icon">🔍</div>
      <p>没有符合筛选条件的专题</p>
    </div>

    <section
      v-for="grade in Object.keys(groupedTopics).map(Number).sort((a, b) => a - b)"
      :key="grade"
      class="grade-block"
    >
      <div class="grade-head">
        <h2>{{ grade }} 年级</h2>
        <span class="grade-count">{{ groupedTopics[grade].length }} 个专题</span>
      </div>
      <div class="topic-grid">
        <article
          v-for="t in groupedTopics[grade]"
          :key="t.id"
          class="topic-card"
          :class="`topic-card--${t.category}`"
          tabindex="0"
          role="button"
          @click="goToTopic(t.id)"
          @keydown.enter.space.prevent="goToTopic(t.id)"
        >
          <div class="topic-card__head">
            <span class="topic-card__icon">{{ t.id.includes('story') ? '📖' : t.id.includes('game') ? '🎮' : '🧩' }}</span>
            <h3 class="topic-card__title">{{ t.title }}</h3>
          </div>
          <p class="topic-card__summary">{{ t.summary }}</p>
          <div class="topic-card__tags">
            <span class="tag tag-grade">{{ t.grade }}年级</span>
            <span class="tag" :class="t.category === 'basic' ? 'tag-basic' : 'tag-olympiad'">
              {{ categoryLabel(t.category) }}
            </span>
            <span class="tag tag-diff" :title="`难度 ${t.difficulty}/5`">
              {{ renderStars(t.difficulty) }}
            </span>
          </div>
          <div class="topic-card__action">
            <span>进入学习</span>
            <span aria-hidden="true">→</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lp {
  max-width: var(--content-max-width, 1100px);
  margin: 0 auto;
  padding: var(--space-6, 24px) var(--space-4, 16px);
}

.lp-head {
  text-align: center;
  margin-bottom: var(--space-6, 24px);
}
.lp-head h1 {
  font-size: var(--text-3xl, 32px);
  color: var(--text-primary, #1f2937);
  margin: 0 0 var(--space-2, 8px);
}
.lp-subtitle {
  color: var(--text-tertiary, #6b7280);
  font-size: var(--text-base, 16px);
  margin: 0;
}

.lp-filters {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 16px);
  padding: var(--space-5, 20px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.05));
  margin-bottom: var(--space-6, 24px);
  display: flex;
  flex-direction: column;
  gap: var(--space-4, 16px);
}

.filter-group {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3, 12px);
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  padding-top: var(--space-1, 4px);
  min-width: 48px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2, 8px);
}

.chip {
  padding: var(--space-2, 8px) var(--space-4, 16px);
  border-radius: var(--radius-full, 999px);
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-hover, #f9fafb);
  color: var(--text-secondary, #4b5563);
  font-size: var(--text-sm, 14px);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast, .15s);
}
.chip:hover {
  border-color: var(--color-primary, #6366f1);
  color: var(--color-primary, #6366f1);
}
.chip.active {
  background: var(--color-primary, #6366f1);
  border-color: var(--color-primary, #6366f1);
  color: #ffffff;
}
.chip.is-basic.active {
  background: var(--color-info, #3b82f6);
  border-color: var(--color-info, #3b82f6);
}
.chip.is-olympiad.active {
  background: var(--color-warning, #f59e0b);
  border-color: var(--color-warning, #f59e0b);
}

.lp-count {
  text-align: right;
  color: var(--text-tertiary, #6b7280);
  font-size: var(--text-sm, 14px);
}
.lp-count strong {
  color: var(--color-primary, #6366f1);
  font-size: var(--text-lg, 18px);
  margin: 0 var(--space-1, 4px);
}

.lp-empty {
  text-align: center;
  padding: var(--space-16, 64px) var(--space-4, 16px);
  color: var(--text-tertiary, #6b7280);
}
.lp-empty-icon {
  font-size: 48px;
  margin-bottom: var(--space-3, 12px);
}

.grade-block {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 16px);
  padding: var(--space-5, 20px);
  margin-bottom: var(--space-5, 20px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.05));
}

.grade-head {
  display: flex;
  align-items: baseline;
  gap: var(--space-3, 12px);
  margin-bottom: var(--space-4, 16px);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  padding-bottom: var(--space-3, 12px);
}
.grade-head h2 {
  font-size: var(--text-xl, 20px);
  color: var(--text-primary, #1f2937);
  margin: 0;
}
.grade-count {
  color: var(--text-tertiary, #6b7280);
  font-size: var(--text-sm, 14px);
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4, 16px);
}

.topic-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-hover, #f9fafb);
  border: 2px solid transparent;
  border-left: 4px solid var(--color-primary, #6366f1);
  border-radius: var(--radius-lg, 12px);
  padding: var(--space-4, 16px);
  cursor: pointer;
  transition: all var(--transition-fast, .15s);
}
.topic-card:hover,
.topic-card:focus {
  transform: translateY(-2px);
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 8px 20px rgba(99, 102, 241, .15);
  outline: none;
}
.topic-card--basic {
  border-left-color: var(--color-info, #3b82f6);
}
.topic-card--basic:hover,
.topic-card--basic:focus {
  border-color: var(--color-info, #3b82f6);
  box-shadow: 0 8px 20px rgba(59, 130, 246, .15);
}
.topic-card--olympiad {
  border-left-color: var(--color-warning, #f59e0b);
}
.topic-card--olympiad:hover,
.topic-card--olympiad:focus {
  border-color: var(--color-warning, #f59e0b);
  box-shadow: 0 8px 20px rgba(245, 158, 11, .15);
}

.topic-card__head {
  display: flex;
  align-items: center;
  gap: var(--space-2, 8px);
  margin-bottom: var(--space-2, 8px);
}
.topic-card__icon {
  font-size: var(--text-xl, 20px);
}
.topic-card__title {
  font-size: var(--text-lg, 18px);
  color: var(--text-primary, #1f2937);
  margin: 0;
  font-weight: 600;
}

.topic-card__summary {
  color: var(--text-secondary, #4b5563);
  font-size: var(--text-sm, 14px);
  line-height: var(--leading-relaxed, 1.6);
  margin: 0 0 var(--space-3, 12px);
  flex: 1;
}

.topic-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2, 8px);
  margin-bottom: var(--space-3, 12px);
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1, 4px) var(--space-2, 8px);
  border-radius: var(--radius-sm, 6px);
  font-size: var(--text-xs, 12px);
  font-weight: 500;
  background: var(--bg-page, #f3f4f6);
  color: var(--text-secondary, #4b5563);
}
.tag-grade {
  background: rgba(99, 102, 241, .1);
  color: var(--color-primary, #6366f1);
}
.tag-basic {
  background: rgba(59, 130, 246, .1);
  color: var(--color-info, #3b82f6);
}
.tag-olympiad {
  background: rgba(245, 158, 11, .1);
  color: var(--color-warning-dark, #b45309);
}
.tag-diff {
  color: var(--color-warning, #f59e0b);
  letter-spacing: 1px;
}

.topic-card__action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-3, 12px);
  border-top: 1px dashed var(--border-color, #e5e7eb);
  color: var(--color-primary, #6366f1);
  font-size: var(--text-sm, 14px);
  font-weight: 600;
}
.topic-card:hover .topic-card__action {
  color: var(--color-primary-dark, #4338ca);
}

@media (max-width: 640px) {
  .lp { padding: var(--space-4, 16px) var(--space-3, 12px); }
  .filter-group { flex-direction: column; }
  .topic-grid { grid-template-columns: 1fr; }
}
</style>
