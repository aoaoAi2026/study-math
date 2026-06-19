<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const achievements = ref([
  { id: '1', name: '初次见面', desc: '完成第一次学习', icon: '👋', unlocked: true },
  { id: '2', name: '计算达人', desc: '连续答对10道计算题', icon: '🧮', unlocked: true },
  { id: '3', name: '持之以恒', desc: '连续学习7天', icon: '📅', unlocked: true },
  { id: '4', name: '奥数新星', desc: '完成第一个奥数专题', icon: '⭐', unlocked: false },
  { id: '5', name: '游戏高手', desc: '通关所有游戏', icon: '🎮', unlocked: false },
  { id: '6', name: '数学大师', desc: '掌握所有知识点', icon: '🏆', unlocked: false }
])
</script>

<template>
  <AppLayout>
    <div class="achievement-wall">
      <h1>🏆 成就墙</h1>
      <div class="achievement-grid">
        <div
          v-for="a in achievements"
          :key="a.id"
          class="achievement-card"
          :class="{ 'achievement-card--locked': !a.unlocked }"
        >
          <span class="achievement-card__icon">{{ a.icon }}</span>
          <h3 class="achievement-card__name">{{ a.name }}</h3>
          <p class="achievement-card__desc">{{ a.desc }}</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.achievement-wall {
  max-width: 800px;
  margin: 0 auto;
}

.achievement-wall h1 {
  text-align: center;
  margin-bottom: var(--space-6);
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
}

.achievement-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.achievement-card--locked {
  opacity: 0.5;
  filter: grayscale(1);
}

.achievement-card__icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--space-2);
}

.achievement-card__name {
  font-size: var(--text-base);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.achievement-card__desc {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}
</style>
