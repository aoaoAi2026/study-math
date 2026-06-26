<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.init()
})

// 年级选项
const grades = [
  { value: 'all', label: '全部年级', icon: '🌟' },
  { value: '1', label: '一年级', icon: '1️⃣' },
  { value: '2', label: '二年级', icon: '2️⃣' },
  { value: '3', label: '三年级', icon: '3️⃣' },
  { value: '4', label: '四年级', icon: '4️⃣' },
  { value: '5', label: '五年级', icon: '5️⃣' },
  { value: '6', label: '六年级', icon: '6️⃣' }
]

// 分类选项
const categories = [
  { value: 'all', label: '全部', icon: '📚' },
  { value: 'basic', label: '基础', icon: '📖' },
  { value: 'olympiad', label: '奥数', icon: '🏆' },
  { value: 'review', label: '综合复习', icon: '🔄' }
]

// 选中状态
const selectedGrade = ref('all')
const selectedCategory = ref('all')
const searchKeyword = ref('')
const loading = ref(false)

// 题库数据（从 index.json 加载）
const questionBanks = ref<any[]>([])
const allBanks = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await fetch('/content/question-bank/index.json')
    const data = await res.json()
    allBanks.value = data.banks || []
    questionBanks.value = allBanks.value
  } catch (e) {
    console.error('加载题库索引失败:', e)
  }
})

// 筛选后的题库
const filteredBanks = computed(() => {
  return allBanks.value.filter(bank => {
    const gradeOk = selectedGrade.value === 'all' || String(bank.grade) === selectedGrade.value
    const categoryOk = selectedCategory.value === 'all' || bank.category === selectedCategory.value
    const keywordOk = !searchKeyword.value || 
      bank.topicName.includes(searchKeyword.value) || 
      bank.topicId.includes(searchKeyword.value)
    return gradeOk && categoryOk && keywordOk
  })
})

// 按年级分组
const groupedBanks = computed(() => {
  const groups: Record<string, any[]> = {}
  filteredBanks.value.forEach(bank => {
    const grade = bank.grade === 0 ? '综合复习' : `G${bank.grade}`
    if (!groups[grade]) groups[grade] = []
    groups[grade].push(bank)
  })
  return groups
})

// 难度颜色
const difficultyColors: Record<string, string> = {
  '入门': '#52c41a',
  '基础': '#1890ff',
  '进阶': '#faad14',
  '拔高': '#fa8c16',
  '竞赛': '#f5222d'
}

// 题库分类图标
const categoryIcons: Record<string, string> = {
  '基础': '📖',
  '奥数': '🏆',
  '复习': '🔄'
}

// 跳转到题库练习
const startPractice = (bank: any) => {
  router.push(`/quiz/${bank.topicId}`)
}

// 统计
const stats = computed(() => ({
  totalBanks: allBanks.value.length,
  totalQuestions: allBanks.value.reduce((sum, b) => sum + (b.questionCount || 0), 0),
  basicCount: allBanks.value.filter(b => b.category === '基础').length,
  olympiadCount: allBanks.value.filter(b => b.category === '奥数').length,
  reviewCount: allBanks.value.filter(b => b.category === '复习').length
}))
</script>

