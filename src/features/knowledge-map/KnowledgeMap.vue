<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

interface KnowledgeNode {
  id: string
  label: string
  icon: string
  grade: number
  category: 'basic' | 'olympiad'
  difficulty: 1 | 2 | 3 | 4 | 5
  progress: number
  completed: boolean
  locked: boolean
}

const selectedGrade = ref<number>(0)
const selectedModule = ref<string>('all')

const grades = [0, 1, 2, 3, 4, 5, 6] as const
const gradeLabels: Record<number, string> = { 0: '全部', 1: '一年级', 2: '二年级', 3: '三年级', 4: '四年级', 5: '五年级', 6: '六年级' }
const modules = [
  { id: 'all', label: '全部' },
  { id: 'basic', label: '校内基础' },
  { id: 'olympiad', label: '奥数专题' }
]

const allNodes = ref<KnowledgeNode[]>([
  // 一年级
  { id: 'g1-count', label: '认识数字', icon: '🔢', grade: 1, category: 'basic', difficulty: 1, progress: 100, completed: true, locked: false },
  { id: 'g1-add', label: '10以内加法', icon: '➕', grade: 1, category: 'basic', difficulty: 1, progress: 100, completed: true, locked: false },
  { id: 'g1-sub', label: '10以内减法', icon: '➖', grade: 1, category: 'basic', difficulty: 1, progress: 80, completed: false, locked: false },
  { id: 'g1-shape', label: '认识图形', icon: '🔷', grade: 1, category: 'basic', difficulty: 1, progress: 60, completed: false, locked: false },
  { id: 'g1-find-law', label: '找规律填数', icon: '🔍', grade: 1, category: 'olympiad', difficulty: 2, progress: 40, completed: false, locked: false },
  { id: 'g1-match', label: '巧搭配', icon: '🧩', grade: 1, category: 'olympiad', difficulty: 2, progress: 0, completed: false, locked: false },
  // 二年级
  { id: 'g2-add100', label: '100以内加减', icon: '🧮', grade: 2, category: 'basic', difficulty: 2, progress: 100, completed: true, locked: false },
  { id: 'g2-mul', label: '乘法口诀', icon: '✖️', grade: 2, category: 'basic', difficulty: 2, progress: 90, completed: false, locked: false },
  { id: 'g2-div', label: '认识除法', icon: '➗', grade: 2, category: 'basic', difficulty: 2, progress: 70, completed: false, locked: false },
  { id: 'g2-length', label: '长度单位', icon: '📏', grade: 2, category: 'basic', difficulty: 1, progress: 50, completed: false, locked: false },
  { id: 'g2-interval', label: '植树问题', icon: '🌳', grade: 2, category: 'olympiad', difficulty: 3, progress: 30, completed: false, locked: false },
  { id: 'g2-age', label: '年龄问题', icon: '🎂', grade: 2, category: 'olympiad', difficulty: 2, progress: 0, completed: false, locked: false },
  // 三年级
  { id: 'g3-mult-div', label: '多位数乘除', icon: '📐', grade: 3, category: 'basic', difficulty: 3, progress: 100, completed: true, locked: false },
  { id: 'g3-fraction', label: '认识分数', icon: '🍕', grade: 3, category: 'basic', difficulty: 2, progress: 85, completed: false, locked: false },
  { id: 'g3-perimeter', label: '周长与面积', icon: '📏', grade: 3, category: 'basic', difficulty: 3, progress: 60, completed: false, locked: false },
  { id: 'g3-time', label: '时间计算', icon: '⏰', grade: 3, category: 'basic', difficulty: 2, progress: 45, completed: false, locked: false },
  { id: 'g3-sum-mul', label: '和倍问题', icon: '📊', grade: 3, category: 'olympiad', difficulty: 3, progress: 100, completed: true, locked: false },
  { id: 'g3-diff-mul', label: '差倍问题', icon: '📈', grade: 3, category: 'olympiad', difficulty: 3, progress: 75, completed: false, locked: false },
  { id: 'g3-sum-diff', label: '和差问题', icon: '📉', grade: 3, category: 'olympiad', difficulty: 3, progress: 50, completed: false, locked: false },
  // 四年级
  { id: 'g4-large', label: '大数认识', icon: '🔢', grade: 4, category: 'basic', difficulty: 2, progress: 90, completed: false, locked: false },
  { id: 'g4-decimal', label: '小数加减', icon: '🔬', grade: 4, category: 'basic', difficulty: 3, progress: 70, completed: false, locked: false },
  { id: 'g4-angle', label: '角与三角形', icon: '📐', grade: 4, category: 'basic', difficulty: 3, progress: 55, completed: false, locked: false },
  { id: 'g4-equation', label: '简易方程', icon: '⚖️', grade: 4, category: 'basic', difficulty: 3, progress: 40, completed: false, locked: false },
  { id: 'g4-chicken', label: '鸡兔同笼', icon: '🐔', grade: 4, category: 'olympiad', difficulty: 4, progress: 20, completed: false, locked: false },
  { id: 'g4-profit', label: '盈亏问题', icon: '💰', grade: 4, category: 'olympiad', difficulty: 4, progress: 0, completed: false, locked: true },
  { id: 'g4-logic', label: '逻辑推理', icon: '🧠', grade: 4, category: 'olympiad', difficulty: 4, progress: 0, completed: false, locked: true },
  // 五年级
  { id: 'g5-frac-op', label: '分数运算', icon: '🧩', grade: 5, category: 'basic', difficulty: 4, progress: 30, completed: false, locked: false },
  { id: 'g5-decimal-mul', label: '小数乘除', icon: '🎯', grade: 5, category: 'basic', difficulty: 4, progress: 20, completed: false, locked: false },
  { id: 'g5-volume', label: '体积与容积', icon: '📦', grade: 5, category: 'basic', difficulty: 4, progress: 10, completed: false, locked: false },
  { id: 'g5-poly-area', label: '多边形面积', icon: '🔷', grade: 5, category: 'basic', difficulty: 3, progress: 0, completed: false, locked: false },
  { id: 'g5-frac-split', label: '分数裂项', icon: '✂️', grade: 5, category: 'olympiad', difficulty: 5, progress: 0, completed: false, locked: true },
  { id: 'g5-travel', label: '行程问题', icon: '🚗', grade: 5, category: 'olympiad', difficulty: 5, progress: 0, completed: false, locked: true },
  // 六年级
  { id: 'g6-ratio', label: '比与比例', icon: '⚖️', grade: 6, category: 'basic', difficulty: 4, progress: 0, completed: false, locked: true },
  { id: 'g6-circle', label: '圆的面积', icon: '⭕', grade: 6, category: 'basic', difficulty: 4, progress: 0, completed: false, locked: true },
  { id: 'g6-percent', label: '百分数', icon: '💯', grade: 6, category: 'basic', difficulty: 4, progress: 0, completed: false, locked: true },
  { id: 'g6-neg', label: '负数认识', icon: '➖', grade: 6, category: 'basic', difficulty: 3, progress: 0, completed: false, locked: true },
  { id: 'g6-combine', label: '组合计数', icon: '🎲', grade: 6, category: 'olympiad', difficulty: 5, progress: 0, completed: false, locked: true },
  { id: 'g6-num-theory', label: '数论基础', icon: '🧮', grade: 6, category: 'olympiad', difficulty: 5, progress: 0, completed: false, locked: true },
])

