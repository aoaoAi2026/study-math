<script setup lang="ts">
import { ref } from 'vue'
import type { SolutionStep } from '@/types/exercise'

const props = defineProps<{
  title?: string
  stem: string
  steps: SolutionStep[]
  formula?: string
}>()

const currentStep = ref(0)
const showAll = ref(false)

function next() {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++
  }
}
function prev() {
  if (currentStep.value > 0) currentStep.value--
}
function revealAll() { showAll.value = true }
</script>

<template>
  <div class="card-example">
    <div class="card-example__header">
      <div class="card-example__icon-wrap">
        <span class="card-example__icon">📝</span>
      </div>
      <div class="card-example__title-wrap">
        <span class="card-example__label">例题</span>
        <h2 class="card-example__title" v-if="title">{{ title }}</h2>
      </div>
    </div>

    <div class="card-example__stem">
      <span class="card-example__stem-badge">题目</span>
      <p class="card-example__stem-text" v-html="stem"></p>
    </div>

    <div class="card-example__steps">
      <div class="card-example__steps-header">
        <span class="card-example__steps-title">解题步骤</span>
        <button
          v-if="!showAll && steps.length > 1 && currentStep < steps.length - 1"
          class="card-example__reveal"
          @click="revealAll"
        >一键展开</button>
      </div>
      <div
        v-for="(step, idx) in steps"
        :key="idx"
        class="card-example__step"
        :class="{
          'card-example__step--active': idx === currentStep,
          'card-example__step--hidden': !showAll && idx > currentStep
        }"
      >
        <div class="card-example__step-num">{{ idx + 1 }}</div>
        <div class="card-example__step-content">
          <p class="card-example__step-desc" v-html="step.description"></p>
          <div v-if="step.expression" class="card-example__step-expr" v-html="step.expression"></div>
          <div v-if="step.why" class="card-example__step-why">
            <span class="card-example__step-why-label">💭 思考：</span>
            <span>{{ step.why }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-example__controls" v-if="steps.length > 1 && !showAll">
      <button class="card-example__btn card-example__btn--ghost" @click="prev" :disabled="currentStep === 0">
        ← 上一步
      </button>
      <span class="card-example__progress">{{ currentStep + 1 }} / {{ steps.length }}</span>
      <button class="card-example__btn card-example__btn--primary" @click="next" :disabled="currentStep >= steps.length - 1">
        下一步 →
      </button>
    </div>

    <div v-if="formula" class="card-example__formula">
      <div class="card-example__formula-label">🧮 核心公式</div>
      <div class="card-example__formula-content" v-html="formula"></div>
    </div>
  </div>
</template>

<style scoped>
.card-example {
  background: var(--bg-card);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.card-example__header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px 32px 20px;
  background: linear-gradient(135deg, var(--card-green-bg) 0%, rgba(187, 247, 208, 0.8) 50%, var(--card-green-bg) 100%);
  border-bottom: 1px solid rgba(16, 185, 129, 0.15);
}

.card-example__icon-wrap {
  width: 60px;
  height: 60px;
  background: var(--bg-card);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  flex-shrink: 0;
}

.card-example__icon { font-size: 28px; }
.card-example__title-wrap { flex: 1; min-width: 0; }

.card-example__label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-success);
  background: rgba(21, 128, 61, 0.12);
  padding: 4px 10px;
  border-radius: 8px;
  margin-bottom: 6px;
}

.card-example__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.card-example__stem {
  padding: 24px 32px;
  background: var(--bg-hover);
  border-bottom: 1px solid var(--border-color);
}

.card-example__stem-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-sm);
}

.card-example__stem-text {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.7;
  margin: 0;
}

.card-example__stem-text :deep(strong) { color: var(--color-success); font-weight: 700; }

.card-example__steps {
  padding: 20px 32px 12px;
}

.card-example__steps-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-example__steps-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-example__reveal {
  background: none;
  border: none;
  color: var(--color-success);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}
.card-example__reveal:hover { background: rgba(16, 185, 129, 0.08); }

.card-example__step {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 18px;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  margin-bottom: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-example__step--active {
  border-color: var(--color-success);
  background: rgba(16, 185, 129, 0.06);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
}

.card-example__step--hidden {
  opacity: 0.5;
  background: var(--bg-hover);
}

.card-example__step-num {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-success) 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.card-example__step--hidden .card-example__step-num {
  background: var(--border-color-strong);
  box-shadow: none;
}

.card-example__step-content {
  flex: 1;
  min-width: 0;
}

.card-example__step-desc {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.7;
  margin: 0 0 10px;
  font-weight: 500;
}

.card-example__step-desc :deep(strong) { color: var(--color-success); font-weight: 700; }

.card-example__step-expr {
  background: var(--bg-hover);
  padding: 12px 16px;
  border-radius: 12px;
  font-family: monospace;
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 10px;
  font-weight: 600;
  border-left: 3px solid var(--color-success);
}

.card-example__step-why {
  font-size: 14px;
  color: var(--text-secondary);
  font-style: italic;
  padding: 10px 12px;
  background: var(--color-primary-soft);
  border-radius: 10px;
  line-height: 1.6;
}

.card-example__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 8px 32px 24px;
}

.card-example__progress {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-hover);
  padding: 6px 14px;
  border-radius: 10px;
}

.card-example__btn {
  padding: 10px 20px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  font-family: inherit;
}

.card-example__btn--primary {
  background: linear-gradient(135deg, var(--color-success) 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
.card-example__btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}
.card-example__btn--primary:disabled {
  background: var(--border-color-strong);
  box-shadow: none;
  cursor: not-allowed;
}

.card-example__btn--ghost {
  background: var(--bg-card);
  color: var(--text-secondary);
  border-color: var(--border-color);
}
.card-example__btn--ghost:hover:not(:disabled) {
  border-color: var(--text-muted);
  background: var(--bg-hover);
}
.card-example__btn--ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-example__formula {
  margin: 4px 32px 28px;
  padding: 20px;
  background: linear-gradient(135deg, var(--card-yellow-bg) 0%, rgba(253, 227, 138, 0.8) 100%);
  border-radius: 18px;
  border-left: 5px solid var(--color-warning);
}

.card-example__formula-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--card-yellow-text);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-example__formula-content {
  font-size: 17px;
  color: var(--card-yellow-text);
  font-weight: 700;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .card-example__header { padding: 22px 22px 16px; }
  .card-example__stem { padding: 20px 22px; }
  .card-example__steps { padding: 16px 22px 8px; }
  .card-example__controls { padding: 8px 22px 20px; }
  .card-example__formula { margin: 4px 22px 22px; }
  .card-example__icon-wrap { width: 52px; height: 52px; }
  .card-example__title { font-size: 18px; }
}
</style>
