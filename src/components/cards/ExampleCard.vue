<script setup lang="ts">
import { ref } from 'vue'
import type { SolutionStep } from '@/types/exercise'

defineProps<{
  title?: string
  stem: string
  steps: SolutionStep[]
  formula?: string
}>()

const currentStep = ref(0)
const completedSteps = ref<number[]>([])

function nextStep() {
  if (!completedSteps.value.includes(currentStep.value)) {
    completedSteps.value.push(currentStep.value)
  }
  currentStep.value++
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>

<template>
  <div class="example-card">
    <div class="example-card__header">
      <span class="example-card__icon">📝</span>
      <h3 v-if="title" class="example-card__title">{{ title }}</h3>
    </div>

    <div class="example-card__stem">
      <div class="example-card__stem-label">题目</div>
      <p class="example-card__stem-text" v-html="stem"></p>
    </div>

    <div class="example-card__steps">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="example-card__step"
        :class="{
          'example-card__step--active': index === currentStep,
          'example-card__step--completed': completedSteps.includes(index)
        }"
      >
        <div class="example-card__step-num">{{ index + 1 }}</div>
        <div class="example-card__step-content">
          <p class="example-card__step-desc">{{ step.description }}</p>
          <div v-if="step.expression" class="example-card__step-expr" v-html="step.expression"></div>
          <div v-if="step.why" class="example-card__step-why">
            <span>💭</span> {{ step.why }}
          </div>
        </div>
      </div>
    </div>

    <div class="example-card__controls">
      <button
        class="example-card__btn example-card__btn--secondary"
        :disabled="currentStep === 0"
        @click="prevStep"
      >
        ← 上一步
      </button>
      <button
        v-if="currentStep < steps.length"
        class="example-card__btn example-card__btn--primary"
        @click="nextStep"
      >
        下一步 →
      </button>
      <button
        v-else
        class="example-card__btn example-card__btn--success"
        @click="$emit('complete')"
      >
        我学会了 ✓
      </button>
    </div>

    <div v-if="formula" class="example-card__formula">
      <div class="example-card__formula-label">核心公式</div>
      <div class="example-card__formula-content" v-html="formula"></div>
    </div>

    <slot name="expand-thinking"></slot>
  </div>
</template>

<style scoped>
.example-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 2px solid var(--color-primary);
}

.example-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.example-card__icon {
  font-size: var(--text-2xl);
}

.example-card__title {
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin: 0;
}

.example-card__stem {
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.example-card__stem-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.example-card__stem-text {
  color: var(--text-primary);
  font-weight: 500;
  margin: 0;
}

.example-card__steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.example-card__step {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.example-card__step--active {
  background: rgba(99, 102, 241, 0.1);
  border: 2px solid var(--color-primary);
}

.example-card__step--completed {
  background: rgba(16, 185, 129, 0.1);
}

.example-card__step-num {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.example-card__step--completed .example-card__step-num {
  background: var(--color-success);
}

.example-card__step-content {
  flex: 1;
}

.example-card__step-desc {
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
}

.example-card__step-expr {
  background: var(--bg-page);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  margin-bottom: var(--space-2);
}

.example-card__step-why {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-style: italic;
}

.example-card__controls {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.example-card__btn {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.example-card__btn--primary {
  background: var(--color-primary);
  color: white;
}

.example-card__btn--secondary {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.example-card__btn--success {
  background: var(--color-success);
  color: white;
}

.example-card__btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.example-card__formula {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05));
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-primary);
}

.example-card__formula-label {
  font-size: var(--text-xs);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.example-card__formula-content {
  font-size: var(--text-lg);
  color: var(--color-primary-dark);
  font-weight: 600;
  text-align: center;
}
</style>
