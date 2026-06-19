<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const petName = '小π'
const petMood = ref('happy')
const petStage = ref('baby')
const petExp = ref(150)
const petHunger = ref(80)

const moods = [
  { value: 'happy', emoji: '😊', label: '开心' },
  { value: 'sleepy', emoji: '😴', label: '困了' },
  { value: 'excited', emoji: '🤩', label: '兴奋' },
  { value: 'sad', emoji: '😢', label: '难过' }
]
</script>

<template>
  <AppLayout>
    <div class="pet-companion">
      <div class="pet-companion__display">
        <div class="pet-companion__stage">{{ petStage }}</div>
        <div class="pet-companion__mood">{{ moods.find(m => m.value === petMood)?.emoji }}</div>
        <h2 class="pet-companion__name">{{ petName }}</h2>
      </div>

      <div class="pet-companion__stats">
        <div class="pet-companion__stat">
          <span>饱食度</span>
          <div class="pet-companion__bar">
            <div class="pet-companion__fill" :style="{ width: petHunger + '%' }"></div>
          </div>
        </div>
        <div class="pet-companion__stat">
          <span>经验值</span>
          <div class="pet-companion__bar">
            <div class="pet-companion__fill pet-companion__fill--exp" :style="{ width: (petExp % 100) + '%' }"></div>
          </div>
          <span>{{ petExp }} / 500</span>
        </div>
      </div>

      <div class="pet-companion__actions">
        <button class="pet-companion__action">🍖 喂食</button>
        <button class="pet-companion__action">🎮 陪玩</button>
        <button class="pet-companion__action">📖 学习</button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.pet-companion {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.pet-companion__display {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-md);
}

.pet-companion__stage {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: var(--space-2);
}

.pet-companion__mood {
  font-size: 80px;
  margin-bottom: var(--space-4);
}

.pet-companion__name {
  font-size: var(--text-xl);
  color: var(--text-primary);
}

.pet-companion__stats {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.pet-companion__stat {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.pet-companion__stat:last-child {
  margin-bottom: 0;
}

.pet-companion__bar {
  flex: 1;
  height: 8px;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.pet-companion__fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}

.pet-companion__fill--exp {
  background: var(--color-success);
}

.pet-companion__actions {
  display: flex;
  gap: var(--space-3);
}

.pet-companion__action {
  flex: 1;
  padding: var(--space-3);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
}
</style>
