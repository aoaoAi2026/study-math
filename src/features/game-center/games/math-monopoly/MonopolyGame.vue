<script setup lang="ts">
/**
 * MonopolyGame - 数学大富翁
 * 回合制数学问答游戏，玩家在棋盘上移动，回答问题获得金币
 */
import { ref, computed, onMounted } from 'vue'

type GamePhase = 'start' | 'board' | 'question' | 'result' | 'end'
type TileType = 'normal' | 'question' | 'bonus' | 'penalty' | 'start'

interface Tile {
  id: number
  type: TileType
  label: string
  icon: string
}

interface Question {
  stem: string
  options: string[]
  answer: number
  reward?: number
  penalty?: number
}

interface Player {
  name: string
  position: number
  coins: number
  avatar: string
}

const BOARD_TILES: Tile[] = [
  { id: 0, type: 'start', label: '起点', icon: '🏁' },
  { id: 1, type: 'question', label: '计算题', icon: '➕' },
  { id: 2, type: 'normal', label: '', icon: '' },
  { id: 3, type: 'bonus', label: '宝箱', icon: '📦' },
  { id: 4, type: 'question', label: '应用题', icon: '📝' },
  { id: 5, type: 'normal', label: '', icon: '' },
  { id: 6, type: 'question', label: '几何题', icon: '📐' },
  { id: 7, type: 'penalty', label: '陷阱', icon: '⚠️' },
  { id: 8, type: 'question', label: '数论题', icon: '🔢' },
  { id: 9, type: 'normal', label: '', icon: '' },
  { id: 10, type: 'bonus', label: '大奖', icon: '🎁' },
  { id: 11, type: 'question', label: '计算题', icon: '➖' },
  { id: 12, type: 'normal', label: '', icon: '' },
  { id: 13, type: 'question', label: '应用题', icon: '📖' },
  { id: 14, type: 'penalty', label: '怪兽', icon: '👾' },
  { id: 15, type: 'question', label: '混合题', icon: '🎯' },
]

const QUESTIONS: Question[] = [
  { stem: '125 + 378 = ?', options: ['493', '503', '513', '503'], answer: 1, reward: 50 },
  { stem: '小明有 23 颗糖，吃了 8 颗，还剩几颗？', options: ['13', '15', '14', '12'], answer: 1, reward: 60 },
  { stem: '一个正方形的边长是 5 cm，周长是多少？', options: ['20cm', '25cm', '15cm', '10cm'], answer: 0, reward: 70 },
  { stem: '12 和 18 的最大公因数是？', options: ['3', '6', '9', '2'], answer: 1, reward: 80 },
  { stem: '1000 - 456 = ?', options: ['544', '546', '554', '534'], answer: 0, reward: 50 },
  { stem: '一块地长 8m，宽 5m，面积是？', options: ['40m²', '26m²', '13m²', '80m²'], answer: 0, reward: 70 },
  { stem: '36 × 5 = ?', options: ['170', '180', '160', '175'], answer: 1, reward: 60 },
  { stem: '比 45 多 38 的数是？', options: ['73', '83', '93', '63'], answer: 1, reward: 50 },
]

const phase = ref<GamePhase>('start')
const player = ref<Player>({
  name: '小数学家',
  position: 0,
  coins: 100,
  avatar: '🧮'
})
const dice = ref(0)
const isRolling = ref(false)
const currentQuestion = ref<Question | null>(null)
const selectedAnswer = ref<number | null>(null)
const questionResult = ref<'correct' | 'wrong' | null>(null)
const showDice = ref(false)
const turnMessages = ref<string[]>([])
const gameLog = ref<string[]>([])
const totalTurns = ref(0)

const playerStyle = computed(() => {
  const tileIndex = player.value.position % BOARD_TILES.length
  const row = Math.floor(tileIndex / 4)
  const col = tileIndex % 4
  const maxCol = BOARD_TILES.length / 4 - 1
  
  let x = 20 + col * 22
  let y = 20 + row * 22
  
  if (row % 2 === 1) {
    x = 20 + (maxCol - col) * 22
  }
  
  return {
    left: `${x}%`,
    top: `${y}%`
  }
})

