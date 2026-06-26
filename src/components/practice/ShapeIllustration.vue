<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  shape: string
  size?: number
  color?: string
  strokeColor?: string
}>()

const size = computed(() => props.size || 180)
const mainColor = computed(() => props.color || '#f59e0b')
const stroke = computed(() => props.strokeColor || '#1e293b')

// 计算视图框尺寸
const vb = computed(() => {
  const s = size.value
  return { width: s, height: s * 0.7 }
})
</script>

<template>
  <div class="shape-illustration" :style="{ width: vb.width + 'px', height: vb.height + 'px' }">
    <!-- 正方体 -->
    <svg v-if="shape === 'cube'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <!-- 顶面（菱形） -->
      <polygon points="100,10 170,45 100,80 30,45" :fill="mainColor" :stroke="stroke" stroke-width="2" opacity="0.85" />
      <!-- 前面 -->
      <polygon points="30,45 100,80 100,130 30,95" fill="#fbbf24" :stroke="stroke" stroke-width="2" />
      <!-- 右面 -->
      <polygon points="170,45 100,80 100,130 170,95" fill="#d97706" :stroke="stroke" stroke-width="2" />
      <!-- 顶点标识 -->
      <circle cx="100" cy="10" r="3" :fill="stroke" />
      <text x="100" y="135" text-anchor="middle" font-size="14" fill="#64748b">正方体</text>
    </svg>

    <!-- 长方体 -->
    <svg v-else-if="shape === 'cuboid'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <!-- 顶面 -->
      <polygon points="40,20 160,20 190,50 70,50" fill="#fbbf24" :stroke="stroke" stroke-width="2" opacity="0.9" />
      <!-- 前面 -->
      <polygon points="40,20 160,20 160,110 40,110" fill="#fcd34d" :stroke="stroke" stroke-width="2" />
      <!-- 右面 -->
      <polygon points="160,20 190,50 190,140 160,110" fill="#d97706" :stroke="stroke" stroke-width="2" />
      <text x="115" y="135" text-anchor="middle" font-size="14" fill="#64748b">长方体</text>
    </svg>

    <!-- 圆柱 -->
    <svg v-else-if="shape === 'cylinder'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <!-- 侧面 -->
      <rect x="50" y="25" width="100" height="85" fill="#60a5fa" :stroke="stroke" stroke-width="2" />
      <!-- 顶面椭圆 -->
      <ellipse cx="100" cy="25" rx="50" ry="12" fill="#93c5fd" :stroke="stroke" stroke-width="2" />
      <!-- 底面椭圆（前半部分可见） -->
      <path d="M50,110 Q100,125 150,110" fill="none" :stroke="stroke" stroke-width="2" />
      <ellipse cx="100" cy="110" rx="50" ry="12" fill="#3b82f6" :stroke="stroke" stroke-width="2" opacity="0.5" />
      <!-- 标注 -->
      <line x1="155" y1="25" x2="155" y2="110" :stroke="stroke" stroke-width="1" stroke-dasharray="3,2" />
      <text x="100" y="135" text-anchor="middle" font-size="14" fill="#64748b">圆柱</text>
    </svg>

    <!-- 球 -->
    <svg v-else-if="shape === 'sphere'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <!-- 球体阴影 -->
      <ellipse cx="100" cy="125" rx="50" ry="8" fill="#00000022" />
      <!-- 球体 -->
      <circle cx="100" cy="70" r="50" fill="#ef4444" :stroke="stroke" stroke-width="2" />
      <!-- 高光 -->
      <ellipse cx="82" cy="55" rx="15" ry="10" fill="#ffffff" opacity="0.5" />
      <!-- 辅助线 -->
      <circle cx="100" cy="70" r="50" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.3" stroke-dasharray="5,3" />
      <text x="100" y="138" text-anchor="middle" font-size="14" fill="#64748b">球</text>
    </svg>

    <!-- 圆锥 -->
    <svg v-else-if="shape === 'cone'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <!-- 侧面 -->
      <polygon points="100,15 50,105 150,105" fill="#a78bfa" :stroke="stroke" stroke-width="2" />
      <!-- 底面 -->
      <ellipse cx="100" cy="105" rx="50" ry="12" fill="#8b5cf6" :stroke="stroke" stroke-width="2" opacity="0.6" />
      <path d="M50,105 Q100,118 150,105" fill="none" :stroke="stroke" stroke-width="2" />
      <text x="100" y="135" text-anchor="middle" font-size="14" fill="#64748b">圆锥</text>
    </svg>

    <!-- 圆 -->
    <svg v-else-if="shape === 'circle'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <circle cx="100" cy="70" r="50" fill="#fde68a" :stroke="stroke" stroke-width="2" />
      <!-- 直径 -->
      <line x1="50" y1="70" x2="150" y2="70" :stroke="stroke" stroke-width="1" stroke-dasharray="4,2" />
      <circle cx="100" cy="70" r="3" :fill="stroke" />
      <text x="100" y="138" text-anchor="middle" font-size="14" fill="#64748b">圆</text>
    </svg>

    <!-- 长方形 -->
    <svg v-else-if="shape === 'rectangle'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <rect x="40" y="30" width="120" height="70" fill="#fde68a" :stroke="stroke" stroke-width="2" />
      <line x1="40" y1="105" x2="160" y2="105" :stroke="stroke" stroke-width="1" stroke-dasharray="4,2" />
      <text x="100" y="125" text-anchor="middle" font-size="12" fill="#64748b">长</text>
      <text x="175" y="70" text-anchor="middle" font-size="12" fill="#64748b">宽</text>
      <line x1="160" y1="30" x2="160" y2="100" :stroke="stroke" stroke-width="1" stroke-dasharray="4,2" />
    </svg>

    <!-- 正方形 -->
    <svg v-else-if="shape === 'square'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <rect x="55" y="25" width="90" height="90" fill="#fde68a" :stroke="stroke" stroke-width="2" />
      <line x1="55" y1="118" x2="145" y2="118" :stroke="stroke" stroke-width="1" stroke-dasharray="4,2" />
      <text x="100" y="138" text-anchor="middle" font-size="13" fill="#64748b">正方形</text>
    </svg>

    <!-- 三角形 -->
    <svg v-else-if="shape === 'triangle'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <polygon points="100,20 40,115 160,115" fill="#fde68a" :stroke="stroke" stroke-width="2" />
      <line x1="100" y1="20" x2="100" y2="115" :stroke="stroke" stroke-width="1" stroke-dasharray="4,2" />
      <text x="100" y="138" text-anchor="middle" font-size="13" fill="#64748b">三角形</text>
    </svg>

    <!-- 多种图形对比 -->
    <svg v-else-if="shape === 'shapes-compare'" :width="vb.width + 50" :height="vb.height" viewBox="0 0 260 140">
      <!-- 长方体 -->
      <rect x="15" y="35" width="55" height="55" fill="#fbbf24" stroke="#1e293b" stroke-width="2" />
      <polygon points="15,35 45,15 100,15 70,35" fill="#fcd34d" stroke="#1e293b" stroke-width="2" />
      <polygon points="70,35 100,15 100,70 70,90" fill="#d97706" stroke="#1e293b" stroke-width="2" />
      <text x="57" y="110" text-anchor="middle" font-size="11" fill="#64748b">长方体</text>

      <!-- 正方体 -->
      <polygon points="135,15 180,35 135,55 90,35" fill="#f59e0b" stroke="#1e293b" stroke-width="2" />
      <polygon points="90,35 135,55 135,100 90,80" fill="#fbbf24" stroke="#1e293b" stroke-width="2" />
      <polygon points="180,35 135,55 135,100 180,80" fill="#d97706" stroke="#1e293b" stroke-width="2" />
      <text x="135" y="115" text-anchor="middle" font-size="11" fill="#64748b">正方体</text>

      <!-- 圆柱 -->
      <rect x="200" y="25" width="50" height="55" fill="#60a5fa" stroke="#1e293b" stroke-width="2" />
      <ellipse cx="225" cy="25" rx="25" ry="7" fill="#93c5fd" stroke="#1e293b" stroke-width="2" />
      <ellipse cx="225" cy="80" rx="25" ry="7" fill="#3b82f6" stroke="#1e293b" stroke-width="2" opacity="0.5" />
      <text x="225" y="105" text-anchor="middle" font-size="11" fill="#64748b">圆柱</text>
    </svg>

    <!-- 时钟 -->
    <svg v-else-if="shape === 'clock'" :width="vb.width" :height="vb.height" viewBox="0 0 200 140">
      <circle cx="100" cy="65" r="50" fill="#ffffff" stroke="#1e293b" stroke-width="3" />
      <circle cx="100" cy="65" r="45" fill="#fef3c7" stroke="#d97706" stroke-width="1" />
      <!-- 刻度 -->
      <g fill="#1e293b" font-size="12" font-weight="bold">
        <text x="100" y="30" text-anchor="middle">12</text>
        <text x="135" y="70" text-anchor="middle">3</text>
        <text x="100" y="110" text-anchor="middle">6</text>
        <text x="65" y="70" text-anchor="middle">9</text>
      </g>
      <!-- 时针 -->
      <line x1="100" y1="65" x2="100" y2="35" stroke="#1e293b" stroke-width="3" />
      <!-- 分针 -->
      <line x1="100" y1="65" x2="125" y2="65" stroke="#d97706" stroke-width="2" />
      <circle cx="100" cy="65" r="4" fill="#1e293b" />
      <text x="100" y="138" text-anchor="middle" font-size="14" fill="#64748b">时钟</text>
    </svg>

    <!-- 人民币 -->
    <svg v-else-if="shape === 'money'" :width="vb.width" :height="vb.height" viewBox="0 0 220 140">
      <!-- 纸币 -->
      <rect x="15" y="25" width="85" height="45" rx="3" fill="#86efac" stroke="#166534" stroke-width="2" />
      <text x="57" y="50" text-anchor="middle" font-size="16" fill="#166534" font-weight="bold">1元</text>
      <text x="57" y="65" text-anchor="middle" font-size="10" fill="#166534">¥1.00</text>
      <text x="57" y="90" text-anchor="middle" font-size="11" fill="#64748b">纸币</text>

      <!-- 硬币 -->
      <circle cx="150" cy="48" r="22" fill="#fcd34d" stroke="#92400e" stroke-width="2" />
      <text x="150" y="53" text-anchor="middle" font-size="14" fill="#92400e" font-weight="bold">1</text>
      <text x="150" y="65" text-anchor="middle" font-size="9" fill="#92400e">元</text>
      <text x="150" y="90" text-anchor="middle" font-size="11" fill="#64748b">硬币</text>

      <!-- 5角 -->
      <circle cx="200" cy="48" r="18" fill="#fef3c7" stroke="#a16207" stroke-width="2" />
      <text x="200" y="53" text-anchor="middle" font-size="11" fill="#a16207" font-weight="bold">5</text>
      <text x="200" y="63" text-anchor="middle" font-size="8" fill="#a16207">角</text>
    </svg>

    <!-- 数轴 -->
    <svg v-else-if="shape === 'numberline'" :width="vb.width + 20" :height="vb.height" viewBox="0 0 240 140">
      <line x1="20" y1="70" x2="220" y2="70" stroke="#1e293b" stroke-width="2" />
      <!-- 箭头 -->
      <polygon points="220,70 210,63 210,77" fill="#1e293b" />
      <polygon points="20,70 30,63 30,77" fill="#1e293b" />
      <!-- 刻度 -->
      <g stroke="#1e293b" stroke-width="1.5">
        <line x1="40" y1="62" x2="40" y2="78" />
        <line x1="70" y1="62" x2="70" y2="78" />
        <line x1="100" y1="62" x2="100" y2="78" />
        <line x1="130" y1="62" x2="130" y2="78" />
        <line x1="160" y1="62" x2="160" y2="78" />
        <line x1="190" y1="62" x2="190" y2="78" />
      </g>
      <g font-size="12" fill="#1e293b" text-anchor="middle">
        <text x="40" y="98">0</text>
        <text x="70" y="98">1</text>
        <text x="100" y="98">2</text>
        <text x="130" y="98">3</text>
        <text x="160" y="98">4</text>
        <text x="190" y="98">5</text>
      </g>
      <!-- 跳跃 -->
      <path d="M70,58 Q100,35 130,58" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5,3" />
      <polygon points="130,58 123,49 127,62" fill="#f59e0b" />
      <text x="100" y="48" text-anchor="middle" font-size="13" fill="#d97706" font-weight="bold">+3</text>
    </svg>

    <!-- 默认：显示图形名称 -->
    <div v-else class="shape-illustration__fallback">
      <div class="shape-illustration__text">{{ shape }}</div>
    </div>
  </div>
</template>

<style scoped>
.shape-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--space-3) 0;
  background: #f8fafc;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  border: 1px solid #e2e8f0;
}

.shape-illustration__fallback {
  width: 100%;
  text-align: center;
  padding: var(--space-6);
  color: #64748b;
  font-size: var(--text-base);
}

.shape-illustration__text {
  font-weight: 500;
  color: #475569;
}
</style>
