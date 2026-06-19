import { marked } from 'marked'
import type { CardBlock, KnowledgeTopic, TopicIndex } from '@/types/content'

const CARD_TYPES = ['story', 'concept', 'example', 'variant', 'mistake', 'parent-child'] as const

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

  const summaryMatch = content.match(/##\s+[\u4e00-\u9fa5]+\\?\n+([\s\S]+?)(?=##|$)/)
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

// Stub exports for compatibility
export function loadTopic(id: string): Promise<KnowledgeTopic | null> {
  return Promise.resolve(null)
}

export function listTopics(): TopicIndex[] {
  return []
}
