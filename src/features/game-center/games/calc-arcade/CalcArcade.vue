<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const gameState = ref<GameState>(createInitialState({} as GameConfig))
const currentProblem = ref<Problem | null>(null)
const userAnswer = ref('')
const showFeedback = ref(false)
const isCorrectAnswer = ref(false)
const gameMode = ref<'menu' | 'playing' | 'paused' | 'result'>('menu')
const selectedConfig = ref<GameConfig | null>(null)
const difficulties = ref(getDifficultyLevel(3))
const inputRef = ref<HTMLInputElement | null>(null)

let timerInterval: number | null = null

const progress = computed(() => {
  if (!selectedConfig.value) return 0
  return ((selectedConfig.value.timeLimit - gameState.value.timeLeft) / selectedConfig.value.timeLimit) * 100
})

const timerColor = computed(() => {
  if (gameState.value.timeLeft <= 10) return 'timer--danger'
  if (gameState.value.timeLeft <= 20) return 'timer--warning'
  return ''
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

  setTimeout(() => {
    inputRef.value?.focus()
  }, 100)

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

  setTimeout(() => {
    if (!selectedConfig.value) return
    currentProblem.value = generateProblem(selectedConfig.value)
    userAnswer.value = ''
    showFeedback.value = false
    inputRef.value?.focus()
  }, 400)
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
  inputRef.value?.focus()
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

const result = computed(() => selectedConfig.value ? formatResult(gameState.value, selectedConfig.value) : { accuracy: 0, avgTime: 0, bestStreak: 0, grade: 'F' })
</script>

<template>
  <div class="calc-arcade">
      <!-- Menu State -->
      <div v-if="gameMode === 'menu'" class="calc-arcade__menu">
        <div class="calc-arcade__logo">
          <span class="calc-arcade__logo-icon">🧮</span>
          <h1 class="calc-arcade__title">计算街机</h1>
          <p class="calc-arcade__subtitle">Math Arcade</p>
        </div>
        <p class="calc-arcade__desc">选择难度，挑战你的计算极限！</p>

        <div class="calc-arcade__difficulty">
          <button
            v-for="(config, index) in difficulties"
            :key="index"
            class="calc-arcade__diff-card"
            :class="{ 'calc-arcade__diff-card--selected': selectedConfig?.operations.join('') === config.operations.join('') }"
            @click="selectDifficulty(config)"
          >
            <div class="calc-arcade__diff-icon">
              {{ config.operations.length === 1 ? '⚡' : config.operations.length === 2 ? '🔥' : '💥' }}
            </div>
            <div class="calc-arcade__diff-content">
              <div class="calc-arcade__diff-name">
                {{ config.operations.join(' ') }}
              </div>
              <div class="calc-arcade__diff-details">
                <span class="calc-arcade__diff-range">范围: 1-{{ config.maxNumber }}</span>
                <span class="calc-arcade__diff-time">⏱️ {{ config.timeLimit }}秒</span>
              </div>
            </div>
            <div v-if="selectedConfig?.operations.join('') === config.operations.join('')" class="calc-arcade__diff-check">✓</div>
          </button>
        </div>

        <button
          class="calc-arcade__start-btn"
          :disabled="!selectedConfig"
          @click="startGame"
        >
          <span class="calc-arcade__btn-text">开始挑战</span>
          <span class="calc-arcade__btn-arrow">→</span>
        </button>
      </div>

      <!-- Playing State -->
      <div v-else-if="gameMode === 'playing'" class="calc-arcade__game">
        <div class="calc-arcade__header">
          <div class="calc-arcade__info">
            <div class="calc-arcade__score">
              <span class="calc-arcade__score-label">得分</span>
              <strong class="calc-arcade__score-value">{{ gameState.score }}</strong>
            </div>
            <div class="calc-arcade__combo" :class="comboClass">
              <span v-if="gameState.combo > 0">
                🔥 {{ gameState.combo }}连击
              </span>
            </div>
          </div>
          <div class="calc-arcade__timer" :class="timerColor">
            <span class="calc-arcade__timer-icon">⏱️</span>
            <span class="calc-arcade__timer-value">{{ gameState.timeLeft }}</span>
          </div>
        </div>

        <div class="calc-arcade__progress-container">
          <div class="calc-arcade__progress-bar" :style="{ width: (100 - progress) + '%' }"></div>
          <div class="calc-arcade__progress-glow" :style="{ left: (100 - progress) + '%' }"></div>
        </div>

        <div class="calc-arcade__problem-container">
          <div 
            class="calc-arcade__problem" 
            :class="{ 
              'calc-arcade__problem--correct': showFeedback && isCorrectAnswer, 
              'calc-arcade__problem--wrong': showFeedback && !isCorrectAnswer 
            }"
          >
            <div class="calc-arcade__expression">
              {{ currentProblem?.expression }}
              <span class="calc-arcade__equals">=</span>
            </div>
            <div class="calc-arcade__answer-box">
              <input
                ref="inputRef"
                v-model="userAnswer"
                type="number"
                class="calc-arcade__input"
                placeholder="?"
                :disabled="showFeedback"
                @keyup.enter="submitAnswer"
              />
            </div>
          </div>
          <div v-if="showFeedback" class="calc-arcade__feedback" :class="isCorrectAnswer ? 'feedback--correct' : 'feedback--wrong'">
            {{ isCorrectAnswer ? '✅ 正确!' : '❌ 错误' }}
          </div>
        </div>

        <div class="calc-arcade__stats">
          <div class="calc-arcade__stat-item">
            <span class="calc-arcade__stat-icon">✓</span>
            <span class="calc-arcade__stat-value">{{ gameState.correctCount }}</span>
            <span class="calc-arcade__stat-label">正确</span>
          </div>
          <div class="calc-arcade__stat-divider"></div>
          <div class="calc-arcade__stat-item">
            <span class="calc-arcade__stat-icon">✗</span>
            <span class="calc-arcade__stat-value">{{ gameState.wrongCount }}</span>
            <span class="calc-arcade__stat-label">错误</span>
          </div>
          <div class="calc-arcade__stat-divider"></div>
          <div class="calc-arcade__stat-item">
            <span class="calc-arcade__stat-icon">📊</span>
            <span class="calc-arcade__stat-value">{{ gameState.totalCount > 0 ? Math.round(gameState.correctCount / gameState.totalCount * 100) : 0 }}%</span>
            <span class="calc-arcade__stat-label">正确率</span>
          </div>
        </div>

        <div class="calc-arcade__actions">
          <button class="calc-arcade__btn calc-arcade__btn--secondary" @click="pauseGame">
            <span>⏸️</span>
            <span>暂停</span>
          </button>
          <button
            class="calc-arcade__btn calc-arcade__btn--primary"
            :disabled="!userAnswer"
            @click="submitAnswer"
          >
            <span>确认</span>
            <span class="calc-arcade__btn-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- Paused State -->
      <div v-else-if="gameMode === 'paused'" class="calc-arcade__paused">
        <div class="calc-arcade__paused-icon">⏸️</div>
        <h2 class="calc-arcade__paused-title">游戏暂停</h2>
        <div class="calc-arcade__paused-score">当前得分: <strong>{{ gameState.score }}</strong></div>
        
        <div class="calc-arcade__paused-actions">
          <button class="calc-arcade__btn calc-arcade__btn--primary" @click="resumeGame">
            <span>▶️</span>
            <span>继续游戏</span>
          </button>
          <button class="calc-arcade__btn calc-arcade__btn--secondary" @click="backToMenu">
            <span>🏠</span>
            <span>返回菜单</span>
          </button>
        </div>
      </div>

      <!-- Result State -->
      <div v-else-if="gameMode === 'result'" class="calc-arcade__result">
        <div class="calc-arcade__result-header">
          <div class="calc-arcade__result-icon">🎮</div>
          <h2 class="calc-arcade__result-title">挑战结束!</h2>
        </div>

        <div class="calc-arcade__result-grade-container">
          <div class="calc-arcade__result-grade" :class="`grade--${result.grade}`">
            {{ result.grade }}
          </div>
          <div class="calc-arcade__result-grade-label">评级</div>
        </div>

        <div class="calc-arcade__result-score">
          <span class="calc-arcade__result-score-label">最终得分</span>
          <span class="calc-arcade__result-score-value">{{ gameState.score }}</span>
        </div>

        <div class="calc-arcade__result-stats">
          <div class="calc-arcade__result-stat-card">
            <span class="calc-arcade__result-stat-icon">✅</span>
            <div class="calc-arcade__result-stat-content">
              <span class="calc-arcade__result-stat-value">{{ gameState.correctCount }}/{{ gameState.totalCount }}</span>
              <span class="calc-arcade__result-stat-label">正确题数</span>
            </div>
          </div>
          <div class="calc-arcade__result-stat-card">
            <span class="calc-arcade__result-stat-icon">📊</span>
            <div class="calc-arcade__result-stat-content">
              <span class="calc-arcade__result-stat-value">{{ result.accuracy.toFixed(1) }}%</span>
              <span class="calc-arcade__result-stat-label">正确率</span>
            </div>
          </div>
          <div class="calc-arcade__result-stat-card">
            <span class="calc-arcade__result-stat-icon">🔥</span>
            <div class="calc-arcade__result-stat-content">
              <span class="calc-arcade__result-stat-value">{{ gameState.maxCombo }}</span>
              <span class="calc-arcade__result-stat-label">最高连击</span>
            </div>
          </div>
        </div>

        <div class="calc-arcade__result-actions">
          <button class="calc-arcade__btn calc-arcade__btn--primary" @click="restartGame">
            <span>🔄</span>
            <span>再来一局</span>
          </button>
          <button class="calc-arcade__btn calc-arcade__btn--secondary" @click="backToMenu">
            <span>🏠</span>
            <span>返回菜单</span>
          </button>
        </div>
      </div>
  </div>
</template>

<style scoped>
.calc-arcade {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

/* Menu Styles */
.calc-arcade__menu {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.calc-arcade__logo {
  margin-bottom: 32px;
}

.calc-arcade__logo-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.calc-arcade__title {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4ff, #7c3aed, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
}

.calc-arcade__subtitle {
  font-size: 14px;
  color: #94a3b8;
  letter-spacing: 8px;
}

.calc-arcade__desc {
  color: #cbd5e1;
  font-size: 16px;
  margin-bottom: 32px;
}

.calc-arcade__difficulty {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.calc-arcade__diff-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.calc-arcade__diff-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-2px);
}

.calc-arcade__diff-card--selected {
  background: rgba(124, 58, 237, 0.15);
  border-color: #7c3aed;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
}

.calc-arcade__diff-icon {
  font-size: 28px;
}

.calc-arcade__diff-content {
  flex: 1;
  text-align: left;
}

.calc-arcade__diff-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.calc-arcade__diff-details {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #94a3b8;
}

.calc-arcade__diff-check {
  width: 24px;
  height: 24px;
  background: #7c3aed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.calc-arcade__start-btn {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #7c3aed, #00d4ff);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
}

.calc-arcade__start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(124, 58, 237, 0.6);
}

.calc-arcade__start-btn:disabled {
  background: #475569;
  cursor: not-allowed;
  box-shadow: none;
}

.calc-arcade__btn-arrow {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.calc-arcade__start-btn:hover:not(:disabled) .calc-arcade__btn-arrow {
  transform: translateX(4px);
}

/* Game Styles */
.calc-arcade__game {
  width: 100%;
  max-width: 400px;
}

.calc-arcade__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.calc-arcade__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calc-arcade__score {
  display: flex;
  flex-direction: column;
}

.calc-arcade__score-label {
  font-size: 12px;
  color: #94a3b8;
}

.calc-arcade__score-value {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.calc-arcade__combo {
  font-size: 14px;
  font-weight: 600;
  color: #fbbf24;
}

.combo--warm { color: #fbbf24; }
.combo--hot { color: #fb923c; }
.combo--fire { color: #ef4444; animation: pulse 0.5s infinite; }

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.calc-arcade__timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
}

.calc-arcade__timer-icon {
  font-size: 18px;
}

.calc-arcade__timer-value {
  font-size: 24px;
  font-weight: 700;
  color: #22c55e;
}

.timer--warning .calc-arcade__timer-value { color: #f59e0b; }
.timer--danger .calc-arcade__timer-value { 
  color: #ef4444; 
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.calc-arcade__progress-container {
  position: relative;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 24px;
  overflow: visible;
}

.calc-arcade__progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #10b981);
  border-radius: 4px;
  transition: width 1s linear;
}

.calc-arcade__progress-glow {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e;
  transition: left 1s linear;
}

.calc-arcade__problem-container {
  position: relative;
  margin-bottom: 24px;
}

.calc-arcade__problem {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
}

.calc-arcade__problem--correct {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.3);
}

.calc-arcade__problem--wrong {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
}

.calc-arcade__expression {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.calc-arcade__equals {
  color: #7c3aed;
}

.calc-arcade__answer-box {
  display: flex;
  justify-content: center;
}

.calc-arcade__input {
  width: 160px;
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  outline: none;
  transition: all 0.3s ease;
}

.calc-arcade__input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
}

.calc-arcade__input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.calc-arcade__feedback {
  position: absolute;
  top: 50%;
  right: -80px;
  transform: translateY(-50%);
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-50%) translateX(20px); }
  to { opacity: 1; transform: translateY(-50%) translateX(0); }
}

.feedback--correct {
  background: rgba(34, 197, 94, 0.9);
  color: white;
}

.feedback--wrong {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.calc-arcade__stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.calc-arcade__stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.calc-arcade__stat-icon {
  font-size: 16px;
}

.calc-arcade__stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.calc-arcade__stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.calc-arcade__stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

.calc-arcade__actions {
  display: flex;
  gap: 16px;
}

.calc-arcade__btn {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.calc-arcade__btn--primary {
  background: linear-gradient(135deg, #7c3aed, #00d4ff);
  color: white;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
}

.calc-arcade__btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
}

.calc-arcade__btn--primary:disabled {
  background: #475569;
  cursor: not-allowed;
  box-shadow: none;
}

.calc-arcade__btn--secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.calc-arcade__btn--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Paused Styles */
.calc-arcade__paused {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.calc-arcade__paused-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.calc-arcade__paused-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.calc-arcade__paused-score {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 32px;
}

.calc-arcade__paused-score strong {
  color: #7c3aed;
}

.calc-arcade__paused-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Result Styles */
.calc-arcade__result {
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.calc-arcade__result-header {
  margin-bottom: 24px;
}

.calc-arcade__result-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.calc-arcade__result-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.calc-arcade__result-grade-container {
  margin-bottom: 24px;
}

.calc-arcade__result-grade {
  font-size: 96px;
  font-weight: 800;
  text-shadow: 0 0 40px currentColor;
}

.calc-arcade__result-grade-label {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 8px;
}

.grade--S { 
  color: #ffd700; 
  animation: shine 2s infinite;
}
.grade--A { color: #22c55e; }
.grade--B { color: #3b82f6; }
.grade--C { color: #f59e0b; }
.grade--D { color: #f97316; }
.grade--F { color: #ef4444; }

@keyframes shine {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

.calc-arcade__result-score {
  margin-bottom: 24px;
}

.calc-arcade__result-score-label {
  display: block;
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.calc-arcade__result-score-value {
  font-size: 48px;
  font-weight: 800;
  color: #fff;
}

.calc-arcade__result-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.calc-arcade__result-stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.calc-arcade__result-stat-icon {
  font-size: 20px;
}

.calc-arcade__result-stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calc-arcade__result-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.calc-arcade__result-stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.calc-arcade__result-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>