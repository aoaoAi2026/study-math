import { defineStore } from 'pinia'
import { localDb } from '@/services/localDb'

export const useLearningStore = defineStore('learning', {
  state: () => ({
    masteryById: {} as Record<string, any>,
    practiceList: [] as any[],
    wrongList: [] as any[],
    inited: false
  }),
  actions: {
    async init() {
      try {
        const list = await localDb.listMastery()
        this.masteryById = Object.fromEntries(list.map(x => [x.id, x]))
        this.wrongList = await localDb.listWrong()
        this.practiceList = await localDb.listPractice()
      } catch { /* ignore */ }
      this.inited = true
    },
    getMastery(id: string) {
      return this.masteryById[id] || { level: 0, lastPracticeTime: 0, correctCount: 0, totalCount: 0, easeFactor: 2.5, interval: 1, preAssessmentPassed: false, postTestPassed: false }
    },
    async setMastery(id: string, patch: any) {
      const cur = this.getMastery(id)
      const next = { ...cur, ...patch, id }
      this.masteryById[id] = next
      await localDb.setMastery(id, next)
    },
    async recordPractice(rec: any) {
      this.practiceList.push(rec)
      await localDb.addPractice(rec)
    },
    async recordWrong(rec: any) {
      this.wrongList.push(rec)
      await localDb.addWrong(rec)
    },
    masteryLevel(id: string): number { return this.getMastery(id).level || 0 }
  }
})
