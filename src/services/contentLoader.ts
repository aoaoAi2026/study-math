import { marked } from 'marked'
import type { CardBlock, KnowledgeTopic, TopicIndex } from '@/types/content'

const CARD_TYPES = ['story', 'concept', 'example', 'variant', 'mistake', 'parent-child'] as const

interface TopicMeta extends TopicIndex {
  icon: string
  description: string
  knowledgePoints: string[]
}

const TOPIC_INDEX: TopicMeta[] = [
  {
    id: 'g1-addition-within-20',
    title: '20 以内加减法',
    grade: 1,
    category: 'basic',
    difficulty: 1,
    path: 'addition-within-20',
    icon: '➕',
    summary: '掌握 20 以内数的加减法运算',
    description: '通过故事和游戏的方式，让孩子熟练掌握 20 以内的加减法。',
    knowledgePoints: ['进位加法', '退位减法', '数的分解与组合', '凑十法']
  },
  {
    id: 'g1-word-problem-1st',
    title: '一年级应用题入门',
    grade: 1,
    category: 'basic',
    difficulty: 2,
    path: 'word-problem-1st',
    icon: '📝',
    summary: '简单的加法与减法应用题',
    description: '学会把生活中的问题转化为加法或减法算式。',
    knowledgePoints: ['审题', '关键词识别', '加法应用题', '减法应用题']
  },
  {
    id: 'g3-sum-multiple',
    title: '和倍问题',
    grade: 3,
    category: 'olympiad',
    difficulty: 3,
    path: 'sum-multiple',
    icon: '🧮',
    summary: '已知两个数的和与倍数关系，求这两个数',
    description: '学习和倍问题的基本模型，画线段图找"一倍数"。',
    knowledgePoints: ['线段图', '一倍数', '和 ÷ (倍数 + 1) = 小数']
  },
  {
    id: 'g3-diff-multiple',
    title: '差倍问题',
    grade: 3,
    category: 'olympiad',
    difficulty: 3,
    path: 'diff-multiple',
    icon: '📏',
    summary: '已知两个数的差与倍数关系，求这两个数',
    description: '学习差倍问题的基本模型，熟练使用线段图分析。',
    knowledgePoints: ['线段图', '差 ÷ (倍数 - 1) = 小数']
  },
  {
    id: 'g3-sum-diff',
    title: '和差问题',
    grade: 3,
    category: 'olympiad',
    difficulty: 3,
    path: 'sum-diff',
    icon: '⚖️',
    summary: '已知两个数的和与差，求这两个数',
    description: '学习和差问题的基本公式及其应用。',
    knowledgePoints: ['大数 = (和 + 差) ÷ 2', '小数 = (和 - 差) ÷ 2']
  },
  {
    id: 'g3-plant-tree',
    title: '植树问题',
    grade: 3,
    category: 'olympiad',
    difficulty: 3,
    path: 'plant-tree',
    icon: '🌳',
    summary: '直线与环形上的植树问题',
    description: '理解棵数与间隔数之间的关系，掌握三种基本类型。',
    knowledgePoints: ['两端都栽', '一端栽一端不栽', '两端都不栽', '环形植树']
  },
  {
    id: 'g3-chicken-rabbit',
    title: '鸡兔同笼',
    grade: 3,
    category: 'olympiad',
    difficulty: 4,
    path: 'chicken-rabbit',
    icon: '🐔',
    summary: '经典的鸡兔同笼问题与多种解法',
    description: '学习假设法、方程法、画图法解决鸡兔同笼问题。',
    knowledgePoints: ['假设法', '抬腿法', '方程法', '列表尝试']
  },
  {
    id: 'g4-age-problem',
    title: '年龄问题',
    grade: 4,
    category: 'olympiad',
    difficulty: 4,
    path: 'age-problem',
    icon: '🎂',
    summary: '抓住年龄差不变的关键',
    description: '通过年龄差不变的性质，结合和差倍模型解决问题。',
    knowledgePoints: ['年龄差不变', '和倍结合', '差倍结合']
  },
  {
    id: 'g4-area-perimeter',
    title: '面积与周长',
    grade: 4,
    category: 'basic',
    difficulty: 2,
    path: 'area-perimeter',
    icon: '📐',
    summary: '长方形和正方形的面积与周长',
    description: '理解面积与周长的区别，熟练运用公式进行计算。',
    knowledgePoints: ['长方形周长', '长方形面积', '正方形周长与面积', '平移法']
  },
  {
    id: 'g5-profit-loss',
    title: '利润与亏损',
    grade: 5,
    category: 'olympiad',
    difficulty: 4,
    path: 'profit-loss',
    icon: '💰',
    summary: '成本、售价、利润、折扣的关系',
    description: '理解利润问题中的基本概念与常见模型。',
    knowledgePoints: ['利润 = 售价 - 成本', '利润率', '折扣', '成本价还原']
  },
  {
    id: 'g5-simple-equation',
    title: '简易方程',
    grade: 5,
    category: 'basic',
    difficulty: 3,
    path: 'simple-equation',
    icon: '🔤',
    summary: '一元一次方程的解法与应用',
    description: '掌握移项、合并同类项，能用方程解应用题。',
    knowledgePoints: ['设未知数', '列方程', '移项', '检验']
  },
  {
    id: 'g5-fraction-split',
    title: '分数的拆分',
    grade: 5,
    category: 'olympiad',
    difficulty: 4,
    path: 'fraction-split',
    icon: '🧩',
    summary: '分数单位分拆与裂项技巧',
    description: '学习分数拆分的基本方法，包括单位分数拆分。',
    knowledgePoints: ['单位分数', '1/n = 1/(n+1) + 1/(n(n+1))', '裂项相消']
  },
  {
    id: 'g5-fraction-add',
    title: '分数加减法',
    grade: 5,
    category: 'basic',
    difficulty: 2,
    path: 'fraction-add',
    icon: '➗',
    summary: '同分母与异分母分数的加减',
    description: '掌握通分、约分，熟练进行分数加减运算。',
    knowledgePoints: ['通分', '约分', '同分母加减', '异分母加减']
  },
  {
    id: 'g5-number-theory',
    title: '数论初步',
    grade: 5,
    category: 'olympiad',
    difficulty: 5,
    path: 'number-theory',
    icon: '🔢',
    summary: '整除、质数、合数与奇偶性',
    description: '学习数论基础概念与常见整除特征。',
    knowledgePoints: ['整除特征', '质数与合数', '奇偶性', '分解质因数']
  },
  {
    id: 'g5-geometry-model',
    title: '几何模型',
    grade: 5,
    category: 'olympiad',
    difficulty: 4,
    path: 'geometry-model',
    icon: '🔺',
    summary: '等积变换、一半模型与蝴蝶模型',
    description: '了解常见几何模型，灵活解决面积问题。',
    knowledgePoints: ['等积变换', '一半模型', '蝴蝶模型', '梯形模型']
  },
  {
    id: 'g6-motion',
    title: '行程问题',
    grade: 6,
    category: 'olympiad',
    difficulty: 5,
    path: 'motion',
    icon: '🚗',
    summary: '相遇与追及的基本模型',
    description: '掌握"路程 = 速度 × 时间"及相遇、追及模型。',
    knowledgePoints: ['相遇问题', '追及问题', '相遇路程', '追及路程']
  },
  {
    id: 'g6-circle',
    title: '圆的周长与面积',
    grade: 6,
    category: 'basic',
    difficulty: 3,
    path: 'circle',
    icon: '⭕',
    summary: '圆的认识、周长与面积计算',
    description: '掌握圆的基本性质，计算圆的周长和面积。',
    knowledgePoints: ['圆的认识', '圆的周长 C = 2πr', '圆的面积 S = πr²', '扇形']
  }
]

