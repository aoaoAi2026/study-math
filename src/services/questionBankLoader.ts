// ============================================================
// 题库文件加载器 - Question Bank Loader (v4)
// 策略：优先尝试 JSON 文件 -> 回退到 exerciseData.ts
// 新功能：在加载时把 Markdown 文本统一解析成 HTML，下游组件直接 v-html 即可
// ============================================================

import type { Exercise } from '@/types/exercise'
import { EXERCISE_POOL } from '@/stores/exerciseData'

// ========================
// HTML 转义工具
// ========================
function escapeHtml(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ========================
// 行内格式解析：**粗体**、`代码`
// 注意：先做 Markdown → HTML 替换，再做 HTML 转义，最后还原标签
// ========================
function renderInline(text: string): string {
  let out = text
  // 1) markdown → HTML 标签（顺序：粗体 → 代码 → 斜体）
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/(^|[^*])\*(?!\*)(.+?)\*/g, '$1<em>$2</em>')
  // 2) 保留已经处理的 HTML 标签，转义其他字符
  const placeholders: string[] = []
  out = out.replace(/<\/?(strong|em|code)[^>]*>/gi, function(m) {
    placeholders.push(m)
    return '__PH' + (placeholders.length - 1) + '__'
  })
  out = escapeHtml(out)
  placeholders.forEach(function(ph, i) {
    const key = '__PH' + i + '__'
    while (out.indexOf(key) !== -1) out = out.replace(key, ph)
  })
  return out
}

// ========================
// 块级 Markdown 解析：标题 / 列表 / 段落
// ========================
function parseMD(raw: string): string {
  if (!raw) return ''
  const lines = String(raw).replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let currentPara: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let listItems: string[] = []

  function flushPara() {
    if (currentPara.length > 0) {
      const joined = currentPara.map(renderInline).join('<br/>')
      html.push('<p>' + joined + '</p>')
      currentPara = []
    }
  }

  function flushList() {
    if (listItems.length > 0 && listType) {
      const liHtml = listItems.map(function(l) { return '<li>' + renderInline(l) + '</li>' }).join('')
      html.push('<' + listType + '>' + liHtml + '</' + listType + '>')
      listItems = []
      listType = null
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      flushPara()
      flushList()
      continue
    }
    // 标题
    if (/^#{1,3}\s+/.test(trimmed)) {
      flushPara()
      flushList()
      const txt = trimmed.replace(/^#{1,3}\s+/, '')
      html.push('<h4>' + renderInline(txt) + '</h4>')
      continue
    }
    // 无序列表
    if (/^[-*+]\s+/.test(trimmed)) {
      flushPara()
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listItems.push(trimmed.replace(/^[-*+]\s+/, ''))
      continue
    }
    // 有序列表
    const m = trimmed.match(/^(\d+)[.、）)]\s*(.*)$/)
    if (m) {
      flushPara()
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      listItems.push(m[2] || '')
      continue
    }
    // 默认：普通文本行
    flushList()
    currentPara.push(trimmed)
  }
  flushPara()
  flushList()
  return html.join('\n')
}

// 短文本（选项/提示）——仅解析行内格式
function parseInline(raw: string): string {
  if (!raw) return ''
  return renderInline(String(raw))
}

// ---- 内部缓存 ----
const topicCache = new Map<string, Exercise[]>()

// ---- 加载单个知识点题库 ----
export async function loadQuestionBank(
  topicId: string,
  force = false
): Promise<{
  title: string
  topicId: string
  exercises: Exercise[]
} | null> {
  // 命中缓存
  if (!force && topicCache.has(topicId)) {
    return {
      title: prettyTitle(topicId),
      topicId,
      exercises: topicCache.get(topicId)!
    }
  }

  // 1) 先尝试 JSON 文件
  try {
    const url = '/content/question-bank/' + toFileName(topicId) + '.json'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const raw = data.exercises || data.questions || []
      const exercises = normalize(raw)
      topicCache.set(topicId, exercises)
      return {
        title: data.topicName || data.title || prettyTitle(topicId),
        topicId,
        exercises
      }
    }
  } catch (e) {
    // JSON 不存在也不是错误，静默继续
  }

  // 2) 回退到 exerciseData.ts (TypeScript 题目池)
  const filtered = EXERCISE_POOL.filter(function(e) {
    return (e.knowledgePoints || []).indexOf(topicId) !== -1
  })

  // 3) 如果没有精确匹配，按年级前缀宽松匹配
  let exercises = filtered
  if (exercises.length === 0) {
    const prefix = topicId.split('-')[0]
    if (/^g\d$/.test(prefix)) {
      exercises = EXERCISE_POOL.filter(function(e) {
        return (e.knowledgePoints || []).some(function(kp) {
          return kp.startsWith(prefix)
        })
      }).slice(0, 10)
    }
  }

  if (exercises.length === 0) {
    return null
  }

  topicCache.set(topicId, exercises)
  return {
    title: prettyTitle(topicId),
    topicId,
    exercises
  }
}

