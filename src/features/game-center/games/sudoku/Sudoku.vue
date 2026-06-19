<script setup lang="ts">
import { ref, computed } from 'vue'

const SIZE = 9
function makeGrid(): number[][] {
  // 简单模板 - 保证合法可解
  return [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],
    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],
    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9]
  ]
}
const original = ref(makeGrid())
const grid = ref<number[][]>(original.value.map(r => r.slice()))
const sel = ref<{r:number,c:number}|null>(null)
const done = ref(false)

function isFixed(r: number, c: number) { return original.value[r][c] !== 0 }
function setCell(v: number) {
  if (!sel.value || done.value) return
  const { r, c } = sel.value
  if (isFixed(r, c)) return
  grid.value[r][c] = v
  checkDone()
}
function clearCell() { setCell(0) }
function checkDone() {
  const all = grid.value.every(row => row.every(x => x > 0))
  if (!all) return
  const valid = (a: number[]) => new Set(a.filter(x=>x>0)).size === a.length
  for (let i = 0; i < SIZE; i++) {
    if (!valid(grid.value[i])) return
    const col = grid.value.map(row => row[i])
    if (!valid(col)) return
    const br = Math.floor(i/3)*3, bc = (i%3)*3
    const box: number[] = []
    for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) box.push(grid.value[br+x][bc+y])
    if (!valid(box)) return
  }
  done.value = true
}
function reset() {
  grid.value = original.value.map(r => r.slice())
  done.value = false
  sel.value = null
}
function cellClass(r: number, c: number) {
  const cls: string[] = []
  if (sel.value && sel.value.r === r && sel.value.c === c) cls.push('selected')
  if (isFixed(r, c)) cls.push('fixed')
  if (Math.floor(c/3) === 1 || Math.floor(c/3) === 0 && c % 3 === 0) cls.push('')
  return cls.join(' ')
}
</script>

<template>
  <div class="sudoku">
    <button class="back" onclick="history.back()">← 返回</button>
    <header class="s-head">
      <h1>🧩 数独探险</h1>
      <p class="muted">在 9×9 方格中填入 1-9，使每行、每列、每个 3×3 宫格都不重复</p>
    </header>
    <div class="grid-wrap">
      <div class="grid">
        <div v-for="(row,r) in grid" :key="r" class="row" :class="{ 'bold-bottom': r===2 || r===5 }">
          <div v-for="(cell,c) in row" :key="c" class="cell"
               :class="[cellClass(r,c), { 'bold-right': c===2 || c===5 }]"
               @click="sel = { r: r, c: c }">
            {{ cell || '' }}
          </div>
        </div>
      </div>
      <div class="numpad">
        <button v-for="n in 9" :key="n" @click="setCell(n)">{{ n }}</button>
        <button class="clear" @click="clearCell">⌫</button>
      </div>
      <div class="actions">
        <button class="btn btn-outline" @click="reset">🔄 重置</button>
      </div>
    </div>
    <div v-if="done" class="celebrate">
      🎉 太棒了！你完成了数独！
      <button class="btn btn-primary" @click="reset">再来一局</button>
    </div>
  </div>
</template>

<style scoped>
.sudoku { max-width: 500px; margin: 0 auto; padding: 16px; text-align: center; }
.back { background: none; border: none; color: #6B7785; font-size: 14px; cursor: pointer; display: block; margin-bottom: 8px; text-align: left; }
.s-head h1 { font-size: 24px; color: #2C3E50; }
.muted { color: #9AA5B1; font-size: 13px; margin-bottom: 16px; }
.grid-wrap { background: #fff; border-radius: 18px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.grid { display: inline-block; border: 3px solid #2C3E50; background: #2C3E50; margin-bottom: 16px; }
.row { display: flex; }
.cell { width: 38px; height: 38px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; cursor: pointer; color: #4F7DF8; border: 1px solid #E4E9F2; transition: background .15s; }
.cell.bold-right { border-right: 2px solid #2C3E50; }
.row.bold-bottom .cell { border-bottom: 2px solid #2C3E50; }
.cell.fixed { color: #2C3E50; }
.cell.selected { background: #FFF4E6; color: #FF8C42; }
.numpad { display: grid; grid-template-columns: repeat(5,1fr); gap: 6px; margin-bottom: 12px; }
.numpad button { padding: 14px 0; border-radius: 10px; background: #EFF3F8; color: #2C3E50; font-size: 18px; font-weight: 700; transition: all .15s; }
.numpad button:hover { background: #4F7DF8; color: #fff; }
.numpad .clear { background: rgba(255,77,79,.12); color: #FF4D4F; }
.actions { display: flex; justify-content: center; gap: 12px; }
.celebrate { margin-top: 16px; background: linear-gradient(135deg,#52C41A,#4F7DF8); color: #fff; border-radius: 14px; padding: 20px; font-size: 18px; font-weight: 700; }
.celebrate .btn { margin-top: 12px; }
</style>
