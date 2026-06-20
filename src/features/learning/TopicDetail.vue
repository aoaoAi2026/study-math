<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadTopic } from '@/services/contentLoader'
import type { KnowledgeTopic, CardBlock } from '@/types/content'
import StoryCard from '@/components/cards/StoryCard.vue'
import ConceptCard from '@/components/cards/ConceptCard.vue'
import ExampleCard from '@/components/cards/ExampleCard.vue'
import VariantCard from '@/components/cards/VariantCard.vue'
import MistakeCard from '@/components/cards/MistakeCard.vue'
import ParentChildCard from '@/components/cards/ParentChildCard.vue'

const route = useRoute()
const router = useRouter()

const topicId = computed(() => (route.params.topicId as string) || (route.params.id as string))
const topic = ref<KnowledgeTopic | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const gradeLabel = computed(() => {
  if (topic.value) return `${topic.value.grade}年级`
  const m = topicId.value.match(/^g(\d)/)
  if (m) return `${m[1]}年级`
  return '学习内容'
})

const difficultyStars = computed(() => {
  if (!topic.value) return ''
  return '★'.repeat(topic.value.difficulty) + '☆'.repeat(5 - topic.value.difficulty)
})

const cardComponentMap: Record<CardBlock['type'], unknown> = {
  story: StoryCard,
  concept: ConceptCard,
  example: ExampleCard,
  variant: VariantCard,
  mistake: MistakeCard,
  'parent-child': ParentChildCard
}

async function fetchTopic() {
  if (!topicId.value) return
  loading.value = true
  error.value = null
  topic.value = null
  try {
    const result = await loadTopic(topicId.value)
    if (!result) {
      error.value = '未找到该专题'
    } else {
      topic.value = result
    }
  } catch (err) {
    console.error('[TopicDetail] 加载失败:', err)
    error.value = '内容加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/learning')
}

function goToQuiz() {
  if (!topicId.value) return
  router.push(`/quiz/${topicId.value}`)
}

function goToPostTest() {
  if (!topicId.value) return
  router.push(`/post-test/${topicId.value}`)
}

function renderCardProps(card: CardBlock) {
  const base = { title: card.title || '', content: card.content || '' }
  switch (card.type) {
    case 'example':
      return { ...base, stem: card.content || '', steps: [], formula: '' }
    case 'variant':
      return { ...base, stem: card.content || '', variantIndex: card.variantIndex }
    case 'mistake':
      return { ...base, mistakes: [] }
    case 'parent-child':
      return { ...base, script: card.content || '' }
    default:
      return base
  }
}

onMounted(fetchTopic)
watch(topicId, fetchTopic)
</script>

<template>
  <div class="topic-detail">
    <nav class="breadcrumb">
      <a class="breadcrumb-link" @click="goBack">知识地图</a>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-link">{{ gradeLabel }}</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">{{ topic?.title || '加载中...' }}</span>
    </nav>

    <div v-if="loading" class="status-box" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true" />
      <p>课件加载中...</p>
    </div>

    <div v-else-if="error" class="status-box placeholder" role="alert">
      <div class="placeholder-icon">🚧</div>
      <h2>{{ error }}</h2>
      <p>该专题的课件正在精心编写中，敬请期待！</p>
      <div class="placeholder-actions">
        <button class="btn-back" @click="fetchTopic">重新加载</button>
        <button class="btn-back" @click="goBack">返回专题列表</button>
      </div>
    </div>

    <template v-else-if="topic">
      <header class="topic-head">
        <div class="topic-head__meta">
          <span class="tag tag-grade">{{ topic.grade }}年级</span>
          <span class="tag" :class="topic.category === 'basic' ? 'tag-basic' : 'tag-olympiad'">
            {{ topic.category === 'basic' ? '校内基础' : '奥数专题' }}
          </span>
          <span class="tag tag-diff" :title="`难度 ${topic.difficulty}/5`">
            {{ difficultyStars }}
          </span>
        </div>
        <h1 class="topic-head__title">{{ topic.title }}</h1>
        <p class="topic-head__summary" v-if="topic.summary">{{ topic.summary }}</p>
      </header>

      <section class="cards-section">
        <component
          v-for="(card, idx) in topic.cards"
          :key="`${card.type}-${idx}`"
          :is="cardComponentMap[card.type]"
          v-bind="renderCardProps(card)"
          class="card-block"
          :class="`card-${card.type}`"
        />

        <div v-if="topic.cards.length === 0" class="card-block card-empty">
          <h3>暂无学习卡片</h3>
          <p>该专题的学习卡片正在编写中，敬请期待。</p>
        </div>
      </section>

      <section class="action-bar">
        <button class="action-btn action-btn--primary" @click="goToQuiz">
          <span class="action-btn__icon">✏️</span>
          <span class="action-btn__text">
            <strong>开始练习</strong>
            <small>通过题目巩固知识点</small>
          </span>
        </button>
        <button class="action-btn action-btn--secondary" @click="goToPostTest">
          <span class="action-btn__icon">🎯</span>
          <span class="action-btn__text">
            <strong>掌握测验</strong>
            <small>检测是否真正理解</small>
          </span>
        </button>
      </section>
    </template>
  </div>
