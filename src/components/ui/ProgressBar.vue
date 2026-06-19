<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
}>()

const percentage = computed(() => {
  const max = props.max || 100
  return Math.min(100, Math.max(0, (props.value / max) * 100))
})

const sizeClass = computed(() => `progress-bar--${props.size || 'md'}`)
</script>

<template>
  <div class="progress-bar" :class="sizeClass">
    <div class="progress-bar__track">
      <div
        class="progress-bar__fill"
        :style="{
          width: percentage + '%',
          backgroundColor: color
        }"
      ></div>
    </div>
    <span v-if="showLabel" class="progress-bar__label">
      {{ Math.round(percentage) }}%
    </span>
  </div>
</template>

<style scoped>
.progress-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.progress-bar__track {
  flex: 1;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar--sm .progress-bar__track { height: 4px; }
.progress-bar--md .progress-bar__track { height: 8px; }
.progress-bar--lg .progress-bar__track { height: 12px; }

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.progress-bar__label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}
</style>
