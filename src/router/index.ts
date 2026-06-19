import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/features/home/HomePage.vue')
  },
  {
    path: '/map',
    name: 'knowledge-map',
    component: () => import('@/features/knowledge-map/KnowledgeMap.vue')
  },
  {
    path: '/learning',
    name: 'learning',
    component: () => import('@/features/learning/LearningPage.vue')
  },
  {
    path: '/learning/:id',
    name: 'topic',
    component: () => import('@/features/learning/TopicDetail.vue')
  },
  {
    path: '/games',
    name: 'games',
    component: () => import('@/features/game-center/GameLobby.vue')
  },
  {
    path: '/games/:id',
    name: 'game',
    component: () => import('@/features/game-center/GamePage.vue')
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@/features/tools/ToolboxPage.vue')
  },
  {
    path: '/tools/:id',
    name: 'tool',
    component: () => import('@/features/tools/ToolPage.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/features/profile/ProfilePage.vue')
  },
  {
    path: '/profile/achievements',
    name: 'achievements',
    component: () => import('@/features/profile/AchievementWall.vue')
  },
  {
    path: '/profile/pet',
    name: 'pet',
    component: () => import('@/features/profile/PetCompanion.vue')
  },
  {
    path: '/profile/wrong-book',
    name: 'wrong-book',
    component: () => import('@/features/profile/WrongBookPage.vue')
  },
  {
    path: '/diagnosis',
    name: 'diagnosis',
    component: () => import('@/features/diagnosis/DiagnosticTest.vue')
  },
  {
    path: '/challenge/daily',
    name: 'daily-challenge',
    component: () => import('@/features/challenge/DailyChallenge.vue')
  },
  {
    path: '/workshop',
    name: 'workshop',
    component: () => import('@/features/workshop/WorkshopHome.vue')
  },
  {
    path: '/newspaper',
    name: 'newspaper',
    component: () => import('@/features/newspaper/NewspaperGenerator.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
