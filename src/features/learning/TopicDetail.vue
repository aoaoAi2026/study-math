<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadTopic } from '@/services/contentLoader'
import type { KnowledgeTopic, CardBlock } from '@/types/content'
import type { SolutionStep, CommonMistake } from '@/types/exercise'
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

// -------------------------------
// 文本辅助函数
// -------------------------------

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderInline(text: string): string {
  let safe = escapeHtml(text)
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return safe
}

/**
 * 简单的 Markdown -> HTML
 * - 以空行（\n\n 或 \r\n\r\n）分隔为多个段落，每段包在 <p> 中
 * - 段内的每一行如果以 '- ' 开头，放入 <ul><li>
 * - **xxx** -> <strong>xxx</strong>
 * - $公式$ 保留原样（KaTeX 在页面渲染）
 * - 普通行在段落内保留为换行
 */
function markdownToHtml(text: string): string {
  if (!text) return ''

  const normalized = text.replace(/\r\n/g, '\n')
  const paragraphs = normalized.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0)

  return paragraphs
    .map((para) => {
      const lines = para.split('\n')
      const listItems: string[] = []
      const plainLines: string[] = []

      for (const line of lines) {
        if (/^\s*[-*+]\s+/.test(line)) {
          listItems.push(line.replace(/^\s*[-*+]\s+/, ''))
        } else {
          plainLines.push(line)
        }
      }

      const parts: string[] = []

      if (plainLines.length > 0) {
        const plainHtml = plainLines.map(renderInline).join('<br/>')
        parts.push(`<p>${plainHtml}</p>`)
      }

      if (listItems.length > 0) {
        const liHtml = listItems.map((l) => `<li>${renderInline(l)}</li>`).join('')
        parts.push(`<ul>${liHtml}</ul>`)
      }

      return parts.join('')
    })
    .join('')
}

// -------------------------------
// example-card 解析
// -------------------------------

interface ParseExampleResult {
  stem: string
  steps: SolutionStep[]
  formula: string
}

function extractFormula(lines: string[]): string {
  const idx = lines.findIndex((l) => /公式|核心公式|公式：|公式:/.test(l))
  if (idx === -1) return ''
  const parts: string[] = []
  if (lines[idx].includes('：') || lines[idx].includes(':')) {
    const after = lines[idx].split(/[：:]/, 2)[1]
    if (after && after.trim()) parts.push(after.trim())
  }
  for (let i = idx + 1; i < lines.length; i++) {
    if (/第[一二三四五六七八九十百0-9]+步|步骤[一二三四五六七八九十百0-9]+|^\s*[0-9]+\s*[.、)\s]/.test(lines[i])) break
    if (lines[i].trim()) parts.push(lines[i].trim())
  }
  return parts.join(' ')
}

function detectErrorLayer(text: string): CommonMistake['errorLayer'] {
  const m = text.match(/L[1-4]/i)
  if (m) return (m[0].toUpperCase() as CommonMistake['errorLayer'])
  return 'L2'
}

function parseExampleCard(content: string): ParseExampleResult {
  const rawLines = content.replace(/\r\n/g, '\n').split('\n')
  const lines = rawLines.map((l) => l.trim())

  let formula = extractFormula(lines)

  const stepPattern = /^第[一二三四五六七八九十百0-9]+步[：:.]?\s*|^步骤[一二三四五六七八九十百0-9]+[：:.]?\s*|^[0-9]+[.、)]\s*/

  const stepStartIdx: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue
    if (stepPattern.test(lines[i])) {
      stepStartIdx.push(i)
    } else if (/公式|核心公式/.test(lines[i]) && i > 0) {
      // 公式行不算步骤
      continue
    }
  }

  const steps: SolutionStep[] = []

  if (stepStartIdx.length === 0) {
    const nonEmpty = lines.filter((l) => l)
    if (nonEmpty.length > 0) {
      steps.push({ description: nonEmpty.join(' ') })
    }
    return {
      stem: markdownToHtml(rawLines.join('\n')),
      steps,
      formula
    }
  }

  // stem：第一行或第一个步骤之前的所有内容
  const beforeFirstStep = lines.slice(0, stepStartIdx[0]).filter((l) => l)
  const firstStepLine = lines[stepStartIdx[0]].replace(stepPattern, '').trim()
  const stemHtml = markdownToHtml(
    beforeFirstStep.length > 0
      ? beforeFirstStep.join('\n')
      : firstStepLine
  )

  // 解析每个步骤
  for (let i = 0; i < stepStartIdx.length; i++) {
    const start = stepStartIdx[i]
    const end = i + 1 < stepStartIdx.length ? stepStartIdx[i + 1] : lines.length
    const stepLines = lines.slice(start, end)
    const cleanedStepLine = stepPattern.test(stepLines[0])
      ? stepLines[0].replace(stepPattern, '').trim()
      : stepLines[0]

    const restLines = stepLines.slice(1).filter((l) => l && !/公式|核心公式/.test(l))

    const allDescParts: string[] = [cleanedStepLine, ...restLines]
    const description = allDescParts.filter((l) => l).join(' ')

    const expression = description.match(/\$[^$]+\$/)?.[0] || ''

    steps.push({ description, expression: expression || undefined })
  }

  // 去除 stem 文本中多余的步骤/公式内容（以避免重复）
  return { stem: stemHtml, steps, formula }
}

