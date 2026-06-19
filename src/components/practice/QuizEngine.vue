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

const currentExercise = computed(() => props.exercises[currentIndex.value])
const progress = computed(() => ((currentIndex.value + 1) / props.exercises.length) * 100)
const isLast = computed(() => currentIndex.value === props.exercises.length - 1)

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
}

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

    <div v-if="showFeedback" class="quiz-engine__feedback" :class="{ 'quiz-engine__feedback--correct': isCorrect }">
      <div class="quiz-engine__feedback-icon">
        {{ isCorrect ? '🎉' : '🤔' }}
      </div>
      <div class="quiz-engine__feedback-text">
        {{ isCorrect ? '回答正确！' : '再想想看...' }}
      </div>
      <div v-if="!isCorrect" class="quiz-engine__solution">
        <div class="quiz-engine__solution-label">正确答案</div>
        <div class="quiz-engine__solution-answer">{{ currentExercise.answer }}</div>
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
}

.quiz-engine__solution-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}

.quiz-engine__solution-answer {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-success);
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
