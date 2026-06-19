import { defineStore } from 'pinia'
import { localDb } from '@/services/localDb'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'persistence' | 'mastery' | 'challenge'
  progress: number
  target: number
  unlockedAt?: number
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-learn', name: '初次启程', description: '完成第一个知识点的学习', icon: '🌟', category: 'persistence', progress: 0, target: 1 },
  { id: 'streak-3', name: '三连星', description: '连续学习3天', icon: '⭐', category: 'persistence', progress: 0, target: 3 },
  { id: 'master-1', name: '掌握一个专题', description: '任一知识点掌握度达到5级', icon: '🏅', category: 'mastery', progress: 0, target: 1 },
  { id: 'quiz-10', name: '小试牛刀', description: '累计答对10道练习题', icon: '🎯', category: 'challenge', progress: 0, target: 10 },
  { id: 'game-score-100', name: '计算达人', description: '计算街机得分达到100', icon: '🎮', category: 'challenge', progress: 0, target: 100 }
]

export const useUserStore = defineStore('user', {
  state: () => ({
    nickname: '小数学家',
    grade: 3 as 1 | 2 | 3 | 4 | 5 | 6,
    experience: 0,
    level: 1,
    gems: 10,
    checkInDays: 0,
    lastCheckIn: 0,
    correctTotal: 0,
    pet: { stage: 'baby' as const, mood: 'happy' as const, hunger: 80, accessories: [] as string[] },
    achievements: DEFAULT_ACHIEVEMENTS.map(a => ({ ...a })),
    inited: false
  }),
  actions: {
    async init() {
      try {
        const saved = await localDb.getSettings('user', null)
        if (saved) Object.assign(this, saved)
      } catch { /* ignore */ }
      this.inited = true
    },
    async save() {
      const { nickname, grade, experience, level, gems, checkInDays, lastCheckIn, correctTotal, pet, achievements } = this
      await localDb.setSettings('user', { nickname, grade, experience, level, gems, checkInDays, lastCheckIn, correctTotal, pet, achievements })
    },
    addExp(n: number) {
      this.experience += n
      this.level = 1 + Math.floor(this.experience / 100)
      if (n > 0) this.gems += Math.max(1, Math.floor(n / 20))
      this.bumpAchievement('quiz-10', n)
      this.save()
    },
    bumpAchievement(id: string, delta = 1) {
      const a = this.achievements.find((x: Achievement) => x.id === id)
      if (!a || a.progress >= a.target) return
      a.progress = Math.min(a.target, a.progress + delta)
      if (a.progress >= a.target && !a.unlockedAt) {
        a.unlockedAt = Date.now()
        this.gems += 20
      }
    },
    setMastery(level: number) {
      if (level >= 5) this.bumpAchievement('master-1', 1)
      this.save()
    },
    recordLearn() {
      this.bumpAchievement('first-learn', 1)
      const today = new Date().toDateString()
      if (new Date(this.lastCheckIn).toDateString() !== today) {
        this.checkInDays += 1
        this.lastCheckIn = Date.now()
        this.bumpAchievement('streak-3', 1)
      }
      this.save()
    }
  }
})
