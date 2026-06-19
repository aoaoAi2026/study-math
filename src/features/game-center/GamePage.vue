<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import CalcArcade from './games/calc-arcade/CalcArcade.vue'

const route = useRoute()
const gameId = computed(() => route.params.id as string)

const gameComponents: Record<string, any> = {
  'calc-arcade': CalcArcade,
  // 其他游戏组件可以在这里添加
}

const currentGame = computed(() => gameComponents[gameId.value])

const gameInfo = computed(() => {
  const infos: Record<string, { name: string; icon: string }> = {
    'calc-arcade': { name: '计算街机', icon: '🧮' },
    'sudoku': { name: '数独探险', icon: '🔢' },
    'point24': { name: '24点挑战', icon: '🃏' },
    'matchstick': { name: '火柴棒谜题', icon: '📍' }
  }
  return infos[gameId.value] || { name: '游戏', icon: '🎮' }
})
</script>

<template>
  <AppLayout>
    <div class="game-page">
      <component :is="currentGame" v-if="currentGame" />
      <div v-else class="game-placeholder">
        <div class="placeholder-icon">{{ gameInfo.icon }}</div>
        <h2>{{ gameInfo.name }}</h2>
        <p>游戏开发中，敬请期待...</p>
        <button class="back-btn" @click="$router.push('/games')">返回游戏中心</button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.game-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}
.game-placeholder {
  text-align: center;
  padding: 80px 20px;
}
.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
.game-placeholder h2 {
  font-size: 24px;
  color: #2C3E50;
  margin-bottom: 8px;
}
.game-placeholder p {
  color: #9AA5B1;
  margin-bottom: 24px;
}
.back-btn {
  padding: 12px 24px;
  background: #4F7DF8;
  color: white;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
</style>
