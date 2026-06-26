<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadQuestionBank } from '@/services/questionBankLoader'
import QuizEngine, { type AnswerResult } from '@/components/practice/QuizEngine.vue'
import type { Exercise } from '@/types/exercise'

const route = useRoute()
const router = useRouter()

const topicId = computed(() => String(route.params.topicId || ''))
const exercises = ref<Exercise[]>([])
const isComplete = ref(false)
const results = ref<AnswerResult[]>([])
const engineKey = ref(0)
const topicName = ref('题目练习')
const loading = ref(false)

async function loadExercises() {
  if (!topicId.value) return
  loading.value = true
  try {
    const bank = await loadQuestionBank(topicId.value, true)
    if (bank && bank.exercises.length > 0) {
      topicName.value = bank.title || topicId.value
      exercises.value = bank.exercises.slice(0, Math.min(8, bank.exercises.length))
      isComplete.value = false
      results.value = []
    } else {
      exercises.value = []
    }
  } catch (e) {
    console.error('加载题库失败:', e)
    exercises.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadExercises)
watch(topicId, loadExercises)

function handleComplete(rs: AnswerResult[]) {
  results.value = rs
  isComplete.value = true
}

const correctCount = computed(() => results.value.filter(r => r.isCorrect).length)
const totalCount = computed(() => results.value.length || exercises.value.length)
const accuracy = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((correctCount.value / totalCount.value) * 100)
})
const circleColor = computed(() => {
  if (accuracy.value >= 80) return '#10b981'
  if (accuracy.value >= 50) return '#f59e0b'
  return '#ef4444'
})
const masteryLevel = computed(() => {
  if (accuracy.value >= 80) return '优秀'
  if (accuracy.value >= 50) return '良好'
  return '需加油'
})
const circleOffset = computed(() => 283 - (283 * accuracy.value) / 100)

async function handleRestart() {
  engineKey.value++
  await loadExercises()
}

function handleBack() {
  router.back()
}

function getExerciseById(id: string): Exercise | undefined {
  return exercises.value.find(e => e.id === id)
}

function getOptionLabel(ex: Exercise, answer: string): string {
  if (ex.type !== 'choice' || !ex.options) return answer
  const idx = Number(answer)
  if (!Number.isNaN(idx) && idx >= 0 && idx < ex.options.length) return ex.options[idx]
  return answer
}
</script>

