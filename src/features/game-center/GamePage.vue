<script setup lang="ts">
import { computed, ref, onErrorCaptured } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CalcArcade from './games/calc-arcade/CalcArcade.vue'
import TwentyFourGame from './games/twenty-four/TwentyFourGame.vue'
import NumberSlideGame from './games/number-slide/NumberSlideGame.vue'
import MemoryCardGame from './games/memory-card/MemoryCardGame.vue'
import MatchstickGame from './games/matchstick/MatchstickGame.vue'
import SudokuGame from './games/sudoku/Sudoku.vue'
import TangramGame from './games/tangram/TangramGame.vue'
import MonopolyGame from './games/math-monopoly/MonopolyGame.vue'

const route = useRoute()
const router = useRouter()
const gameId = computed(() => route.params.id as string)
const hasError = ref(false)
const errorMsg = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMsg.value = String(err?.message || err)
  return true
})

const gameComponents: Record<string, any> = {
  'calc-arcade': CalcArcade,
  'twenty-four': TwentyFourGame,
  'point24': TwentyFourGame,
  'number-slide': NumberSlideGame,
  'memory-card': MemoryCardGame,
  'matchstick': MatchstickGame,
  'sudoku': SudokuGame,
  'tangram': TangramGame,
  'monopoly': MonopolyGame,
  'math-monopoly': MonopolyGame
}

const currentGame = computed(() => gameComponents[gameId.value])

const gameInfo = computed(() => {
  const infos: Record<string, { name: string; icon: string; desc: string }> = {
    'calc-arcade': { name: '计算街机', icon: '🧮', desc: '限时速算挑战，考验计算速度与准确度' },
    'twenty-four': { name: '24点挑战', icon: '🃏', desc: '用四张牌和加减乘除算出24点' },
    'point24': { name: '24点挑战', icon: '🃏', desc: '用四张牌和加减乘除算出24点' },
    'number-slide': { name: '数字华容道', icon: '🔢', desc: '滑动数字方块，按顺序排列完成谜题' },
    'memory-card': { name: '数学记忆卡', icon: '🧠', desc: '翻牌配对算式与答案，锻炼记忆与心算' },
    'matchstick': { name: '火柴棒谜题', icon: '📍', desc: '移动/添加/移除火柴棒使等式成立' },
    'sudoku': { name: '数独探险', icon: '🔣', desc: '经典数独逻辑游戏，锻炼推理能力' },
    'tangram': { name: '七巧板拼图', icon: '🧩', desc: '拖拽七块板拼出目标图形，锻炼空间想象力' },
    'monopoly': { name: '数学大富翁', icon: '🎲', desc: '投掷骰子前进，答题获得金币奖励' },
    'math-monopoly': { name: '数学大富翁', icon: '🎲', desc: '投掷骰子前进，答题获得金币奖励' }
  }
  return infos[gameId.value] || { name: '游戏', icon: '🎮', desc: '暂不可用' }
})

function goBack() {
  router.push('/games')
}
</script>

<template>
  <div class="game-page">
    <div v-if="hasError" class="game-error">
      <div class="game-error__icon">⚠️</div>
      <h2>游戏加载失败</h2>
      <p class="muted">{{ errorMsg }}</p>
      <button class="back-btn" @click="goBack">返回游戏中心</button>
    </div>

    <component :is="currentGame" v-else-if="currentGame" />

    <div v-else class="game-placeholder">
      <div class="placeholder-icon">{{ gameInfo.icon }}</div>
      <h2>{{ gameInfo.name }}</h2>
      <p class="muted">{{ gameInfo.desc }}</p>
      <p class="muted">该游戏暂未开放，敬请期待...</p>
      <button class="back-btn" @click="goBack">返回游戏中心</button>
    </div>
  </div>
</template>

<style scoped>
.game-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}

.game-error {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
}

.game-error__icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.game-error h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.muted {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 24px;
}

.game-placeholder {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.game-placeholder h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.back-btn {
  padding: 12px 24px;
  background: var(--color-primary);
  color: var(--text-inverse);
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: var(--text-base);
}

.back-btn:hover {
  background: var(--color-primary-dark);
}
</style>
