<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

type Difficulty = 'easy' | 'medium' | 'hard'
type CellData = { value: number; fixed: boolean; notes: Set<number> }

const DIFF_CONFIG: Record<Difficulty, { label: string; given: [number, number] }> = {
  easy: { label: '简单', given: [35, 40] },
  medium: { label: '中等', given: [25, 30] },
  hard: { label: '困难', given: [20, 25] },
}

const difficulty = ref<Difficulty>('easy')
const board = ref<CellData[][]>([])
const solution = ref<number[][]>([])
const sel = ref<[number, number] | null>(null)
const noteMode = ref(false)
const errors = ref(0)
const elapsed = ref(0)
const isWon = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const timeStr = computed(() => {
  const m = String(Math.floor(elapsed.value / 60)).padStart(2, '0')
  const s = String(elapsed.value % 60).padStart(2, '0')
  return `${m}:${s}`
})

function randInt(min: number, max: number) { return min + Math.floor(Math.random() * (max - min + 1)) }

function isValid(grid: number[][], r: number, c: number, n: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[r][i] === n || grid[i][c] === n) return false
  }
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) if (grid[br + x][bc + y] === n) return false
  return true
}

function solve(grid: number[][]): boolean {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    if (grid[r][c] === 0) {
      const nums = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
      for (const n of nums) {
        if (isValid(grid, r, c, n)) { grid[r][c] = n; if (solve(grid)) return true; grid[r][c] = 0 }
      }
      return false
    }
  }
  return true
}

function generatePuzzle() {
  const full: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0))
  solve(full)
  solution.value = full.map(r => r.slice())
  const [minG, maxG] = DIFF_CONFIG[difficulty.value].given
  const givenCount = randInt(minG, maxG)
  const cells: [number, number][] = []
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r, c])
  for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]] }
  const givenSet = new Set(cells.slice(0, givenCount).map(([r, c]) => `${r},${c}`))
  board.value = full.map((row, r) => row.map((v, c) => ({
    value: givenSet.has(`${r},${c}`) ? v : 0, fixed: givenSet.has(`${r},${c}`), notes: new Set<number>(),
  })))
}

function hasConflict(r: number, c: number, n: number): boolean {
  if (n === 0) return false
  for (let i = 0; i < 9; i++) { if (i !== c && board.value[r][i].value === n) return true; if (i !== r && board.value[i][c].value === n) return true }
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
    if ((br + x !== r || bc + y !== c) && board.value[br + x][bc + y].value === n) return true
  }
  return false
}

function inputNumber(n: number) {
  if (!sel.value || isWon.value) return
  const [r, c] = sel.value
  if (board.value[r][c].fixed) return
  if (noteMode.value) {
    if (board.value[r][c].value) return
    const notes = board.value[r][c].notes
    notes.has(n) ? notes.delete(n) : notes.add(n)
    board.value[r][c] = { ...board.value[r][c], notes: new Set(notes) }
    return
  }
  if (!timer) startTimer()
  board.value[r][c] = { value: n, fixed: false, notes: new Set() }
  if (n !== solution.value[r][c]) errors.value++
  clearRelatedNotes(r, c, n)
  checkWin()
}

function clearRelatedNotes(r: number, c: number, n: number) {
  for (let i = 0; i < 9; i++) { board.value[r][i].notes.delete(n); board.value[i][c].notes.delete(n) }
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3
  for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) board.value[br + x][bc + y].notes.delete(n)
}

function eraseCell() {
  if (!sel.value || isWon.value) return
  const [r, c] = sel.value
  if (board.value[r][c].fixed) return
  board.value[r][c] = { value: 0, fixed: false, notes: new Set() }
}

function giveHint() {
  if (isWon.value) return
  const empties: [number, number][] = []
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (!board.value[r][c].fixed && board.value[r][c].value !== solution.value[r][c]) empties.push([r, c])
  if (!empties.length) return
  if (!timer) startTimer()
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  board.value[r][c] = { value: solution.value[r][c], fixed: true, notes: new Set() }
  sel.value = [r, c]
  checkWin()
}

function checkWin() {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (board.value[r][c].value !== solution.value[r][c]) return
  isWon.value = true; stopTimer()
}

function startTimer() { timer = setInterval(() => { elapsed.value++ }, 1000) }
function stopTimer() { if (timer) { clearInterval(timer); timer = null } }

