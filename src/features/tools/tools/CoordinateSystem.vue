<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

interface Point { x: number; y: number; id: number }
interface Shape { type: 'segment' | 'triangle' | 'rectangle'; points: Point[]; id: number }
interface FunctionCurve { expr: string; id: number }

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
const W = 640, H = 520
const PAD = 40

const xMin = ref(-10), xMax = ref(10)
const yMin = ref(-10), yMax = ref(10)
const rangePresets = ['-10,10', '-20,20', '-5,5']
const applyRange = (p: string) => { const [a, b] = p.split(',').map(Number); xMin.value = a; xMax.value = b; yMin.value = a; yMax.value = b }

const mode = ref<'point' | 'segment' | 'triangle' | 'rectangle'>('point')
const points = ref<Point[]>([])
const shapes = ref<Shape[]>([])
const tempPts = ref<Point[]>([])
const curves = ref<FunctionCurve[]>([])
const funcInput = ref('')
const funcError = ref('')
let nextId = 1

const xScale = () => (W - 2 * PAD) / (xMax.value - xMin.value)
const yScale = () => (H - 2 * PAD) / (yMax.value - yMin.value)
const toCanvas = (px: number, py: number) => ({
  x: PAD + (px - xMin.value) * xScale(),
  y: H - PAD - (py - yMin.value) * yScale()
})
const toMath = (cx: number, cy: number) => ({
  x: +((cx - PAD) / xScale() + xMin.value).toFixed(2),
  y: +((H - PAD - cy) / yScale() + yMin.value).toFixed(2)
})

function drawGrid() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)

  const step = niceStep(xMax.value - xMin.value)

  ctx.strokeStyle = '#EEF2F7'
  ctx.lineWidth = 1
  for (let x = Math.ceil(xMin.value / step) * step; x <= xMax.value; x += step) {
    const { x: cx } = toCanvas(x, 0)
    ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, H - PAD); ctx.stroke()
  }
  for (let y = Math.ceil(yMin.value / step) * step; y <= yMax.value; y += step) {
    const { y: cy } = toCanvas(0, y)
    ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke()
  }

  const o = toCanvas(0, 0)
  ctx.strokeStyle = '#2C3E50'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(PAD, o.y); ctx.lineTo(W - PAD, o.y); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(o.x, H - PAD); ctx.lineTo(o.x, PAD); ctx.stroke()

  ctx.fillStyle = '#2C3E50'
  ctx.beginPath(); ctx.moveTo(W - PAD, o.y); ctx.lineTo(W - PAD - 8, o.y - 4); ctx.lineTo(W - PAD - 8, o.y + 4); ctx.fill()
  ctx.beginPath(); ctx.moveTo(o.x, PAD); ctx.lineTo(o.x - 4, PAD + 8); ctx.lineTo(o.x + 4, PAD + 8); ctx.fill()

  ctx.font = '12px sans-serif'
  ctx.fillStyle = '#6B7785'
  ctx.fillText('x', W - PAD + 6, o.y + 12)
  ctx.fillText('y', o.x - 14, PAD - 6)
  ctx.fillText('O', o.x - 12, o.y + 12)

  ctx.strokeStyle = '#2C3E50'
  ctx.lineWidth = 1
  for (let x = Math.ceil(xMin.value / step) * step; x <= xMax.value; x += step) {
    if (Math.abs(x) < 1e-9) continue
    const { x: cx } = toCanvas(x, 0)
    ctx.beginPath(); ctx.moveTo(cx, o.y - 4); ctx.lineTo(cx, o.y + 4); ctx.stroke()
    ctx.fillText(String(x), cx - 6, o.y + 14)
  }
  for (let y = Math.ceil(yMin.value / step) * step; y <= yMax.value; y += step) {
    if (Math.abs(y) < 1e-9) continue
    const { y: cy } = toCanvas(0, y)
    ctx.beginPath(); ctx.moveTo(o.x - 4, cy); ctx.lineTo(o.x + 4, cy); ctx.stroke()
    ctx.fillText(String(y), o.x + 6, cy + 4)
  }
}

function niceStep(range: number) {
  const raw = range / 10
  const pow = Math.pow(10, Math.floor(Math.log10(raw)))
  const n = raw / pow
  if (n < 1.5) return pow
  if (n < 3) return 2 * pow
  if (n < 7) return 5 * pow
  return 10 * pow
}

function drawPoint(p: Point, color = '#FF4D4F') {
  if (!ctx) return
  const { x, y } = toCanvas(p.x, p.y)
  ctx.fillStyle = color
  ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
  ctx.fillStyle = '#2C3E50'
  ctx.font = 'bold 12px sans-serif'
  ctx.fillText(`(${p.x}, ${p.y})`, x + 8, y - 8)
}

