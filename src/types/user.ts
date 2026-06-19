export interface UserProfile {
  id: string
  nickname: string
  grade: 1 | 2 | 3 | 4 | 5 | 6
  goal: 'basic' | 'enhance' | 'competition' | 'interest'
  createdAt: number
}

export interface KnowledgeMastery {
  [knowledgeId: string]: {
    level: 0 | 1 | 2 | 3 | 4 | 5
    lastPracticeTime: number
    correctCount: number
    totalCount: number
    easeFactor: number
    interval: number
    preAssessmentPassed: boolean
    postTestPassed: boolean
  }
}

export interface PracticeRecord {
  id: string
  exerciseId: string
  knowledgePoints: string[]
  userAnswer: string
  isCorrect: boolean
  timeUsed: number
  timestamp: number
  errorType?: 'concept' | 'calculation' | 'reading' | 'method'
  errorLayer?: 'L1' | 'L2' | 'L3' | 'L4'
}

export interface WrongRecord {
  id: string
  exerciseId: string
  wrongAnswer: string
  correctAnswer: string
  errorType: 'concept' | 'calculation' | 'reading' | 'method'
  errorLayer: 'L1' | 'L2' | 'L3' | 'L4'
  createdAt: number
  nextReviewDate: number
  reviewCount: number
  resolved: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'persistence' | 'mastery' | 'challenge' | 'parent-child' | 'special'
  unlockedAt?: number
  progress: number
  target: number
}

export interface PetState {
  stage: 'egg' | 'baby' | 'teen' | 'adult' | 'master'
  mood: 'happy' | 'sleepy' | 'excited' | 'sad' | 'idle'
  hunger: number
  accessories: string[]
}
