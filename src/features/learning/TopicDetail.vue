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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderInline(text: string): string {
  let result = text
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>')
  result = escapeHtml(result)
  result = result.replace(/&lt;strong&gt;/g, '<strong>')
  result = result.replace(/&lt;\/strong&gt;/g, '</strong>')
  result = result.replace(/&lt;em&gt;/g, '<em>')
  result = result.replace(/&lt;\/em&gt;/g, '</em>')
  result = result.replace(/&lt;code&gt;/g, '<code>')
  result = result.replace(/&lt;\/code&gt;/g, '</code>')
  result = result.replace(/&lt;details&gt;/g, '<details>')
  result = result.replace(/&lt;\/details&gt;/g, '</details>')
  result = result.replace(/&lt;summary&gt;/g, '<summary>')
  result = result.replace(/&lt;\/summary&gt;/g, '</summary>')
  return result
}

function shapeToSvgHtml(shapeName: string): string {
  const name = (shapeName || '').trim().toLowerCase()
  if (name === 'cube' || name === '正方体') {
    return `<div style="display:flex;justify-content:center;padding:24px;background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-radius:16px;margin:16px 0;">
      <svg width="140" height="130" viewBox="0 0 160 150">
        <polygon points="80,10 150,45 150,115 80,150 10,115 10,45" fill="none"/>
        <polygon points="80,10 150,45 80,80 10,45" fill="#fbbf24" stroke="#1e293b" stroke-width="2"/>
        <polygon points="10,45 80,80 80,150 10,115" fill="#f59e0b" stroke="#1e293b" stroke-width="2"/>
        <polygon points="150,45 80,80 80,150 150,115" fill="#d97706" stroke="#1e293b" stroke-width="2"/>
        <text x="80" y="172" text-anchor="middle" font-size="14" fill="#92400e" font-weight="bold">正方体</text>
      </svg>
    </div>`
  }
  if (name === 'cuboid' || name === '长方体') {
    return `<div style="display:flex;justify-content:center;padding:24px;background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-radius:16px;margin:16px 0;">
      <svg width="160" height="130" viewBox="0 0 180 150">
        <polygon points="40,25 155,25 170,50 55,50" fill="#fbbf24" stroke="#1e293b" stroke-width="2"/>
        <polygon points="40,25 155,25 155,120 40,120" fill="#fcd34d" stroke="#1e293b" stroke-width="2"/>
        <polygon points="155,25 170,50 170,145 155,120" fill="#d97706" stroke="#1e293b" stroke-width="2"/>
        <polygon points="40,120 155,120 170,145 55,145" fill="#b45309" stroke="#1e293b" stroke-width="2" opacity="0.7"/>
        <text x="105" y="172" text-anchor="middle" font-size="14" fill="#92400e" font-weight="bold">长方体</text>
      </svg>
    </div>`
  }
  if (name === 'cylinder' || name === '圆柱') {
    return `<div style="display:flex;justify-content:center;padding:24px;background:linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%);border-radius:16px;margin:16px 0;">
      <svg width="140" height="130" viewBox="0 0 160 150">
        <ellipse cx="80" cy="30" rx="60" ry="15" fill="#93c5fd" stroke="#1e293b" stroke-width="2"/>
        <rect x="20" y="30" width="120" height="90" fill="#60a5fa" stroke="#1e293b" stroke-width="2"/>
        <ellipse cx="80" cy="120" rx="60" ry="15" fill="#3b82f6" stroke="#1e293b" stroke-width="2" opacity="0.8"/>
        <line x1="20" y1="30" x2="20" y2="120" stroke="#1e293b" stroke-width="2"/>
        <line x1="140" y1="30" x2="140" y2="120" stroke="#1e293b" stroke-width="2"/>
        <text x="80" y="172" text-anchor="middle" font-size="14" fill="#1e40af" font-weight="bold">圆柱</text>
      </svg>
    </div>`
  }
  if (name === 'sphere' || name === '球') {
    return `<div style="display:flex;justify-content:center;padding:24px;background:linear-gradient(135deg,#fce7f3 0%,#fbcfe8 100%);border-radius:16px;margin:16px 0;">
      <svg width="140" height="130" viewBox="0 0 160 150">
        <circle cx="80" cy="75" r="60" fill="url(#sphereGrad)" stroke="#1e293b" stroke-width="2"/>
        <defs>
          <radialGradient id="sphereGrad" cx="40%" cy="35%">
            <stop offset="0%" stop-color="#fbcfe8"/>
            <stop offset="100%" stop-color="#db2777"/>
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="140" rx="55" ry="8" fill="#991b1b" opacity="0.2"/>
        <text x="80" y="172" text-anchor="middle" font-size="14" fill="#831843" font-weight="bold">球</text>
      </svg>
    </div>`
  }
  return ''
}

