<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()

interface GameInfo {
  id: string
  name: string
  icon: string
  desc: string
  difficulty: 1 | 2 | 3 | 4 | 5
  category: 'calc' | 'logic' | 'puzzle' | 'memory'
  players: number
}

const games: GameInfo[] = [
  {
    id: 'calc-arcade',
    name: '计算街机',
    icon: '🧮',
    desc: '限时速算挑战，考验计算速度与准确度',
    difficulty: 2,
    category: 'calc',
    players: 12580
  },
  {
    id: 'twenty-four',
    name: '24点挑战',
    icon: '🃏',
    desc: '用四张牌和加减乘除算出24点',
    difficulty: 3,
    category: 'calc',
    players: 8640
  },
  {
    id: 'number-slide',
    name: '数字华容道',
    icon: '🔢',
    desc: '滑动数字方块，按顺序排列完成谜题',
    difficulty: 3,
    category: 'puzzle',
    players: 6540
  },
  {
    id: 'memory-card',
    name: '数学记忆卡',
    icon: '🧠',
    desc: '翻牌配对算式与答案，锻炼记忆与心算',
    difficulty: 2,
    category: 'memory',
    players: 5430
  },
  {
    id: 'matchstick',
    name: '火柴棒谜题',
    icon: '📍',
    desc: '移动/添加/移除火柴棒使等式成立',
    difficulty: 4,
    category: 'puzzle',
    players: 4320
  },
  {
    id: 'sudoku',
    name: '数独探险',
    icon: '🔣',
    desc: '经典数独逻辑游戏，锻炼推理能力',
    difficulty: 3,
    category: 'logic',
    players: 8920
  }
]

const categories = [
  { id: 'all', label: '全部' },
  { id: 'calc', label: '计算' },
  { id: 'logic', label: '逻辑' },
  { id: 'puzzle', label: '益智' },
  { id: 'memory', label: '记忆' }
]

const selectedCategory = ref('all')

const filteredGames = computed(() => {
  if (selectedCategory.value === 'all') return games
  return games.filter(g => g.category === selectedCategory.value)
})

function playGame(id: string) {
  router.push('/games/' + id)
}

function getDifficultyStars(n: number) {
  return '⭐'.repeat(n)
}
</script>

<template>
  <AppLayout>
    <div class="game-lobby">
      <header class="gl-header">
        <h1>🎮 游戏中心</h1>
        <p class="muted">边玩边学，让数学变得有趣</p>
      </header>

      <div class="category-tabs">
        <button
          v-for="c in categories"
          :key="c.id"
          class="category-tab"
          :class="{ active: selectedCategory === c.id }"
          @click="selectedCategory = c.id"
        >
          {{ c.label }}
        </button>
      </div>

      <div class="games-grid">
        <div
          v-for="game in filteredGames"
          :key="game.id"
          class="game-card"
          @click="playGame(game.id)"
        >
          <div class="game-icon">{{ game.icon }}</div>
          <div class="game-info">
            <h3 class="game-name">{{ game.name }}</h3>
            <p class="game-desc">{{ game.desc }}</p>
            <div class="game-meta">
              <span class="stars">{{ getDifficultyStars(game.difficulty) }}</span>
              <span class="players">{{ game.players.toLocaleString() }} 人在玩</span>
            </div>
          </div>
          <button class="play-btn">开始</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.game-lobby {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}

.gl-header {
  text-align: center;
  margin-bottom: 24px;
}
.gl-header h1 {
  font-size: 28px;
  color: #2C3E50;
  margin-bottom: 6px;
}
.muted {
  color: #9AA5B1;
  font-size: 14px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.category-tab {
  padding: 10px 20px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  background: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.category-tab.active {
  background: #4F7DF8;
  border-color: #4F7DF8;
  color: white;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.game-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border: 2px solid #E2E8F0;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.15s;
}
.game-card:hover {
  border-color: #4F7DF8;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.game-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  border-radius: 16px;
}
.game-info {
  flex: 1;
}
.game-name {
  font-size: 18px;
  color: #2C3E50;
  margin-bottom: 4px;
}
.game-desc {
  font-size: 13px;
  color: #6B7785;
  margin-bottom: 8px;
}
.game-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
}
.stars {
  color: #F59E0B;
}
.players {
  color: #9AA5B1;
}
.play-btn {
  padding: 10px 20px;
  background: #4F7DF8;
  color: white;
  border-radius: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
</style>