<template>
  <div class="question-bank">
    <!-- 顶部统计 -->
    <section class="stats-bar">
      <div class="stats-bar__inner">
        <div class="stat-item">
          <span class="stat-item__value">{{ stats.totalBanks }}</span>
          <span class="stat-item__label">题库总数</span>
        </div>
        <div class="stat-item">
          <span class="stat-item__value">{{ stats.totalQuestions }}</span>
          <span class="stat-item__label">题目总量</span>
        </div>
        <div class="stat-item">
          <span class="stat-item__value">{{ stats.basicCount }}</span>
          <span class="stat-item__label">基础题库</span>
        </div>
        <div class="stat-item">
          <span class="stat-item__value">{{ stats.olympiadCount }}</span>
          <span class="stat-item__label">奥数题库</span>
        </div>
      </div>
    </section>

    <!-- 搜索和筛选 -->
    <section class="filters">
      <div class="search-box">
        <span class="search-box__icon">🔍</span>
        <input 
          v-model="searchKeyword"
          type="text"
          class="search-box__input"
          placeholder="搜索题库名称..."
        />
      </div>

      <div class="filter-group">
        <span class="filter-group__label">年级：</span>
        <div class="filter-group__pills">
          <button
            v-for="g in grades"
            :key="g.value"
            :class="['pill', { active: selectedGrade === g.value }]"
            @click="selectedGrade = g.value"
          >
            {{ g.icon }} {{ g.label }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <span class="filter-group__label">分类：</span>
        <div class="filter-group__pills">
          <button
            v-for="c in categories"
            :key="c.value"
            :class="['pill', { active: selectedCategory === c.value }]"
            @click="selectedCategory = c.value"
          >
            {{ c.icon }} {{ c.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- 结果统计 -->
    <div class="results-info">
      共找到 <strong>{{ filteredBanks.length }}</strong> 个题库
    </div>

    <!-- 题库列表 -->
    <div class="bank-list">
      <div 
        v-for="(banks, gradeLabel) in groupedBanks" 
        :key="gradeLabel"
        class="bank-group"
      >
        <h3 class="bank-group__title">
          {{ gradeLabel === '综合复习' ? '🔄 综合复习' : `📚 ${gradeLabel}年级` }}
          <span class="bank-group__count">{{ banks.length }} 个题库</span>
        </h3>
        
        <div class="bank-grid">
          <div
            v-for="bank in banks"
            :key="bank.topicId"
            class="bank-card"
            @click="startPractice(bank)"
          >
            <div class="bank-card__header">
              <span class="bank-card__icon">
                {{ bank.category === '基础' ? '📖' : bank.category === '奥数' ? '🏆' : '🔄' }}
              </span>
              <span class="bank-card__badge" :class="`badge--${bank.category}`">
                {{ bank.category }}
              </span>
            </div>
            
            <h4 class="bank-card__title">{{ bank.topicName }}</h4>
            <p class="bank-card__id">ID: {{ bank.topicId }}</p>
            
            <div class="bank-card__meta">
              <span class="bank-card__count">📝 {{ bank.questionCount }} 题</span>
              <span class="bank-card__difficulty">
                <span 
                  v-for="(count, diff) in bank.difficultyDistribution" 
                  :key="diff"
                  v-show="count > 0"
                  class="diff-dot"
                  :style="{ background: difficultyColors[diff] || '#ccc' }"
                  :title="`${diff}: ${count}题`"
                ></span>
              </span>
            </div>

            <button class="bank-card__btn">开始练习 →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredBanks.length === 0" class="empty-state">
      <div class="empty-state__icon">📭</div>
      <p>没有找到匹配的题库</p>
      <button @click="selectedGrade = 'all'; selectedCategory = 'all'; searchKeyword = ''">
        清除筛选
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-bank {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 2rem;
}

/* 统计栏 */
.stats-bar {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  padding: 1rem;
}

.stats-bar__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-item__value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
}

.stat-item__label {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* 筛选区 */
.filters {
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 0 1rem;
}

.search-box {
  background: white;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.search-box__icon {
  font-size: 1.25rem;
}

.search-box__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.filter-group__label {
  color: white;
  font-weight: 600;
  min-width: 50px;
}

.filter-group__pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pill {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.pill:hover {
  background: rgba(255,255,255,0.3);
}

.pill.active {
  background: white;
  color: #667eea;
  border-color: white;
}

/* 结果统计 */
.results-info {
  max-width: 1200px;
  margin: 0 auto 1rem;
  padding: 0 1rem;
  color: rgba(255,255,255,0.9);
}

/* 题库列表 */
.bank-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.bank-group {
  margin-bottom: 2rem;
}

.bank-group__title {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bank-group__count {
  font-size: 0.875rem;
  opacity: 0.7;
  font-weight: normal;
}

.bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

/* 题库卡片 */
.bank-card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.bank-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.bank-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.bank-card__icon {
  font-size: 1.5rem;
}

.bank-card__badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
  font-weight: 600;
}

.badge--基础 {
  background: #e6f7ff;
  color: #1890ff;
}

.badge--奥数 {
  background: var(--card-orange-bg);
  color: var(--card-orange-text);
}

.badge--复习 {
  background: rgba(16, 185, 129, 0.1);
  color: #52c41a;
}

.bank-card__title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.bank-card__id {
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 0.75rem;
}

.bank-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.bank-card__count {
  font-size: 0.875rem;
  color: #666;
}

.bank-card__difficulty {
  display: flex;
  gap: 4px;
}

.diff-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.bank-card__btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.bank-card__btn:hover {
  opacity: 0.9;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255,255,255,0.8);
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state button {
  margin-top: 1rem;
  background: white;
  color: #667eea;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-bar__inner {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .bank-grid {
    grid-template-columns: 1fr;
  }
}
</style>