// -------------------------------
// mistake-card 解析
// -------------------------------

interface ParseMistakeResult {
  mistakes: CommonMistake[]
}

function parseMistakeCard(content: string): ParseMistakeResult {
  const rawLines = content.replace(/\r\n/g, '\n').split('\n')
  const lines = rawLines.map((l) => l.trim())

  const mistakes: CommonMistake[] = []

  const mistakeIdx: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (/^错误[：:.\s]|^错误\d+|^错误\s*[一二三四五六七八九十]/i.test(lines[i])) {
      mistakeIdx.push(i)
    }
  }

  if (mistakeIdx.length === 0) {
    // 按 reason/correction 关键词尝试提取一组
    const reasonIdx = lines.findIndex((l) => /原因[：:]|^原因/i.test(l))
    const correctionIdx = lines.findIndex((l) => /纠正[：:]|^纠正/i.test(l))
    if (reasonIdx !== -1 && correctionIdx !== -1) {
      const reason = (lines[reasonIdx].split(/[：:]/, 2)[1] || lines[reasonIdx]).trim()
      const correction = (lines[correctionIdx].split(/[：:]/, 2)[1] || lines[correctionIdx]).trim()
      const mistake = lines.slice(0, reasonIdx).filter((l) => l && !/原因|纠正/.test(l)).join(' ')
      mistakes.push({
        mistake: mistake || '未提供',
        reason,
        correction,
        errorLayer: detectErrorLayer(lines.join(' '))
      })
    }
    return { mistakes }
  }

  for (let i = 0; i < mistakeIdx.length; i++) {
    const start = mistakeIdx[i]
    const end = i + 1 < mistakeIdx.length ? mistakeIdx[i + 1] : lines.length
    const block = lines.slice(start, end)

    let mistake = ''
    let reason = ''
    let correction = ''

    let currentKey: 'mistake' | 'reason' | 'correction' = 'mistake'
    const buckets: Record<string, string[]> = { mistake: [], reason: [], correction: [] }

    for (const line of block) {
      if (/^错误[：:.\s]|^错误\d+/i.test(line)) {
        currentKey = 'mistake'
        const rest = line.replace(/^错误[：:.\s\d一二三四五六七八九十]*/i, '').trim()
        if (rest) buckets[currentKey].push(rest)
      } else if (/^原因[：:.\s]|^原因/i.test(line)) {
        currentKey = 'reason'
        const rest = line.replace(/^原因[：:.\s]*/i, '').trim()
        if (rest) buckets[currentKey].push(rest)
      } else if (/^纠正[：:.\s]|^纠正|^正确|^修正/i.test(line)) {
        currentKey = 'correction'
        const rest = line.replace(/^(纠正|正确|修正)[：:.\s]*/i, '').trim()
        if (rest) buckets[currentKey].push(rest)
      } else if (line) {
        buckets[currentKey].push(line)
      }
    }

    mistake = buckets.mistake.join(' ') || '未说明错误'
    reason = buckets.reason.join(' ') || '未说明原因'
    correction = buckets.correction.join(' ') || '未提供正确做法'

    const layerText = block.join(' ')
    const errorLayer = detectErrorLayer(layerText)

    mistakes.push({ mistake, reason, correction, errorLayer })
  }

  return { mistakes }
}

// -------------------------------
// 主渲染函数
// -------------------------------

function renderCardProps(card: CardBlock) {
  const base = { title: card.title || '' }

  switch (card.type) {
    case 'example': {
      const { stem, steps, formula } = parseExampleCard(card.content || '')
      return {
        ...base,
        content: markdownToHtml(card.content || ''),
        stem,
        steps,
        formula
      }
    }
    case 'variant': {
      return {
        ...base,
        content: markdownToHtml(card.content || ''),
        stem: markdownToHtml(card.content || ''),
        variantIndex: card.variantIndex
      }
    }
    case 'mistake': {
      const { mistakes } = parseMistakeCard(card.content || '')
      return {
        ...base,
        content: markdownToHtml(card.content || ''),
        mistakes
      }
    }
    case 'parent-child': {
      return {
        ...base,
        content: markdownToHtml(card.content || ''),
        script: card.content || ''
      }
    }
    default:
      return {
        ...base,
        content: markdownToHtml(card.content || '')
      }
  }
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
