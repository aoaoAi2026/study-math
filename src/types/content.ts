export interface CardBlock {
  type: 'story' | 'concept' | 'example' | 'variant' | 'mistake' | 'parent-child'
  title: string
  content: string
  variantIndex?: number
}

export interface KnowledgeTopic {
  id: string
  title: string
  grade: 1 | 2 | 3 | 4 | 5 | 6
  category: 'basic' | 'olympiad'
  difficulty: 1 | 2 | 3 | 4 | 5
  summary: string
  prerequisites: string[]
  cards: CardBlock[]
  exercises: string[]
}

export interface TopicIndex {
  id: string
  title: string
  grade: 1 | 2 | 3 | 4 | 5 | 6
  category: 'basic' | 'olympiad'
  difficulty: 1 | 2 | 3 | 4 | 5
  summary: string
  icon: string
  path: string
}
