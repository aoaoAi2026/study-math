<script setup lang="ts">
import { ref, computed } from 'vue'

interface Piece {
  id: number
  name: string
  color: string
  points: string
  x: number
  y: number
  rotation: number
  flipped: boolean
  placed: boolean
}

interface Target {
  id: number
  name: string
  outline: string
  thumb: string
}

const PIECE_DEFS: { name: string; color: string; points: string }[] = [
  { name: '大三角A', color: '#e74c3c', points: '0,0 100,0 50,50' },
  { name: '大三角B', color: '#3498db', points: '0,0 100,0 50,50' },
  { name: '中三角', color: '#2ecc71', points: '0,0 70,0 35,35' },
  { name: '小三角A', color: '#f39c12', points: '0,0 50,0 25,25' },
  { name: '小三角B', color: '#9b59b6', points: '0,0 50,0 25,25' },
  { name: '正方形', color: '#1abc9c', points: '0,0 35,0 35,35 0,35' },
  { name: '平行四边形', color: '#e67e22', points: '0,35 50,35 35,0 0,0' },
]

const TARGETS: Target[] = [
  { id: 1, name: '正方形', outline: 'M50,10 L90,10 90,50 50,50 Z', thumb: 'M20,10 L40,10 40,30 20,30 Z' },
  { id: 2, name: '长方形', outline: 'M30,10 L70,10 70,50 30,50 Z', thumb: 'M15,10 L45,10 45,30 15,30 Z' },
  { id: 3, name: '三角形', outline: 'M50,10 L90,50 10,50 Z', thumb: 'M25,10 L45,30 5,30 Z' },
  { id: 4, name: '房子', outline: 'M50,10 L90,35 90,55 10,55 10,35 Z', thumb: 'M25,8 L45,20 45,30 5,30 5,20 Z' },
  { id: 5, name: '猫', outline: 'M30,15 L20,10 25,25 20,50 40,50 45,35 50,50 70,50 65,25 70,10 60,15 55,30 50,50 40,50 35,30 Z', thumb: 'M15,8 L10,5 13,13 10,25 20,25 23,18 25,25 35,25 33,13 38,5 33,8 28,15 25,25 20,25 18,15 Z' },
  { id: 6, name: '箭头', outline: 'M50,10 L90,40 70,40 70,55 30,55 30,40 10,40 Z', thumb: 'M25,5 L45,20 35,20 35,30 15,30 15,20 5,20 Z' },
]

const pieces = ref<Piece[]>([])
const selectedTarget = ref<Target | null>(null)
const selectedPieceId = ref<number | null>(null)
const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const completed = ref(false)

const trayPieces = computed(() => pieces.value.filter(p => !p.placed))
const canvasPieces = computed(() => pieces.value.filter(p => p.placed))

function initGame() {
  pieces.value = PIECE_DEFS.map((def, i) => ({
    id: i, name: def.name, color: def.color, points: def.points,
    x: 0, y: 0, rotation: 0, flipped: false, placed: false,
  }))
  selectedTarget.value = null
  selectedPieceId.value = null
  completed.value = false
}

function selectTarget(t: Target) {
  selectedTarget.value = t
  completed.value = false
  pieces.value.forEach(p => { p.placed = false; p.rotation = 0; p.flipped = false })
}

function startDrag(e: MouseEvent | TouchEvent, piece: Piece) {
  e.preventDefault()
  const ev = 'touches' in e ? e.touches[0] : e
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  dragging.value = true
  selectedPieceId.value = piece.id
  dragOffset.value = { x: ev.clientX - rect.left, y: ev.clientY - rect.top }
  if (!piece.placed) {
    piece.x = rect.left
    piece.y = rect.top
  }
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!dragging.value || selectedPieceId.value === null) return
  const ev = 'touches' in e ? e.touches[0] : e
  const piece = pieces.value.find(p => p.id === selectedPieceId.value)
  if (!piece) return
  const canvas = document.querySelector('.tangram__canvas') as HTMLElement
  if (!canvas) return
  const cr = canvas.getBoundingClientRect()
  piece.x = ev.clientX - cr.left - dragOffset.value.x + (piece.placed ? 0 : 0)
  piece.y = ev.clientY - cr.top - dragOffset.value.y + (piece.placed ? 0 : 0)
  piece.placed = true
}

