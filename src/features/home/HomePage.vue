<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useLearningStore } from '@/stores/learningStore'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const learningStore = useLearningStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了，'
  if (hour < 9) return '早上好，'
  if (hour < 12) return '上午好，'
  if (hour < 14) return '中午好，'
  if (hour < 18) return '下午好，'
  if (hour < 22) return '晚上好，'
  return '夜深了，'
})

const dailyTasks = [
  { id: 1, label: '学习一个知识点', icon: '📚', done: false },
  { id: 2, label: '完成10道练习', icon: '✏️', done: false },
  { id: 3, label: '游戏时间', icon: '🎮', done: false }
]

const quickLinks = [
  { path: '/map', icon: '🗺️', label: '知识地图', desc: '探索所有知识点' },
  { path: '/diagnosis', icon: '🔬', label: '智能诊断', desc: '发现薄弱环节' },
  { path: '/challenge/daily', icon: '⚡', label: '每日挑战', desc: '赢取奖励' },
  { path: '/profile/wrong-book', icon: '📝', label: '错题本', desc: '巩固易错点' },
  { path: '/workshop', icon: '✏️', label: '出题工坊', desc: '自定义练习题' },
  { path: '/parent-academy', icon: '👨‍👩‍👧', label: '家长学院', desc: '辅导方法指南' },
  { path: '/newspaper', icon: '📰', label: '数学小报', desc: '创作数学小报' },
  { path: '/profile/timeline', icon: '📜', label: '学习历程', desc: '回顾成长足迹' }
]

const gradeTopics = [
  { grade: 1, basic: 7, olympiad: 7, completed: 3 },
  { grade: 2, basic: 6, olympiad: 9, completed: 5 },
  { grade: 3, basic: 6, olympiad: 12, completed: 8 },
  { grade: 4, basic: 7, olympiad: 17, completed: 2 },
  { grade: 5, basic: 6, olympiad: 20, completed: 0 },
  { grade: 6, basic: 8, olympiad: 16, completed: 0 }
]

onMounted(() => {
  userStore.init()
})
</script>

<template>
  <AppLayout>
    <div class="home">
      <section class="home__greeting">
        <h1 class="home__title">
          {{ greeting }}{{ userStore.nickname }}！🌟
        </h1>
        <p class="home__subtitle">
          今天也要加油学习数学哦！
        </p>
      </section>

      <section class="home__stats">
        <div class="home__stat">
          <span class="home__stat-value">{{ userStore.level }}</span>
          <span class="home__stat-label">等级</span>
        </div>
        <div class="home__stat">
          <span class="home__stat-value">{{ userStore.experience }}</span>
          <span class="home__stat-label">经验值</span>
        </div>
        <div class="home__stat">
          <span class="home__stat-value">{{ userStore.correctTotal }}</span>
          <span class="home__stat-label">答对题数</span>
        </div>
        <div class="home__stat">
          <span class="home__stat-value">{{ userStore.checkInDays }}</span>
          <span class="home__stat-label">学习天数</span>
        </div>
      </section>

      <section class="home__tasks">
        <h2 class="home__section-title">今日任务</h2>
        <div class="home__task-list">
          <div
            v-for="task in dailyTasks"
            :key="task.id"
            class="home__task"
            :class="{ 'home__task--done': task.done }"
          >
            <span class="home__task-icon">{{ task.icon }}</span>
            <span class="home__task-label">{{ task.label }}</span>
            <span class="home__task-check">{{ task.done ? '✓' : '○' }}</span>
          </div>
        </div>
      </section>

      <section class="home__quick">
        <h2 class="home__section-title">快捷入口</h2>
        <div class="home__quick-grid">
          <router-link
            v-for="link in quickLinks"
            :key="link.path"
            :to="link.path"
            class="home__quick-item"
          >
            <span class="home__quick-icon">{{ link.icon }}</span>
            <span class="home__quick-label">{{ link.label }}</span>
            <span class="home__quick-desc">{{ link.desc }}</span>
          </router-link>
        </div>
      </section>

      <section class="home__grade">
        <h2 class="home__section-title">年级进度</h2>
        <div class="home__grade-list">
          <router-link
            v-for="g in gradeTopics"
            :key="g.grade"
            :to="`/learning?grade=${g.grade}`"
            class="home__grade-item"
            :class="{ 'home__grade-item--active': g.grade === userStore.grade }"
          >
            <span class="home__grade-num">{{ g.grade }}年级</span>
            <div class="home__grade-progress">
              <div class="home__grade-bar">
                <div
                  class="home__grade-fill"
                  :style="{ width: (g.completed / (g.basic + g.olympiad) * 100) + '%' }"
                ></div>
              </div>
              <span class="home__grade-text">{{ g.completed }}/{{ g.basic + g.olympiad }}</span>
            </div>
          </router-link>
        </div>
      </section>

      <section class="home__continue">
        <h2 class="home__section-title">继续学习</h2>
        <div class="home__continue-card">
          <div class="home__continue-icon">📐</div>
          <div class="home__continue-info">
            <h3 class="home__continue-title">和倍问题</h3>
            <p class="home__continue-desc">三年级 · 奥数专题 · 第3步</p>
          </div>
          <button class="home__continue-btn" @click="$router.push('/learning/topic/g3-sum-multiple')">
            继续 →
          </button>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}

.home__greeting {
  text-align: center;
  margin-bottom: var(--space-8);
}

.home__title {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.home__subtitle {
  color: var(--text-secondary);
  font-size: var(--text-lg);
}

.home__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.home__stat {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.home__stat-value {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-primary);
}

.home__stat-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.home__section-title {
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.home__tasks {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.home__task-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.home__task {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
}

.home__task--done {
  opacity: 0.6;
}

.home__task--done .home__task-label {
  text-decoration: line-through;
}

.home__task-icon {
  font-size: var(--text-xl);
}

.home__task-label {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
}

.home__task-check {
  color: var(--text-tertiary);
  font-size: var(--text-lg);
}

.home__quick {
  margin-bottom: var(--space-6);
}

.home__quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.home__quick-item {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.home__quick-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.home__quick-icon {
  font-size: 32px;
}

.home__quick-label {
  font-weight: 600;
  color: var(--text-primary);
}

.home__quick-desc {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.home__grade {
  margin-bottom: var(--space-6);
}

.home__grade-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.home__grade-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.home__grade-item--active {
  background: rgba(99, 102, 241, 0.1);
  border: 2px solid var(--color-primary);
}

.home__grade-num {
  width: 80px;
  font-weight: 500;
  color: var(--text-primary);
}

.home__grade-progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.home__grade-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.home__grade-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
}

.home__grade-text {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  width: 60px;
  text-align: right;
}

.home__continue {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}

.home__continue-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.home__continue-icon {
  font-size: 48px;
}

.home__continue-info {
  flex: 1;
}

.home__continue-title {
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.home__continue-desc {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin: 0;
}

.home__continue-btn {
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 500;
}

@media (max-width: 640px) {
  .home__stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .home__quick-grid {
    grid-template-columns: 1fr;
  }
}
</style>
