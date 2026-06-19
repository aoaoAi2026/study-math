export interface DiagnosisResult {
  radarData: { module: string; score: number }[]
  recommendedPath: 'basic' | 'enhance' | 'competition'
  estimatedGrade: number
  strengths: string[]
  weaknesses: string[]
  overallScore: number
  history?: DiagnosisResult[]
}

export interface DiagnosisAnswer {
  exerciseId: string
  userAnswer: string
  isCorrect: boolean
  timeUsed: number
}

export interface DiagnosisQuestion {
  exerciseId: string
  module: string
  grade: number
  difficulty: number
}

export type DiagnosisPhase = 'intro' | 'testing' | 'processing' | 'result'
