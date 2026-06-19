export interface ChallengeRecord {
  id: string
  type: 'daily' | 'weekly'
  date: string
  score: number
  totalQuestions: number
  correctCount: number
  timeUsed: number
  rank?: number
  details: { exerciseId: string; correct: boolean }[]
}

export interface DailyChallenge {
  date: string
  exercises: string[]
  reward: number
  completed: boolean
}

export interface WeeklyContest {
  weekStart: string
  exercises: string[]
  reward: number
  participants: number
  completed: boolean
}
