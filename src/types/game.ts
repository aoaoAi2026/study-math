export interface GameConfig {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 1 | 2 | 3 | 4 | 5
  skills: string[]
  knowledgePoints: string[]
}

export interface GameScore {
  gameId: string
  score: number
  bestScore: number
  playCount: number
  lastPlayTime: number
}

export interface GameSession {
  id: string
  gameId: string
  startTime: number
  endTime?: number
  score: number
  config: Record<string, unknown>
}

export type GameState = 'menu' | 'playing' | 'paused' | 'finished'

export interface AnimationFrame {
  timestamp: number
  position: { x: number; y: number }
  rotation?: number
  scale?: number
}
