import { ref, onMounted, onUnmounted } from 'vue'
import type { Exercise, AnswerResult } from '@/types/exercise'
import { classifyError } from '@/services/exerciseEngine'
import { useUserStore } from '@/stores/userStore'

export interface UseExerciseOptions {
  knowledgePoints?: string[]
  count?: number
  difficulty?: number
}

export function useExercise(options: UseExerciseOptions = {}) {
  const userStore = useUserStore()
  const exercises = ref<Exercise[]>([])
  const currentIndex = ref(0)
  const answers = ref<AnswerResult[]>([])
  const isLoading = ref(false)
  const isComplete = ref(false)
  const startTime = ref(Date.now())

  const currentExercise = () => exercises.value[currentIndex.value]
  const progress = () => exercises.value.length > 0
    ? ((currentIndex.value + 1) / exercises.value.length) * 100
    : 0
  const isLast = () => currentIndex.value === exercises.value.length - 1
  const isFirst = () => currentIndex.value === 0

  async function loadExercises() {
    isLoading.value = true
    try {
      const stored = localStorage.getItem('exercises')
      if (stored) {
        exercises.value = JSON.parse(stored)
      }
    } finally {
      isLoading.value = false
    }
  }

  function answer(answerStr: string, isCorrect: boolean) {
    const exercise = currentExercise()
    if (!exercise) return

    const result: AnswerResult = {
      exerciseId: exercise.id,
      userAnswer: answerStr,
      isCorrect,
      timeUsed: Date.now() - startTime.value
    }

    if (!isCorrect) {
      result.errorLayer = classifyError(answerStr, exercise.answer, exercise.stem)
      // addWrong is not implemented in userStore, skip for now
    } else {
      userStore.addExp(10)
      userStore.correctTotal++
    }

    answers.value.push(result)
  }

  function next() {
    if (isLast()) {
      isComplete.value = true
    } else {
      currentIndex.value++
      startTime.value = Date.now()
    }
  }

  function prev() {
    if (!isFirst()) {
      currentIndex.value--
    }
  }

  function reset() {
    currentIndex.value = 0
    answers.value = []
    isComplete.value = false
    startTime.value = Date.now()
  }

  function getResults() {
    const correct = answers.value.filter((a: AnswerResult) => a.isCorrect).length
    const total = answers.value.length
    return {
      correct,
      total,
      accuracy: total > 0 ? correct / total : 0,
      answers: answers.value
    }
  }

  onMounted(() => {
    loadExercises()
  })

  return {
    exercises,
    currentIndex,
    answers,
    isLoading,
    isComplete,
    currentExercise,
    progress,
    isLast,
    isFirst,
    loadExercises,
    answer,
    next,
    prev,
    reset,
    getResults
  }
}
