<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Achievement {
  id: string
  name: string
  desc: string
  condition: string
  icon: string
  unlocked: boolean
  progress: string
}

interface Category {
  key: string
  label: string
  icon: string
  items: Achievement[]
}

const STORAGE_KEY = 'achievement-wall-data'

const defaultCategories: Category[] = [
  {
    key: 'learning', label: '学习成就', icon: '📖',
    items: [
      { id: 'l1', name: '初次见面', desc: '完成第一次学习', condition: '完成1次学习', icon: '👋', unlocked: true, progress: '1/1' },
      { id: 'l2', name: '学海无涯', desc: '学习10个不同知识点', condition: '学习10个知识点', icon: '📚', unlocked: false, progress: '3/10' },
      { id: 'l3', name: '博学多才', desc: '掌握5个知识模块', condition: '掌握5个模块', icon: '🎓', unlocked: false, progress: '2/5' },
      { id: 'l4', name: '知识达人', desc: '所有知识点掌握率达80%', condition: '掌握率80%', icon: '🧠', unlocked: false, progress: '45%' }
    ]
  },
  {
    key: 'practice', label: '练习成就', icon: '✏️',
    items: [
      { id: 'p1', name: '计算达人', desc: '连续答对10道计算题', condition: '连对10题', icon: '🧮', unlocked: true, progress: '10/10' },
      { id: 'p2', name: '连对之王', desc: '连续答对50道题', condition: '连对50题', icon: '🔥', unlocked: false, progress: '23/50' },
      { id: 'p3', name: '错题克星', desc: '复习并订正50道错题', condition: '订正50题', icon: '🔧', unlocked: false, progress: '12/50' },
      { id: 'p4', name: '百题斩', desc: '累计完成100道练习题', condition: '完成100题', icon: '💯', unlocked: false, progress: '67/100' }
    ]
  },
  {
    key: 'game', label: '游戏成就', icon: '🎮',
    items: [
      { id: 'g1', name: '游戏新手', desc: '首次完成一个小游戏', condition: '完成1个游戏', icon: '🎲', unlocked: true, progress: '1/1' },
      { id: 'g2', name: '游戏高手', desc: '通关5个不同游戏', condition: '通关5个游戏', icon: '🕹️', unlocked: false, progress: '2/5' },
      { id: 'g3', name: '七巧板大师', desc: '完成所有七巧板关卡', condition: '全部通关', icon: '🧩', unlocked: false, progress: '4/8' },
      { id: 'g4', name: '24点天才', desc: '在24点游戏中累计答对20题', condition: '答对20题', icon: '🃏', unlocked: false, progress: '8/20' }
    ]
  },
  {
    key: 'persistence', label: '坚持成就', icon: '💪',
    items: [
      { id: 's1', name: '持之以恒', desc: '连续学习3天', condition: '连续3天', icon: '📅', unlocked: true, progress: '3/3' },
      { id: 's2', name: '连续7天', desc: '连续学习7天不中断', condition: '连续7天', icon: '🔥', unlocked: false, progress: '5/7' },
      { id: 's3', name: '月度学霸', desc: '一个月内累计学习20天', condition: '学习20天', icon: '🌟', unlocked: false, progress: '14/20' },
      { id: 's4', name: '年度之星', desc: '累计学习100天', condition: '学习100天', icon: '👑', unlocked: false, progress: '42/100' }
    ]
  }
]

const categories = ref<Category[]>(loadFromStorage())

function loadFromStorage(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return JSON.parse(JSON.stringify(defaultCategories))
    const saved = JSON.parse(raw) as Category[]
    return saved
  } catch {
    return JSON.parse(JSON.stringify(defaultCategories))
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories.value))
}

watch(categories, saveToStorage, { deep: true })

const allItems = computed(() => categories.value.flatMap(c => c.items))
const unlockedCount = computed(() => allItems.value.filter(a => a.unlocked).length)
const totalCount = computed(() => allItems.value.length)
const percentage = computed(() => Math.round((unlockedCount.value / totalCount.value) * 100))

