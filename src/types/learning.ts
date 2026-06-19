export type GuidanceLevel = 'demonstration' | 'scaffolding' | 'socratic' | 'challenge'

export interface GuidanceLevelConfig {
  level: GuidanceLevel
  maxHints: number
  hintDelay: number
}

export interface LearningPathNode {
  knowledgeId: string
  status: 'locked' | 'available' | 'in-progress' | 'mastered'
  guidanceLevel: GuidanceLevelConfig
  preAssessmentRequired: boolean
  postTestThreshold: number
}

export interface PreAssessmentResult {
  knowledgeId: string
  passed: boolean
  score: number
  weakPrerequisites: string[]
  recommendation: 'proceed' | 'review-first' | 'restart'
}

export interface ParentCoachingRecord {
  date: string
  knowledgeId: string
  duration: number
  mode: 'script' | 'understanding' | 'extension'
  childEngagement: number
  parentRestraint: number
  childMood: 'happy' | 'neutral' | 'frustrated'
  notes: string
}

export interface LearningSession {
  id: string
  knowledgeId: string
  startTime: number
  endTime?: number
  currentStep: 'pre-assessment' | 'story' | 'concept' | 'example' | 'variant' | 'mistake' | 'parent-child' | 'post-test'
  cardIndex: number
  completedCards: string[]
  hintsUsed: number
}
