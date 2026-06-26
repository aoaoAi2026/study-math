<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 试卷列表（从 exam/_index.json 动态加载）
interface Paper {
  id: string
  paperId: string
  title: string
  grade: number
  category: string
  duration: number
  totalScore: number
  difficultyLevel: number
  year: number
  source: string
  questionCount: number
}

const papers = ref<Paper[]>([])
const loading = ref(true)
const errorMsg = ref('')

// 筛选
const selectedGrade = ref('all')
const selectedCategory = ref('all')

const grades = [
  { value: 'all', label: '全部年级' },
  { value: '1', label: '一年级' },
  { value: '2', label: '二年级' },
  { value: '3', label: '三年级' },
  { value: '4', label: '四年级' },
  { value: '5', label: '五年级' },
  { value: '6', label: '六年级' }
]

const categories = [
  { value: 'all', label: '全部类型', icon: '📚' },
  { value: 'aoshu-huabei', label: '华罗庚金杯', icon: '🏆' },
  { value: 'aoshu-xiwang', label: '希望杯', icon: '🌟' },
  { value: 'final-exam', label: '校内期末考试', icon: '📝' },
  { value: 'school-final', label: '校内期末考试', icon: '📝' }
]

// 加载索引
onMounted(async () => {
  try {
    const resp = await fetch('/content/question-bank/exam/_index.json')
    if (!resp.ok) throw new Error('HTTP ' + resp.status)
    papers.value = await resp.json()
  } catch (e) {
    console.error('加载考题索引失败:', e)
    errorMsg.value = '加载失败，请刷新重试'
  } finally {
    loading.value = false
  }
})

// 统计
const gradeStats = computed(() => {
  const s: Record<string, number> = {}
  papers.value.forEach(p => {
    s[p.grade] = (s[p.grade] || 0) + 1
  })
  return s
})

const totalPapers = computed(() => papers.value.length)
const totalQuestions = computed(() => papers.value.reduce((sum, p) => sum + p.questionCount, 0))

// 筛选后的列表
const filteredPapers = computed(() => {
  return papers.value.filter(p => {
    const gradeOk = selectedGrade.value === 'all' || String(p.grade) === selectedGrade.value
    const catOk = selectedCategory.value === 'all' || p.category === selectedCategory.value ||
                  (selectedCategory.value === 'final-exam' && p.category === 'school-final') ||
                  (selectedCategory.value === 'school-final' && p.category === 'final-exam')
    return gradeOk && catOk
  })
})

// 按年级分组
const groupedPapers = computed(() => {
  const groups: Record<string, Paper[]> = {}
  filteredPapers.value.forEach(p => {
    const k = 'g' + p.grade
    if (!groups[k]) groups[k] = []
    groups[k].push(p)
  })
  return groups
})

function categoryLabel(cat: string): string {
  if (cat === 'aoshu-huabei') return '华杯赛'
  if (cat === 'aoshu-xiwang') return '希望杯'
  if (cat === 'final-exam' || cat === 'school-final') return '期末考试'
  return '模拟'
}

function categoryIcon(cat: string): string {
  if (cat === 'aoshu-huabei') return '🏆'
  if (cat === 'aoshu-xiwang') return '🌟'
  if (cat === 'final-exam' || cat === 'school-final') return '📝'
  return '📄'
}

function categoryColor(cat: string): string {
  if (cat === 'aoshu-huabei') return 'linear-gradient(135deg, #f59e0b, #d97706)'
  if (cat === 'aoshu-xiwang') return 'linear-gradient(135deg, #06b6d4, #0891b2)'
  if (cat === 'final-exam' || cat === 'school-final') return 'linear-gradient(135deg, #22c55e, #16a34a)'
  return 'linear-gradient(135deg, #6366f1, #8b5cf6)'
}

function difficultyLabel(level: number): string {
  const labels = ['', '入门', '基础', '中等', '困难', '竞赛']
  return labels[level] || '中等'
}

function startExam(paper: Paper) {
  router.push(`/exam/${encodeURIComponent(paper.id)}`)
}
</script>

