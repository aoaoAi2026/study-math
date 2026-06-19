<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  segments?: number[]
  total?: number
  labels?: string[]
  colors?: string[]
  showValues?: boolean
  interactive?: boolean
}>(), {
  segments: () => [1, 2],
  total: 0,
  labels: () => [],
  colors: () => [],
  showValues: true,
  interactive: false
})

const emit = defineEmits<{
  (e: 'segmentClick', index: number): void
  (e: 'update:segments', segments: number[]): void
}>()

const colors = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'
]

const segmentColors = computed(() => {
  if (props.colors.length > 0) return props.colors
  return props.segments.map((_, i) => colors[i % colors.length])
})

const totalSegments = computed(() => {
  return props.segments.reduce((sum, s) => sum + s, 0)
})

const segmentPercentages = computed(() => {
  const total = totalSegments.value
  if (total === 0) return []
  return props.segments.map(s => (s / total) * 100)
})

const unitWidth = computed(() => {
  return 100 / totalSegments.value
})

const showAnimation = ref(true)

watch(() => props.segments, () => {
  showAnimation.value = false
  setTimeout(() => {
    showAnimation.value = true
  }, 50)
}, { deep: true })

function handleSegmentClick(index: number) {
  if (props.interactive) {
    emit('segmentClick', index)
  }
}

function incrementSegment(index: number) {
  if (!props.interactive) return
  const newSegments = [...props.segments]
  newSegments[index]++
  emit('update:segments', newSegments)
}

function decrementSegment(index: number) {
  if (!props.interactive || props.segments[index] <= 0) return
  const newSegments = [...props.segments]
  newSegments[index]--
  emit('update:segments', newSegments)
}
</script>

<template>
  <div class="segment-diagram">
    <div class="segment-diagram__container">
      <div class="segment-diagram__axis">
        <div class="segment-diagram__axis-start">0</div>
        <div v-if="total > 0" class="segment-diagram__axis-end">{{ total }}</div>
      </div>

      <div class="segment-diagram__segments">
        <div
          v-for="(segment, index) in segments"
          :key="index"
          class="segment-diagram__segment"
          :class="{ 'segment-diagram__segment--interactive': interactive }"
          :style="{
            width: (segment * unitWidth) + '%',
            backgroundColor: segmentColors[index],
            animationDelay: showAnimation ? `${index * 0.1}s` : '0s'
          }"
          @click="handleSegmentClick(index)"
        >
          <div class="segment-diagram__segment-content">
            <span v-if="showValues" class="segment-diagram__segment-value">
              {{ segment }}
            </span>
            <span
              v-if="labels[index]"
              class="segment-diagram__segment-label"
            >
              {{ labels[index] }}
            </span>
          </div>
        </div>
      </div>

      <div class="segment-diagram__axis segment-diagram__axis--bottom">
        <div class="segment-diagram__tick" :style="{ left: '0' }"></div>
        <template v-for="(segment, index) in segments" :key="index">
          <div
            v-if="segment > 0"
            class="segment-diagram__tick"
            :style="{ left: `calc(${segmentPercentages.slice(0, index + 1).reduce((a, b) => a + b, 0)}%)` }"
          ></div>
        </template>
      </div>
    </div>

    <div v-if="interactive" class="segment-diagram__controls">
      <div
        v-for="(segment, index) in segments"
        :key="'ctrl-' + index"
        class="segment-diagram__control"
      >
        <span
          class="segment-diagram__control-color"
          :style="{ backgroundColor: segmentColors[index] }"
        ></span>
        <span class="segment-diagram__control-label">
          {{ labels[index] || `段${index + 1}` }}
        </span>
        <button
          class="segment-diagram__control-btn"
          @click="decrementSegment(index)"
        >
          −
        </button>
        <span class="segment-diagram__control-value">{{ segment }}</span>
        <button
          class="segment-diagram__control-btn"
          @click="incrementSegment(index)"
        >
          +
        </button>
      </div>
    </div>

    <div class="segment-diagram__legend">
      <div
        v-for="(segment, index) in segments"
        :key="'legend-' + index"
        class="segment-diagram__legend-item"
      >
        <span
          class="segment-diagram__legend-color"
          :style="{ backgroundColor: segmentColors[index] }"
        ></span>
        <span class="segment-diagram__legend-label">
          {{ labels[index] || `段${index + 1}` }}
        </span>
        <span class="segment-diagram__legend-value">
          = {{ segment }} (≈{{ segmentPercentages[index].toFixed(1) }}%)
        </span>
      </div>
      <div class="segment-diagram__legend-item segment-diagram__legend-item--total">
        <span class="segment-diagram__legend-label">总计</span>
        <span class="segment-diagram__legend-value">{{ totalSegments }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.segment-diagram {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
}

.segment-diagram__container {
  position: relative;
  margin-bottom: var(--space-4);
}

.segment-diagram__axis {
  display: flex;
  justify-content: space-between;
  padding: 0 var(--space-2);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.segment-diagram__axis--bottom {
  margin-bottom: 0;
  margin-top: var(--space-2);
  position: relative;
  height: 8px;
}

.segment-diagram__segments {
  display: flex;
  height: 60px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.segment-diagram__segment {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  transition: all var(--transition-fast);
  position: relative;
}

.segment-diagram__segment--interactive {
  cursor: pointer;
}

.segment-diagram__segment--interactive:hover {
  filter: brightness(1.1);
  transform: scaleY(1.05);
}

.segment-diagram__segment-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.segment-diagram__segment-value {
  font-size: var(--text-lg);
  font-weight: 700;
}

.segment-diagram__segment-label {
  font-size: var(--text-xs);
  opacity: 0.9;
}

.segment-diagram__tick {
  position: absolute;
  top: -8px;
  width: 2px;
  height: 8px;
  background: var(--text-tertiary);
}

.segment-diagram__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
}

.segment-diagram__control {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
}

.segment-diagram__control-color {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
}

.segment-diagram__control-label {
  font-size: var(--text-sm);
  color: var(--text-primary);
  min-width: 40px;
}

.segment-diagram__control-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: white;
  font-size: var(--text-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.segment-diagram__control-btn:hover {
  background: var(--color-primary-dark);
  transform: scale(1.1);
}

.segment-diagram__control-value {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
}

.segment-diagram__legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.segment-diagram__legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.segment-diagram__legend-item--total {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px dashed var(--border-color);
  font-weight: 600;
}

.segment-diagram__legend-color {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-sm);
}

.segment-diagram__legend-label {
  color: var(--text-primary);
}

.segment-diagram__legend-value {
  color: var(--text-secondary);
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
    transform-origin: left;
  }
}

.segment-diagram__segment {
  animation: slideIn 0.5s ease-out forwards;
}
</style>
