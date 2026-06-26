<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
const color = ref('#4F7DF8')
const mode = ref<'pen' | 'rect' | 'erase'>('pen')
let drawing = false
let startX = 0, startY = 0
const imageDataStack: ImageData[] = []

onMounted(() => {
  const c = canvasRef.value
  if (!c) return
  c.width = 600; c.height = 400
  ctx = c.getContext('2d')
  if (ctx) { ctx.fillStyle = '#fff'; ctx.fillRect(0,0,c.width,c.height); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round' }
})
onBeforeUnmount(() => { ctx = null })

function pos(e: MouseEvent | TouchEvent): {x: number, y: number} {
  const c = canvasRef.value!
  const r = c.getBoundingClientRect()
  const sx = c.width / r.width, sy = c.height / r.height
  const p = 'touches' in e ? e.touches[0] : (e as MouseEvent)
  return { x: (p.clientX - r.left) * sx, y: (p.clientY - r.top) * sy }
}

function pushUndo() {
  if (ctx && canvasRef.value) imageDataStack.push(ctx.getImageData(0,0,canvasRef.value.width,canvasRef.value.height))
}

function start(e: MouseEvent | TouchEvent) {
  if (!ctx) return
  pushUndo()
  drawing = true
  const p = pos(e); startX = p.x; startY = p.y
  if (mode.value === 'pen') { ctx.beginPath(); ctx.moveTo(startX, startY); ctx.strokeStyle = color.value }
  if (mode.value === 'erase') { ctx.beginPath(); ctx.moveTo(startX, startY); ctx.strokeStyle = '#fff'; ctx.lineWidth = 20 }
}

function move(e: MouseEvent | TouchEvent) {
  if (!drawing || !ctx) return
  const p = pos(e)
  if (mode.value === 'pen' || mode.value === 'erase') { ctx.lineTo(p.x, p.y); ctx.stroke() }
}

function end(e: MouseEvent | TouchEvent) {
  if (!drawing || !ctx) return
  const p = pos(e)
  if (mode.value === 'rect') {
    ctx.strokeStyle = color.value; ctx.lineWidth = 3
    ctx.strokeRect(Math.min(startX,p.x), Math.min(startY,p.y), Math.abs(p.x-startX), Math.abs(p.y-startY))
  }
  if (mode.value === 'erase') ctx.lineWidth = 3
  drawing = false
}

function undo() {
  if (!ctx || !canvasRef.value || imageDataStack.length === 0) return
  ctx.putImageData(imageDataStack.pop()!, 0, 0)
}
function clear() {
  if (!ctx || !canvasRef.value) return
  pushUndo()
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvasRef.value.width,canvasRef.value.height)
}
</script>

<template>
  <div class="geo">
    <header class="g-head">
      <button class="back" onclick="history.back()">← 返回</button>
      <h1>🎨 几何画板</h1>
      <p class="muted">动手画图，理解周长、面积与图形变换</p>
    </header>
    <div class="toolbar">
      <button :class="{active: mode==='pen'}" @click="mode='pen'">✏️ 画笔</button>
      <button :class="{active: mode==='rect'}" @click="mode='rect'">⬜ 矩形</button>
      <button :class="{active: mode==='erase'}" @click="mode='erase'">🧽 橡皮</button>
      <div class="colors">
        <button v-for="c in ['#4F7DF8','#FF8C42','#52C41A','#FF4D4F','#9254DE']" :key="c"
                :style="{background:c}" :class="{active: color===c}" @click="color=c"></button>
      </div>
      <button class="btn-outline" @click="undo">↶ 撤销</button>
      <button class="btn-danger" @click="clear">🗑 清空</button>
    </div>
    <div class="canvas-wrap">
      <canvas ref="canvasRef"
              @mousedown="start" @mousemove="move" @mouseup="end" @mouseleave="end"
              @touchstart.prevent="start" @touchmove.prevent="move" @touchend.prevent="end"></canvas>
    </div>
    <div class="tips">
      <div v-if="mode==='pen'">💡 试着画一个长方形，数一数长边有几格，短边有几格？</div>
      <div v-else-if="mode==='rect'">💡 按住鼠标从一个角拖到对角，画出矩形</div>
      <div v-else>💡 用橡皮擦掉画错的部分</div>
    </div>
  </div>
</template>

<style scoped>
.geo { max-width: 720px; margin: 0 auto; padding: 16px; }
.g-head { text-align: center; margin-bottom: 16px; }
.back { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 14px; display: block; text-align: left; margin-bottom: 8px; }
.g-head h1 { font-size: 24px; color: var(--text-primary); }
.muted { color: var(--text-secondary); font-size: 13px; }
.toolbar { display: flex; gap: 8px; padding: 12px 16px; background: var(--bg-card); border-radius: 14px; margin-bottom: 12px; flex-wrap: wrap; align-items: center; box-shadow: var(--shadow-sm); }
.toolbar button { padding: 8px 14px; border-radius: 8px; background: var(--bg-hover); color: var(--text-primary); font-size: 13px; font-weight: 600; transition: all .15s; }
.toolbar button.active { background: var(--color-primary); color: #fff; }
.toolbar .btn-outline { border: 2px solid var(--color-primary); background: var(--bg-card); color: var(--color-primary); }
.toolbar .btn-danger { background: rgba(239, 68, 68, 0.1); color: var(--color-danger); }
.colors { display: flex; gap: 6px; }
.colors button { width: 26px; height: 26px; border-radius: 50%; padding: 0; border: 3px solid transparent; }
.colors button.active { border-color: var(--text-primary); }
.canvas-wrap { background: var(--bg-card); border-radius: 14px; padding: 8px; box-shadow: var(--shadow-sm); }
canvas { display: block; width: 100%; height: auto; border-radius: 10px; cursor: crosshair; background:
  linear-gradient(var(--border-color) 1px, transparent 1px) 0 0/25px 25px,
  linear-gradient(90deg,var(--border-color) 1px, transparent 1px) 0 0/25px 25px, var(--bg-card); }
.tips { margin-top: 12px; padding: 12px 16px; background: var(--card-yellow-bg); border-radius: 12px; color: var(--card-yellow-text); font-size: 14px; }
</style>
