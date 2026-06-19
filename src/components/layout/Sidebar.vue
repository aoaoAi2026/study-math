<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isExpanded = ref(false)

const gradeOptions = [
  { label: '一年级', value: 1 },
  { label: '二年级', value: 2 },
  { label: '三年级', value: 3 },
  { label: '四年级', value: 4 },
  { label: '五年级', value: 5 },
  { label: '六年级', value: 6 }
]

const menuItems = [
  {
    title: '学习',
    items: [
      { path: '/', icon: '🏠', label: '首页', badge: '' },
      { path: '/map', icon: '🗺️', label: '知识地图', badge: '' },
      { path: '/learning', icon: '📚', label: '专题学习', badge: '' },
      { path: '/diagnosis', icon: '🔬', label: '智能诊断', badge: 'P0' },
      { path: '/challenge/daily', icon: '⚡', label: '每日挑战', badge: '' }
    ]
  },
  {
    title: '游戏',
    items: [
      { path: '/games', icon: '🎮', label: '游戏中心', badge: '' },
      { path: '/games/calc-arcade', icon: '🧮', label: '计算街机', badge: 'P0' },
      { path: '/games/sudoku', icon: '🔢', label: '数独探险', badge: 'P0' }
    ]
  },
  {
    title: '工具',
    items: [
      { path: '/tools', icon: '🛠️', label: '教具工具箱', badge: '' },
      { path: '/tools/segment-diagram', icon: '📊', label: '线段图', badge: 'P0' },
      { path: '/tools/geoboard', icon: '📐', label: '几何画板', badge: 'P0' }
    ]
  },
  {
    title: '我的',
    items: [
      { path: '/profile', icon: '👤', label: '个人中心', badge: '' },
      { path: '/profile/achievements', icon: '🏆', label: '成就墙', badge: '' },
      { path: '/profile/pet', icon: '🐱', label: '宠物小π', badge: '' },
      { path: '/profile/wrong-book', icon: '📝', label: '错题本', badge: '' },
      { path: '/parent', icon: '👪', label: '家长控制', badge: '' }
    ]
  }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function changeGrade(grade: number) {
  userStore.grade = grade as 1 | 2 | 3 | 4 | 5 | 6
  userStore.save()
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--expanded': isExpanded }">
    <div class="sidebar__user">
      <div class="sidebar__avatar">{{ userStore.nickname?.[0] || '我' }}</div>
      <div class="sidebar__info">
        <div class="sidebar__name">{{ userStore.nickname }}</div>
        <div class="sidebar__meta">
          <span>Lv.{{ userStore.level }}</span>
          <span class="sidebar__exp">{{ userStore.experience }} EXP</span>
        </div>
      </div>
    </div>

    <div class="sidebar__grade">
      <label class="sidebar__grade-label">当前年级</label>
      <select
        :value="userStore.grade"
        class="sidebar__grade-select"
        @change="changeGrade(Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="g in gradeOptions" :key="g.value" :value="g.value">
          {{ g.label }}
        </option>
      </select>
    </div>

    <nav class="sidebar__nav">
      <div v-for="section in menuItems" :key="section.title" class="sidebar__section">
        <div class="sidebar__section-title">{{ section.title }}</div>
        <router-link
          v-for="item in section.items"
          :key="item.path"
          :to="item.path"
          class="sidebar__item"
          :class="{ 'sidebar__item--active': isActive(item.path) }"
        >
          <span class="sidebar__icon">{{ item.icon }}</span>
          <span class="sidebar__label">{{ item.label }}</span>
          <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar__stats">
      <div class="sidebar__stat">
        <span class="sidebar__stat-value">{{ userStore.correctTotal }}</span>
        <span class="sidebar__stat-label">答对题数</span>
      </div>
      <div class="sidebar__stat">
        <span class="sidebar__stat-value">{{ userStore.checkInDays }}</span>
        <span class="sidebar__stat-label">学习天数</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: calc(100vh - var(--topnav-height));
  position: fixed;
  top: var(--topnav-height);
  left: 0;
  background: var(--bg-card);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: width var(--transition-normal);
}

.sidebar__user {
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid var(--border-color);
}

.sidebar__avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: 600;
}

.sidebar__info {
  flex: 1;
}

.sidebar__name {
  font-weight: 600;
  color: var(--text-primary);
}

.sidebar__meta {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  display: flex;
  gap: var(--space-2);
}

.sidebar__exp {
  color: var(--color-primary);
}

.sidebar__grade {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-color);
}

.sidebar__grade-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}

.sidebar__grade-select {
  width: 100%;
  padding: var(--space-2);
  background: var(--bg-hover);
}

.sidebar__nav {
  flex: 1;
  padding: var(--space-3) 0;
  overflow-y: auto;
}

.sidebar__section {
  margin-bottom: var(--space-4);
}

.sidebar__section-title {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.sidebar__item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar__item--active {
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
  border-right: 3px solid var(--color-primary);
}

.sidebar__icon {
  font-size: var(--text-lg);
  width: 24px;
  text-align: center;
}

.sidebar__label {
  flex: 1;
  font-size: var(--text-sm);
}

.sidebar__badge {
  font-size: var(--text-xs);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--color-error);
  color: var(--text-inverse);
}

.sidebar__stats {
  padding: var(--space-4);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: var(--space-4);
}

.sidebar__stat {
  flex: 1;
  text-align: center;
}

.sidebar__stat-value {
  display: block;
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-primary);
}

.sidebar__stat-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}
</style>