</template>

<style scoped>
.topic-detail {
  max-width: var(--content-max-width, 900px);
  margin: 0 auto;
  padding: var(--space-6, 24px) var(--space-4, 16px);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2, 8px);
  margin-bottom: var(--space-6, 24px);
  font-size: var(--text-sm, 14px);
  color: var(--text-tertiary, #6b7280);
  flex-wrap: wrap;
}
.breadcrumb-link {
  cursor: pointer;
  color: var(--text-secondary, #4b5563);
  transition: color var(--transition-fast, .15s);
}
.breadcrumb-link:hover {
  color: var(--color-primary, #6366f1);
  text-decoration: underline;
}
.breadcrumb-sep {
  color: var(--text-tertiary, #6b7280);
}
.breadcrumb-current {
  color: var(--text-primary, #1f2937);
  font-weight: 600;
}

.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-secondary, #4b5563);
  gap: var(--space-4, 16px);
}
.placeholder {
  background: var(--bg-card, #ffffff);
  border: 2px dashed var(--border-color, #e5e7eb);
  border-radius: var(--radius-xl, 16px);
  padding: var(--space-12, 48px) var(--space-6, 24px);
  text-align: center;
}
.placeholder-icon {
  font-size: 48px;
  margin-bottom: var(--space-2, 8px);
}
.placeholder h2 {
  font-size: var(--text-2xl, 24px);
  color: var(--text-primary, #1f2937);
  margin: 0 0 var(--space-2, 8px);
}
.placeholder p {
  color: var(--text-secondary, #4b5563);
  margin: 0 0 var(--space-6, 24px);
}
.placeholder-actions {
  display: flex;
  gap: var(--space-3, 12px);
  flex-wrap: wrap;
  justify-content: center;
}
.btn-back {
  padding: var(--space-3, 12px) var(--space-6, 24px);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-lg, 12px);
  background: var(--bg-card, #ffffff);
  color: var(--text-primary, #1f2937);
  cursor: pointer;
  font-size: var(--text-sm, 14px);
  font-weight: 500;
  transition: all var(--transition-fast, .15s);
}
.btn-back:hover {
  border-color: var(--color-primary, #6366f1);
  color: var(--color-primary, #6366f1);
  background: rgba(99, 102, 241, .05);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-color, #e5e7eb);
  border-top-color: var(--color-primary, #6366f1);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.topic-head {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 16px);
  padding: var(--space-6, 24px);
  margin-bottom: var(--space-6, 24px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.05));
  border-top: 4px solid var(--color-primary, #6366f1);
}
.topic-head__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2, 8px);
  margin-bottom: var(--space-3, 12px);
}
.topic-head__title {
  font-size: var(--text-3xl, 28px);
  color: var(--text-primary, #1f2937);
  margin: 0 0 var(--space-3, 12px);
  line-height: 1.3;
}
.topic-head__summary {
  color: var(--text-secondary, #4b5563);
  line-height: var(--leading-relaxed, 1.6);
  font-size: var(--text-base, 16px);
  margin: 0;
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

.cards-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-6, 24px);
  margin-bottom: var(--space-10, 40px);
}

.card-block {
  display: block;
}

.card-empty {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 16px);
  padding: var(--space-8, 32px);
  text-align: center;
  color: var(--text-tertiary, #6b7280);
  border: 2px dashed var(--border-color, #e5e7eb);
}
.card-empty h3 {
  color: var(--text-primary, #1f2937);
  margin: 0 0 var(--space-2, 8px);
}
.card-empty p {
  margin: 0;
}

.action-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4, 16px);
}
.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-4, 16px);
  padding: var(--space-5, 20px) var(--space-5, 20px);
  border: none;
  border-radius: var(--radius-xl, 16px);
  cursor: pointer;
  text-align: left;
  transition: transform var(--transition-fast, .15s), box-shadow var(--transition-fast, .15s);
}
.action-btn:hover {
  transform: translateY(-2px);
}
.action-btn--primary {
  background: linear-gradient(135deg, var(--color-primary, #6366f1), var(--color-primary-dark, #4338ca));
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, .35);
}
.action-btn--primary:hover {
  box-shadow: 0 8px 24px rgba(99, 102, 241, .45);
}
.action-btn--secondary {
  background: linear-gradient(135deg, var(--color-success, #10b981), #047857);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(16, 185, 129, .35);
}
.action-btn--secondary:hover {
  box-shadow: 0 8px 24px rgba(16, 185, 129, .45);
}
.action-btn__icon {
  font-size: var(--text-3xl, 28px);
  flex-shrink: 0;
}
.action-btn__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.3;
}
.action-btn__text strong {
  font-size: var(--text-lg, 18px);
  font-weight: 700;
}
.action-btn__text small {
  font-size: var(--text-sm, 14px);
  opacity: .9;
  font-weight: 400;
}

@media (max-width: 640px) {
  .topic-detail {
    padding: var(--space-4, 16px) var(--space-3, 12px);
  }
  .topic-head {
    padding: var(--space-5, 20px);
  }
  .topic-head__title {
    font-size: var(--text-2xl, 24px);
  }
  .action-bar {
    grid-template-columns: 1fr;
  }
}
</style>
