// ============================================================
// 课后测试管理 - Post Test Session Manager
// 负责生成测试 session、管理答题进度、生成结果报告
// ============================================================

import type { Exercise, PostTestSession, PostTestSummary, AnswerResult } from '@/types/exercise'
import { loadQuestionBank, getBankIndex } from './questionBankLoader'
import { getTopicAbility, recordPostTestBatch, abilityLabel } from './userAbility'
import { pickExercises, classifyError } from './exerciseEngine'

// ---------- Session 存储 ----------

const SESSION_KEY = 'post_test_session_v1'
const HISTORY_KEY = 'post_test_history_v1'

interface HistoryEntry {
  topicId: string
  topicName: string
  completedAt: number
  total: number
  correct: number
  accuracy: number
  totalTime: number
}

function saveSession(session: PostTestSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch (e) {
    console.warn('[PostTest] 保存 session 失败:', e)
  }
}

function loadSession(): PostTestSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PostTestSession
  } catch {
    return null
  }
}

function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {}
}

function saveHistory(entry: HistoryEntry): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const list: HistoryEntry[] = raw ? JSON.parse(raw) : []
    list.unshift(entry)
    // 只保留最近 50 条
    if (list.length > 50) list.length = 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('[PostTest] 保存历史失败:', e)
  }
}

export function getTestHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

// ---------- 生成测试 ----------

export interface CreateTestOptions {
  topicId: string
  topicName: string
  count?: number // 默认 6-8 题
  minDiff?: number
  maxDiff?: number
}

export async function createPostTest(
  opts: CreateTestOptions
): Promise<PostTestSession | null> {
  const { topicId, topicName, count = 6 } = opts

  // 1. 加载题库
  const bank = await loadQuestionBank(topicId)
  if (!bank || bank.exercises.length === 0) {
    console.warn(`[PostTest] ${topicId} 没有可用题目`)
    return null
  }

  // 2. 获取用户当前能力
  const topicAbility = getTopicAbility(topicId)
  const ability = topicAbility.ability || 0

  // 3. 智能选题
  // 按能力调整难度范围
  let minDiff = opts.minDiff
  let maxDiff = opts.maxDiff
  if (minDiff === undefined) {
    minDiff = ability < -0.3 ? 1 : 2
  }
  if (maxDiff === undefined) {
    maxDiff = ability > 0.8 ? 5 : ability > 0.3 ? 4 : 3
  }

  // 确保至少有 2 种题型
  const picked = pickExercises(bank.exercises, ability, {
    count,
    minDiff,
    maxDiff,
    knowledgePoints: [topicId]
  })

  // 如果数量不足，降低筛选标准
  if (picked.length < Math.min(3, count)) {
    const fallback = pickExercises(bank.exercises, ability, {
      count,
      knowledgePoints: [topicId]
    })
    // 取较长的列表
    if (fallback.length > picked.length) {
      return buildSession(topicId, topicName, fallback)
    }
  }

  return buildSession(topicId, topicName, picked)
}

function buildSession(
  topicId: string,
  topicName: string,
  exercises: Exercise[]
): PostTestSession {
  const session: PostTestSession = {
    id: `${topicId}-${Date.now()}`,
    topicId,
    topicName,
    startTime: Date.now(),
    exercises,
    results: [],
    status: 'in_progress'
  }
  saveSession(session)
  return session
}

// ---------- 答题 ----------

export function submitAnswer(
  sessionId: string,
  exerciseId: string,
  userAnswer: string,
  timeUsed: number
): AnswerResult | null {
  const session = loadSession()
  if (!session || session.id !== sessionId) return null

  const exercise = session.exercises.find(e => e.id === exerciseId)
  if (!exercise) return null

  // 判断正误
  const isCorrect = checkAnswer(userAnswer, exercise)
  const errorLayer = isCorrect ? undefined : classifyError(userAnswer, exercise.answer, exercise.stem)

  const result: AnswerResult = {
    exerciseId,
    userAnswer,
    isCorrect,
    timeUsed,
    errorLayer
  }
  session.results.push(result)
  saveSession(session)
  return result
}

