<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { listTopics } from '@/services/contentLoader'
import type { TopicIndex } from '@/types/content'

interface KnowledgeNode extends TopicIndex {
  progress: number
  completed: boolean
  locked: boolean
}

const router = useRouter()
const userStore = useUserStore()

const selectedGrade = ref<number | 'all'>('all')
const selectedCategory = ref<'all' | 'basic' | 'olympiad'>('all')

const grades = [
  { value: 'all' as const, label: '全部' },
  { value: 1, label: '一年级' },
  { value: 2, label: '二年级' },
  { value: 3, label: '三年级' },
  { value: 4, label: '四年级' },
  { value: 5, label: '五年级' },
  { value: 6, label: '六年级' },
]

const categories: { value: 'all' | 'basic' | 'olympiad'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'basic', label: '校内基础' },
  { value: 'olympiad', label: '奥数专题' },
]

const allNodes = ref<KnowledgeNode[]>([])

onMounted(async () => {
  userStore.init()
  const topics = listTopics()
  allNodes.value = topics.map(t => {
    const progress = userStore.getTopicProgress(t.id)
    return {
      ...t,
      progress,
      completed: progress >= 100,
      locked: false
    }
  })
})

const filteredNodes = computed(() =>
  allNodes.value.filter(n => {
    if (selectedGrade.value !== 'all' && n.grade !== selectedGrade.value) return false
    if (selectedCategory.value !== 'all' && n.category !== selectedCategory.value) return false
    return true
  })
)

// 按年级分组
const groupedNodes = computed(() => {
  const groups: Record<number, KnowledgeNode[]> = {}
  for (const node of filteredNodes.value) {
    if (!groups[node.grade]) groups[node.grade] = []
    groups[node.grade].push(node)
  }
  return groups
})

const sortedGrades = computed(() => Object.keys(groupedNodes.value).map(Number).sort((a, b) => a - b))

const stats = computed(() => {
  const nodes = filteredNodes.value
  const total = nodes.length
  const completed = nodes.filter(n => n.completed).length
  const inProgress = nodes.filter(n => n.progress > 0 && !n.completed).length
  const pct = total ? Math.round((completed / total) * 100) : 0
  return { total, completed, inProgress, pct }
})

function stars(d: number) {
  return '★'.repeat(d) + '☆'.repeat(5 - d)
}

function goNode(node: KnowledgeNode) {
  if (node.locked) return
  router.push(`/learning/topic/${node.id}`)
}

function gradeLabel(g: number) {
  const labels: Record<number, string> = {
    1: '一年级', 2: '二年级', 3: '三年级',
    4: '四年级', 5: '五年级', 6: '六年级'
  }
  return labels[g] || `${g}年级`
}

function getActionClass(node: KnowledgeNode) {
  if (node.completed) return 'km-node-action--done'
  if (node.locked) return 'km-node-action--locked'
  if (node.progress > 0) return 'km-node-action--continue'
  return 'km-node-action--start'
}

function getActionText(node: KnowledgeNode) {
  if (node.completed) return '已掌握'
  if (node.locked) return '未解锁'
  if (node.progress > 0) return '继续学习'
  return '开始学习'
}
</script>