function markdownToHtml(text: string): string {
  if (!text) return ''
  const normalized = text.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  const result: string[] = []
  let currentParagraph: string[] = []
  let inList = false
  let listItems: string[] = []

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const html = currentParagraph.map(renderInline).join('<br/>')
      result.push(`<p>${html}</p>`)
      currentParagraph = []
    }
  }

  const flushList = () => {
    if (listItems.length > 0) {
      const liHtml = listItems.map(l => `<li>${renderInline(l)}</li>`).join('')
      result.push(`<ul>${liHtml}</ul>`)
      listItems = []
      inList = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) { flushParagraph(); flushList(); continue }
    const shapeMatch = trimmed.match(/^:::shape\s+(.+)$/i)
    if (shapeMatch) { flushParagraph(); flushList(); result.push(shapeToSvgHtml(shapeMatch[1].trim())); continue }
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) { flushParagraph(); flushList(); result.push(`<h${headingMatch[1].length + 2}>${renderInline(headingMatch[2])}</h${headingMatch[1].length + 2}>`); continue }
    if (/^[-*+]\s/.test(trimmed)) { flushParagraph(); inList = true; listItems.push(trimmed.replace(/^[-*+]\s+/, '')); continue }
    const orderedMatch = trimmed.match(/^(?:\d+[\.、）\)]|\([a-zA-Z0-9]\))\s*(.+)$/)
    if (orderedMatch) { flushParagraph(); inList = true; listItems.push(orderedMatch[1]); continue }
    if (/^---+$/.test(trimmed) || /^\*\*+$/.test(trimmed)) { flushParagraph(); flushList(); result.push('<hr/>'); continue }
    if (inList) flushList()
    currentParagraph.push(trimmed)
  }
  flushParagraph()
  flushList()
  return result.join('')
}

interface ParseExampleResult { stem: string; steps: SolutionStep[]; formula: string }

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
  const lines = rawLines.map((l) => l.trim().replace(/^###\s*/, ''))
  const formula = extractFormula(lines)
  
  const examplePattern = /^\*\*例[0-9一二三四五六七八九十]+[：:.]/
  const separatorPattern = /^---+$/
  const answerPattern = /^\*\*瑙ｇ瓟|^\*\*解答|^\*\*答:/
  
  const exampleIdx: number[] = []
  const separatorIdx: number[] = []
  
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue
    if (examplePattern.test(lines[i])) exampleIdx.push(i)
    else if (separatorPattern.test(lines[i])) separatorIdx.push(i)
  }
  
  const steps: SolutionStep[] = []
  
  if (exampleIdx.length > 0) {
    const allExamples: string[] = []
    
    for (let i = 0; i < exampleIdx.length; i++) {
      const start = exampleIdx[i]
      let end: number
      
      if (i + 1 < exampleIdx.length) {
        end = exampleIdx[i + 1]
      } else if (separatorIdx.length > 0) {
        const afterIdx = separatorIdx.find(s => s > start)
        end = afterIdx || lines.length
      } else {
        end = lines.length
      }
      
      const exampleBlock = lines.slice(start, end).filter(l => l && !separatorPattern.test(l))
      allExamples.push(...exampleBlock)
    }
    
    let currentStem: string[] = []
    let currentAnswer: string[] = []
    let inAnswer = false
    
    allExamples.forEach(line => {
      if (answerPattern.test(line)) {
        if (currentStem.length > 0) {
          steps.push({
            description: renderInline(currentStem.join('\n')),
            expression: '',
            why: ''
          })
          currentStem = []
        }
        inAnswer = true
        currentAnswer.push(line.replace(answerPattern, '').trim())
      } else if (inAnswer) {
        if (examplePattern.test(line)) {
          if (currentAnswer.length > 0) {
            const lastStep = steps[steps.length - 1]
            if (lastStep) {
              lastStep.expression = renderInline(currentAnswer.join('\n'))
            }
            currentAnswer = []
          }
          inAnswer = false
          currentStem.push(line)
        } else {
          currentAnswer.push(line)
        }
      } else {
        currentStem.push(line)
      }
    })
    
    if (currentStem.length > 0) {
      steps.push({
        description: renderInline(currentStem.join('\n')),
        expression: currentAnswer.length > 0 ? renderInline(currentAnswer.join('\n')) : '',
        why: ''
      })
    }
    
    const stem = allExamples.slice(0, 3).join('\n')
    return { stem: renderInline(stem), steps, formula }
  }
  
  const stepPattern = /^第[一二三四五六七八九十百0-9]+步[：:.]?\s*|^步骤[一二三四五六七八九十百0-9]+[：:.]?\s*|^[0-9]+[.、)]\s*/
  const stepStartIdx: number[] = []
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue
    if (stepPattern.test(lines[i])) stepStartIdx.push(i)
    else if (/公式|核心公式/.test(lines[i]) && i > 0) continue
  }
  
  if (stepStartIdx.length === 0) {
    const stemLines = lines.filter(l => l && !/公式|核心公式|步骤|提示/.test(l))
    return { stem: renderInline(stemLines.join('\n')), steps: [], formula }
  }
  
  const stemLines = lines.slice(0, stepStartIdx[0]).filter(l => l && !/公式|核心公式/.test(l))
  const stem = stemLines.length > 0 ? stemLines.join('\n') : (lines[0] || '')
  for (let i = 0; i < stepStartIdx.length; i++) {
    const start = stepStartIdx[i]
    const end = i + 1 < stepStartIdx.length ? stepStartIdx[i + 1] : lines.length
    const block = lines.slice(start, end)
    const firstLine = block[0] || ''
    const restContent = block.slice(1).join('\n')
    const firstLineClean = firstLine.replace(stepPattern, '').trim()
    const description = firstLineClean || restContent || firstLine
    steps.push({
      description: renderInline(description),
      expression: '',
      why: ''
    })
  }
  return { stem: renderInline(stem), steps, formula }
}

