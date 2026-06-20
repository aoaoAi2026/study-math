<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Exercise } from '@/types/exercise'
import { classifyError } from '@/services/exerciseEngine'
import { useUserStore } from '@/stores/userStore'
import ChoiceQuestion from './ChoiceQuestion.vue'
import FillQuestion from './FillQuestion.vue'
import InputQuestion from './InputQuestion.vue'

const props = defineProps<{
  exercises: Exercise[]
  knowledgePoints?: string[]
}>()

const emit = defineEmits<{
  (e: 'complete', results: AnswerResult[]): void
  (e: 'wrong', exercise: Exercise, result: AnswerResult): void
}>()

export interface AnswerResult {
  exerciseId: string
  userAnswer: string
  isCorrect: boolean
  timeUsed: number
  errorLayer?: 'L1' | 'L2' | 'L3' | 'L4'
}

const userStore = useUserStore()
const currentIndex = ref(0)
const answers = ref<AnswerResult[]>([])
const startTime = ref(Date.now())
const showFeedback = ref(false)
const isCorrect = ref(false)
const hintIndex = ref(0)
const showHints = ref(false)

const currentExercise = computed(() => props.exercises[currentIndex.value])
const progress = computed(() => ((currentIndex.value + 1) / props.exercises.length) * 100)
const isLast = computed(() => currentIndex.value === props.exercises.length - 1)

const correctAnswerText = computed(() => {
  const exercise = currentExercise.value
  if (!exercise) return ''
  const answer = exercise.answer
  if (exercise.type === 'choice' && /^\d+$/.test(answer)) {
    const idx = parseInt(answer, 10)
    if (exercise.options && idx >= 0 && idx < exercise.options.length) {
      return exercise.options[idx]
    }
  }
  return answer
})

const currentHints = computed(() => {
  if (!showHints.value) return []
  return (currentExercise.value?.hints ?? []).slice(0, hintIndex.value)
})

const hasMoreHints = computed(() => {
  const total = currentExercise.value?.hints?.length ?? 0
  return hintIndex.value < total
})

function showNextHint() {
  if (hasMoreHints.value) {
    showHints.value = true
    hintIndex.value++
  }
}

function handleAnswer(result: { answer: string; isCorrect: boolean }) {
  const now = Date.now()
  const answerResult: AnswerResult = {
    exerciseId: currentExercise.value.id,
    userAnswer: result.answer,
    isCorrect: result.isCorrect,
    timeUsed: now - startTime.value
  }

  if (!result.isCorrect) {
    answerResult.errorLayer = classifyError(
      result.answer,
      currentExercise.value.answer,
      currentExercise.value.stem
    )
    emit('wrong', currentExercise.value, answerResult)
  } else {
    userStore.addExp(10)
    userStore.correctTotal++
  }

  answers.value.push(answerResult)
  isCorrect.value = result.isCorrect
  showFeedback.value = true
}

function nextQuestion() {
  showFeedback.value = false
  hintIndex.value = 0
  showHints.value = false
  if (isLast.value) {
    emit('complete', answers.value)
  } else {
    currentIndex.value++
    startTime.value = Date.now()
  }
}

function restart() {
  currentIndex.value = 0
  answers.value = []
  startTime.value = Date.now()
  showFeedback.value = false
  hintIndex.value = 0
  showHints.value = false
}

watch(currentIndex, () => {
  startTime.value = Date.now()
})

onMounted(() => {
  startTime.value = Date.now()
})
</script>

