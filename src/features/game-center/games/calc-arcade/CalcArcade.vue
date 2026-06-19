<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import {
  generateProblem,
  checkAnswer,
  createInitialState,
  updateState,
  getDifficultyLevel,
  formatResult,
  type GameConfig,
  type GameState,
  type Problem
} from './gameLogic'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const gameState = ref<GameState>(createInitialState({} as GameConfig))
const currentProblem = ref<Problem | null>(null)
const userAnswer = ref('')
const showFeedback = ref(false)
const isCorrectAnswer = ref(false)
const gameMode = ref<'menu' | 'playing' | 'paused' | 'result'>('menu')
const selectedConfig = ref<GameConfig | null>(null)
const difficulties = ref(getDifficultyLevel(3))

let timerInterval: number | null = null

const progress = computed(() => {
  if (!selectedConfig.value) return 0
  return ((selectedConfig.value.timeLimit - gameState.value.timeLeft) / selectedConfig.value.timeLimit) * 100
})

const comboClass = computed(() => {
  if (gameState.value.combo >= 10) return 'combo--fire'
  if (gameState.value.combo >= 5) return 'combo--hot'
  if (gameState.value.combo >= 3) return 'combo--warm'
  return ''
})

function selectDifficulty(config: GameConfig) {
  selectedConfig.value = config
  gameState.value = createInitialState(config)
}

function startGame() {
  if (!selectedConfig.value) return

  gameMode.value = 'playing'
  currentProblem.value = generateProblem(selectedConfig.value)
  userAnswer.value = ''
  showFeedback.value = false

  timerInterval = window.setInterval(() => {
    gameState.value.timeLeft--
    if (gameState.value.timeLeft <= 0) {
      endGame()
    }
  }, 1000)
}

function submitAnswer() {
  if (!currentProblem.value || !userAnswer.value) return

  const answer = parseInt(userAnswer.value)
  isCorrectAnswer.value = checkAnswer(currentProblem.value, answer)
  showFeedback.value = true

  gameState.value = updateState(gameState.value, isCorrectAnswer.value, currentProblem.value)

  if (isCorrectAnswer.value) {
    userStore.addExp(5)
  }

  setTimeout(() => {
    if (!selectedConfig.value) return
    currentProblem.value = generateProblem(selectedConfig.value)
    userAnswer.value = ''
    showFeedback.value = false
  }, 500)
}