const filteredNodes = computed(() =>
  allNodes.value.filter(n => {
    if (selectedGrade.value !== 0 && n.grade !== selectedGrade.value) return false
    if (selectedModule.value !== 'all' && n.category !== selectedModule.value) return false
    return true
  })
)

const stats = computed(() => {
  const nodes = filteredNodes.value
  const total = nodes.length
  const completed = nodes.filter(n => n.completed).length
  const pct = total ? Math.round((completed / total) * 100) : 0
  return { total, completed, pct }
})

function stars(d: number) {
  return '★'.repeat(d) + '☆'.repeat(5 - d)
}

function goNode(node: KnowledgeNode) {
  if (node.locked) return
  router.push(`/learning/topic/${node.id}`)
}

onMounted(() => { userStore.init() })
</script>

<template>
  <AppLayout>
    <div class="km">
      <div class="km__header">
        <h1 class="km__title">知识地图</h1>
        <p class="km__desc">系统掌握每一个知识点</p>
      </div>

      <div class="km__filters">
        <div class="km__row">
          <button
            v-for="g in grades" :key="g"
            class="km__gbtn" :class="{ 'km__gbtn--active': selectedGrade === g }"
            @click="selectedGrade = g"
          >{{ gradeLabels[g] }}</button>
        </div>
        <div class="km__row">
          <button
            v-for="m in modules" :key="m.id"
            class="km__mbtn" :class="{ 'km__mbtn--active': selectedModule === m.id }"
            @click="selectedModule = m.id"
          >{{ m.label }}</button>
        </div>
      </div>

      <div class="km__grid">
        <div
          v-for="node in filteredNodes" :key="node.id"
          class="km__node"
          :class="{ 'km__node--done': node.completed, 'km__node--locked': node.locked }"
          @click="goNode(node)"
        >
          <div class="km__node-top">
            <span class="km__node-icon">{{ node.icon }}</span>
            <div class="km__node-info">
              <span class="km__node-name">{{ node.label }}</span>
              <div class="km__node-tags">
                <span class="km__tag km__tag--grade">{{ node.grade }}年级</span>
                <span class="km__tag" :class="node.category === 'basic' ? 'km__tag--basic' : 'km__tag--oly'">
                  {{ node.category === 'basic' ? '基础' : '奥数' }}
                </span>
              </div>
            </div>
            <span v-if="node.completed" class="km__check">&#10003;</span>
            <span v-else-if="node.locked" class="km__lock">&#128274;</span>
          </div>
          <div class="km__node-bottom">
            <span class="km__stars">{{ stars(node.difficulty) }}</span>
            <div class="km__bar-wrap">
              <div class="km__bar" :style="{ width: node.progress + '%' }"></div>
            </div>
            <span class="km__pct">{{ node.progress }}%</span>
          </div>
        </div>
      </div>

      <div v-if="filteredNodes.length === 0" class="km__empty">暂无匹配的知识点</div>

      <div class="km__footer">
        <span>知识点 <strong>{{ stats.total }}</strong></span>
        <span>已完成 <strong>{{ stats.completed }}</strong></span>
        <span>完成率 <strong>{{ stats.pct }}%</strong></span>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.km { max-width: 900px; margin: 0 auto; padding: var(--space-4); }