function rollDice() {
  if (isRolling.value) return
  isRolling.value = true
  showDice.value = false
  
  let count = 0
  const interval = setInterval(() => {
    dice.value = Math.floor(Math.random() * 6) + 1
    count++
    if (count > 10) {
      clearInterval(interval)
      isRolling.value = false
      showDice.value = true
      movePlayer()
    }
  }, 80)
}

function movePlayer() {
  const steps = dice.value
  const oldPos = player.value.position
  player.value.position = (player.value.position + steps) % BOARD_TILES.length
  
  if (player.value.position <= oldPos) {
    player.value.coins += 50
    addLog('🎉 绕一圈回到起点，获得 50 金币！')
  }
  
  totalTurns.value++
  checkTile()
}

function checkTile() {
  const tile = BOARD_TILES[player.value.position % BOARD_TILES.length]
  
  switch (tile.type) {
    case 'start':
      addLog('欢迎来到数学大富翁！')
      break
    case 'question':
      showQuestion()
      break
    case 'bonus':
      const bonus = Math.floor(Math.random() * 30) + 20
      player.value.coins += bonus
      addLog(`🎁 恭喜！获得 ${bonus} 金币奖励！`)
      break
    case 'penalty':
      const penalty = Math.floor(Math.random() * 20) + 10
      player.value.coins = Math.max(0, player.value.coins - penalty)
      addLog(`⚠️ 不幸踩到陷阱，损失 ${penalty} 金币！`)
      break
    case 'normal':
      addLog('平安无事，继续前进！')
      break
  }
  
  if (totalTurns.value >= 10) {
    phase.value = 'end'
  }
}

function showQuestion() {
  const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
  currentQuestion.value = q
  selectedAnswer.value = null
  questionResult.value = null
  phase.value = 'question'
}

function submitAnswer() {
  if (selectedAnswer.value === null) return
  
  questionResult.value = selectedAnswer.value === currentQuestion.value!.answer ? 'correct' : 'wrong'
  phase.value = 'result'
  
  if (questionResult.value === 'correct') {
    player.value.coins += currentQuestion.value!.reward || 30
    addLog(`✅ 回答正确！获得 ${currentQuestion.value!.reward || 30} 金币！`)
  } else {
    player.value.coins = Math.max(0, player.value.coins - 10)
    addLog(`❌ 回答错误...损失 10 金币`)
  }
}

function continueGame() {
  phase.value = 'board'
  if (totalTurns.value >= 10) {
    phase.value = 'end'
  }
}

function addLog(msg: string) {
  gameLog.value.unshift(msg)
  if (gameLog.value.length > 5) {
    gameLog.value.pop()
  }
}

function startGame() {
  player.value = {
    name: '小数学家',
    position: 0,
    coins: 100,
    avatar: '🧮'
  }
  dice.value = 0
  totalTurns.value = 0
  gameLog.value = ['🎮 游戏开始！投掷骰子前进吧！']
  phase.value = 'board'
}

function getRank() {
  if (player.value.coins >= 300) return { stars: 3, label: '数学大师', icon: '👑' }
  if (player.value.coins >= 200) return { stars: 2, label: '数学高手', icon: '🥈' }
  if (player.value.coins >= 100) return { stars: 1, label: '数学新秀', icon: '🎖️' }
  return { stars: 0, label: '继续努力', icon: '💪' }
}
</script>

