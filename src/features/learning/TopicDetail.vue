<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { loadTopicContent, parseTopicMarkdown } from '@/services/contentLoader'
import type { ParsedContent } from '@/services/contentLoader'

const route = useRoute()
const router = useRouter()

const topicId = computed(() => route.params.id as string)
const content = ref<ParsedContent | null>(null)
const loading = ref(true)
const error = ref(false)

// 面包屑：从 topicId 推断年级
const gradeLabel = computed(() => {
  const match = topicId.value.match(/^g(\d)/)
  if (match) return `${match[1]}年级`
  return '三年级'
})

const topicTitle = computed(() => content.value?.title ?? topicId.value)

async function fetchContent() {
  loading.value = true
  error.value = false
  content.value = null

  try {
    content.value = await loadTopicContent(topicId.value)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function goToQuiz() {
  router.push(`/learning/quiz/${topicId.value}`)
}

function goBack() {
  router.push('/learning')
}

onMounted(fetchContent)
watch(topicId, fetchContent)
</script>

<template>
  <AppLayout>
    <div class="topic-detail">
      <!-- 面包屑导航 -->
      <nav class="breadcrumb">
        <a class="breadcrumb-link" @click="goBack">知识地图</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-link">{{ gradeLabel }}</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">{{ topicTitle }}</span>
      </nav>

      <!-- 加载中 -->
      <div v-if="loading" class="status-box">
        <div class="spinner" />
        <p>课件加载中...</p>
      </div>

      <!-- 加载失败占位 -->
      <div v-else-if="error" class="status-box placeholder">
        <div class="placeholder-icon">🚧</div>
        <h2>内容开发中</h2>
        <p>该专题的课件正在精心编写中，敬请期待！</p>
        <button class="btn-back" @click="goBack">返回专题列表</button>
      </div>

      <!-- 正常内容 -->
      <template v-else-if="content">
        <article class="topic-content" v-html="content.html" />

        <!-- 卡片区域 -->
        <section v-if="content.cards.length" class="cards-section">
          <div
            v-for="(card, idx) in content.cards"
            :key="idx"
            class="card-block"
            :class="`card-${card.type}`"
          >
            <h3 v-if="card.title" class="card-title">{{ card.title }}</h3>
            <div class="card-body" v-html="card.content" />
          </div>
        </section>

        <!-- 底部练习按钮 -->
        <div class="action-bar">
          <button class="btn-practice" @click="goToQuiz">
            开始练习
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.topic-detail {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}
.breadcrumb-link {
  cursor: pointer;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}
.breadcrumb-link:hover {
  color: var(--color-primary);
}
.breadcrumb-sep {
  color: var(--text-tertiary);
}
.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}

/* 状态占位 */
.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-secondary);
  gap: var(--space-4);
}
.placeholder {
  background: var(--bg-card);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-12) var(--space-6);
  text-align: center;
}
.placeholder-icon {
  font-size: 48px;
  margin-bottom: var(--space-2);
}
.placeholder h2 {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}
.placeholder p {
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}
.btn-back {
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}
.btn-back:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 加载动画 */
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 文章内容 */
.topic-content {
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
  font-size: var(--text-base);
}
.topic-content :deep(h1) {
  font-size: var(--text-3xl);
  margin-bottom: var(--space-4);
}
.topic-content :deep(h2) {
  font-size: var(--text-2xl);
  margin-top: var(--space-8);
  margin-bottom: var(--space-4);
  color: var(--text-primary);
}
.topic-content :deep(p) {
  margin-bottom: var(--space-4);
}
.topic-content :deep(strong) {
  color: var(--color-primary-dark);
}

/* 卡片区域 */
.cards-section {
  margin-top: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.card-block {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--color-primary);
}
.card-block.card-story { border-left-color: var(--color-secondary); }
.card-block.card-concept { border-left-color: var(--color-info); }
.card-block.card-example { border-left-color: var(--color-success); }
.card-block.card-variant { border-left-color: var(--color-primary); }
.card-block.card-mistake { border-left-color: var(--color-error); }
.card-block.card-parent-child { border-left-color: var(--color-warning); }

.card-title {
  font-size: var(--text-lg);
  margin-bottom: var(--space-3);
  color: var(--text-primary);
}
.card-body {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* 底部操作栏 */
.action-bar {
  margin-top: var(--space-10);
  text-align: center;
}
.btn-practice {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-10);
  background: var(--color-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
  box-shadow: var(--shadow-md);
}
.btn-practice:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}
.btn-practice:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .topic-detail {
    padding: var(--space-4) var(--space-3);
  }
  .card-block {
    padding: var(--space-4);
  }
}
</style>