<template>
  <div class="km">
    <div class="km-header">
      <h1 class="km-title">知识地图</h1>
      <p class="km-desc">系统掌握每一个知识点，从入门到精通</p>
    </div>

    <!-- 统计卡片 -->
    <div class="km-stats">
      <div class="km-stat">
        <div class="km-stat-icon">📚</div>
        <div class="km-stat-value">{{ stats.total }}</div>
        <div class="km-stat-label">知识点</div>
      </div>
      <div class="km-stat km-stat--done">
        <div class="km-stat-icon">✅</div>
        <div class="km-stat-value">{{ stats.completed }}</div>
        <div class="km-stat-label">已掌握</div>
      </div>
      <div class="km-stat km-stat--progress">
        <div class="km-stat-icon">📈</div>
        <div class="km-stat-value">{{ stats.inProgress }}</div>
        <div class="km-stat-label">学习中</div>
      </div>
      <div class="km-stat km-stat--pct">
        <div class="km-stat-icon">🎯</div>
        <div class="km-stat-value">{{ stats.pct }}%</div>
        <div class="km-stat-label">完成率</div>
      </div>
    </div>

    <!-- 筛选 -->
    <div class="km-filters">
      <div class="km-filter-row">
        <span class="km-filter-label">年级</span>
        <div class="km-filter-options">
          <button
            v-for="g in grades" :key="g.value"
            class="km-filter-btn"
            :class="{ active: selectedGrade === g.value }"
            @click="selectedGrade = g.value"
          >{{ g.label }}</button>
        </div>
      </div>
      <div class="km-filter-row">
        <span class="km-filter-label">分类</span>
        <div class="km-filter-options">
          <button
            v-for="c in categories" :key="c.value"
            class="km-filter-btn km-filter-btn--category"
            :class="{ active: selectedCategory === c.value, [`km-filter-btn--${c.value}`]: c.value !== 'all' }"
            @click="selectedCategory = c.value"
          >{{ c.label }}</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredNodes.length === 0 && allNodes.length > 0" class="km-empty">
      <div class="km-empty-icon">🔍</div>
      <p>没有匹配条件的知识点</p>
    </div>

    <div v-else>
      <div
        v-for="grade in sortedGrades" :key="grade"
        class="km-grade-section"
      >
        <div class="km-grade-header">
          <h2 class="km-grade-title">{{ gradeLabel(grade) }}</h2>
          <div class="km-grade-stats">
            <span class="km-grade-count">{{ groupedNodes[grade].length }} 个专题</span>
            <span class="km-grade-progress">
              {{ Math.round(groupedNodes[grade].filter(n => n.completed).length / groupedNodes[grade].length * 100) }}% 完成
            </span>
          </div>
        </div>
        
        <div class="km-grid">
          <div
            v-for="node in groupedNodes[grade]" :key="node.id"
            class="km-node"
            :class="{
              'km-node--done': node.completed,
              'km-node--locked': node.locked,
              'km-node--olympiad': node.category === 'olympiad'
            }"
            @click="goNode(node)"
          >
            <div class="km-node-top">
              <div class="km-node-icon-wrapper">
                <span class="km-node-icon">{{ node.icon }}</span>
              </div>
              <div class="km-node-info">
                <span class="km-node-name">{{ node.title }}</span>
                <div class="km-node-tags">
                  <span class="km-tag" :class="node.category === 'basic' ? 'km-tag--basic' : 'km-tag--oly'">
                    {{ node.category === 'basic' ? '基础' : '奥数' }}
                  </span>
                  <span class="km-tag km-tag--diff">{{ stars(node.difficulty) }}</span>
                </div>
              </div>
              <div class="km-node-status">
                <span v-if="node.completed" class="km-check">&#10003;</span>
                <span v-else-if="node.locked" class="km-lock">&#128274;</span>
              </div>
            </div>

            <p v-if="node.summary" class="km-node-summary">{{ node.summary }}</p>

            <div class="km-node-bottom">
              <div class="km-progress-wrap">
                <div class="km-progress-bar">
                  <div class="km-progress-fill" :style="{ width: node.progress + '%' }"></div>
                </div>
                <span class="km-progress-pct">{{ node.progress }}%</span>
              </div>
              <span class="km-node-action" :class="getActionClass(node)">
                {{ getActionText(node) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.km {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.km-header {
  text-align: center;
  margin-bottom: 3rem;
}

.km-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.km-desc {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin: 0;
  font-weight: 400;
}

/* 统计卡片 */
.km-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.km-stat {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 1.75rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.km-stat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--stat-color, var(--color-primary)), var(--stat-color-end, #8b5cf6));
}

.km-stat:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.km-stat--done {
  --stat-color: var(--color-success);
  --stat-color-end: #059669;
}

.km-stat--progress {
  --stat-color: var(--color-warning);
  --stat-color-end: #d97706;
}

.km-stat--pct {
  --stat-color: var(--color-primary);
  --stat-color-end: #8b5cf6;
}

.km-stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  opacity: 0.8;
}

.km-stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.km-stat--done .km-stat-value {
  background: linear-gradient(135deg, #059669 0%, var(--color-success) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.km-stat--progress .km-stat-value {
  background: linear-gradient(135deg, #d97706 0%, var(--color-warning) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.km-stat--pct .km-stat-value {
  background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.km-stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 筛选 */
.km-filters {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2.5rem;
  border: 1px solid var(--border-color);
}

.km-filter-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.km-filter-row:last-child {
  margin-bottom: 0;
}

.km-filter-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9375rem;
  min-width: 48px;
}

.km-filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.km-filter-btn {
  padding: 0.75rem 1.5rem;
  background: var(--bg-hover);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.km-filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.km-filter-btn.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

.km-filter-btn--basic.active {
  background: linear-gradient(135deg, var(--color-success) 0%, #059669 100%);
  border-color: var(--color-success);
}

.km-filter-btn--olympiad.active {
  background: linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%);
  border-color: var(--color-warning);
}

/* 空状态 */
.km-empty {
  text-align: center;
  padding: 4rem;
  background: var(--bg-card);
  border-radius: 24px;
  box-shadow: var(--shadow-sm);
}

.km-empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.km-empty p {
  color: var(--text-muted);
  font-size: 1rem;
}

/* 年级分组 */
.km-grade-section {
  margin-bottom: 3rem;
}

.km-grade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  background: var(--color-primary-soft);
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.km-grade-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.km-grade-title::before {
  content: '📚';
  font-size: 1.5rem;
}

.km-grade-stats {
  display: flex;
  gap: 1.5rem;
}

.km-grade-count,
.km-grade-progress {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.km-grade-progress {
  color: var(--color-success);
}

/* 知识卡片网格 */
.km-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.km-node {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.km-node::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--border-color) 0%, var(--border-color) 100%);
  transition: background 0.3s ease;
}

.km-node:hover:not(.km-node--locked) {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.km-node:hover:not(.km-node--locked)::before {
  background: linear-gradient(180deg, var(--color-primary) 0%, #8b5cf6 100%);
}

.km-node--done {
  border-color: rgba(16, 185, 129, 0.2);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-card) 100%);
}

.km-node--done::before {
  background: linear-gradient(180deg, var(--color-success) 0%, #059669 100%);
}

.km-node--olympiad:not(.km-node--done):not(:hover)::before {
  background: linear-gradient(180deg, var(--color-warning) 0%, #d97706 100%);
}

.km-node--locked {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--bg-hover);
}

.km-node-top {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.km-node-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.km-node:hover:not(.km-node--locked) .km-node-icon-wrapper {
  background: var(--color-primary-soft);
  transform: scale(1.1);
}

.km-node--done .km-node-icon-wrapper {
  background: rgba(16, 185, 129, 0.1);
}

.km-node-icon {
  font-size: 2.25rem;
}

.km-node-info {
  flex: 1;
  min-width: 0;
}

.km-node-name {
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.km-node-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.km-tag {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 10px;
  font-weight: 500;
}

.km-tag--grade {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.km-tag--basic {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.km-tag--oly {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.km-tag--diff {
  color: var(--color-warning);
  background: rgba(245, 158, 11, 0.08);
}

.km-node-status {
  flex-shrink: 0;
}

.km-check {
  color: var(--color-success);
  font-size: 1.5rem;
  font-weight: bold;
}

.km-lock {
  color: var(--text-muted);
  font-size: 1.25rem;
}

.km-node-summary {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  padding-left: 4px;
}

.km-node-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.km-progress-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.km-progress-bar {
  flex: 1;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.km-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, #8b5cf6 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.km-node--done .km-progress-fill {
  background: linear-gradient(90deg, var(--color-success) 0%, #059669 100%);
}

.km-progress-pct {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 36px;
  text-align: right;
}

.km-node-action {
  padding: 0.5rem 1.25rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.km-node-action--start {
  background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.km-node-action--continue {
  background: linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.km-node-action--done {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.km-node-action--locked {
  background: var(--bg-hover);
  color: var(--text-muted);
}

.km-node:hover .km-node-action--start,
.km-node:hover .km-node-action--continue {
  transform: scale(1.05);
}

/* 响应式 */
@media (max-width: 1024px) {
  .km-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .km {
    padding: 1rem;
  }
  
  .km-title {
    font-size: 1.75rem;
  }
  
  .km-stats {
    grid-template-columns: 1fr;
  }
  
  .km-grid {
    grid-template-columns: 1fr;
  }
}
</style>