function drawShape(s: Shape, color = '#4F7DF8') {
  if (!ctx || s.points.length < 2) return
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  const first = toCanvas(s.points[0].x, s.points[0].y)
  ctx.moveTo(first.x, first.y)
  for (let i = 1; i < s.points.length; i++) {
    const p = toCanvas(s.points[i].x, s.points[i].y)
    ctx.lineTo(p.x, p.y)
  }
  if (s.type !== 'segment') ctx.closePath()
  ctx.stroke()
  s.points.forEach(p => drawPoint(p, color))
}

function evalFunc(expr: string, x: number): number | null {
  try {
    const safe = expr.replace(/\^/g, '**').replace(/\bsin\b/g, 'Math.sin').replace(/\bcos\b/g, 'Math.cos').replace(/\btan\b/g, 'Math.tan').replace(/\bsqrt\b/g, 'Math.sqrt').replace(/\babs\b/g, 'Math.abs').replace(/\bexp\b/g, 'Math.exp').replace(/\blog\b/g, 'Math.log')
    const fn = new Function('x', `return ${safe}`)
    const r = fn(x)
    return (typeof r === 'number' && isFinite(r)) ? r : null
  } catch { return null }
}

function drawCurve(curve: FunctionCurve) {
  if (!ctx) return
  ctx.strokeStyle = '#52C41A'
  ctx.lineWidth = 2
  ctx.beginPath()
  let started = false, prevY: number | null = null
  for (let px = xMin.value; px <= xMax.value; px += (xMax.value - xMin.value) / 1000) {
    const py = evalFunc(curve.expr, px)
    if (py === null || py < yMin.value || py > yMax.value) { started = false; prevY = null; continue }
    const { x, y } = toCanvas(px, py)
    if (prevY !== null && Math.abs(y - prevY) > H / 2) { started = false }
    if (!started) { ctx.moveTo(x, y); started = true } else ctx.lineTo(x, y)
    prevY = y
  }
  ctx.stroke()
}

function redraw() {
  drawGrid()
  points.value.forEach(p => drawPoint(p))
  shapes.value.forEach(s => drawShape(s))
  curves.value.forEach(c => drawCurve(c))
}

function handleClick(e: MouseEvent) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const cx = (e.clientX - rect.left) * (W / rect.width)
  const cy = (e.clientY - rect.top) * (H / rect.height)
  if (cx < PAD || cx > W - PAD || cy < PAD || cy > H - PAD) return
  const m = toMath(cx, cy)
  const p: Point = { x: m.x, y: m.y, id: nextId++ }

  if (mode.value === 'point') {
    points.value.push(p); redraw()
  } else {
    tempPts.value.push(p)
    const needed = mode.value === 'segment' ? 2 : mode.value === 'triangle' ? 3 : 2
    if (tempPts.value.length >= needed) {
      const pts = [...tempPts.value]
      if (mode.value === 'rectangle') {
        const [a, b] = pts
        pts.splice(0, 2, { ...a, id: a.id }, { x: b.x, y: a.y, id: nextId++ }, { ...b, id: b.id }, { x: a.x, y: b.y, id: nextId++ })
      }
      shapes.value.push({ type: mode.value, points: pts, id: nextId++ })
      tempPts.value = []
      redraw()
    } else {
      redraw()
      tempPts.value.forEach(tp => drawPoint(tp, '#FF8C42'))
    }
  }
}

function addCurve() {
  const expr = funcInput.value.trim()
  if (!expr) return
  const test = evalFunc(expr, 1)
  if (test === null) { funcError.value = '表达式无效'; return }
  funcError.value = ''
  curves.value.push({ expr, id: nextId++ })
  funcInput.value = ''
  redraw()
}

function clearAll() {
  points.value = []
  shapes.value = []
  curves.value = []
  tempPts.value = []
  funcError.value = ''
  redraw()
}

watch([xMin, xMax, yMin, yMax], () => { nextTick(redraw) })

onMounted(() => {
  const c = canvasRef.value
  if (!c) return
  c.width = W; c.height = H
  ctx = c.getContext('2d')
  redraw()
})
onBeforeUnmount(() => { ctx = null })
</script>

