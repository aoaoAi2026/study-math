import type { RouteRecordRaw } from 'vue-router'

const toolsRoutes: RouteRecordRaw[] = [
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@/features/tools/ToolboxPage.vue')
  }
]

export default toolsRoutes