<template>
  <div class="mg">
    <div class="mg__header">
      <h1 class="mg__title">🎲 数学大富翁</h1>
      <div class="mg__player-info">
        <span class="mg__player-name">{{ player.name }}</span>
        <span class="mg__player-coins">💰 {{ player.coins }}</span>
        <span class="mg__player-turns">回合 {{ totalTurns }}/10</span>
      </div>
    </div>

    <!-- 开始页 -->
    <div v-if="phase === 'start'" class="mg__start">
      <div class="mg__start-icon">🎲</div>
      <h2 class="mg__start-title">数学大富翁</h2>
      <p class="mg__start-desc">
        投掷骰子，在棋盘上前进！<br/>
        答对数学题获得金币，踩到宝箱获得奖励！<br/>
        10 回合后根据金币数量获得称号！
      </p>
      <div class="mg__start-rules">
        <div class="mg__rule"><span>📝</span> 答题正确 +{{ QUESTIONS[0].reward || 30 }} 金币</div>
        <div class="mg__rule"><span>📦</span> 宝箱随机奖励</div>
        <div class="mg__rule"><span>⚠️</span> 陷阱损失金币</div>
        <div class="mg__rule"><span>🏁</span> 绕一圈 +50 金币</div>
      </div>
      <button class="mg__btn mg__btn--primary" @click="startGame">开始游戏</button>
    </div>

    <!-- 游戏棋盘 -->
    <div v-if="phase === 'board'" class="mg__board">
      <div class="mg__tiles">
        <div
          v-for="tile in BOARD_TILES"
          :key="tile.id"
          class="mg__tile"
          :class="[
            `mg__tile--${tile.type}`,
            { 'mg__tile--active': tile.id === player.position }
          ]"
        >
          <span class="mg__tile-icon">{{ tile.icon }}</span>
          <span class="mg__tile-label">{{ tile.label }}</span>
          <span v-if="tile.id === player.position" class="mg__tile-player">👤</span>
        </div>
      </div>

      <div class="mg__controls">
        <button
          class="mg__dice-btn"
          :disabled="isRolling"
          @click="rollDice"
        >
          🎲
        </button>
        <div v-if="showDice" class="mg__dice">{{ dice }}</div>
        <div class="mg__hint">点击骰子投掷</div>
      </div>

      <div class="mg__log">
        <div v-for="(log, i) in gameLog" :key="i" class="mg__log-item">{{ log }}</div>
      </div>
    </div>

    <!-- 答题页 -->
    <div v-if="phase === 'question' && currentQuestion" class="mg__question">
      <div class="mg__question-card">
        <div class="mg__question-stem" v-html="currentQuestion.stem"></div>
        <div class="mg__question-reward">答对奖励：{{ currentQuestion.reward || 30 }} 💰</div>
        <div class="mg__options">
          <button
            v-for="(opt, i) in currentQuestion.options"
            :key="i"
            class="mg__option"
            :class="{ 'mg__option--selected': selectedAnswer === i }"
            @click="selectedAnswer = i"
          >
            <span class="mg__option-label">{{ String.fromCharCode(65 + i) }}</span>
            <span>{{ opt }}</span>
          </button>
        </div>
        <button
          class="mg__btn mg__btn--primary"
          :disabled="selectedAnswer === null"
          @click="submitAnswer"
        >
          提交答案
        </button>
      </div>
    </div>

    <!-- 结果页 -->
    <div v-if="phase === 'result'" class="mg__result">
      <div class="mg__result-icon">
        {{ questionResult === 'correct' ? '🎉' : '😢' }}
      </div>
      <div class="mg__result-title">
        {{ questionResult === 'correct' ? '回答正确！' : '回答错误！' }}
      </div>
      <div class="mg__result-detail">
        正确答案：{{ currentQuestion?.options[currentQuestion?.answer || 0] }}
      </div>
      <div class="mg__result-coins">
        当前金币：{{ player.coins }}
      </div>
      <button class="mg__btn mg__btn--primary" @click="continueGame">
        继续游戏
      </button>
    </div>

    <!-- 结束页 -->
    <div v-if="phase === 'end'" class="mg__end">
      <div class="mg__end-icon">{{ getRank().icon }}</div>
      <h2 class="mg__end-title">{{ getRank().label }}</h2>
      <div class="mg__end-stars">
        <span v-for="i in 3" :key="i" :class="{ 'active': i <= getRank().stars }">⭐</span>
      </div>
      <div class="mg__end-score">
        <div class="mg__end-stat">
          <span class="mg__end-value">{{ player.coins }}</span>
          <span class="mg__end-label">最终金币</span>
        </div>
        <div class="mg__end-stat">
          <span class="mg__end-value">{{ totalTurns }}</span>
          <span class="mg__end-label">总回合</span>
        </div>
      </div>
      <button class="mg__btn mg__btn--primary" @click="phase = 'start'">
        再玩一次
      </button>
    </div>
  </div>
</template>

<style scoped>
.mg {
  max-width: 480px;
  margin: 0 auto;
  padding: var(--space-4);
  min-height: 100vh;
}

.mg__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
}

.mg__title {
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin: 0;
}