<template>
  <div class="quiz-page">
    <header class="quiz-page__header">
      <button class="quiz-page__back" @click="handleBack">← 返回</button>
      <h1 class="quiz-page__title">知识点练习 - {{ topicName }}</h1>
    </header>

    <div v-if="exercises.length === 0" class="quiz-page__empty">
      <div class="quiz-page__empty-icon">📚</div>
      <div class="quiz-page__empty-title">暂未找到相关题目</div>
      <div class="quiz-page__empty-desc">该知识点（{{ topicId }}）暂无练习资源，请稍后再试。</div>
      <button class="quiz-page__empty-btn" @click="handleBack">返回专题</button>
    </div>

    <template v-else>
      <QuizEngine
        v-if="!isComplete"
        :key="engineKey"
        :exercises="exercises"
        :knowledge-points="[topicId]"
        @complete="handleComplete"
      />

      <div v-else class="quiz-page__result">
        <div class="quiz-page__result-summary">
          <div class="quiz-page__circle-wrap">
            <svg class="quiz-page__circle" viewBox="0 0 100 100">
              <circle class="quiz-page__circle-bg" cx="50" cy="50" r="45" />
              <circle
                class="quiz-page__circle-fg"
                cx="50"
                cy="50"
                r="45"
                :stroke="circleColor"
                :stroke-dasharray="283"
                :stroke-dashoffset="circleOffset"
              />
            </svg>
            <div class="quiz-page__circle-text">
              <div class="quiz-page__circle-percent" :style="{ color: circleColor }">
                {{ accuracy }}%
              </div>
              <div class="quiz-page__circle-label">{{ correctCount }} / {{ totalCount }}</div>
            </div>
          </div>

          <div class="quiz-page__mastery">
            <div class="quiz-page__mastery-label">掌握等级</div>
            <div class="quiz-page__mastery-value" :style="{ color: circleColor }">
              {{ masteryLevel }}
            </div>
          </div>
        </div>

        <div class="quiz-page__review">
          <h2 class="quiz-page__review-title">📝 题目回顾</h2>
          <div
            v-for="(r, idx) in results"
            :key="r.exerciseId"
            class="quiz-page__review-item"
            :class="{ 'quiz-page__review-item--correct': r.isCorrect }"
          >
            <div class="quiz-page__review-head">
              <span class="quiz-page__review-no">第 {{ idx + 1 }} 题</span>
              <span class="quiz-page__review-status" :class="{ 'quiz-page__review-status--correct': r.isCorrect }">
                {{ r.isCorrect ? '✅ 答对' : '❌ 答错' }}
              </span>
            </div>
            <div class="quiz-page__review-stem" v-html="getExerciseById(r.exerciseId)?.stem || ''"></div>
            <div class="quiz-page__review-answers">
              <div class="quiz-page__review-row">
                <span class="quiz-page__review-key">你的答案：</span>
                <span class="quiz-page__review-value">{{ getOptionLabel(getExerciseById(r.exerciseId)!, r.userAnswer) || '未作答' }}</span>
              </div>
              <div class="quiz-page__review-row">
                <span class="quiz-page__review-key">正确答案：</span>
                <span class="quiz-page__review-value quiz-page__review-value--correct">
                  {{ getOptionLabel(getExerciseById(r.exerciseId)!, getExerciseById(r.exerciseId)?.answer || '') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="quiz-page__result-actions">
          <button class="quiz-page__btn quiz-page__btn--secondary" @click="handleRestart">
            🔄 再做一次
          </button>
          <button class="quiz-page__btn quiz-page__btn--primary" @click="handleBack">
            ← 返回专题
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.quiz-page {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-4) var(--space-6);
}

.quiz-page__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.quiz-page__back {
  padding: var(--space-2) var(--space-3);
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all 0.2s;
}

.quiz-page__back:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.quiz-page__title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.quiz-page__empty {
  text-align: center;
  padding: var(--space-10) var(--space-4);
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.quiz-page__empty-icon {
  font-size: 64px;
  margin-bottom: var(--space-4);
}

.quiz-page__empty-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.quiz-page__empty-desc {
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.quiz-page__empty-btn {
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
}

.quiz-page__result {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-6);
  box-shadow: var(--shadow-md);
}

.quiz-page__result-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--bg-hover);
  flex-wrap: wrap;
}

.quiz-page__circle-wrap {
  position: relative;
  width: 180px;
  height: 180px;
}

.quiz-page__circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.quiz-page__circle-bg {
  fill: none;
  stroke: var(--bg-hover);
  stroke-width: 8;
}

.quiz-page__circle-fg {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s ease;
}

.quiz-page__circle-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quiz-page__circle-percent {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.quiz-page__circle-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-2);
}

.quiz-page__mastery {
  text-align: center;
}

.quiz-page__mastery-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.quiz-page__mastery-value {
  font-size: var(--text-3xl);
  font-weight: 700;
}

.quiz-page__review-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-4);
}

.quiz-page__review-item {
  background: var(--bg-hover);
  border-left: 4px solid var(--color-warning);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
}

.quiz-page__review-item--correct {
  border-left-color: var(--color-success);
}

.quiz-page__review-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.quiz-page__review-no {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.quiz-page__review-status {
  font-size: var(--text-sm);
  color: var(--color-warning);
}

.quiz-page__review-status--correct {
  color: var(--color-success);
}

.quiz-page__review-stem {
  font-size: var(--text-base);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  line-height: var(--leading-relaxed);
}

.quiz-page__review-answers {
  font-size: var(--text-sm);
}

.quiz-page__review-row {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.quiz-page__review-key {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.quiz-page__review-value {
  color: var(--text-primary);
  font-weight: 500;
}

.quiz-page__review-value--correct {
  color: var(--color-success);
  font-weight: 600;
}

.quiz-page__result-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  margin-top: var(--space-6);
  flex-wrap: wrap;
}

.quiz-page__btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-base);
}

.quiz-page__btn--primary {
  background: var(--color-primary);
  color: white;
}

.quiz-page__btn--secondary {
  background: var(--bg-hover);
  color: var(--text-secondary);
}
</style>