<template>
  <div class="exam-hub">
    <!-- 顶部标题 -->
    <header class="hub-header">
      <div class="hub-header__inner">
        <div class="hub-header__icon">📋</div>
        <div class="hub-header__text">
          <h1>考题中心</h1>
          <p>
            <span>共 <strong>{{ totalPapers }}</strong> 份真题试卷</span>
            <span class="dot-sep">·</span>
            <span>总计 <strong>{{ totalQuestions }}</strong> 道题目</span>
            <span class="dot-sep">·</span>
            <span>覆盖 <strong>1-6年级</strong></span>
          </p>
        </div>
        <div class="hub-header__stats">
          <div class="stat-card" v-for="g in ['1','2','3','4','5','6']" :key="g">
            <span class="stat-grade">{{ g }}年级</span>
            <span class="stat-num">{{ gradeStats[Number(g)] || 0 }}份</span>
          </div>
        </div>
      </div>
    </header>

    <div class="hub-container">
      <!-- 筛选栏 -->
      <section class="hub-filters" v-if="!loading">
        <div class="filter-row">
          <span class="filter-label">年级：</span>
          <div class="filter-pills">
            <button
              v-for="g in grades"
              :key="g.value"
              :class="['pill', { active: selectedGrade === g.value }]"
              @click="selectedGrade = g.value"
            >
              {{ g.label }}
            </button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label">类型：</span>
          <div class="filter-pills">
            <button
              v-for="(c, idx) in [
                { value: 'all', label: '全部', icon: '📚' },
                { value: 'aoshu-huabei', label: '华杯赛', icon: '🏆' },
                { value: 'aoshu-xiwang', label: '希望杯', icon: '🌟' },
                { value: 'final-exam', label: '期末考试', icon: '📝' }
              ]"
              :key="c.value"
              :class="['pill pill--cat', { active: selectedCategory === c.value }]"
              @click="selectedCategory = c.value"
            >
              <span class="pill-icon">{{ c.icon }}</span>
              {{ c.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>正在加载真题试卷...</p>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="error-state">
        <p>❌ {{ errorMsg }}</p>
      </div>

      <!-- 试卷列表 - 按年级分组展示 -->
      <section v-else class="grade-sections">
        <template v-for="(plist, gkey) in groupedPapers" :key="gkey">
          <div class="grade-section">
            <h2 class="grade-title">
              <span class="grade-title__num">{{ plist[0].grade }}</span>
              <span class="grade-title__text">年级</span>
              <span class="grade-title__count">{{ plist.length }}份真题</span>
            </h2>

            <div class="paper-grid">
              <div
                v-for="paper in plist"
                :key="paper.id"
                class="paper-card"
                :style="{ '--card-color': categoryColor(paper.category) }"
              >
                <div class="paper-card__header">
                  <span class="paper-card__cat">{{ categoryIcon(paper.category) }}</span>
                  <span class="paper-card__type">{{ categoryLabel(paper.category) }}</span>
                  <span class="paper-card__year">{{ paper.year }}年</span>
                </div>

                <h3 class="paper-card__title">{{ paper.title }}</h3>

                <div class="paper-card__meta">
                  <div class="meta-item">
                    <span class="meta-item__icon">📝</span>
                    <span>{{ paper.questionCount }} 题</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-item__icon">⏱️</span>
                    <span>{{ paper.duration }} 分钟</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-item__icon">💯</span>
                    <span>{{ paper.totalScore }} 分</span>
                  </div>
                  <div class="meta-item meta-item--diff">
                    <span class="meta-item__icon">🎯</span>
                    <span>{{ difficultyLabel(paper.difficultyLevel) }}</span>
                  </div>
                </div>

                <button class="paper-card__btn" @click="startExam(paper)">
                  <span>开始考试</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </template>

        <div v-if="Object.keys(groupedPapers).length === 0" class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <p>没有找到符合条件的试卷</p>
          <button @click="selectedGrade='all'; selectedCategory='all'">清除筛选</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.exam-hub {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%);
}

/* 头部 */
.hub-header {
  background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15));
  backdrop-filter: blur(12px);
  padding: 2.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hub-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.hub-header__icon {
  font-size: 4rem;
  filter: drop-shadow(0 4px 12px rgba(99,102,241,0.4));
}

.hub-header__text {
  flex: 1;
  min-width: 240px;
}

.hub-header__text h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #e0e7ff, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hub-header__text p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 1rem;
  line-height: 1.8;
}

.hub-header__text p strong {
  color: #fbbf24;
  font-weight: 700;
}

.dot-sep {
  margin: 0 0.5rem;
  opacity: 0.5;
}

.hub-header__stats {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 72px;
}

.stat-grade {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-num {
  color: #fbbf24;
  font-size: 1.25rem;
  font-weight: 800;
  margin-top: 0.15rem;
}

/* 容器 */
.hub-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

/* 筛选栏 */
.hub-filters {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 2.5rem;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.4rem 0;
}

.filter-row + .filter-row {
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  margin-top: 0.4rem;
  padding-top: 0.8rem;
}

.filter-label {
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
  min-width: 48px;
  font-size: 0.95rem;
}

.filter-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.pill {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.pill:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.pill.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 14px rgba(99,102,241,0.4);
}

.pill-icon {
  font-size: 0.9rem;
}

/* Loading / Empty */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99,102,241,0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-state button {
  margin-top: 1rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

/* 按年级分组 */
.grade-section {
  margin-bottom: 3rem;
}

.grade-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.grade-title__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  font-size: 1.25rem;
  box-shadow: 0 4px 14px rgba(99,102,241,0.4);
}

.grade-title__text {
  color: #fff;
}

.grade-title__count {
  margin-left: auto;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
}

/* 试卷卡片网格 */
.paper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.paper-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.paper-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
  border-radius: 20px 20px 0 0;
  opacity: 0.9;
}

.paper-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.paper-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
}

.paper-card__cat {
  font-size: 1.1rem;
}

.paper-card__type {
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
}

.paper-card__year {
  margin-left: auto;
  font-weight: 500;
  opacity: 0.7;
}

.paper-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1rem;
  line-height: 1.5;
  min-height: 3.45rem;
}

.paper-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
  margin-bottom: 1.25rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.3rem 0.65rem;
  border-radius: 8px;
}

.meta-item__icon {
  font-size: 0.85rem;
}

.meta-item--diff {
  color: #fbbf24;
  font-weight: 600;
}

.paper-card__btn {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.paper-card__btn:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(99,102,241,0.45);
}

.paper-card__btn:active {
  transform: scale(0.98);
}

/* 响应式 */
@media (max-width: 768px) {
  .hub-header {
    padding: 1.75rem 1rem;
  }
  .hub-header__icon {
    font-size: 3rem;
  }
  .hub-header__text h1 {
    font-size: 1.75rem;
  }
  .hub-container {
    padding: 1.5rem 1rem 3rem;
  }
  .paper-grid {
    grid-template-columns: 1fr;
  }
  .grade-title {
    font-size: 1.35rem;
  }
  .hub-header__stats {
    width: 100%;
  }
  .stat-card {
    flex: 1;
  }
}
</style>