function parseCustomBlocks(markdown: string): { content: string; cards: CardBlock[] } {
  const cards: CardBlock[] = []
  let content = markdown

  CARD_TYPES.forEach(type => {
    const regex = new RegExp(`:::${type}-card\\b([\\s\\S]*?):::`, 'g')
    content = content.replace(regex, (_, inner) => {
      const titleMatch = inner.match(/###\s+(.+)/)
      const title = titleMatch ? titleMatch[1].trim() : ''
      const bodyContent = inner
        .replace(/###\s+.+\n?/, '')
        .replace(/:::[\w-]*\n?/g, '')
        .trim()

      if (type === 'variant') {
        const variantIndex = cards.filter(c => c.type === 'variant').length + 1
        cards.push({ type, title, content: bodyContent, variantIndex })
      } else {
        cards.push({ type, title, content: bodyContent })
      }

      return ''
    })
  })

  return { content: content.trim(), cards }
}

function renderMarkdown(text: string): string {
  const renderer = new marked.Renderer()

  renderer.heading = (token: any) => {
    const text = typeof token === 'string' ? token : token.text || ''
    const depth = typeof token === 'object' && token.depth ? token.depth : 2
    const id = String(text).toLowerCase().replace(/\s+/g, '-')
    return `<h${depth} id="${id}">${text}</h${depth}>`
  }

  renderer.paragraph = (token: any) => `<p>${token.text || token}</p>`
  renderer.list = (token: any) => {
    const tag = token.ordered ? 'ol' : 'ul'
    const items = (token.items || []).map((item: any) => `<li>${item.text || item}</li>`).join('')
    return `<${tag}>${items}</${tag}>`
  }

  marked.setOptions({ renderer } as any)
  return marked.parse(text) as string
}

export interface ParsedContent {
  raw: string
  html: string
  cards: CardBlock[]
  title?: string
  summary?: string
  prerequisites?: string[]
}

export function parseTopicMarkdown(markdown: string): ParsedContent {
  const { content, cards } = parseCustomBlocks(markdown)

  const titleMatch = content.match(/^#\s+(.+)/m)
  const title = titleMatch ? titleMatch[1].trim() : undefined

  const summaryMatch = content.match(/##\s+[\u4e00-\u9fa5]+\n+([\s\S]+?)(?=##|$)/)
  const summary = summaryMatch ? summaryMatch[1].trim() : undefined

  const prerequisitesMatch = content.match(/- [^\n]+/g)
  const prerequisites = prerequisitesMatch?.map(p => p.replace(/^-\s+/, '').trim())

  return {
    raw: content,
    html: renderMarkdown(content),
    cards,
    title,
    summary,
    prerequisites
  }
}

export async function loadTopicContent(path: string): Promise<ParsedContent> {
  const url = `/content/${path}.md`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load content: ${path}`)
  }

  const markdown = await response.text()
  return parseTopicMarkdown(markdown)
}

export function getCardComponent(type: string): string {
  const map: Record<string, string> = {
    story: 'StoryCard',
    concept: 'ConceptCard',
    example: 'ExampleCard',
    variant: 'VariantCard',
    mistake: 'MistakeCard',
    'parent-child': 'ParentChildCard'
  }
  return map[type] || 'div'
}

export function listTopics(): TopicIndex[] {
  return TOPIC_INDEX.map(meta => ({
    id: meta.id,
    title: meta.title,
    grade: meta.grade,
    category: meta.category,
    difficulty: meta.difficulty,
    summary: meta.summary,
    path: meta.path
  }))
}

export async function loadTopic(id: string): Promise<KnowledgeTopic | null> {
  const meta = TOPIC_INDEX.find(t => t.id === id)
  if (!meta) return null

  try {
    const parsed = await loadTopicContent(meta.path)
    return {
      id: meta.id,
      title: meta.title,
      grade: meta.grade,
      category: meta.category,
      difficulty: meta.difficulty,
      summary: parsed.summary || meta.summary,
      prerequisites: parsed.prerequisites || [],
      cards: parsed.cards,
      exercises: []
    }
  } catch (err) {
    console.error(`[contentLoader] Failed to load topic "${id}":`, err)
    return null
  }
}

export function getTopicByGrade(grade: 1 | 2 | 3 | 4 | 5 | 6): TopicIndex[] {
  return listTopics().filter(t => t.grade === grade)
}

export function getTopicByCategory(category: 'basic' | 'olympiad'): TopicIndex[] {
  return listTopics().filter(t => t.category === category)
}
