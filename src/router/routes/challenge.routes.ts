import type { RouteRecordRaw } from 'vue-router'

const challengeRoutes: RouteRecordRaw[] = [
  {
    path: '/challenge/daily',
    name: 'daily-challenge',
    component: () => import('@/features/challenge/DailyChallenge.vue')
  }
]

export default challengeRoutes
