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
  { id: 'g1-addition-within-20', label: '20以内加减法', icon: '➕', grade: 1, category: 'basic', difficulty: 1, progress: 100, completed: true, locked: false },
  { id: 'g1-word-problem-1st', label: '一年级应用题', icon: '📝', grade: 1, category: 'basic', difficulty: 2, progress: 60, completed: false, locked: false },
  { id: 'g1-counting-game', label: '趣味数数', icon: '🔢', grade: 1, category: 'olympiad', difficulty: 1, progress: 40, completed: false, locked: false },
  // 二年级
  { id: 'g2-multiplication-table', label: '乘法口诀', icon: '✖️', grade: 2, category: 'basic', difficulty: 2, progress: 90, completed: false, locked: false },
  // 三年级
  { id: 'g3-sum-multiple', label: '和倍问题', icon: '📊', grade: 3, category: 'olympiad', difficulty: 3, progress: 100, completed: true, locked: false },
  { id: 'g3-diff-multiple', label: '差倍问题', icon: '📈', grade: 3, category: 'olympiad', difficulty: 3, progress: 75, completed: false, locked: false },
  { id: 'g3-sum-diff', label: '和差问题', icon: '📉', grade: 3, category: 'olympiad', difficulty: 3, progress: 50, completed: false, locked: false },
  { id: 'g3-planting-trees', label: '植树问题', icon: '🌳', grade: 3, category: 'olympiad', difficulty: 3, progress: 30, completed: false, locked: false },
  { id: 'g3-chicken-rabbit', label: '鸡兔同笼', icon: '🐔', grade: 3, category: 'olympiad', difficulty: 3, progress: 20, completed: false, locked: false },
  // 四年级
  { id: 'g4-age-problem', label: '年龄问题', icon: '🎂', grade: 4, category: 'olympiad', difficulty: 4, progress: 40, completed: false, locked: false },
  { id: 'g4-area-perimeter', label: '面积与周长', icon: '📐', grade: 4, category: 'olympiad', difficulty: 4, progress: 30, completed: false, locked: false },
  // 五年级
  { id: 'g5-profit-loss', label: '盈亏问题', icon: '💰', grade: 5, category: 'olympiad', difficulty: 4, progress: 20, completed: false, locked: false },
  { id: 'g5-simple-equation', label: '简易方程', icon: '⚖️', grade: 5, category: 'olympiad', difficulty: 4, progress: 20, completed: false, locked: false },
  { id: 'g5-fraction-split', label: '分数拆分', icon: '✂️', grade: 5, category: 'olympiad', difficulty: 5, progress: 10, completed: false, locked: false },
  { id: 'g5-fraction-add-sub', label: '分数加减法', icon: '🧮', grade: 5, category: 'basic', difficulty: 4, progress: 10, completed: false, locked: false },
  { id: 'g5-number-theory', label: '数论初步', icon: '🔢', grade: 5, category: 'olympiad', difficulty: 5, progress: 5, completed: false, locked: true },
  { id: 'g5-geometry-model', label: '几何模型', icon: '🔷', grade: 5, category: 'olympiad', difficulty: 5, progress: 0, completed: false, locked: true },
  // 六年级
  { id: 'g6-travel-problem', label: '行程问题', icon: '🚗', grade: 6, category: 'olympiad', difficulty: 5, progress: 0, completed: false, locked: true },
  { id: 'g6-circle-area', label: '圆的周长与面积', icon: '⭕', grade: 6, category: 'basic', difficulty: 5, progress: 0, completed: false, locked: true },
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
