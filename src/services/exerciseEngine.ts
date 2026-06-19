import type { Exercise } from '@/types/exercise'

export function estimateAbility(correctCount: number, total: number): number {
  if (total === 0) return 0
  const ratio = correctCount / total
  return Math.log((ratio + 0.01) / (1 - ratio + 0.01)) * 2
}

export function irtProbability(ability: number, a: number, b: number, c: number): number {
  return c + (1 - c) / (1 + Math.exp(-a * (ability - b)))
}

export interface PickOptions {
  knowledgePoints?: string[]
  minDiff?: number
  maxDiff?: number
  count?: number
}

interface ExerciseWithProb {
  exercise: Exercise
  p: number
}

export function pickExercises(pool: Exercise[], ability: number, opts: PickOptions = {}): Exercise[] {
  let list = pool.slice()
  if (opts.knowledgePoints && opts.knowledgePoints.length) {
    list = list.filter(e => opts.knowledgePoints!.some(kp => e.knowledgePoints.includes(kp)))
  }
  if (opts.minDiff) list = list.filter(e => e.difficulty >= opts.minDiff!)
  if (opts.maxDiff) list = list.filter(e => e.difficulty <= opts.maxDiff!)
  const withProb: ExerciseWithProb[] = list.map(e => ({ exercise: e, p: irtProbability(ability, e.irtParams.a, e.irtParams.b, e.irtParams.c) }))
    .sort((x, y) => Math.abs(x.p - 0.6) - Math.abs(y.p - 0.6))
  return withProb.slice(0, opts.count ?? 5).map(x => x.exercise)
}

export function classifyError(userAnswer: string, correct: string, stem: string): 'L1' | 'L2' | 'L3' | 'L4' {
  const u = (userAnswer || '').trim().replace(/\s+/g, '')
  const c = (correct || '').trim().replace(/\s+/g, '')
  if (u === c) return 'L2'
  const numU = parseFloat(u), numC = parseFloat(c)
  if (!isNaN(numU) && !isNaN(numC)) {
    if (Math.abs(numU + numC) < 1e-9 || Math.abs(numU - numC) > Math.abs(numC) * 2) return 'L2'
    const ratio = Math.abs(numU - numC) / Math.max(1, Math.abs(numC))
    if (ratio < 0.1) return 'L3'
    return 'L2'
  }
  if (u.length === 0) return 'L1'
  if (stem.length > 0 && (u.includes('和') || u.includes('差') || u.includes('倍'))) return 'L4'
  return 'L1'
}