function pauseGame() {
  gameMode.value = 'paused'
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resumeGame() {
  gameMode.value = 'playing'
  timerInterval = window.setInterval(() => {
    gameState.value.timeLeft--
    if (gameState.value.timeLeft <= 0) {
      endGame()
    }
  }, 1000)
}

function endGame() {
  gameMode.value = 'result'
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function restartGame() {
  if (!selectedConfig.value) return
  gameState.value = createInitialState(selectedConfig.value)
  startGame()
}

function backToMenu() {
  gameMode.value = 'menu'
  gameState.value = createInitialState({} as GameConfig)
  currentProblem.value = null
}

function handleKeydown(e: KeyboardEvent) {
  if (gameMode.value !== 'playing') return
  if (e.key === 'Enter') {
    submitAnswer()
  } else if (e.key === 'Escape') {
    pauseGame()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

const result = computed(() => formatResult(gameState.value))
</script>

<template>
  <AppLayout>
    <div class="calc-arcade">
      <!-- Menu State -->
      <div v-if="gameMode === 'menu'" class="calc-arcade__menu">
        <h1 class="calc-arcade__title">🧮 计算街机</h1>
        <p class="calc-arcade__desc">选择难度开始挑战</p>

        <div class="calc-arcade__difficulty">
          <button
            v-for="(config, index) in difficulties"
            :key="index"
            class="calc-arcade__diff-btn"
            @click="selectDifficulty(config)"
          >
            <span class="calc-arcade__diff-name">
              {{ config.operations.join('') }}
            </span>
            <span class="calc-arcade__diff-info">
              范围: 1-{{ config.maxNumber }}
            </span>
            <span class="calc-arcade__diff-time">
              {{ config.timeLimit }}秒
            </span>
          </button>
        </div>

        <button
          class="calc-arcade__start-btn"
          :disabled="!selectedConfig"
          @click="startGame"
        >
          开始挑战
        </button>
      </div>

      <!-- Playing State -->
      <div v-else-if="gameMode === 'playing'" class="calc-arcade__game">
        <div class="calc-arcade__header">
          <div class="calc-arcade__score">
            <span>得分</span>
            <strong>{{ gameState.score }}</strong>
          </div>
          <div class="calc-arcade__combo" :class="comboClass">
            <span v-if="gameState.combo > 0">
              {{ gameState.combo }}连击 🔥
            </span>
          </div>
          <div class="calc-arcade__time">
            <span>剩余</span>
            <strong>{{ gameState.timeLeft }}s</strong>
          </div>
        </div>

        <div class="calc-arcade__progress">
          <div class="calc-arcade__progress-bar" :style="{ width: (100 - progress) + '%' }"></div>
        </div>

        <div class="calc-arcade__problem" :class="{ 'calc-arcade__problem--correct': showFeedback && isCorrectAnswer, 'calc-arcade__problem--wrong': showFeedback && !isCorrectAnswer }">
          <div class="calc-arcade__expression">
            {{ currentProblem?.expression }}
          </div>
          <div class="calc-arcade__answer">
            <input
              v-model="userAnswer"
              type="number"
              class="calc-arcade__input"
              placeholder="?"
              :disabled="showFeedback"
              @keyup.enter="submitAnswer"
            />
          </div>
        </div>

        <div class="calc-arcade__stats">
          <span>正确: {{ gameState.correctCount }}</span>
          <span>错误: {{ gameState.wrongCount }}</span>
          <span>正确率: {{ gameState.totalCount > 0 ? Math.round(gameState.correctCount / gameState.totalCount * 100) : 0 }}%</span>
        </div>

        <div class="calc-arcade__actions">
          <button class="calc-arcade__btn calc-arcade__btn--secondary" @click="pauseGame">
            暂停
          </button>
          <button
            class="calc-arcade__btn calc-arcade__btn--primary"
            :disabled="!userAnswer"
            @click="submitAnswer"
          >
            确认
          </button>
        </div>
      </div>

      <!-- Paused State -->
      <div v-else-if="gameMode === 'paused'" class="calc-arcade__paused">
        <h2>游戏暂停</h2>
        <button class="calc-arcade__btn calc-arcade__btn--primary" @click="resumeGame">
          继续
        </button>
        <button class="calc-arcade__btn calc-arcade__btn--secondary" @click="backToMenu">
          返回菜单
        </button>
      </div>

      <!-- Result State -->
      <div v-else-if="gameMode === 'result'" class="calc-arcade__result">
        <h2>挑战结束!</h2>

        <div class="calc-arcade__result-grade" :class="`grade--${result.grade}`">
          {{ result.grade }}
        </div>

        <div class="calc-arcade__result-stats">
          <div class="calc-arcade__result-stat">
            <span class="calc-arcade__result-label">最终得分</span>
            <span class="calc-arcade__result-value">{{ gameState.score }}</span>
          </div>
          <div class="calc-arcade__result-stat">
            <span class="calc-arcade__result-label">正确题数</span>
            <span class="calc-arcade__result-value">{{ gameState.correctCount }}/{{ gameState.totalCount }}</span>
          </div>
          <div class="calc-arcade__result-stat">
            <span class="calc-arcade__result-label">正确率</span>
            <span class="calc-arcade__result-value">{{ result.accuracy.toFixed(1) }}%</span>
          </div>
          <div class="calc-arcade__result-stat">
            <span class="calc-arcade__result-label">最高连击</span>
            <span class="calc-arcade__result-value">{{ gameState.maxCombo }}</span>
          </div>
        </div>

        <div class="calc-arcade__result-actions">
          <button class="calc-arcade__btn calc-arcade__btn--primary" @click="restartGame">
            再来一局
          </button>
          <button class="calc-arcade__btn calc-arcade__btn--secondary" @click="backToMenu">
            返回菜单
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.calc-arcade {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.calc-arcade__title {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-2);
}

.calc-arcade__desc {
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.calc-arcade__difficulty {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.calc-arcade__diff-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.calc-arcade__diff-btn:hover {
  border-color: var(--color-primary);
}

.calc-arcade__diff-name {
  font-size: var(--text-xl);
  font-weight: 600;
}

.calc-arcade__diff-info,
.calc-arcade__diff-time {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.calc-arcade__start-btn {
  width: 100%;
  padding: var(--space-4);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  font-weight: 600;
}

.calc-arcade__start-btn:disabled {
  background: var(--bg-hover);
  color: var(--text-tertiary);
}

.calc-arcade__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.calc-arcade__score,
.calc-arcade__time {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.calc-arcade__score strong,
.calc-arcade__time strong {
  display: block;
  font-size: var(--text-xl);
  color: var(--text-primary);
}

.calc-arcade__combo {
  font-size: var(--text-lg);
  font-weight: 600;
}

.combo--warm { color: var(--color-warning); }
.combo--hot { color: #f97316; }
.combo--fire { color: var(--color-error); }

.calc-arcade__progress {
  height: 4px;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
  overflow: hidden;
}

.calc-arcade__progress-bar {
  height: 100%;
  background: var(--color-success);
  transition: width 1s linear;
}

.calc-arcade__problem {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
  transition: all var(--transition-fast);
}

.calc-arcade__problem--correct {
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--color-success);
}

.calc-arcade__problem--wrong {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid var(--color-error);
}

.calc-arcade__expression {
  font-size: var(--text-3xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.calc-arcade__input {
  width: 120px;
  font-size: var(--text-3xl);
  text-align: center;
  padding: var(--space-2);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
}

.calc-arcade__stats {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.calc-arcade__actions {
  display: flex;
  gap: var(--space-3);
}

.calc-arcade__btn {
  flex: 1;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  font-weight: 600;
}

.calc-arcade__btn--primary {
  background: var(--color-primary);
  color: white;
}

.calc-arcade__btn--secondary {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.calc-arcade__paused h2 {
  margin-bottom: var(--space-6);
}

.calc-arcade__paused .calc-arcade__btn {
  margin-bottom: var(--space-3);
}

.calc-arcade__result h2 {
  margin-bottom: var(--space-4);
}

.calc-arcade__result-grade {
  font-size: 80px;
  font-weight: 700;
  margin-bottom: var(--space-6);
}

.grade--S { color: #ffd700; }
.grade--A { color: var(--color-success); }
.grade--B { color: var(--color-primary); }
.grade--C { color: var(--color-warning); }
.grade--D { color: #f97316; }
.grade--F { color: var(--color-error); }

.calc-arcade__result-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.calc-arcade__result-stat {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.calc-arcade__result-label {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}

.calc-arcade__result-value {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-primary);
}

.calc-arcade__result-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