function endDrag() {
  dragging.value = false
  selectedPieceId.value = null
  checkCompletion()
}

function rotatePiece(piece: Piece) {
  piece.rotation = (piece.rotation + 90) % 360
}

function flipPiece(piece: Piece) {
  if (piece.name === '平行四边形') piece.flipped = !piece.flipped
}

function clickPiece(piece: Piece) {
  if (dragging.value) return
  rotatePiece(piece)
}

function checkCompletion() {
  if (!selectedTarget.value) return
  const placed = pieces.value.filter(p => p.placed)
  if (placed.length < 7) return
  const canvas = document.querySelector('.tangram__canvas') as HTMLElement
  if (!canvas) return
  const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2
  const allNear = placed.every(p => {
    const px = p.x + 25, py = p.y + 25
    return Math.abs(px - cx) < 120 && Math.abs(py - cy) < 120
  })
  if (allNear) completed.value = true
}

function resetPieces() {
  pieces.value.forEach(p => { p.placed = false; p.rotation = 0; p.flipped = false })
  completed.value = false
}

initGame()
</script>

<template>
  <div class="tangram" @mousemove="onDrag" @mouseup="endDrag" @touchmove="onDrag" @touchend="endDrag">
    <header class="tangram__header">
      <h1 class="tangram__title">七巧板拼图</h1>
      <p class="tangram__desc">拖拽板块到画布，拼出目标图形</p>
    </header>

    <div class="tangram__targets">
      <button v-for="t in TARGETS" :key="t.id" class="tangram__target-btn"
        :class="{ active: selectedTarget?.id === t.id }" @click="selectTarget(t)">
        <svg viewBox="0 0 50 40" width="50" height="40">
          <path :d="t.thumb" fill="var(--tg-color-primary)" opacity="0.3" stroke="var(--tg-color-primary)" stroke-width="1.5"/>
        </svg>
        <span>{{ t.name }}</span>
      </button>
    </div>

    <div class="tangram__canvas" :class="{ 'has-target': selectedTarget }">
      <svg v-if="selectedTarget" viewBox="0 0 100 65" class="tangram__outline" preserveAspectRatio="xMidYMid meet">
        <path :d="selectedTarget.outline" fill="none" stroke="var(--tg-color-primary)" stroke-width="1"
          stroke-dasharray="3,2" opacity="0.5"/>
      </svg>
      <svg v-for="p in canvasPieces" :key="p.id" class="tangram__piece" :style="{
        left: p.x + 'px', top: p.y + 'px', cursor: dragging && selectedPieceId === p.id ? 'grabbing' : 'grab'
      }" @mousedown="startDrag($event, p)" @touchstart="startDrag($event, p)" @click="clickPiece(p)">
        <g :transform="`translate(25,25) rotate(${p.rotation}) scale(${p.flipped ? -1 : 1},1) translate(-25,-25)`">
          <polygon :points="p.points" :fill="p.color" stroke="#fff" stroke-width="1.5" opacity="0.9"/>
        </g>
      </svg>
      <div v-if="!selectedTarget" class="tangram__canvas-hint">请先选择一个目标图形</div>
    </div>

    <div class="tangram__tray">
      <div v-for="p in trayPieces" :key="p.id" class="tangram__tray-item">
        <svg width="50" height="50" viewBox="0 0 100 100" @mousedown="startDrag($event, p)" @touchstart="startDrag($event, p)">
          <g transform="translate(25,25) scale(0.5) translate(-25,-25)">
            <polygon :points="p.points" :fill="p.color" stroke="#fff" stroke-width="2"/>
          </g>
        </svg>
        <span class="tangram__tray-label">{{ p.name }}</span>
      </div>
    </div>

    <div class="tangram__actions">
      <button v-if="selectedTarget" class="tangram__btn" @click="resetPieces">重置板块</button>
      <button class="tangram__btn tangram__btn--primary" @click="initGame">重新开始</button>
    </div>

    <div v-if="completed" class="tangram__celebrate">
      <div class="tangram__celebrate-inner">
        <h2>拼图完成!</h2>
        <p>你成功拼出了「{{ selectedTarget?.name }}」</p>
        <button class="tangram__btn tangram__btn--success" @click="resetPieces">继续挑战</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tangram {
  --tg-color-primary: #4f7df8;
  --tg-color-success: #10b981;
  --tg-color-warm: #ff8c42;
  --tg-bg-card: #ffffff;
  --tg-bg-hover: #f1f5f9;
  --tg-text-primary: #2c3e50;
  --tg-text-secondary: #6b7785;
  --tg-border-color: #e4e9f2;
  --tg-radius-lg: 12px;
  --tg-radius-xl: 16px;
  --tg-shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);
  --tg-transition-fast: 0.2s ease;

  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px;
  text-align: center;
  user-select: none;
}
.tangram__header { margin-bottom: 16px; }
.tangram__title { font-size: 28px; font-weight: 700; color: var(--tg-text-primary); margin: 0 0 4px; }
.tangram__desc { color: var(--tg-text-secondary); font-size: 14px; margin: 0; }

