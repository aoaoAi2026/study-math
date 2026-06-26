// ============================================================
// 题目类型定义（扩展版 - v2）
// 支持 5 种题型: choice, fill, input, matchstick, shape-match
// 每个题目关联知识点、难度、IRT 参数
// ============================================================

export interface Exercise {
  id: string
  knowledgePoints: string[]
  type: QuestionType
  difficulty: 1 | 2 | 3 | 4 | 5
  difficultyLabel?: string
  stem: string
  image?: string
  options?: string[]
  answer: string
  acceptableAnswers?: string[]
  solution: SolutionStep[]
  hints: string[]
  commonMistakes: CommonMistake[]
  irtParams: { a: number; b: number; c: number }
  estimatedTime: number
  source?: QuestionSource
  tags?: string[]
}

export type QuestionType = 'choice' | 'fill' | 'input' | 'matchstick' | 'shape-match'

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

export interface QuestionSource {
  type: 'textbook' | 'competition' | 'exam' | 'original'
  name: string
  year?: number
  original?: string
}

export interface AnswerResult {
  exerciseId: string
  userAnswer: string
  isCorrect: boolean
  timeUsed: number
  errorLayer?: 'L1' | 'L2' | 'L3' | 'L4'
}

// ---------- 课后测试 Session ----------

export interface PostTestSession {
  id: string
  topicId: string
  topicName: string
  startTime: number
  exercises: Exercise[]
  results: AnswerResult[]
  status: 'in_progress' | 'completed' | 'abandoned'
}

export interface PostTestSummary {
  total: number
  correct: number
  wrong: number
  accuracy: number
  totalTime: number
  avgTime: number
  wrongItems: AnswerResult[]
  abilityEstimate: number
  recommendation: string
}

// ---------- 用户能力模型 ----------

export interface TopicAbility {
  topicId: string
  ability: number // -2 ~ +2
  totalAnswered: number
  totalCorrect: number
  lastAnsweredAt: number
  history: AbilityHistoryPoint[]
}

export interface AbilityHistoryPoint {
  timestamp: number
  ability: number
  delta: number
  source: 'exercise' | 'post_test' | 'daily_challenge'
}

export interface UserAbility {
  overallAbility: number
  topics: Record<string, TopicAbility>
  updatedAt: number
}