<template>
  <div class="csys">
    <header class="csys__head">
      <button class="csys__back" onclick="history.back()">← 返回</button>
      <h1>📐 平面直角坐标系</h1>
      <p class="csys__muted">点击画布添加点，绘制图形与函数图像</p>
    </header>

    <div class="csys__toolbar">
      <div class="csys__group">
        <span class="csys__label">范围预设:</span>
        <button v-for="p in rangePresets" :key="p" @click="applyRange(p)">{{ p }}</button>
      </div>
      <div class="csys__group">
        <span class="csys__label">x:</span>
        <input type="number" v-model.number="xMin" />~<input type="number" v-model.number="xMax" />
      </div>
      <div class="csys__group">
        <span class="csys__label">y:</span>
        <input type="number" v-model.number="yMin" />~<input type="number" v-model.number="yMax" />
      </div>
    </div>

    <div class="csys__toolbar">
      <button :class="{active: mode==='point'}" @click="mode='point'; tempPts=[]">• 坐标点</button>
      <button :class="{active: mode==='segment'}" @click="mode='segment'; tempPts=[]">／ 线段</button>
      <button :class="{active: mode==='triangle'}" @click="mode='triangle'; tempPts=[]">△ 三角形</button>
      <button :class="{active: mode==='rectangle'}" @click="mode='rectangle'; tempPts=[]">▭ 矩形</button>
      <button class="csys__danger" @click="clearAll">🗑 清空</button>
    </div>

    <div class="csys__toolbar">
      <span class="csys__label">函数 y =</span>
      <input type="text" v-model="funcInput" @keyup.enter="addCurve" placeholder="如 x, x^2, 2*x+1, sin(x)" />
      <button @click="addCurve">添加</button>
      <span v-if="funcError" class="csys__error">{{ funcError }}</span>
    </div>

    <div class="csys__canvas">
      <canvas ref="canvasRef" @click="handleClick"></canvas>
    </div>

    <div v-if="curves.length" class="csys__legend">
      <div class="csys__legend-title">函数图像</div>
      <div v-for="c in curves" :key="c.id" class="csys__legend-item">
        <span class="csys__swatch" style="background:#52C41A"></span>y = {{ c.expr }}
      </div>
    </div>

    <div class="csys__tips">
      <div v-if="mode==='point'">💡 点击画布任意位置添加坐标点</div>
      <div v-else-if="mode==='segment'">💡 依次点击 2 个点绘制线段（{{ tempPts.length }}/2）</div>
      <div v-else-if="mode==='triangle'">💡 依次点击 3 个点绘制三角形（{{ tempPts.length }}/3）</div>
      <div v-else-if="mode==='rectangle'">💡 点击对角的两个点绘制矩形（{{ tempPts.length }}/2）</div>
    </div>
  </div>
</template>

<style scoped>
.csys { max-width: 760px; margin: 0 auto; padding: var(--space-4, 16px); }
.csys__head { text-align: center; margin-bottom: var(--space-3, 12px); }
.csys__back { background: none; border: none; color: var(--text-tertiary, #6B7785); cursor: pointer; font-size: 14px; display: block; text-align: left; margin-bottom: 8px; }
.csys__head h1 { font-size: 24px; color: var(--text-primary, #2C3E50); margin: 4px 0; }
.csys__muted { color: var(--text-secondary, #9AA5B1); font-size: 13px; margin: 0; }
.csys__toolbar { display: flex; gap: 8px; padding: 12px 16px; background: var(--bg-card, #fff); border-radius: var(--radius-xl, 14px); margin-bottom: 12px; flex-wrap: wrap; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.csys__toolbar button { padding: 6px 12px; border-radius: var(--radius-md, 8px); background: var(--bg-hover, #EFF3F8); color: var(--text-primary, #2C3E50); font-size: 13px; font-weight: 600; transition: all .15s; border: none; cursor: pointer; }
.csys__toolbar button.active { background: var(--color-primary, #4F7DF8); color: #fff; }
.csys__toolbar button.csys__danger { background: rgba(255,77,79,.1); color: #FF4D4F; margin-left: auto; }
.csys__label { font-size: 13px; color: var(--text-secondary, #6B7785); font-weight: 500; }
.csys__group { display: flex; align-items: center; gap: 6px; }
.csys__toolbar input[type="number"], .csys__toolbar input[type="text"] { padding: 6px 10px; border: 1px solid var(--border-color, #D9DEE5); border-radius: var(--radius-md, 8px); font-size: 13px; width: 70px; background: var(--bg-input, #fff); }
.csys__toolbar input[type="text"] { width: 220px; flex: 1; min-width: 160px; }
.csys__error { color: #FF4D4F; font-size: 13px; }
.csys__canvas { background: var(--bg-card, #fff); border-radius: var(--radius-xl, 14px); padding: 8px; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.csys__canvas canvas { display: block; width: 100%; height: auto; border-radius: var(--radius-lg, 10px); cursor: crosshair; }
.csys__legend { background: var(--bg-card, #fff); border-radius: var(--radius-xl, 14px); padding: 12px 16px; margin-top: 12px; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.csys__legend-title { font-size: 14px; font-weight: 600; color: var(--text-primary, #2C3E50); margin-bottom: 8px; }
.csys__legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-primary, #2C3E50); }
.csys__swatch { display: inline-block; width: 24px; height: 3px; border-radius: 2px; }
.csys__tips { margin-top: 12px; padding: 12px 16px; background: #FFF4E6; border-radius: var(--radius-lg, 12px); color: #7A3A00; font-size: 14px; }
</style>
