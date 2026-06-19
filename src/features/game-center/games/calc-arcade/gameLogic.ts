import { randomInt, pick } from '@/utils/math'

export type Operation = '+' | '-' | '×' | '÷'

export interface Problem {
  operand1: number
  operand2: number
  operation: Operation
  answer: number
  expression: string
}

export interface GameConfig {
  operations: Operation[]
  maxNumber: number
  minNumber: number
  timeLimit: number
  mode: 'practice' | 'survival' | 'challenge'
}

export interface GameState {
  score: number
  combo: number
  maxCombo: number
  correctCount: number
  wrongCount: number
  totalCount: number
  streak: number
  timeLeft: number
  isGameOver: boolean
  currentProblem: Problem | null
}

const DEFAULT_CONFIG: GameConfig = {
  operations: ['+', '-'],
  maxNumber: 20,
  minNumber: 1,
  timeLimit: 60,
  mode: 'practice'
}

export function generateProblem(config: GameConfig): Problem {
  const ops = config.operations.length > 0
    ? pick(config.operations, 1)[0]
    : '+'

  let operand1: number
  let operand2: number
  let answer: number

  switch (ops) {
    case '+':
      operand1 = randomInt(config.minNumber, config.maxNumber)
      operand2 = randomInt(config.minNumber, config.maxNumber)
      answer = operand1 + operand2
      break
    case '-':
      operand1 = randomInt(config.minNumber, config.maxNumber)
      operand2 = randomInt(config.minNumber, Math.min(operand1, config.maxNumber))
      answer = operand1 - operand2
      break
    case '×':
      operand1 = randomInt(1, Math.min(12, config.maxNumber))
      operand2 = randomInt(1, Math.min(12, config.maxNumber))
      answer = operand1 * operand2
      break
    case '÷':
      operand2 = randomInt(1, Math.min(12, config.maxNumber))
      answer = randomInt(1, Math.min(12, config.maxNumber))
      operand1 = operand2 * answer
      break
    default:
      operand1 = randomInt(config.minNumber, config.maxNumber)
      operand2 = randomInt(config.minNumber, config.maxNumber)
      answer = operand1 + operand2
  }

  const opSymbol = ops === '×' ? '×' : ops === '÷' ? '÷' : ops

  return {
    operand1,
    operand2,
    operation: ops,
    answer,
    expression: `${operand1} ${opSymbol} ${operand2} = ?`
  }
}

export function checkAnswer(problem: Problem, userAnswer: number): boolean {
  return userAnswer === problem.answer
}

export function calculateScore(
  correct: boolean,
  combo: number,
  timeRemaining: number,
  mode: GameConfig['mode']
): number {
  if (!correct) return 0

  const baseScore = 10
  const comboBonus = Math.min(combo, 10) * 2
  const timeBonus = mode === 'survival' ? Math.floor(timeRemaining / 10) * 5 : 0

  return baseScore + comboBonus + timeBonus
}

export function createInitialState(config: GameConfig): GameState {
  return {
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    totalCount: 0,
    streak: 0,
    timeLeft: config.timeLimit,
    isGameOver: false,
    currentProblem: null
  }
}

export function updateState(
  state: GameState,
  isCorrect: boolean,
  newProblem: Problem
): GameState {
  const newCombo = isCorrect ? state.combo + 1 : 0
  const newStreak = isCorrect ? state.streak + 1 : 0

  return {
    ...state,
    score: state.score + calculateScore(isCorrect, state.combo, state.timeLeft, 'practice'),
    combo: newCombo,
    maxCombo: Math.max(state.maxCombo, newCombo),
    correctCount: state.correctCount + (isCorrect ? 1 : 0),
    wrongCount: state.wrongCount + (isCorrect ? 0 : 1),
    totalCount: state.totalCount + 1,
    streak: newStreak,
    currentProblem: newProblem
  }
}

export function getDifficultyLevel(grade: number): GameConfig[] {
  const configs: Record<number, GameConfig[]> = {
    1: [
      { operations: ['+'], maxNumber: 10, minNumber: 1, timeLimit: 120, mode: 'practice' }
    ],
    2: [
      { operations: ['+', '-'], maxNumber: 20, minNumber: 1, timeLimit: 90, mode: 'practice' }
    ],
    3: [
      { operations: ['+', '-'], maxNumber: 100, minNumber: 1, timeLimit: 60, mode: 'practice' },
      { operations: ['×'], maxNumber: 9, minNumber: 1, timeLimit: 60, mode: 'practice' }
    ],
    4: [
      { operations: ['×', '÷'], maxNumber: 12, minNumber: 1, timeLimit: 60, mode: 'practice' },
      { operations: ['+', '-', '×'], maxNumber: 100, minNumber: 1, timeLimit: 45, mode: 'survival' }
    ],
    5: [
      { operations: ['+', '-', '×', '÷'], maxNumber: 100, minNumber: 1, timeLimit: 45, mode: 'survival' }
    ],
    6: [
      { operations: ['+', '-', '×', '÷'], maxNumber: 1000, minNumber: 1, timeLimit: 30, mode: 'challenge' }
    ]
  }

  return configs[grade] || configs[3]
}

export function formatResult(state: GameState): {
  accuracy: number
  avgTime: number
  bestStreak: number
  grade: string
} {
  const accuracy = state.totalCount > 0
    ? (state.correctCount / state.totalCount) * 100
    : 0
  const avgTime = state.totalCount > 0
    ? state.timeLimit / state.totalCount
    : 0

  let grade = 'F'
  if (accuracy >= 95 && state.maxCombo >= 10) grade = 'S'
  else if (accuracy >= 90 && state.maxCombo >= 8) grade = 'A'
  else if (accuracy >= 80 && state.maxCombo >= 5) grade = 'B'
  else if (accuracy >= 70) grade = 'C'
  else if (accuracy >= 60) grade = 'D'

  return {
    accuracy,
    avgTime,
    bestStreak: state.streak,
    grade
  }
}
