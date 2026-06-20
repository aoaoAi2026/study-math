import { marked } from 'marked'
import type { CardBlock, KnowledgeTopic, TopicIndex } from '@/types/content'

const CARD_TYPES = ['story', 'concept', 'example', 'variant', 'mistake', 'parent-child'] as const

interface TopicMeta extends TopicIndex {
  icon: string
  description: string
  knowledgePoints: string[]
}

/**
 * TOPIC_INDEX 中的 path 必须与 public/content/ 目录下的文件名一致（不含 .md）
 * 每个 topic 的 id 会同时用于路由、题库知识点匹配等
 */
const TOPIC_INDEX: TopicMeta[] = [
  // ———— 一年级 ————
  {
    id: 'g1-addition-within-20',
    title: '20 以内加减法',
    grade: 1,
    category: 'basic',
    difficulty: 1,
    path: 'addition-within-20',
    icon: '➕',
    summary: '用"凑十法"掌握 20 以内的进退位加减法',
    description: '通过故事和游戏的方式，让孩子熟练掌握 20 以内的加减法。',
    knowledgePoints: ['g1-addition-within-20']
  },
  {
    id: 'g1-word-problem-1st',
    title: '一年级应用题入门',
    grade: 1,
    category: 'basic',
    difficulty: 2,
    path: 'word-problem-1st',
    icon: '📝',
    summary: '把生活中的问题转化为加法或减法算式',
    description: '学会读题、识别关键词，列出正确的算式。',
    knowledgePoints: ['g1-word-problem-1st']
  },
  {
    id: 'g1-counting-game',
    title: '趣味数数',
    grade: 1,
    category: 'basic',
    difficulty: 1,
    path: 'counting-game',
    icon: '🎲',
    summary: '有趣的数数与计数游戏',
    description: '通过游戏培养数感和有序思维。',
    knowledgePoints: ['g1-counting-game']
  },
  // ———— 二年级 ————
  {
    id: 'g2-multiplication-table',
    title: '乘法口诀',
    grade: 2,
    category: 'basic',
    difficulty: 1,
    path: 'multiplication-table',
    icon: '✖️',
    summary: '1-9 乘法口诀表与应用',
    description: '有趣地背诵并理解乘法口诀，为后续学习打基础。',
    knowledgePoints: ['g2-multiplication-table']
  },
  // ———— 三年级奥数 ————
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
    knowledgePoints: ['g3-sum-multiple']
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
    knowledgePoints: ['g3-diff-multiple']
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
    knowledgePoints: ['g3-sum-diff']
  },
  {
    id: 'g3-planting-trees',
    title: '植树问题',
    grade: 3,
    category: 'olympiad',
    difficulty: 3,
    path: 'planting-trees',
    icon: '🌳',
    summary: '直线与环形上的植树问题',
    description: '理解棵数与间隔数之间的关系，掌握三种基本类型。',
    knowledgePoints: ['g3-planting-trees']
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
    knowledgePoints: ['g3-chicken-rabbit']
  },
  // ———— 四年级 ————
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
    knowledgePoints: ['g4-age-problem']
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
    knowledgePoints: ['g4-area-perimeter']
  },
  // ———— 五年级 ————
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
    knowledgePoints: ['g5-profit-loss']
  },
  {
    id: 'g5-simple-equation',
    title: '简易方程',
    grade: 5,
    category: 'basic',
    difficulty: 3,
    path: 'equation-intro',
    icon: '🔤',
    summary: '一元一次方程的解法与应用',
    description: '掌握移项、合并同类项，能用方程解应用题。',
    knowledgePoints: ['g5-simple-equation']
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
    knowledgePoints: ['g5-fraction-split']
  },
  {
    id: 'g5-fraction-add-sub',
    title: '分数加减法',
    grade: 5,
    category: 'basic',
    difficulty: 2,
    path: 'fraction-add-sub',
    icon: '➗',
    summary: '同分母与异分母分数的加减',
    description: '掌握通分、约分，熟练进行分数加减运算。',
    knowledgePoints: ['g5-fraction-add-sub']
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
    knowledgePoints: ['g5-number-theory']
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
    knowledgePoints: ['g5-geometry-model']
  },
  // ———— 六年级 ————
  {
    id: 'g6-travel-problem',
    title: '行程问题',
    grade: 6,
    category: 'olympiad',
    difficulty: 5,
    path: 'travel-problem',
    icon: '🚗',
    summary: '相遇、追及与综合行程问题',
    description: '掌握"路程=速度×时间"及相遇、追及模型。',
    knowledgePoints: ['g6-travel-problem']
  },
  {
    id: 'g6-circle-area',
    title: '圆的周长与面积',
    grade: 6,
    category: 'basic',
    difficulty: 3,
    path: 'circle-area',
    icon: '⭕',
    summary: '圆的认识、周长与面积计算',
    description: '掌握圆的基本性质，计算圆的周长和面积。',
    knowledgePoints: ['g6-circle-area']
  }
]

function parseCustomBlocks(markdown: string): { content: string; cards: CardBlock[] } {
  const cards: CardBlock[] = []
  let content = markdown

  CARD_TYPES.forEach(type => {
    const regex = new RegExp(`:::${type}-card\\b([\\s\\S]*?):::`, 'g')
    content = content.replace(regex, (_, inner) => {
      const titleMatch = inner.match(/###\\s+(.+)/)
      const title = titleMatch ? titleMatch[1].trim() : ''
      const bodyContent = inner
        .replace(/###\\s+.+\\n?/, '')
        .replace(/:::[\\w-]*\\n?/g, '')
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
    const textContent = typeof token === 'string' ? token : token.text || ''
    const depth = typeof token === 'object' && token.depth ? token.depth : 2
    const id = String(textContent).toLowerCase().replace(/\\s+/g, '-')
    return `<h${depth} id="${id}">${textContent}</h${depth}>`
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

  const titleMatch = content.match(/^#\\s+(.+)/m)
  const title = titleMatch ? titleMatch[1].trim() : undefined

  const summaryMatch = content.match(/##\\s+[\\u4e00-\\u9fa5]+\\n+([\\s\\S]+?)(?=##|$)/)
  const summary = summaryMatch ? summaryMatch[1].trim() : undefined

  const prerequisitesMatch = content.match(/- [^\\n]+/g)
  const prerequisites = prerequisitesMatch?.map(p => p.replace(/^-\\s+/, '').trim())

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

/**
 * 返回所有专题列表（给 LearningPage / LearningPath 使用）
 */
export function listTopics(): TopicIndex[] {
  return TOPIC_INDEX.map(meta => ({
    id: meta.id,
    title: meta.title,
    grade: meta.grade,
    category: meta.category,
    difficulty: meta.difficulty,
    summary: meta.summary,
    icon: meta.icon,
    path: meta.path
  }))
}

/**
 * 根据年级筛选专题
 */
export function getTopicByGrade(grade: 1 | 2 | 3 | 4 | 5 | 6): TopicIndex[] {
  return listTopics().filter(t => t.grade === grade)
}

/**
 * 根据分类筛选专题
 */
export function getTopicByCategory(category: 'basic' | 'olympiad'): TopicIndex[] {
  return listTopics().filter(t => t.category === category)
}

/**
 * 加载某个专题的完整数据（元信息 + 卡片内容）
 */
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
      exercises: meta.knowledgePoints
    }
  } catch (err) {
    console.error(`[contentLoader] Failed to load topic "${id}":`, err)
    return null
  }
}
