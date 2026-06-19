<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

type Difficulty = 3 | 4
interface BestRecord { moves: number; time: number }

const difficulty = ref<Difficulty>(3)
const tiles = ref<number[]>([])
const moves = ref(0)
const elapsedSec = ref(0)
const isWon = ref(false)
const bestRecord = ref<BestRecord>({ moves: 0, time: 0 })

let timerId: ReturnType<typeof setInterval> | null = null

const totalCells = computed(() => difficulty.value * difficulty.value)
const emptyIndex = computed(() => tiles.value.indexOf(0))

const formattedTime = computed(() => {
  const m = Math.floor(elapsedSec.value / 60).toString().padStart(2, '0')
  const s = (elapsedSec.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const formattedBest = computed(() => {
  if (bestRecord.value.time === 0) return '暂无'
  const m = Math.floor(bestRecord.value.time / 60).toString().padStart(2, '0')
  const s = (bestRecord.value.time % 60).toString().padStart(2, '0')
  return `${bestRecord.value.moves}步 / ${m}:${s}`
})

function isSolvable(arr: number[], size: number): boolean {
  const nums = arr.filter(x => x !== 0)
  let inversions = 0
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inversions++
    }
  }
  if (size % 2 === 1) return inversions % 2 === 0
  const emptyRowFromBottom = size - Math.floor(arr.indexOf(0) / size)
  return (inversions + emptyRowFromBottom) % 2 === 1
}

function initBoard() {
  const size = difficulty.value
  const total = size * size
  let arr: number[]
  do {
    arr = Array.from({ length: total }, (_, i) => i)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  } while (!isSolvable(arr, size) || checkWin(arr))
  tiles.value = arr
}

function checkWin(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== i + 1) return false
  }
  return arr[arr.length - 1] === 0
}

function isAdjacent(idx: number): boolean {
  const empty = emptyIndex.value
  const size = difficulty.value
  const r1 = Math.floor(idx / size), c1 = idx % size
  const r2 = Math.floor(empty / size), c2 = empty % size
  return (r1 === r2 && Math.abs(c1 - c2) === 1) || (c1 === c2 && Math.abs(r1 - r2) === 1)
}

function handleTileClick(idx: number) {
  if (tiles.value[idx] === 0 || isWon.value) return
  if (!isAdjacent(idx)) return

  const newTiles = [...tiles.value]
  ;[newTiles[idx], newTiles[emptyIndex.value]] = [newTiles[emptyIndex.value], newTiles[idx]]
  tiles.value = newTiles
  moves.value++

  if (!timerId) startTimer()

  if (checkWin(newTiles)) {
    isWon.value = true
    stopTimer()
    updateBest()
  }
}

function startTimer() {
  stopTimer()
  timerId = setInterval(() => {
    elapsedSec.value++
  }, 1000)
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function resetGame() {
  stopTimer()
  moves.value = 0
  elapsedSec.value = 0
  isWon.value = false
  initBoard()
}

function setDifficulty(d: Difficulty) {
  difficulty.value = d
  loadBest()
  resetGame()
}

function updateBest() {
  const best = bestRecord.value
  const better = best.moves === 0 || moves.value < best.moves || (moves.value === best.moves && elapsedSec.value < best.time)
  if (better) {
    bestRecord.value = { moves: moves.value, time: elapsedSec.value }
    localStorage.setItem(`number-slide-best-${difficulty.value}`, JSON.stringify(bestRecord.value))
  }
}

function loadBest() {
  const saved = localStorage.getItem(`number-slide-best-${difficulty.value}`)
  bestRecord.value = saved ? JSON.parse(saved) : { moves: 0, time: 0 }
}

watch(difficulty, () => resetGame())

onMounted(() => {
  loadBest()
  initBoard()
})

onUnmounted(stopTimer)
</script>

<template>
  <div class="number-slide">
    <div class="number-slide__card">
      <header class="number-slide__header">
        <h1 class="number-slide__title">🔢 数字华容道</h1>
        <p class="number-slide__desc">点击数字将其滑入空格，按顺序排列 1 到 {{ totalCells - 1 }}</p>
      </header>

      <div class="number-slide__difficulty">
        <button
          v-for="d in ([3, 4] as Difficulty[])"
          :key="d"
          class="number-slide__diff-btn"
          :class="{ 'is-active': difficulty === d }"
          @click="setDifficulty(d)"
        >
          {{ d }}×{{ d }}
        </button>
      </div>

      <div class="number-slide__stats">
        <div class="number-slide__stat">
          <span class="number-slide__stat-label">步数</span>
          <strong class="number-slide__stat-value">{{ moves }}</strong>
        </div>
        <div class="number-slide__stat">
          <span class="number-slide__stat-label">用时</span>
          <strong class="number-slide__stat-value">{{ formattedTime }}</strong>
        </div>
        <div class="number-slide__stat">
          <span class="number-slide__stat-label">最佳</span>
          <strong class="number-slide__stat-value">{{ formattedBest }}</strong>
        </div>
      </div>

      <div
        class="number-slide__board"
        :style="{
          '--grid-size': difficulty,
          '--cell-size': difficulty === 3 ? '100px' : '78px',
          '--gap': '8px'
        } as any"
      >
        <div
          v-for="(tile, idx) in tiles"
          :key="tile + '-' + idx"
          class="number-slide__tile"
          :class="{
            'is-empty': tile === 0,
            'is-clickable': tile !== 0 && !isWon && isAdjacent(idx)
          }"
          @click="handleTileClick(idx)"
        >
          <span v-if="tile !== 0">{{ tile }}</span>
        </div>
      </div>

      <div class="number-slide__actions">
        <button class="number-slide__btn number-slide__btn--secondary" @click="resetGame">
          🔄 重置
        </button>
      </div>

      <div v-if="isWon" class="number-slide__celebrate">
        <div class="number-slide__celebrate-inner">
          <div class="number-slide__trophy">🏆</div>
          <h2 class="number-slide__celebrate-title">恭喜通关！</h2>
          <p class="number-slide__celebrate-subtitle">你用 {{ moves }} 步、{{ formattedTime }} 完成了拼图</p>
          <div class="number-slide__celebrate-stats">
            <div class="number-slide__celebrate-stat">
              <span>步数</span>
              <strong>{{ moves }}</strong>
            </div>
            <div class="number-slide__celebrate-stat">
              <span>用时</span>
              <strong>{{ formattedTime }}</strong>
            </div>
            <div class="number-slide__celebrate-stat">
              <span>最佳</span>
              <strong>{{ formattedBest }}</strong>
            </div>
          </div>
          <button class="number-slide__btn number-slide__btn--primary" @click="resetGame">
            再来一局
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.number-slide {
  max-width: 520px;
  margin: 0 auto;
  padding: var(--space-4);
}

