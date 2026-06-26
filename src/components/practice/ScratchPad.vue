<script setup lang="ts">
/**
 * ScratchPad - 多页草稿纸组件
 * 支持数学计算、图形绘制、多页管理、自动保存
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  initialContent?: string
  autoSave?: boolean
  maxPages?: number
}>(), {
  initialContent: '',
  autoSave: true,
  maxPages: 5
})

const emit = defineEmits<{
  change: [content: string]
  save: [content: string]
}>()

const pages = ref<string[]>([''])
const currentPage = ref(0)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isDrawing = ref(false)
const drawColor = ref('#1f2937')
const drawSize = ref(2)
const drawMode = ref<'pen' | 'eraser'>('pen')
const hasContent = ref(false)
const savedKey = `scratchpad-${Date.now()}`

const colors = ['#1f2937', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
const sizes = [1, 2, 3, 5, 8]

// 初始化画布
function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx.value = canvas.getContext('2d')
  if (!ctx.value) return
  
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  ctx.value.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  // 画网格线
  drawGrid()
  
  // 恢复当前页内容
  if (pages.value[currentPage.value]) {
    restoreContent(pages.value[currentPage.value])
  }
}

function drawGrid() {
  const canvas = canvasRef.value
  const c = ctx.value
  if (!canvas || !c) return
  
  c.strokeStyle = '#e5e7eb'
  c.lineWidth = 0.5
  
  const width = canvas.width / window.devicePixelRatio
  const height = canvas.height / window.devicePixelRatio
  const gridSize = 20
  
  // 横线
  for (let y = gridSize; y < height; y += gridSize) {
    c.beginPath()
    c.moveTo(0, y)
    c.lineTo(width, y)
    c.stroke()
  }
  
  // 竖线
  for (let x = gridSize; x < width; x += gridSize) {
    c.beginPath()
    c.moveTo(x, 0)
    c.lineTo(x, height)
    c.stroke()
  }
}

// 恢复保存的内容
function restoreContent(content: string) {
  if (!content) return
  const canvas = canvasRef.value
  const c = ctx.value
  if (!canvas || !c) return
  
  try {
    const img = new Image()
    img.onload = () => {
      c.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
      hasContent.value = true
    }
    img.src = content
  } catch {
    // 忽略错误
  }
}

// 获取当前页内容（base64）
function getPageContent(): string {
  const canvas = canvasRef.value
  if (!canvas) return ''
  return canvas.toDataURL('image/png')
}

// 保存当前页
function saveCurrentPage() {
  pages.value[currentPage.value] = getPageContent()
  emit('change', JSON.stringify(pages.value))
  if (props.autoSave) {
    try {
      localStorage.setItem(savedKey, JSON.stringify(pages.value))
    } catch {
      // ignore
    }
  }
  emit('save', JSON.stringify(pages.value))
}

// 添加新页
function addPage() {
  if (pages.value.length >= props.maxPages) return
  pages.value.push('')
  currentPage.value = pages.value.length - 1
  nextTick(() => {
    initCanvas()
  })
}

// 删除当前页
function deletePage() {
  if (pages.value.length <= 1) return
  pages.value.splice(currentPage.value, 1)
  if (currentPage.value >= pages.value.length) {
    currentPage.value = pages.value.length - 1
  }
  nextTick(() => {
    initCanvas()
  })
}

// 切换页
function goToPage(index: number) {
  if (index < 0 || index >= pages.value.length) return
  saveCurrentPage()
  currentPage.value = index
  nextTick(() => {
    initCanvas()
  })
}

// 清空当前页
function clearPage() {
  const canvas = canvasRef.value
  const c = ctx.value
  if (!canvas || !c) return
  c.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
  drawGrid()
  pages.value[currentPage.value] = ''
  hasContent.value = false
}

// 鼠标/触摸事件
function getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  
  if (e instanceof TouchEvent) {
    const touch = e.touches[0] || e.changedTouches[0]
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    }
  }
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function startDraw(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  isDrawing.value = true
  const pos = getPos(e)
  const c = ctx.value
  if (!c) return
  
  c.beginPath()
  c.moveTo(pos.x, pos.y)
}

function draw(e: MouseEvent | TouchEvent) {
  if (!isDrawing.value) return
  e.preventDefault()
  const pos = getPos(e)
  const c = ctx.value
  if (!c) return
  
  c.lineWidth = drawSize.value
  c.lineCap = 'round'
  c.lineJoin = 'round'
  
  if (drawMode.value === 'eraser') {
    c.globalCompositeOperation = 'destination-out'
    c.strokeStyle = 'rgba(0,0,0,1)'
  } else {
    c.globalCompositeOperation = 'source-over'
    c.strokeStyle = drawColor.value
  }
  
  c.lineTo(pos.x, pos.y)
  c.stroke()
}

function endDraw() {
  if (!isDrawing.value) return
  isDrawing.value = false
  const c = ctx.value
  if (c) c.closePath()
  hasContent.value = true
  saveCurrentPage()
}

// 加载保存的数据
function loadSaved() {
  if (props.initialContent) {
    try {
      const data = JSON.parse(props.initialContent)
      if (Array.isArray(data) && data.length > 0) {
        pages.value = data
      }
    } catch {
      // ignore
    }
  }
  
  try {
    const saved = localStorage.getItem(savedKey)
    if (saved) {
      const data = JSON.parse(saved)
      if (Array.isArray(data) && data.length > 0) {
        pages.value = data
      }
    }
  } catch {
    // ignore
  }
}

// 导出内容
function exportContent() {
  const canvas = canvasRef.value
  if (!canvas) return ''
  return canvas.toDataURL('image/png')
}

defineExpose({ exportContent, saveCurrentPage, clearPage })

onMounted(() => {
  loadSaved()
  nextTick(() => {
    initCanvas()
  })
  
  window.addEventListener('resize', initCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCanvas)
  saveCurrentPage()
})
</script>

<template>
  <div class="scratchpad">
    <!-- 工具栏 -->
    <div class="sp-toolbar">
      <!-- 颜色选择 -->
      <div class="sp-colors">
        <button
          v-for="color in colors"
          :key="color"
          class="sp-color-btn"
          :class="{ active: drawColor === color && drawMode === 'pen' }"
          :style="{ background: color }"
          @click="drawColor = color; drawMode = 'pen'"
        />
      </div>
      
      <!-- 笔刷大小 -->
      <div class="sp-sizes">
        <button
          v-for="size in sizes"
          :key="size"
          class="sp-size-btn"
          :class="{ active: drawSize === size && drawMode === 'pen' }"
          @click="drawSize = size; drawMode = 'pen'"
        >
          <span :style="{ width: size * 2 + 'px', height: size * 2 + 'px' }" />
        </button>
      </div>
      
      <!-- 橡皮擦 -->
      <button
        class="sp-tool-btn"
        :class="{ active: drawMode === 'eraser' }"
        @click="drawMode = drawMode === 'eraser' ? 'pen' : 'eraser'"
      >
        🧹
      </button>
      
      <!-- 清空 -->
      <button class="sp-tool-btn" @click="clearPage">
        🗑️
      </button>
      
      <div class="sp-divider" />
      
      <!-- 页码 -->
      <div class="sp-pages">
        <button
          v-for="(_, i) in pages"
          :key="i"
          class="sp-page-btn"
          :class="{ active: currentPage === i }"
          @click="goToPage(i)"
        >
          {{ i + 1 }}
        </button>
        <button
          v-if="pages.length < maxPages"
          class="sp-page-btn sp-page-btn--add"
          @click="addPage"
        >
          +
        </button>
      </div>
    </div>
    
    <!-- 画布 -->
    <div class="sp-canvas-wrap">
      <canvas
        ref="canvasRef"
        class="sp-canvas"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="endDraw"
        @mouseleave="endDraw"
        @touchstart="startDraw"
        @touchmove="draw"
        @touchend="endDraw"
      />
      
      <!-- 页码指示 -->
      <div class="sp-page-indicator">
        第 {{ currentPage + 1 }} / {{ pages.length }} 页
      </div>
    </div>
  </div>
</template>

<style scoped>
.scratchpad {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
}

.sp-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-3, 12px);
  padding: var(--space-3, 12px) var(--space-4, 16px);
  background: var(--bg-hover, #f3f4f6);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  flex-wrap: wrap;
}

.sp-colors {
  display: flex;
  gap: 6px;
}

.sp-color-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s;
}

.sp-color-btn:hover {
  transform: scale(1.1);
}

.sp-color-btn.active {
  border-color: var(--text-primary, #1f2937);
  box-shadow: 0 0 0 2px var(--bg-card, #fff);
}

.sp-sizes {
  display: flex;
  gap: 4px;
  align-items: center;
}

.sp-size-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-card, #fff);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.sp-size-btn:hover {
  border-color: var(--color-primary, #6366f1);
}

.sp-size-btn.active {
  background: var(--color-primary, #6366f1);
  border-color: var(--color-primary, #6366f1);
}

.sp-size-btn.active span {
  background: var(--bg-page);
}

.sp-size-btn span {
  background: var(--text-primary, #1f2937);
  border-radius: 50%;
}

.sp-tool-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-card, #fff);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s;
}

.sp-tool-btn:hover {
  border-color: var(--color-primary, #6366f1);
}

.sp-tool-btn.active {
  background: var(--color-primary, #6366f1);
  border-color: var(--color-primary, #6366f1);
}

.sp-divider {
  width: 1px;
  height: 24px;
  background: var(--border-color, #e5e7eb);
}

.sp-pages {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.sp-page-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--bg-card, #fff);
  color: var(--text-secondary, #4b5563);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.sp-page-btn:hover {
  border-color: var(--color-primary, #6366f1);
  color: var(--color-primary, #6366f1);
}

.sp-page-btn.active {
  background: var(--color-primary, #6366f1);
  border-color: var(--color-primary, #6366f1);
  color: #fff;
}

.sp-page-btn--add {
  color: var(--text-tertiary, #9ca3af);
}

.sp-canvas-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.sp-canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: none;
  background: var(--bg-card);
}

.sp-page-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  border-radius: var(--radius-sm, 4px);
}
</style>