const activeCategory = ref<string | null>(null)
const filteredCategories = computed(() =>
  activeCategory.value
    ? categories.value.filter(c => c.key === activeCategory.value)
    : categories.value
)
</script>

<template>
  <div class="wall">
    <h1 class="wall__title">🏆 成就墙</h1>

    <div class="wall__stats">
      <div class="wall__stat">
        <span class="wall__stat-num">{{ unlockedCount }}/{{ totalCount }}</span>
        <span class="wall__stat-label">已解锁</span>
      </div>
      <div class="wall__stat">
        <span class="wall__stat-num">{{ percentage }}%</span>
        <span class="wall__stat-label">完成度</span>
      </div>
    </div>

    <div class="wall__bar">
      <div class="wall__bar-fill" :style="{ width: percentage + '%' }"></div>
    </div>

    <div class="wall__tabs">
      <button
        class="wall__tab"
        :class="{ 'wall__tab--active': !activeCategory }"
        @click="activeCategory = null"
      >全部</button>
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="wall__tab"
        :class="{ 'wall__tab--active': activeCategory === cat.key }"
        @click="activeCategory = cat.key"
      >{{ cat.icon }} {{ cat.label }}</button>
    </div>

    <section v-for="cat in filteredCategories" :key="cat.key" class="wall__section">
      <h2 class="wall__cat-title">{{ cat.icon }} {{ cat.label }}</h2>
      <div class="wall__grid">
        <div
          v-for="a in cat.items"
          :key="a.id"
          class="card"
          :class="{ 'card--locked': !a.unlocked, 'card--unlocked': a.unlocked }"
        >
          <span class="card__icon">{{ a.icon }}</span>
          <h3 class="card__name">{{ a.name }}</h3>
          <p class="card__desc">{{ a.desc }}</p>
          <p class="card__cond">条件：{{ a.condition }}</p>
          <span v-if="a.unlocked" class="card__badge">✓ 已解锁</span>
          <span v-else class="card__progress">{{ a.progress }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.wall {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-4);
}
.wall__title {
  text-align: center;
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}
.wall__stats {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  margin-bottom: var(--space-3);
}
.wall__stat {
  text-align: center;
}
.wall__stat-num {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-primary);
}
.wall__stat-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}
.wall__bar {
  height: 8px;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-4);
}
.wall__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}
.wall__tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}
.wall__tab {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.wall__tab--active {
  background: var(--color-primary);
  color: var(--text-inverse);
  border-color: var(--color-primary);
}
.wall__section {
  margin-bottom: var(--space-6);
}
.wall__cat-title {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
  padding-left: var(--space-2);
  border-left: 3px solid var(--color-primary);
}
.wall__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-3);
}
.card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  text-align: center;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition: transform var(--transition-fast);
}
.card:hover { transform: translateY(-2px); }
.card--unlocked {
  border: 2px solid #f59e0b;
  animation: shimmer 3s ease-in-out infinite;
}
.card--unlocked::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 40%, rgba(245,158,11,0.08) 50%, transparent 60%);
  animation: shine 3s ease-in-out infinite;
}
.card--locked {
  opacity: 0.55;
  filter: grayscale(0.6);
}
.card__icon {
  font-size: 40px;
  display: block;
  margin-bottom: var(--space-2);
}
.card__name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}
.card__desc {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
  line-height: var(--leading-relaxed);
}
.card__cond {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}
.card__badge {
  display: inline-block;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  background: rgba(245,158,11,0.15);
  color: #d97706;
}
.card__progress {
  display: inline-block;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  background: var(--bg-hover);
  color: var(--text-secondary);
}
@keyframes shimmer {
  0%, 100% { box-shadow: var(--shadow-sm), 0 0 0 rgba(245,158,11,0); }
  50% { box-shadow: var(--shadow-sm), 0 0 12px rgba(245,158,11,0.25); }
}
@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}
</style>
