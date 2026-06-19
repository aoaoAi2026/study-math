<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import SegmentDiagram from './tools/SegmentDiagram.vue'

const segments = ref([1, 4])
const total = ref(30)
const labels = ref(['小红', '小明'])
const isInteractive = ref(true)

const presets = [
  { name: '和倍问题', segments: [1, 4], total: 30, labels: ['小红(1份)', '小明(4份)'] },
  { name: '差倍问题', segments: [1, 3], total: 20, labels: ['小', '大'] },
  { name: '和差问题', segments: [1, 1], total: 50, labels: ['小', '大'] },
  { name: '三个量和倍', segments: [1, 2, 3], total: 60, labels: ['乙', '甲', '丙'] }
]

function applyPreset(preset: typeof presets[0]) {
  segments.value = [...preset.segments]
  total.value = preset.total
  labels.value = [...preset.labels]
}

function updateTotal(newTotal: number) {
  total.value = newTotal
}

const oneUnit = computed(() => {
  const sum = segments.value.reduce((a, b) => a + b, 0)
  return sum > 0 ? (total.value / sum).toFixed(2) : 0
})
</script>

<template>
  <AppLayout>
    <div class="tool-page">
      <div class="tool-page__header">
        <h1>📊 线段图生成器</h1>
        <p>可视化展示倍数、和差等数量关系</p>
      </div>

      <div class="tool-page__presets">
        <h3>预设模板</h3>
        <div class="tool-page__preset-list">
          <button
            v-for="preset in presets"
            :key="preset.name"
            class="tool-page__preset-btn"
            @click="applyPreset(preset)"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>

      <div class="tool-page__controls">
        <div class="tool-page__control-group">
          <label>总数</label>
          <input
            type="number"
            :value="total"
            min="1"
            @input="updateTotal(Number(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div class="tool-page__control-group">
          <label>
            <input v-model="isInteractive" type="checkbox" />
            交互模式
          </label>
        </div>
      </div>

      <SegmentDiagram
        v-model:segments="segments"
        :total="total"
        :labels="labels"
        :interactive="isInteractive"
        :show-values="true"
      />

      <div class="tool-page__formula">
        <h3>公式推导</h3>
        <div class="tool-page__formula-content">
          <div class="tool-page__formula-step">
            <span class="step-num">1</span>
            <span>总份数 = {{ segments.join(' + ') }} = {{ segments.reduce((a, b) => a + b, 0) }}</span>
          </div>
          <div class="tool-page__formula-step">
            <span class="step-num">2</span>
            <span>1份量 = {{ total }} ÷ {{ segments.reduce((a, b) => a + b, 0) }} = {{ oneUnit }}</span>
          </div>
          <div class="tool-page__formula-result">
            <span v-for="(seg, i) in segments" :key="i">
              {{ labels[i] || `段${i+1}` }} = {{ oneUnit }} × {{ seg }} = {{ (Number(oneUnit) * seg).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <div class="tool-page__tips">
        <h3>💡 使用提示</h3>
        <ul>
          <li>点击线段图上的"+" "-"按钮可以调整各部分的大小</li>
          <li>预设模板可以帮助快速生成常见题型</li>
          <li>在"交互模式"下可以拖动调整数值</li>
          <li>右侧会实时显示计算公式</li>
        </ul>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.tool-page {
  max-width: 800px;
  margin: 0 auto;
}

.tool-page__header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.tool-page__header h1 {
  margin-bottom: var(--space-2);
}

.tool-page__header p {
  color: var(--text-secondary);
}

.tool-page__presets {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.tool-page__presets h3 {
  font-size: var(--text-base);
  margin-bottom: var(--space-3);
}

.tool-page__preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tool-page__preset-btn {
  padding: var(--space-2) var(--space-3);
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.tool-page__preset-btn:hover {
  background: var(--color-primary);
  color: white;
}

.tool-page__controls {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  align-items: center;
}

.tool-page__control-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.tool-page__control-group label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.tool-page__control-group input[type="number"] {
  width: 100px;
  padding: var(--space-2);
  text-align: center;
}

.tool-page__formula {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-top: var(--space-4);
}

.tool-page__formula h3 {
  font-size: var(--text-base);
  margin-bottom: var(--space-3);
}

.tool-page__formula-step {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.tool-page__formula-result {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding: var(--space-3);
  background: rgba(99, 102, 241, 0.1);
  border-radius: var(--radius-lg);
  margin-top: var(--space-3);
  font-weight: 600;
  color: var(--color-primary);
}

.tool-page__tips {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  margin-top: var(--space-4);
}

.tool-page__tips h3 {
  font-size: var(--text-base);
  margin-bottom: var(--space-3);
}

.tool-page__tips ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.tool-page__tips li::before {
  content: '•';
  margin-right: var(--space-2);
  color: var(--color-primary);
}
</style>
