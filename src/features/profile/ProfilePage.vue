<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
</script>

<template>
  <AppLayout>
    <div class="profile-page">
      <div class="profile-page__header">
        <div class="profile-page__avatar">{{ userStore.nickname?.[0] || '我' }}</div>
        <h1 class="profile-page__name">{{ userStore.nickname }}</h1>
        <p class="profile-page__meta">Lv.{{ userStore.level }} · {{ userStore.experience }} EXP</p>
      </div>

      <div class="profile-page__stats">
        <div class="profile-page__stat">
          <span class="profile-page__stat-value">{{ userStore.correctTotal }}</span>
          <span class="profile-page__stat-label">答对题数</span>
        </div>
        <div class="profile-page__stat">
          <span class="profile-page__stat-value">{{ userStore.checkInDays }}</span>
          <span class="profile-page__stat-label">学习天数</span>
        </div>
        <div class="profile-page__stat">
          <span class="profile-page__stat-value">{{ userStore.achievements.length }}</span>
          <span class="profile-page__stat-label">成就数量</span>
        </div>
      </div>

      <div class="profile-page__menu">
        <router-link to="/profile/achievements" class="profile-page__menu-item">
          <span>🏆</span> 成就墙
        </router-link>
        <router-link to="/profile/pet" class="profile-page__menu-item">
          <span>🐱</span> 宠物小π
        </router-link>
        <router-link to="/profile/wrong-book" class="profile-page__menu-item">
          <span>📝</span> 错题本
        </router-link>
        <router-link to="/parent" class="profile-page__menu-item">
          <span>👪</span> 家长控制
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.profile-page {
  max-width: 500px;
  margin: 0 auto;
}

.profile-page__header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.profile-page__avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
}

.profile-page__name {
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.profile-page__meta {
  color: var(--text-secondary);
}

.profile-page__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.profile-page__stat {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.profile-page__stat-value {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-primary);
}

.profile-page__stat-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.profile-page__menu {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.profile-page__menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.profile-page__menu-item:last-child {
  border-bottom: none;
}
</style>