function newGame() {
  stopTimer(); errors.value = 0; elapsed.value = 0; isWon.value = false; sel.value = null; noteMode.value = false; generatePuzzle()
}

function setDiff(d: Difficulty) { difficulty.value = d; newGame() }

function cellClass(r: number, c: number) {
  const cell = board.value[r][c]; const cls: string[] = []
  if (cell.fixed) cls.push('is-fixed')
  if (cell.value && hasConflict(r, c, cell.value)) cls.push('is-error')
  if (sel.value) {
    const [sr, sc] = sel.value
    if (sr === r && sc === c) cls.push('is-selected')
    else if (sr === r || sc === c || (Math.floor(sr / 3) === Math.floor(r / 3) && Math.floor(sc / 3) === Math.floor(c / 3))) cls.push('is-highlighted')
  }
  return cls
}

function remainingCount(n: number) {
  let count = 0
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (board.value[r][c].value === n) count++
  return 9 - count
}

newGame()
onUnmounted(stopTimer)
</script>

<template>
  <div class="sudoku">
    <div class="sudoku__card">
      <header class="sudoku__header">
        <h1 class="sudoku__title">数独挑战</h1>
        <p class="sudoku__desc">填入 1-9，使每行、每列、每个 3x3 宫格内数字不重复</p>
      </header>

      <div class="sudoku__difficulty">
        <button v-for="(cfg, key) in DIFF_CONFIG" :key="key" class="sudoku__diff-btn"
          :class="{ 'is-active': difficulty === key }" @click="setDiff(key as Difficulty)">{{ cfg.label }}</button>
      </div>

      <div class="sudoku__stats">
        <div class="sudoku__stat"><span class="sudoku__stat-label">用时</span><strong>{{ timeStr }}</strong></div>
        <div class="sudoku__stat"><span class="sudoku__stat-label">错误</span><strong>{{ errors }}</strong></div>
      </div>

      <div class="sudoku__board">
        <template v-for="(row, r) in board" :key="r">
          <div v-for="(cell, c) in row" :key="c" class="sudoku__cell" :class="cellClass(r, c)"
            :style="{ 'border-right-width': c === 2 || c === 5 ? '2px' : '1px', 'border-bottom-width': r === 2 || r === 5 ? '2px' : '1px' }"
            @click="sel = [r, c]">
            <span v-if="cell.value" class="sudoku__value">{{ cell.value }}</span>
            <div v-else-if="cell.notes.size" class="sudoku__notes">
              <span v-for="n in 9" :key="n" class="sudoku__note">{{ cell.notes.has(n) ? n : '' }}</span>
            </div>
          </div>
        </template>
      </div>

      <div class="sudoku__toolbar">
        <button class="sudoku__tool-btn" :class="{ 'is-active': noteMode }" @click="noteMode = !noteMode">
          {{ noteMode ? '笔记 ON' : '笔记 OFF' }}
        </button>
        <button class="sudoku__tool-btn" @click="giveHint">提示</button>
        <button class="sudoku__tool-btn" @click="eraseCell">擦除</button>
        <button class="sudoku__tool-btn" @click="newGame">新游戏</button>
      </div>

      <div class="sudoku__numpad">
        <button v-for="n in 9" :key="n" class="sudoku__num-btn" :disabled="remainingCount(n) === 0" @click="inputNumber(n)">
          {{ n }}<small v-if="remainingCount(n) > 0">{{ remainingCount(n) }}</small>
        </button>
      </div>

      <div v-if="isWon" class="sudoku__celebrate">
        <div class="sudoku__celebrate-inner">
          <h2>恭喜通关！</h2>
          <p>用时 {{ timeStr }}，错误 {{ errors }} 次</p>
          <button class="sudoku__celebrate-btn" @click="newGame">再来一局</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sudoku { max-width: 520px; margin: 0 auto; padding: var(--space-4); }
