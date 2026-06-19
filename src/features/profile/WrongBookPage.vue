<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

interface WrongItem {
  id: string
  stem: string
  wrongAnswer: string
  correctAnswer: string
  knowledgeId: string
  knowledgeName: string
  errorLayer: 'L1' | 'L2' | 'L3' | 'L4'
  reviewed: boolean
  reviewCount: number
}

const STORAGE_KEY = 'wrong_book_data'

const defaultData: WrongItem[] = [
  { id: '1', stem: '小明有30个苹果，小红的苹果是小明的4倍，小红有多少个？', wrongAnswer: '30 + 4 = 34', correctAnswer: '30 × 4 = 120（个）', knowledgeId: 'sum-multiple', knowledgeName: '倍数问题', errorLayer: 'L1', reviewed: false, reviewCount: 0 },
  { id: '2', stem: '鸡和兔共10只，脚共28只，问鸡和兔各几只？', wrongAnswer: '鸡5只，兔5只', correctAnswer: '鸡6只，兔4只', knowledgeId: 'chicken-rabbit', knowledgeName: '鸡兔同笼', errorLayer: 'L3', reviewed: false, reviewCount: 0 },
  { id: '3', stem: '一个三角形底边8cm，高5cm，求面积', wrongAnswer: '8 × 5 = 40cm²', correctAnswer: '8 × 5 ÷ 2 = 20cm²', knowledgeId: 'triangle-area', knowledgeName: '三角形面积', errorLayer: 'L2', reviewed: false, reviewCount: 0 },
  { id: '4', stem: '把一根绳子对折3次后从中间剪一刀，绳子变成几段？', wrongAnswer: '6段', correctAnswer: '9段', knowledgeId: 'logic-thinking', knowledgeName: '逻辑推理', errorLayer: 'L4', reviewed: false, reviewCount: 0 },
  { id: '5', stem: '125 × 8 = ?', wrongAnswer: '125 × 8 = 900', correctAnswer: '125 × 8 = 1000', knowledgeId: 'calc-multiply', knowledgeName: '乘法计算', errorLayer: 'L3', reviewed: false, reviewCount: 0 },
  { id: '6', stem: '甲乙两车相向而行，甲速60km/h，乙速80km/h，相距280km，多久相遇？', wrongAnswer: '280 ÷ (60+80) = 3.5h', correctAnswer: '280 ÷ (60+80) = 2h', knowledgeId: 'meeting-problem', knowledgeName: '相遇问题', errorLayer: 'L3', reviewed: false, reviewCount: 0 },
  { id: '7', stem: '把3/4和2/5通分', wrongAnswer: '3/4 = 6/8，2/5 = 4/8', correctAnswer: '3/4 = 15/20，2/5 = 8/20', knowledgeId: 'fraction-common', knowledgeName: '分数通分', errorLayer: 'L2', reviewed: false, reviewCount: 0 },
  { id: '8', stem: '一个正方体棱长为3cm，求表面积', wrongAnswer: '3 × 3 × 3 = 27cm²', correctAnswer: '3 × 3 × 6 = 54cm²', knowledgeId: 'cube-surface', knowledgeName: '正方体表面积', errorLayer: 'L2', reviewed: false, reviewCount: 0 },
  { id: '9', stem: '题目要求求"剩余"数量，却求了"总共"数量', wrongAnswer: '直接计算了总数', correctAnswer: '应计算剩余部分', knowledgeId: 'reading', knowledgeName: '审题能力', errorLayer: 'L1', reviewed: false, reviewCount: 0 },
  { id: '10', stem: '找规律：2, 6, 12, 20, __，下一个数是？', wrongAnswer: '26', correctAnswer: '30（规律为n(n+1)）', knowledgeId: 'pattern-find', knowledgeName: '规律探索', errorLayer: 'L4', reviewed: false, reviewCount: 0 },
]

const loadData = (): WrongItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : [...defaultData]
  } catch { return [...defaultData] }
}

const wrongBook = ref<WrongItem[]>(loadData())
const activeFilter = ref<string>('all')

