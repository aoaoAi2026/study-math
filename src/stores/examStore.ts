import { defineStore } from 'pinia'
import { ref } from 'vue'
import { localDb } from '@/services/localDb'

interface ExamResult {
  examId: string
  title: string
  score: number
  totalScore: number
  correctCount: number
  totalQuestions: number
  timeUsed: number
  completedAt: string
}

export const useExamStore = defineStore('exam', () => {
  const results = ref<ExamResult[]>([])
  const lastResult = ref<ExamResult | null>(null)
  const inited = ref(false)

  async function init() {
    if (inited.value) return
    try {
      const saved = await localDb.getSettings('exam', null)
      if (saved && Array.isArray(saved.results)) {
        results.value = saved.results
      }
    } catch { /* ignore */ }
    inited.value = true
  }

  async function saveResult(result: Omit<ExamResult, 'completedAt'>) {
    const fullResult: ExamResult = {
      ...result,
      completedAt: new Date().toISOString()
    }
    results.value.unshift(fullResult)
    lastResult.value = fullResult
    await localDb.setSettings('exam', { results: results.value })
  }

  function getHistory() {
    return results.value
  }

  return { results, lastResult, init, saveResult, getHistory }
})
