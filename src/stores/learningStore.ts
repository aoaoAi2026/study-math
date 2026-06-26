import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TopicIndex } from '@/types/content'
import { localDb } from '@/services/localDb'

export const useLearningStore = defineStore('learning', () => {
  const currentTopicId = ref<string | null>(null)
  const learningHistory = ref<string[]>([])
  const completedTopics = ref<string[]>([])
  const favoriteTopics = ref<string[]>([])
  const currentStep = ref(0)
  const inited = ref(false)

  const isLearning = computed(() => currentTopicId.value !== null)

  async function init() {
    if (inited.value) return
    try {
      const saved = await localDb.getSettings('learning', null)
      if (saved) {
        if (Array.isArray(saved.learningHistory)) learningHistory.value = saved.learningHistory
        if (Array.isArray(saved.completedTopics)) completedTopics.value = saved.completedTopics
        if (Array.isArray(saved.favoriteTopics)) favoriteTopics.value = saved.favoriteTopics
      }
    } catch { /* ignore */ }
    inited.value = true
  }

  async function save() {
    await localDb.setSettings('learning', {
      learningHistory: learningHistory.value,
      completedTopics: completedTopics.value,
      favoriteTopics: favoriteTopics.value
    })
  }

  function startLearning(topicId: string) {
    currentTopicId.value = topicId
    currentStep.value = 0
    if (!learningHistory.value.includes(topicId)) {
      learningHistory.value.push(topicId)
      save()
    }
  }

  function setStep(step: number) {
    currentStep.value = step
  }

  function completeTopic(topicId: string) {
    if (!completedTopics.value.includes(topicId)) {
      completedTopics.value.push(topicId)
      save()
    }
    currentTopicId.value = null
    currentStep.value = 0
  }

  function toggleFavorite(topicId: string) {
    const idx = favoriteTopics.value.indexOf(topicId)
    if (idx >= 0) {
      favoriteTopics.value.splice(idx, 1)
    } else {
      favoriteTopics.value.push(topicId)
    }
    save()
  }

  function isCompleted(topicId: string): boolean {
    return completedTopics.value.includes(topicId)
  }

  function isFavorite(topicId: string): boolean {
    return favoriteTopics.value.includes(topicId)
  }

  function getProgress(grade: number, category: 'basic' | 'olympiad'): number {
    const all = getTopicsByGrade(grade, category)
    if (all.length === 0) return 0
    const completed = all.filter(t => completedTopics.value.includes(t.id)).length
    return Math.round((completed / all.length) * 100)
  }

  function getTopicsByGrade(grade: number, category: 'basic' | 'olympiad'): TopicIndex[] {
    return []
  }

  return {
    currentTopicId,
    learningHistory,
    completedTopics,
    favoriteTopics,
    currentStep,
    inited,
    isLearning,
    init,
    startLearning,
    setStep,
    completeTopic,
    toggleFavorite,
    isCompleted,
    isFavorite,
    getProgress,
    getTopicsByGrade
  }
})
