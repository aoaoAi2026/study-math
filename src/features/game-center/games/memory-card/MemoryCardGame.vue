<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

type Difficulty = 'easy' | 'medium' | 'hard'
type CardType = 'expression' | 'answer'

interface Card {
  id: number
  pairId: number
  content: string
  type: CardType
  isFlipped: boolean
  isMatched: boolean
}

interface DifficultyConfig {
  name: string
  pairs: number
}

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { name: '简单 · 4对', pairs: 4 },
  medium: { name: '中等 · 6对', pairs: 6 },
  hard: { name: '困难 · 8对', pairs: 8 },
}

function generatePairs(n: number): { expression: string; answer: number }[] {
  const pairs: { expression: string; answer: number }[] = []
  const usedAnswers = new Set<number>()
  let attempts = 0
  while (pairs.length < n && attempts < 500) {
    attempts++
    const op = ['+', '-', '×'][Math.floor(Math.random() * 3)]
    let a = Math.floor(Math.random() * 10) + 1
    let b = Math.floor(Math.random() * 10) + 1
    let answer: number
    let expr: string
    if (op === '+') {
      answer = a + b
      expr = `${a} + ${b}`
    } else if (op === '-') {
      if (a < b) [a, b] = [b, a]
      answer = a - b
      expr = `${a} - ${b}`
    } else {
      a = Math.floor(Math.random() * 8) + 2
      b = Math.floor(Math.random() * 8) + 2
      answer = a * b
      expr = `${a} × ${b}`
    }
    if (usedAnswers.has(answer)) continue
    usedAnswers.add(answer)
    pairs.push({ expression: expr, answer })
  }
  while (pairs.length < n) {
    const a = pairs.length + 1
    const b = Math.floor(Math.random() * 9) + 1
    const answer = a + b
    pairs.push({ expression: `${a} + ${b}`, answer })
  }
  return pairs
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const difficulty = ref<Difficulty>('easy')
const cards = ref<Card[]>([])
const firstFlipped = ref<Card | null>(null)
const isLocked = ref(false)
const steps = ref(0)
const matchedCount = ref(0)
const elapsedSeconds = ref(0)
const gameStarted = ref(false)
const gameOver = ref(false)

let timerInterval: number | null = null

const totalPairs = computed(() => DIFFICULTIES[difficulty.value].pairs)
const isWin = computed(() => gameOver.value && matchedCount.value === totalPairs.value)

function initGame() {
  stopTimer()
  steps.value = 0
  matchedCount.value = 0
  elapsedSeconds.value = 0
  firstFlipped.value = null
  isLocked.value = false
  gameStarted.value = false
  gameOver.value = false

  const pairs = generatePairs(totalPairs.value)
  const cardList: Card[] = []
  pairs.forEach((p, idx) => {
    cardList.push({
      id: idx * 2,
      pairId: idx,
      content: p.expression,
      type: 'expression',
      isFlipped: false,
      isMatched: false,
    })
    cardList.push({
      id: idx * 2 + 1,
      pairId: idx,
      content: String(p.answer),
      type: 'answer',
      isFlipped: false,
      isMatched: false,
    })
  })
  cards.value = shuffle(cardList)
}

function startTimer() {
  if (timerInterval) return
  timerInterval = window.setInterval(() => {
    elapsedSeconds.value++
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function flipCard(card: Card) {
  if (isLocked.value) return
  if (card.isFlipped || card.isMatched) return

  if (!gameStarted.value) {
    gameStarted.value = true
    startTimer()
  }

  card.isFlipped = true

  if (!firstFlipped.value) {
    firstFlipped.value = card
    return
  }

  steps.value++
  isLocked.value = true

  const prev = firstFlipped.value
  firstFlipped.value = null

  if (prev.pairId === card.pairId && prev.type !== card.type) {
    setTimeout(() => {
      prev.isMatched = true
      card.isMatched = true
      matchedCount.value++
      isLocked.value = false
      if (matchedCount.value === totalPairs.value) {
        stopTimer()
        gameOver.value = true
      }
    }, 400)
  } else {
    setTimeout(() => {
      prev.isFlipped = false
      card.isFlipped = false
      isLocked.value = false
    }, 800)
  }
}

function selectDifficulty(d: Difficulty) {
  difficulty.value = d
  initGame()
}

function restart() {
  initGame()
}

initGame()

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div class="memory-card">
    <header class="memory-card__header">
      <h1 class="memory-card__title">🧠 数学记忆卡</h1>
      <p class="memory-card__desc">翻开卡片，找到算式与答案的配对</p>
    </header>

    <div class="memory-card__difficulty">
      <button
        v-for="(cfg, key) in DIFFICULTIES"
        :key="key"
        class="memory-card__diff-btn"
        :class="{ active: difficulty === key }"
        @click="selectDifficulty(key as Difficulty)"
      >
        {{ cfg.name }}
      </button>
    </div>

    <div class="memory-card__stats">
      <div class="memory-card__stat">
        <span class="label">步数</span>
        <strong>{{ steps }}</strong>
      </div>
      <div class="memory-card__stat">
        <span class="label">用时</span>
        <strong>{{ formatTime(elapsedSeconds) }}</strong>
      </div>
      <div class="memory-card__stat">
        <span class="label">配对</span>
        <strong>{{ matchedCount }} / {{ totalPairs }}</strong>
      </div>
    </div>

    <div class="memory-card__board" :class="`pairs-${totalPairs}`">
      <div
        v-for="card in cards"
        :key="card.id"
        class="memory-card__card"
        :class="{ flipped: card.isFlipped, matched: card.isMatched, expression: card.type === 'expression' }"
        @click="flipCard(card)"
      >
        <div class="memory-card__card-inner">
          <div class="memory-card__card-face memory-card__card-face--back">
            <span>?</span>
          </div>
          <div class="memory-card__card-face memory-card__card-face--front">
            <span>{{ card.content }}</span>
          </div>
        </div>
      </div>
    </div>

    <button class="memory-card__restart" @click="restart">
      🔄 重新开始
    </button>

    <div v-if="isWin" class="memory-card__celebrate">
      <div class="memory-card__celebrate-inner">
        <h2>🎉 恭喜完成！</h2>
        <div class="memory-card__celebrate-stats">
          <span>步数：{{ steps }}</span>
          <span>用时：{{ formatTime(elapsedSeconds) }}</span>
        </div>
        <button class="memory-card__celebrate-btn" @click="restart">再来一局</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memory-card {
  --mc-color-primary: #4f7df8;
  --mc-color-success: #10b981;
  --mc-color-warm: #ff8c42;
  --mc-color-accent: #8b5cf6;
  --mc-bg-card: #ffffff;
  --mc-bg-hover: #f1f5f9;
  --mc-text-primary: #2c3e50;
  --mc-text-secondary: #6b7785;
  --mc-border-color: #e4e9f2;
  --mc-radius-lg: 12px;
  --mc-radius-xl: 16px;
  --mc-shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
  --mc-transition-fast: 0.2s ease;

  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px;
  text-align: center;
}

.memory-card__header {
  margin-bottom: 20px;
}

.memory-card__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--mc-text-primary);
  margin: 0 0 6px;
}

.memory-card__desc {
  color: var(--mc-text-secondary);
  font-size: 14px;
  margin: 0;
}

.memory-card__difficulty {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.memory-card__diff-btn {
  padding: 10px 18px;
  background: var(--mc-bg-card);
  border: 2px solid var(--mc-border-color);
  border-radius: var(--mc-radius-lg);
  color: var(--mc-text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--mc-transition-fast);
}

.memory-card__diff-btn:hover {
  border-color: var(--mc-color-primary);
  color: var(--mc-color-primary);
}

.memory-card__diff-btn.active {
  background: var(--mc-color-primary);
  border-color: var(--mc-color-primary);
  color: white;
}

.memory-card__stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.memory-card__stat {
  background: var(--mc-bg-card);
  padding: 12px 20px;
  border-radius: var(--mc-radius-lg);
  box-shadow: var(--mc-shadow-card);
  min-width: 90px;
}

.memory-card__stat .label {
  display: block;
  font-size: 12px;
  color: var(--mc-text-secondary);
  margin-bottom: 4px;
}

.memory-card__stat strong {
  font-size: 18px;
  color: var(--mc-text-primary);
  font-weight: 700;
}

.memory-card__board {
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
  perspective: 1000px;
}

.memory-card__board.pairs-4 {
  grid-template-columns: repeat(4, 1fr);
}

.memory-card__board.pairs-6 {
  grid-template-columns: repeat(4, 1fr);
}

.memory-card__board.pairs-8 {
  grid-template-columns: repeat(4, 1fr);
}

.memory-card__card {
  aspect-ratio: 3 / 4;
  cursor: pointer;
  perspective: 1000px;
}

.memory-card__card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.memory-card__card.flipped .memory-card__card-inner,
.memory-card__card.matched .memory-card__card-inner {
  transform: rotateY(180deg);
}

.memory-card__card-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--mc-radius-lg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  font-size: 22px;
  font-weight: 700;
  box-shadow: var(--mc-shadow-card);
}

.memory-card__card-face--back {
  background: linear-gradient(135deg, var(--mc-color-primary), var(--mc-color-accent));
  color: white;
  font-size: 32px;
}

.memory-card__card-face--front {
  background: var(--mc-bg-card);
  color: var(--mc-text-primary);
  transform: rotateY(180deg);
  border: 2px solid var(--mc-border-color);
}

.memory-card__card.expression .memory-card__card-face--front {
  background: linear-gradient(135deg, #eef2ff, #fff7ed);
  color: var(--mc-color-warm);
  border-color: var(--mc-color-warm);
}

.memory-card__card.matched .memory-card__card-face--front {
  background: linear-gradient(135deg, #d1fae5, #ecfdf5);
  color: var(--mc-color-success);
  border-color: var(--mc-color-success);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2), var(--mc-shadow-card);
}

.memory-card__card:not(.flipped):not(.matched):hover .memory-card__card-inner {
  transform: translateY(-4px);
}

.memory-card__restart {
  padding: 12px 28px;
  background: var(--mc-bg-card);
  border: 2px solid var(--mc-border-color);
  border-radius: var(--mc-radius-lg);
  color: var(--mc-text-primary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--mc-transition-fast);
}

.memory-card__restart:hover {
  border-color: var(--mc-color-primary);
  color: var(--mc-color-primary);
  background: var(--mc-bg-hover);
}

.memory-card__celebrate {
  position: fixed;
  inset: 0;
  background: rgba(44, 62, 80, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: mc-fade-in 0.3s ease;
}

.memory-card__celebrate-inner {
  background: white;
  padding: 32px 40px;
  border-radius: var(--mc-radius-xl);
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: mc-pop-in 0.4s ease;
}

.memory-card__celebrate-inner h2 {
  margin: 0 0 16px;
  font-size: 24px;
  color: var(--mc-color-success);
}

.memory-card__celebrate-stats {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--mc-text-secondary);
}

.memory-card__celebrate-btn {
  padding: 10px 24px;
  background: var(--mc-color-success);
  color: white;
  border: none;
  border-radius: var(--mc-radius-lg);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

@keyframes mc-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes mc-pop-in {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 480px) {
  .memory-card__board.pairs-4,
  .memory-card__board.pairs-6,
  .memory-card__board.pairs-8 {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .memory-card__card-face {
    font-size: 16px;
  }
  .memory-card__card-face--back {
    font-size: 22px;
  }
}
</style>