<template>
  <div class="quiz-engine">
    <div class="quiz-engine__progress">
      <div class="quiz-engine__progress-bar">
        <div class="quiz-engine__progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="quiz-engine__progress-text">
        {{ currentIndex + 1 }} / {{ exercises.length }}
      </div>
    </div>

    <div class="quiz-engine__question">
      <div class="quiz-engine__meta">
        <span class="quiz-engine__diff" :class="`quiz-engine__diff--${currentExercise.difficulty}`">
          {{ '★'.repeat(currentExercise.difficulty) }}
        </span>
        <span class="quiz-engine__time">
          ⏱️ {{ Math.round((Date.now() - startTime) / 1000) }}s
        </span>
      </div>

      <div class="quiz-engine__stem" v-html="currentExercise.stem"></div>

      <div v-if="!showFeedback && currentExercise.hints && currentExercise.hints.length > 0" class="quiz-engine__hints">
        <div v-for="(hint, idx) in currentHints" :key="idx" class="quiz-engine__hint-item">
          <span class="quiz-engine__hint-bulb">💡</span>
          <span class="quiz-engine__hint-text">{{ hint }}</span>
        </div>
        <button v-if="hasMoreHints" class="quiz-engine__hint-btn" @click="showNextHint">
          需要提示 ({{ hintIndex }}/{{ currentExercise.hints.length }})
        </button>
      </div>

      <ChoiceQuestion
        v-if="currentExercise.type === 'choice'"
        :options="currentExercise.options!"
        :answer="currentExercise.answer"
        :show-feedback="showFeedback"
        @answer="handleAnswer"
      />

      <FillQuestion
        v-else-if="currentExercise.type === 'fill'"
        :answer="currentExercise.answer"
        :show-feedback="showFeedback"
        @answer="handleAnswer"
      />

      <InputQuestion
        v-else-if="currentExercise.type === 'input'"
        :answer="currentExercise.answer"
        :show-feedback="showFeedback"
        @answer="handleAnswer"
      />
    </div>

    <div v-if="showFeedback" class="quiz-engine__feedback" :class="{ 'quiz-engine__feedback--correct': isCorrect, 'quiz-engine__feedback--wrong': !isCorrect }">
      <div class="quiz-engine__feedback-icon">
        {{ isCorrect ? '🎉' : '🤔' }}
      </div>
      <div class="quiz-engine__feedback-text">
        {{ isCorrect ? '回答正确！' : '再想想看...' }}
      </div>

      <div v-if="!isCorrect" class="quiz-engine__solution">
        <div class="quiz-engine__solution-label">正确答案</div>
        <div class="quiz-engine__solution-answer">{{ correctAnswerText }}</div>
      </div>

      <div v-if="currentExercise.solution && currentExercise.solution.length > 0" class="quiz-engine__solution-steps">
        <div class="quiz-engine__solution-steps-title">解题步骤</div>
        <div
          v-for="(step, idx) in currentExercise.solution"
          :key="idx"
          class="quiz-engine__solution-step"
        >
          <span class="quiz-engine__solution-step-num">{{ idx + 1 }}</span>
          <div class="quiz-engine__solution-step-body">
            <div class="quiz-engine__solution-step-desc">{{ step.description }}</div>
            <div v-if="step.expression" class="quiz-engine__solution-step-expr">{{ step.expression }}</div>
            <div v-if="step.why" class="quiz-engine__solution-step-why">💡 {{ step.why }}</div>
          </div>
        </div>
      </div>

      <div v-if="!isCorrect && currentExercise.commonMistakes && currentExercise.commonMistakes.length > 0" class="quiz-engine__mistakes">
        <div class="quiz-engine__mistakes-title">常见误区</div>
        <div
          v-for="(mistake, idx) in currentExercise.commonMistakes"
          :key="idx"
          class="quiz-engine__mistake-item"
        >
          <div class="quiz-engine__mistake-header">
            <span class="quiz-engine__mistake-layer">{{ mistake.errorLayer }}</span>
            <span class="quiz-engine__mistake-mistake">⚠️ {{ mistake.mistake }}</span>
          </div>
          <div class="quiz-engine__mistake-row">
            <span class="quiz-engine__mistake-label">错误原因：</span>
            <span class="quiz-engine__mistake-value">{{ mistake.reason }}</span>
          </div>
          <div class="quiz-engine__mistake-row">
            <span class="quiz-engine__mistake-label">纠正方法：</span>
            <span class="quiz-engine__mistake-value">{{ mistake.correction }}</span>
          </div>
        </div>
      </div>

      <button class="quiz-engine__next-btn" @click="nextQuestion">
        {{ isLast ? '查看结果' : '下一题' }} →
      </button>
    </div>

    <div class="quiz-engine__actions">
      <button class="quiz-engine__action" @click="restart">
        🔄 重新开始
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-engine {
  max-width: 600px;
  margin: 0 auto;
}

