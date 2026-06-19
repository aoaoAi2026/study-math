<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()

interface Game {
  id: string
  name: string
  icon: string
  description: string
  difficulty: 1 | 2 | 3 | 4 | 5
  skills: string[]
  bestScore?: number
  playCount?: number
}

const games = ref<Game[]>([
  {
    id: 'calc-arcade',
    name: '计算街机',
    icon: '🧮',
    description: '快速心算训练，提升计算能力',
    difficulty: 2,
    skills: ['加减乘除', '心算速度', '反应能力'],
    bestScore: 1500,
    playCount: 23
  },
  {
    id: 'sudoku',
    name: '数独探险',
    icon: '🔢',
    description: '逻辑推理挑战，锻炼思维',
    difficulty: 3,
    skills: ['逻辑推理', '排除法', '试错策略'],
    bestScore: 980,
    playCount: 12
  },
  {
    id: 'matchstick',
    name: '火柴棒谜题',
    icon: '🔥',
    description: '移动火柴棒，变换等式图形',
    difficulty: 3,
    skills: ['空间想象', '等式变形', '图形变换']
  },
  {
    id: 'twenty-four',
    name: '24点大战',
    icon: '🎯',
    description: '用四个数字算出24',
    difficulty: 3,
    skills: ['四则运算', '数字敏感', '策略思维']
  },
  {
    id: 'monopoly',
    name: '数学大富翁',
    icon: '🎲',
    description: '边玩边学，综合能力挑战',
    difficulty: 4,
    skills: ['综合应用', '决策能力', '运气成分']
  },
  {
    id: 'one-stroke',
    name: '一笔画',
    icon: '✏️',
    description: '图论入门，一笔画完所有线',
    difficulty: 2,
    skills: ['图论直觉', '一笔规则', '路径规划']
  },
  {
    id: 'number-slide',
    name: '数字华容道',
    icon: '🧩',
    description: '滑动数字，还原顺序',
    difficulty: 2,
    skills: ['顺序推理', '最少步数', '空间布局']
  },
  {
    id: 'tangram',
    name: '图形拼板',
    icon: '🟪',
    description: '七巧板拼图游戏',
    difficulty: 3,
    skills: ['几何直觉', '图形认知', '创造力']
  },
  {
    id: 'fraction-pizza',
    name: '分数披萨店',
    icon: '🍕',
    description: '分数理解与运算',
    difficulty: 3,
    skills: ['分数概念', '等值分数', '分数运算']
  },
  {
    id: 'equation-balance',
    name: '方程天平',
    icon: '⚖️',
    description: '理解等式平衡',
    difficulty: 3,
    skills: ['等式性质', '方程思想', '逆向思维']
  },
  {
    id: 'geometry-blocks',
    name: '几何积木',
    icon: '🧱',
    description: '立体几何搭建',
    difficulty: 4,
    skills: ['立体认知', '三视图', '空间想象']
  },
  {
    id: 'memory-card',
    name: '数学记忆卡',
    icon: '🃏',
    description: '配对数学概念与例子',
    difficulty: 1,
    skills: ['概念记忆', '瞬时记忆', '专注力']
  }
])

function playGame(game: Game) {
  router.push(`/games/${game.id}`)
}

function getDifficultyLabel(difficulty: number): string {
  const labels = ['入门', '简单', '中等', '困难', '挑战']
  return labels[difficulty - 1] || '未知'
}
</script>

<template>
  <AppLayout>
    <div class="game-lobby">
      <div class="game-lobby__header">
        <h1 class="game-lobby__title">🎮 游戏中心</h1>
        <p class="game-lobby__desc">在游戏中巩固数学知识</p>
      </div>

      <div class="game-lobby__stats">
        <div class="game-lobby__stat">
          <span class="game-lobby__stat-value">{{ games.length }}</span>
          <span class="game-lobby__stat-label">游戏总数</span>
        </div>
        <div class="game-lobby__stat">
          <span class="game-lobby__stat-value">{{ games.filter(g => g.bestScore).length }}</span>
          <span class="game-lobby__stat-label">已解锁</span>
        </div>
      </div>

      <div class="game-lobby__grid">
        <div
          v-for="game in games"
          :key="game.id"
          class="game-card"
          @click="playGame(game)"
        >
          <div class="game-card__icon">{{ game.icon }}</div>
          <div class="game-card__info">
            <h3 class="game-card__name">{{ game.name }}</h3>
            <p class="game-card__desc">{{ game.description }}</p>
            <div class="game-card__meta">
              <span class="game-card__diff">{{ getDifficultyLabel(game.difficulty) }}</span>
              <span v-if="game.bestScore" class="game-card__score">
                最高分: {{ game.bestScore }}
              </span>
            </div>
          </div>
          <button class="game-card__play">开始</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.game-lobby {
  max-width: 1000px;
  margin: 0 auto;
}

.game-lobby__header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.game-lobby__title {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.game-lobby__desc {
  color: var(--text-secondary);
}

.game-lobby__stats {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.game-lobby__stat {
  flex: 1;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.game-lobby__stat-value {
  display: block;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-primary);
}

.game-lobby__stat-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.game-lobby__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.game-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.game-card__icon {
  font-size: 48px;
}

.game-card__info {
  flex: 1;
}

.game-card__name {
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.game-card__desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.game-card__meta {
  display: flex;
  gap: var(--space-3);
  font-size: var(--text-xs);
}

.game-card__diff {
  padding: 2px 8px;
  background: var(--bg-hover);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.game-card__score {
  color: var(--color-primary);
  font-weight: 500;
}

.game-card__play {
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: background var(--transition-fast);
}

.game-card__play:hover {
  background: var(--color-primary-dark);
}
</style>
