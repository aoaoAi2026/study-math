import type { RouteRecordRaw } from 'vue-router'

const gamesRoutes: RouteRecordRaw[] = [
  {
    path: '/games',
    name: 'games',
    component: () => import('@/features/game-center/GameLobby.vue')
  },
  {
    path: '/games/:id',
    name: 'game',
    component: () => import('@/features/game-center/GamePage.vue')
  }
]

export default gamesRoutes
