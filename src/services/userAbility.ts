// ============================================================
// 用户能力模型 - User Ability Model (基于 IRT)
// 记录并更新用户在每个知识点上的能力值
// 能力值范围: -2 (薄弱) 到 +2 (精通)
// ============================================================

import type { Exercise, UserAbility, TopicAbility, AnswerResult } from '@/types/exercise'

const STORAGE_KEY = 'user_ability_v1'
const HISTORY_LIMIT = 50 // 每个知识点保留最近 50 条记录

// ---------- IRT 核心函数 ----------

export function irtProbability(
  ability: number,
  a: number,
  b: number,
  c: number
): number {
  // 三参数 logistic 模型
  // P(theta) = c + (1-c) / (1 + exp(-a*(theta-b)))
  return c + (1 - c) / (1 + Math.exp(-a * (ability - b)))
}

// 根据答题结果更新能力值（简化的 EAP 估计）
export function updateAbility(
  currentAbility: number,
  isCorrect: boolean,
  a: number,
  b: number,
  c: number
): number {
  const p = irtProbability(currentAbility, a, b, c)
  // 调整步长：a 越大区分度越高，步长越大
  const step = 0.1 * a
  const delta = isCorrect ? step * (1 - p) : -step * p
  // 限制范围 [-2, +2]
  const next = Math.max(-2, Math.min(2, currentAbility + delta))
  return next
}

// ---------- 数据持久化 ----------

function loadFromStorage(): UserAbility {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefault()
    const parsed = JSON.parse(raw) as UserAbility
    return {
      overallAbility: parsed.overallAbility ?? 0,
      topics: parsed.topics ?? {},
      updatedAt: parsed.updatedAt ?? Date.now()
    }
  } catch {
    return createDefault()
  }
}

function createDefault(): UserAbility {
  return {
    overallAbility: 0,
    topics: {},
    updatedAt: Date.now()
  }
}

function saveToStorage(ability: UserAbility): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ability))
  } catch (e) {
    console.warn('[UserAbility] 保存失败:', e)
  }
}

// ---------- 公开 API ----------

export function getUserAbility(): UserAbility {
  return loadFromStorage()
}

export function getTopicAbility(topicId: string): TopicAbility {
  const user = loadFromStorage()
  return (
    user.topics[topicId] || {
      topicId,
      ability: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      lastAnsweredAt: 0,
      history: []
    }
  )
}

export function recordAnswer(
  topicId: string,
  exercise: Exercise,
  result: AnswerResult,
  source: 'exercise' | 'post_test' | 'daily_challenge' = 'exercise'
): TopicAbility {
  const user = loadFromStorage()
  const topic = user.topics[topicId] || {
    topicId,
    ability: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    lastAnsweredAt: 0,
    history: []
  }

  // 更新能力值
  const oldAbility = topic.ability
  const newAbility = updateAbility(
    oldAbility,
    result.isCorrect,
    exercise.irtParams.a,
    exercise.irtParams.b,
    exercise.irtParams.c
  )
  const delta = newAbility - oldAbility

  // 更新统计
  topic.ability = newAbility
  topic.totalAnswered += 1
  if (result.isCorrect) topic.totalCorrect += 1
  topic.lastAnsweredAt = Date.now()
  topic.history.push({
    timestamp: Date.now(),
    ability: newAbility,
    delta,
    source
  })

  // 限制历史记录长度
  if (topic.history.length > HISTORY_LIMIT) {
    topic.history = topic.history.slice(-HISTORY_LIMIT)
  }

  // 保存
  user.topics[topicId] = topic
  user.overallAbility = computeOverallAbility(user)
  user.updatedAt = Date.now()
  saveToStorage(user)

  return topic
}

function computeOverallAbility(user: UserAbility): number {
  const topics = Object.values(user.topics)
  if (topics.length === 0) return 0
  // 加权平均：总答题数作为权重
  let totalWeight = 0
  let weightedSum = 0
  for (const t of topics) {
    const w = Math.min(t.totalAnswered, 50) // 最多 50 的权重
    weightedSum += t.ability * w
    totalWeight += w
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

// ---------- 批量更新（整个课后测试） ----------

export function recordPostTestBatch(
  topicId: string,
  exercises: Exercise[],
  results: AnswerResult[]
): TopicAbility {
  const user = loadFromStorage()
  const topic = user.topics[topicId] || {
    topicId,
    ability: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    lastAnsweredAt: 0,
    history: []
  }

  let currentAbility = topic.ability
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i]
    const result = results[i]
    if (!ex || !result) continue

    const oldA = currentAbility
    currentAbility = updateAbility(
      currentAbility,
      result.isCorrect,
      ex.irtParams.a,
      ex.irtParams.b,
      ex.irtParams.c
    )
    topic.ability = currentAbility
    topic.totalAnswered += 1
    if (result.isCorrect) topic.totalCorrect += 1
    topic.lastAnsweredAt = Date.now()
    topic.history.push({
      timestamp: Date.now(),
      ability: currentAbility,
      delta: currentAbility - oldA,
      source: 'post_test'
    })
  }

  if (topic.history.length > HISTORY_LIMIT) {
    topic.history = topic.history.slice(-HISTORY_LIMIT)
  }

  user.topics[topicId] = topic
  user.overallAbility = computeOverallAbility(user)
  user.updatedAt = Date.now()
  saveToStorage(user)

  return topic
}

// ---------- 能力等级描述 ----------

export function abilityLabel(ability: number): string {
  if (ability >= 1.2) return '精通'
  if (ability >= 0.6) return '熟练'
  if (ability >= 0.2) return '掌握'
  if (ability >= -0.2) return '入门'
  if (ability >= -0.8) return '待加强'
  return '需要辅导'
}

export function abilityColor(ability: number): string {
  if (ability >= 1.2) return '#2F8C5D' // 深绿
  if (ability >= 0.6) return '#5EC9A5' // 薄荷绿
  if (ability >= 0.2) return '#FFD56A' // 暖黄
  if (ability >= -0.2) return '#FFB07C' // 浅橙
  if (ability >= -0.8) return '#F37522' // 深橙
  return '#F06A6A' // 红
}

// ---------- 工具：重置 ----------

export function resetAbility(topicId?: string): void {
  const user = loadFromStorage()
  if (topicId) {
    delete user.topics[topicId]
  } else {
    user.topics = {}
  }
  user.overallAbility = 0
  saveToStorage(user)
}
