<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <AppLayout>
    <div class="tools-page">
    <header class="t-head">
      <h1>🧰 教具工具箱</h1>
      <p class="muted">动手操作，可视化理解数学概念</p>
    </header>
    <div class="tool-grid">
      <div class="tool-card" @click="router.push('/tools/segment')">
        <div class="t-emoji">📏</div>
        <h3>线段图生成器</h3>
        <p>把"和差倍"等应用题变成直观的线段可视化。</p>
        <button class="btn btn-primary small">打开</button>
      </div>
      <div class="tool-card" @click="router.push('/tools/geo-board')">
        <div class="t-emoji">🎨</div>
        <h3>几何画板</h3>
        <p>画一画，拼一拼，周长和面积不再抽象。</p>
        <button class="btn btn-primary small">打开</button>
      </div>
      <div class="tool-card coming">
        <div class="t-emoji">📐</div>
        <h3>坐标系工具</h3>
        <p>探索数轴与图形平移。</p>
        <button class="btn btn-outline small" disabled>敬请期待</button>
      </div>
      <div class="tool-card coming">
        <div class="t-emoji">🍕</div>
        <h3>分数直观工具</h3>
        <p>把披萨分成几份，理解分数的本质。</p>
        <button class="btn btn-outline small" disabled>敬请期待</button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.tools-page { max-width: 1000px; margin: 0 auto; padding: 16px; }
.t-head { text-align: center; margin-bottom: 24px; }
.t-head h1 { font-size: 26px; color: #2C3E50; }
.muted { color: #9AA5B1; font-size: 14px; }
.tool-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
.tool-card { background: #fff; border-radius: 18px; padding: 28px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,.05); transition: all .2s; }
.tool-card:hover:not(.coming) { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(79,125,248,.15); cursor: pointer; }
.t-emoji { font-size: 56px; margin-bottom: 8px; }
.tool-card h3 { font-size: 18px; color: #2C3E50; margin-bottom: 6px; }
.tool-card p { color: #6B7785; font-size: 13px; margin-bottom: 14px; }
.btn.small { padding: 8px 16px; font-size: 13px; }
.tool-card.coming { opacity: .7; }
@media (max-width: 700px) { .tool-grid { grid-template-columns: 1fr; } }
</style>