interface ParseMistakeResult { mistakes: CommonMistake[] }

function parseMistakeCard(content: string): ParseMistakeResult {
  const rawLines = content.replace(/\r\n/g, '\n').split('\n')
  const lines = rawLines.map((l) => l.trim())
  const mistakeIdx = lines.reduce<number[]>((acc, l, i) => { if (/^错误[：:.]|^错误\s*\d/.test(l)) acc.push(i); return acc }, [])
  const mistakes: CommonMistake[] = []
  if (mistakeIdx.length === 0) {
    const reasonIdx = lines.findIndex((l) => /原因[：:]|^原因/i.test(l))
    const correctionIdx = lines.findIndex((l) => /纠正[：:]|^纠正/i.test(l))
    if (reasonIdx !== -1 && correctionIdx !== -1) {
      const reason = (lines[reasonIdx].split(/[：:]/, 2)[1] || lines[reasonIdx]).trim()
      const correction = (lines[correctionIdx].split(/[：:]/, 2)[1] || lines[correctionIdx]).trim()
      const mistake = lines.slice(0, reasonIdx).filter((l) => l && !/原因|纠正/.test(l)).join(' ')
      mistakes.push({ mistake: mistake || '未提供', reason, correction, errorLayer: detectErrorLayer(lines.join(' ')) })
    }
    return { mistakes }
  }
  for (let i = 0; i < mistakeIdx.length; i++) {
    const start = mistakeIdx[i]
    const end = i + 1 < mistakeIdx.length ? mistakeIdx[i + 1] : lines.length
    const block = lines.slice(start, end)
    let mistake = '', reason = '', correction = ''
    let currentKey: 'mistake' | 'reason' | 'correction' = 'mistake'
    const buckets: Record<string, string[]> = { mistake: [], reason: [], correction: [] }
    for (const line of block) {
      if (/^错误[：:.\s]|^错误\d+/i.test(line)) { currentKey = 'mistake'; const rest = line.replace(/^错误[：:.\s\d一二三四五六七八九十]*/i, '').trim(); if (rest) buckets[currentKey].push(rest) }
      else if (/^原因[：:.\s]|^原因/i.test(line)) { currentKey = 'reason'; const rest = line.replace(/^原因[：:.\s]*/i, '').trim(); if (rest) buckets[currentKey].push(rest) }
      else if (/^纠正[：:.\s]|^纠正|^正确|^修正/i.test(line)) { currentKey = 'correction'; const rest = line.replace(/^(纠正|正确|修正)[：:.\s]*/i, '').trim(); if (rest) buckets[currentKey].push(rest) }
      else if (line) buckets[currentKey].push(line)
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

function renderCardProps(card: CardBlock) {
  const base = { title: card.title || '' }
  switch (card.type) {
    case 'example': {
      const { stem, steps, formula } = parseExampleCard(card.content || '')
      return { ...base, content: markdownToHtml(card.content || ''), stem: markdownToHtml(stem), steps, formula }
    }
    case 'variant': { return { ...base, content: markdownToHtml(card.content || ''), stem: markdownToHtml(card.content || ''), variantIndex: card.variantIndex } }
    case 'mistake': { const { mistakes } = parseMistakeCard(card.content || ''); return { ...base, content: markdownToHtml(card.content || ''), mistakes } }
    case 'parent-child': { return { ...base, content: markdownToHtml(card.content || ''), script: card.content || '' } }
    default: return { ...base, content: markdownToHtml(card.content || '') }
  }
}

async function fetchTopic() {
  if (!topicId.value) return
  loading.value = true; error.value = null; topic.value = null
  try {
    const result = await loadTopic(topicId.value)
    if (!result) error.value = '未找到该专题'; else topic.value = result
  } catch (err) {
    console.error('[TopicDetail] 加载失败:', err); error.value = '内容加载失败，请稍后重试'
  } finally { loading.value = false }
}

function goBack() { router.push('/learning') }
function goToQuiz() { if (!topicId.value) return; router.push(`/quiz/${topicId.value}`) }
function goToPostTest() { if (!topicId.value) return; router.push(`/post-test/${topicId.value}`) }

onMounted(fetchTopic)
watch(topicId, fetchTopic)
</script>

<template>
  <div class="topic-detail">
    <!-- 面包屑 -->
    <div class="td-breadcrumb">
      <a class="td-breadcrumb-link" @click="goBack">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>知识地图</span>
      </a>
      <span class="td-breadcrumb-sep">›</span>
      <span class="td-breadcrumb-link">{{ gradeLabel }}</span>
      <span class="td-breadcrumb-sep">›</span>
      <span class="td-breadcrumb-current">{{ topic?.title || '加载中...' }}</span>
    </div>

    <div v-if="loading" class="td-loading">
      <div class="td-loading-spinner"></div>
      <p>课件加载中...</p>
    </div>

    <div v-else-if="error" class="td-error">
      <div class="td-error-icon">🚧</div>
      <h2>{{ error }}</h2>
      <p>该专题的课件正在精心编写中，敬请期待！</p>
      <div class="td-error-actions">
        <button class="td-btn td-btn--ghost" @click="fetchTopic">重新加载</button>
        <button class="td-btn td-btn--primary" @click="goBack">返回专题列表</button>
      </div>
    </div>

    <template v-else-if="topic">
      <!-- 页头 Hero -->
      <header class="td-hero">
        <div class="td-hero-tags">
          <span class="td-tag td-tag--grade">{{ topic.grade }}年级</span>
          <span class="td-tag" :class="topic.category === 'basic' ? 'td-tag--basic' : 'td-tag--oly'">
            {{ topic.category === 'basic' ? '校内基础' : '奥数专题' }}
          </span>
          <span class="td-tag td-tag--diff" :title="`难度 ${topic.difficulty}/5`">
            <span v-for="i in 5" :key="i" class="td-star" :class="{ 'td-star--on': i <= topic.difficulty }">★</span>
          </span>
        </div>
        <h1 class="td-hero-title">{{ topic.title }}</h1>
        <p v-if="topic.summary" class="td-hero-summary">{{ topic.summary }}</p>
      </header>

      <!-- 内容卡片 -->
      <section class="td-cards">
        <component
          v-for="(card, idx) in topic.cards"
          :key="`${card.type}-${idx}`"
          :is="cardComponentMap[card.type]"
          v-bind="renderCardProps(card)"
          class="td-card-wrap"
        />
        <div v-if="topic.cards.length === 0" class="td-card td-card--empty">
          <div class="td-empty-icon">📝</div>
          <h3>暂无学习卡片</h3>
          <p>该专题的学习卡片正在编写中，敬请期待。</p>
        </div>
      </section>

      <!-- 底部操作 -->
      <section class="td-actions">
        <button class="td-action-btn td-action-btn--primary" @click="goToQuiz">
          <div class="td-action-icon">✏️</div>
          <div class="td-action-content">
            <strong>开始练习</strong>
            <small>通过题目巩固知识点</small>
          </div>
          <div class="td-action-arrow">→</div>
        </button>
        <button class="td-action-btn td-action-btn--secondary" @click="goToPostTest">
          <div class="td-action-icon">🎯</div>
          <div class="td-action-content">
            <strong>掌握测验</strong>
            <small>检测是否真正理解</small>
          </div>
          <div class="td-action-arrow">→</div>
        </button>
      </section>
    </template>
  </div>
</template>

<style scoped>
.topic-detail {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

/* 面包屑 */
.td-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  font-size: 13px;
  color: var(--text-secondary);
  flex-wrap: wrap;
}
.td-breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;
}
.td-breadcrumb-link:hover { color: var(--color-primary); }
.td-breadcrumb-sep { color: var(--border-color); font-weight: 700; font-size: 16px; }
.td-breadcrumb-current {
  color: var(--text-primary);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

/* Loading */
.td-loading {
  text-align: center;
  padding: 80px 24px;
  background: var(--bg-card);
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
}
.td-loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: td-spin 1s linear infinite;
}
@keyframes td-spin { to { transform: rotate(360deg); } }
.td-loading p { color: var(--text-secondary); margin: 0; font-size: 15px; }

/* Error */
.td-error {
  text-align: center;
  padding: 60px 24px;
  background: var(--bg-card);
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
}
.td-error-icon { font-size: 56px; margin-bottom: 16px; }
.td-error h2 { font-size: 22px; color: var(--text-primary); margin: 0 0 8px; }
.td-error p { color: var(--text-secondary); font-size: 14px; margin: 0 0 24px; }
.td-error-actions { display: flex; justify-content: center; gap: 12px; }

/* Hero */
.td-hero {
  background: var(--bg-card);
  border-radius: 28px;
  padding: 40px 36px;
  margin-bottom: 28px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}
.td-hero-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.td-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.td-tag--grade { background: var(--bg-hover); color: var(--text-secondary); }
.td-tag--basic { background: rgba(16,185,129,0.12); color: var(--color-success); }
.td-tag--oly { background: rgba(245,158,11,0.12); color: var(--color-warning); }
.td-tag--diff { background: var(--color-primary-soft); color: var(--color-primary); }
.td-star { color: var(--border-color-strong); }
.td-star--on { color: var(--color-warning); }
.td-hero-title {
  font-size: 30px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 14px;
  letter-spacing: -0.02em;
  line-height: 1.3;
}
.td-hero-summary {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.7;
  max-width: 700px;
}

/* 卡片列表 */
.td-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}
.td-card--empty {
  text-align: center;
  padding: 48px 24px;
}
.td-empty-icon { font-size: 48px; margin-bottom: 12px; }
.td-card--empty h3 { font-size: 17px; color: var(--text-primary); margin: 0 0 6px; }
.td-card--empty p { color: var(--text-muted); font-size: 14px; margin: 0; }

/* 操作按钮 */
.td-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.td-action-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  font-family: inherit;
}
.td-action-btn:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.td-action-btn--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  box-shadow: var(--shadow-primary);
}
.td-action-btn--secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}
.td-action-btn--secondary strong { color: var(--text-primary); }
.td-action-btn--secondary small { color: var(--text-secondary); }

.td-action-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  border-radius: 16px;
  font-size: 26px;
  flex-shrink: 0;
}
.td-action-btn--secondary .td-action-icon {
  background: var(--card-yellow-bg);
}
.td-action-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.td-action-content strong { font-size: 17px; font-weight: 700; }
.td-action-content small { font-size: 12px; opacity: 0.85; font-weight: 500; }
.td-action-arrow {
  font-size: 20px;
  font-weight: 700;
  opacity: 0.85;
}

/* 通用按钮 */
.td-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  font-family: inherit;
}
.td-btn--primary { background: var(--color-primary); color: white; }
.td-btn--primary:hover { background: var(--color-primary-dark); }
.td-btn--ghost { background: var(--bg-card); color: var(--text-secondary); border-color: var(--border-color); }
.td-btn--ghost:hover { background: var(--bg-hover); }

/* 响应式 */
@media (max-width: 640px) {
  .topic-detail { padding: 20px 16px 60px; }
  .td-hero { padding: 28px 20px; border-radius: 20px; }
  .td-hero-title { font-size: 24px; }
  .td-hero-summary { font-size: 14px; }
  .td-actions { grid-template-columns: 1fr; }
  .td-action-btn { padding: 20px 24px; }
}
</style>