.km__header { text-align: center; margin-bottom: var(--space-6); }
.km__title { font-size: var(--text-2xl); color: var(--text-primary); margin: 0 0 var(--space-1); }
.km__desc { color: var(--text-secondary); margin: 0; font-size: var(--text-sm); }

.km__filters { margin-bottom: var(--space-6); }
.km__row { display: flex; gap: var(--space-2); margin-bottom: var(--space-3); overflow-x: auto; padding-bottom: var(--space-1); }
.km__gbtn {
  padding: var(--space-2) var(--space-4); background: var(--bg-card); border: 2px solid var(--border-color);
  border-radius: var(--radius-lg); font-weight: 500; white-space: nowrap; cursor: pointer; transition: all var(--transition-fast);
}
.km__gbtn--active { background: var(--color-primary); border-color: var(--color-primary); color: var(--text-inverse); }
.km__mbtn {
  flex: 1; padding: var(--space-3); background: var(--bg-card); border: 2px solid var(--border-color);
  border-radius: var(--radius-lg); font-weight: 500; cursor: pointer; transition: all var(--transition-fast);
}
.km__mbtn--active { background: rgba(99,102,241,.1); border-color: var(--color-primary); color: var(--color-primary); }

.km__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-4); }
.km__node {
  background: var(--bg-card); border: 2px solid var(--border-color); border-radius: var(--radius-xl);
  padding: var(--space-4); cursor: pointer; transition: all var(--transition-fast);
}
.km__node:hover:not(.km__node--locked) { border-color: var(--color-primary); box-shadow: var(--shadow-md); }
.km__node--done { border-color: var(--color-success); }
.km__node--locked { opacity: .55; cursor: not-allowed; }
.km__node--locked:hover { border-color: var(--border-color); box-shadow: none; }

.km__node-top { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3); }
.km__node-icon { font-size: 28px; flex-shrink: 0; }
.km__node-info { flex: 1; min-width: 0; }
.km__node-name { display: block; font-weight: 600; color: var(--text-primary); font-size: var(--text-base); margin-bottom: var(--space-1); }
.km__node-tags { display: flex; gap: var(--space-1); }
.km__tag {
  font-size: var(--text-xs); padding: 1px var(--space-2); border-radius: var(--radius-full); color: var(--text-inverse);
}
.km__tag--grade { background: var(--color-info); }
.km__tag--basic { background: var(--color-success); }
.km__tag--oly { background: var(--color-secondary); }

.km__check {
  width: 24px; height: 24px; border-radius: var(--radius-full); background: var(--color-success);
  color: var(--text-inverse); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0;
}
.km__lock { font-size: var(--text-lg); flex-shrink: 0; }

.km__node-bottom { display: flex; align-items: center; gap: var(--space-2); }
.km__stars { font-size: var(--text-xs); color: var(--color-secondary); white-space: nowrap; }
.km__bar-wrap {
  flex: 1; height: 6px; background: var(--bg-active); border-radius: var(--radius-full); overflow: hidden;
}
.km__bar { height: 100%; border-radius: var(--radius-full); background: var(--color-primary); transition: width var(--transition-normal); }
.km__node--done .km__bar { background: var(--color-success); }
.km__pct { font-size: var(--text-xs); color: var(--text-tertiary); min-width: 32px; text-align: right; }

.km__empty { text-align: center; color: var(--text-tertiary); padding: var(--space-12) 0; font-size: var(--text-lg); }

.km__footer {
  margin-top: var(--space-8); padding: var(--space-4); background: var(--bg-card); border-radius: var(--radius-xl);
  display: flex; justify-content: space-around; box-shadow: var(--shadow-sm); font-size: var(--text-sm); color: var(--text-secondary);
}
.km__footer strong { color: var(--text-primary); font-size: var(--text-lg); margin-left: var(--space-1); }
</style>
