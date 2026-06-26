// ============================================================
// 错题本存储 - 共享模块
// 提供统一的错题读写接口，供 QuizEngine 和 WrongBookPage 使用
// ============================================================

import type { Exercise } from '@/types/exercise'

export interface WrongItem {
  id: string // 唯一标识: exerciseId-timestamp
  exerciseId: string
  stem: string
  userAnswer: string
  correctAnswer: string
  knowledgeId: string // 取第一个 knowledgePoint
  knowledgeName: string // 知识点名称
  errorLayer: 'L1' | 'L2' | 'L3' | 'L4'
  difficulty: number
  timestamp: number
  reviewed: boolean
  reviewCount: number
  source: 'practice' | 'post_test' | 'daily_challenge'
}

const STORAGE_KEY = 'app_wrong_book_v2'

// ---------- 基础读写 ----------
function loadAll(): WrongItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveAll(items: WrongItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('[WrongBook] 保存失败:', e)
  }
}

// ---------- 工具函数 ----------
function prettyKnowledgeName(kp: string): string {
  // 简短的知识点名称映射（与 questionBankLoader 保持一致）
  const map: Record<string, string> = {
    'g1-number-recognition': '认识数字',
    'g1-addition-within-20': '20以内加减法',
    'g1-plane-shapes': '认识平面图形',
    'g1-solid-shapes': '认识立体图形',
    'g1-clock-time': '认识钟表',
    'g1-rmb-money': '认识人民币',
    'g1-number-100': '100以内数的认识',
    'g1-matchstick-game': '火柴棒游戏',
    'g1-counting-game': '数数与找规律',
    'g1-simple-logic': '简单推理',
    'g1-one-stroke': '一笔画',
    'g1-shape-cut-paste': '图形剪拼',
    'g1-sudoku-intro': '数独入门',
    'g1-word-problem-1st': '一年级应用题',
    'g2-multiplication-table': '乘法口诀',
    'g2-division-table': '除法口诀',
    'g2-mixed-operations': '混合运算',
    'g2-length-unit': '长度单位',
    'g2-mass-unit': '质量单位',
    'g2-angle-intro': '角的认识',
    'g2-clever-calc': '巧算速算',
    'g2-move-supplement': '移多补少',
    'g2-age-problem-basic': '年龄问题基础',
    'g2-equal-replace': '等量代换',
    'g2-queue-problem': '排队问题',
    'g2-overlap-problem': '重叠问题',
    'g2-count-shapes': '数图形',
    'g2-sequence-pattern': '数列规律',
    'g2-list-reasoning': '列表推理',
    'g3-multi-digit-multiply': '多位数乘法',
    'g3-division-vertical': '除法竖式',
    'g3-fraction-intro': '分数初步认识',
    'g3-perimeter-area': '周长与面积',
    'g3-year-month-day': '年月日',
    'g3-decimal-intro': '小数初步认识',
    'g3-sum-multiple': '和倍问题',
    'g3-diff-multiple': '差倍问题',
    'g3-sum-diff': '和差问题',
    'g3-planting-trees': '植树问题',
    'g3-arithmetic-sequence': '等差数列',
    'g3-vertical-puzzle': '竖式数字谜',
    'g3-restore-problem': '还原问题',
    'g3-clever-perimeter': '巧求周长',
    'g3-area-basic': '面积基础',
    'g3-odd-even': '奇偶性',
    'g3-plant-problem': '植物问题',
    'g3-add-multiply-principle': '加法乘法原理',
    'chicken-rabbit': '鸡兔同笼',
    'age-problem': '年龄问题综合',
    'number-theory': '数论基础',
    'fraction-add-sub': '分数加减法',
    'fraction-split': '分数裂项',
    'circle-area': '圆的周长与面积',
    'profit-loss': '盈亏问题',
    'geometry-model': '几何模型',
    'travel-problem': '行程问题'
  }
  return map[kp] || kp.replace(/^g\d+-/, '').replace(/-/g, ' ')
}

function extractAnswerText(exercise: Exercise, rawAnswer: string): string {
  // 如果是选择题，把选项索引转换成实际选项文本
  if (exercise.type === 'choice' && /^\d+$/.test(rawAnswer)) {
    const idx = parseInt(rawAnswer, 10)
    if (exercise.options && idx >= 0 && idx < exercise.options.length) {
      return exercise.options[idx]
    }
  }
  return rawAnswer
}

// ---------- 公开接口 ----------

/** 添加一道错题 */
export function addWrongItem(
  exercise: Exercise,
  userAnswer: string,
  errorLayer: 'L1' | 'L2' | 'L3' | 'L4',
  source: WrongItem['source'] = 'practice'
): WrongItem {
  const kp = (exercise.knowledgePoints?.[0]) || 'unknown'
  const item: WrongItem = {
    id: `${exercise.id}-${Date.now()}`,
    exerciseId: exercise.id,
    stem: exercise.stem,
    userAnswer: extractAnswerText(exercise, userAnswer),
    correctAnswer: extractAnswerText(exercise, exercise.answer),
    knowledgeId: kp,
    knowledgeName: prettyKnowledgeName(kp),
    errorLayer,
    difficulty: Number(exercise.difficulty) || 1,
    timestamp: Date.now(),
    reviewed: false,
    reviewCount: 0,
    source
  }

  const all = loadAll()
  all.unshift(item)
  // 限制最大数量
  if (all.length > 500) all.length = 500
  saveAll(all)
  return item
}

/** 获取全部错题 */
export function getWrongItems(): WrongItem[] {
  return loadAll()
}

/** 标记一道题已复习 */
export function markReviewed(id: string): void {
  const all = loadAll()
  const item = all.find(i => i.id === id)
  if (item) {
    item.reviewed = true
    item.reviewCount++
    saveAll(all)
  }
}

/** 清除已掌握（已复习）的错题 */
export function clearReviewedItems(): void {
  const all = loadAll().filter(i => !i.reviewed)
  saveAll(all)
}

/** 获取统计信息 */
export function getWrongStats(): {
  total: number
  L1: number
  L2: number
  L3: number
  L4: number
  byKnowledge: Record<string, number>
} {
  const all = loadAll()
  const stats = { total: all.length, L1: 0, L2: 0, L3: 0, L4: 0, byKnowledge: {} as Record<string, number> }
  for (const item of all) {
    stats[item.errorLayer]++
    stats.byKnowledge[item.knowledgeName] = (stats.byKnowledge[item.knowledgeName] || 0) + 1
  }
  return stats
}

/** 清除所有错题 */
export function clearAllWrongItems(): void {
  saveAll([])
}
