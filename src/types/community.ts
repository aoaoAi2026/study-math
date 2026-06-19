export interface HelpRequest {
  id: string
  exerciseId: string
  userId: string
  scratchImage?: string
  description: string
  answers: HelpAnswer[]
  resolved: boolean
  createdAt: number
}

export interface HelpAnswer {
  id: string
  userId: string
  content: string
  imageUrl?: string
  isAccepted: boolean
  createdAt: number
}

export interface LearningCircle {
  id: string
  name: string
  members: string[]
  ownerId: string
  createdAt: number
}

export interface FamilyGroup {
  id: string
  name: string
  members: FamilyMember[]
  createdAt: number
}

export interface FamilyMember {
  id: string
  nickname: string
  role: 'parent' | 'child' | 'teacher'
  avatar?: string
}