// ---- 获取题库索引信息 ----
export function getBankIndex(): {
  totalBanks: number
  totalQuestions: number
  topics: string[]
} {
  const topics = new Set<string>()
  for (const e of EXERCISE_POOL) {
    for (const kp of (e.knowledgePoints || [])) {
      topics.add(kp)
    }
  }
  return {
    totalBanks: topics.size,
    totalQuestions: EXERCISE_POOL.length,
    topics: Array.from(topics)
  }
}

// ---- 随机抽题 ----
export function pickRandomByTopic(
  topicId: string,
  count: number = 5,
  minDiff: number = 1,
  maxDiff: number = 5
): Exercise[] {
  const pool = topicCache.get(topicId) || EXERCISE_POOL.filter(function(e) {
    return (e.knowledgePoints || []).indexOf(topicId) !== -1
  })
  const filtered = pool.filter(function(e) {
    const d = Number(e.difficulty) || 1
    return d >= minDiff && d <= maxDiff
  })
  const shuffled = filtered.slice().sort(function() { return Math.random() - 0.5 })
  return shuffled.slice(0, count)
}

// ---- 清空缓存 ----
export function clearBankCache(): void {
  topicCache.clear()
}

// ---- 工具函数 ----
function toFileName(topicId: string): string {
  // 考试真题（exam文件夹下的试卷）
  // 匹配 exam/g6/g6-final-2024 或 huabei-14-final 等格式
  const examPrefixes = ['g6-final', 'huabei', 'xiwang', 'zoumei', 'yingchun', 'xiaoshengchu']
  const isExamPaper = examPrefixes.some(function(p) { return topicId.indexOf(p) !== -1 })

  // g6-final-2024 → exam/g6/g6-final-2024
  if (topicId.indexOf('g6-final') !== -1) return 'exam/g6/' + topicId
  // huabei-14-final → exam/g6/huabei-14-final
  if (topicId.indexOf('huabei') !== -1) return 'exam/g6/' + topicId
  // xiwang-1-g4 → exam/g4/xiwang-1-g4
  var xiwangMatch = topicId.match(/^xiwang-\d+-g(\d)$/)
  if (xiwangMatch) return 'exam/g' + xiwangMatch[1] + '/' + topicId
  // 其他以 g1 ~ g6 开头的标准知识点格式
  var parts = topicId.split('-')
  if (parts.length > 1 && /^g\d$/.test(parts[0])) {
    return parts[0] + '/' + topicId
  }
  return 'common/' + topicId
}

function normalize(raw: any[]): Exercise[] {
  return raw.map(function(r, idx) {
    return {
      id: r.id || 'q-' + idx + '-' + Date.now(),
      type: r.type || 'choice',
      difficulty: Math.max(1, Math.min(5, Number(r.difficulty) || 2)),
      // 🔴 关键：把 Markdown 文本统一解析成 HTML
      stem: parseMD(r.stem || ''),
      image: r.image || undefined,
      options: Array.isArray(r.options) ? r.options.map(function(opt: string) { return parseInline(opt) }) : undefined,
      answer: String(r.answer !== undefined && r.answer !== null ? r.answer : ''),
      acceptableAnswers: r.acceptableAnswers || undefined,
      solution: Array.isArray(r.solution) ? r.solution.map(function(s: any) {
        return typeof s === 'string' ? { description: parseMD(s) } : { description: parseMD(s.description || '') }
      }) : [{ description: parseMD(String(r.solution !== undefined && r.solution !== null ? r.solution : '')) }],
      hints: Array.isArray(r.hints) ? r.hints.map(function(h: string) { return parseInline(h) }) : [],
      commonMistakes: Array.isArray(r.commonMistakes) ? r.commonMistakes.map(function(m: any) {
        return typeof m === 'string' ? { errorLayer: 'L2', description: parseInline(m) } : m
      }) : [],
      irtParams: {
        a: Number(r.irtParams && r.irtParams.a || r.IRT_a || 1),
        b: Number(r.irtParams && r.irtParams.b || r.IRT_b || 0),
        c: Number(r.irtParams && r.irtParams.c || r.IRT_c || 0.25)
      },
      estimatedTime: Number(r.estimatedTime) || 60,
      knowledgePoints: r.knowledgePoints || r.knowledgePoint || [],
      source: r.source,
      tags: r.tags || undefined
    } as Exercise
  })
}

function prettyTitle(topicId: string): string {
  const map: Record<string, string> = {
    // g1
    'g1-number-recognition': '数字认识',
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
    // g2
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
    // g3
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
    // common / 高级
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
  return map[topicId] || topicId.replace(/-/g, ' ')
}