.mg__player-info {
  display: flex;
  gap: var(--space-3);
  font-size: var(--text-sm);
}

.mg__player-name {
  color: var(--text-primary);
  font-weight: 500;
}

.mg__player-coins {
  color: var(--color-warning);
}

.mg__player-turns {
  color: var(--text-secondary);
}

/* 开始页 */
.mg__start {
  text-align: center;
  padding: var(--space-8) var(--space-4);
  background: var(--bg-card);
  border-radius: var(--radius-xl);
}

.mg__start-icon {
  font-size: 80px;
  margin-bottom: var(--space-4);
}

.mg__start-title {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.mg__start-desc {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-6);
}

.mg__start-rules {
  text-align: left;
  margin-bottom: var(--space-6);
}

.mg__rule {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) 0;
  color: var(--text-secondary);
}

/* 棋盘 */
.mg__board {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
}

.mg__tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.mg__tile {
  aspect-ratio: 1;
  background: var(--bg-hover);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: relative;
  transition: all 0.2s;
}

.mg__tile--question {
  background: rgba(59, 130, 246, 0.15);
}

.mg__tile--bonus {
  background: rgba(245, 158, 11, 0.15);
}

.mg__tile--penalty {
  background: rgba(239, 68, 68, 0.15);
}

.mg__tile--start {
  background: rgba(16, 185, 129, 0.15);
}

.mg__tile--active {
  border: 2px solid var(--color-primary);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
}

.mg__tile-icon {
  font-size: 20px;
}

.mg__tile-label {
  font-size: 10px;
  color: var(--text-secondary);
}

.mg__tile-player {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 12px;
}

.mg__controls {
  text-align: center;
  margin-bottom: var(--space-4);
}

.mg__dice-btn {
  width: 80px;
  height: 80px;
  font-size: 48px;
  border-radius: var(--radius-lg);
  border: none;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
  animation: bounce 0.6s ease infinite;
}

.mg__dice-btn:disabled {
  animation: none;
  opacity: 0.7;
}

.mg__dice-btn:not(:disabled):hover {
  transform: scale(1.1);
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.mg__dice {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: var(--space-2);
}

.mg__hint {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-top: var(--space-2);
}

.mg__log {
  background: var(--bg-hover);
  border-radius: var(--radius-md);
  padding: var(--space-3);
}

.mg__log-item {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  padding: var(--space-1) 0;
}

/* 答题页 */
.mg__question {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
}

.mg__question-card {
  text-align: center;
}

.mg__question-stem {
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  line-height: 1.6;
}

.mg__question-reward {
  font-size: var(--text-sm);
  color: var(--color-warning);
  margin-bottom: var(--space-6);
}

.mg__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.mg__option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-hover);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.mg__option:hover {
  border-color: var(--color-primary-light);
}

.mg__option--selected {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
}

.mg__option-label {
  width: 28px;
  height: 28px;
  background: var(--bg-card);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-sm);
  flex-shrink: 0;
}

/* 结果页 */
.mg__result {
  text-align: center;
  padding: var(--space-8) var(--space-4);
  background: var(--bg-card);
  border-radius: var(--radius-xl);
}

.mg__result-icon {
  font-size: 80px;
  margin-bottom: var(--space-4);
}

.mg__result-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.mg__result-detail {
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.mg__result-coins {
  font-size: var(--text-lg);
  color: var(--color-warning);
  margin-bottom: var(--space-6);
}

/* 结束页 */
.mg__end {
  text-align: center;
  padding: var(--space-8) var(--space-4);
  background: var(--bg-card);
  border-radius: var(--radius-xl);
}

.mg__end-icon {
  font-size: 80px;
  margin-bottom: var(--space-4);
}

.mg__end-title {
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.mg__end-stars {
  font-size: 32px;
  margin-bottom: var(--space-6);
}

.mg__end-stars span {
  opacity: 0.3;
}

.mg__end-stars span.active {
  opacity: 1;
}

.mg__end-score {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  margin-bottom: var(--space-6);
}

.mg__end-stat {
  text-align: center;
}

.mg__end-value {
  display: block;
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-primary);
}

.mg__end-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* 按钮 */
.mg__btn {
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.mg__btn--primary {
  background: var(--color-primary);
  color: white;
}

.mg__btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.mg__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
