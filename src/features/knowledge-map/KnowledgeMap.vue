<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

interface TreeNode {
  id: string
  label: string
  icon: string
  grade: number
  category: 'basic' | 'olympiad'
  difficulty: 1 | 2 | 3 | 4 | 5
  children?: TreeNode[]
  completed?: boolean
  locked?: boolean
}

const selectedGrade = ref(3)
const selectedModule = ref<string>('all')

const grades = [1, 2, 3, 4, 5, 6]

const modules = [
  { id: 'all', label: '全部' },
  { id: 'basic', label: '校内基础' },
  { id: 'olympiad', label: '奥数专题' }
]

const knowledgeTree = ref<TreeNode[]>([
  {
    id: 'sum-multiple',
    label: '和倍问题',
    icon: '📊',
    grade: 3,
    category: 'olympiad',
    difficulty: 3,
    completed: true,
    children: [
      { id: 'diff-multiple', label: '差倍问题', icon: '📈', grade: 3, category: 'olympiad', difficulty: 3 },
      { id: 'sum-diff', label: '和差问题', icon: '📉', grade: 3, category: 'olympiad', difficulty: 3 }
    ]
  },
  {
    id: 'chicken-rabbit',
    label: '鸡兔同笼',
    icon: '🐔',
    grade: 4,
    category: 'olympiad',
    difficulty: 4,
    locked: true,
    children: [
      { id: 'profit-loss', label: '盈亏问题', icon: '💰', grade: 4, category: 'olympiad', difficulty: 4 }
    ]
  },
  {
    id: 'fraction-split',
    label: '分数裂项',
    icon: '➗',
    grade: 5,
    category: 'olympiad',
    difficulty: 5,
    locked: true
  },
  {
    id: 'travel-problem',
    label: '行程问题',
    icon: '🚗',
    grade: 6,
    category: 'olympiad',
    difficulty: 5,
    locked: true
  }
])

const moduleStats = computed(() => {
  const stats = {
    basic: { total: 40, completed: 12 },
    olympiad: { total: 100, completed: 5 }
  }
  return stats
})

function selectNode(node: TreeNode) {
  if (node.locked) return
  router.push(`/learning/${node.id}`)
}

function getDifficultyStars(difficulty: number) {
  return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)
}

onMounted(() => {
  userStore.init()
})
</script>

