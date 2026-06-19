import type { RouteRecordRaw } from 'vue-router'

const learningRoutes: RouteRecordRaw[] = [
  {
    path: '/learning',
    name: 'learning',
    component: () => import('@/features/learning/LearningPage.vue')
  },
  {
    path: '/learning/:id',
    name: 'topic',
    component: () => import('@/features/learning/TopicDetail.vue')
  }
]

export default learningRoutes
