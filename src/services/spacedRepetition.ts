import { localDb } from './localDb'

export interface SM2Record {
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: number
  lastReviewDate: number
}

const DEFAULT_SM2: SM2Record = {
  easeFactor: 2.5,
  interval: 1,
  repetitions: 0,
  nextReviewDate: Date.now(),
  lastReviewDate: 0
}

export function calculateSM2(
  quality: number,
  prev: SM2Record
): SM2Record {
  let { easeFactor, interval, repetitions } = prev

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions++
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastReviewDate: Date.now()
  }
}

export function qualityFromCorrect(
  isCorrect: boolean,
  errorLayer?: 'L1' | 'L2' | 'L3' | 'L4'
): number {
  if (!isCorrect) return 0
  if (!errorLayer) return 4

  switch (errorLayer) {
    case 'L1': return 3
    case 'L2': return 4
    case 'L3': return 5
    case 'L4': return 5
    default: return 4
  }
}

export async function getReviewItems(): Promise<string[]> {
  const all = await localDb.listMastery()
  const now = Date.now()
  return all
    .filter((m: SM2Record) => m.nextReviewDate <= now)
    .map((m: { id: string }) => m.id)
}

export async function updateReview(
  knowledgeId: string,
  isCorrect: boolean,
  errorLayer?: 'L1' | 'L2' | 'L3' | 'L4'
): Promise<SM2Record> {
  const prev = (await localDb.getMastery(knowledgeId)) as SM2Record | undefined
  const sm2Record = prev || { ...DEFAULT_SM2 }
  const quality = qualityFromCorrect(isCorrect, errorLayer)
  const updated = calculateSM2(quality, sm2Record)
  await localDb.setMastery(knowledgeId, updated)
  return updated
}

export function getIntervalDays(sm2: SM2Record): number {
  if (sm2.repetitions === 0) return 1
  if (sm2.repetitions === 1) return 6
  return Math.round(sm2.interval)
}

export function formatNextReview(sm2: SM2Record): string {
  const now = Date.now()
  const diff = sm2.nextReviewDate - now
  if (diff <= 0) return '现在'
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
  if (days === 1) return '明天'
  if (days < 7) return `${days}天后`
  if (days < 30) return `${Math.floor(days / 7)}周后`
  return `${Math.floor(days / 30)}个月后`
}