function checkAnswer(userAnswer: string, exercise: Exercise): boolean {
  const clean = (s: string) => s.trim().replace(/\s+/g, '').replace(/[，。！？、]/g, '').toLowerCase()
  const user = clean(userAnswer)
  const correct = clean(exercise.answer)

  // 直接匹配
  if (user === correct) return true

  // 匹配可接受答案列表
  if (exercise.acceptableAnswers && exercise.acceptableAnswers.length > 0) {
    for (const alt of exercise.acceptableAnswers) {
      if (user === clean(alt)) return true
      // 宽松的包含匹配（数字题）
      const nums = extractNumbers(user)
      const altNums = extractNumbers(alt)
      if (nums.length > 0 && altNums.length > 0 &&
          nums.length === altNums.length &&
          nums.every((n, i) => Math.abs(n - altNums[i]) < 1e-9)) {
        return true
      }
    }
  }

  // 数字题的宽松匹配
  const userNums = extractNumbers(user)
  const correctNums = extractNumbers(correct)
  if (userNums.length > 0 && correctNums.length > 0 &&
      userNums.length === correctNums.length &&
      userNums.every((n, i) => Math.abs(n - correctNums[i]) < 1e-9)) {
    return true
  }

  return false
}

function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+\.?\d*/g)
  if (!matches) return []
  return matches.map(Number).filter(n => !isNaN(n))
}

// ---------- 完成测试 ----------

export function completePostTest(sessionId: string): PostTestSummary | null {
  const session = loadSession()
  if (!session || session.id !== sessionId) return null
  if (session.exercises.length === 0) return null

  session.status = 'completed'

  // 更新用户能力模型
  const resultsWithError = session.results.map(r => {
    const ex = session.exercises.find(e => e.id === r.exerciseId)
    return ex ? { exercise: ex, result: r } : null
  }).filter(Boolean) as { exercise: Exercise; result: AnswerResult }[]

  const exercises = resultsWithError.map(x => x.exercise)
  const onlyResults = resultsWithError.map(x => x.result)
  recordPostTestBatch(session.topicId, exercises, onlyResults)

  // 生成摘要
  const total = session.exercises.length
  const correct = session.results.filter(r => r.isCorrect).length
  const wrong = total - correct
  const totalTime = session.results.reduce((s, r) => s + r.timeUsed, 0)
  const accuracy = total > 0 ? correct / total : 0

  // 更新用户能力
  const ability = getTopicAbility(session.topicId)

  // 生成推荐
  let recommendation = ''
  if (accuracy >= 0.8) {
    recommendation = '非常棒！这个知识点掌握得很好，可以挑战更高难度了。'
  } else if (accuracy >= 0.6) {
    recommendation = '不错哦！有一些小错误需要注意，建议再练一轮巩固一下。'
  } else if (accuracy >= 0.4) {
    recommendation = '还需要多练习，建议回顾一下知识点讲解，再做一轮练习。'
  } else {
    recommendation = '这个知识点还没掌握好，建议仔细看一遍讲解，从最简单的题目开始慢慢练。'
  }

  saveSession(session)

  // 写入历史
  saveHistory({
    topicId: session.topicId,
    topicName: session.topicName,
    completedAt: Date.now(),
    total,
    correct,
    accuracy,
    totalTime
  })

  return {
    total,
    correct,
    wrong,
    accuracy,
    totalTime,
    avgTime: total > 0 ? Math.round(totalTime / total) : 0,
    wrongItems: session.results.filter(r => !r.isCorrect),
    abilityEstimate: ability.ability,
    recommendation
  }
}

// ---------- 获取当前 Session ----------

export function getCurrentSession(): PostTestSession | null {
  return loadSession()
}

export function abandonSession(): void {
  const session = loadSession()
  if (session) {
    session.status = 'abandoned'
    saveSession(session)
  }
}

// ---------- 辅助：获取测试推荐 ----------

export function getTestRecommendation(topicId: string, topicName: string): string {
  const ability = getTopicAbility(topicId)
  const label = abilityLabel(ability.ability)
  if (ability.totalAnswered === 0) {
    return `还没做过${topicName}的题，来做一轮课后测试吧！`
  }
  return `当前水平: ${label}，做 ${topicName} 的练习题继续提升！`
}

// ---------- 预加载题库索引（启动时调用一次） ----------

export async function preloadBankIndex(): Promise<void> {
  try {
    getBankIndex()
  } catch {}
}
