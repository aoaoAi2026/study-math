<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type EventType = 'learn' | 'practice' | 'game' | 'achievement'

interface TimelineEvent {
  id: number
  date: string
  type: EventType
  description: string
  icon: string
}

const STORAGE_KEY = 'timeline_events'

const typeConfig: Record<EventType, { label: string; color: string; icon: string }> = {
  learn:       { label: '学习', color: '#3b82f6', icon: '📖' },
  practice:    { label: '练习', color: '#10b981', icon: '✏️' },
  game:        { label: '游戏', color: '#f59e0b', icon: '🎮' },
  achievement: { label: '成就', color: '#8b5cf6', icon: '🏆' },
}

const mockData: TimelineEvent[] = [
  { id: 1,  date: '2026-06-01', type: 'learn',       description: '开始学习分数的基本概念', icon: '📖' },
  { id: 2,  date: '2026-06-02', type: 'practice',    description: '完成分数加减法练习 20 题', icon: '✏️' },
  { id: 3,  date: '2026-06-03', type: 'game',        description: '玩了「24 点」游戏 3 局', icon: '🎮' },
  { id: 4,  date: '2026-06-05', type: 'learn',       description: '学习小数与分数的互化', icon: '📖' },
  { id: 5,  date: '2026-06-06', type: 'practice',    description: '完成小数运算练习 30 题', icon: '✏️' },
  { id: 6,  date: '2026-06-07', type: 'achievement', description: '获得「连续学习 7 天」成就', icon: '🏆' },
  { id: 7,  date: '2026-06-08', type: 'game',        description: '挑战数独成功，用时 12 分钟', icon: '🎮' },
  { id: 8,  date: '2026-06-10', type: 'learn',       description: '学习百分数的应用', icon: '📖' },
  { id: 9,  date: '2026-06-11', type: 'practice',    description: '完成百分数应用题 15 题', icon: '✏️' },
  { id: 10, date: '2026-06-13', type: 'achievement', description: '累计答对 100 道题', icon: '🏆' },
  { id: 11, date: '2026-06-14', type: 'game',        description: '记忆翻牌游戏获得满分', icon: '🎮' },
  { id: 12, date: '2026-06-16', type: 'learn',       description: '学习圆的面积与周长', icon: '📖' },
  { id: 13, date: '2026-06-17', type: 'practice',    description: '完成几何练习 25 题', icon: '✏️' },
  { id: 14, date: '2026-06-18', type: 'achievement', description: '获得「数学达人」称号', icon: '🏆' },
]

const events = ref<TimelineEvent[]>([])
const activeFilter = ref<EventType | 'all'>('all')

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      events.value = JSON.parse(stored)
    } else {
      events.value = [...mockData]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData))
    }
  } catch {
    events.value = [...mockData]
  }
}

const filteredEvents = computed(() => {
  const list = activeFilter.value === 'all'
    ? events.value
    : events.value.filter(e => e.type === activeFilter.value)
  return list.sort((a, b) => b.date.localeCompare(a.date))
})

const stats = computed(() => {
  const learnDates = new Set(events.value.filter(e => e.type === 'learn').map(e => e.date))
  return {
    learnDays: learnDates.size,
    practiceCount: events.value.filter(e => e.type === 'practice').length,
    gameCount: events.value.filter(e => e.type === 'game').length,
    achievementCount: events.value.filter(e => e.type === 'achievement').length,
  }
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

function setFilter(type: EventType | 'all') {
  activeFilter.value = type
}

onMounted(loadData)
</script>

<template>
  <div class="timeline-page">
    <button class="back-btn" @click="$router.back()">← 返回</button>
    <div class="header-card">
      <h1>📜 学习时间轴</h1>
      <p>记录你的每一个进步时刻</p>
    </div>

    <div class="filter-bar">
      <button
        v-for="(cfg, key) in { all: { label: '全部', color: 'var(--color-primary)' }, ...typeConfig }"
        :key="key"
        class="filter-btn"
        :class="{ active: activeFilter === key }"
        :style="activeFilter === key ? { background: cfg.color, color: '#fff', borderColor: cfg.color } : {}"
        @click="setFilter(key as EventType | 'all')"
      >{{ cfg.label }}</button>
    </div>

    <div class="timeline">
      <div v-for="event in filteredEvents" :key="event.id" class="timeline-item">
        <div class="timeline-dot" :style="{ background: typeConfig[event.type].color }">
          {{ event.icon }}
        </div>
        <div class="timeline-card" :style="{ borderLeftColor: typeConfig[event.type].color }">
          <div class="timeline-meta">
            <span class="timeline-date">{{ formatDate(event.date) }}</span>
            <span class="timeline-tag" :style="{ background: typeConfig[event.type].color + '18', color: typeConfig[event.type].color }">
              {{ typeConfig[event.type].label }}
            </span>
          </div>
          <p class="timeline-desc">{{ event.description }}</p>
        </div>
      </div>
      <div v-if="filteredEvents.length === 0" class="empty">暂无相关记录</div>
    </div>

    <div class="stats-bar">
      <div class="stats-item">
        <span class="stats-value" style="color: var(--color-info)">{{ stats.learnDays }}</span>
        <span class="stats-label">学习天数</span>
      </div>
      <div class="stats-item">
        <span class="stats-value" style="color: var(--color-success)">{{ stats.practiceCount }}</span>
        <span class="stats-label">练习题数</span>
      </div>
      <div class="stats-item">
        <span class="stats-value" style="color: var(--color-warning)">{{ stats.gameCount }}</span>
        <span class="stats-label">游戏次数</span>
      </div>
      <div class="stats-item">
        <span class="stats-value" style="color: #8b5cf6">{{ stats.achievementCount }}</span>
        <span class="stats-label">成就数</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-page {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-4);
  padding-bottom: calc(var(--bottomnav-height, 64px) + var(--space-8));
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  margin-bottom: var(--space-2);
}

.header-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  text-align: center;
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-4);
}
.header-card h1 { margin-bottom: var(--space-2); }
.header-card p { color: var(--text-secondary); margin-bottom: 0; font-size: var(--text-sm); }

/* 筛选栏 */
.filter-bar {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  overflow-x: auto;
  padding-bottom: var(--space-1);
}
.filter-btn {
  flex-shrink: 0;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: 1.5px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.filter-btn:hover { border-color: var(--color-primary-light); }

/* 时间轴 */
.timeline {
  position: relative;
  padding-left: 36px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--border-color);
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  margin-bottom: var(--space-4);
}
.timeline-item:last-child { margin-bottom: 0; }

.timeline-dot {
  position: absolute;
  left: -36px;
  top: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: var(--shadow-sm);
  z-index: 1;
}

.timeline-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border-left: 3px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
}
.timeline-card:hover { box-shadow: var(--shadow-md); }

.timeline-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.timeline-date {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-weight: 500;
}
.timeline-tag {
  font-size: var(--text-xs);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 500;
}
.timeline-desc {
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin-bottom: 0;
  line-height: var(--leading-relaxed);
}

.empty {
  text-align: center;
  padding: var(--space-10) 0;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

/* 统计栏 */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-6);
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}
.stats-item { text-align: center; }
.stats-value {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: 2px;
}
.stats-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}
</style>
