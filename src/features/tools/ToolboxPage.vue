<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()

interface ToolInfo {
  id: string
  name: string
  icon: string
  desc: string
  category: 'geometry' | 'algebra' | 'visual'
}

const tools: ToolInfo[] = [
  {
    id: 'segment-diagram',
    name: '线段图生成器',
    icon: '📊',
    desc: '可视化线段图，解决和差倍问题',
    category: 'visual'
  },
  {
    id: 'geoboard',
    name: '几何画板',
    icon: '📐',
    desc: '绘制几何图形，探索图形性质',
    category: 'geometry'
  },
  {
    id: 'coordinate',
    name: '坐标系工具',
    icon: '📈',
    desc: '直角坐标系，绘制函数图像',
    category: 'algebra'
  },
  {
    id: 'fraction-pie',
    name: '分数饼图',
    icon: '🥧',
    desc: '可视化分数，理解分数概念',
    category: 'visual'
  }
]

const categories = [
  { id: 'all', label: '全部' },
  { id: 'geometry', label: '几何' },
  { id: 'algebra', label: '代数' },
  { id: 'visual', label: '可视化' }
]

const selectedCategory = ref('all')

const filteredTools = computed(() => {
  if (selectedCategory.value === 'all') return tools
  return tools.filter(t => t.category === selectedCategory.value)
})

function useTool(id: string) {
  router.push('/tools/' + id)
}
</script>

<template>
  <AppLayout>
    <div class="toolbox-page">
      <header class="tb-header">
        <h1>🛠️ 教具工具箱</h1>
        <p class="muted">数学学习的好帮手</p>
      </header>

      <div class="category-tabs">
        <button
          v-for="c in categories"
          :key="c.id"
          class="category-tab"
          :class="{ active: selectedCategory === c.id }"
          @click="selectedCategory = c.id"
        >
          {{ c.label }}
        </button>
      </div>

      <div class="tools-grid">
        <div
          v-for="tool in filteredTools"
          :key="tool.id"
          class="tool-card"
          @click="useTool(tool.id)"
        >
          <div class="tool-icon">{{ tool.icon }}</div>
          <div class="tool-info">
            <h3 class="tool-name">{{ tool.name }}</h3>
            <p class="tool-desc">{{ tool.desc }}</p>
          </div>
          <button class="use-btn">使用</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.toolbox-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}

.tb-header {
  text-align: center;
  margin-bottom: 24px;
}
.tb-header h1 {
  font-size: 28px;
  color: #2C3E50;
  margin-bottom: 6px;
}
.muted {
  color: #9AA5B1;
  font-size: 14px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.category-tab {
  padding: 10px 20px;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  background: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.category-tab.active {
  background: #4F7DF8;
  border-color: #4F7DF8;
  color: white;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.tool-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border: 2px solid #E2E8F0;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.15s;
}
.tool-card:hover {
  border-color: #4F7DF8;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.tool-icon {
  font-size: 40px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  border-radius: 14px;
}
.tool-info {
  flex: 1;
}
.tool-name {
  font-size: 16px;
  color: #2C3E50;
  margin-bottom: 4px;
}
.tool-desc {
  font-size: 13px;
  color: #6B7785;
}
.use-btn {
  padding: 8px 16px;
  background: #4F7DF8;
  color: white;
  border-radius: 10px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  font-size: 13px;
}
</style>
