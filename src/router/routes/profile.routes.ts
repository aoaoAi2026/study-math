import type { RouteRecordRaw } from 'vue-router'

const profileRoutes: RouteRecordRaw[] = [
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
  }
]

export default profileRoutes
