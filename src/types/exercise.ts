export interface Exercise {
  id: string
  knowledgePoints: string[]
  type: 'choice' | 'fill' | 'input'
  difficulty: 1 | 2 | 3 | 4 | 5
  stem: string
  options?: string[]
  answer: string
  solution: SolutionStep[]
  hints: string[]
  commonMistakes: CommonMistake[]
  irtParams: { a: number; b: number; c: number }
  estimatedTime: number
}

export interface SolutionStep {
  description: string
  expression?: string
  why?: string
}

export interface CommonMistake {
  mistake: string
  reason: string
  correction: string
  errorLayer: 'L1' | 'L2' | 'L3' | 'L4'
}

export interface AnswerResult {
  exerciseId: string
  userAnswer: string
  isCorrect: boolean
  timeUsed: number
  errorLayer?: 'L1' | 'L2' | 'L3' | 'L4'
}
