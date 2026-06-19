<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import SegmentDiagram from './tools/SegmentDiagram.vue'
import GeoBoard from './tools/GeoBoard.vue'

const route = useRoute()
const toolId = computed(() => route.params.id as string)

const CoordinateSystem = defineAsyncComponent(() =>
  import('./tools/CoordinateSystem.vue')
)
const FractionPie = defineAsyncComponent(() =>
  import('./tools/FractionPie.vue')
)

const toolComponents: Record<string, any> = {
  'segment-diagram': SegmentDiagram,
  'geoboard': GeoBoard,
  'coordinate': CoordinateSystem,
  'fraction-pie': FractionPie
}

const currentTool = computed(() => toolComponents[toolId.value])

const toolInfo = computed(() => {
  const infos: Record<string, { name: string; icon: string }> = {
    'segment-diagram': { name: '线段图生成器', icon: '📊' },
    'geoboard': { name: '几何画板', icon: '📐' },
    'coordinate': { name: '坐标系工具', icon: '📈' },
    'fraction-pie': { name: '分数饼图', icon: '🥧' }
  }
  return infos[toolId.value] || { name: '教具', icon: '🛠️' }
})
</script>

<template>
  <AppLayout>
    <div class="tool-page">
      <component :is="currentTool" v-if="currentTool" />
      <div v-else class="tool-placeholder">
        <div class="placeholder-icon">{{ toolInfo.icon }}</div>
        <h2>{{ toolInfo.name }}</h2>
        <p>教具开发中，敬请期待...</p>
        <button class="back-btn" @click="$router.push('/tools')">返回工具箱</button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.tool-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
}
.tool-placeholder {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
}
.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
.tool-placeholder h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.tool-placeholder p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.back-btn {
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  font-weight: 500;
}
</style>