.sudoku__card { position: relative; background: var(--bg-card); border-radius: var(--radius-xl); padding: var(--space-6); box-shadow: var(--shadow-md); text-align: center; }
.sudoku__title { font-size: var(--text-2xl); margin: 0 0 var(--space-1); color: var(--text-primary); }
.sudoku__desc { font-size: var(--text-sm); color: var(--text-secondary); margin: 0 0 var(--space-5); }
.sudoku__difficulty { display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-5); }
.sudoku__diff-btn { padding: var(--space-2) var(--space-5); border: 2px solid transparent; border-radius: var(--radius-lg); background: var(--bg-hover); color: var(--text-secondary); font-weight: 600; font-size: var(--text-sm); cursor: pointer; transition: all var(--transition-fast); }
.sudoku__diff-btn:hover { color: var(--text-primary); background: var(--bg-active); }
.sudoku__diff-btn.is-active { background: var(--color-primary); color: var(--text-inverse); border-color: var(--color-primary-dark); }
.sudoku__stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); margin-bottom: var(--space-5); }
.sudoku__stat { background: var(--bg-page); padding: var(--space-3); border-radius: var(--radius-lg); }
.sudoku__stat-label { display: block; font-size: var(--text-xs); color: var(--text-tertiary); margin-bottom: var(--space-1); }
.sudoku__stat strong { font-size: var(--text-xl); color: var(--color-primary); font-weight: 700; font-variant-numeric: tabular-nums; }
.sudoku__board { display: grid; grid-template-columns: repeat(9, 1fr); border: 2px solid var(--text-primary); border-radius: var(--radius-lg); overflow: hidden; margin-bottom: var(--space-4); aspect-ratio: 1; max-width: 420px; margin-left: auto; margin-right: auto; }
.sudoku__cell { display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color); background: var(--bg-card); cursor: pointer; transition: background var(--transition-fast); position: relative; font-size: var(--text-lg); }
.sudoku__cell.is-selected { background: var(--color-primary-light, #e8f0fe); }
.sudoku__cell.is-highlighted { background: var(--bg-hover); }
.sudoku__cell.is-fixed .sudoku__value { color: var(--text-primary); font-weight: 700; }
.sudoku__cell.is-error .sudoku__value { color: var(--color-error, #ef4444); }
.sudoku__cell:not(.is-fixed) .sudoku__value { color: var(--color-primary); }
.sudoku__notes { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); width: 100%; height: 100%; padding: 1px; }
.sudoku__note { display: flex; align-items: center; justify-content: center; font-size: 9px; color: var(--text-tertiary); line-height: 1; }
.sudoku__toolbar { display: flex; justify-content: center; gap: var(--space-2); margin-bottom: var(--space-4); flex-wrap: wrap; }
.sudoku__tool-btn { padding: var(--space-2) var(--space-4); border-radius: var(--radius-lg); background: var(--bg-hover); color: var(--text-secondary); font-size: var(--text-sm); font-weight: 600; cursor: pointer; border: none; transition: all var(--transition-fast); }
.sudoku__tool-btn:hover { background: var(--bg-active); color: var(--text-primary); }
.sudoku__tool-btn.is-active { background: var(--color-primary); color: var(--text-inverse); }
.sudoku__numpad { display: grid; grid-template-columns: repeat(9, 1fr); gap: var(--space-2); max-width: 420px; margin: 0 auto; }
.sudoku__num-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-3) 0; border-radius: var(--radius-lg); background: var(--bg-hover); color: var(--text-primary); font-size: var(--text-xl); font-weight: 700; cursor: pointer; border: none; transition: all var(--transition-fast); }
.sudoku__num-btn:hover:not(:disabled) { background: var(--color-primary); color: var(--text-inverse); }
.sudoku__num-btn:disabled { opacity: 0.3; cursor: default; }
.sudoku__num-btn small { font-size: 10px; color: var(--text-tertiary); font-weight: 400; margin-top: 1px; }
.sudoku__celebrate { position: absolute; inset: 0; background: var(--bg-card); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; animation: sdk-fade-in 0.3s ease; }
.sudoku__celebrate-inner { text-align: center; }
.sudoku__celebrate-inner h2 { font-size: var(--text-2xl); color: var(--color-success); margin: 0 0 var(--space-2); }
.sudoku__celebrate-inner p { color: var(--text-secondary); margin: 0 0 var(--space-5); }
.sudoku__celebrate-btn { padding: var(--space-3) var(--space-6); background: var(--color-primary); color: var(--text-inverse); border: none; border-radius: var(--radius-lg); font-size: var(--text-base); font-weight: 600; cursor: pointer; }
@keyframes sdk-fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>
