<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.init()
})

const petStage = computed(() => {
  const stages: Record<string, { name: string; icon: string }> = {
    baby: { name: '幼年期', icon: '🥚' },
    child: { name: '成长期', icon: '🐣' },
    teen: { name: '少年期', icon: '🐥' },
    adult: { name: '成年期', icon: '🐔' }
  }
  return stages[userStore.pet.stage] || stages.baby
})

const nextLevelExp = computed(() => userStore.level * 100)

function goto(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="profile-page">
    <header class="pf-header">
      <div class="avatar">{{ userStore.nickname?.[0] || '我' }}</div>
      <div class="info">
        <h1 class="name">{{ userStore.nickname }}</h1>
        <div class="level-bar">
          <div class="level-fill" :style="{ width: (userStore.experience / nextLevelExp * 100) + '%' }"></div>
        </div>
        <span class="level-text">Lv.{{ userStore.level }} · {{ userStore.experience }}/{{ nextLevelExp }} EXP</span>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">{{ userStore.correctTotal }}</span>
        <span class="stat-label">答对题数</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ userStore.checkInDays }}</span>
        <span class="stat-label">学习天数</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ userStore.gems }}</span>
        <span class="stat-label">宝石</span>
      </div>
    </div>

    <div class="menu-list">
      <div class="menu-item" @click="goto('/profile/achievements')">
        <span class="menu-icon">🏆</span>
        <span class="menu-label">成就墙</span>
        <span class="menu-arrow">→</span>
      </div>
      <div class="menu-item" @click="goto('/profile/pet')">
        <span class="menu-icon">{{ petStage.icon }}</span>
        <span class="menu-label">宠物小π</span>
        <span class="menu-badge">{{ petStage.name }}</span>
        <span class="menu-arrow">→</span>
      </div>
      <div class="menu-item" @click="goto('/profile/wrong-book')">
        <span class="menu-icon">📝</span>
        <span class="menu-label">错题本</span>
        <span class="menu-arrow">→</span>
      </div>
      <div class="menu-item" @click="goto('/profile/report')">
        <span class="menu-icon">📊</span>
        <span class="menu-label">学习报告</span>
        <span class="menu-arrow">→</span>
      </div>
      <div class="menu-item" @click="goto('/profile/timeline')">
        <span class="menu-icon">📜</span>
        <span class="menu-label">学习历程</span>
        <span class="menu-arrow">→</span>
      </div>
      <div class="menu-item" @click="goto('/profile/theme')">
        <span class="menu-icon">🎨</span>
        <span class="menu-label">主题设置</span>
        <span class="menu-arrow">→</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 16px;
}

.pf-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--bg-card);
  border-radius: 16px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
}
.info {
  flex: 1;
}
.name {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.level-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 4px;
}
.level-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-success));
  transition: width 0.5s;
}
.level-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.stat-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
}
.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.menu-list {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--border-color);
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:hover {
  background: var(--bg-hover);
}
.menu-icon {
  font-size: 24px;
  width: 32px;
  text-align: center;
}
.menu-label {
  flex: 1;
  font-size: 16px;
  color: var(--text-primary);
}
.menu-badge {
  font-size: 12px;
  padding: 4px 10px;
  background: var(--card-yellow-bg);
  color: var(--card-yellow-text);
  border-radius: 20px;
}
.menu-arrow {
  color: var(--text-muted);
}
</style>