.tangram__targets {
  display: flex; justify-content: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;
}
.tangram__target-btn {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 12px; background: var(--tg-bg-card); border: 2px solid var(--tg-border-color);
  border-radius: var(--tg-radius-lg); cursor: pointer; transition: all var(--tg-transition-fast);
  font-size: 12px; color: var(--tg-text-secondary);
}
.tangram__target-btn:hover { border-color: var(--tg-color-primary); color: var(--tg-color-primary); }
.tangram__target-btn.active { border-color: var(--tg-color-primary); background: #eef2ff; color: var(--tg-color-primary); }

.tangram__canvas {
  position: relative; width: 100%; height: 320px; background: var(--tg-bg-card);
  border: 2px dashed var(--tg-border-color); border-radius: var(--tg-radius-xl);
  margin-bottom: 16px; overflow: hidden;
}
.tangram__canvas.has-target { border-style: solid; }
.tangram__outline { position: absolute; inset: 0; width: 100%; height: 100%; }
.tangram__piece {
  position: absolute; width: 50px; height: 50px; z-index: 2;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15)); transition: filter var(--tg-transition-fast);
}
.tangram__piece:hover { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25)); }
.tangram__canvas-hint {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  color: var(--tg-text-secondary); font-size: 15px;
}

.tangram__tray {
  display: flex; justify-content: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;
}
.tangram__tray-item {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 6px; background: var(--tg-bg-card); border-radius: var(--tg-radius-lg);
  box-shadow: var(--tg-shadow-card); cursor: grab;
}
.tangram__tray-label { font-size: 10px; color: var(--tg-text-secondary); }

.tangram__actions { display: flex; justify-content: center; gap: 10px; }
.tangram__btn {
  padding: 10px 22px; background: var(--tg-bg-card); border: 2px solid var(--tg-border-color);
  border-radius: var(--tg-radius-lg); color: var(--tg-text-primary); font-size: 14px;
  font-weight: 600; cursor: pointer; transition: all var(--tg-transition-fast);
}
.tangram__btn:hover { border-color: var(--tg-color-primary); color: var(--tg-color-primary); }
.tangram__btn--primary { background: var(--tg-color-primary); border-color: var(--tg-color-primary); color: #fff; }
.tangram__btn--primary:hover { opacity: 0.9; }
.tangram__btn--success { background: var(--tg-color-success); border-color: var(--tg-color-success); color: #fff; }

.tangram__celebrate {
  position: fixed; inset: 0; background: rgba(44,62,80,0.6); display: flex;
  align-items: center; justify-content: center; z-index: 10; animation: tg-fade 0.3s ease;
}
.tangram__celebrate-inner {
  background: var(--bg-card); padding: 32px 40px; border-radius: var(--tg-radius-xl);
  text-align: center; box-shadow: var(--shadow-lg); animation: tg-pop 0.4s ease;
}
.tangram__celebrate-inner h2 { margin: 0 0 8px; font-size: 24px; color: var(--tg-color-success); }
.tangram__celebrate-inner p { margin: 0 0 16px; color: var(--tg-text-secondary); }

@keyframes tg-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes tg-pop { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }

@media (max-width: 480px) {
  .tangram__canvas { height: 260px; }
  .tangram__tray { gap: 4px; }
  .tangram__tray-item svg { width: 40px; height: 40px; }
}
</style>
