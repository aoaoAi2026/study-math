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
  },
  {
    path: '/parent-academy',
    name: 'parent-academy',
    component: () => import('@/features/parent-academy/AcademyHome.vue')
  },
  {
    path: '/parent-dashboard',
    name: 'parent-dashboard',
    component: () => import('@/features/admin/ParentCoachingDashboard.vue')
  },
  {
    path: '/profile/timeline',
    name: 'timeline',
    component: () => import('@/features/profile/Timeline.vue')
  },
  {
    path: '/profile/report',
    name: 'report',
    component: () => import('@/features/profile/ReportPage.vue')
  },
  {
    path: '/profile/theme',
    name: 'theme-settings',
    component: () => import('@/features/profile/ThemeSettings.vue')
  },
  {
    path: '/diagnosis/result',
    name: 'diagnosis-result',
    component: () => import('@/features/diagnosis/ResultReport.vue')
  },
  {
    path: '/learning-path',
    name: 'learning-path',
    component: () => import('@/features/learning/LearningPath.vue')
  },
  {
    path: '/quiz/:topicId',
    name: 'quiz',
    component: () => import('@/features/learning/QuizPage.vue')
  },
  {
    path: '/pre-assessment/:topicId',
    name: 'pre-assessment',
    component: () => import('@/features/learning/PreAssessment.vue')
  },
  {
    path: '/post-test/:topicId',
    name: 'post-test',
    component: () => import('@/features/learning/PostTest.vue')
  },
  {
    path: '/learning/topic/:topicId',
    name: 'topic-detail',
    component: () => import('@/features/learning/TopicDetail.vue')
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
