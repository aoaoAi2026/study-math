export interface PetDiaryEntry {
  date: number
  content: string
  mood: string
}

export interface PetSkill {
  id: string
  name: string
  description: string
  unlocked: boolean
  unlockCondition?: string
}

export interface PetAccessory {
  id: string
  name: string
  price: number
  owned: boolean
}

export interface PetEvolution {
  stage: 'egg' | 'baby' | 'teen' | 'adult' | 'master'
  expRequired: number
  rewards: string[]
}

export const PET_EVOLUTION_TABLE: PetEvolution[] = [
  { stage: 'egg', expRequired: 0, rewards: [] },
  { stage: 'baby', expRequired: 100, rewards: ['basic-questions'] },
  { stage: 'teen', expRequired: 500, rewards: ['hints-free'] },
  { stage: 'adult', expRequired: 2000, rewards: ['double-exp'] },
  { stage: 'master', expRequired: 5000, rewards: ['special-skin'] }
]