<template>
  <AppLayout>
    <div class="knowledge-map">
      <div class="knowledge-map__header">
        <h1 class="knowledge-map__title">🗺️ 知识地图</h1>
        <p class="knowledge-map__desc">探索数学知识的海洋</p>
      </div>

      <div class="knowledge-map__filters">
        <div class="knowledge-map__grades">
          <button
            v-for="g in grades"
            :key="g"
            class="knowledge-map__grade-btn"
            :class="{ 'knowledge-map__grade-btn--active': selectedGrade === g }"
            @click="selectedGrade = g"
          >
            {{ g }}年级
          </button>
        </div>
        <div class="knowledge-map__modules">
          <button
            v-for="m in modules"
            :key="m.id"
            class="knowledge-map__module-btn"
            :class="{ 'knowledge-map__module-btn--active': selectedModule === m.id }"
            @click="selectedModule = m.id"
          >
            {{ m.label }}
          </button>
        </div>
      </div>

      <div class="knowledge-map__stats">
        <div class="knowledge-map__stat">
          <span class="knowledge-map__stat-icon">📚</span>
          <div class="knowledge-map__stat-info">
            <span class="knowledge-map__stat-value">{{ moduleStats.basic.total }}</span>
            <span class="knowledge-map__stat-label">校内基础</span>
          </div>
          <span class="knowledge-map__stat-progress">{{ moduleStats.basic.completed }}/{{ moduleStats.basic.total }}</span>
        </div>
        <div class="knowledge-map__stat">
          <span class="knowledge-map__stat-icon">🏆</span>
          <div class="knowledge-map__stat-info">
            <span class="knowledge-map__stat-value">{{ moduleStats.olympiad.total }}</span>
            <span class="knowledge-map__stat-label">奥数专题</span>
          </div>
          <span class="knowledge-map__stat-progress">{{ moduleStats.olympiad.completed }}/{{ moduleStats.olympiad.total }}</span>
        </div>
      </div>

      <div class="knowledge-map__tree">
        <div
          v-for="node in knowledgeTree"
          :key="node.id"
          class="knowledge-map__node"
          :class="{
            'knowledge-map__node--completed': node.completed,
            'knowledge-map__node--locked': node.locked
          }"
          @click="selectNode(node)"
        >
          <div class="knowledge-map__node-main">
            <span class="knowledge-map__node-icon">{{ node.icon }}</span>
            <div class="knowledge-map__node-info">
              <span class="knowledge-map__node-label">{{ node.label }}</span>
              <span class="knowledge-map__node-meta">
                {{ node.category === 'basic' ? '基础' : '奥数' }} ·
                {{ getDifficultyStars(node.difficulty) }}
              </span>
            </div>
            <span v-if="node.completed" class="knowledge-map__node-badge">✓</span>
            <span v-else-if="node.locked" class="knowledge-map__node-lock">🔒</span>
            <span v-else class="knowledge-map__node-arrow">→</span>
          </div>
          <div v-if="node.children" class="knowledge-map__node-children">
            <div
              v-for="child in node.children"
              :key="child.id"
              class="knowledge-map__node knowledge-map__node--child"
              :class="{
                'knowledge-map__node--completed': child.completed,
                'knowledge-map__node--locked': child.locked
              }"
              @click.stop="selectNode(child)"
            >
              <span class="knowledge-map__node-icon">{{ child.icon }}</span>
              <span class="knowledge-map__node-label">{{ child.label }}</span>
              <span v-if="child.completed" class="knowledge-map__node-badge">✓</span>
              <span v-else-if="child.locked" class="knowledge-map__node-lock">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.knowledge-map {
  max-width: 900px;
  margin: 0 auto;
}

.knowledge-map__header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.knowledge-map__title {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.knowledge-map__desc {
  color: var(--text-secondary);
}

.knowledge-map__filters {
  margin-bottom: var(--space-6);
}

.knowledge-map__grades {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

.knowledge-map__grade-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-weight: 500;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.knowledge-map__grade-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.knowledge-map__modules {
  display: flex;
  gap: var(--space-2);
}

.knowledge-map__module-btn {
  flex: 1;
  padding: var(--space-3);
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.knowledge-map__module-btn--active {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.knowledge-map__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.knowledge-map__stat {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  box-shadow: var(--shadow-sm);
}

.knowledge-map__stat-icon {
  font-size: 32px;
}

.knowledge-map__stat-info {
  flex: 1;
}

.knowledge-map__stat-value {
  display: block;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
}

.knowledge-map__stat-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.knowledge-map__stat-progress {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.knowledge-map__tree {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.knowledge-map__node {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 2px solid var(--border-color);
  transition: all var(--transition-fast);
}

.knowledge-map__node:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.knowledge-map__node--completed {
  border-color: var(--color-success);
}

.knowledge-map__node--locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.knowledge-map__node--locked:hover {
  border-color: var(--border-color);
  box-shadow: none;
}

.knowledge-map__node-main {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}

.knowledge-map__node-icon {
  font-size: 32px;
}

.knowledge-map__node-info {
  flex: 1;
}

.knowledge-map__node-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.knowledge-map__node-meta {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.knowledge-map__node-badge {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.knowledge-map__node-lock {
  font-size: var(--text-lg);
}

.knowledge-map__node-arrow {
  color: var(--text-tertiary);
}

.knowledge-map__node-children {
  padding: 0 var(--space-4) var(--space-4);
  padding-left: calc(var(--space-4) + 32px + var(--space-3));
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.knowledge-map__node--child {
  border-radius: var(--radius-lg);
}

.knowledge-map__node--child .knowledge-map__node-main {
  padding: var(--space-3);
}

.knowledge-map__node--child .knowledge-map__node-icon {
  font-size: 24px;
}

.knowledge-map__node--child .knowledge-map__node-label {
  font-size: var(--text-sm);
}
</style>