.number-slide__card {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.number-slide__title {
  font-size: var(--text-2xl);
  margin: 0 0 var(--space-2);
  color: var(--text-primary);
}

.number-slide__desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-6);
}

.number-slide__difficulty {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.number-slide__diff-btn {
  padding: var(--space-3) var(--space-6);
  background: var(--bg-hover);
  color: var(--text-secondary);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-base);
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.number-slide__diff-btn:hover {
  background: var(--bg-active);
  color: var(--text-primary);
}

.number-slide__diff-btn.is-active {
  background: var(--color-primary);
  color: var(--text-inverse);
  border-color: var(--color-primary-dark);
}

.number-slide__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.number-slide__stat {
  background: var(--bg-page);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
}

.number-slide__stat-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}

.number-slide__stat-value {
  display: block;
  font-size: var(--text-xl);
  color: var(--color-primary);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.number-slide__board {
  display: grid;
  grid-template-columns: repeat(var(--grid-size), var(--cell-size));
  grid-auto-rows: var(--cell-size);
  gap: var(--gap);
  padding: var(--space-3);
  background: var(--bg-page);
  border-radius: var(--radius-xl);
  justify-content: center;
  margin: 0 auto var(--space-6);
  width: fit-content;
}

.number-slide__tile {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--text-inverse);
  font-size: var(--text-2xl);
  font-weight: 700;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  cursor: default;
  user-select: none;
}

.number-slide__tile.is-clickable {
  cursor: pointer;
}

.number-slide__tile.is-clickable:hover {
  transform: scale(1.04);
  box-shadow: var(--shadow-md);
}

.number-slide__tile.is-clickable:active {
  transform: scale(0.96);
}

.number-slide__tile.is-empty {
  background: transparent;
  box-shadow: none;
}

.number-slide__actions {
  display: flex;
  justify-content: center;
}

.number-slide__btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.number-slide__btn--primary {
  background: var(--color-primary);
  color: var(--text-inverse);
}

.number-slide__btn--primary:hover {
  background: var(--color-primary-dark);
}

.number-slide__btn--secondary {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.number-slide__btn--secondary:hover {
  background: var(--bg-active);
}

.number-slide__celebrate {
  position: absolute;
  inset: 0;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  animation: fadeIn var(--transition-normal) ease;
}

.number-slide__celebrate-inner {
  width: 100%;
}

.number-slide__trophy {
  font-size: 64px;
  margin-bottom: var(--space-3);
  animation: bounce 0.8s ease infinite alternate;
}

.number-slide__celebrate-title {
  font-size: var(--text-2xl);
  color: var(--color-primary);
  margin: 0 0 var(--space-2);
}

.number-slide__celebrate-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--space-6);
}

.number-slide__celebrate-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.number-slide__celebrate-stat {
  background: var(--bg-page);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
}

.number-slide__celebrate-stat span {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}

.number-slide__celebrate-stat strong {
  display: block;
  font-size: var(--text-lg);
  color: var(--color-success);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}
</style>