watch(wrongBook, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

const layerLabels: Record<string, string> = { all: '全部', L1: 'L1审题', L2: 'L2概念', L3: 'L3计算', L4: 'L4思维' }

const filtered = computed(() => {
  const list = activeFilter.value === 'all' ? wrongBook.value : wrongBook.value.filter(i => i.errorLayer === activeFilter.value)
  const groups: Record<string, WrongItem[]> = {}
  list.forEach(item => {
    if (!groups[item.knowledgeName]) groups[item.knowledgeName] = []
    groups[item.knowledgeName].push(item)
  })
  return groups
})

const stats = computed(() => {
  const total = wrongBook.value.length
  const layers = { L1: 0, L2: 0, L3: 0, L4: 0 }
  wrongBook.value.forEach(i => layers[i.errorLayer]++)
  return { total, ...layers }
})

const review = (id: string) => {
  const item = wrongBook.value.find(i => i.id === id)
  if (item) { item.reviewed = true; item.reviewCount++ }
}

const clearReviewed = () => {
  wrongBook.value = wrongBook.value.filter(i => !i.reviewed)
}
</script>

<template>
  <AppLayout>
    <div class="wrong-book">
      <h1>错题本</h1>

      <!-- 统计概览 -->
      <div class="wrong-book__stats">
        <div class="wrong-book__stat wrong-book__stat--total">
          <span class="wrong-book__stat-num">{{ stats.total }}</span>
          <span class="wrong-book__stat-label">总错题</span>
        </div>
        <div class="wrong-book__stat wrong-book__stat--l1"><span class="wrong-book__stat-num">{{ stats.L1 }}</span><span class="wrong-book__stat-label">L1审题</span></div>
        <div class="wrong-book__stat wrong-book__stat--l2"><span class="wrong-book__stat-num">{{ stats.L2 }}</span><span class="wrong-book__stat-label">L2概念</span></div>
        <div class="wrong-book__stat wrong-book__stat--l3"><span class="wrong-book__stat-num">{{ stats.L3 }}</span><span class="wrong-book__stat-label">L3计算</span></div>
        <div class="wrong-book__stat wrong-book__stat--l4"><span class="wrong-book__stat-num">{{ stats.L4 }}</span><span class="wrong-book__stat-label">L4思维</span></div>
      </div>

      <!-- 筛选 -->
      <div class="wrong-book__filters">
        <button v-for="(label, key) in layerLabels" :key="key" class="wrong-book__filter" :class="{ 'wrong-book__filter--active': activeFilter === key }" @click="activeFilter = key">{{ label }}</button>
      </div>

      <!-- 操作栏 -->
      <div class="wrong-book__actions">
        <span class="wrong-book__count">共 {{ Object.values(filtered).flat().length }} 道错题</span>
        <button class="wrong-book__clear" @click="clearReviewed">清除已掌握</button>
      </div>

      <!-- 按知识点分组 -->
      <div v-for="(items, groupName) in filtered" :key="groupName" class="wrong-book__group">
        <h3 class="wrong-book__group-title">{{ groupName }}（{{ items.length }}）</h3>
        <div class="wrong-book__list">
          <div v-for="item in items" :key="item.id" class="wrong-book__item" :class="{ 'wrong-book__item--reviewed': item.reviewed }">
            <div class="wrong-book__question">{{ item.stem }}</div>
            <div class="wrong-book__answers">
              <div class="wrong-book__answer wrong-book__answer--wrong"><span>错误答案</span><span>{{ item.wrongAnswer }}</span></div>
              <div class="wrong-book__answer wrong-book__answer--correct"><span>正确答案</span><span>{{ item.correctAnswer }}</span></div>
            </div>
            <div class="wrong-book__meta">
              <div class="wrong-book__tags">
                <span class="wrong-book__layer" :class="`wrong-book__layer--${item.errorLayer.toLowerCase()}`">{{ item.errorLayer }}</span>
                <span v-if="item.reviewCount" class="wrong-book__review-count">已复习 {{ item.reviewCount }} 次</span>
              </div>
              <button class="wrong-book__review" @click="review(item.id)">{{ item.reviewed ? '再复习' : '复习' }}</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!Object.keys(filtered).length" class="wrong-book__empty">暂无错题数据</div>
    </div>
  </AppLayout>
</template>

<style scoped>
.wrong-book { max-width: 640px; margin: 0 auto; padding: var(--space-4); }
.wrong-book h1 { text-align: center; margin-bottom: var(--space-4); font-size: var(--text-2xl); }

/* 统计概览 */
.wrong-book__stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-2); margin-bottom: var(--space-4); }
.wrong-book__stat { background: var(--bg-card); border-radius: var(--radius-lg); padding: var(--space-3); text-align: center; box-shadow: var(--shadow-sm); }
.wrong-book__stat-num { display: block; font-size: var(--text-xl); font-weight: 700; color: var(--color-primary); }
.wrong-book__stat-label { font-size: var(--text-xs); color: var(--text-secondary); }
.wrong-book__stat--l1 .wrong-book__stat-num { color: #3b82f6; }
.wrong-book__stat--l2 .wrong-book__stat-num { color: #f59e0b; }
.wrong-book__stat--l3 .wrong-book__stat-num { color: #ef4444; }
.wrong-book__stat--l4 .wrong-book__stat-num { color: #8b5cf6; }

/* 筛选 */
.wrong-book__filters { display: flex; gap: var(--space-2); margin-bottom: var(--space-4); flex-wrap: wrap; }
.wrong-book__filter { padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: var(--text-sm); background: var(--bg-card); color: var(--text-secondary); border: 1px solid var(--border-color); transition: all var(--transition-fast); }
.wrong-book__filter--active { background: var(--color-primary); color: var(--text-inverse); border-color: var(--color-primary); }

/* 操作栏 */
.wrong-book__actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
.wrong-book__count { color: var(--text-secondary); font-size: var(--text-sm); }
.wrong-book__clear { padding: var(--space-1) var(--space-3); font-size: var(--text-sm); color: var(--color-error); background: rgba(239,68,68,0.08); border-radius: var(--radius-lg); }

/* 分组 */
.wrong-book__group { margin-bottom: var(--space-6); }
.wrong-book__group-title { font-size: var(--text-base); color: var(--text-secondary); margin-bottom: var(--space-3); padding-left: var(--space-2); border-left: 3px solid var(--color-primary); }

/* 列表 */
.wrong-book__list { display: flex; flex-direction: column; gap: var(--space-3); }
.wrong-book__item { background: var(--bg-card); border-radius: var(--radius-xl); padding: var(--space-4); box-shadow: var(--shadow-sm); transition: opacity var(--transition-fast); }
.wrong-book__item--reviewed { opacity: 0.7; }
.wrong-book__question { font-weight: 500; color: var(--text-primary); margin-bottom: var(--space-3); line-height: var(--leading-relaxed); }
.wrong-book__answers { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-3); }
.wrong-book__answer { padding: var(--space-3); border-radius: var(--radius-lg); font-size: var(--text-sm); }
.wrong-book__answer span:first-child { display: block; font-size: var(--text-xs); color: var(--text-tertiary); margin-bottom: var(--space-1); }
.wrong-book__answer--wrong { background: rgba(239,68,68,0.1); color: var(--color-error); }
.wrong-book__answer--correct { background: rgba(16,185,129,0.1); color: var(--color-success); }

/* 元信息 */
.wrong-book__meta { display: flex; justify-content: space-between; align-items: center; }
.wrong-book__tags { display: flex; align-items: center; gap: var(--space-2); }
.wrong-book__layer { padding: 2px 8px; border-radius: var(--radius-sm); font-size: var(--text-xs); color: white; }
.wrong-book__layer--l1 { background: #3b82f6; }
.wrong-book__layer--l2 { background: #f59e0b; }
.wrong-book__layer--l3 { background: #ef4444; }
.wrong-book__layer--l4 { background: #8b5cf6; }
.wrong-book__review-count { font-size: var(--text-xs); color: var(--color-success); }
.wrong-book__review { padding: var(--space-1) var(--space-3); background: var(--color-primary); color: white; border-radius: var(--radius-lg); font-size: var(--text-sm); transition: background var(--transition-fast); }
.wrong-book__review:hover { background: var(--color-primary-dark); }

/* 空状态 */
.wrong-book__empty { text-align: center; color: var(--text-tertiary); padding: var(--space-12) 0; font-size: var(--text-lg); }
</style>