.quiz-engine__progress {
  margin-bottom: var(--space-6);
}

.quiz-engine__progress-bar {
  height: 8px;
  background: var(--bg-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.quiz-engine__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.quiz-engine__progress-text {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.quiz-engine__question {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
  box-shadow: var(--shadow-md);
}

.quiz-engine__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.quiz-engine__diff {
  color: var(--color-warning);
}

.quiz-engine__time {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.quiz-engine__stem {
  font-size: var(--text-lg);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);
}

.quiz-engine__hints {
  margin-bottom: var(--space-4);
}

.quiz-engine__hint-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  background: var(--bg-hover);
  border-left: 3px solid var(--color-primary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
}

.quiz-engine__hint-bulb {
  font-size: var(--text-base);
  flex-shrink: 0;
}

.quiz-engine__hint-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
}

.quiz-engine__hint-btn {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  background: transparent;
  border: 1px dashed var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}

.quiz-engine__hint-btn:hover {
  background: rgba(0, 0, 0, 0.02);
}

.quiz-engine__feedback {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  text-align: center;
  border: 2px solid var(--color-warning);
  margin-bottom: var(--space-4);
}

.quiz-engine__feedback--correct {
  border-color: var(--color-success);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent);
}

.quiz-engine__feedback--wrong {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent);
}

.quiz-engine__feedback-icon {
  font-size: 48px;
  margin-bottom: var(--space-3);
}

.quiz-engine__feedback-text {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.quiz-engine__solution {
  background: var(--bg-hover);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  text-align: left;
}

.quiz-engine__solution-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quiz-engine__solution-answer {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-success);
}

.quiz-engine__solution-steps {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  text-align: left;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.quiz-engine__solution-steps-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.quiz-engine__solution-step {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-top: 1px solid var(--bg-hover);
}

.quiz-engine__solution-step:first-of-type {
  border-top: none;
  padding-top: 0;
}

.quiz-engine__solution-step-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 600;
}

.quiz-engine__solution-step-body {
  flex: 1;
  min-width: 0;
}

.quiz-engine__solution-step-desc {
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: var(--leading-normal);
  margin-bottom: var(--space-2);
}

.quiz-engine__solution-step-expr {
  font-family: 'Courier New', monospace;
  font-size: var(--text-sm);
  color: var(--color-primary);
  background: var(--bg-hover);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  display: inline-block;
}

.quiz-engine__solution-step-why {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  line-height: var(--leading-normal);
}

.quiz-engine__mistakes {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  text-align: left;
}

.quiz-engine__mistakes-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-warning);
  margin-bottom: var(--space-3);
}

.quiz-engine__mistake-item {
  background: #ffffff;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-2);
}

.quiz-engine__mistake-item:last-child {
  margin-bottom: 0;
}

.quiz-engine__mistake-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.quiz-engine__mistake-layer {
  display: inline-block;
  background: var(--color-warning);
  color: white;
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.quiz-engine__mistake-mistake {
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: 500;
}

.quiz-engine__mistake-row {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  margin-top: var(--space-1);
}

.quiz-engine__mistake-label {
  color: var(--text-tertiary);
}

.quiz-engine__mistake-value {
  color: var(--text-primary);
}

.quiz-engine__next-btn {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: var(--text-base);
}

.quiz-engine__actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
}

.quiz-engine__action {
  padding: var(--space-2) var(--space-4);
  background: var(--bg-hover);
  color: var(--text-secondary);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
}
</style>
