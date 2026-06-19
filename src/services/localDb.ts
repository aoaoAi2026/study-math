import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface MathAppDB extends DBSchema {
  practice: { key: string; value: any; indexes: { 'by-time': number } }
  wrong: { key: string; value: any; indexes: { 'by-review': number } }
  mastery: { key: string; value: any }
  notes: { key: string; value: any }
  achievements: { key: string; value: any }
  settings: { key: string; value: any }
}

let db: IDBPDatabase<MathAppDB> | null = null

async function ensure(): Promise<IDBPDatabase<MathAppDB>> {
  if (db) return db
  db = await openDB<MathAppDB>('math-app-db', 1, {
    upgrade(u) {
      u.createObjectStore('practice', { keyPath: 'id' }).createIndex('by-time', 'timestamp')
      u.createObjectStore('wrong', { keyPath: 'id' }).createIndex('by-review', 'nextReviewDate')
      u.createObjectStore('mastery', { keyPath: 'id' })
      u.createObjectStore('notes', { keyPath: 'id' })
      u.createObjectStore('achievements', { keyPath: 'id' })
      u.createObjectStore('settings', { keyPath: 'id' })
    }
  })
  return db
}

export const localDb = {
  async addPractice(rec: any) { return (await ensure()).put('practice', rec) },
  async listPractice() { return (await ensure()).getAllFromIndex('practice', 'by-time') },
  async addWrong(rec: any) { return (await ensure()).put('wrong', rec) },
  async listWrong(): Promise<any[]> {
    const r = await (await ensure()).getAll('wrong')
    return r.filter(x => !x.resolved)
  },
  async resolveWrong(id: string) {
    const d = await ensure()
    const rec = await d.get('wrong', id)
    if (rec) { rec.resolved = true; await d.put('wrong', rec) }
  },
  async setMastery(id: string, val: any) { return (await ensure()).put('mastery', { id, ...val }) },
  async getMastery(id: string) { return (await ensure()).get('mastery', id) },
  async listMastery(): Promise<any[]> { return (await ensure()).getAll('mastery') },
  async setSettings(key: string, val: any) { return (await ensure()).put('settings', { id: key, value: val }) },
  async getSettings(key: string, fallback: any = null) {
    const r = await (await ensure()).get('settings', key)
    return r ? r.value : fallback
  }
}
