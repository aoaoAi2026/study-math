import type { RouteRecordRaw } from 'vue-router'

const diagnosisRoutes: RouteRecordRaw[] = [
  {
    path: '/diagnosis',
    name: 'diagnosis',
    component: () => import('@/features/diagnosis/DiagnosticTest.vue')
  }
]

export default diagnosisRoutes
